# Motion strip: N frames per second of a window, tiled, to read a transition frame by frame.
# usage: strip.sh <video> <start_s> <dur_s> <fps> <cols>x<rows> <out.jpg> [crop]
# 8 fps × 4 s for a scene's rhythm; 15 fps × 1 s for one transition; 60 fps (the raw render) for a single pop.
FF=${FFMPEG:-ffmpeg}
VF="${7:+$7,}fps=$4,scale=320:-2,tile=$5"
$FF -v error -y -ss $2 -i $1 -t $3 -vf "$VF" -frames:v 1 $6 && echo "strip $6"
