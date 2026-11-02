import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { SIZES, theme } from "./theme";

export const Root: React.FC = () => {
  const { width, height } = SIZES[theme.format];
  return <Composition id="Film" component={Film} durationInFrames={Math.round(theme.durationSec * theme.fps)} fps={theme.fps} width={width} height={height} />;
};
