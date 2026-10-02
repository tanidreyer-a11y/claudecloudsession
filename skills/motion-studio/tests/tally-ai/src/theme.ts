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
  // Test brief: Tally AI (fictional) · recipe A "Sunset Prompt × Kinetic Pop" (tests/runs/tally-ai.md)
  format: "9:16",
  fps: 30,
  durationSec: 20,
  palette: {
    // colour slot "mono-flip-gradient": paper ↔ charcoal flips + one loud gradient for hero frames
    base: "#F6F5F1",
    surface: "#FFFFFF",
    ink: "#141416",
    muted: "#77787F",
    accent: "#4F46E5",
    accent2: "#14B8A6",
    hero: ["#14B8A6", "#4F46E5", "#F59E0B"],
    glow: "rgba(79,70,229,.28)",
    alt: "#141416",
    altInk: "#F6F5F1",
  },
  fonts: { display: "DM Sans", text: "Inter", mono: "Inter" },
  type: { display: 132, title: 96, h2: 56, body: 38, ui: 34, label: 28, floor: 26 },
  // motion_feel "crisp-ui": 200–300 ms ease-out, quick staggers
  motion: { enterFrames: 9, exitFrames: 6, stagger: 3, spring: { damping: 18, stiffness: 220, mass: 0.7 }, breathePx: 3 },
  finish: { grain: 0.05, vignette: 0.22 },
};
