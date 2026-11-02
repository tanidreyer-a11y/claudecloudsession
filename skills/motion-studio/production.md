# Production — from recipe to rendered film

Two engines, same rules. Pick by environment: **Remotion** on a laptop with live preview, or the **HTML engine**
(pure `render(t)` + Playwright + ffmpeg) in cloud sessions. Both are proven. Details:
`references/remotion-engine.md`, `references/production-pipeline.md`, `scripts/engine/`, `templates/remotion/`.

## 1. Theme first (one object, no inline values)
Translate the chosen recipe into a theme before any scene code (`templates/remotion/src/theme.ts`, or the `THEME`
const in the HTML engine):
- palette roles: base, surface, ink, muted, accent, glow, plus photo grade;
- fonts with their OFL source;
- easing curves, spring presets, stagger, beat length (from pacing), camera mode;
- grain and vignette strength.
Brand profile tokens override the colour family's roles; the family supplies the rest.

## 2. Non-negotiable motion rules
The haidrrrry rules (MIT), merged with what our approved films proved:
1. **No linear easing.** Every interpolate has a curve and is clamped. Entrances prefer springs.
2. **Entrances animate 2–3 properties together** (opacity + translate + scale/blur). A lone fade is forbidden.
3. **Stagger everything**: 3–6 frames (calm 5–8). Nothing enters at the same time.
4. **Exits exist and are faster than entrances** (~10 frames vs ~20).
5. **Five-layer stack in every scene**: background (mesh/texture/photo) → assets → graphics/type → grade → grain +
   vignette. Never a flat solid background.
6. **Every still image gets Ken Burns** (1 → 1.08 + pan). Footage uses `<OffthreadVideo>`.
7. **Idle elements breathe**: anything on screen > 2 s gets slow sine micro-motion (±2–4 px).
8. **All timing derives from fps and the timeline file.** The voice is the master clock (SKILL.md §5).
9. **One theme object.** No hex or easing inline.
10. **Render → extract frames → LOOK → fix → re-render.** Never deliver unverified.
11. **Camera = monotone cubic spline**, log-space zoom, 60 → 30 fps blend for motion blur. Never chain eased
    key-to-key moves (stop-start judder was our #1 complaint).
12. **Never an empty frame**: overlap outgoing and incoming scenes; transitions come from the recipe.
13. **Motion inventory**: one treatment per content type; print it before delivery. A repeat is a bug.
14. No CSS transitions/animations and no `Math.random` (seeded hash). Geometry comes from constants, never DOM
    measurement during render. Icons are SVG, never emoji.

## 3. Build order
1. Script and voice (SKILL.md §4–5), or a beat sheet for music-led films.
2. Timeline file (named keys in seconds).
3. Imagery (imagery.md): client assets → connector → prompts. Use placeholders until it arrives.
4. Stills contact sheet at every beat → look → fix. Send the storyboard to the client.
5. Audio: music bed, UI notes, ≤ 3 air moves, duck under VO. Check loudness.
6. 5–10 s preview **with sound** → send.
7. Full render → `scripts/finish.sh` → QA (qa-checklist.md) on the ENCODED file → deliver.

## 4. Formats
- 16:9 1920×1080 · 9:16 1080×1920 (critical content in the middle 75 % vertically; platform UI covers top and bottom) ·
  1:1 1080×1080 · 4:5 1080×1350.
- Compose each format separately. Don't letterbox, and don't crop blindly: re-lay type and re-frame the camera keys.
- Loudness: −16 LUFS / TP −1.5 for web and LinkedIn; −14 LUFS for Reels/TikTok/Shorts if the client wants it loud.

## 5. Paid add-ons (offer the best, the client decides)
Never lower quality because a free option is easier. When a paid tool would clearly beat what we can make:
- name it;
- say what it adds and the rough cost;
- say what we'd do without it;
- let the client choose.
Vet every tool first (references/third-party-skills.md), and never install hooks or MCP configs silently.

| Need | Best paid option | Free / fallback |
|---|---|---|
| Voiceover | ElevenLabs (paid plan or API key for automation) · a human VO artist | client records on the ElevenLabs free tier |
| Photos / product imagery | client shoot · Adobe Firefly / Stock · Higgsfield · Google Flow (Imagen) · Midjourney | prompts for the user (imagery.md) |
| AI video clips | Higgsfield · Google Flow (Veo) · Runway · Luma | Ken Burns + parallax on stills |
| Music | licensed track (Artlist, Musicbed, Epidemic Sound) | self-synthesised bed (scripts/sound_design.py) |
| Footage | Artgrid / Adobe Stock / Pexels API (free key) | generated or client clips |
| Automation via MCP | DojoCodingLabs remotion-superpowers MCPs (ElevenLabs, Pexels, Replicate…) — vetted, their keys | manual steps |
| Claude-powered repos (e.g. aariz51 promo-video) | Anthropic API key from console.anthropic.com (billed per use, separate from a claude.ai subscription) | do the steps in-session |
