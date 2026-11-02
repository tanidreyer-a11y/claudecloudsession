---
name: video-production-sop
title: Video Production SOP (Product / Feature Videos)
author: Chandresh Vaghanani
version: 1.0
description: Generic, tool-agnostic SOP for planning product and feature videos. Covers brief, brand extraction, scene planning, copy, approval checkpoints, visual guidelines, music, and delivery. Pairs with the Remotion Visual Production Skill for technical implementation.
---

# Video Production SOP

**Generic — works with any video tool, AI, or framework**

This SOP covers the creative and planning layer — what to build, in what order, and when to stop for approval. Technical implementation (animations, code, tool-specific syntax) is handled separately by whichever skill or tool you're using.

---

## Phase 1: Brief (Before Anything Starts)

Ask all of these in ONE message. Do not start until you have answers to the starred ones.

```
Before I start, a few quick things:

★ 1. What's the product / feature being promoted?
★ 2. What's the goal? (launch announcement / feature highlight / tutorial / ad)
★ 3. Tone? (energetic & punchy / premium & calm / playful / technical)
★ 4. Target duration? (15s / 30s / 45s / 60s — pick one)
  5. Do you have a product screenshot or website URL?
  6. Any background music? (optional)
  7. Anything specific you want shown or said?
```

★ = required. Ask once more if skipped. If still skipped, apply Phase 2 defaults.

---

## Phase 2: Brand Extraction

**From a screenshot or URL, extract:**

- Background color (dark / light / brand-specific)
- Primary accent color
- Font style feel (rounded / geometric / serif / techy)
- UI tone (minimal / dense / playful / enterprise)

**If nothing is provided:**

- Use near-black background (`#0a0a0f` or similar)
- Use indigo accent (`#6366f1`) — neutral, modern, not product-specific
- Use upper-end font sizes — video is not a webpage, text must be large and readable
- Do NOT use neon/cyber colors as a default — that's a personal aesthetic, not a brand match

---

## Phase 3: Scene Plan (Get Approval Before Building)

### Duration → Scene Count

| Target Duration | Scene Count | Notes |
|-----------------|-------------|-------|
| ~15s | 3–4 scenes | Hook + 1–2 features + CTA |
| ~30s | 5–6 scenes | Hook + ticker + 2–3 demos + CTA |
| ~45s | 6–8 scenes | Hook + ticker + 3 demos + recap + CTA |
| ~60s | 8–10 scenes | Full story arc — use sparingly |

### Narrative Arc (Always follow this structure)

```
1. HOOK       → Grab attention. Product name + energy. No details yet.
2. INTRODUCE  → "X new features" or "X things changed." Fast. Tease only.
3. DEMO(s)    → One feature per scene. Show it, don't just say it.
4. RECAP      → All features together. Reinforce the story.
5. CTA        → One action. Simple. Punchy. End with momentum.
```

Skip INTRODUCE and RECAP for short videos (≤30s). Minimum viable arc: Hook + Demo(s) + CTA.

### Scene Types

| Scene Type | Purpose | When to Use |
|-----------|---------|-------------|
| Hook | Open with energy, drop the product name | Always — first scene |
| Ticker / Feature List | Quick "X new things" overview | When there are 3+ features |
| Feature Demo | One feature shown in action | One per major feature |
| Comparison | Before/after or old/new | When there's a clear upgrade story |
| Recap / Triptych | All features side by side | When there are 3+ features |
| CTA | Single call to action | Always — last scene |

---

## Phase 4: Copy

**Write all copy BEFORE building anything. Get approval on this first.**

### Rules

- **Headline:** 3–5 words max. Punchy, not descriptive.
- **Sub-text:** 1 line max. Lead with benefit, not feature name.
- **Label / pill:** 1–3 words. Uppercase. ("NEW IN 4.2", "LIVE NOW", "FEATURE")
- **CTA button:** Action verb + product name. ("Update to SureCart 4.2", "Try It Free")
- **Trust line:** 2–4 short checkmarks. ("✓ Feature A ✓ Feature B ✓ Feature C")

### Anti-Patterns (Never do these)

- Full sentences on screen — viewer has 5 seconds per scene
- Feature names without benefit ("Address Autocomplete" → "Ship faster")
- Jargon that the viewer doesn't already know
- More than 2 text elements animating simultaneously

### Copy Template Per Scene

```
Hook:
  Label:    [PRODUCT NAME + VERSION or CONTEXT]
  Headline: [3–5 word punch]
  Sub:      [optional — one line teaser]

Feature Demo:
  Label:    [FEATURE CATEGORY]
  Headline: [What it does — benefit first]
  Sub:      [One line — how or why it matters]

CTA:
  Label:    [TIMING — "All in 4.2." / "Available Now"]
  Headline: [Action word — "Live." / "Shipped." / "Now."]
  Button:   [Update to X / Try X Free / Get Started]
```

---

## Phase 5: Approval Checkpoints

**Stop and show the user at these points. Never build everything blind.**

1. **After Phase 3 + 4** — present scene list with copy in plain text, no building yet.
   *"Here's the plan: [scene list + copy per scene]. Should I proceed?"*
2. **After Scene 1** — show or describe Scene 1. Confirm tone, colors, and energy match before building the rest.
3. **After full draft** — complete review before final export/render.

---

## Phase 6: Visual Guidelines

These apply regardless of what tool is being used to build the video.

### Layout

- Content must feel like it FILLS the screen — not like a webpage or slide deck
- Avoid excessive padding or margins — video is not a document
- Center content vertically with a slight upward pull — feels premium, not top-heavy
- Mockups / UI screenshots: wide, centered, dominant in the frame

### Typography

- Headline: large enough to read from across the room
- Sub-text: noticeably smaller than headline but still clearly legible
- Labels / pills: small, uppercase, letter-spaced
- One font family throughout — consistency over variety

### Color

- 2–3 colors max: one dark background, one primary accent, white/muted white for text
- Stay consistent across all scenes — same accent color everywhere
- Brand colors take priority the moment they're known

---

## Phase 7: Music

| Tone | Music Style |
|------|-------------|
| Launch / energetic | Upbeat electronic, 120–130 BPM |
| Premium / SaaS | Subtle cinematic, light percussion |
| Playful / consumer | Pop-adjacent, bright |
| Technical / developer | Minimal, lo-fi, ambient |

**Volume rules (always):**

- Peak: moderate — leave space for voiceover if needed
- Always fade in at the start (1 second)
- Always fade out before the end (1.5 seconds)
- Music must end with the video — never bleed past the last frame

If no music is provided — skip entirely. Do not add placeholder music.

---

## Phase 8: Delivery

**Standard output:**

- Resolution: 1920×1080
- Frame rate: 30fps
- Format: MP4

**Before handing off, verify:**

- No blank frames at start or end
- Music fades in and out cleanly
- All text is large and readable
- CTA scene ends on a held state — not mid-animation
- File plays correctly from start to finish

---

## Revision Handling

| Change type | What to do |
|-------------|------------|
| Copy change | Update text only — no layout or animation changes needed |
| Timing change | Adjust duration of that scene, recalculate total video length |
| Scene reorder | Update scene order, recheck transition directions for flow |
| Color change | Find all instances of that color and replace globally |
| Full scene redo | Confirm scope first — "just this scene or the flow around it too?" |

---

## Build Order (Tool-Agnostic)

Regardless of what tool you're using, always build in this sequence:

1. **Scene shells** — all scenes stubbed out, no content yet
2. **Copy + layout** — text and positioning, no animations
3. **Animations** — entrances first, then interactions, then exits
4. **Transitions** — wire scenes together last
5. **Audio** — add after all scenes are confirmed
6. **Final timing** — lock total duration after everything is in place

*For technical implementation, refer to whichever tool or skill you're using (e.g. [SKILL.md](./SKILL.md) for Remotion-based videos).*
