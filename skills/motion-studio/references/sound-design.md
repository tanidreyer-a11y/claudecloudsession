# Sound design

Sound is half of perceived quality. Two implementations exist:
- **Musical (preferred)** — a numpy + scipy synthesiser (port it into `scripts/sound_design.py` or a Remotion `audio/` script):
  warm pad (detuned saw+triangle, dark/bright lowpassed copies crossfaded by a brightness curve), sub on roots, faint
  shimmer, synthetic convolution reverb (~2.6 s); chord changes ON story beats; UI sounds as notes in the current
  chord (felt piano = messages, marimba = rows/letters, glass bell = confirmations); envelope ducking; loudness master.
- **Simple kit** — `scripts/sound_design.py` (HTML films): whoosh/tone/click/riser/boom/shimmer + pad + pulse, cued
  from `timing.js`. **Its example cue list uses a whoosh on almost every move — re-cue it to the rules below.**

## Rules
1. Music bed first; place chord changes in silences on story beats (minor in the problem, open at the turn,
   add9 bloom at the logo, resolve at the end). Level automation by act. Bed alone ≈ −31 LUFS.
2. UI events = musical notes in the current chord, each with a different pitch/pan; sequences ascend chord tones
   (rows lighting up; spelled letters A-D-C = D, F#, A).
3. Foley only with meaning: paper landing, stamp, mouse down/up, keys (random timing/pitch), latch, chime,
   risers into the two big reveals, soft sub impact on the logo bloom.
4. **≤ 3 whoosh/air moves per film**, each a different band/length/pan. Never one sound per cut.
5. Silence is a sound: drop the music for the hook word ("Almost.") and for "signal lost".
6. Pan toward where the event is on screen; place hits 0–3 frames early.
7. Duck from the voice envelope (1 kHz control rate, fast attack/slow release, 120 ms hold): music −9 dB,
   SFX −4.5 dB under speech.
8. 0.2 s fade on music/SFX at the end; keep the voice at its native sample rate.
9. Master with `scripts/finish.sh` (alimiter → two-pass loudnorm −16 LUFS, TP −1.5); verify with ebur128 on final files.
10. You can't hear it: say so, keep synth conservative, deliver stems (`vo/sfx/music.wav`) for licensed swaps in DaVinci.
