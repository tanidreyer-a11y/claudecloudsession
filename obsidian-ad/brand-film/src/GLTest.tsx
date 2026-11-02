import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World, Balls, Pal } from "./gl";
const A: Pal = ["#050407", "#1A0F24", "#2A1240", "#7C3AED", "#F0ABFC"];
const B: Pal = ["#F7F5FA", "#E9E1F7", "#FBE3F1", "#C4B5FD", "#FFFFFF"];
export const GLTest: React.FC = () => {
  const f = useCurrentFrame(); const s = f / 60;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <World time={s} a={A} b={B} mix={0} wipe={[540, 1300, 500]} zoom={1.2} />
      <Balls time={s} balls={[
        { x: 400, y: 700, r: 160, c: ["#FFFFFF", "#F0ABFC", "#7C3AED"], core: 0 },
        { x: 640, y: 760, r: 110, c: ["#0A0A0A", "#FFFFFF", "#6B7280"], core: 0.8 },
        { x: 540, y: 1100, r: 130, c: ["#0B3D2A", "#86EFAC", "#14532D"], tr: 0.8, core: 0.6 },
      ]} k={60} />
    </AbsoluteFill>
  );
};
