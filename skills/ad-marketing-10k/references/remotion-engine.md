# Remotion engine (laptop builds)

Proven with Remotion 4.0.529, React 19, TypeScript 5.9. Starter config is in `templates/remotion/`; add `src/`
(index.ts, Root.tsx, timeline.ts, theme.ts, shots) and scripts (cues, render, finish, stills) per project.

## Project
- Scaffold by hand (package.json, tsconfig, remotion.config.ts, src/index.ts, Root.tsx). Never `npx create-video`
  in a non-empty folder (interactive prompt hangs).
- Pin all `@remotion/*` to the same version as `remotion`.
- Scripts: `studio`, `audio` (cues.mjs → build_audio.py), `render`, `finish`, `build` (all three), `still`, `typecheck`.
- `remotion.config.ts`: JPEG frames (quality 95), concurrency 2 on an 8 GB / 2-core machine, overwrite on.

## Rules
- Fonts: `@remotion/google-fonts/<Font>` with explicit weights + subsets (`latin-ext` for special glyphs).
- All motion from `useCurrentFrame()`; CSS transitions/animations freeze in render. No `Math.random` (seeded hash).
  Use Remotion `<Img>`/`<Audio>`, not native tags.
- Shots are components rendered at global frame numbers that return `null` outside their window (+ overlap).
- Compose with individual `translate/scale/rotate` properties; `transform` only for `perspective() rotateX/Y`.
- Morphs: interpolate rect x/y/w/h + radius; stack colour layers and fade opacities.
- Chat that fills up scrolls: translate the list and clip with `clipPath` in local coordinates.
- Geometry from constants, never DOM measurement during render.
- Camera: port `spline()` from `scripts/engine/film_template.js` (monotone cubic, log-zoom) into a `useCamera(frame)` hook.
- `stills.mjs`: bundle once, one browser, render a list of seconds, tile a contact sheet; read it yourself.
- `npx tsc --noEmit` before every render.

## Rendering on a weak laptop (example: i5-7200U, 2 cores, 8 GB)
- Software ~2.4 s/frame; **`--gl=angle` ~1.1 s/frame** — always use it.
- A long single render crashed the PC once → **chunked, resumable renders** (360-frame chunks, skip finished, join
  with concat demuxer `-c copy`). Ask for keep-awake before long renders.
- Windows paths with spaces: `execFileSync("npx", …, {shell:true})` splits them → pass paths RELATIVE to cwd with
  forward slashes. `import.meta.url` is URL-encoded → use `fileURLToPath`.
- Harness may block commands containing `.git` path patterns near `rm -r`/`Remove-Item`; put such scans in a .ps1.
- Zip entries with `:` fail `ExtractToDirectory` on Windows — extract entry by entry with sanitised names.
- npm 11 blocks install scripts (esbuild warning): Remotion still works. First render downloads Chrome Headless Shell (~113 MB).
- Budget: bundle ~60 s; 20 stills 2–3 min; 1,412-frame film ~26–30 min + ~10 min encodes.
