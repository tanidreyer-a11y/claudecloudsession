// FX-DEMO (9:16, 30 fps): proves the fx kit end to end on a test voice-over timing — four scenes on four backgrounds,
// cut on the voice with liquid / slices / whip / through transitions, the Level-5 HUD and keyword captions on top,
// finished with grain, vignette, chromatic aberration, hit shakes and a glitch on the drop. Look: props.look.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import "./fonts";
import {
  LOOKS, Look, Timing, lineOf, wordOf, prog, MV, Hud, Captions, Finish, LightPools, FlowField, Warp, DotRipple,
  liquid, slices, whip, through,
} from "./fx";
import timingJson from "./fx/demo_timing.json";

const T = timingJson as Timing;
export const FPSX = 30, DURX = T.duration + 0.6;

const Big: React.FC<{ t: number; at: number; text: string; look: Look; size?: number; y?: number }> = ({ t, at, text, look, size = 150, y = 0.36 }) => {
  const { width: W, height: H } = useVideoConfig();
  const k = prog(t, at, at + 0.45, MV);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: H * y, textAlign: "center", fontFamily: look.display, fontWeight: 900,
      fontSize: size, color: look.ink, letterSpacing: "-0.02em", fontStretch: "112%", opacity: k, filter: `blur(${(1 - k) * 14}px)`,
      transform: `translateY(${(1 - k) * 60}px) scale(${0.92 + 0.08 * k})` }}>{text}</div>
  );
};

type SceneP = { from: number; look: Look };
const useT = (from: number) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return from + f / fps; };
const S1: React.FC<SceneP> = ({ from, look }) => { const t = useT(from); return <AbsoluteFill><LightPools t={t} look={look} /><Big t={t} at={0.2} text="NO MANUAL" look={look} /></AbsoluteFill>; };
const S2: React.FC<SceneP> = ({ from, look }) => { const t = useT(from); return <AbsoluteFill style={{ background: look.bg }}><FlowField t={t} look={look} op={0.35} /><Big t={t} at={wordOf(T, "Tally")} text="TALLY" look={look} size={190} /></AbsoluteFill>; };
const S3: React.FC<SceneP> = ({ from, look }) => { const t = useT(from); return <AbsoluteFill><Warp t={t} look={look} speed={1 + 5 * prog(t, 11.6, 13.1)} /><Big t={t} at={10.5} text="THE TWIST" look={look} size={130} /></AbsoluteFill>; };
const S4: React.FC<SceneP> = ({ from, look }) => { const t = useT(from); return <AbsoluteFill style={{ background: look.bg }}><DotRipple t={t} beat={wordOf(T, "Claude")} look={look} /><Big t={t} at={wordOf(T, "Claude")} text="CLAUDE" look={look} size={150} /></AbsoluteFill>; };

export const FxDemo: React.FC<{ look?: keyof typeof LOOKS; ca?: number }> = ({ look: lk = "signal", ca = 1 }) => {
  const look = LOOKS[lk];
  const f = useCurrentFrame(); const t = f / FPSX;
  // cuts by content anchors (0.18 s before the line), transitions centred on the cut
  const cuts = [0, lineOf(T, "Meet Tally"), lineOf(T, "But here is"), lineOf(T, "This whole video")];
  const TR = 14, half = TR / 2 / FPSX;
  const starts = cuts.map((c, i) => (i ? c - half : 0));
  const durs = starts.map((s, i) => Math.round(((i < starts.length - 1 ? starts[i + 1] : DURX) - s) * FPSX) + (i < starts.length - 1 ? TR : 0));
  const scenes = [S1, S2, S3, S4];
  const trans = [liquid({ color: look.name === "obsidian" ? "#2A2B30" : look.accent }), slices(), whip({ dir: "left" }), through()];
  const hits = T.lines.flatMap((l) => l.words.filter((w) => w.big).map((w) => w.start));
  const drop = T.lines.find((l) => l.drop)!.start;
  return (
    <Finish t={t} look={look} hits={hits} glitches={[[drop - 0.08, 0.3]]} ca={ca} grain={0.08} vignette={0.55} push={[0, DURX, 1.035]}>
      <TransitionSeries>
        {scenes.map((Sc, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durs[i]}><Sc from={starts[i]} look={look} /></TransitionSeries.Sequence>
            {i < scenes.length - 1 && <TransitionSeries.Transition presentation={trans[i] as never}
              timing={i === 2 ? springTiming({ config: { damping: 16, mass: 0.6 }, durationInFrames: TR }) : linearTiming({ durationInFrames: TR })} />}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Captions T={T} t={t} look={look} />
      <Hud T={T} t={t} look={look} title="OBSIDIAN / FX KIT" handle="@obsidian.studio" chapters={[[0, "01 HOOK"], [3.9, "02 PRODUCT"], [10.4, "03 TURN"], [13.1, "04 DROP"]]} />
    </Finish>
  );
};
