import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { theme } from "./theme";
import T from "./timeline.json";
export const Root: React.FC = () => <Composition id="Obsidian" component={Film} durationInFrames={Math.round(T.end * theme.fps)} fps={theme.fps} width={1920} height={1080} />;
