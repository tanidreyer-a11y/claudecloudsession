// NEUTRAL demo composition showing how the pieces fit: five-layer stack, spline camera, word reveal, panel, pill.
// Replace the scenes per project; keep the layer order and the rules in production.md.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { theme as t } from "./theme";
import { T, sec } from "./timeline";
import { Background, Finish, Grade } from "./components/Layers";
import { WordReveal } from "./components/Type";
import { Icon, Panel, Pill } from "./components/UI";
import { breathe, enter, inWindow } from "./lib/motion";
import { cameraAt, worldTransform, type CamKey } from "./lib/camera";

const CAM: CamKey[] = [
  [0, 960, 540, 1.0, 0],
  [3, 960, 560, 1.08, 0],
  [6, 980, 540, 1.18, -1.5],
  [8, 960, 540, 1.0, 0],
];

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = (x: number) => sec(x, fps);
  const cam = cameraAt(CAM, f / fps);
  return (
    <AbsoluteFill style={{ fontFamily: t.fonts.text }}>
      <Background t={t} />
      <AbsoluteFill style={{ transform: worldTransform(width, height, cam), transformOrigin: "0 0" }}>
        {inWindow(f, s(T.intro), s(T.card) + 12) && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", translate: `0 ${breathe(f, t)}px` }}>
            <WordReveal t={t} text="Start from the recipe" at={s(T.title)} out={s(T.card) - 4} size={t.type.title} />
          </AbsoluteFill>
        )}
        {inWindow(f, s(T.card) - 6, s(T.end)) && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={enter(f, t, s(T.card), s(T.outro))}>
              <Panel t={t} variant="hairline" style={{ width: 1000, padding: 48 }}>
                <div style={{ fontSize: t.type.h2, fontWeight: 700, color: t.palette.ink }}>Theme-driven parts</div>
                <div style={{ fontSize: t.type.body, color: t.palette.muted, marginTop: 12 }}>Colours, fonts and motion come from theme.ts</div>
              </Panel>
            </div>
            <div style={{ ...enter(f, t, s(T.outro)), marginTop: 40 }}>
              <Pill t={t} bg={t.palette.ink} color={t.palette.altInk}>Your call to action <Icon name="arrow" size={28} color={t.palette.altInk} /></Pill>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <Grade />
      <Finish t={t} />
    </AbsoluteFill>
  );
};
