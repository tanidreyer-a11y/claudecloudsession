import React from "react";
import { Composition } from "remotion";
import { Film, DUR, FPS } from "./Film";
import { Film2, DUR2, FPS2 } from "./Film2";
import { Film3, DUR3, FPS3 } from "./Film3";
import { GLTest } from "./GLTest";
import { Film4, DUR4, FPS4 } from "./Film4";
import { Film5, DUR5, FPS5 } from "./Film5";
import { Film6, DUR6, FPS6 } from "./Film6";
import { Film7, DUR7, FPS7 } from "./Film7";
import { Film8, DUR8, FPS8 } from "./Film8";
export const Root: React.FC = () => (
  <>
    {(["A", "B", "C"] as const).map((v) => (
      <Composition key={v} id={`OBS-${v}`} component={Film} defaultProps={{ variant: v }} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
    ))}
    <Composition id="OBS-V2" component={Film2} durationInFrames={Math.round(DUR2 * FPS2)} fps={FPS2} width={1080} height={1920} />
    <Composition id="OBS-60" component={Film3} durationInFrames={Math.round(DUR3 * FPS3)} fps={FPS3} width={1080} height={1920} />
    <Composition id="OBS-30" component={Film4} durationInFrames={Math.round(DUR4 * FPS4)} fps={FPS4} width={1080} height={1920} />
    <Composition id="OBS-48" component={Film5} durationInFrames={Math.round(DUR5 * FPS5)} fps={FPS5} width={1920} height={1080} />
    <Composition id="OBS-40" component={Film6} durationInFrames={Math.round(DUR6 * FPS6)} fps={FPS6} width={1920} height={1080} />
    <Composition id="OBS-LOVIO" component={Film7} durationInFrames={Math.round(DUR7 * FPS7)} fps={FPS7} width={1920} height={1080} />
    <Composition id="OBS-SCRATCH" component={Film8} durationInFrames={Math.round(DUR8 * FPS8)} fps={FPS8} width={1920} height={1080} />
    <Composition id="GLTEST" component={GLTest} durationInFrames={120} fps={60} width={1080} height={1920} />
  </>
);
