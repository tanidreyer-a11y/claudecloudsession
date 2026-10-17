// Shared bits for the fx kit: looks (theme tokens), voice-over timing (timing.json from vo_timing.py), anchors.
// Method credits: the HUD/caption language follows the Level 5 workflow guide (@visionaryclown.tv); the
// lineOf/wordOf content anchors and post chain follow pdoom-video (mexicat, MIT, vendor/pdoom-video).
import { Easing, interpolate } from "remotion";

export type Look = {
  name: string; bg: string; ink: string; dim: string; line: string; accent: string; hot: string; deep: string;
  display: string; ui: string; mono: string; serif: string;
};
// Obsidian house look stays the default; the other two are reference looks from the library, used only when asked.
export const LOOKS: Record<"obsidian" | "lumen" | "signal" | "plotter", Look> = {
  obsidian: { name: "obsidian", bg: "#000000", ink: "#DCDEE2", dim: "#9A9CA5", line: "rgba(220,222,226,.32)", accent: "#FFFFFF",
    hot: "#FFFFFF", deep: "#1A1B1F", display: "ArchivoW, Helvetica, Arial, sans-serif", ui: "ArchivoW, Helvetica, Arial, sans-serif",
    mono: "JBMono, ui-monospace, monospace", serif: "InstSerif, Georgia, serif" },
  // lumen = the owner's palette from 2026-10-17: black + white main, electric blue second, lightbulb-white light (hot =
  // the warm halo around the white focus point). White world: bg #F4F5F7 with ink #000. Blue world: deep → bg.
  lumen: { name: "lumen", bg: "#000000", ink: "#F4F5F7", dim: "#9AA0AD", line: "rgba(244,245,247,.3)", accent: "#2F6BFF",
    hot: "#FFE7C2", deep: "#0A1330", display: "ArchivoW, Helvetica, Arial, sans-serif", ui: "ArchivoW, Helvetica, Arial, sans-serif",
    mono: "JBMono, ui-monospace, monospace", serif: "InstSerif, Georgia, serif" },
  signal: { name: "signal", bg: "#0B0A09", ink: "#ECEAE4", dim: "#8F8B84", line: "rgba(236,234,228,.28)", accent: "#FF5A26",
    hot: "#FF3B1F", deep: "#1B1D4A", display: "Unbounded, ArchivoW, sans-serif", ui: "SpaceGrotesk, ArchivoW, sans-serif",
    mono: "JBMono, ui-monospace, monospace", serif: "InstSerifR, Georgia, serif" },
  plotter: { name: "plotter", bg: "#0A0A0B", ink: "#EEE9DF", dim: "#9C978F", line: "rgba(238,233,223,.26)", accent: "#FF4D12",
    hot: "#FF8A3D", deep: "#151517", display: "ArchivoW, Helvetica, Arial, sans-serif", ui: "ArchivoW, Helvetica, Arial, sans-serif",
    mono: "PlexMono, ui-monospace, monospace", serif: "Cormorant, Georgia, serif" },
};

export type Word = { w: string; start: number; end: number; key?: boolean; big?: boolean };
export type Line = { text: string; start: number; end: number; drop?: boolean; words: Word[] };
export type Timing = { method: string; duration: number; wpm?: number; env_fps?: number; env?: number[]; lines: Line[] };

export const SM = Easing.bezier(0.3, 0, 0.2, 1), MV = Easing.bezier(0.6, 0, 0.2, 1);
export const cl = (v: number) => Math.max(0, Math.min(1, v));
export const prog = (t: number, a: number, b: number, e = SM) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

export const allWords = (T: Timing) => T.lines.flatMap((l, li) => l.words.map((w) => ({ ...w, li })));
export const lineAt = (T: Timing, t: number) => {
  let i = -1; T.lines.forEach((l, k) => { if (t >= l.start - 0.05) i = k; }); return i;
};
export const wordAt = (T: Timing, t: number) => { const ws = allWords(T); let i = -1; ws.forEach((w, k) => { if (t >= w.start) i = k; }); return i; };
// Content anchors (pdoom-video): place a beat by WHAT is said, not by a hard-coded second. Cuts land 0.18 s early.
const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "");
export const lineOf = (T: Timing, phrase: string, cut = 0.18) => {
  const l = T.lines.find((x) => clean(x.text).includes(clean(phrase)));
  if (!l) throw new Error(`lineOf: "${phrase}" is not in the script`); return l.start - cut;
};
export const wordOf = (T: Timing, word: string, n = 1) => {
  const hits = allWords(T).filter((w) => clean(w.w) === clean(word));
  if (!hits[n - 1]) throw new Error(`wordOf: "${word}" #${n} is not in the script`); return hits[n - 1].start;
};
export const tc = (t: number) => { const m = Math.floor(t / 60), s = t - m * 60; return `${String(m).padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}`; };
