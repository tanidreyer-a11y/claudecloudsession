// Phase-3 test film — "Tally AI" (FICTIONAL startup, demo data). Recipe A from tests/runs/tally-ai.md:
// structure launch-teaser · pacing short-punch · camera locked-type · transitions beat-cut + word-roll + send-is-the-cut
// typography word-swap-colour · colour mono-flip-gradient · ui prompt-bar-results · motion crisp-ui · sound sparse-minimal
// hook typed-promise. Truth rule: the product isn't live, so the CTA is a waitlist, and numbers are labelled demo data.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { theme as t } from "./theme";
import { T, sec } from "./timeline";
import { Background, Finish, Grade } from "./components/Layers";
import { WordReveal, WordRoll, typed } from "./components/Type";
import { Icon, Panel, Pill } from "./components/UI";
import { EASE, breathe, enter, inWindow, prog, springAt } from "./lib/motion";

const P = t.palette;

const Caption: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", fontFamily: t.fonts.text, fontSize: t.type.floor, color: dark ? "#9A9BA3" : P.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
    Demo data · fictional company
  </div>
);

/** S1 — hook: a promise typed into a prompt bar on charcoal; the send button is the cut. */
const S1: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const s = (x: number) => sec(x, fps);
  const ty = typed(f, "Reconcile March", s(T.type), fps, 13);
  const press = springAt(f, s(T.send), fps, t, { damping: 12, stiffness: 300 });
  const pressScale = 1 - 0.12 * Math.sin(Math.min(1, press) * Math.PI);
  const barIn = enter(f, t, 0, undefined, { dy: 40, blur: 12, scale: 0.94 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...enter(f, t, 2), marginBottom: 54 }}>
        <Pill t={t} bg="rgba(255,255,255,.08)" color={P.altInk} size={t.type.label} style={{ border: "1px solid rgba(255,255,255,.16)" }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: P.accent2, display: "inline-block" }} /> Tally AI · finance agent
        </Pill>
      </div>
      <div style={{ ...barIn, translate: `0 ${breathe(f, t)}px` }}>
        <Panel t={t} variant="glass" dark style={{ width: 900, height: 150, display: "flex", alignItems: "center", padding: "0 30px 0 48px", borderRadius: 75 }}>
          <div style={{ flex: 1, fontFamily: t.fonts.text, fontSize: 52, fontWeight: 500, color: P.altInk, letterSpacing: "-0.01em" }}>
            {ty.shown || <span style={{ color: "#6E6F78" }}>Ask Tally…</span>}
            <span style={{ opacity: ty.caretOn ? 1 : 0, color: P.accent2, marginLeft: 2 }}>|</span>
          </div>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: f >= s(T.send) - 3 ? P.accent : "#2A2A31", display: "flex", alignItems: "center", justifyContent: "center", scale: String(pressScale), boxShadow: f >= s(T.send) ? `0 0 ${40 * press}px ${P.accent}` : "none" }}>
            <Icon name="send" size={46} color={P.altInk} />
          </div>
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

const FILES: { name: string; icon: "doc" | "sheet" | "zip"; col: string; at: keyof typeof T; done: keyof typeof T; result: string }[] = [
  { name: "bank_statement_mar.pdf", icon: "doc", col: "#E5484D", at: "chip1", done: "match1", result: "212 of 212 lines matched" },
  { name: "invoices_mar.xlsx", icon: "sheet", col: "#30A46C", at: "chip2", done: "match2", result: "198 of 199 matched" },
  { name: "receipts_mar.zip", icon: "zip", col: P.accent, at: "chip3", done: "match3", result: "64 of 64 matched" },
];

/** S2 — the result of "send": three file chips analyse, then resolve. Paper background (colour flip). */
const S2: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const s = (x: number) => sec(x, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34 }}>
      <div style={{ ...enter(f, t, s(T.cut1) - 4, s(T.cut2) - 6), fontFamily: t.fonts.display, fontWeight: 700, fontSize: t.type.h2, color: P.ink, marginBottom: 20, letterSpacing: "-0.02em" }}>Reading your month…</div>
      {FILES.map((x, i) => {
        const doneP = prog(f, s(T[x.done]), s(T[x.done]) + 8);
        const warn = i === 1;
        return (
          <div key={x.name} style={enter(f, t, s(T[x.at]) - 4, s(T.cut2) - 8 + i * 2, { dy: 60, blur: 10 })}>
            <Panel t={t} variant="hairline" style={{ width: 880, padding: "30px 36px", display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: 88, height: 88, borderRadius: 22, background: x.col, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={x.icon} size={48} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: t.fonts.text, fontWeight: 600, fontSize: t.type.ui + 2, color: P.ink }}>{x.name}</div>
                <div style={{ position: "relative", height: 44, marginTop: 6 }}>
                  <div style={{ position: "absolute", fontFamily: t.fonts.text, fontSize: t.type.label, color: P.muted, opacity: 1 - doneP }}>Matching…</div>
                  <div style={{ position: "absolute", fontFamily: t.fonts.text, fontSize: t.type.label, fontWeight: 600, color: warn ? "#B4620B" : "#1E8A57", opacity: doneP, translate: `0 ${10 * (1 - doneP)}px` }}>{x.result}</div>
                </div>
              </div>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: warn ? "#FDEBD3" : "#DDF3E6", display: "flex", alignItems: "center", justifyContent: "center", scale: String(0.6 + 0.4 * doneP), opacity: doneP }}>
                <Icon name={warn ? "alert" : "check"} size={36} color={warn ? "#B4620B" : "#1E8A57"} />
              </div>
              {/* progress hairline while matching */}
              <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${100 * prog(f, s(T[x.at]) + 4, s(T[x.done]), EASE.inOut)}%`, background: x.col, opacity: 1 - doneP }} />
            </Panel>
          </div>
        );
      })}
      <Caption />
    </AbsoluteFill>
  );
};

/** S3 — word-swap claim on charcoal: "Books that" + rolling word, the swapped word takes the hero colours. */
const S3: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const s = (x: number) => sec(x, fps);
  const size = 150;
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 110 }}>
      <div style={enter(f, t, s(T.cut2) - 4, s(T.cut3) - 6, { dy: 40 })}>
        <div style={{ fontFamily: t.fonts.display, fontWeight: 700, fontSize: size, color: P.altInk, letterSpacing: "-0.04em", lineHeight: 1.12 }}>Books that</div>
        <WordRoll t={t} words={["balance.", "explain.", "close."]} times={[s(T.roll0), s(T.roll1), s(T.roll2)]} size={size} colors={[P.hero[0], "#8B84FF", P.hero[2]]} />
        <div style={{ ...enter(f, t, s(T.roll2) + 6, s(T.cut3) - 6), marginTop: 40, fontFamily: t.fonts.text, fontSize: t.type.body, color: "#A3A4AC", maxWidth: 760 }}>
          Every line matched, every gap explained.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ROWS = [
  { d: "03 Mar", who: "Office lease", amt: "R 18 500.00", ok: true },
  { d: "09 Mar", who: "Cloud hosting", amt: "R 2 316.40", ok: true },
  { d: "14 Mar", who: "Courier invoice #4471", amt: "R 1 240.00", ok: false },
  { d: "21 Mar", who: "Stationery", amt: "R 486.90", ok: true },
];

/** S4 — the answer card: rows land, one gap gets flagged, the agent asks for the missing invoice. */
const S4: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const s = (x: number) => sec(x, fps);
  const flag = prog(f, s(T.flag), s(T.flag) + 8);
  const req = enter(f, t, s(T.request), s(T.cut4) - 6, { dy: 30 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={enter(f, t, s(T.cut3) - 4, s(T.cut4) - 8, { dy: 50, scale: 0.97 })}>
        <Panel t={t} variant="solid" style={{ width: 920, padding: "44px 44px 30px" }}>
          <div style={{ fontFamily: t.fonts.display, fontWeight: 700, fontSize: t.type.h2, color: P.ink, letterSpacing: "-0.02em" }}>March · bank vs books</div>
          <div style={{ fontFamily: t.fonts.text, fontSize: t.type.label, color: P.muted, marginTop: 4, marginBottom: 26 }}>1 item needs you</div>
          {ROWS.map((r, i) => {
            const st = enter(f, t, s(T.row) + i * 5, undefined, { dy: 24, blur: 6 });
            const bad = !r.ok;
            return (
              <div key={r.who} style={{ ...st, display: "flex", alignItems: "center", gap: 20, padding: "22px 18px", borderTop: `1px solid ${P.muted}26`, borderRadius: 16, background: bad ? `rgba(245,158,11,${0.14 * flag})` : "transparent" }}>
                <div style={{ width: 110, fontFamily: t.fonts.text, fontSize: t.type.label, color: P.muted, fontVariantNumeric: "tabular-nums" }}>{r.d}</div>
                <div style={{ flex: 1, fontFamily: t.fonts.text, fontSize: t.type.ui, color: P.ink, fontWeight: 500 }}>{r.who}</div>
                <div style={{ fontFamily: t.fonts.text, fontSize: t.type.ui, color: P.ink, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{r.amt}</div>
                <div style={{ width: 52, height: 52, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", background: bad ? (flag > 0 ? "#FDEBD3" : "#EEE") : "#DDF3E6" }}>
                  <Icon name={bad ? "alert" : "check"} size={30} color={bad ? (flag > 0 ? "#B4620B" : "#999") : "#1E8A57"} />
                </div>
              </div>
            );
          })}
          <div style={{ ...req, marginTop: 26, display: "flex", justifyContent: "flex-end" }}>
            <Pill t={t} bg={P.ink} color={P.altInk} size={t.type.label}>
              <Icon name="check" size={28} color={P.hero[0]} /> Invoice requested from courier
            </Pill>
          </div>
        </Panel>
      </div>
      <Caption />
    </AbsoluteFill>
  );
};

/** S5 — hero gradient frame. */
const S5: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const s = (x: number) => sec(x, fps);
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 110, paddingRight: 90 }}>
      <WordReveal t={t} text="Month-end," at={s(T.cut4) - 4} out={s(T.cut5) - 6} size={140} color="#fff" weight={700} align="left" />
      <div style={{ height: 12 }} />
      <WordReveal t={t} text="without the spreadsheet." at={s(T.cut4) + 6} out={s(T.cut5) - 6} size={140} color="#fff" weight={700} align="left" />
    </AbsoluteFill>
  );
};

/** S6 — wordmark + waitlist pill (the product isn't live). */
const S6: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const s = (x: number) => sec(x, fps);
  const dot = springAt(f, s(T.logo) + 6, fps, t, { damping: 10, stiffness: 180 });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...enter(f, t, s(T.cut5) - 4, undefined, { dy: 30, blur: 14 }), display: "flex", alignItems: "baseline", fontFamily: t.fonts.display, fontWeight: 700, fontSize: 190, color: P.altInk, letterSpacing: "-0.05em" }}>
        tally
        <span style={{ width: 42, height: 42, borderRadius: 21, background: P.hero[0], display: "inline-block", marginLeft: 10, scale: String(dot), boxShadow: `0 0 50px ${P.hero[0]}` }} />
      </div>
      <div style={{ ...enter(f, t, s(T.logo) + 8), fontFamily: t.fonts.text, fontSize: t.type.body, color: "#A3A4AC", marginTop: 8 }}>Your books, reconciled by an agent.</div>
      <div style={{ ...enter(f, t, s(T.cta), undefined, { dy: 30, scale: 0.9 }), marginTop: 80 }}>
        <Pill t={t} bg={P.altInk} color={P.ink} size={40} style={{ padding: "26px 44px" }}>
          Join the waitlist <Icon name="arrow" size={36} color={P.ink} />
        </Pill>
      </div>
      <Caption dark />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (x: number) => sec(x, fps);
  // colour flips on hard cuts (beat-cut transition): charcoal → paper → charcoal → paper → hero → charcoal
  const scene = f < s(T.cut1) ? 1 : f < s(T.cut2) ? 2 : f < s(T.cut3) ? 3 : f < s(T.cut4) ? 4 : f < s(T.cut5) ? 5 : 6;
  const dark = scene === 1 || scene === 3 || scene === 6;
  const heroMix = scene === 5 ? 1 : 0;
  // a 4-frame camera punch on every cut (locked frame otherwise)
  const cuts = [T.cut1, T.cut2, T.cut3, T.cut4, T.cut5].map(s);
  const punch = cuts.reduce((a, c) => a + (f >= c && f < c + 8 ? 0.03 * (1 - prog(f, c, c + 8)) : 0), 0);
  return (
    <AbsoluteFill style={{ fontFamily: t.fonts.text, overflow: "hidden" }}>
      <Background t={t} color={dark ? P.alt : P.base} heroMix={heroMix} seed={scene} glow={dark ? 0.55 : 0.18} />
      <AbsoluteFill style={{ scale: String(1 + punch) }}>
        {inWindow(f, 0, s(T.cut1)) && <S1 f={f} fps={fps} />}
        {inWindow(f, s(T.cut1), s(T.cut2)) && <S2 f={f} fps={fps} />}
        {inWindow(f, s(T.cut2), s(T.cut3)) && <S3 f={f} fps={fps} />}
        {inWindow(f, s(T.cut3), s(T.cut4)) && <S4 f={f} fps={fps} />}
        {inWindow(f, s(T.cut4), s(T.cut5)) && <S5 f={f} fps={fps} />}
        {inWindow(f, s(T.cut5), s(T.end) + 1) && <S6 f={f} fps={fps} />}
      </AbsoluteFill>
      <Grade />
      <Finish t={t} />
    </AbsoluteFill>
  );
};
