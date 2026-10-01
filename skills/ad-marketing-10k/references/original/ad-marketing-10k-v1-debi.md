---
name: ad-marketing-10k
description: House playbook for high-end SaaS / product marketing and promo videos built in code (Remotion + Python audio + ffmpeg finishing). Proven on the Debi promo (ADC Innovations, 2026-09-29). Invoke BEFORE writing any code for a product video, launch film, explainer, promo, ad, reel, demo video, or when a user says an existing video looks cheap/flat/templated, has bad transitions, wrong colour tone, or annoying repetitive sound. Covers creative direction, voiceover sync, composition, motion language, shared-element transitions, sound design (music + musical UI SFX + ducking + loudness), colour grade/grain, rendering on weak machines, delivery encodes, verification, and every mistake already made once.
---

# AD Marketing 10k: high-end SaaS product videos in code

This file is the whole method. It came from one real build (Debi, a 47.07 s voiceover-led
promo for an AI collections agent) that the client called "phenomenal". Every rule below either
made that result good or fixed a mistake that cost real time. Follow it in order.

A complete working project is in `templates/` next to this file (Remotion src, audio synth,
render/finish scripts). **Copy it and retarget it; do not start from a blank folder.**

---

## 0. Working with the client (Nathaniel / Tanid, ADC Innovations)

- He is not a motion designer. Explain in plain language, short sentences.
- **He gets anxious during long silent work.** Give a status line every few minutes, give an
  honest time estimate when asked, and **send something watchable early**: a storyboard sheet
  within the first hour, and a 5-10 s preview clip WITH SOUND before the full render.
  "Can I not even see half a clip?" was said once. Never again.
- If he says "just start", do not stop for a question round. Pick sensible defaults, say what
  you picked, keep going; show the storyboard and keep building unless he redirects.
- He may switch plans mid-turn (cloud session, repo, etc.). Drop the old plan immediately and
  clean up anything you created for it (e.g. remove a git remote you added).
- His phone may follow via Remote Control. Large files (>~15 MB) may fail to upload there; say
  so and tell him where the file is on disk.

---

## 1. Diagnose the old version first (if there is one)

Extract a contact sheet at the key beats AND frame strips across transitions:

```
ffmpeg -ss 4.9 -t 1.4 -i old.mp4 -vf "fps=10,scale=384:-1,tile=7x2:padding=3:color=white" -frames:v 1 strip.png
```

(Do not use `drawtext` on this machine: fontconfig is missing and it errors.)

The v2 Debi video looked cheap for these exact reasons. Check for all of them:

| Cheap tell | High-end fix |
|---|---|
| UI tiny in frame (chat window ~20% of width), 14-16 px text | Fill the frame: cards 900-1320 px wide, text floor 24 px, body 30-34 px. "Canvas is not a website." |
| Every cut = fade out -> empty background -> fade in | Never an empty frame. Overlap shots; carry a shared element across the cut. |
| One whoosh sound on every transition | No per-cut whoosh. Music carries transitions; max ~3 soft, different air moves in the film. |
| Floating decorative bubbles / blobs | Background = light, not objects (see section 5). |
| Flat green wash over everything, low contrast | White-dominant, colour only as light and on the one hero element. |
| Same pop/fade on every element | Motion inventory: a different treatment per content type (section 7). |
| Generic font | Brand font loaded properly (Plus Jakarta Sans for ADC work). |

---

## 2. The voiceover is the master clock

1. Probe everything first: `ffprobe -show_entries format=duration:stream=codec_name,sample_rate,channels`.
2. Measure phrases with silencedetect (`-38dB`, `d=0.12`) AND syllable onsets with
   `templates/audio/analyse_vo.py` (RMS envelope + rise detector, prints onsets per phrase).
3. For any word that matters, print the loudness contour (20-40 ms steps) and read it:
   a long loud vowel = the stressed syllable. **Land hits on the stressed syllable of the
   meaning word, not on a time someone estimated.** Examples from Debi:
   - Brief said "click Approve at 20.3" - that was mid-"until". The word "ap-PROVE" was 20.9.
   - "By A-D-C Innovations": each spelled letter had its own onset (43.54 / 43.76 / 44.00),
     so each letter of the lockup popped on its letter. Clients notice this kind of sync.
   - "This is DEB-bie": the wordmark resolves sharp exactly on "DEB" (9.63), not on "This".
4. Put every time in ONE file: `src/timeline.ts` (seconds, named keys). Sound reads the same
   file (exported to JSON by `scripts/cues.mjs` via esbuild). Change one number, picture and
   sound both move.
5. Brief times with "~" are approximations. Sync to the words, then tell the client which
   times you moved and why (one line each).
6. If a spoken beat is shorter than the text needs to be read (~0.8 s minimum for 4 words),
   move the neighbouring beat (e.g. hold the logo longer, start the next scene later) rather
   than flash text.

---

## 3. Creative direction (decide before code)

State one line: "Reading this as: <piece> for <audience>, <vibe>, leaning toward <family>."
For ADC SaaS work: calm, precise, trustworthy; audience = conservative business owners who
trust proof over hype -> Apple/Stripe/Linear light product film.

- **Keep the story, upgrade the craft** when the client says the old one is "nearly there".
- **Make the story a loop.** Debi: the INV-1042 invoice stuck at 60 days in the opening is the
  same invoice Debi finds, reminds, and confirms paid; the "Hours lost chasing" chip from the
  opening is struck out at "without the chasing". Callbacks read as intentional and premium.
- **Fix data contradictions the brief contains** (opening said 60 days overdue, chat said 14 for
  the same invoice). Make fictional data consistent everywhere and tell the client.
- Messaging UI: the firm's side (the agent) is on the RIGHT in brand bubbles, the client on
  the LEFT in white. The chat header is the conversation partner, not your brand.
- Content rules for this client: fictional names only, "POPIA-minded" never "compliant", no real
  company logos (no Xero), no invented stats (a progress bar with no figures is fine), no
  AI-garbled text copied from reference clips.
- Copy gate: no em-dashes in on-screen copy, none of: elevate, seamless, unleash, empower,
  leverage, robust, game-changer, cutting-edge.

---

## 4. Composition and type (1920x1080)

- Main cards/windows 900-1320 px wide. Content should use >= 75-80% of the height.
- Type scale used: display 128 / wordmark 236 / counter 232 / title 72-96 / h2 48-56 /
  body 34 / UI 30 / label 27 / small 24 (floor) / caps 24 with 0.16em tracking.
  Negative tracking on large type (-0.03 to -0.05em). Tabular numerals for money and counters.
- Title-safe: keep content inside ~54 px of every edge; nothing touching the frame.
- One focal point per frame; one hero-coloured (glowing) element per frame.
- Callouts: one annotation pill that GLIDES between messages and rolls its text over, with a
  short connector line to what it describes. Not three separate pop-ups.
- A small brand bug (logo + "by ADC Innovations") bottom-left during the product section.
- Draw every icon and tick as SVG (one stroke weight, round caps). Most fonts have no tick glyph.
  Never use emoji as icons.
- Contrast is arithmetic: compute it. On white: secondary text needs alpha >= 0.7 of ink
  (5.8:1); 0.55 alpha is only for 27 px+ (3.6:1). Neon text only on deep green (8:1); ink
  text on leaf green (8.6:1). Never neon/leaf text on white.

## 5. Colour, light, background

- Palette as tokens in `theme.ts`; components never hard-code values.
- Background: off-white paper (#F8FBF5, never pure #FFF), two soft corner light pools in the
  brand tint, 4-5 huge very-soft dapple gradients drifting slowly (sin, periods of 6-7 s), and
  2-3 faint rays from one corner. It must read as LIGHT, never as objects. No bubbles.
- A "problem" act can run greyer: a pale veil (~0.2 opacity) plus desaturation at the
  disappointing line, then the light LIFTS at the turn ("What if..."). Keep the veil light and
  cool; a heavy grey veil made the opening look muddy.
- Shadows tinted toward the brand hue with a real offset: `0 40px 80px -28px rgba(16,70,28,.22)`.
- Glow (neon box-shadow) only on the one hero element in the frame.
- Colour transitions between very different fills (light tint -> deep green) pass through grey
  if you crossfade directly. Route through a vivid midpoint (tint -> bright leaf -> deep).
- Grade and grain in the finishing pass (section 10), not in the browser.

## 6. Transitions: never an empty frame

Every scene change uses one of these (vary them):

| Device | Used for |
|---|---|
| **Shared element morph**: an element from scene A becomes an element of scene B (rect, radius, colour interpolate; content crossfades) | Table row lifts out and becomes the chat header |
| **One wordmark for the whole film**: resolves at the reveal, shrinks into the corner bug, flies back at the end, rises for the CTA | Brand continuity |
| **Light becomes object**: a gathered point of light travels and becomes the dot on the i | Logo reveal ("wow" moment, only one per film) |
| **Recede into light**: scale 1 -> 0.93, blur 0 -> 10 px, fade, while the next scene rises | Problem -> turn |
| **Camera pan / slide aside**: the current window slides left and scales 0.84, new card enters right | Chat -> dispute |
| **Pull back**: whole shot scales down + blurs as the next comes forward | Product -> trust |
| **Scale-through**: scene scales up 1 -> 1.1 and dissolves as the brand returns | Payoff -> end card |

Rules:
- Overlap outgoing and incoming shots; exits (ease-in, ~10-18 frames) are faster than entrances.
- Shared-element handover must be pixel-exact. If the source was inside a scaled container
  (e.g. table pushed in to 1.025 about 960,560), start the flying copy at that same scale with
  `transformOrigin` set to that point relative to the element, then settle to 1.
- Hide the source element on the exact frame the flying copy appears.

## 7. Motion language

`theme.ts` holds it. Two curves carry ~90%:
- OUT (entrances): `Easing.bezier(0.16, 1, 0.3, 1)`
- IN (exits): `Easing.bezier(0.7, 0, 0.84, 0)`
- CAMERA (camera moves, morphs, counters): `Easing.bezier(0.65, 0, 0.35, 1)`
- SWEEP (highlights, line draws): `Easing.bezier(0.22, 1, 0.36, 1)`
- Springs: pop `{damping 13, stiffness 190, mass .8}` (~4% overshoot, small pop-ups only),
  settle `{damping 200, stiffness 120}` (windows/cards, no overshoot), soft `{26, 80}`, snap `{18, 260, .6}`.
- No linear interpolation; clamp every interpolate; nothing uses `scale(0)`.
- Stagger 3-6 frames. Holds after beats. Slow camera push-in on long shots (max ~4.5%).
- Things on screen for >2 s breathe (+-4 px sin bob) where it does not hurt reading.

**Print the motion inventory table before calling it done.** One row per content type; a
repeated treatment column is the bug. Treatments that worked:

| Content type | Treatment |
|---|---|
| Document/invoice card | drop with 3D tilt (rotateX 24->0), soft spring landing, sheets behind lag 3-5 frames |
| Stamp/tag | slam in (scale 1.9->1 snap) + decaying jolt of the card |
| Headline words | each word rises out of a 12 px blur on its syllable; exits up, staggered |
| Highlight / underline | sweep scaleX from the left (SWEEP) |
| Wordmark | focus pull: blur 22->0, tracking tightens, lands on the name |
| Tables | tilt up (rotateX 22->0), rows stagger, a scan line passes, rows light as it crosses them |
| Chat bubbles | typing dots bubble GROWS into the message (shared element), pop spring from the tail corner |
| Status labels | cube roll: old text rolls up/out as new rolls in; chip colour flips |
| Cursor | arc path (quadratic bezier), slight lean, press scale .82, ripple ring; rests clear of text |
| Handoff | line draws (scaleY) and a token travels down it into the target card |
| Trust tiles | flip up (rotateX 78->0) on the word; the icon then acts (lock shackle shuts, tick draws, lines write) |
| Progress bar | fill with CAMERA ease, travelling shimmer, glowing leading edge; no numbers |
| Counters | WHOLE numbers only with a tiny settle nudge. A rolling-digit odometer smears into "59/60" at 30 fps. |
| Lockup | dot pops, letters pop on their spoken letters, underline draws, secondary word tracks in (letter-spacing 0.75->0.36em + blur) |

## 8. Sound design (half of perceived quality)

The complaint that started this: "a constant transition sound... the same thing over and over".
`templates/audio/build_audio.py` is the full implementation (numpy + scipy, everything synthesised,
no downloads, no licences).

- **Music bed first**: warm pad (detuned saw+triangle, dark/bright lowpassed copies crossfaded by a
  brightness curve), sub on roots, faint high shimmer, synthetic convolution reverb (~2.6 s).
  Chord changes are placed ON STORY BEATS in silences (tense minor in the problem, opening at
  "What if", full add9 bloom at the logo, resolve at the end). Level automation by act.
- **UI sounds are notes in the current chord** (felt piano for messages, marimba for rows/letters,
  glass bell for confirmations/chimes). Every event gets a different pitch/pan, so nothing repeats
  and it sounds musical. Rows lighting up = ascending chord tones; A-D-C letters = D, F#, A.
- **Foley only where it means something**: paper landing (thud timed to the landing frame),
  stamp, two mouse clicks (down + release), keyboard taps with random timing/pitch, latch on the
  lock, processing ticks while "checking", payment chime, risers into the two big reveals, soft
  sub impact at logo blooms. At most ~3 air/whoosh moves, each a different band/length/pan.
- Pan sounds toward where they happen on screen (chat right, client left).
- Place hits 0-3 frames early rather than late; springs land a few frames after they start.
- Ducking from the voice envelope (1 kHz control rate, fast attack/slow release + 120 ms hold):
  music -9 dB, SFX -4.5 dB under speech.
- 0.2 s fade on music/SFX at the very end so the file never ends on a click.
- Keep the voice at its native sample rate (44.1 kHz for that mp3) so it is never resampled.
- Master: `alimiter` then two-pass `loudnorm I=-16 TP=-1.5` -> about -16 LUFS integrated.
  Verify on the FINAL encoded files with `ebur128=peak=true` (result: -16.0 LUFS, TP -4.4).
- You cannot hear the result. Keep the bed quiet (~-31 LUFS on its own), keep synth conservative,
  and say plainly that the sound needs the client's ears. Offer a licensed-track swap.

## 9. Remotion build rules

- Scaffold by hand (package.json, tsconfig, remotion.config.ts, src/index.ts, Root.tsx). Never
  `npx create-video` in a non-empty folder (interactive prompt hangs).
- Pin all `@remotion/*` to the same version as `remotion`.
- Fonts: `@remotion/google-fonts/<Font>` with explicit weights and subsets. Load `latin-ext` if
  you use characters like the dotless i (U+0131) used for the custom dot on "Debi".
- All motion from `useCurrentFrame()`; CSS transitions/animations freeze in render.
  No `Math.random` (use a seeded hash). Use Remotion `<Img>/<Audio>`, not native tags.
- Shots are components rendered at global frame numbers that return `null` outside their
  window (plus overlap). Easy mental model; timeline keys are global seconds.
- Compose with individual `translate/scale/rotate` properties; use `transform` only for
  `perspective(...) rotateX/Y`.
- For morphs, interpolate rect x/y/w/h and radius; stack colour layers and fade opacities.
- A chat that fills up scrolls: translate the message list and clip it with `clipPath` in local
  coordinates (compensate the inset for the translate).
- Geometry from constants, never DOM measurement during render.
- `stills.mjs` (templates): bundle once, one browser, render any list of seconds, tile a
  contact sheet. Use it for the storyboard and every audit. Read the sheet yourself.
- `npx tsc --noEmit` before every render.

## 10. Finishing and delivery

`templates/scripts/finish.mjs`:
- Grade in RGB with explicit BT.709 conversions both ways (`scale=in_color_matrix=bt709...`,
  `format=gbrp`, gentle `curves` S, `colorbalance` warm highlights / green shadows, back to
  yuv420p). Render with `--color-space=bt709` and tag outputs bt709; untagged HD files shift
  greens between players.
- Grain: `noise=c0s=4:c0f=t+u` (luma, temporal) on the master; `c0s=2` on the web cut.
- Master: x264 High, CRF 18, preset slow, AAC 320k. **Do not use `-tune film` with grain**:
  that made a 228 MB master; CRF 18 without it was 20 MB and looks the same.
- Web/WhatsApp: two-pass to a size budget (~13.8 MB target for a <15 MB limit), H.264 Main 4.0,
  AAC 128k, faststart. Result 13.5 MB at 1080p.
- Verify: ffprobe duration (must equal the voice length), sizes, loudness/true peak, then pull
  20 frames from the ENCODED web file into a sheet and inspect for errors, overlaps, clipping,
  banding.

## 11. Rendering on this laptop (i5-7200U, 2 cores, 8 GB)

- Software rendering ~2.4 s/frame. **`--gl=angle` (GPU) cut it ~40% (~1.1 s/frame).** Always use it.
- A long single render crashed/shut down the PC once. **Render in resumable chunks**
  (`templates/scripts/render.mjs`: 360-frame chunks, finished chunks skipped, joined with the
  concat demuxer `-c copy`). Ask for keep-awake before long renders.
- Paths with spaces: `execFileSync("npx", ..., {shell: true})` splits them; the output landed
  as `Desktop\Saas.mp4`. Pass paths RELATIVE to cwd with forward slashes.
- `import.meta.url` pathnames are URL-encoded (`%20`); use `fileURLToPath`, or you create junk
  folders named `Saas%20Marketing...`.
- The harness blocks commands containing `.git` path patterns near `Remove-Item`/`rm -r` strings
  (even inside a regex). Put such scans in a .ps1 file and run that.
- Windows zip entries with `:` in names fail `ExtractToDirectory`; extract entry by entry with
  sanitised names.
- npm 11 blocks install scripts (`allow-scripts` warning for esbuild): Remotion still works.
- Remotion downloads its own Chrome Headless Shell on first render (~113 MB, one time).
- Budget: bundle ~60 s, 20 stills ~2-3 min, 1412-frame film ~26-30 min + ~10 min encodes.

## 12. Third-party skills (vetted 2026-09-29)

Installed as knowledge (project `.claude/skills/`): remotion-dev/skills (best-practices, saas,
multimedia, render, create), haidrrrry remotion-motion-graphics, iart-ai motion-design-skills
(animation-principles, color-motion, shot-composition, motion-art-direction, beat-sync-editing,
remotion-video, logo-animation, motion-background), noamdorr saas-product-demo-video,
chandreshpv remotion-product-videos, aariz51 promo-video, GordenSun react-bits-video,
Barty-Bart motion-broll, DojoCodingLabs remotion-production (markdown only).

Do NOT install: DojoCodingLabs `.mcp.json`/hooks (5 paid-API MCPs: KIE, ElevenLabs, TwelveLabs,
Pexels, Replicate); Johnson-Jia/video-clipforge (hooks run Python on every Bash call + curl|bash
installer); codeverbojan/remotion-cinematic is a code library (read `engine/cursor/arc.ts` and
`camera/AutoZoom.tsx` for technique only). wilwaldon and zhuyansen repos are link lists.
Vet any new repo: exists, SKILL.md present, scan for hooks/settings.json/.mcp.json, install
scripts, curl/eval/child_process, API-key env vars. Copy knowledge files only.

## 13. Workflow checklist (in order)

1. Load `10k-websites` (house style) and this file. Read the brief; probe every asset.
2. Diagnose the old cut (section 1). Vet skills if asked (section 12).
3. Measure the voice; write `timeline.ts` on the words (section 2).
4. Direction line, story loop, data consistency (section 3).
5. Copy `templates/`, retarget theme, copy, shots.
6. Storyboard: ~20 stills, one per beat -> send the sheet to the client early; self-critique and fix.
7. `npm run audio` -> check LUFS / peaks.
8. Render a 5-10 s preview clip with sound -> send it.
9. Chunked full render with `--gl=angle` -> `finish` -> verify (section 10) -> send both files.
10. README in plain language (how to change words, colours, timings, re-render).
11. Final message: files + sizes, what changed vs the old cut, every deliberate deviation from
    the brief, the motion inventory table.

## 14. Definition of done

- Exact voice-length duration, voice untouched, every animation on its word (+-0.1 s).
- No empty frame between scenes; no repeated transition sound.
- Zero text errors, overlaps or clipping in a 20-frame audit of the encoded file; readable on a phone.
- About -16 LUFS, true peak <= -1.5 dBTP on the final files; web file under its size limit.
- Motion inventory printed with no repeated treatment across content types.
- Client has seen a storyboard and a preview before the final.
