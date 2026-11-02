// Voice HUD (Level 5 "signal" layer): corner brackets, title, timecode + WPM, live transcript down the left edge,
// timeline strip with the voice waveform, keyword marks and a playhead, handle and chapter label.
// <Hud T={timing} t={seconds} look={LOOKS.signal} title="OBSIDIAN / FILM 11" handle="@obsidian" chapters={[[0,"HOOK"],[9,"TURN"]]} />
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Look, LOOKS, Timing, allWords, cl, lineAt, prog, tc } from "./core";

export const Brackets: React.FC<{ look: Look; inset?: number; size?: number; op?: number }> = ({ look, inset = 44, size = 46, op = 1 }) => {
  const s = { position: "absolute" as const, width: size, height: size, opacity: op }, b = `2px solid ${look.ink}`;
  return (<>
    <div style={{ ...s, left: inset, top: inset, borderLeft: b, borderTop: b }} />
    <div style={{ ...s, right: inset, top: inset, borderRight: b, borderTop: b }} />
    <div style={{ ...s, left: inset, bottom: inset, borderLeft: b, borderBottom: b }} />
    <div style={{ ...s, right: inset, bottom: inset, borderRight: b, borderBottom: b }} />
  </>);
};

export const Waveform: React.FC<{ T: Timing; t: number; look: Look; x: number; y: number; w: number; h: number }> = ({ T, t, look, x, y, w, h }) => {
  const env = T.env ?? [], n = env.length, bars = Math.min(160, Math.max(1, n)), D = T.duration;
  const head = cl(t / D) * w;
  return (
    <svg width={w} height={h + 28} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      {Array.from({ length: bars }, (_, i) => {
        const a = Math.floor((i / bars) * n), b = Math.max(a + 1, Math.floor(((i + 1) / bars) * n));
        const v = n ? Math.max(...env.slice(a, b)) : 0, bx = (i / bars) * w, bh = Math.max(2, v * h);
        return <rect key={i} x={bx} y={(h - bh) / 2} width={Math.max(1, w / bars - 2)} height={bh} fill={bx < head ? look.ink : look.dim} opacity={bx < head ? 0.9 : 0.35} />;
      })}
      {allWords(T).filter((wd) => wd.key || wd.big).map((wd, i) => (
        <rect key={"k" + i} x={(wd.start / D) * w - 1} y={-8} width={wd.big ? 4 : 2} height={h + 16} fill={look.accent} opacity={t >= wd.start ? 1 : 0.45} />
      ))}
      {T.lines.filter((l) => l.drop).map((l, i) => <circle key={"d" + i} cx={(l.start / D) * w} cy={h + 20} r={5} fill={look.hot} />)}
      <rect x={head - 1} y={-14} width={2} height={h + 28} fill={look.accent} />
    </svg>
  );
};

export const Transcript: React.FC<{ T: Timing; t: number; look: Look; x: number; y: number; w: number; rows?: number; size?: number }> = ({ T, t, look, x, y, w, rows = 7, size = 22 }) => {
  const cur = lineAt(T, t), first = Math.max(0, cur - rows + 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: look.mono, fontSize: size, lineHeight: 1.45, color: look.ink }}>
      {T.lines.slice(first, Math.max(cur + 1, first)).map((l, k) => {
        const i = first + k, live = i === cur;
        return (
          <div key={i} style={{ opacity: live ? 1 : 0.28 + 0.1 * (k / rows), marginBottom: 10, display: "flex", gap: 14 }}>
            <span style={{ color: look.dim, minWidth: 74 }}>{l.start.toFixed(2)}</span>
            <span>{l.words.map((wd, j) => {
              const said = t >= wd.start, mark = wd.key || wd.big;
              return <span key={j} style={{ opacity: !live || said ? 1 : 0.25, color: mark && said ? look.accent : undefined }}>{wd.w} </span>;
            })}</span>
          </div>
        );
      })}
    </div>
  );
};

export const Hud: React.FC<{
  T: Timing; t: number; look?: Look; title?: string; handle?: string; chapters?: [number, string][]; op?: number; safe?: number;
}> = ({ T, t, look = LOOKS.signal, title = "", handle = "", chapters = [], op = 1, safe = 44 }) => {
  const { width: W, height: H } = useVideoConfig();
  const vert = H > W, chap = [...chapters].reverse().find(([s]) => t >= s)?.[1] ?? "";
  const words = allWords(T).filter((w) => w.start <= t).length;
  const wpm = t > 2 ? Math.round((words / t) * 60) : T.wpm ?? 0;
  const ui: React.CSSProperties = { position: "absolute", fontFamily: look.mono, fontSize: vert ? 22 : 18, color: look.ink, letterSpacing: "0.04em" };
  const reveal = prog(t, 0, 0.6);
  return (
    <AbsoluteFill style={{ opacity: op * reveal, pointerEvents: "none" }}>
      <Brackets look={look} inset={safe} />
      <div style={{ ...ui, left: safe + 64, top: safe + 8 }}>{title}</div>
      <div style={{ ...ui, right: safe + 64, top: safe + 8, textAlign: "right" }}>
        <span>{tc(t)}</span><span style={{ color: look.dim, marginLeft: 18 }}>{wpm} WPM</span>
      </div>
      <Transcript T={T} t={t} look={look} x={safe + 8} y={vert ? H * 0.16 : H * 0.2} w={vert ? W * 0.5 : W * 0.26} size={vert ? 20 : 17} rows={vert ? 5 : 7} />
      <Waveform T={T} t={t} look={look} x={safe + 64} y={H - safe - (vert ? 150 : 110)} w={W - 2 * (safe + 64)} h={vert ? 56 : 44} />
      <div style={{ ...ui, left: safe + 64, bottom: safe + 8, color: look.dim }}>{handle}</div>
      <div style={{ ...ui, right: safe + 64, bottom: safe + 8, color: look.accent }}>{chap}</div>
    </AbsoluteFill>
  );
};
