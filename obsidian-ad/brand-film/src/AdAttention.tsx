// OBS-AD-ATTENTION (9:16, 30 fps, 44.5 s) — Obsidian's ad: "your ads need that exact grip". Test cut without a voice:
// the script runs as kinetic captions at the reference's delivery (short phrase, ~1 s hold) until the VO arrives.
// Palette LOOKS.lumen (owner 2026-10-17): black + white main, electric blue light, a lightbulb-white focus point.
//  0.0 HOOK      macro: a needle creeps into a balloon ("A needle. A balloon. Four seconds of nothing. And you haven't
//                scrolled.") → POP at 5.0: hard black, rubber shards, a blue shockwave; the needle tip stays as THE POINT
//  5.0 GRIP      the point holds the frame; blue ripples on each line
//  9.0 FEED      a phone feed whips past (motion blur) — it stops on one post: the man standing still while everyone
//                blurs (photo 1) → TRACK MATTE: the post opens to full frame
// 12.6 BRANDS    four photos, each: AF reticle locks on the subject → zoom-out → campaign copy; SHUTTER (hexagon iris +
//                shutter sound) between photos
// 21.2 AGENCIES  one shot reframed 9:16 → 1:1 → 16:9 with crop marks
// 23.8 BUSINESS  the 16:9 crop becomes a site's hero (shape match cut); 3D orbit; the point clicks the CTA
// 26.4 SAAS      FLIP-TO-EDGE into a blue world; the point rides the chart; CRASH ZOOM + dutch on the number
// 29.2 RIDE      thread ride with lag + bank through a ring that morphs into a star; SLICE glitch; flip-to-edge
// 31.2 CAROUSEL  3D ring of the work around the point, depth of field, grid floor
// 33.5 LIGHT     the point grows into the white world (the lightbulb switches on); black type
// 38.6 LOGO      MATCH CUT (black point on white → white on black) + slices; fly out of the emblem gap; lockup; CTA
// Photos in public/ad1 are the owner's references (real brand marks) — test only, replace before publishing.
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import "./fonts";
import {
  LOOKS, SM, MV, cl, prog, hash, Finish, Dust, GridFloor, camAt, mixCam, follow, World, At, Thread, threadHead, Shape, Matte,
  lerpBox, screenOf, pop, Cam, CamKey,
} from "./fx";

export const FPSA = 30, DURA = 44.5;
const L = LOOKS.lumen, BLUE = L.accent, DEEP = L.deep, WHITE = "#F4F5F7", UI = L.ui;
const RIDE = Easing.bezier(0.55, 0, 0.3, 1), IN = Easing.bezier(0.55, 0, 1, 0.45);
const win = (t: number, a: number, b: number) => t >= a && t < b;
const P = (i: number) => staticFile(`ad1/p${i}.jpg`);

// ── script (test captions; replaced by the VO timing later) ──
const CAPS: [number, number, string, number, string?][] = [
  [0.6, 1.45, "A needle.", 380], [1.45, 2.3, "A balloon.", 380], [2.3, 3.6, "Four seconds of nothing.", 380], [3.7, 4.97, "And you haven't scrolled.", 380],
  [5.6, 6.9, "That's attention.", 1420], [7.0, 8.8, "Your ads need that exact grip.", 1420],
  [9.2, 10.9, "Most ads get scrolled past.", 250], [11.0, 12.9, "At Obsidian, we build the ones that don't.", 250],
  [13.0, 15.4, "For brands", 250], [15.4, 18.4, "that need to look as good as they are.", 250],
  [21.3, 23.9, "For agencies, businesses and SaaS platforms", 250], [24.0, 26.4, "that need to be understood in seconds.", 250],
  [29.4, 30.85, "One focus point.", 1500], [31.2, 32.5, "Every camera move, every frame,", 1560], [32.5, 33.55, "designed with one job:", 1560],
  [34.3, 35.9, "to show the quality behind your brand.", 1240, "#000"], [36.0, 37.2, "Attention gets you seen.", 1240, "#000"], [37.3, 38.55, "Quality gets you remembered.", 1240, "#000"],
];
const Captions: React.FC<{ t: number }> = ({ t }) => (
  <>{CAPS.filter(([a, b]) => t >= a - 0.05 && t < b).map(([a, b, text, y, color]) => {
    const words = text.split(" "), out = prog(t, b - 0.22, b);
    const hook = a < 5;                                                               // hook lines sit left, on the dark side of the balloon
    return <div key={a} style={{ position: "absolute", left: hook ? 64 : 70, right: hook ? 640 : 70, top: hook ? 560 : y, textAlign: hook ? "left" : "center", fontFamily: UI, fontSize: hook ? 54 : text.length > 34 ? 50 : 60,
      fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.15, color: color ?? WHITE, opacity: 1 - out, filter: `blur(${out * 8}px)` }}>
      {words.map((w, i) => { const k = prog(t, a + i * 0.07, a + i * 0.07 + 0.3); return <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateY(${(1 - k) * 14}px)` }}>{w}</span>; })}
    </div>;
  })}</>
);
// lightbulb point: white core, warm halo, optional blue light around it
const Bulb: React.FC<{ x: number; y: number; d?: number; s?: number; color?: string; blue?: number }> = ({ x, y, d = 26, s = 1, color = "#fff", blue = 0 }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: color, transform: `scale(${s})`,
    boxShadow: color === "#fff" ? `0 0 ${d * 0.9}px ${d * 0.25}px rgba(255,231,194,.9), 0 0 ${d * 3}px ${d * 0.6}px rgba(255,231,194,.28)${blue ? `, 0 0 ${d * 9}px ${d * 3}px rgba(47,107,255,${0.35 * blue})` : ""}` : "none" }} />
);
const BluePool: React.FC<{ x?: number; y?: number; a?: number; r?: number }> = ({ x = 50, y = 50, a = 0.28, r = 55 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(${r}% ${r * 0.6}% at ${x}% ${y}%, rgba(47,107,255,${a}) 0%, rgba(47,107,255,0) 100%)` }} />
);
const Ripple: React.FC<{ t: number; at: number; x?: number; y?: number; color?: string }> = ({ t, at, x = 540, y = 960, color = BLUE }) => {
  const k = prog(t, at, at + 0.9, Easing.out(Easing.cubic)); if (k <= 0 || k >= 1) return null;
  return <div style={{ position: "absolute", left: x - 400 * k, top: y - 400 * k, width: 800 * k, height: 800 * k, borderRadius: "50%", boxShadow: `0 0 0 ${2 + 2 * (1 - k)}px ${color}, 0 0 40px ${color}`, opacity: 1 - k }} />;
};

// ───────── HOOK ─────────
const C = { x: 460, y: 980 }, BALL = { x: 1180, y: 980, r: 720 };
const KH: CamKey[] = [{ t: 0, x: 540, y: 960, z: 1, r: 0 }, { t: 4.9, x: 575, y: 975, z: 1.38, r: -2, e: SM }];
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const cam0 = camAt(KH, t), drift = (s: number): Cam => ({ ...camAt(KH, s), x: camAt(KH, s).x + noise2D("hx", s * 0.4, 0) * 6, y: camAt(KH, s).y + noise2D("hy", 0, s * 0.4) * 6 });
  const cam = drift(t), prev = drift(t - 1 / FPSA);
  const tense = prog(t, 0, 4.95), tip = C.x - 520 + 515 * prog(t, 0.2, 4.35, SM) + 30 * prog(t, 4.35, 4.98, IN), dent = prog(t, 4.35, 4.98, IN);
  const sc = 1 + 0.014 * tense + Math.sin(t * 46) * 0.0018 * tense * tense;
  void cam0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <BluePool x={70} y={52} a={0.22} r={70} />
      <World cam={cam} prev={prev} id="bhook">
        <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <radialGradient id="latex" cx="0.3" cy="0.33" r="0.78">
              <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.28" stopColor="#F2F3F6" /><stop offset="0.6" stopColor="#C8CCD5" /><stop offset="0.88" stopColor="#6F7584" /><stop offset="1" stopColor="#2C3039" />
            </radialGradient>
            <linearGradient id="rim" x1="0" x2="1"><stop offset="0" stopColor="rgba(47,107,255,.55)" /><stop offset="0.2" stopColor="rgba(47,107,255,0)" /></linearGradient>
            <radialGradient id="dent"><stop offset="0" stopColor="rgba(30,34,44,.75)" /><stop offset="0.6" stopColor="rgba(30,34,44,.25)" /><stop offset="1" stopColor="rgba(30,34,44,0)" /></radialGradient>
            <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5D626C" /><stop offset="0.35" stopColor="#F6F7F9" /><stop offset="0.55" stopColor="#A9AEB8" /><stop offset="1" stopColor="#3F434B" /></linearGradient>
            <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          <g transform={`translate(${BALL.x} ${BALL.y}) scale(${sc}) translate(${-BALL.x} ${-BALL.y})`}>
            <circle cx={BALL.x} cy={BALL.y} r={BALL.r} fill="url(#latex)" />
            <circle cx={BALL.x} cy={BALL.y} r={BALL.r} fill="url(#rim)" />
            <ellipse cx={BALL.x - 300} cy={BALL.y - 330} rx={120} ry={60} fill="#fff" opacity={0.85} filter="url(#soft)" transform={`rotate(-35 ${BALL.x - 300} ${BALL.y - 330})`} />
            {dent > 0 && <>
              <ellipse cx={C.x + 30 + 30 * dent} cy={C.y} rx={40 + 110 * dent} ry={60 + 190 * dent} fill="url(#dent)" />
              <ellipse cx={C.x - 34} cy={C.y} rx={20 + 32 * dent} ry={26 + 80 * dent} fill="#000" filter="url(#soft)" />
            </>}
          </g>
          {/* the needle: tapered steel, a glint that slides along it */}
          <g transform={`rotate(-3 ${tip} ${C.y})`}>
            <rect x={tip - 1500} y={C.y - 9} width={1340} height={18} rx={9} fill="url(#steel)" />
            <polygon points={`${tip - 170},${C.y - 9} ${tip - 170},${C.y + 9} ${tip},${C.y + 0.6} ${tip},${C.y - 0.6}`} fill="url(#steel)" />
            <rect x={tip - 1500 + ((t * 260) % 1400)} y={C.y - 6} width={90} height={3} fill="#fff" opacity={0.55} />
          </g>
        </svg>
      </World>
    </AbsoluteFill>
  );
};
const Pop: React.FC<{ t: number }> = ({ t }) => {
  const k = prog(t, 5.0, 5.75), sw = prog(t, 5.0, 5.45, Easing.out(Easing.cubic)), mv = prog(t, 5.08, 5.9, MV);
  const c0 = { x: 540 + (C.x - 575) * 1.38, y: 960 + (C.y - 975) * 1.38 };          // contact on screen at the end of the hook
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {k < 1 && Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + hash(i, 2), v = 500 + 900 * hash(i, 3), x = c0.x + Math.cos(a) * v * k + 120 * k, y = c0.y + Math.sin(a) * v * k + 400 * k * k;
        return <svg key={i} width={1} height={1} style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: 1 - k, filter: `blur(${(1 - k) * 3}px)` }}>
          <path d="M -30 0 Q 0 -26 34 -4 Q 4 -10 -30 0 Z" fill="#E9EBF0" transform={`rotate(${(a * 180) / Math.PI + 720 * k * (hash(i, 4) - 0.5)}) scale(${0.6 + hash(i, 5)})`} />
        </svg>;
      })}
      {sw < 1 && <div style={{ position: "absolute", left: c0.x - 700 * sw, top: c0.y - 700 * sw, width: 1400 * sw, height: 1400 * sw, borderRadius: "50%", boxShadow: `0 0 0 ${3 * (1 - sw) + 1}px ${BLUE}, 0 0 60px ${BLUE}`, opacity: 1 - sw }} />}
      <Bulb x={c0.x + (540 - c0.x) * mv} y={c0.y + (960 - c0.y) * mv} s={pop(t, 5.0, 0.4)} blue={0.6} />
    </AbsoluteFill>
  );
};

// ───────── GRIP + FEED ─────────
const PH = { x: 540, y: 1010, w: 600, h: 1240 }, SCR = { w: 564, h: 1204 }, POST = 700, OURS = 9;
const feedOff = (t: number) => {                                                    // px scrolled; whip, then settle on OURS
  const end = OURS * POST;
  return end * Easing.bezier(0.45, 0, 0.12, 1)(prog(t, 9.25, 11.0, (x) => x));
};
const Feed: React.FC<{ t: number }> = ({ t }) => {
  const rise = prog(t, 8.5, 9.3, MV), off = feedOff(t), v = Math.abs(feedOff(t) - feedOff(t - 1 / FPSA)), push = prog(t, 12.0, 12.6, IN);
  const by = Math.min(28, v * 0.35);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <BluePool y={55} a={0.18} />
      <div style={{ position: "absolute", left: PH.x - PH.w / 2, top: PH.y - PH.h / 2 + (1 - rise) * 1300, width: PH.w, height: PH.h, borderRadius: 92, background: "#0B0C0F",
        boxShadow: "inset 0 0 0 2px #2A2D35, 0 60px 160px rgba(0,0,0,.8)", transform: `scale(${1 + 0.32 * push})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 18, top: 18, width: SCR.w, height: SCR.h, borderRadius: 76, overflow: "hidden", background: "#07080A" }}>
          <svg width={0} height={0} style={{ position: "absolute" }}><filter id="feedblur" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation={`0 ${by.toFixed(2)}`} /></filter></svg>
          <div style={{ position: "absolute", left: 0, top: SCR.h / 2 - POST / 2 - off, width: SCR.w, filter: by > 0.8 ? "url(#feedblur)" : undefined }}>
            {Array.from({ length: OURS + 2 }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: 0, top: i * POST, width: SCR.w, height: POST, padding: "26px 22px", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: i === OURS ? "#fff" : "#2A2D35" }} />
                  {i === OURS ? <div style={{ fontFamily: UI, fontSize: 26, color: WHITE, fontWeight: 600 }}>obsidian</div> : <div style={{ width: 120 + 80 * hash(i, 1), height: 14, borderRadius: 7, background: "#24272E" }} />}
                </div>
                {i === OURS ? <div style={{ width: "100%", height: 520, borderRadius: 26, overflow: "hidden", position: "relative" }}>
                  <Img src={P(1)} style={{ position: "absolute", width: 1280 / 1.32, height: 1920 / 1.32, left: 260 - 640 / 1.32, top: 260 - 960 / 1.32 - 51 }} />
                  {t > 11.0 && <Bulb x={260} y={260} d={22} s={pop(t, 11.05, 0.4)} />}</div>
                  : <div style={{ width: "100%", height: 520, borderRadius: 26, background: `linear-gradient(${120 + 90 * hash(i, 2)}deg, hsl(${200 + 60 * hash(i, 3)} 8% ${18 + 14 * hash(i, 4)}%), hsl(${210 + 40 * hash(i, 5)} 10% ${10 + 8 * hash(i, 6)}%))` }} />}
                <div style={{ display: "flex", gap: 16, marginTop: 18 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 34, height: 34, borderRadius: 17, background: "#1C1F25" }} />)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bulb x={540} y={960 + 48 * rise} s={1 - prog(t, 11.0, 11.2)} blue={0.4} />
    </AbsoluteFill>
  );
};
// on-screen rect of OUR post's photo when the feed has settled (for the track matte)
const postBox = (t: number) => {
  const push = 1 + 0.32 * prog(t, 12.0, 12.6, IN), ox = 540, oy = PH.y - PH.h / 2 + PH.h * 0.45;
  const top = PH.y - PH.h / 2 + 18 + SCR.h / 2 - POST / 2 + 26 + 62, cx = PH.x, cy = top + 260;
  return { x: ox + (cx - ox) * push, y: oy + (cy - oy) * push, w: (SCR.w - 44) * push, h: 520 * push, r: 26 * push };
};

// ───────── BRANDS: photos, reticle, zoom-out, copy, shutter ─────────
const SHOTS = [
  { i: 1, a: 12.6, b: 15.2, fx: 0.48, fy: 0.33, ar: 736 / 1104, copy: ["Stand still.", "Everyone else blurs."] },
  { i: 2, a: 15.2, b: 17.2, fx: 0.52, fy: 0.2, ar: 736 / 920, copy: ["Built to be", "noticed."] },
  { i: 3, a: 17.2, b: 19.2, fx: 0.4, fy: 0.5, ar: 736 / 1104, copy: ["Every detail,", "on purpose."] },
  { i: 4, a: 19.2, b: 21.2, fx: 0.5, fy: 0.3, ar: 736 / 920, copy: ["Own the", "frame."] },
];
const hexClip = (r: number, rot: number) => "polygon(" + Array.from({ length: 6 }, (_, k) => { const a = ((k * 60 + rot) * Math.PI) / 180; return `${540 + Math.cos(a) * r}px ${960 + Math.sin(a) * r}px`; }).join(",") + ")";
const Photo: React.FC<{ t: number; s: typeof SHOTS[number] }> = ({ t, s }) => {
  const h = 1920, w = h * s.ar, fx = (s.fx - 0.5) * w, fy = (s.fy - 0.5) * h;
  const keys: CamKey[] = s.i === 1 ? [{ t: s.a, x: 0, y: 0, z: 1, r: 0 }, { t: s.a + 0.7, x: 0, y: 0, z: 1, r: 0 }, { t: s.b, x: fx * 0.35, y: fy * 0.35, z: 1.12, r: 0 }]
    : [{ t: s.a, x: fx, y: fy, z: 1.85, r: 0 }, { t: s.a + 0.25, x: fx, y: fy, z: 1.8, r: 0 }, { t: s.a + 1.55, x: fx * 0.15, y: fy * 0.15, z: 1.04, r: 0, e: MV }];
  const cam = camAt(keys, t), prev = camAt(keys, t - 1 / FPSA), f = screenOf(cam, fx, fy, 1080, 1920);
  const lockK = pop(t, s.a + 0.12, 0.35), locked = t > s.a + 0.38, copyK = prog(t, s.a + 0.75, s.a + 1.15);
  const close = prog(t, s.b - 0.1, s.b, IN), open = s.i === 1 ? 1 : prog(t, s.a, s.a + 0.13, Easing.out(Easing.cubic));
  const r = 1320 * open * (1 - close);
  return (
    <AbsoluteFill style={{ clipPath: r < 1319 ? hexClip(Math.max(0.1, r), 30 * (1 - open) + 30 * close) : undefined, background: "#000" }}>
      <World cam={cam} prev={prev} id={`bp${s.i}`} blur={0.12}>
        <Img src={P(s.i)} style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h }} />
      </World>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)" }} />
      {/* autofocus reticle locks on the subject, the point at its centre */}
      {t < s.a + 1.2 && <div style={{ position: "absolute", left: f.x, top: f.y, opacity: 1 - prog(t, s.a + 0.9, s.a + 1.2) }}>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], k) => {
          const d = 70 * (1.4 - 0.4 * Math.min(1, lockK));
          return <div key={k} style={{ position: "absolute", left: sx * d - (sx > 0 ? 34 : 0), top: sy * d - (sy > 0 ? 34 : 0), width: 34, height: 34,
            borderLeft: sx < 0 ? `3px solid ${locked ? BLUE : "#fff"}` : undefined, borderRight: sx > 0 ? `3px solid ${locked ? BLUE : "#fff"}` : undefined,
            borderTop: sy < 0 ? `3px solid ${locked ? BLUE : "#fff"}` : undefined, borderBottom: sy > 0 ? `3px solid ${locked ? BLUE : "#fff"}` : undefined, opacity: Math.min(1, lockK) }} />;
        })}
        <Bulb x={0} y={0} d={18} s={Math.min(1, lockK)} />
      </div>}
      {/* campaign copy */}
      <div style={{ position: "absolute", left: 72, bottom: 330, fontFamily: L.display, fontWeight: 800, fontStretch: "118%", fontSize: 104, lineHeight: 0.98, letterSpacing: "-0.035em", color: WHITE }}>
        {s.copy.map((c, k) => { const q = prog(t, s.a + 0.75 + k * 0.12, s.a + 1.15 + k * 0.12); return <div key={k} style={{ opacity: q, filter: `blur(${(1 - q) * 14}px)`, transform: `translateY(${(1 - q) * 24}px)` }}>{c}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 76, bottom: 280, width: 360 * copyK, height: 2, background: BLUE }} />
    </AbsoluteFill>
  );
};
const Tag: React.FC<{ t: number; a: number; b: number; text: string; dark?: boolean }> = ({ t, a, b, text, dark }) => {
  const k = prog(t, a, a + 0.35) * (1 - prog(t, b - 0.2, b)); if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 72, top: 370, display: "flex", alignItems: "center", gap: 14, opacity: k, fontFamily: UI, fontSize: 34, color: dark ? "#000" : WHITE }}>
    <div style={{ width: 60 * k, height: 2, background: BLUE }} />{text}</div>;
};

// ───────── AGENCIES: one shot, every format ─────────
const FMT = [{ w: 960, h: 1706, l: "9:16 story" }, { w: 960, h: 960, l: "1:1 feed" }, { w: 960, h: 540, l: "16:9 video" }];
const fmtAt = (t: number) => {
  const k1 = prog(t, 21.6, 22.05, MV), k2 = prog(t, 22.65, 23.1, MV);
  const w = 960, h = FMT[0].h + (FMT[1].h - FMT[0].h) * k1 + (FMT[2].h - FMT[1].h) * k2;
  return { w, h, l: k2 > 0.5 ? FMT[2].l : k1 > 0.5 ? FMT[1].l : FMT[0].l };
};
const Agencies: React.FC<{ t: number }> = ({ t }) => {
  const { w, h, l } = fmtAt(t), x = 540 - w / 2, y = 960 - h / 2, open = prog(t, 21.2, 21.33, Easing.out(Easing.cubic));
  const IH = 1920, IW = IH * (736 / 920);
  return (
    <AbsoluteFill style={{ background: "#000", clipPath: open < 1 ? hexClip(Math.max(0.1, 1320 * open), 30 * (1 - open)) : undefined }}>
      <Img src={P(2)} style={{ position: "absolute", left: 540 - IW / 2, top: 0, width: IW, height: IH }} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,.66)", clipPath: `polygon(0 0, 1080px 0, 1080px 1920px, 0 1920px, 0 ${y}px, ${x}px ${y}px, ${x}px ${y + h}px, ${x + w}px ${y + h}px, ${x + w}px ${y}px, 0 ${y}px)` }} />
      {[[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].map(([cx, cy, sx, sy], k) => (
        <div key={k} style={{ position: "absolute", left: sx > 0 ? cx : cx - 46, top: sy > 0 ? cy : cy - 46, width: 46, height: 46,
          borderLeft: sx > 0 ? `3px solid ${WHITE}` : undefined, borderRight: sx < 0 ? `3px solid ${WHITE}` : undefined, borderTop: sy > 0 ? `3px solid ${WHITE}` : undefined, borderBottom: sy < 0 ? `3px solid ${WHITE}` : undefined }} />
      ))}
      <div style={{ position: "absolute", left: x, top: y - 56, fontFamily: UI, fontSize: 30, color: WHITE, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: BLUE }} />{l}</div>
      <Bulb x={540} y={960} d={20} />
    </AbsoluteFill>
  );
};

// ───────── BUSINESS: the 16:9 crop becomes a site's hero; 3D orbit; click ─────────
const Business: React.FC<{ t: number }> = ({ t }) => {
  const build = prog(t, 23.85, 24.45, MV), yaw = -16 * prog(t, 24.2, 25.9, SM) + 8 * prog(t, 25.0, 26.0), pitch = 6 * prog(t, 24.2, 25.4, SM);
  const flip = 98 * prog(t, 26.15, 26.42, IN), click = pop(t, 25.75, 0.35), cur = prog(t, 25.1, 25.65, MV);
  const IH = 1920, IW = IH * (736 / 920);
  // page: 960 wide; hero 960×540 sits where the 16:9 crop was (screen centre)
  return (
    <AbsoluteFill style={{ background: "#000", perspective: 1600 }}>
      <BluePool y={60} a={0.22 * build} />
      <div style={{ position: "absolute", left: 60, top: 960 - 270 - 150 * build, width: 960, transformStyle: "preserve-3d", transform: `rotateY(${yaw + flip}deg) rotateX(${pitch}deg)`, transformOrigin: "50% 40%" }}>
        <div style={{ height: 150 * build, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", background: "#0B0C0F", borderRadius: "28px 28px 0 0", opacity: build }}>
          <div style={{ fontFamily: L.display, fontWeight: 800, fontStretch: "118%", fontSize: 34, color: WHITE, letterSpacing: "-0.02em" }}>Velvet Concrete</div>
          <div style={{ display: "flex", gap: 30, fontFamily: UI, fontSize: 24, color: "#9AA0AD" }}><span>Shop</span><span>Lookbook</span><span>Journal</span></div>
        </div>
        <div style={{ position: "relative", width: 960, height: 540, overflow: "hidden" }}>
          <Img src={P(2)} style={{ position: "absolute", left: 480 - IW / 2, top: -(IH / 2 - 270), width: IW, height: IH }} />
          <div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: L.display, fontWeight: 800, fontStretch: "118%", fontSize: 88, lineHeight: 0.95, letterSpacing: "-0.04em", color: WHITE, opacity: prog(t, 24.3, 24.7), filter: `blur(${(1 - prog(t, 24.3, 24.7)) * 12}px)` }}>Worn to<br />be seen.</div>
          <div style={{ position: "absolute", right: 40, bottom: 48, padding: "18px 30px", borderRadius: 40, background: BLUE, fontFamily: UI, fontSize: 26, color: "#fff", opacity: prog(t, 24.5, 24.8), transform: `scale(${1 - 0.06 * Math.max(0, Math.min(1, click)) * (1 - prog(t, 25.9, 26.1))})` }}>Shop the drop</div>
        </div>
        <div style={{ height: 360 * build, overflow: "hidden", background: "#0B0C0F", borderRadius: "0 0 28px 28px", display: "flex", gap: 18, padding: 28 * build, boxSizing: "border-box", opacity: build }}>
          {[1, 3, 4].map((i) => <div key={i} style={{ flex: 1, borderRadius: 18, overflow: "hidden" }}><Img src={P(i)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>)}
        </div>
        {/* the point is the cursor: from the hero centre to the CTA */}
        <div style={{ position: "absolute", left: 480 + (790 - 480) * cur, top: 150 * build + 270 + (540 - 48 - 30 - 270) * cur }}>
          <Bulb x={0} y={0} d={22} />
          {click > 0 && click < 1.3 && <div style={{ position: "absolute", left: -40, top: -40, width: 80, height: 80, borderRadius: "50%", boxShadow: `0 0 0 2px ${WHITE}`, transform: `scale(${0.4 + prog(t, 25.75, 26.1) * 1.4})`, opacity: 1 - prog(t, 25.75, 26.1) }} />}
        </div>
      </div>
      <Tag t={t} a={23.9} b={26.3} text="Businesses" />
    </AbsoluteFill>
  );
};

// ───────── SAAS: blue world, chart ride, crash zoom ─────────
const VALS = [18, 22, 21, 27, 31, 30, 38, 44, 52], CPT = VALS.map((v, i) => [-400 + i * 100, 260 - (v - 15) * 11] as const);
const curveD = (() => { let d = `M ${CPT[0][0]} ${CPT[0][1]}`; for (let i = 0; i < CPT.length - 1; i++) { const p0 = CPT[Math.max(0, i - 1)], p1 = CPT[i], p2 = CPT[i + 1], p3 = CPT[Math.min(CPT.length - 1, i + 2)];
  d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`; } return d; })();
const KS: CamKey[] = [{ t: 26.4, x: 0, y: 0, z: 1, r: 0 }, { t: 27.95, x: 0, y: 0, z: 1.02, r: 0 }, { t: 28.15, x: -120, y: -330, z: 1.36, r: -4, e: Easing.bezier(0.2, 0.9, 0.3, 1) }, { t: 29.0, x: -60, y: -250, z: 1.2, r: -2 }];
const Saas: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(KS, t), prev = camAt(KS, t - 1 / FPSA), flipIn = -90 * (1 - prog(t, 26.42, 26.7, Easing.out(Easing.cubic)));
  const ride = prog(t, 26.75, 28.05, SM), n = Math.round(12480 + (48210 - 12480) * ride), land = pop(t, 28.1, 0.45);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 45%, #13265E 0%, ${DEEP} 55%, #03050C 100%)`, perspective: 1600 }}>
      <AbsoluteFill style={{ transform: `rotateY(${flipIn}deg)` }}>
        <World cam={cam} prev={prev} id="bsaas">
          <At x={0} y={0}><div style={{ width: 940, height: 1180, borderRadius: 40, background: "rgba(8,12,28,.82)", boxShadow: "inset 0 0 0 1.5px rgba(156,179,232,.18), 0 50px 140px rgba(0,0,0,.55)" }} /></At>
          <div style={{ position: "absolute", left: -420, top: -540, fontFamily: UI, color: WHITE }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 600 }}><div style={{ width: 22, height: 22, borderRadius: 6, background: BLUE }} />Pulse</div>
            <div style={{ fontSize: 28, color: "#9CB3E8", marginTop: 40 }}>Active users this week</div>
            <div style={{ fontFamily: L.display, fontSize: 168, fontWeight: 800, fontStretch: "112%", letterSpacing: "-0.045em", lineHeight: 1, marginTop: 10, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.05 * Math.max(0, land - 1)})`, transformOrigin: "0 100%" }}>{n.toLocaleString("en-US")}</div>
          </div>
          <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}>
            <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(47,107,255,.45)" /><stop offset="1" stopColor="rgba(47,107,255,0)" /></linearGradient></defs>
            <path d={`${curveD} L 400 420 L -400 420 Z`} fill="url(#area)" opacity={ride} />
            {[0, 1, 2].map((k) => <line key={k} x1={-420} x2={420} y1={420 - k * 160} y2={420 - k * 160} stroke="rgba(156,179,232,.14)" strokeWidth={1.5} />)}
          </svg>
          <Thread d={curveD} p={ride} dot={0} color={WHITE} width={4} />
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => <div key={d} style={{ position: "absolute", left: -400 + i * 133 - 40, width: 80, top: 450, textAlign: "center", fontFamily: UI, fontSize: 24, color: "#9CB3E8" }}>{d}</div>)}
        </World>
        {(() => { const h = threadHead(curveD, ride), s = screenOf(cam, h.x, h.y, 1080, 1920); return <Bulb x={s.x} y={s.y} s={pop(t, 26.7, 0.4)} blue={1} />; })()}
      </AbsoluteFill>
      <Tag t={t} a={26.5} b={29.15} text="SaaS platforms" />
    </AbsoluteFill>
  );
};

// ───────── RIDE + CAROUSEL ─────────
const HEAD0 = (() => { const h = threadHead(curveD, 1), c = camAt(KS, 29.2); return screenOf(c, h.x, h.y, 1080, 1920); })();
const D5 = `M ${HEAD0.x} ${HEAD0.y} C ${HEAD0.x + 300} ${HEAD0.y + 600}, -200 1200, 300 1800 S 900 2600, 540 3100`;
const RING = { x: 300, y: 1800 };
const ride5 = (s: number) => RIDE(cl((s - 29.25) / (31.0 - 29.25)));
const camRide = (s: number): Cam => {
  const c = follow((q) => threadHead(D5, ride5(q)), s, { lag: 0.15, bank: 0.08, z: 1 - 0.25 * Math.sin(Math.PI * ride5(s)) });
  return mixCam({ x: 540, y: 960, z: 1, r: 0 }, c, prog(s, 29.2, 29.6));
};
const Ride: React.FC<{ t: number }> = ({ t }) => {
  const cam = camRide(t), prev = camRide(t - 1 / FPSA), u = ride5(t);
  const k = prog(t, 29.95, 30.5, MV), flip = 90 * prog(t, 30.95, 31.2, IN);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Dust t={t} look={L} n={90} />
      <World cam={cam} prev={prev} id="bride">
        <At x={RING.x} y={RING.y} style={{ transform: `translate(-50%,-50%) perspective(1200px) rotateY(${flip}deg)` }}><div style={{ position: "relative" }}>
          <Shape k={k} r={230} spin={20 * u + 45 * k} nodes={1 - k} stroke={WHITE} glow={22} />
        </div></At>
        <Thread d={D5} p={u} dot={0} color={WHITE} />
      </World>
      {(() => { const h = threadHead(D5, u), s = screenOf(cam, h.x, h.y, 1080, 1920); return <Bulb x={s.x} y={s.y} blue={0.6} />; })()}
    </AbsoluteFill>
  );
};
const CARDS = [1, 2, 3, 4, 2, 3];
const Carousel: React.FC<{ t: number }> = ({ t }) => {
  const app = prog(t, 31.15, 31.8, MV), spin = -120 * prog(t, 31.3, 33.6, SM);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: 0.5 * app }}><GridFloor t={t} look={{ ...L, line: "rgba(47,107,255,.35)" }} speed={0.5} tilt={74} cell={110} /></AbsoluteFill>
      <BluePool y={48} a={0.2 * app} />
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 42%" }}>
        <div style={{ position: "absolute", left: 540, top: 900, transformStyle: "preserve-3d", opacity: app, transform: `scale(${0.3 + 0.7 * app}) translateZ(-640px) rotateX(-8deg) rotateY(${spin}deg)` }}>
          {CARDS.map((p, i) => { const a = (((i * 60 + spin) % 360) + 360) % 360, c = Math.cos((a * Math.PI) / 180);
            return <Img key={i} src={P(p)} style={{ position: "absolute", left: -190, top: -300, width: 380, height: 600, borderRadius: 26, objectFit: "cover", transform: `rotateY(${i * 60}deg) translateZ(640px)`,
              filter: `brightness(${0.3 + 0.7 * Math.max(0, c)}) blur(${(1 - c) * 3}px)`, boxShadow: "0 0 0 1.5px rgba(255,255,255,.14)", backfaceVisibility: "hidden" }} />; })}
        </div>
      </AbsoluteFill>
      <Bulb x={540} y={1330} blue={0.8} s={app} />
    </AbsoluteFill>
  );
};

// ───────── LIGHT (white world) + LOGO ─────────
const Light: React.FC<{ t: number }> = ({ t }) => {
  const grow = prog(t, 33.5, 34.25, IN);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 1300 * grow, top: 1330 - 370 * grow - 1300 * grow, width: 2600 * grow, height: 2600 * grow, borderRadius: "50%", background: WHITE,
        boxShadow: grow < 1 ? "0 0 120px 40px rgba(255,231,194,.6)" : undefined }} />
      {t > 34.2 && <AbsoluteFill style={{ background: `radial-gradient(70% 40% at 50% 45%, rgba(47,107,255,.10), rgba(47,107,255,0)), ${WHITE}` }}>
        <Bulb x={540} y={960} color="#000" d={26} s={1 + 0.15 * Math.max(pop(t, 36.0, 0.4) - 1, 0) + 0.15 * Math.max(pop(t, 37.3, 0.4) - 1, 0)} />
        <Ripple t={t} at={36.0} color="rgba(47,107,255,.7)" /><Ripple t={t} at={37.3} color="rgba(47,107,255,.7)" />
      </AbsoluteFill>}
    </AbsoluteFill>
  );
};
const LW = 820, LS = LW / 1030, LX = 540 - LW / 2, LY = 860 - (245 * LS) / 2, G = { x: LX + 96 * LS, y: LY + 129.6 * LS };
const KL: CamKey[] = [{ t: 38.6, x: G.x, y: G.y, z: 12, r: 0 }, { t: 38.9, x: G.x, y: G.y, z: 11, r: 0 }, { t: 40.3, x: 540, y: 960, z: 1, r: 0, e: MV }];
const Logo: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(KL, t), prev = camAt(KL, t - 1 / FPSA), bars = prog(t, 38.65, 39.05), word = prog(t, 40.3, 41.1, MV), g = screenOf(cam, G.x, G.y, 1080, 1920), fade = prog(t, 39.9, 40.3);
  const cta = pop(t, 41.9, 0.5);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <BluePool y={45} a={0.2 * word} />
      <World cam={cam} prev={prev} id="blogo">
        <svg width={200 * LS} height={245 * LS} viewBox="0 0 200 245" style={{ position: "absolute", left: LX, top: LY, overflow: "visible", opacity: bars }}>
          <polygon points="171,21 171,66 22,170 22,128" fill="#fff" /><polygon points="171,88 171,136 46,222 46,176" fill="#fff" />
        </svg>
      </World>
      <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX, top: LY, width: LW, height: 245 * LS, mixBlendMode: "screen", filter: "grayscale(1) brightness(3)",
        clipPath: `inset(0 ${(1 - word) * 80}% 0 ${(210 / 1030) * 100}%)`, opacity: word }} />
      <Bulb x={g.x} y={g.y} d={24} s={1 - fade} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: LY + 245 * LS + 80, textAlign: "center", fontFamily: UI, fontSize: 42, color: WHITE, opacity: prog(t, 41.1, 41.7), transform: `translateY(${(1 - prog(t, 41.1, 41.7)) * 16}px)` }}>Digital precision that builds reputation.</div>
      {cta > 0 && <div style={{ position: "absolute", left: 540 - 170, top: LY + 245 * LS + 190, width: 340, height: 92, borderRadius: 46, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: UI, fontSize: 36, fontWeight: 500, color: "#fff", transform: `scale(${Math.min(1.06, cta)})`, boxShadow: "0 0 60px rgba(47,107,255,.55)" }}>Message us</div>}
      <div style={{ position: "absolute", left: 0, width: 1080, top: LY + 245 * LS + 320, textAlign: "center", fontFamily: UI, fontSize: 30, color: "#9AA0AD", opacity: prog(t, 42.3, 42.8) }}>Link in bio, or WhatsApp 079 244 9607</div>
    </AbsoluteFill>
  );
};

export const AdAttention: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const open = prog(t, 12.6, 13.25, MV), pb = postBox(t);
  return (
    <Finish t={t} look={L} hits={[5.0, 11.05, 28.1, 38.6]} glitches={[[30.9, 0.24], [38.52, 0.22]]} ca={0.5} grain={0.055} vignette={0.42} shake={10}>
      {t < 5.0 && <Hook t={t} />}
      {win(t, 5.0, 9.4) && <AbsoluteFill style={{ background: "#000" }}><BluePool a={0.16 + 0.1 * Math.sin(t * 1.4) ** 2} /><Dust t={t} look={L} n={60} />
        {t >= 5.9 && <Bulb x={540} y={960} blue={0.7} />}
        <Ripple t={t} at={5.6} /><Ripple t={t} at={7.0} /></AbsoluteFill>}
      {win(t, 5.0, 6.0) && <Pop t={t} />}
      {win(t, 8.5, 13.3) && <Feed t={t} />}
      {win(t, 12.6, 21.4) && (() => {
        const shots = SHOTS.filter((s) => t >= s.a - 0.001 && t < s.b + 0.14);
        const content = <>{shots.map((s) => <Photo key={s.i} t={t} s={s} />)}</>;
        return t < 13.25 ? <Matte box={lerpBox(pb, { x: 540, y: 960, w: 1080, h: 1920, r: 0 }, open)}>{content}</Matte> : content;
      })()}
      {win(t, 12.6, 21.2) && <Tag t={t} a={13.0} b={21.15} text="Brands" />}
      {win(t, 21.2, 23.9) && <><Agencies t={t} /><Tag t={t} a={21.35} b={23.85} text="Agencies" /></>}
      {win(t, 23.85, 26.45) && <Business t={t} />}
      {win(t, 26.42, 29.25) && <Saas t={t} />}
      {win(t, 29.2, 31.25) && <Ride t={t} />}
      {win(t, 31.15, 34.3) && <Carousel t={t} />}
      {win(t, 33.5, 38.6) && <Light t={t} />}
      {t >= 38.6 && <Logo t={t} />}
      <Captions t={t} />
    </Finish>
  );
};
