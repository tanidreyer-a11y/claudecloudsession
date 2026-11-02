# OBSIDIAN ad — v3 (focus-point cut)

One light carries the whole film: a dot opens each site, the camera dives into that site's own light
(Northlight sun → Atelier Vale laser → estate fire), the light condenses back into a dot, the background
shifts to the next site's palette, and an iris opens the next site from the dot. Cigars window → phone → OBSIDIAN.

- `src/timeline.json` — every cue (picture and sound read the same file). Re-time here when the VO arrives.
- `src/Film.tsx` — the film. `public/site/*` — scroll-captured frames of the four demo sites.
- `audio/build.py` — music + sound (chord colour changes per site, max 3 air moves, no constant swooshes).

Build:
```
python3 audio/build.py
npx remotion render src/index.ts ObsidianV3 out/raw60.mp4 --codec h264 --crf 14 --concurrency 4 --browser-executable=<chromium headless_shell>
ffmpeg -i out/raw60.mp4 -i audio/mix.wav -vf "tmix=frames=2,fps=30" -c:v prores_ks -profile:v 3 -c:a pcm_s16le -shortest out/raw.mov
bash ../../skills/motion-studio/scripts/finish.sh out/raw.mov out/obsidian-ad-v3-16x9 14
```
`node_modules` is a symlink to a scratch install; run `npm i` to recreate. No voice yet.
