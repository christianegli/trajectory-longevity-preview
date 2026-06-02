#!/usr/bin/env python3
"""Build episode-001.mp3 from episode-001.md via edge-tts + ffmpeg concat."""

import asyncio
import os
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

HERE = Path(__file__).parent
SCRIPT = HERE / "episode-001.md"
TMP = HERE / ".tmp_lines"
OUT = HERE / "episode-001.mp3"
FFMPEG = "/Users/atlas/bin/ffmpeg"

VOICE_A = "en-US-AndrewNeural"   # Andrew, male
VOICE_B = "en-US-AvaNeural"      # Ava, female

# Tiny breath/pause file path (silence) we'll insert between turns
SILENCE = TMP / "silence_400ms.mp3"


def parse_script(text: str):
    """Yield (voice, line) tuples for [Andrew]: / [Ava]: lines only."""
    out = []
    for raw in text.splitlines():
        m = re.match(r"\s*\[(Andrew|Ava)\]:\s*(.+?)\s*$", raw)
        if not m:
            continue
        who, line = m.group(1), m.group(2).strip()
        if not line:
            continue
        voice = VOICE_A if who == "Andrew" else VOICE_B
        out.append((voice, line))
    return out


async def synth_one(idx: int, voice: str, text: str, dest: Path):
    # subtle natural cadence: leave default rate, slight prosody via ssml? Keep simple.
    communicate = edge_tts.Communicate(text=text, voice=voice)
    await communicate.save(str(dest))


async def main():
    if not SCRIPT.exists():
        print(f"ERROR: script not found {SCRIPT}", file=sys.stderr)
        sys.exit(2)
    TMP.mkdir(exist_ok=True)
    # clean previous line files
    for p in TMP.glob("*.mp3"):
        p.unlink()

    lines = parse_script(SCRIPT.read_text())
    print(f"[gen] {len(lines)} dialogue lines parsed")

    # Generate per-line MP3s with bounded concurrency
    sem = asyncio.Semaphore(6)

    async def bounded(i, voice, text):
        async with sem:
            dest = TMP / f"{i:03d}.mp3"
            try:
                await synth_one(i, voice, text, dest)
                size = dest.stat().st_size
                print(f"[tts] {i:03d} {voice.split('-')[-1]:18s} {size:>7d}B  {text[:60]}")
            except Exception as e:
                print(f"[tts] {i:03d} FAILED: {e}", file=sys.stderr)
                raise

    await asyncio.gather(*[bounded(i, v, t) for i, (v, t) in enumerate(lines, 1)])

    # Build a small silence file (400ms, mp3, mono, 24kHz to match edge-tts output)
    if not SILENCE.exists():
        subprocess.run(
            [FFMPEG, "-y", "-loglevel", "error",
             "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
             "-t", "0.4", "-q:a", "9", "-acodec", "libmp3lame",
             str(SILENCE)],
            check=True,
        )

    # Build concat list: line, silence, line, silence, ...
    concat_list = TMP / "concat.txt"
    with concat_list.open("w") as f:
        for i in range(1, len(lines) + 1):
            line_path = TMP / f"{i:03d}.mp3"
            f.write(f"file '{line_path.as_posix()}'\n")
            if i != len(lines):
                f.write(f"file '{SILENCE.as_posix()}'\n")

    # Stitch
    if OUT.exists():
        OUT.unlink()
    subprocess.run(
        [FFMPEG, "-y", "-loglevel", "error",
         "-f", "concat", "-safe", "0", "-i", str(concat_list),
         "-c:a", "libmp3lame", "-b:a", "96k",
         str(OUT)],
        check=True,
    )
    size = OUT.stat().st_size
    print(f"[ok] wrote {OUT}  ({size:,} bytes)")

    # Duration via ffmpeg
    r = subprocess.run([FFMPEG, "-i", str(OUT)], capture_output=True, text=True)
    for ln in r.stderr.splitlines():
        if "Duration" in ln:
            print(f"[ok] {ln.strip()}")
            break


if __name__ == "__main__":
    asyncio.run(main())
