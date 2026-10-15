# Continuity motion: the one-shot focus-point method (detail file of obsidian-video-studio)

Owner's brief (2026-10-15): "a focus point that drags you along the storyboard… you're in your own world, like a
rollercoaster — the motion, transitions and camera angles are what you're still not getting right." Studied from two
references (method only, nothing copied):
- the owner's favourite reel: a single white point that becomes every element, with a camera that rides a thread
  between UI pills;
- a "3 transitions to never get stuck in motion design" reel: **camera pull-back**, **track matte**, **match cut**.

Theory behind it:
- Walter Murch's *eye trace*: before every change, ask where the viewer's eye is, and put the next thing there.
- Adobe's track matte, where the next scene shows only through a shape's alpha or luma.
- School of Motion's essential transitions: match cut, morph, infinite zoom.

## The diagnosis: why our earlier films felt off
We built separate scenes and joined them with transition presets (liquid, slices, whip…). So every scene change made
the eye start again. The reference builds **one world** and moves **one camera** through it, and its "transitions"
are the hero changing form. Presets stay useful for the voice-HUD format. For this format they are the wrong tool.

## Six rules
1. **One focus point, always.** Before every change, find where the eye is (the brightest, sharpest or moving
   thing). The next element is born there.
   - Test: across any change, the focus point moves less than about 15 % of the screen in one frame. The only
     exception is a deliberate match cut.
2. **Change the hero, not the scene.** For example: point → 4 nodes → ring → star → icon → pill → card.
   - Morph between shapes that share the same anchor count (`shapePath` uses 4 cubic segments).
   - A morph done mid-motion hides an imperfect match.
3. **The camera is a character.**
   - It follows the hero with **0.12–0.2 s lag**.
   - It **banks** into sideways moves (roll up to 9°).
   - It **pulls out mid-travel** so the speed reads, and **pushes in** to "enter" something.
   - Motion blur comes only from camera speed (`World blur`).
4. **Contact is an event.** When the point touches something, that thing reacts within 1–2 frames: a flood from the
   contact point, a pop with overshoot (`pop`), a small shake (`Finish` hits) and a sound.
5. **Rollercoaster timing.** Travel eases slow climb → fast drop → ease into the station (`bezier(.55,0,.3,1)`).
   - Hold each label 0.4–0.8 s, at 1–3 words.
   - Alternate fast and still beats, so the stillness is what makes the speed felt.
6. **Act breaks by tone inversion, through a shape** (a black world opens into a white world through a white pill),
   never a flash.

## The three transitions (the "never get stuck" list), and how to build them here
| Transition | What it is | Build in our kit | Rules that make it work |
|---|---|---|---|
| **Camera pull-back** | Start inside a detail of the next layout and pull back until the context appears | `camAt` keys `z: 2.6 → 1`, `MV` ease over 1.0–1.4 s after a 0.25 s hold; zoom eases in log space | The first frame must match what came before (colour or shape). Reverse it ("push-through") to enter an element until its interior becomes the next background |
| **Track matte** | The next scene shows only inside a shape from the current one (alpha matte; a luma matte uses brightness) | `<Matte box>`, from the element's on-screen rect (`screenOf`) to full frame, `MV` over 0.6–0.8 s | The inside's first frame has the shape's fill colour, so the matte opens seamlessly. Variants: text as the matte (an SVG `<mask>` with `<text>`), or a chart fill rising to become the next background |
| **Match cut** | A hard cut where shape, position, size and motion direction match across the cut | Get A's element at its last frame with `screenOf`, then place B's element there (`worldAt` converts back into B's world) | Inversion is allowed (black button → white point). Cut on a sound hit, and keep motion going through the cut |

## Storyboard template (fill this in before building; the owner approves it at step 4)
| Beat | Hero form | Where it sits on screen | Camera | How it changes (morph / thread / matte / pull-back / match cut) | Contact event | Label (1–3 words) | Sound |
|---|---|---|---|---|---|---|---|

## Kit: `obsidian-ad/brand-film/src/fx/Camera.tsx` (exported from `"./fx"`)
- `camAt(keys, t)`: keyframed camera `{x, y, z, r}` in world px, with log-space zoom and an ease per key.
- `mixCam(a, b, k)`: blends between two cameras.
- `follow(target, t, {lag, bank, z})`: the camera chases a moving point and banks into sideways motion.
- `<World cam prev blur>`: everything inside is in world px, and directional motion blur comes from the camera's
  speed. Pass `prev = cam at t - 1/fps`. `<At x y>` places an element at a world point.
- `<Thread d p tail>` with `threadHead(d, p)`: the guide line with its glowing head; the camera follows
  `threadHead`.
- `<Shape k r spin draw nodes>` and `shapePath`: ring → concave 4-point star morph, with nodes and a stroke draw-on.
- `<Matte box>`, `lerpBox`: track matte in screen space.
- `screenOf` and `worldAt`: for match cuts and for placing mattes.
- `pop(t, at)`: an overshoot pop for contact reactions.

Proof: composition `ONESHOT` (`src/OneShot.tsx`, 12.4 s, 9:16). It goes point → ring → star → pill → thread ride →
contact flood → track matte → pull-back onto a site → match cut → white emblem. Rendered 2026-10-15.

## Sound for this format (`sfx_code.py`)
| Moment | Sound |
|---|---|
| A node spawns | a soft tick |
| The thread travels | a whoosh whose pitch follows the speed |
| Contact | a pop + lock |
| The tone inversion (matte opens) | a low hit |
| Pull-back | a short riser under it |
| Match cut | one clean hit exactly on the cut |
| Under everything | a quiet air bed, no beat |

## Not built yet (say so before promising it)
- The reference's opening uses **3D rings in perspective** with a camera descending through them. That needs
  `@remotion/three`, or CSS `perspective` + `rotateX`. It is not in the kit yet.
- The reference charges elements with **colour gradients** (blue/magenta). The house look uses white light sweeps
  only. Colour is used only if the owner asks, and never purple (brand rule).
