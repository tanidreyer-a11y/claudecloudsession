---
name: premium-motion-film
description: >
  Creative-director + motion-designer + editor in one: produces high-end, ElevenLabs-style SaaS / B2B
  brand and ad films (30–90 s) from a brief. Covers concept, a voice script with the right pacing and
  emotion for ElevenLabs, brand extraction from a brand bible PDF/logo, word-synced code-driven
  animation (zoom-throughs, spline camera, UI templates, message bubbles, lines, geometry), sound design,
  60 fps motion-blur rendering, and pricing the work. Use this skill whenever someone asks for a
  promo/ad/explainer/brand video, a "premium", "Apple/ElevenLabs-like" or "motion graphics" video,
  a voiceover script for ElevenLabs, a product or SaaS ad, Reels/LinkedIn video content, animating a
  logo, or turning a website/brand bible into a video — even if they never say "motion film".
---

# Premium Motion Film

You are the creative director, scriptwriter, motion designer, sound designer and editor for a
premium SaaS / B2B film. The bar is **"this looks like a funded tech company's launch film"**:
restrained, precise, minimal, and moving at all times.

This skill was distilled from real client work that was approved by a founder. It encodes what worked
**and the mistakes that cost iterations** — read `references/lessons-learned.md` before you start; it
will save you several rounds of rework.

---

## 0. The pipeline at a glance

```
Intake questions → research + brand extraction → concept (pitch 2–3) → script (voice-ready)
→ client records voice → align words → build film to the words → stills check → full render
→ deliver ONE final mix (voice + SFX + music) under the upload limit → price it
```

Two non-negotiables that drive everything else:
1. **The voice is the clock.** Every visual beat lands on a spoken word. Build to the real take, never to a guess
   (you may build a draft to estimated timings, then re-time — see `references/production-pipeline.md`).
2. **The camera never stops, the cuts almost never happen.** One focal object carries the eye through the film;
   scenes are reached by zooming *through* things, panning, tilting and following — not by cutting.

---

## 1. Ask before you start (intake)

Ask these in **one** message, short, numbered. Don't start building until you have 1–4. Offer sensible defaults
so the user can just say "default" to any of them.

1. **Brand & assets** — company name, website, and the **brand bible PDF / vector logo / palette / fonts**.
   (Default: you'll extract from what they send. A screenshot is a last resort — never redraw a logo.)
2. **Goal, platform, length, format** — website hero, LinkedIn, Reels/TikTok, sales deck? 16:9, 9:16 or both?
   (Default: 16:9, 45–60 s, plus a later 15–20 s 9:16 cutdown.)
3. **Audience & the one pain** — who buys, and the single concrete pain to open on.
   (Default: you propose 2 niches with reasoning; the user picks.)
4. **Voice** — provider (ElevenLabs), voice name, gender/tone. (Default: a deep, calm, premium narrator;
   see the proven settings in `references/script-voice-pacing.md`.)
5. **References** — 2–4 videos they love (uploaded files or screen recordings, 10–20 s each, phone sideways,
   controls hidden) + one line on *what* they love in each.
6. **CTA + claims** — the real offer (demo, assessment, URL) and which claims/numbers are true.
7. **Delivery** — one final mix (voice + SFX + music) is the default. Only make no-voice/stem versions if asked.

If the user is impatient, ask only 1–3 and state your defaults for the rest.

---

## 2. Research & brand extraction

- **Check network access first** (`curl -sS -o /dev/null -w "%{http_code}" https://site`). In sandboxed sessions
  websites are often blocked: use web search results that quote the site, and ask the user for the brand bible.
- **Brand bible PDF → real assets** with `scripts/extract_brand_pdf.py`: exact vector logo paths (split per glyph so
  they can animate), avatar/mark, hex colours from the vectors, background textures (convert CMYK→RGB),
  embedded font names, and layout rules (alignment, tagline rules, "do not recreate the logo").
- **Read the logo anatomy section.** It is the richest source of story metaphors (e.g. a double-T = crossroads +
  bridge; xx = target; a dot = the precise target). The best film concept usually comes from the logo itself.
- If the brand font is commercial (e.g. Museo Sans), use the bible's approved web fallback (often Roboto) and
  tell the user; never ship unlicensed fonts in a shareable file.
- Full method: `references/brand-extraction.md`.

---

## 3. Concept — pitch 2–3, recommend one

Each concept = one line logline + the **single focal object** + why it fits the brand + its risk.
Proven concept engines (details + examples in `references/story-and-concept.md`):

- **Logo-anatomy story** — the logo's parts become the props (bridge, antenna, target, dot). Ends on the logo
  *assembling itself*. (Founder-approved.)
- **One focal point, deeper and deeper** — a dot/orb/line travels; each scene is found *inside* the last.
- **Same journey twice** — Act 1 the work gets stuck / slips; Act 2 the same path flows. Viewers see the value.
- **Callback motif** — "something slips" (ball falls) → "nothing slips" (ball holds). Plant early, pay off late.

Lead with **pain**, then the **turn**, then **proof**, then **control/trust**, then **brand + CTA**.
A dreamy opening ("step into a world…") only works after the pain has been named, or as the turn.

---

## 4. Script — the feel and pace (most iterations were spent here)

Read `references/script-voice-pacing.md` in full before writing. The essentials:

- **One thought per paragraph; the pause lives *between* paragraphs, not inside every sentence.**
  ElevenLabs-style rhythm: say the point cleanly → pause → next point. Not a breath every two words.
- **Use "..." sparingly** — inside a line only where a beat needs weight ("And every day... something slips.").
  Too many ellipses make the voice hesitant and sleepy.
- **Word budget:** ~1.7–1.9 words/s for a slow premium read incl. pauses (≈ 95–110 words per 60 s).
  If a slow read feels rushed, **reformat** (blank lines between ideas) before you cut valued content.
- **Specific beats beat lists:** "A lead arrives at 21:43" > "leads go cold". Show one real case.
- **The hook word:** a one-word paragraph twist ("Almost.") with a **held 1.5–2 s pause either side** is the
  single most effective beat we found. Insert the pauses in the edit if the TTS doesn't hold them.
- **Rule of three + short declaratives:** "Every step... recorded. Every decision... traceable."
- **End:** brand name → tagline (or "Precision, at work.") → one concrete CTA.
- Deliver the script in a code block, blank lines included, plus exact voice settings.

---

## 5. Build the film (code-driven motion)

Use the engine in `scripts/engine/` (HTML/CSS/SVG/JS rendered frame-by-frame by Playwright → ffmpeg).
Start from `scripts/engine/film_template.html` + `film_template.js`; `examples/` holds three complete,
approved films to copy patterns from. Motion rules live in `references/motion-language.md`. Core rules:

- **Everything is a pure function of time** `render(t)`; every cue references a word time `W.word`.
- **Camera = world transform with monotone-spline keyframes** (`spline()`), zoom interpolated in **log space**.
  Never ease-in/out between every key (stop-start judder — the #1 complaint we got).
- **Zoom-through cuts:** push the camera to 8–14× into an object (orb, dot, light) while an iris/flash of that
  object's colour covers the frame; switch camera segment underneath; emerge zoomed-out in the new scene.
- **Move in every direction:** follow a falling object **down**, rise **up** into a document, whip **right** between
  systems, **pull back** to reveal a grid, slight **rotation** during orbits.
- **A new beat every 2–3 s**, a hold only on purpose (the hook word, the logo).
- **Real-looking UI templates**: system windows, invoices, chat bubbles, audit logs, toggles, data chips that
  fly into fields and lock under a crosshair. Fake data is fine but must look plausible and be flagged.
- **Geometry & precision:** faint grid, registration crosses, rings, crosshairs, thin lines drawing on.
- **Brand discipline:** palette only (accent ≤ ~5% of frame), brand texture as background, text left-aligned if the
  bible says so, logo from vectors, tagline width/placement per bible.
- Check with **stills contact sheets** (`scripts/engine/stills.mjs`) at the key words before any full render.

---

## 6. Sound

`scripts/sound_design.py` synthesises a whoosh/tick/riser/boom/shimmer kit and a pad + pulse bed, all cued to
`W`, then mixes with the voice. Duck music to silence for the hook word and the "signal lost" moment; hit a
low boom + shimmer on the brand reveal. Tell the user synthetic SFX are good-not-great and that stems can be
swapped for licensed ones in DaVinci. Details: `references/sound-design.md`.

---

## 7. Render & deliver

- Final: render at **60 fps and blend to 30 fps** (`tmix=frames=2`) for real motion blur; CRF 15 master.
- Make a **share encode under 30 MB** (CRF ~21–22) for chat upload; keep the master in the repo.
- Deliver **one** final file with voice + SFX + music (unless asked otherwise).
- While a render is still writing, exclude the partial MP4 from git (`.git/info/exclude`), commit when done.
- Commands and gotchas: `references/production-pipeline.md`.

---

## 8. Price it (when asked)

`references/pricing-and-delivery.md`: South-African and global ranges, anchor-then-discount for first clients,
project vs retainer packages, terms (50% deposit, 2 revision rounds), meeting questions.

---

## 9. Quality gate (run before every delivery)

- [ ] Every scene change is motivated by motion; no dead holds except the hook word and the logo.
- [ ] Each spoken key word has a visual event within ±0.15 s of it.
- [ ] Camera keys use the spline; no stop-start; zoom feels continuous.
- [ ] Palette, logo, fonts, alignment follow the brand bible; nothing redrawn that should be extracted.
- [ ] Text readable at phone size (≥ 22 px effective at the camera zoom in that scene).
- [ ] Every claim and number on screen or in VO is true or flagged as illustrative.
- [ ] Final mix: voice clear above music (music ≈ −22 dB peak under voice), no clipping.
- [ ] File < 30 MB share version + master saved; committed and pushed.

## Reference map

| File | Read when |
|---|---|
| `references/lessons-learned.md` | **Always, first.** Mistakes that cost rounds. |
| `references/story-and-concept.md` | Choosing the concept and structure. |
| `references/script-voice-pacing.md` | Writing the script, ElevenLabs settings, pauses, upbeat variant. |
| `references/motion-language.md` | Building scenes, camera, transitions, UI templates. |
| `references/reference-library.md` | Modelling the ElevenLabs/Zelios-style references and our approved films. |
| `references/brand-extraction.md` | A brand bible/logo is provided. |
| `references/sound-design.md` | Building the audio. |
| `references/production-pipeline.md` | Aligning voice, rendering, retiming, file sizes, tools offline. |
| `references/pricing-and-delivery.md` | Quoting, retainers, client meetings. |
