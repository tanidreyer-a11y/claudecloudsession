# Brand extraction from a brand bible PDF

Run `python3 scripts/extract_brand_pdf.py <bible.pdf> <out_dir>` (needs `pip install pymupdf`). It:
1. Prints every page's text (find: colours/HEX, fonts, logo anatomy, tagline rules, alignment rules, do/don'ts).
2. Lists vector drawings per page with fill colours and bounding boxes (find the logo page and the reversed
   on-dark version).
3. Writes `logo_wordmark.svg` from the largest logo page: one `<path>` per glyph, classified `letter`, `antenna`/`bar`,
   `nxt`/accent, `dot` — so each part can animate independently. Colour it via CSS classes.
4. Extracts embedded raster images (background textures, photos), converting CMYK→RGB PNG.
5. Lists embedded font names (e.g. MuseoSans-100…900) — **do not extract commercial fonts**; use the bible's
   approved web fallback (often Roboto) unless the client supplies a licensed file.

Then:
- Preview logo + avatar + textures on the brand background in a screenshot before using them.
- Pad SVG viewBoxes so strokes aren't clipped (e.g. `-4 -4 206 206`).
- Record a brand sheet in the build folder: HEX colours, fonts, alignment, tagline rule, logo-on-dark colourway.
- Use the bible's logo-anatomy text for the concept (see story-and-concept.md).

If no bible: ask for a vector logo (SVG/AI/EPS/PDF). Raster-only → use it unchanged and ask for vectors before final.
