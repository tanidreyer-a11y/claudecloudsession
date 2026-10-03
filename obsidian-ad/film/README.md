# OBSIDIAN ad film (Remotion)

- `src/Film.tsx`: the whole film (52 s, 16:9). A neon cursor drives every scene. Timing in `src/timeline.json`
  (estimated from ../SCRIPT.md; re-time to the recorded voice).
- Images: client heroes show "IMAGE · hero_*.jpg" placeholders. Put the generated files in `public/img/` and swap
  `<HeroImage>` for `<Img src={staticFile("img/hero_guesthouse.jpg")}>` (2-minute change).
- Scrub frames (not in git): regenerate from the site repo videos:
  `for v in sequence laptop monolith; do mkdir -p public/seq/$v; ffmpeg -i ../../cinematic-obsidian/public/videos/obsidian-$v.mp4 -vf scale=1280:-2 -q:v 3 public/seq/$v/%03d.jpg; done`
- Sound: `python3 audio/build.py` (self-generated). Render at 60 fps, blend to 30 (tmix), mux, then
  `skills/motion-studio/scripts/finish.sh`.
