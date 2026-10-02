# Test film — Tally AI (fictional), recipe A "Sunset Prompt × Kinetic Pop"

- Output: `out/tally-ai-test-9x16-web.mp4` (1.8 MB, share copy) and `out/tally-ai-test-9x16-master.mp4` (7.3 MB).
  9:16, 1080×1920, 20 s, 30 fps.
- Engine: Remotion 4.0.529, built from `templates/remotion` (theme.ts filled from the recipe; Film.tsx = 6 scenes).
  Render: `npm i` (in a copy of the template), then `npx remotion render src/index.ts Film out/raw.mp4 --browser-executable=<chromium headless_shell>`.
  Audio: `python3 audio/build_audio.py`. Mux, then `scripts/finish.sh`.
- Recipe: launch-teaser · short-punch · locked-type · [beat-cut, word-roll, send-is-the-cut] · word-swap-colour ·
  mono-flip-gradient · prompt-bar-results · crisp-ui · sparse-minimal · typed-promise.

## Sources
- Fonts: Inter, DM Sans (SIL OFL 1.1, via @fontsource, files in public/fonts).
- Sound: self-generated with numpy (audio/build_audio.py); no third-party audio.
- Images: none (graphic recipe). Data: fictional, labelled "Demo data · fictional company" on screen.
- No VO: no ElevenLabs access in the test session. Text-led beat sheet instead (see report).

## QA checklist (run on the encoded web file, 24 frames: out/qa_web.jpg)
- [x] Hook moves in the first 15 frames (bar rises, typing starts at 0.35 s).
- [x] One idea per scene; CTA "Join the waitlist" on screen for 2.1 s.
- [x] Truth: pre-launch product → waitlist CTA, not "available now"; all numbers fictional and labelled; no testimonials.
- [x] Recipe followed; nothing copied from ref07/ref05 (own copy, own layout, own palette: teal/indigo/amber, not sunset coral).
- [x] Not a repeat: shares 0–1 of 10 slots with the other picked test recipes and 0 with the two real client films.
- [x] No ADC/SmartTechNXT palette, font or signature move.
- [x] No empty frames. **Failed first pass**: frames 66, 300 and 432–436 were empty at the cuts. Fixed by starting each
      scene's entrance 4 frames before its cut. Re-checked.
- [x] Text ≥ 26 px at 1080 width, contrast OK (ink on paper, paper on charcoal, white on the gradient).
      Critical content is inside the middle 75 % for 9:16.
- [x] Lilac glow on paper read as a smudge on the first pass. Glow lowered to 0.18 on light scenes.
- [x] Motion inventory: typing → caret + clicks · chips → rise + blur, staggered · results → crossfade + slide ·
      claim → vertical roll with blur · table rows → staggered rise · flag → amber wash · hero → word reveal ·
      logo → blur-rise + dot spring. No treatment repeated across content types.
- [x] Sound: 3 air moves total, UI tones in A minor → C major at the hero, music-free silence used under typing.
      Loudness −16.0 LUFS master / −16.1 web.
- [~] True peak: master sample peak −1.4 dBFS against a −1.5 target (0.1 dB over). Acceptable for web; tighten the
      limiter in finish.sh if a platform rejects it.
- [x] Files: master + web (1.8 MB, under the 15 MB WhatsApp limit). Duration 20.0 s.
