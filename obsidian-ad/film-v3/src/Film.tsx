// OBSIDIAN ad v3 — "one light, four websites". A single point of light is the focus from the first frame to the logo:
// it becomes a star in Northlight's sky, leaves through Northlight's sunrise, becomes Atelier Vale's laser, leaves
// through it into the fire pit of the private estate, becomes the ember of the Cape Atlantic cigar; the cigar window
// turns into a phone (the client's favourite move), the phone collapses back into the light, and the light becomes
// OBSIDIAN. Each site plays its REAL scroll animation (captured from the client's own repos). The background takes
// each site's palette. Script pending: beats sit on T (timeline.json) and will be re-timed to the voice.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { theme as t } from "./theme";
import { Finish } from "./components/Layers";
import { EASE, prog } from "./lib/motion";
import T from "./timeline.json";

const P = t.palette;
const MONO = t.fonts.mono, SANS = t.fonts.display;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const win = (s: number, a: number, b: number, c: number, d: number) => prog(s, a, b) * (1 - prog(s, c, d, EASE.in));
const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, "0")).join("");
};
const frameOf = (dir: string, n: number, k: number) => staticFile(`site/${dir}/${String(Math.max(1, Math.min(n, Math.round(1 + clamp01(k) * (n - 1))))).padStart(3, "0")}.jpg`);

// ---------- each site: palette, light colour, entry/exit points (in captured-page px, 1440×900) ----------
type Site = { id: string; bg: string; glowA: string; glowB: string; light: string; label: string; sub: string; url: string; n: number; upTo: number; entry: [number, number]; exit: [number, number] };
const SITES: Record<string, Site> = {
  north: { id: "north", bg: "#0A1018", glowA: "#6FD9AE", glowB: "#8E6FC4", light: "#EAF2FF", label: "NORTHLIGHT", sub: "Therapy · scroll-driven story", url: "northlight.co.za", n: 150, upTo: 150, entry: [1010, 250], exit: [725, 440] },
  surgery: { id: "surgery", bg: "#F4F0E9", glowA: "#E9D9C3", glowB: "#B08D57", light: "#FF4A4A", label: "ATELIER VALE", sub: "Aesthetic clinic · 3D product reveal", url: "ateliervale.co.za", n: 170, upTo: 112, entry: [720, 300], exit: [720, 450] },
  estate: { id: "estate", bg: "#0B0C0E", glowA: "#C9A56A", glowB: "#2B3A2E", light: "#FFB257", label: "PRIVATE ESTATES", sub: "Real estate · walk-through tour", url: "obsidianestates.co.za", n: 150, upTo: 150, entry: [720, 560], exit: [713, 540] },
};
const CIG = { bg: "#120D0A", glowA: "#C9A15A", glowB: "#7A2416", light: "#FF7A2E" };

// window geometry (screen): content 1344×840 + 40 chrome, centred
const WW = 1344, WH = 840, CHROME = 40;
const WX = 960 - WW / 2, WY = 540 - (WH + CHROME) / 2 + 6;
const PAGE_S = WW / 1440;
const toScreen = (p: [number, number]): [number, number] => [WX + p[0] * PAGE_S, WY + CHROME + p[1] * PAGE_S];

// ---------- pieces ----------
const Browser: React.FC<{ url: string; children: React.ReactNode; light?: boolean; glow: string }> = ({ url, children, light, glow }) => (
  <div style={{ position: "absolute", left: WX, top: WY, width: WW, height: WH + CHROME, borderRadius: 16, overflow: "hidden", background: light ? "#EFE9E0" : "#0C0D10", border: `1px solid ${light ? "rgba(36,29,23,.12)" : "rgba(255,255,255,.10)"}`, boxShadow: `0 60px 140px -40px rgba(0,0,0,${light ? 0.35 : 0.85}), 0 0 120px -40px ${glow}` }}>
    <div style={{ height: CHROME, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: light ? "rgba(36,29,23,.04)" : "rgba(255,255,255,.035)" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: light ? "rgba(36,29,23,.18)" : "rgba(255,255,255,.16)" }} />)}
      <div style={{ marginLeft: 16, width: 420, height: 24, borderRadius: 12, background: light ? "rgba(36,29,23,.06)" : "rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 12px", fontFamily: MONO, fontSize: 13, letterSpacing: "0.04em", color: light ? "rgba(36,29,23,.55)" : "rgba(255,255,255,.5)" }}>{url}</div>
    </div>
    <div style={{ position: "absolute", top: CHROME, left: 0, width: WW, height: WH, overflow: "hidden" }}>{children}</div>
  </div>
);

const Label: React.FC<{ s: number; t0: number; t1: number; title: string; sub: string; light?: boolean; side?: "left" | "right" }> = ({ s, t0, t1, title, sub, light, side = "left" }) => {
  const k = win(s, t0, t0 + 0.7, t1 - 0.5, t1);
  if (k < 0.01) return null;
  const ink = light ? "#241D17" : "#EEE9F1";
  return (
    <div style={{ position: "absolute", [side]: 70, bottom: 34, opacity: k, translate: `0 ${(1 - k) * 12}px`, display: "flex", alignItems: "baseline", gap: 18 }}>
      <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.28em", color: ink, fontWeight: 600 }}>{title}</div>
      <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.12em", color: ink, opacity: 0.55 }}>{sub}</div>
    </div>
  );
};

const Dot: React.FC<{ x: number; y: number; color: string; size?: number; o?: number }> = ({ x, y, color, size = 14, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: -size * 6, top: -size * 6, width: size * 12, height: size * 12, borderRadius: "50%", background: `radial-gradient(circle, ${color}66 0%, ${color}22 25%, transparent 62%)` }} />
    <div style={{ position: "absolute", left: -size / 2, top: -size / 2, width: size, height: size, borderRadius: "50%", background: "#fff", boxShadow: `0 0 ${size}px ${size / 3}px ${color}, 0 0 ${size * 4}px ${color}` }} />
  </div>
);

// ---------- the film ----------
export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f / fps;

  // ---- which chapter + background palette ----
  const segs: { a: number; b: number; bg: string; ga: string; gb: string }[] = [
    { a: 0, b: T.north, bg: "#050407", ga: "#8607B3", gb: "#E84DEB" },
    { a: T.north, b: T.surgery, bg: SITES.north.bg, ga: SITES.north.glowA, gb: SITES.north.glowB },
    { a: T.surgery, b: T.estate, bg: SITES.surgery.bg, ga: SITES.surgery.glowA, gb: SITES.surgery.glowB },
    { a: T.estate, b: T.cigars, bg: SITES.estate.bg, ga: SITES.estate.glowA, gb: SITES.estate.glowB },
    { a: T.cigars, b: T.end, bg: CIG.bg, ga: CIG.glowA, gb: CIG.glowB },
    { a: T.end, b: 999, bg: "#050407", ga: "#8607B3", gb: "#E84DEB" },
  ];
  // crossfade palettes across the 0.8 s before each chapter starts (while the light travels)
  let bg = segs[0].bg, ga = segs[0].ga, gb = segs[0].gb;
  for (let i = 0; i < segs.length; i++) {
    const sg = segs[i];
    if (s >= sg.a - 0.8) {
      const k = i === 0 ? 1 : EASE.inOut(clamp01((s - (sg.a - 0.8)) / 0.8));
      bg = mixHex(i === 0 ? sg.bg : bg, sg.bg, k); ga = mixHex(i === 0 ? sg.ga : ga, sg.ga, k); gb = mixHex(i === 0 ? sg.gb : gb, sg.gb, k);
    }
  }
  const lightBg = s >= T.surgery - 0.4 && s < T.estate - 0.4;

  // ---- site chapter helper: reveal (iris from entry point), scroll, exit (zoom into the light) ----
  const chapter = (site: Site, t0: number, tExit: number) => {
    const reveal = prog(s, t0, t0 + 0.9, EASE.inOut);
    const scroll = EASE.inOut(clamp01((s - (t0 + 0.5)) / (tExit - (t0 + 0.5) - 0.2)));
    const exit = prog(s, tExit, tExit + 1.0, EASE.in);
    const [ex, ey] = toScreen(site.entry);
    const [xx, xy] = toScreen(site.exit);
    // camera: settle in from 1.18 around the entry, drift, then dive into the exit light (log zoom)
    const zIn = lerp(1.18, 1, reveal);
    const zOut = Math.exp(lerp(0, Math.log(16), exit));
    const z = zIn * zOut;
    const fx = lerp(lerp(ex, 960, reveal), xx, exit), fy = lerp(lerp(ey, 540, reveal), xy, exit);
    const tilt = lerp(-5, 3, clamp01((s - t0) / (tExit - t0))) * (1 - exit);
    return { reveal, scroll, exit, z, fx, fy, tilt, ex, ey, xx, xy };
  };

  const renderSite = (site: Site, t0: number, tExit: number) => {
    if (s < t0 - 0.05 || s > tExit + 1.05) return null;
    const c = chapter(site, t0, tExit);
    const R = lerp(0, 2300, c.reveal);
    return (
      <AbsoluteFill key={site.id} style={{ clipPath: `circle(${R}px at ${c.ex}px ${c.ey}px)` }}>
        <AbsoluteFill style={{ transform: `translate(960px,540px) scale(${c.z}) translate(${-c.fx}px,${-c.fy}px)`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", inset: 0, transform: `perspective(2600px) rotateY(${c.tilt}deg)` }}>
            <Browser url={site.url} light={site.id === "surgery"} glow={site.glowA}>
              <Img src={frameOf(site.id, site.n, c.scroll * ((site.upTo - 1) / (site.n - 1)))} style={{ width: WW, height: WH, objectFit: "cover", display: "block" }} />
            </Browser>
          </div>
        </AbsoluteFill>
        {/* the light the camera dives into, so the exit reads as "into the light" */}
        {c.exit > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #fff ${4 * c.exit}%, ${site.light} ${18 + 30 * c.exit}%, transparent ${40 + 50 * c.exit}%)`, opacity: c.exit * c.exit }} />}
      </AbsoluteFill>
    );
  };

  // ---- the travelling light between chapters ----
  // after each exit the screen is filled with that light; it condenses into a dot on the new background, travels to the
  // next entry point, then the iris opens from it
  const travel = (tExit: number, from: string, to: string, tNext: number, entry: [number, number]) => {
    const a = tExit + 1.0;
    if (s < a - 0.02 || s > tNext + 0.05) return null;
    const k = clamp01((s - a) / (tNext - a));
    const condense = EASE.out(clamp01(k / 0.45));
    const move = EASE.inOut(clamp01((k - 0.25) / 0.75));
    const [nx, ny] = toScreen(entry);
    const x = lerp(960, nx, move), y = lerp(540, ny, move);
    const col = mixHex(from, to, move);
    return (
      <>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #fff 0%, ${from} ${12 * (1 - condense) + 1}%, transparent ${70 * (1 - condense) + 6}%)`, opacity: 1 - condense }} />
        <Dot x={x} y={y} color={col} size={lerp(60, 14, condense)} />
      </>
    );
  };

  // ---- intro ----
  const dotIn = prog(s, T.dot, T.dot + 0.6, EASE.out);
  const lineK = prog(s, T.line1 - 0.3, T.line1 + 0.6, EASE.out);
  const l1 = win(s, T.line1, T.line1 + 0.6, T.line2 - 0.25, T.line2 + 0.15);
  const l2 = prog(s, T.line2, T.line2 + 0.6, EASE.out) * (1 - prog(s, T.toNorth - 0.1, T.toNorth + 0.3));
  const toN = prog(s, T.toNorth, T.north, EASE.inOut);
  const [nEx, nEy] = toScreen(SITES.north.entry);

  // ---- cigars chapter (screenshot of the live site, ember glows) + morph into the phone ----
  const cigIn = prog(s, T.cigars, T.cigars + 0.9, EASE.inOut);
  const cigKB = prog(s, T.cigars, T.toPhone, EASE.inOut);
  const morph = prog(s, T.toPhone, T.phone, EASE.inOut);
  const ember: [number, number] = [WX + 1050 * (WW / 1920), WY + CHROME + 560 * (WH / 1080)];
  // three deliberate thumb swipes: Northlight → Atelier Vale → the estate
  const swipeAt = [T.phone + 1.0, T.phone + 2.6, T.phone + 4.2];
  const phoneScroll = swipeAt.reduce((m, a) => m + prog(s, a, a + 0.55, EASE.inOut), 0) / 3;
  const collapse = prog(s, T.toEnd, T.end, EASE.inOut);

  // ---- end ----
  const endK = prog(s, T.end, T.end + 1.0, EASE.out);
  const tagK = prog(s, T.tag, T.tag + 0.8, EASE.out);
  const waK = prog(s, T.wa, T.wa + 0.7, EASE.out);
  const letters = "OBSIDIAN".split("");

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden", fontFamily: SANS }}>
      {/* palette-tinted ambient light, never a full wash */}
      <AbsoluteFill style={{ background: `radial-gradient(42% 46% at 30% 30%, ${ga}${lightBg ? "40" : "2a"}, transparent 70%), radial-gradient(40% 44% at 72% 72%, ${gb}${lightBg ? "33" : "24"}, transparent 70%)` }} />

      {/* ---------- intro: the light and one line ---------- */}
      {s < T.north + 0.1 && (
        <>
          <div style={{ position: "absolute", left: lerp(960, 960, 0), top: 540, width: 1500 * lineK, height: 1, translate: "-50% 0", background: `linear-gradient(90deg, transparent, rgba(238,233,241,.35), transparent)`, opacity: 1 - toN }} />
          <div style={{ position: "absolute", left: 920, top: 540, translate: `-100% -130%`, opacity: l1, filter: `blur(${(1 - l1) * 6}px)`, fontFamily: SANS, fontWeight: 300, fontSize: 64, letterSpacing: "-0.02em", color: "#EEE9F1", whiteSpace: "nowrap" }}>Your work is world-class.</div>
          <div style={{ position: "absolute", left: 1000, top: 540, translate: `${(1 - l2) * 40}px -130%`, opacity: l2, filter: `blur(${(1 - l2) * 6}px)`, fontFamily: SANS, fontWeight: 300, fontSize: 64, letterSpacing: "-0.02em", color: "#EEE9F1", whiteSpace: "nowrap" }}>Does your website <span style={{ color: P.accent }}>show it?</span></div>
          <Dot x={lerp(960, nEx, toN)} y={lerp(540, nEy, toN)} color={mixHex("#E84DEB", SITES.north.light, toN)} size={14} o={dotIn} />
        </>
      )}

      {/* ---------- the three captured websites ---------- */}
      {renderSite(SITES.north, T.north, T.northExit)}
      {travel(T.northExit, SITES.north.light, SITES.surgery.light, T.surgery, SITES.surgery.entry)}
      {renderSite(SITES.surgery, T.surgery, T.surgeryExit)}
      {travel(T.surgeryExit, SITES.surgery.light, SITES.estate.light, T.estate, SITES.estate.entry)}
      {renderSite(SITES.estate, T.estate, T.estateExit)}
      {travel(T.estateExit, SITES.estate.light, CIG.light, T.cigars, [1050 * (1440 / 1920), 560 * (900 / 1080)])}

      {/* ---------- Cape Atlantic Cigars → phone ---------- */}
      {s >= T.cigars - 0.05 && s < T.end + 0.2 && (() => {
        const w = lerp(WW, 430, morph), h = lerp(WH + CHROME, 880, morph), r = lerp(16, 58, morph);
        const cx = lerp(960, 960, morph), cy = 540;
        const R = lerp(0, 2300, cigIn);
        const sc = (1 - collapse * 0.97);
        return (
          <AbsoluteFill style={{ clipPath: `circle(${R}px at ${ember[0]}px ${ember[1]}px)` }}>
            <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: r, overflow: "hidden", background: "#0C0907", border: `${lerp(1, 9, morph)}px solid ${morph > 0.5 ? "#1c1612" : "rgba(255,255,255,.10)"}`, boxShadow: `0 60px 140px -40px #000, 0 0 140px -40px ${CIG.glowA}`, scale: String(sc * lerp(1.06, 1, cigIn)), opacity: 1 - collapse * collapse }}>
              {/* desktop: the live site hero with a slow push toward the ember */}
              <div style={{ position: "absolute", inset: 0, opacity: 1 - morph }}>
                <div style={{ height: CHROME, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "rgba(255,255,255,.035)" }}>
                  {[0, 1, 2].map((i) => <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: "rgba(255,255,255,.16)" }} />)}
                  <div style={{ marginLeft: 16, width: 420, height: 24, borderRadius: 12, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 12px", fontFamily: MONO, fontSize: 13, color: "rgba(255,255,255,.5)" }}>capeatlanticcigars.co.za</div>
                </div>
                <div style={{ position: "absolute", top: CHROME, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
                  <Img src={staticFile("site/cigars_hero.png")} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#0b0807", scale: String(1 + 0.03 * cigKB), transformOrigin: `4% 50%` }} />
                  {/* the ember breathes */}
                  <div style={{ position: "absolute", left: `${(1050 / 1920) * 100}%`, top: `${(560 / 1080) * 100}%`, width: 420, height: 420, translate: "-50% -50%", borderRadius: "50%", background: `radial-gradient(circle, ${CIG.light}55, transparent 60%)`, opacity: 0.5 + 0.5 * Math.sin(s * 2.4) ** 2, mixBlendMode: "screen" }} />
                </div>
              </div>
              {/* phone: the four sites, thumb-scrolled */}
              {morph > 0.01 && (
                <div style={{ position: "absolute", inset: 0, opacity: morph }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, translate: `0 ${-phoneScroll * 3 * 844 * (430 / 390)}px` }}>
                    {["m_north_0", "m_surgery_0", "m_estate_0", "m_estate_1"].map((m) => (
                      <Img key={m} src={staticFile(`site/${m}.jpg`)} style={{ width: 430, height: 844 * (430 / 390), objectFit: "cover", display: "block" }} />
                    ))}
                  </div>
                  <div style={{ position: "absolute", left: "50%", top: 14, width: 120, height: 30, translate: "-50% 0", borderRadius: 16, background: "#000" }} />
                </div>
              )}
            </div>
            {/* thumb swipe hint */}
            {morph > 0.9 && collapse < 0.1 && swipeAt.map((a, i) => { const k = prog(s, a - 0.15, a + 0.6); return k > 0 && k < 1 ? <div key={i} style={{ position: "absolute", left: 1010, top: lerp(780, 380, EASE.inOut(k)), width: 46, height: 46, borderRadius: 23, border: "2px solid rgba(255,255,255,.55)", background: "rgba(255,255,255,.12)", opacity: Math.sin(Math.PI * k) * 0.85 }} /> : null; })}
          </AbsoluteFill>
        );
      })()}
      {/* the phone collapses back into the light */}
      {collapse > 0.3 && s < T.end + 1.2 && <Dot x={960} y={540} color="#E84DEB" size={lerp(30, 14, prog(s, T.end - 0.2, T.end + 0.6))} o={prog(s, T.toEnd + 0.3, T.end - 0.2) * (1 - prog(s, T.end + 0.4, T.end + 1.2))} />}

      {/* ---------- end card ---------- */}
      {endK > 0.001 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", fontFamily: SANS, fontWeight: 800, fontSize: 200, letterSpacing: "0.02em", color: "#EEE9F1", lineHeight: 1 }}>
            {letters.map((ch, i) => {
              const k = prog(s, T.end + 0.1 + Math.abs(i - 3.5) * 0.06, T.end + 0.9 + Math.abs(i - 3.5) * 0.06, EASE.out);
              return <span key={i} style={{ opacity: k, translate: `${(i - 3.5) * -18 * (1 - k)}px 0`, filter: `blur(${(1 - k) * 10}px)` }}>{ch}</span>;
            })}
          </div>
          <div style={{ marginTop: 34, opacity: tagK, translate: `0 ${(1 - tagK) * 14}px`, fontFamily: SANS, fontWeight: 300, fontSize: 40, color: "#EEE9F1" }}>Websites with the weight of your reputation.</div>
          <div style={{ marginTop: 46, opacity: waK, translate: `0 ${(1 - waK) * 14}px`, display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 34px", borderRadius: 999, background: "#0a060c", boxShadow: `inset 0 0 0 1.5px ${P.accent}cc, 0 0 36px -6px ${P.accent}`, fontFamily: MONO, fontSize: 19, letterSpacing: "0.14em", color: "#EEE9F1" }}>
            MESSAGE US ON WHATSAPP · 079 244 9706
          </div>
        </AbsoluteFill>
      )}

      {/* chapter labels */}
      <Label s={s} t0={T.north + 0.8} t1={T.northExit} title={SITES.north.label} sub={SITES.north.sub} />
      <Label s={s} t0={T.surgery + 0.8} t1={T.surgeryExit} title={SITES.surgery.label} sub={SITES.surgery.sub} light />
      <Label s={s} t0={T.estate + 0.8} t1={T.estateExit} title={SITES.estate.label} sub={SITES.estate.sub} />
      <Label s={s} t0={T.cigars + 0.8} t1={T.toPhone} title="CAPE ATLANTIC" sub="Cigars · store in 3 currencies, 3 languages" />
      <Label s={s} t0={T.phone + 0.3} t1={T.toEnd} title="BUILT FOR THE PHONE" sub="in your client's hand" side="right" />
      <Finish t={t} />
    </AbsoluteFill>
  );
};
