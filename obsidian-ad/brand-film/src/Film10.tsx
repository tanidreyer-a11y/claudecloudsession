// OBSIDIAN — "Made by Claude" product film (OBS-KOVA, 33 s, 9:16 1080×1920). Format and rules:
// .claude/skills/ai-reveal-product-video. Kova is a made-up invoicing app (concept). The words on screen are the script;
// when the owner's voice-over arrives, vo_timing.py's timing.json replaces the times below.
//  0.0 hook "Chasing invoices?" → goo  2.2 "Meet Kova." (shape → logo)  3.8 send an invoice (3D swing-in, click, flies
//  into depth)  6.8 reminders drop into a 3D stack that orbits; "Paid" expands into  9.8 the cash chart; the camera dives
//  into the tallest bar  13.0 "But here's the thing."  15.0 rewind → freeze → a scan line turns the frame into its own
//  wireframe  17.6 the frame shrinks into a filmstrip; Claude types the code  20.6 kinetic typography · shape
//  transitions · 3D elements (three.js) · camera moves (HyperFrames tunnel plate) · "All code."  28.4 Kova end card
//  30.4 Made with Claude → OBSIDIAN lockup.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "./fonts";
import { prog, lerp, h } from "./Film2";
import { Hand, Lockup } from "./Film7";

export const FPS10 = 60, DUR10 = 33;
const W = 1080, H = 1920, CX = 540, CY = 960;
const WIDE = "ArchivoW, Helvetica, Arial, sans-serif";
const MONO = "JBMono, ui-monospace, monospace";
const SM = Easing.bezier(0.3, 0, 0.2, 1), MV = Easing.bezier(0.6, 0, 0.2, 1), IN = Easing.bezier(0.55, 0, 0.9, 0.4);
const BACK = Easing.bezier(0.3, 1.45, 0.45, 1);
const PEARL = "#E9EAED", INK = "#0B0B0D", GREEN = "#2BB673";
const cl = (v: number) => Math.max(0, Math.min(1, v));
const P = (s: number, a: number, b: number, e = SM) => prog(s, a, b, e);
const fmt = (n: number) => "R " + Math.round(n).toLocaleString("en-ZA").replace(/,/g, " ");

// ---------------------------------------------------------------- shared pieces
const Pearl: React.FC<{ op?: number }> = ({ op = 1 }) => (
  <AbsoluteFill style={{ opacity: op, background: `radial-gradient(120% 80% at 50% 30%, #F6F7F9 0%, ${PEARL} 55%, #D9DBE0 100%)` }} />
);
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size, display: "inline-block" }}><path fill="#D97757" d={CLAUDE_PATH} /></svg>
);
const CLAWD = ["01111111110", "01111111110", "11011111011", "11111111111", "01111111110", "01111111110", "01010001010", "01010001010"];
const Clawd: React.FC<{ px: number; style?: React.CSSProperties }> = ({ px, style }) => (
  <svg viewBox="0 0 11 8" shapeRendering="crispEdges" style={{ width: px * 11, height: px * 8, display: "inline-block", ...style }}>
    <g fill="#D77757">{CLAWD.flatMap((r, y) => r.split("").map((c, x) => c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null))}</g>
  </svg>
);

// words that arrive one by one, blur → sharp, on their own beat (later: on the voice-over's word times)
const Words: React.FC<{ s: number; t0: number; lines: string[]; size: number; y: number; step?: number; color?: string; stretch?: number; weight?: number; out?: number; lh?: number }> =
  ({ s, t0, lines, size, y, step = 0.11, color = INK, stretch = 118, weight = 800, out = 99, lh = 1.02 }) => {
    let k = 0; const o = 1 - P(s, out, out + 0.3, IN);
    return (
      <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: WIDE, fontWeight: weight, fontStretch: `${stretch}%`, fontSize: size, lineHeight: lh, letterSpacing: "-0.03em", color, opacity: o, filter: `blur(${(1 - o) * 14}px)`, transform: `translateY(${-(1 - o) * 40}px)` }}>
        {lines.map((ln, li) => <div key={li}>{ln.split(" ").map((w, wi) => {
          const a = P(s, t0 + (k++) * step, t0 + (k - 1) * step + 0.38);
          return <span key={wi} style={{ display: "inline-block", marginRight: "0.24em", opacity: a, filter: `blur(${(1 - a) * 16}px)`, transform: `translateY(${(1 - a) * 46}px) scale(${1.06 - 0.06 * a})` }}>{w}</span>;
        })}</div>)}
      </div>
    );
  };

// liquid transition: metaballs grow from a point, merge (SVG goo filter) and flood the frame
const Goo: React.FC<{ s: number; t0: number; dur: number; x: number; y: number; color: string; id: string; fade?: number }> = ({ s, t0, dur, x, y, color, id, fade = 0.3 }) => {
  const k = P(s, t0, t0 + dur, MV); if (k <= 0) return null;
  const op = 1 - P(s, t0 + dur, t0 + dur + fade, Easing.inOut(Easing.quad)); if (op <= 0) return null;
  const blobs = Array.from({ length: 7 }, (_, i) => {
    const a = h(i, 3) * Math.PI * 2, d = 140 + 260 * h(i, 5), st = 0.08 * i;
    const kk = cl((k - st) / (1 - st));
    return { cx: x + Math.cos(a) * d * (1 - kk * 0.6), cy: y + Math.sin(a) * d * (1 - kk * 0.6), r: 40 + kk * (300 + 500 * h(i, 9)) };
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: op }}>
      <defs><filter id={id}><feGaussianBlur stdDeviation="26" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 38 -16" /></filter></defs>
      <g filter={`url(#${id})`} fill={color}>
        <circle cx={x} cy={y} r={30 + k * 2300} />
        {blobs.map((b, i) => <circle key={i} cx={b.cx} cy={b.cy} r={b.r} />)}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- Kova product world (reused frozen in the reveal)
const KovaMark: React.FC<{ size: number; round?: number; rot?: number }> = ({ size, round = 0.3, rot = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: size * round, background: INK, transform: `rotate(${rot}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(0,0,0,.18)" }}>
    <div style={{ transform: `rotate(${-rot}deg)`, fontFamily: WIDE, fontWeight: 800, fontStretch: "110%", fontSize: size * 0.62, color: "#fff", lineHeight: 1, marginTop: -size * 0.04 }}>k</div>
  </div>
);

// one box that renders either finished UI or its own wireframe (the x-ray reveal)
const Bx: React.FC<{ wire: boolean; label: string; style: React.CSSProperties; children?: React.ReactNode; dims?: string }> = ({ wire, label, style, children, dims }) => wire ? (
  <div style={{ ...style, background: "transparent", boxShadow: "none", border: "1.5px solid rgba(220,222,228,.75)", color: "transparent" }}>
    <div style={{ position: "absolute", left: 8, top: -26, fontFamily: MONO, fontSize: 17, color: "#9A9CA5", whiteSpace: "nowrap" }}>{label}</div>
    {dims && <div style={{ position: "absolute", right: 8, bottom: -26, fontFamily: MONO, fontSize: 15, color: "#6F7280" }}>{dims}</div>}
  </div>
) : <div style={style}>{children}</div>;
const TextBar: React.FC<{ wire: boolean; w: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ wire, w, children, style }) => wire
  ? <div style={{ ...style, width: w, height: 14, borderRadius: 7, background: "rgba(220,222,228,.32)", marginTop: 10, marginBottom: 10 }} />
  : <div style={style}>{children}</div>;

// feature 1 — the invoice (global time t)
const Invoice: React.FC<{ t: number; wire?: boolean; hideHead?: boolean }> = ({ t, wire = false, hideHead = false }) => {
  const rise = P(t, 4.0, 4.55), tilt = P(t, 6.0, 6.75, IN);
  const press = P(t, 5.45, 5.55) * (1 - P(t, 5.6, 5.75)), sent = P(t, 5.62, 5.9);
  const handIn = P(t, 4.85, 5.4, MV), handOut = P(t, 5.85, 6.2, IN);
  const total = 27500 * P(t, 4.6, 5.2);
  const card: React.CSSProperties = { position: "absolute", left: 100, top: 600, width: 880, height: 980, borderRadius: 36, background: "#fff", boxShadow: "0 40px 90px rgba(10,12,20,.16)" };
  const row = (i: number, name: string, amt: string) => {
    const a = P(t, 4.35 + i * 0.15, 4.75 + i * 0.15);
    return (
      <div key={i} style={{ position: "absolute", left: 56, right: 56, top: 410 + i * 104, height: 92, borderBottom: wire ? "none" : "1.5px solid #ECEDF0", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: a, transform: `translateY(${(1 - a) * 24}px)` }}>
        <TextBar wire={wire} w={300} style={{ fontFamily: WIDE, fontSize: 38, fontWeight: 500, color: "#2A2B30" }}>{name}</TextBar>
        <TextBar wire={wire} w={160} style={{ fontFamily: WIDE, fontSize: 38, fontWeight: 600, color: INK }}>{amt}</TextBar>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {wire ? <AbsoluteFill style={{ background: "#08090B" }}>{Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: 60 + i * 80, width: 1, background: "rgba(220,222,228,.07)" }} />)}</AbsoluteFill> : <Pearl />}
      <Bx wire={wire} label="<header>" style={{ position: "absolute", left: 60, top: 120, width: 300, height: 92, display: "flex", alignItems: "center", gap: 18 }}>
        <KovaMark size={76} /><span style={{ fontFamily: WIDE, fontWeight: 800, fontStretch: "118%", fontSize: 58, color: INK, letterSpacing: "-0.03em" }}>Kova</span>
      </Bx>
      {!hideHead && <Words s={t} t0={3.95} lines={["Send an invoice", "in one click."]} size={92} y={290} out={6.0} />}
      <div style={{ position: "absolute", inset: 0, perspective: 1800, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "50% 60%", opacity: rise * (1 - P(t, 6.5, 6.8)),
          transform: `translateY(${(1 - rise) * 160}px) rotateX(${(1 - rise) * 22 + tilt * 66}deg) translateZ(${-tilt * 1500}px)`, filter: `blur(${(1 - rise) * 18 + tilt * 10}px)` }}>
          <Bx wire={wire} label="<section class=&quot;invoice&quot;>" dims="880 × 980" style={card}>
            <div style={{ position: "absolute", left: 56, top: 54, fontFamily: MONO, fontSize: 24, color: "#8E919B" }}>Invoice 0042</div>
            <div style={{ position: "absolute", right: 56, top: 54, fontFamily: MONO, fontSize: 24, color: "#8E919B" }}>Due 28 Oct</div>
            <div style={{ position: "absolute", left: 56, top: 132, fontFamily: WIDE, fontWeight: 800, fontStretch: "112%", fontSize: 64, color: INK, letterSpacing: "-0.02em" }}>Atlas Studio</div>
            <div style={{ position: "absolute", left: 56, top: 222, fontFamily: WIDE, fontSize: 32, color: "#8E919B" }}>hello@atlas.studio</div>
          </Bx>
          {wire && <>
            <div style={{ position: "absolute", left: 156, top: 726, width: 300, height: 14, borderRadius: 7, background: "rgba(220,222,228,.32)" }} />
            <div style={{ position: "absolute", left: 156, top: 800, width: 420, height: 22, borderRadius: 11, background: "rgba(220,222,228,.4)" }} />
            <div style={{ position: "absolute", left: 156, top: 882, width: 220, height: 12, borderRadius: 6, background: "rgba(220,222,228,.28)" }} />
          </>}
          <div style={{ position: "absolute", left: 100, top: 600, width: 880, height: 980 }}>
            {row(0, "Website design", "R 18 000")}{row(1, "Motion package", "R 9 500")}
            <div style={{ position: "absolute", left: 56, right: 56, top: 660, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: P(t, 4.6, 4.9) }}>
              <TextBar wire={wire} w={140} style={{ fontFamily: WIDE, fontSize: 40, fontWeight: 600, color: "#2A2B30" }}>Total</TextBar>
              <TextBar wire={wire} w={300} style={{ fontFamily: WIDE, fontSize: 76, fontWeight: 800, fontStretch: "112%", color: INK, letterSpacing: "-0.02em" }}>{fmt(total)}</TextBar>
            </div>
            <Bx wire={wire} label="<button class=&quot;send&quot;>" style={{ position: "absolute", left: 60 + sent * 250, top: 810, width: 760 - sent * 500, height: 124, borderRadius: 62, background: sent > 0.5 ? GREEN : INK, transform: `scale(${1 - press * 0.04})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: WIDE, fontWeight: 700, fontSize: 42, color: "#fff", overflow: "hidden" }}>
              {sent < 0.5 ? <span style={{ opacity: 1 - sent * 2 }}>Send invoice</span> : <span style={{ opacity: sent * 2 - 1 }}>✓ Sent</span>}
            </Bx>
          </div>
        </div>
      </div>
      {handIn > 0 && handOut < 1 && !wire && <Hand x={lerp(1150, 640, handIn) + handOut * 300} y={lerp(1900, 1478, handIn) + handOut * 200} press={press} op={1 - handOut} />}
      {wire && <div style={{ position: "absolute", left: 640, top: 1478, width: 40, height: 40, border: "1.5px solid rgba(220,222,228,.75)", borderRadius: "50%" }} />}
    </AbsoluteFill>
  );
};

// feature 2 — reminders drop into a 3D stack that slowly orbits; "Paid" lifts out and becomes the next screen
const REM = [["Reminder sent", "Day 3, polite", "#B9BCC4"], ["Second nudge", "Day 7, friendly", "#8E919B"], ["Paid", "R 27 500 received", GREEN]];
const Stack: React.FC<{ t: number }> = ({ t }) => {
  const orbit = P(t, 7.0, 9.4, Easing.linear), lift = P(t, 9.15, 9.85, MV);
  return (
    <AbsoluteFill>
      <Pearl />
      <Words s={t} t0={6.85} lines={["It reminds your", "clients for you."]} size={92} y={290} out={9.15} />
      <div style={{ position: "absolute", inset: 0, perspective: 2000, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: CX, top: 1130, transformStyle: "preserve-3d", transform: `scale(${lerp(1.3, 1, lift)}) rotateX(${lerp(52, 58, orbit) * (1 - lift)}deg) rotateZ(${lerp(-34, -24, orbit) * (1 - lift)}deg)` }}>
          {REM.map(([a, b, c], i) => {
            const land = P(t, 7.0 + i * 0.45, 7.45 + i * 0.45, BACK);
            const top = i === 2;
            const z = i * 80 + (top ? lift * 260 : 0);
            const wv = top ? lerp(820, W, lift) : 820, hv = top ? lerp(200, H, lift) : 200;
            const op = top ? 1 : 1 - P(t, 9.15, 9.5);
            return (
              <div key={i} style={{ position: "absolute", left: -wv / 2, top: -hv / 2 - (top ? lift * 220 : 0), width: wv, height: hv, borderRadius: lerp(30, 0, top ? lift : 0), background: "#fff", opacity: land * op,
                transform: `translateZ(${z + (1 - land) * 900}px)`, boxShadow: "0 30px 60px rgba(10,12,20,.18)", display: "flex", alignItems: "center", gap: 28, padding: "0 44px", boxSizing: "border-box" }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: c, flex: "none", opacity: top ? 1 - lift : 1 }} />
                <div style={{ opacity: top ? 1 - lift * 1.6 : 1 }}>
                  <div style={{ fontFamily: WIDE, fontWeight: 800, fontStretch: "112%", fontSize: 50, color: INK, letterSpacing: "-0.02em" }}>{a}</div>
                  <div style={{ fontFamily: WIDE, fontSize: 32, color: "#8E919B", marginTop: 4 }}>{b}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// feature 3 — the cash chart; the camera dives into the tallest bar (its black becomes the next scene)
const BARS = [0.42, 0.58, 0.5, 1.0, 0.66, 0.36, 0.28];
const BAR = { x0: 110, w: 92, gap: 34, base: 1560, hmax: 560 };
const barX = (i: number) => BAR.x0 + i * (BAR.w + BAR.gap);
const Chart: React.FC<{ t: number }> = ({ t }) => {
  const dive = P(t, 12.25, 13.0, IN);
  const fx = barX(3) + BAR.w / 2, fy = BAR.base - BAR.hmax * 0.5;
  const sc = Math.exp(Math.log(40) * dive);
  return (
    <AbsoluteFill style={{ background: "#FAFAFB" }}>
      <AbsoluteFill style={{ transformOrigin: `${fx}px ${fy}px`, transform: `scale(${sc})` }}>
        <Words s={t} t0={9.9} lines={["Shows the cash", "landing this week."]} size={92} y={290} out={12.2} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: WIDE, fontSize: 34, color: "#8E919B", opacity: P(t, 10.1, 10.5) * (1 - P(t, 12.1, 12.4)) }}>Landing this week</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontFamily: WIDE, fontWeight: 800, fontStretch: "118%", fontSize: 150, letterSpacing: "-0.04em", color: INK, opacity: P(t, 10.1, 10.4) * (1 - P(t, 12.1, 12.4)) }}>{fmt(48200 * P(t, 10.2, 11.3))}</div>
        {BARS.map((v, i) => {
          const g = P(t, 10.4 + i * 0.07, 10.95 + i * 0.07, BACK), hh = BAR.hmax * v * g;
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: barX(i), top: BAR.base - hh, width: BAR.w, height: hh, borderRadius: 18, background: i === 3 ? INK : "#C9CCD3" }} />
            <div style={{ position: "absolute", left: barX(i), width: BAR.w, top: BAR.base + 24, textAlign: "center", fontFamily: MONO, fontSize: 22, color: "#8E919B", opacity: P(t, 10.5, 10.9) }}>{"MTWTFSS"[i]}</div>
          </React.Fragment>;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: INK, opacity: P(t, 12.85, 13.0) }} />
    </AbsoluteFill>
  );
};

// the product world at any time (for the rewind and the filmstrip)
const Product: React.FC<{ t: number }> = ({ t }) => t < 6.8 ? <Invoice t={t} /> : t < 9.8 ? <Stack t={t} /> : <Chart t={t} />;

// ---------------------------------------------------------------- 3D "3D" (three.js)
const ThreeD: React.FC<{ s: number }> = ({ s }) => {
  const { gl, scene, camera } = useThree();
  const font = useLoader(FontLoader, staticFile("fonts/helvetiker_bold.typeface.json"));
  const geo = React.useMemo(() => {
    const g = new TextGeometry("3D", { font, size: 2.2, depth: 0.7, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 5 });
    g.computeBoundingBox(); const bb = g.boundingBox!; g.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -(bb.max.z + bb.min.z) / 2);
    return g;
  }, [font]);
  React.useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.background = new THREE.Color("#000000");
  }, [gl, scene]);
  const inn = P(s, 23.6, 24.15, SM), dive = P(s, 24.65, 25.05, IN);
  const yaw = lerp(-1.05, 0.32, P(s, 23.6, 24.9, SM));
  camera.position.set(0, 0.2, lerp(11.5, 0.6, dive)); camera.lookAt(0, 0, 0);
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[lerp(-6, 6, P(s, 23.6, 25.0, Easing.linear)), 5, 6]} intensity={2.2} />
      <directionalLight position={[0, -3, -6]} intensity={0.9} />
      <mesh geometry={geo} rotation={[lerp(0.5, 0.05, inn), yaw, 0]} position={[0, 0.6, lerp(-14, 0, inn)]}>
        <meshPhysicalMaterial color="#EDEEF2" metalness={1} roughness={0.18} clearcoat={0.8} />
      </mesh>
    </>
  );
};

// ---------------------------------------------------------------- film
const CODE = ["const t = frame / fps;", "<Invoice t={t} wire={scan > y} />", "<Goo from={[880, 1000]} t0={1.75} />", "<Stack rotateX={lerp(52, 58, k)} />", "<Chart dive={prog(t, 12.25, 13)} />", "<Words lines={[\"Frame by frame.\"]} />"];

export const Film10: React.FC = () => {
  const frame = useCurrentFrame(); const { fps, width, height } = useVideoConfig(); const s = frame / fps;
  const L: React.ReactNode[] = []; const add = (n: React.ReactNode) => L.push(n);

  // 0–2.2 hook: letters slam in
  if (s < 2.6) {
    const lines = ["Chasing", "invoices?"]; let k = 0;
    add(<AbsoluteFill key="hook" style={{ background: INK }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: WIDE, fontWeight: 800, fontStretch: "125%", fontSize: 168, lineHeight: 1.04, letterSpacing: "-0.035em", color: "#F4F5F7", transform: `scale(${1 + P(s, 0, 2.2, Easing.linear) * 0.05})` }}>
        {lines.map((ln, li) => <div key={li}>{ln.split("").map((ch, ci) => {
          const a = P(s, 0.12 + (k++) * 0.05, 0.12 + (k - 1) * 0.05 + 0.3);
          const q = ch === "?" ? Math.sin(Math.min(1, P(s, 1.55, 1.95, Easing.linear)) * Math.PI) : 0;
          return <span key={ci} style={{ display: "inline-block", opacity: a, filter: `blur(${(1 - a) * 12}px)`, transform: `translateY(${(1 - a) * 150 - q * 26}px) scaleY(${1 + (1 - a) * 0.7 + q * 0.12})`, transformOrigin: "50% 100%" }}>{ch}</span>;
        })}</div>)}
      </div>
    </AbsoluteFill>);
  }
  if (s < 2.7) add(<Goo key="goo1" s={s} t0={1.75} dur={0.5} x={880} y={1010} color={PEARL} id="g1" fade={0.35} />);
  // 2.2–3.8 "Meet Kova."
  if (s > 2.2 && s < 4.2) {
    const g = P(s, 2.3, 2.75), m = P(s, 2.55, 3.0, MV), slide = P(s, 2.95, 3.35, MV), word = P(s, 3.0, 3.4), tohead = P(s, 3.55, 4.0, MV);
    const size = lerp(30, 220, g), rot = lerp(0, 90, m), round = lerp(0.5, 0.3, m);
    const gx = lerp(CX - size / 2 - slide * 210, 60, tohead), gy = lerp(CY - 110, 120 + (92 - 76) / 2, tohead), sc = lerp(1, 76 / 220, tohead);
    add(<AbsoluteFill key="meet">
      <Pearl />
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: WIDE, fontSize: 54, color: "#6B6E78", opacity: P(s, 2.35, 2.7) * (1 - tohead), filter: `blur(${(1 - P(s, 2.35, 2.7)) * 10}px)` }}>Meet</div>
      <div style={{ position: "absolute", left: gx, top: gy, transformOrigin: "0 0", transform: `scale(${sc})`, display: "flex", alignItems: "center", gap: 36 }}>
        <KovaMark size={size} round={round} rot={rot} />
        <div style={{ fontFamily: WIDE, fontWeight: 800, fontStretch: "118%", fontSize: 168, color: INK, letterSpacing: "-0.03em", clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`, opacity: tohead > 0.95 ? 0 : 1 }}>Kova</div>
      </div>
    </AbsoluteFill>);
  }
    // 3.8–13.0 product
  if (s >= 3.8 && s < 13.0) add(<Product key="prod" t={s} />);
  // 13.0–15.0 the turn
  if (s >= 12.95 && s < 15.1) add(<AbsoluteFill key="turn" style={{ background: INK }}>
    <Words s={s} t0={13.1} step={0.24} lines={["But here’s", "the thing."]} size={128} y={790} color="#F4F5F7" stretch={125} out={14.65} />
  </AbsoluteFill>);
  // 15.0–17.6 rewind → freeze → scan line → wireframe
  if (s >= 15.0 && s < 17.65) {
    const rw = P(s, 15.0, 15.55, Easing.inOut(Easing.quad));
    const tt = rw < 0.45 ? lerp(11.8, 10.95, rw / 0.45) : rw < 0.75 ? lerp(9.0, 7.95, (rw - 0.45) / 0.3) : lerp(5.9, 5.5, (rw - 0.75) / 0.25);
    const scan = P(s, 15.95, 17.05, MV) * (H + 40) - 20;
    const shrink = 0;
    const freeze = (wire: boolean) => <Invoice t={s < 15.55 ? tt : 5.5} wire={wire} hideHead />;
    const head = (c: string) => <Words s={s} t0={15.6} lines={["Nothing you just", "watched was filmed."]} size={72} y={300} stretch={112} color={c} />;
    add(<AbsoluteFill key="xray" style={{ transformOrigin: `${CX}px 640px`, transform: `translateY(${-shrink * 320}px) scale(${lerp(1, 0.36, shrink)})`, borderRadius: shrink * 40, overflow: "hidden", boxShadow: shrink > 0 ? "0 30px 80px rgba(0,0,0,.6)" : "none" }}>
      <AbsoluteFill style={{ clipPath: `inset(${Math.max(0, scan)}px 0 0 0)`, filter: s < 15.55 ? `blur(${Math.sin(rw * Math.PI) * 5}px)` : "none" }}>{s < 15.55 ? <Product t={tt} /> : freeze(false)}{s >= 15.55 && head(INK)}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${Math.max(0, H - scan)}px 0)` }}>{freeze(true)}{head("#F4F5F7")}</AbsoluteFill>
      {scan > 0 && scan < H && <div style={{ position: "absolute", left: 0, right: 0, top: scan - 2, height: 4, background: "#fff", boxShadow: "0 0 30px 8px rgba(255,255,255,.55)" }} />}
      {s < 15.6 && <div style={{ position: "absolute", left: 120, right: 120, bottom: 120, height: 6, borderRadius: 3, background: "rgba(0,0,0,.18)" }}><div style={{ position: "absolute", left: 0, top: -6, width: 18, height: 18, borderRadius: 9, background: INK, transform: `translateX(${(1 - rw) * 820}px)` }} /></div>}
    </AbsoluteFill>);
  }
  // 17.6–20.6 filmstrip + Claude writing the code
  if (s >= 17.6 && s < 20.9) {
    const k = P(s, 17.95, 18.4), scroll = P(s, 18.0, 20.6, Easing.linear);
    const shots = [1.0, 2.9, 8.3, 11.4];
    const fw = W * 0.36, fh = H * 0.36, gap = 36;
    const out = P(s, 20.45, 20.85, IN);
    add(<AbsoluteFill key="claude" style={{ background: "#050506", opacity: 1 - out }}>
      <Words s={s} t0={17.75} step={0.16} lines={["Claude wrote it."]} size={78} y={86} color="#F4F5F7" stretch={122} />
      <Words s={s} t0={19.0} step={0.16} lines={["Frame by frame."]} size={78} y={178} color="#9A9CA5" stretch={122} />
      {shots.map((tt, i) => {
        const x = CX + (i < 2 ? i - 2 : i - 1) * (fw + gap) - fw / 2 - scroll * 380;
        return <div key={i} style={{ position: "absolute", left: x, top: 640 - fh / 2 + 310 - 310, width: fw, height: fh, borderRadius: 22, overflow: "hidden", opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}>
          <div style={{ width: W, height: H, transform: `scale(0.36)`, transformOrigin: "0 0" }}>{tt < 2.2 ? <AbsoluteFill style={{ background: INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WIDE, fontWeight: 800, fontStretch: "125%", fontSize: 168, color: "#F4F5F7", textAlign: "center", lineHeight: 1.04 }}>Chasing<br />invoices?</AbsoluteFill> : tt < 3.8 ? <AbsoluteFill><Pearl /><div style={{ position: "absolute", left: CX - 330, top: CY - 110 }}><div style={{ display: "flex", alignItems: "center", gap: 36 }}><KovaMark size={220} /><span style={{ fontFamily: WIDE, fontWeight: 800, fontStretch: "118%", fontSize: 168, color: INK }}>Kova</span></div></div></AbsoluteFill> : <Product t={tt} />}</div>
          <div style={{ position: "absolute", left: 14, bottom: 12, fontFamily: MONO, fontSize: 18, color: "#9A9CA5", background: "rgba(0,0,0,.55)", padding: "2px 8px", borderRadius: 6 }}>frame {String(Math.round(tt * 60)).padStart(4, "0")}</div>
        </div>;
      })}
      {(() => { const f = P(s, 17.6, 18.3, MV); const sx = lerp(0, CX - fw / 2 - scroll * 380, f), sy = lerp(0, 640 - fh / 2, f), sc = lerp(1, 0.36, f);
        return <div style={{ position: "absolute", left: sx, top: sy, width: W, height: H, transform: `scale(${sc})`, transformOrigin: "0 0", borderRadius: 22 / sc * f, overflow: "hidden", boxShadow: `0 0 0 ${2 / sc}px rgba(255,255,255,${0.85 * f})` }}>
          <Invoice t={5.5} wire hideHead /><Words s={99} t0={0} lines={["Nothing you just", "watched was filmed."]} size={72} y={300} color="#F4F5F7" stretch={112} />
        </div>; })()}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1100, height: 650, borderRadius: 28, background: "#0E0F12", border: "1.5px solid rgba(255,255,255,.12)", opacity: P(s, 18.0, 18.4), transform: `translateY(${(1 - P(s, 18.0, 18.4)) * 60}px)` }}>
        <Clawd px={8} style={{ position: "absolute", right: 48, top: -64 }} />
        <div style={{ position: "absolute", left: 32, top: 26, display: "flex", alignItems: "center", gap: 14, fontFamily: WIDE, fontSize: 30, fontWeight: 600, color: "#E6E7EA" }}><ClaudeMark size={36} />Claude</div>
        <div style={{ position: "absolute", right: 32, top: 32, fontFamily: MONO, fontSize: 22, color: "#8E919B" }}>frame {String(Math.min(1980, Math.round(P(s, 18.2, 20.5, Easing.linear) * 1980))).padStart(4, "0")} / 1980</div>
        <div style={{ position: "absolute", left: 32, right: 32, top: 100, height: 1, background: "rgba(255,255,255,.1)" }} />
        {CODE.map((ln, i) => {
          const a = P(s, 18.25 + i * 0.36, 18.25 + i * 0.36 + 0.32, Easing.linear); const n = Math.round(ln.length * a);
          return <div key={i} style={{ position: "absolute", left: 32, top: 128 + i * 76, fontFamily: MONO, fontSize: 27, color: i === 0 ? "#C9CBD2" : "#E6E7EA", whiteSpace: "pre" }}>
            <span style={{ color: "#5F6270", marginRight: 22 }}>{String(i + 1).padStart(2, " ")}</span>{ln.slice(0, n)}{a > 0 && a < 1 && <span style={{ display: "inline-block", width: 14, height: 30, marginLeft: 2, verticalAlign: -5, background: "#E6E7EA" }} />}
          </div>;
        })}
      </div>
    </AbsoluteFill>);
  }
  // 20.6–22.0 kinetic typography — every letter moves its own way
  if (s >= 20.55 && s < 22.1) {
    const lines = ["Kinetic", "typography."]; let k = 0; const out = P(s, 21.8, 22.05, IN);
    add(<AbsoluteFill key="kin" style={{ background: INK }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: WIDE, fontWeight: 800, fontStretch: "115%", fontSize: 106, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#F4F5F7" }}>
        {lines.map((ln, li) => <div key={li} style={{ whiteSpace: "nowrap" }}>{ln.split("").map((ch, ci) => {
          const i = k++; const a = P(s, 20.65 + i * 0.035, 20.65 + i * 0.035 + 0.34, BACK); const wave = Math.sin((s - 21.2) * 9 - i * 0.6) * P(s, 21.15, 21.4) * 14;
          const mode = i % 3; const off = mode === 0 ? `translateY(${(1 - a) * -180}px) rotate(${(1 - a) * -40}deg)` : mode === 1 ? `translateY(${(1 - a) * 180}px) scaleY(${0.2 + a * 0.8})` : `scale(${0.1 + a * 0.9}) rotate(${(1 - a) * 90}deg)`;
          return <span key={ci} style={{ display: "inline-block", opacity: cl(a * 1.4) * (1 - out), transform: `${off} translateY(${wave - out * (h(i, 2) * 300 - 150)}px)`, filter: `blur(${out * 10}px)` }}>{ch}</span>;
        })}</div>)}
      </div>
    </AbsoluteFill>);
  }
  // 22.0–23.6 smooth shape transitions: circle → rotated square → pill holding the words → melts away
  if (s >= 22.0 && s < 23.75) {
    const a = P(s, 22.0, 22.3, BACK), b = P(s, 22.3, 22.62, MV), c = P(s, 22.62, 22.98, MV), out = P(s, 23.3, 23.62, IN);
    const w = lerp(lerp(lerp(0, 300, a), 300, b), 900, c) * (1 - out * 0.9), hh = lerp(lerp(lerp(0, 300, a), 300, b), 190, c) * (1 - out * 0.9);
    const r = lerp(lerp(150, 56, b), 95, c), rot = lerp(lerp(0, 45, b), 180, c);
    add(<AbsoluteFill key="shape" style={{ background: INK }}>
      <div style={{ position: "absolute", left: CX - w / 2, top: 860 - hh / 2, width: w, height: hh, borderRadius: r, background: "#F4F5F7", transform: `rotate(${rot}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860 - 46, textAlign: "center", fontFamily: WIDE, fontWeight: 800, fontStretch: "118%", fontSize: 76, color: INK, letterSpacing: "-0.03em", opacity: P(s, 22.9, 23.1) * (1 - out), filter: `blur(${(1 - P(s, 22.9, 23.1)) * 8 + out * 8}px)` }}>Smooth shape</div>
      <Words s={s} t0={23.0} lines={["transitions."]} size={110} y={1010} color="#F4F5F7" stretch={125} out={23.32} />
    </AbsoluteFill>);
  }
  // 23.6–25.05 3D elements (three.js)
  if (s >= 23.55 && s < 25.1) add(<AbsoluteFill key="d3" style={{ background: "#000" }}>
    <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 0.2, 9.5] }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      <ThreeD s={s} />
    </ThreeCanvas>
    <Words s={s} t0={23.85} lines={["elements."]} size={110} y={1330} color="#F4F5F7" stretch={125} out={24.62} />
  </AbsoluteFill>);
  // 24.9–26.8 seamless camera moves (HyperFrames gallery-tunnel plate, our heroes, monochrome)
  if (s >= 24.9 && s < 28.5) {
    const inn = P(s, 24.9, 25.15), shrink = P(s, 26.8, 27.35, MV);
    add(<AbsoluteFill key="cam" style={{ background: "#000" }}>
      {s >= 26.8 && <AbsoluteFill style={{ opacity: P(s, 26.8, 27.2) }}>{Array.from({ length: 34 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50, top: i * 58 - ((s - 26.8) * 120) % 58, fontFamily: MONO, fontSize: 24, color: "rgba(220,222,228,.16)", whiteSpace: "pre" }}>{CODE[i % CODE.length].padEnd(44, " ")}{CODE[(i + 3) % CODE.length]}</div>)}</AbsoluteFill>}
      <AbsoluteFill style={{ transformOrigin: "50% 46%", transform: `scale(${lerp(1, 0.62, shrink)})`, borderRadius: shrink * 44, overflow: "hidden", border: shrink > 0 ? `${shrink * 3}px solid rgba(255,255,255,.7)` : "none", opacity: inn }}>
        <Sequence from={Math.round(24.9 * FPS10)} layout="none"><OffthreadVideo src={staticFile("plates/tunnel_v.mp4")} muted style={{ width: W, height: H, objectFit: "cover" }} /></Sequence>
        <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 48%, rgba(0,0,0,.55), transparent 70%)" }} />
        <Words s={s} t0={25.15} step={0.14} lines={["Seamless", "camera moves."]} size={100} y={840} stretch={118} color="#F4F5F7" stretch={125} out={26.7} />
      </AbsoluteFill>
      {shrink > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 1650, textAlign: "center", fontFamily: WIDE, fontWeight: 800, fontStretch: "125%", fontSize: 120, color: "#F4F5F7", letterSpacing: "-0.03em", opacity: P(s, 27.1, 27.45), filter: `blur(${(1 - P(s, 27.1, 27.45)) * 12}px)` }}>All code.</div>}
    </AbsoluteFill>);
  }
  // 28.4–30.4 Kova end card (goo in)
  if (s >= 28.1 && s < 30.8) {
    add(<Goo key="goo2" s={s} t0={28.1} dur={0.5} x={CX} y={1000} color={PEARL} id="g2" />);
    if (s >= 28.45) add(<AbsoluteFill key="kend" style={{ opacity: 1 - P(s, 30.3, 30.7, IN) }}>
      <Pearl />
      <div style={{ position: "absolute", left: CX - 330, top: 800, display: "flex", alignItems: "center", gap: 36, opacity: P(s, 28.5, 28.85), transform: `scale(${lerp(0.92, 1, P(s, 28.5, 29.1))})`, transformOrigin: "50% 50%" }}>
        <KovaMark size={220} /><span style={{ fontFamily: WIDE, fontWeight: 800, fontStretch: "118%", fontSize: 168, color: INK, letterSpacing: "-0.03em" }}>Kova</span>
      </div>
      <Words s={s} t0={28.9} step={0.09} lines={["Get paid without chasing."]} size={52} y={1080} color="#4A4C55" weight={500} stretch={105} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1720, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "#8E919B", opacity: P(s, 29.2, 29.5) }}>Concept product</div>
    </AbsoluteFill>);
  }
  // 30.4–33 Made with Claude → OBSIDIAN
  if (s >= 30.4) add(<AbsoluteFill key="end" style={{ background: INK, opacity: P(s, 30.4, 30.7) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: P(s, 30.6, 30.95), filter: `blur(${(1 - P(s, 30.6, 30.95)) * 10}px)` }}>
      <ClaudeMark size={60} /><span style={{ fontFamily: WIDE, fontWeight: 700, fontStretch: "118%", fontSize: 66, color: "#F4F5F7", letterSpacing: "-0.02em" }}>Made with Claude</span><Clawd px={6} style={{ marginLeft: 6 }} />
    </div>
    <Lockup s={s} t0={31.1} x={CX} y={1010} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", fontFamily: WIDE, fontSize: 38, color: "#A3A6AF", opacity: P(s, 31.6, 32.0) }}>Digital precision that builds reputation.</div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 1760, textAlign: "center", fontFamily: WIDE, fontSize: 19, lineHeight: 1.4, color: "#5F6270", opacity: P(s, 31.0, 31.4) }}>Claude and Clawd are trademarks of Anthropic. Obsidian is not affiliated with Anthropic. Kova is a concept product.</div>
  </AbsoluteFill>);

  return <AbsoluteFill style={{ background: "#000" }}>{L}</AbsoluteFill>;
};

const CLAUDE_PATH = "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";
