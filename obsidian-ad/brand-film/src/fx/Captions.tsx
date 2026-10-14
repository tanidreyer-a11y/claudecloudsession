// Word-by-word captions driven by timing.json. Keywords (*word* in the script) sit in accent brackets; big words
// (**word**) punch in larger; a readout shows the last keyword with its time ("05.58s ▸ TALLY").
// One line on screen at a time, inside the middle 80 % (phones crop), off the bottom UI third on 9:16.
import React from "react";
import { useVideoConfig } from "remotion";
import { Look, LOOKS, Timing, allWords, cl, lineAt, prog, MV } from "./core";

export const Captions: React.FC<{
  T: Timing; t: number; look?: Look; y?: number; size?: number; readout?: boolean; brackets?: boolean; upper?: boolean; maxWords?: number;
}> = ({ T, t, look = LOOKS.signal, y, size, readout = true, brackets = true, upper = false, maxWords = 4 }) => {
  const { width: W, height: H } = useVideoConfig();
  const vert = H > W, fs = size ?? (vert ? 64 : 54), top = y ?? (vert ? H * 0.62 : H * 0.72);
  const li = lineAt(T, t); if (li < 0) return null;
  const L = T.lines[li], out = 1 - prog(t, L.end + 0.25, L.end + 0.45);
  if (out <= 0) return null;
  const last = L.words.filter((w) => (w.key || w.big) && w.start <= t).pop();
  // phrase chunks: break after punctuation or at maxWords, show the chunk holding the latest spoken word
  const chunks: number[][] = [[]];
  L.words.forEach((w, i) => { const c = chunks[chunks.length - 1]; c.push(i); if ((/[.,!?;:]$/.test(w.w) || c.length >= maxWords) && i < L.words.length - 1) chunks.push([]); });
  const spoken = L.words.filter((w) => w.start - 0.04 <= t).length - 1;
  const chunk = chunks.find((c) => c.includes(Math.max(0, spoken))) ?? chunks[0];
  return (
    <>
      <div style={{ position: "absolute", left: W * 0.1, width: W * 0.8, top, textAlign: "center", fontFamily: look.ui, fontWeight: 700,
        fontSize: fs, lineHeight: 1.12, color: look.ink, opacity: out, textTransform: upper ? "uppercase" : "none" }}>
        {chunk.map((i) => {
          const w = L.words[i];
          const k = prog(t, w.start - 0.04, w.start + 0.12, MV); if (k <= 0) return null;
          const hit = w.big ? 1 + 0.18 * (1 - prog(t, w.start, w.start + 0.35)) : 1;
          const mark = (w.key || w.big) && brackets;
          return (
            <span key={i} style={{ display: "inline-block", marginRight: fs * 0.26, opacity: k, filter: `blur(${(1 - k) * 8}px)`,
              transform: `translateY(${(1 - k) * fs * 0.25}px) scale(${hit})`, color: w.key || w.big ? look.accent : undefined,
              fontSize: w.big ? fs * 1.25 : fs }}>
              {mark && <span style={{ fontFamily: look.mono, fontWeight: 400, opacity: 0.8 }}>[</span>}{w.w}{mark && <span style={{ fontFamily: look.mono, fontWeight: 400, opacity: 0.8 }}>]</span>}
            </span>
          );
        })}
      </div>
      {readout && last && (
        <div style={{ position: "absolute", left: W * 0.1, width: W * 0.8, top: top - fs * 0.9, textAlign: "center", fontFamily: look.mono,
          fontSize: Math.round(fs * 0.34), color: look.dim, letterSpacing: "0.06em", opacity: out * cl((t - last.start) / 0.1) }}>
          {last.start.toFixed(2).padStart(5, "0")}s ▸ <span style={{ color: look.accent }}>{last.w.replace(/[^\w'-]/g, "").toUpperCase()}</span>
        </div>
      )}
    </>
  );
};
