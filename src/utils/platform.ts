export function isTauri(): boolean {
    return (
        typeof window !== "undefined" &&
        Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__)
    );
}

export function safePlatform(): "macos" | "windows" | "linux" | "unknown" {
    if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes("mac")) return "macos";
        if (ua.includes("win")) return "windows";
        if (ua.includes("linux")) return "linux";
    }
    return "windows";
}

export const isMacOS = safePlatform() === "macos";
export const isWindows = safePlatform() === "windows";
export const isLinux = safePlatform() === "linux";
