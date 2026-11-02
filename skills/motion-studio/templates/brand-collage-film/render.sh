set -e
HS=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
FF=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
npx remotion render src/index.ts KK916 out/KK916_raw60.mp4 --codec h264 --crf 14 --concurrency 4 --browser-executable=$HS > out/render.log 2>&1
# 60 -> 30 fps with a 2-frame blend (motion blur), mux the mix
$FF -v error -y -i out/KK916_raw60.mp4 -i audio/mix.wav -vf "tmix=frames=2:weights='1 1',fps=30" -c:v libx264 -crf 12 -preset medium -pix_fmt yuv420p -c:a pcm_s16le -shortest out/KK916_raw.mov
FFMPEG=$FF bash ../../skills/motion-studio/scripts/finish.sh out/KK916_raw.mov out/klick-kulture-makes-you-click-9x16${V:-} 15
echo DONE
