---
name: obsidian-content
description: Obsidian's daily social content (carousels for Instagram / LinkedIn / X) about AI for web design and front-end development — AI news, Claude skills and tools to install, web designer toolkits, scroll-scrub and 3D web craft. Use whenever the owner asks for "today's post", "content for <date>", a carousel, a caption, or the content calendar. Every fact comes from a primary source opened that day, never from memory.
---

# Obsidian content — daily carousel system

Owner: Nathaniel Dreyer, Obsidian ("Digital precision that builds reputation"). Audience: people who build websites with AI —
front-end designers, scroll-scrub / 3D / interactive site builders, vibe coders — plus the clients who hire them.

## The daily run (do these in order)
1. **Find the slot.** Open `calendar.md`, take the row for the requested date (or the next unused row). The row gives the
   pillar, format and a topic *seed*. News rows have no fixed topic: the topic is whatever the research finds.
2. **Research from primary sources** (rules below). Write `sources.md` as you go: claim → URL → how it was checked.
3. **Write the copy** in `slides.json` (copy rules below). One idea per slide, 6–9 slides.
4. **Render**: `python3 -I .claude/skills/obsidian-content/scripts/render_carousel.py content/posts/<YYYY-MM-DD-slug>`
   → `out/slide_NN.png` (1080×1350), `out/carousel.pdf` (LinkedIn document post), `out/contact_sheet.jpg`.
5. **Look at every slide** (Read the PNGs, not only the sheet): overflow, wrapped names, orphans, empty frames, legibility
   at phone size. Fix and re-render.
6. **Write `caption.md`**: IG/LinkedIn caption, X thread (X takes 4 images per post → split into posts of ≤4), alt text.
7. **Deliver**: send the PNGs + PDF + caption to the owner; commit the post folder.

## Research rules (non-negotiable)
- Every factual claim on a slide traces to a **primary source opened in this session**: the official blog/changelog, the
  repo (clone it: `git clone --depth 1`), the docs page, the release notes. Quote verbatim or don't quote.
- Listicles, affiliate "best of" posts, X threads and YouTube summaries are **leads only**. Follow them to the primary source.
- **News must be ≤ 7 days old** on the posting date. Put the date of the source on the slide ("Anthropic, 12 Oct 2026").
  If nothing qualifying happened, use the calendar's fallback (a tools post) — never recycle old news as new.
- **Skills / tools**: confirm the repo exists, read SKILL.md or README, copy the install command exactly, note the last
  commit date. Prefer official makers (Anthropic, Vercel, GreenSock, Figma…) and active repos (commit in the last 6 months).
- No numbers you didn't read today (stars, installs, benchmarks, prices). If you can't open the source, drop the claim.
- Never invent people, quotes, handles or results. If a person is named, link where they said it.
- Safety: a skill runs code with the user's permissions. Don't recommend a skill whose SKILL.md/scripts you haven't read;
  flag anything that pipes remote scripts into a shell or asks for secrets.

### Where to look first (leads; verify each claim at its own source)
- Claude: claude.com/blog, docs.claude.com (Claude Code release notes), github.com/anthropics/skills,
  github.com/anthropics/claude-plugins-official.
- Web platform: developer.chrome.com/blog, web.dev, MDN (browser support for scroll-driven animations, View Transitions).
- Motion / scroll: gsap.com/blog, github.com/greensock/gsap-skills, Codrops (tympanus.net/codrops), Awwwards.
- 3D: threejs.org releases (github.com/mrdoob/three.js/releases), React Three Fiber (pmnd.rs), Spline.
- AI dev tools: vercel.com/changelog, github.com/vercel-labs/agent-skills, Figma blog / Figma MCP docs, Cursor changelog.
- Design-skill makers: github.com/pbakaus/impeccable (impeccable.style), github.com/nextlevelbuilder/ui-ux-pro-max-skill.
- Skills directories (leads for "top skills" posts): the owner's skills site — **SKILLS_SITE: ask the owner for the URL
  and write it here** — and skills.sh (Vercel's `npx skills` directory).

## Copy rules
- Hook (slide 1): ≤ 8 words, a claim the reader recognises from their own work. No question-bait, no "🚨", no "game-changer".
- Sentence case everywhere. Plain verbs. ≤ 35 words of body per slide. One bold phrase per slide at most.
- Name the maker on every tool slide ("Official, by Anthropic" / "Open source, by …") and the source domain at the bottom.
- Install commands go in the command card exactly as the README prints them.
- Last slide: one honest caveat or tip + "Save this for your next build." (or a CTA that matches the pillar).
- Proof posts (client-facing): speak to a business owner, not a developer: "your website doesn't show the quality of the
  work you actually do."

## Design rules
- Template: `scripts/render_carousel.py` — black, white type, white emblem, Archivo (expanded 125 % / 800 for titles,
  normal width for body), JetBrains Mono **only** for code/commands. 1080×1350, 92 px side margins, footer = emblem +
  "Obsidian" + page "n / N". The cover carries the large two-bar emblem bleeding off the right edge.
- Slide types in `slides.json`: `cover` {title, sub, cue}, `text` {kicker, title, body, quote?, quote_src?, close?},
  `skill` {kicker, name, maker, what, use, install[], install_label?, source}, `end` {kicker, title, body, note, cta}.
  Optional `size` on any slide overrides the title size (shrink long names until they sit on one line).
- Avoid the AI-design tells Anthropic's frontend-design skill lists (we post about them — we can't commit them): no
  ALL-CAPS tracked eyebrow labels, no "WORD — fragment" labels, no "A · B · C" meta strings, no monospace for labels,
  no 01/02/03 markers unless the content is a real sequence, no gradient washes, no tinted near-black (use #000),
  no single-word colour accent in headlines. Colour lives only inside screenshots.
- New layouts: add a slide type to the renderer instead of hand-making one-off HTML, so every post stays one system.

## Calendar
`calendar.md` holds the 30-day plan (pillars, formats, seeds). When it runs out, write the next 30 days with the same
mix and ask the owner to confirm before using it.
