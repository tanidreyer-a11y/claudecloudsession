// OBSIDIAN — "Digital precision that builds reputation" · three 30 s direction tests (9:16), no voice yet.
//  A  MORE IMAGERY  — the build is shown with the real sites: estate scroll → floating site frames orbit → ad frames
//  B  LIMITED       — logic, then ONE 2.6 s glimpse: the build compiles into the real-estate scroll
//  C  NONE          — pure back-end logic (ElevenLabs agents method): code → tokens/grid → exploded UI → ad timeline
// Shared spine: focus light → obsidian shard (real 3D, 360°) → grey template wall → code → BUILD (variant) →
// agents (powered by Avant Intelligence) → 24 h → the shard → OBSIDIAN · Digital precision that builds reputation.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";

export const FPS = 60;
export const DUR = 30;
export type Variant = "A" | "B" | "C";

const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  io: Easing.bezier(0.65, 0, 0.35, 1),
  back: Easing.bezier(0.34, 1.4, 0.64, 1),
  soft: Easing.bezier(0.33, 0, 0.2, 1),
};
const prog = (s: number, a: number, b: number, ease = E.out) => interpolate(s, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const win = (s: number, a: number, b: number, c: number, d: number) => prog(s, a, b) * (1 - prog(s, c, d, E.in));
const h = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const site = (p: string) => staticFile("site/" + p);
const seq = (dir: string, i: number) => site(`${dir}/${String(Math.max(1, Math.round(i))).padStart(3, "0")}.jpg`);

const C = { bg: "#07060A", bg2: "#0F0B16", ink: "#F2EDF7", mute: "#8F889C", dim: "#5A5466", line: "rgba(255,255,255,.12)", purple: "#A855F7", pink: "#D946EF", violet: "#7C3AED", glow: "#E879F9", night: "#05040A" };
const GRAD = `linear-gradient(120deg, ${C.violet}, ${C.purple} 45%, ${C.pink})`;
const SANS = "Inter, Helvetica, Arial, sans-serif";
const DISPLAY = "Bricolage, Inter, sans-serif";
const MONO = "RedHatMono, ui-monospace, monospace";

// ---------------------------------------------------------------- the obsidian shard (real 3D, flat-shaded facets)
const SHARD = (() => {
  const v: [number, number, number][] = [[0, -1.32, 0], [0, 1.18, 0]];
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2 + (h(i, 2) - 0.5) * 0.4, r = 0.5 + h(i, 3) * 0.26; v.push([Math.cos(a) * r, -0.12 + (h(i, 4) - 0.5) * 0.22, Math.sin(a) * r]); }
  const f: [number, number, number][] = [];
  for (let i = 0; i < 7; i++) { const a = 2 + i, b = 2 + ((i + 1) % 7); f.push([0, b, a]); f.push([1, a, b]); }
  return { v, f };
})();
const Shard: React.FC<{ cx: number; cy: number; size: number; ry: number; rx?: number; dim?: number; op?: number }> = ({ cx, cy, size, ry, rx = 0.32, dim = 0, op = 1 }) => {
  const cy_ = Math.cos(ry), sy = Math.sin(ry), cx_ = Math.cos(rx), sx = Math.sin(rx);
  const P = SHARD.v.map(([x, y, z]) => { const x1 = x * cy_ + z * sy, z1 = -x * sy + z * cy_; const y2 = y * cx_ - z1 * sx, z2 = y * sx + z1 * cx_; const k = 3.2 / (3.2 - z2); return [x1 * k, y2 * k, z2] as [number, number, number]; });
  const L1 = [-0.82, -0.45, 0.35], L2 = [0.88, 0.05, 0.47];
  const faces = SHARD.f.map((fc) => {
    const [a, b, c] = fc.map((i) => P[i]);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; const L = Math.hypot(n[0], n[1], n[2]) + 1e-9;
    const nn = [n[0] / L, n[1] / L, n[2] / L];
    return { pts: [a, b, c], z: (a[2] + b[2] + c[2]) / 3, n: nn };
  }).filter((q) => q.n[2] > 0).sort((p, q) => p.z - q.z);
  return (
    <svg width={size * 2.2} height={size * 3} viewBox={`${-1.1} ${-1.5} 2.2 3`} style={{ position: "absolute", left: cx - size * 1.1, top: cy - size * 1.5, overflow: "visible", opacity: op }}>
      {faces.map((q, i) => {
        const d1 = Math.max(0, q.n[0] * L1[0] + q.n[1] * L1[1] + q.n[2] * L1[2]), d2 = Math.max(0, q.n[0] * L2[0] + q.n[1] * L2[1] + q.n[2] * L2[2]);
        const k = 1 - dim;
        const a1 = Math.pow(d1, 3.2) * 0.85, a2 = Math.pow(d2, 3.6) * 0.95; const r = Math.min(255, 12 + (168 * a1 + 217 * a2) * k), g = Math.min(255, 10 + (85 * a1 + 70 * a2) * k), b = Math.min(255, 16 + (247 * a1 + 239 * a2) * k);
        return <polygon key={i} points={q.pts.map((p) => `${p[0]},${p[1]}`).join(" ")} fill={`rgb(${r | 0},${g | 0},${b | 0})`} stroke={`rgba(240,190,255,${0.42 * k + 0.06})`} strokeWidth={0.01} strokeLinejoin="round" />;
      })}
    </svg>
  );
};
const Glow: React.FC<{ x: number; y: number; r: number; a?: number; color?: string }> = ({ x, y, r, a = 1, color = "232,121,249" }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,240,255,${a}) 0%, rgba(${color},${0.75 * a}) 12%, rgba(168,85,247,${0.25 * a}) 40%, rgba(124,58,237,0) 70%)`, pointerEvents: "none" }} />
);

// ---------------------------------------------------------------- template block (grey skeleton site)
const TemplateBlock: React.FC<{ w: number; hh: number; seed: number; text?: React.ReactNode; tone?: number }> = ({ w, hh, seed, text, tone = 0 }) => {
  const g = (v: number) => `rgb(${v + tone},${v + tone},${v + tone + 4})`;
  return (
    <div style={{ position: "absolute", width: w, height: hh, borderRadius: 16, background: g(24), border: "1px solid rgba(255,255,255,.06)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 16, top: 16, width: 54, height: 10, borderRadius: 5, background: g(52) }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", right: 16 + i * 34, top: 17, width: 24, height: 8, borderRadius: 4, background: g(44) }} />)}
      <div style={{ position: "absolute", left: 16, top: 44, width: w - 32, height: hh * 0.38, borderRadius: 10, background: g(36) }}>
        {text}
      </div>
      <div style={{ position: "absolute", left: 16, top: 52 + hh * 0.38, width: w * 0.62, height: 12, borderRadius: 6, background: g(50) }} />
      <div style={{ position: "absolute", left: 16, top: 72 + hh * 0.38, width: w * 0.4, height: 12, borderRadius: 6, background: g(44) }} />
      <div style={{ position: "absolute", left: 16, top: 98 + hh * 0.38, width: 92, height: 26, borderRadius: 13, background: g(58) }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 16 + i * ((w - 32) / 3), top: hh - 70 - (seed % 2) * 4, width: (w - 32) / 3 - 10, height: 54, borderRadius: 8, background: g(32) }} />)}
    </div>
  );
};

// ---------------------------------------------------------------- code panel
type Tok = [string, string];
const P_ = C.purple, K_ = C.pink, W_ = C.ink, M_ = C.mute, G_ = "#C4B5FD";
const CODE: Tok[][] = [
  [["// we don't start with a template.", M_]],
  [["// we start with code.", M_]],
  [["", W_]],
  [["export ", K_], ["const ", K_], ["Hero", G_], [" = () => (", W_]],
  [["  <", W_], ["Scene", P_], [" precision", G_], ["=", W_], ['"1px"', "#F0ABFC"]],
  [["    motion", G_], ["={", W_], ["ease.outExpo", "#F0ABFC"], ["}", W_]],
  [["    light", G_], ["=", W_], ['"#A855F7 → #D946EF"', "#F0ABFC"]],
  [["    reputation", G_], ["=", W_], ['"earned"', "#F0ABFC"], [">", W_]],
  [["    <", W_], ["Shard", P_], [" orbit", G_], ["={", W_], ["360", "#F0ABFC"], ["} />", W_]],
  [["  </", W_], ["Scene", P_], [">", W_]],
  [[");", W_]],
];
const CODE_LEN = CODE.reduce((m, l) => m + l.reduce((a, t) => a + t[0].length, 0) + 1, 0);
const CodePanel: React.FC<{ s: number; t0: number; t1: number; w?: number; fs?: number }> = ({ s, t0, t1, w = 900, fs = 30 }) => {
  let budget = Math.floor(CODE_LEN * prog(s, t0, t1, (x: number) => x));
  let caret: [number, number] | null = null;
  return (
    <div style={{ width: w, borderRadius: 26, background: "linear-gradient(160deg, rgba(30,22,42,.92), rgba(12,9,18,.94))", border: "1px solid rgba(232,121,249,.22)", boxShadow: "0 40px 120px rgba(124,58,237,.25), inset 0 1px 0 rgba(255,255,255,.06)", padding: "34px 38px 40px", fontFamily: MONO, fontSize: fs, lineHeight: 1.55 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>{["#3a3245", "#3a3245", "#3a3245"].map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}<div style={{ marginLeft: 16, color: C.dim, fontSize: fs * 0.62, letterSpacing: "0.12em" }}>hero.tsx</div></div>
      {CODE.map((line, li) => {
        const parts: React.ReactNode[] = [];
        line.forEach(([t, col], ti) => {
          if (budget <= 0) return;
          const show = t.slice(0, budget); budget -= t.length;
          parts.push(<span key={ti} style={{ color: col }}>{show}</span>);
        });
        const lineLen = line.reduce((a, t) => a + t[0].length, 0);
        const typingHere = budget > -lineLen && budget <= 0 && caret === null;
        if (typingHere) caret = [li, 0];
        budget -= 1;
        return (
          <div key={li} style={{ display: "flex", whiteSpace: "pre", minHeight: fs * 1.55 }}>
            <span style={{ color: "#3f3850", width: fs * 1.6, flexShrink: 0 }}>{li + 1}</span>
            <span>{parts}{typingHere && <span style={{ display: "inline-block", width: fs * 0.12, height: fs * 1.1, marginLeft: 2, verticalAlign: "middle", background: C.glow, boxShadow: `0 0 18px ${C.glow}, 0 0 40px ${C.purple}`, opacity: 0.6 + 0.4 * Math.sin(s * 18) }} />}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- browser / phone frames
const Browser: React.FC<{ w: number; src: string; url?: string; children?: React.ReactNode }> = ({ w, src, url = "obsidian.studio", children }) => (
  <div style={{ width: w, borderRadius: 18, overflow: "hidden", background: "#121016", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 80px rgba(168,85,247,.12)" }}>
    <div style={{ height: w * 0.05, display: "flex", alignItems: "center", gap: w * 0.01, padding: `0 ${w * 0.02}px`, background: "#17141c" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: w * 0.012, height: w * 0.012, borderRadius: "50%", background: "#3b3545" }} />)}
      <div style={{ marginLeft: w * 0.02, flex: 1, height: w * 0.026, borderRadius: w * 0.013, background: "rgba(255,255,255,.05)", color: C.mute, fontFamily: MONO, fontSize: w * 0.016, display: "flex", alignItems: "center", paddingLeft: w * 0.012 }}>{url}</div>
    </div>
    <div style={{ position: "relative", width: w, height: w * 0.625 }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {children}
    </div>
  </div>
);

// ---------------------------------------------------------------- the film
const T = { shard: 1.0, wall: 3.2, freeze: 5.6, pull: 6.1, code: 7.2, build: 11.0, ads: 15.0, agents: 19.0, ring: 23.6, end: 26.0 };

export const Film: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const s = frame / fps;
  const cx = W / 2, cy = H / 2;

  // ---- S1/S6 the shard + focus light
  const shardIn = prog(s, 1.0, 2.4, E.soft);
  const shardOut = prog(s, 3.3, 4.2, E.io);
  const shardBack = prog(s, T.end + 0.3, T.end + 1.4, E.out);
  const shardRY = s * 0.9 + 0.6 * Math.sin(s * 0.4);
  const lightOp = win(s, 0, 0.6, 1.6, 2.4);

  // ---- S2 template wall
  const wallIn = prog(s, T.wall, T.wall + 0.8, E.out), wallOut = prog(s, T.pull + 0.3, T.code + 0.4, E.in);
  const scrollY = (s < T.freeze ? (s - T.wall) * 380 : (T.freeze - T.wall) * 380 + 18 * Math.exp(-(s - T.freeze) * 6) * Math.sin((s - T.freeze) * 30));
  const pull = prog(s, T.pull, T.code, E.in);

  // ---- S3 code
  const codeIn = prog(s, T.code - 0.2, T.code + 0.5, E.out);
  const codeOut = variant === "A" ? prog(s, T.build - 0.1, T.build + 0.5, E.in) : prog(s, T.build, T.build + 0.6, E.io);

  // ---- S5 agents
  const agIn = prog(s, T.agents - 0.2, T.agents + 0.6, E.out), agOut = prog(s, T.end - 0.1, T.end + 0.6, E.in);
  const night = prog(s, T.ring, T.ring + 1.8, E.io) * (1 - agOut);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", fontFamily: SANS }}>
      {/* deep ambient */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% ${lerp(40, 30, prog(s, 0, 30, (x: number) => x))}%, rgba(124,58,237,${0.16 + 0.06 * Math.sin(s * 0.7)}) 0%, rgba(7,6,10,0) 70%)` }} />
      <AbsoluteFill style={{ background: C.night, opacity: night * 0.85 }} />

      {/* ===== 1 · the light → the shard ===== */}
      {s < 4.4 && <Glow x={cx} y={cy - 40} r={lerp(30, 220, prog(s, 0, 1.4))} a={lightOp} />}
      {s < 4.4 && (
        <>
          <Glow x={cx} y={cy - 40} r={520} a={0.35 * shardIn * (1 - shardOut)} />
          <Shard cx={cx} cy={cy - 40 - shardOut * 60} size={lerp(120, 260, shardIn) * lerp(1, 0.55, shardOut)} ry={shardRY} op={shardIn * (1 - shardOut)} dim={shardOut * 0.8} />
        </>
      )}
      {/* facets drawing in (three hairlines) */}
      {s > 0.8 && s < 2.6 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {[[0, -300, -150, 40], [0, -300, 150, 40], [-150, 40, 150, 40]].map(([x1, y1, x2, y2], i) => {
            const k = prog(s, 0.85 + i * 0.18, 1.45 + i * 0.18, E.io);
            return <line key={i} x1={cx + x1} y1={cy - 40 + y1} x2={cx + lerp(x1, x2, k)} y2={cy - 40 + lerp(y1, y2, k)} stroke={C.glow} strokeWidth={2} opacity={(1 - prog(s, 2.0, 2.6)) * 0.9} />;
          })}
        </svg>
      )}

      {/* ===== 2 · the template wall ===== */}
      {s > T.wall - 0.1 && s < T.code + 0.6 && (
        <AbsoluteFill style={{ perspective: 2200, opacity: wallIn * (1 - wallOut * 0.95) }}>
          <div style={{ position: "absolute", left: cx, top: cy, transformStyle: "preserve-3d", transform: `rotateX(18deg) rotateZ(-8deg) scale(${lerp(1.3, 1.05, wallIn)}) translateY(${(1 - wallIn) * 300}px)` }}>
            {[-2, -1, 0, 1, 2].map((c) => Array.from({ length: 9 }, (_, j) => {
              const y = (j - 4) * 410 - (scrollY % 410), x = c * 336;
              const hero = c === 0 && j === 4;
              const k = hero ? pull : 0;
              const textNode = hero ? (
                <div style={{ position: "absolute", left: 18, top: 22, fontFamily: SANS, fontWeight: 500, fontSize: 25, lineHeight: 1.25, color: "#9A94A6" }}>
                  <div style={{ opacity: prog(s, 4.2, 4.6) }}>Same template.</div>
                  <div style={{ opacity: prog(s, 4.9, 5.3) }}>Same scroll.</div>
                  <div style={{ opacity: prog(s, 5.6, 6.0), color: "#C9C3D3" }}>Same silence.</div>
                </div>
              ) : undefined;
              return (
                <div key={`${c}_${j}`} style={{ position: "absolute", left: x - 155, top: (hero ? -205 : y - 205), transform: hero ? `translateZ(${k * 900}px) rotateY(${k * 40}deg)` : undefined, opacity: hero ? 1 - prog(s, T.pull + 0.45, T.code + 0.1) : 1, filter: hero ? `blur(${prog(s, T.pull + 0.4, T.code + 0.1) * 14}px)` : undefined }}>
                  <TemplateBlock w={310} hh={390} seed={c * 9 + j} text={textNode} tone={hero ? 6 : 0} />
                </div>
              );
            }))}
          </div>
        </AbsoluteFill>
      )}
      {/* particles: the pulled template dissolves into the focus light */}
      {s > T.pull + 0.35 && s < T.code + 0.6 && Array.from({ length: 46 }, (_, i) => {
        const k = prog(s, T.pull + 0.35 + h(i, 1) * 0.15, T.code + 0.3, E.io);
        const x0 = cx + (h(i, 2) - 0.5) * 520, y0 = cy + (h(i, 3) - 0.5) * 640, x1 = cx - 330, y1 = cy - 210;
        return <div key={i} style={{ position: "absolute", left: lerp(x0, x1, k), top: lerp(y0, y1, k) + Math.sin(k * Math.PI) * (h(i, 4) - 0.5) * 300, width: 6, height: 6, borderRadius: 3, background: C.glow, boxShadow: `0 0 12px ${C.glow}`, opacity: (1 - k * 0.4) * prog(s, T.pull + 0.35, T.pull + 0.6) }} />;
      })}

      {/* ===== 3 · code ===== */}
      {s > T.code - 0.3 && s < T.build + 0.8 && (
        <div style={{ position: "absolute", left: cx - 490, top: cy - 360, opacity: codeIn * (1 - codeOut), transform: `translateY(${(1 - codeIn) * 60}px) scale(${lerp(0.96, 1, codeIn) * lerp(1, variant === "A" ? 0.9 : 0.62, codeOut)}) translateX(${codeOut * (variant === "A" ? 0 : -260)}px)`, transformOrigin: "50% 50%" }}>
          <CodePanel s={s} t0={T.code + 0.3} t1={T.build - 0.6} w={980} fs={33} />
        </div>
      )}

      {/* ===== 4 · BUILD (variant) ===== */}
      {variant !== "A" && <LogicBuild s={s} variant={variant} cx={cx} cy={cy} />}
      {variant === "A" && <ImageryBuild s={s} cx={cx} cy={cy} />}

      {/* ===== 5 · agents ===== */}
      {s > T.agents - 0.3 && s < T.end + 0.8 && <Agents s={s} cx={cx} cy={cy} op={agIn * (1 - agOut)} />}

      {/* ===== 6 · the shard returns: OBSIDIAN ===== */}
      {s > T.end - 0.2 && (
        <>
          <Glow x={cx} y={cy - 180} r={lerp(80, 560, shardBack)} a={0.45 * shardBack} />
          <Shard cx={cx} cy={cy - 180} size={lerp(60, 230, shardBack)} ry={shardRY} op={shardBack} />
          <div style={{ position: "absolute", left: 0, width: W, top: cy + 170, textAlign: "center", fontFamily: DISPLAY, fontWeight: 600, fontSize: 104, letterSpacing: "0.32em", paddingLeft: "0.32em", color: C.ink, opacity: prog(s, T.end + 0.9, T.end + 1.6), filter: `blur(${(1 - prog(s, T.end + 0.9, T.end + 1.6)) * 10}px)` }}>OBSIDIAN</div>
          <div style={{ position: "absolute", left: 0, width: W, top: cy + 320, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 44, color: "#D9D2E3", opacity: prog(s, T.end + 1.5, T.end + 2.2) }}>
            Digital precision that <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent", fontWeight: 400 }}>builds reputation.</span>
          </div>
          <div style={{ position: "absolute", left: 0, width: W, top: cy + 430, textAlign: "center", fontFamily: MONO, fontSize: 28, letterSpacing: "0.18em", color: C.mute, opacity: prog(s, T.end + 2.2, T.end + 2.8) }}>WHATSAPP · 079 244 9607</div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4C/4B · the build as logic
const LogicBuild: React.FC<{ s: number; variant: Variant; cx: number; cy: number }> = ({ s, variant, cx, cy }) => {
  if (s < T.build - 0.2 || s > T.agents + 0.6) return null;
  const glimpseA = variant === "B" ? 14.2 : 99, glimpseB = glimpseA + 2.6;
  const adsT = variant === "B" ? glimpseB : T.ads;
  const chipEnd = variant === "B" ? glimpseA - 0.2 : adsT;
  const pageIn = prog(s, T.build, T.build + 0.7, E.out);
  const explode = prog(s, T.build + 1.6, T.build + 2.6, E.io) * (1 - prog(s, adsT - 0.7, adsT, E.io));
  const orbit = Math.sin((s - T.build) * 0.9) * 28 * explode;
  const toBrowser = variant === "B" ? prog(s, glimpseA - 0.5, glimpseA, E.io) : 0;
  const pageOut = prog(s, adsT - 0.5, adsT + 0.1, E.in);
  const layers = [
    { k: prog(s, T.build + 0.3, T.build + 0.8), z: -240, el: <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(ellipse at 70% 30%, rgba(168,85,247,.35), rgba(15,11,22,1) 65%)" }} /> },
    { k: prog(s, T.build + 0.45, T.build + 0.95), z: -80, el: <div style={{ position: "absolute", left: 40, top: 34, right: 40, height: 20, display: "flex", justifyContent: "space-between" }}><div style={{ width: 150, height: 18, borderRadius: 4, background: "rgba(255,255,255,.75)", fontFamily: DISPLAY, fontSize: 18, letterSpacing: "0.3em", color: "#0b0910", textAlign: "center", lineHeight: "18px" }}>OBSIDIAN</div><div style={{ display: "flex", gap: 16 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 56, height: 10, marginTop: 4, borderRadius: 5, background: "rgba(255,255,255,.35)" }} />)}</div></div> },
    { k: prog(s, T.build + 0.6, T.build + 1.1), z: 80, el: <div style={{ position: "absolute", left: 40, top: 150 }}><div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 64, lineHeight: 1, color: C.ink }}>Built to be</div><div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 64, lineHeight: 1.05, background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>remembered.</div></div> },
    { k: prog(s, T.build + 0.75, T.build + 1.25), z: 200, el: <div style={{ position: "absolute", left: 40, top: 330, width: 210, height: 58, borderRadius: 29, background: GRAD, boxShadow: `0 0 40px rgba(217,70,239,.5)`, color: "#fff", fontFamily: SANS, fontWeight: 500, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>Start a project</div> },
    { k: prog(s, T.build + 0.9, T.build + 1.4), z: 340, el: <div style={{ position: "absolute", right: 30, top: 110 }}><Shard cx={110} cy={130} size={95} ry={s * 1.4} /></div> },
  ];
  const PW = 900, PH = 560;
  return (
    <>
      {/* grid + tokens */}
      <AbsoluteFill style={{ opacity: win(s, T.build, T.build + 0.6, adsT - 0.6, adsT) * 0.55, backgroundImage: `linear-gradient(rgba(168,85,247,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.10) 1px, transparent 1px)`, backgroundSize: "48px 48px", backgroundPosition: `${cx}px ${cy}px` }} />
      <div style={{ position: "absolute", left: cx - PW / 2, top: cy - PH / 2 - 60, width: PW, height: PH, perspective: 1600, opacity: pageIn * (1 - pageOut) * (1 - toBrowser) }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${18 * explode}deg) rotateY(${-22 * explode + orbit}deg) scale(${lerp(1, 0.86, explode)})` }}>
          {layers.map((L, i) => (
            <div key={i} style={{ position: "absolute", inset: 0, transform: `translateZ(${L.z * explode}px)`, opacity: L.k, border: explode > 0.05 ? `1px solid rgba(232,121,249,${0.35 * explode})` : "none", borderRadius: 20 }}>{L.el}</div>
          ))}
        </div>
      </div>
      {/* measurement + token chips */}
      {[["48px", -440, -420, T.build + 1.0], ["#A855F7 → #D946EF", 90, -470, T.build + 1.3], ["ease.outExpo", -440, 300, T.build + 1.6], ["1px precision", -440, 380, T.build + 1.9]].map(([t, dx, dy, a], i) => (
        <div key={i} style={{ position: "absolute", left: cx + (dx as number), top: cy + (dy as number), fontFamily: MONO, fontSize: 26, color: "#E9D5FF", padding: "10px 18px", borderRadius: 12, background: "rgba(124,58,237,.16)", border: "1px solid rgba(232,121,249,.35)", opacity: win(s, a as number, (a as number) + 0.4, chipEnd - 0.7, chipEnd - 0.2), transform: `translateY(${(1 - prog(s, a as number, (a as number) + 0.4)) * 20}px)` }}>{t as string}</div>
      ))}
      {/* easing curve */}
      <svg width={300} height={220} style={{ position: "absolute", left: cx + 140, top: cy + 200, opacity: win(s, T.build + 2.2, T.build + 2.6, chipEnd - 0.7, chipEnd - 0.2) }}>
        <rect x={0} y={0} width={300} height={220} rx={16} fill="rgba(15,11,22,.85)" stroke="rgba(232,121,249,.25)" />
        <path d="M30 190 C 120 190, 120 40, 270 30" stroke={C.glow} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(s, T.build + 2.3, T.build + 3.2, E.io)} />
        <circle cx={lerp(30, 270, prog(s, T.build + 2.3, T.build + 3.2, E.io))} cy={lerp(190, 30, prog(s, T.build + 2.3, T.build + 3.2, Easing.bezier(0.16, 1, 0.3, 1)))} r={8} fill="#fff" />
      </svg>
      {/* B: the single glimpse — the build compiles into the real-estate scroll */}
      {variant === "B" && s > glimpseA - 0.6 && s < glimpseB + 0.6 && (() => {
        const k = prog(s, glimpseA - 0.5, glimpseA + 0.1, E.out), out = prog(s, glimpseB - 0.3, glimpseB + 0.3, E.in);
        const f = 1 + 74 * prog(s, glimpseA, glimpseB - 0.2, (x: number) => x);
        return <div style={{ position: "absolute", left: cx - 470, top: cy - 360, opacity: k * (1 - out), transform: `perspective(1600px) rotateY(${lerp(-18, 0, k) + out * 14}deg) scale(${lerp(0.9, 1, k)})` }}><Browser w={940} src={seq("estate", f)} url="estate · obsidian build" /></div>;
      })()}
      {/* ads: the timeline */}
      <AdTimeline s={s} t0={adsT} t1={T.agents} cx={cx} cy={cy} />
    </>
  );
};

const AdTimeline: React.FC<{ s: number; t0: number; t1: number; cx: number; cy: number }> = ({ s, t0, t1, cx, cy }) => {
  if (s < t0 - 0.3 || s > t1 + 0.5) return null;
  const k = prog(s, t0 - 0.2, t0 + 0.5, E.out), out = prog(s, t1 - 0.4, t1 + 0.2, E.in);
  const dur = t1 - t0;
  const render = prog(s, t0 + dur * 0.55, t1 - 0.5, E.io);
  const tracks = ["LIGHT", "TYPE", "SHARD", "SOUND"];
  return (
    <div style={{ position: "absolute", left: cx - 470, top: cy - 450, width: 940, opacity: k * (1 - out), transform: `translateY(${(1 - k) * 60 - out * 40}px)` }}>
      {/* vertical preview */}
      <div style={{ position: "relative", margin: "0 auto", width: 330, height: 586, borderRadius: 28, overflow: "hidden", background: "#0b0910", border: "1px solid rgba(232,121,249,.3)", boxShadow: "0 30px 90px rgba(124,58,237,.35)" }}>
        <Glow x={165} y={250} r={240} a={0.5} />
        <Shard cx={165} cy={260} size={95} ry={s * 1.8} />
        <div style={{ position: "absolute", left: 0, width: 330, top: 430, textAlign: "center", fontFamily: DISPLAY, fontWeight: 600, fontSize: 46, color: C.ink, opacity: prog(s, t0 + 0.6, t0 + 0.9) }}>Stop.</div>
        <div style={{ position: "absolute", left: 0, width: 330, top: 486, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 26, color: "#D9D2E3", opacity: prog(s, t0 + 1.0, t0 + 1.3) }}>and remember.</div>
        <div style={{ position: "absolute", left: 14, top: 14, fontFamily: MONO, fontSize: 16, color: C.mute, letterSpacing: "0.1em" }}>9:16 · AD</div>
      </div>
      {/* tracks */}
      <div style={{ marginTop: 34, borderRadius: 20, background: "rgba(18,13,26,.92)", border: "1px solid rgba(255,255,255,.08)", padding: "18px 22px" }}>
        {tracks.map((t, i) => (
          <div key={i} style={{ position: "relative", height: 52, display: "flex", alignItems: "center", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
            <div style={{ width: 120, fontFamily: MONO, fontSize: 20, color: C.mute, letterSpacing: "0.12em" }}>{t}</div>
            <div style={{ position: "relative", flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,.06)" }}>
              {Array.from({ length: 5 }, (_, j) => {
                const a = t0 + 0.2 + i * 0.15 + j * 0.22, kk = prog(s, a, a + 0.25, E.back);
                return <div key={j} style={{ position: "absolute", left: `${8 + j * 20 + h(i * 5 + j, 1) * 6}%`, top: -9, width: 22, height: 22, transform: `rotate(45deg) scale(${kk})`, background: j % 2 ? C.purple : C.pink, boxShadow: `0 0 14px ${C.glow}` }} />;
              })}
            </div>
          </div>
        ))}
        {/* playhead + render */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: MONO, fontSize: 20, color: render >= 1 ? "#F0ABFC" : C.mute, width: 200 }}>{render >= 1 ? "RENDERED · 4K" : `RENDERING ${Math.round(render * 100)}%`}</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,.06)", overflow: "hidden" }}><div style={{ width: `${render * 100}%`, height: "100%", background: GRAD, boxShadow: `0 0 16px ${C.glow}` }} /></div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 4A · the build with real imagery
const ImageryBuild: React.FC<{ s: number; cx: number; cy: number }> = ({ s, cx, cy }) => {
  if (s < T.build - 0.3 || s > T.agents + 0.6) return null;
  // 11.0–13.6 the compile: estate scroll (first half) then the bottom of the site
  const kIn = prog(s, T.build - 0.2, T.build + 0.5, E.out), kOut = prog(s, 13.4, 13.9, E.in);
  const ef = s < 12.9 ? 1 + 74 * prog(s, T.build + 0.2, 12.8, (x: number) => x) : 150;
  // 13.6–17.4 the orbit of real sites (360° carousel)
  const orbIn = prog(s, 13.5, 14.1, E.out), orbOut = prog(s, 17.2, 17.7, E.in);
  const ang = lerp(-40, 320, prog(s, 13.6, 17.4, E.io));
  const cards = [
    { kind: "seq", dir: "north", url: "northlight" }, { kind: "seq", dir: "surgery", url: "atelier vale" },
    { kind: "cigar", url: "cape atlantic" }, { kind: "obs", url: "obsidian.studio" },
  ];
  // 17.4–19 ad frames in a phone
  const adK = prog(s, 17.3, 17.8, E.out), adOut = prog(s, T.agents - 0.3, T.agents + 0.2, E.in);
  return (
    <>
      {s < 14.0 && (
        <div style={{ position: "absolute", left: cx - 470, top: cy - 330, opacity: kIn * (1 - kOut), transform: `perspective(1600px) rotateY(${lerp(16, 0, kIn) - kOut * 30}deg) scale(${lerp(0.92, 1, kIn)})` }}>
          <Browser w={940} src={seq("estate", ef)} url="private estates · obsidian build" />
          <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 24, color: C.mute, letterSpacing: "0.14em", opacity: prog(s, 11.4, 11.8) }}>SCROLL-DRIVEN · 60 FPS · CUSTOM CODE</div>
        </div>
      )}
      {s > 13.4 && s < 17.8 && (
        <AbsoluteFill style={{ perspective: 2000, opacity: orbIn * (1 - orbOut) }}>
          <div style={{ position: "absolute", left: cx, top: cy - 40, transformStyle: "preserve-3d", transform: `rotateX(-6deg) rotateY(${-ang}deg)` }}>
            {cards.map((c, i) => {
              const a = i * 90, fr = 1 + 120 * prog(s, 13.6, 17.4, (x: number) => x);
              const explode = c.kind === "obs" ? Math.max(0, Math.sin(prog(s, 15.4, 17.0, (x: number) => x) * Math.PI)) : 0;
              const src = c.kind === "seq" ? seq(c.dir!, fr) : c.kind === "cigar" ? site("cigars_hero.png") : staticFile("img/obsidian.jpg");
              return (
                <div key={i} style={{ position: "absolute", left: -410, top: -290, transform: `rotateY(${a}deg) translateZ(640px) scale(${820 / 680})`, transformOrigin: "340px 240px", backfaceVisibility: "hidden" }}>
                  {c.kind !== "obs" ? (
                    <Browser w={680} src={src} url={c.url}>
                      {c.kind === "cigar" && <Glow x={300 + Math.sin(s * 3) * 4} y={180} r={70} a={0.5 + 0.2 * Math.sin(s * 9)} color="255,120,40" />}
                    </Browser>
                  ) : (
                    <div style={{ width: 680, borderRadius: 18, overflow: "hidden", background: "#121016", border: "1px solid rgba(255,255,255,.1)" }}>
                      <div style={{ height: 34, background: "#17141c" }} />
                      <div style={{ position: "relative", width: 680, height: 425 }}>
                        {Array.from({ length: 48 }, (_, t) => {
                          const tx = t % 8, ty = Math.floor(t / 8), tw = 680 / 8, th = 425 / 6;
                          const dx = (h(t, 1) - 0.5) * 500 * explode, dy = (h(t, 2) - 0.5) * 400 * explode, rr = (h(t, 3) - 0.5) * 120 * explode;
                          return <div key={t} style={{ position: "absolute", left: tx * tw, top: ty * th, width: tw + 0.5, height: th + 0.5, backgroundImage: `url(${staticFile("img/obsidian.jpg")})`, backgroundSize: "680px 425px", backgroundPosition: `${-tx * tw}px ${-ty * th}px`, transform: `translate(${dx}px, ${dy}px) rotate(${rr}deg) scale(${1 - 0.3 * explode})`, opacity: 1 - 0.3 * explode }} />;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      {s > 17.2 && (
        <div style={{ position: "absolute", left: cx - 470, top: cy - 300, opacity: adK * (1 - adOut), transform: `perspective(1600px) rotateY(${lerp(-25, 0, adK)}deg)` }}>
          <div style={{ width: 940, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(232,121,249,.3)", boxShadow: "0 40px 120px rgba(124,58,237,.3)" }}>
            <Img src={seq("ad", 1 + 59 * prog(s, 17.4, T.agents, (x: number) => x))} style={{ width: 940, height: 529, display: "block" }} />
          </div>
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.mute, letterSpacing: "0.14em" }}>AD FILM · 16:9 · 9:16</div>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,.06)" }}><div style={{ width: `${prog(s, 17.5, 18.8, E.io) * 100}%`, height: "100%", background: GRAD }} /></div>
          </div>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 5 · agents (shared)
const Agents: React.FC<{ s: number; cx: number; cy: number; op: number }> = ({ s, cx, cy, op }) => {
  const t = T.agents;
  const orbY = cy - 560;
  const nodes = [
    { label: "FAQ receptionist", icon: "?", x: cx - 290, y: cy - 90 },
    { label: "Lead qualifier", icon: "◆", x: cx, y: cy - 30 },
    { label: "Outbound caller", icon: "☏", x: cx + 290, y: cy - 90 },
  ];
  const start = { x: cx, y: cy - 250 };
  const bubbles = [
    { t: t + 2.6, side: -1, y: cy + 90, text: "What are your viewing times?", who: "visitor" },
    { t: t + 3.2, side: 1, y: cy + 200, text: "Saturday 10:00 or 14:00. Shall I book you?", who: "agent" },
    { t: t + 3.9, side: -1, y: cy + 330, text: "Qualified · budget R4.2m → sent to sales", who: "sys" },
    { t: t + 4.5, side: 1, y: cy + 440, text: "Call booked · Tue 10:00", who: "sys" },
    { t: T.ring + 1.2, side: -1, y: cy + 560, text: "New lead · 02:14 · qualified", who: "sys" },
  ];
  const ring = prog(s, T.ring, T.ring + 2.2, E.io);
  const hour = Math.floor(lerp(14, 26, ring)) % 24, minute = Math.floor((lerp(14, 26, ring) % 1) * 60);
  const tests = prog(s, t + 4.6, t + 5.6, E.io);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* the agent orb (the focus light, grown up) */}
      <div style={{ position: "absolute", left: cx - 150, top: orbY - 150, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff 0%, #F5D0FE 10%, ${C.pink} 34%, ${C.violet} 70%, #2e1065 100%)`, filter: "blur(2px)", boxShadow: `0 0 120px rgba(217,70,239,.55)`, transform: `scale(${lerp(0.4, 1, prog(s, t - 0.2, t + 0.6, E.back)) * (1 + 0.03 * Math.sin(s * 3))})` }} />
      {/* 24 h ring */}
      <svg width={460} height={460} style={{ position: "absolute", left: cx - 230, top: orbY - 230, opacity: prog(s, T.ring - 0.2, T.ring + 0.3) }}>
        <circle cx={230} cy={230} r={210} stroke="rgba(255,255,255,.08)" strokeWidth={3} fill="none" />
        <circle cx={230} cy={230} r={210} stroke="url(#gr)" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 230 230)" strokeLinecap="round" />
        <defs><linearGradient id="gr"><stop offset="0" stopColor={C.violet} /><stop offset="1" stopColor={C.pink} /></linearGradient></defs>
      </svg>
      {s > T.ring - 0.2 && <div style={{ position: "absolute", left: cx + 190, top: orbY - 40, fontFamily: MONO, fontSize: 40, color: C.ink, opacity: prog(s, T.ring, T.ring + 0.3) }}>{String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}</div>}
      <div style={{ position: "absolute", left: 0, width: "100%", top: orbY + 190, display: "flex", justifyContent: "center", opacity: prog(s, t + 0.4, t + 0.8) }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.2em", color: "#E9D5FF", padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(232,121,249,.35)", background: "rgba(124,58,237,.12)" }}>POWERED BY AVANT INTELLIGENCE</div>
      </div>
      {/* the flow */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {nodes.map((n, i) => {
          const k = prog(s, t + 1.0 + i * 0.12, t + 1.6 + i * 0.12, E.io);
          const d = `M ${start.x} ${start.y + 30} C ${start.x} ${start.y + 110}, ${n.x} ${n.y - 110}, ${n.x} ${n.y - 34}`;
          const pulse = ((s - t - 1.6 - i * 0.3) % 1.6) / 1.6;
          return (
            <g key={i}>
              <path d={d} stroke="rgba(232,121,249,.45)" strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
              {s > t + 1.7 && <circle r={7} fill="#fff" style={{ offsetPath: `path("${d}")`, offsetDistance: `${pulse * 100}%` } as React.CSSProperties} />}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: start.x - 80, top: start.y - 28, width: 160, height: 56, borderRadius: 28, border: "1px solid rgba(255,255,255,.2)", background: "rgba(20,15,28,.9)", color: C.ink, fontFamily: SANS, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: prog(s, t + 0.7, t + 1.0) }}>▸ Start</div>
      {nodes.map((n, i) => {
        const k = prog(s, t + 1.4 + i * 0.12, t + 1.8 + i * 0.12, E.back);
        const lit = 0.5 + 0.5 * Math.max(0, Math.sin((s - t) * 3 - i));
        return (
          <div key={i} style={{ position: "absolute", left: n.x, top: n.y, transform: `translate(-50%,-50%) scale(${k})`, padding: "18px 26px", borderRadius: 18, background: "rgba(20,15,28,.92)", border: `1px solid rgba(232,121,249,${0.25 + 0.4 * lit})`, boxShadow: `0 0 ${30 * lit}px rgba(217,70,239,.35)`, color: C.ink, fontFamily: SANS, fontWeight: 500, fontSize: 27, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: GRAD, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>{n.icon}</span>{n.label}
          </div>
        );
      })}
      {/* bubbles */}
      {bubbles.map((b, i) => {
        const k = prog(s, b.t, b.t + 0.4, E.back);
        if (k <= 0) return null;
        const sys = b.who === "sys";
        return (
          <div key={i} style={{ position: "absolute", top: b.y, [b.side < 0 ? "left" : "right"]: 90, maxWidth: 760, transform: `translateY(${(1 - k) * 30}px) scale(${lerp(0.9, 1, k)})`, opacity: k, padding: "20px 28px", borderRadius: 26, background: sys ? "rgba(124,58,237,.18)" : b.who === "agent" ? "linear-gradient(135deg, rgba(168,85,247,.85), rgba(217,70,239,.85))" : "rgba(255,255,255,.09)", border: sys ? "1px solid rgba(232,121,249,.4)" : "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(10px)", color: C.ink, fontFamily: sys ? MONO : SANS, fontSize: sys ? 26 : 30, fontWeight: 400 } as React.CSSProperties}>{b.text}</div>
        );
      })}
      {/* tests */}
      <div style={{ position: "absolute", left: 90, top: orbY - 20, fontFamily: MONO, fontSize: 24, color: tests >= 1 ? "#F0ABFC" : C.mute, opacity: win(s, t + 4.6, t + 4.9, T.ring + 0.6, T.ring + 1.0) }}>TESTS PASSED · {Math.round(lerp(71, 100, tests))}%</div>
    </AbsoluteFill>
  );
};
