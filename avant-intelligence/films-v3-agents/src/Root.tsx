import React from "react";
import { Composition } from "remotion";
import { Film, DUR, FPS } from "./Film";
export const Root: React.FC = () => <Composition id="AvantAgents" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />;
