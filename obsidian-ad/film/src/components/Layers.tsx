import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Theme } from "../theme";
import { hash } from "../lib/motion";

/** Layer 1: background — never a flat solid. Soft light pools in the palette + optional hero gradient mix. */
export const Background: React.FC<{ t: Theme; color?: string; heroMix?: number; seed?: number; glow?: number }> = ({ t, color, heroMix = 0, seed = 1, glow = 0.55 }) => {
  const f = useCurrentFrame();
  const c = color ?? t.palette.base;
  const dx = Math.sin(f / 90 + seed) * 4, dy = Math.cos(f / 110 + seed) * 4;
  const [h1, h2, h3] = t.palette.hero;
  return (
    <AbsoluteFill style={{ background: c }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 50% at ${30 + dx}% ${25 + dy}%, ${t.palette.glow}, transparent 70%)`, opacity: glow }} />
      {heroMix > 0 && (
        <AbsoluteFill
          style={{
            opacity: heroMix,
            background: `radial-gradient(80% 60% at ${20 + dx * 2}% 15%, ${h1}, transparent 70%), radial-gradient(70% 60% at ${85 - dy * 2}% 55%, ${h2}, transparent 70%), radial-gradient(90% 70% at 40% ${100 + dx}%, ${h3}, transparent 75%), ${h2}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/** Layer 4: grade — gentle contrast/warmth pass via a soft-light overlay. */
export const Grade: React.FC<{ tint?: string; amount?: number }> = ({ tint = "#000", amount = 0.06 }) => (
  <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light", opacity: amount, pointerEvents: "none" }} />
);

/** Layer 5: grain (seeded per frame, deterministic) + vignette. Grain hides banding in gradients. */
export const Finish: React.FC<{ t: Theme }> = ({ t }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(hash(f) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: t.finish.grain, mixBlendMode: "overlay" }}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,${t.finish.vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};
