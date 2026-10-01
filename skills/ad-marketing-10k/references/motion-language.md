# Motion language

## Curves & springs
- OUT `bezier(0.16,1,0.3,1)` entrances · IN `bezier(0.7,0,0.84,0)` exits · CAMERA `bezier(0.65,0,0.35,1)` camera/morphs/
  counters · SWEEP `bezier(0.22,1,0.36,1)` line draws & highlights.
- Springs: pop {damping 13, stiffness 190, mass .8} (small pop-ups, ~4 % overshoot) · settle {200,120} (cards, no
  overshoot) · soft {26,80} · snap {18,260,.6}.
- No linear interpolation; clamp everything; never `scale(0)`; stagger 3–6 frames; exits faster than entrances.
- Slow camera push-in on long shots (≤ ~4.5 %); elements on screen > 2 s breathe (±4 px sin bob).

## Camera
- World = one big absolutely-positioned layer; camera = `translate(960,540) scale(z) rotate(r) translate(-cx,-cy)`.
- Keyframes `[t, cx, cy, ln(z), rotDeg]`, interpolated with a **monotone cubic spline** (`spline()` in the engine):
  velocity carries through keys, no overshoot, ease only at segment ends. Zoom in log space so 1→2 feels like 2→4.
- **Segments** = hidden cuts. End segment A at a zoom of 8–14× into an object while an iris/flash covers the frame;
  segment B starts zoomed out in the new region. Use `camAt(t)` to pick the segment.
- Keys are written relative to word times (`W.bridge - .5`) so a new voice take re-times the whole film automatically.
- Directions to use in every film: push-in, pull-back reveal, follow down (falling object), rise up (into a doc),
  whip right (system to system), orbit with ±3–8° rotation, rack-focus (blur → sharp).

## Transitions (no plain cuts)
| Transition | How |
|---|---|
| Zoom-through | camera → 10× into orb/dot/light; iris div in that colour fades in/out over ~0.5 s; emerge at 0.55–3× in new scene |
| Object becomes next object | data chips collapse into a ball; a flat signal line flies across and becomes the logo's bar |
| Line-led | a line draws on, branches (tree/T-junction), the camera follows the growing tip |
| Freeze | desaturate + darken world, orbit time slows to ~5 %, one word on screen ("ALMOST.") |
| Rack focus | screen layer `filter: blur(16px→0)` on the word "sharper" |
| Stack/scroll | documents drop in from above one per word while camera tilts up |

## Element library (all in the engine/examples)
- **System window**: title bar dots + uppercase app name + labelled fields; typing caret; error state (red border).
- **Document**: off-white invoice with rows; tilted 3D (`perspective rotateY rotateX`); light beam sweep; rows highlight.
- **Data chip**: accent-tinted pill flying on an arc (`y -= sin(πp)·120`) into a target field; double-× lock mark.
- **Chat bubbles**: sender label + message; problem bubbles grey; robot replies accent-tinted with ✓ — callbacks.
- **Orbs / dots**: radial-gradient glow; split 1 → 4 along curved SVG paths; labels as chips.
- **Rings/crosshair/target**: concentric circles drawing on (pathLength trick), crosshair rotating into lock.
- **Audit trail**: timestamped rows, spine line, dots, curved trace lines back to sources.
- **Loop**: circle with 3 nodes (Prepare / Approve / Done) lighting as a ball runs the loop; slow constant rotation.
- **Grid of agents/tiles**: toggles switching on with stagger; grid expands on "as you grow" with camera pull-back.
- **Signal wave**: SVG path; noise amplitude ramps up ("lost in the noise"), flatlines, later resolves to a clean sine.
- **Background**: brand texture image + faint precision grid with registration crosses + parallax dust/stars + vignette + film grain.

## Timing rules
- A new visual event every 2–3 s (calm) or 1–1.5 s (upbeat). Lists: one element per spoken item.
- Element entrances: 0.4–0.7 s, ease-out quart; exits 0.3–0.6 s.
- Hook word: hold 1.5–2.5 s with near-silence.
- Logo assembly ~1.3 s (letters stagger 60 ms, bar draws, marks rotate in, dot drops), then tagline word-by-word.

## Brand discipline
Palette only; accent ≈ ≤5 % of pixels; text alignment per bible (often left-aligned); logo from vectors; tagline
width = per bible (e.g. width of "SMARTTECH"); white letters on dark per the bible's reverse version.
