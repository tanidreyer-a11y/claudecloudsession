# Camera-move catalogue — from the full reference re-scan (2026-10-13/14)

All 19 reference videos re-read at 3 fps, then the 3D moments at 8–15 fps (`time_sheet.py`). Times are in the source
file (rNN = `scratchpad/rescan/src` mapping in the session notes; r01–r04, r07, r16 ElevenLabs/ElevenAgents IG,
r12 NIVO, r17–r19 Zelios/Lovio, r15 nexl, r18 NeuralSeek, r08 NeuraFlow). The owner's note this answers: "your camera
is only flat… you never go under a container and turn around to see its back."

Each move: what happens frame by frame → how long → how we build it (block in `vendor/hyperframes`, or ours).

## A. Moves where the camera really travels in 3D
1. **Tunnel of screens** (r17 5.5–9.75). Four phones slide in from the four frame edges and become the walls of a box;
   the camera sits inside looking down its length; words change at the vanishing point; walls drift ±5° roll and push
   past; exit = walls blur outward to white (0.12 s), one phone tilts in with a blue motion trail that becomes the next
   UI (progress bar). 4.2 s. → `gallery-tunnel` (tested, monochrome) or three.js box of 4 textured planes.
2. **Grazing rise** (r12 2.2–6.3). Cut to a dashboard plane almost edge-on (≈80° tilt), fogged at the bottom; headline
   types above it word by word; the plane rises slowly (80°→60°, 2.1 s), then swings to frontal in 0.25 s (ease-out)
   and the side panel pops in. → `ui-3d-reveal`; ours: CSS/three plane rotateX keyframes.
3. **Orbit an isometric slab, things land on it** (r12 36.6–42.8). "Data" slab with visible thickness yaws −15°→+30°;
   small tiles fly in from off-screen at different heights and ring it; slow 10° orbit; tiles collapse into it; a
   bevelled glass slab drops on top with a small bounce; label appears; a line runs from the label to the next node.
   6 s. → `exploded-stack`, `cuboid-carousel`; ours: `Film9.tsx` pattern.
4. **Dive into the top of a cube** (r12 47.9–50.3). Glass layers drop and stack (≈0.08 s apart) with a slight yaw;
   hold at a 3/4 isometric view; then the stack lifts and the camera rises over it to top-down and pushes into the top
   face until that lit square IS the frame → next scene. Dive 0.4 s. → three.js camera path; `vfx-portal` idea.
5. **Go under a floor** (r16 0–3.75, r07). A floor of pixel blocks seen edge-on at 40 % height; pixels rain onto it;
   the camera sinks below it: the underside grows, cards hang from it, coloured pixels drip toward the camera.
   → three.js plane + instanced cubes; camera y goes negative, looks up.
6. **Fly between two spheres into light** (r04 3.2–6.3). Cube inside a glass sphere, two planets linked by lines; the
   system rolls ~35° while the camera dollies toward one planet; it passes the camera; both spheres fill top and
   bottom; the gap between them blooms white (eclipse) and the next scene's word appears inside the light; white
   fills. 3 s, the light part 0.6 s. → three.js spheres + bloom; ends on our white world.
7. **Into the orb, out of the sphere** (r16 9.9–11.4 and 20.6–22.1). In: a dark glass orb hangs on a line, lights up
   from inside, grows 4× in 0.35 s (ease-in); the next scene is visible inside the circle like a lens (inner content
   scales only ~1.3×, parallax), the edge passes the frame. Out: a huge thin ring (the rim of a sphere bigger than the
   frame) appears, shrinks to centre while the old scene dims inside it; rim lit on one side; "24/7" types inside.
   → circular mask + scale with inner parallax (2.5D is enough); `vfx-portal` for the 3D version.
8. **Fly into the logo** (r02 8.9–11.5). The wordmark un-types to the "II" mark; outline copies of the bars recede on a
   curve both sides; the camera accelerates into the black bars (ease-in, 2 s) until black fills the frame — that
   black is the next scene's background ("Innovating"). Reverse in r03/r09: start inside giant blurred bars, pull back
   to the small logo. → our emblem bars (two parallelograms) as the door: scale ×40 about the bar centre.
9. **Glass carousel / UI swing with depth of field** (r08 6.6–9.1, r18 13.2–16.8). Panels on a ring rotate ~40° over
   2 s, lit from above; or a grid of cards swings to ~35° yaw while a big document panel slides in front at ~45°,
   out of focus, then racks into focus. → `carousel-orbit-*`, `transitions-3d`, `rack-focus`.
10. **Flip to edge, split into many** (r17 16.9–18.0). A card rotates to edge-on (0.13 s), at 90° it becomes several
    cards that fan out in 3D to the frame edges (0.3 s), then they settle around the title. → `transitions-3d`; ours:
    rotateY 90° + N clones with staggered 3D transforms.

## B. The owner's orb ad — closest reference (r03 11.5–13.6, also r06 22.3–24)
Two 1 px grey outline circles slide into each other; the overlap (the lens) fills with a gradient at once; the pair
rotates ~90° over 0.6 s while the circles keep converging, so the lens widens; when they coincide the lens becomes a
full sphere with real shading (13.0 s); dotted orbit rings draw around it; the orb shrinks. 1.2 s from overlap to orb.
Build: SVG/canvas lens (intersection of two circles), rotation + convergence on one curve, then swap to a three.js
sphere (or `cosmic-orb`, restyled monochrome/pearl) at the coincidence frame.

## C. Rules learned
- The camera move must have a destination: every 3D move above ends by delivering the next scene (light, a face of
  a cube, the inside of an orb, a black bar). Never orbit for decoration.
- Depth needs parallax and light: thickness edges, a rim light, fog, focus. A rotated flat card is not 3D.
- One big 3D move per 6–10 s, the rest flat and calm. The references alternate.
