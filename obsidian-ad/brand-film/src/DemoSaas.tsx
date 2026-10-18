// DEMO-SAAS (9:16, 30 fps, 20 s): showcase film for a fictional revenue SaaS "Linewise" (Gumroad demo; no real brand).
// Light world for contrast with the dark music demo. Locked rules: one focus point — the blue cursor dot — carries every
// beat (L6); text lives in the UI and in the scene (L9); no voice, the picture breathes (L5); transitions mean something
// (L11): click → button opens into onboarding (track matte) → drags connect the data → the hub becomes the chart's first
// point → pull-back reveals the dashboard → the dot rides the revenue line → crash zoom on the total → a "deal won" toast is
// clicked → flip-to-edge into the phone → the dot swells into the blue world → mark + "Start free".
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { SM, MV, cl, prog, Finish, pop, camAt, World, At, Thread, threadHead, Matte, lerpBox, screenOf, CamKey } from "./fx";

export const FPSS = 30, DURS = 20;
const BG = "#F4F5F8", INK = "#0B0D12", DIM = "#6B7180", LINE = "#E3E6EC", BLUE = "#2F6BFF", DEEP = "#0A1330", GREEN = "#12B76A";
const F = "ArchivoW, Helvetica, Arial, sans-serif";
const IN = Easing.bezier(0.55, 0, 1, 0.45), CRASH = Easing.bezier(0.2, 0.9, 0.3, 1);
const win = (t: number, a: number, b: number) => t >= a && t < b;
const Dot: React.FC<{ x: number; y: number; d?: number; s?: number; c?: string }> = ({ x, y, d = 26, s = 1, c = BLUE }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: c, transform: `scale(${s})`, boxShadow: `0 0 0 6px rgba(47,107,255,.18), 0 8px 24px rgba(47,107,255,.45)` }} />
);
const Ring: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = prog(t, at, at + 0.45); if (k <= 0 || k >= 1) return null;
  return <div style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: "50%", boxShadow: `0 0 0 2px ${BLUE}`, transform: `scale(${0.4 + k * 1.6})`, opacity: 1 - k }} />;
};
const card: React.CSSProperties = { background: "#FFFFFF", borderRadius: 28, boxShadow: `0 0 0 1.5px ${LINE}, 0 30px 80px rgba(16,24,40,.10)` };

// ── onboarding: chips connect to a hub ──
const CHIPS = [{ x: 250, y: 780, l: "Payments", shape: "sq", c: "#0B0D12" }, { x: 830, y: 780, l: "CRM", shape: "ci", c: "#F79009" }, { x: 540, y: 1330, l: "Billing", shape: "tr", c: GREEN }];
const HUB = { x: 540, y: 1000 };
const Chip: React.FC<{ c: typeof CHIPS[number]; s: number; on: boolean }> = ({ c, s, on }) => (
  <div style={{ position: "absolute", left: c.x - 120, top: c.y - 46, width: 240, height: 92, ...card, borderRadius: 46, display: "flex", alignItems: "center", gap: 16, paddingLeft: 22, transform: `scale(${s})`,
    boxShadow: on ? `0 0 0 2.5px ${BLUE}, 0 20px 50px rgba(47,107,255,.2)` : card.boxShadow }}>
    <div style={{ width: 44, height: 44, borderRadius: c.shape === "ci" ? 22 : 10, background: c.c, clipPath: c.shape === "tr" ? "polygon(50% 8%, 95% 90%, 5% 90%)" : undefined }} />
    <span style={{ fontFamily: F, fontSize: 32, fontWeight: 600, color: INK }}>{c.l}</span>
  </div>
);

// ── dashboard world (1000 × 1500 card centred on 0,0) ──
const PTS = [[-400, 330], [-300, 300], [-200, 316], [-100, 240], [0, 250], [100, 170], [200, 120], [300, 60], [400, -10]];
const LD = (() => { let d = `M ${PTS[0][0]} ${PTS[0][1]}`; for (let i = 0; i < PTS.length - 1; i++) { const p0 = PTS[Math.max(0, i - 1)], p1 = PTS[i], p2 = PTS[i + 1], p3 = PTS[Math.min(PTS.length - 1, i + 2)];
  d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`; } return d; })();
const rideU = (t: number) => SM(prog(t, 7.6, 10.0, (x) => x));
const KD: CamKey[] = [{ t: 5.1, x: -400, y: 330, z: 2.6, r: 0 }, { t: 5.35, x: -400, y: 330, z: 2.5, r: 0 }, { t: 7.4, x: 0, y: 40, z: 1, r: 0, e: MV },
  { t: 9.95, x: 40, y: 20, z: 1.05, r: 0 }, { t: 10.18, x: -320, y: -505, z: 1.55, r: -3, e: CRASH }, { t: 11.0, x: 60, y: -260, z: 1.12, r: -1 }, { t: 11.6, x: 0, y: -40, z: 1, r: 0, e: MV }];
const Dashboard: React.FC<{ t: number }> = ({ t }) => {
  const cam = camAt(KD, t), prev = camAt(KD, t - 1 / FPSS), u = rideU(t), count = prog(t, 5.6, 10.1, SM), land = pop(t, 10.15, 0.45);
  const tilt = 14 * Math.sin(Math.PI * prog(t, 7.6, 10.1));
  const toast = prog(t, 10.6, 11.0, Easing.out(Easing.back(1.4))), clickT = 12.0, flip = 90 * prog(t, 12.15, 12.45, IN);
  const curX = t < 11.2 ? threadHead(LD, u).x : 400 + (250 - 400) * prog(t, 11.2, 11.9, MV), curY = t < 11.2 ? threadHead(LD, u).y : -10 + (-545 - -10) * prog(t, 11.2, 11.9, MV);
  const KPIS = [["Revenue", 482190, "$"], ["Active accounts", 1284, ""], ["Net retention", 118, "%"]] as const;
  return (
    <AbsoluteFill style={{ background: BG, perspective: 1800 }}>
      <AbsoluteFill style={{ transform: `rotateX(${tilt}deg) rotateY(${flip}deg)`, transformOrigin: "50% 60%" }}>
        <World cam={cam} prev={prev} id="dash" blur={0.1}>
          <At x={0} y={0}><div style={{ width: 1000, height: 1500, ...card, borderRadius: 40 }} /></At>
          {/* sidebar + header */}
          <div style={{ position: "absolute", left: -470, top: -720, display: "flex", alignItems: "center", gap: 14, fontFamily: F, fontSize: 30, fontWeight: 700, color: INK }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: BLUE }} />Linewise</div>
          <div style={{ position: "absolute", left: 120, top: -716, display: "flex", gap: 26, fontFamily: F, fontSize: 24, color: DIM }}><span style={{ color: INK, fontWeight: 600 }}>Overview</span><span>Deals</span><span>Forecast</span></div>
          <div style={{ position: "absolute", left: -470, top: -640, width: 940, height: 1.5, background: LINE }} />
          {/* KPI row */}
          {KPIS.map(([l, v, u0], i) => (
            <div key={l} style={{ position: "absolute", left: -470 + i * 320, top: -600, width: 300, height: 190, borderRadius: 22, background: i === 0 ? BLUE : "#F7F8FA", boxShadow: i === 0 ? "0 20px 50px rgba(47,107,255,.3)" : `0 0 0 1.5px ${LINE}`, padding: 24, boxSizing: "border-box",
              transform: i === 0 ? `scale(${1 + 0.04 * Math.max(0, land - 1)})` : undefined, transformOrigin: "0 0" }}>
              <div style={{ fontFamily: F, fontSize: 22, color: i === 0 ? "rgba(255,255,255,.8)" : DIM }}>{l}</div>
              <div style={{ fontFamily: F, fontSize: i === 0 ? 54 : 50, fontWeight: 800, fontStretch: "108%", letterSpacing: "-0.035em", color: i === 0 ? "#fff" : INK, marginTop: 18, fontVariantNumeric: "tabular-nums" }}>
                {u0 === "$" ? "$" : ""}{Math.round(v * count).toLocaleString("en-US")}{u0 === "%" ? "%" : ""}</div>
              <div style={{ fontFamily: F, fontSize: 20, color: i === 0 ? "rgba(255,255,255,.85)" : GREEN, marginTop: 10 }}>{["+12.4% vs last month", "+86 this week", "+3 pts"][i]}</div>
            </div>
          ))}
          {/* revenue chart */}
          <div style={{ position: "absolute", left: -470, top: -330, fontFamily: F, fontSize: 28, fontWeight: 600, color: INK }}>Revenue, last 9 weeks</div>
          <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}>
            <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(47,107,255,.25)" /><stop offset="1" stopColor="rgba(47,107,255,0)" /></linearGradient></defs>
            {[0, 1, 2, 3].map((k) => <line key={k} x1={-440} x2={440} y1={400 - k * 130} y2={400 - k * 130} stroke={LINE} strokeWidth={1.5} />)}
            <path d={`${LD} L 400 400 L -400 400 Z`} fill="url(#ar)" opacity={u} />
          </svg>
          <Thread d={LD} p={Math.max(0.0001, u)} dot={0} color={BLUE} width={5} />
          {/* deals table */}
          {["Atlas Studio", "Northfold", "Kite & Co"].map((n, i) => (
            <div key={n} style={{ position: "absolute", left: -470, top: 480 + i * 70, width: 940, display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: 26, color: INK, borderTop: `1.5px solid ${LINE}`, paddingTop: 18 }}>
              <span>{n}</span><span style={{ color: DIM }}>{["Won", "Proposal", "Call booked"][i]}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{["$24,000", "$18,500", "$9,200"][i]}</span></div>
          ))}
          {/* the toast that gets clicked */}
          {toast > 0 && <div style={{ position: "absolute", left: 30, top: -640 - 40 + 80 * toast, width: 440, height: 110, ...card, borderRadius: 24, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", boxSizing: "border-box", opacity: Math.min(1, toast),
            transform: `scale(${1 - 0.04 * Math.max(0, Math.min(1, pop(t, clickT, 0.3)))})`, boxShadow: t > clickT ? `0 0 0 3px ${BLUE}, 0 30px 70px rgba(16,24,40,.18)` : card.boxShadow }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 30, fontWeight: 800 }}>✓</div>
            <div style={{ fontFamily: F }}><div style={{ fontSize: 26, fontWeight: 700, color: INK }}>Deal won</div><div style={{ fontSize: 22, color: DIM }}>Atlas Studio, $24,000</div></div>
          </div>}
          {/* the focus point: rides the line, then goes to the toast */}
          {t > 5.1 && <Dot x={curX} y={curY} d={28} />}
        </World>
        <Ring t={t} at={clickT} x={screenOf(cam, 250, -545, 1080, 1920).x} y={screenOf(cam, 250, -545, 1080, 1920).y} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const DemoSaas: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  // 0–2.3: dot → button → click → opens into onboarding
  const btn = pop(t, 0.6, 0.5), mv = prog(t, 0.3, 1.25, MV), click = pop(t, 1.35, 0.3), open = prog(t, 1.55, 2.25, MV);
  // 2.3–5.2: chips connect
  const chipIn = CHIPS.map((_, i) => pop(t, 2.45 + i * 0.3, 0.45));
  const legs = CHIPS.map((_, i) => prog(t, 3.3 + i * 0.45, 3.68 + i * 0.45, MV)), hubOn = prog(t, 4.75, 5.0);
  const dotPos = (() => {
    if (t < 3.3) return { x: 540 + (CHIPS[0].x - 540) * prog(t, 2.6, 3.2, MV), y: 960 + (CHIPS[0].y - 960) * prog(t, 2.6, 3.2, MV) };
    for (let i = 0; i < 3; i++) {
      const a = 3.3 + i * 0.45; if (t < a + 0.45) { const k = legs[i], c = CHIPS[i]; return { x: c.x + (HUB.x - c.x) * k, y: c.y + (HUB.y - c.y) * k }; }
    }
    return HUB;
  })();
  // 12.4–15.6 phone, 15.4 blue world, 17.6 mark
  const ph = prog(t, 12.45, 12.9, Easing.out(Easing.cubic)), orbit = 18 - 30 * prog(t, 12.5, 15.4, SM), iris = prog(t, 15.2, 15.9, IN);
  const l1 = prog(t, 16.0, 16.5), l2 = prog(t, 16.6, 17.1), mark = pop(t, 17.8, 0.5), word = prog(t, 18.0, 18.5, MV), cta = pop(t, 18.7, 0.5);
  return (
    <Finish t={t} hits={[1.35, 4.75, 10.15, 12.0, 17.8]} glitches={[]} ca={0.3} grain={0.04} vignette={0.18} shake={7}>
      <AbsoluteFill style={{ background: BG }}>
        {/* 0–2.3 */}
        {t < 2.3 && <>
          <div style={{ position: "absolute", left: 540 - 70, top: 960 - 70, width: 140, height: 140, borderRadius: 70, background: "#fff", boxShadow: `0 0 0 1.5px ${LINE}, 0 30px 70px rgba(16,24,40,.12)`, transform: `scale(${Math.min(1.08, btn) * (1 - 0.08 * Math.max(0, Math.min(1, click)))})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 70, fontWeight: 300, color: INK }}>+</div>
          <Dot x={540 + 260 * (1 - mv)} y={960 + 420 * (1 - mv)} s={pop(t, 0.15, 0.4) * (1 - prog(t, 1.4, 1.55))} />
          <Ring t={t} at={1.35} x={540} y={960} />
        </>}
        {/* 1.55–5.3: onboarding inside the opened button (track matte) */}
        {win(t, 1.55, 5.35) && <Matte box={lerpBox({ x: 540, y: 960, w: 140, h: 140, r: 70 }, { x: 540, y: 1000, w: 940, h: 1260, r: 44 }, open)}>
          <AbsoluteFill style={{ background: "#fff" }}>
            <div style={{ position: "absolute", left: 0, width: 1080, top: 470, textAlign: "center", fontFamily: F, fontSize: 56, fontWeight: 700, letterSpacing: "-0.025em", color: INK, opacity: prog(t, 2.0, 2.4) }}>Connect your data</div>
            <div style={{ position: "absolute", left: 0, width: 1080, top: 548, textAlign: "center", fontFamily: F, fontSize: 30, color: DIM, opacity: prog(t, 2.15, 2.55) }}>Three sources. One number you can trust.</div>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              {CHIPS.map((c, i) => legs[i] > 0 && <line key={i} x1={c.x} y1={c.y} x2={c.x + (HUB.x - c.x) * legs[i]} y2={c.y + (HUB.y - c.y) * legs[i]} stroke={BLUE} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />)}
            </svg>
            <div style={{ position: "absolute", left: HUB.x - 70, top: HUB.y - 70, width: 140, height: 140, borderRadius: 70, background: hubOn > 0 ? BLUE : "#fff", boxShadow: `0 0 0 ${hubOn > 0 ? 0 : 2}px ${LINE}, 0 20px 60px rgba(47,107,255,${0.15 + 0.3 * hubOn})`,
              transform: `scale(${1 + 0.1 * Math.max(0, pop(t, 4.75, 0.4) - 1)})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 64, fontWeight: 800, fontFamily: F }}>{hubOn > 0 ? "✓" : ""}</div>
            {CHIPS.map((c, i) => <Chip key={c.l} c={c} s={Math.min(1.05, chipIn[i])} on={legs[i] > 0} />)}
            {t > 2.6 && <Dot x={dotPos.x} y={dotPos.y} s={1 - hubOn} />}
            <div style={{ position: "absolute", left: 0, width: 1080, top: 1440, textAlign: "center", fontFamily: F, fontSize: 30, fontWeight: 600, color: GREEN, opacity: hubOn }}>Connected</div>
          </AbsoluteFill>
        </Matte>}
        {/* 5.1–12.6: dashboard (the hub became the chart's first point) */}
        {win(t, 5.1, 12.5) && <AbsoluteFill style={{ opacity: prog(t, 5.1, 5.35) }}><Dashboard t={t} /></AbsoluteFill>}
        {/* 12.45–15.9: the phone */}
        {win(t, 12.45, 15.95) && <AbsoluteFill style={{ perspective: 1800 }}>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 130, textAlign: "center", fontFamily: F, fontWeight: 800, fontStretch: "110%", fontSize: 76, lineHeight: 1.0, letterSpacing: "-0.04em", color: INK, opacity: prog(t, 12.8, 13.3), filter: `blur(${(1 - prog(t, 12.8, 13.3)) * 10}px)` }}>Forecasts that<br />update themselves.</div>
          <div style={{ position: "absolute", left: 540 - 290, top: 1010 - 590, width: 580, height: 1180, borderRadius: 78, background: "#0B0D12", padding: 16, boxSizing: "border-box", transform: `rotateY(${-90 * (1 - ph) + orbit}deg)`, boxShadow: "0 60px 140px rgba(16,24,40,.35)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 62, background: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 36, top: 80, fontFamily: F, fontSize: 24, color: DIM }}>Deal won</div>
              <div style={{ position: "absolute", left: 36, top: 116, fontFamily: F, fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", color: INK }}>Atlas Studio</div>
              <div style={{ position: "absolute", left: 36, top: 186, fontFamily: F, fontSize: 92, fontWeight: 800, fontStretch: "110%", letterSpacing: "-0.045em", color: BLUE, fontVariantNumeric: "tabular-nums" }}>${Math.round(24000 * prog(t, 12.8, 13.6, SM)).toLocaleString("en-US")}</div>
              <div style={{ position: "absolute", left: 36, right: 36, top: 330, height: 1.5, background: LINE }} />
              <div style={{ position: "absolute", left: 36, top: 360, fontFamily: F, fontSize: 26, fontWeight: 600, color: INK }}>Q4 forecast</div>
              <svg width={500} height={260} style={{ position: "absolute", left: 30, top: 410 }}>
                <path d="M 0 220 C 80 200, 120 170, 190 150 S 320 90, 500 30" fill="none" stroke={BLUE} strokeWidth={5} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - prog(t, 13.2, 14.4, SM))} />
                <path d="M 190 150 S 320 90, 500 30" fill="none" stroke="rgba(47,107,255,.25)" strokeWidth={22} strokeLinecap="round" />
              </svg>
              {["On track for $612k", "Updated 2 minutes ago"].map((s, i) => <div key={s} style={{ position: "absolute", left: 36, top: 720 + i * 46, fontFamily: F, fontSize: i ? 22 : 30, fontWeight: i ? 400 : 600, color: i ? DIM : INK, opacity: prog(t, 14.0 + i * 0.2, 14.4 + i * 0.2) }}>{s}</div>)}
              <Dot x={516} y={440} d={30} s={pop(t, 14.4, 0.4)} />
            </div>
          </div>
        </AbsoluteFill>}
        {/* 15.2–20: the dot swells into the blue world; two lines; the mark */}
        {t >= 15.2 && <div style={{ position: "absolute", left: 790 - 2400 * iris, top: 1010 - 590 + 16 + 440 - 2400 * iris, width: 4800 * iris, height: 4800 * iris, borderRadius: "50%", background: DEEP }} />}
        {t >= 15.9 && <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 48%, #18306F 0%, ${DEEP} 60%, #050913 100%)` }}>
          <div style={{ position: "absolute", left: 80, right: 80, top: 640, fontFamily: F, fontWeight: 800, fontStretch: "115%", fontSize: 96, lineHeight: 0.98, letterSpacing: "-0.045em", color: "#fff", opacity: 1 - prog(t, 17.4, 17.7) }}>
            <div style={{ opacity: l1, filter: `blur(${(1 - l1) * 12}px)` }}>Know your numbers</div>
            <div style={{ opacity: l2, filter: `blur(${(1 - l2) * 12}px)`, color: "#9CB6FF" }}>before the meeting.</div>
          </div>
          {t > 17.7 && <>
            <div style={{ position: "absolute", left: 540 - 60, top: 760, width: 120, height: 120, borderRadius: 34, background: BLUE, transform: `scale(${Math.min(1.06, mark)})`, boxShadow: "0 20px 80px rgba(47,107,255,.6)" }}>
              <svg width={120} height={120}><path d="M 26 84 L 50 60 L 66 72 L 94 38" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            <div style={{ position: "absolute", left: 0, width: 1080, top: 920, textAlign: "center", fontFamily: F, fontWeight: 800, fontStretch: "112%", fontSize: 110, letterSpacing: "-0.045em", color: "#fff", opacity: word, filter: `blur(${(1 - word) * 12}px)` }}>Linewise</div>
            {cta > 0 && <div style={{ position: "absolute", left: 540 - 160, top: 1110, width: 320, height: 92, borderRadius: 46, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 34, fontWeight: 600, color: DEEP, transform: `scale(${Math.min(1.05, cta)})` }}>Start free</div>}
          </>}
        </AbsoluteFill>}
      </AbsoluteFill>
    </Finish>
  );
};
