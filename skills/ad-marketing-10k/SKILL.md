---
name: ad-marketing-10k
description: >
  House playbook for high-end SaaS / B2B product marketing films built in code (Remotion on a laptop, or a
  Playwright HTML engine in cloud sessions) with synthesised sound and ffmpeg finishing. ElevenLabs/Apple/Stripe-grade:
  one focal point, zoom-through transitions, word-synced motion, musical sound design. Proven on three
  client-approved films (Debi promo, ADC "Precision, at work", SmartTech NXT "Crossroads"). Invoke BEFORE
  writing any code or script for a product video, launch film, explainer, promo, ad, reel, demo video, brand
  film, ElevenLabs voiceover script, or animating a logo/brand bible — and whenever someone says an existing
  video looks cheap, flat, templated, slow, boring, has bad transitions, wrong colour, or repetitive sound.
  Covers intake questions, creative direction, script pacing, brand extraction, voice sync, composition,
  motion language, transitions, sound, grading, rendering (incl. weak laptops), delivery, pricing, and every
  mistake already made once.
---

# AD Marketing 10k — high-end SaaS films in code

This is the whole method, merged from two real productions: the **Debi** promo (Remotion, laptop, client said
"phenomenal") and the **ADC / SmartTech NXT** films (HTML engine, cloud; founder "loved it", moved to pricing).
Every rule either made those results good or fixed a mistake that cost real time. Follow it in order.

Read next, in this order: `references/lessons-learned.md` (all mistakes) → the reference for the step you're on
(table at the end). The original Debi playbook is preserved verbatim in `references/original/`.

---

## 0. Working with the client (Tanid / Nathaniel, ADC Innovations)

- Not a motion designer: plain language, short sentences, no jargon without a one-line explanation.
- **Gets anxious during long silent work.** Status line every few minutes; honest time estimates; **send something
  watchable early**: a storyboard sheet first, then a draft or 5–10 s preview **with sound** before the full render.
- "Just start" means start: pick defaults, say what you picked, keep going.
- Plans can change mid-turn (new brand, new voice, back to an older cut). Drop the old plan at once, keep the files.
- Prefers **one final deliverable with voice + SFX + music**. Don't make no-voice versions unless asked.
- Phone uploads fail above ~15–30 MB: always make a size-budget web encode and say where the master is.
- Has strong instincts on story and voice: lead with **pain**; likes ElevenLabs-style calm, precise narration
  ("Oliver" voice); values his own wording — reformat before cutting.
- Use the advisory style if his preferences ask for it: challenge assumptions first, tag claims
  [Certain]/[Likely]/[Guessing], give options and let him decide.

---

## 1. Intake (ask before starting, one message)

Ask 1–4 always, 5–7 if not obvious. Offer a default for each so he can answer "default".
1. **Brand & assets**: name, site, **brand bible PDF / vector logo / palette / fonts**. (Never redraw a logo.)
2. **Goal, platform, length, format**: website hero / LinkedIn / Reels; 16:9, 9:16; 30–60 s. (Default 16:9, 45–60 s.)
3. **Audience & the one pain** (or pick between two proposed niches).
4. **Voice**: provider/voice/settings, or "write the script first". (Default: Oliver, see §4.)
5. **References**: 2–4 clips (screen recordings fine, phone sideways) + what he likes in each.
6. **CTA & true claims**: the real offer; which numbers/certifications are true.
7. **Old version?** If yes, diagnose it first (§2).

Then check the environment: can you reach the website (`curl`)? Is this a laptop (Remotion) or a cloud session
(HTML engine)? See §10.

---

## 2. Diagnose an old cut (if there is one)

Contact sheet at key beats + frame strips across every transition
(`ffmpeg -ss 4.9 -t 1.4 -i old.mp4 -vf "fps=10,scale=384:-1,tile=7x2" -frames:v 1 strip.png`). Check every tell:

| Cheap tell | High-end fix |
|---|---|
| UI tiny in frame, 14–16 px text | Fill the frame: cards 900–1320 px, text floor 24 px *effective* (px × camera zoom) |
| Fade out → empty background → fade in | Never an empty frame: shared element, zoom-through, object-becomes-object (§7) |
| Same whoosh on every cut | No per-cut whoosh; music carries transitions; ≤ 3 different air moves per film |
| Floating decorative bubbles/blobs | Background is light/texture/grid, not objects |
| Flat colour wash, low contrast | Neutral-dominant; colour as light and on the one hero element |
| Same pop/fade on every element | Motion inventory: a different treatment per content type |
| Camera stop-starts at each key | Monotone spline camera, zoom in log space, motion blur |
| Long holds, 80+ s, "I got bored halfway" | 45–60 s, a new beat every 2–3 s, holds only on purpose |

---

## 3. Creative direction (decide before code)

One line first: *"Reading this as: <piece> for <audience>, <vibe>, leaning toward <family>."*
Families: **light** (Apple/Stripe/Linear product film, off-white paper + soft brand light) or **dark** (ElevenLabs
Agents / navy glass: deep brand dark, glow, grid). Choose from the brand, not habit.

- **Structure**: Pain (0–30 %) → Turn (30–40 %) → Proof (40–75 %) → Trust/control (75–88 %) → Brand + one CTA.
- **Make the story a loop**: the stuck invoice in Act 1 is the one that gets paid; "something slips" → "nothing slips";
  the noisy signal → the clean signal. Callbacks read as intentional and premium.
- **Logo-anatomy concepts win**: read the bible's logo explanation and cast its parts as props
  (SmartTech: double-T = crossroads + bridge, xx = target, dot = cochonnet). End with the logo assembling from them.
- **One focal point, deeper and deeper** (ElevenLabs): a dot/orb/line the eye never loses; scenes found inside scenes.
- Pitch 2–3 concepts (logline, focal object, signature move, why, risk), recommend one, let him choose.
- **Data consistency**: fictional data identical everywhere (same invoice no., amount, days overdue). Flag it.
- **Content rules**: fictional names; no real third-party logos; no invented stats on screen; "POPIA-minded" not
  "compliant"; only true certifications as badges. Messaging UI: the brand's agent on the RIGHT in brand bubbles,
  the client on the LEFT in neutral.
- **Copy gate**: no em-dashes in on-screen copy; never: elevate, seamless, unleash, empower, leverage, robust,
  game-changer, cutting-edge.

Details and examples: `references/story-and-concept.md`, `references/reference-library.md`.

---

## 4. Script — feel and pace (the part that needs the most care)

Full guide: `references/script-voice-pacing.md`. The essentials:
- **Talk → pause to let it sink in → repeat.** One thought per paragraph; the pause is *between* paragraphs.
- "..." only to weight the second half of a line; too many = hesitant/sleepy. One-word punches ("Almost.", "One loop.").
- Rule of three; parallel pairs ("Every step... recorded. Every decision... traceable."); specific cases
  ("A lead arrives at 21:43") over lists.
- Word budget ≈ 95–110 words / 60 s calm; 120–140 upbeat; 35–50 for a 15–20 s cutdown.
- The **hook word** ("Almost.") with 1.5–2 s held silence either side — insert in the edit if TTS won't hold it.
- **Voice that won**: ElevenLabs Multilingual v2 "Oliver Silk – Deep Gravel Narrative", Speed 0.87, Stability 30,
  Similarity 80, Style 48. v3/v4 emotion tags made it whisper — offer only as an option.
- Deliver as a paste-ready code block (blank lines kept) + settings + claims check + estimated length.

---

## 5. The voiceover is the master clock

1. Probe every asset: `ffprobe -show_entries format=duration:stream=codec_name,sample_rate,channels`.
2. Words: `scripts/align_vo.py` (pocketsphinx, offline; phonetic — map by order). Phrases: silencedetect
   (−38/−40 dB, d 0.12–0.3). Stressed syllables: RMS envelope in 20–40 ms steps — **land hits on the stressed
   syllable of the meaning word** ("ap-PROVE", "DEB-bie"; each spelled letter "A-D-C" on its own onset).
3. **One timeline file** (`timeline.ts` / `timing.js`) of named keys in seconds. Picture **and** sound read it.
   Camera keys are written relative to words (`W.bridge - .5`) so a new take re-times everything.
4. Estimated times are drafts; re-sync to the real take and tell him which beats moved and why.
5. If a beat is too short to read (~0.8 s for 4 words), move the neighbouring beat — don't flash text.
6. Pauses after recording: `scripts/insert_pauses.py` + smoothstep time-warp of the visuals.

---

## 6. Composition, type, colour, light

- 1920×1080; main cards 900–1320 px; content ≥ 75–80 % of height; title-safe ~54 px.
- Type scale: display 128 / wordmark 236 / title 72–96 / h2 48–56 / body 34 / UI 30 / label 27 / floor 24;
  caps 24 @ 0.16 em; negative tracking on big type; tabular numerals for money/counters.
- One focal point and **one glowing hero element** per frame. Accent ≤ ~5 % of pixels.
- Brand font (Remotion: `@remotion/google-fonts`; HTML: `@fontsource/*`; licensed brand font only if supplied;
  otherwise the bible's approved fallback). Draw icons/ticks as SVG; never emoji.
- **Contrast is arithmetic** — compute it (≥ 4.5:1 body; ≥ 3:1 only at 27 px+).
- Palette as tokens; components never hard-code colours. Brand bible rules win (alignment, tagline width, reverse logo).
- Light family: off-white paper (#F8FBF5-ish), soft corner light pools, slow drifting dapples, faint rays, tinted
  shadows `0 40px 80px -28px rgba(brand,.22)`. Dark family: brand-dark base, brand texture image, faint precision grid
  with registration crosses, parallax dust/stars, vignette, grain.
- Problem act can run cooler/greyer (light veil ~0.2, desaturate); the light lifts at the turn.
- Crossfading very different fills passes through grey — route through a vivid midpoint.

---

## 7. Transitions — never an empty frame

| Device | Use |
|---|---|
| **Zoom-through** | camera 8–14× into an orb/dot/light; iris of its colour covers; emerge zoomed-out in the next scene (hidden cut) |
| **Object becomes object** | chips collapse into a ball; a flatlined signal flies across and becomes the logo's bar; table row → chat header |
| **Shared-element morph** | interpolate rect/radius/colour; pixel-exact handover (match scale + transform-origin); hide source that frame |
| **One wordmark for the film** | resolves at reveal → corner bug → flies back for the CTA |
| **Light becomes object** | gathered light becomes the logo's dot (one "wow" per film) |
| **Line-led** | a line draws, branches (T-junction/tree), camera follows the tip |
| **Recede into light / pull back** | scale 1→0.93 + blur 0→10 px while the next rises; or whole shot pulls back |
| **Camera pan / whip / tilt** | slide aside to the next window; follow a falling object down; rise up into a document |
| **Freeze** | desaturate + slow time to ~5 % on the hook word, one word on screen |
| **Rack focus** | blur 16→0 on "sharper"/"clearer" |

Rules: overlap outgoing/incoming; exits faster (ease-in, 10–18 frames) than entrances; vary devices.

---

## 8. Motion language

- Curves: OUT `bezier(0.16,1,0.3,1)` entrances · IN `bezier(0.7,0,0.84,0)` exits · CAMERA `bezier(0.65,0,0.35,1)`
  · SWEEP `bezier(0.22,1,0.36,1)` line draws/highlights. Springs: pop {13,190,.8}, settle {200,120}, soft {26,80},
  snap {18,260,.6}. No linear; clamp everything; never `scale(0)`.
- **Camera = monotone cubic spline through keys** (velocity carries; no stop-start), zoom in log space, ±3–8° rotation
  in orbits; move in every direction (push, pull, follow down, rise up, whip right, orbit).
- New beat every 2–3 s calm / 1–1.5 s upbeat; stagger 3–6 frames; things on screen > 2 s breathe (±4 px).
- **Print the motion inventory** (content type → treatment) before calling it done; a repeated treatment is a bug.
  Proven treatments: document drop with 3D tilt; tilted invoice read by a light beam with values lifting as chips;
  stamp slam; words rising from blur on their syllable; sweep underline; wordmark focus-pull; table tilt-up + scan;
  typing dots growing into a bubble; cube-roll status; arc-path cursor with press ripple; line + travelling token;
  trust tiles flipping up then acting; progress shimmer (no numbers); whole-number counters; data chips arcing into
  fields and locking under a crosshair; orbs splitting along curved paths; rings/crosshair locking; audit trail with
  trace lines; loop with Prepare/Approve/Done; grid toggles expanding; signal noise → clean sine; logo assembling.
- Details: `references/motion-language.md`.

---

## 9. Sound design (half of perceived quality)

- **Music bed first**: warm pad (detuned, filtered, convolution reverb ~2.6 s), sub on roots, chord changes ON story
  beats (minor in the problem, opening at the turn, add9 bloom on the logo, resolve at the end), level by act.
- **UI sounds are notes in the current chord** (felt piano for messages, marimba for rows/letters, glass bell for
  confirmations); every event a different pitch/pan; ascending chord tones for sequences.
- Foley only where it means something (paper landing, stamp, clicks, keys, latch, chime, risers into the 2 big
  reveals, soft sub at the logo). **≤ 3 whoosh/air moves per film**, each different. Never one sound per cut.
- Pan toward the on-screen source; place hits 0–3 frames early; silence for the hook word and "signal lost".
- **Duck from the voice envelope** (fast attack, slow release, 120 ms hold): music −9 dB, SFX −4.5 dB under speech.
- Master: `alimiter` → two-pass `loudnorm I=-16 TP=-1.5`; verify on the final files with `ebur128=peak=true`.
- You can't hear it: keep the bed quiet (~−31 LUFS alone), say the sound needs his ears, offer licensed swaps + stems.
- Implementations: `templates/remotion` (Debi `audio/build_audio.py`, musical) and `scripts/sound_design.py`
  (HTML films; simpler kit — **re-cue it to the rules above**, its example uses too many whooshes).

---

## 10. Build engines

| | **Remotion** (laptop, live preview) | **HTML engine** (cloud sessions) |
|---|---|---|
| Where | `templates/remotion/` (Debi project: package.json, tsconfig, remotion.config; add src/scripts from the Debi folder) | `scripts/engine/` (film_template.html/js, render.mjs, stills.mjs) + `examples/` |
| Timeline | `src/timeline.ts` → `scripts/cues.mjs` → JSON for audio | `timing.js` (`window.W`, `window.DUR`) |
| Motion | `useCurrentFrame()` + interpolate/spring; shots return `null` outside their window | pure `render(t)`; spline camera; DOM/SVG |
| Render | `--gl=angle`, chunked resumable 360-frame renders, JPEG frames, concurrency 2 | Playwright frame capture → ffmpeg; 60 fps + `tmix` → 30 fps blur |
| Rules | `references/remotion-engine.md` | `references/production-pipeline.md` |

Both: no CSS transitions/animations, no `Math.random` (seeded hash), geometry from constants, typecheck/stills
before every full render, contact-sheet audits you actually look at.

---

## 11. Finishing & delivery

`scripts/finish.sh master.mp4 out_prefix` (see `references/finishing-delivery.md`):
- Grade in RGB with explicit BT.709 both ways (gentle S-curve, warm highlights); tag outputs bt709.
- Grain: luma temporal `noise=c0s=4:c0f=t+u` master, `c0s=2` web.
- Master: x264 High CRF 18 slow, AAC 320k (no `-tune film` with grain). Web: two-pass to a size budget
  (~13.8 MB for < 15 MB, or < 30 MB for chat), H.264 Main 4.0, AAC 128k, faststart.
- Verify: duration = voice length; LUFS/true peak; 20-frame audit of the **encoded** web file.

---

## 12. Workflow checklist

1. Intake (§1). Load this file + `references/lessons-learned.md` (+ the `10k-websites` house-style skill if installed). Probe assets; check network.
2. Brand extraction (`scripts/extract_brand_pdf.py`, `references/brand-extraction.md`); diagnose old cut (§2).
3. Direction line, 2–3 concepts, story loop, data consistency (§3).
4. Script with pacing + settings (§4) → he records. Meanwhile build a draft to estimated timings.
5. Storyboard sheet (~16–20 stills) → send early; self-critique.
6. Align the take; re-time the timeline (§5).
7. Audio → check LUFS/peaks. Preview clip with sound → send.
8. Full render → finish → verify → send the web file (+ master location).
9. Plain-language README (change words, colours, timings, re-render). Commit + push.
10. Final message: files + sizes, what changed, deviations from brief, motion inventory, claims to confirm.
11. If asked: price it (`references/pricing-and-delivery.md`).

## 13. Definition of done

- Exact voice-length duration; every animation on its word (±0.1 s); hook pauses where intended.
- No empty frame between scenes; no repeated transition sound; camera never stop-starts.
- Zero text errors/overlaps/clipping in a 20-frame audit of the encoded file; readable on a phone.
- ≈ −16 LUFS, true peak ≤ −1.5 dBTP; web file under its size limit; master saved.
- Brand bible followed (logo extracted not redrawn, palette, alignment, tagline); claims verified or flagged.
- Motion inventory printed with no repeated treatment; client saw a storyboard and a preview before the final.

## Reference map

| File | When |
|---|---|
| `references/lessons-learned.md` | Always, first |
| `references/story-and-concept.md` | Concept + structure |
| `references/script-voice-pacing.md` | Script, voice, pauses, upbeat variant, approved scripts |
| `references/motion-language.md` | Camera, transitions, element library, timing |
| `references/reference-library.md` | ElevenLabs/Zelios references + approved films beat-by-beat |
| `references/brand-extraction.md` | A brand bible / logo is provided |
| `references/sound-design.md` | Audio build |
| `references/remotion-engine.md` | Building in Remotion (laptop) |
| `references/production-pipeline.md` | HTML engine, alignment, rendering, pauses (cloud) |
| `references/finishing-delivery.md` | Grade, grain, loudness, size-budget encodes |
| `references/third-party-skills.md` | Vetting/using other skills & repos |
| `references/pricing-and-delivery.md` | Quotes, retainers, meetings |
| `references/original/ad-marketing-10k-v1-debi.md` | The original Debi playbook, verbatim |
