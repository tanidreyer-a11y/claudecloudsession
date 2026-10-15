// One-shot kit: build the whole film as ONE world that a camera travels through, led by one focus point.
// Method (see .claude/skills/obsidian-video-studio/continuity.md): the eye never searches — every new element is born
// where the eye already is (Murch's eye trace), scenes change by morphing the hero, not by cutting, and the camera is
// a character (it follows the hero with lag, banks into turns, pulls back to reveal, pushes through to enter).
//   const cam = camAt(KEYS, t)                 keyframed camera {x, y, z(oom), r(oll°)} in world px
//   const cam = follow((s) => head(s), t, {lag: 0.14, bank: 0.05})   camera chases a moving point
//   <World cam={cam} blur>…<At x y>…</At>…</World>   children live in world px; World does camera + motion blur
//   <Thread d={path} p={0.6} />  line drawn along a path with a glowing head; threadHead(d, p) = where the eye is
//   <Shape k={0..1} r={240} />   ring → concave 4-point star morph (one hero, many forms)
//   <Matte box={{...}}>next scene</Matte>   track matte: the next scene shows only inside a shape that grows
//   screenOf(cam, x, y) / worldAt(cam, sx, sy)   match cuts: put scene B's element exactly where A's was on screen
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { SM, MV, cl } from "./core";

export type Cam = { x: number; y: number; z: number; r: number };
export type CamKey = Cam & { t: number; e?: (v: number) => number };

// Keyframed camera. Each segment eases with the NEXT key's e (default SM). Hold = repeat a key.
export const camAt = (keys: CamKey[], t: number): Cam => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) {
      const k = (b.e ?? SM)(cl((t - a.t) / (b.t - a.t)));
      // zoom interpolates in log space so a 4× pull-back feels even all the way out
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, r: a.r + (b.r - a.r) * k, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * k) };
    }
  }
  return keys[keys.length - 1];
};
export const mixCam = (a: Cam, b: Cam, k: number): Cam => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, r: a.r + (b.r - a.r) * k, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * k) });

// Camera that chases a target with a delay (lag s) and banks (rolls) into sideways motion — the rollercoaster feel.
export const follow = (target: (t: number) => { x: number; y: number }, t: number, o: { lag?: number; bank?: number; z?: number; maxRoll?: number } = {}): Cam => {
  const { lag = 0.14, bank = 0.05, z = 1, maxRoll = 9 } = o;
  const p = target(t - lag), q = target(t - lag - 1 / 30);
  const vx = (p.x - q.x) * 30;                                  // px/s sideways
  return { x: p.x, y: p.y, z, r: Math.max(-maxRoll, Math.min(maxRoll, -vx * bank * 0.1)) };
};

export const screenOf = (cam: Cam, x: number, y: number, W: number, H: number) => {
  const a = (cam.r * Math.PI) / 180, dx = (x - cam.x) * cam.z, dy = (y - cam.y) * cam.z;
  return { x: W / 2 + dx * Math.cos(a) - dy * Math.sin(a), y: H / 2 + dx * Math.sin(a) + dy * Math.cos(a) };
};
export const worldAt = (cam: Cam, sx: number, sy: number, W: number, H: number) => {
  const a = (-cam.r * Math.PI) / 180, dx = sx - W / 2, dy = sy - H / 2;
  return { x: cam.x + (dx * Math.cos(a) - dy * Math.sin(a)) / cam.z, y: cam.y + (dx * Math.sin(a) + dy * Math.cos(a)) / cam.z };
};

// The world. blur = directional motion blur from the camera's own speed (prev = camera one frame earlier).
export const World: React.FC<{ cam: Cam; prev?: Cam; blur?: number; children: React.ReactNode; id?: string }> = ({ cam, prev, blur = 0.16, children, id = "camblur" }) => {
  const { width: W, height: H } = useVideoConfig();
  let bx = 0, by = 0;
  if (prev && blur > 0) {
    const s0 = screenOf(prev, cam.x, cam.y, W, H), zs = Math.abs(Math.log(cam.z / prev.z)) * 900; // zoom speed counts as blur too
    bx = Math.min(16, Math.abs(s0.x - W / 2) * blur + zs * blur * 0.5); by = Math.min(16, Math.abs(s0.y - H / 2) * blur + zs * blur * 0.5);
    if (bx < 1.2 && by < 1.2) bx = by = 0;
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {bx + by > 0 && <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>}
      <AbsoluteFill style={{ filter: bx + by > 0 ? `url(#${id})` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) rotate(${cam.r}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)` }}>
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Place anything at a world point (centred).
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", ...style }}>{children}</div>
);

// The guide line. p = how much is drawn (0..1); tail = how much has retracted from the start (0..1, < p).
export const threadHead = (d: string, p: number) => getPointAtLength(d, getLength(d) * cl(p)) ?? { x: 0, y: 0 };
export const Thread: React.FC<{ d: string; p: number; tail?: number; color?: string; width?: number; dot?: number; glow?: number }> = ({ d, p, tail = 0, color = "#FFFFFF", width = 2.4, dot = 12, glow = 14 }) => {
  if (p <= 0) return null;
  const L = getLength(d), ev = evolvePath(cl(p), d), h = threadHead(d, p);
  const dash = tail > 0 ? { strokeDasharray: `0 ${L * tail} ${L * (cl(p) - tail)} ${L}`, strokeDashoffset: 0 } : ev;
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" {...dash} style={{ opacity: 0.85 }} />
      <circle cx={h.x} cy={h.y} r={dot} fill={color} style={{ filter: `drop-shadow(0 0 ${glow}px ${color})` }} />
    </svg>
  );
};

// Ring → concave 4-point star. Same 4 cubic segments in both, so the morph never tears. spin in degrees.
export const shapePath = (k: number, r: number, spin = 0) => {
  const pts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const a0 = ((i * 90 + spin - 90) * Math.PI) / 180, a1 = (((i + 1) * 90 + spin - 90) * Math.PI) / 180;
    const P0 = [Math.cos(a0) * r, Math.sin(a0) * r], P1 = [Math.cos(a1) * r, Math.sin(a1) * r];
    // circle handles: tangent, 0.5523 r long; star handles: pulled toward the centre (concave sides)
    const c1c = [P0[0] - Math.sin(a0) * r * 0.5523, P0[1] + Math.cos(a0) * r * 0.5523], c2c = [P1[0] + Math.sin(a1) * r * 0.5523, P1[1] - Math.cos(a1) * r * 0.5523];
    const c1s = [Math.cos(a0) * r * 0.16, Math.sin(a0) * r * 0.16], c2s = [Math.cos(a1) * r * 0.16, Math.sin(a1) * r * 0.16];
    const m = (u: number[], v: number[]) => [u[0] + (v[0] - u[0]) * k, u[1] + (v[1] - u[1]) * k].map((n) => n.toFixed(2)).join(" ");
    if (i === 0) pts.push(`M ${P0[0].toFixed(2)} ${P0[1].toFixed(2)}`);
    pts.push(`C ${m(c1c, c1s)} ${m(c2c, c2s)} ${P1[0].toFixed(2)} ${P1[1].toFixed(2)}`);
  }
  return pts.join(" ") + " Z";
};
export const Shape: React.FC<{ k: number; r: number; spin?: number; draw?: number; stroke?: string; fill?: string; width?: number; glow?: number; nodes?: number }> = ({ k, r, spin = 0, draw = 1, stroke = "#FFFFFF", fill = "none", width = 2.4, glow = 18, nodes = 1 }) => {
  const d = shapePath(k, r, spin), ev = evolvePath(cl(draw), d);
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={width} {...(draw < 1 ? ev : {})} style={{ filter: `drop-shadow(0 0 ${glow}px rgba(255,255,255,.55))` }} />
      {nodes > 0 && [0, 1, 2, 3].map((i) => { const a = ((i * 90 + spin - 90) * Math.PI) / 180; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={9 * nodes} fill={stroke} />; })}
    </svg>
  );
};

// Track matte (screen space): children (the next scene) are visible only inside the box. Animate box from the
// element's on-screen rect to the full frame and the element "opens" into the next scene.
export type Box = { x: number; y: number; w: number; h: number; r: number };
export const lerpBox = (a: Box, b: Box, k: number): Box => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k, r: a.r + (b.r - a.r) * k });
export const Matte: React.FC<{ box: Box; children: React.ReactNode }> = ({ box, children }) => {
  const { width: W, height: H } = useVideoConfig(), { x, y, w, h, r } = box;
  return <AbsoluteFill style={{ clipPath: `inset(${y - h / 2}px ${W - (x + w / 2)}px ${H - (y + h / 2)}px ${x - w / 2}px round ${r}px)` }}>{children}</AbsoluteFill>;
};

// Spring-ish overshoot for "contact" reactions (0 → 1 with one bounce). Use for pops when the hero touches something.
export const pop = (t: number, at: number, dur = 0.5) => {
  const u = cl((t - at) / dur);
  return u <= 0 ? 0 : 1 - Math.cos(u * Math.PI * 2.2) * Math.exp(-u * 5.5) * (1 - u * 0.2);
};

