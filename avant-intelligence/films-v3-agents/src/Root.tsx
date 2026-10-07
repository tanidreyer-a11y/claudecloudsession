import React from "react";
import { Composition } from "remotion";
import { Film, DUR, FPS } from "./Film";
import { Ahead, DUR as DUR2 } from "./Ahead";
export const Root: React.FC = () => (
  <>
    <Composition id="AvantAgents" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="AvantAhead916" component={Ahead} durationInFrames={Math.round(DUR2 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="AvantAhead169" component={Ahead} durationInFrames={Math.round(DUR2 * FPS)} fps={FPS} width={1920} height={1080} />
  </>
);
