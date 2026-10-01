# premium-motion-film (Claude skill)

High-end, ElevenLabs-style SaaS/B2B brand films from a brief: intake questions → concept → voice-ready script with
proper pacing → brand extraction from a PDF bible → word-synced code animation (zoom-throughs, spline camera, UI
templates, bubbles, lines, geometry) → sound design → 60 fps motion-blur render → pricing.

Install: add the `.skill` file in Claude (Settings → Skills) or copy this folder to `~/.claude/skills/premium-motion-film/`.
Requirements for the build pipeline: Node + Playwright (Chromium), ffmpeg (or `pip install imageio-ffmpeg`),
Python 3 with `numpy pymupdf pocketsphinx`.
Start by reading `SKILL.md`, then `references/lessons-learned.md`.
