---
name: obsidian-motion-architect
description: Read FIRST for any video, animation, motion graphic, 3D camera move, talking-head edit, caption job or laptop/device mockup in this repository — before the HyperFrames router (/hyperframes) or Remotion. Decides which engine builds it (our Remotion build, a HyperFrames block, or a HyperFrames workflow like talking-head-recut), and makes every output follow Obsidian's house style. HyperFrames is a parts library here, not the art director.
---

# Obsidian motion architect

Owner's rule (2026-10-14): "add everything from HyperFrames, but make sure that you're the architect." HyperFrames'
own router says it is "the default output framework". In this repo it is not: this file decides, the Obsidian style
card (`skills/motion-studio/library/styles/obsidian-precision.md`) and brand (`skills/motion-studio/brands/obsidian.md`)
set the look, and HyperFrames supplies parts and workflows.

## 1. Pick the engine

| Job | Engine | Why |
|---|---|---|
| Obsidian brand film / ad in the house style (caret, hairline, container, cursor clicks) | Remotion, `obsidian-ad/brand-film` (see `obsidian-ad-style`) | the house build, sound pipeline and frame-analysis tooling live there |
| A 3D camera move: fly through a tunnel of sites, orbit, go under/around an object, see its back, dive into a portal | HyperFrames block (table below), restyled, rendered as a plate; or our three.js build (`src/Film9.tsx`, @remotion/three) when it must sit inside a Remotion film | real WebGL depth; blocks are proven starting points |
| Owner sends a video of himself talking → graphics on top | HyperFrames `talking-head-recut` (designed cards synced to his words) | the clip plays untouched; cards are HTML we style |
| Owner wants subtitles on his video | HyperFrames `embedded-captions` (quiet `anchor` rail by default) | |
| Website on a laptop/phone screen | corner-pin onto his generated laptop clip (OpenCV/ffmpeg), or block `vfx-iphone-device` / `macos-tahoe-liquid-glass` (real GLTF MacBook) | see section 4 for the html-in-canvas caveat |
| Product / SaaS video with the mid-video "made by Claude" reveal, driven by a voice-over | `.claude/skills/ai-reveal-product-video` (Remotion master + HyperFrames 3D plates; `vo_timing.py` for sync) | the owner's signature format |
| Short stat / chart / title sting, lower-third | HyperFrames `motion-graphics` + registry blocks, restyled | fast |
| Explainer from text, product promo from a URL, music-driven cut | HyperFrames `faceless-explainer` / `product-launch-video` / `music-to-video` | only when the owner asks for that format |

Default when unclear: Remotion house build for anything carrying the Obsidian brand; HyperFrames for parts.
Mixing is allowed: render a block to MP4 (or MOV with alpha) and place it in a Remotion film with `<OffthreadVideo>`.

## 2. Architect rules (apply to every HyperFrames output)
- **Never ship a block's default look.** Set its variables to Obsidian tokens before the first render:
  palette `#1A1B1F,#2A2B30,#9A9CA5,#DCDEE2`, backdrop `#000000`, edges/lines `#DCDEE2` at 0.3–0.4 opacity. Colour
  only comes from the hero screenshots or footage inside the block.
- **Type:** our fonts (Archivo expanded for display, body Archivo; JetBrains Mono only for code). Replace a block's
  Inter/default fonts. No purple gradients, no lime accents, no tracked all-caps eyebrows, no "A · B · C" labels —
  the AI tells Anthropic's frontend-design skill lists.
- **Motion:** our curves (settle `cubic-bezier(.3,0,.2,1)`, move `(.6,0,.2,1)`), blur-to-sharp arrivals, no white
  flashes between heroes (skip `flash-through-white` for hero-to-hero cuts). One bold move per scene.
- **Sound:** our kit (`obsidian-ad/brand-film/audio/sfx`, Kenney CC0) and mix rules (−16 LUFS), not the block's.
- **QA is ours:** contact sheet of every render (`skills/motion-studio/scripts/time_sheet.py`), frame-jump scan
  (`cut_scan.py`), stills before long renders — `skills/motion-studio/references/frame-analysis.md`.
- **Their update commands** (`npx hyperframes skills update`, `npx skills add …`) overwrite the vendored copies:
  ask the owner first, then re-apply the routing line in `.claude/skills/hyperframes/SKILL.md` (see SOURCES.md).
- Credit: blocks are Apache-2.0 (some shaders MIT, shaders.com); keep `vendor/hyperframes/LICENSE`.

## 3. Running HyperFrames in this cloud container
1. `bash skills/motion-studio/scripts/setup_hyperframes.sh` — installs the CLI in `/tmp/claude-0/hf`, FFmpeg/FFprobe,
   builds whisper.cpp, and prints the `HYPERFRAMES_BROWSER_PATH` export (the pre-installed headless shell).
2. New project: copy a block from `vendor/hyperframes/registry/blocks/<name>/<name>.html` to `<project>/index.html`
   (plus its `assets/`), add our images to `<project>/assets/`.
3. `python3 -I skills/motion-studio/scripts/hf_localize.py <project>` — blocks load GSAP/three from jsdelivr, which
   is blocked here; this pulls the same versions from npm and rewrites the paths. Without it the render fails with
   `sub_timeline_script_failure`.
4. `cd /tmp/claude-0/hf && HYPERFRAMES_BROWSER_PATH=… npx hyperframes render <project> -o <out>.mp4 -q draft -f 30
   --variables '{…obsidian tokens…}'`; final with `-q delivery -f 60`.
   Proven: `gallery-tunnel` with six of our hero sites, monochrome, 12 s → 65 s render (draft, software GPU).
5. Search blocks: `vendor/hyperframes/INDEX.md` (all 210 blocks + 237 components with descriptions).

## 4. Talking-head edits (owner's own video)
- Ask for: the video file, the platform (9:16 Reels / 4:5 feed / 16:9), and what he wants highlighted.
- Workflow: `talking-head-recut` (cards) or `embedded-captions` (subtitles). It transcribes locally with whisper,
  plans cards against the word timings, writes each card as HTML (we style them: section 2), renders the clip
  untouched underneath. Keep graphics off his face, out of the bottom caption third, and away from the outer 10 %.
- **Blocker in this environment (2026-10-14):** the whisper model downloads from huggingface.co, which the network
  policy blocks. Until the owner allows that domain (environment settings → Network access → Allowed domains), the
  transcription step can't run here. Never fake word timings. Alternatives: he runs `brew install whisper-cpp` on his
  Mac, or sends a transcript with timings.
- `html-in-canvas` blocks (vfx-iphone-device, macos-tahoe-liquid-glass, vfx-portal) need a newer Chrome than the
  headless shell installed here; `webgpu` blocks (chrome-orb, light-edge) need WebGPU. Test one frame
  (`npx hyperframes snapshot`) before promising them.

## 5. Blocks that answer the owner's "the camera is too flat" note
Mapped to the moves found in the reference re-scan (`skills/motion-studio/references/camera-moves.md`):

| Move we need | Block(s) |
|---|---|
| Fly through a tunnel of screens (Zelios phone tunnel) | `gallery-tunnel` (tested) |
| Orbit around an object, see its back, 360° | `frost-sequence-camera-orbit`, `product-turntable`, `vfx-iphone-device` (360° turntable), our `Film9.tsx` |
| Layers explode / stack (NIVO slabs) | `exploded-stack`, `cuboid-carousel`, `code-3d-extrude` |
| UI swings in from a steep angle (NIVO / nexl) | `ui-3d-reveal`, `transitions-3d` |
| Dive into an orb / portal into the next world | `vfx-portal`, `wireframe-portal-title`, `cosmic-orb`, `gravitational-lens` |
| Logo in real 3D (emblem) | `extruded-logo` |
| Camera language | `camera-dolly-zoom`, `rack-focus`, `whip-pan`, `cinematic-zoom` |
| Cards on a sphere / ring carousel | `carousel-orbit-1…5`, `carousel-circle-1…5`, `carousel-vision-1…5` |
