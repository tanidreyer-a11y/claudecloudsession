import React from "react";
import type { Theme } from "../theme";

type Variant = "glass" | "hairline" | "solid";
/** Panel: frosted glass, hairline card or solid card — chosen by the recipe's ui_treatment slot. */
export const Panel: React.FC<{ t: Theme; variant?: Variant; style?: React.CSSProperties; children?: React.ReactNode; dark?: boolean }> = ({ t, variant = "hairline", style, children, dark }) => {
  const base: React.CSSProperties = { borderRadius: 28, position: "relative", overflow: "hidden" };
  const v: Record<Variant, React.CSSProperties> = {
    glass: { background: dark ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.55)", backdropFilter: "blur(24px)", border: `1px solid ${dark ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.8)"}`, boxShadow: `inset 0 1px 0 rgba(255,255,255,.35), 0 30px 80px -20px ${t.palette.glow}` },
    hairline: { background: t.palette.surface, border: `1px solid ${t.palette.muted}33`, boxShadow: `0 24px 60px -24px ${t.palette.ink}33` },
    solid: { background: t.palette.surface, boxShadow: `0 30px 70px -25px ${t.palette.ink}55` },
  };
  return <div style={{ ...base, ...v[variant], ...style }}>{children}</div>;
};

/** Pill / chip. */
export const Pill: React.FC<{ t: Theme; children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ t, children, bg, color, size, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: `${(size ?? t.type.ui) * 0.45}px ${(size ?? t.type.ui) * 0.9}px`, borderRadius: 999, background: bg ?? t.palette.surface, color: color ?? t.palette.ink, fontFamily: t.fonts.text, fontWeight: 600, fontSize: size ?? t.type.ui, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

/** Simple SVG icons (never emoji). */
export const Icon: React.FC<{ name: "send" | "check" | "doc" | "sheet" | "zip" | "arrow" | "alert"; size?: number; color?: string }> = ({ name, size = 32, color = "currentColor" }) => {
  const p: Record<string, React.ReactNode> = {
    send: <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill={color} />,
    check: <path d="M5 12.5l4.2 4.2L19 7" stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    doc: <path d="M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h6M9.5 15.5h6" stroke={color} strokeWidth={1.8} fill="none" strokeLinejoin="round" />,
    sheet: <path d="M5 4h14v16H5zM5 9h14M5 14h14M11 4v16" stroke={color} strokeWidth={1.8} fill="none" />,
    zip: <path d="M6 3h12v18H6zM12 3v2m0 2v2m0 2v2M10.5 15h3v3h-3z" stroke={color} strokeWidth={1.8} fill="none" />,
    arrow: <path d="M7 17L17 7M9 7h8v8" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    alert: <path d="M12 4l9 16H3zM12 10v4.5M12 17.2v.3" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{p[name]}</svg>;
};
