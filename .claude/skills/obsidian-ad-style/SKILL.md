---
name: obsidian-ad-style
description: Obsidian's house ad style ("Obsidian Precision") — use for ANY Obsidian video, ad, reel or brand film, and for any client film the owner wants "in our style". Monochrome UI world, white emblem, one fixed hero container, the caret/hairline motif, cursor clicks that cause the next beat, blur-to-sharp transitions, recorded UI sounds. Also covers how to study a reference ad frame by frame and turn it into a style without replicating it.
---

# Obsidian ad style

Read, in this order:
1. `skills/motion-studio/library/styles/obsidian-precision.md` — the style card (palette, type, transitions with
   timings and curves, UI, sound, signature moves, do_not_copy).
2. `skills/motion-studio/brands/obsidian.md` — the brand (monochrome, white emblem, voice, what the owner approved
   and rejected, film history).
3. `skills/motion-studio/references/frame-analysis.md` — how to read a reference and our own render precisely
   (motion strips, measure-and-convert, side-by-side sheets, the frame-jump scan, stills before full renders).
4. `skills/motion-studio/references/lessons-learned.md` lessons 64–76.
5. `.claude/skills/remotion-best-practices` for Remotion API details (transitions, audio, render).

Working build: `obsidian-ad/brand-film` (Remotion 4.0.529, 60 fps render → 2-frame blend → 30 fps; `--gl=angle`).
Reference implementation of the style: `src/Film8.tsx` (OBS-SCRATCH). Shared parts (cursor, cards, emblem, lockup,
train-window tracking) are exported from `src/Film7.tsx`. Sound: `audio/build_scratch.py` (numpy bed + Kenney CC0 UI
sounds in `audio/sfx/`). Tools: `skills/motion-studio/scripts/{strip.sh, compare_ref.sh, cut_scan.py, cutout.py,
key_alpha.py}`.

Rules that cost reworks:
- No white flashes between heroes; no second copy of an element at a cut; no headline size change across a cut;
  in-out easing on anything that covers the frame.
- Measure sizes from the reference and convert to 1920×1080 — first passes come out ~50 % too small.
- Copy mechanisms, never a reference's beats, lines, props or layouts. The owner's own work replaces reference
  images before anything is published.
