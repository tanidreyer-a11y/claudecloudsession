// ONESHOT (9:16, 30 fps, 12.4 s): proves the one-shot kit (src/fx/Camera.tsx). One white point leads the eye the whole
// way; nothing cuts until the single match cut at the end. Studied from a reference reel (focus-point one-shot) and a
// "3 transitions" list (camera pull-back, track matte, match cut) — method only, nothing copied.
//   A 0.0  a point                      B 1.0  it splits into 4 nodes that draw a ring ("Give it a system")
//   C 2.4  ring morphs into a star, spins, shrinks — camera pushes in so the eye never moves
//   D 3.4  the star becomes the icon of a pill ("Find the form"); a light sweep charges it
//   E 4.8  a thread drops from the pill; the camera chases its head with lag and banks into the curve
//   F 6.9  contact: the next pill floods white → TRACK MATTE: it opens into the next scene → CAMERA PULL-BACK reveals a site
//   G 9.5  MATCH CUT: the site's black button becomes the white point on black → it flies into the OBSIDIAN emblem
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import {
  LOOKS, MV, SM, cl, prog, Finish, Dust, camAt, mixCam, follow, World, At, Thread, threadHead, Shape, Matte, lerpBox, screenOf, pop, Cam, CamKey,
} from "./fx";
import { Easing } from "remotion";

export const FPS1 = 30, DUR1 = 12.4;
const look = LOOKS.obsidian;
const UI = look.ui;                                      // Archivo (house); never Inter (AI tell, skill §8)
const RIDE = Easing.bezier(0.55, 0, 0.3, 1);              // rollercoaster: slow climb, fast drop, ease into the station

// world layout (px, origin = first frame centre)
const P2 = { x: 380, y: 1500 };                           // second pill
const D = `M 218 62 C 218 430, 660 300, 610 780 S ${P2.x} 1150, ${P2.x} ${P2.y - 62}`;
const T = { split: 1.0, morph: 2.4, pill: 3.4, drop: 4.9, land: 6.9, open: 7.45, cut: 9.5, logo: 10.25 };

const KEYS: CamKey[] = [
  { t: 0, x: 0, y: 0, z: 1.14, r: 0 }, { t: 1.0, x: 0, y: 0, z: 1, r: 0 }, { t: 2.4, x: 0, y: 0, z: 1, r: -3 },
  { t: 3.5, x: 0, y: 0, z: 1.32, r: 0, e: MV }, { t: 4.8, x: 150, y: 40, z: 1.05, r: 0 },
];
const ride = (s: number) => RIDE(cl((s - T.drop) / (T.land - T.drop)));
const camFn = (s: number): Cam => {
  const u = ride(s), chase = follow((q) => threadHead(D, ride(q)), s, { lag: 0.16, bank: 0.09, z: 1.05 - 0.24 * Math.sin(Math.PI * u) });
  const c = mixCam(camAt(KEYS, s), chase, prog(s, T.drop - 0.05, T.drop + 0.45));
  return mixCam(c, { x: P2.x, y: P2.y, z: 1, r: 0 }, prog(s, T.land - 0.15, T.open, MV));
};

// the site behind the matte (its own world + camera: starts on white space beside the headline at 2.6×, so the white
// pill opens into white, then pulls back to 1× and the site assembles around the eye)
const SITE_KEYS: CamKey[] = [{ t: T.open, x: 250, y: -330, z: 2.6, r: 0 }, { t: T.open + 0.25, x: 250, y: -330, z: 2.5, r: 0 }, { t: T.open + 1.45, x: 0, y: 0, z: 1, r: 0, e: MV }];
const BTN = { x: 300, y: 480, d: 150 };
const Site: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(SITE_KEYS, t), prev = camAt(SITE_KEYS, t - 1 / FPS1);
  const ink = "#0B0B0C", grey = "#8E9097";
  return (
    <AbsoluteFill style={{ background: "#E4E5E8" }}>
      <World cam={cam} prev={prev} id="siteblur">
        <At x={0} y={0}><div style={{ width: 900, height: 1460, borderRadius: 36, background: "#FFFFFF", boxShadow: "0 30px 80px rgba(0,0,0,.12)" }} /></At>
        <At x={-330} y={-620}><svg width={46} height={56} viewBox="0 0 200 245"><polygon points="171,21 171,66 22,170 22,128" fill={ink} /><polygon points="171,88 171,136 46,222 46,176" fill={ink} /></svg></At>
        {[0, 1, 2].map((i) => <At key={i} x={150 + i * 110} y={-620}><div style={{ width: 80, height: 8, borderRadius: 4, background: "#D3D5DA" }} /></At>)}
        <div style={{ position: "absolute", left: -380, top: -470, fontFamily: look.display, fontWeight: 800, fontStretch: "100%", fontSize: 150, lineHeight: 0.95, whiteSpace: "nowrap", letterSpacing: "-0.04em", color: ink }}>Make it<br />move.</div>
        <div style={{ position: "absolute", left: -380, top: -60, fontFamily: UI, fontSize: 40, color: grey }}>Scroll-scrub and 3D websites.</div>
        <At x={0} y={210}><div style={{ width: 760, height: 330, borderRadius: 26, background: "linear-gradient(135deg, #16171A 0%, #3A3C42 100%)", overflow: "hidden" }}>
          <svg width={760} height={330}><path d="M 0 250 C 160 250, 220 90, 380 120 S 600 260, 760 70" fill="none" stroke="#DCDEE2" strokeWidth={3} /></svg>
        </div></At>
        <At x={BTN.x} y={BTN.y}><div style={{ width: BTN.d, height: BTN.d, borderRadius: "50%", background: ink, color: "#fff", fontFamily: UI, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>→</div></At>
        {[0, 1, 2].map((i) => <At key={i} x={-260 + i * 260} y={630}><div style={{ width: 200, height: 10, borderRadius: 5, background: "#E1E2E6" }} /></At>)}
      </World>
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ w: number; label: string; op?: number; star?: number; sweep?: number; flood?: number; floodLabel?: number }> = ({ w, label, op = 1, star = 1, sweep = -1, flood = 0, floodLabel = 1 }) => {
  const h = 124, txt = (c: string) => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: 118, fontFamily: UI, fontSize: 50, fontWeight: 400, letterSpacing: "-0.01em", color: c, whiteSpace: "nowrap", opacity: op }}>{label}</div>
  );
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: h / 2, background: "#0D0E11", boxShadow: "inset 0 0 0 1.5px rgba(220,222,226,.38)", overflow: "hidden" }}>
      {txt(look.ink)}
      {sweep > -1 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(40% 140% at ${sweep * 140 - 20}% 50%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)`, mixBlendMode: "screen" }} />}
      {flood > 0 && <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", clipPath: `circle(${flood * 700}px at 50% 0%)` }}><div style={{ opacity: floodLabel }}>{txt("#0B0B0C")}</div></div>}
      {star > 0 && <svg width={1} height={1} style={{ position: "absolute", left: 66, top: h / 2, overflow: "visible", opacity: star }}>
        <path d="M 0 -26 C 3 -3, 3 -3, 26 0 C 3 3, 3 3, 0 26 C -3 3, -3 3, -26 0 C -3 -3, -3 -3, 0 -26 Z" fill={flood > 0.2 ? "#0B0B0C" : "#FFFFFF"} /></svg>}
    </div>
  );
};

export const OneShot: React.FC = () => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig(); const t = f / FPS1;
  const cam = camFn(t), prev = camFn(t - 1 / FPS1);
  const LBL: React.CSSProperties = { fontFamily: UI, fontSize: 48, fontWeight: 400, color: look.ink, whiteSpace: "nowrap", letterSpacing: "-0.01em" };

  // A–C: point → 4 nodes → ring → star → tiny star
  const born = pop(t, 0.15, 0.6), split = prog(t, T.split, T.split + 0.55, MV), draw = prog(t, T.split + 0.3, T.split + 1.0);
  const morph = prog(t, T.morph, T.morph + 0.6, MV), shrink = prog(t, T.morph + 0.55, T.pill + 0.1, MV);
  const R = 240 * split * (1 - shrink * 0.885), spin = 20 * prog(t, T.split, T.morph) + 45 * morph + 30 * shrink;
  const sysIn = prog(t, T.split + 0.6, T.split + 1.1), sysOut = prog(t, T.morph, T.morph + 0.35);
  // D: pill grows out of the star
  const grow = prog(t, T.pill, T.pill + 0.6, MV), lbl = prog(t, T.pill + 0.45, T.pill + 0.9), sweep = prog(t, T.pill + 0.95, T.pill + 1.6, SM);
  // E/F: thread, contact, flood, matte
  const thr = ride(t), tail = prog(t, T.land + 0.05, T.land + 0.45, MV), flood = prog(t, T.land, T.land + 0.4, MV);
  const p2in = prog(t, T.drop + 0.9, T.drop + 1.5), hit = pop(t, T.land, 0.45);
  const open = prog(t, T.open, T.open + 0.7, MV);
  const pill2 = screenOf(cam, P2.x, P2.y, W, H);
  // G: match cut — the site's button (screen pos at z=1) becomes the white point
  const btn = { x: W / 2 + BTN.x, y: H / 2 + BTN.y };
  const LW = 760, LS = LW / 1030, LX = W / 2 - LW / 2, LY = H / 2 - 120 - (245 * LS) / 2, ex = LX + 96 * LS, ey = LY + 121 * LS;
  const fly = prog(t, T.cut + 0.08, T.logo + 0.1, MV), lock = prog(t, T.logo, T.logo + 0.8, MV), tag = prog(t, T.logo + 0.8, T.logo + 1.4);

  return (
    <Finish t={t} look={look} hits={[T.land, T.cut]} ca={0.6} grain={0.06} vignette={0.45} shake={8}>
      {t < T.cut ? (
        <>
          <Dust t={t} look={look} n={90} />
          <World cam={cam} prev={prev}>
            {/* A–C */}
            {t < T.pill + 0.15 && <At x={0} y={0}><div style={{ position: "relative" }}>
              {split < 0.02 ? <div style={{ position: "absolute", left: -13, top: -13, width: 26, height: 26, borderRadius: "50%", background: "#fff", transform: `scale(${born})`, boxShadow: "0 0 24px rgba(255,255,255,.8)" }} />
                : <Shape k={morph} r={R} spin={spin} draw={draw} nodes={1 - morph} fill={shrink > 0.6 ? `rgba(255,255,255,${(shrink - 0.6) / 0.4})` : "none"} width={2.4 + shrink * 3} />}
              <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%, -50%) scale(${1 - sysOut * 0.3})`, ...LBL, opacity: sysIn * (1 - sysOut), filter: `blur(${(1 - sysIn) * 10 + sysOut * 12}px)` }}>Give it a system</div>
            </div></At>}
            {/* D: pill 1 (the tiny star sits at the pill's icon spot: pill grows to the right of it) */}
            {t >= T.pill && <At x={(grow * (560 - 124)) / 2} y={0}><Pill w={124 + grow * (560 - 124)} label="Find the form" op={lbl} sweep={sweep > 0 && sweep < 1 ? sweep : -1} /></At>}
            {/* E: the thread, from pill 1's bottom to pill 2's top; it retracts after contact */}
            {t >= T.drop && <Thread d={D} p={thr} tail={tail} dot={t > T.land + 0.05 ? 0 : 11} />}
            {/* pill 2 */}
            {t >= T.drop + 0.9 && t < T.open + 0.05 && <At x={P2.x} y={P2.y} style={{ opacity: p2in, transform: `translate(-50%, -50%) scale(${(0.92 + 0.08 * p2in) * (1 + 0.06 * hit * (1 - prog(t, T.land + 0.3, T.land + 0.6)))})` }}>
              <Pill w={640} label="Build the structure" flood={flood} floodLabel={1 - prog(t, T.open - 0.25, T.open - 0.05)} />
            </At>}
          </World>
          {/* F: TRACK MATTE — pill 2's on-screen shape opens into the next scene */}
          {t >= T.open && <Matte box={lerpBox({ x: pill2.x, y: pill2.y, w: 640 * cam.z, h: 124 * cam.z, r: 62 * cam.z }, { x: W / 2, y: H / 2, w: W, h: H, r: 0 }, open)}><Site t={t} /></Matte>}
        </>
      ) : (
        /* G: MATCH CUT — same position, same size, inverted: black button on white → white point on black */
        <AbsoluteFill style={{ background: look.bg }}>
          <Dust t={t} look={look} n={90} />
          <div style={{ position: "absolute", left: btn.x + (ex - btn.x) * fly, top: btn.y + (ey - btn.y) * fly, width: 1, height: 1 }}>
            <div style={{ position: "absolute", width: BTN.d * (1 - fly) + 34 * fly, height: BTN.d * (1 - fly) + 34 * fly, left: -(BTN.d * (1 - fly) + 34 * fly) / 2, top: -(BTN.d * (1 - fly) + 34 * fly) / 2,
              borderRadius: "50%", background: "#fff", boxShadow: `0 0 ${30 + 30 * fly}px rgba(255,255,255,.7)`, opacity: 1 - lock }} />
          </div>
          <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX, top: LY, width: LW, height: 245 * LS, mixBlendMode: "screen", opacity: lock, clipPath: `inset(0 ${(1 - lock) * 82}% 0 0)`, filter: `grayscale(1) brightness(3) blur(${(1 - lock) * 8}px)` }} />
          <div style={{ position: "absolute", left: 0, width: W, top: LY + 245 * LS + 70, textAlign: "center", fontFamily: UI, fontSize: 40, color: look.dim, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>Digital precision that builds reputation.</div>
        </AbsoluteFill>
      )}
    </Finish>
  );
};
