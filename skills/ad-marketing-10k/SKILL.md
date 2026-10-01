---
name: ad-marketing-10k
description: >
  Complete playbook for producing high-end SaaS / B2B marketing films for any company, built in code
  (Playwright HTML engine or Remotion) with word-synced motion, musical sound design and pro finishing —
  the ElevenLabs / Apple / Stripe level: one focal point, zoom-through transitions, smooth spline camera,
  UI templates, message bubbles, lines and geometry. Use this skill whenever someone wants a product video,
  brand film, launch film, explainer, promo, ad, reel, demo video, an ElevenLabs voiceover script, a logo
  animation, or to turn a website / brand bible into a video — and whenever an existing video looks cheap,
  flat, slow, boring or templated, has bad transitions, wrong colours or repetitive sound. Covers intake
  questions, concept, script pacing, brand extraction, voice sync, composition, motion, transitions, sound,
  rendering, finishing, delivery and pricing, plus 40+ documented mistakes so they never repeat. Always open
  with the creative-brief questionnaire (business, vibe, look, pace, story, voice, music, platform, frame,
  deliverables) and build from the designer's answers.
---

# AD Marketing 10k — premium SaaS marketing films in code

Built from real productions for real clients: brand films a founder approved on first viewing, and a product promo
a client called "phenomenal". Rules are ranked by evidence: what got approved beats what sounded good.
`references/old-vs-new-review.md` explains which older rules were kept, changed or overridden, and why.

**Before anything else read `references/lessons-learned.md`.** Then the reference for the step you're on (map at the end).

---

## 0. First response — the creative brief (always, before any work)

Your **first reply** to any video request is the brief below, in one message. Do not write code, scripts or plans
before the designer answers. The designer leads; you recommend. Under every question give your recommended default
in brackets so they can answer "default" or skip. If they paste a full brief, only ask what's missing.

**A. The business**
1. Company, website, and what the product actually does in one sentence.
2. Brand assets: brand bible PDF, vector logo, palette, fonts? (Never redraw a logo.)
3. Who is the audience (role, industry, company size) and what is the ONE pain this film should hit?
4. What should the viewer do after watching (CTA / offer)? Which claims, numbers, integrations, certifications are true?

**B. The feel**
5. Vibe: calm & premium · bold & energetic · warm & human · technical & precise · playful? [calm, premium, precise]
6. Look: dark (ElevenLabs Agents / navy glass) · light (Apple / Stripe / Linear) · let the brand decide? [brand decides]
7. Pace: slow cinematic (beat every 2–3 s) · upbeat (beat every 1–1.5 s, music-driven) · mixed? [cinematic]
8. Story angle: problem→solution · one real customer case · logo-meaning story · product demo walkthrough? [recommend one after research]
9. Reference videos or brands they love, and what exactly they like in each (motion, transitions, type, sound)?
10. Anything to avoid (styles, words, colours, competitor look-alikes)?

**C. The voice & sound**
11. Voiceover? Who records it — ElevenLabs (which voice/settings) or a human? Script written by us or supplied?
    [ElevenLabs deep calm narrator; we write it]
12. Voice first or video first? [Voice first: we write the script, they record, the film is cut to the real words.
    Optionally a draft film on estimated timing while they record.]
13. Music mood: ambient pad · cinematic swell · modern electronic pulse · none? [ambient pad + soft pulse]

**D. The output**
14. Where it will run: website hero · LinkedIn · Instagram/TikTok Reels · YouTube ad · sales deck? [website + LinkedIn]
15. Frame: 16:9 · 9:16 · 1:1 · 4:5 — one or several? Length: 15 · 30 · 45–60 · 90 s? [16:9, 45–60 s; 9:16 cutdown later]
16. Build environment: their laptop (Remotion) or a cloud session (HTML engine)? [detect automatically]
17. Deliverables: one final mix (voice+SFX+music) · plus stems · plus cutdowns? File-size limit for sharing? [final mix + web copy < 30 MB]
18. Deadline and budget range (for scoping)?

After the answers: restate the brief in 5 lines ("Reading this as …"), list the defaults you assumed, and move on.
Only if the designer explicitly says "just start" may you skip the brief — then state every default you picked.

## 1. Working with the client / designer

- Plain language, short sentences, define jargon in one line. They are directing; you are the crew.
- **Silence makes people anxious.** Status line every few minutes, honest time estimates, and something watchable
  early: storyboard sheet → draft (even before the voice exists) → preview with sound → final.
- Plans change mid-project (new brand, new voice, back to an older cut). Switch immediately; keep every version.
- Respect their wording: when pace is off, reformat before cutting; cut only with permission.
- Challenge weak ideas with reasons, mark claims [Certain]/[Likely]/[Guessing], give options, let them choose.
- Check the environment early: is the website reachable (`curl`)? If blocked, use web search + ask for the brand bible.

## 2. Diagnose an existing video

Contact sheet at key beats + frame strips across every transition
(`ffmpeg -ss T -t 1.4 -i old.mp4 -vf "fps=10,scale=384:-1,tile=7x2" -frames:v 1 strip.png`; `scripts/analyze_reference.sh`).

| Cheap tell | Fix |
|---|---|
| Text/UI unreadable at the size it's shown | Effective size (px × camera zoom) ≥ 24 px when read; fill the frame *when* it's read |
| Fade out → empty background → fade in | Never an empty frame (§7) |
| Same whoosh on every cut | Music carries transitions; UI sounds are notes; ≤ 3 different air moves |
| Decorative bubbles/blobs | Background = light, texture, grid — not objects |
| Flat colour wash, low contrast | Neutral-dominant; colour as light and on one hero element |
| Same pop/fade on everything | Motion inventory: one treatment per content type |
| Camera stop-starts at each key | Monotone spline camera, log zoom, motion blur |
| Long holds, 80+ s, "boring halfway" | 45–60 s, new beat every 2–3 s, holds only on purpose |
| Generic story ("a quiet weight") | Name the concrete pain with real artefacts |

---

## 3. Creative direction (decide before code)

Write one line: *"Reading this as: <piece> for <audience>, <vibe>, <family>."*
- **Dark family** (ElevenLabs Agents / navy glass): brand-dark base, brand texture, faint precision grid, glow, grain.
- **Light family** (Apple / Stripe / Linear): off-white paper (never pure #FFF), soft brand-tinted light pools, drifting
  dapples, tinted shadows. The brand bible decides, not habit.

Story:
- **Pain (0–30 %) → Turn (30–40 %) → Proof (40–75 %) → Trust/control (75–88 %) → Brand + one CTA.** Lead with pain.
- **Make it a loop**: the stuck item in Act 1 is the one that gets solved; "something slips" → "nothing slips";
  noisy signal → clean signal. Callbacks read as intentional.
- **Logo-anatomy concepts win**: read the bible's logo explanation and cast its parts as props; end with the logo
  assembling from them.
- **One focal point, deeper and deeper**: a dot/orb/line the eye never loses; scenes found inside scenes.
- **Specific beats over lists**: one real case ("a lead arrives at 21:43") beats five features.
- Pitch 2–3 concepts (logline · focal object · signature move · why · risk); recommend one; client chooses.

Content rules: fictional names and data, identical everywhere; no invented stats; no real third-party logos; only
true certifications; cautious compliance wording ("-minded", not "compliant", unless certified). Chat UI: the brand's
agent on the RIGHT in brand bubbles, the customer on the LEFT in neutral.
Copy gate (default): no em-dashes on screen; avoid elevate, seamless, unleash, empower, leverage, robust,
game-changer, cutting-edge.

Details: `references/story-and-concept.md`, `references/reference-library.md`.

---

## 4. Script — feel and pace

Full guide: `references/script-voice-pacing.md`.
- **Talk → pause to let it sink in → repeat.** One thought per paragraph; pauses live *between* paragraphs.
- "..." only to weight the second half of a line; too many sound hesitant. One-word punches: "Almost." "One loop."
- Rule of three; parallel pairs ("Every step... recorded. Every decision... traceable."); callbacks.
- Word budget: ~95–110 words / 60 s calm · 120–140 upbeat · 35–50 for a 15–20 s cutdown.
- **Hook word** with 1.5–2 s held silence either side; insert in the edit if the TTS won't hold it.
- **Proven voice**: ElevenLabs Multilingual v2, a deep calm narrator ("Oliver Silk – Deep Gravel Narrative"),
  Speed 0.87, Stability 30, Similarity 80, Style 48. v3/v4 emotion tags tended to whisper: an option, not the default.
- Deliver a paste-ready code block (blank lines kept) + settings + claims check + estimated length.

---

## 5. The voice is the master clock

1. Probe every asset (`ffprobe -show_entries format=duration:stream=codec_name,sample_rate,channels`).
2. Find the words with `scripts/align_vo.py` (offline; phonetic — match by order). Find the **stressed syllable** of the
   meaning word from the loudness contour (20–40 ms RMS) and land the hit there (e.g. "ap-PROVE"; each spelled letter
   of an acronym on its own onset).
3. **One timeline file** of named keys in seconds; picture and sound both read it; camera keys are relative to words
   (`W.bridge - .5`) so a new take re-times everything.
4. Draft on estimated timings (~1.8 words/s + pauses), re-time to the real take, report which beats moved.
5. If a beat is too short to read (~0.8 s for 4 words), move the neighbour beat instead of flashing text.
6. Pauses after recording: `scripts/insert_pauses.py` + a smoothstep time-warp so motion eases into the pause.

---

## 6. Composition, type, colour

- 1920×1080 · title-safe ~54 px · one focal point and one glowing hero element per frame · accent ≤ ~5 % of pixels.
- Fill the frame **when something must be read** (cards 900–1320 px or camera zoomed in); use negative space for brand
  moments. Measure text as effective size (px × zoom), floor 24 px.
- Type scale start: display 128 / title 72–96 / h2 48–56 / body 34 / UI 30 / label 27 / floor 24; caps 24 @ 0.16 em;
  negative tracking on large type; tabular numerals for money/counters.
- Contrast is arithmetic: compute it (≥ 4.5:1 body; ≥ 3:1 only at 27 px+).
- Brand bible wins: palette tokens, fonts (or the bible's web fallback), alignment, tagline rules, reverse logo.
- Icons/ticks as SVG, never emoji. Shadows tinted to the brand hue. Crossfades between very different fills go
  through a vivid midpoint (direct crossfades turn grey). A problem act can run cooler; the light lifts at the turn.

---

## 7. Transitions — never an empty frame

| Device | Use |
|---|---|
| **Zoom-through** | camera 8–14× into an orb/dot/light; iris of its colour covers; emerge zoomed-out in the next scene (hidden cut) |
| **Object becomes object** | chips collapse into a ball; a flat line flies off and becomes the logo's bar; a row becomes a header |
| **Shared-element morph** | interpolate rect/radius/colour; pixel-exact handover (match scale + transform-origin); hide source that frame |
| **One wordmark for the film** | reveal → corner bug → returns for the CTA |
| **Light becomes object** | gathered light becomes the logo's dot (one "wow" per film) |
| **Line-led** | a line draws, branches, camera follows the tip |
| **Pull back / recede** | shot scales down + blurs while the next rises |
| **Pan / whip / tilt / follow** | slide to the next window; follow a falling object down; rise into a document |
| **Freeze** | desaturate + slow time to ~5 % on the hook word, one word on screen |
| **Rack focus** | blur → sharp on "sharper" / "clearer" |

Overlap outgoing and incoming; exits faster than entrances; vary devices across the film.

---

## 8. Motion language

- **Camera = monotone cubic spline through keyframes** (velocity carries through keys, no overshoot), zoom in log
  space, ±3–8° rotation in orbits. Move in every direction. Subtle push-ins on holds; big zoom-throughs/pull-backs are
  the signature. Never chain eased key-to-key camera moves (stop-start judder).
- Element curves: OUT `bezier(0.16,1,0.3,1)` · IN `bezier(0.7,0,0.84,0)` · SWEEP `bezier(0.22,1,0.36,1)`;
  springs pop {13,190,.8} · settle {200,120} · soft {26,80} · snap {18,260,.6}. No linear; clamp; never `scale(0)`.
- New beat every 2–3 s (calm) / 1–1.5 s (upbeat); stagger 3–6 frames; things on screen > 2 s breathe (±4 px).
- **Print the motion inventory** (content type → treatment) before delivery; a repeat is a bug.
- Treatment library and timing rules: `references/motion-language.md`.

---

## 9. Sound (half of perceived quality)

- Music bed first; chord changes on story beats (tense in the problem, open at the turn, bloom at the logo, resolve).
- UI sounds = notes in the current chord, varied pitch/pan; sequences ascend.
- Foley only with meaning; **≤ 3 whoosh/air moves per film**, each different; never one sound per cut.
- Silence is a sound: drop the music for the hook word and "signal lost" moments.
- Duck music −9 dB / SFX −4.5 dB under the voice (envelope follower). Hits 0–3 frames early. Pan to the source.
- Master to **−16 LUFS, true peak −1.5 dBTP** (`scripts/finish.sh`); verify on the final files.
- You can't hear it: say so, keep synthesis conservative, deliver stems for licensed swaps.
- Details: `references/sound-design.md`; kit: `scripts/sound_design.py` (re-cue its example to these rules).

---

## 10. Build engines

| | HTML engine (cloud / any machine) | Remotion (laptop, live preview) |
|---|---|---|
| Start | `scripts/engine/film_template.html/js` + `examples/` | `templates/remotion/` config + `references/remotion-engine.md` |
| Timeline | `timing.js` (`W`, `DUR`) | `src/timeline.ts` → cues JSON for audio |
| Motion | pure `render(t)`, spline camera, DOM/SVG | `useCurrentFrame()`, interpolate/spring; port `spline()` |
| Render | Playwright → ffmpeg; 60 fps + `tmix` → 30 fps blur | `--gl=angle`, chunked resumable renders |

Both: no CSS transitions/animations, no `Math.random` (seeded hash), geometry from constants, stills contact sheet
before every full render — and actually look at it.

---

## 11. Finish & deliver

`scripts/finish.sh master.mp4 out/name [MB]`: BT.709-tagged grade, subtle grain, −16 LUFS/TP −1.5, CRF 18 master,
two-pass web file under budget, verification. Then pull ~20 frames from the **encoded** web file and inspect.
Details: `references/finishing-delivery.md`.

---

## 12. Workflow

1. Creative brief (§0) → wait for answers → lessons-learned → probe assets, check network.
2. Brand extraction (`scripts/extract_brand_pdf.py`) · diagnose old cut · analyse references.
3. Direction line → 2–3 concepts → client picks.
4. Script + voice settings → client records. Meanwhile: storyboard sheet + draft on estimated timing → send.
5. Align the take → re-time → stills audit → audio (check LUFS) → preview with sound → send.
6. Full render → finish → verify → deliver web file (+ master location). Commit + push.
7. Final message: files + sizes, what changed, deviations from brief, motion inventory, claims to confirm.
8. If asked: pricing (`references/pricing-and-delivery.md`).

## 13. Definition of done

- Duration = voice length; every animation on its word/syllable (±0.1 s); hook pauses where intended.
- No empty frames, no stop-start camera, no repeated transition sound, no repeated treatment.
- Zero text errors/overlaps/clipping in a 20-frame audit of the encoded file; readable on a phone.
- −16 LUFS, TP ≤ −1.5 dBTP; web file under its limit; master saved.
- Brand bible followed; logo extracted, not redrawn; claims verified or flagged.
- Client saw a storyboard/draft and a preview before the final.

## Reference map

| File | When |
|---|---|
| `references/lessons-learned.md` | Always, first |
| `references/old-vs-new-review.md` | Why each rule is here (and which were overridden) |
| `references/story-and-concept.md` | Concept, structure, niche choice |
| `references/script-voice-pacing.md` | Script rhythm, voice settings, approved scripts |
| `references/motion-language.md` | Camera, transitions, treatments, timing |
| `references/reference-library.md` | ElevenLabs/Zelios-style references + approved films beat-by-beat |
| `references/brand-extraction.md` | Brand bible / logo provided |
| `references/sound-design.md` | Audio |
| `references/production-pipeline.md` | HTML engine, alignment, pauses, rendering |
| `references/remotion-engine.md` | Remotion builds and weak-laptop rendering |
| `references/finishing-delivery.md` | Grade, grain, loudness, size budgets |
| `references/third-party-skills.md` | Vetting other skills/repos; libraries used |
| `references/pricing-and-delivery.md` | Quotes, retainers, meetings |
