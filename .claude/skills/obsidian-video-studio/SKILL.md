---
name: obsidian-video-studio
description: THE one entry point for every Obsidian video job — ads, marketing and product videos, "made by Claude" reveals, voice-over ads with HUD and keyword captions, edits of the owner's own talking-head footage, captions/subtitles, motion graphics, laptop/device mockups, sound design and finishing. Read this first; it picks the format, the engine (Remotion house build or a HyperFrames block/workflow), the look from the styles library, and runs LISTEN → PLAN → STORYBOARD → BUILD → SOUND → FINISH → QA → DELIVER. Detail files it points to: obsidian-motion-architect (engines/HyperFrames), ai-reveal-product-video (reveal format), obsidian-ad-style (house look).
---

# Obsidian video studio

Owner's brief (2026-10-14): one skill for "ads, marketing videos, editing videos of myself… motion, backgrounds,
sounds, animated and physical transitions". Keep the styles library; this file adds the toolkit on top.
Method sources (credited, not copied): Level 5 Workflow Guide (@visionaryclown.tv) and Motion as Code
(pdoom-video by mexicat, MIT, `vendor/pdoom-video`). Every rule below is ours to apply in Obsidian's look.

## 1. Pick the format
| Owner asks for | Format | Built with |
|---|---|---|
| Product/SaaS ad that turns halfway: "this was made by Claude" | AI-reveal | `.claude/skills/ai-reveal-product-video/SKILL.md` (Remotion master + 3D plates); reference build `src/Film10.tsx` |
| Voice-over ad, every keyword hits a visual + sound, HUD look | Voice HUD ad (Level 5 method) | Remotion + `src/fx` kit (Hud, Captions, Finish) + `sfx_code.py`; demo `src/FxDemo.tsx` |
| Cinematic essay / music-led film made of "plates" | Plates film (Motion as Code) | Remotion scenes as pure functions of time, `lineOf`/`wordOf` anchors; engine ideas in `vendor/pdoom-video/docs` |
| Obsidian brand film / client film "in our style" | House ad | `.claude/skills/obsidian-ad-style` (caret, hairline, hero container, cursor clicks) |
| His own talking-head video → graphics on top | Talking-head recut | HyperFrames `talking-head-recut` (cards) restyled; needs transcription (section 10) |
| Subtitles on his video | Captions | HyperFrames `embedded-captions` (`anchor` rail) or our `Captions` over `<OffthreadVideo>` |
| His website on a laptop/phone in a room | Device composite | corner-pin onto his generated clip (OpenCV/FFmpeg), or blocks `vfx-iphone-device` / `macos-tahoe-liquid-glass` |
| Short sting, stat, chart, lower-third (< 10 s) | Motion graphic | HyperFrames `motion-graphics` + registry blocks, restyled |
Unclear → ask one question with the 2 likeliest formats. Engine details and HyperFrames setup:
`.claude/skills/obsidian-motion-architect/SKILL.md`.

## 2. Workflow (never skip a step; the owner approves at step 4)
1. **LISTEN** — voice-over + exact script (one beat per line). Mark the script:
   `*word*` keyword (visual + blip + bracketed caption), `**word**` big word (808 hit, flash card, shake),
   line starting `!` = the drop (silence before it, riser → drop).
   `python3 -I skills/motion-studio/scripts/vo_timing.py vo.wav script.txt timing.json`
   → line/word times, flags, WPM, 30 fps loudness envelope (for the HUD waveform). No voice yet → build to
   150 wpm and re-time later. Never invent a voice or fake word timings.
2. **PLAN** — one scene per idea; every keyword gets a visual AND a sound; 1–2 s of near-silence before the
   biggest line, then the drop. Write `cue_sheet.md`: time · words · visual · transition out · camera/3D · sound.
3. **STORYBOARD** — build the scenes roughly, render ONE real frame per scene
   (`node stills.mjs <COMP> out/board.jpg t1,t2,…`) and look at it yourself first.
4. **GO** — show the owner the board + cue sheet. Full render only after "go" (or when he already said "just make it").
5. **BUILD** — Remotion in `obsidian-ad/brand-film` (1080×1920, 60 fps → 30 fps blend). Place beats with
   `lineOf(T, "phrase")` / `wordOf(T, "word")`, never hard-coded seconds. Cuts land 0.18 s before the line.
6. **SOUND** — `sfx_code.py auto timing.json cues.json` → edit by hand → `sfx_code.py mix cues.json mix.wav --voice vo.wav`.
7. **FINISH** — per-moment effects in Remotion (`<Finish>`), whole-film look in `post_fx.sh`, then `finish.sh`.
8. **QA** — contact sheet of the full render, `cut_scan.py` for frame jumps, a 15 fps strip of the key moment,
   loudness check. Re-render what fails (checklist in section 9).
9. **DELIVER** — MP4 per format + captions for Instagram (≤ 5 hashtags), LinkedIn, X via `obsidian-content`.

## 3. The kit — `obsidian-ad/brand-film/src/fx` (import from `"./fx"`)
| Piece | What it does | Use |
|---|---|---|
| `LOOKS.obsidian / signal / plotter` | colour + font tokens | obsidian = default; the others only when asked (section 7) |
| `Hud` | corner brackets, title, timecode + WPM, live transcript on the left, waveform timeline with keyword ticks, drop dots and playhead, handle, chapter | voice HUD ads, "behind the build" posts |
| `Captions` | word-by-word, 4-word phrase chunks, `[keyword]` in accent, big words punch, "05.58s ▸ WORD" readout | any voiced video; set `brackets={false}` for plain subtitles |
| `Finish` | grain, vignette, chromatic aberration, slice glitch, bloom, slow push-in, shake + CA spike on `hits` | wrap the whole film; hits = big-word times, glitches = drop/cuts |
| `Grain` `Vignette` `Chroma` `Slices` `Bloom` | the same effects one by one | |
| Backgrounds | `LightPools` (drifting light), `FlowField` (noise strokes), `Warp` (starfield → hyperspace on a dive), `Dust`, `GridFloor`, `DotRipple` (ripples out on a beat) | behind type and UI; plus `src/gl.tsx` `World` (domain-warped clouds, ink wipes) and `Balls` (liquid metaballs) |
| Transitions | `liquid` (metaball flood), `slices` (tear + RGB split), `whip` (pan with directional blur), `through` (fly through the old scene) | `<TransitionSeries>`; see section 4 |
| `@remotion/motion-blur` | `<CameraMotionBlur>` real motion blur, `<Trail>` echo trails | fast moves and whips only (expensive) |
| `@remotion/three` + three.js | real 3D (extruded text, objects, camera flights) | pattern in `Film10.tsx` `ThreeD` |
| `@remotion/paths`, `@remotion/shapes`, `@remotion/noise` | SVG morphs (`interpolatePath`), shapes (star, pie, polygon…), organic motion | shape transitions, line draws, wobble |
Proof: `FX-DEMO-signal` and `FX-DEMO-obsidian` in `src/Root.tsx` (stills checked 2026-10-14).

## 4. Transitions catalogue (motion, never a plain cut off the beat)
- **Ours (render here):** `liquid`, `slices`, `whip`, `through`; Film10 goo; blur-to-sharp arrivals.
- **Remotion built-ins (render here):** `fade`, `slide`, `wipe`, `flip`, `clockWipe`, `iris`, `pushCut`.
- **Remotion shader set — test one frame first:** `crosswarp`, `ripple`, `filmBurn`, `dreamyZoom`, `zoomBlur`,
  `crossZoom`, `dissolve`, `linearBlur`, `blurSlide`, `swap`, `bookFlip`, `zoomInOut` use html-in-canvas, which
  the headless Chrome installed here may not support.
- **HyperFrames blocks (rendered as plates):** `gooey-split`, `domain-warp-dissolve`, `cross-warp-morph`,
  `gallery-tunnel` (tested), `ui-3d-reveal`, `transitions-3d`, `whip-pan`, `camera-dolly-zoom`, `vfx-portal`;
  full list `vendor/hyperframes/INDEX.md`, camera moves `skills/motion-studio/references/camera-moves.md`.
- **Physical feel:** time transitions with `springTiming({ config: { damping: 14–18, mass: 0.6 } })` so they
  overshoot and settle; things with weight land with a shake (`Finish` hits) and a low sound.
- One bold transition per scene change; the biggest one on the drop. No white flashes between heroes.

## 5. Sound — `skills/motion-studio/scripts/sfx_code.py` (all made in code, no samples needed)
Effects: `whoosh` `blip` `hit808` `riser` `drop` `pop` `glitch` `typing` `stamp` `ping` `buzz` `lock` `punch`
`impact` `tick`, plus any Kenney CC0 sound as `"kenney:<name>"` (`obsidian-ad/brand-film/audio/sfx`).
- `demo out/` writes one wav per effect to audition.
- Rules: no music bed under a voice HUD ad (Level 5); whoosh into each scene, blip on keywords, 808 on big words,
  riser → silence → drop on the `!` line, typing under code, stamp/lock when something locks in.
- Mix: effects bus ducks up to 7 dB under the voice, voice ≈ 8 dB above effects; master **−14 LUFS / −1 dBTP**
  for social (`--lufs -16` for the website). Tested: −14.0 LUFS, −1.4 dBTP.
- House films keep their own beds (`audio/build_*.py`) and `LUFS=-14 finish.sh` for social.

## 6. Finishing
- In Remotion (`<Finish>`): constant CA 0.8–1.5 px, spike to 10+ px on hits; slice glitch 0.15–0.35 s on the drop
  or a hard cut; grain 0.06–0.1; vignette 0.4–0.6; slow push-in 1.03–1.05 across a scene.
- Whole film: `skills/motion-studio/scripts/post_fx.sh in.mp4 out.mp4 bloom,halation,ca,grain,vignette[,trails]`.
- Last: `[LUFS=-14] skills/motion-studio/scripts/finish.sh master.mp4 out/name` (grade, grain, loudness, web copy).

## 7. Looks — the styles library stays the source
Default is **Obsidian Precision** (`skills/motion-studio/library/styles/obsidian-precision.md`, monochrome,
Archivo, white emblem). Reference looks, only when the owner asks for that energy:
`signal-hud.md` (Level 5: warm black, signal orange, Unbounded/Space Grotesk/JetBrains Mono, HUD) and
`plotter-ink.md` (pdoom: ink, bone, hazard orange, Archivo/Cormorant/Plex Mono, plotter lines). All other cards
in `library/styles/` still apply as before. Fonts are local in `public/fonts` (OFL) and registered in `src/fonts.ts`.

## 8. Rules that don't bend
- One idea on screen; 2–6 words per screen; inside the middle 80 % (phones crop); captions off the bottom UI third.
- Every keyword: a visual and a sound within 2 frames of the word.
- No AI-design tells (purple gradients, Inter, lime accents, tracked all-caps eyebrows).
- Claude marks only per the `obsidian-content` Claude-topic rule, with the non-affiliation line.
- Never other studios' footage or screenshots in anything published; never a real brand without permission.

## 9. QA checklist (before sending anything)
- [ ] Board approved (or owner said go) · [ ] every transition is a motion · [ ] every keyword lands ±2 frames
- [ ] nothing cropped at 9:16 · [ ] no text over his face (talking-head) · [ ] −14 LUFS / ≤ −1 dBTP measured
- [ ] contact sheet + cut scan looked at · [ ] flat colour frames checked at high contrast for seams/banding

## 10. Tools: installed vs blocked (this cloud container, 2026-10-14)
Installed (re-install in a new container: `npm i` in `obsidian-ad/brand-film` with node_modules →
`/tmp/claude-0/rt/node_modules`, then `bash skills/motion-studio/scripts/setup_hyperframes.sh`): Remotion 4.0.529 +
three/r3f/@remotion/three, motion-blur, transitions, paths, shapes, noise, layout-utils; HyperFrames CLI 0.8.157;
FFmpeg; whisper.cpp; faster-whisper 1.2.1 + onnxruntime (pip); bun; uv.
Blocked: **huggingface.co** (all speech models: whisper, faster-whisper, CTC alignment, Kokoro TTS) → word-accurate
timing and talking-head transcription can't run here; `vo_timing.py` falls back to pause-snapping. Fix: allow
huggingface.co in the environment's network settings, or run on his Mac. **ElevenLabs** = paid external service;
the voice comes from the owner. jsdelivr is blocked → `hf_localize.py` before any HyperFrames render.

## 11. Lessons (add new ones at the bottom)
- SVG blur/threshold filters (goo, feTurbulence grain) render in raster tiles → faint horizontal seams on flat
  colour. Use canvas (our `liquid`, `Grain`) for anything that floods the frame.
- FFmpeg `alimiter` auto-levels to 0 dBFS unless `level=disabled`; limit at 4× sample rate for true peak.
- CSS `borderLeft: "2px solid"` resets the colour to currentColor; pass the colour in the shorthand.
- Captions in 4-word chunks read; full lines on 9:16 become 3-line walls.
