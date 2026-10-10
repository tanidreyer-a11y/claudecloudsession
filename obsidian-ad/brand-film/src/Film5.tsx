// OBSIDIAN — 48 s · 16:9 · "Websites, ads, agents" (owner 2026-10-10). Owner's three ideas kept as the spine:
//  (1) the ball falls, lands at the bottom, the camera zooms into it → a white world;
//  (2) the ball passes the hero sections and each one changes the background;
//  (3) balls + lines come out of each website and merge into one line.
// Transitions modelled on ref14 LangEase, ref15 NeuralSeek, ref16 lovio (motion-studio/teardown/ref14-16) + ElevenLabs
// soft clouds. Story: three problems (template site · skipped ad · unanswered enquiry) → three answers → one brand.
//  S1 0–2      "Years to build a reputation." typed; the caret becomes the ball
//  S2 2–6.1    the ball falls through a grey template (crumbles), a grey ad (cursor clicks Skip), a pile of
//              unanswered enquiries — "Three seconds to lose it online." — and lands at the bottom
//  S3 6.1–7.1  the camera dives into the ball → white
//  S4 7.1–14.7 lovio anchor: a brief pill; the cursor clicks the ball; the hero builds in a container (panels → site);
//              the ball orbits the container; each pass in front changes the brief, the hero (bloom) and the world
//  S5 14.7–18.1 pull back to a 3 × 3 grid of real heroes → scroll past hundreds → three glass containers
//  S6 18.1–22  long lines out of their right sides; the camera trucks right with the balls; they merge into one
//  S7 22–25.3  "This isn't a template." → the "It's yours." pill → the camera pushes into the pill
//  S8 25.3–32.6 ads: LangEase phone tunnel ("Story. Post. Video.") → a light trail becomes the Publish pill →
//              cursor click → rings → whip into a wall of ads → "Campaign live" + confetti
//  S9 32.6–41  agents (NeuralSeek dark half): 02:14 enquiry, orbiting agents, toggles, "ready" notifications,
//              rolling "Built for ___", powered by Avant Intelligence
//  S10 41–48   a pile of hero cards → three balls (websites · ads · agents) merge → the two bars → OBSIDIAN
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { E, prog, lerp, win, h, SANS, OrbitRing } from "./Film2";
import { SoftWorld, SoftBalls, Ball, Pal } from "./gl";

export const FPS5 = 60;
export const DUR5 = 48;
const W = 1920, H = 1080, CX = 960, CY = 540;
const MONO = "JBMono, ui-monospace, monospace";
const site = (p: string) => staticFile("site/" + p);
const fr = (dir: string, i: number, max: number) => site(`${dir}/${String(Math.max(1, Math.min(max, Math.round(i)))).padStart(3, "0")}.jpg`);
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const hx = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixC = (a: string, b: string, k: number) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], cl01(k))).toString(16).padStart(2, "0")).join(""); };
type BC = [string, string, string];
const mixBC = (a: BC, b: BC, k: number): BC => [mixC(a[0], b[0], k), mixC(a[1], b[1], k), mixC(a[2], b[2], k)];
const typed = (str: string, s: number, a: number, b: number) => str.slice(0, Math.round(str.length * prog(s, a, b, (x: number) => x)));

// ---------------------------------------------------------------- palettes (soft clouds: base, cloud A, cloud B, accent, highlight)
const INK: Pal = ["#07060B", "#120E22", "#0C1228", "#2A2050", "#1A1530"];
const WHITE: Pal = ["#F7F5FB", "#ECE6FA", "#E2EDFB", "#F8E2F0", "#FFFFFF"];
const CREAM: Pal = ["#F3ECE3", "#E8DACB", "#F2E0DB", "#D8B7A4", "#FFFFFF"];
const EMBER: Pal = ["#0B0806", "#2A150B", "#1A0E09", "#B9501C", "#FF8A3C"];
const NIGHT: Pal = ["#060A16", "#0F1B36", "#0A2A2A", "#2C8C6C", "#9FD8C6"];
const FOREST: Pal = ["#0A0F0C", "#18251D", "#232B27", "#3F5C48", "#8FA596"];
const GRAPH: Pal = ["#0B0A10", "#1B1828", "#111A28", "#3A2F5C", "#2B2742"];
const LAV: Pal = ["#F6F5FB", "#E7E2FA", "#DCEAFB", "#F6DCEF", "#FFFFFF"];
const NAVY: Pal = ["#070818", "#121735", "#171032", "#3A3290", "#2E7FA8"];
const OBS: Pal = ["#050307", "#120A1E", "#0B0816", "#3B1D6E", "#5B2E9E"];
const CLOUD: BC = ["#D8D0FF", "#8FC8FF", "#FF9FD0"];          // the ball — one soft cloud colour, always
const B_WHITE: BC = ["#FFFFFF", "#F1ECFF", "#FCEFF7"];
const B_VALE: BC = ["#F6EDE6", "#E2B8A0", "#EBA9A6"];
const B_CAPE: BC = ["#2A160C", "#FF8A3C", "#C2541C"];
const B_NORTH: BC = ["#BFE9DD", "#2E8F6E", "#4B6BDB"];
const B_SITE: BC = ["#F3E6DC", "#E2B8A0", "#B9A6FF"], B_ADS: BC = ["#F5D8EC", "#F472B6", "#A78BFA"], B_AGENT: BC = ["#D6ECFF", "#38BDF8", "#818CF8"];

// ---------------------------------------------------------------- timeline
const T = {
  fall: 1.95, tpl: 2.9, ad: 3.9, pile: 4.5, bottom: 5.9, dive: 6.15, white: 6.95,
  pill: 7.25, click: 8.15, build: 8.3, w2: 10.0, w3: 11.5, w4: 13.0, pull: 14.7, scroll: 15.8, land: 18.1,
  roll: 18.8, merge: 21.4, tmpl: 22.1, yours: 23.0, into: 23.7, push: 24.25, ads: 25.3, words: 27.2, trail: 28.5, publish: 29.1, pclick: 29.9,
  wall: 30.25, live: 31.35, agents: 32.6, roll2: 37.9, end: 41.0, lock: 43.9,
};

// ---------------------------------------------------------------- monotone cubic (rests at both ends)
function mono(xs: number[], ys: number[]) {
  const n = xs.length, m: number[] = [], dx: number[] = [];
  for (let i = 0; i < n - 1; i++) { dx.push(xs[i + 1] - xs[i]); m.push((ys[i + 1] - ys[i]) / dx[i]); }
  const c1 = [0];
  for (let i = 1; i < n - 1; i++) { if (m[i - 1] * m[i] <= 0) c1.push(0); else { const cm = dx[i - 1] + dx[i]; c1.push(3 * cm / ((cm + dx[i]) / m[i - 1] + (cm + dx[i - 1]) / m[i])); } }
  c1.push(0);
  const c2: number[] = [], c3: number[] = [];
  for (let i = 0; i < n - 1; i++) { const cm = c1[i] + c1[i + 1] - 2 * m[i]; c2.push((m[i] - c1[i] - cm) / dx[i]); c3.push(cm / dx[i] / dx[i]); }
  return (x: number) => { if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1]; let i = 0; while (x > xs[i + 1]) i++; const d = x - xs[i]; return ys[i] + c1[i] * d + c2[i] * d * d + c3[i] * d * d * d; };
}

// ---------------------------------------------------------------- small UI parts
const Cursor: React.FC<{ x: number; y: number; press?: number; op?: number }> = ({ x, y, press = 0, op = 1 }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 9.6, top: y - 3.8, opacity: op, transform: `scale(${1 - press * 0.16})`, transformOrigin: "9.6px 3.8px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.35))", overflow: "visible" }}>
    <path d="M5 2 L5 19 L9.5 15 L12.6 21.6 L15.2 20.4 L12.2 14 L18.4 14 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
const Ink: React.FC<{ s: number; a: number; b: number; x?: number; y: number; size: number; children: React.ReactNode; color?: string; align?: "center" | "left"; w?: number }> = ({ s, a, b, x = 0, y, size, children, color = "#fff", align = "center", w = W }) => {
  const k = win(s, a, a + 0.55, b - 0.4, b);
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: x, width: w, top: y, textAlign: align, fontFamily: SANS, fontWeight: 600, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.035em", color, opacity: k, filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - prog(s, a, a + 0.7)) * 22}px)` }}>{children}</div>;
};
const Grad: React.FC<{ children: React.ReactNode; g?: string }> = ({ children, g = "linear-gradient(90deg, #8B5CF6, #EC4899 60%, #60A5FA)" }) => <span style={{ background: g, WebkitBackgroundClip: "text", color: "transparent" }}>{children}</span>;
const Toggle: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ position: "relative", width: 76, height: 42, borderRadius: 21, background: k > 0.5 ? "linear-gradient(90deg, #8B5CF6, #60A5FA)" : "rgba(255,255,255,.14)", boxShadow: k > 0.5 ? "0 0 24px rgba(139,92,246,.6)" : "none", transition: "none" }}>
    <div style={{ position: "absolute", top: 4, left: lerp(4, 38, k), width: 34, height: 34, borderRadius: 17, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.35)" }} />
  </div>
);
const Note: React.FC<{ title: string; body: string; dark?: boolean; check?: boolean; w?: number }> = ({ title, body, dark = true, check = false, w = 560 }) => (
  <div style={{ width: w, padding: "22px 26px", borderRadius: 24, display: "flex", gap: 18, alignItems: "flex-start", background: dark ? "rgba(18,20,44,.78)" : "rgba(255,255,255,.88)", border: `1px solid ${dark ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.9)"}`, boxShadow: "0 24px 60px rgba(0,0,0,.35)", backdropFilter: "blur(16px)" }}>
    <div style={{ flex: "0 0 44px", height: 44, borderRadius: 12, background: check ? "linear-gradient(135deg, #8B5CF6, #60A5FA)" : "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={24} height={24} viewBox="0 0 24 24">{check ? <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M3 6h18v12H3z M3 7l9 6 9-6" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinejoin="round" />}</svg>
    </div>
    <div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: dark ? "#fff" : "#141225", letterSpacing: "-0.01em" }}>{title}</div>
      <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 22, marginTop: 6, color: dark ? "rgba(255,255,255,.66)" : "rgba(20,18,37,.6)", lineHeight: 1.35 }}>{body}</div>
    </div>
  </div>
);

// ---------------------------------------------------------------- S4 container: heroes + brief pill + orbit
const CW = 1260, CH = 788, CL = CX - CW / 2, CT = CY - CH / 2;
const HEROES = [
  { brief: "Private clinic · Cape Town · calm", src: (t: number) => fr("surgery", 1 + t * 6, 170), pal: CREAM, dark: false, bloom: "rgba(255,248,240,.9)" },
  { brief: "Cigar house · Atlantic coast · slow smoke", src: () => site("cigars_hero.png"), pal: EMBER, dark: true, bloom: "rgba(255,170,110,.75)" },
  { brief: "Observatory · Karoo · dark skies", src: (t: number) => fr("north", 1 + t * 14, 150), pal: NIGHT, dark: true, bloom: "rgba(190,230,255,.75)" },
  { brief: "Private estate · forest · quiet", src: (t: number) => fr("estate", 1 + t * 7, 150), pal: FOREST, dark: true, bloom: "rgba(220,235,225,.7)" },
];
const SWAP = [T.build, T.w2, T.w3, T.w4];
const ORB = { cx: CX, cy: CY + 70, rx: 800, ry: 400 };
const orbitTheta = (s: number) => Math.PI / 2 + (2 * Math.PI * (s - T.w2)) / 1.5;
const PILL = { w: 640, hh: 80, x: CX - 320, y: CT + CH - 132 };
const SEND = { x: PILL.x + PILL.w - 46, y: PILL.y + 40 };
function orbitBall(s: number) {
  const th = orbitTheta(s);
  let x = ORB.cx + Math.cos(th) * ORB.rx, y = ORB.cy + Math.sin(th) * ORB.ry, r = 50 + 13 * Math.sin(th);
  const out = prog(s, T.click + 0.05, T.click + 0.75, E.io);
  x = lerp(SEND.x, x, out); y = lerp(SEND.y, y, out); r = lerp(22, r, prog(s, T.click + 0.05, T.click + 0.4, E.back));
  const home = prog(s, T.pull - 0.55, T.pull - 0.05, E.io);
  x = lerp(x, SEND.x, home); y = lerp(y, SEND.y, home); r = lerp(r, 22, home);
  return { x, y, r, front: Math.sin(th) >= 0 || out < 1 || home > 0 };
}

// ---------------------------------------------------------------- S5–S7 world (2.5D camera)
type Cam = { x: number; y: number; s: number; roll: number; tilt: number };
const PERSP = 2600;
const camCss = (c: Cam) => `translate(${CX}px, ${CY}px) perspective(${PERSP}px) rotateX(${c.tilt}deg) rotate(${c.roll}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;
const project = (c: Cam, wx: number, wy: number) => {
  const x = (wx - c.x) * c.s, y = (wy - c.y) * c.s, r = (c.roll * Math.PI) / 180, t = (c.tilt * Math.PI) / 180;
  const xr = x * Math.cos(r) - y * Math.sin(r), yr = x * Math.sin(r) + y * Math.cos(r);
  const z = yr * Math.sin(t), f = PERSP / (PERSP - z);
  return { x: CX + xr * f, y: CY + yr * Math.cos(t) * f, k: c.s * f };
};
const PX = 1350, PY = 878, NF = 18;                          // grid pitch; feed rows
const Y0 = (3 + NF) * PY + 260, CROW = 1100, GP = 30;         // the containers
const CONT = [0, 1, 2].map((i) => Y0 + i * CROW);
const CMID = CONT.map((y) => y + CH / 2);
const LX = CW + GP;
const J = { x: LX + 3600, y: CMID[1] };
const PILL2 = { x: J.x + 2300, y: J.y, w: 980, hh: 250 };
const CAM_LAND: Cam = { x: (CX - 110) / 0.34, y: CMID[1], s: 0.34, roll: 0, tilt: 0 };
type Pt = [number, number];
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
const LINES: [Pt, Pt, Pt, Pt][] = [
  [[LX, CMID[0]], [LX + 1700, CMID[0]], [J.x - 1600, J.y], [J.x, J.y]],
  [[LX, CMID[1]], [LX + 1200, CMID[1]], [J.x - 1200, J.y], [J.x, J.y]],
  [[LX, CMID[2]], [LX + 1700, CMID[2]], [J.x - 1600, J.y], [J.x, J.y]],
];
const lineD = (L: [Pt, Pt, Pt, Pt], k = 1) => { const n = 60, pts: string[] = []; for (let i = 0; i <= n; i++) { const p = bez(L[0], L[1], L[2], L[3], (i / n) * k); pts.push(`${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`); } return pts.join(" "); };
const rollK = (s: number) => prog(s, T.roll, T.merge, Easing.bezier(0.45, 0, 0.25, 1));
const mergedX = (s: number) => lerp(J.x, PILL2.x - PILL2.w / 2 + 120, prog(s, T.merge + 0.2, T.into, Easing.bezier(0.5, 0, 0.3, 1)));
function camAt(s: number): Cam {
  if (s < T.scroll) { const k = prog(s, T.pull, T.scroll, E.io); return { x: PX + CW / 2 + PX * 0 + (PX - PX), y: PY + CH / 2, s: lerp(1, 0.33, k), roll: 0, tilt: lerp(0, 20, k) }; }
  const settle = prog(s, T.land - 1.4, T.land, E.io);
  const sy = lerp(PY + CH / 2, CAM_LAND.y, prog(s, T.scroll, T.land, Easing.bezier(0.55, 0, 0.12, 1)));
  const scam: Cam = { x: lerp(PX + CW / 2, CAM_LAND.x, settle), y: sy, s: lerp(0.33, 0.34, settle), roll: 0, tilt: lerp(20, 0, settle) };
  if (s < T.land) return scam;
  // follow the balls to the right (focus on the ball), push in as they converge
  const bx = lerp(LX, J.x, rollK(s));
  const fx = Math.max(CAM_LAND.x, bx + 520);
  const k1 = prog(s, T.land, T.roll + 0.6, E.io);
  let c: Cam = { x: lerp(CAM_LAND.x, fx, k1), y: CAM_LAND.y, s: lerp(0.34, 0.5, prog(s, T.roll, T.merge, E.io)), roll: -1.8 * Math.sin(Math.PI * prog(s, T.roll, T.merge)), tilt: 0 };
  if (s < T.merge) return c;
  const mx = mergedX(s);
  c = { ...c, x: lerp(c.x, mx + 260, prog(s, T.merge, T.merge + 0.8, E.io)), s: lerp(0.5, 0.56, prog(s, T.merge, T.into, E.io)) };
  const push = prog(s, T.push, T.ads, Easing.bezier(0.7, 0, 0.95, 0.6));
  c = { ...c, x: lerp(c.x, PILL2.x, prog(s, T.into, T.push + 0.2, E.io)), s: c.s * Math.pow(26, push) };
  return c;
}

// ---------------------------------------------------------------- hero image cells
const CELLS = [
  () => fr("estate", 1, 150), () => fr("north", 1, 150), () => fr("surgery", 1, 170), () => site("cigars_hero.png"),
  () => fr("estate", 60, 150), () => fr("north", 80, 150), () => fr("surgery", 90, 170), () => fr("estate", 140, 150),
  () => fr("north", 120, 150), () => fr("surgery", 140, 170), () => fr("estate", 100, 150), () => fr("north", 40, 150),
];
const cellSrc = (seed: number) => CELLS[Math.floor(h(seed, 4) * CELLS.length) % CELLS.length]();
const Card: React.FC<{ src: string; w?: number; hh?: number; r?: number; shadow?: string }> = ({ src, w = CW, hh = CH, r = 22, shadow = "0 40px 100px rgba(0,0,0,.4)" }) => (
  <div style={{ width: w, height: hh, borderRadius: r, overflow: "hidden", boxShadow: shadow, background: "#111" }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

// ---------------------------------------------------------------- S8 phones
const Phone: React.FC<{ src: string; w: number; hh: number; label?: string; cta?: string; land?: boolean }> = ({ src, w, hh, label = "Sponsored", cta = "Learn more", land = false }) => (
  <div style={{ position: "relative", width: w, height: hh, borderRadius: land ? 40 : 46, padding: 12, background: "#0E0E12", boxShadow: "0 40px 90px rgba(40,30,90,.35), inset 0 0 0 2px #2A2A33" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: land ? 30 : 36, overflow: "hidden", background: "#000" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 16, top: 16, padding: "6px 12px", borderRadius: 12, background: "rgba(0,0,0,.45)", color: "#fff", fontFamily: SANS, fontSize: 15, fontWeight: 500 }}>{label}</div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 44, borderRadius: 14, background: "rgba(255,255,255,.92)", color: "#141225", fontFamily: SANS, fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>{cta}<span>›</span></div>
    </div>
  </div>
);

// ---------------------------------------------------------------- the emblem (owner's final logo geometry)
const BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]];
const Emblem: React.FC<{ s: number; t0: number; scale: number; x: number; y: number }> = ({ s, t0, scale, x, y }) => (
  <svg width={200 * scale} height={245 * scale} viewBox="0 0 200 245" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <defs>
      <linearGradient id="bar5" x1="171" y1="21" x2="40" y2="215" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#D9CCFF" /><stop offset="0.75" stopColor="#8B6CF0" /><stop offset="1" stopColor="#5B3FC4" />
      </linearGradient>
    </defs>
    {BARS.map((b, i) => {
      const k = prog(s, t0 + i * 0.14, t0 + i * 0.14 + 0.7, E.out);
      return <polygon key={i} points={b.map((p) => p.join(",")).join(" ")} fill="url(#bar5)" style={{ transform: `translate(${(1 - k) * 160}px, ${-(1 - k) * 220}px)`, opacity: k }} />;
    })}
  </svg>
);
const LW = 1000, LS = LW / 1030, LX0 = CX - LW / 2, LY0 = CY - 250;
const EMB = { x: LX0 + 96 * LS, y: LY0 + 121 * LS };

// ---------------------------------------------------------------- S2 fall
const D = mono([T.fall, T.tpl, T.ad, 5.0, T.bottom], [0, 1260, 2200, 3140, 3800]);
const BALL_Y = 430;
const SENT = "Years to build a reputation.";
let _ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, fs: number) => { if (typeof document === "undefined") return txt.length * fs * 0.5; if (!_ctx) _ctx = document.createElement("canvas").getContext("2d"); _ctx!.font = `600 ${fs}px Inter`; return _ctx!.measureText(txt).width - txt.length * fs * 0.035; };
const typeFs = (s: number) => lerp(230, 92, prog(s, 0.72, 1.0, E.io));
const typeStr = (s: number) => (s < 0.72 ? typed("Years", s, 0.08, 0.55) : "Years" + typed(SENT.slice(5), s, 1.0, 1.7));
function dropBall(s: number) {
  const fs = 92, wfull = measure(SENT, fs);
  const cx0 = CX + wfull / 2 + 18, cy0 = CY - 6;
  const k = prog(s, T.fall, T.fall + 0.6, E.io);
  let x = lerp(cx0, CX, k);
  let y = cy0 + 80 * Math.sin(Math.PI * prog(s, T.fall, T.fall + 0.8)) - (cy0 - BALL_Y) * prog(s, T.fall + 0.25, T.fall + 0.95, E.io);
  let r = lerp(9, 58, prog(s, T.fall, T.fall + 0.5, E.back));
  const land = Math.max(0, s - T.bottom);
  r *= 1 + 0.06 * Math.sin(land * 24) * Math.exp(-land * 5) * (s > T.bottom ? 1 : 0);
  const dv = prog(s, T.dive, T.white, Easing.bezier(0.7, 0, 0.9, 0.5));
  x = lerp(x, CX, dv); y = lerp(y, CY, dv); r = lerp(r, 2300, dv);
  return { x, y, r, dv };
}

// ---------------------------------------------------------------- the main ball's screen position (for ink-wipes)
function mainBall(s: number): { x: number; y: number } {
  if (s < T.white) return dropBall(s);
  if (s < T.pull) return orbitBall(s);
  if (s < T.merge) { const c = camAt(s); return project(c, J.x, J.y); }
  const c = camAt(s); return project(c, mergedX(s), J.y);
}
type Tr = { t: number; d: number; a: Pal; b: Pal; wipe: boolean };
const TRS: Tr[] = [
  { t: 6.6, d: 0.25, a: INK, b: WHITE, wipe: false },
  { t: T.build, d: 1.0, a: WHITE, b: CREAM, wipe: true },
  { t: T.w2, d: 1.0, a: CREAM, b: EMBER, wipe: true },
  { t: T.w3, d: 1.0, a: EMBER, b: NIGHT, wipe: true },
  { t: T.w4, d: 1.0, a: NIGHT, b: FOREST, wipe: true },
  { t: 15.6, d: 1.0, a: FOREST, b: GRAPH, wipe: false },
  { t: T.tmpl, d: 1.1, a: GRAPH, b: WHITE, wipe: true },
  { t: T.ads - 0.1, d: 0.6, a: WHITE, b: LAV, wipe: false },
  { t: T.agents - 0.15, d: 0.35, a: LAV, b: NAVY, wipe: false },
  { t: T.end - 0.2, d: 0.9, a: NAVY, b: OBS, wipe: false },
];

// ================================================================ film
export const Film5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;

  // ---- world
  let tr = TRS[0];
  for (const t of TRS) if (s >= t.t) tr = t;
  const before = s < TRS[0].t;
  const trK = before ? 0 : prog(s, tr.t, tr.t + tr.d, E.soft);
  let wipe: [number, number, number] = [0, 0, 0];
  if (tr.wipe && trK < 1) { const b = mainBall(tr.t); wipe = [b.x, b.y, Math.max(1, trK * 3000)]; }
  const wMix = tr.wipe ? (trK >= 1 ? 1 : 0) : trK;
  const fallD = D(s);
  const cam = s >= T.pull && s < T.ads ? camAt(s) : null;
  const off: [number, number] = s < T.white ? [0, -fallD * 0.00035] : cam ? [cam.x * 0.00006, -cam.y * 0.00006] : [s * 0.01, 0];

  const backBalls: Ball[] = [], balls: Ball[] = [];
  let ballK = 44;

  // ================= S1–S3 =================
  let S1: React.ReactNode = null;
  if (s < T.white + 0.2) {
    const db = dropBall(s);
    if (s >= T.fall) {
      const col = mixBC(CLOUD, B_WHITE, prog(s, T.dive + 0.35, T.white - 0.1));
      balls.push({ x: db.x, y: db.y, r: db.r, c: col, tr: 1 - prog(s, T.white - 0.15, T.white + 0.2), seed: 0.3 });
    }
    const fs = typeFs(s), str = typeStr(s);
    const caretOn = s < T.fall && (s < 1.7 || Math.floor(s * 3.2) % 2 === 0);
    const hide = 1 - prog(s, T.dive, T.dive + 0.4);
    // the template
    const tplY = 1690 - fallD, crumble = prog(s, T.tpl - 0.12, T.tpl + 0.75, E.in);
    // the ad
    const adY = 2630 - fallD, skip = prog(s, T.ad - 0.25, T.ad + 0.4, E.in);
    const curK = prog(s, T.ad - 0.75, T.ad - 0.38, E.io), press = win(s, T.ad - 0.36, T.ad - 0.3, T.ad - 0.24, T.ad - 0.16);
    // the pile of unanswered enquiries
    const G = 4710 - fallD;
    const NOTES = ["New enquiry · 3 days ago", "Missed call · 21:40", "Contact form · no reply", "Unread · 5 messages", "Booking request · expired"];
    S1 = (
      <AbsoluteFill style={{ opacity: hide }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={CX} y1={Math.max(-20, CY + 40 - fallD)} x2={CX} y2={Math.min(H + 20, G)} stroke="rgba(255,255,255,.28)" strokeWidth={2} opacity={prog(s, T.fall, T.fall + 0.4)} />
          {Array.from({ length: 22 }, (_, i) => { const y = (((i * 120 - fallD) % 2640) + 2640) % 2640 - 200; return y > CY + 50 - fallD && y < G - 10 ? <line key={i} x1={CX - 8} x2={CX + 8} y1={y} y2={y} stroke="rgba(255,255,255,.22)" strokeWidth={2} /> : null; })}
          <line x1={0} x2={W} y1={G} y2={G} stroke="rgba(255,255,255,.18)" strokeWidth={2} />
          {s > T.bottom && <ellipse cx={CX} cy={G} rx={lerp(30, 520, prog(s, T.bottom, T.bottom + 0.8, E.out))} ry={lerp(6, 60, prog(s, T.bottom, T.bottom + 0.8, E.out))} fill="none" stroke="rgba(185,166,255,.6)" strokeWidth={2} opacity={1 - prog(s, T.bottom, T.bottom + 0.8)} />}
        </svg>
        {/* the sentence; the caret becomes the ball */}
        <div style={{ position: "absolute", left: 0, width: W, top: CY - fs * 0.6 - fallD, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: fs, lineHeight: 1.2, letterSpacing: "-0.035em", color: "#F4F1FA", whiteSpace: "nowrap" }}>
          {str}<span style={{ display: "inline-block", width: Math.max(4, fs * 0.05), height: fs * 0.9, marginLeft: fs * 0.06, verticalAlign: "-0.12em", background: "#B9A6FF", opacity: caretOn ? 1 : 0 }} />
        </div>
        {/* 1 · a grey template site — it crumbles as the ball passes */}
        {tplY > -700 && tplY < H + 700 && (crumble < 1) && (crumble <= 0 ? (
          <div style={{ position: "absolute", left: CX - 420, top: tplY - 262, width: 840, height: 525, borderRadius: 18, background: "#26262B", border: "1px solid rgba(255,255,255,.08)", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
            <div style={{ position: "absolute", left: 30, top: 26, width: 110, height: 16, borderRadius: 8, background: "#3A3A41" }} />
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 80, top: 30, width: 56, height: 10, borderRadius: 5, background: "#34343A" }} />)}
            <div style={{ position: "absolute", left: 40, top: 130, width: 330, height: 34, borderRadius: 8, background: "#3C3C44" }} />
            <div style={{ position: "absolute", left: 40, top: 178, width: 270, height: 34, borderRadius: 8, background: "#3C3C44" }} />
            <div style={{ position: "absolute", left: 40, top: 240, width: 300, height: 12, borderRadius: 6, background: "#33333A" }} />
            <div style={{ position: "absolute", left: 40, top: 262, width: 240, height: 12, borderRadius: 6, background: "#33333A" }} />
            <div style={{ position: "absolute", left: 40, top: 310, width: 140, height: 44, borderRadius: 22, background: "#45454E" }} />
            <svg style={{ position: "absolute", left: 430, top: 110 }} width={360} height={300}><rect x={1} y={1} width={358} height={298} rx={14} fill="#2F2F35" stroke="#3E3E46" strokeWidth={2} /><path d="M1 1 L359 299 M359 1 L1 299" stroke="#3E3E46" strokeWidth={2} /></svg>
            <div style={{ position: "absolute", left: 40, bottom: 34, fontFamily: MONO, fontSize: 16, color: "rgba(255,255,255,.3)", letterSpacing: "0.12em" }}>THEME · BUSINESS PRO · #4,217</div>
          </div>
        ) : Array.from({ length: 96 }, (_, i) => {
          const cx = i % 12, cy = Math.floor(i / 12), d = h(i, 7);
          const kk = cl01((crumble - d * 0.35) / 0.65);
          return <div key={i} style={{ position: "absolute", left: CX - 420 + cx * 70 + kk * (h(i, 2) - 0.5) * 300, top: tplY - 262 + cy * 65.6 + kk * kk * (420 + 600 * h(i, 3)), width: 70, height: 65.6, background: ["#2A2A30", "#34343B", "#3C3C44", "#2F2F35"][i % 4], opacity: 1 - kk, transform: `rotate(${kk * (h(i, 5) - 0.5) * 160}deg) scale(${1 - kk * 0.4})` }} />;
        }))}
        {/* 2 · a grey ad — the cursor clicks Skip */}
        {adY > -700 && adY < H + 700 && skip < 1 && (
          <div style={{ position: "absolute", left: CX - 420, top: adY - 236, width: 840, height: 473, borderRadius: 18, background: "linear-gradient(135deg, #2B2B31, #1E1E23)", border: "1px solid rgba(255,255,255,.08)", overflow: "hidden", transform: `translateX(${-skip * 1500}px) rotate(${-skip * 14}deg)`, opacity: 1 - skip * 0.6, boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
            <div style={{ position: "absolute", left: 22, top: 20, padding: "6px 12px", borderRadius: 10, background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.55)", fontFamily: SANS, fontSize: 18 }}>Ad · 0:06</div>
            <svg style={{ position: "absolute", left: 380, top: 196 }} width={80} height={80}><circle cx={40} cy={40} r={38} fill="rgba(255,255,255,.08)" /><path d="M32 26 L56 40 L32 54 Z" fill="rgba(255,255,255,.35)" /></svg>
            <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, height: 6, borderRadius: 3, background: "rgba(255,255,255,.08)" }}><div style={{ width: "34%", height: "100%", borderRadius: 3, background: "rgba(255,255,255,.3)" }} /></div>
            <div style={{ position: "absolute", right: 22, bottom: 48, padding: "12px 22px", borderRadius: 12, background: "rgba(255,255,255,.14)", color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 22, transform: `scale(${1 - press * 0.08})` }}>Skip ad ›</div>
          </div>
        )}
        {curK > 0 && skip < 0.9 && <Cursor x={lerp(1640, CX + 330, curK)} y={lerp(adY + 360, adY + 186, curK)} press={press} op={1 - prog(s, T.ad + 0.1, T.ad + 0.4)} />}
        {/* 3 · unanswered enquiries pile up */}
        {G < H + 600 && NOTES.map((n, i) => {
          const t0 = T.pile + i * 0.17, k = prog(s, t0, t0 + 0.55, Easing.bezier(0.5, 0, 0.75, 0.2));
          const ty = G - 82 * (i + 1) - 6 * i;
          const y = lerp(ty - 900, ty, k) + (k >= 1 ? 6 * Math.sin((s - t0 - 0.55) * 18) * Math.exp(-(s - t0 - 0.55) * 7) : 0);
          if (k <= 0) return null;
          return <div key={i} style={{ position: "absolute", left: CX - 300 + (h(i, 1) - 0.5) * 120, top: y, width: 600, height: 76, borderRadius: 38, background: "rgba(48,48,56,.92)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", gap: 16, padding: "0 26px", transform: `rotate(${(h(i, 2) - 0.5) * 7}deg)`, color: "rgba(255,255,255,.62)", fontFamily: SANS, fontSize: 24, fontWeight: 500 }}><div style={{ width: 14, height: 14, borderRadius: 7, background: "#7A7A86" }} />{n}</div>;
        })}
        <Ink s={s} a={T.ad + 0.4} b={T.bottom - 0.05} x={70} y={380} size={64} align="left" w={600}>Three seconds<br /><span style={{ color: "rgba(244,241,250,.55)" }}>to lose it online.</span></Ink>
      </AbsoluteFill>
    );
  }

  // ================= S4 · the container, the brief, the orbit =================
  let S4back: React.ReactNode = null, S4: React.ReactNode = null;
  if (s > T.white - 0.15 && s < T.pull + 1.2) {
    const inK = prog(s, T.white - 0.1, T.white + 0.6, E.out);
    const out = prog(s, T.pull, T.pull + 0.5);      // the grid takes over
    const idx = s < T.w2 ? 0 : s < T.w3 ? 1 : s < T.w4 ? 2 : 3;
    const swapK = idx === 0 ? 1 : prog(s, SWAP[idx], SWAP[idx] + 0.7, E.io);
    const H0 = HEROES[idx], Hp = HEROES[Math.max(0, idx - 1)];
    const build = prog(s, T.build, T.build + 1.3, (x: number) => x);
    const darkK = idx === 0 ? 0 : 1;
    const ob = orbitBall(s);
    const showBall = s > T.click;
    if (showBall) (ob.front ? balls : backBalls).push({ x: ob.x, y: ob.y, r: ob.r, c: CLOUD, seed: 1.1 });
    // the brief retypes on each pass
    let brief = HEROES[0].brief;
    if (s < T.w2 - 0.3) { brief = typed(HEROES[0].brief, s, T.pill + 0.15, T.pill + 0.75); }
    else { const a = SWAP[idx] - 0.3; const erase = prog(s, a, a + 0.22, (x: number) => x), type = prog(s, a + 0.24, a + 0.8, (x: number) => x); brief = erase < 1 ? Hp.brief.slice(0, Math.round(Hp.brief.length * (1 - erase))) : H0.brief.slice(0, Math.round(H0.brief.length * type)); }
    const pillIn = prog(s, T.pill, T.pill + 0.45, E.back) * (1 - prog(s, T.pull - 0.05, T.pull + 0.35));
    const clickK = win(s, T.click - 0.06, T.click, T.click + 0.04, T.click + 0.14);
    if (s > T.pill && !showBall) balls.push({ x: SEND.x, y: SEND.y, r: 22 * pillIn * (1 - clickK * 0.15), c: CLOUD, seed: 1.1 });
    const curK = prog(s, T.pill + 0.6, T.click - 0.06, E.io);
    const pd = cl01(darkK * (idx === 0 ? 0 : 1));
    const orbitOp = prog(s, T.click + 0.2, T.click + 0.8) * (1 - prog(s, T.pull - 0.6, T.pull - 0.1));
    const ellD = (top: boolean) => `M ${ORB.cx - ORB.rx} ${ORB.cy} A ${ORB.rx} ${ORB.ry} 0 0 ${top ? 1 : 0} ${ORB.cx + ORB.rx} ${ORB.cy}`;
    const ringCol = darkK ? "rgba(255,255,255,.35)" : "rgba(80,60,140,.28)";
    S4back = (
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: orbitOp * (1 - out) }}><path d={ellD(true)} stroke={ringCol} strokeWidth={2} fill="none" /></svg>
    );
    // panels that assemble into the first hero (lovio)
    const PANELS = [[0.04, 0.07, 0.42, 0.3], [0.5, 0.05, 0.46, 0.24], [0.54, 0.33, 0.4, 0.34], [0.05, 0.41, 0.31, 0.4], [0.38, 0.56, 0.22, 0.32], [0.62, 0.71, 0.34, 0.22], [0.3, 0.2, 0.21, 0.3]];
    const heroLayer = (src: string, style: React.CSSProperties) => <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }} />;
    const tl = s - SWAP[idx];
    S4 = (
      <>
        <div style={{ position: "absolute", left: CL, top: CT, width: CW, height: CH, borderRadius: 26, overflow: "hidden", opacity: inK * (1 - out), transform: `scale(${lerp(1.06, 1, inK)})`, background: "rgba(255,255,255,.55)", border: "1.5px solid rgba(255,255,255,.75)", boxShadow: `0 50px 120px rgba(${darkK ? "0,0,0,.55" : "90,70,140,.22"})`, backdropFilter: "blur(10px)" }}>
          {idx === 0 && s > T.build && <>
            {PANELS.map(([px, py, pw, ph], i) => {
              const a = T.build + i * 0.09, k = prog(s, a, a + 0.5, E.out);
              if (k <= 0) return null;
              return (
                <div key={i} style={{ position: "absolute", left: px * CW, top: py * CH, width: pw * CW, height: ph * CH, borderRadius: 16, overflow: "hidden", opacity: k * (1 - prog(s, T.build + 0.95, T.build + 1.3)), transform: `translateY(${(1 - k) * 40}px) scale(${lerp(0.86, 1, k)})`, border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 18px 40px rgba(90,70,140,.18)" }}>
                  <Img src={HEROES[0].src(0)} style={{ position: "absolute", left: -px * CW, top: -py * CH, width: CW, height: CH, objectFit: "cover", filter: "blur(9px) saturate(1.25) brightness(1.08)" }} />
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.55) 1.4px, transparent 1.6px)", backgroundSize: "7px 7px" }} />
                </div>
              );
            })}
            {heroLayer(HEROES[0].src(Math.max(0, s - T.build)), { opacity: prog(s, T.build + 0.75, T.build + 1.3), filter: `blur(${(1 - prog(s, T.build + 0.75, T.build + 1.35)) * 14}px)` })}
          </>}
          {idx > 0 && <>
            {heroLayer(Hp.src(SWAP[idx] - SWAP[idx - 1]), { opacity: 1 - swapK, filter: `blur(${swapK * 16}px) brightness(${1 + swapK * 0.7})` })}
            {heroLayer(H0.src(Math.max(0, tl)), { opacity: swapK, filter: `blur(${(1 - swapK) * 18}px) brightness(${1 + (1 - swapK) * 0.8})`, transform: `scale(${lerp(1.06, 1, swapK)})` })}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${H0.bloom}, rgba(255,255,255,0) 70%)`, opacity: Math.sin(Math.PI * swapK) * 0.8 }} />
          </>}
          {/* building chip (lovio's loading %) */}
          {s > T.build && s < T.build + 2.0 && <div style={{ position: "absolute", left: 26, bottom: 24, padding: "8px 14px", borderRadius: 12, background: "rgba(255,255,255,.75)", fontFamily: MONO, fontSize: 18, color: "#3A2F5C", opacity: win(s, T.build, T.build + 0.2, T.build + 1.6, T.build + 1.95) }}>{build < 0.98 ? `building · ${Math.round(build * 100)}%` : "live ●"}</div>}
        </div>
        {/* the brief pill — the anchor */}
        {pillIn > 0 && (
          <div style={{ position: "absolute", left: PILL.x, top: PILL.y, width: PILL.w, height: PILL.hh, borderRadius: PILL.hh / 2, transform: `scale(${pillIn * (1 - clickK * 0.03)})`, opacity: Math.min(1, pillIn * 1.4), background: pd ? "rgba(18,16,26,.6)" : "rgba(255,255,255,.78)", border: `1.5px solid ${pd ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.95)"}`, boxShadow: "0 24px 60px rgba(40,20,80,.25)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", padding: "0 34px", fontFamily: SANS, fontSize: 27, fontWeight: 500, color: pd ? "#F4F1FA" : "#1C1830", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden" }}>
            <span style={{ opacity: 0.45, marginRight: 14, fontFamily: MONO, fontSize: 20 }}>brief</span>{brief}<span style={{ display: "inline-block", width: 2.5, height: 30, marginLeft: 4, background: pd ? "#fff" : "#1C1830", opacity: Math.floor(s * 3) % 2 ? 0.8 : 0 }} />
          </div>
        )}
        {curK > 0 && <Cursor x={lerp(1500, SEND.x + 6, curK)} y={lerp(1060, SEND.y + 8, curK)} press={clickK} op={1 - prog(s, T.click + 0.15, T.click + 0.45)} />}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: orbitOp * (1 - out) }}><path d={ellD(false)} stroke={ringCol} strokeWidth={2} fill="none" /></svg>
      </>
    );
  }

  // ================= S5–S7 · grid, scroll, containers, lines, merge, "It's yours." =================
  let WORLD: React.ReactNode = null;
  if (cam) {
    const vel = Math.abs(cam.y - camAt(s - 1 / 60).y);
    const blurY = s > T.scroll && s < T.land ? Math.min(70, vel * 0.45) : 0;
    const vis = (wx: number, wy: number, rad: number) => Math.hypot(wx - cam.x, wy - cam.y) * cam.s - rad * cam.s < 1700;
    const lineK = prog(s, T.land - 0.1, T.land + 0.8, E.io);
    const rk = rollK(s);
    const cols: BC[] = [B_VALE, B_CAPE, B_NORTH];
    const mergeK = prog(s, T.merge - 0.15, T.merge + 0.45, E.io);
    if (s > T.land + 0.2 && s < T.merge + 0.6) {
      const grow = prog(s, T.land + 0.3, T.land + 0.8, E.back);
      LINES.forEach((L, i) => {
        const p = bez(L[0], L[1], L[2], L[3], rk), pp = project(cam, p[0], p[1]);
        balls.push({ x: pp.x, y: pp.y, r: 115 * grow * pp.k * (1 - 0.3 * mergeK), c: mixBC(cols[i], CLOUD, mergeK), seed: 2 + i, tr: 1 - prog(s, T.merge + 0.2, T.merge + 0.5) });
      });
      if (mergeK > 0) { const pp = project(cam, J.x, J.y); balls.push({ x: pp.x, y: pp.y, r: lerp(0, 150, mergeK) * pp.k, c: CLOUD, seed: 2.7 }); }
      ballK = 70 * cam.s;
    }
    if (s >= T.merge + 0.5 && s < T.push + 0.4) {
      const pp = project(cam, mergedX(s), J.y);
      const into = prog(s, T.into - 0.1, T.push, E.io);
      balls.push({ x: pp.x, y: pp.y, r: 150 * pp.k * (1 - 0.6 * into), c: CLOUD, seed: 2.7, tr: 1 - into });
    }
    const pillK = prog(s, T.yours - 0.1, T.yours + 0.5, E.back);
    const glow = prog(s, T.into, T.push, E.io);
    WORLD = (
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: camCss(cam) }}>
        <svg width={0} height={0} style={{ position: "absolute" }}><filter id="vb5" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${blurY.toFixed(1)}`} /></filter></svg>
        {/* the 3 × 3 grid + hundreds of heroes */}
        {s < T.land + 0.7 && Array.from({ length: 3 + NF }, (_, r) => {
          const colsR = r < 3 ? [0, 1, 2] : [-1, 0, 1, 2, 3];
          const fade = r >= 3 ? 1 - prog(s, T.land - 0.5, T.land + 0.2) : 1 - prog(s, T.scroll + 1.0, T.scroll + 1.6);
          return colsR.map((c) => {
            const x = c * PX, y = r * PY;
            if (!vis(x + CW / 2, y + CH / 2, 760)) return null;
            const centre = r === 1 && c === 1;
            return <div key={`${r}_${c}`} style={{ position: "absolute", left: x, top: y, opacity: centre && s < T.scroll + 0.6 ? 1 : fade * (c < 0 || c > 2 ? 0.7 : 1), filter: blurY > 0.6 ? "url(#vb5)" : undefined }}><Card src={centre ? HEROES[3].src(Math.max(0, T.pull - T.w4)) : cellSrc(r * 7 + c * 3 + 5)} /></div>;
          });
        })}
        {/* the three glass containers */}
        {s > T.scroll + 1.0 && s < T.ads && CONT.map((y, i) => (
          vis(CW / 2, y + CH / 2, 800) ? (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: -GP, top: y - GP, width: CW + GP * 2, height: CH + GP * 2, borderRadius: 40, background: "linear-gradient(140deg, rgba(255,255,255,.16), rgba(255,255,255,.05))", border: "3px solid rgba(255,255,255,.28)", boxShadow: "0 50px 120px rgba(0,0,0,.5)" }}>
                <div style={{ position: "absolute", left: GP, top: GP }}><Card src={[HEROES[0].src(0), HEROES[1].src(0), HEROES[2].src(4)][i]} shadow="none" /></div>
              </div>
              {[1, 2].map((c) => { const o = prog(s, T.land - 0.6, T.land + 0.05, E.in); return o >= 1 ? null : <div key={c} style={{ position: "absolute", left: c * PX + o * 1800, top: y, opacity: 1 - o, filter: blurY > 0.6 ? "url(#vb5)" : undefined }}><Card src={cellSrc(400 + i * 5 + c)} /></div>; })}
            </React.Fragment>
          ) : null
        ))}
        {/* lines: three out of the right sides → one line → "This isn't a template." → the pill */}
        {s > T.land - 0.1 && (
          <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {LINES.map((L, i) => (
              <g key={i}>
                <path d={lineD(L, lineK)} stroke="rgba(0,0,0,.35)" strokeWidth={9} fill="none" strokeLinecap="round" />
                <path d={lineD(L, lineK)} stroke="rgba(255,255,255,.85)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
                {s > T.roll && <path d={lineD(L, rk)} stroke={mixC(cols[i][1], CLOUD[1], mergeK)} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.7 * (1 - prog(s, T.merge + 0.3, T.merge + 1.2))} />}
              </g>
            ))}
            {s > T.merge - 0.2 && <>
              <path d={`M ${J.x} ${J.y} L ${lerp(J.x, PILL2.x - PILL2.w / 2, prog(s, T.merge - 0.2, T.merge + 0.9, E.io))} ${J.y}`} stroke="rgba(0,0,0,.25)" strokeWidth={9} strokeLinecap="round" />
              <path d={`M ${J.x} ${J.y} L ${lerp(J.x, PILL2.x - PILL2.w / 2, prog(s, T.merge - 0.2, T.merge + 0.9, E.io))} ${J.y}`} stroke="rgba(255,255,255,.9)" strokeWidth={3.5} strokeLinecap="round" />
              <path d={`M ${Math.max(J.x, mergedX(s) - 1300)} ${J.y} L ${mergedX(s)} ${J.y}`} stroke={CLOUD[1]} strokeWidth={18} strokeLinecap="round" opacity={0.65} />
            </>}
            {s > T.merge && s < T.merge + 1 && <circle cx={J.x} cy={J.y} r={lerp(120, 900, prog(s, T.merge, T.merge + 0.9, E.out))} stroke="rgba(255,255,255,.7)" strokeWidth={7} fill="none" opacity={1 - prog(s, T.merge, T.merge + 0.9)} />}
          </svg>
        )}
        {/* "This isn't a template." lives in the world, above the line */}
        {s > T.tmpl && (() => { const k = win(s, T.tmpl + 0.15, T.tmpl + 0.75, T.push - 0.3, T.push + 0.1); return <div style={{ position: "absolute", left: J.x + 500, top: J.y - 560, width: 2400, fontFamily: SANS, fontWeight: 600, fontSize: 210, letterSpacing: "-0.04em", color: "#17132A", opacity: k, filter: `blur(${(1 - k) * 20}px)`, whiteSpace: "nowrap" }}>This isn't a <Grad>template.</Grad></div>; })()}
        {/* the "It's yours." pill (lovio's "It's live") — the camera pushes into it */}
        {pillK > 0 && (
          <div style={{ position: "absolute", left: PILL2.x - PILL2.w / 2, top: PILL2.y - PILL2.hh / 2, width: PILL2.w, height: PILL2.hh, borderRadius: PILL2.hh / 2, transform: `scale(${pillK})`, background: "#FFFFFF", boxShadow: `0 ${30 + glow * 30}px ${90 + glow * 60}px rgba(139,92,246,${0.35 + glow * 0.35}), ${-60 - glow * 40}px 30px 90px rgba(96,165,250,${0.35 + glow * 0.3}), 70px 30px 90px rgba(236,72,153,${0.25 + glow * 0.3})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 500, fontSize: 104, letterSpacing: "-0.03em", color: "#17132A" }}>
            It's <span style={{ marginLeft: 26 }}><Grad g="linear-gradient(90deg, #6366F1, #8B5CF6 50%, #EC4899)">yours.</Grad></span>
          </div>
        )}
      </div>
    );
  }
  const whiteFill = prog(s, T.push + 0.55, T.ads - 0.05) * (1 - prog(s, T.ads + 0.05, T.ads + 0.6));

  // ================= S8 · ads =================
  let S8: React.ReactNode = null;
  if (s > T.ads - 0.1 && s < T.agents + 0.3) {
    const sw = (i: number) => prog(s, T.ads + 0.05 + i * 0.09, T.ads + 0.85 + i * 0.09, E.out);
    const open = prog(s, T.trail - 0.05, T.publish + 0.1, E.in);
    const spin = lerp(-10, 16, prog(s, T.ads, T.trail, (x: number) => x)) + open * 40;
    const dz = lerp(0, 220, prog(s, T.ads, T.trail, (x: number) => x));
    const PW = 300, PH = 620;
    const phones = [
      { tr: (k: number) => `translate3d(${-560 - (1 - k) * 600 - open * 900}px, 0, ${dz}px) rotateY(${62 + (1 - k) * 40}deg)`, el: <Phone src={site(`m_estate_${Math.min(2, Math.floor(prog(s, T.ads, T.trail) * 3))}.jpg`)} w={PW} hh={PH} cta="Book a viewing" /> , ox: -PW / 2, oy: -PH / 2 },
      { tr: (k: number) => `translate3d(${560 + (1 - k) * 600}px, 0, ${dz}px) rotateY(${-62 - (1 - k) * 40}deg)`, el: <Phone src={site("m_north_0.jpg")} w={PW} hh={PH} cta="Reserve a night" />, ox: -PW / 2, oy: -PH / 2, whip: true },
      { tr: (k: number) => `translate3d(0, ${-340 - (1 - k) * 500 - open * 700}px, ${dz}px) rotateX(${-62 - (1 - k) * 40}deg)`, el: <Phone src={site("cigars_hero.png")} w={PH} hh={PW} land cta="Shop the reserve" label="Sponsored · video" />, ox: -PH / 2, oy: -PW / 2 },
      { tr: (k: number) => `translate3d(0, ${340 + (1 - k) * 500 + open * 700}px, ${dz}px) rotateX(${62 + (1 - k) * 40}deg)`, el: <Phone src={fr("surgery", 90, 170)} w={PH} hh={PW} land cta="Request a consultation" label="Sponsored · post" />, ox: -PH / 2, oy: -PW / 2 },
    ];
    const trailK = prog(s, T.trail, T.publish + 0.15, Easing.bezier(0.6, 0, 0.3, 1));
    const pubK = prog(s, T.publish - 0.05, T.publish + 0.55, E.back);
    const clickK = win(s, T.pclick - 0.06, T.pclick, T.pclick + 0.05, T.pclick + 0.16);
    const wallK = prog(s, T.wall, T.wall + 0.9, Easing.bezier(0.2, 0.8, 0.2, 1));
    const wallOut = prog(s, T.agents - 0.35, T.agents, E.in);
    const curK = prog(s, T.publish + 0.2, T.pclick - 0.05, E.io);
    S8 = (
      <AbsoluteFill>
        {/* the phone tunnel (LangEase) */}
        {s < T.publish + 0.4 && (
          <AbsoluteFill style={{ perspective: 1100, opacity: 1 - prog(s, T.publish, T.publish + 0.3) }}>
            <div style={{ position: "absolute", left: CX, top: CY, transformStyle: "preserve-3d", transform: `rotateZ(${spin}deg)` }}>
              {phones.map((p, i) => {
                const k = sw(i);
                if (p.whip && s > T.trail) return null;
                return <div key={i} style={{ position: "absolute", left: p.ox, top: p.oy, transform: p.tr(k), opacity: Math.min(1, k * 2) }}>{p.el}</div>;
              })}
            </div>
            <Ink s={s} a={T.ads + 0.5} b={T.words} y={CY - 48} size={80} color="#17132A">Ads that <Grad>stop</Grad> the scroll.</Ink>
            {s > T.words - 0.1 && s < T.trail + 0.3 && (
              <div style={{ position: "absolute", left: 0, width: W, top: CY - 48, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 80, letterSpacing: "-0.035em", opacity: 1 - prog(s, T.trail, T.trail + 0.3) }}>
                {["Story.", "Post.", "Video."].map((w, i) => { const k = prog(s, T.words + i * 0.35, T.words + i * 0.35 + 0.45, E.out); return <span key={i} style={{ display: "inline-block", marginRight: 30, opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateY(${(1 - k) * 18}px)`, color: ["#17132A", "#7C3AED", "#DB2777"][i] }}>{w}</span>; })}
              </div>
            )}
          </AbsoluteFill>
        )}
        {/* the whip: the right phone swings across, its light trail becomes the Publish pill */}
        {s > T.trail && s < T.publish + 0.3 && (() => {
          const x0 = CX + 640;
          const shrink = prog(s, T.publish - 0.25, T.publish + 0.2, E.io);
          const mid = lerp(x0, CX - 120, trailK), len = 200 + 1300 * Math.sin(Math.PI * Math.min(1, trailK * 1.15));
          const cxp = lerp(mid + len * 0.25, CX, shrink), wp = lerp(len, 60, shrink), hp = lerp(lerp(150, 80, trailK), 40, shrink);
          return <div style={{ position: "absolute", left: cxp - wp / 2, top: CY - hp / 2, width: wp, height: hp, borderRadius: hp / 2, background: "linear-gradient(90deg, rgba(99,102,241,.95), rgba(139,92,246,.9) 60%, rgba(236,72,153,.0))", filter: `blur(${lerp(18, 2, shrink)}px)`, opacity: 1 - prog(s, T.publish + 0.05, T.publish + 0.25) }} />;
        })()}
        {/* Publish (NeuralSeek): grows with overshoot, the cursor chases it, click → rings → whip */}
        {s > T.publish - 0.05 && s < T.wall + 0.3 && (
          <>
            {s > T.pclick && [0, 1, 2].map((i) => { const k = prog(s, T.pclick + i * 0.1, T.pclick + 0.6 + i * 0.1, E.out); return <div key={i} style={{ position: "absolute", left: CX - (190 + k * 520) , top: CY - (55 + k * 190), width: (190 + k * 520) * 2, height: (55 + k * 190) * 2, borderRadius: 400, border: "2.5px solid rgba(255,255,255,.85)", opacity: (1 - k) * 0.9 }} />; })}
            <div style={{ position: "absolute", left: CX - 190, top: CY - 55, width: 380, height: 110, borderRadius: 55, transform: `scale(${pubK * (1 - clickK * 0.08)}) translateX(${-prog(s, T.wall, T.wall + 0.3, E.in) * 1400}px)`, background: "linear-gradient(90deg, #4F46E5, #7C3AED)", boxShadow: "0 20px 60px rgba(79,70,229,.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: "-0.02em" }}>Publish</div>
            {curK > 0 && <Cursor x={lerp(CX + 420, CX + 60, curK) + Math.sin(curK * 6) * 30 * (1 - curK)} y={lerp(CY - 260, CY + 14, curK)} press={clickK} op={1 - prog(s, T.pclick + 0.2, T.wall)} />}
          </>
        )}
        {/* whip into a wall of ads (motion blur), then "Campaign live" + confetti (LangEase) */}
        {s > T.wall && (
          <AbsoluteFill style={{ perspective: 1600, opacity: 1 - wallOut }}>
            <div style={{ position: "absolute", left: CX, top: CY, transformStyle: "preserve-3d", transform: `rotateX(18deg) rotateY(-16deg) rotateZ(-4deg) translateX(${lerp(1600, 0, wallK)}px) translateZ(${-200 - (1 - wallK) * 300}px)`, filter: `blur(${(1 - wallK) * 16}px)` }}>
              {Array.from({ length: 18 }, (_, i) => {
                const c = i % 6, r = Math.floor(i / 6), kind = (i + r) % 3;
                const w = kind === 0 ? 220 : kind === 1 ? 300 : 400, hh = kind === 0 ? 390 : kind === 1 ? 300 : 225;
                const drift = Math.sin(s * 0.8 + i) * 10;
                return <div key={i} style={{ position: "absolute", left: (c - 3) * 430 + (r % 2) * 120 - w / 2, top: (r - 1) * 440 - hh / 2 + drift, opacity: 0.95 }}><Card src={cellSrc(i * 3 + 7)} w={w} hh={hh} r={20} shadow="0 30px 70px rgba(60,40,120,.3)" /></div>;
              })}
            </div>
            {s > T.live && (() => {
              const k = prog(s, T.live, T.live + 0.5, E.back);
              return (
                <>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(246,245,251,.55)", opacity: prog(s, T.live, T.live + 0.3), backdropFilter: "blur(8px)" }} />
                  <div style={{ position: "absolute", left: CX - 70, top: CY - 150, width: 140, height: 140, borderRadius: 70, background: "rgba(255,255,255,.9)", boxShadow: "0 20px 60px rgba(99,102,241,.35), inset 0 0 0 3px rgba(139,92,246,.5)", transform: `scale(${k})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={70} height={70} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#7C3AED" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(s, T.live + 0.2, T.live + 0.6, E.io)} /></svg>
                  </div>
                  <Ink s={s} a={T.live + 0.15} b={T.agents + 0.2} y={CY + 30} size={84} color="#17132A">Campaign <Grad>live.</Grad></Ink>
                  {Array.from({ length: 46 }, (_, i) => {
                    const t = s - T.live - 0.1; if (t < 0) return null;
                    const a = h(i, 1) * Math.PI * 2, sp = 500 + h(i, 2) * 700;
                    const x = CX + Math.cos(a) * sp * t * 1.2, y = CY - 80 + Math.sin(a) * sp * t * 0.9 + 600 * t * t;
                    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14 + h(i, 3) * 16, height: 8 + h(i, 4) * 10, borderRadius: 3, background: ["#7C3AED", "#60A5FA", "#EC4899", "#A78BFA", "#38BDF8"][i % 5], transform: `rotate(${t * 400 * (h(i, 5) - 0.5)}deg)`, opacity: 1 - prog(s, T.live + 0.6, T.live + 1.2) }} />;
                  })}
                </>
              );
            })()}
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    );
  }

  // ================= S9 · agents =================
  let S9: React.ReactNode = null;
  if (s > T.agents - 0.1 && s < T.end + 0.6) {
    const t0 = T.agents;
    const OC = { x: 640, y: 560 };
    const inK = prog(s, t0 + 0.2, t0 + 0.9, E.out);
    const toList = prog(s, T.roll2 - 0.3, T.roll2 + 0.4, E.io);
    const outK = prog(s, T.end - 0.3, T.end + 0.3, E.in);
    if (s < T.end + 0.4) balls.push({ x: OC.x - toList * 1400, y: OC.y, r: 92 * inK, c: CLOUD, seed: 4.2, tr: 1 - outK });
    const AG = [{ l: "Receptionist", g: "M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" }, { l: "Lead qualifier", g: "M3 5h18l-7 8v6l-4 2v-8z" }, { l: "Outbound caller", g: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" }];
    const WORDS = ["Estates", "Clinics", "Hospitality", "Premium brands"];
    const wr = prog(s, T.roll2 + 0.5, T.end - 0.6, (x: number) => x) * (WORDS.length - 1);
    S9 = (
      <AbsoluteFill style={{ opacity: 1 - outK }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-toList * 1400}px)` }}>
          {/* the dark circle with light arcs (NeuralSeek) */}
          <div style={{ position: "absolute", left: OC.x - 330, top: OC.y - 330, width: 660, height: 660, borderRadius: 330, background: "radial-gradient(circle, rgba(20,24,60,.9), rgba(7,8,24,.6) 70%)", opacity: inK, transform: `scale(${lerp(0.8, 1, inK)})` }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: inK }}>
            <defs><linearGradient id="arc5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60A5FA" stopOpacity="0" /><stop offset="0.5" stopColor="#A78BFA" /><stop offset="1" stopColor="#F0ABFC" stopOpacity="0" /></linearGradient></defs>
            {[0, 1].map((i) => <circle key={i} cx={OC.x} cy={OC.y} r={330 - i * 26} fill="none" stroke="url(#arc5)" strokeWidth={3 - i} pathLength={1} strokeDasharray="0.32 0.68" transform={`rotate(${s * (i ? -70 : 90)} ${OC.x} ${OC.y})`} />)}
            <circle cx={OC.x} cy={OC.y} r={420} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={1.5} />
          </svg>
          {AG.map((a, i) => {
            const k = prog(s, t0 + 1.0 + i * 0.2, t0 + 1.5 + i * 0.2, E.back);
            const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 3 + (s - t0) * 0.35;
            const x = OC.x + Math.cos(ang) * 420, y = OC.y + Math.sin(ang) * 420;
            return <div key={i} style={{ position: "absolute", left: x - 140, top: y - 34, width: 280, height: 68, borderRadius: 34, background: "rgba(22,26,64,.85)", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 16px 40px rgba(0,0,0,.4)", display: "flex", alignItems: "center", gap: 14, padding: "0 22px", transform: `scale(${k})`, color: "#fff", fontFamily: SANS, fontSize: 24, fontWeight: 500 }}><svg width={28} height={28} viewBox="0 0 24 24"><path d={a.g} stroke="#C4B5FD" strokeWidth={1.7} fill="none" strokeLinejoin="round" /></svg>{a.l}</div>;
          })}
          {/* right column: the enquiry, the line, toggles, the ready notes */}
          <div style={{ position: "absolute", left: 1180, top: lerp(-160, 120, prog(s, t0 + 0.4, t0 + 1.0, E.back)), opacity: prog(s, t0 + 0.4, t0 + 0.8) * (1 - prog(s, t0 + 3.6, t0 + 4.0)) }}><Note title="New enquiry · 02:14" body="Is the estate available for a viewing in March?" /></div>
          <Ink s={s} a={t0 + 1.4} b={T.roll2} x={1180} y={lerp(300, 120, prog(s, t0 + 3.6, t0 + 4.1, E.io))} size={72} align="left" w={700}>Agents that answer <Grad g="linear-gradient(90deg, #60A5FA, #A78BFA 60%, #F0ABFC)">at 2am.</Grad></Ink>
          {["Answers every enquiry", "Qualifies the lead", "Books the call"].map((l, i) => {
            const a = t0 + 2.3 + i * 0.35, k = prog(s, a, a + 0.35, E.out), on = prog(s, a + 0.35, a + 0.6, E.io);
            return <div key={i} style={{ position: "absolute", left: 1180, top: lerp(470, 300, prog(s, t0 + 3.6, t0 + 4.1, E.io)) + i * 84, width: 600, height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: k * (1 - prog(s, T.roll2 - 0.4, T.roll2)), transform: `translateX(${(1 - k) * 40}px)`, borderBottom: "1px solid rgba(255,255,255,.1)", fontFamily: SANS, fontSize: 30, color: "#fff", fontWeight: 500 }}>{l}<Toggle k={on} /></div>;
          })}
          {[{ t: "Lead qualified", b: "Budget and dates confirmed · March viewing" }, { t: "Viewing booked", b: "Saturday 10:00 · added to your calendar" }].map((n, i) => {
            const a = t0 + 4.0 + i * 0.5, k = prog(s, a, a + 0.45, E.back);
            return <div key={i} style={{ position: "absolute", left: 1180 + i * 40, top: 610 + i * 150, transform: `translateY(${(1 - k) * 40}px) scale(${lerp(0.9, 1, k)})`, opacity: k * (1 - prog(s, T.roll2 - 0.4, T.roll2)) }}><Note title={n.t} body={n.b} check /></div>;
          })}
        </div>
        {/* rolling list (NeuralSeek "Built for ___") */}
        {s > T.roll2 - 0.2 && (
          <div style={{ position: "absolute", inset: 0, opacity: prog(s, T.roll2, T.roll2 + 0.4) }}>
            <div style={{ position: "absolute", left: 0, width: CX - 30, top: CY - 50, textAlign: "right", fontFamily: SANS, fontWeight: 500, fontSize: 84, letterSpacing: "-0.03em", color: "rgba(255,255,255,.92)" }}>Built for</div>
            {WORDS.map((w, i) => { const d = i - wr; const a = Math.abs(d); return <div key={i} style={{ position: "absolute", left: CX + 10, top: CY - 50 + d * 108, fontFamily: SANS, fontWeight: 600, fontSize: 84, letterSpacing: "-0.03em", color: "#fff", opacity: Math.max(0, 1 - a * 0.75), filter: `blur(${Math.min(8, a * 6)}px)` }}>{w}</div>; })}
            <div style={{ position: "absolute", left: 0, width: W, top: CY + 190, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", opacity: prog(s, T.roll2 + 1.2, T.roll2 + 1.8) }}>Powered by Avant Intelligence</div>
          </div>
        )}
      </AbsoluteFill>
    );
  }

  // ================= S10 · the pile, three balls → one, the emblem =================
  let S10: React.ReactNode = null;
  if (s > T.end - 0.2) {
    const t0 = T.end;
    const blow = prog(s, t0 + 1.6, t0 + 2.3, E.in);
    const three = prog(s, t0 + 1.7, t0 + 2.2, E.out), conv = prog(s, t0 + 2.3, T.lock - 0.1, Easing.bezier(0.6, 0, 0.3, 1));
    const cols: BC[] = [B_SITE, B_ADS, B_AGENT];
    const toE = prog(s, T.lock + 0.9, T.lock + 1.7, E.io), bars = prog(s, T.lock + 1.3, T.lock + 1.8, E.soft);
    const word = prog(s, T.lock + 1.9, T.lock + 2.7, E.out), lock = prog(s, T.lock + 2.4, T.lock + 2.8, E.soft);
    if (s < T.lock + 2.0) {
      if (conv < 1) cols.forEach((c, i) => {
        const a = (i * 2 * Math.PI) / 3 + (s - t0) * 2.2;
        const rr = lerp(330, 0, conv);
        balls.push({ x: CX + Math.cos(a) * rr * 1.25, y: CY - 120 + Math.sin(a) * rr * 0.75, r: 76 * three * (1 - 0.3 * conv), c: mixBC(c, CLOUD, conv), seed: 5 + i, tr: three });
      });
      const one = prog(s, T.lock - 0.35, T.lock + 0.2, E.io);
      if (one > 0) balls.push({ x: lerp(CX, EMB.x, toE), y: lerp(CY - 120, EMB.y, toE), r: lerp(lerp(60, 160, one), 70, toE), c: CLOUD, seed: 5.5, tr: 1 - prog(s, T.lock + 1.4, T.lock + 1.9, E.soft) });
      ballK = 60;
    }
    S10 = (
      <AbsoluteFill>
        {/* lovio's pile of hero cards */}
        {s < t0 + 2.4 && Array.from({ length: 8 }, (_, i) => {
          const a = t0 + 0.05 + i * 0.12, k = prog(s, a, a + 0.55, Easing.bezier(0.3, 0, 0.2, 1));
          const tx = (h(i, 1) - 0.5) * 900, ty = (h(i, 2) - 0.5) * 360 - 40, rot = (h(i, 3) - 0.5) * 26;
          const bx = Math.cos(i * 1.7) * 1400 * blow, by = Math.sin(i * 1.7) * 900 * blow;
          return k > 0 ? <div key={i} style={{ position: "absolute", left: CX - 260 + tx + bx, top: CY - 162 + lerp(-1100, ty, k) + by, transform: `rotate(${rot + blow * 40}deg)`, opacity: 1 - blow }}><Card src={cellSrc(i * 5 + 2)} w={520} hh={325} r={18} shadow="0 30px 80px rgba(0,0,0,.6)" /></div> : null;
        })}
        <Ink s={s} a={t0 + 0.7} b={t0 + 1.9} y={CY + 230} size={64}>Built from scratch. <span style={{ color: "rgba(255,255,255,.55)" }}>Every time.</span></Ink>
        {/* Websites · Ads · Agents labels under the three balls */}
        {three > 0 && conv < 0.9 && ["Websites", "Ads", "AI agents"].map((l, i) => { const a = (i * 2 * Math.PI) / 3 + (s - t0) * 2.2, rr = lerp(330, 0, conv); return <div key={i} style={{ position: "absolute", left: CX + Math.cos(a) * rr * 1.25 - 120, width: 240, top: CY - 120 + Math.sin(a) * rr * 0.75 + 92, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,.85)", opacity: three * (1 - prog(s, t0 + 2.6, t0 + 2.9)) }}>{l}</div>; })}
        {s > T.lock && <>
          <OrbitRing x={lerp(CX, EMB.x, toE)} y={lerp(CY - 120, EMB.y, toE)} r={lerp(200, 360, prog(s, T.lock, T.lock + 0.8, E.out)) * (1 - toE * 0.6)} tilt={72} spin={s * 30} k={prog(s, T.lock, T.lock + 0.8, E.io)} op={1 - bars} />
          <div style={{ opacity: 1 - lock }}><Emblem s={s} t0={T.lock + 1.25} scale={LS} x={LX0} y={LY0} /></div>
          <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX0, top: LY0, width: LW, height: 245 * LS, mixBlendMode: "screen", clipPath: `inset(0 ${(1 - Math.max(lock * 0.2, word)) * 80}% 0 0)`, opacity: Math.max(lock, word) }} />
          <div style={{ position: "absolute", left: 0, width: W, top: CY + 90, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 48, letterSpacing: "-0.015em", color: "rgba(246,241,248,.88)", opacity: prog(s, T.lock + 2.8, T.lock + 3.4), transform: `translateY(${(1 - prog(s, T.lock + 2.8, T.lock + 3.4)) * 20}px)` }}>Digital precision that builds reputation.</div>
          <div style={{ position: "absolute", left: 0, width: W, top: CY + 180, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(246,241,248,.62)", opacity: prog(s, T.lock + 3.4, T.lock + 3.9) }}>WhatsApp · 079 244 9607</div>
        </>}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", fontFamily: SANS }}>
      <SoftWorld time={s} a={before ? INK : tr.a} b={before ? INK : tr.b} mix={wMix} wipe={wipe} off={off} zoom={0.8} rot={cam ? (-cam.roll * Math.PI) / 180 * 0.5 : 0} />
      {S1}
      <SoftBalls time={s} balls={backBalls} k={ballK} glow={0.8} />
      {S4back}
      {WORLD}
      {S4}
      {S8}
      {S9}
      {S10}
      <SoftBalls time={s} balls={balls} k={ballK} glow={0.85} />
      {whiteFill > 0 && <AbsoluteFill style={{ background: "#FBFAFE", opacity: whiteFill }} />}
    </AbsoluteFill>
  );
};
