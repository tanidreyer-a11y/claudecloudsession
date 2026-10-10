// OBSIDIAN — "Colour worlds" · 30 s · 9:16 (owner storyboard 2026-10-10, placeholders for the hero sections)
//  A 0–2.2    a purple-white liquid ball runs down a line on black; the camera falls with it; it lands at the end
//  B 2.2–3.1  the camera dives into the ball → a white liquid world
//  C 3.1–4.6  a hero (black & white) under a frosted glass plane; the plane slides off (low angle → level)
//  D 4.6–5.8  pull back: a 3 × 3 grid of hero sections
//  E 5.8–8.4  the grid scrolls down past a blur of hundreds of hero sections → lands on 3 glass containers
//  F 8.4–11.2 lines come out of the right side (top + bottom curvy, middle straight) and join into one line;
//             a ball in each hero's colours rolls out along its line; they merge into ONE purple-white ball
//  G 11.2–20.8 the purple ball travels the line past 4 heroes; the background becomes each hero's world
//             (black & white → black & green → [360° loop] → forest → Obsidian black & purple)
//  H 20.8–22.6 the line runs around START A PROJECT on the real Obsidian hero; the camera zooms into the button
//  I 22.6–24.6 a thumb swipes the ball (the knob) across the button; the camera moves with the swipe, then whips
//  J 24.6–30  the ball → the two emblem bars → OBSIDIAN lockup, tagline, WhatsApp
// Liquid = WebGL (gl.tsx): domain-warped clouds for the worlds, metaballs for the balls (they merge like liquid).
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { E, prog, lerp, win, h, SANS, LABEL, OrbitRing } from "./Film2";
import { World, Balls, Ball, Pal } from "./gl";

export const FPS4 = 60;
export const DUR4 = 30;
const W = 1080, H = 1920, CX = 540, CY = 960;
const MONO = "RedHatMono, ui-monospace, monospace";

// ---------------------------------------------------------------- palettes (world: base, cloud, deep, accent, highlight)
const INK: Pal = ["#040306", "#140B1E", "#000000", "#4C1D95", "#2E1A44"];
const WHITE: Pal = ["#F5F2FA", "#E4D9F4", "#D8CCEE", "#F6CFE6", "#FFFFFF"];
const GRAPH: Pal = ["#0B0A0E", "#1C1823", "#050407", "#3A2C52", "#2E2838"];
const BW: Pal = ["#F2F2F4", "#CFCFD6", "#0B0B0D", "#9DC4FF", "#FFFFFF"];
const GREEN: Pal = ["#030605", "#0C2A1B", "#000000", "#16A34A", "#86EFAC"];
const FOREST: Pal = ["#E6EEE8", "#A6C1B1", "#1E4A35", "#5B8A70", "#FFFFFF"];
const OBS: Pal = ["#050307", "#1F0B2E", "#000000", "#9333EA", "#F0ABFC"];
type BC = [string, string, string];
const BRAND: BC = ["#FFFFFF", "#E879F9", "#7C3AED"];
const B_BW: BC = ["#FFFFFF", "#9CA3AF", "#0A0A0A"];
const B_GREEN: BC = ["#0A0F0C", "#22C55E", "#052E16"];
const B_FOREST: BC = ["#D1FAE5", "#4ADE80", "#14532D"];
const B_WHITE: BC = ["#FFFFFF", "#EDE4FA", "#F9D9EC"];
const hx = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixC = (a: string, b: string, k: number) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], Math.max(0, Math.min(1, k)))).toString(16).padStart(2, "0")).join(""); };
const mixBC = (a: BC, b: BC, k: number): BC => [mixC(a[0], b[0], k), mixC(a[1], b[1], k), mixC(a[2], b[2], k)];

// ---------------------------------------------------------------- timeline
const T = { dive: 2.2, white: 2.85, hero: 2.95, sheet: 3.75, pull: 4.6, scroll: 5.8, land: 8.4, lines: 8.4, emerge: 8.9, roll: 9.2, meet: 10.5, travel: 11.2, zoom: 20.8, thumb: 22.4, swipe: 22.8, swiped: 23.9, whip: 24.0, end: 24.3 };

// ---------------------------------------------------------------- world layout
const HW = 940, HHt = 588, COLX = [0, 1000, 2000], ROW = 648, NF = 22;
const YC = (3 + NF) * ROW + 300, CROW = 1000;
const CONT_Y = [YC, YC + CROW, YC + 2 * CROW];
const CMID = CONT_Y.map((y) => y + HHt / 2);
const GL = 24;                         // glass padding
const LX = HW + GL;                    // lines start (right side of the containers)
const J = { x: 1560, y: CMID[1] };     // where the lines join
const CAM_C = { x: 855, y: CMID[1] };  // camera when the scroll lands
const PX = 1900, TX = 660, TW = 1100, TH = 688, RL = 340;
const Y0 = J.y + 420, W1Y = CONT_Y[2] + HHt + 380, W2Y = W1Y + TH + 360, YL = W2Y + TH + 420, W3Y = YL + 520, W4Y = W3Y + TH + 380;
const KO = TW / 1400, OH = 612 * KO;
const BX = TX + 1023 * KO, BY = W4Y + 22 * KO, BWd = 239 * KO, BHt = 61 * KO, BYm = BY + BHt / 2, BCX = BX + BWd / 2;

// ---------------------------------------------------------------- paths
type Pt = [number, number];
type Seg = ["L", Pt, Pt] | ["C", Pt, Pt, Pt, Pt] | ["A", Pt, number, number, number];
type Path = { x: number[]; y: number[]; l: number[]; a: number[]; total: number; marks: number[] };
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
function build(segs: Seg[]): Path {
  const P: Pt[] = []; const marks: number[] = [];
  for (const s of segs) {
    marks.push(Math.max(0, P.length - 1));
    const n = s[0] === "A" ? 360 : 240;
    for (let i = P.length ? 1 : 0; i <= n; i++) {
      const t = i / n;
      P.push(s[0] === "L" ? [lerp(s[1][0], s[2][0], t), lerp(s[1][1], s[2][1], t)] : s[0] === "C" ? bez(s[1], s[2], s[3], s[4], t) : [s[1][0] + s[2] * Math.cos(lerp(s[3], s[4], t)), s[1][1] + s[2] * Math.sin(lerp(s[3], s[4], t))]);
    }
  }
  const x = P.map((p) => p[0]), y = P.map((p) => p[1]), l = [0], a: number[] = [];
  for (let i = 1; i < P.length; i++) l.push(l[i - 1] + Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]));
  let prev = 0;
  for (let i = 0; i < P.length; i++) {
    const j = Math.min(P.length - 1, i + 1), k = j === i ? i - 1 : i;
    let ang = Math.atan2(y[j] - y[k], x[j] - x[k]);
    if (i > 0) { while (ang - prev > Math.PI) ang -= 2 * Math.PI; while (ang - prev < -Math.PI) ang += 2 * Math.PI; }
    a.push(ang); prev = ang;
  }
  return { x, y, l, a, total: l[l.length - 1], marks: marks.map((m) => l[m]) };
}
const idx = (p: Path, u: number) => { let lo = 0, hi = p.l.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (p.l[m] <= u) lo = m; else hi = m; } return lo; };
const at = (p: Path, u: number) => {
  u = Math.max(0, Math.min(p.total, u)); const i = idx(p, u), j = Math.min(p.l.length - 1, i + 1);
  const k = p.l[j] > p.l[i] ? (u - p.l[i]) / (p.l[j] - p.l[i]) : 0;
  return { x: lerp(p.x[i], p.x[j], k), y: lerp(p.y[i], p.y[j], k), a: lerp(p.a[i], p.a[j], k) };
};
const dPath = (p: Path, u0: number, u1: number) => {
  u0 = Math.max(0, u0); u1 = Math.min(p.total, u1); if (u1 <= u0) return "";
  const i0 = idx(p, u0), i1 = idx(p, u1); const s = at(p, u0), e = at(p, u1);
  let d = `M ${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
  for (let i = i0 + 1; i <= i1; i += 2) d += ` L ${p.x[i].toFixed(1)} ${p.y[i].toFixed(1)}`;
  return d + ` L ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
};
const firstU = (p: Path, f: (x: number, y: number) => boolean) => { for (let i = 0; i < p.x.length; i++) if (f(p.x[i], p.y[i])) return p.l[i]; return p.total; };

const CLINES = [
  build([["C", [LX, CMID[0]], [LX + 420, CMID[0]], [J.x - 360, J.y], [J.x, J.y]]]),
  build([["L", [LX, CMID[1]], [J.x, J.y]]]),
  build([["C", [LX, CMID[2]], [LX + 420, CMID[2]], [J.x - 360, J.y], [J.x, J.y]]]),
];
const TRAVEL = build([
  ["C", [J.x, J.y], [1800, J.y], [PX, J.y + 150], [PX, Y0]],
  ["L", [PX, Y0], [PX, YL]],
  ["A", [PX + RL, YL], RL, Math.PI, -Math.PI],
  ["L", [PX, YL], [PX, BYm - 300]],
  ["C", [PX, BYm - 300], [PX, BYm - 40], [BX + BWd + 160, BYm], [BX + BWd, BYm]],
  ["L", [BX + BWd, BYm], [BX + BHt / 2, BYm]],
]);
const [U_S1, U_S2, U_LOOP0, U_LOOP1, U_S5, U_PILL] = TRAVEL.marks;
const U_END = TRAVEL.total;
const U_W1 = firstU(TRAVEL, (_, y) => y >= W1Y - 60);
const U_W2 = firstU(TRAVEL, (_, y) => y >= W2Y - 60);
const U_W3 = firstU(TRAVEL, (_, y) => y >= W3Y - 60);
const U_W4 = firstU(TRAVEL, (_, y) => y >= W4Y - 60);
void U_S1; void U_S2;

// monotone cubic (Fritsch–Carlson) — the ball's distance along the line over time; it starts and stops at rest
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
const uOf = mono([T.travel, 12.5, 14.3, 15.45, 16.95, 19.4, 20.2, T.zoom], [0, U_W1, U_W2, U_LOOP0, U_LOOP1, U_S5, U_PILL, U_END]);
const tOf = (u: number) => { let a = T.travel, b = T.zoom; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (uOf(m) < u) a = m; else b = m; } return (a + b) / 2; };
export const TW1 = tOf(U_W1), TW2 = tOf(U_W2), TW3 = tOf(U_W3), TW4 = tOf(U_W4);

// ---------------------------------------------------------------- camera (2.5D): world → screen
type Cam = { x: number; y: number; s: number; roll: number; tilt: number };
const PERSP = 2400;
const camCss = (c: Cam) => `translate(${CX}px, ${CY}px) perspective(${PERSP}px) rotateX(${c.tilt}deg) rotate(${c.roll}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;
const project = (c: Cam, wx: number, wy: number) => {
  const x = (wx - c.x) * c.s, y = (wy - c.y) * c.s, r = (c.roll * Math.PI) / 180, t = (c.tilt * Math.PI) / 180;
  const xr = x * Math.cos(r) - y * Math.sin(r), yr = x * Math.sin(r) + y * Math.cos(r);
  const z = yr * Math.sin(t), f = PERSP / (PERSP - z);
  return { x: CX + xr * f, y: CY + yr * Math.cos(t) * f, k: c.s * f };
};
const ballAt = (s: number) => at(TRAVEL, uOf(s));
const smooth = (s: number, fn: (t: number) => number, span = 0.3, n = 8) => { let a = 0, w = 0; for (let i = 0; i < n; i++) { const wi = 1 - i / n; a += fn(s - (span * i) / n) * wi; w += wi; } return a / w; };
const loopRoll = (s: number) => { const u = Math.max(U_LOOP0, Math.min(U_LOOP1, uOf(s))); return ((Math.PI / 2 - at(TRAVEL, u).a) * 180) / Math.PI; };
const scrollY = (s: number) => lerp(942, CAM_C.y, prog(s, T.scroll, T.land, Easing.bezier(0.55, 0, 0.12, 1)));

function camAt(s: number): Cam {
  if (s < T.scroll) {
    const a = prog(s, T.hero, T.hero + 1.0, E.out), pb = prog(s, T.pull, T.scroll, E.io);
    return { x: 1470, y: 942, s: lerp(lerp(1.32, 1.0, a), 0.355, pb), roll: lerp(3, 0, a), tilt: lerp(lerp(16, 3, a), 22, pb) };
  }
  const settle = prog(s, T.land - 1.3, T.land, E.io);
  const E_: Cam = { x: lerp(1470, CAM_C.x, settle), y: scrollY(s), s: lerp(0.355, 0.6, settle), roll: 0, tilt: lerp(22, 0, settle) };
  if (s < T.land) return E_;
  const f = prog(s, T.land, T.travel + 0.4, E.io);
  const F_: Cam = { x: CAM_C.x + 110 * f, y: CAM_C.y, s: lerp(0.6, 0.64, f), roll: -1.6 * Math.sin(Math.PI * f), tilt: 0 };
  if (s < T.travel) return F_;
  // G: follow the ball
  const bx = smooth(s, (t) => ballAt(t).x), by = smooth(s, (t) => ballAt(t).y);
  const roll = smooth(s, loopRoll, 0.28);
  const inLoop = prog(s, 15.0, 15.5, E.io) * (1 - prog(s, 16.8, 17.5, E.io));
  const toBtn = prog(s, 19.3, 20.5, E.io);
  const lead = 210 * (1 - inLoop) * (1 - toBtn);
  const ang = smooth(s, (t) => ballAt(t).a, 0.3);
  let gx = lerp(1335, bx + Math.cos(ang) * lead, inLoop), gy = lerp(by + lead, by + Math.sin(ang) * lead, inLoop);
  gx = lerp(gx, BCX, toBtn); gy = lerp(gy, BYm + 150 * (1 - prog(s, 20.2, T.zoom + 1.2, E.io)), toBtn);
  let gs = lerp(0.74, 0.6, inLoop);
  gs = lerp(gs, 1.0, toBtn);
  const tilt = 9 * Math.sin(Math.PI * prog(s, 12.0, 15.2)) - 10 * Math.sin(Math.PI * prog(s, 16.9, 19.6));
  const G_: Cam = { x: gx, y: gy, s: gs, roll, tilt: tilt * (1 - toBtn) };
  const bG = prog(s, T.travel, T.travel + 1.1, E.io);
  let c: Cam = { x: lerp(F_.x, G_.x, bG), y: lerp(F_.y, G_.y, bG), s: lerp(F_.s, G_.s, bG), roll: lerp(F_.roll, G_.roll, bG), tilt: lerp(F_.tilt, G_.tilt, bG) };
  if (s < T.zoom) return c;
  // H zoom into the button, I swipe (the camera moves with the thumb), whip
  const z = prog(s, T.zoom, T.zoom + 1.5, E.io);
  const kn = knobK(s);
  const whip = prog(s, T.whip, T.whip + 0.8, E.in);
  c = { ...c, x: lerp(c.x, BCX, z) + (knobX(s) - knobX(0)) * 0.6 + whip * 2600, y: lerp(c.y, BYm, z), s: lerp(1.0, 4.4, z) + 0.4 * kn + whip * 1.6, roll: c.roll - 3 * Math.sin(Math.PI * kn) + whip * 7, tilt: 0 };
  return c;
}
const knobK = (s: number) => prog(s, T.swipe, T.swiped, Easing.bezier(0.5, 0, 0.18, 1));
const knobX = (s: number) => lerp(BX + BHt / 2, BX + BWd - BHt / 2, knobK(s));

// ---------------------------------------------------------------- background worlds (ink-wipes from the ball)
type Tr = { t: number; d: number; a: Pal; b: Pal; wipe: boolean };
const TRS: Tr[] = [
  { t: 2.75, d: 0.25, a: INK, b: WHITE, wipe: false },
  { t: 6.3, d: 1.5, a: WHITE, b: GRAPH, wipe: false },
  { t: TW1, d: 1.0, a: GRAPH, b: BW, wipe: true },
  { t: TW2, d: 1.0, a: BW, b: GREEN, wipe: true },
  { t: TW3, d: 1.0, a: GREEN, b: FOREST, wipe: true },
  { t: TW4, d: 1.0, a: FOREST, b: OBS, wipe: true },
  { t: 24.15, d: 0.6, a: OBS, b: INK, wipe: false },
];
const ballCol = (s: number): { c: BC; core: number; tr: number } => {
  const k1 = prog(s, TW1, TW1 + 0.7), k2 = prog(s, TW2, TW2 + 0.7), k3 = prog(s, TW3, TW3 + 0.7), k4 = prog(s, TW4, TW4 + 0.7);
  let c = mixBC(BRAND, B_BW, k1); c = mixBC(c, B_GREEN, k2); c = mixBC(c, B_FOREST, k3); c = mixBC(c, BRAND, k4);
  const core = 0.8 * Math.max(k1 * (1 - k4), 0), tr = 0.72 * k3 * (1 - k4);
  return { c, core, tr };
};

// ---------------------------------------------------------------- hero placeholders
type Th = { bg: string; ink: string; mute: string; acc: string; accInk: string; img: string; dark: boolean };
const TH_: Record<string, Th> = {
  bw: { bg: "#FFFFFF", ink: "#0A0A0A", mute: "#DCDCE0", acc: "#0A0A0A", accInk: "#FFFFFF", img: "radial-gradient(circle at 72% 30%, rgba(96,165,250,.42), rgba(96,165,250,0) 55%), linear-gradient(135deg, #F0F0F2, #D4D4D9)", dark: false },
  green: { bg: "#050806", ink: "#EEF4F0", mute: "#212B25", acc: "#22C55E", accInk: "#03140A", img: "radial-gradient(circle at 62% 42%, rgba(34,197,94,.5), rgba(34,197,94,0) 62%), linear-gradient(135deg, #0D1611, #060A08)", dark: true },
  forest: { bg: "#EEF3EE", ink: "#143323", mute: "#C9D8CD", acc: "#2F6B4F", accInk: "#EEF3EE", img: "linear-gradient(180deg, #E3ECE5 0%, #A7C2B2 42%, #4E7D63 72%, #1E4A35 100%)", dark: false },
};
const GEN: Th[] = [
  { bg: "#F5F2EC", ink: "#1C1A17", mute: "#DED8CC", acc: "#B45309", accInk: "#FFF", img: "linear-gradient(135deg,#E7DFD0,#C9BCA3)", dark: false },
  { bg: "#0E1116", ink: "#E6EAF0", mute: "#252B35", acc: "#3B82F6", accInk: "#FFF", img: "linear-gradient(135deg,#1C2433,#0F141C)", dark: true },
  { bg: "#FFFFFF", ink: "#111111", mute: "#E4E4E7", acc: "#E11D48", accInk: "#FFF", img: "linear-gradient(135deg,#F4F4F5,#DCDCE0)", dark: false },
  { bg: "#141014", ink: "#F5EFF5", mute: "#2C232C", acc: "#E879F9", accInk: "#1A0A1E", img: "linear-gradient(135deg,#2C1B30,#140D16)", dark: true },
  { bg: "#EEF2F7", ink: "#0F172A", mute: "#D5DDE8", acc: "#0EA5E9", accInk: "#FFF", img: "linear-gradient(135deg,#DCE6F2,#BDCDE3)", dark: false },
  { bg: "#1A1612", ink: "#F3E9DC", mute: "#352D25", acc: "#D4A373", accInk: "#1A1612", img: "linear-gradient(135deg,#3A2E22,#1E1913)", dark: true },
  { bg: "#F7F7F2", ink: "#1F2A1F", mute: "#DCE3D6", acc: "#65A30D", accInk: "#FFF", img: "linear-gradient(135deg,#E3EBD9,#C5D3B4)", dark: false },
  { bg: "#0A0A0A", ink: "#FAFAFA", mute: "#262626", acc: "#F97316", accInk: "#0A0A0A", img: "linear-gradient(135deg,#202020,#0E0E0E)", dark: true },
];
const box = (l: number, t: number, w: number, hh: number, bg: string, r: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: l, top: t, width: w, height: hh, background: bg, borderRadius: r, ...extra });
const Hero: React.FC<{ th: Th; w?: number; layout?: number; label?: string; shadow?: boolean }> = ({ th, w = HW, layout = 0, label, shadow = true }) => {
  const u = w / 100, hh = w * 0.625;
  const mute = th.mute, ink = th.ink;
  const nav = (
    <>
      <div style={box(5 * u, 3.4 * u, 9 * u, 2.1 * u, ink, 0.5 * u)} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={box(38 * u + i * 9 * u, 4.0 * u, 6 * u, 1.0 * u, ink, 0.5 * u, { opacity: 0.32 })} />)}
      <div style={box(83 * u, 2.9 * u, 12 * u, 3.2 * u, th.acc, 1.6 * u)} />
    </>
  );
  let body: React.ReactNode;
  if (layout === 1) {
    body = (
      <>
        <div style={box(43 * u, 14 * u, 14 * u, 1.3 * u, th.acc, 0.65 * u)} />
        <div style={box(22 * u, 18 * u, 56 * u, 4.6 * u, ink, 0.8 * u)} />
        <div style={box(28 * u, 24.4 * u, 44 * u, 4.6 * u, ink, 0.8 * u)} />
        <div style={box(32 * u, 31.6 * u, 36 * u, 1.2 * u, mute, 0.6 * u)} />
        <div style={box(37 * u, 34.2 * u, 26 * u, 1.2 * u, mute, 0.6 * u)} />
        <div style={box(36 * u, 38.4 * u, 13 * u, 3.8 * u, th.acc, 1.9 * u)} />
        <div style={box(51 * u, 38.4 * u, 13 * u, 3.8 * u, "transparent", 1.9 * u, { border: `${0.18 * u}px solid ${ink}`, opacity: 0.5 })} />
        <div style={box(8 * u, 46 * u, 84 * u, 16.5 * u, th.img, 1.6 * u)} />
      </>
    );
  } else if (layout === 2) {
    body = (
      <>
        <div style={box(0, 0, w, hh, th.img, 0)} />
        <div style={box(0, 0, w, hh, `linear-gradient(90deg, ${th.dark ? "rgba(0,0,0,.72)" : "rgba(0,0,0,.55)"}, rgba(0,0,0,0) 70%)`, 0)} />
        <div style={box(6 * u, 30 * u, 42 * u, 4.6 * u, "#FFFFFF", 0.8 * u)} />
        <div style={box(6 * u, 36.4 * u, 30 * u, 4.6 * u, "#FFFFFF", 0.8 * u)} />
        <div style={box(6 * u, 43.6 * u, 28 * u, 1.2 * u, "rgba(255,255,255,.45)", 0.6 * u)} />
        <div style={box(6 * u, 48 * u, 13 * u, 3.8 * u, th.acc, 1.9 * u)} />
      </>
    );
  } else {
    body = (
      <>
        <div style={box(6 * u, 16 * u, 12 * u, 1.3 * u, th.acc, 0.65 * u)} />
        <div style={box(6 * u, 20 * u, 38 * u, 4.4 * u, ink, 0.8 * u)} />
        <div style={box(6 * u, 26 * u, 33 * u, 4.4 * u, ink, 0.8 * u)} />
        <div style={box(6 * u, 32 * u, 22 * u, 4.4 * u, ink, 0.8 * u)} />
        <div style={box(6 * u, 39.6 * u, 30 * u, 1.2 * u, mute, 0.6 * u)} />
        <div style={box(6 * u, 42.2 * u, 24 * u, 1.2 * u, mute, 0.6 * u)} />
        <div style={box(6 * u, 47.2 * u, 13 * u, 4 * u, th.acc, 2 * u)} />
        <div style={box(21 * u, 47.2 * u, 11 * u, 4 * u, "transparent", 2 * u, { border: `${0.18 * u}px solid ${ink}`, opacity: 0.5 })} />
        <div style={box(52 * u, 12 * u, 43 * u, 45 * u, th.img, 1.6 * u)} />
      </>
    );
  }
  return (
    <div style={{ position: "relative", width: w, height: hh, borderRadius: 1.8 * u, overflow: "hidden", background: th.bg, boxShadow: shadow ? `0 ${3 * u}px ${8 * u}px rgba(0,0,0,${th.dark ? 0.45 : 0.22})` : undefined }}>
      {layout !== 2 && nav}
      {body}
      {layout === 2 && <div style={{ position: "absolute", inset: 0 }}>{nav}</div>}
      {label && <div style={{ position: "absolute", right: 6 * u, bottom: 4 * u, fontFamily: MONO, fontWeight: 500, fontSize: 1.25 * u, letterSpacing: "0.2em", color: th.dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.38)" }}>{label}</div>}
    </div>
  );
};
// YOUR REAL HERO SECTIONS: drop a 16:10 PNG/JPG (e.g. 2200×1375) into public/heroes/ and put its file name here —
// it replaces that placeholder everywhere (grid centre, the glass container and the travel line). null = placeholder.
const HERO_IMG: Record<string, string | null> = { "01": null, "02": null, "03": null };
const Slot: React.FC<{ id: "01" | "02" | "03"; th: Th; w?: number; layout?: number; shadow?: boolean }> = ({ id, th, w = HW, layout = 0, shadow = true }) => {
  const f = HERO_IMG[id];
  if (!f) return <Hero th={th} w={w} layout={layout} label={`HERO ${id}`} shadow={shadow} />;
  return <div style={{ width: w, height: w * 0.625, borderRadius: w * 0.018, overflow: "hidden", boxShadow: shadow ? `0 ${w * 0.03}px ${w * 0.08}px rgba(0,0,0,.3)` : undefined }}><Img src={staticFile("heroes/" + f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
};
const gen = (seed: number) => GEN[Math.floor(h(seed, 1) * GEN.length) % GEN.length];
const lay = (seed: number) => Math.floor(h(seed, 2) * 3) % 3;

// glass container
const Glass: React.FC<{ children: React.ReactNode; w?: number }> = ({ children, w = HW }) => (
  <div style={{ position: "absolute", left: -GL, top: -GL, width: w + GL * 2, height: w * 0.625 + GL * 2, borderRadius: 34, background: "linear-gradient(140deg, rgba(255,255,255,.16), rgba(255,255,255,.05))", border: "2px solid rgba(255,255,255,.28)", boxShadow: "0 40px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.35)", backdropFilter: "blur(18px)" }}>
    <div style={{ position: "absolute", left: GL, top: GL }}>{children}</div>
  </div>
);

// the emblem as two bars (owner's final logo geometry)
const BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]];
const Emblem: React.FC<{ s: number; t0: number; scale: number; x: number; y: number }> = ({ s, t0, scale, x, y }) => (
  <svg width={200 * scale} height={245 * scale} viewBox="0 0 200 245" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <defs>
      <linearGradient id="bar4" x1="171" y1="21" x2="40" y2="215" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#D9CCFF" /><stop offset="0.75" stopColor="#8B6CF0" /><stop offset="1" stopColor="#5B3FC4" />
      </linearGradient>
    </defs>
    {BARS.map((b, i) => {
      const k = prog(s, t0 + i * 0.14, t0 + i * 0.14 + 0.7, E.out);
      return <polygon key={i} points={b.map((p) => p.join(",")).join(" ")} fill="url(#bar4)" style={{ transform: `translate(${(1 - k) * 160}px, ${-(1 - k) * 220}px)`, opacity: k }} />;
    })}
  </svg>
);

// ---------------------------------------------------------------- film
export const Film4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const cam = camAt(s);
  const camPrev = camAt(s - 1 / 60);
  const P = (x: number, y: number) => project(cam, x, y);
  const balls: Ball[] = [];
  let ballOp = 1, ballK = 40;

  // ---- background world
  let tr = TRS[0];
  for (const t of TRS) if (s >= t.t) tr = t;
  const trK = s < TRS[0].t ? 0 : prog(s, tr.t, tr.t + tr.d, E.soft);
  let wipe: [number, number, number] = [0, 0, 0];
  if (tr.wipe && trK < 1) { const b = ballAt(tr.t); const pp = project(camAt(tr.t), b.x, b.y); wipe = [pp.x, pp.y, Math.max(1, trK * 2600)]; }
  const palA = s < TRS[0].t ? INK : tr.a, palB = s < TRS[0].t ? INK : tr.b;
  const dripFall = 3000 * prog(s, 0.2, 2.0, E.io);
  const camOff: [number, number] = s < T.hero ? [0, -dripFall * 0.00028] : [cam.x * 0.0001, -cam.y * 0.0001 - 0.84];

  // ---- A drip (screen space)
  const R0 = 95;
  const nodeY = lerp(2500, 1220, prog(s, 1.1, 2.0, E.out));
  const by = s < 0.9 ? lerp(-150, 800, prog(s, 0, 0.9, E.out)) : s < 1.35 ? 800 + (s - 0.9) * 50 : lerp(822, 1220 - R0, prog(s, 1.35, 2.0, E.io));
  const wob = 1 + 0.07 * Math.sin(Math.max(0, s - 2.0) * 26) * Math.exp(-Math.max(0, s - 2.0) * 5) * (s > 2.0 ? 1 : 0);
  const dive = prog(s, T.dive, 3.05, Easing.bezier(0.7, 0, 0.9, 0.55));
  if (s < 3.25) {
    const tail = 1 - prog(s, 1.75, 2.1);
    const col = mixBC(BRAND, B_WHITE, prog(s, 2.55, 2.95));
    const r = lerp(R0 * wob, 2900, dive), y = lerp(by, CY, dive);
    balls.push({ x: CX, y, r, c: col, seed: 0.2 });
    if (tail > 0 && dive < 0.2) {
      balls.push({ x: CX, y: by - 74, r: 34 * tail, c: col, seed: 0.5 });
      balls.push({ x: CX, y: by - 128, r: 19 * tail, c: col, seed: 0.8 });
    }
    [[0.95, 15], [1.45, 11], [0.55, 9]].forEach(([t0, rr], i) => {
      if (s > t0 && dive < 0.1) { const yy = by + R0 * 0.82 + Math.pow(s - t0, 2) * 1700 + (s - t0) * 120; if (yy < Math.min(nodeY - 6, 2050)) balls.push({ x: CX, y: yy, r: rr, c: col, seed: 1 + i }); }
    });
    ballOp = 1 - prog(s, 2.98, 3.22);
    ballK = 46;
  }

  // ---- F container balls → merge
  const cMergeK = prog(s, T.meet - 0.1, T.meet + 0.5, E.io);
  if (s >= T.emerge && s < T.travel + 0.05) {
    const grow = prog(s, T.emerge, T.emerge + 0.45, E.back);
    const rk = prog(s, T.roll, T.meet, E.io);
    const cols: BC[] = [B_BW, B_GREEN, B_FOREST];
    CLINES.forEach((L, i) => {
      const p = at(L, L.total * rk), pp = P(p.x, p.y);
      const c = mixBC(cols[i], BRAND, cMergeK);
      balls.push({ x: pp.x, y: pp.y, r: 84 * grow * pp.k * (1 - 0.25 * cMergeK), c, tr: i === 2 ? 0.7 * (1 - cMergeK) : 0, seed: 2 + i });
    });
    if (cMergeK > 0) { const pp = P(J.x, J.y); balls.push({ x: pp.x, y: pp.y, r: lerp(0, 108, cMergeK) * pp.k, c: BRAND, seed: 2.6 }); }
    ballK = 60 * cam.s;
  }
  // ---- G travel ball, H knob
  if (s >= T.travel && s < T.end + 1.5) {
    const u = uOf(s), b = at(TRAVEL, u);
    const { c, core, tr: trp } = ballCol(s);
    const shrink = prog(u, U_S5 + 150, U_END, E.io);
    let wx = b.x, wy = b.y;
    if (s >= T.swipe) { wx = knobX(s); wy = BYm; }
    const pp = P(wx, wy);
    let x = pp.x, y = pp.y, r = lerp(108, BHt * 0.36, shrink) * pp.k;
    // after the swipe: the knob leaves the button for the centre, grows → the emblem
    const go = prog(s, T.swiped + 0.05, T.end + 0.6, E.io);
    if (go > 0) {
      const k1 = prog(s, T.end + 0.6, T.end + 1.7, E.out);
      const LW = 940, LS = LW / 1030, LX0 = CX - LW / 2, LY0 = CY - 200;
      const ex = LX0 + 96 * LS, ey = LY0 + 121 * LS;
      const toE = prog(s, T.end + 1.5, T.end + 2.3, E.io);
      x = lerp(lerp(x, CX, go), ex, toE); y = lerp(lerp(y, CY - 150, go), ey, toE);
      r = lerp(lerp(r, 120, go), 150, k1); r = lerp(r, 60, toE);
      ballOp = 1 - prog(s, T.end + 1.9, T.end + 2.4, E.soft);
    }
    balls.push({ x, y, r, c, core, tr: trp, seed: 3.3 });
    ballK = 40;
  }

  // ---- E scroll blur (local vertical, world units)
  const vel = Math.abs(cam.y - camPrev.y);
  const blurY = s > T.scroll && s < T.land ? Math.min(70, vel * 0.42) : 0;

  const vis = (wx: number, wy: number, rad: number) => { const d = Math.hypot(wx - cam.x, wy - cam.y) * cam.s; return d - rad * cam.s < 1500; };
  const worldOp = s < T.hero ? 0 : prog(s, T.hero, T.hero + 0.3) * (1 - prog(s, T.whip + 0.15, T.whip + 0.55));

  // ---- lines
  const lineK = prog(s, T.lines, T.lines + 0.7, E.io);
  const travelHead = s < T.travel ? 0 : Math.min(U_END, uOf(s) + 1400 * prog(s, T.travel - 0.4, T.travel + 0.4));
  const lineFade = 1 - prog(s, T.zoom - 0.2, T.zoom + 0.6);
  const stroke = (d: string, key: string, op = 1, wid = 3) => (
    <g key={key} opacity={op}>
      <path d={d} stroke="rgba(0,0,0,.35)" strokeWidth={wid * 2.6} fill="none" strokeLinecap="round" />
      <path d={d} stroke="rgba(255,255,255,.88)" strokeWidth={wid} fill="none" strokeLinecap="round" />
    </g>
  );
  const trailCols: string[] = [B_BW[1], B_GREEN[1], B_FOREST[1]];

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", fontFamily: SANS }}>
      <World time={s} a={palA} b={palB} mix={tr.wipe ? (trK >= 1 ? 1 : 0) : trK} wipe={wipe} off={camOff} zoom={1.25} rot={(-cam.roll * Math.PI) / 180 * 0.6} />
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="vb" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${blurY.toFixed(1)}`} /></filter>
        <filter id="glo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      </svg>

      {/* ===== A · the line the drop runs down (screen space) ===== */}
      {s < 2.8 && (
        <AbsoluteFill style={{ opacity: 1 - prog(s, 2.25, 2.7) }}>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E879F9" stopOpacity="0" /><stop offset="1" stopColor="#F0ABFC" stopOpacity="0.9" /></linearGradient>
            </defs>
            <line x1={CX} y1={-40} x2={CX} y2={nodeY} stroke="rgba(255,255,255,.55)" strokeWidth={2} />
            <line x1={CX} y1={Math.max(-40, by - 900)} x2={CX} y2={by} stroke="url(#coat)" strokeWidth={6} strokeLinecap="round" />
            {Array.from({ length: 18 }, (_, i) => { const y = (((i * 130 - dripFall) % 2340) + 2340) % 2340 - 210; return y < nodeY - 10 ? <line key={i} x1={CX - 9} x2={CX + 9} y1={y} y2={y} stroke="rgba(255,255,255,.35)" strokeWidth={2} /> : null; })}
            <circle cx={CX} cy={nodeY} r={9} fill="none" stroke="rgba(255,255,255,.8)" strokeWidth={2.5} />
            {s > 2.0 && <circle cx={CX} cy={1220} r={lerp(20, 260, prog(s, 2.0, 2.7, E.out))} fill="none" stroke="rgba(240,171,252,.6)" strokeWidth={2} opacity={1 - prog(s, 2.0, 2.7)} />}
          </svg>
          {Array.from({ length: 46 }, (_, i) => {
            const d = 0.3 + h(i, 1) * 0.9, y = ((h(i, 2) * 2300 - dripFall * d) % 2300 + 2300) % 2300 - 190;
            return <div key={i} style={{ position: "absolute", left: h(i, 3) * W, top: y, width: 2 + d * 3, height: 2 + d * 3 + Math.min(36, Math.abs(dripFall - 3000 * prog(s - 1 / 60, 0.2, 2.0, E.io)) * d * 0.5), borderRadius: 4, background: "rgba(240,171,252,.55)", opacity: 0.15 + d * 0.3 }} />;
          })}
        </AbsoluteFill>
      )}

      {/* ===== the world (C → H) ===== */}
      {worldOp > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: camCss(cam), opacity: worldOp }}>
          {/* 3 × 3 grid + the feed of hundreds of heroes */}
          {s < T.land + 0.6 && Array.from({ length: 3 + NF }, (_, r) => {
            const cols = r < 3 ? [0, 1, 2] : [-1, 0, 1, 2, 3];
            const feedOut = r >= 3 ? 1 - prog(s, T.land - 0.4, T.land + 0.3) : 1 - prog(s, T.scroll + 1.0, T.scroll + 1.6);
            return cols.map((c) => {
              const x = c < 0 ? -1000 : c > 2 ? 3000 : COLX[c], y = r * ROW;
              if (!vis(x + HW / 2, y + HHt / 2, 600)) return null;
              const centre = r === 1 && c === 1;
              const seed = r * 7 + c * 3 + 11;
              const op = (c < 0 || c > 2 ? 0.7 : 1) * (centre && s < T.scroll + 0.5 ? 1 : feedOut);
              return (
                <div key={`${r}_${c}`} style={{ position: "absolute", left: x, top: y, opacity: op, filter: blurY > 0.6 ? "url(#vb)" : undefined }}>
                  {centre ? <Slot id="01" th={TH_.bw} /> : <Hero th={gen(seed)} layout={lay(seed)} />}
                </div>
              );
            });
          })}
          {/* the frosted glass plane over the first hero; it slides off */}
          {s < T.sheet + 1.0 && (() => {
            const k = prog(s, T.sheet, T.sheet + 0.75, Easing.bezier(0.55, 0, 0.25, 1));
            const shine = prog(s, T.hero + 0.2, T.sheet + 0.1, E.io);
            return (
              <div style={{ position: "absolute", left: 1000 - 40, top: ROW - 40, width: HW + 80, height: HHt + 80, borderRadius: 40, overflow: "hidden", transform: `translate(${k * 1150}px, ${-k * 950}px) rotate(${k * 22}deg)`, opacity: 1 - prog(s, T.sheet + 0.5, T.sheet + 0.8), background: "linear-gradient(135deg, rgba(255,255,255,.62), rgba(233,213,255,.42) 45%, rgba(251,207,232,.5))", border: "2px solid rgba(255,255,255,.85)", boxShadow: "0 40px 100px rgba(80,40,120,.22)", backdropFilter: "blur(26px) saturate(1.2)" }}>
                <div style={{ position: "absolute", top: -200, bottom: -200, width: 220, left: lerp(-400, 1300, shine), transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0))" }} />
              </div>
            );
          })()}

          {/* the 3 glass containers (the end of the feed) */}
          {s > T.scroll + 1.2 && s < T.zoom && CONT_Y.map((y, i) => {
            if (!vis(HW / 2, y + HHt / 2, 700)) return null;
            const th = [TH_.bw, TH_.green, TH_.forest][i];
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: 0, top: y }}><Glass><Slot id={(["01", "02", "03"] as const)[i]} th={th} layout={i === 1 ? 1 : 0} shadow={false} /></Glass></div>
                {[1, 2].map((c) => {
                  const out = prog(s, T.land - 0.55, T.land + 0.1, E.in);
                  if (out >= 1) return null;
                  const seed = 300 + i * 5 + c;
                  return <div key={c} style={{ position: "absolute", left: COLX[c] + out * 1400, top: y, opacity: 1 - out, filter: blurY > 0.6 ? "url(#vb)" : undefined }}><Hero th={gen(seed)} layout={lay(seed)} /></div>;
                })}
              </React.Fragment>
            );
          })}

          {/* lines: the three join into one; then the line the ball travels */}
          {s > T.lines && s < T.zoom + 1 && (
            <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              {CLINES.map((L, i) => stroke(dPath(L, 0, L.total * lineK), `c${i}`, lineFade, 3.2))}
              {/* wet trails in each ball's colour */}
              {s > T.roll && s < T.travel + 1 && CLINES.map((L, i) => <path key={`t${i}`} d={dPath(L, 0, L.total * prog(s, T.roll, T.meet, E.io))} stroke={mixC(trailCols[i], BRAND[1], cMergeK)} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.75 * (1 - prog(s, T.travel, T.travel + 1))} />)}
              {s > T.travel - 0.4 && stroke(dPath(TRAVEL, 0, travelHead), "tr", lineFade, 3.2)}
              {s > T.travel && (() => { const u = uOf(s); const c = ballCol(s).c[1]; return [0, 1, 2, 3, 4].map((i) => <path key={`w${i}`} d={dPath(TRAVEL, u - 260 * (i + 1), u - 260 * i)} stroke={c} strokeWidth={12 - i * 2} strokeLinecap="round" fill="none" opacity={(0.8 - i * 0.15) * lineFade} />); })()}
              {/* the pulse where the three merge */}
              {s > T.meet && s < T.meet + 1 && <circle cx={J.x} cy={J.y} r={lerp(60, 420, prog(s, T.meet, T.meet + 0.9, E.out))} stroke="rgba(255,255,255,.7)" strokeWidth={4} fill="none" opacity={1 - prog(s, T.meet, T.meet + 0.9)} />}
            </svg>
          )}

          {/* the four worlds' heroes along the line */}
          {s > T.travel - 0.5 && [
            { y: W1Y, el: <Slot id="01" th={TH_.bw} w={TW} /> },
            { y: W2Y, el: <Slot id="02" th={TH_.green} w={TW} layout={1} /> },
            { y: W3Y, el: <Slot id="03" th={TH_.forest} w={TW} /> },
          ].map((o, i) => vis(TX + TW / 2, o.y + TH / 2, 800) ? <div key={i} style={{ position: "absolute", left: TX, top: o.y }}>{o.el}</div> : null)}
          {/* the real Obsidian hero + its START A PROJECT button rebuilt in code */}
          {s > TW3 - 0.5 && (() => {
            const z = prog(s, T.zoom, T.zoom + 1.5, E.io);
            const drawK = prog(s, 20.15, 20.9, E.io);
            const run = Math.max(0, s - 20.6) * 0.62;
            const kn = knobK(s);
            const fillW = (knobX(s) - BX + BHt / 2);
            return (
              <div style={{ position: "absolute", left: TX, top: W4Y }}>
                <div style={{ position: "relative", width: TW, height: OH, borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.6), 0 0 120px rgba(147,51,234,.18)", filter: `blur(${z * 5}px) brightness(${1 - z * 0.35})` }}>
                  <Img src={staticFile("img/obsidian.jpg")} style={{ position: "absolute", left: 0, top: 0, width: TW, height: TW * 646 / 1400 }} />
                </div>
                <div style={{ position: "absolute", left: BX - TX, top: BY - W4Y, width: BWd, height: BHt }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: BHt / 2, background: "#060408", border: "1px solid rgba(255,255,255,.16)", boxShadow: `0 0 ${18 + 30 * z}px rgba(168,85,247,${0.35 + 0.3 * z})`, overflow: "hidden" }}>
                    {kn > 0 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: fillW, borderRadius: BHt / 2, background: "linear-gradient(90deg, rgba(124,58,237,.9), rgba(232,121,249,.95))", boxShadow: "0 0 18px rgba(232,121,249,.7)" }} />}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: BHt * 0.92 * prog(s, 20.15, 20.7, E.io) * (1 - prog(s, T.swiped, T.swiped + 0.3, E.io)), paddingRight: BHt * 0.12 * prog(s, 20.15, 20.7, E.io), fontFamily: MONO, fontWeight: 600, fontSize: BHt * lerp(0.29, 0.245, prog(s, 20.15, 20.7, E.io)), letterSpacing: "0.12em", whiteSpace: "nowrap", color: "#FFFFFF" }}>START A PROJECT</div>
                  </div>
                  <svg width={BWd} height={BHt} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <defs><linearGradient id="bl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7C3AED" /><stop offset="0.5" stopColor="#E879F9" /><stop offset="1" stopColor="#F0ABFC" /></linearGradient></defs>
                    <rect x={0.75} y={0.75} width={BWd - 1.5} height={BHt - 1.5} rx={(BHt - 1.5) / 2} fill="none" stroke="#A855F7" strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={-(1 - drawK)} opacity={0.75 * drawK} />
                    {drawK > 0.6 && [0, 1].map((g) => <rect key={g} x={0.75} y={0.75} width={BWd - 1.5} height={BHt - 1.5} rx={(BHt - 1.5) / 2} fill="none" stroke="url(#bl)" strokeWidth={g ? 2.4 : 6} pathLength={1} strokeDasharray="0.24 0.76" strokeDashoffset={-run} strokeLinecap="round" filter={g ? undefined : "url(#glo)"} opacity={prog(s, 20.6, 20.9) * (1 - prog(s, T.swiped, T.swiped + 0.3))} />)}
                  </svg>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===== the liquid (all balls) ===== */}
      {balls.length > 0 && <Balls time={s} balls={balls} k={ballK} op={ballOp} glow={0.85} />}

      {/* ===== I · the thumb ===== */}
      {s > T.thumb && s < T.whip + 0.3 && (() => {
        const kx = knobX(s), pp = P(kx, BYm);
        const inK = prog(s, T.thumb, T.thumb + 0.3, E.out), press = prog(s, T.thumb + 0.25, T.swipe, E.out), lift = prog(s, T.swiped - 0.05, T.whip + 0.2, E.out);
        const sc = lerp(1.35, 1, inK) * (1 - 0.1 * press * (1 - lift)) * (1 + 0.3 * lift);
        return <div style={{ position: "absolute", left: pp.x - 115 + 26, top: pp.y - 115 + 34, width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, rgba(255,255,255,.34), rgba(255,255,255,.1) 72%)", border: "3px solid rgba(255,255,255,.75)", boxShadow: "0 14px 50px rgba(0,0,0,.4), inset 0 0 30px rgba(255,255,255,.18)", transform: `scale(${sc})`, opacity: inK * (1 - lift) }} />;
      })()}

      {/* ===== J · the emblem and lockup ===== */}
      {s > T.end && (() => {
        const t = T.end;
        const k = prog(s, t + 0.6, t + 1.7, E.out);
        const LW = 940, LS = LW / 1030, LX0 = CX - LW / 2, LY0 = CY - 200;
        const ex = LX0 + 96 * LS, ey = LY0 + 121 * LS;
        const toE = prog(s, t + 1.5, t + 2.3, E.io), bars = prog(s, t + 1.9, t + 2.4, E.soft);
        const word = prog(s, t + 2.5, t + 3.3, E.out), lock = prog(s, t + 3.0, t + 3.4, E.soft);
        return (
          <>
            <OrbitRing x={lerp(CX, ex, toE)} y={lerp(CY - 150, ey, toE)} r={lerp(140, 320, k) * (1 - toE * 0.6)} tilt={72} spin={s * 30} k={k} op={k * (1 - bars)} />
            <div style={{ opacity: 1 - lock }}><Emblem s={s} t0={t + 1.85} scale={LS} x={LX0} y={LY0} /></div>
            <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX0, top: LY0, width: LW, height: 245 * LS, mixBlendMode: "screen", clipPath: `inset(0 ${(1 - Math.max(lock * 0.2, word)) * 80}% 0 0)`, opacity: Math.max(lock, word) }} />
            <div style={{ position: "absolute", left: 0, width: W, top: CY + 120, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 44, letterSpacing: "-0.015em", color: "rgba(246,241,248,.86)", opacity: prog(s, t + 3.4, t + 4.1), transform: `translateY(${(1 - prog(s, t + 3.4, t + 4.1)) * 20}px)` }}>Digital precision that builds reputation.</div>
            <div style={{ position: "absolute", left: 0, width: W, top: CY + 230, textAlign: "center", ...LABEL, fontSize: 24, opacity: prog(s, t + 4.2, t + 4.8) }}>WhatsApp · 079 244 9607</div>
          </>
        );
      })()}
      {/* quiet guard so nothing flashes at the cut points */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: win(s, 29.7, 29.95, 31, 32) * 0 }} />
    </AbsoluteFill>
  );
};
