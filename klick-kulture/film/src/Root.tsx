import React from "react";
import { Composition } from "remotion";
import { KK, DUR, FPS } from "./KK";
export const Root: React.FC = () => (
  <>
    <Composition id="KK916" component={KK} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
