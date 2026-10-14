---
name: ai-reveal-product-video
description: Obsidian's "made by Claude" product video — a voice-over-driven SaaS/product explainer (cinematic motion graphics, kinetic typography, liquid shape transitions, 3D elements, seamless camera moves) that turns halfway and reveals the whole video was made by Claude, frame by frame. Use when the owner asks for a product video, a SaaS promo, an ad "made by AI/Claude", or sends a voice script / voice-over for one.
---

# AI-reveal product video

Owner's brief (2026-10-14): "a video talking about any product, then halfway explain that it's made by Claude… cinematic
motion graphics sequence animation with kinetic typography, smooth shape transitions, 3D elements and seamless camera
movements… liquid motion transitions. Follow a voice script." The bar: the creators the owner studies make "the same ad
but better, with more striking transitions, motion and 3D". Every beat must clear that bar.

Read first: `.claude/skills/obsidian-motion-architect/SKILL.md` (engine + house rules),
`skills/motion-studio/references/camera-moves.md` (the 3D moves), `skills/motion-studio/references/frame-analysis.md`
(QA), `skills/motion-studio/library/styles/obsidian-precision.md` (look).

## Inputs (ask for whatever is missing, in one message)
1. **Voice-over audio** (wav/mp3/m4a) **and the exact script text**, one beat per line. The audio drives every cut.
   No audio yet? Build to the script at 150 words/min and re-time when it arrives. Never invent a voice: TTS models
   are blocked in this environment and a fake voice is not the owner's call to skip.
2. **The product**: the owner's client (with their permission and real screenshots in `screenshots/`), or a fictional
   SaaS we invent (name, 3 features, UI built in HTML). Never a real company's brand without permission.
3. **Format**: 9:16 1080×1920 (Reels/TikTok/X) is the master; 16:9 and 4:5 are re-frames. Length = the voice-over.

## Structure (percent of the voice-over; beats start on their words)
| Part | % | What the viewer sees | Signature moves |
|---|---|---|---|
| 1. Hook | 0–8 | the problem in 3–6 words of kinetic type; the product UI swings in from a steep angle | grazing rise (camera-moves A2), type slams/assembles |
| 2. Product story | 8–45 | 3 feature beats, one idea each: UI in a fixed container, the number counts, the chart draws, the card stacks | each feature exits through a different liquid/shape transition into the next; one 3D move (orbit, exploded stack, tunnel) |
| 3. The turn | 45–55 | the image freezes on a word; an x-ray line sweeps across and the scene turns into its wireframe and code — "the back of the container" | freeze → scan line → wireframe (our Film9 rear-face idea), timeline scrubs backwards |
| 4. How it was made | 55–85 | the caret types the prompt; code streams; frames render into a filmstrip; each descriptor word performs itself: "kinetic typography" (letters move), "shape transitions" (shapes morph), "3D elements" (the word extrudes), "camera movements" (the camera flies through the word) | `code-typing`, `code-particle-assemble`, `code-3d-extrude`, `extruded-logo`, `camera-dolly-zoom`, a tunnel of the video's own frames (`gallery-tunnel`) |
| 5. Close | 85–100 | the product end card returns (it was always code) → "Made with Claude" → Obsidian lockup + "Digital precision that builds reputation." | blob dissolve back to the hero, emblem, caret returns |

Rule: the reveal must be **visible**, not only said. The viewer sees the same frame as code.

## The look (non-negotiable)
- Monochrome Obsidian world (black, graphite, silver, pearl); colour only inside product screenshots/UI.
- **Liquid transitions**: metaball/gooey morphs, warp dissolves, shape morphs — `gooey-split`, `domain-warp-dissolve`,
  `cross-warp-morph`, SVG path morphs, our blob dissolve. No hard cuts except on a drum hit; no white flashes.
- **Kinetic type**: Archivo expanded 800 for big words, words arrive on their syllable (use `vo_timing.py` word times),
  one idea on screen at a time, 2–6 words per screen, inside the middle 80 % (phones crop).
- **3D**: at least two real 3D moments (WebGL depth, light on edges), one in part 2 and one in part 4.
- **Camera**: one continuous camera language — push, orbit, dive. Each move ends by delivering the next scene.
- **Sound**: the voice-over on top; a quiet bed ducked under it; UI sounds only on actions (ticks for code, clicks,
  one chime at the reveal); no whooshes on every transition. Master −16 LUFS (−14 LUFS for Reels if the owner asks).
- Claude marks (logo, Clawd) only per the `obsidian-content` Claude-topic rule, with the non-affiliation line in the
  end card or caption. The reveal line must be true: we build it with Claude (Claude Code + Remotion/HyperFrames).

## Pipeline
1. `python3 -I skills/motion-studio/scripts/vo_timing.py voice.m4a script.txt timing.json` — line and word times.
   whisper (word-accurate) when its model is available; otherwise the pause-snapping fallback (lines exact to the
   pauses, words spread by syllables) — check the word hits by eye on the contact sheet.
2. Storyboard: `storyboard.md` — one row per script line: time, words on screen, visual, transition out, 3D/camera
   move, sound. Show it to the owner before the full build if he hasn't approved the product/look yet.
3. Build: Remotion composition in `obsidian-ad/brand-film` (1080×1920, 60 fps), timings read from `timing.json`;
   3D blocks rendered with HyperFrames as plates (`hf_localize.py`, Obsidian tokens) and placed with OffthreadVideo;
   three.js scenes via @remotion/three where the camera must pass through our own objects.
4. QA: stills sheet before the full render, `cut_scan.py` after, then a 15 fps strip of the reveal (part 3) — it must
   read in one viewing.
5. Deliver: MP4 per format + captions for Instagram (≤ 5 hashtags), LinkedIn, X (via `obsidian-content` rules).

## What "better than the reference" means here (checklist before delivery)
- [ ] Every transition is a motion (morph, dissolve, camera) — zero plain fades, zero jump cuts off the beat.
- [ ] Two real 3D moments, both with light and thickness.
- [ ] The reveal is shown: the same frame becomes wireframe/code.
- [ ] Every visual beat lands within 2 frames of its word.
- [ ] Nothing on screen without a job; one idea per screen.
- [ ] No AI-design tells (purple gradients, Inter, lime accents, all-caps eyebrows).

## Reference build (2026-10-14): OBS-KOVA
`obsidian-ad/brand-film/src/Film10.tsx` (33 s, 1080×1920, 60 fps → 30 fps blend), sound `audio/build_kova.py`,
render `render_kova.sh`. What worked and is reusable:
- `Invoice({ t, wire })`: every product scene takes a time and a `wire` flag, so the reveal re-renders the same frame
  as its own wireframe, the rewind plays scenes backwards, and the filmstrip shows real mini frames.
- Rewind through recognisable frames only (a piecewise time map), never through empty transition frames.
- three.js text: `TextGeometry` with `public/fonts/helvetiker_bold.typeface.json`, metal material + RoomEnvironment;
  keep the word inside the frame at its widest yaw (size 1.8 at camera z 11.5 for 1080 wide).
- Tunnel plate: HyperFrames `gallery-tunnel` re-sized to 1080×1920 (edit the 1920/1080 constants), filled with the
  film's own stills — never reference screenshots in anything published.
- Goo transitions sit UNDER the next scene and fade out after they flood the frame, or they hide the next beat.
