# Remotion template (neutral, theme-driven)

Proven with Remotion 4.0.529 + React 19 + TypeScript 5.9. Rendered the Phase-3 test film (tests/tally-ai/).

```
src/theme.ts        ONE theme object — fill it from the chosen recipe + brand profile (defaults are neutral greys)
src/timeline.ts     named keys in seconds (with VO: aligned word times); audio reads the same keys
src/fonts.ts        local OFL fonts from public/fonts (works offline). Add weights you use
src/lib/motion.ts   EASE curves, prog(), springAt(), enter() (2–3 props, faster exits), breathe(), hash()
src/lib/camera.ts   monotone spline camera with log zoom → worldTransform()
src/components/     Layers (Background · Grade · Finish = grain + vignette), Type (WordReveal · WordRoll · typed),
                    UI (Panel glass/hairline/solid · Pill · Icon SVG), Photo (Ken Burns + "IMAGE PENDING" placeholder)
src/Film.tsx        a small neutral demo — replace the scenes per project, keep the 5-layer order
```

Start a project: copy this folder, `npm i`, edit theme.ts and timeline.ts, write scenes in Film.tsx, then
`npx tsc --noEmit` → `npx remotion studio` (laptop) or render stills and look at them.
Render: `npx remotion render src/index.ts Film out/raw.mp4 --gl=angle` (laptop). In sandboxes, add
`--browser-executable=<headless_shell>`. Mux the audio, then `bash <skill>/scripts/finish.sh out/master_raw.mp4 out/name 25`.

Rules: production.md §2 and references/remotion-engine.md (chunked renders on weak laptops, Windows path gotchas).
Avoid empty frames: start each scene's entrance a few frames BEFORE its cut.
