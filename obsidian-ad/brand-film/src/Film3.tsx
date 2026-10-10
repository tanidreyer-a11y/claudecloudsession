// OBSIDIAN — "Digital precision that builds reputation" · 60 s · 9:16 (built on v2's look; owner notes 2026-10-10)
//  1  0–6.5   the liquid orb drops in (camera falls with it); rings orbit; "You've spent years building a reputation."
//  2  6.5–10.5 the camera keeps falling through a field of identical grey spheres: "Online, you look like everyone else."
//  3  10.5–12.6 dive THROUGH the orb → a bright liquid flash → the plum liquid world
//  4  12.6–18.5 code rises into place and types (// we don't start with a template. // we start with code.)
//  5  18.5–26.4 the code panel becomes the page; its grid layers pop out (C-style exploded view); tokens; the site
//               lands on the TOP layer
//  6  26.4–29  that top frame stands upright, smoothly, while the camera descends
//  7  29–37   the upright carousel (owner favourite): panels pass to the left as the camera orbits right
//  8  37–41.5 the last panel becomes a phone; it spins 360° while the camera falls
//  9  41.5–44.6 the phone turns to its back: the logic
// 10  44.6–53 agents (powered by Avant Intelligence): orb, rings, flow, bubbles, 14:00 → 02:00
// 11  53–60   the camera falls; the orb splits into the two emblem bars → OBSIDIAN lockup → tagline → WhatsApp
import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { E, prog, lerp, win, h, site, seq, C, SANS, LABEL, LiquidOrb, LiquidWorld, OrbitRing, Browser, Code, Tok } from "./Film2";

const KW = "#F0ABFC", TY = "#E9D5FF", ST = "#FBCFE8", TX = "#F6F1F8", CM = "rgba(246,241,248,.42)";
const HERO: Tok[][] = [
  [["// we don't start with a template.", CM]],
  [["// we start with code.", CM]],
  [["", TX]],
  [["export ", KW], ["const ", KW], ["Hero", TY], [" = () => (", TX]],
  [["  <", TX], ["Scene", TY], [" precision", ST], ["=", TX], ['"1px"', ST]],
  [["    motion", ST], ["={", TX], ["ease.outExpo", ST], ["}", TX]],
  [["    reputation", ST], ["=", TX], ['"earned"', ST], [">", TX]],
  [["    <", TX], ["Headline", TY], [">", TX], ["Built to be remembered.", TX], ["</", TX], ["Headline", TY], [">", TX]],
  [["  </", TX], ["Scene", TY], [">", TX]],
  [[");", TX]],
];

export const FPS3 = 60;
export const DUR3 = 60;

const T = {
  drop: 0, rings: 1.3, line1: 2.3, field: 6.5, line2: 7.4, dive: 10.3, world: 11.4, code: 12.4, build: 18.5, land: 23.6,
  stand: 26.4, carousel: 28.6, phone: 37.0, flip: 41.4, agents: 44.6, ring24: 49.2, works: 50.6, fall: 53.0,
};
// camera descent (px of "fall") — every drop is a downward move; dust and scenes read it
const DROPS: [number, number, number][] = [[0, 1.6, 900], [6.5, 10.5, 2600], [12.2, 13.2, 700], [18.3, 19.3, 500], [26.4, 29.0, 900], [37.4, 41.0, 1300], [44.0, 45.4, 1800], [53.0, 55.0, 1700]];
const camFall = (s: number) => DROPS.reduce((a, [t0, t1, d]) => a + d * prog(s, t0, t1, E.io), 0);
const CARDS = [
  { dir: "obsidian", url: "obsidian.studio" }, { dir: "north", url: "northlight" }, { dir: "surgery", url: "atelier vale" },
  { dir: "cigars", url: "cape atlantic cigars" }, { dir: "estate", url: "private estates" },
];
const cardSrc = (dir: string, s: number, t0: number) =>
  dir === "obsidian" ? staticFile("img/obsidian.jpg") : dir === "cigars" ? site("cigars_hero.png") : seq(dir, 1 + 110 * prog(s, t0, t0 + 9, (x: number) => x));

// a typographic beat that lives in the scene (rises with the camera fall, soft blur in/out)
const Beat: React.FC<{ s: number; a: number; b: number; y: number; lines: string[]; size?: number; accent?: number }> = ({ s, a, b, y, lines, size = 60, accent = -1 }) => {
  const k = win(s, a, a + 0.7, b - 0.5, b);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y - (1 - prog(s, a, a + 0.9)) * -40 - prog(s, b - 0.5, b, E.in) * 60, textAlign: "center", opacity: k, filter: `blur(${(1 - k) * 8}px)` }}>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1.12, letterSpacing: "-0.03em", color: i === accent ? "transparent" : C.ink, background: i === accent ? "linear-gradient(90deg, #FBCFE8, #E879F9 50%, #C4B5FD)" : undefined, WebkitBackgroundClip: i === accent ? "text" : undefined, opacity: prog(s, a + i * 0.35, a + i * 0.35 + 0.6) } as React.CSSProperties}>{l}</div>
      ))}
    </div>
  );
};
// matte grey sphere (the "everyone else")
const GreySphere: React.FC<{ x: number; y: number; d: number }> = ({ x, y, d }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #8a8590 0%, #4a4650 45%, #1c1a20 100%)", boxShadow: "inset 0 -8px 20px rgba(0,0,0,.4)" }} />
);
// the emblem as two bars (geometry measured from the owner's logo; 1774×887 source, crop origin 400,300)
const BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]];
const Emblem: React.FC<{ s: number; t0: number; scale: number; x: number; y: number }> = ({ s, t0, scale, x, y }) => (
  <svg width={200 * scale} height={245 * scale} viewBox="0 0 200 245" style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <defs>
      <linearGradient id="bar" x1="171" y1="21" x2="40" y2="215" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#D9CCFF" /><stop offset="0.75" stopColor="#8B6CF0" /><stop offset="1" stopColor="#5B3FC4" />
      </linearGradient>
    </defs>
    {BARS.map((b, i) => {
      const k = prog(s, t0 + i * 0.14, t0 + i * 0.14 + 0.7, E.out);
      return <polygon key={i} points={b.map((p) => p.join(",")).join(" ")} fill="url(#bar)" style={{ transform: `translate(${(1 - k) * 160}px, ${-(1 - k) * 220}px)`, opacity: k }} />;
    })}
  </svg>
);

export const Film3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const s = frame / fps;
  const cx = W / 2, cy = H / 2;
  const fall = camFall(s);

  // world brightness / presence
  const worldOp = prog(s, T.world - 0.5, T.world + 0.2, E.soft) * (1 - prog(s, T.fall + 0.4, T.fall + 1.6, E.soft));
  const flash = win(s, T.world - 0.3, T.world, T.world + 0.1, T.world + 1.2);
  const night = win(s, T.ring24, T.ring24 + 1.8, T.works + 1.5, T.fall);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", fontFamily: SANS }}>
      {worldOp > 0 && <LiquidWorld s={s} op={worldOp} light={lerp(0.95, 0.5, prog(s, T.world, T.code + 1.5, E.soft)) * (1 - night * 0.55)} />}
      {/* the bright liquid flash at the dive (ElevenLabs' one bright world) */}
      {flash > 0 && <AbsoluteFill style={{ opacity: flash, background: "radial-gradient(ellipse 90% 70% at 50% 45%, #FFFFFF 0%, #FBCFE8 30%, #E879F9 62%, #7C3AED 100%)" }} />}
      {/* falling dust: the camera is always descending */}
      <AbsoluteFill>
        {Array.from({ length: 70 }, (_, i) => {
          const d = 0.25 + h(i, 1) * 0.9, y = ((h(i, 2) * 2400 - fall * d) % 2400 + 2400) % 2400 - 240;
          return <div key={i} style={{ position: "absolute", left: h(i, 3) * W, top: y, width: 2 + d * 3, height: 2 + d * 3 + Math.min(40, Math.abs(fall - camFall(s - 1 / 60)) * d * 0.6), borderRadius: 4, background: "rgba(251,207,232,.5)", opacity: 0.18 + d * 0.3 }} />;
        })}
      </AbsoluteFill>

      {/* ===== 1 · the orb drops in; rings; the first line ===== */}
      {s < T.world + 0.4 && (() => {
        const dropY = lerp(-460, cy - 160, prog(s, 0, 1.6, E.drop)) + Math.sin(s * 1.2) * 8;
        const fieldK = prog(s, T.field, T.dive, E.io);
        const dive = prog(s, T.dive, T.world + 0.2, Easing.bezier(0.6, 0, 0.3, 1));
        const oy = lerp(dropY, cy - 60, fieldK);
        const d = lerp(lerp(400, 300, fieldK), 6200, dive);
        return (
          <>
            {/* the field of identical grey spheres streams up past the camera */}
            {s > T.field - 0.2 && Array.from({ length: 30 }, (_, i) => {
              const dep = 0.5 + h(i, 4) * 1.0, y0 = 2100 + h(i, 5) * 2600;
              const y = y0 - (fall - 900) * dep;
              const x = h(i, 6) * W, sz = 70 + dep * 90;
              if (y < -200 || y > H + 200 || Math.abs(x - cx) < 140 && Math.abs(y - oy) < 220) return null;
              return <div key={i} style={{ opacity: 1 - dive, filter: `blur(${Math.max(0, (dep - 1.1) * 6)}px)` }}><GreySphere x={x} y={y} d={sz} /></div>;
            })}
            <OrbitRing x={cx} y={oy} r={300} tilt={72} spin={s * 40} k={prog(s, T.rings, T.rings + 1, E.io)} op={(1 - dive) * (1 - fieldK * 0.6)} />
            <OrbitRing x={cx} y={oy} r={370} tilt={64} spin={-s * 26 + 40} k={prog(s, T.rings + 0.3, T.rings + 1.3, E.io)} op={(1 - dive) * (1 - fieldK * 0.6)} dots={2} />
            <LiquidOrb x={cx} y={lerp(oy, cy, dive)} d={d} s={s} seed={1} />
            <Beat s={s} a={T.line1} b={T.field + 0.4} y={cy + 230} lines={["You've spent years", "building a reputation."]} accent={1} />
            <Beat s={s} a={T.line2} b={T.dive} y={cy + 260} lines={["Online, you look", "like everyone else."]} />
          </>
        );
      })()}

      {/* ===== 4 · code rises into place ===== */}
      {s > T.code - 0.3 && s < T.build + 1.4 && (() => {
        const k = prog(s, T.code - 0.2, T.code + 1.0, E.out);
        const toPage = prog(s, T.build - 0.1, T.build + 1.0, E.io);
        return (
          <div style={{ position: "absolute", left: cx - 480, top: cy - 420 + (1 - k) * 700 - toPage * 40, width: 960, opacity: k * (1 - toPage), transform: `perspective(1800px) rotateX(${lerp(14, 0, k) + toPage * 18}deg) rotateY(${toPage * -22}deg) scale(${lerp(1, 0.86, toPage)})` }}>
            <div style={{ borderRadius: 34, background: "linear-gradient(160deg, rgba(42,18,56,.78), rgba(12,7,18,.86))", border: "1px solid rgba(251,207,232,.28)", boxShadow: "0 60px 140px rgba(0,0,0,.55), 0 0 120px rgba(245,163,208,.18)" }}>
              <div style={{ padding: "26px 40px 0", ...LABEL, fontSize: 20 }}>hero.tsx</div>
              <Code s={s} t0={T.code + 0.6} t1={T.build - 0.6} w={940} fs={27} code={HERO} />
            </div>
          </div>
        );
      })()}

      {/* ===== 5–6 · the page; grid layers pop out; the site lands on the top layer; it stands upright ===== */}
      {s > T.build - 0.2 && s < T.carousel + 1.2 && (() => {
        const PW = 900, PH = 562;
        const inK = prog(s, T.build, T.build + 0.9, E.out);
        const explode = prog(s, T.build + 1.2, T.build + 2.6, E.io);
        const sweep = Math.sin((s - T.build) * 0.55) * 14 * explode;
        const stand = prog(s, T.stand, T.carousel, Easing.bezier(0.45, 0, 0.2, 1));   // the top frame stands upright
        const rest = prog(s, T.stand - 0.3, T.stand + 0.7, E.in);                      // the other layers fall away below
        const landK = prog(s, T.land, T.land + 1.0, E.drop);
        const pop = (i: number) => prog(s, T.build + 0.6 + i * 0.3, T.build + 1.3 + i * 0.3, E.back);
        const ry = lerp(-18 * explode + sweep, 0, stand), rx = lerp(16 * explode, 0, stand);
        const L = [
          <div key="g" style={{ position: "absolute", inset: 0, borderRadius: 22, background: "rgba(20,12,28,.86)", border: "1px solid rgba(255,255,255,.2)", backgroundImage: "linear-gradient(rgba(251,207,232,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(251,207,232,.09) 1px, transparent 1px)", backgroundSize: "45px 45px" }} />,
          <div key="d" style={{ position: "absolute", inset: 0, borderRadius: 22, border: "1.5px solid rgba(251,207,232,.5)" }}>{[0.25, 0.5, 0.75].map((f) => <div key={f} style={{ position: "absolute", left: `${f * 100}%`, top: 0, bottom: 0, borderLeft: "1px dashed rgba(255,255,255,.28)" }} />)}{[0.33, 0.66].map((f) => <div key={f} style={{ position: "absolute", top: `${f * 100}%`, left: 0, right: 0, borderTop: "1px dashed rgba(255,255,255,.28)" }} />)}</div>,
          <div key="t" style={{ position: "absolute", left: 56, top: 70 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 70, lineHeight: 1, letterSpacing: "-0.035em", color: C.ink }}>Built to be</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 70, lineHeight: 1.05, letterSpacing: "-0.035em", background: "linear-gradient(90deg, #FBCFE8, #E879F9 55%, #C4B5FD)", WebkitBackgroundClip: "text", color: "transparent" }}>remembered.</div></div>,
          <div key="b" style={{ position: "absolute", left: 56, top: 290, width: 230, height: 62, borderRadius: 31, background: "linear-gradient(90deg, #F5A3D0, #C4B5FD)", boxShadow: "0 0 40px rgba(245,163,208,.55)", color: "#2E1046", fontFamily: SANS, fontWeight: 600, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>Start a project</div>,
          <div key="o" style={{ position: "absolute", right: 70, top: 80, width: 260, height: 260 }}><LiquidOrb x={130} y={130} d={230} s={s} seed={4} rim={0.6} /></div>,
        ];
        const Z = [0, 90, 175, 250, 320];
        return (
          <div style={{ position: "absolute", left: cx - PW / 2, top: cy - PH / 2 - 120 + (1 - inK) * 500 - rest * 0 + lerp(0, -40, stand), width: PW, height: PH, perspective: 2600, opacity: inK * (1 - prog(s, T.carousel - 0.05, T.carousel + 0.05)) }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${lerp(lerp(1, 0.78, explode), 0.84, stand)})` }}>
              {L.map((el, i) => (
                <div key={i} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(${Z[i] * (i === 0 ? 1 : pop(i - 1)) * explode - rest * 900}px) translateY(${rest * 700}px)`, opacity: (i === 0 ? 1 : Math.min(1, pop(i - 1) * 1.4)) * (1 - rest) }}>{el}</div>
              ))}
              {/* the site lands on the TOP layer, then stands upright (stays in front) */}
              {s > T.land - 0.1 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: PW, transform: `translateZ(${lerp(lerp(1300, 300, landK) * explode, 0, stand)}px)`, opacity: prog(s, T.land, T.land + 0.3) }}>
                  <Browser w={PW} src={staticFile("img/obsidian.jpg")} url="obsidian.studio" />
                </div>
              )}
            </div>
            {/* tokens around the stack */}
            {[["48px", -60, -90, 0.9], ["#F5A3D0 → #C4B5FD", 520, -110, 1.2], ["ease.outExpo", -60, 640, 1.5], ["1px precision", 560, 660, 1.8]].map(([t, dx, dy, a], i) => (
              <div key={i} style={{ position: "absolute", left: dx as number, top: dy as number, fontFamily: "JBMono, monospace", fontSize: 26, color: "#FBE7F3", padding: "10px 18px", borderRadius: 14, background: "rgba(245,163,208,.12)", border: "1px solid rgba(251,207,232,.35)", opacity: win(s, T.build + (a as number), T.build + (a as number) + 0.4, T.land - 0.3, T.land + 0.2) }}>{t as string}</div>
            ))}
          </div>
        );
      })()}

      {/* ===== 7 · the upright carousel: panels pass to the left as the camera orbits right ===== */}
      {s > T.carousel - 0.1 && s < T.phone + 0.6 && (() => {
        const R = 760, n = CARDS.length, step = 360 / n;
        const turn = prog(s, T.carousel + 0.3, T.phone - 0.2, Easing.bezier(0.45, 0.05, 0.35, 1)) * step * (n - 1);
        const exitOthers = prog(s, T.phone - 0.4, T.phone + 0.4, E.in);
        const camY = Math.sin((s - T.carousel) * 0.6) * 20;
        return (
          <AbsoluteFill style={{ perspective: 2200 }}>
            <Beat s={s} a={T.carousel + 0.6} b={T.phone - 0.3} y={330} lines={["Websites that move", "the way your brand does."]} size={56} accent={1} />
            <div style={{ position: "absolute", left: cx, top: cy - 60 + camY, transformStyle: "preserve-3d", transform: `translateZ(${-R}px) rotateX(-4deg) rotateY(${-turn}deg)` }}>
              {CARDS.map((c, i) => {
                const last = i === n - 1;
                const op = last ? 1 : 1 - exitOthers;
                return (
                  <div key={i} style={{ position: "absolute", left: -378, top: -284, transform: `rotateY(${i * step}deg) translateZ(${R}px)`, backfaceVisibility: "hidden", opacity: op }}>
                    <Browser w={756} src={cardSrc(c.dir, s, T.carousel + i * 1.2)} url={c.url} />
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* ===== 8–9 · the last panel becomes a phone; 360°; the back is the logic ===== */}
      {s > T.phone - 0.05 && s < T.agents + 0.7 && (() => {
        const mk = prog(s, T.phone, T.phone + 1.1, E.io);
        const spin = lerp(0, 360, prog(s, T.phone + 1.0, T.flip, E.io));
        const flipK = prog(s, T.flip, T.flip + 0.9, E.io);
        const w = lerp(756, 470, mk), hh = lerp(511, 1000, mk), r = lerp(16, 64, mk);
        const y = cy - hh / 2 - 60 + lerp(0, 60, prog(s, T.phone, T.flip, E.io)) - lerp(0, 1700, prog(s, T.agents - 0.6, T.agents + 0.6, E.in));
        const sc = lerp(1, 1.3, flipK);
        return (
          <>
            <Beat s={s} a={T.phone + 1.2} b={T.flip - 0.1} y={240} lines={["Every pixel,", "intentional."]} size={56} accent={1} />
            <div style={{ position: "absolute", left: cx - w / 2, top: y, width: w, height: hh, perspective: 2200, transform: `scale(${sc})` }}>
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${spin + flipK * 180}deg) rotateX(${Math.sin(mk * Math.PI) * 6}deg)` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "#0d0812", border: `${lerp(1, 12, mk)}px solid #17101f`, boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 100px rgba(245,163,208,.2)", backfaceVisibility: "hidden" }}>
                  <Img src={seq("estate", 75 + 30 * prog(s, T.phone - 1, T.phone + 0.6, (x: number) => x))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - mk }} />
                  <Img src={site(`m_estate_${Math.min(2, Math.floor(prog(s, T.phone + 0.8, T.flip, (x: number) => x) * 3))}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: mk }} />
                </div>
                <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "linear-gradient(160deg, rgba(42,18,56,.97), rgba(12,7,18,.98))", border: "1px solid rgba(251,207,232,.3)", boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 100px rgba(245,163,208,.22)", transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 36, width: "100%", textAlign: "center", ...LABEL, fontSize: 18 }}>The logic behind it</div>
                  <div style={{ position: "absolute", left: 4, top: 300 }}><Code s={s} t0={T.flip + 0.6} t1={T.agents - 0.5} w={460} fs={20} /></div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ===== 10 · agents ===== */}
      {s > T.agents - 0.6 && s < T.fall + 1.2 && (() => {
        const t = T.agents, k = prog(s, t - 0.4, t + 0.9, E.out), out = prog(s, T.fall, T.fall + 1.0, E.in);
        const oy = cy - 520 + lerp(900, 0, k) - out * 1200;
        const nodes = [{ l: "FAQ receptionist", x: cx - 300, y: oy + 500 }, { l: "Lead qualifier", x: cx, y: oy + 570 }, { l: "Outbound caller", x: cx + 300, y: oy + 500 }];
        const ring = prog(s, T.ring24, T.ring24 + 2.2, E.io);
        const hrs = (14 + ring * 12) % 24, mn = Math.floor(((14 + ring * 12) % 1) * 60);
        const bubbles = [
          { t: t + 2.6, side: -1, y: oy + 760, text: "What are your viewing times?", agent: false },
          { t: t + 3.3, side: 1, y: oy + 870, text: "Saturday 10:00 or 14:00. Shall I book you?", agent: true },
          { t: t + 4.0, side: -1, y: oy + 990, text: "Qualified · sent to sales", agent: false },
          { t: T.ring24 + 1.2, side: 1, y: oy + 1100, text: "New lead · 02:14 · booked", agent: true },
        ];
        return (
          <AbsoluteFill style={{ opacity: Math.min(1, k * 1.5) * (1 - out) }}>
            <OrbitRing x={cx} y={oy} r={250} tilt={70} spin={s * 36} k={prog(s, t + 0.3, t + 1.1, E.io)} />
            <OrbitRing x={cx} y={oy} r={315} tilt={62} spin={-s * 24} k={prog(s, t + 0.5, t + 1.3, E.io)} dots={2} />
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              <circle cx={cx} cy={oy} r={225} stroke="rgba(255,255,255,.12)" strokeWidth={3} fill="none" opacity={prog(s, T.ring24 - 0.3, T.ring24)} />
              <circle cx={cx} cy={oy} r={225} stroke="#FBCFE8" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-90 ${cx} ${oy})`} strokeLinecap="round" opacity={prog(s, T.ring24 - 0.3, T.ring24)} />
              {nodes.map((n, i) => {
                const kk = prog(s, t + 1.0 + i * 0.14, t + 1.7 + i * 0.14, E.io);
                const d = `M ${cx} ${oy + 240} C ${cx} ${oy + 360}, ${n.x} ${n.y - 160}, ${n.x} ${n.y - 60}`;
                return <path key={i} d={d} stroke="rgba(251,207,232,.5)" strokeWidth={2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kk} />;
              })}
            </svg>
            <LiquidOrb x={cx} y={oy} d={300} s={s} seed={2} />
            {s > T.ring24 - 0.2 && <div style={{ position: "absolute", left: 0, width: W, top: oy - 32, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: "-0.03em", color: "#2E1046", mixBlendMode: "multiply", opacity: prog(s, T.ring24, T.ring24 + 0.4) }}>{String(Math.floor(hrs)).padStart(2, "0")}:{String(mn).padStart(2, "0")}</div>}
            <div style={{ position: "absolute", left: 0, width: W, top: oy + 182, textAlign: "center", ...LABEL, opacity: prog(s, t + 0.5, t + 0.9) }}>Powered by Avant Intelligence</div>
            {nodes.map((n, i) => {
              const kk = prog(s, t + 1.4 + i * 0.14, t + 1.9 + i * 0.14, E.back);
              return (
                <React.Fragment key={i}>
                  <LiquidOrb x={n.x} y={n.y} d={96 * kk} s={s} seed={5 + i} rim={0.8} />
                  <div style={{ position: "absolute", left: n.x - 160, width: 320, top: n.y + 62, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: "-0.01em", color: C.ink, opacity: kk }}>{n.l}</div>
                </React.Fragment>
              );
            })}
            {bubbles.map((b, i) => {
              const kk = prog(s, b.t, b.t + 0.45, E.back);
              if (kk <= 0) return null;
              return <div key={i} style={{ position: "absolute", top: b.y, [b.side < 0 ? "left" : "right"]: 90, transform: `translateY(${(1 - kk) * 30}px)`, opacity: kk * (1 - prog(s, T.works - 0.2, T.works + 0.3)), padding: "20px 30px", borderRadius: 30, background: b.agent ? "linear-gradient(135deg, rgba(251,207,232,.95), rgba(233,213,255,.95))" : "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.22)", color: b.agent ? "#2E1046" : C.ink, fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: "-0.01em", boxShadow: b.agent ? "0 0 40px rgba(245,163,208,.35)" : "none" } as React.CSSProperties}>{b.text}</div>;
            })}
            <Beat s={s} a={T.works} b={T.fall + 0.2} y={oy + 820} lines={["It doesn't just stand there.", "It works."]} size={58} accent={1} />
          </AbsoluteFill>
        );
      })()}

      {/* ===== 11 · the camera falls; the orb becomes the emblem; OBSIDIAN ===== */}
      {s > T.fall && (() => {
        const k = prog(s, T.fall + 0.6, T.fall + 1.7, E.out);
        const LW = 940, LS = LW / 1030, LX = cx - LW / 2, LY = cy - 200;
        const ex = LX + 96 * LS, ey = LY + 121 * LS;                     // emblem centre in the lockup
        const toEmblem = prog(s, T.fall + 1.5, T.fall + 2.3, E.io);
        const bars = prog(s, T.fall + 1.9, T.fall + 2.4, E.soft);
        const word = prog(s, T.fall + 2.5, T.fall + 3.3, E.out);
        const lock = prog(s, T.fall + 3.0, T.fall + 3.4, E.soft);
        return (
          <>
            <OrbitRing x={lerp(cx, ex, toEmblem)} y={lerp(cy - 150, ey, toEmblem)} r={lerp(140, 320, k) * (1 - toEmblem * 0.6)} tilt={72} spin={s * 30} k={k} op={k * (1 - bars)} />
            <LiquidOrb x={lerp(cx, ex, toEmblem)} y={lerp(lerp(cy + 1000, cy - 150, k), ey, toEmblem)} d={lerp(lerp(220, 300, k), 120, toEmblem)} s={s} seed={3} op={1 - bars} />
            {/* the two bars slice out of the orb, at the lockup's exact emblem position */}
            <div style={{ opacity: 1 - lock }}><Emblem s={s} t0={T.fall + 1.85} scale={LS} x={LX} y={LY} /></div>
            {/* the real lockup: emblem crossfades, the wordmark wipes in from behind it */}
            <Img src={staticFile("img/obsidian_lockup.png")} style={{ position: "absolute", left: LX, top: LY, width: LW, height: 245 * LS, mixBlendMode: "screen", clipPath: `inset(0 ${(1 - Math.max(lock * 0.2, word)) * 80}% 0 0)`, opacity: Math.max(lock, word) }} />
            <div style={{ position: "absolute", left: 0, width: W, top: cy + 120, textAlign: "center", fontFamily: SANS, fontWeight: 400, fontSize: 44, letterSpacing: "-0.015em", color: "rgba(246,241,248,.86)", opacity: prog(s, T.fall + 3.5, T.fall + 4.2), transform: `translateY(${(1 - prog(s, T.fall + 3.5, T.fall + 4.2)) * 20}px)` }}>Digital precision that builds reputation.</div>
            <div style={{ position: "absolute", left: 0, width: W, top: cy + 230, textAlign: "center", ...LABEL, fontSize: 24, opacity: prog(s, T.fall + 4.3, T.fall + 4.9) }}>WhatsApp · 079 244 9607</div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
