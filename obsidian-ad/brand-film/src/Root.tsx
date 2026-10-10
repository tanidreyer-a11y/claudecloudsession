import React from "react";
import { Composition } from "remotion";
import { Film, DUR, FPS } from "./Film";
export const Root: React.FC = () => (
  <>
    {(["A", "B", "C"] as const).map((v) => (
      <Composition key={v} id={`OBS-${v}`} component={Film} defaultProps={{ variant: v }} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
