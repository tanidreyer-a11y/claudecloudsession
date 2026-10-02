#!/usr/bin/env bash
# Grade + grain + loudness (-16 LUFS, TP -1.5) + master and size-budget web encodes, then verify.
# ./finish.sh master.mp4 out/name [web_MB=13.8]
set -euo pipefail
FF=${FFMPEG:-ffmpeg}; IN="$1"; OUT="$2"; MB=${3:-13.8}
GRADE="scale=in_color_matrix=bt709:out_color_matrix=bt709,format=gbrp,curves=all='0/0 0.25/0.23 0.75/0.78 1/1',colorbalance=rh=.02:gh=.005:bs=-.01,format=yuv420p"
TAGS="-colorspace bt709 -color_primaries bt709 -color_trc bt709"
# loudness pass 1 (measure)
M=$($FF -hide_banner -i "$IN" -af "alimiter=limit=0.9,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$M" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
LN="alimiter=limit=0.9,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
# master
$FF -v error -y -i "$IN" -vf "$GRADE,noise=c0s=4:c0f=t+u" -af "$LN" -c:v libx264 -profile:v high -crf 18 -preset slow $TAGS -c:a aac -b:a 320k -ar 48000 -movflags +faststart "${OUT}-master.mp4"
# web copy
DUR=$( ($FF -hide_banner -i "$IN" 2>&1 || true) | sed -nE 's/.*Duration: ([0-9:.]+).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
VB=$(awk -v mb="$MB" -v d="$DUR" 'BEGIN{printf "%d", (0.93*mb*8*1024*1024/d - 128000)/1000}')   # 7% headroom
# quality-capped (CRF 21) with the budget as a ceiling: short/simple films stay small, long ones never exceed the limit
$FF -v error -y -i "$IN" -vf "$GRADE,noise=c0s=2:c0f=t+u" -af "$LN" -c:v libx264 -profile:v main -level 4.0 -crf 21 -maxrate ${VB}k -bufsize $((VB*2))k -preset slow $TAGS -c:a aac -b:a 128k -ar 48000 -movflags +faststart "${OUT}-web.mp4"
# verify
for f in "${OUT}-master.mp4" "${OUT}-web.mp4"; do
  echo "== $f $(du -h "$f" | cut -f1)"; $FF -hide_banner -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tail -2
done
