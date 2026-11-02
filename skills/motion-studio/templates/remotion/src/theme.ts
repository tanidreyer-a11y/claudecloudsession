// ONE theme object per film. Fill it from the chosen recipe (library/slots.yaml) + the brand profile.
// Nothing in components may hard-code a colour, font, easing or timing: read it from here.
// The defaults are deliberately NEUTRAL (greys + one blue). They are not any client's brand.

export type Format = "16:9" | "9:16" | "1:1" | "4:5";
export const SIZES: Record<Format, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
};

export type Theme = {
  format: Format;
  fps: number;
  durationSec: number;
  palette: {
    base: string; // dominant background
    surface: string; // cards, panels
    ink: string; // main text
    muted: string; // secondary text
    accent: string; // ≤ 5 % of frame
    accent2: string;
    hero: [string, string, string]; // gradient stops for hero frames
    glow: string;
    alt: string; // second background for colour flips (e.g. charcoal ↔ paper)
    altInk: string;
  };
  fonts: { display: string; text: string; mono: string };
  type: { display: number; title: number; h2: number; body: number; ui: number; label: number; floor: number };
  motion: {
    // recipe slot motion_feel → these numbers
    enterFrames: number; // entrance duration
    exitFrames: number; // exits are faster than entrances
    stagger: number; // frames between siblings
    spring: { damping: number; stiffness: number; mass: number };
    breathePx: number;
  };
  finish: { grain: number; vignette: number };
};

export const theme: Theme = {
  format: "16:9",
  fps: 30,
  durationSec: 8,
  palette: {
    base: "#F5F5F4",
    surface: "#FFFFFF",
    ink: "#111214",
    muted: "#6B6F76",
    accent: "#3B6FE0",
    accent2: "#E0703B",
    hero: ["#3B6FE0", "#7A5CE0", "#E0703B"],
    glow: "rgba(59,111,224,.35)",
    alt: "#16171A",
    altInk: "#F5F5F4",
  },
  fonts: { display: "Inter", text: "Inter", mono: "JetBrains Mono" },
  type: { display: 128, title: 88, h2: 52, body: 34, ui: 30, label: 27, floor: 24 },
  motion: { enterFrames: 18, exitFrames: 10, stagger: 4, spring: { damping: 200, stiffness: 120, mass: 1 }, breathePx: 3 },
  finish: { grain: 0.06, vignette: 0.25 },
};
