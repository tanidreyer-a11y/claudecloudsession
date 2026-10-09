# Worked examples (approved client films)

| File | Film | Notes |
|---|---|---|
| `smarttech-crossroads.film.js` + `.timing.js` + `.film_src.html` | SmartTech NXT "Crossroads" (founder approved) | Logo-anatomy story; brand bible palette/texture; `{{WORDMARK}}`/`{{AVATAR}}` are injected from SVGs extracted with `extract_brand_pdf.py` (client assets not bundled). |
| `adc-starlight-oliver.film.js` + `.film.html` | ADC Innovations "Starlight" cut on the Oliver voice | Starfield, constellation, orbiting task cards, slip, dive-through, "ALMOST." freeze, rising orbs, 3D invoice, decision card, loop. |
| `adc-precision-v2.film.html` | ADC "Precision, at work" v2 | Ball-on-a-line story, spline camera, zoom-throughs, 3D document scene with beam and lifting chips. |

To run one: copy into a build folder with `node_modules/@fontsource/*` fonts, a `timing.js` (or inline `W`), then
`node ../scripts/engine/stills.mjs …` / `render.mjs`. Paths to brand textures and fonts may need adjusting.
- Klick Kulture "Makes you click" (approved 2026-10-09): full Remotion source in `templates/brand-collage-film/` (src/KK.tsx), video `klick-kulture/KlickKulture-MakesYouClick-v2.mp4`.
