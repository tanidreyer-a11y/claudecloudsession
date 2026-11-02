# Side-by-side sheet: reference frame (top) over OUR frame (bottom) at the same timestamps.
# usage: compare_ref.sh <composition-id> <reference.mp4> <ref-crop|-> <out.jpg> t1,t2,...   (run from the Remotion project)
# Use non-integer times (3.05, not 3): the stills filename drops ".0". Convert every measurement from the reference
# tile into 1920×1080 before changing code (lessons-learned 72).
set -e
COMP=$1; REF=$2; CROP=$3; OUT=$4; LIST=$5
FF=${FFMPEG:-ffmpeg}
BROWSER=${BROWSER:-} FFMPEG=$FF node stills.mjs $COMP out/cmp_ours.jpg $LIST > /dev/null
ARGS=(); FILT=""; i=0
for t in ${LIST//,/ }; do
  if [ "$CROP" = "-" ]; then VF="scale=480:-2"; else VF="$CROP,scale=480:-2"; fi
  $FF -v error -y -ss $t -i $REF -frames:v 1 -vf "$VF" out/cmp_ref_$t.jpg
  $FF -v error -y -i out/st_${COMP}_$t.jpg -vf "scale=480:-2" out/cmp_our_$t.jpg
  ARGS+=(-i out/cmp_ref_$t.jpg -i out/cmp_our_$t.jpg)
  FILT+="[$((2*i))][$((2*i+1))]vstack[p$i];"; i=$((i+1))
done
PAIRS=""; for j in $(seq 0 $((i-1))); do PAIRS+="[p$j]"; done
$FF -v error -y "${ARGS[@]}" -filter_complex "${FILT}${PAIRS}hstack=inputs=$i" $OUT
echo "sheet $OUT"
