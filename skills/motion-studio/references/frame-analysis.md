# Frame analysis — how to read a reference (or our own film) precisely

Proven on OBS-LOVIO / OBS-SCRATCH (lessons 72–75). Eyeballing a played video misses most of what makes a transition
smooth. Read frames, measure, convert, then build.

## 1. Rhythm: motion strips
`scripts/strip.sh <video> <start> <dur> <fps> <cols>x<rows> <out.jpg> [crop]`
- 4 fps × 5 s per sheet for the whole film (where the beats are);
- 8 fps × 4 s for one scene (how it builds);
- 15 fps × 1 s for one transition (what happens on each frame: blur, mask shape, over-exposure, who moves first);
- 60 fps (our raw render) for a single pop.
Write down for each transition: duration, what stays still (the anchor), what moves, the curve (fast start = ease-out,
slow start = ease-in), blur/brightness at the cut, and where the motion's origin is (centre, click point, corner).

## 2. Size and position: measure, then convert
Crop the reference to its picture area (e.g. `crop=700:384:66:0` for a letterboxed phone recording). Read positions in
the tile and convert to 1920 × 1080: `x_out = x_tile / tile_w × 1920`. Our first passes were ~50 % too small on every
element (pills, list type, cards, titles) — size is the most common miss.

## 3. Side by side: `scripts/compare_ref.sh`
`compare_ref.sh <COMP-ID> <reference.mp4> <crop|-> out/cmp.jpg 12.7,16.6,18.2` (run in the Remotion project; set
`BROWSER` and `FFMPEG`). Reference on top, ours below, same timestamps. 4–5 timestamps per sheet. Non-integer times.

## 4. Smoothness: the frame-jump scan
`python3 -I scripts/cut_scan.py $FFMPEG ref.mp4 <crop> > ref_cuts.txt`, then
`python3 -I scripts/cut_scan.py $FFMPEG ours.mp4 - ref_cuts.txt` lists every jump in OUR film the reference does not
have. Each one is a glitch until a 60 fps strip proves it is intended motion. Typical causes: a full-frame flash, an
ease-out start on a full-frame wash, a layer that starts drawing before the one it should sit under, a duplicated UI
element at a cut, a headline that changes size across a cut.

## 5. Stills sheet before every full render
Render 25–35 stills across the film (`node stills.mjs COMP out/x.jpg t1,t2,…`) and tile them; fix sizes, overlaps,
unreadable text and empty frames before spending 20+ minutes on a full render. Re-render only the changed frame
ranges (`--frames=a-b`) and splice them into the 60 fps master with ffmpeg `trim` + `concat`.

## 6. Style, not replica
When the study is done, write down the MECHANISMS (transition, timing, curve, anchor) in the style card and build
the new film from the brand's own motifs. The reference's beat order, words, props and layouts stay behind.
