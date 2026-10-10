set -e
HS=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
FF=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
npx remotion render src/index.ts OBS-40 out/OBS-40_raw60.mp4 --codec h264 --crf 14 --concurrency 4 --gl=angle --browser-executable=$HS > out/render_40.log 2>&1
$FF -v error -y -i out/OBS-40_raw60.mp4 -i audio/mix_40.wav -vf "tmix=frames=2:weights='1 1',fps=30" -c:v libx264 -crf 12 -preset medium -pix_fmt yuv420p -c:a pcm_s16le -shortest out/OBS-40_raw.mov
FFMPEG=$FF bash ../../skills/motion-studio/scripts/finish.sh out/OBS-40_raw.mov out/obsidian-40 18 > out/finish_40.log 2>&1
echo DONE
