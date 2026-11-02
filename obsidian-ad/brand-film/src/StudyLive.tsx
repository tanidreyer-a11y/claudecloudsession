// STUDY-LIVE (9:16, 30 fps, 14 s, loops): an internal STUDY of a reference reel the owner loves (a "this took Claude 30
// minutes" app walkthrough, 2026-10-18). Mechanisms taken, not branding: our fictional app "Halyn live", our copy, our UI.
// What the reference does that our earlier films did not (measured frame by frame):
//   1. ONE component fills the frame at a time; everything outside the camera's focus falls to ~8 % opacity + blur.
//   2. Moves are FAST and settle LONG: ~0.55 s with an expo-out ease (hard start, long glide), then a 1.2–1.8 s hold in
//      which something small keeps happening (chips pop, a caret types, avatars arrive). Never a drift with nothing in it.
//   3. The highlight IS the focus point: it slides between pills, then that same shape grows into the next card.
//   4. Interaction drives the story (a pill is selected, a row expands, a comment is typed and sent), not scenes.
//   5. Sound is sparse: a low thump on each landing, small UI ticks, nothing else. No music.
//   6. Text lives in the scene, 2–3 words, with a UI chip inline in the sentence. It loops: the end frame is the first frame.
// Timeline (s): 0 pills · 0.95 highlight slides All → Friends · 1.55 the pill grows into the "Friends are live" card ·
// 3.15 pan to the list · 4.8 a row expands (reactions, comments) · 6.3 pan to the input · 7.0 typing · 8.45 send ·
// 8.95 the plane tilts away, the send button becomes the point · 9.55 three text lines · 12.0 point → logo · 13.45 loop.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { MV, cl, prog, Finish, pop, camAt, World, screenOf, Cam, CamKey } from "./fx";

export const FPSL = 30, DURL = 14;
const BG = "#050507", SURF = "#0F1114", CORAL = "#FF5A4E", AMBER = "#FFB347", CREAM = "#FFF4E8", DIM = "#8B8480", LINE = "rgba(255,244,232,.09)", DARK = "#0A0A0C";
const F = "ArchivoW, Helvetica, Arial, sans-serif";
const EXPO = Easing.bezier(0.16, 1, 0.3, 1), IN = Easing.bezier(0.55, 0, 1, 0.45);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ── layout (world px, UI column = 780 wide centred on x = 0) ──
const ALL = { l: -200, r: -90 }, FR = { l: -70, r: 100 }, POD = { l: 112, r: 312 };
const CARD = { l: -390, t: 190, w: 780, h: 150 };
const HDR_Y = 470, R0 = 548, PITCH = 128, RH = 116, EXP = 474, TYPED = "Need this on repeat all year.";
const rowTop = (i: number, E: number) => (i === 0 ? R0 : i === 1 ? R0 + PITCH : R0 + 2 * PITCH + EXP * E);

const KEYS: CamKey[] = [
  { t: 0, x: -30, y: 0, z: 1.45, r: 0 }, { t: 1.5, x: -30, y: 0, z: 1.45, r: 0 },
  { t: 2.1, x: 0, y: 215, z: 1.2, r: 0, e: EXPO }, { t: 3.15, x: 0, y: 215, z: 1.2, r: 0 },
  { t: 3.7, x: 0, y: 700, z: 1.2, r: 0, e: EXPO }, { t: 4.85, x: 0, y: 700, z: 1.2, r: 0 },
  { t: 5.4, x: 0, y: 860, z: 1.3, r: 0, e: EXPO }, { t: 6.3, x: 0, y: 860, z: 1.3, r: 0 },
  { t: 6.85, x: 0, y: 1110, z: 1.3, r: 0, e: EXPO }, { t: 9.6, x: 0, y: 1110, z: 1.3, r: 0 },
];

// focus: anything far from the camera centre falls away (the "one thing at a time" look)
const Foc: React.FC<{ cam: Cam; y: number; half?: number; children: React.ReactNode }> = ({ cam, y, half = 60, children }) => {
  const sy = Math.abs(y - cam.y) * cam.z, d = Math.max(0, sy - half * cam.z - 150);
  const o = 0.06 + 0.94 * cl(1 - d / 230), b = Math.min(9, d / 60);
  return <div style={{ position: "absolute", left: 0, top: 0, opacity: o, filter: b > 0.4 ? `blur(${b.toFixed(1)}px)` : undefined }}>{children}</div>;
};

const GR = [[CORAL, AMBER], ["#3D7BFF", "#0A1024"], [AMBER, "#5A2B06"], [CREAM, "#6E6560"], ["#FF8FA3", "#4A1020"]];
const Av: React.FC<{ x: number; y: number; d: number; i: number; ring?: string; rw?: number; ch?: string }> = ({ x, y, d, i, ring, rw = 0, ch }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: `linear-gradient(140deg, ${GR[i % 5][0]}, ${GR[i % 5][1]})`,
    boxShadow: ring ? `0 0 0 ${rw}px ${ring}` : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: d * 0.4, color: i % 5 === 3 || i % 5 === 0 || i % 5 === 2 ? DARK : CREAM }}>{ch}</div>
);
const Icon: React.FC<{ k: "heart" | "flame" | "spark" | "chev" | "send"; s: number; c: string }> = ({ k, s, c }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={k === "chev" || k === "send" ? "none" : c} stroke={k === "chev" || k === "send" ? c : "none"} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    {k === "heart" && <path d="M12 20.5C5 16 2.5 12.5 2.5 9a4.8 4.8 0 0 1 9.5-1 4.8 4.8 0 0 1 9.5 1c0 3.5-2.5 7-9.5 11.5z" />}
    {k === "flame" && <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2 1-3.200 2-4.200C9 11 10.500 10 10.500 7.500 10.500 5.500 11 4 12 2z" />}
    {k === "spark" && <path d="M12 2l2.2 7.800L22 12l-7.800 2.200L12 22l-2.200-7.800L2 12l7.800-2.200z" />}
    {k === "chev" && <path d="M6 9l6 6 6-6" />}
    {k === "send" && <path d="M12 19V6M6 11.500l6-6 6 6" />}
  </svg>
);
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(",")})`;
const lbl = (c: string, size = 30, w = 600): React.CSSProperties => ({ fontFamily: F, fontSize: size, fontWeight: w, color: c, letterSpacing: "-0.01em", whiteSpace: "nowrap" });

const Pills: React.FC<{ t: number; fade?: number }> = ({ t, fade = 1 }) => {
  const rL = prog(t, 1.03, 1.43, EXPO), rR = prog(t, 0.95, 1.27, EXPO), L = lerp(ALL.l, FR.l, rL), R = lerp(ALL.r, FR.r, rR);
  const under = (a: number, b: number) => (a + b) / 2 > L && (a + b) / 2 < R;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: fade }}>
      <div style={{ position: "absolute", left: -330, top: -18, ...lbl(CREAM, 32, 800) }}><span style={{ color: CORAL }}>●</span> halyn</div>
      <div style={{ position: "absolute", left: L, top: -32, width: R - L, height: 64, borderRadius: 32, background: CORAL }} />
      {[["All", ALL], ["Friends", FR], ["Podcasts", POD]].map(([n, p]) => {
        const q = p as typeof ALL, on = under(q.l, q.r);
        return <div key={n as string} style={{ position: "absolute", left: q.l, width: q.r - q.l, top: -32, height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 32,
          boxShadow: on ? undefined : `inset 0 0 0 1.5px ${LINE}`, ...lbl(on ? DARK : CREAM, 28, 600) }}>{n as string}</div>;
      })}
    </div>
  );
};

const Stack: React.FC<{ x: number; y: number; n: number; d: number; t: number; at: number; ring: string }> = ({ x, y, n, d, t, at, ring }) => (
  <>{Array.from({ length: n }, (_, i) => <div key={i} style={{ transform: `scale(${Math.min(1.05, pop(t, at + i * 0.1, 0.4))})`, transformOrigin: `${x + i * d * 0.7}px ${y}px`, position: "absolute", left: 0, top: 0 }}>
    <Av x={x + i * d * 0.7} y={y} d={d} i={i} ring={ring} rw={4} ch={["K", "N", "S", "T"][i]} /></div>)}</>
);

export const StudyLive: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const cam = camAt(KEYS, t), prev = camAt(KEYS, t - 1 / FPSL);
  const E = prog(t, 4.8, 5.5, MV), live = (i: number) => prog(t, 3.3 + i * 0.1, 3.7 + i * 0.1, EXPO);
  // pill → card morph
  const m = prog(t, 1.55, 2.25, MV), pillL = lerp(ALL.l, FR.l, prog(t, 1.03, 1.43, EXPO)), pillR = lerp(ALL.r, FR.r, prog(t, 0.95, 1.27, EXPO));
  const rect = t < 1.55 ? { l: pillL, t: -32, w: pillR - pillL, h: 64, r: 32 } : { l: lerp(FR.l, CARD.l, m), t: lerp(-32, CARD.t, m), w: lerp(FR.r - FR.l, CARD.w, m), h: lerp(64, CARD.h, m), r: lerp(32, 36, m) };
  const cc = prog(t, 1.95, 2.35), mk = prog(m, 0.1, 0.8);
  // typing + send
  const typed = TYPED.slice(0, Math.floor(cl((t - 7.0) / 1.2) * TYPED.length)), sendOn = t > 7.02, press = pop(t, 8.45, 0.3), sent = prog(t, 8.5, 8.95, EXPO);
  const leave = prog(t, 8.95, 9.5, IN), toC = prog(t, 8.95, 9.5, MV);
  const rt = rowTop(2, E), tr1 = rowTop(1, 0);
  const inputY = tr1 + 536, sendX = 318, sendScr = screenOf(cam, sendX, inputY, 1080, 1920);
  // lines
  const word = (a: number, i: number) => prog(t, a + i * 0.08, a + i * 0.08 + 0.3, EXPO);
  const Line: React.FC<{ a: number; b: number; ws: (string | null)[]; size: number; c?: number[]; wt?: number }> = ({ a, b, ws, size, c = [], wt = 600 }) => {
    if (t < a - 0.01 || t > b) return null; const out = prog(t, b - 0.18, b);
    return <div style={{ position: "absolute", left: 40, right: 40, top: 930 - size * 0.55, display: "flex", justifyContent: "center", alignItems: "center", gap: size * 0.26, flexWrap: "nowrap", opacity: 1 - out, filter: `blur(${out * 10}px)` }}>
      {ws.map((w, i) => { const k = word(a, i); return <span key={i} style={{ display: "inline-block", opacity: k, filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - k) * 16}px)`, ...lbl(c.includes(i) ? CORAL : CREAM, size, wt) }}>
        {w === null ? <span style={{ position: "relative", display: "inline-block", width: 3 * size * 0.62 * 0.7 + size * 0.5, height: size * 0.95, verticalAlign: "middle" }}>
          {[0, 1, 2].map((j) => <Av key={j} x={size * 0.47 + j * size * 0.44} y={size * 0.47} d={size * 0.88} i={j} ring={BG} rw={4} ch={["K", "N", "S"][j]} />)}</span> : w}</span>; })}
    </div>;
  };
  // logo
  const dd = prog(t, 11.95, 12.3, MV), lockK = prog(t, 12.35, 12.95, EXPO), wm = prog(t, 12.4, 12.95, EXPO), sup = pop(t, 12.95, 0.4), logoOut = prog(t, 13.4, 13.75);
  const discX = lerp(540, 250, lockK), discD = lerp(28, 150, dd) * (1 - 0.0), discY = lerp(800, 960, dd);

  return (
    <Finish t={t} hits={[2.1, 3.7, 5.4, 6.85, 12.3]} glitches={[]} ca={0.4} grain={0.045} vignette={0.5} shake={5}>
      <AbsoluteFill style={{ background: BG }}>
        <AbsoluteFill style={{ background: `radial-gradient(55% 32% at 50% 48%, rgba(255,90,78,${t < 9 ? 0.07 : 0.05}), rgba(255,90,78,0))` }} />
        {/* the UI plane */}
        {t < 9.6 && <AbsoluteFill style={{ transform: `perspective(1800px) rotateY(${-26 * leave}deg) scale(${1 - 0.12 * leave})`, opacity: 1 - leave, filter: leave > 0.02 ? `blur(${leave * 9}px)` : undefined }}>
          <World cam={cam} prev={prev} id="sl" blur={0.22}>
            {/* pills */}
            <Foc cam={cam} y={0}><Pills t={t} fade={t < 1.55 ? 1 : 1 - prog(t, 1.6, 1.95)} /></Foc>
            {/* the morphing shape: pill → card */}
            {t >= 1.55 && <Foc cam={cam} y={rect.t + rect.h / 2} half={rect.h / 2}>
              <div style={{ position: "absolute", left: rect.l, top: rect.t, width: rect.w, height: rect.h, borderRadius: rect.r, background: mix([255, 90, 78], [15, 17, 20], mk), boxShadow: `inset 0 0 0 1.5px rgba(255,90,78,${0.38 * mk})`, overflow: "hidden" }}>
                {t < 1.85 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - prog(t, 1.55, 1.8), ...lbl(DARK, 28, 600) }}>Friends</div>}
              </div>
            </Foc>}
            {t >= 1.9 && <Foc cam={cam} y={CARD.t + 75} half={75}><div style={{ position: "absolute", left: 0, top: 0, opacity: cc }}>
              <div style={{ position: "absolute", left: CARD.l + 32, top: CARD.t + 31, width: 14, height: 14, borderRadius: 7, background: CORAL, boxShadow: `0 0 ${10 + 10 * Math.sin(t * 5) ** 2}px ${CORAL}` }} />
              <div style={{ position: "absolute", left: CARD.l + 60, top: CARD.t + 20, ...lbl(CREAM, 32, 700) }}>Friends are live</div>
              <div style={{ position: "absolute", left: CARD.l + 560, top: CARD.t + 24, width: 190, textAlign: "right", ...lbl(DIM, 26, 500) }}>4 online</div>
              <Stack x={CARD.l + 66} y={CARD.t + 102} n={4} d={64} t={t} at={2.15} ring={mix([255, 90, 78], [15, 17, 20], 0.62)} />
              <div style={{ position: "absolute", left: CARD.l + 66 + 3 * 45 + 52, top: CARD.t + 86, ...lbl(DIM, 26, 600), opacity: prog(t, 2.5, 2.7) }}>+3</div>
            </div></Foc>}
            {/* list */}
            {t >= 3.25 && <>
              <Foc cam={cam} y={HDR_Y + 28} half={28}><div style={{ position: "absolute", left: CARD.l + 8, top: HDR_Y, opacity: live(0), ...lbl(CREAM, 34, 700) }}>Listening now</div></Foc>
              {[0, 2].map((i) => { const y0 = rowTop(i, E), k = live(i === 0 ? 1 : 3);
                const [n, s, a] = i === 0 ? ["Kai Moreau", "Night Drive · Oslo Park", 0] : ["Sasha Lind", "Gold Hour · Juno & Bly", 2] as [string, string, number];
                return <Foc key={i} cam={cam} y={y0 + RH / 2} half={RH / 2}><div style={{ position: "absolute", left: 0, top: 0, opacity: k, transform: `translateY(${(1 - k) * 26}px)` }}>
                  <Av x={CARD.l + 50} y={y0 + RH / 2} d={76} i={a} ring={CORAL} rw={3} ch={n[0]} />
                  <div style={{ position: "absolute", left: CARD.l + 112, top: y0 + 22, ...lbl(CREAM, 34, 700) }}>{n}</div>
                  <div style={{ position: "absolute", left: CARD.l + 112, top: y0 + 66, ...lbl(DIM, 26, 400) }}>{s}</div>
                  <div style={{ position: "absolute", left: CARD.l + 712, top: y0 + 38 }}><Icon k="chev" s={40} c={DIM} /></div>
                  <div style={{ position: "absolute", left: CARD.l, top: y0 + RH + 5, width: CARD.w, height: 1.5, background: LINE }} /></div></Foc>; })}
              {/* the live row: header, then it expands into reactions + comments + input */}
              <Foc cam={cam} y={tr1 + RH / 2} half={RH / 2}><div style={{ position: "absolute", left: 0, top: 0, opacity: live(2), transform: `translateY(${(1 - live(2)) * 26}px)` }}>
                {t > 4.45 && t < 5.1 && <div style={{ position: "absolute", left: CARD.l + 50 - 60, top: tr1 + RH / 2 - 60, width: 120, height: 120, borderRadius: "50%", boxShadow: `0 0 0 2px ${CORAL}`, transform: `scale(${0.6 + prog(t, 4.45, 5.0) * 1.1})`, opacity: 1 - prog(t, 4.45, 5.0) }} />}
                <Av x={CARD.l + 50} y={tr1 + RH / 2} d={76} i={1} ring={CORAL} rw={3} ch="N" />
                <div style={{ position: "absolute", left: CARD.l + 112, top: tr1 + 22, ...lbl(CREAM, 34, 700) }}>Noor Haddad</div>
                <div style={{ position: "absolute", left: CARD.l + 112, top: tr1 + 66, ...lbl(CORAL, 26, 500) }}>Low Tide · Mara Vey</div>
                <div style={{ position: "absolute", left: CARD.l + 640, top: tr1 + 44, display: "flex", gap: 6, alignItems: "flex-end", height: 34 }}>{[0, 1, 2].map((j) => <div key={j} style={{ width: 7, borderRadius: 3, background: CORAL, height: 10 + 24 * Math.abs(Math.sin(t * 7 + j * 1.7)) }} />)}</div>
                <div style={{ position: "absolute", left: CARD.l + 712, top: tr1 + 38, transform: `rotate(${180 * E}deg)` }}><Icon k="chev" s={40} c={DIM} /></div>
              </div></Foc>
              {E > 0.02 && <>
                <Foc cam={cam} y={tr1 + 190} half={60}><div style={{ position: "absolute", left: 0, top: 0, opacity: prog(E, 0.3, 0.8) }}>
                  <div style={{ position: "absolute", left: CARD.l + 8, top: tr1 + 130, ...lbl(DIM, 24, 500) }}>Reactions</div>
                  {[["heart", 9, true], ["flame", 7, false], ["spark", 3, false]].map(([ic, n, on], i) => { const p = Math.min(1.06, pop(t, 5.55 + i * 0.15, 0.4));
                    return <div key={i} style={{ position: "absolute", left: CARD.l + 8 + i * 138, top: tr1 + 166, height: 54, width: 120, borderRadius: 27, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${p})`,
                      background: on ? "rgba(255,90,78,.14)" : "transparent", boxShadow: `inset 0 0 0 1.5px ${on ? CORAL : LINE}`, ...lbl(CREAM, 26, 600) }}><Icon k={ic as "heart"} s={26} c={on ? CORAL : DIM} />{n as number}</div>; })}
                </div></Foc>
                <Foc cam={cam} y={tr1 + 350} half={110}><div style={{ position: "absolute", left: 0, top: 0 }}>
                  <div style={{ position: "absolute", left: CARD.l + 8, top: tr1 + 240, opacity: prog(t, 5.95, 6.2), ...lbl(DIM, 24, 500) }}>Comments</div>
                  {[["Kai Moreau", "2m", "Play this one on the drive home.", 0, 6.0], ["Sasha Lind", "now", "Okay, this is the one.", 2, 6.2]].map(([n, ago, tx, ai, at], i) => { const k = prog(t, at as number, (at as number) + 0.4, EXPO), y0 = tr1 + 276 + i * 76;
                    return <div key={i} style={{ position: "absolute", left: 0, top: 0, opacity: k, filter: `blur(${(1 - k) * 8}px)`, transform: `translateY(${(1 - k) * 18}px)` }}>
                      <Av x={CARD.l + 30} y={y0 + 28} d={44} i={ai as number} ch={(n as string)[0]} />
                      <div style={{ position: "absolute", left: CARD.l + 66, top: y0 - 2, ...lbl(CREAM, 24, 700) }}>{n as string} <span style={{ color: DIM, fontWeight: 400, fontSize: 20 }}>{ago as string}</span></div>
                      <div style={{ position: "absolute", left: CARD.l + 66, top: y0 + 28, ...lbl(CREAM, 26, 400) }}>{tx as string}</div></div>; })}
                  <div style={{ position: "absolute", left: 0, top: 0, opacity: sent, filter: `blur(${(1 - sent) * 8}px)`, transform: `translateY(${(1 - sent) * 70}px)` }}>
                    <Av x={CARD.l + 30} y={tr1 + 276 + 152 + 28} d={44} i={4} ch="Y" />
                    <div style={{ position: "absolute", left: CARD.l + 66, top: tr1 + 276 + 152 - 2, ...lbl(CREAM, 24, 700) }}>You <span style={{ color: DIM, fontWeight: 400, fontSize: 20 }}>now</span></div>
                    <div style={{ position: "absolute", left: CARD.l + 66, top: tr1 + 276 + 152 + 28, ...lbl(CREAM, 26, 400) }}>{TYPED}</div></div>
                </div></Foc>
                <Foc cam={cam} y={inputY} half={40}><div style={{ position: "absolute", left: 0, top: 0, opacity: prog(t, 6.35, 6.7) }}>
                  <div style={{ position: "absolute", left: CARD.l, top: inputY - 33, width: 690, height: 66, borderRadius: 33, boxShadow: `inset 0 0 0 1.5px ${t > 6.9 ? "rgba(255,90,78,.55)" : LINE}`, background: SURF }}>
                    <div style={{ position: "absolute", left: 30, top: 0, height: 66, display: "flex", alignItems: "center", ...lbl(CREAM, 28, 400), opacity: 1 - sent }}>
                      {typed.length ? typed : <span style={{ color: DIM }}>Say something</span>}{t > 6.9 && t < 8.6 && Math.floor(t * 2.4) % 2 === 0 && <span style={{ width: 3, height: 34, background: CORAL, marginLeft: 3 }} />}</div></div>
                  {sendOn && t < 9.0 && <div style={{ position: "absolute", left: sendX - 33, top: inputY - 33, width: 66, height: 66, borderRadius: 33, background: CORAL, display: "flex", alignItems: "center", justifyContent: "center",
                    transform: `scale(${Math.min(1.08, pop(t, 7.02, 0.35)) * (1 - 0.1 * Math.max(0, Math.min(1, press)) * (t < 8.7 ? 1 : 0))})`, boxShadow: `0 0 ${24 + 30 * Math.max(0, 1 - Math.abs(t - 8.45) * 4)}px rgba(255,90,78,.7)` }}><Icon k="send" s={36} c={DARK} /></div>}
                  {t > 8.45 && t < 8.95 && <div style={{ position: "absolute", left: sendX - 50, top: inputY - 50, width: 100, height: 100, borderRadius: "50%", boxShadow: `0 0 0 2px ${CORAL}`, transform: `scale(${0.5 + prog(t, 8.45, 8.9) * 1.8})`, opacity: 1 - prog(t, 8.45, 8.9) }} />}
                </div></Foc>
              </>}
              <Foc cam={cam} y={rt + 36} half={50}><div style={{ position: "absolute", left: 0, top: 0, opacity: live(4) }}>
                <div style={{ position: "absolute", left: CARD.l + 8, top: rt + 138, ...lbl(DIM, 30, 600) }}>Recently</div></div></Foc>
            </>}
          </World>
        </AbsoluteFill>}
        {/* the point: the send button hands over to a screen-space dot that travels to the text */}
        {t >= 8.95 && t < 12.0 && <div style={{ position: "absolute", left: lerp(sendScr.x, 540, toC) - lerp(42, 14, toC), top: lerp(sendScr.y, 800, toC) - lerp(42, 14, toC), width: lerp(84, 28, toC), height: lerp(84, 28, toC), borderRadius: "50%", background: CORAL,
          boxShadow: `0 0 ${20 + 20 * toC}px rgba(255,90,78,.8)` }} />}
        <Line a={9.55} b={10.45} ws={["Right", "now", null, "are", "listening."]} size={54} c={[4]} />
        <Line a={10.5} b={11.1} ws={["Say", "something."]} size={64} c={[1]} />
        <Line a={11.15} b={11.9} ws={["Mid-song."]} size={104} wt={800} />
        {/* logo: the point becomes the disc, the disc slides left, the wordmark reveals */}
        {t >= 11.95 && <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - logoOut, filter: `blur(${logoOut * 10}px)` }}>
          <div style={{ position: "absolute", left: discX - discD / 2, top: discY - discD / 2, width: discD, height: discD, borderRadius: "50%", background: CORAL, boxShadow: `0 0 ${30 + 20 * dd}px rgba(255,90,78,.65)` }}>
            {dd > 0.7 && <svg width={discD} height={discD} viewBox="0 0 150 150" style={{ position: "absolute", opacity: prog(dd, 0.7, 1) }}><path d="M 22 75 C 42 40, 58 110, 75 75 S 108 40, 128 75" fill="none" stroke={DARK} strokeWidth={11} strokeLinecap="round" /></svg>}</div>
          <div style={{ position: "absolute", left: 345, top: 960 - 100, height: 200, overflow: "hidden", clipPath: `inset(0 ${(1 - wm) * 100}% 0 0)`, opacity: wm, filter: `blur(${(1 - wm) * 12}px)`, ...lbl(CREAM, 160, 900), letterSpacing: "-0.05em", fontStretch: "118%", lineHeight: "200px" }}>halyn</div>
          <div style={{ position: "absolute", left: 345 + 410, top: 960 - 96, ...lbl(CORAL, 42, 700), transform: `scale(${Math.min(1.05, sup)})`, transformOrigin: "0 100%", opacity: Math.min(1, sup) }}>live</div>
        </div>}
        {/* loop: the end frame is the first frame */}
        {t >= 13.6 && <AbsoluteFill style={{ opacity: prog(t, 13.6, 14.0), pointerEvents: "none" }}>
          <World cam={KEYS[0] as Cam} id="sl2" blur={0}><Pills t={0} fade={1} /></World></AbsoluteFill>}
      </AbsoluteFill>
    </Finish>
  );
};
