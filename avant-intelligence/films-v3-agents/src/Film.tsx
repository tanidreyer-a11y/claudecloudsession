// Avant Intelligence — "Agents" (9:16, ~33 s). A shot-for-shot study of the ElevenAgents launch film (ref01),
// rebuilt for Avant with Avant's own agents, copy and logo:
// pixels rain onto a shelf → the agents appear beneath it → the pixels sort into channel icons → one line runs down,
// a light falls along it lighting each agent → the light swells into a glass orb → the camera dives through it into a
// vivid chat → the agents branch out → a dark circle opens the approval queue and the tools it connects to → a ring
// closes to 24/7 → one orb → the Λ → AVANT. No voice: the picture breathes on its own beats (holds after each move).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { LOGO_PATHS, LOGO_VB } from "./logo";

export const FPS = 60;
export const DUR = 33.5;

const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  io: Easing.bezier(0.65, 0, 0.35, 1),
  grav: Easing.bezier(0.5, 0, 0.9, 0.55),
};
const prog = (s: number, a: number, b: number, ease = E.out) => interpolate(s, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const win = (s: number, a: number, b: number, c: number, d: number) => prog(s, a, b) * (1 - prog(s, c, d, E.in));
const h = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

const FONT = "Inter, Helvetica, Arial, sans-serif";
const C = { lilac: "#B9A6FF", pink: "#FF9FCB", cyan: "#5FD6FF", blue: "#5B83FF", orange: "#FF8A3C", violet: "#A274FF", green: "#3FE6A6", teal: "#56E1E9", avant: "#3BC1EC", ink: "#F4F5F8", muted: "#9AA0AE" };
const PIX = [C.lilac, C.pink, C.cyan, C.blue];

// ---------------- glyphs (24-unit, stroked) ----------------
const G: Record<string, string> = {
  phone: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z",
  chat: "M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  mail: "M3 5h18v14H3z M3 6l9 7 9-7",
  bubble: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z M8.5 12h.01 M12 12h.01 M15.5 12h.01",
  sms: "M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8 10.5h8",
  doc: "M6 2h8l4 4v16H6z M14 2v4h4 M9 12h6 M9 16h6",
  sheet: "M3 4h18v16H3z M3 9h18 M3 14h18 M9 4v16",
  calendar: "M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4",
  bank: "M3 10l9-6 9 6 M5 10v8 M9.5 10v8 M14.5 10v8 M19 10v8 M3 21h18",
  shield: "M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z M8.5 12l2.5 2.5 4.5-5",
};
const Glyph: React.FC<{ d: string; size: number; color?: string; sw?: number; style?: React.CSSProperties }> = ({ d, size, color = "#fff", sw = 1.6, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ---------------- world layout (scenes 1–4 share one tall world; the camera falls through it) ----------------
const COLS = 22, ROWS = 8, PS = 34, PG = 6, X0 = (1080 - (COLS * (PS + PG) - PG)) / 2, SHELF = 1000;
const CARD_X = [0, 1, 2, 3].map((i) => 540 + (i - 1.5) * 232);
const AGENTS = ["Collections", "Invoice capture", "Lead router", "Front desk"];
const ICONS = [
  { g: G.chat, x: 350, y: 1830, s: 112 }, { g: G.mail, x: 730, y: 1830, s: 112 },
  { g: G.bubble, x: 250, y: 1985, s: 112 }, { g: G.sms, x: 830, y: 1985, s: 112 },
];
const PHONE = { x: 540, y: 1915, s: 158 };
const NODE = { x: 540, y: 2250 };
const LINE_END = 4300;
const NODES = [
  { y: 2650, c: C.orange, t: "Collections", d: "Chasing INV-1042 · R8,450" },
  { y: 3020, c: C.violet, t: "Invoice capture", d: "46 line items captured" },
  { y: 3390, c: C.green, t: "Lead router", d: "New lead → Sales in 2 min" },
  { y: 3760, c: C.cyan, t: "Front desk", d: "12 enquiries answered tonight" },
];

const dotP = (s: number) => prog(s, 10.9, 14.3, E.io);
const dotY = (s: number) => lerp(NODE.y, LINE_END, dotP(s));
const camY = (s: number) => {
  if (s < 10.6) return 1000 * prog(s, 5.9, 8.4, E.io);
  return lerp(1000, LINE_END - 900, prog(s, 10.6, 14.6, E.io));
};

function pixelState(i: number, s: number) {
  const c = i % COLS, r = Math.floor(i / COLS);
  const col = Math.floor(h(i, 1) * 4);
  const sx = X0 + c * (PS + PG), sy = SHELF - (r + 1) * (PS + PG) + PG;
  const tl = 0.35 + r * 0.46 + h(i, 2) * 0.85; // land
  const fall = prog(s, tl - 0.85, tl, E.grav);
  let x = sx, y = lerp(sy - 1500 - h(i, 3) * 500, sy, fall), sc = 1, o = s > tl - 0.85 ? 1 : 0;
  // release: sort by colour into the agent columns below the shelf
  const tr = 5.5 + (ROWS - 1 - r) * 0.07 + h(i, 4) * 0.55;
  const rel = prog(s, tr, tr + 1.15, E.grav);
  if (rel > 0) {
    const tx = CARD_X[col] + (h(i, 5) - 0.5) * 150, ty = 1230 + h(i, 6) * 560;
    x = lerp(sx, tx, E.io(rel)); y = lerp(sy, ty, rel);
  }
  // converge into the channel icons
  const tc = 8.0 + h(i, 7) * 0.5;
  const cv = prog(s, tc, tc + 0.85, E.io);
  if (cv > 0) {
    const ic = ICONS[col];
    const fx = CARD_X[col] + (h(i, 5) - 0.5) * 150, fy = 1230 + h(i, 6) * 560;
    x = lerp(fx, ic.x - PS / 2, cv); y = lerp(fy, ic.y - PS / 2, cv); sc = 1 - 0.75 * cv; o = 1 - cv;
  }
  return { x, y, sc, o, col };
}

const World: React.FC<{ s: number }> = ({ s }) => {
  const cy = camY(s);
  const dy = dotY(s);
  const shelfO = prog(s, 0.15, 0.9) * (1 - prog(s, 7.6, 8.4));
  const lineDraw = prog(s, 10.1, 11.5, E.io);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 5000, transform: `translateY(${-cy}px)` }}>
      {/* shelf */}
      <div style={{ position: "absolute", left: X0 - 20, top: SHELF + 4, width: COLS * (PS + PG) + 34, height: 2, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent)", opacity: shelfO }} />
      {/* pixels */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const p = pixelState(i, s);
        if (p.o <= 0.01 || p.y > cy + 2000 || p.y < cy - 300) return null;
        const col = PIX[p.col];
        const dim = h(i, 9) < 0.22 ? 0.28 : 0.55 + 0.45 * h(i, 10);   // a mosaic: some tiles barely lit
        return <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: PS, height: PS, borderRadius: 5, opacity: p.o * dim, transform: `scale(${p.sc})`, background: `linear-gradient(155deg, #ffffff55 0%, ${col} 28%, ${col}B0 100%)`, boxShadow: `0 0 14px ${col}40, inset 0 0 0 1px rgba(255,255,255,.12)` }} />;
      })}
      {/* agent cards under the shelf, each with a coloured dish of light */}
      {CARD_X.map((x, i) => {
        const k = prog(s, 4.9 + i * 0.12, 5.7 + i * 0.12) * (1 - prog(s, 7.7, 8.4));
        return (
          <div key={i} style={{ position: "absolute", left: x - 100, top: SHELF + 44, width: 200, opacity: k, transform: `translateY(${24 * (1 - k)}px)` }}>
            <div style={{ height: 50, borderRadius: 25, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", color: C.ink, fontFamily: FONT, fontSize: 21, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>{AGENTS[i]}</div>
            <div style={{ margin: "14px auto 0", width: 170, height: 34, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 30%, ${PIX[i]} 0%, ${PIX[i]}66 45%, transparent 72%)`, filter: "blur(2px)" }} />
          </div>
        );
      })}
      {/* channel icons */}
      {[...ICONS, { g: G.phone, ...PHONE }].map((ic, i) => {
        const k = prog(s, 8.55 + (i === 4 ? 0.25 : i * 0.07), 9.25 + (i === 4 ? 0.25 : i * 0.07), E.out) * (1 - prog(s, 12.2, 12.9));
        const fl = Math.sin(s * 1.3 + i) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: ic.x - ic.s / 2, top: ic.y - ic.s / 2 + fl, width: ic.s, height: ic.s, borderRadius: ic.s * 0.26, background: "linear-gradient(160deg,#26272d,#15161a)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "0 18px 40px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>
            <Glyph d={ic.g} size={ic.s * 0.42} />
          </div>
        );
      })}
      {/* wires: icons → node, then the long line down */}
      <svg width={1080} height={5000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[...ICONS, { ...PHONE }].map((ic, i) => {
          const sy = ic.y + ic.s / 2;
          const d = `M${ic.x},${sy} C${ic.x},${sy + 160} ${NODE.x},${NODE.y - 200} ${NODE.x},${NODE.y}`;
          const k = prog(s, 9.15 + i * 0.08, 10.3 + i * 0.08, E.io);
          return <path key={i} d={d} fill="none" stroke="rgba(255,255,255,.42)" strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} opacity={1 - prog(s, 12.2, 12.9)} />;
        })}
        <line x1={NODE.x} y1={NODE.y} x2={NODE.x} y2={lerp(NODE.y, LINE_END, lineDraw)} stroke="rgba(255,255,255,.5)" strokeWidth={1.6} />
        {/* bright trail above the falling light */}
        {s > 10.9 && <line x1={NODE.x} y1={Math.max(NODE.y, dy - 340)} x2={NODE.x} y2={dy} stroke="url(#trail)" strokeWidth={3} />}
        <defs><linearGradient id="trail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".95" /></linearGradient></defs>
      </svg>
      <div style={{ position: "absolute", left: NODE.x - 6, top: NODE.y - 6, width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: prog(s, 10.0, 10.4), boxShadow: "0 0 16px #fff" }} />
      {/* agents lit by the falling light */}
      {NODES.map((n, i) => {
        const a = clamp01((dy - (n.y - 30)) / 110);
        const appear = prog(s, 10.6 + i * 0.15, 11.4 + i * 0.15);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 120, top: n.y - 150, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${n.c} 0%, ${n.c}55 35%, transparent 68%)`, filter: "blur(26px)", opacity: appear * (0.16 + 0.84 * a) }} />
            <div style={{ position: "absolute", left: NODE.x - 9, top: n.y - 9, width: 18, height: 18, borderRadius: 9, background: a > 0 ? n.c : "#3a3d45", boxShadow: a > 0 ? `0 0 ${24 * a}px ${n.c}, 0 0 ${60 * a}px ${n.c}` : "none", opacity: appear }} />
            <div style={{ position: "absolute", left: 600 + 50 * (1 - a), top: n.y - 62, width: 400, height: 124, borderRadius: 22, background: "rgba(255,255,255,.055)", border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", gap: 20, padding: "0 22px", opacity: appear * (0.12 + 0.88 * a), filter: `blur(${(1 - a) * 6}px)` }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, flexShrink: 0, background: `linear-gradient(140deg, ${n.c}, ${n.c}88 55%, #ffffff55)`, boxShadow: `0 0 26px ${n.c}66` }} />
              <div style={{ fontFamily: FONT }}>
                <div style={{ color: C.ink, fontSize: 26, fontWeight: 600 }}>{n.t}</div>
                <div style={{ color: C.muted, fontSize: 21, marginTop: 4 }}>{n.d}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {/* the falling light, which swells into a glass orb */}
      {s > 10.85 && (() => {
        const sw = prog(s, 14.2, 15.0, E.out);
        const r = lerp(11, 175, sw);
        return (
          <div style={{ position: "absolute", left: NODE.x - r, top: dy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: sw < 0.05 ? "#fff" : "radial-gradient(circle at 38% 32%, #ffffff 0%, #E4DBFF 22%, #A9CDF6 52%, #6E8EE2 80%, #3a4a8a 100%)", boxShadow: `0 0 ${30 + 60 * sw}px rgba(160,225,255,.75), 0 0 ${90 + 80 * sw}px rgba(59,193,236,.45)` }} />
        );
      })()}
    </div>
  );
};

// ---------------- the vivid world inside the orb ----------------
const Gradient: React.FC<{ s: number; dark: number }> = ({ s, dark }) => {
  const m = (k: number, a: number) => Math.sin(s * 0.35 + k) * a;
  return (
    <AbsoluteFill style={{ background: "#141a33", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -200, filter: "blur(70px)" }}>
        <div style={{ position: "absolute", left: 80 + m(0, 60), top: -260 + m(1, 40), width: 1100, height: 900, borderRadius: "50%", background: "radial-gradient(circle, #D7C6FF 0%, #BFA9FF 40%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: 360 + m(2, 70), top: 420 + m(3, 60), width: 1100, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, #46CDF6 0%, #2FA8E8 38%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: -260 + m(4, 50), top: 900 + m(5, 70), width: 900, height: 800, borderRadius: "50%", background: "radial-gradient(circle, #F2A6D6 0%, #C786D9 35%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: 200 + m(6, 40), top: 1500 + m(7, 50), width: 1300, height: 900, borderRadius: "50%", background: "radial-gradient(circle, #1A2552 0%, #121a3c 50%, transparent 75%)" }} />
        <div style={{ position: "absolute", left: -300, top: 1150 + m(8, 60), width: 1700, height: 260, transform: "rotate(-14deg)", background: "linear-gradient(90deg, transparent, rgba(30,36,70,.9), transparent)" }} />
      </div>
      <AbsoluteFill style={{ background: "#05070c", opacity: dark }} />
    </AbsoluteFill>
  );
};

const CHAT = [
  { me: false, t: "Hi Thabo, a friendly reminder: INV-1042 for R8,450 is now 30 days overdue.", at: 16.0 },
  { me: true, t: "Can I pay on Friday?", at: 17.25 },
  { me: false, t: "Of course. I'll send your payment link on Friday morning.", at: 18.2 },
  { me: true, t: "Great, thank you!", at: 19.3 },
];

const Chat: React.FC<{ s: number }> = ({ s }) => {
  const n = CHAT.filter((c) => s >= c.at).length;
  const shift = CHAT.reduce((acc, c, i) => acc + (i > 0 ? prog(s, c.at - 0.1, c.at + 0.55, E.io) * (i === 2 ? 190 : 120) : 0), 0);
  const out = prog(s, 20.2, 20.9, E.in);
  return (
    <AbsoluteFill style={{ perspective: 1500, opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 70, top: 760 - shift, width: 940, transform: "rotateX(16deg) rotateY(-14deg) rotateZ(-3deg)", transformOrigin: "50% 40%" }}>
        {CHAT.map((c, i) => {
          const k = prog(s, c.at, c.at + 0.5);
          const depth = Math.max(0, n - 1 - i);
          const words = c.t.split(" ");
          const reveal = prog(s, c.at + 0.1, c.at + 0.25 + words.length * 0.07, (x) => x);
          return (
            <div key={i} style={{ display: "flex", justifyContent: c.me ? "flex-end" : "flex-start", alignItems: "center", gap: 14, marginBottom: 26, opacity: k, transform: `translateY(${30 * (1 - k)}px)`, filter: `blur(${Math.min(5, depth * 1.6) + out * 6}px)` }}>
              {!c.me && <div style={{ width: 46, height: 46, borderRadius: 23, flexShrink: 0, background: `conic-gradient(from 200deg, ${C.avant}, #9FE7FF, #5B83FF, ${C.avant})`, boxShadow: `0 0 22px ${C.avant}aa` }} />}
              <div style={{ maxWidth: c.me ? 520 : 760, padding: "22px 30px", borderRadius: 30, fontFamily: FONT, fontSize: 34, lineHeight: 1.32, fontWeight: 500, background: c.me ? "rgba(20,24,44,.62)" : "#fff", color: c.me ? "#E8ECF7" : "#151826", boxShadow: c.me ? "none" : "0 22px 50px rgba(10,14,40,.28)", border: c.me ? "1px solid rgba(255,255,255,.14)" : "none" }}>
                {c.me ? c.t : words.map((w, j) => <span key={j} style={{ opacity: clamp01(reveal * words.length - j) * 0.75 + 0.25 }}>{w} </span>)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Branch: React.FC<{ s: number }> = ({ s }) => {
  const k = prog(s, 20.6, 21.6, E.io);
  const out = prog(s, 22.9, 23.5, E.in);
  const cards = [
    { y: 760, t: "COLLECTIONS AGENT", d: "Follows up on overdue invoices, books payment dates and logs every reply." },
    { y: 1060, t: "FRONT DESK AGENT", d: "Answers enquiries after hours and routes every lead to the right person." },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {cards.map((c, i) => <path key={i} d={`M150,960 C230,960 210,${c.y + 80} 330,${c.y + 80}`} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />)}
        <circle cx={150} cy={960} r={7} fill="#fff" opacity={k} />
      </svg>
      {cards.map((c, i) => {
        const a = prog(s, 21.2 + i * 0.25, 21.9 + i * 0.25);
        return (
          <div key={i} style={{ position: "absolute", left: 340, top: c.y, width: 640, padding: "26px 30px", borderRadius: 24, background: "rgba(16,20,40,.5)", border: "1px solid rgba(255,255,255,.18)", fontFamily: FONT, opacity: a, transform: `translateX(${40 * (1 - a)}px)`, filter: `blur(${(1 - a) * 6}px)` }}>
            <div style={{ color: "#fff", fontSize: 20, letterSpacing: ".16em", fontWeight: 600 }}>{c.t}</div>
            <div style={{ color: "rgba(235,240,255,.82)", fontSize: 27, lineHeight: 1.38, marginTop: 10 }}>{c.d}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Approval: React.FC<{ s: number }> = ({ s }) => {
  const wipe = prog(s, 22.95, 23.95, E.io);
  const out = prog(s, 26.2, 26.8, E.in);
  const card = prog(s, 23.6, 24.3);
  const tools = [
    { g: G.doc, x: 170, y: 1290 }, { g: G.sheet, x: 360, y: 1190 }, { g: G.calendar, x: 540, y: 1330 },
    { g: G.mail, x: 720, y: 1190 }, { g: G.bank, x: 910, y: 1290 },
  ];
  return (
    <AbsoluteFill style={{ clipPath: `circle(${wipe * 2300}px at 540px 1500px)` }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, #0d1a20 0%, #06080c 60%)" }} />
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs><filter id="tg"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          {tools.map((t, i) => {
            const k = prog(s, 24.3 + i * 0.1, 25.4 + i * 0.1, E.io);
            return (
              <g key={i} filter="url(#tg)">
                <path d={`M${t.x},${t.y + 40} C${t.x},${t.y + 260} 540,${1150} 540,${960}`} fill="none" stroke={C.teal} strokeOpacity={0.75} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
                <path d={`M${t.x},${t.y + 40} C${t.x + (t.x < 540 ? 60 : -60)},${t.y + 420} ${540 + (i - 2) * 40},1700 ${540 + (i - 2) * 90},1960`} fill="none" stroke={C.teal} strokeOpacity={0.35} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
              </g>
            );
          })}
        </svg>
        {tools.map((t, i) => {
          const k = prog(s, 24.0 + i * 0.1, 24.6 + i * 0.1);
          return <div key={i} style={{ position: "absolute", left: t.x - 34, top: t.y - 34, opacity: k, transform: `scale(${0.7 + 0.3 * k})`, filter: `drop-shadow(0 0 10px ${C.teal})` }}><Glyph d={t.g} size={68} color={C.teal} sw={1.5} /></div>;
        })}
        <div style={{ position: "absolute", left: 230, top: 800, width: 620, padding: "28px 32px", borderRadius: 24, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.14)", fontFamily: FONT, opacity: card, transform: `translateY(${24 * (1 - card)}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Glyph d={G.shield} size={34} color="#fff" sw={1.7} />
            <div style={{ color: "#fff", fontSize: 30, fontWeight: 600 }}>Approval queue</div>
          </div>
          <div style={{ color: C.muted, fontSize: 25, lineHeight: 1.4, marginTop: 10 }}>Every message is approved by your team before it sends.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Finale: React.FC<{ s: number }> = ({ s }) => {
  const ring = prog(s, 26.3, 27.4, E.io);
  const R = lerp(1500, 150, ring);
  const label = win(s, 27.2, 27.6, 27.8, 28.0);
  const phone = win(s, 27.95, 28.3, 28.95, 29.3);
  const fill = prog(s, 28.3, 28.9, E.out);
  const shrink = prog(s, 29.0, 29.6, E.io);
  const orbR = lerp(150, 0, shrink) * lerp(1, 0.55, fill);
  const lam = prog(s, 29.35, 30.0, E.out);
  const letters = prog(s, 30.0, 30.7, E.out);
  const sub = prog(s, 30.6, 31.2);
  const tag = prog(s, 31.1, 31.7);
  const btn = prog(s, 31.6, 32.2);
  const [, , vw, vh] = LOGO_VB.split(" ").map(Number);
  const LW = 640, LH = (LW * vh) / vw;
  // the Λ starts from the orb's position (centre of the logo's blue path) and grows into place
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, #0d1622 0%, #05070b 65%)", opacity: prog(s, 26.0, 26.5) }}>
      <div style={{ position: "absolute", left: 540 - R, top: 900 - R, width: R * 2, height: R * 2, borderRadius: "50%", border: `2px solid rgba(255,255,255,${0.18 + 0.3 * ring})`, boxShadow: `inset 0 0 ${40 * ring}px rgba(140,220,255,.25), 0 0 ${30 * ring}px rgba(140,220,255,.15)`, opacity: 1 - prog(s, 28.4, 28.9) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 862, textAlign: "center", fontFamily: FONT, fontSize: 64, fontWeight: 500, color: "#fff", opacity: label }}>24/7</div>
      <div style={{ position: "absolute", left: 540 - 34, top: 900 - 34, opacity: phone }}><Glyph d={G.phone} size={68} color={C.green} sw={1.8} /></div>
      {orbR > 1 && (
        <div style={{ position: "absolute", left: 540 - orbR, top: 900 - orbR, width: orbR * 2, height: orbR * 2, borderRadius: "50%", opacity: fill, background: "radial-gradient(circle at 36% 30%, #ffffff 0%, #9BF5D6 18%, #3FE6A6 38%, #3BC1EC 62%, #2E5BFF 88%)", boxShadow: "0 0 50px rgba(63,230,166,.45), 0 0 110px rgba(59,193,236,.35)" }} />
      )}
      <svg width={LW} height={LH} viewBox={LOGO_VB} style={{ position: "absolute", left: 540 - LW / 2, top: 900 - LH / 2 - 20, overflow: "visible" }}>
        <defs><filter id="lg"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {LOGO_PATHS.map((p, i) => p.cls === "blue"
          ? <path key={i} d={p.d} fill={C.avant} filter="url(#lg)" style={{ transformOrigin: "187px 30px", transform: `scale(${lerp(0.2, 1, lam)})`, opacity: lam }} />
          : <path key={i} d={p.d} fill="#fff" style={{ opacity: clamp01(letters * 1.6 - Math.abs(i - 2) * 0.25), transform: `translateX(${(i < 2 ? -1 : 1) * 14 * (1 - letters)}px)` }} />)}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: FONT, fontSize: 24, letterSpacing: ".62em", paddingLeft: ".62em", color: "#CFE3EA", fontWeight: 400, opacity: sub }}>INTELLIGENCE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: FONT, fontSize: 32, color: "rgba(240,244,250,.85)", opacity: tag, transform: `translateY(${16 * (1 - tag)}px)` }}>AI agents, approved by your team.</div>
      <div style={{ position: "absolute", left: 540 - 140, top: 1120, width: 280, height: 68, borderRadius: 34, background: "#fff", color: "#0b0f17", fontFamily: FONT, fontSize: 25, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", opacity: btn, transform: `translateY(${14 * (1 - btn)}px)` }}>Book an audit</div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ s: number }> = ({ s }) => {
  const k = prog(s, 10.7, 11.5) * (1 - prog(s, 25.9, 26.4, E.in));
  const [, , vw, vh] = LOGO_VB.split(" ").map(Number);
  const W = 190;
  return (
    <svg width={W} height={(W * vh) / vw} viewBox={LOGO_VB} style={{ position: "absolute", left: 540 - W / 2, top: 130, opacity: k }}>
      {LOGO_PATHS.map((p, i) => <path key={i} d={p.d} fill={p.cls === "blue" ? C.avant : "#fff"} />)}
    </svg>
  );
};

export const Film: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  // the dive: the orb's circle becomes the window into the vivid world
  const dive = prog(s, 14.95, 15.85, E.in);
  const orbScreenY = LINE_END - camY(s);
  const R = lerp(175, 2400, dive);
  const darken = prog(s, 20.3, 22.6, E.io) * 0.35;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 85%, #1c1d22 0%, #0b0c0f 55%, #060709 100%)", overflow: "hidden" }}>
      {s < 16 && <World s={s} />}
      {s >= 14.95 && s < 23.6 && (
        <AbsoluteFill style={{ clipPath: `circle(${R}px at 540px ${orbScreenY}px)` }}>
          <Gradient s={s} dark={darken} />
          <Chat s={s} />
          <Branch s={s} />
        </AbsoluteFill>
      )}
      {s >= 22.9 && s < 26.9 && <Approval s={s} />}
      {s >= 25.9 && <Finale s={s} />}
      <Header s={s} />
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.45) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
