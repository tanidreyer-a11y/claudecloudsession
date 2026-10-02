# Intake — the creative brief (first reply, every time)

Send this in ONE message before any script, code or plan. Show options as short lists the client can pick from
(numbers or names are fine as answers). Under each question put the recommended default in [brackets]; "default"
or a skip means take it. If they pasted a full brief, ask only what's missing. If they say "just start", take every
default and list them.

Fill the brand profile from the answers (`brands/<slug>.md`, copy `_template.md`); an existing profile means skip
what's already known and confirm only what may have changed.

---

**A. The business**
1. Company, website, what you sell, in one sentence.
2. Who is the viewer (role / type of customer) and the ONE problem or desire this video should hit?
3. What should they do after watching? (book, buy, visit, call, sign up, follow)
4. Which facts can we show? (numbers, awards, certifications, prices, opening hours) — only true, confirmed ones go on screen.

**B. Brand assets**
5. Brand bible / logo (vector: SVG, AI, PDF) / colours / fonts? Attach what you have. [we extract from the PDF; we never redraw a logo]

**C. Images & footage**  ← always ask; image-led styles depend on it
6. **Do you have any photos or video you'd like to use?** Attach them now (products, food, the space, the team,
   work you've done, screenshots of your app/website). Tell us which ones you have the rights to use.
7. If we need more images than you have, how should we get them?
   - a. **You'll shoot them** (we send a shot list)
   - b. **Generate with AI through a connected tool** (we check what's connected: Adobe Firefly, Canva, Higgsfield, Google Flow…)
   - c. **We write the prompts, you generate them** in Google Flow / Higgsfield / Midjourney and upload the results
   - d. **Licensed stock** (paid add-on, e.g. Adobe Stock / Pexels / Artgrid)
   - e. **No photos** — keep it graphic (type, shapes, UI)
   [a for real products/people; b or c for mood, places and concepts]
8. Should real people appear? (your team / customers with consent / AI-generated people / none) [none, unless you supply them]

**D. The feel** — pick from the library or describe in your own words
9. Vibe — rate 1–5, or pick words: energy (calm ↔ hype) · warmth (cool/technical ↔ warm/human) · density (minimal ↔ packed) ·
   realism (abstract graphics ↔ photographic) · polish (handmade ↔ luxury). [3 · 3 · 3 · 3 · 4]
10. Looks you like — pick any (or none):
   Midnight Signal (dark, calm, one glowing object) · Paper Lab (white, hairlines, data that heals) ·
   Deep Glass (navy frosted glass, giant word) · Cream Cascade (cream paper, one thing multiplies) ·
   Cobalt Campaign (cobalt + real photos as AI output — image-led) · Sunset Prompt (sunset gradients, word swaps, Shorts) ·
   Lavender Desk (pastel professional, verb chapters) · Desert Glass (landscape photo behind glass UI) ·
   Kinetic Pop (bold type on the beat). Mixing is normal: we cross-breed them. [we'll propose 3]
11. Pace: slow cinematic · measured · upbeat on the beat · short punch (10–20 s). [measured]
12. Story: problem → solution · a day in the life · how it's made · one input → many results · launch teaser ·
    customer story · logo story. [we'll propose]
13. Any videos/brands you love (links or screen recordings) and what exactly you like? Anything to avoid?

**E. Voice & sound**
14. Voiceover? ElevenLabs (we suggest a voice + settings) · your own recording · none (text + music). Script by us or you?
    [ElevenLabs, we write it, you approve]
15. Music: ambient · cinematic · electronic pulse · acoustic/organic · upbeat pop · none. Licensed track OK (paid add-on)? [we propose]

**F. Output**
16. Where will it run? website · LinkedIn · Instagram/TikTok · YouTube · WhatsApp status · in-store screen · pitch deck.
17. Format(s) and length: 16:9 · 9:16 · 1:1 · 4:5 — 15 / 30 / 45–60 / 90 s. [9:16 30 s + 16:9 45 s]
18. Language(s) and region (spelling, currency, accents). [English, South African]
19. Deadline and budget band; are paid add-ons OK (stock, licensed music, AI image/video credits, voice credits)?
    [we'll always show the best option and its cost; you decide]

---

After the answers:
1. Restate in 5 lines: "Reading this as …" + defaults assumed.
2. Translate answers into the recipe-engine inputs: axes, `--ui` (is there a real product UI?), `--imagery`
   (yes if Q6 has assets OR Q7 is a/b/c/d), brand slug.
3. Run `scripts/recipe.py` → present 3 recipes (see recipe-engine.md) → client picks or mixes.
