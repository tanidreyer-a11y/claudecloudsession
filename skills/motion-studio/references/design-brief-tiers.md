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

## Voice script rules (fixes "too fast" / "too slow")
- **Word budget:** 130–150 words per 60 s of narration. Count before recording. Under 110 sounds slow and empty; over 160 sounds rushed.
- **One idea per line**, short lines, written to be heard. Hook → problem → the brand arrives → what it does → name → line → CTA.
- **Pauses:** on Multilingual v2 use `<break time="0.8s" />` (short) and `<break time="1.4s" />` (scene change) instead of blank lines and "..."; ElevenLabs documents break tags as the consistent method, ellipses as inconsistent. Max ~8 breaks per take (too many make the model unstable).
- **Speed:** start at 0.92–0.95 with breaks doing the slowing. Never go below 0.85 to "add space"; that stretches the words instead of the gaps.
- **Test read:** generate the first two lines only, time them, then the full take.
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

## Physical-product ads (not yet proven: test before selling)
- Always the client's **real product photo** (packshot, evenly lit, clean silhouette). Never let AI redraw a real label or pack.
- Build around it: generated scene behind, slow camera move, a light sweep across the pack, text and voice doing the selling.
- Three cuts per product from one shoot: reveal, feature, lifestyle/context.

Sources: SaaS script pacing (130–150 words per 60 s; 140–160 wpm) from motiongility.com and voxbooster.com; ElevenLabs
prompting docs (break tags on Multilingual v2, instability with too many breaks); motiontheagency.com on restrained
premium sound design; product-ad practice from nightjar.so and programminginsider.com.
