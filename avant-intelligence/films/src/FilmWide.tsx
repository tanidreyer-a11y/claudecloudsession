// VIDEO 1 — 16:9 brand film, 40 s. Recipe: Midnight Signal base × Deep Glass donor (recipes-16x9.json, B) with
// recipe A's colour (midnight). Logo anatomy: four agents, each a shade of blue/violet/mint, climb into the blue Λ
// of the wordmark. One continuous take with one hidden cut (zoom-through into the Finance agent).
// Script pending: beats sit on estimated times in K and will be re-timed to the voiceover.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { AGENTS, theme as t } from "./theme";
import { Background, Finish } from "./components/Layers";
import { Chip, GlowLine, Orb, makeDots, LAMBDA, BLUE } from "./components/Avant";
import { GLYPHS, LOGO_H, LOGO_W } from "./logo";
import { EASE, prog, breathe, hash } from "./lib/motion";
import { cameraAt, worldTransform, type CamKey } from "./lib/camera";
import K from "./timelineWide.json";

const P = t.palette;
const SPARK: [number, number] = [960, 540];
const ORBS: [number, number][] = [[470, 300], [1450, 300], [470, 790], [1450, 790]]; // docs, finance, follow, approve
const CHIPS = [
  { text: "Supplier contract", sub: "Unsigned", agent: 0, from: [770, 448], to: [470, 425] },
  { text: "Invoice #2291", sub: "Overdue · 12 days", agent: 1, from: [1160, 470], to: [1450, 425] },
  { text: "Client follow-up", sub: "Missed yesterday", agent: 2, from: [760, 640], to: [470, 925] },
  { text: "Expense claim", sub: "Waiting for approval", agent: 3, from: [1170, 655], to: [1450, 925] },
];
const DOTS = makeDots(190, 960, 540, 1560, 760, 27, 1400, 620);

// Big Λ in world space, derived from the traced glyph so the strokes land exactly on the logo shape.
const S_BIG = 13.65;
const APEX: [number, number] = [960, 190];
const L2W = (p: [number, number]): [number, number] => [APEX[0] + (p[0] - LAMBDA.apex[0]) * S_BIG, APEX[1] + (p[1] - LAMBDA.apex[1]) * S_BIG];
const FOOT_L = L2W(LAMBDA.left), FOOT_R = L2W(LAMBDA.right);
// Final wordmark placement (world): width 900, centred at (960,520)
const S_FIN = 900 / LOGO_W;
const LOGO_X = 960 - 450, LOGO_Y = 520 - (LOGO_H * S_FIN) / 2;

const CAM_A1: CamKey[] = [
  [0, 960, 500, 1.15, 0], [3.4, 960, 540, 1.32, 0], [9.2, 990, 548, 1.42, 0.5], [11.2, 960, 545, 1.02, 0], [14.6, 975, 560, 0.9, 0],
  [15.6, 1120, 450, 1.25, 0], [16.4, 1380, 335, 3.0, 0], [K.dive, 1450, 300, 15, 0],
];
const CAM_A2: CamKey[] = [
  [K.emerge, 1450, 300, 15, 0], [K.emerge + 0.8, 1400, 330, 2.4, 0], [K.emerge + 1.9, 960, 560, 0.9, 0],
  [K.merge, 960, 500, 0.97, 0], [K.logo, 960, 520, 1.0, 0], [K.end, 960, 520, 1.05, 0],
];
const CAM_B: CamKey[] = [[K.dive, 960, 540, 1.4, 0], [K.dive + 2.4, 960, 555, 1.08, 0], [K.ball, 960, 560, 1.0, 0], [K.emerge, 960, 560, 5.5, 0]];

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp2 = (a: number[], b: number[], k: number): [number, number] => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

export const FilmWide: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = f / fps;
  const inB = s >= K.dive && s < K.emerge;
  const cam = cameraAt(inB ? CAM_B : s < K.dive ? CAM_A1 : CAM_A2, s);

  // iris: the Finance agent's colour covers the hidden cuts
  const fin = AGENTS[1].color;
  const iris = Math.max(prog(s, K.dive - 0.28, K.dive, EASE.in) * (s < K.dive ? 1 : 0), s >= K.dive && s < K.dive + 0.4 ? 1 - prog(s, K.dive, K.dive + 0.4) : 0,
    s >= K.emerge - 0.35 && s < K.emerge ? prog(s, K.emerge - 0.35, K.emerge, EASE.in) : 0, s >= K.emerge ? 1 - prog(s, K.emerge, K.emerge + 0.45) : 0);

  const fog = 0.25 + 0.35 * prog(s, K.turn, K.turn + 3) - 0.15 * prog(s, K.combine, K.combine + 2) + 0.35 * prog(s, K.merge, K.merge + 1.5);
  return (
    <AbsoluteFill style={{ background: P.base, overflow: "hidden" }}>
      <Background t={t} color={P.base} glow={0.18} seed={2} />
      <AbsoluteFill style={{ background: `radial-gradient(55% 50% at 50% 52%, rgba(47,123,255,${0.16 * fog}), rgba(140,107,255,${0.05 * fog}) 45%, transparent 75%)` }} />
      <AbsoluteFill style={{ transform: worldTransform(width, height, cam), transformOrigin: "0 0" }}>
        {inB ? <WorldB s={s} /> : <WorldA s={s} f={f} />}
      </AbsoluteFill>
      {iris > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #ffffff ${0}%, ${fin} 35%, #0b2a6b 100%)`, opacity: iris }} />}
      <Finish t={t} />
    </AbsoluteFill>
  );
};

/** Main world: dots, tasks, agents, the climb, the logo. */
const WorldA: React.FC<{ s: number; f: number }> = ({ s, f }) => {
  const sparkI = prog(s, K.spark, K.spark + 0.5) * (0.75 + 0.25 * prog(s, K.turn - 0.4, K.turn)) * (1 - prog(s, K.combine, K.combine + 1));
  const fadeScene = 1 - prog(s, K.combine + 0.4, K.combine + 2.2, EASE.inOut); // tasks + dots leave as the climb starts
  const climbK = (i: number) => prog(s, K.climb + (i % 2) * 0.3, K.merge - 0.25 + (i % 2) * 0.25, EASE.inOut);
  const toFootK = (i: number) => prog(s, K.combine + i * 0.12, K.climb, EASE.inOut);
  const merged = prog(s, K.merge, K.merge + 1.0, EASE.out);
  const shrinkK = prog(s, K.merge + 0.9, K.logo, EASE.inOut); // neon Λ strokes → the logo's Λ in place
  const glyphK = prog(s, K.logo - 0.35, K.logo + 0.1); // crossfade strokes → filled glyph once it is logo-sized
  const whiteP = prog(s, K.logo - 0.6, K.logo + 1.4, EASE.out);
  const sub = prog(s, K.logo + 1.2, K.logo + 2.4, EASE.out);
  const sweep = prog(s, K.logo + 2.6, K.logo + 4.2, EASE.inOut);

  // agent orb position over time
  const orbPos = (i: number): [number, number] => {
    const base = ORBS[i];
    const foot = i % 2 === 0 ? FOOT_L : FOOT_R; // docs+follow → left leg, finance+approve → right leg
    const footOff: [number, number] = [foot[0], foot[1] + (i < 2 ? -18 : 18)];
    const p1 = lerp2(base, footOff, toFootK(i));
    return climbK(i) > 0 ? lerp2(footOff, APEX, climbK(i)) : p1;
  };

  return (
    <>
      {/* dots */}
      {DOTS.map((d, i) => {
        const fall = prog(s, d.delay * 2.2, 0.9 + d.delay * 2.2, EASE.out);
        if (fall <= 0) return null;
        const slipK = d.slip ? prog(s, K.pain + 1.5 + d.delay * 3, K.pain + 3.4 + d.delay * 3, EASE.in) : 0;
        const gridK = d.slip ? 0 : prog(s, K.handle + d.delay * 1.6, K.handle + 1.4 + d.delay * 1.6, EASE.inOut);
        const x = lerp(d.sx, d.gx, gridK) + Math.sin(s * 0.6 + i) * 3 * (1 - gridK);
        const y = lerp(d.sy - 420 * (1 - fall), d.gy, gridK) + slipK * 380;
        const lit = gridK > 0.5 ? 0.6 : 0.5 + 0.4 * (1 - prog(s, 0.9 + d.delay * 2.2, 2.2 + d.delay * 2.2));
        const o = fall * (1 - slipK) * fadeScene * lit;
        if (o < 0.01) return null;
        const col = gridK > 0.5 ? AGENTS[Math.floor(hash(i + 7) * 4)].color : fall < 1 ? "#9FD8EC" : "#6A8796";
        return <div key={i} style={{ position: "absolute", left: x - d.size / 2, top: y - d.size / 2, width: d.size, height: d.size, borderRadius: d.size, background: col, opacity: o, boxShadow: gridK > 0.5 || fall < 1 ? `0 0 8px ${col}` : "none" }} />;
      })}

      {/* spark → agent lines */}
      {ORBS.map((o, i) => (
        <GlowLine key={"sl" + i} a={SPARK} b={o} p={prog(s, K.turn + i * 0.25, K.turn + 0.9 + i * 0.25, EASE.out)} color="#3BC1EC" color2={AGENTS[i].color} w={2} opacity={0.8 * (1 - prog(s, K.handle - 0.2, K.handle + 1.0))} id={"sl" + i} />
      ))}

      {/* agent → task lines */}
      {CHIPS.map((c, i) => {
        const a = ORBS[c.agent];
        const pl = prog(s, K.handle + i * 0.45, K.handle + 0.5 + i * 0.45, EASE.out);
        const mv = prog(s, K.handle + 0.9 + i * 0.45, K.handle + 2.1 + i * 0.45, EASE.inOut);
        const cp = lerp2(c.from, c.to, mv);
        return <GlowLine key={"tl" + i} a={a} b={cp} p={pl} color={AGENTS[c.agent].color} w={1.6} opacity={0.75 * (1 - mv) * fadeScene} id={"tl" + i} />;
      })}

      {/* tasks */}
      {CHIPS.map((c, i) => {
        const inK = prog(s, K.pain + i * 0.6, K.pain + 0.9 + i * 0.6, EASE.out);
        const state = prog(s, K.handle + 0.5 + i * 0.45, K.handle + 0.6 + i * 0.45);
        const mv = prog(s, K.handle + 0.9 + i * 0.45, K.handle + 2.1 + i * 0.45, EASE.inOut);
        const [x, y] = lerp2(c.from, c.to, mv);
        const o = inK * fadeScene;
        if (o < 0.01) return null;
        return <Chip key={"c" + i} x={x + breathe(f, t, i) * (1 - mv)} y={y + (1 - inK) * 26} text={c.text} sub={c.sub} state={state} color={AGENTS[c.agent].color} f={f} seed={i} style={{ opacity: o, filter: `blur(${(1 - inK) * 8}px)` }} scale={1.12} />;
      })}

      {/* agent labels */}
      {ORBS.map((o, i) => {
        const k = prog(s, K.turn + 0.6 + i * 0.25, K.turn + 1.4 + i * 0.25, EASE.out) * (1 - prog(s, K.combine, K.combine + 0.8));
        if (k <= 0) return null;
        return (
          <div key={"lb" + i} style={{ position: "absolute", left: o[0], top: o[1] + 52, translate: `-50% ${(1 - k) * 14}px`, opacity: k, fontFamily: t.fonts.text, fontSize: 24, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: AGENTS[i].color, whiteSpace: "nowrap" }}>
            {AGENTS[i].label}
          </div>
        );
      })}

      {/* climb trails (the Λ being drawn by the agents) */}
      {shrinkK > 0 && (() => {
        const toW = (p: [number, number]): [number, number] => [LOGO_X + p[0] * S_FIN, LOGO_Y + p[1] * S_FIN];
        const ap = lerp2(APEX, toW(LAMBDA.apex), shrinkK), fl = lerp2(FOOT_L, toW(LAMBDA.left), shrinkK), fr = lerp2(FOOT_R, toW(LAMBDA.right), shrinkK);
        const w = lerp(12, 25, shrinkK);
        return (
          <>
            <GlowLine a={fl} b={ap} p={1} color={P.accent} w={w} opacity={1 - glyphK} id="sL" />
            <GlowLine a={fr} b={ap} p={1} color={P.accent} w={w} opacity={1 - glyphK} id="sR" />
          </>
        );
      })()}
      {shrinkK <= 0 && [0, 1, 2, 3].map((i) => {
        const k = climbK(i);
        if (k <= 0) return null;
        const foot = i % 2 === 0 ? FOOT_L : FOOT_R;
        const tip = lerp2(foot, APEX, k);
        const blue = merged;
        return (
          <React.Fragment key={"tr" + i}>
            <GlowLine a={foot} b={tip} p={1} color={AGENTS[i].color} color2={blue > 0 ? P.accent : AGENTS[i].color} w={3 + 9 * merged} opacity={0.9 - 0.3 * (i >= 2 ? 1 : 0)} id={"tr" + i} />
          </React.Fragment>
        );
      })}

      {/* the spark */}
      <Orb x={SPARK[0]} y={SPARK[1]} r={9} color={P.accent} intensity={sparkI} pulse={Math.sin(s * 3)} />

      {/* agent orbs */}
      {ORBS.map((_, i) => {
        const ign = prog(s, K.turn + 0.3 + i * 0.25, K.turn + 0.9 + i * 0.25, EASE.out);
        const gone = prog(s, K.merge - 0.1, K.merge + 0.4);
        const [x, y] = orbPos(i);
        return <Orb key={"o" + i} x={x} y={y} r={16} color={AGENTS[i].color} intensity={ign * (1 - gone)} pulse={Math.sin(s * 2.2 + i)} />;
      })}

      {/* merge flash at the apex */}
      <Orb x={APEX[0]} y={APEX[1]} r={26} color={P.accent} intensity={prog(s, K.merge - 0.15, K.merge + 0.15) * (1 - prog(s, K.merge + 0.3, K.merge + 1.6))} pulse={1} />

      {/* logo: big Λ glyph → its place; white letters reveal */}
      {glyphK > 0 && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <filter id="bglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={6} result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="clipAll">
              {GLYPHS.map((g, i) => <path key={i} d={g.d} />)}
            </clipPath>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={BLUE.d} fill={P.accent} opacity={glyphK} transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${S_FIN})`} filter="url(#bglow)" />
          <g transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${S_FIN})`}>
            {GLYPHS.filter((g) => g.cls === "white").map((g, i) => {
              const p = Math.min(1, Math.max(0, (whiteP - i * 0.14) / 0.58));
              const e = EASE.out(p);
              return <path key={i} d={g.d} fill="#FFFFFF" opacity={e} transform={`translate(0 ${(1 - e) * 9})`} />;
            })}
            {sweep > 0 && sweep < 1 && (
              <g clipPath="url(#clipAll)">
                <rect x={-120 + sweep * (LOGO_W + 160)} y={-10} width={110} height={LOGO_H + 20} fill="url(#sweep)" opacity={0.75} />
              </g>
            )}
          </g>
        </svg>
      )}
      {sub > 0 && (
        <div style={{ position: "absolute", left: 960, top: LOGO_Y + LOGO_H * S_FIN + 58, translate: `-50% ${(1 - sub) * 12}px`, opacity: sub, fontFamily: t.fonts.text, fontSize: 30, fontWeight: 400, letterSpacing: "0.62em", paddingLeft: "0.62em", color: "#CFE3EA", whiteSpace: "nowrap" }}>
          INTELLIGENCE
        </div>
      )}
    </>
  );
};

const FIELDS = [
  { k: "Supplier", v: "Northwind Freight (Pty) Ltd" },
  { k: "Amount due", v: "R 48 210.00" },
  { k: "VAT", v: "R 6 288.26" },
  { k: "Due date", v: "14 March" },
  { k: "Match", v: "PO-1187 · bank ref found" },
];

/** Inside the Finance agent: an invoice read by a beam; values lift off and collapse into one ball. */
const WorldB: React.FC<{ s: number }> = ({ s }) => {
  const fin = AGENTS[1].color;
  const t0 = K.dive;
  const cardIn = prog(s, t0 + 0.1, t0 + 0.9, EASE.out);
  const beam = prog(s, t0 + 0.5, t0 + 2.4, EASE.inOut);
  const lift = (i: number) => prog(s, t0 + 2.5 + i * 0.12, K.ball - 0.1 + i * 0.05, EASE.inOut);
  const ball = prog(s, K.ball - 0.4, K.ball + 0.2, EASE.out);
  const cardOut = prog(s, t0 + 2.6, K.ball - 0.2, EASE.in);
  const CX = 960, CY = 560;
  return (
    <>
      <div style={{ position: "absolute", left: CX - 330, top: CY - 380, width: 660, height: 760, perspective: 1600 }}>
        <div style={{ width: "100%", height: "100%", transform: `rotateX(${16 - 4 * cardIn}deg) rotateY(${-14 + 6 * cardIn}deg)`, opacity: cardIn * (1 - cardOut), translate: `0 ${(1 - cardIn) * 40}px`, borderRadius: 26, background: "linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.035))", border: "1px solid rgba(255,255,255,.16)", boxShadow: `0 40px 120px -30px ${fin}55`, padding: "48px 52px", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: t.fonts.text, fontSize: 22, letterSpacing: "0.3em", color: P.muted, fontWeight: 600 }}>INVOICE</div>
          <div style={{ fontFamily: t.fonts.text, fontSize: 52, color: P.ink, fontWeight: 700, marginTop: 8, letterSpacing: "-0.02em" }}>#2291</div>
          <div style={{ height: 1, background: "rgba(255,255,255,.14)", margin: "28px 0 18px" }} />
          {FIELDS.map((fd, i) => {
            const lit = prog(s, t0 + 0.6 + i * 0.36, t0 + 0.9 + i * 0.36);
            return (
              <div key={fd.k} style={{ display: "flex", justifyContent: "space-between", padding: "17px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <div style={{ fontFamily: t.fonts.text, fontSize: 25, color: P.muted }}>{fd.k}</div>
                <div style={{ fontFamily: t.fonts.text, fontSize: 25, fontWeight: 600, color: lit > 0.5 ? fin : P.ink, textShadow: lit > 0.5 ? `0 0 18px ${fin}` : "none", opacity: 1 - lift(i) }}>{fd.v}</div>
              </div>
            );
          })}
          {/* the reading beam */}
          <div style={{ position: "absolute", left: 0, right: 0, top: `${-10 + beam * 115}%`, height: 90, background: `linear-gradient(180deg, transparent, ${fin}44 45%, #ffffff66 50%, ${fin}44 55%, transparent)`, opacity: beam > 0 && beam < 1 ? 1 : 0, mixBlendMode: "screen" }} />
        </div>
      </div>
      {/* values lift off and fly into one ball (object becomes object) */}
      {FIELDS.map((fd, i) => {
        const k = lift(i);
        if (k <= 0 || k >= 1) return null;
        const sx = CX + 150, sy = CY - 150 + i * 70;
        const x = lerp(sx, CX, EASE.in(k)), y = lerp(sy, CY, k);
        return (
          <div key={"lf" + i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(1 - 0.85 * k), padding: "10px 18px", borderRadius: 999, background: `${fin}33`, border: `1px solid ${fin}`, fontFamily: t.fonts.text, fontSize: 24, fontWeight: 600, color: P.ink, whiteSpace: "nowrap", boxShadow: `0 0 24px ${fin}88`, opacity: 1 - k * 0.3 }}>
            {fd.v}
          </div>
        );
      })}
      <Orb x={CX} y={CY} r={22} color={fin} intensity={ball} pulse={Math.sin(s * 6)} />
    </>
  );
};
