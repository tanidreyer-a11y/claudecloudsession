# Sound design

`scripts/sound_design.py` builds three stems from the word timings and mixes them with the voice:
- **SFX kit (synthesised)**: `whoosh(dur, f0, f1)` filtered-noise sweep, `tone(f, dur, decay)` UI pings,
  `click()`, `riser(dur)`, `boom()` sub hit, `shimmer(dur)` bright tail.
- **Music**: slow pad chords (change at act boundaries) + soft sub pulse (60 bpm calm / 120 bpm after the turn).
- **Ducking**: music → 0 for "signal lost"/static and around the hook word; back with a lift on the reveal.

Cue rules: whoosh on every camera move or element entrance; ticks on checks/validations (one per item, 0.2 s apart);
rising pings for Prepare/Approve/Done; static noise for "noise"; riser into every zoom-through; boom + shimmer on
brand reveal and logo; small click on CTA.

Levels: voice peak ≈ −5 dB; SFX peak ≈ −8 dB; music peak ≈ −22 dB. Check with `ffmpeg -af volumedetect`.

Be honest: synthetic SFX are good-not-great. Offer the stems (`vo.wav`, `sfx.wav`, `music.wav`) so the user can swap
in licensed music/SFX (Artlist, Epidemic, DaVinci's library) in DaVinci Resolve without losing sync.
