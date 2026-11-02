// DEMO-MUSIC (9:16, 30 fps, 20 s): showcase film for a fictional music app "Halyn" (Gumroad demo; no real brand).
// Locked rules: one focus point (L6), text lives in the scene (L9), no voice so the picture breathes (L5), object → object
// transitions that mean something (L11). Everything moves on a 120 bpm grid (beat = 0.5 s) that audio/demos/music_beat.py plays.
//  0.0 a coral dot pulses on the kick → 2.0 it morphs into a play button → press → 2.6 the button stretches into a live
//  waveform; the camera rides it past a giant "press play" → 5.0 the peaks lift into five album covers on a 3D ring that
//  snaps a turn per bar → 8.0 the front cover flips to edge → 8.6 "Now playing" on a phone: the scrubber dot runs, lyrics light
//  word by word, the EQ bounces → 13.0 pull back into floating mixes → 15.5 the cover crops to a circle = a spinning record →
//  17.0 the record's label becomes the Halyn mark → wordmark + line + download pill.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import "./fonts";
import { SM, MV, cl, prog, hash, Finish, Dust, pop, camAt, World, CamKey } from "./fx";

export const FPSM = 30, DURM = 20;
const BG = "#050507", CORAL = "#FF5A4E", AMBER = "#FFB347", CREAM = "#FFF4E8", DIM = "#9C9089";
const F = "ArchivoW, Helvetica, Arial, sans-serif";
const BEAT = 0.5;
const beatPulse = (t: number, from = 0.5) => { if (t < from) return 0; const ph = ((t - from) % BEAT) / BEAT; return Math.exp(-ph * 7); };
const IN = Easing.bezier(0.55, 0, 1, 0.45);

// shape morph through sampled points (circle → triangle), same point count so it never tears
const N = 72;
const circlePts = (r: number) => Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2 - Math.PI / 2; return [Math.cos(a) * r, Math.sin(a) * r]; });
const triPts = (r: number) => {
  const V = [[r * 0.95, 0], [-r * 0.55, -r * 0.85], [-r * 0.55, r * 0.85]];
  return Array.from({ length: N }, (_, i) => { const u = (i / N) * 3, k = Math.floor(u), f = u - k, a = V[k % 3], b = V[(k + 1) % 3]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; });
};
const C0 = circlePts(60), T0 = (() => { const p = triPts(80); const s = p.findIndex(([x, y]) => y <= 0 && x > 0); return p.map((_, i) => p[(i + s) % N]); })();
const morphD = (k: number) => "M " + C0.map((c, i) => `${(c[0] + (T0[i][0] - c[0]) * k).toFixed(1)} ${(c[1] + (T0[i][1] - c[1]) * k).toFixed(1)}`).join(" L ") + " Z";

// generative album covers (code-made art, not stock)
const COVERS = [
  { t: "Low Tide", a: "Mara Vey", c1: CORAL, c2: "#2A0F14", kind: 0 }, { t: "Night Drive", a: "Oslo Park", c1: "#3D7BFF", c2: "#0A1024", kind: 1 },
  { t: "Gold Hour", a: "Juno & Bly", c1: AMBER, c2: "#2B1704", kind: 2 }, { t: "Static", a: "Teo Vance", c1: "#E9E3DA", c2: "#141416", kind: 3 },
  { t: "Bloom", a: "Sela", c1: "#FF8FA3", c2: "#2A0D17", kind: 1 },
];
const Cover: React.FC<{ i: number; size: number; t: number; radius?: number }> = ({ i, size, t, radius = 22 }) => {
  const c = COVERS[i % COVERS.length], s = size, k = c.kind;
  return (
    <div style={{ position: "relative", width: s, height: s, borderRadius: radius, overflow: "hidden", background: `radial-gradient(120% 120% at 20% 10%, ${c.c1} 0%, ${c.c2} 70%)` }}>
      {k === 0 && <div style={{ position: "absolute", left: s * 0.18, top: s * 0.42, width: s * 0.64, height: s * 0.64, borderRadius: "50%", background: CREAM, mixBlendMode: "overlay", transform: `translateY(${Math.sin(t * 2) * 6}px)` }} />}
      {k === 1 && Array.from({ length: 7 }, (_, j) => <div key={j} style={{ position: "absolute", left: 0, right: 0, top: s * (0.2 + j * 0.1), height: 3, background: "rgba(255,255,255,.55)", transform: `scaleX(${0.3 + 0.7 * hash(j, i)})`, transformOrigin: "0 50%" }} />)}
      {k === 2 && <div style={{ position: "absolute", left: s * 0.1, top: s * 0.1, width: s * 0.8, height: s * 0.8, borderRadius: "50%", border: `${s * 0.05}px solid rgba(255,244,232,.8)`, boxSizing: "border-box" }} />}
      {k === 3 && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.85) 0 6px, transparent 6px 14px)" }} />}
      <div style={{ position: "absolute", left: s * 0.08, bottom: s * 0.07, fontFamily: F, fontWeight: 800, fontStretch: "118%", fontSize: s * 0.11, letterSpacing: "-0.03em", color: k === 3 ? "#000" : CREAM, lineHeight: 1 }}>{c.t}</div>
    </div>
  );
};

// the live waveform (world px): amplitude follows the beat
const wave = (x: number, t: number) => {
  const env = 0.35 + 0.65 * beatPulse(t);
  return Math.sin(x * 0.012 - t * 6) * 70 * env + Math.sin(x * 0.031 + t * 3) * 34 * env + noise2D("w", x * 0.004, t * 0.6) * 40;
};
const HEAD = (t: number) => 2600 * Easing.bezier(0.45, 0, 0.3, 1)(prog(t, 2.6, 5.0, (x) => x));

export const DemoMusic: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const kick = beatPulse(t);
  // ── 0–2.6: dot → play button → press ──
  const morph = prog(t, 2.0, 2.35, MV), press = pop(t, 2.45, 0.3);
  // ── 2.6–5.0: waveform ride ──
  const hx = HEAD(t);
  const KW: CamKey[] = [{ t: 2.5, x: 0, y: 0, z: 1, r: 0 }, { t: 5.0, x: 2600, y: 0, z: 0.82, r: -3, e: Easing.bezier(0.45, 0, 0.3, 1) }];
  const camW = camAt(KW, t), prevW = camAt(KW, t - 1 / FPSM);
  // ── 5.0–8.6: covers ring ──
  const lift = prog(t, 4.6, 5.4, MV), bar = Math.max(0, Math.floor((t - 5.4) / 1.0)), into = prog(t, 5.4 + bar, 5.75 + bar, Easing.bezier(0.2, 1.4, 0.4, 1));
  const spin = -72 * Math.min(3, bar + (t > 5.4 ? into : 0)), flip = 90 * prog(t, 8.05, 8.4, IN);
  // ── 8.6–15.5: phone ──
  const phoneIn = prog(t, 8.4, 8.9, Easing.out(Easing.cubic)), orbit = -14 + 26 * prog(t, 8.6, 13.0, SM), pull = prog(t, 13.0, 14.6, MV);
  const scrub = prog(t, 8.8, 15.3, (x) => x);
  const LYR = ["we", "were", "the", "sound", "of", "a", "city", "at", "night"];
  // ── 15.5–20: record → mark ──
  const rec = prog(t, 15.45, 15.9, MV), recSpin = (t - 15.5) * 220, toMark = prog(t, 16.9, 17.6, MV), word = prog(t, 17.4, 18.0, MV), line = prog(t, 18.0, 18.6), cta = pop(t, 18.7, 0.5);

  return (
    <Finish t={t} hits={[2.45, 8.4, 15.5, 17.0]} glitches={[[8.33, 0.16]]} ca={0.6} grain={0.06} vignette={0.5} shake={9}>
      <AbsoluteFill style={{ background: BG }}>
        <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% ${t < 8.6 ? 50 : 42}%, rgba(255,90,78,${0.1 + 0.18 * kick}) 0%, rgba(255,90,78,0) 70%)` }} />
        <Dust t={t} n={70} />
        {/* 0–2.6 */}
        {t < 2.75 && <div style={{ position: "absolute", left: 540, top: 960, transform: `scale(${(1 + 0.18 * kick * (1 - morph)) * (1 - 0.12 * Math.max(0, Math.min(1, press)) * (t < 2.6 ? 1 : 0))})` }}>
          <svg width={1} height={1} style={{ overflow: "visible", position: "absolute" }}>
            <path d={morphD(morph)} fill={CORAL} transform={`scale(${0.42 + 0.58 * morph})`} style={{ filter: `drop-shadow(0 0 ${30 + 40 * kick}px rgba(255,90,78,.8))` }} />
          </svg>
          {t > 2.45 && <div style={{ position: "absolute", left: -120, top: -120, width: 240, height: 240, borderRadius: "50%", boxShadow: `0 0 0 3px ${CREAM}`, transform: `scale(${0.5 + prog(t, 2.45, 2.75) * 1.6})`, opacity: 1 - prog(t, 2.45, 2.75) }} />}
        </div>}
        {/* 2.6–5.4: the waveform; giant type in the scene behind it */}
        {win(t, 2.55, 5.6) && <World cam={camW} prev={prevW} id="wv">
          <div style={{ position: "absolute", left: 500, top: -320, whiteSpace: "nowrap", fontFamily: F, fontWeight: 900, fontStretch: "125%", fontSize: 360, letterSpacing: "-0.05em", color: "transparent", WebkitTextStroke: `3px rgba(255,244,232,${0.35 * prog(t, 2.8, 3.4)})` }}>press play</div>
          <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}>
            <path d={"M " + Array.from({ length: 140 }, (_, i) => { const x = i * 22 - 60; const on = x < hx + 40; return `${x} ${on ? wave(x, t) * cl((hx + 40 - x) / 200) * (1 - lift * 0.4) : 0}`; }).join(" L ")}
              fill="none" stroke={CORAL} strokeWidth={6} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 18px rgba(255,90,78,.8))" }} opacity={1 - prog(t, 5.2, 5.6)} />
            <circle cx={hx} cy={wave(hx, t) * 0.2} r={14} fill={CREAM} style={{ filter: "drop-shadow(0 0 20px #fff)" }} opacity={1 - lift} />
          </svg>
        </World>}
        {/* 5.0–8.6: covers on a ring */}
        {win(t, 4.7, 8.65) && <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 45%" }}>
          <div style={{ position: "absolute", left: 540, top: 900, transformStyle: "preserve-3d", transform: `translateY(${(1 - lift) * 500}px) scale(${0.5 + 0.5 * lift}) translateZ(-560px) rotateX(-6deg) rotateY(${spin}deg)` }}>
            {COVERS.map((_, i) => { const a = (((i * 72 + spin) % 360) + 360) % 360, c = Math.cos((a * Math.PI) / 180), front = a < 1 || a > 359;
              return <div key={i} style={{ position: "absolute", left: -230, top: -230, transform: `rotateY(${i * 72}deg) translateZ(560px) rotateY(${front ? flip : 0}deg)`, filter: `brightness(${0.35 + 0.65 * Math.max(0, c)}) blur(${(1 - c) * 2.5}px)`, backfaceVisibility: "hidden" }}>
                <Cover i={(i + 2) % 5} size={460} t={t} />
              </div>; })}
          </div>
        </AbsoluteFill>}
        {/* 8.6–15.6: now playing */}
        {win(t, 8.4, 15.6) && <AbsoluteFill style={{ perspective: 1800 }}>
          {pull > 0 && ["Daily Mix", "Made for you", "Night drive", "Focus", "Gold hour", "Late"].map((m, i) => {
            const a = (i / 6) * Math.PI * 2 + 0.4, r = 640 * pull, x = 540 + Math.cos(a) * r, y = 960 + Math.sin(a) * r * 1.25 + Math.sin(t * 1.3 + i) * 10;
            return <div key={m} style={{ position: "absolute", left: x - 120, top: y - 150, opacity: pull, transform: `scale(${0.7 + 0.3 * pull}) rotate(${(hash(i, 3) - 0.5) * 10}deg)` }}>
              <Cover i={i + 1} size={240} t={t} radius={16} /><div style={{ fontFamily: F, fontSize: 26, color: CREAM, marginTop: 10 }}>{m}</div></div>; })}
          <div style={{ position: "absolute", left: 540 - 300, top: 960 - 610, width: 600, height: 1220, borderRadius: 80, background: "#0D0B0C", overflow: "hidden", boxShadow: "inset 0 0 0 2px #2A2426, 0 60px 160px rgba(0,0,0,.8)",
            transform: `rotateY(${orbit * (1 - pull)}deg) scale(${(0.9 + 0.1 * phoneIn) * (1 - 0.42 * pull)})`, opacity: phoneIn * (1 - prog(t, 15.35, 15.6)) }}>
            <div style={{ position: "absolute", left: 40, right: 40, top: 70, display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: 24, color: DIM }}><span>Now playing</span><span>Low Tide</span></div>
            <div style={{ position: "absolute", left: 40, top: 130 }}><Cover i={0} size={520} t={t} /></div>
            <div style={{ position: "absolute", left: 40, top: 690, fontFamily: F, fontWeight: 700, fontSize: 52, color: CREAM, letterSpacing: "-0.02em" }}>Low Tide</div>
            <div style={{ position: "absolute", left: 40, top: 756, fontFamily: F, fontSize: 30, color: DIM }}>Mara Vey</div>
            {/* EQ bars on the beat */}
            <div style={{ position: "absolute", right: 40, top: 700, display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>{[0, 1, 2, 3].map((j) => <div key={j} style={{ width: 9, borderRadius: 4, background: CORAL, height: 14 + 46 * beatPulse(t + j * 0.12) }} />)}</div>
            {/* scrubber: the focus point */}
            <div style={{ position: "absolute", left: 40, right: 40, top: 850, height: 6, borderRadius: 3, background: "#2A2426" }}><div style={{ width: `${scrub * 100}%`, height: "100%", borderRadius: 3, background: CORAL }} />
              <div style={{ position: "absolute", left: `calc(${scrub * 100}% - 13px)`, top: -10, width: 26, height: 26, borderRadius: 13, background: CREAM, boxShadow: `0 0 ${16 + 20 * kick}px rgba(255,244,232,.9)` }} /></div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 880, display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: 22, color: DIM, fontVariantNumeric: "tabular-nums" }}><span>{`0:${String(Math.floor(scrub * 50)).padStart(2, "0")}`}</span><span>3:12</span></div>
            {/* lyrics light up word by word (text in the scene) */}
            <div style={{ position: "absolute", left: 40, top: 950, width: 520, fontFamily: F, fontWeight: 700, fontSize: 46, lineHeight: 1.15, letterSpacing: "-0.02em", whiteSpace: "normal", overflowWrap: "break-word" }}>
              {LYR.map((w, i) => { const on = t > 9.3 + i * 0.5; return <span key={i} style={{ color: on ? CREAM : "#3A3234", marginRight: 12, textShadow: on && t < 9.3 + i * 0.5 + 0.5 ? "0 0 24px rgba(255,90,78,.9)" : "none" }}>{w}</span>; })}
            </div>
          </div>
        </AbsoluteFill>}
        {/* 15.5–20: record → mark → wordmark */}
        {t >= 15.45 && <AbsoluteFill>
          <div style={{ position: "absolute", left: 540, top: 900 - 140 * toMark, transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * rec) * (1 - 0.72 * toMark)})` }}>
            <div style={{ width: 640, height: 640, borderRadius: "50%", background: `repeating-radial-gradient(circle, #0E0C0D 0 3px, #191617 3px 6px)`, boxShadow: "0 40px 120px rgba(0,0,0,.8), inset 0 0 0 2px #2A2426", transform: `rotate(${recSpin}deg)`, opacity: 1 - toMark, position: "absolute", left: -320, top: -320 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "conic-gradient(from 0deg, transparent 0 20%, rgba(255,255,255,.08) 25%, transparent 30% 70%, rgba(255,255,255,.06) 75%, transparent 80%)", borderRadius: "50%" }} />
            </div>
            {/* the label = the Halyn mark: a coral disc with a wave through it */}
            <div style={{ position: "absolute", left: -110, top: -110, width: 220, height: 220, borderRadius: "50%", background: CORAL, boxShadow: `0 0 ${40 + 40 * kick}px rgba(255,90,78,.7)`, transform: `rotate(${recSpin * (1 - toMark)}deg)` }}>
              <svg width={220} height={220} style={{ position: "absolute" }}><path d="M 30 110 C 60 60, 85 160, 110 110 S 160 60, 190 110" fill="none" stroke={BG} strokeWidth={14} strokeLinecap="round" /></svg>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 900 - 140 + 80, textAlign: "center", fontFamily: F, fontWeight: 900, fontStretch: "120%", fontSize: 150, letterSpacing: "-0.05em", color: CREAM, opacity: word, filter: `blur(${(1 - word) * 14}px)`, transform: `translateY(${(1 - word) * 30}px)` }}>halyn</div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1110, textAlign: "center", fontFamily: F, fontSize: 44, color: CREAM, opacity: line }}>Hear what you've been missing.</div>
          {cta > 0 && <div style={{ position: "absolute", left: 540 - 180, top: 1220, width: 360, height: 96, borderRadius: 48, background: CORAL, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 600, fontSize: 36, color: BG, transform: `scale(${Math.min(1.05, cta)})` }}>Download Halyn</div>}
        </AbsoluteFill>}
      </AbsoluteFill>
    </Finish>
  );
};
const win = (t: number, a: number, b: number) => t >= a && t < b;
