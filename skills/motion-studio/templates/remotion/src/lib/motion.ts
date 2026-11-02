import { Easing, interpolate, spring } from "remotion";
import type { Theme } from "../theme";

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  sweep: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 over [a,b] with an easing curve, clamped. Never linear. */
export const prog = (f: number, a: number, b: number, ease = EASE.out) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

/** Spring progress starting at frame `start` using the theme's spring. */
export const springAt = (f: number, start: number, fps: number, t: Theme, cfg?: Partial<Theme["motion"]["spring"]>) =>
  spring({ frame: f - start, fps, config: { ...t.motion.spring, ...cfg } });

/**
 * Entrance + exit style: 2–3 properties together (opacity + translate + blur/scale), exit faster than entrance.
 * Returns CSS for an element that enters at `inAt` and (optionally) exits at `outAt`.
 */
export function enter(f: number, t: Theme, inAt: number, outAt?: number, opts: { dy?: number; dx?: number; blur?: number; scale?: number } = {}) {
  const { dy = 28, dx = 0, blur = 8, scale = 0.96 } = opts;
  const i = prog(f, inAt, inAt + t.motion.enterFrames);
  const o = outAt === undefined ? 0 : prog(f, outAt, outAt + t.motion.exitFrames, EASE.in);
  const v = i * (1 - o);
  return {
    opacity: v,
    translate: `${dx * (1 - i) - dx * o}px ${dy * (1 - i) - dy * 0.6 * o}px`,
    scale: String(scale + (1 - scale) * v),
    filter: `blur(${blur * (1 - v)}px)`,
  } as const;
}

/** Idle micro-motion for anything on screen > 2 s. */
export const breathe = (f: number, t: Theme, seed = 0) => Math.sin((f + seed * 37) / 38) * t.motion.breathePx;

/** Deterministic hash → [0,1). Never Math.random in render. */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Visible-window helper: true while from ≤ f < to (use with overlap so frames are never empty). */
export const inWindow = (f: number, from: number, to: number) => f >= from && f < to;
