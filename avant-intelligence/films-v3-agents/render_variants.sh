set -e
HS=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for c in AvantOneLine AvantEveryCity; do
  npx remotion render src/index.ts $c out/${c}_raw60.mp4 --codec h264 --crf 14 --concurrency 4 --browser-executable=$HS > out/render_$c.log 2>&1
done
echo RENDERED
