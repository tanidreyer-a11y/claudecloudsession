// OBSIDIAN — "Built from scratch" (OBS-SCRATCH, 40 s, 16:9). An original Obsidian film in the house UI-motion style
// (skills/motion-studio/styles/obsidian-ui-motion.md): monochrome, white emblem, one fixed container for heroes, the
// caret/hairline as the brand's motion motif, cursor clicks that cause the next beat, blur-to-sharp arrivals.
//  0.0 a caret types "Build / from scratch." → the caret stretches into a hairline that opens the frame → a 12-col grid,
//      wireframe blocks, the headline snaps to centre → the wireframe resolves into Irona; the cursor clicks its CTA
//  5.3 Solt opens from the click point · 7.3 CRAFT dissolves in soft blobs · 9.0 the camera dives into the chrome
//  9.6 PRECISION: the hairline reveals the word, the chrome spiral rises, annotated; a Light/Dark toggle is clicked
// 14.4 tennis: "ONE SHOOT." → crop marks reframe it 9:16 · 1:1 · 16:9 "EVERY FORMAT." → the banner becomes the train window
// 20.4 the agent answers a 02:14 enquiry inside the window → the view shrinks into the services list
// 30.4 Irona grows back into the container, the camera pulls back over every site → "Built from scratch. Every time."
// 33.4 the 3D emblem → OBSIDIAN lockup, "Digital precision that builds reputation." and the caret again
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { E, prog, lerp, win, h } from "./Film2";
import { BG, Hand, Blur, GradText, Card, Photo, BOX, LT, count, EmblemSVG, LockLW, Lockup, winRect } from "./Film7";

export const FPS8 = 60;
export const DUR8 = 40;
const W = 1920, H = 1080, CX = 960, CY = 540;
const SANS = "Inter, Helvetica, Arial, sans-serif";
const WIDE = "ArchivoW, Helvetica, Arial, sans-serif";
const MONO = "JBMono, ui-monospace, monospace";
const SERIF = "InstSerif, serif";
const lin = (x: number) => x;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const typed = (str: string, s: number, a: number, b: number) => str.slice(0, Math.round(str.length * prog(s, a, b, lin)));
const img = (n: string) => staticFile("heroes2/" + n);
const ft = (n: string) => staticFile("footage/" + n);
const F = (sec: number) => Math.round(sec * FPS8);
const LockLS = LockLW / 1030;
const SM = Easing.bezier(0.3, 0, 0.2, 1);   // the house settle curve
const SNAP = Easing.bezier(0.6, 0, 0.2, 1);  // the house move curve

// width of a typed string in the browser (fonts are loaded before render)
let cv: HTMLCanvasElement | null = null;
const textW = (txt: string, font: string, trackPx: number) => {
  if (typeof document === "undefined") return txt.length * 100;
  cv = cv ?? document.createElement("canvas");
  const c = cv.getContext("2d");
  if (!c) return txt.length * 100;
  c.font = font;
  return c.measureText(txt).width + trackPx * txt.length;
};

// small mono caption above the container — the studio's "case file" tag
const Tag: React.FC<{ left: string; right?: string; k: number }> = ({ left, right = "obsidian.studio", k }) => (
  <div style={{ position: "absolute", left: BOX.x + 4, width: BOX.w - 8, top: 13, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 15, letterSpacing: "0.14em", color: "rgba(255,255,255,.6)", opacity: k, transform: `translateY(${(1 - k) * 6}px)` }}><span>{left}</span><span>{right}</span></div>
);
// a design-tool arrow cursor (the hand is for clicks on live UI; the arrow is for editing)
const Arrow: React.FC<{ x: number; y: number; op?: number }> = ({ x, y, op = 1 }) => (
  <svg width={34} height={34} viewBox="0 0 24 24" style={{ position: "absolute", left: x - 4, top: y - 2, opacity: op, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.4))", overflow: "visible" }}><path d="M4 2l15 9.5-6.6 1.4 3.9 7.2-2.6 1.4-3.9-7.2L5 19z" fill="#fff" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" /></svg>
);
const Ripple: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (k > 0 && k < 1 ? <div style={{ position: "absolute", left: x - 70 * k, top: y - 70 * k, width: 140 * k, height: 140 * k, borderRadius: "50%", border: "2px solid rgba(255,255,255,.8)", opacity: 1 - k }} /> : null);
const glassDark = { background: "rgba(16,16,20,.55)", border: "1.5px solid rgba(255,255,255,.28)", backdropFilter: "blur(18px)", boxShadow: "0 18px 50px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.25)" } as const;

// ================================================================ film
export const Film8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;
  const L: React.ReactNode[] = [];
  const add = (n: React.ReactNode) => L.push(n);

  // ===== A · 0–2.75 · the caret types, then stretches into the hairline that opens the frame =====
  const L1 = { x: 300, top: 300, sz: 230, tr: -0.045 }, L2 = { top: 545, sz: 150, tr: -0.04 };
  const t1 = typed("Build", s, 0.45, 0.85), t2 = typed("from scratch.", s, 1.0, 1.7);
  const onL2 = s >= 0.95;
  const caretX = onL2 ? L1.x + textW(t2, `500 ${L2.sz}px Inter`, L2.tr * L2.sz) + 10 : L1.x + textW(t1, `500 ${L1.sz}px Inter`, L1.tr * L1.sz) + 12;
  const grow = prog(s, 1.9, 2.22, SNAP), open = prog(s, 2.2, 2.78, SNAP);
  if (s < 4.1) add(<AbsoluteFill key="bgA" style={{ background: BG.open }} />);
  if (s < 2.4) {
    const fade = prog(s, 1.92, 2.22);
    add(<div key="type" style={{ position: "absolute", inset: 0, opacity: 1 - fade, filter: `blur(${fade * 14}px)`, transform: `translateY(${-fade * 30}px)` }}>
      <div style={{ position: "absolute", left: L1.x, top: L1.top, fontFamily: SANS, fontWeight: 500, fontSize: L1.sz, lineHeight: 1, letterSpacing: `${L1.tr}em`, color: "rgba(255,255,255,.94)", whiteSpace: "nowrap" }}>{t1}</div>
      <div style={{ position: "absolute", left: L1.x, top: L2.top, fontFamily: SANS, fontWeight: 500, fontSize: L2.sz, lineHeight: 1, letterSpacing: `${L2.tr}em`, whiteSpace: "nowrap" }}><GradText g="linear-gradient(90deg, #C9CBD2, #6E717B)">{t2}</GradText></div>
    </div>);
  }
  if (s < 2.8) {
    // the caret: blinks while idle, solid while typing; then it becomes a full-height hairline and splits into the frame
    const typing = (s > 0.45 && s < 0.9) || (s > 1.0 && s < 1.75);
    const blinkOn = typing || s > 1.9 || Math.floor(s * 2.4) % 2 === 0;
    const lineTop = onL2 ? L2.top + 0.1 * L2.sz : L1.top + 0.1 * L1.sz, lineH = (onL2 ? L2.sz : L1.sz) * 0.84;
    if (open <= 0) add(<div key="caret" style={{ position: "absolute", left: caretX, top: lerp(lineTop, 0, grow), width: lerp(onL2 ? 6 : 8, 2, grow), height: lerp(lineH, H, grow), background: "#fff", opacity: blinkOn ? 0.95 : 0 }} />);
    else {
      const xl = lerp(caretX, BOX.x, open), xr = lerp(caretX, BOX.x + BOX.w, open), top = lerp(0, BOX.y, open), hh = lerp(H, BOX.hh, open);
      add(<div key="open" style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: xl, top, width: 2, height: hh, background: "#fff" }} />
        <div style={{ position: "absolute", left: xr - 2, top, width: 2, height: hh, background: "#fff" }} />
        <div style={{ position: "absolute", left: xl, top, width: xr - xl, height: 1.5, background: "rgba(255,255,255,.9)", opacity: open }} />
        <div style={{ position: "absolute", left: xl, top: top + hh - 1.5, width: xr - xl, height: 1.5, background: "rgba(255,255,255,.9)", opacity: open }} />
      </div>);
    }
  }

  // ===== B · 2.75–5.4 · grid, wireframe, snap to centre → it resolves into the Irona hero; the cursor clicks its CTA =====
  const PILL = { x: 960, y: 724 };
  const SOLT_IN = prog(s, 5.25, 5.72, Easing.bezier(0.4, 0, 0.2, 1));
  if (s > 2.74 && s < 5.75) {
    const imgK = prog(s, 3.55, 4.1, SM);
    const wire = 1 - prog(s, 3.7, 4.05), grid = 1 - prog(s, 3.85, 4.2);
    const frameR = prog(s, 2.78, 3.0) * 30;
    const drag = prog(s, 3.08, 3.38, SNAP), snapFlash = win(s, 3.36, 3.4, 3.46, 3.62);
    const cardOut = prog(s, 5.2, 5.45);
    const X = (v: number) => BOX.x + v, Y = (v: number) => BOX.y + v;
    const blocks: [number, number, number, number, number, number][] = [[60, 32, 1450, 42, 21, 2.86], [445, 236, 680, 62, 12, 2.94], [575, 322, 420, 62, 12, 2.98], [720, 560, 130, 40, 20, 3.06], [450, 640, 680, 325, 14, 3.1]];
    const headDx = lerp(46, 0, drag);
    add(<AbsoluteFill key="iro">
      <Img src={img("h10_irona.jpg")} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: "blur(40px) brightness(.8)", opacity: prog(s, 3.6, 4.25, E.io) }} />
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.hh, borderRadius: frameR, overflow: "hidden", border: "1.5px solid rgba(255,255,255,.85)", background: `rgba(14,14,17,${0.55 * (1 - imgK) * prog(s, 2.74, 3.05, E.io)})`, boxShadow: imgK > 0 ? `0 30px 90px rgba(0,0,0,${0.3 * imgK})` : undefined }}>
        <Img src={img("h10_irona.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: imgK, filter: `blur(${(1 - imgK) * 24}px)`, transform: `scale(${lerp(1.04, 1, imgK)})`, WebkitMaskImage: `linear-gradient(90deg, #000 ${imgK * 140 - 40}%, transparent ${imgK * 140}%)`, maskImage: `linear-gradient(90deg, #000 ${imgK * 140 - 40}%, transparent ${imgK * 140}%)` }} />
      </div>
      {/* 12-column grid, drawn top-down */}
      {grid > 0 && Array.from({ length: 13 }, (_, i) => { const k = prog(s, 2.78 + i * 0.022, 3.08 + i * 0.022, SNAP); return <div key={`g${i}`} style={{ position: "absolute", left: X(60 + i * (BOX.w - 120) / 12), top: Y(18), width: 1, height: (BOX.hh - 36) * k, background: "rgba(255,255,255,.22)", opacity: grid }} />; })}
      {/* wireframe blocks */}
      {wire > 0 && blocks.map(([x, y, w, hh, r, a], i) => { const k = prog(s, a, a + 0.22, E.back); return <div key={`b${i}`} style={{ position: "absolute", left: X(x), top: Y(y), width: w, height: hh, borderRadius: r, background: "rgba(255,255,255,.11)", border: "1.5px solid rgba(255,255,255,.5)", opacity: k * wire, transform: `scale(${lerp(0.92, 1, k)})` }} />; })}
      {/* the headline block: dragged onto the centre guide, it snaps */}
      {wire > 0 && (() => { const k = prog(s, 2.9, 3.1, E.back); return <div style={{ position: "absolute", left: X(485) + headDx, top: Y(150), width: 600, height: 62, borderRadius: 12, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.95)", opacity: k * wire }}>
        {[[-6, -6], [594, -6], [-6, 56], [594, 56]].map(([x, y], j) => <div key={j} style={{ position: "absolute", left: x - 1, top: y - 1, width: 12, height: 12, background: "#fff", border: "1.5px solid #111" }} />)}
        <div style={{ position: "absolute", left: 0, top: -34, padding: "4px 10px", borderRadius: 6, background: "#fff", color: "#111", fontFamily: MONO, fontSize: 14, whiteSpace: "nowrap" }}>H1 · Inter 96 / 1.05</div>
      </div>; })()}
      {snapFlash > 0 && <div style={{ position: "absolute", left: CX - 1, top: Y(10), width: 2, height: BOX.hh - 20, background: "#fff", opacity: snapFlash * 0.9 }} />}
      {s > 3.0 && s < 3.6 && <Arrow x={X(785) + headDx + 40} y={Y(181)} op={prog(s, 3.0, 3.08) * (1 - prog(s, 3.45, 3.6))} />}
      {/* the side blocks become live stat cards */}
      {[{ y: 150, t: "Occupancy", b: 83, u: "%" }, { y: 302, t: "Enquiries this month", b: 64, u: "" }].map((c, i) => { const k = prog(s, 2.98 + i * 0.08, 3.2 + i * 0.08, E.back), fill = prog(s, 3.85 + i * 0.08, 4.1 + i * 0.08); return <div key={`c${i}`} style={{ position: "absolute", left: 1352, top: c.y, width: 370, height: 130, opacity: k * (1 - cardOut), transform: `scale(${lerp(0.92, 1, k)})`, filter: cardOut > 0 ? `blur(${cardOut * 10}px)` : undefined }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "rgba(255,255,255,.11)", border: "1.5px solid rgba(255,255,255,.5)", opacity: 1 - fill }} />
        <div style={{ position: "absolute", inset: 0, opacity: fill }}><Card w={370} hh={130}><div style={{ fontSize: 16, opacity: 0.6 }}>{c.t}</div><div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 4 }}>{count(s, 3.9, 5.2, 0, c.b)}{c.u}</div></Card></div>
      </div>; })}
      <Tag left="01 — IRONA · ARCHITECTURE" k={prog(s, 3.6, 3.9) * (1 - prog(s, 5.25, 5.45))} />
      {/* the cursor clicks the hero's own CTA — the click opens the next site */}
      {s > 4.35 && s < 5.6 && (() => { const ck = prog(s, 4.4, 4.95, E.io), press = win(s, 5.1, 5.15, 5.2, 5.3); return <><Hand x={lerp(1560, PILL.x + 4, ck)} y={lerp(1010, PILL.y + 6, ck)} press={press} op={prog(s, 4.35, 4.45) * (1 - prog(s, 5.35, 5.55))} /><Ripple x={PILL.x} y={PILL.y} k={prog(s, 5.18, 5.6)} /></>; })()}
    </AbsoluteFill>);
  }

  // ===== C · 5.25–7.7 · Solt opens from the click point inside the same container, over-bright, then settles =====
  if (s > 5.22 && s < 7.95) {
    const settle = prog(s, 5.42, 5.85, SM);
    const reveal = (a: number) => prog(s, a, a + 0.28, E.out);
    const bands = [{ c: [0, 0, 0, 86], a: 5.8 }, { c: [58, 56, 0, 4], a: 5.88 }, { c: [69, 56, 0, 4], a: 5.98 }, { c: [80, 56, 0, 4], a: 6.08 }, { c: [70, 0, 10, 62], a: 6.2 }, { c: [86, 0, 2, 80], a: 6.3 }];
    const all = prog(s, 6.35, 6.65);
    const r = SOLT_IN * 110 + 0.1, ox = (PILL.x / W) * 100, oy = (PILL.y / H) * 100;
    const mask = SOLT_IN < 1 ? `radial-gradient(ellipse ${r}% ${r}% at ${ox}% ${oy}%, #000 62%, transparent 100%)` : "none";
    add(<AbsoluteFill key="solt" style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <Img src={img("h03_solt.jpg")} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: "blur(40px) brightness(.6)" }} />
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.hh, borderRadius: 30, overflow: "hidden", background: "#0B0B0D", boxShadow: "0 30px 90px rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.18)", filter: `brightness(${lerp(1.75, 1, settle)})` }}>
        <Img src={img("h03_solt.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `blur(${lerp(14, 8, settle)}px) brightness(1.1)` }} />
        {bands.map((b, i) => <Img key={i} src={img("h03_solt.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(${b.c[0]}% ${b.c[1]}% ${b.c[2]}% ${b.c[3]}%)`, opacity: reveal(b.a), filter: `blur(${(1 - reveal(b.a)) * 10}px)` }} />)}
        <Img src={img("h03_solt.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: all }} />
      </div>
      {(() => { const kk = prog(s, 6.1, 6.42, E.back); return <div style={{ position: "absolute", left: 1400, top: 240, transform: `scale(${kk}) rotate(${(1 - kk) * -6}deg)`, opacity: kk }}><Photo src={img("h03_solt.jpg")} w={300} hh={190} pos="60% 28%" /></div>; })()}
      <Tag left="02 — SOLT WAGNER · PERSONAL BRAND" k={prog(s, 5.6, 5.9) * (1 - prog(s, 7.3, 7.5))} />
    </AbsoluteFill>);
    if (SOLT_IN > 0 && SOLT_IN < 1) add(<AbsoluteFill key="soltglow" style={{ background: `radial-gradient(ellipse ${r + 6}% ${r + 6}% at ${ox}% ${oy}%, rgba(255,255,255,0) 55%, rgba(236,238,244,${0.35 * Math.sin(Math.PI * SOLT_IN)}) 80%, rgba(255,255,255,0) 100%)` }} />);
  }

  // ===== D · 7.3–9.7 · CRAFT dissolves in soft blobs; then the camera dives into the chrome =====
  if (s > 7.28 && s < 9.75) {
    const blob = (bx: number, by: number, a: number) => { const rr = prog(s, a, a + 0.5, Easing.bezier(0.4, 0, 0.3, 1)) * 105; return `radial-gradient(ellipse ${rr + 0.1}% ${rr * 1.5 + 0.1}% at ${bx}% ${by}%, #000 55%, transparent 100%)`; };
    const mask = s > 8.0 ? "none" : [blob(76, 80, 7.3), blob(28, 68, 7.37), blob(58, 24, 7.44), blob(10, 18, 7.5)].join(", ");
    const sharp = prog(s, 7.45, 8.0, SM);
    const dive = prog(s, 8.95, 9.7, E.in);
    const IS = BOX.w / (2560 * 0.66), IW = 2560 * IS, IH = 1664 * IS, IL = -0.34 * 2560 * IS, IT = -0.2 * 1664 * IS;
    add(<AbsoluteFill key="craft" style={{ WebkitMaskImage: mask, maskImage: mask, transform: `scale(${Math.pow(9, dive)})`, transformOrigin: "1190px 610px", filter: dive > 0 ? `blur(${dive * 26}px)` : undefined }}>
      <Img src={img("h07_mindful.jpg")} style={{ position: "absolute", inset: -60, width: W + 120, height: H + 120, objectFit: "cover", filter: "blur(40px) brightness(.55)" }} />
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.hh, borderRadius: 30, overflow: "hidden", background: "#050506", boxShadow: "0 30px 90px rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.14)", filter: `blur(${(1 - sharp) * 22}px)` }}>
        <Img src={img("h07_mindful.jpg")} style={{ position: "absolute", left: IL, top: IT, width: IW, height: IH }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: BOX.hh, background: "linear-gradient(90deg, #050506 0%, #050506 22%, rgba(5,5,6,0) 52%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 760, background: "radial-gradient(120% 100% at 0% 0%, #050506 62%, rgba(5,5,6,0) 100%)" }} />
        <div style={{ position: "absolute", left: 0, width: BOX.w, top: 120, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", fontSize: 280, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {"CRAFT".split("").map((c, i) => { const kk = prog(s, 7.78 + i * 0.06, 8.16 + i * 0.06, E.out); return <span key={i} style={{ display: "inline-block", opacity: kk, transform: `translateY(${(1 - kk) * 50}px)`, filter: `blur(${(1 - kk) * 12}px)`, background: "linear-gradient(180deg, #FFFFFF, #8D9099)", WebkitBackgroundClip: "text", color: "transparent" }}>{c}</span>; })}
        </div>
        <Img src={img("chrome_cut.png")} style={{ position: "absolute", left: IL, top: IT, width: IW, height: IH }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 760, height: 420, background: "radial-gradient(90% 100% at 0% 100%, rgba(5,5,6,.82) 0%, rgba(5,5,6,.55) 45%, rgba(5,5,6,0) 100%)" }} />
        <div style={{ position: "absolute", left: 70, bottom: 80, fontFamily: SANS, fontWeight: 500, fontSize: 54, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff" }}>{typed("Explore", s, 8.1, 8.3)}<br />{typed("the craft", s, 8.3, 8.55)}</div>
      </div>
      <Tag left="03 — MINDFUL · PRODUCT LAUNCH" k={prog(s, 7.7, 8.0) * (1 - prog(s, 8.9, 9.05))} />
    </AbsoluteFill>);
  }

  // ===== E · 9.45–14.65 · PRECISION: the hairline writes the word, the chrome spiral rises, annotated; Light → Dark =====
  if (s > 9.45 && s < 14.7) {
    const inK = prog(s, 9.45, 9.72, E.io);
    const dark = s > 13.2;
    const sweep = prog(s, 9.8, 10.55, Easing.bezier(0.5, 0, 0.2, 1));
    const rise = prog(s, 9.6, 10.3, E.out);
    const ann = (a: number) => prog(s, a, a + 0.35, E.out);
    const seg = prog(s, 11.85, 12.2, E.out);
    const ck = prog(s, 12.15, 12.7, E.io), press = win(s, 12.85, 12.9, 12.97, 13.06);
    const flick1 = prog(s, 12.95, 13.1, E.io) * (1 - prog(s, 13.12, 13.28, E.io)), flick2 = prog(s, 13.0, 13.2, E.io) * (1 - prog(s, 13.24, 13.58, E.io));
    const script = prog(s, 13.35, 14.1, Easing.bezier(0.35, 0, 0.55, 1));
    const sparkle = prog(s, 13.2, 13.4, E.io) * (1 - prog(s, 13.6, 14.1, E.io));
    const spin = prog(s, 14.1, 14.65, E.in);
    const fl = Math.sin(s * 1.3) * 8, rot = Math.sin(s * 0.9) * 2.2;
    const SPK: React.ReactNode[] = [];
    if (sparkle > 0) for (let i = 0; i < 88 * 22; i++) {
      const cx = i % 88, cy = Math.floor(i / 88), y = cy * 22 + 6;
      if (h(i, 11) < sparkle * Math.pow(cl01(1 - y / 520), 1.4) * 0.5 && h(i + Math.floor(s * 20) * 5, 13) > 0.3) SPK.push(<div key={i} style={{ position: "absolute", left: cx * 22 + 4, top: y, width: 5, height: 5, background: "#fff", opacity: 0.45 + h(i, 4) * 0.5 }} />);
    }
    const pts = [{ px: 760, py: 380, lx: 210, ly: 470, t: "ease  cubic-bezier(.3, 0, .2, 1)", a: 10.6 }, { px: 1130, py: 720, lx: 1300, ly: 812, t: "60 fps · rendered in code", a: 10.85 }, { px: 860, py: 600, lx: 210, ly: 640, t: "templates used: 0", a: 11.1 }];
    add(<AbsoluteFill key="prec" style={{ opacity: inK }}>
      <AbsoluteFill style={{ background: dark ? "linear-gradient(180deg, #060608 0%, #1A1B20 25%, #5E616A 50%, #B2B5BD 72%, #DCDEE2 100%)" : "linear-gradient(180deg, #9A9CA5 0%, #B7B9C1 45%, #E3E4E8 100%)" }} />
      {/* the word, written by the hairline */}
      <div style={{ position: "absolute", left: 0, width: W, top: 118, textAlign: "center", fontFamily: WIDE, fontWeight: dark ? 500 : 800, fontStretch: "125%", fontSize: 214, lineHeight: 1, letterSpacing: "-0.01em", whiteSpace: "nowrap", clipPath: `inset(-20px ${(1 - sweep) * 100}% -20px 0)` }}>{dark ? <GradText g="linear-gradient(180deg, #FFFFFF 30%, rgba(255,255,255,.6) 100%)">PRECISION</GradText> : <span style={{ color: "rgba(255,255,255,.92)" }}>PRECISION</span>}</div>
      {sweep > 0 && sweep < 1 && <div style={{ position: "absolute", left: 40 + sweep * (W - 80), top: 70, width: 2, height: 320, background: "#fff" }} />}
      {SPK}
      {/* the chrome spiral (cut from the Orbsite hero) in front of the word */}
      <Img src={img("spiral_cut.png")} style={{ position: "absolute", left: CX - 380, top: 225 + (1 - rise) * 560 + fl, width: 760, height: 760 * 1015 / 500, transform: `rotate(${rot + spin * 420}deg) scale(${1 + spin * spin * 5})`, transformOrigin: "50% 30%", filter: `${dark ? "contrast(1.12) brightness(1.04)" : "contrast(1.04)"}${spin > 0 ? ` blur(${spin * 18}px)` : ""}` }} />
      {dark && <div style={{ position: "absolute", left: 900, top: 560, width: 1000, height: 520, overflow: "hidden", clipPath: `inset(0 ${(1 - script) * 100}% 0 0)`, opacity: 1 - spin }}><div style={{ position: "absolute", left: 20, top: 0, fontFamily: SERIF, fontStyle: "italic", fontSize: 330, lineHeight: 1, whiteSpace: "nowrap" }}><GradText g="linear-gradient(90deg, #07070A 0%, #1C1D23 55%, #6F727C 100%)">in motion</GradText></div></div>}
      {/* annotations: leader lines from the shape to mono labels */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - spin }}>
        {pts.map((p, i) => { const k = ann(p.a); const ex = p.lx + (p.lx < CX ? 390 : -10), ey = p.ly + 18; return k > 0 ? <g key={i}><circle cx={p.px} cy={p.py + fl} r={6 * k} fill="#fff" /><line x1={p.px} y1={p.py + fl} x2={lerp(p.px, ex, k)} y2={lerp(p.py + fl, ey, k)} stroke="rgba(255,255,255,.85)" strokeWidth={1.5} /></g> : null; })}
      </svg>
      {pts.map((p, i) => { const k = ann(p.a + 0.15); return <div key={`l${i}`} style={{ position: "absolute", left: p.lx, top: p.ly, padding: "7px 12px", borderRadius: 8, background: "rgba(255,255,255,.92)", color: "#111", fontFamily: MONO, fontSize: 19, whiteSpace: "nowrap", opacity: k * (1 - spin), transform: `translateY(${(1 - k) * 8}px)` }}>{p.t}</div>; })}
      {/* the Light / Dark control: the cursor switches the layout */}
      {seg > 0 && (() => { const on = prog(s, 12.92, 13.08, SNAP); return <div style={{ position: "absolute", left: CX - 170, top: 930 + (1 - seg) * 40, width: 340, height: 68, transform: "scale(1.35)", transformOrigin: "50% 50%", borderRadius: 34, opacity: seg * (1 - prog(s, 13.6, 13.9)), ...glassDark, display: "flex", alignItems: "center", fontFamily: SANS, fontSize: 22, color: "#fff" }}>
        <div style={{ position: "absolute", left: 6 + on * 164, top: 6, width: 164, height: 54, borderRadius: 27, background: "#fff" }} />
        <div style={{ position: "relative", width: 170, textAlign: "center", color: on < 0.5 ? "#111" : "rgba(255,255,255,.8)" }}>Light</div>
        <div style={{ position: "relative", width: 170, textAlign: "center", color: on >= 0.5 ? "#111" : "rgba(255,255,255,.8)" }}>Dark</div>
      </div>; })()}
      {s > 12.1 && s < 13.4 && <Hand x={lerp(1560, CX + 119, ck)} y={lerp(1060, 970, ck)} press={press} op={prog(s, 12.1, 12.2) * (1 - prog(s, 13.15, 13.35))} />}
      {flick1 > 0 && <AbsoluteFill style={{ background: "#F2F1EE", opacity: flick1 * 0.4 }} />}
      {flick2 > 0 && <AbsoluteFill style={{ background: "linear-gradient(180deg, #2A2C32, #9C9FA8 60%, #DADCE1)", opacity: flick2 * 0.94 }} />}
      {/* render counter, bottom left */}
      <div style={{ position: "absolute", left: 110, top: 960, fontFamily: MONO, fontSize: 18, letterSpacing: "0.1em", color: dark ? "rgba(14,15,18,.7)" : "rgba(255,255,255,.8)", opacity: prog(s, 10.2, 10.5) * (1 - spin) }}>RENDER {String(Math.round(lerp(0, 100, prog(s, 10.2, 13.0, lin)))).padStart(3, "0")}%</div>
    </AbsoluteFill>);
  }

  // ===== G · 19.85–27.75 · the train window: the agent answers a 02:14 enquiry; the view shrinks into the list =====
  const T8 = { t0: 19.85, src: 2.6, rate: 0.65 };
  const tsNow = T8.src + (s - T8.t0) * T8.rate;
  const shrinkT = prog(s, 26.55, 26.95, SNAP);
  if (s > 19.85 && s < 27.75) {
    const r = winRect(tsNow);
    const ww = r.x1 - r.x0;
    const cardK = prog(s, 20.75, 21.15, SM), cardOut = prog(s, 25.55, 25.95, SNAP);
    const cs = Math.min(1.22, (ww * 0.74) / 620);
    const msg = (a: number) => prog(s, a, a + 0.3, SM);
    const head = typed("Even at 02:14,", s, 21.15, 21.75), head2 = typed("your brand answers.", s, 23.75, 24.4);
    const headSwap = prog(s, 23.55, 23.72);
    const sc = lerp(1, LT.w / W, shrinkT), tx = lerp(0, LT.x + LT.w / 2 - CX, shrinkT);
    add(<AbsoluteFill key="agent" style={{ background: shrinkT > 0 ? BG.deep : undefined }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${tx}px, 0px) scale(${sc})`, borderRadius: lerp(0, 40, shrinkT), overflow: "hidden", boxShadow: shrinkT > 0 ? "0 30px 80px rgba(0,0,0,.4)" : undefined }}>
        <Sequence from={F(T8.t0)} durationInFrames={F(27.75 - T8.t0) + 4} layout="none"><OffthreadVideo src={ft("v1_train.mp4")} startFrom={F(T8.src)} playbackRate={T8.rate} muted style={{ width: W, height: H }} /></Sequence>
        {/* the chat lives in the window glass */}
        {cardK > 0 && <div style={{ position: "absolute", left: (r.x0 + r.x1) / 2 - 310 * cs, top: (r.y0 + r.y1) / 2 - 235 * cs, width: 620, height: 470, transform: `scale(${cs * lerp(0.94, 1, cardK) * lerp(1, 0.55, cardOut)})`, transformOrigin: "50% 0%", opacity: cardK * (1 - cardOut), filter: `blur(${(1 - cardK) * 12 + cardOut * 6}px)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "rgba(250,250,252,.84)", border: "1.5px solid rgba(255,255,255,.95)", boxShadow: "0 30px 80px rgba(0,0,0,.35)", backdropFilter: "blur(20px)", fontFamily: SANS, color: "#16161A" }}>
            <div style={{ position: "absolute", left: 28, right: 28, top: 22, display: "flex", alignItems: "center", gap: 12, fontSize: 19 }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background: "#0E0F12", display: "flex", alignItems: "center", justifyContent: "center" }}><EmblemSVG size={22} /></div>
              <div style={{ flex: 1 }}><b style={{ fontWeight: 600 }}>Villa Marina</b><div style={{ fontSize: 14, opacity: 0.55 }}>Enquiries · 02:14</div></div>
              <div style={{ fontSize: 14, opacity: 0.7, display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "#16161A" }} />Agent online</div>
            </div>
            <div style={{ position: "absolute", left: 28, right: 28, top: 82, height: 1, background: "rgba(0,0,0,.08)" }} />
            {[{ a: 21.3, who: 0, t: "Hi — is the sea-view suite free 12–15 June?", y: 104 }, { a: 22.6, who: 1, t: typed("It is. I've held it for you until noon — shall I send the booking link?", s, 22.6, 23.35), y: 178 }, { a: 23.9, who: 0, t: "Yes please.", y: 272 }].map((m, i) => { const k = msg(m.a); return <div key={i} style={{ position: "absolute", top: m.y, [m.who ? "right" : "left"]: 28, maxWidth: 420, padding: "13px 18px", borderRadius: 20, background: m.who ? "#0E0F12" : "rgba(0,0,0,.06)", color: m.who ? "#fff" : "#16161A", fontSize: 19, lineHeight: 1.35, opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>{m.t}</div>; })}
            {s > 21.9 && s < 22.6 && <div style={{ position: "absolute", right: 28, top: 178, padding: "14px 18px", borderRadius: 20, background: "#0E0F12", display: "flex", gap: 6 }}>{[0, 1, 2].map((j) => <span key={j} style={{ width: 8, height: 8, borderRadius: 4, background: "#fff", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((s * 6 - j * 0.6) * Math.PI)) }} />)}</div>}
            {(() => { const k = prog(s, 24.45, 24.8, E.back); return <div style={{ position: "absolute", left: 28, right: 28, top: 346, height: 96, borderRadius: 20, background: "#0E0F12", color: "#fff", display: "flex", alignItems: "center", gap: 16, padding: "0 24px", opacity: k, transform: `scale(${lerp(0.9, 1, k)})` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={22} height={22} viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" stroke="#111" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <div><div style={{ fontSize: 20, fontWeight: 600 }}>Booked · deposit received</div><div style={{ fontSize: 15, opacity: 0.6 }}>Sea-view suite · 12–15 June · 02:16</div></div>
            </div>; })()}
          </div>
        </div>}
        {/* the line above the window */}
        <div style={{ position: "absolute", left: 0, width: W, top: 74, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 70, letterSpacing: "-0.03em", color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,.35)", opacity: 1 - prog(s, 26.15, 26.45) }}>
          {headSwap < 1 && <span style={{ opacity: 1 - headSwap, filter: `blur(${headSwap * 10}px)` }}>{head}</span>}
          {s > 23.7 && <span>{head2}</span>}
        </div>
        <div style={{ position: "absolute", left: 0, width: W, top: 1018, textAlign: "center", fontFamily: MONO, fontSize: 17, letterSpacing: "0.16em", color: "rgba(255,255,255,.72)", opacity: prog(s, 24.6, 24.9) * (1 - prog(s, 26.15, 26.45)) }}>AI AGENTS · POWERED BY AVANT INTELLIGENCE</div>
      </div>
    </AbsoluteFill>);
  }

  // ===== F · 14.4–20.7 · tennis: ONE SHOOT. → crop marks reframe it → EVERY FORMAT. → the banner becomes the window =====
  if (s > 14.4 && s < 20.7) {
    const wash = 1 - prog(s, 14.45, 14.95, SM);
    const fly = (txt: string, i: number, n: number, a: number) => {
      const kk = prog(s, a + i * 0.05, a + 0.4 + i * 0.05, E.out);
      const dx = (h(i, n) - 0.5) * 900, dy = (h(i, n + 3) - 0.5) * 500, rr = (h(i, n + 5) - 0.5) * 60;
      return <span key={`${n}${i}`} style={{ display: "inline-block", whiteSpace: "pre", transform: `translate(${(1 - kk) * dx}px, ${(1 - kk) * dy}px) rotate(${(1 - kk) * rr}deg)`, opacity: kk, filter: `blur(${(1 - kk) * 10}px)` }}>{txt[i]}</span>;
    };
    const k1 = prog(s, 15.9, 16.4, SNAP), k2 = prog(s, 17.3, 17.8, SNAP), k3 = prog(s, 18.7, 19.2, SNAP), k4 = prog(s, 19.85, 20.45, SNAP);
    const R0 = { x: 0, y: 0, w: W, hh: H }, R1 = { x: 690, y: 60, w: 540, hh: 960 }, R2 = { x: 530, y: 110, w: 860, hh: 860 }, R3 = { x: 160, y: 90, w: 1600, hh: 900 };
    const wr = winRect(T8.src + Math.max(0, s - T8.t0) * T8.rate), R4 = { x: wr.x0, y: wr.y0, w: wr.x1 - wr.x0, hh: wr.y1 - wr.y0 };
    const mix = (a: typeof R0, b: typeof R0, k: number) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), hh: lerp(a.hh, b.hh, k) });
    const R = mix(mix(mix(mix(R0, R1, k1), R2, k2), R3, k3), R4, k4);
    const rad = lerp(lerp(0, 28, k1), 46, k4);
    const dim = prog(s, 15.9, 16.3) * (1 - k4);
    const inner = 1 - prog(s, 20.05, 20.6, E.io);
    const ui = (a: number, b: number) => prog(s, a, a + 0.25) * (1 - prog(s, b, b + 0.2));
    const clip = s > 19.85 ? `inset(${R.y}px ${W - R.x - R.w}px ${H - R.y - R.hh}px ${R.x}px round ${rad}px)` : undefined;
    add(<AbsoluteFill key="ten" style={{ clipPath: clip, opacity: inner }}>
      <AbsoluteFill style={{ background: BG.sky, filter: wash > 0 ? `brightness(${1 + wash * 0.55}) contrast(${1 - wash * 0.35}) blur(${wash * 9}px)` : undefined, opacity: prog(s, 14.36, 14.62, E.io) }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1.16, 1.24, prog(s, 14.4, 20.7, lin))})`, transformOrigin: "50% 100%" }}>
          <Sequence from={F(14.4)} durationInFrames={F(6.4)} layout="none"><OffthreadVideo src={ft("v3_key.webm")} transparent startFrom={F(1.9)} playbackRate={0.85} muted style={{ width: W, height: H }} /></Sequence>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>);
    // the frame furniture: dim outside the crop, corner marks, labels, ad UI
    add(<AbsoluteFill key="crop" style={{ opacity: 1 - prog(s, 20.25, 20.6) }}>
      {dim > 0 && <div style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.hh, borderRadius: rad, boxShadow: `0 0 0 4000px rgba(8,8,10,${0.62 * dim})`, border: `1.5px solid rgba(255,255,255,${0.85 * dim})` }} />}
      {dim > 0 && [[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map(([cx, cy, sx, sy], i) => <div key={i} style={{ position: "absolute", left: R.x + cx * R.w - 14 * sx - (sx < 0 ? 2 : 0), top: R.y + cy * R.hh - 14 * sy - (sy < 0 ? 2 : 0), width: 30, height: 30, borderLeft: sx > 0 ? "2px solid #fff" : undefined, borderRight: sx < 0 ? "2px solid #fff" : undefined, borderTop: sy > 0 ? "2px solid #fff" : undefined, borderBottom: sy < 0 ? "2px solid #fff" : undefined, transform: `translate(${-sx * 10}px, ${-sy * 10}px)`, opacity: dim }} />)}
      {[{ t: "9:16 — STORY", a: 16.3, b: 17.3 }, { t: "1:1 — FEED", a: 17.75, b: 18.7 }, { t: "16:9 — BANNER", a: 19.15, b: 19.85 }].map((l, i) => <div key={i} style={{ position: "absolute", left: R.x, top: R.y - 34, fontFamily: MONO, fontSize: 16, letterSpacing: "0.16em", color: "rgba(255,255,255,.85)", opacity: ui(l.a, l.b) }}>{l.t}</div>)}
      {/* story UI */}
      <div style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.hh, opacity: ui(16.35, 17.25), fontFamily: SANS, color: "#fff" }}>
        <div style={{ position: "absolute", left: 18, right: 18, top: 16, display: "flex", gap: 6 }}>{[0, 1, 2].map((j) => <div key={j} style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,.35)" }}><div style={{ width: `${j === 0 ? prog(s, 16.4, 17.3, lin) * 100 : 0}%`, height: 4, borderRadius: 2, background: "#fff" }} /></div>)}</div>
        <div style={{ position: "absolute", left: 18, top: 34, display: "flex", alignItems: "center", gap: 10, fontSize: 17 }}><div style={{ width: 34, height: 34, borderRadius: 17, background: "#fff" }} /><div><b style={{ fontWeight: 600 }}>courtline</b><div style={{ fontSize: 13, opacity: 0.8 }}>Sponsored</div></div></div>
        <div style={{ position: "absolute", left: "50%", bottom: 34, transform: "translateX(-50%)", padding: "14px 26px", borderRadius: 26, background: "#fff", color: "#111", fontSize: 18, fontWeight: 600, whiteSpace: "nowrap" }}>Book a session ›</div>
      </div>
      {/* feed UI */}
      <div style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.hh, opacity: ui(17.8, 18.65), fontFamily: SANS, color: "#fff" }}>
        <div style={{ position: "absolute", left: 22, right: 22, top: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 18 }}><div style={{ width: 36, height: 36, borderRadius: 18, background: "#fff" }} /><b style={{ flex: 1, fontWeight: 600 }}>courtline</b><span style={{ fontSize: 26, lineHeight: 0 }}>···</span></div>
        <div style={{ position: "absolute", left: 22, bottom: 22, fontSize: 18 }}><div style={{ display: "flex", gap: 18, marginBottom: 8 }}>{["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z", "M4 12a8 8 0 1 1 3 6.2L4 20l1.2-3.4A8 8 0 0 1 4 12z", "M4 12l16-8-6 16-3-7z"].map((d, j) => <svg key={j} width={30} height={30} viewBox="0 0 24 24"><path d={d} stroke="#fff" strokeWidth={1.8} fill="none" strokeLinejoin="round" /></svg>)}</div><b style={{ fontWeight: 600 }}>Liked by {Math.round(lerp(2140, 2418, prog(s, 17.8, 18.6)))} players</b></div>
      </div>
      {/* banner UI */}
      <div style={{ position: "absolute", left: R.x, top: R.y, width: R.w, height: R.hh, opacity: ui(19.2, 19.85), color: "#fff" }}>
        <div style={{ position: "absolute", left: 60, top: 44, fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: "0.18em" }}>COURTLINE</div>
        <div style={{ position: "absolute", left: 60, top: 330, fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", fontSize: 84, lineHeight: 1 }}>OWN THE<br />COURT.</div>
        <div style={{ position: "absolute", left: 60, top: 540, padding: "16px 30px", borderRadius: 30, background: "#fff", color: "#111", fontFamily: SANS, fontSize: 20, fontWeight: 600 }}>Join the club →</div>
      </div>
      {/* ONE SHOOT. / EVERY FORMAT. */}
      {(() => { const k = 1 - prog(s, 17.25, 17.5); const c = (txt: string, n: number, a: number) => txt.split("").map((_, i) => fly(txt, i, n, a)); return <>
        <div style={{ position: "absolute", right: W - 640, top: 380, textAlign: "right", fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", fontSize: 96, lineHeight: 1.02, letterSpacing: "-0.01em", color: "#fff", opacity: k, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}><div>{c("ONE", 1, 14.75)}</div><div>{c("SHOOT.", 3, 14.9)}</div></div>
        <div style={{ position: "absolute", left: 1280, top: 520, fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", fontSize: 96, lineHeight: 1.02, letterSpacing: "-0.01em", color: "#fff", opacity: k, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined }}><div>{c("EVERY", 7, 16.45)}</div><div>{c("FORMAT.", 9, 16.6)}</div></div>
      </>; })()}
    </AbsoluteFill>);
  }

  // ===== H · 26.55–30.8 · the services list (the window view is the first thumbnail) =====
  if (s > 26.55 && s < 30.84) {
    const WORDS = ["AI agents", "Ad campaigns", "Brand identities", "Booking flows", "Websites"];
    const THUMB = ["", img("t_tennis.jpg"), img("h03_solt.jpg"), img("h11_villa.jpg"), img("h10_irona.jpg")];
    const steps = [27.7, 28.4, 29.1, 29.8];
    let idx = 0; steps.forEach((t) => { idx += prog(s, t, t + 0.3, E.io); });
    const cur = Math.round(idx);
    const since = Math.max(26.85, ...steps.filter((t) => s >= t)), tgt = steps.filter((t) => s >= t).length;
    const flashT = steps.some((t) => s > t - 0.03 && s < t + 0.2);
    const ROW = 262, TX = LT.x + LT.w + 62, NX = 262;
    const lineIn = prog(s, 26.7, 27.0, E.out);
    const out = prog(s, 30.35, 30.6);
    const growT = prog(s, 30.3, 30.8, SNAP);
    const TR = { x: lerp(LT.x, BOX.x, growT), y: lerp(CY - LT.hh / 2, BOX.y, growT), w: lerp(LT.w, BOX.w, growT), hh: lerp(LT.hh, BOX.hh, growT) };
    add(<AbsoluteFill key="list">
      {s > 27.68 && <AbsoluteFill style={{ background: BG.deep }} />}
      <div style={{ position: "absolute", left: LT.x + LT.w, right: 0, top: CY - LT.hh / 2, height: LT.hh, background: "linear-gradient(90deg, rgba(255,255,255,.03), rgba(235,238,245,.16) 55%, rgba(255,255,255,.05))", opacity: lineIn * (1 - out) }} />
      {[CY - LT.hh / 2, CY + LT.hh / 2].map((y, j) => <div key={j} style={{ position: "absolute", left: 172, right: 0, top: y, height: 1, background: "rgba(255,255,255,.2)", transform: `scaleX(${lineIn})`, transformOrigin: "0 0", opacity: 1 - out }} />)}
      <div style={{ position: "absolute", left: 172, top: 0, width: 1, height: H, background: "rgba(255,255,255,.14)", transform: `scaleY(${lineIn})`, transformOrigin: "0 0", opacity: 1 - out }} />
      {WORDS.map((wd, i) => {
        const d = i - idx, a = Math.abs(d), on = cl01(1 - a);
        const txt = i === tgt ? typed(wd, s, since + 0.02, since + 0.32) : wd;
        return <div key={i} style={{ position: "absolute", left: lerp(NX, TX, on), top: CY - 80 + d * ROW, fontFamily: SANS, fontWeight: 400, fontSize: 134, lineHeight: 1.2, letterSpacing: "-0.03em", color: "#fff", whiteSpace: "nowrap", opacity: Math.max(0, lerp(0.3, 1, on) - Math.max(0, a - 1) * 0.22) * prog(s, 26.75, 26.95) * (1 - out), filter: `blur(${Math.min(5, a * 2.2)}px)` }}>{txt}</div>;
      })}
      {s > 27.68 && <div style={{ position: "absolute", left: TR.x, top: TR.y, width: flashT ? TR.w * 0.62 : TR.w, height: TR.hh, borderRadius: lerp(10, 30, growT), overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,.4)" }}>
        {flashT || !THUMB[cur] ? <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #5A5D68, #F2F3F5)" }} /> : <Img src={THUMB[cur]} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%" }} />}
      </div>}
    </AbsoluteFill>);
  }

  // ===== I · 30.75–33.55 · every site: the camera pulls back from Irona over the whole wall → "Built from scratch." =====
  if (s >= 30.8 && s < 33.6) {
    const WALL = ["h10_irona.jpg", "h03_solt.jpg", "h07_mindful.jpg", "h11_villa.jpg", "h12_aigreen.jpg", "h05_amplify.jpg", "h06_silence.jpg", "h09_fern.jpg", "h02_aichat.jpg", "h08_teeblix.jpg", "h04_orsbite.jpg", "h01_monitor.jpg"];
    const TW = BOX.w, TH = BOX.hh, GAP = 70, WW = 4 * TW + 3 * GAP, WH = 3 * TH + 2 * GAP;
    const k = prog(s, 30.8, 32.3, Easing.bezier(0.55, 0, 0.15, 1));
    const sc0 = 1, sc1 = (W * 0.84) / WW, sc = Math.exp(lerp(Math.log(sc0), Math.log(sc1), k));
    const fx = lerp(TW / 2, WW / 2, k), fy = lerp(TH / 2, WH / 2, k), sx = lerp(BOX.x + TW / 2, CX, k), sy = lerp(BOX.y + TH / 2, CY, k);
    const scrim = prog(s, 32.0, 32.4), drop = prog(s, 33.05, 33.5, E.in);
    add(<AbsoluteFill key="wall" style={{ background: BG.deep }}>
      {WALL.map((f, i) => { const c = i % 4, r = Math.floor(i / 4); const x = sx + (c * (TW + GAP) - fx) * sc, y = sy + (r * (TH + GAP) - fy) * sc; const dk = cl01(drop * 1.6 - h(i, 3) * 0.6); return <div key={i} style={{ position: "absolute", left: x, top: y + dk * 120, width: TW * sc, height: TH * sc, borderRadius: 30 * sc, overflow: "hidden", opacity: 1 - dk, boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}><Img src={img(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>; })}
      <AbsoluteFill style={{ background: `rgba(8,8,10,${0.6 * scrim})` }} />
      <div style={{ position: "absolute", left: 0, width: W, top: CY - 90, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 124, letterSpacing: "-0.04em", color: "#fff", opacity: 1 - drop }}><Blur k={prog(s, 32.05, 32.35)}>Built from scratch.</Blur></div>
      <div style={{ position: "absolute", left: 0, width: W, top: CY + 60, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 64, letterSpacing: "-0.03em", opacity: 1 - drop }}><Blur k={prog(s, 32.45, 32.75)}><GradText g="linear-gradient(90deg, #C9CBD2, #7A7D87)">Every time.</GradText></Blur></div>
    </AbsoluteFill>);
  }

  // ===== J · 33.45–36.4 · the 3D emblem =====
  if (s > 33.45 && s < 36.4) {
    const grow = prog(s, 33.5, 34.8, Easing.bezier(0.2, 0.7, 0.2, 1)), back = prog(s, 34.95, 35.75, E.io);
    const sc = lerp(0.4, 3.9, grow) * lerp(1, 150 / 245 / 3.9, back);
    const ry = lerp(75, -18, grow) + back * 18, rx = 12 * (1 - back);
    add(<AbsoluteFill key="emb" style={{ perspective: 1600 }}>
      <AbsoluteFill style={{ background: BG.deep, opacity: prog(s, 33.45, 33.7, E.io) }} />
      <div style={{ position: "absolute", left: CX - 100, top: CY - 122, width: 200, height: 245, opacity: prog(s, 33.45, 33.75, E.io), filter: s < 33.75 ? `blur(${(1 - prog(s, 33.45, 33.75)) * 12}px)` : undefined, transformStyle: "preserve-3d", transform: `scale(${sc}) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${-i * 2.6}px)` }}><EmblemSVG size={245} fill={i === 0 ? "url(#bar7)" : `rgb(${150 - i * 7},${150 - i * 7},${156 - i * 7})`} /></div>)}
      </div>
    </AbsoluteFill>);
  }

  // ===== K · 35.75–40 · OBSIDIAN, the line, the caret =====
  if (s > 35.75) {
    const sl = prog(s, 36.15, 36.5, E.io), sz = lerp(150, 245 * LockLS, sl);
    const tag = typed("Digital precision that builds reputation.", s, 37.05, 38.2);
    const tagW = textW("Digital precision that builds reputation.", "300 36px Inter", 0.36);
    const end = prog(s, 39.3, 40.0);
    add(<AbsoluteFill key="end" style={{ background: BG.horizon, opacity: prog(s, 35.75, 36.25, E.io) }}>
      {s < 36.5 && <div style={{ position: "absolute", left: lerp(CX - 61, CX - LockLW / 2, sl), top: lerp(CY - 75, CY - 50 - 122 * LockLS, sl) }}><EmblemSVG size={sz} /></div>}
      {s >= 36.5 && <Lockup s={s} t0={36.5} x={CX} y={CY - 50} />}
      <div style={{ position: "absolute", left: CX - tagW / 2, top: CY + 110, fontFamily: SANS, fontWeight: 300, fontSize: 36, letterSpacing: "0.01em", color: "rgba(255,255,255,.78)", whiteSpace: "nowrap" }}>{tag}<span style={{ display: "inline-block", width: 3, height: 36, marginLeft: 6, verticalAlign: "-6px", background: "#fff", opacity: s > 37.0 && (s < 38.25 || Math.floor(s * 2.4) % 2 === 0) ? 0.9 : 0 }} /></div>
      {end > 0 && <AbsoluteFill style={{ background: "#000", opacity: end }} />}
    </AbsoluteFill>);
  }

  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{L}</AbsoluteFill>;
};
