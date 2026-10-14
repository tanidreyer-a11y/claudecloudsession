// Moving backgrounds, all a pure function of time t (seconds), monochrome by default (pass look for the accent).
// Bigger shader worlds: src/gl.tsx (World = domain-warped clouds with ink wipes, Balls = liquid metaballs) and the
// HyperFrames shader blocks (vendor/hyperframes/INDEX.md: "bg-", "shader-", "cosmic-orb", "gravitational-lens").
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { noise2D, noise3D } from "@remotion/noise";
import { Look, LOOKS, hash } from "./core";

const useCanvas = (draw: (c: CanvasRenderingContext2D, W: number, H: number) => void, deps: unknown[]) => {
  const ref = useRef<HTMLCanvasElement>(null); const { width: W, height: H } = useVideoConfig();
  useLayoutEffect(() => { const c = ref.current?.getContext("2d"); if (c) { c.clearRect(0, 0, W, H); draw(c, W, H); } }, deps); // eslint-disable-line
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0 }} />;
};

// Soft light that drifts: two blurred radial pools moved by noise. The calm default behind type.
export const LightPools: React.FC<{ t: number; look?: Look; strength?: number }> = ({ t, look = LOOKS.obsidian, strength = 0.22 }) => {
  const x1 = 35 + 25 * noise2D("a", t * 0.08, 0), y1 = 30 + 20 * noise2D("b", 0, t * 0.08);
  const x2 = 65 + 25 * noise2D("c", t * 0.06, 3), y2 = 72 + 18 * noise2D("d", 3, t * 0.06);
  const c = look.name === "obsidian" ? "220,222,226" : "255,90,38";
  return <AbsoluteFill style={{ background: `radial-gradient(40% 32% at ${x1}% ${y1}%, rgba(${c},${strength}) 0%, rgba(${c},0) 100%), radial-gradient(45% 36% at ${x2}% ${y2}%, rgba(220,222,226,${strength * 0.6}) 0%, rgba(0,0,0,0) 100%), ${look.bg}` }} />;
};

// Flow field: thousands of short strokes following 3D noise — reads as wind, data or liquid. Good under a HUD.
export const FlowField: React.FC<{ t: number; look?: Look; n?: number; speed?: number; op?: number }> = ({ t, look = LOOKS.obsidian, n = 2600, speed = 1, op = 0.5 }) =>
  useCanvas((c, W, H) => {
    c.strokeStyle = look.ink; c.lineWidth = 1.2; c.globalAlpha = op;
    for (let i = 0; i < n; i++) {
      let x = hash(i, 1) * W, y = hash(i, 2) * H; c.beginPath(); c.moveTo(x, y);
      for (let k = 0; k < 6; k++) { const a = noise3D("f", x / 420, y / 420, t * 0.12 * speed) * Math.PI * 2; x += Math.cos(a) * 7; y += Math.sin(a) * 7; c.lineTo(x, y); }
      c.stroke();
    }
  }, [t, n, look, op]);

// Warp/starfield: points rushing toward the camera. speed 1 = drift, 6+ = hyperspace streaks (use on a dive).
export const Warp: React.FC<{ t: number; look?: Look; n?: number; speed?: number; streak?: number }> = ({ t, look = LOOKS.obsidian, n = 900, speed = 1, streak = 1 }) =>
  useCanvas((c, W, H) => {
    c.fillStyle = look.bg; c.fillRect(0, 0, W, H); c.strokeStyle = look.ink; c.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const ang = hash(i, 4) * Math.PI * 2, z = (hash(i, 5) + t * 0.18 * speed) % 1, r = Math.pow(z, 2.2) * Math.hypot(W, H) * 0.7;
      const r0 = Math.max(0, r - (6 + 90 * speed * z) * streak);
      c.globalAlpha = Math.min(1, z * 1.6); c.lineWidth = 0.6 + 2.6 * z;
      c.beginPath(); c.moveTo(W / 2 + Math.cos(ang) * r0, H / 2 + Math.sin(ang) * r0); c.lineTo(W / 2 + Math.cos(ang) * r, H / 2 + Math.sin(ang) * r); c.stroke();
    }
  }, [t, n, speed, streak, look]);

// Dust: slow particles at three depths with soft focus — air in the room, behind products.
export const Dust: React.FC<{ t: number; look?: Look; n?: number }> = ({ t, look = LOOKS.obsidian, n = 160 }) =>
  useCanvas((c, W, H) => {
    c.fillStyle = look.ink;
    for (let i = 0; i < n; i++) {
      const d = hash(i, 7), x = ((hash(i, 8) * W + t * (8 + 30 * d) + noise2D("dx", i, t * 0.1) * 40) % W + W) % W;
      const y = ((hash(i, 9) * H - t * (4 + 18 * d)) % H + H) % H, r = 0.8 + 3.2 * d * d;
      c.globalAlpha = 0.15 + 0.5 * d; c.filter = d < 0.3 ? "blur(2px)" : "none";
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    c.filter = "none";
  }, [t, n, look]);

// Perspective grid floor sliding toward the camera (speed in cells/s). Fade it into black at the horizon.
export const GridFloor: React.FC<{ t: number; look?: Look; speed?: number; tilt?: number; cell?: number }> = ({ t, look = LOOKS.obsidian, speed = 1, tilt = 70, cell = 120 }) => (
  <AbsoluteFill style={{ background: look.bg, perspective: 900, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "-100%", right: "-100%", top: "45%", height: "220%", transformOrigin: "50% 0", transform: `rotateX(${tilt}deg)`,
      backgroundImage: `linear-gradient(${look.line} 1px, transparent 1px), linear-gradient(90deg, ${look.line} 1px, transparent 1px)`,
      backgroundSize: `${cell}px ${cell}px`, backgroundPosition: `0 ${(t * speed * cell) % cell}px`,
      maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%)" }} />
  </AbsoluteFill>
);

// Dot matrix that ripples outward from a point on a beat (beat = time of the hit).
export const DotRipple: React.FC<{ t: number; beat?: number; look?: Look; gap?: number }> = ({ t, beat = -9, look = LOOKS.obsidian, gap = 36 }) =>
  useCanvas((c, W, H) => {
    c.fillStyle = look.ink;
    for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) {
      const d = Math.hypot(x - W / 2, y - H / 2), wave = t >= beat ? Math.exp(-Math.pow((d - (t - beat) * 1400) / 120, 2)) : 0;
      c.globalAlpha = 0.12 + 0.75 * wave; c.beginPath(); c.arc(x, y, 1.6 + 3 * wave, 0, Math.PI * 2); c.fill();
    }
  }, [t, beat, look, gap]);
