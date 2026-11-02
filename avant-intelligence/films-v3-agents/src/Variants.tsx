// Two more Avant films in the same vivid language, each with its own idea (16:9, ~25 s, no voice).
// "One Line"   — everything rides on one horizontal line: the day's mess piles up on it, the frame flips to white paper
//                (dotted grid, bracket corners, before/after bars), flips back, splits into four agent lanes that
//                converge into one light, which becomes the Λ.   (library: ref11/ref12 line text swaps, light/dark flip,
//                benchmark bars, bracket grid)
// "Every City" — a globe of dots turns to South Africa; messages arc between cities; the camera dives into Knysna,
//                into the vivid world; the dots regroup as four orbiting agents that fall into the Λ.  (library: globe of
//                dots, one shape becomes everything, dive-through transition)
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { LOGO_PATHS, LOGO_VB } from "./logo";

export const FPS = 60;
export const DUR_LINE = 25.5;
export const DUR_CITY = 25.5;
const E = { out: Easing.bezier(0.16, 1, 0.3, 1), in: Easing.bezier(0.7, 0, 0.84, 0), io: Easing.bezier(0.65, 0, 0.35, 1) };
const prog = (s: number, a: number, b: number, ease = E.out) => interpolate(s, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const win = (s: number, a: number, b: number, c: number, d: number) => prog(s, a, b) * (1 - prog(s, c, d, E.in));
const h = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const FONT = "Inter, Helvetica, Arial, sans-serif";
const C = { lilac: "#B9A6FF", pink: "#FF9FCB", cyan: "#5FD6FF", blue: "#5B83FF", orange: "#FF8A3C", violet: "#A274FF", green: "#3FE6A6", avant: "#3BC1EC", ink: "#F4F5F8", muted: "#9AA0AE" };
const AG = [
  { c: C.orange, t: "Collections", v: "R48,200" },
  { c: C.violet, t: "Invoice capture", v: "46 invoices" },
  { c: C.green, t: "Lead router", v: "12 leads" },
  { c: C.cyan, t: "Front desk", v: "38 replies" },
];

// shared: the Λ resolving into AVANT
const Logo: React.FC<{ s: number; t0: number; cx: number; cy: number; ink?: string }> = ({ s, t0, cx, cy, ink = "#fff" }) => {
  const draw = prog(s, t0, t0 + 1.0, E.io), fill = prog(s, t0 + 0.9, t0 + 1.4), letters = prog(s, t0 + 1.4, t0 + 2.1), sub = prog(s, t0 + 2.0, t0 + 2.6), tag = prog(s, t0 + 2.6, t0 + 3.3), btn = prog(s, t0 + 3.2, t0 + 3.8);
  const [, , vw, vh] = LOGO_VB.split(" ").map(Number);
  const LW = 700, LH = (LW * vh) / vw, sc = LW / vw, lx = cx - LW / 2, ly = cy - LH / 2 - 40;
  const ax = lx + 187.4 * sc, ay = ly + 0.1 * sc, f0 = lx + 151 * sc, f1 = lx + 224 * sc, fy = ly + 55.2 * sc;
  const blue = LOGO_PATHS.find((p) => p.cls === "blue")!;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {[f0, f1].map((fx, i) => <line key={i} x1={ax} y1={ay} x2={lerp(ax, fx, draw)} y2={lerp(ay, fy, draw)} stroke={C.avant} strokeWidth={5} strokeLinecap="round" opacity={(1 - fill) * (draw > 0 ? 1 : 0)} style={{ filter: `drop-shadow(0 0 8px ${C.avant})` }} />)}
      </svg>
      <svg width={LW} height={LH} viewBox={LOGO_VB} style={{ position: "absolute", left: lx, top: ly, overflow: "visible" }}>
        <path d={blue.d} fill={C.avant} opacity={fill} />
        {LOGO_PATHS.map((p, i) => p.cls === "blue" ? null : <path key={i} d={p.d} fill={ink} style={{ opacity: clamp01(letters * 1.6 - Math.abs(i - 2) * 0.25), transform: `translateX(${(i < 2 ? -1 : 1) * 14 * (1 - letters)}px)` }} />)}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: ly + LH + 26, textAlign: "center", fontFamily: FONT, fontSize: 24, letterSpacing: ".62em", paddingLeft: ".62em", color: ink === "#fff" ? "#CFE3EA" : "#3a4250", opacity: sub }}>INTELLIGENCE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: ly + LH + 100, textAlign: "center", fontFamily: FONT, fontSize: 40, fontWeight: 500, color: ink, opacity: tag, transform: `translateY(${16 * (1 - tag)}px)` }}>Always one step ahead.</div>
      <div style={{ position: "absolute", left: cx - 140, top: ly + LH + 190, width: 280, height: 68, borderRadius: 34, background: ink === "#fff" ? "#fff" : "#0b0f17", color: ink === "#fff" ? "#0b0f17" : "#fff", fontFamily: FONT, fontSize: 25, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", opacity: btn, transform: `translateY(${14 * (1 - btn)}px)` }}>Book an audit</div>
    </>
  );
};

// ======================= ONE LINE =======================
const WORDS = [{ t: "Invoices.", a: 1.3 }, { t: "Reminders.", a: 2.5 }, { t: "Leads.", a: 3.7 }, { t: "Every single day.", a: 4.9 }];
const TICKS = 64;

export const OneLine: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const Y = 540;
  const lineIn = prog(s, 0.2, 1.3, E.io);
  // flip to paper (6.1–7.0) and back to dark (12.6–13.4): a slit opening from the line
  const open1 = prog(s, 6.1, 7.0, E.io), open2 = prog(s, 12.6, 13.4, E.io);
  const paper = open1 > 0 && open2 < 1;
  const ink = "#12151c";
  // lanes (13.4–19.4)
  const lanesK = prog(s, 13.5, 14.4, E.io);
  const conv = prog(s, 17.6, 19.0, E.io);
  return (
    <AbsoluteFill style={{ background: "#07080b", overflow: "hidden", fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #15171d 0%, #07080b 65%)" }} />
      {/* 1: the day piles up on one line */}
      {s < 7.2 && (
        <>
          <div style={{ position: "absolute", left: 960 - 880 * lineIn, top: Y, width: 1760 * lineIn, height: 2, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.75) 12%, rgba(255,255,255,.75) 88%, transparent)" }} />
          {WORDS.map((w, i) => {
            const k = win(s, w.a, w.a + 0.45, w.a + 1.0, w.a + 1.25);
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: Y - 150, height: 140, overflow: "hidden", textAlign: "center" }}>
                <div style={{ fontSize: 112, fontWeight: 600, letterSpacing: "-.035em", color: "#fff", transform: `translateY(${(1 - prog(s, w.a, w.a + 0.45)) * 130 - prog(s, w.a + 1.0, w.a + 1.25, E.in) * 130}px)`, opacity: k }}>{w.t}</div>
              </div>
            );
          })}
          {Array.from({ length: TICKS }, (_, i) => {
            const t = 1.2 + (i / TICKS) * 4.8 + h(i, 1) * 0.3;
            const k = prog(s, t, t + 0.35);
            const x = 160 + h(i, 2) * 1600, c = [C.orange, C.pink, C.cyan, C.violet][i % 4];
            const lift = prog(s, 6.0, 6.8, E.in);
            return <div key={i} style={{ position: "absolute", left: x - 3, top: Y + 14 + (h(i, 3) * 70) - lift * 300, width: 6, height: 18 + h(i, 4) * 26, borderRadius: 3, background: c, opacity: k * (1 - lift), boxShadow: `0 0 10px ${c}` }} />;
          })}
          {["06:00", "09:30", "13:10", "17:45"].map((t, i) => <div key={t} style={{ position: "absolute", left: 960 - 60, top: Y + 120, width: 120, textAlign: "center", fontSize: 22, letterSpacing: ".18em", color: C.muted, opacity: win(s, WORDS[i].a, WORDS[i].a + 0.3, WORDS[i].a + 1.0, WORDS[i].a + 1.2) }}>{t}</div>)}
        </>
      )}
      {/* 2: white paper — the before/after */}
      {paper && (
        <AbsoluteFill style={{ clipPath: `inset(${(1 - open1) * 540 + open2 * 540}px 0 ${(1 - open1) * 540 + open2 * 540}px 0)`, background: "#F3F4F7" }}>
          <AbsoluteFill style={{ backgroundImage: "radial-gradient(#c9ccd6 1.6px, transparent 1.7px)", backgroundSize: "40px 40px", opacity: prog(s, 7.0, 7.8) * 0.9 }} />
          {/* bracket corners framing the chart */}
          {[[360, 250, 1, 1], [1560, 250, -1, 1], [360, 830, 1, -1], [1560, 830, -1, -1]].map(([x, y, dx, dy], i) => {
            const k = prog(s, 7.2 + i * 0.06, 7.8 + i * 0.06);
            return <div key={i} style={{ position: "absolute", left: dx > 0 ? x : x - 46, top: dy > 0 ? y : y - 46, width: 46, height: 46, borderLeft: dx > 0 ? `3px solid ${ink}` : "none", borderRight: dx < 0 ? `3px solid ${ink}` : "none", borderTop: dy > 0 ? `3px solid ${ink}` : "none", borderBottom: dy < 0 ? `3px solid ${ink}` : "none", opacity: k, transform: `translate(${-dx * 30 * (1 - k)}px, ${-dy * 30 * (1 - k)}px)` }} />;
          })}
          <div style={{ position: "absolute", left: 420, top: 300, fontSize: 22, letterSpacing: ".2em", color: "#5d6574", fontWeight: 600, opacity: prog(s, 7.5, 8.0) }}>HOURS SPENT CHASING, PER WEEK</div>
          {[{ lab: "Before", v: 11, c: "#b9bdc8", w: 1000, t: 8.0 }, { lab: "With Avant", v: 1, c: C.avant, w: 1000 / 11, t: 9.0 }].map((b, i) => {
            const g = prog(s, b.t, b.t + 1.3, E.io);
            return (
              <div key={i} style={{ position: "absolute", left: 420, top: 400 + i * 190 }}>
                <div style={{ fontSize: 30, fontWeight: 600, color: ink, opacity: prog(s, b.t - 0.3, b.t + 0.2) }}>{b.lab}</div>
                <div style={{ marginTop: 14, height: 64, width: Math.max(8, b.w * g), borderRadius: 14, background: i ? `linear-gradient(90deg, ${C.avant}, #8BE3FF)` : b.c, boxShadow: i ? `0 10px 30px ${C.avant}66` : "none" }} />
                <div style={{ position: "absolute", left: Math.max(8, b.w * g) + 24, top: 54, fontSize: 52, fontWeight: 600, letterSpacing: "-.02em", color: i ? "#1185b0" : ink, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{Math.max(i ? 1 : 0, Math.round(b.v * g))} h</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 870, textAlign: "center", fontSize: 64, fontWeight: 600, letterSpacing: "-.03em", color: ink, opacity: win(s, 10.6, 11.2, 12.3, 12.7) }}>Ten hours back, every week.</div>
        </AbsoluteFill>
      )}
      {/* 3: four lanes converge into one light */}
      {s > 13.2 && s < 20.6 && (
        <AbsoluteFill style={{ opacity: 1 - prog(s, 19.6, 20.4) }}>
          {AG.map((a, i) => {
            const ly = lerp(Y, 300 + i * 160, lanesK), ty = lerp(ly, Y, conv);
            const pulse = (s * 0.55 + i * 0.23) % 1;
            const lab = prog(s, 14.2 + i * 0.12, 14.8 + i * 0.12) * (1 - conv);
            const cnt = prog(s, 14.6 + i * 0.15, 16.6 + i * 0.15);
            return (
              <React.Fragment key={i}>
                <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                  <path d={`M 120 ${ly} L 1300 ${ly} C 1520 ${ly}, 1520 ${ty}, 1700 ${ty}`} fill="none" stroke={a.c} strokeWidth={3} opacity={0.85} style={{ filter: `drop-shadow(0 0 6px ${a.c})` }} />
                </svg>
                <div style={{ position: "absolute", left: 120 + pulse * 1180 - 7, top: ly - 7, width: 14, height: 14, borderRadius: 7, background: "#fff", boxShadow: `0 0 18px ${a.c}, 0 0 40px ${a.c}`, opacity: lanesK * (1 - conv) }} />
                <div style={{ position: "absolute", left: 120, top: ly - 58, fontSize: 26, fontWeight: 600, color: C.ink, opacity: lab }}>{a.t}</div>
                <div style={{ position: "absolute", left: 1000, top: ly - 64, width: 290, textAlign: "right", fontSize: 40, fontWeight: 600, color: "#fff", opacity: lab, fontVariantNumeric: "tabular-nums" }}>{a.v.replace(/[\d,]+/, (m) => { const n = Math.round(parseInt(m.replace(/,/g, "")) * cnt); return n.toLocaleString("en-US"); })}</div>
              </React.Fragment>
            );
          })}
          <div style={{ position: "absolute", left: 1700 - 16, top: Y - 16, width: 32, height: 32, borderRadius: 16, background: "#fff", boxShadow: `0 0 40px #fff, 0 0 100px ${C.avant}`, opacity: prog(s, 18.6, 19.0) }} />
        </AbsoluteFill>
      )}
      {s > 13.2 && s < 15 && <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 30, fontWeight: 500, color: C.muted, letterSpacing: ".04em", opacity: win(s, 13.6, 14.1, 14.6, 15.0) }}>Four agents. One line of work.</div>}
      {/* 4: the light travels to centre and becomes the Λ */}
      {s > 19.0 && (() => {
        const tr = prog(s, 19.0, 20.0, E.io);
        const x = lerp(1700, 960, tr), y = lerp(Y, 470, tr);
        return <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: "#fff", boxShadow: `0 0 40px #fff, 0 0 100px ${C.avant}`, opacity: 1 - prog(s, 20.1, 20.5) }} />;
      })()}
      {s > 19.9 && <Logo s={s} t0={20.0} cx={960} cy={540} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,.35) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ======================= EVERY CITY =======================
const NPTS = 1300;
const PTS = Array.from({ length: NPTS }, (_, i) => {
  const y = 1 - (i / (NPTS - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
  return { lat: Math.asin(y), lon: Math.atan2(Math.sin(th) * r, Math.cos(th) * r) };
});
const D2R = Math.PI / 180;
const CITIES = [
  { n: "Johannesburg", lat: -26.2, lon: 28.05, c: C.pink, msg: "Reminder sent" },
  { n: "Durban", lat: -29.9, lon: 31.0, c: C.green, msg: "Lead booked · Fri" },
  { n: "Cape Town", lat: -33.9, lon: 18.4, c: C.orange, msg: "Invoice paid · R8,450" },
  { n: "Knysna", lat: -34.0, lon: 23.05, c: C.cyan, msg: "Enquiry answered" },
];
// a dense dot map of South Africa (rough outline, lon/lat) — shows the country clearly when the camera zooms in
const SA_POLY: [number, number][] = [[16.4,-28.6],[19.9,-28.4],[20.0,-24.8],[25.0,-25.7],[26.8,-24.6],[29.4,-22.2],[31.3,-22.4],[32.0,-26.8],[32.9,-26.9],[32.4,-28.6],[31.0,-29.9],[30.0,-31.3],[28.0,-32.8],[26.5,-33.8],[25.0,-34.0],[23.0,-34.1],[20.0,-34.8],[18.8,-34.4],[18.4,-33.9],[17.9,-32.6],[18.2,-31.8]];
const inPoly = (x: number, y: number) => { let c = false; for (let i = 0, j = SA_POLY.length - 1; i < SA_POLY.length; j = i++) { const [xi, yi] = SA_POLY[i], [xj, yj] = SA_POLY[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const SA_PTS: { lat: number; lon: number }[] = [];
for (let lon = 16; lon <= 33.2; lon += 0.42) for (let lat = -35; lat <= -22; lat += 0.42) if (inPoly(lon, lat)) SA_PTS.push({ lat: lat * D2R, lon: lon * D2R });

function project(lat: number, lon: number, lam0: number, phi0: number, R: number, cx: number, cy: number) {
  const cosc = Math.sin(phi0) * Math.sin(lat) + Math.cos(phi0) * Math.cos(lat) * Math.cos(lon - lam0);
  const x = R * Math.cos(lat) * Math.sin(lon - lam0);
  const y = R * (Math.cos(phi0) * Math.sin(lat) - Math.sin(phi0) * Math.cos(lat) * Math.cos(lon - lam0));
  return { x: cx + x, y: cy - y, z: cosc };
}

export const EveryCity: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const form = prog(s, 0.0, 1.6, E.out);
  const turn = prog(s, 0.0, 7.0, E.io);
  const lam0 = lerp(-70, 24, turn) * D2R, phi0 = lerp(10, -30, turn) * D2R;
  const zoom = prog(s, 6.6, 9.0, E.io);
  const R = lerp(400, 2700, zoom) * lerp(0.4, 1, form);
  const cx = 960, cy = 560;
  // dive into Knysna (12.4–13.4) → vivid world
  const kn = project(CITIES[3].lat * D2R, CITIES[3].lon * D2R, lam0, phi0, R, cx, cy);
  const dive = prog(s, 12.4, 13.4, E.in);
  const globeOut = prog(s, 12.6, 13.2);
  const vividOut = prog(s, 16.4, 17.0, E.in);
  const orbitK = prog(s, 16.6, 17.6, E.io), fall = prog(s, 19.4, 20.2, E.in);
  return (
    <AbsoluteFill style={{ background: "#05070b", overflow: "hidden", fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #10162a 0%, #05070b 62%)" }} />
      {/* globe of dots */}
      {s < 13.4 && (
        <AbsoluteFill style={{ opacity: 1 - globeOut, transform: `scale(${1 + dive * 3})`, transformOrigin: `${kn.x}px ${kn.y}px` }}>
          {PTS.map((p, i) => {
            const q = project(p.lat, p.lon, lam0 + (1 - form) * (h(i, 1) - 0.5) * 2, phi0, R, cx, cy);
            if (q.z <= 0.02 || q.y > 1140 || q.y < -60) return null;
            const size = (2.4 + 2.6 * q.z) * lerp(1, 2.2, zoom);
            return <div key={i} style={{ position: "absolute", left: q.x - size / 2, top: q.y - size / 2, width: size, height: size, borderRadius: size, background: "#93a0c8", opacity: (0.25 + 0.65 * q.z) * form * lerp(1, 0.45, zoom) }} />;
          })}
          {SA_PTS.map((p, i) => {
            const q = project(p.lat, p.lon, lam0, phi0, R, cx, cy);
            if (q.z <= 0.02) return null;
            const lit = prog(s, 2.8 + h(i, 5) * 1.2, 3.6 + h(i, 5) * 1.2);
            const size = lerp(2.4, 7.5, zoom);
            return <div key={"sa" + i} style={{ position: "absolute", left: q.x - size / 2, top: q.y - size / 2, width: size, height: size, borderRadius: size, background: C.avant, opacity: lit * (0.55 + 0.45 * h(i, 6)), boxShadow: `0 0 ${6 + 6 * zoom}px ${C.avant}88` }} />;
          })}
          {/* rim light */}
          <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: "50%", boxShadow: `inset 0 0 ${R * 0.25}px rgba(91,131,255,.25), 0 0 ${R * 0.3}px rgba(59,193,236,.10)`, opacity: form }} />
          {/* arcs from Knysna to the other cities, then city chips */}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {CITIES.slice(0, 3).map((c, i) => {
              const a = project(c.lat * D2R, c.lon * D2R, lam0, phi0, R, cx, cy);
              const k = prog(s, 7.6 + i * 0.5, 8.6 + i * 0.5, E.io);
              const mx = (a.x + kn.x) / 2, my = Math.min(a.y, kn.y) - 140 - 60 * i;
              return <path key={i} d={`M${kn.x},${kn.y} Q${mx},${my} ${a.x},${a.y}`} fill="none" stroke={c.c} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} style={{ filter: `drop-shadow(0 0 6px ${c.c})` }} opacity={win(s, 7.6, 7.8, 11.8, 12.4)} />;
            })}
          </svg>
          {CITIES.map((c, i) => {
            const a = project(c.lat * D2R, c.lon * D2R, lam0, phi0, R, cx, cy);
            const dot = prog(s, 4.4 + i * 0.25, 5.0 + i * 0.25);
            const chip = i === 3 ? prog(s, 7.4, 8.0) : prog(s, 8.4 + i * 0.5, 9.0 + i * 0.5);
            const pulse = (s * 0.8 + i * 0.3) % 1;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: a.x - 30 * pulse, top: a.y - 30 * pulse, width: 60 * pulse, height: 60 * pulse, borderRadius: "50%", border: `2px solid ${c.c}`, opacity: dot * (1 - pulse) }} />
                <div style={{ position: "absolute", left: a.x - 9, top: a.y - 9, width: 18, height: 18, borderRadius: 9, background: c.c, boxShadow: `0 0 20px ${c.c}`, opacity: dot }} />
                <div style={{ position: "absolute", left: a.x + (i === 2 ? -340 : 22), top: a.y - (i === 3 ? -24 : 70), minWidth: 300, padding: "12px 18px", borderRadius: 16, background: "rgba(14,18,32,.72)", border: "1px solid rgba(255,255,255,.14)", opacity: chip * (1 - prog(s, 11.8, 12.3)), transform: `translateY(${12 * (1 - chip)}px)` }}>
                  <div style={{ fontSize: 18, letterSpacing: ".16em", color: c.c, fontWeight: 600 }}>{c.n.toUpperCase()}</div>
                  <div style={{ fontSize: 24, color: C.ink, marginTop: 4, whiteSpace: "nowrap" }}>{c.msg}</div>
                </div>
              </React.Fragment>
            );
          })}
        </AbsoluteFill>
      )}
      {/* beats */}
      {[{ t: "Every client.", a: 1.6, b: 3.6 }, { t: "Every city.", a: 3.9, b: 6.2 }].map((w, i) => {
        const k = win(s, w.a, w.a + 0.6, w.b - 0.4, w.b);
        return <div key={i} style={{ position: "absolute", left: 140, top: 150, fontSize: 96, fontWeight: 600, letterSpacing: "-.035em", color: "#fff", opacity: k, filter: `blur(${(1 - k) * 10}px)` }}>{w.t}</div>;
      })}
      {/* the vivid world inside Knysna */}
      {s > 12.4 && s < 17.1 && (
        <AbsoluteFill style={{ clipPath: `circle(${lerp(9, 2300, dive)}px at ${kn.x}px ${kn.y}px)`, opacity: 1 - vividOut }}>
          <AbsoluteFill style={{ background: "#141a33" }}>
            <div style={{ position: "absolute", inset: -200, filter: "blur(80px)" }}>
              <div style={{ position: "absolute", left: 200 + Math.sin(s * 0.4) * 80, top: -200, width: 1300, height: 800, borderRadius: "50%", background: "radial-gradient(circle, #D7C6FF 0%, #BFA9FF 40%, transparent 70%)" }} />
              <div style={{ position: "absolute", left: 900, top: 300 + Math.sin(s * 0.5) * 60, width: 1300, height: 900, borderRadius: "50%", background: "radial-gradient(circle, #46CDF6 0%, #2FA8E8 38%, transparent 70%)" }} />
              <div style={{ position: "absolute", left: -200, top: 600, width: 1000, height: 700, borderRadius: "50%", background: "radial-gradient(circle, #F2A6D6 0%, #C786D9 35%, transparent 70%)" }} />
            </div>
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", color: "#fff", fontWeight: 600, letterSpacing: "-.04em", fontSize: 220, fontVariantNumeric: "tabular-nums", textShadow: "0 20px 60px rgba(20,26,60,.35)", opacity: prog(s, 13.3, 13.9) }}>{Math.round(1284 * prog(s, 13.4, 15.2, E.out)).toLocaleString("en-US")}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", color: "rgba(255,255,255,.92)", fontWeight: 500, fontSize: 40, opacity: prog(s, 14.0, 14.6) }}>conversations handled this month</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", color: "#fff", fontWeight: 600, fontSize: 56, letterSpacing: "-.02em", opacity: prog(s, 15.0, 15.6), transform: `translateY(${14 * (1 - prog(s, 15.0, 15.6))}px)` }}>Every one approved by your team.</div>
        </AbsoluteFill>
      )}
      {/* agents in orbit → fall into the Λ */}
      {s > 16.5 && s < 20.6 && (
        <AbsoluteFill style={{ opacity: 1 - prog(s, 20.0, 20.5) }}>
          {[0, 1, 2, 3].map((i) => {
            const rr = lerp(900, 210 + i * 95, orbitK) * (1 - fall);
            return <div key={i} style={{ position: "absolute", left: 960 - rr, top: 470 - rr * 0.42, width: rr * 2, height: rr * 0.84, borderRadius: "50%", border: "1px solid rgba(255,255,255,.12)", opacity: orbitK }} />;
          })}
          {AG.map((a, i) => {
            const ang = s * 0.55 + i * (Math.PI / 2) + 0.4;
            const rr = lerp(900, 210 + i * 95, orbitK) * (1 - fall);
            const x = 960 + Math.cos(ang) * rr, y = 470 + Math.sin(ang) * rr * 0.42;
            const sz = 46 * (1 - fall * 0.7);
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff 0%, ${a.c} 45%, ${a.c}99 100%)`, boxShadow: `0 0 30px ${a.c}, 0 0 70px ${a.c}66` }} />
                <div style={{ position: "absolute", left: x + 34, top: y - 16, fontSize: 24, fontWeight: 600, color: C.ink, opacity: orbitK * (1 - prog(s, 18.8, 19.3)) }}>{a.t}</div>
              </React.Fragment>
            );
          })}
          <div style={{ position: "absolute", left: 960 - 14, top: 470 - 14, width: 28, height: 28, borderRadius: 14, background: "#fff", boxShadow: `0 0 40px #fff, 0 0 100px ${C.avant}`, opacity: orbitK }} />
        </AbsoluteFill>
      )}
      {s > 20.0 && <Logo s={s} t0={20.1} cx={960} cy={540} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,.4) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
