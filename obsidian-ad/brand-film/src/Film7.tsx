// OBSIDIAN × lovio — a frame-for-frame study of ref16 (zelios' "lovio" ad, 51.7 s, 16:9) with Obsidian's footage,
// hero images and brand (monochrome: black · silver · white; emblem in white). Every beat sits on lovio's timing
// (motion-studio/teardown/ref14-16 + the 4 fps strips). Footage: public/footage (owner-generated, 2026-10-10).
//  0.0 "Build" typed → the prompt bar · cursor clicks send · dithered panels → Irona dashboard (lovio: Oceanview)
//  3.8 bloom → Solt portrait hero builds (VISION) · 5.2 bloom → CRAFT chrome hero (NATURE) · 7.0 train window (V1),
//  the site inside the window, push through → lake (V2) "This isn't" · "a prototype" · "It's live" pill push
// 13.5 tennis (V3 keyed) "OWN THE COURT" letters · 16.1 "Move" + chrome spiral, "Change the layout" click → black
// 21.0 rolling list with thumbnails · 25.2 "Premium sites used to take months" (V4 keyed) · 28.4 field (V7 + V4)
// 30.3 emblem + OBSIDIAN · "N◆w / it ◆ starts / with a brief" · "Build a mo|" → prompt card · Faster ideas (V7) ·
// Faster launches (Deploy click) · Faster products (V8) · Faster everything (V2, silver) · Great brands ·
// "no longer start / with templates" + pile of heroes · 3D emblem · OBSIDIAN
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { E, prog, lerp, win, h } from "./Film2";

export const FPS7 = 60;
export const DUR7 = 52;
const W = 1920, H = 1080, CX = 960, CY = 540;
const SANS = "Inter, Helvetica, Arial, sans-serif";
const WIDE = "ArchivoW, Helvetica, Arial, sans-serif";
const MONO = "JBMono, ui-monospace, monospace";
const lin = (x: number) => x;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const typed = (str: string, s: number, a: number, b: number) => str.slice(0, Math.round(str.length * prog(s, a, b, lin)));
const img = (n: string) => staticFile("heroes2/" + n);
const ft = (n: string) => staticFile("footage/" + n);
const F = (sec: number) => Math.round(sec * FPS7);

// ---------------------------------------------------------------- monochrome versions of lovio's gradients
const BG = {
  open: "radial-gradient(120% 95% at 50% 125%, #F1F1F4 0%, #A9AAB3 30%, #34353C 64%, #0A0A0C 100%)",
  deep: "radial-gradient(85% 95% at 88% 82%, #D3D5DC 0%, #7C7F8A 26%, #22232A 60%, #08080A 100%)",
  white: "radial-gradient(120% 120% at 50% 0%, #FFFFFF 0%, #F3F3F5 58%, #E6E7EC 100%)",
  sky: "linear-gradient(180deg, #8F949E 0%, #C3C6CD 55%, #ECEDF0 100%)",
  grey: "linear-gradient(180deg, #C9CBD1 0%, #E7E8EC 70%, #F1F2F4 100%)",
  horizon: "radial-gradient(140% 75% at 50% 118%, #F4F4F7 0%, #BEBFC7 26%, #3C3D44 58%, #0A0A0C 100%)",
};
const GHOST = "linear-gradient(90deg, rgba(255,255,255,.95), rgba(255,255,255,.35))";
const INKG = "linear-gradient(90deg, #1A1A1E, #8C8E96)";

// ---------------------------------------------------------------- UI parts
const Hand: React.FC<{ x: number; y: number; press?: number; op?: number }> = ({ x, y, press = 0, op = 1 }) => (
  <svg width={52} height={52} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 19.5, top: y - 3.9, opacity: op, transform: `scale(${1 - press * 0.14})`, transformOrigin: "19.5px 3.9px", filter: "drop-shadow(0 5px 8px rgba(0,0,0,.35))", overflow: "visible" }}>
    <path d="M9 1.8c-1 0-1.8.8-1.8 1.8v8.6L5.6 10.8c-.8-.7-2-.6-2.6.2-.6.7-.6 1.7 0 2.4l4.8 5.6c1 1.2 2.5 1.9 4.1 1.9h3.4c2.9 0 5.2-2.3 5.2-5.2v-4.6c0-1-.8-1.8-1.8-1.8s-1.8.8-1.8 1.8v-.8c0-1-.8-1.8-1.8-1.8s-1.8.8-1.8 1.8V9c0-1-.8-1.8-1.8-1.8s-1.8.8-1.8 1.8V3.6C10.8 2.6 10 1.8 9 1.8z" fill="#fff" stroke="#111" strokeWidth={1.1} strokeLinejoin="round" />
  </svg>
);
const Blur: React.FC<{ k: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ k, children, style }) => (
  <span style={{ display: "inline-block", opacity: cl01(k), filter: `blur(${(1 - cl01(k)) * 14}px)`, ...style }}>{children}</span>
);
const GradText: React.FC<{ g: string; children: React.ReactNode }> = ({ g, children }) => <span style={{ background: g, WebkitBackgroundClip: "text", color: "transparent" }}>{children}</span>;
// the glass prompt bar (lovio's anchor)
const Bar: React.FC<{ w: number; text: string; caret: boolean; send?: number; dark?: boolean; ink?: boolean; scale?: number }> = ({ w, text, caret, send = 0, dark = false, ink = false, scale = 1 }) => (
  <div style={{ width: w, height: 66, borderRadius: 33, transform: `scale(${scale})`, background: ink ? "rgba(255,255,255,.5)" : dark ? "rgba(18,18,22,.42)" : "rgba(255,255,255,.16)", border: "1.5px solid rgba(255,255,255,.42)", boxShadow: ink ? "0 18px 50px rgba(30,32,40,.14), inset 0 1px 0 rgba(255,255,255,.7)" : "0 18px 50px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.35)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", padding: "0 10px 0 28px", fontFamily: SANS, fontSize: 21, fontWeight: 400, color: ink ? "#1A1B20" : "rgba(255,255,255,.92)", gap: 10 }}>
    <div style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{text}<span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, verticalAlign: "-4px", background: ink ? "#1A1B20" : "#fff", opacity: caret ? 0.9 : 0 }} /></div>
    <svg width={22} height={22} viewBox="0 0 24 24" style={{ opacity: 0.75 }}><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5 11a7 7 0 0 0 14 0 M12 18v3" stroke={ink ? "#2A2B31" : "#fff"} strokeWidth={1.6} fill="none" strokeLinecap="round" /></svg>
    <div style={{ width: 44, height: 44, borderRadius: 22, background: ink ? (send > 0.5 ? "#000" : "#16171C") : send > 0.5 ? "#FFFFFF" : "rgba(255,255,255,.88)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - send * 0.12})` }}>
      <svg width={20} height={20} viewBox="0 0 24 24"><path d="M12 19V5 M6 11l6-6 6 6" stroke={ink ? "#fff" : "#111"} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  </div>
);
const Card: React.FC<{ w: number; hh: number; children?: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ w, hh, children, dark = false, style }) => (
  <div style={{ width: w, height: hh, borderRadius: 18, padding: "16px 20px", background: dark ? "rgba(16,16,20,.72)" : "rgba(255,255,255,.82)", border: `1px solid ${dark ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.95)"}`, boxShadow: "0 18px 50px rgba(0,0,0,.18)", backdropFilter: "blur(14px)", fontFamily: SANS, color: dark ? "#fff" : "#16161A", boxSizing: "border-box", ...style }}>{children}</div>
);
const Photo: React.FC<{ src: string; w: number; hh: number; pos?: string; r?: number; style?: React.CSSProperties }> = ({ src, w, hh, pos = "50% 50%", r = 14, style }) => (
  <div style={{ width: w, height: hh, borderRadius: r, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,.25)", border: "3px solid #fff", ...style }}><Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} /></div>
);
const BOX = { x: 175, y: 45, w: 1570, hh: 965 };
// the rolling list's thumbnail slot (the Reshape page shrinks into it)
const LT = { x: 182, w: 440, hh: 248 };
const count = (s: number, a: number, b: number, v0: number, v1: number, dec = 0) => (lerp(v0, v1, prog(s, a, b, Easing.bezier(0.3, 0, 0.2, 1)))).toFixed(dec);

// the emblem — white (owner: black or white only)
const BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]];
const EmblemSVG: React.FC<{ size: number; fill?: string; style?: React.CSSProperties }> = ({ size, fill = "url(#bar7)", style }) => (
  <svg width={size * 200 / 245} height={size} viewBox="0 0 200 245" style={{ overflow: "visible", ...style }}>
    <defs><linearGradient id="bar7" x1="171" y1="21" x2="40" y2="215" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C8C8CC" /></linearGradient></defs>
    {BARS.map((b, i) => <polygon key={i} points={b.map((p) => p.join(",")).join(" ")} fill={fill} />)}
  </svg>
);
// emblem + wordmark: our SVG emblem stands where the lockup's emblem is; the real wordmark (white) wipes in beside it
const LockLW = 860, LockLS = LockLW / 1030;
const Lockup: React.FC<{ s: number; t0: number; x: number; y: number; slide?: number }> = ({ s, t0, x, y }) => {
  const word = prog(s, t0, t0 + 0.55, E.out);
  return (
    <div style={{ position: "absolute", left: x - LockLW / 2, top: y - 122 * LockLS, width: LockLW, height: 245 * LockLS }}>
      <div style={{ position: "absolute", left: 0, top: 0 }}><EmblemSVG size={245 * LockLS} /></div>
      <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: 0, top: 0, width: LockLW, height: 245 * LockLS, mixBlendMode: "screen", filter: "grayscale(1) brightness(1.75) contrast(1.15)", clipPath: `inset(0 ${(1 - word) * 78}% 0 22%)`, opacity: word }} />
    </div>
  );
};

// ---------------------------------------------------------------- the train window (tracked from V1, every 0.25 s)
const TR: number[][] = [[0, 670, 1277, 285, 698], [1, 641, 1310, 263, 715], [2, 598, 1347, 247, 749], [3, 547, 1390, 227, 792], [3.5, 518, 1418, 224, 823], [4, 481, 1449, 214, 856], [4.5, 440, 1487, 194, 887], [5, 400, 1531, 177, 925], [5.5, 367, 1563, 155, 949], [6, 318, 1607, 129, 986], [6.5, 263, 1661, 100, 1028], [7, 204, 1715, 57, 1062], [7.5, 130, 1776, 7, 1110], [8, 60, 1850, -40, 1160]];
const winRect = (ts: number) => {
  let i = 0; while (i < TR.length - 2 && TR[i + 1][0] < ts) i++;
  const a = TR[i], b = TR[i + 1], k = cl01((ts - a[0]) / (b[0] - a[0]));
  return { x0: lerp(a[1], b[1], k), x1: lerp(a[2], b[2], k), y0: lerp(a[3], b[3], k), y1: lerp(a[4], b[4], k) };
};
const TRAIN = { t0: 6.95, t1: 9.42, src: 3.4, rate: 1.8 };

// ================================================================ film
export const Film7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const L: React.ReactNode[] = [];
  const add = (n: React.ReactNode) => L.push(n);

  // ===== 0–0.66 · "Build" typed big, then it shrinks into the bar's text slot =====
  const shiftBG = prog(s, 1.72, 2.45, E.io);
  if (s < 4.15) add(<AbsoluteFill key="bg0" style={{ background: BG.open }} />);
  // lovio: after the click the backdrop turns into a soft multi-tone field with a fine dither (no flash)
  if (shiftBG > 0 && s < 4.15) add(<AbsoluteFill key="bg1" style={{ opacity: shiftBG, background: "radial-gradient(80% 90% at 78% 18%, #EDEEF1 0%, #A9ACB5 32%, #4A4C55 66%, #121216 100%)" }}><AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.5) 1px, transparent 1.4px)", backgroundSize: "7px 7px", opacity: 0.22, WebkitMaskImage: "linear-gradient(120deg, #000 0%, transparent 55%)", maskImage: "linear-gradient(120deg, #000 0%, transparent 55%)" }} /></AbsoluteFill>);
  if (s < 0.7) {
    const big = "Build".slice(0, Math.min(5, Math.floor(prog(s, 0.0, 0.3, lin) * 5.99)));
    const m = prog(s, 0.38, 0.62, Easing.bezier(0.6, 0, 0.2, 1));
    add(<div key="big" style={{ position: "absolute", left: lerp(685, 462, m), top: lerp(CY - 140, CY - 19, m), transform: `scale(${lerp(1, 0.14, m)})`, transformOrigin: "0 0", fontFamily: SANS, fontWeight: 500, fontSize: 250, lineHeight: 1, letterSpacing: "-0.045em", color: `rgba(255,255,255,${lerp(0.62, 0.92, m)})`, whiteSpace: "nowrap", opacity: 1 - prog(s, 0.6, 0.68) }}>{big}<span style={{ display: "inline-block", width: 6, height: 210, marginLeft: 8, verticalAlign: "-28px", background: "rgba(255,255,255,.8)", opacity: 1 - m }} /></div>);
  }
  // ===== 1.85–3.95 · the dashboard hero (Irona): the panels ARE its cards; the image fills the container =====
  const DASH = [{ x: 1352, y: 150, w: 370, hh: 130, t: "Occupancy", b: 83, u: "%" }, { x: 1352, y: 302, w: 370, hh: 130, t: "Bookings this month", b: 8.8, u: "k", d: 1 }, { x: 236, y: 800, w: 400, hh: 130, t: "Enquiries", b: 64, u: "" }];
  const DECO = [[300, 150, 520, 290], [720, 96, 470, 180], [700, 770, 560, 210]];
  const SOLT_IN = prog(s, 3.58, 4.0, Easing.bezier(0.4, 0, 0.2, 1));
  if (s > 1.85 && s < 4.05) {
    const frame = prog(s, 2.25, 2.6, E.out);
    const img0 = prog(s, 2.5, 3.0, Easing.bezier(0.3, 0, 0.2, 1));
    const deco = 1 - prog(s, 2.6, 2.9);
    const cardOut = prog(s, 3.5, 3.72);
    add(<AbsoluteFill key="iro">
      <Img src={img("h10_irona.jpg")} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: "blur(40px) brightness(.85)", opacity: prog(s, 2.6, 3.0) }} />
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.hh, borderRadius: 30, overflow: "hidden", opacity: frame, transform: `scale(${lerp(0.97, 1, frame)})`, background: "linear-gradient(135deg, rgba(30,31,36,.55), rgba(120,122,130,.35))", boxShadow: "0 30px 90px rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.45)" }}>
        <Img src={img("h10_irona.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: img0, filter: `blur(${(1 - img0) * 26}px)`, transform: `scale(${lerp(1.05, 1, img0)})`, WebkitMaskImage: `linear-gradient(90deg, #000 ${img0 * 140 - 40}%, transparent ${img0 * 140}%)`, maskImage: `linear-gradient(90deg, #000 ${img0 * 140 - 40}%, transparent ${img0 * 140}%)` }} />
      </div>
      {DECO.map(([x, y, w, hh], i) => { const k = prog(s, 1.9 + i * 0.09, 2.35 + i * 0.09, E.out); return <div key={i} style={{ position: "absolute", left: x + (1 - k) * 90, top: y, width: w, height: hh, borderRadius: 18, opacity: k * deco, transform: `scale(${lerp(0.9, 1, k)})`, background: `linear-gradient(${120 + i * 40}deg, rgba(236,237,241,.9), rgba(150,152,160,.75) 55%, rgba(60,62,70,.7))`, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.22)" }}><div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.55) 1.4px, transparent 1.7px)", backgroundSize: "8px 8px", mixBlendMode: "overlay" }} /></div>; })}
      {DASH.map((c, i) => { const k = prog(s, 1.95 + i * 0.11, 2.4 + i * 0.11, E.out), fill = prog(s, 2.3 + i * 0.08, 2.6 + i * 0.08); return <div key={`d${i}`} style={{ position: "absolute", left: c.x + (1 - k) * 90, top: c.y, width: c.w, height: c.hh, transform: `scale(${lerp(0.9, 1, k)})`, opacity: k * (1 - cardOut), filter: `blur(${cardOut * 10}px)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg, rgba(236,237,241,.9), rgba(140,142,150,.75) 60%, rgba(60,62,70,.7))", opacity: 1 - fill }}><div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.55) 1.4px, transparent 1.7px)", backgroundSize: "8px 8px", mixBlendMode: "overlay" }} /></div>
        <div style={{ position: "absolute", inset: 0, opacity: fill }}><Card w={c.w} hh={c.hh}><div style={{ fontSize: 16, opacity: 0.6 }}>{c.t}</div><div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 4 }}>{count(s, 2.3, 3.9, 0, c.b, c.d ?? 0)}{c.u}</div></Card></div>
      </div>; })}
    </AbsoluteFill>);
  }
  // ===== 3.58–5.6 · Solt (lovio VISION): revealed from the centre of the same container, over-bright, then it settles =====
  if (s > 3.55 && s < 5.9) {
    const settle = prog(s, 3.75, 4.15, Easing.bezier(0.3, 0, 0.2, 1));
    const reveal = (a: number) => prog(s, a, a + 0.28, E.out);
    const bands = [{ c: [0, 0, 0, 86], a: 4.12 }, { c: [58, 56, 0, 4], a: 4.2 }, { c: [69, 56, 0, 4], a: 4.3 }, { c: [80, 56, 0, 4], a: 4.4 }, { c: [70, 0, 10, 62], a: 4.52 }, { c: [86, 0, 2, 80], a: 4.62 }];
    const all = prog(s, 4.65, 4.95);
    const r = SOLT_IN * 92 + 0.1;
    const mask = SOLT_IN < 1 ? `radial-gradient(ellipse ${r}% ${r}% at 50% 46%, #000 62%, transparent 100%)` : "none";
    add(<AbsoluteFill key="solt" style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <Img src={img("h03_solt.jpg")} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: "blur(40px) brightness(.62)" }} />
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.hh, borderRadius: 30, overflow: "hidden", background: "#0B0B0D", boxShadow: "0 30px 90px rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.18)", filter: `brightness(${lerp(1.75, 1, settle)})` }}>
        <Img src={img("h03_solt.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `blur(${lerp(14, 8, settle)}px) brightness(1.1)` }} />
        {bands.map((b, i) => <Img key={i} src={img("h03_solt.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(${b.c[0]}% ${b.c[1]}% ${b.c[2]}% ${b.c[3]}%)`, opacity: reveal(b.a), filter: `blur(${(1 - reveal(b.a)) * 10}px)` }} />)}
        <Img src={img("h03_solt.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: all }} />
      </div>
      {(() => { const kk = prog(s, 4.38, 4.7, E.back); return <div style={{ position: "absolute", left: 1400, top: 240, transform: `scale(${kk}) rotate(${(1 - kk) * -6}deg)`, opacity: kk }}><Photo src={img("h03_solt.jpg")} w={300} hh={190} pos="60% 28%" /></div>; })()}
    </AbsoluteFill>);
    // the leading edge of the reveal glows softly (lovio's halo), only while it opens
    if (SOLT_IN > 0 && SOLT_IN < 1) add(<AbsoluteFill key="soltglow" style={{ background: `radial-gradient(ellipse ${r + 6}% ${r + 6}% at 50% 46%, rgba(255,255,255,0) 55%, rgba(236,238,244,${0.35 * Math.sin(Math.PI * SOLT_IN)}) 80%, rgba(255,255,255,0) 100%)` }} />);
  }
  // ===== 5.15–7.05 · CRAFT (lovio NATURE): soft blobs dissolve the next hero in, blurred, then it sharpens =====
  if (s > 5.12 && s < 7.06) {
    const blob = (cx: number, cy: number, a: number) => { const rr = prog(s, a, a + 0.5, Easing.bezier(0.4, 0, 0.3, 1)) * 105; return `radial-gradient(ellipse ${rr + 0.1}% ${rr * 1.5 + 0.1}% at ${cx}% ${cy}%, #000 55%, transparent 100%)`; };
    const done = s > 5.85;
    const mask = done ? "none" : [blob(76, 80, 5.15), blob(28, 68, 5.22), blob(58, 24, 5.29), blob(10, 18, 5.35)].join(", ");
    const sharp = prog(s, 5.3, 5.85, Easing.bezier(0.3, 0, 0.2, 1));
    const grow = prog(s, 6.7, 7.05, E.in);
    const IS = BOX.w / (2560 * 0.66), IW = 2560 * IS, IH = 1664 * IS, IL = -0.34 * 2560 * IS, IT = -0.2 * 1664 * IS;
    const letters = "CRAFT".split("");
    add(<AbsoluteFill key="craft" style={{ WebkitMaskImage: mask, maskImage: mask, transform: `scale(${lerp(1, 1.07, grow)})` }}>
      <Img src={img("h07_mindful.jpg")} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: "blur(40px) brightness(.55)" }} />
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.hh, borderRadius: 30, overflow: "hidden", background: "#050506", boxShadow: "0 30px 90px rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.14)", filter: `blur(${(1 - sharp) * 22}px)` }}>
        <Img src={img("h07_mindful.jpg")} style={{ position: "absolute", left: IL, top: IT, width: IW, height: IH }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: BOX.hh, background: "linear-gradient(90deg, #050506 0%, #050506 22%, rgba(5,5,6,0) 52%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 760, background: "radial-gradient(120% 100% at 0% 0%, #050506 62%, rgba(5,5,6,0) 100%)" }} />
        <div style={{ position: "absolute", left: 0, width: BOX.w, top: 120, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", fontSize: 280, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {letters.map((c, i) => { const kk = prog(s, 5.62 + i * 0.06, 6.0 + i * 0.06, E.out); return <span key={i} style={{ display: "inline-block", opacity: kk, transform: `translateY(${(1 - kk) * 50}px)`, filter: `blur(${(1 - kk) * 12}px)`, background: "linear-gradient(180deg, #FFFFFF, #8D9099)", WebkitBackgroundClip: "text", color: "transparent" }}>{c}</span>; })}
        </div>
        <Img src={img("chrome_cut.png")} style={{ position: "absolute", left: IL, top: IT, width: IW, height: IH }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 760, height: 420, background: "radial-gradient(90% 100% at 0% 100%, rgba(5,5,6,.82) 0%, rgba(5,5,6,.55) 45%, rgba(5,5,6,0) 100%)" }} />
        <div style={{ position: "absolute", left: 70, top: 36, display: "flex", gap: 38, alignItems: "center", fontFamily: SANS, fontSize: 18, color: "rgba(255,255,255,.75)", opacity: prog(s, 5.85, 6.1) }}><b style={{ fontWeight: 600, letterSpacing: "0.2em", color: "#fff" }}>ATELIER</b><span>Work</span><span>Process</span><span>Studio</span></div>
        <div style={{ position: "absolute", left: 70, bottom: 80, fontFamily: SANS, fontWeight: 500, fontSize: 54, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,.5)" }}>{typed("Explore", s, 5.95, 6.15)}<br />{typed("the craft", s, 6.15, 6.4)}</div>
        {(() => { const kk = prog(s, 6.2, 6.5, E.back); return <div style={{ position: "absolute", right: 80, bottom: 80, transform: `scale(${kk})`, opacity: kk }}><Card w={300} hh={120} dark><div style={{ fontSize: 15, opacity: 0.6 }}>Since 2016</div><div style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>Built from scratch</div></Card></div>; })()}
      </div>
    </AbsoluteFill>);
  }
  // ===== 6.95–9.42 · the train: the site lives in the window; push through =====
  if (s >= 7.05 && s < TRAIN.t1 + 0.1) {
    const ts = TRAIN.src + (s - TRAIN.t0) * TRAIN.rate;
    const settle = prog(s, 7.05, 7.6, Easing.bezier(0.3, 0, 0.2, 1));
    const push = prog(s, 9.0, TRAIN.t1, Easing.bezier(0.6, 0, 0.9, 0.5));
    const zs = lerp(1, 1.45, push);
    void winRect(ts);
    const head1 = typed("Where the quiet", s, 7.85, 8.25), head2 = typed("begins.", s, 8.25, 8.5);
    add(<AbsoluteFill key="train" style={{ transform: `scale(${zs * lerp(1.04, 1, settle)})`, opacity: 1 - prog(s, 9.3, TRAIN.t1), filter: settle < 1 ? `blur(${(1 - settle) * 16}px) brightness(${lerp(0.82, 1, settle)}) saturate(${lerp(0.55, 1, settle)})` : undefined }}>
      <Sequence from={F(TRAIN.t0)} durationInFrames={F(TRAIN.t1 - TRAIN.t0) + 6} layout="none"><OffthreadVideo src={ft("v1_train.mp4")} startFrom={F(TRAIN.src)} playbackRate={TRAIN.rate} muted style={{ width: W, height: H }} /></Sequence>
    </AbsoluteFill>);
    // the website: the train interior IS its hero image — nav across the frame, headline + bar centred in the window
    const so = prog(s, 7.3, 7.6) * (1 - prog(s, 9.28, 9.42));
    add(<div key="site" style={{ position: "absolute", inset: 0, opacity: so, transform: `scale(${zs})` }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 26, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: SANS, fontSize: 18, color: "rgba(255,255,255,.9)" }}>
        <b style={{ fontWeight: 600, letterSpacing: "0.16em" }}>STILLWATER</b>
        <span style={{ display: "flex", gap: 34, opacity: 0.85 }}><span>Home</span><span>Stays</span><span>Journeys</span><span>Journal</span></span>
        <span style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid rgba(255,255,255,.7)" }}>Book a stay</span>
      </div>
      <div style={{ position: "absolute", left: 0, width: W, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 104, lineHeight: 1.04, letterSpacing: "-0.035em", color: "#fff", textShadow: "0 6px 40px rgba(0,0,0,.25)" }}>{head1}<br />{head2}</div>
      <div style={{ position: "absolute", left: 0, width: W, bottom: 34, textAlign: "center", fontFamily: SANS, fontSize: 17, color: "rgba(255,255,255,.8)" }}>Explore more ↓</div>
    </div>);
  }
  // the anchor prompt bar (lovio): one bar through every hero and into the train window; its brief retypes per hero
  if (s > 0.4 && s < 7.95) {
    const inK = prog(s, 0.42, 0.7, E.out), out = prog(s, 7.7, 7.95);
    let text = s < 0.6 ? "" : "Build" + typed(" me a brand site", s, 0.64, 1.0);
    const retype = (prev: string, next: string, a: number) => { const er = prog(s, a, a + 0.18, lin), ty = prog(s, a + 0.2, a + 0.55, lin); return er < 1 ? prev.slice(0, Math.round(prev.length * (1 - er))) : next.slice(0, Math.round(next.length * ty)); };
    if (s > 3.85) text = retype("Build me a brand site", "Build me a brand portfolio", 3.85);
    if (s > 5.4) text = retype("Build me a brand portfolio", "Build me a premium product page", 5.4);
    if (s > 7.08) text = retype("Build me a premium product page", "Build me a retreat page", 7.08);
    const press = win(s, 1.55, 1.6, 1.66, 1.74);
    const grow = prog(s, 6.7, 7.05, E.in), shrink = prog(s, 7.1, 7.5, E.io);
    const sc = 1.65 * lerp(1.08, 1, inK) * lerp(1, 1.07, grow) * lerp(1, 1.27 / (1.65 * 1.07), shrink);
    add(<div key="bar" style={{ position: "absolute", left: CX - 330, top: CY - 33, opacity: inK * (1 - out), filter: `blur(${(1 - inK) * 14}px)`, transform: `scale(${sc})` }}><Bar w={660} text={text} caret={Math.floor(s * 3) % 2 === 0} send={press} dark={s > 2.4} /></div>);
    const ck = prog(s, 0.9, 1.52, E.io);
    if (s > 0.85 && s < 2.1) add(<Hand key="h0" x={lerp(1500, CX + 330 * 1.65 - 52, ck)} y={lerp(960, CY + 10, ck)} press={press} op={1 - prog(s, 1.8, 2.05)} />);
  }

  // ===== 9.3–10.75 · the lake; "This isn't" =====
  if (s > 9.25 && s < 10.8) {
    add(<AbsoluteFill key="lake" style={{ opacity: prog(s, 9.25, 9.42) }}><Sequence from={F(9.25)} durationInFrames={F(1.6)} layout="none"><OffthreadVideo src={ft("v2_lake.mp4")} startFrom={F(0.3)} muted style={{ width: W, height: H, objectFit: "cover" }} /></Sequence></AbsoluteFill>);
    const hk = 1 - prog(s, 9.42, 9.75);
    const zh = lerp(1, 1.45, prog(s, 9.0, TRAIN.t1, Easing.bezier(0.6, 0, 0.9, 0.5))) * lerp(1, 1.08, prog(s, 9.42, 9.8, E.out));
    if (hk > 0) add(<div key="lh" style={{ position: "absolute", inset: 0, transform: `scale(${zh})`, opacity: hk * prog(s, 9.28, 9.4), filter: `blur(${(1 - hk) * 12}px)` }}><div style={{ position: "absolute", left: 0, width: W, top: 330, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 104, lineHeight: 1.04, letterSpacing: "-0.035em", color: "#fff", textShadow: "0 6px 40px rgba(0,0,0,.25)" }}>Where the quiet<br />begins.</div></div>);
    add(<div key="isnt" style={{ position: "absolute", left: 0, width: W, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 120, letterSpacing: "-0.035em", color: "#16161A" }}><Blur k={prog(s, 9.78, 10.1)}>This isn't</Blur></div>);
  }
  // ===== 10.7–12.2 · "a prototype" =====
  if (s > 10.68 && s < 12.25) {
    const z = lerp(1.06, 1, prog(s, 10.7, 12.2, lin));
    add(<AbsoluteFill key="proto" style={{ background: BG.white }}><div style={{ position: "absolute", left: 0, width: W, top: CY - 70, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 120, letterSpacing: "-0.035em", color: "#16161A", transform: `scale(${z})`, opacity: 1 - prog(s, 11.94, 12.08), filter: `blur(${prog(s, 11.94, 12.08) * 10}px)` }}><Blur k={prog(s, 10.72, 10.9)}>a</Blur>{" "}<Blur k={prog(s, 10.8, 11.15)}><GradText g={INKG}>prototype</GradText></Blur></div></AbsoluteFill>);
  }
  // ===== 12.2–13.55 · "It's live" — lovio's big pill (≈1170×450) with a glowing rim; the camera pushes into it =====
  if (s > 11.98 && s < 13.75) {
    const k = prog(s, 12.0, 12.36, E.out), push = prog(s, 13.12, 13.55, Easing.bezier(0.7, 0, 0.9, 0.5));
    const sc = lerp(0.9, 1, k) * Math.pow(14, push);
    const rot = (s - 12.2) * 80, PW = 1120, PH = 430;
    add(<AbsoluteFill key="live" style={{ background: s > 12.2 ? BG.white : undefined }}>
      <div style={{ position: "absolute", left: CX - PW / 2 - 50, top: CY - PH / 2 - 26, width: PW + 80, height: PH + 70, borderRadius: (PH + 70) / 2, background: `conic-gradient(from ${rot}deg at 40% 60%, rgba(122,136,162,.95), rgba(196,204,220,.8), rgba(92,102,124,.9), rgba(226,230,238,.7), rgba(122,136,162,.95))`, filter: "blur(26px)", opacity: k * (1 - push), transform: `scale(${sc})` }} />
      <div style={{ position: "absolute", left: CX - PW / 2, top: CY - PH / 2, width: PW, height: PH, borderRadius: PH / 2, background: "linear-gradient(180deg, #FFFFFF 0%, #F6F6F8 100%)", boxShadow: "inset 0 -14px 34px rgba(110,116,132,.14), 0 0 0 2px rgba(255,255,255,.95)", transform: `scale(${sc})`, opacity: k, filter: `blur(${(1 - k) * 12}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 400, fontSize: 172, letterSpacing: "-0.04em" }}><GradText g="linear-gradient(90deg, #111115 0%, #34363E 48%, #8E919B 100%)">It's live</GradText></div>
    </AbsoluteFill>);
  }
  // ===== 13.5–16.1 · the tennis hero: OWN THE COURT (lovio FIND YOUR FAST) =====
  if (s > 13.42 && s < 16.25) {
    const wash = 1 - prog(s, 13.45, 13.88, Easing.bezier(0.3, 0, 0.2, 1));
    const spread = prog(s, 15.6, 16.1, E.in);
    const line1 = "OWN THE".split(""), line2 = "COURT".split("");
    const fly = (i: number, n: number, a: number, sz: number, txt: string, key: string) => {
      const kk = prog(s, a + i * 0.06, a + 0.4 + i * 0.06, E.out);
      const dx = (h(i, n) - 0.5) * 900, dy = (h(i, n + 3) - 0.5) * 500, rot = (h(i, n + 5) - 0.5) * 60;
      const sx = (i - (txt.length - 1) / 2) * 260 * spread;
      return <span key={key} style={{ display: "inline-block", transform: `translate(${(1 - kk) * dx + sx}px, ${(1 - kk) * dy}px) rotate(${(1 - kk) * rot}deg)`, opacity: kk * (1 - spread), filter: `blur(${(1 - kk) * 10}px)`, fontSize: sz }}>{txt[i] === " " ? " " : txt[i]}</span>;
    };
    add(<AbsoluteFill key="ten" style={{ background: BG.sky, opacity: prog(s, 13.42, 13.56), filter: wash > 0 ? `brightness(${1 + wash * 0.8}) contrast(${1 - wash * 0.4}) blur(${wash * 7}px)` : undefined }}>
      <div style={{ position: "absolute", left: 120, top: 250, fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", lineHeight: 1, letterSpacing: "-0.01em", color: "#FFFFFF" }}>{line1.map((_, i) => fly(i, 1, 13.7, 92, "OWN THE", `a${i}`))}</div>
      <div style={{ position: "absolute", left: 0, width: W, top: 360, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", lineHeight: 1, letterSpacing: "-0.02em", color: "#FFFFFF" }}>{line2.map((_, i) => fly(i, 7, 13.85, 330, "COURT", `b${i}`))}</div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1.18, 1.25, prog(s, 13.5, 16, lin)) * (1 + spread * 0.4)})`, transformOrigin: "50% 100%", opacity: 1 - spread }}>
        <Sequence from={F(13.5)} durationInFrames={F(2.8)} layout="none"><OffthreadVideo src={ft("v3_key.webm")} transparent startFrom={F(2.0)} muted style={{ width: W, height: H }} /></Sequence>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 40, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 18, color: "#fff", opacity: prog(s, 14.4, 14.7) * (1 - spread) }}><b style={{ letterSpacing: "0.18em", fontWeight: 600 }}>COURTLINE</b><span style={{ display: "flex", gap: 36 }}><span>Club</span><span>Coaching</span><span>Events</span></span><span style={{ padding: "6px 16px", borderRadius: 18, background: "#fff", color: "#111" }}>Join</span></div>
      {[{ x: 150, y: 760, w: 200, hh: 250, src: img("h03_solt.jpg"), pos: "58% 30%", a: 14.5 }, { x: 1540, y: 200, w: 240, hh: 160, src: img("h05_amplify.jpg"), pos: "75% 50%", a: 14.7 }].map((c, i) => { const kk = prog(s, c.a, c.a + 0.3, E.back); return <div key={i} style={{ position: "absolute", left: c.x, top: c.y, transform: `scale(${kk})`, opacity: kk * (1 - spread) }}><Photo src={c.src} w={c.w} hh={c.hh} pos={c.pos} />{i === 1 && s > 14.9 && [[-6, -6], [c.w - 6, -6], [-6, c.hh - 6], [c.w - 6, c.hh - 6]].map(([x, y], j) => <div key={j} style={{ position: "absolute", left: x, top: y, width: 12, height: 12, background: "#fff", border: "2px solid #5B6270" }} />)}</div>; })}
      <div style={{ position: "absolute", right: 120, top: 640, fontFamily: SANS, fontSize: 24, color: "rgba(255,255,255,.9)", opacity: prog(s, 14.6, 14.9) * (1 - spread) }}>Players helping players</div>
    </AbsoluteFill>);
  }
  // ===== 16.0–21.05 · "Reshape / Motion" + chrome spiral (lovio "Refresh / Daily" + bottle); "Change the layout" → dark =====
  if (s > 16.0 && s < 21.97) {
    const dark = s > 19.5;
    const shrink = prog(s, 20.95, 21.35, Easing.bezier(0.6, 0, 0.2, 1));
    const pct = Math.round(lerp(42, 93, prog(s, 16.0, 17.6, Easing.bezier(0.2, 0.4, 0.3, 1))));
    const press = win(s, 18.85, 18.9, 18.97, 19.05);
    const ck = prog(s, 17.62, 18.15, E.io);
    const script = prog(s, 19.6, 20.6, Easing.bezier(0.35, 0, 0.55, 1));
    const flick1 = prog(s, 19.06, 19.24, E.io) * (1 - prog(s, 19.3, 19.46, E.io)), flick2 = prog(s, 19.28, 19.5, E.io) * (1 - prog(s, 19.53, 19.82, E.io));
    const sparkle = win(s, 19.52, 19.72, 19.9, 20.45);
    const sc = lerp(1, LT.w / W, shrink), tx = lerp(0, LT.x + LT.w / 2 - CX, shrink), ty = 0;
    const rise = prog(s, 16.0, 16.55, E.out);
    const ink = dark ? "#0E0F12" : "#FFFFFF";
    const navIn = (i: number) => prog(s, 16.75 + i * 0.1, 16.95 + i * 0.1);
    const BODY = "Clean form. Precise motion. A sculpted shape that moves the way the brand does.";
    const words = BODY.split(" ");
    const bodyLight = words.slice(0, Math.round(words.length * prog(s, 16.35, 17.7, lin))).join(" ");
    const bodyDark = words.slice(0, Math.round(words.length * prog(s, 19.75, 20.5, lin))).join(" ");
    const SPK: React.ReactNode[] = [];
    if (sparkle > 0) for (let i = 0; i < 88 * 24; i++) {
      const cx = i % 88, cy = Math.floor(i / 88), y = cy * 22 + 6;
      const dens = sparkle * Math.pow(cl01(1 - y / 560), 1.4) * 0.5;
      if (h(i, 11) < dens && h(i + Math.floor(s * 20) * 5, 13) > 0.3) SPK.push(<div key={i} style={{ position: "absolute", left: cx * 22 + 4, top: y, width: 5, height: 5, background: "#fff", opacity: 0.45 + h(i, 4) * 0.5 }} />);
    }
    add(<AbsoluteFill key="move" style={{ background: shrink > 0 ? BG.deep : undefined }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, borderRadius: lerp(0, 40, shrink), overflow: "hidden", boxShadow: shrink > 0 ? "0 30px 80px rgba(0,0,0,.4)" : undefined }}>
        <AbsoluteFill style={{ background: dark ? "linear-gradient(180deg, #060608 0%, #1A1B20 25%, #5E616A 50%, #B2B5BD 72%, #DCDEE2 100%)" : "linear-gradient(180deg, #9A9CA5 0%, #B7B9C1 45%, #E3E4E8 100%)" }} />
        {/* the top word drops in letter by letter (lovio: Refresh) — Inter, then the wide face after the layout change */}
        {!dark && <div style={{ position: "absolute", left: 105, top: 118, fontFamily: SANS, fontWeight: 400, fontSize: 440, lineHeight: 1, letterSpacing: "-0.035em", color: "rgba(255,255,255,.9)", whiteSpace: "nowrap" }}>
          {"Reshape".split("").map((c, i) => { const kk = prog(s, 16.02 + i * 0.12 + (i > 4 ? (i - 4) * 0.08 : 0), 16.52 + i * 0.12 + (i > 4 ? (i - 4) * 0.08 : 0), E.out); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - kk) * -(560 + h(i, 2) * 260)}px)`, opacity: kk > 0 ? 1 : 0 }}>{c}</span>; })}
        </div>}
        {dark && <div style={{ position: "absolute", left: 0, width: W, top: 150, textAlign: "center", fontFamily: WIDE, fontWeight: 500, fontStretch: "125%", fontSize: 352, lineHeight: 1, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}><GradText g="linear-gradient(180deg, #FFFFFF 30%, rgba(255,255,255,.62) 100%)">Reshape</GradText></div>}
        {SPK}
        {/* the bottom word rises (light) / writes on in script (dark) — lovio: Daily */}
        {!dark && <div style={{ position: "absolute", right: 90, top: 610, fontFamily: SANS, fontWeight: 400, fontSize: 340, lineHeight: 1, letterSpacing: "-0.035em", color: "rgba(255,255,255,.72)", whiteSpace: "nowrap" }}>
          {"Motion".split("").map((c, i) => { const kk = prog(s, 16.3 + i * 0.1, 16.75 + i * 0.1, E.out); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - kk) * (520 + h(i, 6) * 240)}px)` }}>{c}</span>; })}
        </div>}
        {/* the product: chrome spiral cut from the Orbsite hero, in front of the type */}
        <Img src={img("spiral_cut.png")} style={{ position: "absolute", left: CX - 380, top: 225 + (1 - rise) * 560, width: 760, height: 760 * 1015 / 500, filter: dark ? "contrast(1.12) brightness(1.04)" : "contrast(1.04)" }} />
        {dark && <div style={{ position: "absolute", left: 790, top: 500, width: 1110, height: 580, overflow: "hidden", clipPath: `inset(0 ${(1 - script) * 100}% 0 0)` }}><div style={{ position: "absolute", left: 30, top: 0, fontFamily: "InstSerif, serif", fontStyle: "italic", fontWeight: 400, fontSize: 410, lineHeight: 1, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}><GradText g="linear-gradient(90deg, #07070A 0%, #1C1D23 55%, #6F727C 100%)">Motion</GradText></div></div>}
        {/* copy, counter, nav */}
        {!dark && <div style={{ position: "absolute", left: 118, top: 545, width: 520, fontFamily: SANS, fontSize: 31, lineHeight: 1.36, color: "#FFFFFF" }}>{bodyLight}</div>}
        {dark && <div style={{ position: "absolute", left: 118, top: 680, width: 470, fontFamily: SANS, color: "#0E0F12" }}><div style={{ fontSize: 58, fontWeight: 400, letterSpacing: "-0.01em" }}>{typed("Clean form", s, 19.6, 19.85)}</div><div style={{ marginTop: 14, fontSize: 25, lineHeight: 1.4, color: "rgba(14,15,18,.78)" }}>{bodyDark}</div></div>}
        {!dark && <div style={{ position: "absolute", left: 118, top: 860, display: "flex", alignItems: "center", gap: 40, fontFamily: SANS, fontWeight: 300, fontSize: 72, color: "#FFFFFF" }}>{pct}%<div style={{ display: "flex", gap: 5 }}>{Array.from({ length: 34 }, (_, i) => <div key={i} style={{ width: 2, height: 30, background: "#fff", opacity: i / 34 < pct / 100 ? 0.85 : 0.25 }} />)}</div></div>}
        <div style={{ position: "absolute", left: 96, top: 44, display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: "0.04em", color: dark ? "#fff" : "rgba(255,255,255,.88)" }}><div style={{ width: 26, height: 26, borderRadius: 13, background: "#fff", opacity: navIn(0) }} />FORMA</div>
        {["HOME", "ABOUT US", "OUR SERVICES"].map((n, i) => <div key={n} style={{ position: "absolute", left: [570, 790, 1050][i], top: 56, fontFamily: SANS, fontWeight: 500, fontSize: 19, letterSpacing: "0.06em", color: "#fff", opacity: navIn(i + 1) }}>{n}</div>)}
        <div style={{ position: "absolute", left: 1540, top: 56, fontFamily: SANS, fontWeight: 500, fontSize: 19, letterSpacing: "0.06em", color: "#fff", textDecoration: "underline", textUnderlineOffset: 5, opacity: navIn(4) }}>LET'S TALK</div>
        <div style={{ position: "absolute", left: 1790, top: 42, width: 46, height: 46, borderRadius: 23, border: "1.5px solid rgba(255,255,255,.7)", opacity: navIn(5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>{[0, 1, 2].map((j) => <div key={j} style={{ width: 16, height: 1.5, background: "#fff" }} />)}</div>
        {/* "Change the layout": the glass bar grows out of a blur, types, the cursor sends it */}
        {s > 17.1 && s < 19.3 && (() => { const kk = prog(s, 17.12, 17.5, E.out), out = prog(s, 19.08, 19.28); return <div style={{ position: "absolute", left: CX - 260, top: 512, opacity: kk * (1 - out), filter: `blur(${(1 - kk) * 18 + out * 8}px)` }}><Bar w={520} text={typed("Change the layout", s, 17.55, 17.95)} caret={s > 17.5 && s < 18.3 && Math.floor(s * 2.4) % 2 === 0} send={press} ink scale={1.65 * lerp(0.7, 1, kk) * (1 - press * 0.02)} /></div>; })()}
        {s > 17.58 && s < 19.2 && <Hand x={lerp(1580, 1342, ck) + Math.sin(s * 3) * 3 * prog(s, 18.15, 18.4)} y={lerp(1010, 556, ck)} press={press} op={prog(s, 17.58, 17.7) * (1 - prog(s, 19.05, 19.2))} />}
        {/* the layout flicks through washes before it lands dark (lovio: peach → violet → blue) */}
        {flick1 > 0 && <AbsoluteFill style={{ background: "#F2F1EE", opacity: flick1 * 0.5 }} />}
        {flick2 > 0 && <AbsoluteFill style={{ background: "linear-gradient(180deg, #2A2C32, #9C9FA8 60%, #DADCE1)", opacity: flick2 * 0.94 }} />}
      </div>
    </AbsoluteFill>);
  }
  // ===== 21.0–25.2 · the rolling list =====
  if (s > 21.0 && s < 25.3) {
    const WORDS = ["Brand identities", "Landing pages", "Luxury websites", "Ad campaigns", "AI agents", "Booking flows", "Automation"];
    const steps = [21.95, 22.7, 23.45, 24.35];
    let idx = 1; steps.forEach((t) => { idx += prog(s, t, t + 0.3, E.io); });
    idx += prog(s, 24.95, 25.3, E.in) * 0.35;
    const THUMB = ["", "", img("h11_villa.jpg"), img("h05_amplify.jpg"), img("h02_aichat.jpg"), img("h10_irona.jpg"), img("h12_aigreen.jpg")];
    const cur = Math.round(idx);
    const since = Math.max(21.24, ...steps.filter((t) => s >= t)), tgt = 1 + steps.filter((t) => s >= t).length;
    const flashT = steps.some((t) => s > t - 0.03 && s < t + 0.2);
    const ROW = 262, TX = LT.x + LT.w + 62, NX = 262;
    const lineIn = prog(s, 21.2, 21.5, E.out);
    add(<AbsoluteFill key="list" style={{ opacity: 1 - prog(s, 25.15, 25.3) }}>
      {s > 21.9 && <AbsoluteFill style={{ background: BG.deep }} />}
      <div style={{ position: "absolute", left: LT.x + LT.w, right: 0, top: CY - LT.hh / 2, height: LT.hh, background: "linear-gradient(90deg, rgba(255,255,255,.03), rgba(235,238,245,.16) 55%, rgba(255,255,255,.05))", opacity: lineIn }} />
      {[CY - LT.hh / 2, CY + LT.hh / 2].map((y, j) => <div key={j} style={{ position: "absolute", left: 172, right: 0, top: y, height: 1, background: "rgba(255,255,255,.2)", transform: `scaleX(${lineIn})`, transformOrigin: "0 0" }} />)}
      <div style={{ position: "absolute", left: 172, top: 0, width: 1, height: H, background: "rgba(255,255,255,.14)", transform: `scaleY(${lineIn})`, transformOrigin: "0 0" }} />
      {WORDS.map((wd, i) => {
        const d = i - idx, a = Math.abs(d), on = cl01(1 - a);
        const txt = i === tgt ? typed(wd, s, since + 0.02, since + 0.32) : wd;
        return <div key={i} style={{ position: "absolute", left: lerp(NX, TX, on), top: CY - 80 + d * ROW, fontFamily: SANS, fontWeight: 400, fontSize: 134, lineHeight: 1.2, letterSpacing: "-0.03em", color: "#fff", whiteSpace: "nowrap", opacity: Math.max(0, lerp(0.3, 1, on) - Math.max(0, a - 1) * 0.22) * prog(s, 21.22, 21.4), filter: `blur(${Math.min(5, a * 2.2)}px)` }}>{txt}</div>;
      })}
      {s > 21.9 && <div style={{ position: "absolute", left: LT.x, top: CY - LT.hh / 2, width: flashT ? LT.w * 0.62 : LT.w, height: LT.hh, borderRadius: 10, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,.4)" }}>
        {flashT || !THUMB[cur] ? <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #5A5D68, #F2F3F5)" }} /> : <Img src={THUMB[cur]} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />}
      </div>}
    </AbsoluteFill>);
  }
  // ===== 25.2–28.45 · "Premium sites used to take months" (V4 keyed) =====
  if (s > 25.15 && s < 28.82) {
    const k = prog(s, 25.2, 25.35);
    const leftOut = prog(s, 26.5, 26.75), rightIn = prog(s, 26.7, 27.0);
    const pop = (a: number) => prog(s, a, a + 0.3, E.back);
    add(<AbsoluteFill key="soft" style={{ background: BG.white, opacity: k }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(-150px, 40px) scale(${lerp(1.1, 1.2, prog(s, 25.2, 28.4, lin))})`, transformOrigin: "50% 100%" }}>
        <Sequence from={F(25.2)} durationInFrames={F(3.5)} layout="none"><OffthreadVideo src={ft("v4_key.webm")} transparent startFrom={F(0.4)} muted style={{ width: W, height: H }} /></Sequence>
      </div>
      <div style={{ position: "absolute", left: 130, top: 70, fontFamily: SANS, opacity: 1 - leftOut, filter: `blur(${leftOut * 10}px)` }}>
        <div style={{ fontWeight: 500, fontSize: 104, letterSpacing: "-0.035em", color: "#16161A" }}><Blur k={prog(s, 25.25, 25.5)}>Premium sites</Blur></div>
        <div style={{ fontWeight: 500, fontSize: 228, lineHeight: 0.86, letterSpacing: "-0.045em", marginLeft: 70 }}><Blur k={prog(s, 25.45, 25.75)}><GradText g={INKG}>used</GradText></Blur></div>
      </div>
      <div style={{ position: "absolute", right: 130, top: 70, textAlign: "right", fontFamily: SANS, opacity: rightIn }}>
        <div style={{ fontWeight: 500, fontSize: 104, letterSpacing: "-0.035em", color: "#16161A" }}><Blur k={prog(s, 26.72, 26.95)}>to take</Blur></div>
        <div style={{ fontWeight: 500, fontSize: 228, lineHeight: 0.86, letterSpacing: "-0.045em" }}><Blur k={prog(s, 26.9, 27.2)}><GradText g={INKG}>months</GradText></Blur></div>
      </div>
      <div style={{ position: "absolute", left: 1500, top: 330, transform: `scale(${pop(25.45)})` }}><Card w={250} hh={110}><div style={{ fontSize: 15, opacity: 0.6 }}>Enquiries</div><div style={{ fontSize: 40, fontWeight: 600 }}>{count(s, 25.5, 28.3, 14, 23)}</div></Card></div>
      <div style={{ position: "absolute", left: 1560, top: 470, transform: `scale(${pop(25.65)})` }}><Card w={230} hh={100}><div style={{ fontSize: 15, opacity: 0.6 }}>Visitors</div><div style={{ fontSize: 34, fontWeight: 600 }}>{Number(count(s, 25.7, 28.3, 1636, 1740)).toLocaleString("en-US")}</div></Card></div>
      <div style={{ position: "absolute", left: 1640, top: 610, transform: `scale(${pop(25.85)})` }}><Photo src={img("h11_villa.jpg")} w={220} hh={140} /></div>
      <div style={{ position: "absolute", left: 1030, top: 930, transform: `scale(${pop(26.0)})`, padding: "14px 34px", borderRadius: 30, background: "#16161A", color: "#fff", fontFamily: SANS, fontSize: 22, fontWeight: 500 }}>Book a call</div>
      <div style={{ position: "absolute", left: 830, top: 760, transform: `scale(${pop(26.15)}) rotate(-3deg)` }}><Photo src={img("h12_aigreen.jpg")} w={260} hh={170} /></div>
      <div style={{ position: "absolute", left: 160, top: 640, transform: `scale(${pop(27.0)})` }}><Photo src={img("h03_solt.jpg")} w={170} hh={210} pos="58% 30%" /></div>
      <div style={{ position: "absolute", left: 120, top: 330, transform: `scale(${pop(27.2)})` }}><Card w={240} hh={100}><div style={{ fontSize: 15, opacity: 0.6 }}>Conversion</div><div style={{ fontSize: 34, fontWeight: 600 }}>{count(s, 27.2, 28.3, 38.3, 57.3, 1)}%</div></Card></div>
    </AbsoluteFill>);
  }
  // ===== 28.4–30.3 · the field: the valley (V7) with the desk in it; push in; whip into the laptop =====
  if (s > 28.35 && s < 30.35) {
    const card = prog(s, 28.42, 28.8, Easing.bezier(0.6, 0, 0.2, 1));
    const push = prog(s, 28.8, 30.0, E.io), whip = prog(s, 30.0, 30.28, E.in);
    const R = { x: lerp(1010, 0, card), y: lerp(470, 0, card), w: lerp(440, W, card), hh: lerp(248, H, card) };
    const sc = lerp(1, 1.6, push) * lerp(1, 6, whip);
    add(<AbsoluteFill key="field">
      <div style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.hh, borderRadius: lerp(22, 0, card), overflow: "hidden", opacity: prog(s, 28.36, 28.44), boxShadow: card < 1 ? "0 24px 60px rgba(0,0,0,.25)" : undefined, filter: whip > 0 ? `blur(${whip * 18}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(${(R.w - W) / 2}px, ${(R.hh - H) / 2}px) scale(${sc})`, transformOrigin: "1330px 800px" }}>
          <Sequence from={F(28.35)} durationInFrames={F(2.1)} layout="none"><OffthreadVideo src={ft("v7_valley.mp4")} startFrom={F(3.0)} muted style={{ width: W, height: H }} /></Sequence>
          <div style={{ position: "absolute", left: 845, top: H - H * 0.62, width: W, height: H, transform: "scale(0.62)", transformOrigin: "0 0", filter: "contrast(0.96) saturate(0.9) brightness(0.98)" }}>
            <Sequence from={F(28.35)} durationInFrames={F(2.1)} layout="none"><OffthreadVideo src={ft("v4_key.webm")} transparent startFrom={F(3.6)} muted style={{ width: W, height: H }} /></Sequence>
          </div>
        </div>
      </div>
    </AbsoluteFill>);
  }
  // ===== 30.25–32.2 · emblem → OBSIDIAN =====
  if (s > 30.2 && s < 32.25) {
    const k = prog(s, 30.28, 30.6, E.back), slide = prog(s, 30.95, 31.35, E.io);
    add(<AbsoluteFill key="logo" style={{ background: BG.deep, opacity: prog(s, 30.22, 30.32) }}>
      {slide < 1 && <div style={{ position: "absolute", left: lerp(CX - 78, CX - LockLW / 2, slide), top: lerp(CY - 95, CY - 122 * LockLS, slide), transform: `scale(${k})`, filter: `blur(${(1 - k) * 8}px)` }}><EmblemSVG size={lerp(190, 245 * LockLS, slide)} /></div>}
      {slide >= 1 && <Lockup s={s} t0={31.1} x={CX} y={CY} />}
    </AbsoluteFill>);
  }
  // ===== 32.2–35.3 · "N◆w" · "it ◆ starts" · "with a brief" → selected and deleted =====
  if (s > 32.18 && s < 35.35) {
    const EM = (sz: number) => <span style={{ display: "inline-block", margin: "0 0.06em", verticalAlign: "-0.08em" }}><EmblemSVG size={sz} /></span>;
    const a = prog(s, 32.2, 32.45), b = prog(s, 33.15, 33.4), c = prog(s, 34.2, 34.45);
    const sel = prog(s, 34.72, 34.95, E.io), del = prog(s, 34.98, 35.3, lin);
    const phrase = "with a brief";
    const rest = phrase.slice(Math.round(phrase.length * del));
    add(<AbsoluteFill key="now" style={{ background: BG.deep }}>
      <div style={{ position: "absolute", left: 0, width: W, top: CY - 135, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 236, letterSpacing: "-0.045em", color: "rgba(226,228,236,.82)", textShadow: "0 0 60px rgba(255,255,255,.18)" }}>
        {s < 33.15 && <Blur k={a}>N{EM(186)}w</Blur>}
        {s >= 33.15 && s < 34.2 && <Blur k={b}>it {EM(186)} starts</Blur>}
        {s >= 34.2 && <span style={{ position: "relative", display: "inline-block", opacity: c, filter: `blur(${(1 - c) * 12}px)` }}>
          {sel > 0 && <span style={{ position: "absolute", right: 0, top: 18, height: 252, width: `${sel * 100 * (rest.length / phrase.length)}%`, background: "rgba(255,255,255,.22)" }} />}
          {sel > 0 && <span style={{ position: "absolute", left: `${(1 - sel) * 100}%`, top: 18, width: 6, height: 252, background: "#fff" }} />}
          <span style={{ visibility: "hidden" }}>{phrase.slice(0, phrase.length - rest.length)}</span>{rest}
        </span>}
      </div>
    </AbsoluteFill>);
  }
  // ===== 35.3–37.5 · "Build a mo|" → the prompt card =====
  if (s > 35.28 && s < 37.55) {
    const into = prog(s, 36.32, 36.58, E.io);
    const t1 = typed("Build a mo", s, 35.35, 36.3), t2 = "Build a mo" + typed("dern premium page", s, 36.35, 37.9);
    const cx = lerp(660, 560, prog(s, 36.4, 37.5, Easing.bezier(0.3, 0, 0.6, 1))), cy = 112;
    add(<AbsoluteFill key="bam" style={{ background: BG.deep }}>
      {into < 1 && <div style={{ position: "absolute", left: 0, width: W, top: CY - 115, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 200, letterSpacing: "-0.04em", color: "#fff", opacity: 1 - into, filter: `blur(${into * 10}px)`, transform: `translate(${into * 120}px, ${-into * 300}px) scale(${lerp(1, 0.55, into)})` }}>{t1}<span style={{ display: "inline-block", width: 8, height: 180, marginLeft: 10, verticalAlign: "-24px", background: "#fff" }} /></div>}
      {into > 0 && <>
        {/* lovio: the camera sits inside the prompt card — it bleeds off the right; dither specks on its left rim */}
        <div style={{ position: "absolute", left: cx, top: cy, width: 1600, height: 820, borderRadius: 90, opacity: into, transform: `scale(${lerp(1.08, 1, into)})`, transformOrigin: "0 0", background: "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.05) 60%)", border: "2px solid rgba(255,255,255,.42)", boxShadow: "0 40px 100px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.35)", backdropFilter: "blur(24px)", fontFamily: SANS, color: "#fff" }}>
          <div style={{ position: "absolute", left: 96, top: 92, fontSize: 92, fontWeight: 400, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{s < 36.35 ? t1 : t2}<span style={{ display: "inline-block", width: 5, height: 92, marginLeft: 6, verticalAlign: "-14px", background: "#fff" }} /></div>
          <div style={{ position: "absolute", left: 96, top: 560, display: "flex", gap: 34, opacity: prog(s, 36.42, 36.65) }}>
            <div style={{ width: 190, height: 190, borderRadius: 95, background: "rgba(255,255,255,.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 140, fontWeight: 200, lineHeight: 1 }}>+</div>
            <div style={{ height: 190, padding: "0 70px", borderRadius: 95, background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", gap: 26, fontSize: 82, color: "rgba(255,255,255,.7)" }}><svg width={84} height={84} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" stroke="rgba(255,255,255,.7)" strokeWidth={1.4} fill="none" /><path d="M2.5 12h19M12 2.5c3 3.2 3 15.8 0 19M12 2.5c-3 3.2-3 15.8 0 19" stroke="rgba(255,255,255,.7)" strokeWidth={1.4} fill="none" /></svg>Public</div>
          </div>
        </div>
        {Array.from({ length: 70 }, (_, i) => { const y = cy + 140 + h(i, 21) * 600, x = cx - 40 + h(i, 22) * 90; return h(i + Math.floor(s * 16) * 3, 23) > 0.45 ? <div key={i} style={{ position: "absolute", left: Math.round(x / 14) * 14, top: Math.round(y / 14) * 14, width: 5, height: 5, background: "#fff", opacity: 0.5 * into * (1 - prog(s, 36.9, 37.3)) }} /> : null; })}
      </>}
    </AbsoluteFill>);
  }
  // ===== 37.45–43.75 · "Faster ___": ideas (V7) · launches (Deploy) · products (V8) · everything (V2 silver) =====
  if (s > 37.4 && s < 43.8) {
    const seg = s < 38.9 ? 0 : s < 40.9 ? 1 : s < 42.3 ? 2 : 3;
    const words = ["ideas", "launches", "products", "everything"];
    const segT = [37.45, 38.9, 40.9, 42.3][seg];
    const wk = prog(s, segT + 0.05, segT + 0.4);
    const ink = seg === 0 ? "#FFFFFF" : "#121216", soft = seg === 0 ? "rgba(255,255,255,.62)" : "#7E818B";
    add(<AbsoluteFill key="fast">
      {seg === 0 && <AbsoluteFill><Sequence from={F(37.4)} durationInFrames={F(1.6)} layout="none"><OffthreadVideo src={ft("v7_valley.mp4")} startFrom={F(0.4)} muted style={{ width: W, height: H }} /></Sequence><AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(120,124,132,.35), rgba(0,0,0,0) 45%)" }} /></AbsoluteFill>}
      {seg === 1 && <AbsoluteFill style={{ background: BG.deep }}><div style={{ position: "absolute", left: CX - 1100, top: -520, width: 2200, height: 1300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(246,247,250,1) 0%, rgba(232,234,240,.92) 30%, rgba(200,203,212,0) 68%)" }} /></AbsoluteFill>}
      {seg === 2 && <AbsoluteFill><Sequence from={F(40.85)} durationInFrames={F(1.5)} layout="none"><OffthreadVideo src={ft("v8_car.mp4")} startFrom={F(1.5)} muted style={{ width: W, height: H }} /></Sequence></AbsoluteFill>}
      {seg === 3 && <AbsoluteFill style={{ filter: "grayscale(.8) brightness(1.08) contrast(.9)" }}><Sequence from={F(42.25)} durationInFrames={F(1.55)} layout="none"><OffthreadVideo src={ft("v2_lake.mp4")} startFrom={F(5.4)} playbackRate={0.8} muted style={{ width: W, height: H }} /></Sequence><AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(235,236,240,.55), rgba(235,236,240,0) 70%)" }} /></AbsoluteFill>}
      <div style={{ position: "absolute", left: 0, width: W, top: seg === 3 ? 462 : 268, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 124, letterSpacing: "-0.035em", color: ink, whiteSpace: "nowrap", textShadow: seg === 2 ? "0 2px 30px rgba(255,255,255,.35)" : undefined }}>Faster <Blur k={wk}><span style={{ color: soft }}>{words[seg]}</span></Blur></div>
      {/* ideas: the light prompt card over the valley; it finishes typing, the cursor sends it */}
      {seg === 0 && (() => { const ck = prog(s, 37.65, 38.05, E.io), press = win(s, 38.2, 38.25, 38.3, 38.42); return <>
        <div style={{ position: "absolute", left: 470, top: 495, width: 980, height: 300, borderRadius: 34, background: "rgba(250,250,252,.72)", border: "1.5px solid rgba(255,255,255,.9)", boxShadow: "0 30px 70px rgba(0,0,0,.18)", backdropFilter: "blur(20px)", fontFamily: SANS, color: "#2A2B31" }}>
          <div style={{ position: "absolute", left: 40, top: 36, fontSize: 26 }}>{"Build a modern premiu" + typed("m page", s, 37.5, 37.95)}<span style={{ display: "inline-block", width: 2, height: 28, marginLeft: 2, verticalAlign: "-5px", background: "#2A2B31", opacity: s < 38.2 && Math.floor(s * 2.4) % 2 === 0 ? 1 : 0 }} /></div>
          <div style={{ position: "absolute", left: 36, bottom: 32, display: "flex", alignItems: "center", gap: 24, fontSize: 22, color: "#55575F" }}><span style={{ fontSize: 34, fontWeight: 300 }}>+</span><span>◎ Public</span></div>
          <svg width={26} height={26} viewBox="0 0 24 24" style={{ position: "absolute", right: 120, bottom: 47 }}><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5 11a7 7 0 0 0 14 0 M12 18v3" stroke="#55575F" strokeWidth={1.6} fill="none" strokeLinecap="round" /></svg>
          <div style={{ position: "absolute", right: 40, bottom: 34, width: 52, height: 52, borderRadius: 26, background: press > 0.3 || s > 38.3 ? "#3A3C44" : "#0E0F12", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - press * 0.12})` }}><svg width={22} height={22} viewBox="0 0 24 24"><path d="M12 19V5 M6 11l6-6 6 6" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        </div>
        <Hand x={lerp(1560, 1388, ck)} y={lerp(1010, 742, ck)} press={press} op={prog(s, 37.6, 37.7) * (1 - prog(s, 38.55, 38.8))} />
      </>; })()}
      {/* launches: the app panel rises in close-up (bleeds off left and bottom); Deploy */}
      {seg === 1 && (() => { const up = prog(s, 38.95, 39.45, E.out), ck = prog(s, 39.5, 39.95, E.io), press = win(s, 40.0, 40.05, 40.1, 40.22), lit = prog(s, 40.15, 40.5, E.out); const py = lerp(1150, 505, up); return <>
        <div style={{ position: "absolute", left: -140, top: py, width: 1720, height: 900, borderRadius: 80, background: "#0A0A0C", border: "3px solid rgba(255,255,255,.28)", boxShadow: "0 -12px 80px rgba(255,255,255,.3), inset 0 4px 0 rgba(255,255,255,.4)" }}>
          <div style={{ position: "absolute", left: 120, top: 70, right: 70, height: 130, display: "flex", alignItems: "center", gap: 36, fontFamily: SANS, fontSize: 44, color: "rgba(255,255,255,.55)" }}>
            <div style={{ width: 640, height: 124, borderRadius: 62, background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", padding: "0 48px", boxSizing: "border-box" }}>desktop · obsidian.studio</div>
            <div style={{ width: 560, height: 124, borderRadius: 62, background: lit > 0 ? `linear-gradient(90deg, rgba(255,255,255,${lit}), rgba(190,192,200,${lit}))` : "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.35)", color: lit > 0.5 ? "#111" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 46, transform: `scale(${1 - press * 0.05})` }}>Deploy</div>
            <div style={{ width: 124, height: 124, borderRadius: 62, background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.14)" }} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 250, width: 1400, height: 160, borderRadius: 40, border: "1.5px solid rgba(255,255,255,.1)" }} />
        </div>
        <Hand x={lerp(1640, 1030, ck)} y={lerp(1040, py + 150, ck)} press={press} op={prog(s, 39.45, 39.55) * (1 - prog(s, 40.6, 40.85))} />
      </>; })()}
      {/* products: the dashboard card in the car window */}
      {seg === 2 && (() => { const k = prog(s, 40.95, 41.25, E.out); return <div style={{ position: "absolute", left: CX - 310, top: 465, transform: `scale(${lerp(0.9, 1, k)})`, opacity: k }}>
        <Card w={620} hh={420} dark style={{ padding: "26px 32px" }}><div style={{ fontSize: 20, opacity: 0.6 }}>Site performance</div><div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 6 }}>{count(s, 40.95, 42.2, 13.8, 18.4, 1)}%</div>
          <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,.12)", marginTop: 10 }}><div style={{ width: `${lerp(40, 78, prog(s, 40.95, 42.2))}%`, height: 7, borderRadius: 4, background: "#E9EAEE" }} /></div>
          {["Enquiries", "Bookings", "Return visits"].map((r, i) => <div key={r} style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: 21, opacity: 0.8 }}><span>{r}</span><span>{count(s, 40.95, 42.2, [124, 64, 35][i], [146, 85, 52][i])}</span></div>)}
        </Card></div>; })()}
    </AbsoluteFill>);
  }
  // ===== 43.7–44.75 · "Great brands" =====
  if (s > 43.7 && s < 44.8) add(<AbsoluteFill key="great" style={{ background: BG.white }}><div style={{ position: "absolute", left: 0, width: W, top: CY - 50, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 124, letterSpacing: "-0.035em", color: "#16161A" }}><Blur k={prog(s, 43.75, 43.95)}>Great</Blur>{" "}<Blur k={prog(s, 43.85, 44.2)}><GradText g={INKG}>brands</GradText></Blur></div></AbsoluteFill>);
  // ===== 44.7–47.05 · "no longer start" → "with templates" + the pile of heroes =====
  if (s > 44.7 && s < 47.02) {
    const PILE = ["h03_solt.jpg", "h07_mindful.jpg", "h11_villa.jpg", "h04_orsbite.jpg", "h09_fern.jpg", "h12_aigreen.jpg", "h10_irona.jpg", "h06_silence.jpg"];
    const swap = prog(s, 45.85, 46.4, E.io);
    const exitK = prog(s, 46.7, 47.0, E.in);
    add(<AbsoluteFill key="pile" style={{ background: BG.white }}>
      {PILE.map((p, i) => { const a = 44.95 + i * 0.11, k = prog(s, a, a + 0.55, Easing.bezier(0.2, 0.8, 0.3, 1)); const tx = lerp(560, 40, swap) + (h(i, 1) - 0.4) * 520, ty = lerp(560, 470, swap) + (h(i, 2) - 0.5) * 320 + Math.sin(s * 0.8 + i) * 6, rot = (h(i, 3) - 0.5) * 30; return k > 0 ? <div key={i} style={{ position: "absolute", left: lerp(-700, tx, k) - exitK * (1300 + i * 60), top: lerp(1300, ty, k) - exitK * (800 + i * 40), transform: `rotate(${lerp(rot - 40, rot, k) - exitK * 25}deg)`, filter: exitK > 0 ? `blur(${exitK * 10}px)` : undefined }}><Photo src={img(p)} w={600} hh={378} r={18} /></div> : null; })}
      <div style={{ position: "absolute", left: 0, width: W, top: CY - 90, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 124, letterSpacing: "-0.035em", color: "#16161A", transform: `translateX(${lerp(0, 290, swap) - exitK * 700}px)`, opacity: 1 - exitK, filter: exitK > 0 ? `blur(${exitK * 12}px)` : undefined }}>
        {swap < 1 && <span style={{ opacity: 1 - swap, filter: `blur(${swap * 12}px)` }}><Blur k={prog(s, 44.75, 44.9)}>no</Blur>{" "}<Blur k={prog(s, 44.95, 45.15)}>longer</Blur>{" "}<Blur k={prog(s, 45.1, 45.35)}><GradText g={INKG}>start</GradText></Blur></span>}
        {swap > 0 && <span style={{ position: "absolute", left: 0, right: 0, opacity: swap, filter: `blur(${(1 - swap) * 12}px)` }}>with <GradText g={INKG}>templates</GradText></span>}
      </div>
    </AbsoluteFill>);
  }
  // ===== 47.0–49.25 · the 3D emblem (lovio's flower bloom) =====
  if (s > 47.0 && s < 49.65) {
    const grow = prog(s, 47.0, 48.3, Easing.bezier(0.2, 0.7, 0.2, 1)), back = prog(s, 48.35, 49.1, E.io);
    const sc = lerp(0.4, 3.9, grow) * lerp(1, 150 / 245 / 3.9, back);
    const ry = lerp(75, -18, grow) + back * 18, rx = 12 * (1 - back);
    const LAY = 14;
    add(<AbsoluteFill key="bloom" style={{ background: BG.deep, perspective: 1600 }}>
      <div style={{ position: "absolute", left: CX - 100, top: CY - 122, width: 200, height: 245, transformStyle: "preserve-3d", transform: `scale(${sc}) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
        {Array.from({ length: LAY }, (_, i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${-i * 2.6}px)` }}><EmblemSVG size={245} fill={i === 0 ? "url(#bar7)" : `rgb(${150 - i * 7},${150 - i * 7},${156 - i * 7})`} /></div>)}
      </div>
    </AbsoluteFill>);
  }
  // ===== 49.2–52 · OBSIDIAN on the horizon =====
  if (s > 49.15) {
    add(<AbsoluteFill key="end" style={{ background: BG.horizon, opacity: prog(s, 49.1, 49.6, E.io) }}>
      {s < 50.05 && (() => { const sl = prog(s, 49.7, 50.05, E.io), sz = lerp(150, 245 * LockLS, sl); return <div style={{ position: "absolute", left: lerp(CX - 61, CX - LockLW / 2, sl), top: lerp(CY - 75, CY - 122 * LockLS, sl) }}><EmblemSVG size={sz} /></div>; })()}
      {s >= 50.05 && <Lockup s={s} t0={50.05} x={CX} y={CY} />}
    </AbsoluteFill>);
  }
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{L}</AbsoluteFill>;
};
