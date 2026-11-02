# Installed skills (copied from the public plugin sources, 2026-10-10)

The plugin "install" button needs the owner's account, so these were copied in as project skills instead.
Every session opened on this repository loads them.

| Skill | From | Commit | License |
|---|---|---|---|
| remotion-best-practices (router + create, markup, render, multimedia, docs, studio, captions, upgrade…) | github.com/remotion-dev/skills — the "Remotion" plugin | 0b5db9d | none stated in the repo |
| frontend-design | github.com/anthropics/claude-plugins-official — plugins/frontend-design | b8e53f1 | Apache-2.0 |
| design-critique | github.com/anthropics/knowledge-work-plugins — design | 95bdacc | Apache-2.0 |
| brand-review, campaign-plan, content-creation | github.com/anthropics/knowledge-work-plugins — marketing | 95bdacc | Apache-2.0 |
| HyperFrames, 21 skills: hyperframes (router), hyperframes-core/-animation/-audio/-cli/-creative/-keyframes/-registry/-studio, media-use, motion-graphics, general-video, talking-head-recut, embedded-captions, faceless-explainer, product-launch-video, music-to-video, pr-to-video, slideshow, figma, remotion-to-hyperframes | github.com/heygen-com/hyperframes — skills/ (added 2026-10-14) | 5de2712 | Apache-2.0 (vendor/hyperframes/LICENSE) |

Not copied: Creative Claw (music, sound effects, voice, video generation). It is a hosted service that needs the
owner's own sign-in, so it can only be added from the plugin card on claude.ai.
To update a skill: re-clone its source repo and copy the folder over.

`obsidian-ad-style` is ours (not copied): the router to the Obsidian house style in skills/motion-studio.

HyperFrames block library (210 blocks, 237 components): `vendor/hyperframes/registry`, index in
`vendor/hyperframes/INDEX.md`, same commit. Local change to a vendored file (Apache-2.0 §4b): the first line of the
`hyperframes` router's description now points to `obsidian-motion-architect`, so our architect decides before
HyperFrames' "default framework" rule. Re-apply it after any HyperFrames skills update.
`obsidian-motion-architect`, `obsidian-content` and `ai-reveal-product-video` are ours.

## Added 2026-10-14 (obsidian-video-studio)
- `obsidian-video-studio` is ours: the single entry for all video work; it routes to `obsidian-motion-architect`,
  `ai-reveal-product-video` and `obsidian-ad-style` (also ours).
- `vendor/pdoom-video` — github.com/mexicat/pdoom-video @ fa164b7, MIT (LICENSE kept). Removed: audio/ (copyrighted
  song), lyrics/, data/lyrics*.json. Used as engine reference only.
- Fonts in `obsidian-ad/brand-film/public/fonts` (Unbounded, Space Grotesk, IBM Plex Mono, Cormorant Garamond,
  Instrument Serif) — SIL OFL 1.1 via fontsource, licence in `LICENSE-OFL-fontsource.txt`.
- Method references (no files copied): "Level 5 Workflow Guide" (@visionaryclown.tv) and "Motion as Code —
  Workflow Guide" (PDFs supplied by the owner).

## 2026-10-15 — continuity method (one-shot focus point)
- Owner's reference reels (screen recordings, not stored in the repo): a one-shot focus-point reel and a
  "3 transitions to never get stuck in motion design" reel (camera pull-back, track matte, match cut). Method only.
- Walter Murch, *In the Blink of an Eye* — rule of six / eye trace (via https://artlist.io/blog/eye-trace-and-rule-of-six-editing/,
  https://studiobinder.com/blog/walter-murch-rule-of-six).
- Adobe, track mattes for custom transitions: https://www.adobe.com/learn/after-effects/web/create-custom-transitions
- School of Motion, six essential transitions: https://schoolofmotion.com/blog/six-essential-motion-design-transitions-tutorial
- Morph at speed hides imperfect matches: https://motiondesign.school/blog/morphing-study-how-to-create-animated-transition/
- Our code: `obsidian-ad/brand-film/src/fx/Camera.tsx`, `src/OneShot.tsx` (written here, no third-party code).
