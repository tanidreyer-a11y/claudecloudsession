// Avant Intelligence — "Ahead" (signature film, 9:16 and 16:9, ~38.5 s). Our own piece: same vivid palette and
// camera language as the agents study, but every device comes from Avant itself.
//  1 The pile-up: invoices, reminders and leads rain into a messy heap.   (beats: "Every invoice." "Every lead.")
//  2 One blue line slices the heap; the cards sort themselves and become points of light on a giant Λ.
//  3 The climb: a light climbs the Λ's left stroke, lighting each agent; at the peak — "Approved by you." — then it
//    runs down the right stroke and the results land.
//  4 The dive: the camera goes through the Λ's peak; a triangle opens into the vivid world.
//  5 The approve moment: the agent's reply waits as a draft until a thumb taps Approve.
//  6 The morning report: what happened overnight, counting up.
//  7 Night to dawn: the ring becomes a sky; the sun rises and becomes the blue Λ.
//  8 The Λ draws as two strokes meeting at the peak → AVANT · "Always one step ahead."
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { LOGO_PATHS, LOGO_VB } from "./logo";

export const FPS = 60;
export const DUR = 38.5;

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

const G: Record<string, string> = {
  phone: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z",
  check: "M5 12.5l4.5 4.5L19 7.5",
};

type L = { W: number; H: number; cx: number; cy: number; wide: boolean };

// a typographic beat (no voice: the words carry the story)
const Beat: React.FC<{ s: number; a: number; b: number; text: string; y: number; size?: number }> = ({ s, a, b, text, y, size = 76 }) => {
  const k = win(s, a, a + 0.6, b - 0.45, b);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: "-.02em", color: "#fff", opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateY(${(1 - prog(s, a, a + 0.8)) * 20}px)` }}>{text}</div>;
};

// ================= 1–2: pile-up → slice → sort → points on the Λ =================
const KINDS = [
  { c: C.orange, t: "INV-1042", d: "R8,450 · overdue" },
  { c: C.pink, t: "Reminder", d: "3rd follow-up" },
  { c: C.cyan, t: "New lead", d: "no reply · 2 days" },
  { c: C.violet, t: "Supplier bill", d: "46 line items" },
  { c: C.blue, t: "INV-1051", d: "R12,900 · due" },
];
const NCARD = 34;

const Pile: React.FC<{ s: number; L: L; lam: (f: number, side: -1 | 1) => [number, number]; camY: number }> = ({ s, L, lam, camY }) => {
  const cw = L.wide ? 250 : 270, ch = 86;
  return (
    <>
      {Array.from({ length: NCARD }, (_, i) => {
        const k = KINDS[i % KINDS.length];
        // heap position (messy, piled at the bottom centre)
        const col = (h(i, 1) - 0.5) * (L.wide ? 900 : 640), layer = Math.floor(i / 7);
        const hx = L.cx + col - cw / 2, hy = L.H - 260 - layer * 70 - h(i, 2) * 50 - Math.abs(col) * 0.12;
        const rot = (h(i, 3) - 0.5) * 50;
        const tl = 0.3 + i * 0.13 + h(i, 4) * 0.3;
        const fall = prog(s, tl - 0.9, tl, E.grav);
        let x = hx, y = lerp(-300 - h(i, 5) * 600, hy, fall), r = lerp(rot * 2.2, rot, fall), o = s > tl - 0.9 ? 1 : 0, sc = 1;
        // sorted into lanes by kind after the slice
        const ts = 6.45 + h(i, 6) * 0.35;
        const sp = prog(s, ts, ts + 0.9, E.io);
        const lane = i % KINDS.length, slot = Math.floor(i / KINDS.length);
        const lx = L.cx + (lane - 2) * (L.wide ? 300 : 200) - cw / 2, ly = (L.wide ? 260 : 520) + slot * (L.wide ? 96 : 104);
        if (sp > 0) { x = lerp(hx, lx, sp); y = lerp(hy, ly, sp); r = lerp(rot, 0, sp); sc = L.wide ? 1 : lerp(1, 0.72, sp); }
        // collapse into points of light on the Λ's left stroke (world space → screen via camY)
        const tc = 8.15 + lane * 0.09 + slot * 0.03;
        const cp = prog(s, tc, tc + 0.8, E.io);
        if (cp > 0) {
          const [px, py] = lam(0.12 + (i / NCARD) * 0.76, -1);
          x = lerp(lx, px - cw / 2, cp); y = lerp(ly, py - camY - ch / 2, cp); sc = (L.wide ? 1 : 0.72) * (1 - 0.92 * cp); o = 1 - prog(s, tc + 0.5, tc + 0.8);
        }
        if (o <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: cw, height: ch, transform: `rotate(${r}deg) scale(${sc})`, opacity: o, borderRadius: 18, background: "linear-gradient(160deg, rgba(40,42,52,.92), rgba(22,23,30,.92))", border: "1px solid rgba(255,255,255,.12)", boxShadow: `0 14px 30px rgba(0,0,0,.5), 0 0 24px ${k.c}22`, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", fontFamily: FONT }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: `linear-gradient(140deg, #ffffff66, ${k.c} 35%, ${k.c}AA)`, boxShadow: `0 0 18px ${k.c}66` }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: C.ink, fontSize: 22, fontWeight: 600, whiteSpace: "nowrap" }}>{k.t}</div>
              <div style={{ color: C.muted, fontSize: 18, whiteSpace: "nowrap" }}>{k.d}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

// ================= 3: the climb =================
const AGENTS = [
  { f: 0.22, c: C.orange, t: "Collections", d: "Chasing INV-1042 · R8,450" },
  { f: 0.42, c: C.violet, t: "Invoice capture", d: "46 line items captured" },
  { f: 0.62, c: C.green, t: "Lead router", d: "New lead → Sales in 2 min" },
  { f: 0.8, c: C.cyan, t: "Front desk", d: "12 enquiries answered" },
];
const RESULTS = [{ f: 0.7, t: "Paid · R8,450" }, { f: 0.45, t: "Booked · Fri 10:00" }, { f: 0.22, t: "Lead → Sales" }];

const climbP = (s: number) => prog(s, 9.4, 13.1, E.io);
const descP = (s: number) => prog(s, 13.9, 15.0, E.io);

const Climb: React.FC<{ s: number; L: L; lam: (f: number, side: -1 | 1) => [number, number]; camY: number; apex: [number, number] }> = ({ s, L, lam, camY, apex }) => {
  const [bx0, by0] = lam(0, -1), [bx1, by1] = lam(0, 1);
  const draw = prog(s, 7.9, 9.3, E.io);
  const cp = climbP(s), dp = descP(s);
  const [lx, ly] = s < 13.6 ? lam(cp, -1) : lam(1 - dp, 1);
  const peak = win(s, 13.05, 13.3, 14.0, 14.8);
  const out = prog(s, 14.95, 15.8, E.in);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-camY}px)`, opacity: 1 - out * 0.0 }}>
      <svg width={L.W} height={6000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="lamL" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".15" /><stop offset="1" stopColor="#fff" stopOpacity=".6" /></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d={`M${bx0},${by0} L${apex[0]},${apex[1]} L${bx1},${by1}`} fill="none" stroke="url(#lamL)" strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {/* lit trail behind the climbing light */}
        {s > 9.4 && <path d={`M${bx0},${by0} L${lam(cp, -1)[0]},${lam(cp, -1)[1]}`} fill="none" stroke={C.avant} strokeWidth={3} filter="url(#glow)" opacity={0.9} />}
        {s > 13.9 && <path d={`M${apex[0]},${apex[1]} L${lx},${ly}`} fill="none" stroke={C.green} strokeWidth={3} filter="url(#glow)" opacity={0.9} />}
      </svg>
      {AGENTS.map((a, i) => {
        const [nx, ny] = lam(a.f, -1);
        const lit = clamp01((cp - a.f + 0.02) / 0.06);
        const appear = prog(s, 9.0 + i * 0.12, 9.7 + i * 0.12);
        const cardX = L.wide ? nx - 470 : nx + 34;
        const cardY = L.wide ? ny - 50 : ny - 130;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: nx - 160, top: ny - 160, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${a.c} 0%, ${a.c}55 35%, transparent 68%)`, filter: "blur(26px)", opacity: appear * (0.12 + 0.88 * lit) }} />
            <div style={{ position: "absolute", left: nx - 10, top: ny - 10, width: 20, height: 20, borderRadius: 10, background: lit > 0 ? a.c : "#3a3d45", boxShadow: lit > 0 ? `0 0 ${26 * lit}px ${a.c}, 0 0 ${64 * lit}px ${a.c}` : "none", opacity: appear }} />
            <div style={{ position: "absolute", left: cardX, top: cardY, width: 420, height: 112, borderRadius: 22, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", gap: 18, padding: "0 20px", opacity: appear * (0.1 + 0.9 * lit), filter: `blur(${(1 - lit) * 6}px)`, transform: `translateX(${(L.wide ? -1 : 1) * 30 * (1 - lit)}px)` }}>
              <div style={{ width: 64, height: 64, borderRadius: 15, flexShrink: 0, background: `linear-gradient(140deg, #ffffff66, ${a.c} 35%, ${a.c}AA)`, boxShadow: `0 0 26px ${a.c}66` }} />
              <div style={{ fontFamily: FONT, minWidth: 0 }}>
                <div style={{ color: C.ink, fontSize: 26, fontWeight: 600 }}>{a.t}</div>
                <div style={{ color: C.muted, fontSize: 20, marginTop: 4, whiteSpace: "nowrap" }}>{a.d}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {RESULTS.map((r, i) => {
        const [rx, ry] = lam(r.f, 1);
        const k = clamp01((dp - (1 - r.f) + 0.05) / 0.12);
        return (
          <div key={i} style={{ position: "absolute", left: rx + 26, top: ry - 26, height: 52, padding: "0 20px 0 14px", borderRadius: 26, display: "flex", alignItems: "center", gap: 10, background: "rgba(63,230,166,.12)", border: "1px solid rgba(63,230,166,.45)", fontFamily: FONT, fontSize: 22, fontWeight: 500, color: "#CFFBEA", opacity: k * (1 - prog(s, 15.0, 15.5)), transform: `translateX(${20 * (1 - k)}px)` }}>
            <svg width={22} height={22} viewBox="0 0 24 24"><path d={G.check} fill="none" stroke={C.green} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>{r.t}
          </div>
        );
      })}
      {/* the light */}
      {s > 9.3 && s < 15.1 && <div style={{ position: "absolute", left: lx - 12, top: ly - 12, width: 24, height: 24, borderRadius: 12, background: "#fff", boxShadow: `0 0 26px #fff, 0 0 70px ${s < 13.6 ? C.avant : C.green}` }} />}
      {/* the peak: approval */}
      <div style={{ position: "absolute", left: apex[0] - 110, top: apex[1] - 110, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, #ffffff 0%, ${C.avant}aa 25%, transparent 65%)`, opacity: peak, transform: `scale(${0.6 + 0.6 * peak})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: apex[1] - (L.wide ? 190 : 250), textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: L.wide ? 70 : 76, letterSpacing: "-.02em", color: "#fff", opacity: win(s, 13.2, 13.8, 14.6, 15.1), filter: `blur(${(1 - prog(s, 13.2, 13.8)) * 10}px)` }}>Approved by you.</div>
    </div>
  );
};

// ================= 5: inside the peak — the approve moment =================
const Vivid: React.FC<{ s: number; dark: number; L: L }> = ({ s, dark, L }) => {
  const m = (k: number, a: number) => Math.sin(s * 0.35 + k) * a;
  const sx = L.W / 1080, sy = L.H / 1920;
  return (
    <AbsoluteFill style={{ background: "#141a33", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -200, filter: "blur(70px)" }}>
        <div style={{ position: "absolute", left: (80 + m(0, 60)) * sx, top: (-260 + m(1, 40)) * sy, width: 1100 * sx, height: 900 * sy, borderRadius: "50%", background: "radial-gradient(circle, #D7C6FF 0%, #BFA9FF 40%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: (360 + m(2, 70)) * sx, top: (420 + m(3, 60)) * sy, width: 1100 * sx, height: 1000 * sy, borderRadius: "50%", background: "radial-gradient(circle, #46CDF6 0%, #2FA8E8 38%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: (-260 + m(4, 50)) * sx, top: (900 + m(5, 70)) * sy, width: 900 * sx, height: 800 * sy, borderRadius: "50%", background: "radial-gradient(circle, #F2A6D6 0%, #C786D9 35%, transparent 70%)" }} />
        <div style={{ position: "absolute", left: (200 + m(6, 40)) * sx, top: (1500 + m(7, 50)) * sy, width: 1300 * sx, height: 900 * sy, borderRadius: "50%", background: "radial-gradient(circle, #1A2552 0%, #121a3c 50%, transparent 75%)" }} />
      </div>
      <AbsoluteFill style={{ background: "#05070c", opacity: dark }} />
    </AbsoluteFill>
  );
};

const Approve: React.FC<{ s: number; L: L }> = ({ s, L }) => {
  const m1 = prog(s, 16.5, 17.0), m2 = prog(s, 17.5, 18.1), m3 = prog(s, 20.7, 21.2);
  const thumbIn = prog(s, 18.7, 19.4, E.io), press = win(s, 19.4, 19.5, 19.55, 19.75);
  const ok = prog(s, 19.5, 19.8);
  const sent = prog(s, 19.9, 20.3);
  const out = prog(s, 22.5, 23.1, E.in);
  const shift = 120 * prog(s, 20.6, 21.2, E.io);
  const W = L.wide ? 900 : 940, X = L.cx - W / 2, Y = (L.wide ? 230 : 690) - shift;
  const btnX = X + (L.wide ? 520 : 520), btnY = Y + 380;
  return (
    <AbsoluteFill style={{ perspective: 1500, opacity: 1 - out }}>
      <div style={{ position: "absolute", left: X, top: Y, width: W, transform: "rotateX(14deg) rotateY(-12deg) rotateZ(-2.5deg)", transformOrigin: "50% 40%", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "flex-end", opacity: m1, transform: `translateY(${24 * (1 - m1)}px)`, filter: `blur(${prog(s, 17.6, 18.3) * 2.2}px)`, marginBottom: 26 }}>
          <div style={{ padding: "22px 30px", borderRadius: 30, background: "rgba(20,24,44,.62)", border: "1px solid rgba(255,255,255,.14)", color: "#E8ECF7", fontSize: 34, fontWeight: 500 }}>Hi, can I pay on Friday?</div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: m2, transform: `translateY(${24 * (1 - m2)}px)` }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, flexShrink: 0, marginTop: 30, background: `conic-gradient(from 200deg, ${C.avant}, #9FE7FF, #5B83FF, ${C.avant})`, boxShadow: `0 0 22px ${C.avant}aa` }} />
          <div style={{ width: 760, borderRadius: 30, background: "#fff", boxShadow: "0 22px 50px rgba(10,14,40,.28)", padding: "22px 30px 24px", outline: `${3 * (1 - sent)}px dashed rgba(59,193,236,${0.7 * (1 - sent)})`, outlineOffset: 6 }}>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: ".12em", color: sent > 0.5 ? "#1a9c6e" : "#3B8FC0" }}>{sent > 0.5 ? "SENT · 08:02" : "DRAFT · WAITING FOR APPROVAL"}</div>
            <div style={{ fontSize: 34, lineHeight: 1.32, fontWeight: 500, color: "#151826", marginTop: 8 }}>Of course, Thabo. I'll send your payment link on Friday morning.</div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18, height: 64 }}>
              <div style={{ height: 64, padding: "0 30px", borderRadius: 32, display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 600, background: ok > 0.5 ? "#3FE6A6" : "#0f1320", color: ok > 0.5 ? "#06281b" : "#fff", transform: `scale(${1 - 0.08 * press})`, opacity: 1 - prog(s, 20.2, 20.6), boxShadow: ok > 0.5 ? "0 0 30px rgba(63,230,166,.6)" : "none" }}>
                {ok > 0.5 && <svg width={26} height={26} viewBox="0 0 24 24"><path d={G.check} fill="none" stroke="#06281b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {ok > 0.5 ? "Approved" : "Approve"}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", opacity: m3, transform: `translateY(${24 * (1 - m3)}px)`, marginTop: 26 }}>
          <div style={{ padding: "22px 30px", borderRadius: 30, background: "rgba(20,24,44,.62)", border: "1px solid rgba(255,255,255,.14)", color: "#E8ECF7", fontSize: 34, fontWeight: 500 }}>Great, thank you!</div>
        </div>
      </div>
      {/* the thumb */}
      <div style={{ position: "absolute", left: btnX + 170 + 260 * (1 - thumbIn), top: btnY + 130 + 420 * (1 - thumbIn), width: 96, height: 96, borderRadius: 48, border: "2px solid rgba(255,255,255,.75)", background: `rgba(255,255,255,${0.18 + 0.25 * press})`, opacity: thumbIn * (1 - prog(s, 19.9, 20.4)), transform: `scale(${1 - 0.15 * press})` }} />
      {press > 0 && <div style={{ position: "absolute", left: btnX + 218 - 90 * press, top: btnY + 178 - 90 * press, width: 180 * press, height: 180 * press, borderRadius: "50%", border: "2px solid rgba(255,255,255,.6)", opacity: 1 - press * 0.6 }} />}
    </AbsoluteFill>
  );
};

// ================= 6: the morning report =================
const Report: React.FC<{ s: number; L: L }> = ({ s, L }) => {
  const wipe = prog(s, 22.7, 23.7, E.io);
  const out = prog(s, 27.0, 27.6, E.in);
  const rows = [
    { c: C.orange, v: 48200, pre: "R", lab: "recovered overnight" },
    { c: C.violet, v: 46, pre: "", lab: "invoices captured" },
    { c: C.green, v: 12, pre: "", lab: "leads routed to Sales" },
  ];
  const W = L.wide ? 760 : 820;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${wipe * 2400}px at ${L.cx}px ${L.H * 0.78}px)` }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #121a2e 0%, #06080c 65%)" }} />
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <div style={{ position: "absolute", left: L.cx - W / 2, top: L.wide ? 210 : 560, width: W, fontFamily: FONT, opacity: prog(s, 23.4, 24.0) }}>
          <div style={{ color: C.muted, fontSize: 22, letterSpacing: ".2em", fontWeight: 500 }}>MORNING REPORT · 06:00</div>
        </div>
        {rows.map((r, i) => {
          const a = prog(s, 23.7 + i * 0.3, 24.4 + i * 0.3);
          const n = Math.round(r.v * prog(s, 23.9 + i * 0.3, 25.6 + i * 0.3, E.out));
          const pts = Array.from({ length: 12 }, (_, j) => `${j * 18},${40 - (h(j + i * 12, 3) * 18 + j * 2)}`).join(" ");
          return (
            <div key={i} style={{ position: "absolute", left: L.cx - W / 2, top: (L.wide ? 270 : 620) + i * (L.wide ? 170 : 190), width: W, height: L.wide ? 140 : 160, borderRadius: 26, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 36px", fontFamily: FONT, opacity: a, transform: `translateY(${24 * (1 - a)}px)`, boxShadow: `0 0 50px ${r.c}18` }}>
              <div>
                <div style={{ color: "#fff", fontSize: L.wide ? 58 : 64, fontWeight: 600, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>{r.pre}{String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                <div style={{ color: C.muted, fontSize: 24, marginTop: 2 }}>{r.lab}</div>
              </div>
              <svg width={210} height={50} viewBox="0 0 210 50"><polyline points={pts} fill="none" stroke={r.c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(s, 24.0 + i * 0.3, 25.4 + i * 0.3, E.io)} style={{ filter: `drop-shadow(0 0 6px ${r.c})` }} /></svg>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================= 7–8: night to dawn → the Λ → AVANT =================
const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, "0")).join("");
};
const ramp = (stops: string[], k: number) => { const x = clamp01(k) * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(x)); return mixHex(stops[i], stops[i + 1], x - i); };

const Dawn: React.FC<{ s: number; L: L }> = ({ s, L }) => {
  const ring = prog(s, 27.0, 28.1, E.io);
  const R = lerp(Math.max(L.W, L.H) * 1.3, L.wide ? 300 : 340, ring);
  const day = prog(s, 28.2, 31.0, (x) => x);
  const top = ramp(["#070b1f", "#1b1748", "#3b2c7a", "#5b8ad8"], day), mid = ramp(["#0c1233", "#2a1f5c", "#b05f9c", "#ff9ec2"], day), bot = ramp(["#121a3f", "#3a2560", "#ff8a5c", "#ffd08a"], day);
  const sunY = lerp(R * 1.1, R * 0.2, prog(s, 29.2, 31.0, E.out));
  const toLam = prog(s, 31.0, 31.8, E.io);
  const close = prog(s, 31.1, 31.9, E.io);
  const lamDraw = prog(s, 31.5, 32.6, E.io), lamFill = prog(s, 32.4, 32.9), letters = prog(s, 32.9, 33.6), sub = prog(s, 33.5, 34.1), tag = prog(s, 34.1, 34.8), btn = prog(s, 34.7, 35.3);
  const [, , vw, vh] = LOGO_VB.split(" ").map(Number);
  const LW = L.wide ? 700 : 640, LH = (LW * vh) / vw, sc = LW / vw;
  const blue = LOGO_PATHS.find((p) => p.cls === "blue")!;
  const lx = L.cx - LW / 2, ly = L.cy - LH / 2 - 40;
  // Λ apex and base points in screen space (from the logo's blue path: apex ≈ (187.4, 0.1), feet ≈ (150.5,55.2) & (224,55.2))
  const ax = lx + 187.4 * sc, ay = ly + 0.1 * sc, f0x = lx + 151 * sc, f1x = lx + 224 * sc, fy = ly + 55.2 * sc;
  const Rw = R * (1 - close);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, #0d1622 0%, #05070b 65%)", opacity: prog(s, 26.8, 27.3) }}>
      {Rw > 2 && (
        <div style={{ position: "absolute", left: L.cx - Rw, top: L.cy - Rw, width: Rw * 2, height: Rw * 2, borderRadius: "50%", overflow: "hidden", border: `2px solid rgba(255,255,255,${0.2 + 0.25 * ring})`, background: `linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${bot} 100%)` }}>
          {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${h(i, 1) * 100}%`, top: `${h(i, 2) * 70}%`, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: (0.3 + 0.7 * h(i, 3)) * (1 - prog(s, 28.6, 30.2)) }} />)}
          <div style={{ position: "absolute", left: Rw - 70, top: Rw - 70 + sunY, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, #ffffff 0%, #CFF6FF 35%, ${C.avant} 70%)`, boxShadow: `0 0 90px 30px rgba(255,230,190,.55), 0 0 180px 60px ${C.avant}55`, opacity: 1 - toLam }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", background: "linear-gradient(180deg, transparent, rgba(5,7,12,.55))" }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: L.cy - (L.wide ? 300 : 340) - 110, textAlign: "center", fontFamily: FONT, fontSize: 62, fontWeight: 600, color: "#fff", opacity: win(s, 28.1, 28.6, 29.4, 29.9) }}>While you sleep.</div>
      <svg width={L.W} height={L.H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><filter id="lg2"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d={`M${f0x},${fy} L${ax},${ay}`} fill="none" stroke={C.avant} strokeWidth={5} strokeLinecap="round" filter="url(#lg2)" opacity={(1 - lamFill) * (lamDraw > 0 ? 1 : 0)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lamDraw} />
        <path d={`M${f1x},${fy} L${ax},${ay}`} fill="none" stroke={C.avant} strokeWidth={5} strokeLinecap="round" filter="url(#lg2)" opacity={(1 - lamFill) * (lamDraw > 0 ? 1 : 0)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lamDraw} />
      </svg>
      <svg width={LW} height={LH} viewBox={LOGO_VB} style={{ position: "absolute", left: lx, top: ly, overflow: "visible" }}>
        <path d={blue.d} fill={C.avant} opacity={lamFill} style={{ filter: `drop-shadow(0 0 ${6 + 10 * (1 - lamFill)}px ${C.avant})` }} />
        {LOGO_PATHS.map((p, i) => p.cls === "blue" ? null : <path key={i} d={p.d} fill="#fff" style={{ opacity: clamp01(letters * 1.6 - Math.abs(i - 2) * 0.25), transform: `translateX(${(i < 2 ? -1 : 1) * 14 * (1 - letters)}px)` }} />)}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: ly + LH + 26, textAlign: "center", fontFamily: FONT, fontSize: 24, letterSpacing: ".62em", paddingLeft: ".62em", color: "#CFE3EA", opacity: sub }}>INTELLIGENCE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: ly + LH + 104, textAlign: "center", fontFamily: FONT, fontSize: 40, fontWeight: 500, color: "#fff", opacity: tag, transform: `translateY(${16 * (1 - tag)}px)` }}>Always one step ahead.</div>
      <div style={{ position: "absolute", left: L.cx - 140, top: ly + LH + 196, width: 280, height: 68, borderRadius: 34, background: "#fff", color: "#0b0f17", fontFamily: FONT, fontSize: 25, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", opacity: btn, transform: `translateY(${14 * (1 - btn)}px)` }}>Book an audit</div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ s: number; L: L }> = ({ s, L }) => {
  const k = prog(s, 9.0, 9.8) * (1 - prog(s, 26.6, 27.1, E.in));
  const [, , vw, vh] = LOGO_VB.split(" ").map(Number);
  const W = L.wide ? 170 : 190;
  return (
    <svg width={W} height={(W * vh) / vw} viewBox={LOGO_VB} style={{ position: "absolute", left: L.cx - W / 2, top: L.wide ? 64 : 130, opacity: k }}>
      {LOGO_PATHS.map((p, i) => <path key={i} d={p.d} fill={p.cls === "blue" ? C.avant : "#fff"} />)}
    </svg>
  );
};

export const Ahead: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const { width: W, height: H } = useVideoConfig();
  const wide = W > H;
  const L: L = { W, H, cx: W / 2, cy: H / 2, wide };
  // the Λ in world space: apex at y=0, feet at y=LH
  const LHt = wide ? 1500 : 2500, LHw = wide ? 560 : 420;
  const apex: [number, number] = [L.cx, 0];
  const lam = (f: number, side: -1 | 1): [number, number] => [L.cx + side * LHw * (1 - f), LHt * (1 - f)];
  // camera: pile-up at the feet; after the climb starts it rises with the light, then holds at the peak
  const startCam = LHt - H + 140;
  const cp = climbP(s);
  const camY = s < 9.4 ? startCam : lerp(startCam, -H * 0.42, prog(s, 9.3, 13.3, E.io));
  // the dive into the peak: zoom around the apex, a triangle opens into the vivid world
  const dive = prog(s, 14.95, 15.95, E.in);
  const apexScreenY = apex[1] - camY;
  const zoom = Math.exp(lerp(0, Math.log(14), dive));
  const triS = lerp(0.001, 14, dive);
  const tri = (k: number) => `polygon(${L.cx}px ${apexScreenY - 20 * k}px, ${L.cx + LHw * 0.55 * k}px ${apexScreenY + LHt * 0.55 * k}px, ${L.cx - LHw * 0.55 * k}px ${apexScreenY + LHt * 0.55 * k}px)`;
  const darken = prog(s, 21.0, 22.8, E.io) * 0.3;
  void cp;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 85%, #1c1d22 0%, #0b0c0f 55%, #060709 100%)", overflow: "hidden" }}>
      {s < 16.1 && (
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${L.cx}px ${apexScreenY}px` }}>
          {/* the slice */}
          {s > 5.9 && s < 7.2 && (() => {
            const k = prog(s, 5.95, 6.35, E.out), o = 1 - prog(s, 6.5, 7.1);
            return <div style={{ position: "absolute", left: -100, top: H - 520, width: (W + 200) * k, height: 4, background: `linear-gradient(90deg, transparent, ${C.avant}, #fff)`, transform: "rotate(-9deg)", transformOrigin: "0 50%", boxShadow: `0 0 30px ${C.avant}, 0 0 80px ${C.avant}`, opacity: o }} />;
          })()}
          <Pile s={s} L={L} lam={lam} camY={camY} />
          <Beat s={s} a={1.0} b={3.3} text="Every invoice." y={wide ? 150 : 420} />
          <Beat s={s} a={3.5} b={5.8} text="Every lead." y={wide ? 150 : 420} />
          <Climb s={s} L={L} lam={lam} camY={camY} apex={apex} />
        </AbsoluteFill>
      )}
      {s >= 14.95 && s < 23.8 && (
        <AbsoluteFill style={{ clipPath: dive < 1 ? tri(triS) : undefined }}>
          <Vivid s={s} dark={darken} L={L} />
          <Approve s={s} L={L} />
        </AbsoluteFill>
      )}
      {s >= 22.6 && s < 27.7 && <Report s={s} L={L} />}
      {s >= 26.7 && <Dawn s={s} L={L} />}
      <Header s={s} L={L} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.45) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
