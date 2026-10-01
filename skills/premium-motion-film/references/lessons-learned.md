# Lessons learned (read first)

Each item below cost at least one round of rework on a real client job. They are written as
"what happened → why it matters → do this instead".

## Briefing & research
1. **Websites were blocked by the sandbox network policy.** Two sessions wasted effort assuming the site could be read.
   → Test reachability immediately. If blocked, use web search snippets that quote the site, and ask the user for the
   brand bible / logo / palette in the first message.
2. **The brand skill file the user mentioned never reached the session.** → If a user references "my skill file",
   search the repo, `~/.claude/skills`, and the user's skills; if missing, say so in one line and continue with defaults.
3. **Colours sampled from a screenshot were wrong** (#163456/#B2CB07 vs the bible's #002548/#B5D334).
   → The brand bible is the source of truth. Pull colours from vector fills, not pixels.
4. **"Do not recreate the logo."** → Extract the vector logo from the PDF (see brand-extraction.md). Never redraw it
   from a raster; a near-miss logo is worse than no logo in front of a founder.

## Story & script
5. **The first story was a "feeling" ("a quiet weight"), not a problem.** The user said "you're not explaining the
   problem". → Name the concrete pain with specific artefacts (ID copy, proof of address, invoice #, 21:43 lead).
6. **Too many features in one film** (invoices, onboarding, month-end, silos…). → One niche or one journey; mention the
   breadth once, late, in a single line.
7. **The user values every line they wrote.** Cutting content to make room was rejected. → When pace feels rushed,
   first reformat (one idea per paragraph, blank lines) and shorten pauses — cut only with permission, and list what
   you'd cut in order of least value.
8. **Pauses: both extremes failed.** A "..." every phrase made it sleepy; no paragraph breaks made it rushed.
   → ElevenLabs rhythm: one clean thought, then a pause, then the next. Big held pauses only around the hook word.
9. **The user insisted: lead with pain.** A dream-first opening was rejected until it came *after* the pain.
10. **Emotion tags on ElevenLabs v3/v4 produced whispering** the user disliked; Multilingual v2 with a deep narrator
    ("Oliver Silk") at Speed ~0.87, Stability ~30, Similarity ~80, Style ~48 was the approved sound.
    → Offer tags only as an option; default to v2 with plain punctuation.
11. **Claims**: "in minutes", "99.2% accuracy", "Twenty tasks", "FICA" were not verified. → Tag every claim as
    verified / to-confirm; never put an unverified number on screen without flagging it.

## Motion
12. **v1 was beautiful but boring** — 88 s, sparse, slow fades, holds of 5–8 s. → 45–60 s, a new beat every 2–3 s,
    continuous transitions, more elements (UI templates, bubbles, lines, geometry).
13. **"The transitions need to be smoother"** — caused by easing to a stop at every camera keyframe.
    → Monotone cubic spline through keys (no stop-start), zoom in log space, motion blur (60→30 fps tmix).
14. **"Are you not able to zoom in and out?"** — v1 only tilted down. → Use zoom-throughs (dive into the orb/dot/light,
    emerge in the next scene), pull-back reveals, push-ins on details, and pans in every direction.
15. **The document scene was "not creative".** A flat document with ticks was rejected; a tilted 3D invoice read by a
    light beam, with values lifting off as chips and collapsing into the next scene's ball, was praised.
    → Every object should *transform into* the next thing.
16. **Small text** at zoomed-out camera scales was unreadable. → Compute effective size = font px × camera zoom; keep ≥ 22 px.
17. **Lime/accent overload**: a wide lime "door" bar looked cheap. → Accent ≤ ~5 % of frame; thin lines, small dots, glow.

## Audio & delivery
18. **The original VO was re-paced (gaps stretched) to 88 s and the film became "way too long".** → Don't stretch the
    take beyond the user's intent; if you add pauses, add them only at the hook word.
19. **Inserting pauses after the fact** works: split the VO at silence points, insert silence, and time-warp the visuals
    with a smoothstep so motion slows into the pause instead of freezing (see production-pipeline.md).
20. **No-voice versions were pointless to this user.** → Deliver one final mix unless asked.
21. **Uploads over 30 MB fail.** → Always produce a share encode (CRF 21–22) alongside the master.
22. **A stop-hook demanded commits while a render was still writing the MP4.** → Put the partial file in
    `.git/info/exclude`, remove the line and commit when the render completes.
23. **Overriding `window.render` with a wrapper that called `render` caused infinite recursion** (function declarations
    are window properties). → `const baseRender = render; window.render = t => baseRender(warp(t));`
24. **HuggingFace/OpenAI model downloads are blocked offline** → `pip install pocketsphinx` ships an English model and
    gives word timestamps good enough to sync (it mishears words; match by order/sound, not spelling).

## Advice & communication
25. **Data claims about video vs posts**: LinkedIn B2B benchmarks (video lowest CTR) were correct for that platform but
    the user's point (Reels/TikTok reach) was also right. → Always state the platform and metric a statistic applies to.
26. **Pricing**: the user's R20k instinct was right for SA market (freelance R5–20k, mid studio R30–80k per 60 s).
    → Anchor at value, discount visibly for a first client, push retainers.
