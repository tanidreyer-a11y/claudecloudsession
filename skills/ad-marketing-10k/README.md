# ad-marketing-10k (Claude skill)

A general playbook for producing premium SaaS / B2B marketing films for any company, built in code.
Intake questions → concept → paced voice script → brand extraction from a PDF brand bible → word-synced motion
(zoom-throughs, spline camera, UI templates, message bubbles, lines, geometry) → musical sound design →
grade / grain / loudness finishing → delivery → pricing. 40+ documented mistakes so they don't repeat, and a
reasoned review of which older rules were kept or overridden.

Install: "Save skill" on the .skill file in Claude, or copy this folder to `~/.claude/skills/ad-marketing-10k/`.
Pipeline needs: Node (+ Playwright/Chromium or Remotion), ffmpeg (or `pip install imageio-ffmpeg`),
Python 3 with `numpy pymupdf pocketsphinx`. Start with `SKILL.md`, then `references/lessons-learned.md`.
