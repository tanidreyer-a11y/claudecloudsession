# Phase 3 report — Motion Studio test run (2026-10-02)

## What was tested
1. **5 briefs** (tests/briefs.md) through the recipe engine with history on, so each brief saw the earlier picks
   plus the two real client films.
2. **Diversity matrix** (tests/diversity-matrix.md). The five picked recipes share **0–3 of 10 slots** with each
   other. Across all 15 proposed recipes the mean overlap is 1.3/10, and within each brief's set of three it is 1.1/10.
   The Tally AI pick shares **0 slots** with the ADC and SmartTechNXT films.
3. **One full render + QA**: Tally AI (fictional), recipe A "Sunset Prompt × Kinetic Pop"
   (tests/tally-ai/, README holds the filled QA checklist).
   - 9:16, 20 s, built on the new neutral Remotion template.
   - Self-generated sound.
   - −16.0 LUFS.
   - Web copy 1.8 MB.
4. **Image workflow example**: the bakery's prompt sheet (tests/crumb-and-co-image-prompts.md).

## Bugs found and fixed during the test
| Found | Fix |
|---|---|
| The engine's first version picked incoherent mixes (a bakery got "verb spine + metric cards + chat bubbles") | Each recipe is anchored on a **base card + donor card + one wildcard slot**. Part vibe ranges are derived from their source cards. UI-only parts are marked `needs: [ui]` |
| The third recipe kept landing on the same pair (Lavender Desk × Cobalt Campaign in 3 of 5 briefs) | Recipe C is an exploratory seeded pick; donors are penalised when recently used; base/donor recorded in history |
| A recipe could be labelled "× donor" with the donor contributing nothing | The donor must contribute ≥ 2 parts; the lineage lists base and donor first |
| Empty frames at 3 cuts (frames 66, 300, 432–436) | Each scene's entrance starts 4 frames before its cut. Rule added to the template pattern |
| Lilac glow on light backgrounds looked like a smudge | `Background` takes a `glow` strength; light scenes use 0.18 |
| `finish.sh` made the web copy **bigger** than the master (13 MB vs 7.5 MB), because two-pass always fills the budget | Web copy is now CRF 21 with the budget as a ceiling (1.8 MB here, never over the limit) |
| Google Fonts can't load at render time in sandboxes | The template loads local OFL font files (`public/fonts`, from @fontsource). Works offline and on laptops |
| ref07 was recorded sideways | `teardown.py --rotate cw|ccw|180` |

## Gaps (honest)
1. **The library is thin at the edges.** There's no warm-and-hype card (the gym brief fell back to Cream Cascade
   because nothing sporty exists), no dark-and-warm luxury card (perfume, jewellery, whisky), nothing handmade or raw
   (polish 1–2), and no footage-led reference. **Most valuable next references:** a sports/fitness ad, a perfume or
   fashion film, a food/restaurant reel, and a handmade or lo-fi brand.
2. **The voiceover path wasn't exercised in this test.** There's no ElevenLabs access in the session. The alignment and
   pause tools are proven on the real ADC and SmartTech films, but not re-run here.
3. **No images were generated.** Adobe Firefly and Canva are connected in this session, but generating uses your
   credits, so the test produced a prompt sheet instead. On a real image-led job I'd ask first, then generate 4+
   options per shot.
4. **The vibe axes on the cards are my judgement** [Likely], not measured. Your feedback via `feedback` will tune them.
5. **The shot-card library (152 cards from video-shotcraft, Apache-2.0) is written in Chinese.** Claude reads it fine;
   you can't. I can translate the most-used ~30 if you want to browse them.
6. **Short-form loudness.** Shorts/Reels usually sit around −14 LUFS; `finish.sh` targets −16. Fine for web/LinkedIn;
   add a `--loud` option if clients complain.
7. True peak on the master was −1.4 dBFS against a −1.5 target (0.1 dB over). Not audible; tighten the limiter if a
   platform rejects it.
8. **Remotion in this sandbox needs** `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
   On a laptop Remotion downloads its own.

## Verdict
The engine produces different, coherent recipes per business and per client history, and the Remotion template
renders a clean film from a recipe in about 1.5 minutes for 20 s at 1080×1920. The weakest link is library breadth,
not the engine: every new reference card adds ~12–17 parts and billions of combinations.
