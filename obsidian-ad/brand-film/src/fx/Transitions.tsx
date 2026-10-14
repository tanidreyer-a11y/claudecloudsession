// Our own TransitionSeries presentations (plain DOM/SVG, render in the installed headless Chrome):
//   liquid  — a gooey metaball flood swallows the old scene and dissolves into the new one (the OBS-KOVA goo)
//   slices  — the cut tears into horizontal strips with an RGB split (on a beat)
//   whip    — a fast pan with directional motion blur (the "camera whip")
//   through — zoom THROUGH the old scene into the new one (camera flies forward)
// Physical feel: time them with springTiming({ config: { damping: 14, mass: 0.6 } }) so they overshoot and settle.
// Remotion's built-ins that also work here: fade, slide, wipe, flip, clockWipe, iris, pushCut (all DOM).
// Its shader set (crosswarp, ripple, filmBurn, dreamyZoom, zoomBlur, crossZoom, dissolve, linearBlur, blurSlide,
// swap, bookFlip, zoomInOut) uses html-in-canvas: test one frame first, the headless shell here may not support it.
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { cl, hash } from "./core";

type LiquidP = { color?: string; x?: number; y?: number };
// Metaballs on a quarter-res canvas (field = Σ r²/d², edge at 1), upscaled with smoothing. Replaces the SVG
// blur+alpha-threshold goo, which Chrome rasterises in tiles and which leaves faint horizontal seams on flat colour.
const Liquid: React.FC<TransitionPresentationComponentProps<LiquidP>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const { width: W, height: H } = useVideoConfig(); const ref = useRef<HTMLCanvasElement>(null);
  const { color = "#DCDEE2", x = 0.5, y = 0.55 } = passedProps, cx = W * x, cy = H * y;
  const flood = cl(p / 0.55), fade = cl((p - 0.55) / 0.45), R = Math.hypot(W, H), Q = 4;
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d"); if (!c) return;
    const w = Math.ceil(W / Q), h = Math.ceil(H / Q), r0 = 20 + flood * flood * R;
    const balls: [number, number, number][] = [[cx, cy, r0]];
    for (let i = 0; i < 8; i++) {
      const a = hash(i, 3) * Math.PI * 2, d = (160 + 300 * hash(i, 5)) * (1 - flood * 0.5), st = 0.07 * i, k = cl((flood - st) / (1 - st));
      balls.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d, 30 + k * (260 + 520 * hash(i, 9))]);
    }
    for (let i = 0; i < 14; i++) { // lumps riding the edge, each at its own pace
      const a = (i / 14) * Math.PI * 2 + hash(i, 11), lag = 0.82 + 0.3 * hash(i, 12);
      balls.push([cx + Math.cos(a) * r0 * lag, cy + Math.sin(a) * r0 * lag, r0 * (0.18 + 0.22 * hash(i, 13)) + 20]);
    }
    // field (0..2 → 0..255) at quarter res, bilinear upscale, then a crisp anti-aliased threshold at full res
    const im = new ImageData(w, h), bs = balls.map(([bx, by, br]) => [bx / Q, by / Q, (br / Q) ** 2]);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      let f = 0; for (const [bx, by, r2] of bs) { const dx = i - bx, dy = j - by; f += r2 / (dx * dx + dy * dy + 1e-3); if (f > 2) break; }
      im.data[(j * w + i) * 4 + 3] = Math.min(255, f * 127.5);
    }
    const tmp = document.createElement("canvas"); tmp.width = w; tmp.height = h; tmp.getContext("2d")!.putImageData(im, 0, 0);
    c.clearRect(0, 0, W, H); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high"; c.drawImage(tmp, 0, 0, W, H);
    const full = c.getImageData(0, 0, W, H), d = full.data, [cr, cg, cb] = [1, 3, 5].map((o) => parseInt(color.slice(o, o + 2), 16));
    for (let k = 0; k < d.length; k += 4) { const v = d[k + 3]; d[k] = cr; d[k + 1] = cg; d[k + 2] = cb; d[k + 3] = v < 121 ? 0 : v > 134 ? 255 : (v - 121) * 18.2; }
    c.putImageData(full, 0, 0);
  }, [p, W, H, color, cx, cy]);
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: p >= 0.55 ? 1 : 0 }}>{children}</AbsoluteFill>
      <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 1 - fade }} />
    </AbsoluteFill>
  );
};
export const liquid = (props: LiquidP = {}): TransitionPresentation<LiquidP> => ({ component: Liquid, props });

type SlicesP = { n?: number; shift?: number; seed?: number };
const SlicesT: React.FC<TransitionPresentationComponentProps<SlicesP>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const { n = 10, shift = 160, seed = 2 } = passedProps, entering = presentationDirection === "entering";
  const amt = entering ? 1 - p : p; // tear grows on the way out, heals on the way in
  if (entering && p < 0.5) return null;
  if (!entering && p >= 0.5) return null;
  return (
    <AbsoluteFill>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 100, b = ((i + 1) / n) * 100, dir = hash(i, seed) - 0.5;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${a}% 0 ${100 - b}% 0)`, transform: `translateX(${dir * shift * 2 * amt}px)`,
            filter: amt > 0.15 ? `drop-shadow(${6 * amt}px 0 0 rgba(255,60,40,.55)) drop-shadow(${-6 * amt}px 0 0 rgba(40,120,255,.55))` : undefined }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
export const slices = (props: SlicesP = {}): TransitionPresentation<SlicesP> => ({ component: SlicesT, props });

type WhipP = { dir?: "left" | "right" | "up" | "down"; blur?: number };
const Whip: React.FC<TransitionPresentationComponentProps<WhipP>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const { width: W, height: H } = useVideoConfig();
  const { dir = "left", blur = 60 } = passedProps, horiz = dir === "left" || dir === "right", sgn = dir === "left" || dir === "up" ? -1 : 1;
  const span = horiz ? W : H, off = presentationDirection === "entering" ? (1 - p) * span * -sgn : p * span * sgn;
  const v = Math.sin(Math.PI * p) * blur, id = `whip${dir}${presentationDirection}`;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={horiz ? `${v} 0` : `0 ${v}`} /></filter></svg>
      <AbsoluteFill style={{ transform: horiz ? `translateX(${off}px)` : `translateY(${off}px)`, filter: v > 0.5 ? `url(#${id})` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
export const whip = (props: WhipP = {}): TransitionPresentation<WhipP> => ({ component: Whip, props });

type ThroughP = { depth?: number };
const Through: React.FC<TransitionPresentationComponentProps<ThroughP>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const { depth = 3.2 } = passedProps;
  if (presentationDirection === "exiting")
    return <AbsoluteFill style={{ transform: `scale(${1 + (depth - 1) * p * p})`, opacity: 1 - cl((p - 0.35) / 0.4), filter: `blur(${p * 14}px)` }}>{children}</AbsoluteFill>;
  const k = cl((p - 0.3) / 0.7);
  return <AbsoluteFill style={{ transform: `scale(${0.55 + 0.45 * (1 - Math.pow(1 - k, 3))})`, opacity: k, filter: `blur(${(1 - k) * 12}px)` }}>{children}</AbsoluteFill>;
};
export const through = (props: ThroughP = {}): TransitionPresentation<ThroughP> => ({ component: Through, props });
