#!/usr/bin/env bash
# Analyse a reference clip: contact sheet (1.5 fps) + hard-cut times + crop detection.
# ./analyze_reference.sh clip.mov [out_prefix]
set -e; FF=${FFMPEG:-ffmpeg}; IN="$1"; OUT=${2:-ref}
$FF -hide_banner -i "$IN" 2>&1 | grep -E "Duration|Video:" || true
echo "crop:"; $FF -hide_banner -ss 2 -i "$IN" -t 3 -vf cropdetect=limit=40:round=2 -f null - 2>&1 | grep -oE "crop=[0-9:]+" | sort | uniq -c | sort -rn | head -1
echo "cuts (s):"; $FF -hide_banner -i "$IN" -vf "scale=480:-2,select='gt(scene,0.3)',showinfo" -vsync vfr -f null - 2>&1 | grep -oE "pts_time:[0-9.]+" | cut -d: -f2 | tr '\n' ' '; echo
$FF -v error -y -i "$IN" -vf "fps=1.5,scale=480:-2,tile=4x4" -frames:v 1 "${OUT}_sheet.jpg" && echo "sheet: ${OUT}_sheet.jpg"
