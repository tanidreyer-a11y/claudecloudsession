import React from "react";
import { useCurrentFrame } from "remotion";
import type { Theme } from "../theme";
import { EASE, enter, prog } from "../lib/motion";

/** Word-by-word reveal (opacity + rise + blur), staggered by the theme. */
export const WordReveal: React.FC<{ t: Theme; text: string; at: number; out?: number; size: number; color?: string; weight?: number; font?: string; align?: "left" | "center" }> = ({
  t, text, at, out, size, color, weight = 600, font, align = "center",
}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, rowGap: 4 }}>
      {words.map((w, i) => (
        <span key={i} style={{ ...enter(f, t, at + i * t.motion.stagger, out, { dy: size * 0.35, blur: 10 }), fontFamily: font ?? t.fonts.display, fontSize: size, fontWeight: weight, color: color ?? t.palette.ink, letterSpacing: `${-0.03 * Math.min(1, size / 100)}em`, lineHeight: 1.05, display: "inline-block" }}>
          {w}
        </span>
      ))}
    </div>
  );
};

/** Vertical word roll (slot machine). `words[i]` lands at `times[i]`; the active word can take its own colour. */
export const WordRoll: React.FC<{ t: Theme; words: string[]; times: number[]; size: number; colors?: string[]; weight?: number; font?: string }> = ({
  t, words, times, size, colors, weight = 700, font,
}) => {
  const f = useCurrentFrame();
  const lh = size * 1.12;
  let pos = 0;
  times.forEach((s, i) => { if (i > 0) pos += prog(f, s - 8, s + 6, EASE.sweep); });
  const blur = times.slice(1).reduce((b, s) => b + Math.max(0, 1 - Math.abs(f - (s - 1)) / 6) * 6, 0);
  return (
    <div style={{ height: lh, overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }}>
      <div style={{ translate: `0 ${-pos * lh}px`, filter: `blur(${blur}px)` }}>
        {words.map((w, i) => (
          <div key={i} style={{ height: lh, fontFamily: font ?? t.fonts.display, fontSize: size, fontWeight: weight, lineHeight: `${lh}px`, color: colors?.[i] ?? t.palette.accent, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
            {w}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Typed text with a caret; cps = characters per second (≈14 human). Returns the element and the finish frame. */
export function typed(f: number, text: string, start: number, fps: number, cps = 14) {
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - start) / fps) * cps)));
  const done = start + Math.ceil((text.length / cps) * fps);
  const caretOn = f < start || f > done ? Math.floor(f / 15) % 2 === 0 : true;
  return { shown: text.slice(0, n), caretOn, done };
}
