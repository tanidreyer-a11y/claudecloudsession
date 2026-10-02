# Third-party skills & repos (vetted 2026-09-29, re-vetted 2026-10-02)

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

## Re-vetting 2026-10-02 (12 repos; knowledge copies in the user repo at motion-studio/existing/github-skills/)
| Repo | Licence | Found | Verdict |
|---|---|---|---|
| remotion-dev/skills | none file (official Remotion) | 12 SKILL.md; mentions ELEVENLABS / Google Maps keys in examples | Knowledge only ✔ |
| haidrrrry/claude-remotion-skill | MIT | clean | Knowledge only ✔ (springs, staggers, 5-layer finishing stack, render-inspect loop) |
| iart-ai/motion-design-skills | MIT | clean, 9 skills | Knowledge only ✔ |
| noamdorr/saas-product-demo-video | MIT | Gemini key in an optional step | Knowledge only ✔ |
| chandreshpv/remotion-product-videos-claude-skill | MIT | clean | Knowledge only ✔ |
| aariz51/promo-video | MIT | full app: runs CLIs (child_process), OpenAI/Anthropic/Groq/OpenRouter keys | Knowledge only ✔ — never run its code |
| GordenSun/react-bits-video | MIT | render script spawns ffmpeg | Knowledge only ✔ |
| Barty-Bart/motion-graphics (motion-broll) | MIT | engine spawns render | Knowledge only ✔ |
| DojoCodingLabs/remotion-superpowers | MIT | **hooks/hooks.json + .mcp.json (5 paid-API MCPs: ElevenLabs, KIE, Pexels, TwelveLabs…)**, setup script | Knowledge only ✔ — hooks/MCP excluded, do NOT install the plugin |
| codeverbojan/remotion-cinematic | MIT | `.claude/settings.json`, Anthropic key | Technique only (arc cursor, AutoZoom read as .txt) |
| Vincentwei1021/video-shotcraft | Apache-2.0 | 152 shot recipe cards; workbench runs vite | Knowledge only ✔ — big shot library |
| BayramAnnakov/remotion-video-director | none file | ElevenLabs key in docs | Knowledge only ✔ |
Not found under the old names: haidrrrry/remotion-motion-graphics (same author's repo above is the one).

What was absorbed into this skill: haidrrrry's rules → production.md §2; shotcraft's 152 shot cards → library/shots/
(Apache-2.0, attribution kept); iart-ai/remotion-dev/noamdorr/chandreshpv knowledge informs slots.yaml parts and production.md;
aariz51 and codeverbojan = technique only (their code calls paid APIs with keys).

## Vetting checklist for any new repo
Exists · SKILL.md present · scan for hooks / settings.json / .mcp.json · install scripts · `curl|bash`, `eval`,
`child_process` · API-key env vars · copy knowledge files only.

## Libraries & tools used across the three films
Remotion 4 + React 19 + TypeScript · `@remotion/google-fonts` · Playwright (Chromium) frame capture · ffmpeg
(`imageio-ffmpeg` bundled binary when ffmpeg is missing) · numpy (+ scipy) audio synthesis · pocketsphinx (offline
word timing) · PyMuPDF (brand-bible vector/image/font extraction) · Pillow · `@fontsource/*` fonts via npm.
