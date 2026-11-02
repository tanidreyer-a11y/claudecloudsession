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
  // Brand: Avant Intelligence (name pending) · base card Midnight Signal (client asked for the ElevenLabs style)
  format: "16:9",
  fps: 60, // rendered at 60, blended to 30 for motion blur
  durationSec: 40,
  palette: {
    base: "#030708", // the logo's black
    surface: "rgba(255,255,255,.06)",
    ink: "#F4F7F8",
    muted: "#8796A0",
    accent: "#3BC1EC", // neon blue, sampled from the logo's Λ
    accent2: "#7FE3FF",
    hero: ["#7FE3FF", "#2F7BFF", "#8C6BFF"],
    glow: "rgba(59,193,236,.30)",
    alt: "#071016",
    altInk: "#F4F7F8",
  },
  fonts: { display: "Manrope", text: "Manrope", mono: "Manrope" },
  type: { display: 120, title: 84, h2: 52, body: 34, ui: 30, label: 26, floor: 24 },
  motion: { enterFrames: 36, exitFrames: 22, stagger: 8, spring: { damping: 200, stiffness: 90, mass: 1 }, breathePx: 3 },
  finish: { grain: 0.07, vignette: 0.35 },
};

/** The four agents: each owns a shade; together they resolve to the logo blue. Roles are editable placeholders. */
export const AGENTS = [
  { id: "docs", label: "Documents", color: "#7FE3FF" },
  { id: "finance", label: "Finance", color: "#2F7BFF" },
  { id: "follow", label: "Follow-ups", color: "#8C6BFF" },
  { id: "approve", label: "Approvals", color: "#3EE0B5" },
] as const;
