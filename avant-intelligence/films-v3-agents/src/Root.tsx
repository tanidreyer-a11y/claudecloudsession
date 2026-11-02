import React from "react";
import { Composition } from "remotion";
import { Film, DUR, FPS } from "./Film";
import { Ahead, DUR as DUR2 } from "./Ahead";
import { OneLine, EveryCity, DUR_LINE, DUR_CITY } from "./Variants";
export const Root: React.FC = () => (
  <>
    <Composition id="AvantAgents" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="AvantAhead916" component={Ahead} durationInFrames={Math.round(DUR2 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="AvantAhead169" component={Ahead} durationInFrames={Math.round(DUR2 * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="AvantOneLine" component={OneLine} durationInFrames={Math.round(DUR_LINE * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="AvantEveryCity" component={EveryCity} durationInFrames={Math.round(DUR_CITY * FPS)} fps={FPS} width={1920} height={1080} />
  </>
);
