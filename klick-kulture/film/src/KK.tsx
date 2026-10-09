// Klick Kulture — "Makes you click" (Obsidian demo film, 9:16, ~42 s, cut to the ElevenLabs voice take).
// Built only from KK's own brand board + services guide: their colours, Aileron/Poppins, their black-and-white
// cutout collages (hand from the yellow floor, TV-head, halftone finger-heart), chevrons, X marks and like-icons.
//  1 FEED      grey feed in 2.5D; "Every brand has a story" types into one post; the feed rushes past.
//  2 THE HAND  a yellow post arrives; KK's hand rises out of the hole and the feed stops dead. Push into the post.
//  3 THE CLICK a heart, a wind-up, the snap: rings of KK colour burst out of the fingertips.
//  4 PLAYGROUND pull back: the floor is a floating slab in a colour world; the camera trucks to OUR DIGITAL PLAYGROUND.
//  5 THE PHONE  a phone spins 360° in; strategy meets story; swipe; content sparks conversation (bubbles pop out).
//  6 CLICKS     a cursor clicks the like and the services; the clicks connect into a network.
//  7 CHECKLIST  the nodes become tick boxes; ticked mechanically; a black X; it falls. The collage is crafted.
//  8 CHATTER    grey bubbles bury everything; they part; the TV-head walks up; ROAR — the bubbles blow away.
//  9 THE K      a black disc swallows the frame, shrinks into the K, the wordmark slides out; Ready to klick with us?
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";

export const FPS = 60;
export const DUR = 42;

// ---------------------------------------------------------------- helpers
const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  io: Easing.bezier(0.65, 0, 0.35, 1),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  soft: Easing.bezier(0.33, 0, 0.2, 1),
};
const prog = (s: number, a: number, b: number, ease = E.out) =>
  interpolate(s, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const h = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const img = (f: string) => staticFile("img/" + f);

const K = {
  off: "#FCFCFC", grey: "#E9E9E9", ink: "#151515", ink2: "#222222", yellow: "#FCD41F", floor: "#FED000",
  sky: "#93D8EA", teal: "#4ECDC4", pink: "#FFB6EB", coral: "#FF6B6B", hot: "#FF6392", feedBg: "#ECECEA",
};
const HEAD = "Aileron, Helvetica, Arial, sans-serif";
const BODY = "Poppins, Helvetica, Arial, sans-serif";
const WIDE = "ArchivoW, Helvetica, Arial, sans-serif";
const GRAD = `linear-gradient(170deg, ${K.sky} 0%, #B9D7F2 38%, #F3C3EC 72%, ${K.pink} 100%)`;

// voice timing (film seconds; voice placed at +0.4 s)
const T = {
  every: 0.4, story: 1.72, most: 3.36, scrolled: 4.29, but: 6.03, stop: 7.33, stopHit: 7.6, feel: 8.87,
  makes: 10.65, click: 11.92, welcome: 13.36, playground: 14.7, strategy: 15.82, meets: 17.06, content: 18.64,
  sparks: 19.71, every2: 21.79, becomes: 23.4, tick: 25.59, craft: 27.69, because: 29.99, brand: 32.59,
  roar: 34.39, kk: 36.34, ready: 37.9,
};

// ---------------------------------------------------------------- small brand parts
const HeartIcon: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = K.coral, style }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110" style={style}>
    <path d="M18 0 H82 A18 18 0 0 1 100 18 V72 A18 18 0 0 1 82 90 H62 L50 106 L38 90 H18 A18 18 0 0 1 0 72 V18 A18 18 0 0 1 18 0 Z" fill={color} />
    <path d="M50 74 C24 56 22 36 34 30 C42 26 48 30 50 36 C52 30 58 26 66 30 C78 36 76 56 50 74 Z" fill="#fff" />
  </svg>
);
const Chevrons: React.FC<{ n?: number; size?: number; dir?: "down" | "up"; color?: string; s?: number; t0?: number; style?: React.CSSProperties }> = ({ n = 5, size = 70, dir = "down", color = K.ink, s = 99, t0 = 0, style }) => (
  <div style={{ position: "absolute", display: "flex", flexDirection: dir === "down" ? "column" : "column-reverse", gap: size * 0.02, ...style }}>
    {Array.from({ length: n }, (_, i) => {
      const k = prog(s, t0 + i * 0.07, t0 + i * 0.07 + 0.35, E.back);
      const wave = 0.75 + 0.25 * Math.sin(s * 3 - i * 0.9);
      return (
        <svg key={i} width={size} height={size * 0.5} viewBox="0 0 80 40" style={{ opacity: k * wave, transform: `translateY(${(1 - k) * (dir === "down" ? -20 : 20)}px) ${dir === "up" ? "rotate(180deg)" : ""}` }}>
          <path d="M10 8 L40 30 L70 8" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    })}
  </div>
);
const XMark: React.FC<{ size: number; color?: string; w?: number; k?: number; style?: React.CSSProperties }> = ({ size, color = K.ink, w = 6, k = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
    <path d="M10 10 L50 50" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(k * 2)} />
    <path d="M50 10 L10 50" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(k * 2 - 1)} />
  </svg>
);
const Bolt: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 62 100" style={style}>
    <polygon points="34,2 4,58 28,58 18,98 58,38 34,38 44,2" fill={K.yellow} stroke={K.ink} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);
const Cursor: React.FC<{ size?: number; press?: number; style?: React.CSSProperties }> = ({ size = 64, press = 0, style }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 30 39" style={{ ...style, transform: `${style?.transform || ""} scale(${1 - press * 0.14})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.25))" }}>
    <path d="M2 2 L2 31 L9.5 24 L14.5 36 L20 33.6 L15 22 L25 22 Z" fill={K.ink} stroke="#fff" strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);
const Chip: React.FC<{ text: string; size?: number; bg?: string; color?: string; k?: number; style?: React.CSSProperties }> = ({ text, size = 34, bg = K.ink, color = "#fff", k = 1, style }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <div style={{ background: bg, color, fontFamily: HEAD, fontWeight: 800, fontSize: size, letterSpacing: "0.04em", lineHeight: 1, padding: `${size * 0.32}px ${size * 0.5}px ${size * 0.28}px`, whiteSpace: "nowrap", transform: `translateY(${(1 - k) * 110}%)` }}>{text}</div>
  </div>
);
// torn-paper polygon (deterministic jagged edge)
const torn = (w: number, hh: number, seed: number, j = 7) => {
  const pts: string[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number, n: number, e: number) => {
    for (let i = 0; i < n; i++) {
      const k = i / n, nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
      const off = (h(i + e * 31, seed) - 0.5) * 2 * j;
      pts.push(`${(x0 + (x1 - x0) * k + (nx / L) * off).toFixed(1)}px ${(y0 + (y1 - y0) * k + (ny / L) * off).toFixed(1)}px`);
    }
  };
  edge(0, 0, w, 0, Math.ceil(w / 16), 1); edge(w, 0, w, hh, Math.ceil(hh / 16), 2); edge(w, hh, 0, hh, Math.ceil(w / 16), 3); edge(0, hh, 0, 0, Math.ceil(hh / 16), 4);
  return `polygon(${pts.join(",")})`;
};
const DrawnK: React.FC<{ size: number; s: number; t0: number; disc?: boolean }> = ({ size, s, t0, disc = true }) => {
  const a = prog(s, t0, t0 + 0.32, E.out), b = prog(s, t0 + 0.08, t0 + 0.42, E.back), c = prog(s, t0 + 0.16, t0 + 0.5, E.back);
  return (
    <svg width={size} height={size * 344 / 346} viewBox="0 0 346 344" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {disc && <circle cx={172.5} cy={171.5} r={166} fill={K.ink2} />}
      <rect x={80} y={89 + (1 - a) * 166} width={30} height={166 * a} fill="#fff" />
      <polygon points="176,89 212,89 157,172 211,256 175,256 120,172" fill="#fff" style={{ transform: `translateX(${(1 - b) * 260}px)`, opacity: b > 0.01 ? 1 : 0 }} />
      <polygon points="226,89 262,89 207,172 261,256 225,256 170,172" fill="#fff" style={{ transform: `translateX(${(1 - c) * 260}px)`, opacity: c > 0.01 ? 1 : 0 }} />
    </svg>
  );
};

// ---------------------------------------------------------------- 1 · the feed (scroll table)
const PITCH = 428;
const vRaw = (t: number) => {
  if (t < 3.3) return 50;
  if (t < 4.3) { const u = (t - 3.3) / 1.0; return 50 + 3350 * u * u * u; }
  if (t < 5.35) return 3400;
  if (t < T.stopHit) { const u = (t - 5.35) / (T.stopHit - 5.35); return 3400 * (1 - u) * (1 - u); }
  return 0;
};
const P0 = -70;
const SCROLL = (() => {
  const dt = 1 / 600, n = Math.ceil(10 / dt) + 2, raw = new Float32Array(n);
  let acc = 0; for (let i = 0; i < n; i++) { raw[i] = acc; acc += vRaw(i * dt) * dt; }
  const iStop = Math.round(T.stopHit / dt), kIdx = Math.round((P0 + raw[iStop]) / PITCH);
  const sc = (kIdx * PITCH - P0) / raw[iStop];
  return { raw, dt, sc, kIdx };
})();
const scrollAt = (t: number) => {
  const tt = Math.min(t, T.stopHit), i = Math.min(SCROLL.raw.length - 2, Math.floor(tt / SCROLL.dt)), f = tt / SCROLL.dt - i;
  let p = P0 + SCROLL.sc * (SCROLL.raw[i] * (1 - f) + SCROLL.raw[i + 1] * f);
  if (t > T.stopHit) { const u = t - T.stopHit; p += 26 * Math.exp(-6.5 * u) * Math.sin(2 * Math.PI * 2.3 * u); }
  return p;
};
const YELLOW_Y = SCROLL.kIdx * PITCH;
// plane camera: scale and tilt
const planeCam = (s: number) => {
  let sc = lerp(1.9, 1.78, prog(s, 0, 3.3, E.soft));
  sc = lerp(sc, 0.95, prog(s, 3.3, 5.0, E.io));
  sc = lerp(sc, 1.55, prog(s, 5.5, 7.7, E.io));
  const push = prog(s, 7.75, 9.0, Easing.bezier(0.55, 0, 0.25, 1));
  sc = sc * Math.pow(4.8 / 1.55, push);
  const rx = lerp(24, 0, push), rz = lerp(-11, 0, push);
  return { sc, rx, rz, push };
};
const CARD_W = 300, CARD_H = 400;

const PostSkeleton: React.FC<{ w: number; hh: number; seed: number; children?: React.ReactNode; bg?: string }> = ({ w, hh, seed, children, bg }) => {
  const tint = ["#E1E1DE", "#DADAD6", "#E6E6E3", "#D4D4D0"][Math.floor(h(seed, 2) * 4)];
  return (
    <div style={{ position: "absolute", width: w, height: hh, background: bg || "#F6F6F4", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 22px rgba(0,0,0,.06)" }}>
      <div style={{ position: "absolute", left: 14, top: 14, width: 30, height: 30, borderRadius: 15, background: "#D3D3CF" }} />
      <div style={{ position: "absolute", left: 54, top: 24, width: 84 + h(seed, 5) * 50, height: 10, borderRadius: 5, background: "#D9D9D5" }} />
      <div style={{ position: "absolute", left: 0, top: 58, width: w, height: hh - 132, background: tint }} />
      {children ?? (<>
        <div style={{ position: "absolute", left: 16, top: hh - 58, width: w * (0.55 + h(seed, 7) * 0.3), height: 10, borderRadius: 5, background: "#DCDCD8" }} />
        <div style={{ position: "absolute", left: 16, top: hh - 36, width: w * (0.3 + h(seed, 8) * 0.25), height: 10, borderRadius: 5, background: "#E2E2DE" }} />
      </>)}
    </div>
  );
};

// ---------------------------------------------------------------- 2 · the hand stage (stage coords 1080x1920)
const ST = { floorX: -546.6, floorY: 1276, handX: 281.4, handY: 422.2, holeX: 540, holeY: 1500, holeRX: 237, holeRY: 34, fx: 665, fy: 555, slabBottom: 1880 };
const handRise = (s: number) => prog(s, 6.1, T.stopHit, Easing.bezier(0.2, 1.18, 0.45, 1));
const HandStage: React.FC<{ s: number; vw: number; vh: number; z: number; fy: number; ox?: number; oy?: number }> = ({ s, vw, vh, z, fy, ox = 0, oy = 0 }) => {
  const hr = handRise(s);
  const wind = prog(s, T.makes, T.click - 0.06, E.soft) * (1 - prog(s, T.click - 0.06, T.click + 0.02, E.out));
  const pop = s >= T.click ? Math.exp(-(s - T.click) * 7) * Math.cos((s - T.click) * 22) : 0;
  const handT = `translateY(${(1 - hr) * 1150}px) rotate(${-3.2 * wind + 2.4 * pop}deg) scale(${1 - 0.018 * wind + 0.06 * pop})`;
  const glow = prog(s, 9.1, 10.3, E.soft) * (1 - prog(s, T.click + 0.2, T.click + 1.0));
  // heart that "feels something" rises from the finger heart
  const hk = prog(s, 9.2, 9.75, E.back), hy = prog(s, 9.2, 11.6, E.soft);
  const heartGone = prog(s, T.click, T.click + 0.25, E.out);
  // click: comic burst lines + bolts
  const bl = prog(s, T.click, T.click + 0.22, E.out), blo = 1 - prog(s, T.click + 0.25, T.click + 0.7, E.soft);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `translate(${vw / 2 - 540 * z + ox}px, ${vh / 2 - fy * z + oy}px) scale(${z})` }}>
      {/* pink feeling glow */}
      <div style={{ position: "absolute", left: ST.fx - 520, top: ST.fy - 520, width: 1040, height: 1040, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,182,235,${0.75 * glow}) 0%, rgba(255,182,235,${0.25 * glow}) 45%, rgba(255,182,235,0) 70%)` }} />
      {/* the hole, the floor slab and its front face */}
      <div style={{ position: "absolute", left: ST.holeX - ST.holeRX, top: ST.holeY - ST.holeRY, width: ST.holeRX * 2, height: ST.holeRY * 2, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 35%, #2b2b2b 0%, #0c0c0c 70%)" }} />
      <Img src={img("floor.png")} style={{ position: "absolute", left: ST.floorX, top: ST.floorY, width: 2318, height: 332 }} />
      <Img src={img("floor_shadow.png")} style={{ position: "absolute", left: ST.floorX, top: ST.floorY, width: 2318, height: 332, opacity: hr * hr }} />
      <Img src={img("hand.png")} style={{ position: "absolute", left: ST.handX, top: ST.handY, width: 792, height: 1128, transformOrigin: "340px 1050px", transform: handT }} />
      <Img src={img("floor_front.png")} style={{ position: "absolute", left: ST.floorX, top: ST.floorY, width: 2318, height: 332 }} />
      <div style={{ position: "absolute", left: ST.floorX, top: 1600, width: 2318, height: ST.slabBottom - 1600, background: K.floor }} />
      <div style={{ position: "absolute", left: ST.floorX, top: ST.slabBottom, width: 2318, height: 54, background: "linear-gradient(#E2B800, #C99F00)", borderRadius: "0 0 10px 10px" }} />
      {/* the heart */}
      {hk > 0 && heartGone < 1 && (
        <div style={{ position: "absolute", left: ST.fx - 70 + Math.sin(s * 2.2) * 12, top: ST.fy - 170 - hy * 120, transform: `scale(${hk * (1 - heartGone * 0.6)}) rotate(${Math.sin(s * 1.7) * 6}deg)`, opacity: 1 - heartGone, transformOrigin: "50% 100%" }}>
          <HeartIcon size={120} color={K.hot} />
        </div>
      )}
      {/* comic click burst */}
      {s >= T.click && blo > 0 && (
        <svg width={700} height={700} viewBox="-350 -350 700 700" style={{ position: "absolute", left: ST.fx - 350, top: ST.fy - 350, opacity: blo }}>
          {Array.from({ length: 11 }, (_, i) => {
            const a = (i / 11) * Math.PI * 2 - 0.4, r0 = 120 + 60 * bl, r1 = 170 + 150 * bl;
            return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={K.ink} strokeWidth={10} strokeLinecap="round" />;
          })}
        </svg>
      )}
      {s >= T.click && (
        <>
          <Bolt size={150} style={{ position: "absolute", left: ST.fx - 300, top: ST.fy - 230, transform: `scale(${prog(s, T.click + 0.04, T.click + 0.35, E.back)}) rotate(-18deg)` }} />
          <Bolt size={130} style={{ position: "absolute", left: ST.fx + 210, top: ST.fy - 260, transform: `scale(${prog(s, T.click + 0.1, T.click + 0.4, E.back)}) rotate(22deg)` }} />
        </>
      )}
    </div>
  );
};
// full-screen camera on the hand stage (after the push-in)
const HZ0 = 4.8 * (CARD_W / 1080);
const handCam = (s: number) => {
  let z = HZ0, fy = 1100;
  z = lerp(z, 1.42, prog(s, 9.0, 10.5, E.soft)); fy = lerp(fy, 980, prog(s, 9.0, 10.5, E.soft));
  z = lerp(z, 1.62, prog(s, T.makes - 0.1, T.click, E.io)); fy = lerp(fy, 800, prog(s, T.makes - 0.1, T.click, E.io));
  const kick = s > T.click ? 0.05 * Math.exp(-(s - T.click) * 9) : 0;
  z += kick;
  z = lerp(z, 1.18, prog(s, T.click + 0.15, 13.2, E.soft)); fy = lerp(fy, 900, prog(s, T.click + 0.15, 13.2, E.soft));
  const pb = prog(s, 13.25, 14.35, E.io);
  z = z * Math.pow(0.34 / 1.18, pb); fy = lerp(fy, 1180, pb);
  return { z, fy };
};
const fingerScreen = (s: number) => { const c = handCam(s); return { x: 540 + (ST.fx - 540) * c.z, y: 960 + (ST.fy - c.fy) * c.z }; };

// ---------------------------------------------------------------- 4 · playground world camera
const camX = (s: number) => lerp(0, 1240, prog(s, 13.9, 15.05, E.io)) + lerp(0, 1500, prog(s, 15.45, 16.4, E.io));
type Floater = { kind: "img" | "chev" | "x" | "heart" | "bolt"; src?: string; x: number; y: number; d: number; w: number; hh?: number; r: number; t: number; flip?: [number, number] };
const FLOAT: Floater[] = [
  { kind: "img", src: "team.jpg", x: 150, y: 470, d: 0.82, w: 330, hh: 264, r: -8, t: 13.55 },
  { kind: "img", src: "hearteyes.jpg", x: 900, y: 360, d: 0.7, w: 240, hh: 240, r: 9, t: 13.65 },
  { kind: "img", src: "climb.jpg", x: 120, y: 1520, d: 0.76, w: 220, hh: 220, r: 6, t: 13.75 },
  { kind: "img", src: "stairs.jpg", x: 960, y: 1560, d: 0.88, w: 250, hh: 250, r: -6, t: 13.8 },
  { kind: "img", src: "emoji.jpg", x: 1860, y: 420, d: 0.9, w: 330, hh: 264, r: 7, t: 13.9 },
  { kind: "img", src: "megaphone.jpg", x: 1720, y: 1470, d: 1.12, w: 270, hh: 270, r: -9, t: 13.95, flip: [14.55, 15.5] },
  { kind: "chev", x: 1020, y: 860, d: 1.25, w: 70, r: 0, t: 13.7 },
  { kind: "x", x: 640, y: 300, d: 1.05, w: 56, r: 0, t: 13.8 },
  { kind: "heart", x: 380, y: 1260, d: 1.15, w: 90, r: -10, t: 13.85 },
  { kind: "heart", x: 2050, y: 1100, d: 1.2, w: 80, r: 12, t: 14.1 },
  { kind: "bolt", x: 1480, y: 360, d: 1.0, w: 120, r: 14, t: 14.0 },
  { kind: "x", x: 2240, y: 1650, d: 0.95, w: 50, r: 0, t: 14.2 },
];

// ---------------------------------------------------------------- 5 · phone
const PH = { cx: 540, cy: 1000, w: 600, hh: 1230 };
const phoneIn = (s: number) => prog(s, 15.4, 16.2, E.out);
const phoneScale = (s: number) => lerp(0.62, 1, phoneIn(s)) * lerp(1, 1.05, prog(s, 16.2, 21.5, E.soft)) * lerp(1, 0.9, prog(s, T.becomes, 24.4, E.io));
const phoneLocalToScreen = (s: number, lx: number, ly: number) => { const sc = phoneScale(s); return { x: PH.cx + (lx - PH.w / 2) * sc, y: PH.cy + (ly - PH.hh / 2) * sc }; };
const HEART_LOCAL = { x: 18 + 40 + 24, y: 18 + 912 + 24 };
const BUBBLES = [
  { t: 19.8, x: 215, y: 290, text: "Love this!", c: K.pink },
  { t: 20.05, x: 860, y: 560, text: "Where is this??", c: K.teal },
  { t: 20.3, x: 175, y: 880, text: "Need this.", c: K.yellow },
  { t: 20.55, x: 830, y: 1140, text: "Saving this for later", c: K.sky },
  { t: 20.8, x: 330, y: 1770, text: "Booking now!", c: K.coral },
];
const CHIPS = [
  { t: 22.62, x: 880, y: 330, text: "SOCIAL" },
  { t: 22.92, x: 150, y: 1160, text: "SEO" },
  { t: 23.2, x: 800, y: 1770, text: "GOOGLE ADS" },
];
const cursorPath = (s: number) => {
  const hs = phoneLocalToScreen(s, HEART_LOCAL.x, HEART_LOCAL.y);
  const pts = [{ t: 21.65, x: 1000, y: 1780 }, { t: 22.3, x: hs.x, y: hs.y }, { t: 22.62, x: CHIPS[0].x, y: CHIPS[0].y }, { t: 22.92, x: CHIPS[1].x, y: CHIPS[1].y }, { t: 23.2, x: CHIPS[2].x, y: CHIPS[2].y }];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], t0 = i === 0 ? a.t : a.t + 0.05;
    if (s <= b.t - 0.04) { const k = prog(s, t0, b.t - 0.04, E.io); return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) }; }
    if (s <= b.t + 0.05) return { x: b.x, y: b.y };
  }
  const L = pts[pts.length - 1]; return { x: L.x, y: L.y };
};
const clickPress = (s: number) => [22.3, 22.62, 22.92, 23.2].reduce((m, t) => Math.max(m, Math.exp(-Math.pow((s - t) / 0.05, 2))), 0);

// ---------------------------------------------------------------- 7 · checklist
const CARD = { cx: 540, cy: 930, w: 840, hh: 900 };
const ROWS = ["Post. Anything.", "Copy the template", "Add 30 hashtags", "Do what everyone does", "Hope it works"];
const rowY = (i: number) => CARD.cy - CARD.hh / 2 + 230 + i * 132;
const BOX_X = CARD.cx - CARD.w / 2 + 70 + 34;
const TICKS = [25.72, 25.97, 26.22, 26.47, 26.72];
const XT = 26.95;
const NODES = (s: number) => {
  const hs = phoneLocalToScreen(s, HEART_LOCAL.x, HEART_LOCAL.y);
  return [
    { x: hs.x, y: hs.y }, { x: CHIPS[0].x, y: CHIPS[0].y }, { x: BUBBLES[1].x - 150, y: BUBBLES[1].y },
    { x: CHIPS[1].x, y: CHIPS[1].y }, { x: CHIPS[2].x, y: CHIPS[2].y },
  ];
};
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]];

// ---------------------------------------------------------------- 8 · chatter
const NB = 40;
const BUB = Array.from({ length: NB }, (_, i) => {
  const t = 29.7 + 2.3 * Math.pow(i / NB, 0.75);
  return { t, x: 60 + h(i, 1) * 960, y: 120 + h(i, 2) * 1680, w: 170 + h(i, 3) * 210, hh: 92 + h(i, 4) * 40, c: ["#D3D3CF", "#C6C6C2", "#DEDEDA", "#BDBDB9"][Math.floor(h(i, 5) * 4)], dots: h(i, 6) > 0.45, flip: h(i, 7) > 0.5 };
});
const TV = { left: 110, top: 520, w: 860, tvx: 530, tvy: 699 };

// ================================================================ the film
export const KK: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const s = frame / fps;

  // ---------- world background ----------
  const burst = s >= T.click;
  const fsc = fingerScreen(Math.min(s, 13.3));
  const BURST = [K.coral, K.teal, K.pink, K.yellow, "GRAD"];
  const toPaper = prog(s, 24.45, 25.3, E.soft);

  // ---------- 1+2 feed / hand ----------
  const pc = planeCam(s);
  const p = scrollAt(s);
  const speed = vRaw(Math.min(s, T.stopHit)) * SCROLL.sc;
  const blur = Math.min(26, Math.max(0, (speed - 300) / 120));
  const inFeed = s < 9.0;
  const handFull = s >= 9.0 && s < 16.6;

  // ---------- render ----------
  return (
    <AbsoluteFill style={{ background: K.feedBg, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs><filter id="vblur" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} /></filter></defs>
      </svg>

      {/* warm shift after the push-in, then the click's colour rings, then the gradient world */}
      {s >= 9.0 && <AbsoluteFill style={{ background: `linear-gradient(${K.feedBg}, ${K.feedBg})`, opacity: 1 }} />}
      {s >= 9.0 && <AbsoluteFill style={{ background: "#F5EFEA", opacity: prog(s, 9.0, 10.4, E.soft) }} />}
      {burst && BURST.map((c, i) => {
        const r = interpolate(s, [T.click + i * 0.075, T.click + i * 0.075 + 0.62], [0, 2400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0.6, 0.25, 1) });
        if (r <= 0) return null;
        return <AbsoluteFill key={i} style={{ background: c === "GRAD" ? GRAD : c, clipPath: `circle(${r}px at ${fsc.x}px ${fsc.y}px)` }} />;
      })}
      {s >= 24.45 && <AbsoluteFill style={{ background: K.off, opacity: toPaper }} />}

      {/* ===== 1 · the feed plane ===== */}
      {inFeed && (
        <AbsoluteFill style={{ perspective: 2400 }}>
          <div style={{ position: "absolute", left: W / 2, top: H / 2, width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${pc.rx}deg) rotateZ(${pc.rz}deg) scale(${pc.sc})` }}>
            <div style={{ position: "absolute", left: 0, top: 0, filter: blur > 0.5 ? "url(#vblur)" : undefined }}>
              {[-3, -2, -1, 0, 1, 2, 3].map((c) => {
                const off = c === 0 ? 0 : (h(c + 9, 3) - 0.5) * PITCH;
                const j0 = Math.floor((p - 2900 - off) / PITCH), j1 = Math.ceil((p + 2900 - off) / PITCH);
                const out: React.ReactNode[] = [];
                for (let j = j0; j <= j1; j++) {
                  const y = j * PITCH + off - p, x = c * (CARD_W + 28);
                  const isStory = c === 0 && j === 0, isYellow = c === 0 && j === SCROLL.kIdx;
                  const hh = c === 0 ? CARD_H : [360, 400, 330, 400, 370][((j % 5) + 5) % 5];
                  if (isYellow) {
                    out.push(
                      <div key={`${c}_${j}`} style={{ position: "absolute", left: x - CARD_W / 2, top: y - CARD_H / 2, width: CARD_W, height: CARD_H, borderRadius: lerp(18, 0, pc.push), overflow: "hidden", background: K.feedBg, boxShadow: `0 ${lerp(14, 0, pc.push)}px 40px rgba(0,0,0,${0.16 * (1 - pc.push)})` }}>
                        <HandStage s={s} vw={CARD_W} vh={CARD_H} z={CARD_W / 1080} fy={1100} />
                      </div>,
                    );
                    continue;
                  }
                  out.push(
                    <div key={`${c}_${j}`} style={{ position: "absolute", left: x - CARD_W / 2, top: y - hh / 2 }}>
                      <PostSkeleton w={CARD_W} hh={hh} seed={c * 100 + j} bg={isStory ? "#FFFFFF" : undefined}>
                        {isStory ? (
                          <>
                            <div style={{ position: "absolute", left: 0, top: 58, width: CARD_W, height: CARD_H - 132, background: "radial-gradient(circle at 60% 40%, #FFFFFF 0%, #F1EFEA 55%, #E4E2DD 100%)" }} />
                            <div style={{ position: "absolute", left: 16, top: CARD_H - 66, fontFamily: HEAD, fontWeight: 800, fontSize: 26, lineHeight: 1.1, color: K.ink, whiteSpace: "nowrap" }}>
                              <span style={{ clipPath: `inset(0 ${100 - 100 * prog(s, T.every, T.every + 0.7, E.soft)}% 0 0)`, display: "inline-block" }}>Every brand</span><br />
                              <span style={{ clipPath: `inset(0 ${100 - 100 * prog(s, T.story, T.story + 0.7, E.soft)}% 0 0)`, display: "inline-block" }}>has a story.</span>
                            </div>
                          </>
                        ) : undefined}
                      </PostSkeleton>
                    </div>,
                  );
                }
                return out;
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===== 2–4 · the hand stage, full screen, then a floating slab in the playground ===== */}
      {handFull && (() => {
        const c = handCam(s), ox = -camX(s);
        return <HandStage s={s} vw={W} vh={H} z={c.z} fy={c.fy} ox={ox} />;
      })()}

      {/* hearts burst from the click */}
      {s >= T.click && s < 14.6 && Array.from({ length: 12 }, (_, i) => {
        const u = s - T.click - i * 0.018; if (u <= 0) return null;
        const a = -Math.PI / 2 + (h(i, 1) - 0.5) * 2.6, v = 900 + h(i, 2) * 900;
        const x = fsc.x + Math.cos(a) * v * (1 - Math.exp(-u * 3)) / 3 * 3 - camX(s) * 0.5, y = fsc.y + Math.sin(a) * v * (1 - Math.exp(-u * 3)) / 3 * 3 + 260 * u * u;
        const sc = (0.55 + h(i, 3) * 0.6) * prog(u, 0, 0.25, E.back);
        return <div key={i} style={{ position: "absolute", left: x - 45, top: y - 50, transform: `scale(${sc}) rotate(${(h(i, 4) - 0.5) * 60 + u * 40}deg)`, opacity: 1 - prog(u, 1.4, 2.2) }}><HeartIcon size={90} color={i % 2 ? K.coral : K.hot} /></div>;
      })}

      {/* ===== 4 · playground floaters + headline ===== */}
      {s >= 13.45 && s < 16.8 && FLOAT.map((f, i) => {
        const k = prog(s, f.t, f.t + 0.5, E.back), cx = camX(s);
        const x = 540 + (f.x - cx - 540) * f.d, y = 960 + (f.y - 960) * f.d + Math.sin(s * 1.3 + i) * 10;
        const sc = f.d * k, rot = f.r + Math.sin(s * 0.9 + i * 2) * 3;
        const fl = f.flip ? 360 * prog(s, f.flip[0], f.flip[1], E.io) : 0;
        if (x < -500 || x > 1600) return null;
        let el: React.ReactNode = null;
        if (f.kind === "img") el = (
          <div style={{ width: f.w, height: f.hh, background: "#fff", padding: 10, borderRadius: 16, boxShadow: "0 24px 50px rgba(40,30,80,.22)" }}>
            <Img src={img(f.src!)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
          </div>
        );
        if (f.kind === "chev") el = <div style={{ position: "relative", width: 70, height: 200 }}><Chevrons n={5} size={70} s={s} t0={f.t} style={{ left: 0, top: 0 }} /></div>;
        if (f.kind === "x") el = <XMark size={f.w} w={7} />;
        if (f.kind === "heart") el = <HeartIcon size={f.w} color={K.coral} />;
        if (f.kind === "bolt") el = <Bolt size={f.w} />;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${fl}deg) rotate(${rot}deg) scale(${sc})` }}>{el}</div>
        );
      })}
      {s >= 13.4 && s < 16.8 && (() => {
        const cx = camX(s), x = 540 + (1240 - cx) - 400, y = 760;
        const bar = prog(s, 14.05, 14.45, E.out);
        return (
          <div style={{ position: "absolute", left: x, top: y }}>
            <Chip text="WELCOME TO" size={36} k={prog(s, T.welcome + 0.05, T.welcome + 0.45)} style={{ left: 0, top: -88 }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 16, height: 236 * bar, background: K.ink }} />
            {[["OUR DIGITAL", 14.15], ["PLAYGROUND", T.playground]].map(([t, a], i) => (
              <div key={i} style={{ position: "absolute", left: 40, top: i * 118, overflow: "hidden", height: 122 }}>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 118, lineHeight: 1, color: K.ink, whiteSpace: "nowrap", letterSpacing: "-0.01em", transform: `translateY(${(1 - prog(s, a as number, (a as number) + 0.45)) * 110}%)` }}>{t as string}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ===== 5–6 · the phone, bubbles, clicks ===== */}
      {s >= 15.35 && s < 25.2 && (() => {
        const pin = phoneIn(s), sc = phoneScale(s);
        const spin = lerp(540, 0, pin) + Math.sin(s * 0.8) * 4 * prog(s, 16.2, 17);
        const x = lerp(1500, PH.cx, pin), exit = prog(s, 24.45, 24.8, E.soft);
        const swipe = prog(s, 18.4, 18.85, E.io);
        const capA = "Where strategy", capB = " meets story.", capC = "Where content", capD = " sparks conversation.";
        const typed = (t: string, a: number, dur: number) => t.slice(0, Math.round(t.length * prog(s, a, a + dur, (x: number) => x)));
        const liked = s >= 22.3;
        return (
          <div style={{ position: "absolute", left: x - PH.w / 2, top: PH.cy - PH.hh / 2, width: PH.w, height: PH.hh, perspective: 2200, opacity: 1 - exit, transform: `scale(${sc})` }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${spin}deg)` }}>
              {/* back */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 78, background: "linear-gradient(140deg, #2a2a2a, #111)", backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "0 40px 80px rgba(20,10,60,.35)" }}>
                <div style={{ position: "absolute", left: 40, top: 40, width: 190, height: 190, borderRadius: 50, background: "#1c1c1c", boxShadow: "inset 0 0 0 3px #333" }} />
                <Img src={img("kmark.png")} style={{ position: "absolute", left: 220, top: 535, width: 160, height: 160, opacity: 0.9 }} />
              </div>
              {/* front */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 78, background: K.ink, backfaceVisibility: "hidden", boxShadow: "0 50px 90px rgba(20,10,60,.32)" }}>
                <div style={{ position: "absolute", left: 18, top: 18, width: PH.w - 36, height: PH.hh - 36, borderRadius: 62, background: K.off, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 210, top: 16, width: 144, height: 38, borderRadius: 20, background: K.ink }} />
                  <div style={{ position: "absolute", left: 44, top: 22, fontFamily: BODY, fontWeight: 600, fontSize: 24, color: K.ink }}>9:41</div>
                  <Img src={img("kmark.png")} style={{ position: "absolute", left: 30, top: 86, width: 66, height: 66 }} />
                  <div style={{ position: "absolute", left: 110, top: 100, fontFamily: BODY, fontWeight: 600, fontSize: 30, color: K.ink }}>klickkulture</div>
                  <div style={{ position: "absolute", right: 34, top: 96, fontFamily: BODY, fontWeight: 600, fontSize: 30, color: K.ink, letterSpacing: 2 }}>···</div>
                  {/* carousel */}
                  <div style={{ position: "absolute", left: 0, top: 180, width: PH.w - 36, height: 700, overflow: "hidden", background: "#eee" }}>
                    {["team.jpg", "emoji.jpg"].map((f, i) => (
                      <Img key={f} src={img(f)} style={{ position: "absolute", left: (i - swipe) * (PH.w - 36), top: 0, width: PH.w - 36, height: 700, objectFit: "cover", transform: `scale(${1.04 + 0.04 * Math.sin(s * 0.5)})` }} />
                    ))}
                    <Chip text="STRATEGY" size={34} k={prog(s, 16.0, 16.4) * (1 - prog(s, 18.3, 18.5, E.in))} style={{ left: 26, bottom: 26 }} />
                    <Chip text="CONTENT" size={34} k={prog(s, 18.75, 19.15)} style={{ left: 26, bottom: 26 }} />
                  </div>
                  <div style={{ position: "absolute", left: 0, width: PH.w - 36, top: 892, display: "flex", justifyContent: "center", gap: 10 }}>
                    {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: Math.round(swipe) === i ? K.sky : "#CFCFCB" }} />)}
                  </div>
                  {/* actions */}
                  <svg width={48} height={48} viewBox="0 0 24 24" style={{ position: "absolute", left: 40, top: 912, transform: `scale(${1 + 0.35 * Math.exp(-Math.pow((s - 22.36) / 0.09, 2))})` }}>
                    <path d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8.2 3.6 5 6.8 5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.2 0 5.2 3.2 4 6.4-1.7 4.5-9.2 9.1-9.2 9.1z" fill={liked ? K.coral : "none"} stroke={liked ? K.coral : K.ink} strokeWidth={1.9} strokeLinejoin="round" />
                  </svg>
                  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", left: 110, top: 913 }}><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5z" fill="none" stroke={K.ink} strokeWidth={1.9} strokeLinejoin="round" /></svg>
                  <svg width={46} height={46} viewBox="0 0 24 24" style={{ position: "absolute", left: 178, top: 913 }}><path d="M21 3 3 10.5l7.2 2.6L13 20.5z M10.2 13.1 21 3" fill="none" stroke={K.ink} strokeWidth={1.9} strokeLinejoin="round" /></svg>
                  <div style={{ position: "absolute", left: 40, top: 986, width: PH.w - 110, fontFamily: BODY, fontWeight: 500, fontSize: 31, lineHeight: 1.32, color: K.ink }}>
                    <b style={{ fontWeight: 600 }}>klickkulture </b>
                    {s < 18.5 ? <>{typed(capA, T.strategy, 0.6)}{typed(capB, T.meets, 0.55)}</> : <>{typed(capC, T.content, 0.6)}{typed(capD, T.sparks, 0.8)}</>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* the phone's white screen becomes the checklist card */}
      {s >= 24.3 && s < 25.25 && (() => {
        const S0 = phoneScale(24.3), k = prog(s, 24.5, 25.2, E.io), op = prog(s, 24.3, 24.48, E.soft);
        const w0 = (PH.w - 36) * S0, h0 = (PH.hh - 36) * S0;
        const w = lerp(w0, CARD.w, k), hh = lerp(h0, CARD.hh, k), cx = PH.cx, cy = lerp(PH.cy, CARD.cy, k);
        return <div style={{ position: "absolute", left: cx - w / 2, top: cy - hh / 2, width: w, height: hh, borderRadius: lerp(62 * S0, 26, k), background: "#fff", opacity: op, boxShadow: `0 30px 80px rgba(0,0,0,${0.12 * k})` }} />;
      })()}
      {/* connection network, then the nodes fly into the checklist */}
      {s >= T.becomes - 0.1 && s < 25.8 && (() => {
        const N = NODES(Math.min(s, 24.3));
        const fly = prog(s, 24.4, 25.25, E.io);
        const pos = N.map((n, i) => ({ x: lerp(n.x, BOX_X, fly), y: lerp(n.y, rowY(i), fly) }));
        const lineOut = 1 - prog(s, 24.3, 24.7, E.soft);
        return (
          <>
            <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
              {LINKS.map(([a, b], i) => {
                const k = prog(s, T.becomes + i * 0.12, T.becomes + i * 0.12 + 0.45, E.io);
                return <line key={i} x1={pos[a].x} y1={pos[a].y} x2={lerp(pos[a].x, pos[b].x, k)} y2={lerp(pos[a].y, pos[b].y, k)} stroke={K.ink} strokeWidth={4} strokeLinecap="round" opacity={lineOut} />;
              })}
            </svg>
            {pos.map((q, i) => {
              const nk = prog(s, T.becomes + i * 0.1, T.becomes + i * 0.1 + 0.3, E.back);
              const sz = lerp(28, 68, fly), rad = lerp(14, 12, fly);
              return <div key={i} style={{ position: "absolute", left: q.x - sz / 2, top: q.y - sz / 2, width: sz, height: sz, borderRadius: rad, background: fly < 0.6 ? K.coral : "transparent", border: `${lerp(0, 5, fly)}px solid ${K.ink}`, transform: `scale(${nk})`, opacity: 1 - prog(s, 25.25, 25.4) }} />;
            })}
          </>
        );
      })()}
      {/* conversation bubbles pop out of the phone */}
      {s >= 19.75 && s < 25.2 && BUBBLES.map((b, i) => {
        const k = prog(s, b.t, b.t + 0.5, E.back), exit = prog(s, 24.3 + i * 0.03, 24.85 + i * 0.03, E.in);
        if (k <= 0) return null;
        const x = lerp(PH.cx, b.x, prog(s, b.t, b.t + 0.45, E.out)), y = lerp(PH.cy - 150, b.y, prog(s, b.t, b.t + 0.45, E.out)) + Math.sin(s * 1.6 + i) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k * (1 - exit * 0.3)})`, opacity: 1 - exit }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 30px 18px 18px", borderRadius: 40, background: "rgba(255,255,255,0.9)", boxShadow: "0 22px 50px rgba(30,20,70,.18)", border: "1.5px solid rgba(255,255,255,.95)", whiteSpace: "nowrap" }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: b.c }} />
              <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 32, color: K.ink }}>{b.text}</div>
            </div>
          </div>
        );
      })}
      {/* service chips appear where the cursor clicks */}
      {s >= 22.5 && s < 25.2 && CHIPS.map((c, i) => {
        const k = prog(s, c.t + 0.02, c.t + 0.32, E.back), exit = prog(s, 24.3, 24.8, E.in);
        const ring = prog(s, c.t, c.t + 0.5, E.out);
        return (
          <React.Fragment key={i}>
            {s >= c.t && ring < 1 && <div style={{ position: "absolute", left: c.x - 90 * ring, top: c.y - 90 * ring, width: 180 * ring, height: 180 * ring, borderRadius: "50%", border: `4px solid ${K.ink}`, opacity: 1 - ring }} />}
            <div style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%,-50%) scale(${k * (1 - exit * 0.4)})`, opacity: 1 - exit }}>
              <div style={{ background: K.ink, color: "#fff", fontFamily: HEAD, fontWeight: 800, fontSize: 40, letterSpacing: "0.05em", padding: "16px 24px 13px", whiteSpace: "nowrap" }}>{c.text}</div>
            </div>
          </React.Fragment>
        );
      })}
      {/* the like click ring */}
      {s >= 22.3 && s < 23.0 && (() => { const hs = phoneLocalToScreen(s, HEART_LOCAL.x, HEART_LOCAL.y), r = prog(s, 22.3, 22.85); return <div style={{ position: "absolute", left: hs.x - 110 * r, top: hs.y - 110 * r, width: 220 * r, height: 220 * r, borderRadius: "50%", border: `5px solid ${K.coral}`, opacity: 1 - r }} />; })()}
      {/* the cursor */}
      {s >= 21.6 && s < 24.4 && (() => { const c = cursorPath(s); return <Cursor size={70} press={clickPress(s)} style={{ position: "absolute", left: c.x - 4, top: c.y - 4, opacity: 1 - prog(s, 23.6, 24.0) }} />; })()}

      {/* ===== 7 · the checklist ===== */}
      {s >= 25.2 && s < 28.2 && (() => {
        const k = 1, fall = prog(s, 27.18, 27.78, E.in);
        const shake = s > XT && s < XT + 0.35 ? Math.sin((s - XT) * 80) * 10 * (1 - (s - XT) / 0.35) : 0;
        return (
          <div style={{ position: "absolute", left: CARD.cx - CARD.w / 2 + shake, top: CARD.cy - CARD.hh / 2 + fall * 1700, width: CARD.w, height: CARD.hh, transform: `scale(${lerp(0.94, 1, k)}) rotate(${fall * 14}deg)`, opacity: k, background: "#fff", borderRadius: 26, boxShadow: "0 30px 80px rgba(0,0,0,.12)" }}>
            <Chip text="THE USUAL CHECKLIST" size={34} k={prog(s, 25.1, 25.5)} style={{ left: 70, top: 70 }} />
            {ROWS.map((r, i) => {
              const tk = prog(s, TICKS[i], TICKS[i] + 0.16, E.out);
              return (
                <React.Fragment key={i}>
                  <div style={{ position: "absolute", left: 70, top: rowY(i) - (CARD.cy - CARD.hh / 2) - 34, width: 68, height: 68, borderRadius: 12, border: `5px solid ${K.ink}`, boxSizing: "border-box", opacity: prog(s, 25.2, 25.35) }} />
                  <svg width={68} height={68} viewBox="0 0 24 24" style={{ position: "absolute", left: 70, top: rowY(i) - (CARD.cy - CARD.hh / 2) - 34 }}>
                    <path d="M5.5 12.5l4.2 4.2L19 7.2" fill="none" stroke={K.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tk} />
                  </svg>
                  <div style={{ position: "absolute", left: 172, top: rowY(i) - (CARD.cy - CARD.hh / 2) - 26, fontFamily: BODY, fontWeight: 500, fontSize: 40, color: tk > 0.5 ? "#8D8D8A" : K.ink, opacity: prog(s, 25.15 + i * 0.05, 25.45 + i * 0.05), whiteSpace: "nowrap" }}>{r}</div>
                </React.Fragment>
              );
            })}
            <XMark size={780} w={5.2} k={prog(s, XT, XT + 0.26, E.out)} style={{ position: "absolute", left: 30, top: 60 }} />
          </div>
        );
      })()}

      {/* ===== 7b · we craft experiences: the collage assembles ===== */}
      {s >= 27.55 && s < 33.2 && (() => {
        const grey = prog(s, 30.2, 32.0, E.soft), gone = prog(s, 32.4, 33.0, E.soft);
        const PIECES = [
          { c: K.sky, x: 540, y: 860, w: 640, hh: 640, r: 0, t: 27.62, round: true, from: [0, -1400] },
          { c: K.pink, x: 300, y: 690, w: 330, hh: 430, r: -9, t: 27.72, from: [-900, -300] },
          { c: K.teal, x: 800, y: 1170, w: 320, hh: 280, r: 11, t: 27.8, from: [900, 300] },
          { c: K.yellow, x: 540, y: 1420, w: 980, hh: 190, r: -4, t: 27.86, from: [0, 900] },
          { c: K.coral, x: 770, y: 560, w: 170, hh: 170, r: 18, t: 27.92, from: [800, -800] },
        ];
        return (
          <AbsoluteFill style={{ filter: `grayscale(${grey}) brightness(${1 - grey * 0.08})`, opacity: 1 - gone }}>
            {PIECES.map((q, i) => {
              const k = prog(s, q.t, q.t + 0.55, E.back);
              return <div key={i} style={{ position: "absolute", left: q.x - q.w / 2 + q.from[0] * (1 - k), top: q.y - q.hh / 2 + q.from[1] * (1 - k), width: q.w, height: q.hh, background: q.c, clipPath: q.round ? "circle(49% at 50% 50%)" : torn(q.w, q.hh, i + 3, 8), transform: `rotate(${q.r + (1 - k) * 30}deg)`, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }} />;
            })}
            {(() => { const k = prog(s, 27.95, 28.6, E.out); return <Img src={img("halftone_hand.png")} style={{ position: "absolute", left: 540 - 230, top: 560 + (1 - k) * 1300, width: 460, height: 1146, transform: `rotate(${Math.sin(s * 1.1) * 1.5}deg)`, transformOrigin: "50% 100%" }} />; })()}
            <div style={{ position: "absolute", left: 300 - 50, top: 560, transform: `scale(${prog(s, 28.4, 28.75, E.back)}) rotate(-12deg)` }}><HeartIcon size={100} color={K.hot} /></div>
            <div style={{ position: "absolute", left: 780, top: 1000, transform: `scale(${prog(s, 28.5, 28.85, E.back)}) rotate(10deg)` }}><HeartIcon size={84} color={K.coral} /></div>
            <Chevrons n={5} size={72} s={s} t0={28.3} style={{ left: 900, top: 330 }} />
            <div style={{ position: "absolute", left: 120, top: 1180, display: "flex", flexDirection: "column", gap: 14 }}>
              {[0, 1, 2, 3].map((i) => <XMark key={i} size={46} w={7} k={prog(s, 28.45 + i * 0.06, 28.75 + i * 0.06)} />)}
            </div>
            <Bolt size={130} style={{ position: "absolute", left: 690, top: 640, transform: `scale(${prog(s, 28.55, 28.9, E.back)}) rotate(18deg)` }} />
            <Chip text="CRAFTING EXPERIENCES," size={50} bg={K.yellow} color={K.ink} k={prog(s, 28.3, 28.7, E.out)} style={{ left: 120, top: 210 }} />
            <Chip text="NOT JUST SERVICES" size={50} bg={K.yellow} color={K.ink} k={prog(s, 28.5, 28.9, E.out)} style={{ left: 120, top: 290 }} />
          </AbsoluteFill>
        );
      })()}

      {/* ===== 8 · chatter, the brand, ROAR ===== */}
      {s >= 33.9 && s < 36.2 && (() => {
        const r = interpolate(s, [T.roar - 0.02, T.roar + 0.45], [0, 2300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E.out });
        return r > 0 ? <AbsoluteFill style={{ background: K.yellow, clipPath: `circle(${r}px at ${TV.tvx}px ${TV.tvy}px)` }} /> : null;
      })()}
      {s >= T.roar - 0.05 && s < 36.2 && (() => {
        const k = prog(s, T.roar, T.roar + 0.2, E.out), sh = s < T.roar + 0.5 ? Math.sin((s - T.roar) * 70) * 14 * (1 - (s - T.roar) / 0.5) : 0;
        return <div style={{ position: "absolute", left: 0, width: W, top: 300 + sh, textAlign: "center", fontFamily: WIDE, fontWeight: 900, fontStretch: "125%", fontSize: 248, lineHeight: 1, color: K.ink, letterSpacing: "-0.02em", transform: `scale(${lerp(1.35, 1, k)})`, opacity: k }}>ROAR</div>;
      })()}
      {s >= 32.4 && s < 36.2 && (() => {
        const rise = prog(s, T.brand - 0.1, T.brand + 1.1, E.out);
        const sh = s > T.roar && s < T.roar + 0.5 ? Math.sin((s - T.roar) * 60) * 8 * (1 - (s - T.roar) / 0.5) : 0;
        return <Img src={img("tvhead.png")} style={{ position: "absolute", left: TV.left + sh, top: TV.top + (1 - rise) * 1500, width: TV.w, height: TV.w * 1339 / 1100, transform: `scale(${lerp(0.9, 1, rise) + 0.04 * Math.exp(-Math.max(0, s - T.roar) * 6) * (s > T.roar ? 1 : 0)})` }} />;
      })()}
      {s >= 29.6 && s < 35.3 && BUB.map((b, i) => {
        const k = prog(s, b.t, b.t + 0.3, E.back);
        if (k <= 0) return null;
        const part = prog(s, T.brand - 0.1, T.brand + 0.9, E.io), side = b.x + b.w / 2 < 540 ? -1 : 1;
        const blow = prog(s, T.roar, T.roar + 0.75, Easing.bezier(0.2, 0.7, 0.3, 1));
        const dx = b.x + b.w / 2 - TV.tvx, dy = b.y + b.hh / 2 - TV.tvy, L = Math.hypot(dx, dy) + 1;
        const jit = Math.sin(s * 9 + i * 3) * 3;
        const x = b.x + side * 330 * part + (dx / L) * 1500 * blow, y = b.y + jit + (dy / L) * 1500 * blow;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: b.w, height: b.hh, borderRadius: 46, background: b.c, transform: `scale(${k * (1 - blow * 0.5)}) rotate(${Math.sin(s * 5 + i) * 2 + blow * 90 * (h(i, 9) - 0.5)}deg)`, opacity: 1 - prog(s, T.roar + 0.25, T.roar + 0.7), boxShadow: "0 8px 20px rgba(0,0,0,.06)" }}>
            <div style={{ position: "absolute", [b.flip ? "right" : "left"]: 26, bottom: -14, width: 30, height: 30, background: b.c, transform: "rotate(45deg)" } as React.CSSProperties} />
            {b.dots ? (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                {[0, 1, 2].map((d) => <div key={d} style={{ width: 16, height: 16, borderRadius: 8, background: "#8F8F8B", opacity: 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s * 9 - d * 1.2 + i)) }} />)}
              </div>
            ) : (
              <>
                <div style={{ position: "absolute", left: 26, top: b.hh * 0.3, width: b.w * 0.62, height: 13, borderRadius: 7, background: "#9D9D99" }} />
                <div style={{ position: "absolute", left: 26, top: b.hh * 0.58, width: b.w * 0.38, height: 13, borderRadius: 7, background: "#ABABA7" }} />
              </>
            )}
          </div>
        );
      })}
      {/* shock rings + hearts from the TV */}
      {s >= T.roar && s < 36.2 && (
        <>
          {[0, 1, 2].map((i) => { const r = prog(s, T.roar + i * 0.1, T.roar + i * 0.1 + 0.8, E.out); return r > 0 && r < 1 ? <div key={i} style={{ position: "absolute", left: TV.tvx - 1300 * r, top: TV.tvy - 1300 * r, width: 2600 * r, height: 2600 * r, borderRadius: "50%", border: `${8 - i * 2}px solid ${K.ink}`, opacity: 1 - r }} /> : null; })}
          {Array.from({ length: 14 }, (_, i) => {
            const u = s - T.roar - 0.05 - i * 0.02; if (u <= 0) return null;
            const a = (i / 14) * Math.PI * 2 + h(i, 3), v = 700 + h(i, 4) * 600, d = v * (1 - Math.exp(-u * 3.2)) / 3.2 * 3;
            return <div key={i} style={{ position: "absolute", left: TV.tvx + Math.cos(a) * d - 40, top: TV.tvy + Math.sin(a) * d - 44, transform: `scale(${prog(u, 0, 0.2, E.back) * (0.6 + h(i, 5) * 0.6)}) rotate(${(h(i, 6) - 0.5) * 50}deg)`, opacity: 1 - prog(u, 1.0, 1.6) }}><HeartIcon size={80} color={[K.coral, K.hot, K.teal, K.sky][i % 4]} /></div>;
          })}
        </>
      )}

      {/* ===== 9 · the K ===== */}
      {s >= 35.4 && (() => {
        const grow = prog(s, 35.42, 35.95, E.in);
        const shrink = prog(s, 35.98, 36.5, E.out);
        const toLock = prog(s, 36.65, 37.25, E.io);
        // final lockup: logo_h_black at width LW, left LX, top LY; mark circle centre/radius in screen px
        const LW = 860, LS = LW / 1800, LX = 540 - LW / 2 + 4, LY = 760;
        const mFinal = { x: LX + 233 * LS, y: LY + 226 * LS, r: 166 * LS };
        const mBig = { x: 540, y: 860, r: 230 };
        const cx = shrink < 1 ? lerp(TV.tvx, mBig.x, shrink) : lerp(mBig.x, mFinal.x, toLock);
        const cy = shrink < 1 ? lerp(TV.tvy, mBig.y, shrink) : lerp(mBig.y, mFinal.y, toLock);
        const r = grow < 1 ? lerp(0, 2300, grow) : shrink < 1 ? lerp(2300, mBig.r, shrink) : lerp(mBig.r, mFinal.r, toLock);
        const showK = s >= 36.05;
        const word = prog(s, 37.22, 37.85, E.out);
        const final = prog(s, 37.2, 37.35);
        const ready = ["Ready", "to", "klick", "with", "us?"];
        return (
          <>
            {shrink > 0 && <AbsoluteFill style={{ background: K.off }} />}
            {/* brand decor (from the services-guide cover) */}
            {s >= 37.0 && (
              <>
                <Chevrons n={5} size={74} s={s} t0={37.1} style={{ left: 900, top: 150 }} />
                <Chevrons n={5} size={74} dir="up" s={s} t0={37.25} style={{ left: 100, top: 1480 }} />
                <div style={{ position: "absolute", left: 930, top: 1380, display: "flex", flexDirection: "column", gap: 16 }}>
                  {[0, 1, 2, 3].map((i) => <XMark key={i} size={44} w={6} k={prog(s, 37.4 + i * 0.07, 37.7 + i * 0.07)} />)}
                </div>
                {/* bracket frame */}
                <div style={{ position: "absolute", left: 70, top: 640, width: 520 * prog(s, 37.2, 37.7), height: 4, background: K.ink }} />
                <div style={{ position: "absolute", left: 70, top: 640, width: 4, height: 140 * prog(s, 37.2, 37.7), background: K.ink }} />
                <div style={{ position: "absolute", right: 70, top: 1072, width: 520 * prog(s, 37.3, 37.8), height: 4, background: K.ink }} />
                <div style={{ position: "absolute", right: 70, top: 1076 - 140 * prog(s, 37.3, 37.8), width: 4, height: 140 * prog(s, 37.3, 37.8), background: K.ink }} />
              </>
            )}
            {/* wordmark slides out from behind the mark */}
            {word > 0 && (
              <div style={{ position: "absolute", left: LX + 440 * LS, top: LY + 54 * LS, width: 1305 * LS, height: 344 * LS, overflow: "hidden" }}>
                <Img src={img("wordmark_black.png")} style={{ width: 1305 * LS, height: 344 * LS, clipPath: `inset(0 ${100 - 100 * word}% 0 0)`, transform: `translateX(${(1 - word) * -40}px)` }} />
              </div>
            )}
            {/* the disc */}
            <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: K.ink2, opacity: 1 - final }} />
            {showK && (
              <div style={{ position: "absolute", left: cx - r * 346 / 332, top: cy - r * 344 / 332, width: r * 2 * 346 / 332, height: r * 2 * 344 / 332, opacity: 1 - final }}>
                <div style={{ position: "relative", width: "100%", height: "100%" }}><DrawnK size={r * 2 * 346 / 332} s={s} t0={36.05} disc={false} /></div>
              </div>
            )}
            {final > 0 && <Img src={img("kmark.png")} style={{ position: "absolute", left: LX + 60 * LS, top: LY + 54 * LS, width: 346 * LS, height: 344 * LS, opacity: final }} />}
            {/* CTA */}
            <div style={{ position: "absolute", left: 0, width: W, top: 1150, display: "flex", justifyContent: "center" }}>
              <div style={{ background: K.yellow, padding: "20px 34px 16px", transform: `scaleX(${prog(s, T.ready - 0.15, T.ready + 0.25, E.out)})`, display: "flex", gap: 18 }}>
                {ready.map((w, i) => (
                  <div key={i} style={{ overflow: "hidden" }}>
                    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 62, lineHeight: 1.05, color: K.ink, transform: `translateY(${(1 - prog(s, T.ready + i * 0.24, T.ready + i * 0.24 + 0.35)) * 110}%)` }}>{w}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, width: W, top: 1300, textAlign: "center", fontFamily: BODY, fontWeight: 500, fontSize: 40, color: K.ink, letterSpacing: "0.02em", opacity: prog(s, 39.5, 40.1), transform: `translateY(${(1 - prog(s, 39.5, 40.1)) * 20}px)` }}>klickkulture.co.za</div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
