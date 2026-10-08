# Design brief: what "premium" means, per tier (research + our own approved films)

Read this before every film. It sits under the quality floor in SKILL.md (SmartTech NXT "Crossroads").

## The two proven models

| | **Story film** (SmartTech NXT "Crossroads" method) | **Signature** (ElevenLabs-launch method, e.g. ref01 → `avant-intelligence/films-v3-agents`) |
|---|---|---|
| Spine | One idea taken from the brand itself (logo, name, product), carried start to finish | One object or light that becomes everything: pixels → icons → a falling light → an orb → the logo |
| Camera | Calm; pushes and reveals | Continuous fall through one tall world (the "droplet" camera), then a dive *through* an object into the next world |
| Colour | Brand palette, one accent | Vivid but controlled: 4–6 saturated hues on near-black, then one full-bleed gradient scene (lilac / cyan / pink / navy) |
| Voice | Required; one idea per line | Optional; the cut breathes on its own beats (a hold after every move) |
| Length | 45–60 s | 30–35 s (vertical first), 16:9 adaptation after |

## Voice script rules (see script-voice-pacing.md §4 for the full system)
- **Default = the proven calm read:** 95–110 words per 60 s, Oliver, Multilingual v2, **Speed 0.87** (SmartTech
  Crossroads, approved). The 130–150 words/min figure from explainer-video research is for *standard explainers*,
  not our premium films.
- **Never fix pace with the speed slider.** Speed 0.80 made it drag; cutting the pauses out made it rush. Pace is set
  by the word budget and the pauses; speed stays 0.87.
- **Pauses:** one idea per line, blank line between lines; on Multilingual v2 a `<break time="1.0s" />` is the most
  consistent way to force a longer hold (max ~6 per take). "..." only for weight inside a line.
- **Test read:** generate the first four lines, time them against the formula, then the full take.
- Picture is cut to the voice, never the voice stretched to the picture.

## Sound rules
- Restrained, tactile, expensive: if someone notices the sound design as a separate thing, it's too loud.
- Every sound is a note of the current chord (bells, plucks, glass ticks). Max 3 air moves per film. No stock whoosh packs, no cartoon or game stingers, no braam on every cut.
- Sync to the motion curve, not just the start frame: a 12-frame ease gets a sound that breathes with it.
- Music changes chord with each scene (each colour world has its own chord).

## Picture rules
- Change the image every 3–5 s; never let a frame sit static (idle motion on anything held more than 2 s).
- Few elements on screen, each with a job. Depth through blur (shallow depth of field on chat or cards), not clutter.
- Colours: saturated hues on near-black, or one bright full-bleed gradient. Never mid-grey "dull" palettes.
- Every scene hands over to the next through an object (light, orb, circle wipe, ring), not a cut to black.

## App and website ads (the Uber-style method)
- Get the real product first (intake 4c): web apps we open and capture ourselves (Playwright screenshots/recordings,
  test account if needed); phone apps come as client screen recordings or screenshots.
- Pick 2–3 moments that show how it works (request → match → arrive; draft → approve → paid).
- Rebuild those pieces as clean vector UI in code (map, card, button, status) so they are sharp and can move on their
  own. Don't play a full-screen recording; lift elements out of the screen and let them travel through the scene.
- Location (with consent) drives map and city scenes; never show a real customer's data.

## Text on screen (owner feedback, Oct 2026)
- Text must belong to the scene: printed on an object, moving with the camera, partly behind things, or built from the
  scene's own material. Plain centred white text faded in on top reads as "just put there".
- Each film gets its own type treatment; never reuse one caption style across a series.

## Physical-product ads (not yet proven: test before selling)
- Always the client's **real product photo** (packshot, evenly lit, clean silhouette). Never let AI redraw a real label or pack.
- Build around it: generated scene behind, slow camera move, a light sweep across the pack, text and voice doing the selling.
- Three cuts per product from one shoot: reveal, feature, lifestyle/context.

Sources: SaaS script pacing (130–150 words per 60 s; 140–160 wpm) from motiongility.com and voxbooster.com; ElevenLabs
prompting docs (break tags on Multilingual v2, instability with too many breaks); motiontheagency.com on restrained
premium sound design; product-ad practice from nightjar.so and programminginsider.com.
