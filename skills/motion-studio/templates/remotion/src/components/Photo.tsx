import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import type { Theme } from "../theme";
import { prog, EASE } from "../lib/motion";

/**
 * Photo with Ken Burns (1 → 1.08 + pan). If `src` is missing (imagery not delivered yet) it renders a labelled
 * placeholder in the right size and palette so the film can be built and timed before the images arrive (imagery.md).
 */
export const Photo: React.FC<{ t: Theme; src?: string; label: string; from: number; to: number; w: number; h: number; pan?: [number, number]; radius?: number }> = ({ t, src, label, from, to, w, h, pan = [-2, 1], radius = 24 }) => {
  const f = useCurrentFrame();
  const k = prog(f, from, to, EASE.inOut);
  const s = 1 + 0.08 * k;
  return (
    <div style={{ width: w, height: h, borderRadius: radius, overflow: "hidden", position: "relative", background: t.palette.muted }}>
      {src ? (
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(s), translate: `${pan[0] * k}% ${pan[1] * k}%` }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${t.palette.hero[0]}55, ${t.palette.hero[2]}55)`, color: t.palette.ink, fontFamily: t.fonts.mono, fontSize: 24, textAlign: "center", padding: 24 }}>
          IMAGE PENDING · {label}
        </div>
      )}
    </div>
  );
};
