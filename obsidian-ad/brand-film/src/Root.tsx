import React from "react";
import { Composition } from "remotion";
import { Film, DUR, FPS } from "./Film";
import { Film2, DUR2, FPS2 } from "./Film2";
import { Film3, DUR3, FPS3 } from "./Film3";
export const Root: React.FC = () => (
  <>
    {(["A", "B", "C"] as const).map((v) => (
      <Composition key={v} id={`OBS-${v}`} component={Film} defaultProps={{ variant: v }} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
    ))}
    <Composition id="OBS-V2" component={Film2} durationInFrames={Math.round(DUR2 * FPS2)} fps={FPS2} width={1080} height={1920} />
    <Composition id="OBS-60" component={Film3} durationInFrames={Math.round(DUR3 * FPS3)} fps={FPS3} width={1080} height={1920} />
  </>
);
