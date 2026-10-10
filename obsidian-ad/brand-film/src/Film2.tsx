// OBSIDIAN — direction v2 (30 s, 9:16) after the owner's notes on the three tests:
//  KEEP: (1) the flat template at an angle whose grid layers pop out of it; (2) the containers moving to the right.
//  CHAIN (owner): website frame lands on the TOP grid layer → different templates pop out and move right → the last
//  template becomes a phone.  FIX: liquid soft pink/white/lilac orbs (ElevenLabs depth, not a flat dot), real camera
//  language — vertical falls, a dive through the orb, 360° orbits — and Inter (the approved signature type).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";

export const FPS2 = 60;
export const DUR2 = 30;

const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), in: Easing.bezier(0.7, 0, 0.84, 0), io: Easing.bezier(0.65, 0, 0.35, 1),
  back: Easing.bezier(0.34, 1.35, 0.64, 1), soft: Easing.bezier(0.33, 0, 0.2, 1), drop: Easing.bezier(0.5, 0, 0.2, 1),
};
const prog = (s: number, a: number, b: number, ease = E.out) => interpolate(s, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const win = (s: number, a: number, b: number, c: number, d: number) => prog(s, a, b) * (1 - prog(s, c, d, E.in));
const h = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const site = (p: string) => staticFile("site/" + p);
const seq = (dir: string, i: number) => site(`${dir}/${String(Math.max(1, Math.round(i))).padStart(3, "0")}.jpg`);

const C = { bg: "#050407", plum: "#12091A", ink: "#F6F1F8", mute: "#A79DB3", line: "rgba(255,255,255,.14)" };
const LIQ = ["#FFFFFF", "#F9A8D4", "#E879F9", "#DDD6FE", "#A78BFA", "#F472B6", "#FDF2F8", "#7C3AED"];
const SANS = "Inter, Helvetica, Arial, sans-serif";
const MONO = "JBMono, ui-monospace, monospace";
const LABEL: React.CSSProperties = { fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(246,241,248,.72)" };

// ---------------------------------------------------------------- liquid: an orb with moving liquid inside
const LiquidOrb: React.FC<{ x: number; y: number; d: number; s: number; seed?: number; op?: number; rim?: number }> = ({ x, y, d, s, seed = 0, op = 1, rim = 1 }) => {
  const blobs = Array.from({ length: 9 }, (_, i) => {
    const a = s * (0.35 + h(i, seed) * 0.5) * (i % 2 ? 1 : -1) + h(i, seed + 3) * 6.28;
    const r = d * (0.16 + h(i, seed + 5) * 0.22);
    const sz = d * (0.35 + h(i, seed + 7) * 0.4); return { x: d / 2 + Math.cos(a) * r - sz / 2, y: d / 2 + Math.sin(a * 1.3) * r - sz / 2, c: LIQ[(i * 3 + seed) % LIQ.length], sz };
  });
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, opacity: op }}>
      <div style={{ position: "absolute", inset: -d * 0.35, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,163,208,${0.32 * rim}) 0%, rgba(196,181,253,${0.14 * rim}) 40%, rgba(0,0,0,0) 68%)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 34% 28%, #FFFFFF 0%, #FBCFE8 18%, #E879F9 46%, #7C3AED 78%, #2E1065 100%)" }}>
        <div style={{ position: "absolute", inset: 0, filter: `blur(${d * 0.035}px) saturate(1.15)` }}>
          {blobs.map((b, i) => <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.sz, height: b.sz, borderRadius: "50%", background: `radial-gradient(circle, ${b.c} 0%, ${b.c}00 70%)`, mixBlendMode: i % 3 === 0 ? "multiply" : i % 2 ? "screen" : "normal", opacity: i % 3 === 0 ? 0.55 : 0.95 }} />)}
          {/* a liquid ribbon */}
          <div style={{ position: "absolute", left: d * 0.1, top: d * 0.42, width: d * 0.9, height: d * 0.16, borderRadius: "50%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0))", transform: `rotate(${s * 22 + seed * 40}deg)`, transformOrigin: "40% 50%" }} />
        </div>
        {/* sphere shading + glass */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 70% 78%, rgba(40,10,60,.45) 0%, rgba(40,10,60,0) 55%)" }} />
        <div style={{ position: "absolute", left: d * 0.16, top: d * 0.1, width: d * 0.38, height: d * 0.24, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.75), rgba(255,255,255,0) 70%)", filter: `blur(${d * 0.02}px)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `inset 0 0 ${d * 0.06}px rgba(255,255,255,${0.55 * rim}), inset 0 -${d * 0.05}px ${d * 0.12}px rgba(76,29,149,.35)` }} />
      </div>
    </div>
  );
};
// full-bleed liquid world (deep plum with soft pink/white/lilac liquid drifting)
const LiquidWorld: React.FC<{ s: number; op?: number; light?: number }> = ({ s, op = 1, light = 0.6 }) => (
  <AbsoluteFill style={{ opacity: op, background: `radial-gradient(ellipse 110% 80% at 50% 38%, #1E0B2C 0%, ${C.plum} 50%, ${C.bg} 100%)` }}>
    <AbsoluteFill style={{ filter: "blur(70px) saturate(1.2)" }}>
      {Array.from({ length: 7 }, (_, i) => {
        const a = s * (0.12 + h(i, 1) * 0.12) * (i % 2 ? 1 : -1) + h(i, 2) * 6.28;
        const x = 540 + Math.cos(a) * (260 + h(i, 3) * 260) - 300, y = 960 + Math.sin(a * 1.2) * (520 + h(i, 4) * 300) - 300;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 520 + h(i, 5) * 260, height: 520 + h(i, 6) * 260, borderRadius: "50%", background: [ "#F472B6", "#7C3AED", "#F9A8D4", "#A78BFA", "#E879F9", "#4C1D95", "#FDF2F8"][i], opacity: light * (0.3 + h(i, 7) * 0.35) }} />;
      })}
    </AbsoluteFill>
  </AbsoluteFill>
);
// 3D orbit ring (360°)
const OrbitRing: React.FC<{ x: number; y: number; r: number; tilt: number; spin: number; k?: number; op?: number; dots?: number }> = ({ x, y, r, tilt, spin, k = 1, op = 1, dots = 3 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `perspective(1600px) rotateX(${tilt}deg) rotateZ(${spin}deg)`, opacity: op }}>
    <svg width={r * 2} height={r * 2} style={{ overflow: "visible" }}>
      <circle cx={r} cy={r} r={r} stroke="rgba(255,255,255,.55)" strokeWidth={1.6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      {Array.from({ length: dots }, (_, i) => { const a = (i / dots) * Math.PI * 2; return <circle key={i} cx={r + Math.cos(a) * r} cy={r + Math.sin(a) * r} r={5} fill="#fff" opacity={k} />; })}
    </svg>
  </div>
);

const Browser: React.FC<{ w: number; src: string; url?: string; children?: React.ReactNode; glow?: number }> = ({ w, src, url = "obsidian build", children, glow = 1 }) => (
  <div style={{ width: w, borderRadius: w * 0.022, overflow: "hidden", background: "rgba(22,14,30,.9)", border: "1px solid rgba(255,255,255,.16)", boxShadow: `0 ${w * 0.05}px ${w * 0.12}px rgba(0,0,0,.55), 0 0 ${w * 0.1}px rgba(245,163,208,${0.18 * glow})` }}>
    <div style={{ height: w * 0.05, display: "flex", alignItems: "center", gap: w * 0.01, padding: `0 ${w * 0.02}px` }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: w * 0.012, height: w * 0.012, borderRadius: "50%", background: "rgba(255,255,255,.25)" }} />)}
      <div style={{ marginLeft: w * 0.02, flex: 1, height: w * 0.026, borderRadius: w * 0.013, background: "rgba(255,255,255,.07)", color: C.mute, fontFamily: SANS, fontSize: w * 0.016, display: "flex", alignItems: "center", paddingLeft: w * 0.012 }}>{url}</div>
    </div>
    <div style={{ position: "relative", width: w, height: w * 0.625 }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {children}
    </div>
  </div>
);

// ---------------------------------------------------------------- code (the logic behind the design)
type Tok = [string, string];
const KW = "#F0ABFC", TY = "#E9D5FF", ST = "#FBCFE8", TX = C.ink, CM = "rgba(246,241,248,.42)";
const CODE: Tok[][] = [
  [["// the logic behind the look", CM]],
  [["export ", KW], ["function ", KW], ["Presence", TY], ["() {", TX]],
  [["  return (", TX]],
  [["    <", TX], ["Site", TY], [" motion", ST], ["=", TX], ['"precise"', ST], [">", TX]],
  [["      <", TX], ["Agent", TY], [" role", ST], ["=", TX], ['"qualify"', ST], [" />", TX]],
  [["      <", TX], ["Agent", TY], [" role", ST], ["=", TX], ['"answer"', ST], [" />", TX]],
  [["      <", TX], ["Agent", TY], [" role", ST], ["=", TX], ['"book"', ST], [" />", TX]],
  [["    </", TX], ["Site", TY], [">", TX]],
  [["  );", TX]],
  [["}", TX]],
];
const CODE_LEN = CODE.reduce((m, l) => m + l.reduce((a, t) => a + t[0].length, 0) + 1, 0);
const Code: React.FC<{ s: number; t0: number; t1: number; w: number; fs: number }> = ({ s, t0, t1, w, fs }) => {
  let budget = Math.floor(CODE_LEN * prog(s, t0, t1, (x: number) => x));
  let caretDone = false;
  return (
    <div style={{ width: w, padding: `${fs * 1.1}px ${fs * 1.2}px`, fontFamily: MONO, fontSize: fs, lineHeight: 1.6 }}>
      {CODE.map((line, li) => {
        const parts: React.ReactNode[] = [];
        line.forEach(([t, col], ti) => { if (budget <= 0) return; parts.push(<span key={ti} style={{ color: col }}>{t.slice(0, budget)}</span>); budget -= t.length; });
        const here = budget <= 0 && !caretDone; if (here) caretDone = true; budget -= 1;
        return <div key={li} style={{ whiteSpace: "pre", minHeight: fs * 1.6 }}>{parts}{here && <span style={{ display: "inline-block", width: fs * 0.55, height: fs * 0.55, marginLeft: 6, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #F5A3D0 55%, #A855F7)", boxShadow: "0 0 18px rgba(245,163,208,.9)", verticalAlign: "middle" }} />}</div>;
      })}
    </div>
  );
};

// ---------------------------------------------------------------- timeline
const T = { drop: 0, rings: 1.1, dive: 3.0, world: 4.0, plane: 4.2, pop: 5.0, land: 8.6, pans: 10.4, phone: 13.4, flip: 15.2, agents: 18.6, ring24: 22.6, fall: 25.2 };

export const Film2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const s = frame / fps;
  const cx = W / 2, cy = H / 2;

  // --- 1 drop + rings, 2 dive
  const dropY = lerp(-420, cy - 120, prog(s, 0, 1.4, E.drop)) + (s > 1.4 ? Math.sin((s - 1.4) * 1.3) * 10 : 0);
  const dive = prog(s, T.dive, T.world + 0.2, Easing.bezier(0.6, 0, 0.3, 1));
  const orbD = lerp(380, 380 * 14, dive);
  const worldOp = prog(s, T.world - 0.35, T.world + 0.15, E.soft) * (1 - prog(s, T.fall + 0.6, T.fall + 1.6, E.soft));

  // --- 3 the plane: laid flat at an angle, layers pop out; the camera orbits and descends
  const planeIn = prog(s, T.plane, T.plane + 0.9, E.out);
  const pop = (i: number) => prog(s, T.pop + i * 0.32, T.pop + i * 0.32 + 0.6, E.back);
  const orbitZ = lerp(-38, 28, prog(s, T.plane, T.land + 1.6, E.io));            // 360-feel sweep around the stack
  const tiltX = lerp(64, 54, prog(s, T.plane, T.land, E.io));
  const descend = lerp(-260, 120, prog(s, T.plane, T.land + 1.0, E.io));          // camera moves DOWN over the stack
  const stackOut = prog(s, T.pans + 2.4, T.phone + 0.2, E.in);
  const PW = 820, PH = 520;
  const LAYERS = [
    { z: 0, el: (k: number) => <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "rgba(20,12,28,.82)", border: "1px solid rgba(255,255,255,.18)", backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "41px 41px", opacity: k }} /> },
    { z: 110, el: (k: number) => <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(255,255,255,.45)", borderRadius: 22, opacity: k }}>{[0.25, 0.5, 0.75].map((f) => <div key={f} style={{ position: "absolute", left: `${f * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,.3)" }} />)}{[0.33, 0.66].map((f) => <div key={f} style={{ position: "absolute", top: `${f * 100}%`, left: 0, right: 0, borderTop: "1px dashed rgba(255,255,255,.3)" }} />)}</div> },
    { z: 220, el: (k: number) => <div style={{ position: "absolute", left: 50, top: 60, opacity: k }}><div style={{ width: 380, height: 46, borderRadius: 10, background: "rgba(255,255,255,.82)" }} /><div style={{ marginTop: 18, width: 260, height: 46, borderRadius: 10, background: "linear-gradient(90deg, #FBCFE8, #E9D5FF)" }} /><div style={{ marginTop: 40, width: 170, height: 52, borderRadius: 26, background: "linear-gradient(90deg, #F5A3D0, #C4B5FD)", boxShadow: "0 0 30px rgba(245,163,208,.6)" }} /></div> },
    { z: 330, el: (k: number) => <div style={{ position: "absolute", right: 60, top: 70, width: 250, height: 250, opacity: k }}><LiquidOrb x={125} y={125} d={220} s={s} seed={4} rim={0.6} /></div> },
  ];
  const landK = prog(s, T.land, T.land + 0.9, E.drop);         // the website frame drops onto the TOP layer
  // --- 4 containers pop out of the stack and move right (owner favourite) → the last becomes a phone
  const CONT = [{ dir: "north", url: "northlight" }, { dir: "surgery", url: "atelier vale" }, { dir: "cigars", url: "cape atlantic" }, { dir: "estateM", url: "private estates" }];
  const panX = lerp(0, -1, prog(s, T.pans + 0.2, T.phone, E.io));
  const phoneK = prog(s, T.phone, T.phone + 1.0, E.io);
  const phoneSpin = lerp(0, 360, prog(s, T.phone + 0.6, T.flip + 0.2, E.io));
  const flipK = prog(s, T.flip, T.flip + 0.9, E.io);          // the phone turns to its back: the code (logic)
  const phoneY = lerp(0, 120, prog(s, T.phone, T.flip, E.io)) - lerp(0, 1500, prog(s, T.agents - 0.6, T.agents + 0.5, E.in));
  // --- 5 agents
  const agK = prog(s, T.agents - 0.2, T.agents + 0.8, E.out), agOut = prog(s, T.fall, T.fall + 0.9, E.in);
  const agY = lerp(500, 0, agK) - agOut * 900;
  // --- 6 end
  const endK = prog(s, T.fall + 0.4, T.fall + 1.6, E.out);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", fontFamily: SANS }}>
      {/* ===== 1–2 the liquid orb drops in; rings orbit; the camera dives through it ===== */}
      {s < T.world + 0.4 && (
        <>
          <OrbitRing x={cx} y={dropY} r={300} tilt={72} spin={s * 40} k={prog(s, T.rings, T.rings + 0.9, E.io)} op={1 - dive} />
          <OrbitRing x={cx} y={dropY} r={360} tilt={66} spin={-s * 28 + 40} k={prog(s, T.rings + 0.25, T.rings + 1.2, E.io)} op={1 - dive} dots={2} />
          <LiquidOrb x={cx} y={lerp(dropY, cy, dive)} d={orbD} s={s} seed={1} />
          <div style={{ position: "absolute", left: 0, width: W, top: dropY + 300, textAlign: "center", ...LABEL, opacity: win(s, 1.6, 2.1, T.dive - 0.2, T.dive + 0.2) }}>Digital precision</div>
        </>
      )}
      {worldOp > 0 && <LiquidWorld s={s} op={worldOp} light={lerp(0.8, 0.45, prog(s, T.world, T.pop + 1, E.soft))} />}

      {/* ===== 3 the flat template at an angle; its layers pop out; the frame lands on top ===== */}
      {s > T.plane - 0.1 && s < T.phone + 0.4 && (
        <AbsoluteFill style={{ perspective: 2100, opacity: planeIn * (1 - stackOut) }}>
          <div style={{ position: "absolute", left: cx - PW / 2, top: cy - PH / 2 + descend, width: PW, height: PH, transformStyle: "preserve-3d", transform: `rotateX(${tiltX}deg) rotateZ(${orbitZ}deg) scale(${lerp(0.8, 1, planeIn)}) translateX(${panX * 900}px)` }}>
            {LAYERS.map((L, i) => (
              <div key={i} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${L.z * (i === 0 ? 1 : pop(i - 1))}px)` }}>{L.el(i === 0 ? 1 : Math.min(1, pop(i - 1) * 1.4))}</div>
            ))}
            {/* the website frame lands on the top grid layer */}
            {s > T.land - 0.1 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: PW, transform: `translateZ(${lerp(1400, 440, landK)}px)`, opacity: prog(s, T.land, T.land + 0.25) }}>
                <Browser w={PW} src={seq("estate", 1 + 74 * prog(s, T.land, T.pans + 2.4, (x: number) => x))} url="private estates · obsidian build" />
              </div>
            )}
            {/* different templates pop out of the stack and move right */}
            {CONT.slice(0, 3).map((c, i) => {
              const a = T.pans + i * 0.55, k = prog(s, a, a + 0.8, E.out);
              if (k <= 0) return null;
              const src = c.dir === "cigars" ? site("cigars_hero.png") : seq(c.dir, 1 + 100 * prog(s, a, a + 3, (x: number) => x));
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 0, width: PW, transform: `translateZ(${440 + 40 * (i + 1)}px) translateX(${k * (i + 1) * 940}px) rotateZ(${-k * 2}deg)`, opacity: Math.min(1, k * 2) }}>
                  <Browser w={PW} src={src} url={c.url} glow={0.8} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== 4 the last template becomes a phone; it spins 360° and turns to its back — the code ===== */}
      {s > T.phone - 0.1 && s < T.agents + 0.6 && (() => {
        const w = lerp(820, 470, phoneK), hh = lerp(552, 1000, phoneK), r = lerp(18, 64, phoneK);
        const ang = phoneSpin + flipK * 180;
        return (
          <div style={{ position: "absolute", left: cx - w / 2, top: cy - hh / 2 + phoneY, width: w, height: hh, perspective: 2200, transform: `scale(${lerp(1, 1.32, prog(s, T.flip, T.flip + 0.9, E.io))})` }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${ang}deg) rotateX(${Math.sin(phoneK * Math.PI) * 8}deg)` }}>
              {/* front: the site, landscape → mobile */}
              <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "#0d0812", border: `${lerp(1, 12, phoneK)}px solid #17101f`, boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 90px rgba(245,163,208,.18)", backfaceVisibility: "hidden" }}>
                <Img src={site("cigars_hero.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - phoneK }} />
                <Img src={site(`m_estate_${Math.min(2, Math.floor(prog(s, T.phone + 0.8, T.flip, (x: number) => x) * 3))}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: phoneK }} />
              </div>
              {/* back: the logic */}
              <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "linear-gradient(160deg, rgba(42,18,56,.96), rgba(12,7,18,.98))", border: "1px solid rgba(251,207,232,.28)", boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 90px rgba(245,163,208,.22)", transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 30, width: "100%", textAlign: "center", ...LABEL, fontSize: 18 }}>The logic behind it</div>
                <div style={{ position: "absolute", left: 4, top: 200 }}><Code s={s} t0={T.flip + 0.6} t1={T.agents - 0.6} w={460} fs={20} /></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== 5 agents: liquid orbs, orbit rings, the flow ===== */}
      {s > T.agents - 0.3 && s < T.fall + 1.0 && (() => {
        const t = T.agents, oy = cy - 520 + agY;
        const nodes = [{ l: "FAQ receptionist", x: cx - 300, y: cy - 30 }, { l: "Lead qualifier", x: cx, y: cy + 40 }, { l: "Outbound caller", x: cx + 300, y: cy - 30 }];
        const ring = prog(s, T.ring24, T.ring24 + 2.2, E.io);
        const hr = (14 + ring * 12) % 24, mn = Math.floor(((14 + ring * 12) % 1) * 60);
        const bubbles = [
          { t: t + 2.4, side: -1, y: cy + 230, text: "What are your viewing times?", agent: false },
          { t: t + 3.0, side: 1, y: cy + 340, text: "Saturday 10:00 or 14:00. Shall I book you?", agent: true },
          { t: t + 3.7, side: -1, y: cy + 460, text: "Qualified · sent to sales", agent: false },
          { t: T.ring24 + 1.0, side: 1, y: cy + 570, text: "New lead · 02:14 · booked", agent: true },
        ];
        return (
          <AbsoluteFill style={{ opacity: agK * (1 - agOut) }}>
            <OrbitRing x={cx} y={oy} r={250} tilt={70} spin={s * 36} k={prog(s, t + 0.3, t + 1.1, E.io)} />
            <OrbitRing x={cx} y={oy} r={310} tilt={62} spin={-s * 24} k={prog(s, t + 0.5, t + 1.3, E.io)} dots={2} />
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              <circle cx={cx} cy={oy} r={225} stroke="rgba(255,255,255,.12)" strokeWidth={3} fill="none" opacity={prog(s, T.ring24 - 0.3, T.ring24)} />
              <circle cx={cx} cy={oy} r={225} stroke="#FBCFE8" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-90 ${cx} ${oy})`} strokeLinecap="round" opacity={prog(s, T.ring24 - 0.3, T.ring24)} />
              {nodes.map((n, i) => {
                const k = prog(s, t + 0.9 + i * 0.14, t + 1.6 + i * 0.14, E.io);
                const d = `M ${cx} ${oy + 240} C ${cx} ${oy + 360}, ${n.x} ${n.y - 160}, ${n.x} ${n.y - 60}`;
                return <path key={i} d={d} stroke="rgba(251,207,232,.5)" strokeWidth={2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />;
              })}
            </svg>
            <LiquidOrb x={cx} y={oy} d={300} s={s} seed={2} />
            {s > T.ring24 - 0.2 && <div style={{ position: "absolute", left: 0, width: W, top: oy - 30, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: "-0.03em", color: "#2E1046", mixBlendMode: "multiply", opacity: prog(s, T.ring24, T.ring24 + 0.4) }}>{String(Math.floor(hr)).padStart(2, "0")}:{String(mn).padStart(2, "0")}</div>}
            <div style={{ position: "absolute", left: 0, width: W, top: oy + 182, textAlign: "center", ...LABEL, opacity: prog(s, t + 0.5, t + 0.9) }}>Powered by Avant Intelligence</div>
            {nodes.map((n, i) => {
              const k = prog(s, t + 1.3 + i * 0.14, t + 1.8 + i * 0.14, E.back);
              return (
                <React.Fragment key={i}>
                  <LiquidOrb x={n.x} y={n.y} d={96 * k} s={s} seed={5 + i} rim={0.8} />
                  <div style={{ position: "absolute", left: n.x - 160, width: 320, top: n.y + 62, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: "-0.01em", color: C.ink, opacity: k }}>{n.l}</div>
                </React.Fragment>
              );
            })}
            {bubbles.map((b, i) => {
              const k = prog(s, b.t, b.t + 0.45, E.back);
              if (k <= 0) return null;
              return <div key={i} style={{ position: "absolute", top: b.y, [b.side < 0 ? "left" : "right"]: 90, transform: `translateY(${(1 - k) * 30}px)`, opacity: k, padding: "20px 30px", borderRadius: 30, background: b.agent ? "linear-gradient(135deg, rgba(251,207,232,.95), rgba(233,213,255,.95))" : "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.22)", color: b.agent ? "#2E1046" : C.ink, fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: "-0.01em", boxShadow: b.agent ? "0 0 40px rgba(245,163,208,.35)" : "none" } as React.CSSProperties}>{b.text}</div>;
            })}
          </AbsoluteFill>
        );
      })()}

      {/* ===== 6 the camera falls; one orb; OBSIDIAN ===== */}
      {s > T.fall && (
        <>
          <OrbitRing x={cx} y={cy - 160} r={lerp(120, 300, endK)} tilt={72} spin={s * 30} k={endK} op={endK} />
          <LiquidOrb x={cx} y={lerp(cy + 900, cy - 160, endK)} d={lerp(200, 330, endK)} s={s} seed={3} />
          <div style={{ position: "absolute", left: 0, width: W, top: cy + 120, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 112, letterSpacing: "-0.035em", color: C.ink, opacity: prog(s, T.fall + 1.1, T.fall + 1.8), transform: `translateY(${(1 - prog(s, T.fall + 1.1, T.fall + 1.8)) * 30}px)` }}>Obsidian</div>
          <div style={{ position: "absolute", left: 0, width: W, top: cy + 270, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 42, letterSpacing: "-0.015em", color: "rgba(246,241,248,.82)", opacity: prog(s, T.fall + 1.7, T.fall + 2.4) }}>Digital precision that builds reputation.</div>
          <div style={{ position: "absolute", left: 0, width: W, top: cy + 390, textAlign: "center", ...LABEL, fontSize: 24, opacity: prog(s, T.fall + 2.4, T.fall + 3.0) }}>WhatsApp · 079 244 9607</div>
        </>
      )}
    </AbsoluteFill>
  );
};
