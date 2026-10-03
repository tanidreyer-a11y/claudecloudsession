// One timeline of named keys in SECONDS. Picture (and the audio script, via `npm run audio`) read this file.
// With a voiceover, replace the estimates with aligned word times (scripts/align_vo.py) and keep keys relative to words.
export const T = {
  intro: 0.0,
  title: 0.4,
  card: 2.6,
  outro: 6.2,
  end: 8.0,
};
export const sec = (s: number, fps: number) => Math.round(s * fps);
