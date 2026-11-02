#!/usr/bin/env bash
# One-shot setup for HyperFrames in a fresh cloud container (the container is wiped between sessions).
# usage: bash skills/motion-studio/scripts/setup_hyperframes.sh        (then: export HYPERFRAMES_BROWSER_PATH=… as printed)
# Proven 2026-10-14: hyperframes 0.8.157 renders WebGL blocks here (gallery-tunnel, 12 s draft in ~65 s).
set -u
HF=/tmp/claude-0/hf
mkdir -p "$HF" && cd "$HF"
[ -f package.json ] || npm init -y >/dev/null
npm install --no-audit --no-fund hyperframes@latest >/dev/null 2>&1 && echo "hyperframes $(npx hyperframes --version)"

# FFmpeg + FFprobe on PATH (HyperFrames needs both; the imageio ffmpeg has no ffprobe). --no-install-recommends avoids
# VA driver packages that 404 on the mirror.
if ! command -v ffprobe >/dev/null; then
  apt-get update -q >/dev/null 2>&1; apt-get install -y -q --no-install-recommends ffmpeg >/dev/null 2>&1
fi
command -v ffprobe >/dev/null && echo "ffmpeg ok" || echo "ffmpeg MISSING"

# Chrome: reuse the pre-installed headless shell (the chrome-for-testing download host is blocked here).
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | tail -1)
echo "export HYPERFRAMES_BROWSER_PATH=$HS"

# Speech-to-text for talking-head-recut / embedded-captions: whisper.cpp + a ggml model.
# The binary builds from GitHub source; the MODEL downloads from huggingface.co, which this environment's network
# policy blocks (2026-10-14). If the owner allows huggingface.co (environment settings → Network access → Allowed
# domains), this block finishes the setup. On his own Mac: `brew install whisper-cpp` does the same.
if ! command -v whisper-cli >/dev/null; then
  [ -d "$HF/whisper.cpp" ] || git clone -q --depth 1 https://github.com/ggml-org/whisper.cpp "$HF/whisper.cpp"
  (cd "$HF/whisper.cpp" && cmake -B build -DCMAKE_BUILD_TYPE=Release >/dev/null && cmake --build build -j4 --config Release >/dev/null 2>&1) \
    && ln -sf "$HF/whisper.cpp/build/bin/whisper-cli" /usr/local/bin/whisper-cli && echo "whisper-cli built"
fi
if curl -sS -o /dev/null --max-time 10 -I https://huggingface.co 2>/dev/null; then
  (cd "$HF/whisper.cpp" && bash models/download-ggml-model.sh base.en >/dev/null 2>&1) && echo "whisper model ok"
else
  echo "whisper model BLOCKED: huggingface.co is not reachable from this environment"
fi
echo "Blocks load GSAP/three from jsdelivr (blocked here): run python3 -I skills/motion-studio/scripts/hf_localize.py <project> before rendering."
