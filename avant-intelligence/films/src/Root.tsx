import React from "react";
import { Composition } from "remotion";
import { FilmWide } from "./FilmWide";
import { FilmTall } from "./FilmTall";
import { theme } from "./theme";
import W from "./timelineWide.json";
import T from "./timelineTall.json";

export const Root: React.FC = () => (
  <>
    <Composition id="Wide" component={FilmWide} durationInFrames={Math.round(W.end * theme.fps)} fps={theme.fps} width={1920} height={1080} />
    <Composition id="Tall" component={FilmTall} durationInFrames={Math.round(T.end * theme.fps)} fps={theme.fps} width={1080} height={1920} />
  </>
);
