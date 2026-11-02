import J from "./timeline.json";
// Named keys in seconds — read by the picture (here) and by audio/build_audio.py (timeline.json).
export const T = J;
export const sec = (s: number, fps: number) => Math.round(s * fps);
