# Brand profile — SmartTechNXT
status: complete
last_updated: 2026-10-02
locked: true    # brand bible exists; its colours and type must be used on their films (and ONLY on their films)

## Business
- one-line: workflow automation (AI agents + integrations) for South African SMEs.
- website: smarttechnxt.com (blocked from the cloud session; use search snippets and the brand bible)
- audience: owner-managers and operations leads of small/medium businesses; pain = manual admin and dropped follow-ups.
- CTA: book a consultation.
- verified claims: only what is in the brand bible; anything numeric = to confirm.

## Assets
- brand bible: supplied PDF (2026). Logo extracted (never redrawn) → brands/smarttechnxt-assets/logo_wordmark.svg + avatar.svg (also in the repo at smarttechnxt-ad/brand/).
- palette: Navy #002548 (base) · Lime #B5D334 (accent, ≤ 5 %) · white · navy texture image img_p6_0.png.
- fonts: Museo Sans (licensed by the brand; web fallback Roboto). Text left-aligned.
- tagline: "SIMPLER SMARTER AUTOMATION", sized to the width of "SMARTTECH" in the lockup.
- imagery: none supplied (films were all geometry + UI).

## Voice & sound
- VO: ElevenLabs Multilingual v2 "Oliver Silk", Speed 0.87, Stability 30, Similarity 80, Style 48.
- music: ambient electronic pulse; swells at the turn.

## History
- Film "Crossroads" (smarttechnxt-ad/smarttechnxt-crossroads-16x9.mp4), 57 s — founder loved it. Recipe (retro-fitted):
  pain-turn-proof · upbeat-1-1.5 · spline-zoom-through · [zoom-through, object-becomes-object, line-led] ·
  brand-font · brand-tokens · geometry-only · smooth-parallax · ambient-electronic · concrete-pain.
- Earlier versions rejected: 88 s re-paced cut ("way too long, I get bored halfway"), slow fades, sparse frames.
- Next film for this brand: keep palette/type (locked) but change structure, camera signature and hook.

## Approved style: "Crossroads" (the founder loved it; reuse it for every SmartTech film)
- Files in this skill: `brands/smarttechnxt-assets/` = logo_wordmark.svg (per-glyph ids L0–L7, antenna, N0–N3, dot),
  avatar.svg, img_p6_0.png (navy texture), img_p6_1.png (lime), script-v9-crossroads.md (approved script).
  Film source: `examples/smarttech-crossroads.film_src.html` (+ `.film.js`, `.timing.js`) — HTML engine; inject the
  SVGs at `{{WORDMARK}}` / `{{AVATAR}}`. Style Card: `library/styles/crossroads.md`.
- Locked look: navy #002548 base + texture + faint grid, lime #B5D334 only as thin lines/dots/glow (≤ 5 %), white type,
  Museo Sans (Roboto fallback), left-aligned, tagline sized to the width of "SMARTTECH".
- Locked motion: monotone spline camera, zoom-throughs, object-becomes-object, line-led, 60→30 fps blur, word-synced.
- For the NEXT SmartTech film: keep the look and the motion language; change the story spine, the hook and the
  signature transition (anti-repetition). Run `scripts/recipe.py --brand smarttechnxt --base crossroads`.
- Never use this palette, logo or font for any other client.
