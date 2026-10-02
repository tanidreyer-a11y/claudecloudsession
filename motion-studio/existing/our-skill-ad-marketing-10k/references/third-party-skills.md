# Third-party skills & repos (vetted 2026-09-29)

Installed as knowledge only (copy SKILL.md / markdown, never hooks or MCP configs):
remotion-dev/skills (best-practices, saas, multimedia, render, create) · haidrrrry remotion-motion-graphics ·
iart-ai motion-design-skills (animation-principles, color-motion, shot-composition, motion-art-direction,
beat-sync-editing, remotion-video, logo-animation, motion-background) · noamdorr saas-product-demo-video ·
chandreshpv remotion-product-videos · aariz51 promo-video · GordenSun react-bits-video · Barty-Bart motion-broll ·
DojoCodingLabs remotion-production (markdown only).

Do NOT install: DojoCodingLabs `.mcp.json`/hooks (5 paid-API MCPs: KIE, ElevenLabs, TwelveLabs, Pexels, Replicate);
Johnson-Jia/video-clipforge (hooks run Python on every Bash call + curl|bash installer).
Technique only: codeverbojan/remotion-cinematic (`engine/cursor/arc.ts`, `camera/AutoZoom.tsx`).
Link lists only: wilwaldon, zhuyansen.

## Vetting checklist for any new repo
Exists · SKILL.md present · scan for hooks / settings.json / .mcp.json · install scripts · `curl|bash`, `eval`,
`child_process` · API-key env vars · copy knowledge files only.

## Libraries & tools used across the three films
Remotion 4 + React 19 + TypeScript · `@remotion/google-fonts` · Playwright (Chromium) frame capture · ffmpeg
(`imageio-ffmpeg` bundled binary when ffmpeg is missing) · numpy (+ scipy) audio synthesis · pocketsphinx (offline
word timing) · PyMuPDF (brand-bible vector/image/font extraction) · Pillow · `@fontsource/*` fonts via npm.
