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
  // OBSIDIAN (web studio) — palette and type from the live site (cinematic-obsidian/src/styles.css)
  format: "16:9",
  fps: 60,
  durationSec: 56,
  palette: {
    base: "#020102", // --ink
    surface: "#0B080D",
    ink: "#EEE9F1", // --foreground
    muted: "#95909A",
    accent: "#E84DEB", // --signal (pink-purple neon)
    accent2: "#8607B3", // --signal-deep
    hero: ["#E84DEB", "#B02BD6", "#8607B3"],
    glow: "rgba(232,77,235,.22)",
    alt: "#050306",
    altInk: "#EEE9F1",
  },
  fonts: { display: "Bricolage Grotesque", text: "Bricolage Grotesque", mono: "Red Hat Mono" },
  type: { display: 120, title: 84, h2: 52, body: 32, ui: 28, label: 22, floor: 22 },
  motion: { enterFrames: 30, exitFrames: 18, stagger: 6, spring: { damping: 18, stiffness: 140, mass: 0.9 }, breathePx: 3 },
  finish: { grain: 0.06, vignette: 0.32 },
};
