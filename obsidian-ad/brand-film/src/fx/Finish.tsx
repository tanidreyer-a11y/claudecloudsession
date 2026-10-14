// Film finish in Remotion (cheap, per-frame): grain, vignette, chromatic aberration, slice glitch, bloom, push-in,
// shake on hits. Heavy whole-film looks (halation, lagfun trails, a second grain pass) live in post_fx.sh instead.
// Motion blur and echo trails: use @remotion/motion-blur <CameraMotionBlur> / <Trail> around fast moves only.
//   <Finish t={t} look={look} hits={[2.1, 5.58]} glitches={[[9.0, 0.25]]} ca={1.5} push={[0, 4, 1.04]}>{scene}</Finish>
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { Look, LOOKS, cl, hash } from "./core";

// Animated film grain: one 512 px noise tile (made once), drawn as a pattern at a new random offset every frame,
// overlaid with soft-light. amount 0.05–0.12. (SVG feTurbulence was dropped: it shows raster-tile seams.)
let TILE: HTMLCanvasElement | null = null;
const noiseTile = () => {
  if (TILE) return TILE; const c = document.createElement("canvas"); c.width = c.height = 512;
  const x = c.getContext("2d")!, im = x.createImageData(512, 512);
  for (let i = 0; i < im.data.length; i += 4) { const v = (hash(i, 0.37) * 255) | 0; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return (TILE = c);
};
export const Grain: React.FC<{ amount?: number }> = ({ amount = 0.08 }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig(); const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d"); if (!c) return;
    const pat = c.createPattern(noiseTile(), "repeat")!; c.save(); c.translate(-hash(f, 1) * 512, -hash(f, 2) * 512);
    c.fillStyle = pat; c.fillRect(0, 0, W + 512, H + 512); c.restore();
  }, [f, W, H]);
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: amount * 3.2, pointerEvents: "none" }} />;
};

export const Vignette: React.FC<{ amount?: number; color?: string }> = ({ amount = 0.55, color = "0,0,0" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(${color},0) 55%, rgba(${color},${amount}) 100%)`, pointerEvents: "none" }} />
);

// Chromatic aberration: split R/G/B and offset R and B sideways (px). Use 0.8–2 px always-on, 6–14 px on a hit.
export const Chroma: React.FC<{ px: number; children: React.ReactNode; id?: string }> = ({ px, children, id = "ca" }) => {
  if (px < 0.3) return <>{children}</>;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r0" />
          <feOffset in="r0" dx={px} result="r" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b0" />
          <feOffset in="b0" dx={-px} result="b" />
          <feBlend in="r" in2="g" mode="screen" result="rg" /><feBlend in="rg" in2="b" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Slice glitch: the frame tears into horizontal strips that slide sideways for a few frames (renders children N×,
// so keep windows short: 0.15–0.35 s, on a cut or a keyword hit).
export const Slices: React.FC<{ on: number; children: React.ReactNode; n?: number; seed?: number; maxShift?: number }> = ({ on, children, n = 9, seed = 1, maxShift = 90 }) => {
  const f = useCurrentFrame();
  if (on <= 0.01) return <>{children}</>;
  const step = Math.floor(f / 2); // re-roll the tear every 2 frames
  return (
    <AbsoluteFill>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 100, b = ((i + 1) / n) * 100, jit = hash(i + step * 13, seed) - 0.5;
        const dx = (hash(i * 7 + step, seed + 3) > 0.45 ? jit : 0) * maxShift * 2 * on;
        return <AbsoluteFill key={i} style={{ clipPath: `inset(${a}% 0 ${100 - b}% 0)`, transform: `translateX(${dx}px)` }}>{children}</AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};

// Bloom: a blurred, brightened copy of the scene screened on top (renders children twice).
export const Bloom: React.FC<{ amount?: number; radius?: number; children: React.ReactNode }> = ({ amount = 0.45, radius = 28, children }) => (
  <AbsoluteFill>
    {children}
    {amount > 0.01 && <AbsoluteFill style={{ filter: `blur(${radius}px) brightness(1.6) contrast(1.6)`, mixBlendMode: "screen", opacity: amount }}>{children}</AbsoluteFill>}
  </AbsoluteFill>
);

// The full finish stack. hits = times of big words/impacts (shake + CA spike + brief scale punch);
// glitches = [time, duration] windows; push = [from, to, scale] slow push-in.
export const Finish: React.FC<{
  t: number; children: React.ReactNode; look?: Look; hits?: number[]; glitches?: [number, number][]; ca?: number;
  grain?: number; vignette?: number; bloom?: number; push?: [number, number, number]; shake?: number;
}> = ({ t, children, look = LOOKS.obsidian, hits = [], glitches = [], ca = 0.8, grain = 0.07, vignette = 0.5, bloom = 0, push, shake = 14 }) => {
  const { fps } = useVideoConfig();
  const hit = hits.reduce((m, h) => Math.max(m, t >= h ? Math.exp(-(t - h) * 9) : 0), 0);
  const g = glitches.reduce((m, [a, d]) => Math.max(m, t >= a && t <= a + d ? 1 - Math.abs((t - a) / d - 0.5) * 1.2 : 0), 0);
  const pk = push ? cl((t - push[0]) / (push[1] - push[0])) : 0;
  const sc = (push ? 1 + (push[2] - 1) * pk : 1) * (1 + 0.025 * hit);
  const sx = noise2D("sx", t * fps * 0.35, 0) * shake * hit, sy = noise2D("sy", 0, t * fps * 0.35) * shake * hit;
  return (
    <AbsoluteFill style={{ background: look.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${sc})` }}>
        <Chroma px={ca + 10 * hit + 8 * g}>
          <Slices on={cl(g)}>
            {bloom > 0 ? <Bloom amount={bloom}>{children}</Bloom> : children}
          </Slices>
        </Chroma>
      </AbsoluteFill>
      {vignette > 0 && <Vignette amount={vignette} />}
      {grain > 0 && <Grain amount={grain} />}
    </AbsoluteFill>
  );
};
