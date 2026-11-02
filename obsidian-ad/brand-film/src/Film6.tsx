// OBSIDIAN — 40 s · 16:9 · monochrome (owner storyboard 2026-10-10, no purple; emblem black/white)
//  S1 0–2.5    a glass bar: "Years of reputation" typed; a circle button at its right end; click; the button turns 90°
//              (→ becomes ↓) and turns into the soft cloud ball
//  S2 2.5–6.1  the ball runs down a line past marks (Year 01 · First client … Year 20 · A reputation); lands
//  S3 6.1–6.9  the camera zooms into the ball → a white world
//  S4 6.9–11.4 a flat table of hero sections glides past; one stands out (the rest grey out); the camera zooms in and
//              that hero flips 90° upright to face us
//  S5 11.4–13  zoom out: a 3 × 3 grid
//  S6 13–17.9  lines out of the right column's three websites (ElevenLabs hairlines + nodes); balls in each site's
//              colours roll fast, the camera tight on the middle ball; they merge into one line and one ball
//  S7 17.9–26.5 the v1 travel: the ball runs down a line past heroes on reflective glass panes that nearly fill the
//              frame; each pane changes the world behind it (silver · ocean · 360° loop · fern)
//  S8 26.5–33  the last pane morphs onto the monitor in the owner's studio image; "BUILT FOR — Branding · Marketing ·
//              Ads"; the ball docks as the bullet
//  S9 33–40    push into the screen → black → the white emblem bars → OBSIDIAN (white) → tagline → WhatsApp
// Placeholder heroes: the owner's reference images (public/heroes2, not in git) — replace with Obsidian's own work.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { E, prog, lerp, win, h, SANS } from "./Film2";
import { SoftWorld, SoftBalls, Ball, Pal } from "./gl";

export const FPS6 = 60;
export const DUR6 = 40;
const W = 1920, H = 1080, CX = 960, CY = 540;
const MONO = "JBMono, ui-monospace, monospace";
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const hx = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mixC = (a: string, b: string, k: number) => { const A = hx(a), B = hx(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], cl01(k))).toString(16).padStart(2, "0")).join(""); };
type BC = [string, string, string];
const mixBC = (a: BC, b: BC, k: number): BC => [mixC(a[0], b[0], k), mixC(a[1], b[1], k), mixC(a[2], b[2], k)];
const typed = (str: string, s: number, a: number, b: number) => str.slice(0, Math.round(str.length * prog(s, a, b, (x: number) => x)));

const IMG = { monitor: "h01_monitor.jpg", aichat: "h02_aichat.jpg", solt: "h03_solt.jpg", orsbite: "h04_orsbite.jpg", amplify: "h05_amplify.jpg", silence: "h06_silence.jpg", mindful: "h07_mindful.jpg", teeblix: "h08_teeblix.jpg", fern: "h09_fern.jpg", irona: "h10_irona.jpg", villa: "h11_villa.jpg", aigreen: "h12_aigreen.jpg" };
type K = keyof typeof IMG;
const im = (k: K) => staticFile("heroes2/" + IMG[k]);
const FIELD_SET: K[] = ["orsbite", "silence", "villa", "irona", "aichat", "mindful", "teeblix", "amplify", "aigreen", "fern"];

// ---------------------------------------------------------------- palettes (monochrome + each hero's own world)
const INK: Pal = ["#060606", "#151515", "#0D0D0F", "#2E2E33", "#1F1F22"];
const WHITE: Pal = ["#F3F3F1", "#E7E7E4", "#ECECEA", "#D8D8D5", "#FFFFFF"];
const SILVER: Pal = ["#07080A", "#171A1F", "#0E1013", "#4C535E", "#9AA3AE"];
const OCEAN: Pal = ["#0B1724", "#1A3550", "#24506F", "#5E86A8", "#BCD3E6"];
const FERN: Pal = ["#06110A", "#0E2615", "#14351D", "#2D6438", "#78B184"];
const STUDIO: Pal = ["#9A9A9A", "#A2A2A2", "#949494", "#ACACAC", "#B8B8B8"];
const CLOUD: BC = ["#F2F3F5", "#AEB8C6", "#DCD3C8"];          // the ball: a pearl/silver cloud — one colour all film
const B_WHITE: BC = ["#FFFFFF", "#F1F1F1", "#E9E9E9"];
const B_VILLA: BC = ["#DCEAF6", "#5B8DB8", "#2B5577"], B_AIG: BC = ["#C9F5DD", "#34D399", "#065F46"], B_AMP: BC = ["#FFFFFF", "#9CA3AF", "#2A2A2A"];

// ---------------------------------------------------------------- timeline
const T = {
  bar: 0.1, type0: 0.4, type1: 1.4, click: 1.8, turn: 1.95, morph: 2.35, fall: 2.5, bottom: 5.85, dive: 6.05, white: 6.85,
  stand: 9.1, flip: 9.9, flipEnd: 11.4, gridEnd: 12.9, lines: 12.95, roll: 13.8, merge: 17.2, travel: 17.9,
  settle: 25.6, morphA: 26.5, morphB: 27.8, built: 28.4, push: 32.8, black: 33.9, lock: 34.3,
};

// ---------------------------------------------------------------- helpers
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
// projective map of a w×h box onto a quad (TL, TR, BR, BL) → CSS matrix3d + point mapper
type Q = [number, number][];
function homog(w: number, hh: number, q: Q) {
  const src = [[0, 0], [w, 0], [w, hh], [0, hh]];
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) { const [x, y] = src[i], [X, Y] = q[i]; A.push([x, y, 1, 0, 0, 0, -x * X, -y * X, X]); A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y, Y]); }
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) { if (r === c) continue; const f = A[r][c] / A[c][c]; for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k]; }
  }
  const v = A.map((row, i) => row[8] / row[i]);
  const [a, b, c, d, e, f, g, k] = v;
  return { css: `matrix3d(${a},${d},0,${g},${b},${e},0,${k},0,0,1,0,${c},${f},0,1)`, map: (x: number, y: number) => { const w0 = g * x + k * y + 1; return { x: (a * x + b * y + c) / w0, y: (d * x + e * y + f) / w0 }; } };
}
const Cursor: React.FC<{ x: number; y: number; press?: number; op?: number }> = ({ x, y, press = 0, op = 1 }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 9.6, top: y - 3.8, opacity: op, transform: `scale(${1 - press * 0.16})`, transformOrigin: "9.6px 3.8px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.35))", overflow: "visible" }}>
    <path d="M5 2 L5 19 L9.5 15 L12.6 21.6 L15.2 20.4 L12.2 14 L18.4 14 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
const Hero: React.FC<{ k: K; w: number; hh: number; r?: number; style?: React.CSSProperties; imgStyle?: React.CSSProperties }> = ({ k, w, hh, r = 18, style, imgStyle }) => (
  <div style={{ width: w, height: hh, borderRadius: r, overflow: "hidden", background: "#111", ...style }}>
    <Img src={im(k)} style={{ width: "100%", height: "100%", objectFit: "cover", ...imgStyle }} />
  </div>
);

// ---------------------------------------------------------------- 2.5D camera (scale3d so lifted / flipped cards stay true)
type Cam = { x: number; y: number; s: number; roll: number; tilt: number };
const PERSP = 2600;
const camCss = (c: Cam) => `translate(${CX}px, ${CY}px) perspective(${PERSP}px) rotateX(${c.tilt}deg) rotate(${c.roll}deg) scale3d(${c.s}, ${c.s}, ${c.s}) translate(${-c.x}px, ${-c.y}px)`;
const project = (c: Cam, wx: number, wy: number, wz = 0) => {
  const x = (wx - c.x) * c.s, y = (wy - c.y) * c.s, z = wz * c.s, r = (c.roll * Math.PI) / 180, t = (c.tilt * Math.PI) / 180;
  const xr = x * Math.cos(r) - y * Math.sin(r), yr = x * Math.sin(r) + y * Math.cos(r);
  const y2 = yr * Math.cos(t) - z * Math.sin(t), z2 = yr * Math.sin(t) + z * Math.cos(t), f = PERSP / (PERSP - z2);
  return { x: CX + xr * f, y: CY + y2 * f, k: c.s * f };
};

// ---------------------------------------------------------------- S2 fall
const D = mono([T.fall, 3.4, 4.3, 5.2, T.bottom], [0, 700, 1600, 2500, 3000]);
const BY = 420, RB = 54;
const MARKS = [{ m: 700, y: "YEAR 01", l: "First client" }, { m: 1300, y: "YEAR 05", l: "Word of mouth" }, { m: 1900, y: "YEAR 10", l: "A name" }, { m: 2500, y: "YEAR 20", l: "A reputation" }];
const BTN = { x: CX + 520 - 58, y: CY };
function fallBall(s: number) {
  const k = prog(s, T.morph, T.fall + 0.7, E.io);
  let x = lerp(BTN.x, CX, k), y = lerp(CY, BY, prog(s, T.fall, T.fall + 0.8, E.io)) + 60 * Math.sin(Math.PI * prog(s, T.fall, T.fall + 0.6));
  let r = lerp(40, RB, prog(s, T.morph, T.morph + 0.35, E.out));
  const land = Math.max(0, s - T.bottom);
  r *= 1 + 0.06 * Math.sin(land * 24) * Math.exp(-land * 5) * (s > T.bottom ? 1 : 0);
  const dv = prog(s, T.dive, T.white, Easing.bezier(0.7, 0, 0.9, 0.5));
  x = lerp(x, CX, dv); y = lerp(y, CY, dv); r = lerp(r, 2300, dv);
  return { x, y, r };
}

// ---------------------------------------------------------------- S4 the table of heroes
const CW = 1500, CHt = 1000, FPX = 1640, FPY = 1140, TILT = 58;
const STAND = { c: 6, r: 5 };
const SC = { x: STAND.c * FPX + CW / 2, y: STAND.r * FPY + CHt / 2 };
const glide = (s: number) => prog(s, T.white - 0.05, T.stand + 0.2, Easing.bezier(0.25, 0.1, 0.12, 1));
const liftOf = (s: number) => 80 * prog(s, T.stand, T.stand + 0.6, E.out) * (1 - prog(s, T.flip, T.flipEnd, E.io));
const flipK = (s: number) => prog(s, T.flip + 0.1, T.flipEnd - 0.1, Easing.bezier(0.5, 0, 0.2, 1));
function camField(s: number): Cam {
  const g = glide(s);
  const x0 = SC.x - 6400, y0 = SC.y - 4800;
  const z = prog(s, T.flip, T.flipEnd, Easing.bezier(0.55, 0, 0.25, 1));
  const lift = liftOf(s);
  return { x: lerp(x0, SC.x, g), y: lerp(lerp(y0, SC.y, g), SC.y - lift * Math.tan((TILT * Math.PI) / 180), z), s: lerp(0.42, 1.04, z), roll: lerp(-4, 0, g), tilt: TILT };
}

// ---------------------------------------------------------------- S5–S7 one world: grid, lines, travel
const GPX = 1620, GPY = 1120;
const GRID: K[][] = [["orsbite", "silence", "villa"], ["irona", "solt", "aigreen"], ["mindful", "teeblix", "amplify"]];   // [row][col]
const GC = { x: GPX + CW / 2, y: GPY + CHt / 2 };
const RX = 2 * GPX + CW + 24;
const RMID = [0, 1, 2].map((r) => r * GPY + CHt / 2);
const J = { x: RX + 4600, y: RMID[1] };
type Pt = [number, number];
type Seg = ["L", Pt, Pt] | ["C", Pt, Pt, Pt, Pt] | ["A", Pt, number, number, number];
type Path = { x: number[]; y: number[]; l: number[]; a: number[]; total: number; marks: number[] };
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
function build(segs: Seg[]): Path {
  const P: Pt[] = []; const marks: number[] = [];
  for (const sg of segs) {
    marks.push(Math.max(0, P.length - 1));
    const n = sg[0] === "A" ? 360 : 240;
    for (let i = P.length ? 1 : 0; i <= n; i++) {
      const t = i / n;
      P.push(sg[0] === "L" ? [lerp(sg[1][0], sg[2][0], t), lerp(sg[1][1], sg[2][1], t)] : sg[0] === "C" ? bez(sg[1], sg[2], sg[3], sg[4], t) : [sg[1][0] + sg[2] * Math.cos(lerp(sg[3], sg[4], t)), sg[1][1] + sg[2] * Math.sin(lerp(sg[3], sg[4], t))]);
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
const at = (p: Path, u: number) => { u = Math.max(0, Math.min(p.total, u)); const i = idx(p, u), j = Math.min(p.l.length - 1, i + 1); const k = p.l[j] > p.l[i] ? (u - p.l[i]) / (p.l[j] - p.l[i]) : 0; return { x: lerp(p.x[i], p.x[j], k), y: lerp(p.y[i], p.y[j], k), a: lerp(p.a[i], p.a[j], k) }; };
const dPath = (p: Path, u0: number, u1: number) => { u0 = Math.max(0, u0); u1 = Math.min(p.total, u1); if (u1 <= u0) return ""; const i0 = idx(p, u0), i1 = idx(p, u1); const s0 = at(p, u0), e = at(p, u1); let d = `M ${s0.x.toFixed(1)} ${s0.y.toFixed(1)}`; for (let i = i0 + 1; i <= i1; i += 2) d += ` L ${p.x[i].toFixed(1)} ${p.y[i].toFixed(1)}`; return d + ` L ${e.x.toFixed(1)} ${e.y.toFixed(1)}`; };
const firstU = (p: Path, f: (x: number, y: number) => boolean) => { for (let i = 0; i < p.x.length; i++) if (f(p.x[i], p.y[i])) return p.l[i]; return p.total; };
const LINES = [
  build([["C", [RX, RMID[0]], [RX + 2000, RMID[0]], [J.x - 2200, J.y], [J.x, J.y]]]),
  build([["L", [RX, RMID[1]], [J.x, J.y]]]),
  build([["C", [RX, RMID[2]], [RX + 2000, RMID[2]], [J.x - 2200, J.y], [J.x, J.y]]]),
];
const rollK = (s: number) => prog(s, T.roll, T.merge, Easing.bezier(0.5, 0, 0.3, 1));
// the travel (v1): panes left of a vertical line
const PXL = J.x + 700, PW = 1350, PH = 900, RL = 330;
const PANE_X = PXL - 1500;
const PA = J.y + 800, PB = PA + PH + 650, YL = PB + PH + 420, PC = YL + 650;
const PANES: { y: number; k: K; pal: Pal }[] = [{ y: PA, k: "mindful", pal: SILVER }, { y: PB, k: "villa", pal: OCEAN }, { y: PC, k: "fern", pal: FERN }];
const TRAVEL = build([
  ["C", [J.x, J.y], [J.x + 450, J.y], [PXL, J.y + 250], [PXL, J.y + 650]],
  ["L", [PXL, J.y + 650], [PXL, YL]],
  ["A", [PXL + RL, YL], RL, Math.PI, -Math.PI],
  ["L", [PXL, YL], [PXL, PC + PH / 2 + 250]],
]);
const [, , U_LOOP0, U_LOOP1] = TRAVEL.marks;
const U_END = TRAVEL.total;
const U_A = firstU(TRAVEL, (_, y) => y >= PA - 60), U_B = firstU(TRAVEL, (_, y) => y >= PB - 60);
const U_C = U_LOOP1 + (PC - 60 - YL);
const uOf = mono([T.travel, 19.0, 20.9, 22.2, 23.6, 24.4, 26.2], [0, U_A, U_B, U_LOOP0, U_LOOP1, U_C, U_END]);
const tOf = (u: number) => { let a = T.travel, b = 26.2; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (uOf(m) < u) a = m; else b = m; } return (a + b) / 2; };
export const TWA = tOf(U_A), TWB = tOf(U_B), TWC = tOf(U_C);
const ballAt = (s: number) => at(TRAVEL, uOf(s));
const smooth = (s: number, fn: (t: number) => number, span = 0.3, n = 8) => { let a = 0, w = 0; for (let i = 0; i < n; i++) { const wi = 1 - i / n; a += fn(s - (span * i) / n) * wi; w += wi; } return a / w; };
const loopRoll = (s: number) => { const u = Math.max(U_LOOP0, Math.min(U_LOOP1, uOf(s))); return ((Math.PI / 2 - at(TRAVEL, u).a) * 180) / Math.PI; };
function camGrid(s: number): Cam {
  const zo = prog(s, T.flipEnd, T.gridEnd, E.io);
  let c: Cam = { x: GC.x, y: GC.y, s: lerp(1.04, 0.31, zo), roll: 0, tilt: 0 };
  if (s < T.roll) return c;
  // follow the middle ball, tight and fast; push in as the three converge
  const mid = at(LINES[1], LINES[1].total * rollK(s));
  const k1 = prog(s, T.roll, T.roll + 0.7, E.io);
  c = { ...c, x: lerp(GC.x, mid.x + 380, k1), s: lerp(0.31, 0.6, k1) * lerp(1, 1.18, prog(s, T.merge - 1.0, T.merge, E.io)), roll: -2 * Math.sin(Math.PI * prog(s, T.roll, T.merge)) };
  if (s < T.travel) return c;
  // the v1 travel
  const bx = smooth(s, (t) => ballAt(t).x), by = smooth(s, (t) => ballAt(t).y);
  const inLoop = prog(s, 22.0, 22.5, E.io) * (1 - prog(s, 23.6, 24.3, E.io));
  const settle = prog(s, T.settle - 0.6, T.settle + 0.4, E.io);
  const lead = 200 * (1 - inLoop) * (1 - settle);
  const ang = smooth(s, (t) => ballAt(t).a, 0.3);
  let gx = lerp(PANE_X + 760, bx + Math.cos(ang) * lead, inLoop), gy = lerp(by + lead, by + Math.sin(ang) * lead, inLoop);
  gx = lerp(gx, PANE_X + 760, settle); gy = lerp(gy, PC + PH / 2, settle);
  const G: Cam = { x: gx, y: gy, s: lerp(1.0, 0.76, inLoop), roll: smooth(s, loopRoll, 0.28), tilt: 4 * Math.sin(Math.PI * prog(s, 18.6, 21.8)) - 4 * Math.sin(Math.PI * prog(s, 23.8, 25.8)) };
  const b = prog(s, T.travel, T.travel + 1.1, E.io);
  return { x: lerp(c.x, G.x, b), y: lerp(c.y, G.y, b), s: lerp(c.s, G.s, b), roll: lerp(c.roll, G.roll, b), tilt: lerp(c.tilt, G.tilt, b) };
}

// ---------------------------------------------------------------- S8 the studio image + its monitor screen
const QUAD: Q = [[543.4, 127.2], [1437.4, 358.6], [1471.4, 887.2], [533.4, 686.2]];
const SW = 1600, SH = 960;
const DOCK = { x: 96, y: 300 };
const BuiltFor: React.FC<{ s: number }> = ({ s }) => {
  const WORDS = ["Branding", "Marketing", "Ads"];
  const wr = prog(s, 29.9, 30.3, E.io) + prog(s, 31.3, 31.7, E.io);
  const k = prog(s, T.built, T.built + 0.5, E.out);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#E8E8E6", fontFamily: SANS, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 56, top: 44, display: "flex", gap: 34, alignItems: "center", fontSize: 22, color: "#2A2A2A" }}>
        <div style={{ padding: "10px 18px", background: "#111", color: "#fff", fontWeight: 600, letterSpacing: "0.22em", fontSize: 20 }}>OBSIDIAN</div>
        {["Work", "Approach", "Studio", "Contact"].map((t) => <span key={t} style={{ opacity: 0.7 }}>{t}</span>)}
      </div>
      <div style={{ position: "absolute", right: 56, top: 40, padding: "14px 22px", background: "#111", color: "#fff", fontSize: 22, fontWeight: 500 }}>Start a project ↗</div>
      <div style={{ position: "absolute", left: DOCK.x + 30, top: DOCK.y - 16, fontFamily: MONO, fontSize: 26, letterSpacing: "0.12em", color: "#1A1A1A", opacity: k }}>(WHAT WE BUILD)</div>
      <div style={{ position: "absolute", left: 70, top: 360, fontWeight: 800, fontSize: 168, lineHeight: 1, letterSpacing: "-0.03em", color: "#0E0E0E", opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>BUILT FOR</div>
      <div style={{ position: "absolute", left: 70, top: 540, width: 1500, height: 190, overflow: "hidden" }}>
        {WORDS.map((w, i) => { const d = i - wr; const a = Math.abs(d); return <div key={i} style={{ position: "absolute", left: 0, top: d * 172, fontWeight: 800, fontSize: 168, lineHeight: 1, letterSpacing: "-0.03em", color: "#8A8A8A", opacity: Math.max(0, 1 - a * 1.2) * k, filter: `blur(${Math.min(10, a * 10)}px)` }}>{w.toUpperCase()}</div>; })}
      </div>
      <div style={{ position: "absolute", right: 70, top: 380, width: 420, background: "#111", color: "#fff", padding: "26px 30px", opacity: k }}>
        {["Websites", "Ads", "AI agents"].map((t, i) => <div key={t} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 500, padding: "14px 0", borderTop: i ? "1px solid rgba(255,255,255,.18)" : "none" }}>{t}<span style={{ opacity: 0.6 }}>↗</span></div>)}
      </div>
      <div style={{ position: "absolute", left: 70, bottom: 70, fontSize: 26, color: "#3A3A3A", opacity: k }}>Digital precision that builds reputation.</div>
    </div>
  );
};

// ---------------------------------------------------------------- the emblem — white
const BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]];
const Emblem: React.FC<{ s: number; t0: number; scale: number; x: number; y: number }> = ({ s, t0, scale, x, y }) => (
  <svg width={200 * scale} height={245 * scale} viewBox="0 0 200 245" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <defs><linearGradient id="bar6" x1="171" y1="21" x2="40" y2="215" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#CFCFCF" /></linearGradient></defs>
    {BARS.map((b, i) => { const k = prog(s, t0 + i * 0.14, t0 + i * 0.14 + 0.7, E.out); return <polygon key={i} points={b.map((p) => p.join(",")).join(" ")} fill="url(#bar6)" style={{ transform: `translate(${(1 - k) * 160}px, ${-(1 - k) * 220}px)`, opacity: k }} />; })}
  </svg>
);
const LW = 1000, LS = LW / 1030, LX0 = CX - LW / 2, LY0 = CY - 250;
const EMB = { x: LX0 + 96 * LS, y: LY0 + 121 * LS };

// ---------------------------------------------------------------- the ball's screen position (for ink-wipes)
function mainBall(s: number) {
  if (s < T.white) return fallBall(s);
  const c = camGrid(s), b = ballAt(s); return project(c, b.x, b.y);
}
type Tr = { t: number; d: number; a: Pal; b: Pal; wipe: boolean };
const TRS: Tr[] = [
  { t: 6.5, d: 0.3, a: INK, b: WHITE, wipe: false },
  { t: TWA, d: 1.0, a: WHITE, b: SILVER, wipe: true },
  { t: TWB, d: 1.0, a: SILVER, b: OCEAN, wipe: true },
  { t: TWC, d: 1.0, a: OCEAN, b: FERN, wipe: true },
  { t: T.morphA + 0.2, d: 0.9, a: FERN, b: STUDIO, wipe: false },
  { t: T.push + 0.5, d: 0.6, a: STUDIO, b: INK, wipe: false },
];

// ================================================================ film
export const Film6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  let tr = TRS[0];
  for (const t of TRS) if (s >= t.t) tr = t;
  const before = s < TRS[0].t;
  const trK = before ? 0 : prog(s, tr.t, tr.t + tr.d, E.soft);
  let wipe: [number, number, number] = [0, 0, 0];
  if (tr.wipe && trK < 1) { const b = mainBall(tr.t); wipe = [b.x, b.y, Math.max(1, trK * 3000)]; }
  const wMix = tr.wipe ? (trK >= 1 ? 1 : 0) : trK;
  const fallD = D(s);
  const fieldOn = s > T.white - 0.2 && s < T.flipEnd + 0.02;
  const gridOn = s >= T.flipEnd && s < T.morphA + 0.1;
  const cam = fieldOn ? camField(s) : gridOn ? camGrid(s) : null;
  const off: [number, number] = s < T.white ? [0, -fallD * 0.00035] : cam ? [cam.x * 0.00005, -cam.y * 0.00005] : [s * 0.01, 0];
  const balls: Ball[] = [];
  let ballK = 44;

  // ================= S1–S3 =================
  let S1: React.ReactNode = null;
  if (s < T.white + 0.2) {
    const barIn = prog(s, T.bar, T.bar + 0.5, E.out), barOut = prog(s, T.morph, T.morph + 0.6, E.in);
    const str = typed("Years of reputation", s, T.type0, T.type1);
    const curK = prog(s, 1.2, T.click - 0.05, E.io), press = win(s, T.click - 0.06, T.click, T.click + 0.04, T.click + 0.14);
    const turn = prog(s, T.turn, T.morph + 0.05, E.io);
    const btnOp = 1 - prog(s, T.morph, T.morph + 0.2);
    if (s > T.morph) { const fb = fallBall(s); balls.push({ x: fb.x, y: fb.y, r: fb.r, c: mixBC(CLOUD, B_WHITE, prog(s, T.dive + 0.35, T.white - 0.1)), tr: 1 - prog(s, T.white - 0.15, T.white + 0.2), seed: 0.4 }); }
    const G = BY + 3000 + RB + 10 - fallD;
    S1 = (
      <AbsoluteFill style={{ opacity: 1 - prog(s, T.dive, T.dive + 0.4) }}>
        {/* the line and its marks */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: prog(s, T.morph, T.morph + 0.4) }}>
          <line x1={CX} y1={Math.max(-20, CY + 70 - fallD)} x2={CX} y2={Math.min(H + 20, G)} stroke="rgba(255,255,255,.34)" strokeWidth={2} />
          <line x1={CX} y1={Math.max(-20, CY + 70 - fallD)} x2={CX} y2={Math.min(H + 20, Math.max(CY + 70 - fallD, BY))} stroke="rgba(255,255,255,.85)" strokeWidth={3} />
          {G < H + 40 && <><circle cx={CX} cy={G} r={10} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={2.5} />{s > T.bottom && <circle cx={CX} cy={G} r={lerp(20, 300, prog(s, T.bottom, T.bottom + 0.8, E.out))} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={2} opacity={1 - prog(s, T.bottom, T.bottom + 0.8)} />}</>}
          {MARKS.map((m, i) => { const y = BY + m.m - fallD; if (y < -40 || y > H + 40) return null; const lit = fallD >= m.m - RB ? 1 : 0; return <g key={i}><line x1={CX - 22} x2={CX + 22} y1={y} y2={y} stroke={`rgba(255,255,255,${0.3 + 0.6 * lit})`} strokeWidth={2} /><circle cx={CX} cy={y} r={7} fill={lit ? "#fff" : "#060606"} stroke="rgba(255,255,255,.7)" strokeWidth={2} /></g>; })}
        </svg>
        {MARKS.map((m, i) => { const y = BY + m.m - fallD; if (y < -60 || y > H + 60) return null; const lit = fallD >= m.m - RB ? 1 : 0; return <React.Fragment key={i}>
          <div style={{ position: "absolute", right: W - CX + 48, top: y - 14, fontFamily: MONO, fontSize: 20, letterSpacing: "0.22em", color: `rgba(255,255,255,${0.32 + 0.6 * lit})` }}>{m.y}</div>
          <div style={{ position: "absolute", left: CX + 48, top: y - 22, fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: "-0.01em", color: `rgba(255,255,255,${0.3 + 0.65 * lit})` }}>{m.l}</div>
        </React.Fragment>; })}
        {/* the glass bar */}
        <div style={{ position: "absolute", left: CX - 520, top: CY - 56 - barOut * 160 - fallD * 0.0, width: 1040, height: 112, borderRadius: 56, opacity: barIn * (1 - barOut), filter: `blur(${barOut * 10}px)`, transform: `scale(${lerp(0.94, 1, barIn)})`, background: "rgba(255,255,255,.07)", border: "1.5px solid rgba(255,255,255,.2)", boxShadow: "0 30px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.18)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", paddingLeft: 52, fontFamily: SANS, fontWeight: 500, fontSize: 46, letterSpacing: "-0.02em", color: "#F2F2F2" }}>
          {str}<span style={{ display: "inline-block", width: 3, height: 50, marginLeft: 6, background: "#fff", opacity: s < T.click && Math.floor(s * 3.2) % 2 === 0 ? 1 : 0 }} />
        </div>
        {/* the circle button: click → turns 90° (→ becomes ↓) → becomes the ball */}
        {btnOp > 0 && <div style={{ position: "absolute", left: BTN.x - 40, top: BTN.y - 40, width: 80, height: 80, borderRadius: 40, background: "#F4F4F4", boxShadow: "0 10px 30px rgba(0,0,0,.4)", opacity: barIn * btnOp, transform: `scale(${1 - press * 0.1}) rotate(${turn * 90}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12h14 M13 6l6 6-6 6" stroke="#111" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>}
        {curK > 0 && <Cursor x={lerp(1500, BTN.x + 8, curK)} y={lerp(980, BTN.y + 10, curK)} press={press} op={1 - prog(s, T.click + 0.2, T.click + 0.5)} />}
      </AbsoluteFill>
    );
  }

  // ================= S4 · the table of heroes; one stands out; it flips upright =================
  let FIELD: React.ReactNode = null;
  if (fieldOn && cam) {
    const standK = prog(s, T.stand, T.stand + 0.6, E.io);
    const othersOut = prog(s, T.flip, T.flip + 0.6, E.in);
    const lift = liftOf(s), fk = flipK(s);
    const cards: React.ReactNode[] = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) {
      const x = c * FPX, y = r * FPY, isS = c === STAND.c && r === STAND.r;
      if (!isS && Math.hypot(x + CW / 2 - cam.x, y + CHt / 2 - cam.y) * cam.s > 2600) continue;
      if (!isS && othersOut >= 1) continue;
      const k = isS ? "solt" : FIELD_SET[Math.floor(h(r * 9 + c, 3) * FIELD_SET.length) % FIELD_SET.length];
      cards.push(
        <div key={`${r}_${c}`} style={{ position: "absolute", left: x, top: y, width: CW, height: CHt, transformStyle: "preserve-3d", transform: isS ? `translateZ(${lift}px) rotateX(${-TILT * fk}deg)` : `translateZ(${-othersOut * 300}px)`, opacity: isS ? 1 : (1 - othersOut) * lerp(1, 0.5, standK), filter: isS ? undefined : `grayscale(${standK}) blur(${standK * 2}px)` }}>
          <Hero k={k} w={CW} hh={CHt} r={20} style={{ boxShadow: isS ? `0 ${20 + lift}px ${60 + lift * 1.5}px rgba(0,0,0,${0.25 + standK * 0.25})${standK > 0 ? ", 0 0 0 4px rgba(255,255,255,.9)" : ""}` : "0 20px 60px rgba(0,0,0,.18)" }} />
        </div>
      );
    }
    FIELD = <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: camCss(cam), transformStyle: "preserve-3d" }}>{cards}</div>;
  }

  // ================= S5–S7 · grid, lines, travel =================
  let WORLD: React.ReactNode = null;
  if (gridOn && cam) {
    const vis = (wx: number, wy: number, rad: number) => Math.hypot(wx - cam.x, wy - cam.y) * cam.s - rad * cam.s < 1700;
    const dof = prog(s, T.roll, T.roll + 0.9, E.io) * (1 - prog(s, T.travel + 0.4, T.travel + 1.2));
    const lineK = prog(s, T.lines, T.lines + 0.8, E.io);
    const rk = rollK(s);
    const cols: BC[] = [B_VILLA, B_AIG, B_AMP];
    const mergeK = prog(s, T.merge - 0.15, T.merge + 0.45, E.io);
    if (s > T.lines + 0.4 && s < T.travel + 0.05) {
      const grow = prog(s, T.lines + 0.45, T.lines + 0.95, E.back);
      LINES.forEach((L, i) => { const p = at(L, L.total * rk), pp = project(cam, p.x, p.y); balls.push({ x: pp.x, y: pp.y, r: 110 * grow * pp.k * (1 - 0.3 * mergeK), c: mixBC(cols[i], CLOUD, mergeK), seed: 2 + i, tr: 1 - prog(s, T.merge + 0.2, T.merge + 0.5) }); });
      if (mergeK > 0) { const pp = project(cam, J.x, J.y); balls.push({ x: pp.x, y: pp.y, r: lerp(0, 120, mergeK) * pp.k, c: CLOUD, seed: 2.7 }); }
      ballK = 80 * cam.s;
    }
    if (s >= T.travel && s < T.morphA) {
      const b = ballAt(s), pp = project(cam, b.x, b.y);
      balls.push({ x: pp.x, y: pp.y, r: lerp(120, 70, prog(s, T.travel, T.travel + 0.8, E.io)) * pp.k, c: CLOUD, seed: 3.1 });
    }
    const zoomIn = prog(s, T.flipEnd, T.flipEnd + 0.9, E.out);
    const lineFade = 1 - prog(s, T.morphA - 0.2, T.morphA + 0.3);
    const darkLines = s < TWA + 0.3;
    const stroke = (d: string, key: string, op = 1, wid = 3) => (
      <g key={key} opacity={op}>
        <path d={d} stroke={darkLines ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.35)"} strokeWidth={wid * 2.6} fill="none" strokeLinecap="round" />
        <path d={d} stroke={darkLines ? "rgba(20,20,20,.8)" : "rgba(255,255,255,.88)"} strokeWidth={wid} fill="none" strokeLinecap="round" />
      </g>
    );
    WORLD = (
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: camCss(cam) }}>
        {/* the 3 × 3 grid (soft focus once the balls run) */}
        {s < T.travel + 1.5 && GRID.map((row, r) => row.map((k, c) => {
          const x = c * GPX, y = r * GPY, centre = r === 1 && c === 1;
          if (!vis(x + CW / 2, y + CHt / 2, 900)) return null;
          const a = centre ? 1 : prog(s, T.flipEnd + 0.1 + (r * 3 + c) * 0.05, T.flipEnd + 0.7 + (r * 3 + c) * 0.05, E.out);
          return <div key={`${r}${c}`} style={{ position: "absolute", left: x, top: y, opacity: a, transform: centre ? undefined : `scale(${lerp(0.88, 1, a)})`, filter: dof > 0.02 ? `blur(${dof * 14}px)` : undefined }}><Hero k={k} w={CW} hh={CHt} r={centre ? lerp(20, 24, zoomIn) : 24} style={{ boxShadow: "0 40px 100px rgba(0,0,0,.25)" }} /></div>;
        }))}
        {/* ElevenLabs flow: hairlines + nodes out of the right column → one line */}
        {s > T.lines - 0.05 && (
          <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {LINES.map((L, i) => (
              <g key={i}>
                {stroke(dPath(L, 0, L.total * lineK), `l${i}`, lineFade, 4)}
                <circle cx={RX} cy={RMID[i]} r={16} fill="#F3F3F1" stroke="#1A1A1A" strokeWidth={4} opacity={lineK * lineFade} />
                {s > T.roll && <path d={dPath(L, Math.max(0, L.total * rk - 2200), L.total * rk)} stroke={mixC(cols[i][1], CLOUD[1], mergeK)} strokeWidth={22} strokeLinecap="round" fill="none" opacity={0.75 * (1 - prog(s, T.merge + 0.3, T.merge + 1.2))} />}
              </g>
            ))}
            {s > T.merge - 0.3 && <circle cx={J.x} cy={J.y} r={20} fill="#F3F3F1" stroke="#1A1A1A" strokeWidth={4} opacity={lineFade} />}
            {s > T.merge && s < T.merge + 1 && <circle cx={J.x} cy={J.y} r={lerp(120, 900, prog(s, T.merge, T.merge + 0.9, E.out))} stroke="rgba(20,20,20,.5)" strokeWidth={6} fill="none" opacity={1 - prog(s, T.merge, T.merge + 0.9)} />}
            {s > T.merge - 0.3 && stroke(dPath(TRAVEL, 0, Math.min(U_END, (s > T.travel ? uOf(s) : 0) + 2200 * prog(s, T.merge - 0.3, T.travel + 0.3))), "tr", lineFade, 3.2)}
            {s > T.travel && (() => { const u = uOf(s); return [0, 1, 2, 3].map((i) => <path key={`w${i}`} d={dPath(TRAVEL, u - 240 * (i + 1), u - 240 * i)} stroke={CLOUD[1]} strokeWidth={12 - i * 2.5} strokeLinecap="round" fill="none" opacity={(0.75 - i * 0.16) * lineFade} />); })()}
          </svg>
        )}
        {/* the reflective glass panes — nearly the whole frame, room for the world around them */}
        {s > T.travel - 0.6 && PANES.map((p, i) => {
          if (!vis(PANE_X + PW / 2, p.y + PH / 2, 1000)) return null;
          if (i === 2 && s > T.morphA) return null;
          const sheen = ((s * 0.35 + i * 0.3) % 1.6) - 0.3;
          return (
            <div key={i} style={{ position: "absolute", left: PANE_X - 26, top: p.y - 26 }}>
              <div style={{ position: "relative", width: PW + 52, height: PH + 52, borderRadius: 40, background: "linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.06) 40%, rgba(255,255,255,.14))", border: "2px solid rgba(255,255,255,.4)", boxShadow: "0 60px 140px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.6)", backdropFilter: "blur(20px)" }}>
                <div style={{ position: "absolute", left: 26, top: 26 }}><Hero k={p.k} w={PW} hh={PH} r={18} /></div>
                <div style={{ position: "absolute", inset: 0, borderRadius: 40, overflow: "hidden", pointerEvents: "none" }}>
                  <div style={{ position: "absolute", top: -400, bottom: -400, width: 260, left: `${sheen * 100}%`, transform: "rotate(20deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0))" }} />
                </div>
              </div>
              {/* reflection */}
              <div style={{ position: "absolute", left: 26, top: PH + 52 + 14, width: PW, height: 220, overflow: "hidden", opacity: 0.22, WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0))", maskImage: "linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0))" }}>
                <div style={{ transform: "scaleY(-1)", transformOrigin: "50% 0", position: "absolute", top: PH, left: 0 }}><Hero k={p.k} w={PW} hh={PH} r={18} /></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ================= S8 · the studio, the monitor, BUILT FOR =================
  let STUDIO_: React.ReactNode = null;
  if (s > T.morphA - 0.05 && s < T.lock + 0.5) {
    const mk = prog(s, T.morphA, T.morphB, Easing.bezier(0.6, 0, 0.2, 1));
    const c = camGrid(Math.min(s, T.morphA));
    const rect: Q = [project(c, PANE_X, PC), project(c, PANE_X + PW, PC), project(c, PANE_X + PW, PC + PH), project(c, PANE_X, PC + PH)].map((p) => [p.x, p.y]) as Q;
    // after BUILT FOR: push into the screen
    const push = prog(s, T.push, T.black, Easing.bezier(0.6, 0, 0.3, 1));
    const studioOp = prog(s, T.morphA + 0.3, T.morphB, E.soft);
    const zoom = lerp(1, 1.06, prog(s, T.morphB, T.push, (x: number) => x)) * lerp(1, 3.6, push);
    const qc = { x: (QUAD[0][0] + QUAD[2][0]) / 2, y: (QUAD[0][1] + QUAD[2][1]) / 2 };
    // the screen stays locked to the monitor: the same zoom about the same point
    const zq = QUAD.map(([x, y]) => [qc.x + (x - qc.x) * zoom, qc.y + (y - qc.y) * zoom]) as Q;
    const q = rect.map((p, i) => [lerp(p[0], zq[i][0], mk), lerp(p[1], zq[i][1], mk)]) as Q;
    const hm = homog(SW, SH, q);
    const builtK = prog(s, T.built, T.built + 0.5, E.io);
    const blackK = prog(s, T.black - 0.4, T.black, E.io);
    // the ball docks as the bullet
    const dock = hm.map(DOCK.x, DOCK.y);
    const dk = prog(s, T.morphB - 0.4, T.built + 0.3, E.io);
    if (s > T.morphA && s < T.lock + 0.2) {
      const b0 = project(c, ballAt(T.morphA).x, ballAt(T.morphA).y);
      balls.push({ x: lerp(b0.x, dock.x, dk), y: lerp(b0.y, dock.y, dk), r: lerp(70, 13 * (1 + push * 2.2), dk), c: CLOUD, seed: 3.1, tr: 1 - prog(s, T.black - 0.3, T.black) });
    }
    STUDIO_ = (
      <AbsoluteFill>
        <div style={{ position: "absolute", inset: 0, opacity: studioOp, transformOrigin: `${qc.x}px ${qc.y}px`, transform: `scale(${zoom})` }}>
          <Img src={im("monitor")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: hm.css }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: lerp(18, 2, mk) }}>
            <Img src={im("fern")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - builtK }} />
            {builtK > 0 && <div style={{ position: "absolute", inset: 0, opacity: builtK }}><BuiltFor s={s} /></div>}
            <div style={{ position: "absolute", inset: 0, background: "#000", opacity: blackK }} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // ================= S9 · the emblem — white on black =================
  let END: React.ReactNode = null;
  if (s > T.black - 0.1) {
    const t0 = T.lock;
    const inK = prog(s, t0, t0 + 0.8, E.out);
    const toE = prog(s, t0 + 0.6, t0 + 1.4, E.io), bars = prog(s, t0 + 1.0, t0 + 1.5, E.soft);
    const word = prog(s, t0 + 1.6, t0 + 2.4, E.out), lock = prog(s, t0 + 2.1, t0 + 2.5, E.soft);
    if (s > t0 && s < t0 + 1.7) balls.push({ x: lerp(CX, EMB.x, toE), y: lerp(CY - 100, EMB.y, toE), r: lerp(lerp(30, 120, inK), 60, toE), c: CLOUD, seed: 5.5, tr: 1 - prog(s, t0 + 1.1, t0 + 1.6, E.soft) });
    END = (
      <AbsoluteFill style={{ background: "#050505", opacity: prog(s, T.black - 0.1, T.black + 0.2) }}>
        <div style={{ opacity: 1 - lock }}><Emblem s={s} t0={t0 + 0.95} scale={LS} x={LX0} y={LY0} /></div>
        <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX0, top: LY0, width: LW, height: 245 * LS, mixBlendMode: "screen", filter: "grayscale(1) brightness(1.75) contrast(1.15)", clipPath: `inset(0 ${(1 - Math.max(lock * 0.2, word)) * 80}% 0 0)`, opacity: Math.max(lock, word) }} />
        <div style={{ position: "absolute", left: 0, width: W, top: CY + 90, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 48, letterSpacing: "-0.015em", color: "rgba(255,255,255,.88)", opacity: prog(s, t0 + 2.6, t0 + 3.2), transform: `translateY(${(1 - prog(s, t0 + 2.6, t0 + 3.2)) * 20}px)` }}>Digital precision that builds reputation.</div>
        <div style={{ position: "absolute", left: 0, width: W, top: CY + 180, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", opacity: prog(s, t0 + 3.2, t0 + 3.7) }}>WhatsApp · 079 244 9607</div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", fontFamily: SANS }}>
      <SoftWorld time={s} a={before ? INK : tr.a} b={before ? INK : tr.b} mix={wMix} wipe={wipe} off={off} zoom={0.8} rot={cam ? (-cam.roll * Math.PI) / 180 * 0.5 : 0} />
      {S1}
      {FIELD}
      {WORLD}
      {STUDIO_}
      {END}
      <SoftBalls time={s} balls={balls} k={ballK} glow={0.8} />
    </AbsoluteFill>
  );
};
