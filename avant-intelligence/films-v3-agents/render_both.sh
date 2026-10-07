set -e
HS=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
FF=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
for c in AvantAhead916 AvantAhead169; do
  npx remotion render src/index.ts $c out/${c}_raw60.mp4 --codec h264 --crf 14 --concurrency 4 --browser-executable=$HS > out/render_$c.log 2>&1
done
echo RENDERED
