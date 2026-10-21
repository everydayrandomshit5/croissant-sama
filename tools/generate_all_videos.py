import os
import subprocess
import sys
import time
import re

GROK_BIN = r"D:\grokworks\.grok\bin\grok.exe"
GROK_HOME = r"D:\grokworks\.grok"
BASE_DIR = r"D:\antigravity\crossaint_Sama\croissant-sama"
FULL_DIR = os.path.join(BASE_DIR, "public", "assets", "chesssama", "full")
ANIM_DIR = os.path.join(BASE_DIR, "public", "assets", "chesssama", "animations")
CHARDATA_PATH = os.path.join(BASE_DIR, "src", "components", "chesssama", "characterData.ts")

CHARACTERS = [
    {"id": "white_queen", "name": "Seraphine"},
    {"id": "white_king", "name": "Aurelian"},
    {"id": "white_bishop", "name": "Lady Lumina"},
    {"id": "white_knight", "name": "Dame Freya"},
    {"id": "white_rook", "name": "Lady Eleanor"},
    {"id": "white_pawn", "name": "Dawn Squire"},
    {"id": "black_queen", "name": "Lilith"},
    {"id": "black_king", "name": "Malakor"},
    {"id": "black_bishop", "name": "Vespera"},
    {"id": "black_knight", "name": "Morwenna"},
    {"id": "black_rook", "name": "Carmilla"},
    {"id": "black_pawn", "name": "Dusk Squire"},
]

def sync_character_data():
    """Scans public/assets/chesssama/animations and updates characterData.ts with all available videos, preserving originals."""
    if not os.path.exists(CHARDATA_PATH):
        return

    with open(CHARDATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    for char in CHARACTERS:
        cid = char["id"]
        vids = []

        # 1. Check Original existing animation (e.g. black_queen.mp4)
        legacy_file = os.path.join(ANIM_DIR, f"{cid}.mp4")
        if os.path.exists(legacy_file) and os.path.getsize(legacy_file) > 100_000:
            vids.append(('Original Motion (Live2D)', f'/assets/chesssama/animations/{cid}.mp4', 'idle'))

        # 2. Check New Spicy Idle
        idle_file = os.path.join(ANIM_DIR, f"{cid}_idle.mp4")
        if os.path.exists(idle_file) and os.path.getsize(idle_file) > 100_000:
            vids.append(('Spicy Idle Motion', f'/assets/chesssama/animations/{cid}_idle.mp4', 'idle'))

        # 3. Check Spicy Action
        action_file = os.path.join(ANIM_DIR, f"{cid}_action.mp4")
        if os.path.exists(action_file) and os.path.getsize(action_file) > 100_000:
            vids.append(('Spicy Combat Strike', f'/assets/chesssama/animations/{cid}_action.mp4', 'action'))

        # 4. Check Spicy Special/Climax
        special_file = os.path.join(ANIM_DIR, f"{cid}_special.mp4")
        if os.path.exists(special_file) and os.path.getsize(special_file) > 100_000:
            vids.append(('Spicy Climax / Victory', f'/assets/chesssama/animations/{cid}_special.mp4', 'special'))

        if not vids:
            continue

        # Build videos TS array representation
        vids_ts = "    videos: [\n"
        for title, src, vtype in vids:
            vids_ts += f'      {{\n        title: "{title}",\n        src: "{src}",\n        type: "{vtype}",\n      }},\n'
        vids_ts += "    ],"

        # Regex match character block by id: "cid"
        pattern = re.compile(rf'(id:\s*"{cid}",[\s\S]*?)(videos:\s*\[[\s\S]*?\],)?(\s*}},)', re.MULTILINE)
        m = pattern.search(content)
        if m:
            prefix = m.group(1)
            prefix_clean = re.sub(r'videos:\s*\[[\s\S]*?\],?\n?', '', prefix).rstrip()
            suffix = m.group(3)
            if 'animationVideo:' not in prefix_clean:
                prefix_clean += f'\n    animationVideo: "{vids[0][1]}",'
            new_block = f"{prefix_clean}\n{vids_ts}{suffix}"
            content = content[:m.start()] + new_block + content[m.end():]

    with open(CHARDATA_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("[SYNC] Synchronized characterData.ts with all animations (originals preserved).")

def generate_video(char_id: str, mode: str, prompt: str = "mode -- spicy"):
    source_img = os.path.join(FULL_DIR, f"{char_id}_{mode}.png")
    target_mp4 = os.path.join(ANIM_DIR, f"{char_id}_{mode}.mp4")

    if not os.path.exists(source_img):
        print(f"[SKIP] Source image does not exist: {source_img}")
        return False

    if os.path.exists(target_mp4) and os.path.getsize(target_mp4) > 100_000:
        print(f"[EXISTS] {target_mp4} ({os.path.getsize(target_mp4):,} bytes). Skipping.")
        return True

    grok_cmd = (
        f"Use the image_to_video tool on {source_img} to generate a 6-second video loop "
        f"at 720p resolution: {prompt}. Save the resulting mp4 video file to {target_mp4}."
    )

    env = os.environ.copy()
    env["GROK_HOME"] = GROK_HOME

    print(f"\n[GENERATING] {char_id} ({mode})...")
    print(f"  Source: {source_img}")
    print(f"  Target: {target_mp4}")
    print(f"  Prompt to Grok: {prompt} @ 720p")
    t0 = time.time()

    proc = subprocess.Popen(
        [GROK_BIN, "--cwd", FULL_DIR, "-p", grok_cmd],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    # Monitor for output file creation and completion
    success = False
    last_size = 0
    stable_count = 0

    while True:
        elapsed = time.time() - t0
        if os.path.exists(target_mp4):
            cur_size = os.path.getsize(target_mp4)
            if cur_size > 500_000:
                if cur_size == last_size:
                    stable_count += 1
                else:
                    stable_count = 0
                last_size = cur_size

                # If file size is stable for 3 checks after reaching > 500KB
                if stable_count >= 3:
                    print(f"  [SUCCESS] {target_mp4} finalized ({cur_size:,} bytes) in {elapsed:.1f}s!")
                    success = True
                    time.sleep(2)
                    try:
                        proc.terminate()
                        proc.wait(timeout=3)
                    except Exception:
                        proc.kill()
                    break

        ret = proc.poll()
        if ret is not None:
            time.sleep(2)
            if os.path.exists(target_mp4) and os.path.getsize(target_mp4) > 100_000:
                print(f"  [SUCCESS] {target_mp4} generated ({os.path.getsize(target_mp4):,} bytes) in {elapsed:.1f}s!")
                success = True
            else:
                print(f"  [FAILED] Process exited with code {ret} but file not found or too small.")
            break

        if elapsed > 240:
            print(f"  [TIMEOUT] Generation exceeded 240s without completing.")
            try:
                proc.terminate()
                proc.wait(timeout=3)
            except Exception:
                proc.kill()
            break

        time.sleep(1.5)

    if success:
        sync_character_data()
        return True
    return False

def main():
    target_char = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] not in ["", "all", "None"] else None
    target_mode = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] not in ["", "all", "None"] else None
    prompt = sys.argv[3] if len(sys.argv) > 3 else "mode -- spicy"

    os.makedirs(ANIM_DIR, exist_ok=True)

    if target_char == "--sync":
        sync_character_data()
        return

    for char in CHARACTERS:
        if target_char and char["id"] != target_char:
            continue
        for mode in ["idle", "action", "special"]:
            if target_mode and mode != target_mode:
                continue
            generate_video(char["id"], mode, prompt)

    sync_character_data()

if __name__ == "__main__":
    main()
