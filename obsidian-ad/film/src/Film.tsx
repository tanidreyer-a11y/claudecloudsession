// OBSIDIAN — "Show the work". UI-controlled ad: a neon cursor (the focal point, start to end) drives every scene:
// it scrolls a tired template site, swipes copies away, flips build toggles, assembles three hero sections on tilted
// planes (NIVO model: images live INSIDE windows, never full frame), scroll-scrubs the studio's own films, and taps
// WhatsApp. Timing is estimated from SCRIPT.md (T in timeline.json) — re-time to the recorded VO.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { theme as t } from "./theme";
import { Finish } from "./components/Layers";
import { EASE, prog, hash } from "./lib/motion";
import T from "./timeline.json";

const P = t.palette;
const SIG = P.accent, DEEP = P.accent2;
const MONO = t.fonts.mono, SANS = t.fonts.display;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const win = (s: number, a: number, b: number, c: number, d: number) => prog(s, a, b) * (1 - prog(s, c, d, EASE.in));
const seq = (name: string, n: number, k: number) => staticFile(`seq/${name}/${String(Math.max(1, Math.min(n, Math.round(1 + k * (n - 1))))).padStart(3, "0")}.jpg`);

// ---------- monotone path helper for the cursor (keys: [t, x, y]) ----------
function path(keys: number[][], s: number): [number, number] {
  if (s <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (s < b[0]) { const k = EASE.inOut(Math.min(1, (s - a[0]) / (b[0] - a[0]))); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; }
  }
  const z = keys[keys.length - 1]; return [z[1], z[2]];
}

// ---------- shared UI pieces ----------
const Browser: React.FC<{ w: number; h: number; url: string; children: React.ReactNode; glow?: number; light?: boolean; style?: React.CSSProperties }> = ({ w, h, url, children, glow = 0, light, style }) => (
  <div style={{ width: w, height: h, borderRadius: 18, overflow: "hidden", background: light ? "#E4E4E2" : "#070509", border: `1px solid ${light ? "#bdbdbb" : "rgba(238,233,241,.12)"}`, boxShadow: `0 50px 120px -30px rgba(0,0,0,.9), 0 0 ${80 * glow}px ${SIG}${glow > 0 ? "55" : "00"}`, position: "relative", ...style }}>
    <div style={{ height: 46, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", background: light ? "#d2d2d0" : "rgba(238,233,241,.04)", borderBottom: `1px solid ${light ? "#c4c4c2" : "rgba(238,233,241,.08)"}` }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: light ? "#a9a9a7" : "rgba(238,233,241,.18)" }} />)}
      <div style={{ marginLeft: 18, flex: 1, maxWidth: 520, height: 28, borderRadius: 14, background: light ? "#ecece9" : "rgba(238,233,241,.06)", display: "flex", alignItems: "center", padding: "0 14px", fontFamily: MONO, fontSize: 15, color: light ? "#6f6f6d" : P.muted, letterSpacing: "0.04em" }}>{url}</div>
    </div>
    <div style={{ position: "absolute", top: 46, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>{children}</div>
  </div>
);

/** The "before": a tired, generic template. `scroll` in px. */
const TemplateSite: React.FC<{ scroll?: number; pulse?: number }> = ({ scroll = 0, pulse = 0 }) => (
  <div style={{ translate: `0 ${-scroll}px`, fontFamily: "Arial, Helvetica, sans-serif", color: "#3c3c3c" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 40px", background: "#fff" }}>
      <div style={{ fontWeight: 700, fontSize: 24, color: "#555" }}>YOUR LOGO</div>
      <div style={{ display: "flex", gap: 28, fontSize: 17, color: "#777" }}>{["Home", "About", "Services", "Contact"].map((x) => <span key={x}>{x}</span>)}</div>
    </div>
    <div style={{ height: 380, background: "#bfc3c6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", outline: pulse > 0 ? `${4 * pulse}px solid ${SIG}` : "none", outlineOffset: -4 }}>
      <svg width="150" height="110" viewBox="0 0 150 110" opacity={0.55}><path d="M5 100 L50 40 L80 75 L100 55 L145 100 Z" fill="#8e9295" /><circle cx="110" cy="25" r="14" fill="#8e9295" /></svg>
      <div style={{ position: "absolute", left: 60, bottom: 60, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.3)" }}>
        <div style={{ fontSize: 46, fontWeight: 700 }}>Welcome to Our Website</div>
        <div style={{ fontSize: 20, marginTop: 8 }}>We are a leading provider of quality solutions.</div>
        <div style={{ display: "inline-block", marginTop: 18, padding: "12px 26px", background: "#6B8E7F", borderRadius: 4, fontSize: 17 }}>Learn More</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 30, padding: "50px 60px", background: "#f2f2f2" }}>
      {["Quality", "Service", "Value"].map((x) => (
        <div key={x} style={{ flex: 1 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: "#cfcfcf", marginBottom: 14 }} />
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{x}</div>
          {[0, 1, 2].map((i) => <div key={i} style={{ height: 10, background: "#d6d6d6", borderRadius: 5, marginBottom: 8, width: `${90 - i * 18}%` }} />)}
        </div>
      ))}
    </div>
    <div style={{ height: 300, background: "#e6e6e6", padding: 60 }}>
      <div style={{ fontSize: 30, fontWeight: 700 }}>About Us</div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 10, background: "#d0d0d0", borderRadius: 5, marginTop: 16, width: `${80 - i * 10}%` }} />)}
    </div>
  </div>
);

/** Placeholder for a client's generated hero image until it arrives (imagery.md). Swap `src` for the real file. */
const HeroImage: React.FC<{ file: string; s: number; t0: number; tint: string; side?: "left" | "right" }> = ({ file, s, t0, side = "left" }) => {
  const k = prog(s, t0, t0 + 3.5, EASE.inOut);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img src={staticFile(`img/${file}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", scale: String(1.03 + 0.06 * k), translate: `${-1.2 * k}% 0` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(2,1,2,.88) 0%, rgba(2,1,2,.55) 38%, transparent 70%), linear-gradient(0deg, rgba(2,1,2,.7), transparent 45%)` }} />
    </div>
  );
};

const Beam: React.FC<{ children: React.ReactNode; size?: number; press?: number; glow?: number }> = ({ children, size = 18, press = 0, glow = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.85}px ${size * 1.6}px`, borderRadius: 999, background: "#0a060c", color: P.ink, fontFamily: MONO, fontSize: size, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap", scale: String(1 - 0.05 * press), boxShadow: `inset 0 0 0 1.5px ${SIG}${glow > 0.5 ? "cc" : "55"}, 0 0 ${30 * glow}px -4px ${SIG}` }}>{children}</div>
);

/** A client hero section that assembles: nav → image wipe → headline words → button. */
const ClientHero: React.FC<{ s: number; t0: number; brand: string; nav: string[]; head: string; cta: string; file: string; tint: string; press?: number }> = ({ s, t0, brand, nav, head, cta, file, tint, press = 0 }) => {
  const img = prog(s, t0 + 0.15, t0 + 1.0, EASE.inOut);
  const navK = prog(s, t0, t0 + 0.6, EASE.out);
  const words = head.split(" ");
  return (
    <div style={{ position: "absolute", inset: 0, background: "#060408" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - img * 100}% 0 0)` }}><HeroImage file={file} s={s} t0={t0} tint={tint} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", opacity: navK, translate: `0 ${(1 - navK) * -16}px` }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.2em", color: P.ink }}>{brand}</div>
        <div style={{ display: "flex", gap: 30, fontFamily: MONO, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: P.muted }}>{nav.map((n) => <span key={n}>{n}</span>)}</div>
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 110, maxWidth: 640 }}>
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 16 }}>
          {words.map((w, i) => {
            const k = prog(s, t0 + 0.7 + i * 0.09, t0 + 1.3 + i * 0.09, EASE.out);
            return <span key={i} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, lineHeight: 1.02, letterSpacing: "-0.03em", color: P.ink, opacity: k, translate: `0 ${(1 - k) * 34}px`, filter: `blur(${(1 - k) * 8}px)` }}>{w}</span>;
          })}
        </div>
        <div style={{ marginTop: 30, opacity: prog(s, t0 + 1.5, t0 + 2.0), scale: String(0.9 + 0.1 * prog(s, t0 + 1.5, t0 + 2.0, EASE.out)) }}>
          <Beam press={press}>{cta}</Beam>
        </div>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ label: string; on: number; s: number }> = ({ label, on }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid rgba(238,233,241,.08)" }}>
    <div style={{ fontFamily: SANS, fontSize: 28, color: on > 0.5 ? P.ink : P.muted, fontWeight: 500 }}>{label}</div>
    <div style={{ width: 84, height: 44, borderRadius: 22, background: on > 0.01 ? `linear-gradient(90deg, ${DEEP}, ${SIG})` : "rgba(238,233,241,.1)", position: "relative", boxShadow: on > 0.5 ? `0 0 26px ${SIG}88` : "none", opacity: 0.4 + 0.6 * Math.max(on, 0.3) }}>
      <div style={{ position: "absolute", top: 5, left: 5 + 40 * EASE.out(on), width: 34, height: 34, borderRadius: 17, background: "#fff" }} />
    </div>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", padding: "12px 20px", borderRadius: 999, background: "rgba(10,6,12,.8)", border: `1px solid ${SIG}66`, fontFamily: MONO, fontSize: 16, letterSpacing: "0.16em", color: P.ink, display: "flex", alignItems: "center", gap: 10, boxShadow: `0 0 24px ${SIG}33`, whiteSpace: "nowrap", ...style }}>
    <span style={{ width: 9, height: 9, borderRadius: 5, background: SIG, boxShadow: `0 0 10px ${SIG}` }} />{children}
  </div>
);

// ---------- the film ----------
export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f / fps;

  // ===== cursor (the focal point) =====
  const CUR = [
    [0.0, 1700, 1150], [0.9, 1500, 860], [1.8, 760, 700], [2.6, 760, 700], [3.2, 1340, 640], [5.4, 1340, 640],
    [6.6, 1160, 600], [9.3, 1200, 470], [9.5, 760, 470], [9.75, 1200, 560], [9.95, 760, 560], [10.2, 1260, 470], [10.4, 820, 470],
    [10.6, 1260, 640], [10.8, 820, 640], [11.0, 1300, 560], [11.2, 860, 560],
    [13.2, 1060, 690], [15.6, 900, 540], [16.2, 868, 412], [16.8, 868, 497], [17.4, 868, 582], [18.0, 868, 667], [18.7, 1428, 790],
    [19.2, 1428, 790], [21.0, 900, 880], [21.6, 900, 880], [24.6, 1060, 880], [25.3, 1060, 880],
    [27.0, 1500, 600], [31.4, 1500, 640], [32.4, 1650, 760], [34.6, 1650, 520], [37.0, 1650, 760],
    [38.2, 1010, 760], [40.6, 1010, 420], [42.0, 1250, 900], [47.0, 960, 935], [49.0, 960, 935], [50.5, 960, 940],
  ];
  const [cx, cy] = path(CUR, s);
  const clicks = [2.6, 9.3, 9.75, 10.2, 10.6, 11.0, 16.2, 16.8, 17.4, 18.0, 18.7, 21.6, 25.3, 47.6];
  const click = clicks.reduce((m, c) => Math.max(m, win(s, c - 0.02, c + 0.06, c + 0.1, c + 0.5)), 0);
  const curO = prog(s, 0.7, 1.2) * (1 - prog(s, 50.0, 50.8));
  const scrolling = win(s, 3.2, 3.4, 5.0, 5.4) + win(s, 27.0, 27.2, 31.2, 31.5) + win(s, 34.5, 34.7, 36.9, 37.2) + win(s, 38.3, 38.5, 40.5, 40.8);
  const dragging = [9.3, 9.75, 10.2, 10.6, 11.0].reduce((m, c) => m + win(s, c - 0.05, c, c + 0.15, c + 0.2), 0);

  // ===== stage camera (subtle push / drift) =====
  const push = 1 + 0.06 * prog(s, 1.5, 5.6, EASE.inOut) - 0.06 * prog(s, 5.6, 6.6, EASE.inOut) + 0.03 * Math.sin(s * 0.3);

  // ===== S1/S2: template, clones, swipe-away =====
  const s1 = win(s, 0.2, 1.2, 15.6, 16.0);
  const tplScroll = 420 * prog(s, 3.2, 5.2, EASE.inOut);
  const grid = prog(s, T.l3, T.l3 + 1.1, EASE.inOut); // 0 single → 1 grid of 6
  const swipeAt = [9.3, 9.75, 10.2, 10.6, 11.0];
  const order = [1, 3, 0, 5, 2]; // which clone each swipe removes; clone 4 remains
  const regroup = prog(s, 11.6, 12.4, EASE.inOut);
  const countdown = Math.max(0, 3 - Math.floor((s - (T.l4 + 0.3)) / 0.9));
  // ===== S3: meeting + shatter =====
  const invite = win(s, T.l5 + 0.3, T.l5 + 1.0, 15.4, 15.9);
  const shatter = prog(s, 14.1, 15.7);
  // ===== S4: builder toggles =====
  const s4 = win(s, 15.6, 16.1, 19.0, 19.5);
  const togs = [16.2, 16.8, 17.4, 18.0].map((c) => prog(s, c, c + 0.25, EASE.out));
  const typedUrl = "yourbusiness.co.za".slice(0, Math.max(0, Math.floor((s - 17.0) * 16)));
  // ===== S5: three heroes on tilted planes =====
  const h1 = win(s, 19.1, 19.6, 22.7, 23.3), h2 = win(s, 22.7, 23.3, 26.3, 26.9), h3 = win(s, 26.3, 26.9, 30.9, 31.4);
  const wall = win(s, 30.9, 31.5, 32.7, 33.3);
  const tiltIn = (a: number) => lerp(-24, -9, prog(s, a, a + 1.4, EASE.out));
  const lapK = prog(s, 27.1, 29.2, EASE.inOut) * 0.42 - 0.14 * prog(s, 29.3, 29.9, EASE.inOut) + 0.22 * prog(s, 30.0, 31.2, EASE.inOut); // stays before the burst
  // ===== giant word between S5 and S6 =====
  const gw = prog(s, 31.5, 32.9, EASE.in);
  // ===== S6: the studio's own site, scroll-scrubbed =====
  const s6 = win(s, 32.4, 33.0, 40.9, 41.6);
  const scrub = prog(s, 34.6, 36.9, EASE.inOut);
  const toPhone = prog(s, 37.2, 38.3, EASE.inOut);
  const phoneScroll = prog(s, 38.4, 40.6, EASE.inOut);
  // ===== S8: end card =====
  const end = prog(s, 41.0, 42.2, EASE.out);
  const tag = prog(s, T.l14, T.l14 + 0.9, EASE.out);
  const wa = prog(s, T.l15 - 0.3, T.l15 + 0.5, EASE.out);
  const waPress = win(s, 47.55, 47.62, 47.7, 48.1);

  const W1 = 1240, H1 = 740;
  return (
    <AbsoluteFill style={{ background: P.base, overflow: "hidden", fontFamily: SANS }}>
      {/* ambient: one soft signal pool, never a full-width wash */}
      <AbsoluteFill style={{ background: `radial-gradient(45% 40% at ${50 + 8 * Math.sin(s * 0.17)}% 55%, rgba(134,7,179,.20), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(30% 30% at 50% 50%, rgba(232,77,235,${0.08 + 0.1 * end}), transparent 70%)` }} />

      <AbsoluteFill style={{ scale: String(push) }}>
        {/* ---------- S1 + S2 ---------- */}
        {s1 > 0.001 && [0, 1, 2, 3, 4, 5].map((i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const gx = 960 + (col - 1) * 560, gy = 540 + (row - 0.5) * 360;
          const isMain = i === 4;
          const k = grid;
          const x = lerp(960, gx, k), y = lerp(540, gy, k);
          const sc = lerp(1, 0.4, k);
          const swIdx = order.indexOf(i);
          const sw = swIdx >= 0 ? prog(s, swipeAt[swIdx], swipeAt[swIdx] + 0.35, EASE.in) : 0;
          const back = isMain ? regroup : 0;
          const fx = lerp(x, 800, back), fy = lerp(y, 540, back), fsc = lerp(sc, 0.78, back);
          const o = (isMain ? 1 : prog(s, T.l3 + 0.1, T.l3 + 0.6)) * (1 - sw) * s1;
          if (o < 0.01) return null;
          const shat = isMain ? shatter : 0;
          return (
            <div key={i} style={{ position: "absolute", left: fx - W1 / 2, top: fy - H1 / 2, width: W1, height: H1, scale: String(fsc), translate: `${-900 * sw}px ${-80 * sw}px`, rotate: `${-14 * sw}deg`, opacity: o * (1 - prog(s, 15.2, 15.8)), transform: `perspective(2200px) rotateY(${-10 * k * (1 - back)}deg) rotateX(${5 * k * (1 - back)}deg)`, filter: `blur(${(1 - prog(s, 0.2, 1.2)) * 12}px)` }}>
              <Browser w={W1} h={H1} url="www.yourbusiness.co.za" light>
                <TemplateSite scroll={isMain ? tplScroll * (1 - prog(s, 5.6, 6.4)) : 0} pulse={win(s, 7.0, 7.3, 8.2, 8.6)} />
                {shat > 0 && <Img src={seq("monolith", 240, lerp(1, 0.12, shat))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: prog(s, 13.9, 14.3) }} />}
              </Browser>
            </div>
          );
        })}
        {/* countdown pill */}
        {win(s, T.l4 + 0.1, T.l4 + 0.4, 11.4, 11.8) > 0.01 && (
          <Pill style={{ left: 960, top: 70, translate: "-50% 0", opacity: win(s, T.l4 + 0.1, T.l4 + 0.4, 11.4, 11.8), fontSize: 22 }}>A BUYER DECIDES · 0:0{countdown}</Pill>
        )}
        {/* meeting invite */}
        {invite > 0.01 && (
          <div style={{ position: "absolute", left: 1350, top: 370, width: 470, opacity: invite, translate: `${(1 - invite) * 40}px 0`, padding: "30px 34px", borderRadius: 22, background: "rgba(14,9,17,.92)", border: "1px solid rgba(238,233,241,.12)", boxShadow: "0 40px 80px -20px rgba(0,0,0,.8)" }}>
            <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.16em", color: P.muted }}>TODAY · 09:00</div>
            <div style={{ fontSize: 34, fontWeight: 600, color: P.ink, marginTop: 10, lineHeight: 1.15 }}>First meeting with a new client</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: MONO, fontSize: 17, color: P.muted }}>
              <span>Attending</span><span style={{ color: P.ink }}>your website</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: MONO, fontSize: 17, color: P.muted }}>
              <span>You</span><span style={{ color: SIG }}>not in the room</span>
            </div>
          </div>
        )}

        {/* ---------- S4: the build panel ---------- */}
        {s4 > 0.01 && (
          <div style={{ position: "absolute", left: 360, top: 250, width: 640, opacity: s4, translate: `0 ${(1 - prog(s, 15.6, 16.2, EASE.out)) * 40}px`, padding: "34px 40px", borderRadius: 26, background: "rgba(12,8,15,.9)", border: "1px solid rgba(238,233,241,.1)", boxShadow: `0 0 80px -30px ${SIG}` }}>
            <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.2em", color: P.muted, marginBottom: 6 }}>OBSIDIAN · NEW BUILD</div>
            {["Scroll-driven film", "Pinned story", "Phone-tuned", "WhatsApp handoff"].map((l, i) => <Toggle key={l} label={l} on={togs[i]} s={s} />)}
          </div>
        )}
        {s4 > 0.01 && (
          <div style={{ position: "absolute", left: 1080, top: 742, width: 520, opacity: s4 * prog(s, 16.6, 17.0), display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1, height: 70, borderRadius: 35, background: "rgba(238,233,241,.06)", border: "1px solid rgba(238,233,241,.14)", display: "flex", alignItems: "center", padding: "0 26px", fontFamily: MONO, fontSize: 22, color: P.ink }}>
              {typedUrl}<span style={{ color: SIG, opacity: Math.floor(s * 3) % 2 ? 1 : 0 }}>|</span>
            </div>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: s > 18.6 ? `linear-gradient(135deg, ${SIG}, ${DEEP})` : "rgba(238,233,241,.1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: s > 18.6 ? `0 0 40px ${SIG}` : "none", scale: String(1 - 0.1 * win(s, 18.68, 18.72, 18.8, 19.0)) }}>
              <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        )}

        {/* ---------- S5: three heroes, tilted planes ---------- */}
        {[
          { o: h1, t0: 19.4, brand: "LINDEN HOUSE", nav: ["Rooms", "Stay", "Book"], head: "Stay somewhere that remembers you.", cta: "Book your stay", file: "hero_guesthouse.jpg", tint: "#7A3B2E", side: "left" as const, press: win(s, 21.58, 21.62, 21.7, 22.0), a: 19.2 },
          { o: h2, t0: 23.0, brand: "HARROW & VALE", nav: ["Services", "Team", "Contact"], head: "Numbers you can stand behind.", cta: "Book a consultation", file: "hero_practice.jpg", tint: "#5A4630", side: "left" as const, press: win(s, 25.28, 25.32, 25.4, 25.7), a: 22.8 },
        ].map((h, i) => h.o > 0.01 && (
          <div key={i} style={{ position: "absolute", left: 960 - 680, top: 540 - 400, width: 1360, height: 800, opacity: h.o, transform: `perspective(2400px) rotateY(${tiltIn(h.a) * (i ? -1 : 1)}deg) rotateX(4deg) translateX(${(1 - h.o) * (i ? 120 : -120)}px)` }}>
            <Browser w={1360} h={800} url={i ? "harrowvale.co.za" : "lindenhouse.co.za"} glow={0.6}>
              <ClientHero s={s} t0={h.t0} brand={h.brand} nav={h.nav} head={h.head} cta={h.cta} file={h.file} tint={h.tint} press={h.press} />
            </Browser>
          </div>
        ))}
        {h3 > 0.01 && (
          <div style={{ position: "absolute", left: 960 - 680, top: 540 - 400, width: 1360, height: 800, opacity: h3, transform: `perspective(2400px) rotateY(${tiltIn(26.4)}deg) rotateX(4deg)` }}>
            <Browser w={1360} h={800} url="nocturne.studio" glow={0.7}>
              <div style={{ position: "absolute", inset: 0, background: "#000" }}>
                <Img src={seq("laptop", 173, lapK)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", left: 60, top: 60, fontFamily: SANS, fontWeight: 600, fontSize: 58, letterSpacing: "-0.03em", color: P.ink, opacity: prog(s, 26.8, 27.4) }}>Opens as you scroll.</div>
                {/* scroll bar */}
                <div style={{ position: "absolute", right: 14, top: 20, bottom: 20, width: 6, borderRadius: 3, background: "rgba(238,233,241,.12)" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: `${(lapK / 0.5) * 82}%`, height: "18%", borderRadius: 3, background: SIG, boxShadow: `0 0 12px ${SIG}` }} />
                </div>
              </div>
            </Browser>
            <Pill style={{ left: 1010, top: -30, opacity: prog(s, 27.6, 28.0) }}>SCROLL-SCRUBBED</Pill>
          </div>
        )}


        {/* ---------- the wall: five builds, tilted (NIVO), the giant word flies through ---------- */}
        {wall > 0.01 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: wall, transform: `perspective(2400px) rotateY(-16deg) rotateX(8deg) scale(${lerp(1.05, 0.95, prog(s, 30.9, 33.2, EASE.inOut))})` }}>
            {[
              { f: "hero_guesthouse.jpg", b: "LINDEN HOUSE", h: "Stay somewhere that remembers you.", x: 110, y: 190 },
              { f: "hero_practice.jpg", b: "HARROW & VALE", h: "Numbers you can stand behind.", x: 690, y: 150 },
              { f: "hero_venue.jpg", b: "THE LONG TABLE", h: "Evenings people talk about.", x: 1270, y: 110 },
              { f: "hero_product.jpg", b: "NOCTURNE", h: "Sound, taken apart.", x: 400, y: 590 },
              { f: "hero_restaurant.jpg", b: "EMBER", h: "Book the table by the fire.", x: 980, y: 550 },
            ].map((c, i) => {
              const k = prog(s, 31.0 + i * 0.09, 31.5 + i * 0.09, EASE.out);
              return (
                <div key={c.f} style={{ position: "absolute", left: c.x, top: c.y + (1 - k) * 60, opacity: k }}>
                  <Browser w={540} h={340} url={c.b.toLowerCase().replace(/[^a-z]/g, "") + ".co.za"} glow={0.4}>
                    <Img src={staticFile(`img/${c.f}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(2,1,2,.85), transparent 70%)" }} />
                    <div style={{ position: "absolute", left: 22, top: 16, fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.2em", color: P.ink }}>{c.b}</div>
                    <div style={{ position: "absolute", left: 22, bottom: 26, width: 300, fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.02em", color: P.ink }}>{c.h}</div>
                  </Browser>
                </div>
              );
            })}
          </div>
        )}
        {/* giant word the camera flies through */}
        {gw > 0 && gw < 1 && (
          <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", scale: String(0.7 + 7 * gw * gw), opacity: Math.sin(Math.PI * gw), fontFamily: SANS, fontWeight: 200, fontSize: 210, letterSpacing: "-0.04em", whiteSpace: "nowrap", background: `linear-gradient(90deg, #fff, ${SIG} 60%, ${DEEP})`, WebkitBackgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 30px ${SIG}66) blur(${gw * 3}px)` }}>Every frame.</div>
        )}

        {win(s, 19.3, 19.8, 32.8, 33.3) > 0.01 && (
          <div style={{ position: "absolute", left: 60, bottom: 50, opacity: 0.7 * win(s, 19.3, 19.8, 32.8, 33.3), fontFamily: MONO, fontSize: 16, letterSpacing: "0.18em", color: P.muted }}>CONCEPT DESIGNS</div>
        )}
        {/* ---------- S6/S7: OBSIDIAN's own site → phone ---------- */}
        {s6 > 0.01 && (() => {
          const w = lerp(1480, 470, toPhone), h = lerp(860, 900, toPhone), r = lerp(18, 60, toPhone);
          const x = lerp(960, 1010, toPhone);
          return (
            <div style={{ position: "absolute", left: x - w / 2, top: 540 - h / 2, width: w, height: h, opacity: s6, scale: String(lerp(0.94, 1, prog(s, 32.4, 33.4, EASE.out))) }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: r, overflow: "hidden", background: "#020102", border: `${lerp(1, 10, toPhone)}px solid ${toPhone > 0.5 ? "#1a1420" : "rgba(238,233,241,.12)"}`, boxShadow: `0 60px 140px -30px #000, 0 0 90px -20px ${SIG}88` }}>
                {/* hero: OBSIDIAN behind the brain (the site's own composition) */}
                <div style={{ position: "absolute", inset: 0, opacity: 1 - prog(s, 34.5, 35.0) }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: "50%", translate: "0 -50%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: lerp(230, 96, toPhone), letterSpacing: "-0.01em", color: "rgba(238,233,241,.83)", lineHeight: 0.8 }}>OBSIDIAN</div>
                  <Img src={staticFile("img/brain-cutout.png")} style={{ position: "absolute", left: "50%", top: "52%", width: lerp(980, 520, toPhone), translate: "-50% -50%", filter: `drop-shadow(0 40px 60px ${SIG}33)` }} />
                </div>
                {/* scroll-scrubbed film (the site's own sequence) */}
                <Img src={seq("sequence", 294, toPhone > 0 ? lerp(1, 0.9, phoneScroll) : scrub)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: prog(s, 34.5, 35.0) }} />
                {/* phone scroll: CTA section slides up */}
                {toPhone > 0.5 && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: lerp(900, 380, phoneScroll), height: 560, background: "linear-gradient(180deg, transparent, #020102 25%)", padding: "120px 40px 0", textAlign: "center" }}>
                    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: P.ink, lineHeight: 1.05, letterSpacing: "-0.02em" }}>Built to be remembered.</div>
                    <div style={{ marginTop: 30 }}><Beam size={15}>Start a project</Beam></div>
                  </div>
                )}
                <div style={{ position: "absolute", right: 10, top: 20, bottom: 20, width: 5, borderRadius: 3, background: "rgba(238,233,241,.1)" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: `${(toPhone > 0.5 ? phoneScroll : scrub) * 82}%`, height: "18%", borderRadius: 3, background: SIG }} />
                </div>
              </div>
              <Pill style={{ left: -250, top: 120, opacity: win(s, 33.0, 33.4, 37.0, 37.4) }}>DESIGNED FRAME BY FRAME</Pill>
              <Pill style={{ left: w - 60, top: 640, opacity: win(s, 35.0, 35.4, 37.0, 37.4) }}>PINNED STORY</Pill>
              <Pill style={{ left: -330, top: 520, opacity: win(s, 38.5, 38.9, 40.6, 41.0) }}>PHONE-TUNED</Pill>
            </div>
          );
        })()}

        {/* ---------- S8: end card ---------- */}
        {end > 0.001 && (
          <AbsoluteFill style={{ opacity: end }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 430, translate: `0 -50%`, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 250, color: "rgba(238,233,241,.85)", letterSpacing: `${lerp(0.2, -0.01, end)}em`, lineHeight: 0.8 }}>OBSIDIAN</div>
            <Img src={staticFile("img/brain-cutout.png")} style={{ position: "absolute", left: 960, top: 450, width: 820, translate: `-50% ${-50 + (1 - end) * 8}%`, scale: String(lerp(1.08, 1, end)), filter: `drop-shadow(0 50px 70px ${SIG}33)` }} />
            <div style={{ position: "absolute", left: 960, top: 790, translate: `-50% ${(1 - tag) * 14}px`, opacity: tag, fontFamily: SANS, fontWeight: 300, fontSize: 40, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
              Websites with the weight of your reputation.
            </div>
            <div style={{ position: "absolute", left: 960, top: 900, translate: `-50% ${(1 - wa) * 16}px`, opacity: wa }}>
              <Beam size={20} press={waPress} glow={1 + waPress}>
                <svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" stroke={SIG} strokeWidth={1.8} fill="none" /><path d="M9 8.5c0 3.5 2.6 6.5 6.5 6.5l1-1.6-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" fill={SIG} /></svg>
                Message us on WhatsApp · 079 244 9607
              </Beam>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* ---------- the cursor (always on top, never scaled with the stage) ---------- */}
      {curO > 0.01 && (
        <div style={{ position: "absolute", left: cx, top: cy, opacity: curO, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: -46, top: -46, width: 92, height: 92, borderRadius: 46, border: `2px solid ${SIG}`, opacity: click * (1 - click * 0.3), scale: String(0.4 + click * 1.0), boxShadow: `0 0 24px ${SIG}` }} />
          <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: 22, background: `radial-gradient(circle, ${SIG}55, transparent 70%)` }} />
          <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: `0 0 0 4px ${SIG}aa, 0 0 26px 6px ${SIG}`, scale: String(1 - 0.25 * click + 0.15 * dragging) }} />
          {scrolling > 0.01 && (
            <div style={{ position: "absolute", left: 22, top: -30, opacity: Math.min(1, scrolling), display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: `8px solid ${SIG}`, opacity: 0.3 + 0.7 * Math.max(0, Math.sin(s * 9 - i)) }} />)}
            </div>
          )}
        </div>
      )}
      <Finish t={t} />
    </AbsoluteFill>
  );
};

export const _unused = hash;
