import { convertFileSrc } from "@tauri-apps/api/core";
import { resolveResource } from "@tauri-apps/api/path";
import { platform } from "@tauri-apps/plugin-os";
import { getDefaultStore } from "jotai";
import { commands } from "@/bindings/generated";
import { soundCollectionAtom, soundVolumeAtom } from "@/state/atoms";

const POOL_SIZE = 5;
const audioPool = Array.from({ length: POOL_SIZE }, () => new Audio());
let poolIndex = 0;

let soundServerPort: number | null = null;
const soundUrlCache = new Map<string, string>();

function isLinux(): boolean {
    try {
        return platform() === "linux";
    } catch {
        return false;
    }
}

let lastTime = 0;

async function getSoundServerPort(): Promise<number> {
    if (soundServerPort !== null) {
        return soundServerPort;
    }
    const result = await commands.getSoundServerPort();
    if (result.status === "ok") {
        soundServerPort = result.data;
        return soundServerPort;
    }
    throw new Error("Failed to get sound server port");
}

export function playSound(capture: boolean, check: boolean) {
    // only play at most 1 sound every 75ms
    const now = Date.now();
    if (now - lastTime < 75) {
        return;
    }
    lastTime = now;

    const store = getDefaultStore();
    const collection = store.get(soundCollectionAtom);
    const volume = store.get(soundVolumeAtom);

    let type = "Move";
    if (capture) {
        type = "Capture";
    }
    if (collection !== "standard" && check) {
        type = "Check";
    }

    const cacheKey = `${collection}/${type}`;

    const playWithUrl = (url: string) => {
        const player = audioPool[poolIndex];
        poolIndex = (poolIndex + 1) % POOL_SIZE;

        player.src = url;
        player.volume = volume;
        const res = player.play();
        if (res && typeof res.catch === "function") {
            res.catch((e) => console.error("Audio playback error:", e));
        }
    };

    if (isLinux()) {
        getSoundServerPort()
            .then((port) => {
                const url = `http://127.0.0.1:${port}/${collection}/${type}.mp3`;
                playWithUrl(url);
            })
            .catch(() => {
                const webUrl = `/sound/${collection}/${type}.mp3`;
                playWithUrl(webUrl);
            });
    } else {
        const path = `sound/${collection}/${type}.mp3`;

        if (soundUrlCache.has(cacheKey)) {
            playWithUrl(soundUrlCache.get(cacheKey)!);
            return;
        }
        resolveResource(path)
            .then((filePath) => {
                const assetUrl = convertFileSrc(filePath);
                soundUrlCache.set(cacheKey, assetUrl);

                playWithUrl(assetUrl);
            })
            .catch(() => {
                // Web/Browser fallback
                const webUrl = `/sound/${collection}/${type}.mp3`;
                playWithUrl(webUrl);
            });
    }
}

// Custom Anime Sound Synthesis via Web Audio API (zero external deps)
let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!audioCtx) {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

export function playAnimeSfx(type: "brilliant" | "blunder" | "promotion" | "cutin" | "checkmate") {
    const ctx = getAudioContext();
    if (!ctx) return;
    const store = getDefaultStore();
    const volume = store.get(soundVolumeAtom);
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, now);
    masterGain.connect(ctx.destination);

    if (type === "cutin" || type === "brilliant") {
        const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, now + i * 0.04);
            gain.gain.setValueAtTime(0.3, now + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.6);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 0.6);
        });
    } else if (type === "blunder") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === "promotion") {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(f, now + idx * 0.08);
            gain.gain.setValueAtTime(0.35, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.7);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.7);
        });
    } else if (type === "checkmate") {
        [261.63, 329.63, 392.0, 523.25].forEach((f) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 1.2);
        });
    }
}
