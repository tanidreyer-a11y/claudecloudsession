# Imagery — when the film needs photos or footage Claude can't draw

Code (HTML/SVG/Remotion) can make type, geometry, UI, light, particles and charts at a high level. It can NOT make
photographic products, food, people, places, fabric or perfume mist. Faking those with shapes looks cheap.
Image-led films need real or generated photography: agencies, web studios, perfume/beauty/fashion, food,
property, hospitality, fitness, retail.

**Reference model: Cobalt Campaign (ref06, NIVO).** In that film:
- the UI story is built in code;
- the *outputs* the AI "creates" are photographic ad creatives (athletes, shoes, apparel) on tilted cards;
- the cobalt UI is cool and the photos keep their warm tones, and that contrast is the look.

Cream Cascade, Desert Glass and the `photo-cards`, `no-ui`, `macro-to-wide`, `sensory-macro`, `place-reveal` and
`craft-reveal` slots all need imagery too.

## Decision order (always in this order)
1. **The client's own images first.** Intake Q6 asks for them every time. Real products and real places beat generated ones.
   Check resolution (at least 1.5× the size they'll be shown at), rights, and that people in them consented.
2. **Connected generators.** Check what this session can reach before promising anything:
   - list connected MCP tools and connectors (in Claude Code: the tool list / `ListConnectors`; search the registry with
     `SearchMcpRegistry` / `SuggestConnectors` for Higgsfield, Google Flow / Imagen / Veo, Runway, Luma, Midjourney, Ideogram,
     Freepik, Adobe Firefly, Canva);
   - known image paths seen so far: **Adobe for creativity** (Firefly boards, generative fill/expand, background removal,
     Adobe Stock licensing), **Canva** (`generate-image`, background removal), **Figma Weave** (model runs).
   - If one is connected: generate **4+ options per shot**, inspect every one (hands, faces, text, labels, logos, extra
     fingers, melted edges), keep the best and note which tool and prompt made it in the project README.
   - Generation uses the user's credits. Say roughly how many images you'll make before you start.
3. **No suitable connector → write prompts for the user** (format below). Say which tool each prompt is written for,
   list the file names to save as, and continue building everything else on placeholders of the right size and colour.
   Swap the placeholders in when the files arrive.
4. **Licensed stock** when the client prefers it (paid add-on): give the search terms and the licence to buy.
5. **Recommend connecting a tool** when image-led work will repeat (e.g. Higgsfield or Google Flow for video clips,
   Firefly for commercially safe images). It's the client's choice and their account. Never connect anything yourself.

## Rules
- Never generate or show: real people's likeness without consent, celebrities, competitor logos or products, real
  brand names on generated packaging, or fake testimonials or "customers".
- Generated people are fine as illustrative models. Don't present them as staff or customers. Avoid stereotypes, and
  vary age, skin tone and body type deliberately.
- Text inside generated images is usually wrong, so ask for none. Add all type in code.
- Keep one look across a set: same lens, light direction, time of day, grade and palette words in every prompt.
- Product shots of a client's real product must be photographs of the product, or edits of their photos (background
  swap, relight, expand). Never invent what the product looks like.
- Write image sources (client / tool + prompt / stock licence) into the project README.

## Prompt sheet format (what we send the user)
```
SHOT 03 — hero_croissant_macro.jpg   (tool: Google Flow / Imagen; also works in Higgsfield, Midjourney)
Aspect 4:5 · min 2048 px on the short side · make 4 variations
Prompt: Macro photograph of a freshly baked butter croissant breaking open, steam rising, golden flaky layers,
  warm morning window light from the left, shallow depth of field (85mm, f/2), crumbs on a dark walnut board,
  cream and terracotta tones, editorial food photography, natural, no text.
Negative: text, watermark, logo, hands, plastic look, oversaturated, extra objects, blurry crust.
Used in: 0:02–0:05 (sensory-macro hook), camera pushes in 1.0 → 1.12.
```
Per shot include: file name, tool, aspect and size, number of variations, the prompt
(subject · action · light · lens · surface · palette · style · "no text"), a negative prompt, and where it's used in
the timeline and how it moves (so they choose the right crop).

For video clips (Higgsfield / Flow / Veo / Runway), also give: duration (3–5 s), camera move ("slow dolly in"),
subject motion, fps 24/30, and "no cuts".

## Placing images in the film
- Treat stills like footage: slow scale (Ken Burns 1 → 1.08) and parallax layers (cut out the subject with background
  removal, then move it against the background).
- The photo carries its own colour. Grade the rest of the frame toward it, not the other way round.
- In UI-led stories (Cobalt Campaign), photos are the payoff of an action: a prompt is typed, then the creatives land.
- Frame and compose for 9:16 and 16:9 separately. Generate the wider version and crop.
