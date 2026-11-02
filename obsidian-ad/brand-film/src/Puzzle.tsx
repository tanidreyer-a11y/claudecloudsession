// OBS-PUZZLE (9:16, 30 fps, 40 s): every camera move and transition we have, chained into ONE story led by ONE point.
// Story: a point → a system → structure → a designed screen → motion → depth → results → Obsidian.
// Each move hands the eye to the next scene (method: .claude/skills/obsidian-video-studio/continuity.md).
//  0.0 RINGS     crane down a thread through 3 lit rings (3D); the camera tilts to top-down, the last ring becomes…
//  3.0 SYSTEM    …the system ring: the point splits into 4 nodes; ring morphs to a star; FLIP-TO-EDGE → a hairline
//  5.6 GRID      the hairline stretches and splits into a 12-col grid; GRAZING TILT back and up; wireframe snaps in;
//                WIREFRAME RESOLVES into a real site (Northlight, the owner's work)
//  9.0 CLICK     a star in the site becomes the point → cursor → clicks "Book consultation" → CONTACT FLOOD
// 10.6 MATTE     TRACK MATTE: the pill opens into the next scene → CAMERA PULL-BACK reveals a designed invoice;
//                the point rides the payment timeline; contact → the "Paid" seal stamps
// 14.3 RIDE      THREAD RIDE: the camera chases the point with lag, banks, pulls out, WHIPS through the S-bend
// 17.6 ORBIT     3D: the camera ORBITS a browser while the point DRAGS the scrollbar (SCROLL-SCRUB); RACK FOCUS +
//                DOLLY to the site behind it
// 22.4 DIVE      MATERIAL DIVE into the site → HYPERSPACE WARP → out of the vanishing point…
// 24.2 CAROUSEL  …a 3D carousel of sites with depth of field over a grid floor; LIQUID flood from the point
// 28.7 RESULTS   the point draws the data line; the number lands with a CRASH ZOOM + DUTCH tilt; CHART-FILL MATTE
// 34.0 CUT       MATCH CUT (black point on white → white point on black) with a SLICE GLITCH
// 34.0 LOGO      FLY-OUT-OF-LOGO: we start inside the emblem's gap and pull back to the lockup
// Numbers in the invoice and the chart are placeholders — replace with a real client's before anything is published.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import {
  LOOKS, SM, MV, cl, prog, Finish, Dust, Warp, GridFloor, DotRipple, LightPools, liquid,
  camAt, mixCam, follow, World, At, Thread, threadHead, Shape, Matte, lerpBox, screenOf, pop, Cam, CamKey,
} from "./fx";

export const FPSP = 30, DURP = 40;
const look = LOOKS.obsidian;
const UI = look.ui, INK = look.ink, DIM = look.dim;
const RIDE = Easing.bezier(0.55, 0, 0.3, 1), IN = Easing.bezier(0.55, 0, 1, 0.45);
const win = (t: number, a: number, b: number) => t >= a && t < b;
const img = (p: string) => staticFile("site/" + p);
const seq = (dir: string, i: number) => img(`${dir}/${String(Math.max(1, Math.min(150, Math.round(i)))).padStart(3, "0")}.jpg`);
const Label: React.FC<{ t: number; a: number; b: number; y: number; text: string; size?: number }> = ({ t, a, b, y, text, size = 50 }) => {
  const k = prog(t, a, a + 0.45), o = prog(t, b - 0.35, b);
  if (t < a || t > b) return null;
  return <div style={{ position: "absolute", left: 0, width: 1080, top: y, textAlign: "center", fontFamily: UI, fontSize: size, fontWeight: 400, letterSpacing: "-0.01em",
    color: INK, opacity: k * (1 - o), filter: `blur(${(1 - k) * 12 + o * 10}px)`, transform: `translateY(${(1 - k) * 18}px)` }}>{text}</div>;
};
const Dot: React.FC<{ x: number; y: number; d?: number; s?: number; color?: string }> = ({ x, y, d = 26, s = 1, color = "#fff" }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: color, transform: `scale(${s})`,
    boxShadow: color === "#fff" ? "0 0 26px 4px rgba(255,255,255,.75)" : "none" }} />
);

// ───────── 1 · RINGS ─────────
const Rings: React.FC<{ t: number }> = ({ t }) => {
  const desc = 1310 * prog(t, 0.2, 2.7, SM), flat = prog(t, 2.15, 3.0, MV);
  return (
    <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 42%" }}>
      <div style={{ position: "absolute", left: 539, top: 0, width: 2, height: 1920, background: "linear-gradient(transparent, rgba(255,255,255,.55) 30%, rgba(255,255,255,.55) 70%, transparent)", opacity: 1 - flat }} />
      {[1150, 1710, 2270].map((y0, i) => {
        const y = y0 - desc, last = i === 2, pitch = last ? 74 * (1 - flat) : 74, sc = 1 + Math.max(-0.3, ((960 - y) / 1600) * 0.9);
        const lit = Math.exp(-(((y - 960) / 110) ** 2)), op = cl((1950 - y) / 300) * (last ? 1 - prog(t, 2.95, 3.1) : cl((y + 300) / 500));
        return <div key={i} style={{ position: "absolute", left: 300, top: y - 240, width: 480, height: 480, borderRadius: "50%", opacity: op,
          transform: `scale(${last ? 1 + (sc - 1) * (1 - flat) : sc}) rotateX(${pitch}deg)`, border: "2.5px solid rgba(255,255,255,.92)",
          boxShadow: `0 0 ${30 + 60 * lit}px ${4 + 10 * lit}px rgba(255,255,255,${0.22 + 0.45 * lit}), inset 0 0 ${40 + 50 * lit}px rgba(255,255,255,${0.18 + 0.4 * lit})`,
          background: `radial-gradient(circle, rgba(255,255,255,${0.05 + 0.22 * lit}) 0%, rgba(255,255,255,0) 70%)` }} />;
      })}
      <Dot x={540} y={960} s={pop(t, 0.15, 0.6)} />
      <Label t={t} a={0.5} b={2.4} y={520} text="Every site starts as a point." />
    </AbsoluteFill>
  );
};

// ───────── 2 · SYSTEM ─────────
const System: React.FC<{ t: number }> = ({ t }) => {
  const split = prog(t, 3.0, 3.45, MV), k = prog(t, 4.3, 4.9, MV), spin = 10 * prog(t, 3, 4.3) + 45 * k;
  const flip = 90 * prog(t, 5.25, 5.6, IN), zoom = 1 + 0.15 * prog(t, 3.0, 5.2), roll = -4 * prog(t, 3.0, 5.2);
  if (t > 5.62) return null;
  return (
    <div style={{ position: "absolute", left: 540, top: 960, transform: `rotate(${roll}deg) scale(${zoom})` }}>
      <div style={{ position: "absolute", transform: `perspective(1200px) rotateY(${flip}deg)` }}>
        <Shape k={k} r={240} spin={spin} nodes={0} />
        {split > 0 && [0, 1, 2, 3].map((i) => { const a = ((i * 90 + spin - 90) * Math.PI) / 180; return <Dot key={i} x={Math.cos(a) * 240 * split} y={Math.sin(a) * 240 * split} d={18} s={1 - k} />; })}
        {split <= 0 && <Dot x={0} y={0} />}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%, -50%)", fontFamily: UI, fontSize: 46, color: INK, whiteSpace: "nowrap",
        opacity: prog(t, 3.35, 3.8) * (1 - prog(t, 4.25, 4.55)), filter: `blur(${(1 - prog(t, 3.35, 3.8)) * 10 + prog(t, 4.25, 4.55) * 10}px)` }}>Give it a system</div>
    </div>
  );
};

// ───────── 3+4 · GRID → WIREFRAME → SITE → CLICK ─────────
const C = { x: 160, y: 137, w: 760, h: 1645 };                        // container = the Northlight mobile page (780×1688)
const PILL = { x: 711, y: 195, w: 250, h: 58 };
const K34: CamKey[] = [{ t: 5.5, x: 540, y: 960, z: 1, r: 0 }, { t: 7.0, x: 540, y: 960, z: 1, r: 0 }, { t: 9.3, x: 540, y: 960, z: 1.05, r: 0 },
  { t: 10.5, x: 640, y: 560, z: 1.55, r: 0, e: MV }];
const WIRE = [[0.06, 0.03, 0.3, 0.016], [0.62, 0.028, 0.32, 0.02], [0.06, 0.44, 0.88, 0.07], [0.22, 0.54, 0.56, 0.012], [0.3, 0.565, 0.4, 0.012], [0.06, 0.92, 0.16, 0.014]];
const Build: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(K34, t), prev = camAt(K34, t - 1 / FPSP);
  const hair = 552 + (1920 - 552) * prog(t, 5.6, 5.95, MV), spread = prog(t, 5.95, 6.55, MV);
  const tilt = 62 * prog(t, 5.95, 6.35, MV) * (1 - prog(t, 6.45, 7.15, MV)), edges = prog(t, 6.3, 6.75);
  const res = prog(t, 8.1, 8.85, SM), gridOut = prog(t, 8.4, 8.9);
  const pIn = pop(t, 9.0, 0.5), mv = prog(t, 9.25, 9.95, MV), hover = prog(t, 9.85, 10.1), click = pop(t, 10.25, 0.4), flood = prog(t, 10.25, 10.55, MV);
  const px = 540 + (PILL.x - 540) * mv, py = 700 + (PILL.y - 700) * mv;
  return (
    <World cam={cam} prev={prev} id="b34">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `perspective(1300px) rotateX(${tilt}deg)`, transformOrigin: "50% 70%" }}>
        {t < 5.98 && <div style={{ position: "absolute", left: 539, top: 960 - hair / 2, width: 2, height: hair, background: "#fff", boxShadow: "0 0 14px rgba(255,255,255,.8)" }} />}
        {t >= 5.95 && Array.from({ length: 13 }, (_, i) => {
          const x = 540 + (C.x + (i * C.w) / 12 - 540) * spread;
          return <div key={i} style={{ position: "absolute", left: x - 0.75, top: C.y, width: 1.5, height: C.h, background: `rgba(220,222,226,${i % 6 === 0 ? 0.55 : 0.22})`, opacity: 1 - gridOut }} />;
        })}
        {edges > 0 && [C.y, C.y + C.h].map((y, i) => <div key={i} style={{ position: "absolute", left: 540 - (C.w / 2) * edges, top: y, width: C.w * edges, height: 1.5, background: "rgba(220,222,226,.55)", opacity: 1 - gridOut }} />)}
        {/* wireframe blocks snap in */}
        {WIRE.map(([x, y, w, h], i) => {
          const s = pop(t, 7.0 + i * 0.09, 0.45);
          return s > 0 && <div key={i} style={{ position: "absolute", left: C.x + x * C.w, top: C.y + y * C.h, width: w * C.w, height: Math.max(10, h * C.h), borderRadius: 6,
            background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1.5px rgba(220,222,226,.38)", transform: `scale(${s})`, opacity: 1 - gridOut }} />;
        })}
        {/* selection handles + chip on the wordmark block */}
        {win(t, 7.55, 8.9) && (() => { const [x, y, w, h] = WIRE[2], X = C.x + x * C.w, Y = C.y + y * C.h, Wd = w * C.w, Hd = h * C.h, k = prog(t, 7.55, 7.8);
          return <div style={{ opacity: k * (1 - gridOut) }}>
            <div style={{ position: "absolute", left: X - 4, top: Y - 4, width: Wd + 8, height: Hd + 8, boxShadow: "inset 0 0 0 2px #fff" }} />
            {[[X, Y], [X + Wd, Y], [X, Y + Hd], [X + Wd, Y + Hd]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: a - 9, top: b - 9, width: 18, height: 18, background: "#000", boxShadow: "inset 0 0 0 2px #fff" }} />)}
            <div style={{ position: "absolute", left: X, top: Y - 64, padding: "8px 16px", borderRadius: 10, background: "#fff", color: "#000", fontFamily: UI, fontSize: 26, fontWeight: 500 }}>Hero, 12 columns</div>
          </div>; })()}
        {/* the wireframe resolves into the real site, left to right through a soft mask */}
        {res > 0 && <Img src={img("m_north_0.jpg")} style={{ position: "absolute", left: C.x, top: C.y, width: C.w, height: C.h, borderRadius: 30,
          WebkitMaskImage: `linear-gradient(90deg, #000 ${res * 140 - 40}%, transparent ${res * 140}%)`, maskImage: `linear-gradient(90deg, #000 ${res * 140 - 40}%, transparent ${res * 140}%)`,
          filter: `blur(${(1 - res) * 14}px)` }} />}
        <Label t={t} a={7.0} b={8.6} y={1800} text="Then structure." size={46} />
      </div>
      {/* the point returns: a star in the site brightens, becomes the cursor, clicks the CTA */}
      {t >= 9.0 && <>
        {hover > 0 && <div style={{ position: "absolute", left: PILL.x - PILL.w / 2, top: PILL.y - PILL.h / 2, width: PILL.w, height: PILL.h, borderRadius: PILL.h / 2,
          boxShadow: `inset 0 0 0 ${2 * hover}px rgba(255,255,255,.9)`, overflow: "hidden", transform: `scale(${1 + 0.05 * click * (1 - flood)})` }}>
          <div style={{ position: "absolute", inset: 0, background: "#fff", clipPath: `circle(${flood * 300}px at ${50 + ((px - PILL.x) / PILL.w) * 100}% 50%)` }} />
        </div>}
        <Dot x={px} y={py} d={22} s={pIn * (1 - flood)} />
        {click > 0 && click < 1.2 && <div style={{ position: "absolute", left: px - 40, top: py - 40, width: 80, height: 80, borderRadius: "50%", boxShadow: "0 0 0 2px rgba(255,255,255,.8)",
          transform: `scale(${0.4 + prog(t, 10.25, 10.65) * 1.4})`, opacity: 1 - prog(t, 10.25, 10.65) }} />}
      </>}
    </World>
  );
};

// ───────── 5+6 · INVOICE (designed) + THREAD RIDE ─────────
const ITEMS = [["Design", 18000, "#F2F2F0"], ["Build", 22000, "#A4A6AD"], ["Motion", 2261, "#62646B"], ["VAT", 6339, "#34363C"]] as const;
const TOTAL = 48600, fmt = (n: number) => "R" + Math.round(n).toLocaleString("en-ZA").replace(/,/g, " ");
const NODES = [[-380, "Sent", "14 Oct"], [0, "Viewed", "15 Oct"], [380, "Paid", "28 Oct"]] as const;
const B = { x: 271, y: 3173 };                                            // browser centre in the invoice world
const D2 = `M 380 470 C 380 1000, -380 900, -380 1450 S 720 1800, 740 2400 S 740 2800, ${B.x + 469} ${B.y - 223}`;
const ride2 = (s: number) => RIDE(cl((s - 14.4) / (17.1 - 14.4)));
const KINV: CamKey[] = [{ t: 10.6, x: 330, y: -170, z: 3.2, r: 0 }, { t: 11.0, x: 330, y: -170, z: 3.0, r: 0 }, { t: 12.4, x: 0, y: 0, z: 1, r: 0, e: MV }];
const camInv = (s: number): Cam => {
  const u = ride2(s), chase = follow((q) => threadHead(D2, ride2(q)), s, { lag: 0.16, bank: 0.08, z: 1 - 0.3 * Math.sin(Math.PI * u) });
  const c = mixCam(camAt(KINV, s), chase, prog(s, 14.05, 14.95, SM)); // slow hand-off: no jolt at the ride start
  return mixCam(c, { x: B.x, y: B.y, z: 1, r: 0 }, prog(s, 16.95, 17.55, MV));
};
const Invoice: React.FC<{ t: number }> = ({ t }) => {
  const cam = camInv(t), prev = camInv(t - 1 / FPSP);
  const leg1 = prog(t, 12.9, 13.3, MV), leg2 = prog(t, 13.5, 14.0, MV), pos = leg1 * 380 + leg2 * 380 - 380, seal = pop(t, 14.0, 0.5);
  const thr = ride2(t);
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      <LightPools t={t} look={look} strength={0.12} />
      <World cam={cam} prev={prev} id="binv">
        <At x={0} y={0}><div style={{ width: 940, height: 1560, borderRadius: 44, background: "linear-gradient(180deg, #15161A 0%, #0E0F12 100%)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.07), 0 50px 120px rgba(0,0,0,.6)" }} /></At>
        {/* header: who and what */}
        <div style={{ position: "absolute", left: -420, top: -730, fontFamily: UI, color: INK }}>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.015em" }}>Cape Atlantic Cigars</div>
          <div style={{ fontSize: 28, color: DIM, marginTop: 6 }}>Invoice 0148, due 30 October</div>
        </div>
        <svg width={40} height={49} viewBox="0 0 200 245" style={{ position: "absolute", left: 380, top: -722 }}><polygon points="171,21 171,66 22,170 22,128" fill="#fff" /><polygon points="171,88 171,136 46,222 46,176" fill="#fff" /></svg>
        {/* the total sits on a white slab — the one bold thing on the page */}
        <div style={{ position: "absolute", left: -430, top: -580, width: 860, height: 470, borderRadius: 32, background: "#F2F2F0", color: "#0A0A0B", fontFamily: UI }}>
          <div style={{ position: "absolute", left: 40, top: 40, fontSize: 30, color: "#55575E" }}>Total due</div>
          <div style={{ position: "absolute", left: 34, top: 92, fontSize: 176, fontWeight: 800, fontStretch: "112%", letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{fmt(TOTAL)}</div>
          <div style={{ position: "absolute", left: 40, top: 300, fontSize: 30, color: "#6A6C73" }}>Including VAT of {fmt(6339)}</div>
          <div style={{ position: "absolute", left: 40, bottom: 40, right: 40, height: 1.5, background: "rgba(10,10,11,.12)" }} />
          <div style={{ position: "absolute", left: 40, bottom: 58, fontSize: 26, color: "#6A6C73" }}>Pay to Obsidian, FNB 6281 4402 917</div>
        </div>
        {/* where the money goes: one proportional bar, then the rows it encodes */}
        <div style={{ position: "absolute", left: -430, top: -40, width: 860, fontFamily: UI, color: INK }}>
          <div style={{ fontSize: 28, color: DIM, marginBottom: 22 }}>Where it goes</div>
          <div style={{ display: "flex", height: 28, borderRadius: 14, overflow: "hidden", gap: 4 }}>
            {ITEMS.map(([n, v, c]) => <div key={n} style={{ width: `${(v / TOTAL) * 100}%`, background: c }} />)}
          </div>
          {ITEMS.map(([n, v, c], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", height: 64, borderBottom: i < 3 ? "1px solid rgba(255,255,255,.07)" : "none", marginTop: i ? 0 : 18, fontSize: 32 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: c, marginRight: 18 }} />
              <div style={{ flex: 1 }}>{n}</div>
              <div style={{ fontVariantNumeric: "tabular-nums", color: n === "VAT" ? DIM : INK }}>{fmt(v)}</div>
            </div>
          ))}
        </div>
        {/* payment timeline: the point rides it */}
        <div style={{ position: "absolute", left: -380, top: 469, width: 760, height: 2, background: "rgba(220,222,226,.18)" }} />
        {t >= 12.5 && <div style={{ position: "absolute", left: -380, top: 469, width: pos + 380, height: 2, background: "#fff" }} />}
        {NODES.map(([x, a, b], i) => {
          const on = i === 0 ? t >= 12.5 : i === 1 ? leg1 >= 1 : t >= 14.0;
          return <React.Fragment key={a}>
            <div style={{ position: "absolute", left: x - 11, top: 459, width: 22, height: 22, borderRadius: "50%", background: on ? "#fff" : "#0E0F12", boxShadow: "inset 0 0 0 2px rgba(220,222,226,.6)" }} />
            <div style={{ position: "absolute", left: x - 100, width: 200, top: 500, textAlign: "center", fontFamily: UI, fontSize: 28, color: on ? INK : DIM }}>{a}<br /><span style={{ color: DIM, fontSize: 24 }}>{b}</span></div>
          </React.Fragment>;
        })}
        <div style={{ position: "absolute", left: -430, top: 640, height: 76, padding: "0 34px", borderRadius: 38, boxShadow: "inset 0 0 0 1.5px rgba(220,222,226,.4)", display: "flex", alignItems: "center", fontFamily: UI, fontSize: 30, color: INK }}>Download PDF</div>
        {seal > 0 && <At x={300} y={680} style={{ transform: `translate(-50%, -50%) rotate(-9deg) scale(${1 + (1 - Math.min(1, seal)) * 0.6})`, opacity: Math.min(1, seal * 1.5) }}>
          <div style={{ width: 176, height: 176, borderRadius: "50%", boxShadow: "inset 0 0 0 3px #fff, inset 0 0 0 10px #0E0F12, inset 0 0 0 11.5px rgba(255,255,255,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: UI, color: "#fff" }}>
            <div style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.02em" }}>Paid</div><div style={{ fontSize: 22, color: DIM }}>28 October</div>
          </div>
        </At>}
        {win(t, 12.5, 14.45) && <Dot x={pos} y={470} s={pop(t, 12.5, 0.45)} />}
        {/* the ride: a label passes in the first curve, the site waits at the end */}
        <div style={{ position: "absolute", left: -330, top: 1130, fontFamily: UI, fontSize: 54, color: INK, whiteSpace: "nowrap", opacity: prog(t, 14.6, 15.0) }}>Every screen, designed.</div>
        {t >= 15.4 && <At x={B.x} y={B.y} style={{ opacity: prog(t, 15.4, 16.2) }}><Browser dir="north" frame={1} url="northlight" /></At>}
        {t >= 14.3 && <Thread d={D2} p={thr} dot={t > 17.05 ? 0 : 12} />}
      </World>
    </AbsoluteFill>
  );
};

// browser window (960 × 600 site + 44 px chrome); thumb 0..1 = scroll position; the point can ride the thumb
const Browser: React.FC<{ dir: string; frame: number; url: string; thumb?: number; point?: boolean; blur?: number; light?: number }> = ({ dir, frame, url, thumb = 0, point = false, blur = 0, light = 0 }) => {
  const ty = 10 + thumb * (600 - 20 - 90);
  return (
    <div style={{ position: "relative", width: 960, height: 644, borderRadius: 22, overflow: "hidden", background: "#121317", filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.1), 0 60px 140px rgba(0,0,0,.7)" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 10, paddingLeft: 20 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "#3A3C42" }} />)}
        <div style={{ marginLeft: 240, height: 26, width: 300, borderRadius: 13, background: "#1E1F24", fontFamily: UI, fontSize: 17, color: DIM, display: "flex", alignItems: "center", justifyContent: "center" }}>{url}</div>
      </div>
      <Img src={seq(dir, frame)} style={{ position: "absolute", left: 0, top: 44, width: 960, height: 600, objectFit: "cover" }} />
      <div style={{ position: "absolute", right: 8, top: 54, width: 6, height: 580, borderRadius: 3, background: "rgba(255,255,255,.08)" }} />
      <div style={{ position: "absolute", right: 8, top: 44 + ty, width: 6, height: 90, borderRadius: 3, background: "rgba(255,255,255,.7)" }} />
      {point && <Dot x={960 - 11} y={44 + ty + 45} d={24} />}
      {light > 0 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${100 + light * 40}deg, rgba(255,255,255,${0.1 * light}) 0%, rgba(255,255,255,0) 40%)` }} />}
    </div>
  );
};

// ───────── 7 · ORBIT + SCROLL-SCRUB + RACK FOCUS ─────────
const Orbit: React.FC<{ t: number }> = ({ t }) => {
  const yaw = 24 * prog(t, 17.8, 20.6, SM) * (1 - prog(t, 21.0, 22.3, MV)), go = prog(t, 21.0, 22.3, MV);
  const drag = prog(t, 17.9, 20.6, SM), rack = prog(t, 20.85, 21.4);
  const P = [{ x: 0, y: 0, z: 0, dir: "north", url: "northlight", f: 1 + drag * 149 }, { x: -430, y: -170, z: -900, dir: "surgery", url: "atelier vale", f: 1 + prog(t, 17.6, 22.6) * 40 },
    { x: 380, y: 210, z: -1300, dir: "estate", url: "private estates", f: 1 + prog(t, 17.6, 22.6) * 60 }];
  return (
    <AbsoluteFill style={{ perspective: 1500 }}>
      <LightPools t={t} look={look} strength={0.1} />
      <Dust t={t} look={look} n={70} />
      <div style={{ position: "absolute", left: 540, top: 960, transformStyle: "preserve-3d",
        transform: `translateZ(${1300 * go}px) translateX(${-380 * go}px) translateY(${-210 * go}px) rotateX(${4 * Math.sin(Math.PI * prog(t, 17.8, 22.3))}deg) rotateY(${yaw}deg)` }}>
        {[...P].reverse().map((p, j) => {
          const i = P.length - 1 - j, bl = i === 0 ? 9 * rack : i === 2 ? 8 * (1 - rack) : 6;
          return <div key={p.dir} style={{ position: "absolute", transform: `translate3d(${p.x - 480}px, ${p.y - 322}px, ${p.z}px)`, opacity: i === 0 ? 1 - prog(go, 0.2, 0.5) : 1 }}>
            <Browser dir={p.dir} frame={p.f} url={p.url} thumb={i === 0 ? drag : p.f / 150} point={i === 0 && t < 21.2} blur={bl} light={i === 0 ? yaw / 24 : 0} />
          </div>;
        })}
      </div>
      <Label t={t} a={18.2} b={20.7} y={1580} text="Make it move." />
    </AbsoluteFill>
  );
};

// ───────── 8 · MATERIAL DIVE + WARP ─────────
const Dive: React.FC<{ t: number }> = ({ t }) => {
  const d = prog(t, 22.45, 23.3, IN), warpIn = prog(t, 22.95, 23.3), sp = 1 + 8 * prog(t, 23.0, 23.8) * (1 - prog(t, 23.9, 24.7)), warpOut = prog(t, 24.4, 25.0);
  return (
    <AbsoluteFill>
      {t < 23.45 && <div style={{ position: "absolute", left: 60, top: 638, transformOrigin: "450px 350px", transform: `scale(${1 + 8 * d})`, filter: `blur(${d * 24}px)`, opacity: 1 - prog(t, 23.1, 23.45) }}>
        <Browser dir="estate" frame={61} url="private estates" />
      </div>}
      {warpIn > 0 && <AbsoluteFill style={{ opacity: 0.72 * warpIn * (1 - warpOut) }}><Warp t={t} look={look} speed={sp} streak={1.1} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ───────── 9 · CAROUSEL ─────────
const PANELS = ["m_north_0", "m_surgery_0", "m_estate_1", "m_north_2", "m_surgery_1", "m_estate_0"];
const Carousel: React.FC<{ t: number }> = ({ t }) => {
  const appear = prog(t, 24.2, 24.95, MV), spin = -150 * prog(t, 24.6, 28.6, SM), crane = -6 - 6 * prog(t, 24.6, 28.6);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.55 * appear }}><GridFloor t={t} look={look} speed={0.4} tilt={74} cell={110} /></AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 540, top: 880, transformStyle: "preserve-3d", opacity: appear,
          transform: `scale(${0.25 + 0.75 * appear}) translateZ(-700px) rotateX(${crane}deg) rotateY(${spin}deg)` }}>
          {PANELS.map((p, i) => {
            const a = (((i * 60 + spin) % 360) + 360) % 360, c = Math.cos((a * Math.PI) / 180);
            return <Img key={p} src={img(p + ".jpg")} style={{ position: "absolute", left: -200, top: -360, width: 400, height: 720, borderRadius: 28, objectFit: "cover",
              transform: `rotateY(${i * 60}deg) translateZ(700px)`, filter: `brightness(${0.3 + 0.7 * Math.max(0, c)}) blur(${(1 - c) * 3}px)`,
              boxShadow: "0 0 0 1.5px rgba(255,255,255,.12)", backfaceVisibility: "hidden" }} />;
          })}
        </div>
      </AbsoluteFill>
      <Dot x={540} y={1330} s={appear} />
      <Label t={t} a={25.3} b={27.7} y={1440} text="Give it depth." />
    </AbsoluteFill>
  );
};

// ───────── 10 · RESULTS ─────────
const VALS = [12, 14, 13, 21, 29, 36], MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const PTS = VALS.map((v, i) => [-420 + i * 168, 380 - (v - 10) * 26] as const);
const curve = (pts: readonly (readonly [number, number])[], lift = 0) => {
  const P = pts.map(([x, y]) => [x, y - lift] as const); let d = `M ${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return { d, P };
};
const D3 = curve(PTS).d, HEAD = PTS[PTS.length - 1];
const KRES: CamKey[] = [{ t: 28.6, x: 0, y: -60, z: 1, r: 0 }, { t: 31.4, x: 0, y: -60, z: 1, r: 0 }, { t: 31.62, x: -40, y: -380, z: 1.34, r: -5, e: Easing.bezier(0.2, 0.9, 0.3, 1) },
  { t: 32.3, x: -20, y: -300, z: 1.12, r: -3 }, { t: 32.9, x: HEAD[0], y: HEAD[1], z: 1, r: 0, e: MV }];
const Results: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(KRES, t), prev = camAt(KRES, t - 1 / FPSP), draw = prog(t, 29.3, 31.4, SM), fillIn = prog(t, 32.35, 32.6), lift = 2700 * Math.pow(prog(t, 32.55, 33.55, MV), 1.4);
  const n = 1 + 2 * draw, land = pop(t, 31.45, 0.5);
  const { d: top, P } = curve(PTS, lift);
  const fill = `M -2600 3200 L -2600 ${P[0][1]} L ${P[0][0]} ${P[0][1]} ${top.slice(top.indexOf("C"))} L 2600 ${P[P.length - 1][1]} L 2600 3200 Z`;
  return (
    <AbsoluteFill>
      <DotRipple t={t} beat={31.45} look={look} gap={40} />
      <World cam={cam} prev={prev} id="bres">
        <div style={{ position: "absolute", left: -420, top: -700, fontFamily: UI, color: INK }}>
          <div style={{ fontSize: 250, fontWeight: 800, fontStretch: "118%", letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.06 * Math.max(0, land - 1)})`, transformOrigin: "0 100%" }}>{n.toFixed(1)}×</div>
          <div style={{ fontSize: 40, color: DIM, marginTop: 14 }}>more enquiries in six months</div>
        </div>
        <div style={{ position: "absolute", left: -440, top: 400, width: 880, height: 1.5, background: "rgba(220,222,226,.25)" }} />
        {MONTHS.map((m, i) => <div key={m} style={{ position: "absolute", left: PTS[i][0] - 60, width: 120, top: 424, textAlign: "center", fontFamily: UI, fontSize: 26, color: DIM, opacity: prog(t, 29.3 + i * 0.3, 29.6 + i * 0.3) }}>{m}</div>)}
        {PTS.map(([x, y], i) => draw * 5 >= i && <div key={i} style={{ position: "absolute", left: x - 5, top: y - 5, width: 10, height: 10, borderRadius: 5, background: "#fff", opacity: 0.6 }} />)}
        <Thread d={D3} p={draw} dot={0} width={3} />
        {fillIn > 0 && <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}><path d={fill} fill="#F2F2F0" opacity={fillIn} /></svg>}
      </World>
      {/* the point: rides the line head, then holds the frame centre while the white passes it (turns black) */}
      {(() => { const h = threadHead(D3, draw), s = screenOf(cam, h.x, h.y, 1080, 1920), black = lift > 300;
        return t >= 29.25 && <Dot x={s.x} y={s.y} color={black ? "#0A0A0B" : "#fff"} s={pop(t, 29.25, 0.4)} />; })()}
    </AbsoluteFill>
  );
};

// ───────── 12 · LOGO (fly out of the emblem's gap) ─────────
const LW = 820, LS = LW / 1030, LX = 540 - LW / 2, LY = 860 - (245 * LS) / 2, G = { x: LX + 96 * LS, y: LY + 129.6 * LS };
const KLOGO: CamKey[] = [{ t: 34.0, x: G.x, y: G.y, z: 12, r: 0 }, { t: 34.3, x: G.x, y: G.y, z: 11, r: 0 }, { t: 36.0, x: 540, y: 960, z: 1, r: 0, e: MV }];
const Logo: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(KLOGO, t), prev = camAt(KLOGO, t - 1 / FPSP), bars = prog(t, 34.08, 34.5), word = prog(t, 36.0, 36.8, MV);
  const g = screenOf(cam, G.x, G.y, 1080, 1920), fade = prog(t, 35.6, 36.0);
  return (
    <AbsoluteFill>
      <Dust t={t} look={look} n={60} />
      <World cam={cam} prev={prev} id="blogo">
        <svg width={200 * LS} height={245 * LS} viewBox="0 0 200 245" style={{ position: "absolute", left: LX, top: LY, overflow: "visible", opacity: bars, filter: `blur(${(1 - bars) * 3}px)` }}>
          <polygon points="171,21 171,66 22,170 22,128" fill="#fff" /><polygon points="171,88 171,136 46,222 46,176" fill="#fff" />
        </svg>
      </World>
      <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX, top: LY, width: LW, height: 245 * LS, mixBlendMode: "screen", filter: "grayscale(1) brightness(3)",
        clipPath: `inset(0 ${(1 - word) * 80}% 0 ${(210 / 1030) * 100}%)`, opacity: word }} />
      <Dot x={g.x} y={g.y} d={26} s={1 - fade} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: LY + 245 * LS + 90, textAlign: "center", fontFamily: UI, fontSize: 42, color: INK, opacity: prog(t, 36.9, 37.5), transform: `translateY(${(1 - prog(t, 36.9, 37.5)) * 16}px)` }}>Digital precision that builds reputation.</div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: LY + 245 * LS + 160, textAlign: "center", fontFamily: UI, fontSize: 32, color: DIM, opacity: prog(t, 37.6, 38.2) }}>WhatsApp 079 244 9607</div>
    </AbsoluteFill>
  );
};

const LiquidC = liquid().component as unknown as React.FC<Record<string, unknown>>;
export const Puzzle: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const camB = camAt(K34, t), pill = screenOf(camB, PILL.x, PILL.y, 1080, 1920), open = prog(t, 10.6, 11.3, MV);
  const lq = prog(t, 28.1, 29.1);
  return (
    <Finish t={t} look={look} hits={[10.25, 14.0, 31.45, 34.0]} glitches={[[33.9, 0.26]]} ca={0.6} grain={0.06} vignette={0.45} shake={9}>
      {t < 5.62 && <Dust t={t} look={look} n={80} />}
      {t < 3.12 && <Rings t={t} />}
      {win(t, 2.95, 5.62) && <AbsoluteFill><System t={t} /></AbsoluteFill>}
      {win(t, 5.55, 11.35) && <Build t={t} />}
      {win(t, 10.6, 17.62) && <Matte box={lerpBox({ x: pill.x, y: pill.y, w: PILL.w * camB.z, h: PILL.h * camB.z, r: (PILL.h / 2) * camB.z }, { x: 540, y: 960, w: 1080, h: 1920, r: 0 }, open)}><Invoice t={t} /></Matte>}
      {win(t, 17.6, 22.47) && <Orbit t={t} />}
      {win(t, 22.45, 25.0) && <Dive t={t} />}
      {win(t, 24.2, 29.15) && <Carousel t={t} />}
      {win(t, 28.1, 34.0) && (lq < 1 ? <LiquidC presentationDirection="entering" presentationProgress={lq} passedProps={{ color: "#2A2B30", x: 0.5, y: 0.69 }} presentationDurationInFrames={30}><Results t={t} /></LiquidC> : <Results t={t} />)}
      {t >= 34.0 && <Logo t={t} />}
    </Finish>
  );
};
