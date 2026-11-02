// VIDEO 2 — 9:16 reel, 27.5 s. Recipe A (recipes-16x9.json): pain → turn → proof, vertical travel, line-led,
// fog wash, floating chat, broken-metric hook (callback: the same graph heals at the end). Brand agent replies on the
// RIGHT in its colour; customers on the LEFT in neutral. Script pending: re-time K to the voiceover later.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { AGENTS, theme as t } from "./theme";
import { Background, Finish } from "./components/Layers";
import { Bubble, GlowLine, Orb, LAMBDA, BLUE } from "./components/Avant";
import { GLYPHS, LOGO_H, LOGO_W } from "./logo";
import { EASE, prog } from "./lib/motion";
import { cameraAt, worldTransform, type CamKey } from "./lib/camera";
import K from "./timelineTall.json";

const P = t.palette;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp2 = (a: number[], b: number[], k: number): [number, number] => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

const MSGS = [
  { c: "Hi, any update on my quote?", r: "Your quote is attached. It's valid for 14 days.", time: "21:43" },
  { c: "Still waiting for that invoice.", r: "Invoice #2291 is in your inbox now.", time: "22:10" },
  { c: "Can someone call me back?", r: "Booked: a call today at 10:00.", time: "07:58" },
  { c: "Is the March statement ready?", r: "Ready, and waiting for your approval.", time: "08:30" },
];
const C_Y = [1400, 1830, 2260, 2690]; // customer bubble tops; reply = +190
const LINE_X = 1036;
const LINE_TOP = 1330, LINE_BOT = 3080;

// graph boxes
const G1 = { x0: 110, x1: 970, y0: 640, y1: 1060 };
const G2 = { x0: 110, x1: 970, y0: 3300, y1: 3720 };
const fallCurve = (u: number) => 0.35 + 0.42 * Math.sin(u * 2.4) * (u < 0.72 ? 1 : 1 - (u - 0.72) * 3.2) + (u > 0.72 ? -0.55 * EASE.in((u - 0.72) / 0.28) : 0);
const riseCurve = (u: number) => 0.18 + 0.08 * Math.sin(u * 9) * (1 - u) + 0.62 * EASE.inOut(u);

// logo area
const S_BIG = 9.9;
const APEX: [number, number] = [540, 3960];
const L2W = (p: [number, number]): [number, number] => [APEX[0] + (p[0] - LAMBDA.apex[0]) * S_BIG, APEX[1] + (p[1] - LAMBDA.apex[1]) * S_BIG];
const FOOT_L = L2W(LAMBDA.left), FOOT_R = L2W(LAMBDA.right);
const S_FIN = 860 / LOGO_W;
const LOGO_X = 540 - 430, LOGO_Y = 4300 - (LOGO_H * S_FIN) / 2;

const CAM: CamKey[] = [
  [0, 540, 850, 1.08, 0], [K.pain, 540, 930, 1.0, 0], [K.pain + 4.6, 540, 2100, 1.0, 0], [K.turn - 0.4, 540, 2150, 1.0, 0], [K.turn + 1.4, 560, 2080, 0.9, 0],
  [K.proof - 0.6, 540, 2160, 0.9, 0], [K.proof + 1.0, 540, 3460, 1.0, 0], [K.split + 0.2, 540, 3560, 1.0, 0],
  [K.climb, 540, 4180, 1.0, 0], [K.logo, 540, 4300, 1.0, 0], [K.end, 540, 4300, 1.04, 0],
];

const Graph: React.FC<{ g: typeof G1; curve: (u: number) => number; draw: number; tipColor: string; label: string; s: number; glow: number }> = ({ g, curve, draw, tipColor, label, s, glow }) => {
  const N = 90;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N * draw; i++) {
    const u = i / N;
    pts.push([lerp(g.x0, g.x1, u), lerp(g.y1, g.y0, Math.max(0, Math.min(1, curve(u))))]);
  }
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const tip = pts[pts.length - 1];
  const W = g.x1 - g.x0, H = g.y1 - g.y0;
  return (
    <>
      <div style={{ position: "absolute", left: g.x0, top: g.y0 - 70, fontFamily: t.fonts.text, fontSize: 26, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, opacity: prog(s, 0, 0.6) }}>{label}</div>
      <svg width={1080} height={g.y1 + 60} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[0, 0.5, 1].map((v) => <line key={v} x1={g.x0} x2={g.x1} y1={lerp(g.y1, g.y0, v)} y2={lerp(g.y1, g.y0, v)} stroke="rgba(255,255,255,.08)" strokeWidth={1.5} />)}
        {pts.length > 1 && (
          <>
            <path d={`${d} L${tip[0]},${g.y1} L${g.x0},${g.y1} Z`} fill={`url(#fill-${g.y0})`} />
            <defs>
              <linearGradient id={`fill-${g.y0}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={tipColor} stopOpacity={0.22} />
                <stop offset="1" stopColor={tipColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={d} stroke={tipColor} strokeWidth={14} fill="none" opacity={0.1} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} stroke={tipColor} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      {pts.length > 1 && <Orb x={tip[0]} y={tip[1]} r={10} color={tipColor} intensity={glow} pulse={Math.sin(s * 5)} />}
      <div style={{ position: "absolute", left: g.x0, top: g.y0, width: W, height: H }} />
    </>
  );
};

export const FilmTall: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = f / fps;
  const cam = cameraAt(CAM, s);

  const draw1 = prog(s, K.graph, K.graph + 1.9, EASE.inOut);
  const fallTint = prog(s, K.graph + 1.3, K.graph + 1.8);
  const lineK = prog(s, K.turn, K.turn + 2.6, EASE.inOut);
  const tipY = lerp(LINE_TOP, LINE_BOT, lineK);
  const toGraph = prog(s, K.proof, K.proof + 1.0, EASE.inOut);
  const draw2 = prog(s, K.proof + 0.9, K.split - 0.4, EASE.inOut);
  const sceneFade = 1 - prog(s, K.split + 0.6, K.climb, EASE.inOut);
  const warm = prog(s, K.turn, K.turn + 2.5) * (1 - 0.5 * prog(s, K.climb, K.logo));

  // agents leave the graph tip and climb the Λ
  const g2tip: [number, number] = [G2.x1, lerp(G2.y1, G2.y0, riseCurve(1))];
  const toFoot = (i: number) => prog(s, K.split + i * 0.1, K.climb, EASE.inOut);
  const climbK = (i: number) => prog(s, K.climb + (i % 2) * 0.25, K.merge - 0.2 + (i % 2) * 0.2, EASE.inOut);
  const merged = prog(s, K.merge, K.merge + 0.8);
  const shrinkK = prog(s, K.merge + 0.7, K.logo, EASE.inOut);
  const glyphK = prog(s, K.logo - 0.3, K.logo + 0.1);
  const whiteP = prog(s, K.logo - 0.5, K.logo + 1.3, EASE.out);
  const sub = prog(s, K.logo + 1.1, K.logo + 2.2, EASE.out);
  const sweep = prog(s, K.logo + 2.3, K.logo + 3.7, EASE.inOut);

  return (
    <AbsoluteFill style={{ background: P.base, overflow: "hidden" }}>
      <Background t={t} color={P.base} glow={0.12} seed={5} />
      {/* fog wash: cold and grey in the problem, blue-violet once the agents arrive */}
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 70% 55%, rgba(47,123,255,${0.2 * warm}), rgba(140,107,255,${0.09 * warm}) 50%, transparent 80%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 30% 40%, rgba(120,140,155,${0.08 * (1 - warm)}), transparent 75%)` }} />
      <AbsoluteFill style={{ transform: worldTransform(width, height, cam), transformOrigin: "0 0" }}>
        {/* hook: a metric breaking */}
        <div style={{ opacity: 1 - prog(s, K.pain + 1.5, K.pain + 3) }}>
          <Graph g={G1} curve={fallCurve} draw={draw1} tipColor={fallTint > 0.5 ? "#F2A33A" : "#9FB6C2"} label="Replies on time" s={s} glow={prog(s, K.graph + 0.2, K.graph + 0.6)} />
        </div>

        {/* the conversation */}
        {MSGS.map((m, i) => {
          const cin = prog(s, K.pain + 0.5 + i * 1.2, K.pain + 1.3 + i * 1.2, EASE.out);
          const ry = C_Y[i] + 190;
          const rin = Math.max(0, Math.min(1, (tipY - ry - 40) / 160));
          const er = EASE.out(rin);
          const o = sceneFade;
          return (
            <React.Fragment key={i}>
              {cin > 0 && <Bubble x={60} y={C_Y[i] + (1 - cin) * 40} text={m.c} time={m.time} side="left" ticks={rin > 0.5 ? 2 : 1} w={760} style={{ opacity: cin * o, filter: `blur(${(1 - cin) * 8}px)` }} />}
              {er > 0 && <Bubble x={LINE_X - 40 + (1 - er) * 30} y={ry} text={m.r} time={m.time} side="right" color={AGENTS[i].color} agent={AGENTS[i].label} ticks={0} w={800} style={{ opacity: er * o, filter: `blur(${(1 - er) * 8}px)` }} />}
            </React.Fragment>
          );
        })}

        {/* the neon line: drawn down the right edge, each stretch in the colour of the agent that answers there */}
        {[0, 1, 2, 3].map((i) => {
          const y0 = i === 0 ? LINE_TOP : C_Y[i] + 120;
          const y1 = i === 3 ? LINE_BOT : C_Y[i + 1] + 120;
          const p = Math.max(0, Math.min(1, (tipY - y0) / (y1 - y0)));
          return <GlowLine key={"ln" + i} a={[LINE_X, y0]} b={[LINE_X, y1]} p={p} color={i === 0 ? P.accent : AGENTS[i - 1].color} color2={AGENTS[i].color} w={3} opacity={sceneFade} id={"ln" + i} />;
        })}
        <Orb x={LINE_X} y={tipY} r={10} color={P.accent} intensity={prog(s, K.turn, K.turn + 0.3) * (1 - prog(s, K.proof, K.proof + 0.3))} />

        {/* the line carries on into the healed graph (object becomes object) */}
        <GlowLine a={[LINE_X, LINE_BOT]} b={[G2.x0, G2.y1 - (riseCurve(0)) * (G2.y1 - G2.y0)]} p={toGraph} color={AGENTS[3].color} color2={P.accent} w={3} opacity={1 - prog(s, K.proof + 1.2, K.proof + 2)} id="tog" />
        {draw2 > 0 && (
          <div style={{ opacity: sceneFade }}>
            <Graph g={G2} curve={riseCurve} draw={draw2} tipColor={P.accent} label="Replies on time" s={s} glow={1} />
          </div>
        )}

        {/* agents climb the Λ */}
        {[0, 1, 2, 3].map((i) => {
          const tf = toFoot(i);
          if (tf <= 0 || merged >= 1) return null;
          const foot = i % 2 === 0 ? FOOT_L : FOOT_R;
          const ck = climbK(i);
          const pos = ck > 0 ? lerp2(foot, APEX, ck) : lerp2(g2tip, foot, tf);
          return (
            <React.Fragment key={"ag" + i}>
              {ck > 0 && shrinkK <= 0 && <GlowLine a={foot} b={pos} p={1} color={AGENTS[i].color} color2={merged > 0 ? P.accent : AGENTS[i].color} w={3 + 7 * merged} opacity={0.9} id={"cl" + i} />}
              <Orb x={pos[0]} y={pos[1]} r={13} color={AGENTS[i].color} intensity={1 - merged} pulse={Math.sin(s * 2 + i)} />
            </React.Fragment>
          );
        })}
        {merged > 0 && shrinkK <= 0 && (
          <>
            <GlowLine a={FOOT_L} b={APEX} p={1} color={P.accent} w={3 + 7 * merged} id="mL" />
            <GlowLine a={FOOT_R} b={APEX} p={1} color={P.accent} w={3 + 7 * merged} id="mR" />
          </>
        )}
        <Orb x={APEX[0]} y={APEX[1]} r={22} color={P.accent} intensity={prog(s, K.merge - 0.15, K.merge + 0.15) * (1 - prog(s, K.merge + 0.3, K.merge + 1.4))} pulse={1} />
        {shrinkK > 0 && (() => {
          const toW = (p: [number, number]): [number, number] => [LOGO_X + p[0] * S_FIN, LOGO_Y + p[1] * S_FIN];
          const ap = lerp2(APEX, toW(LAMBDA.apex), shrinkK), fl = lerp2(FOOT_L, toW(LAMBDA.left), shrinkK), fr = lerp2(FOOT_R, toW(LAMBDA.right), shrinkK);
          const w = lerp(10, 24, shrinkK);
          return (
            <>
              <GlowLine a={fl} b={ap} p={1} color={P.accent} w={w} opacity={1 - glyphK} id="sL" />
              <GlowLine a={fr} b={ap} p={1} color={P.accent} w={w} opacity={1 - glyphK} id="sR" />
            </>
          );
        })()}

        {/* wordmark */}
        {glyphK > 0 && (
          <svg width={1080} height={5000} viewBox="0 0 1080 5000" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs>
              <filter id="bglowT" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={6} result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <clipPath id="clipT">{GLYPHS.map((g, i) => <path key={i} d={g.d} />)}</clipPath>
              <linearGradient id="sweepT" x1="0" y1="0" x2="1" y2="0.3">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${S_FIN})`}>
              <path d={BLUE.d} fill={P.accent} opacity={glyphK} filter="url(#bglowT)" />
              {GLYPHS.filter((g) => g.cls === "white").map((g, i) => {
                const p = Math.min(1, Math.max(0, (whiteP - i * 0.14) / 0.58));
                const e = EASE.out(p);
                return <path key={i} d={g.d} fill="#FFFFFF" opacity={e} transform={`translate(0 ${(1 - e) * 9})`} />;
              })}
              {sweep > 0 && sweep < 1 && (
                <g clipPath="url(#clipT)">
                  <rect x={-120 + sweep * (LOGO_W + 160)} y={-10} width={110} height={LOGO_H + 20} fill="url(#sweepT)" opacity={0.75} />
                </g>
              )}
            </g>
          </svg>
        )}
        {sub > 0 && (
          <div style={{ position: "absolute", left: 540, top: LOGO_Y + LOGO_H * S_FIN + 54, translate: `-50% ${(1 - sub) * 12}px`, opacity: sub, fontFamily: t.fonts.text, fontSize: 30, fontWeight: 400, letterSpacing: "0.6em", paddingLeft: "0.6em", color: "#CFE3EA", whiteSpace: "nowrap" }}>
            INTELLIGENCE
          </div>
        )}
      </AbsoluteFill>
      <Finish t={t} />
    </AbsoluteFill>
  );
};
