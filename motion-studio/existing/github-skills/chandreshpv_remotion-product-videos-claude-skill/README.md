# Remotion Claude Skill for Product Videos

A Claude Code skill for producing premium product / feature launch videos with [Remotion](https://www.remotion.dev/). Born from real production work on the **SureCart 4.2 launch video** — built with Claude Code + Remotion 4.x.

This repo pairs two layers:

- **[SKILL.md](./SKILL.md)** — the Remotion technical implementation skill (canvas sizing, scene structure, 3D mockup entries, cursor animations, transitions, audio, pre-layout gates).
- **[VIDEO_SOP.md](./VIDEO_SOP.md)** — the tool-agnostic creative & planning SOP (brief, brand extraction, scene plan, copy, approval checkpoints, delivery).

Use them together: SOP plans, skill builds.

---

## Why this exists

AI-generated Remotion videos usually fail the same way — text too small, content centered with dead space, cursor inside transformed parents, transitions overlapping mid-animation. This skill encodes the fixes from shipping a real production video so you don't relearn them.

The SOP layer separates **what to build** from **how to build it**. You decide scene structure and copy first, get approval, then implement. No more 8-scene videos where the user wanted 4.

---

## What's inside

### `SKILL.md` — Remotion Visual Production Skill (v1.2)

- **Pre-Layout Gates** — canvas fill check, layout selection table, content density limit. Run before writing any scene layout.
- **Canvas rules** — minimum font sizes for video (not webpage), mockup widths, padding caps.
- **Animation rules** — `useCurrentFrame()` enforcement, `extrapolateLeft/Right: "clamp"`, deterministic `random()` seeding.
- **Mockup 3D entries** — five reusable entry animations (Tilt Drop, Flip Forward, Drift Up, Rotate In, Slam).
- **Cursor system** — positioning rules, press scale, ripple/flash/pulse click effects.
- **Scene transitions** — fade vs slide decision rules, duration math, 15-frame hold rule.
- **Audio setup** — callback-based volume with fade in/out.
- **Per-scene self-verification checklist.**

### `VIDEO_SOP.md` — Video Production SOP (v1.0)

- **Phase 1 — Brief** — 4 required questions, 3 optional.
- **Phase 2 — Brand extraction** — defaults when nothing is provided.
- **Phase 3 — Scene plan** — duration → scene count table, narrative arc, scene types.
- **Phase 4 — Copy** — headline/sub/label/CTA rules + anti-patterns.
- **Phase 5 — Approval checkpoints** — three mandatory stops.
- **Phase 6 — Visual guidelines** — layout, typography, color.
- **Phase 7 — Music** — tone → style mapping + volume rules.
- **Phase 8 — Delivery** — output specs + handoff checklist.

---

## How to use

### As a Claude Code skill

Drop into your skills directory:

```bash
# User-level (available across all projects)
mkdir -p ~/.claude/skills/remotion-visual
cp SKILL.md ~/.claude/skills/remotion-visual/SKILL.md

# Or project-level
mkdir -p .claude/skills/remotion-visual
cp SKILL.md .claude/skills/remotion-visual/SKILL.md
```

Then invoke from Claude Code when building Remotion videos. The skill kicks in automatically when the conversation involves Remotion promo/launch video creation.

### As a planning reference

Read `VIDEO_SOP.md` before building any product video — regardless of tool. The phases work with Remotion, After Effects, CapCut, or hand-rolled CSS animation.

---

## Built for

- Product / feature launch videos (15s–60s)
- Promo videos for landing pages and social
- Tutorial intros / explainer hooks
- Anywhere a real product UI matters more than motion-graphic flash

Not built for: narrative storytelling, brand ad films, long-form explainers.

---

## Author

**Chandresh Vaghanani** — Growth Marketer working at the intersection of product, growth, and marketing.

Built from production lessons on the SureCart 4.2 launch video (and the Power Coupons video that caught the Pre-Layout Gate failures now baked into v1.2).

- LinkedIn: [linkedin.com/in/chandresh-vaghanani](https://linkedin.com/in/chandresh-vaghanani)
- Email: chandresh.pv@gmail.com

---

## License

MIT — see [LICENSE](./LICENSE).
