# Production pipeline

## Tools (all offline-capable)
- `node` + `playwright` (Chromium) — renders `film.html` frame by frame. In Claude Code cloud, Chromium is at
  `/opt/pw-browsers/chromium-*/chrome-linux/chrome`; link the global playwright: `ln -s $(npm root -g)/playwright node_modules/`.
- `ffmpeg` — if absent: `pip install imageio-ffmpeg` and use the bundled binary path it prints.
- Fonts: `npm i @fontsource/<font>` (Google Fonts may be blocked; npm usually isn't).
- `pip install pocketsphinx` — offline word timestamps. `pip install pymupdf numpy pillow`.

## Steps
1. **Draft timing**: write `timing.js` with estimated word times (≈1.8 words/s + paragraph pauses) so you can build
   and show a draft before the voice exists. A draft the user can watch while recording saves a round.
2. **Align the real take**: `python3 scripts/align_vo.py take.mp3` → prints `word@time` list + silence segments.
   Map each cue key in `timing.js` to the matching recognised word (recognition is phonetic: "SmartTech NXT" may come
   out as "smart tag annexed" — match by position).
3. **Stills check**: `FILM=film.html node scripts/engine/stills.mjs 2 8.6 13.5 …` then tile with ffmpeg xstack and look.
4. **Sound**: `python3 scripts/sound_design.py` (reads `timing.js`, `vo.wav`) → `sfx.wav music.wav mix.wav`.
5. **Render**: `node scripts/engine/render.mjs --fps 60 --blur --audio mix.wav --out ../film-16x9.mp4`
   (≈ 20 min for 60 s at 60 fps on a cloud box; run in background).
6. **Share encode**: `ffmpeg -i master.mp4 -c:v libx264 -crf 21 -preset slow -c:a aac -b:a 192k -movflags +faststart share.mp4` (< 30 MB).
7. Commit sources + stems + renders; push.

## Inserting pauses after recording (the "Almost." beat)
- Find silence points: `ffmpeg -af silencedetect=noise=-40dB:d=0.25`.
- Split the VO at points inside existing silences and insert zeros (`scripts/insert_pauses.py`).
- Visuals: wrap `render(t)` with a time-warp `t - P·smoothstep((t-a)/(b-a))` per pause so motion slows into the pause
  instead of freezing; window width ≥ 1.6×P keeps time monotonic.
- Shift every word time after the insertion point by P when re-generating sound.

## Gotchas
- Wrapper recursion: `const baseRender = render; window.render = t => baseRender(warp(t));`
- Partial MP4 while rendering: add to `.git/info/exclude`; remove + commit when done.
- Upload limit 30 MB per file.
- Screen recordings from phones arrive rotated/letterboxed — use `cropdetect` before analysing.
