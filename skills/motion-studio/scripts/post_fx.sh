#!/usr/bin/env bash
# Whole-film finishing pass in FFmpeg (after the render, before finish.sh). Presets stack in the order given.
#   ./post_fx.sh in.mp4 out.mp4 bloom,halation,ca,grain,vignette     (trails = lagfun echo, for dream/drop moments only)
# bloom    = blurred bright copy screened back     halation = warm glow around highlights (film)
# ca       = RGB split 2 px (rgbashift)             grain    = temporal noise   vignette = edge falloff
# trails   = lagfun feedback trails (decay 0.9)     Per-moment CA/glitch spikes belong in Remotion (src/fx/Finish.tsx).
set -euo pipefail
FF=${FFMPEG:-ffmpeg}; IN="$1"; OUT="$2"; P="${3:-bloom,grain,vignette}"; CH=""
add(){ CH="${CH:+$CH,}$1"; }
for p in ${P//,/ }; do case $p in
  bloom)    add "split[a][b];[b]curves=all='0/0 0.7/0 1/1',gblur=sigma=24[g];[a][g]blend=all_mode=screen:all_opacity=0.55" ;;
  halation) add "split[a][b];[b]curves=all='0/0 0.75/0 1/1',colorchannelmixer=rr=1:gg=0.45:bb=0.2,gblur=sigma=10[g];[a][g]blend=all_mode=screen:all_opacity=0.35" ;;
  ca)       add "rgbashift=rh=-2:bh=2" ;;
  grain)    add "noise=c0s=7:c0f=t+u" ;;
  vignette) add "vignette=angle=PI/4.5" ;;
  trails)   add "format=gbrp,lagfun=decay=0.9,format=yuv420p" ;;
  *) echo "unknown preset $p"; exit 1 ;;
esac; done
$FF -v error -y -i "$IN" -filter_complex "[0:v]${CH},format=yuv420p[v]" -map "[v]" -map 0:a? -c:v libx264 -crf 14 -preset medium -c:a copy "$OUT"
echo "post_fx $P -> $OUT"
