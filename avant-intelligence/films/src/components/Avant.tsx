import React from "react";
import { GLYPHS, LOGO_H, LOGO_W } from "../logo";
import { theme as t } from "../theme";
import { EASE, hash, prog } from "../lib/motion";

/** Glow orb (an agent, or the spark). r = core radius in world px. */
export const Orb: React.FC<{ x: number; y: number; r: number; color: string; intensity?: number; pulse?: number }> = ({ x, y, r, color, intensity = 1, pulse = 0 }) => {
  if (intensity <= 0.001) return null;
  const R = r * (1 + 0.08 * pulse);
  return (
    <div style={{ position: "absolute", left: x - R * 6, top: y - R * 6, width: R * 12, height: R * 12, opacity: intensity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${color}55 0%, ${color}18 22%, transparent 60%)` }} />
      <div style={{ position: "absolute", left: R * 5, top: R * 5, width: R * 2, height: R * 2, borderRadius: "50%", background: `radial-gradient(circle at 38% 35%, #ffffff 0%, ${color} 45%, ${color}cc 70%, ${color}00 100%)`, boxShadow: `0 0 ${R * 1.6}px ${color}, 0 0 ${R * 4}px ${color}88` }} />
    </div>
  );
};

/** A line drawn from a→b, progress p (0..1), with a soft glow. Drawn in an absolutely positioned SVG over the world. */
export const GlowLine: React.FC<{ a: [number, number]; b: [number, number]; p: number; color: string; w?: number; opacity?: number; color2?: string; id?: string }> = ({ a, b, p, color, w = 2, opacity = 1, color2, id = "g" }) => {
  if (p <= 0) return null;
  const x2 = a[0] + (b[0] - a[0]) * p, y2 = a[1] + (b[1] - a[1]) * p;
  const minx = Math.min(a[0], x2) - 40, miny = Math.min(a[1], y2) - 40;
  const W = Math.abs(x2 - a[0]) + 80, H = Math.abs(y2 - a[1]) + 80;
  const gid = `${id}-${Math.round(a[0])}-${Math.round(a[1])}`;
  return (
    <svg style={{ position: "absolute", left: minx, top: miny, overflow: "visible", opacity }} width={W} height={H}>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={a[0] - minx} y1={a[1] - miny} x2={x2 - minx} y2={y2 - miny}>
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color2 ?? color} />
        </linearGradient>
      </defs>
      <line x1={a[0] - minx} y1={a[1] - miny} x2={x2 - minx} y2={y2 - miny} stroke={`url(#${gid})`} strokeWidth={Math.min(w * 5, w + 24)} strokeLinecap="round" opacity={w > 8 ? 0.08 : 0.12} />
      <line x1={a[0] - minx} y1={a[1] - miny} x2={x2 - minx} y2={y2 - miny} stroke={`url(#${gid})`} strokeWidth={w} strokeLinecap="round" />
    </svg>
  );
};

/** Glass task chip with a status dot. state: 0 = open (amber flicker), 1 = done (agent colour + tick). */
export const Chip: React.FC<{ x: number; y: number; text: string; sub: string; state: number; color: string; f: number; seed: number; style?: React.CSSProperties; scale?: number }> = ({ x, y, text, sub, state, color, f, seed, style, scale = 1 }) => {
  const flick = 0.55 + 0.45 * Math.abs(Math.sin(f / 9 + seed * 3.1));
  const amber = "#F2A33A";
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(scale), ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px 16px 18px", borderRadius: 18, background: "rgba(255,255,255,.055)", border: `1px solid ${state > 0.5 ? color + "66" : "rgba(255,255,255,.12)"}`, boxShadow: state > 0.5 ? `0 0 30px ${color}33` : "none", backdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, position: "relative", background: state > 0.5 ? color : "transparent", border: `2px solid ${state > 0.5 ? color : amber}`, opacity: state > 0.5 ? 1 : flick, boxShadow: state > 0.5 ? `0 0 14px ${color}` : `0 0 10px ${amber}66` }}>
          {state > 0.5 && (
            <svg width="30" height="30" viewBox="0 0 24 24" style={{ position: "absolute", left: -2, top: -2 }}>
              <path d="M6.5 12.5l3.6 3.6L17.5 8.5" stroke="#04121a" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <div style={{ fontFamily: t.fonts.text, fontSize: 26, fontWeight: 600, color: t.palette.ink }}>{text}</div>
          <div style={{ fontFamily: t.fonts.text, fontSize: 21, fontWeight: 500, color: state > 0.5 ? color : "#C99A5E", marginTop: 2, letterSpacing: "0.02em" }}>{state > 0.5 ? "Handled" : sub}</div>
        </div>
      </div>
    </div>
  );
};

/** Chat bubble. side "left" = customer (neutral), "right" = the brand's agent (agent colour). */
export const Bubble: React.FC<{ x: number; y: number; text: string; time: string; side: "left" | "right"; color?: string; ticks?: 0 | 1 | 2; w?: number; style?: React.CSSProperties; agent?: string }> = ({ x, y, text, time, side, color = t.palette.accent, ticks = 1, w = 640, style, agent }) => {
  const right = side === "right";
  return (
    <div style={{ position: "absolute", left: right ? x - w : x, top: y, width: w, display: "flex", flexDirection: "column", alignItems: right ? "flex-end" : "flex-start", ...style }}>
      {agent && <div style={{ fontFamily: t.fonts.text, fontSize: 22, fontWeight: 600, color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{agent} agent</div>}
      <div style={{ maxWidth: w, padding: "22px 28px", borderRadius: 30, borderBottomLeftRadius: right ? 30 : 8, borderBottomRightRadius: right ? 8 : 30, background: right ? `linear-gradient(135deg, ${color}38, ${color}18)` : "rgba(255,255,255,.07)", border: `1px solid ${right ? color + "77" : "rgba(255,255,255,.12)"}`, boxShadow: right ? `0 0 40px ${color}2a` : "none", backdropFilter: "blur(12px)" }}>
        <div style={{ fontFamily: t.fonts.text, fontSize: 34, fontWeight: 500, color: t.palette.ink, lineHeight: 1.3 }}>{text}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 8, fontFamily: t.fonts.text, fontSize: 22, color: t.palette.muted }}>
          {time}
          {ticks > 0 && (
            <svg width="34" height="20" viewBox="0 0 34 20">
              <path d="M2 10.5l5 5L17 4.5" stroke={ticks === 2 ? t.palette.accent : t.palette.muted} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {ticks === 2 && <path d="M12 15.5L22 4.5" stroke={t.palette.accent} strokeWidth={2.4} fill="none" strokeLinecap="round" />}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

/** Deterministic dot field. Each dot falls from above into a scattered spot, can later be pulled into a grid. */
export type Dot = { sx: number; sy: number; gx: number; gy: number; delay: number; slip: boolean; size: number };
export function makeDots(n: number, cx: number, cy: number, w: number, h: number, cols: number, gridW: number, gridH: number): Dot[] {
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const r1 = hash(i + 1), r2 = hash(i + 101), r3 = hash(i + 201);
    const c = i % cols, r = Math.floor(i / cols);
    return {
      sx: cx + (r1 - 0.5) * w * (0.6 + 0.4 * r3),
      sy: cy + (r2 - 0.5) * h * (0.6 + 0.4 * hash(i + 301)),
      gx: cx - gridW / 2 + (c / (cols - 1)) * gridW,
      gy: cy - gridH / 2 + (r / Math.max(1, rows - 1)) * gridH,
      delay: r3,
      slip: hash(i + 401) < 0.18,
      size: 3 + hash(i + 501) * 3,
    };
  });
}

/** The wordmark. `blue` lets the Λ be placed independently (for the assembly); `whiteP` reveals the other letters. */
export const Wordmark: React.FC<{ width: number; whiteP: number; blueTransform?: string; blueOpacity?: number; glow?: number; stagger?: number }> = ({ width, whiteP, blueTransform, blueOpacity = 1, glow = 0, stagger = 0.12 }) => {
  const s = width / LOGO_W;
  let wi = 0;
  return (
    <svg width={width} height={LOGO_H * s} viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} style={{ overflow: "visible" }}>
      <defs>
        <filter id="lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {GLYPHS.map((g, i) => {
        if (g.cls === "blue") {
          return <path key={i} d={g.d} fill={t.palette.accent} opacity={blueOpacity} transform={blueTransform} filter={glow > 0 ? "url(#lg)" : undefined} />;
        }
        const k = wi++;
        const p = Math.min(1, Math.max(0, (whiteP - k * stagger) / (1 - 3 * stagger)));
        const e = EASE.out(p);
        return <path key={i} d={g.d} fill="#FFFFFF" opacity={e} transform={`translate(0 ${(1 - e) * 10})`} style={{ filter: `blur(${(1 - e) * 2}px)` }} />;
      })}
    </svg>
  );
};

export const BLUE = GLYPHS.find((g) => g.cls === "blue")!;
/** Centre-line of the blue Λ in logo units: apex and the two foot centres. */
export const LAMBDA = { apex: [187.4, 3] as [number, number], left: [157, 55.19] as [number, number], right: [217.5, 55.19] as [number, number] };

export { prog, EASE };
