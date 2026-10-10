# Lessons learned (read first)

Each item below cost at least one round of rework on a real client job. They are written as
"what happened → why it matters → do this instead".

## Briefing & research
1. **Websites were blocked by the sandbox network policy.** Two sessions wasted effort assuming the site could be read.
   → Test reachability immediately. If blocked, use web search snippets that quote the site, and ask the user for the
   brand bible / logo / palette in the first message.
2. **The brand skill file the user mentioned never reached the session.** → If someone references "my skill file",
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
7. **Clients value every line they wrote.** Cutting content to make room was rejected. → When pace feels rushed,
   first reformat (one idea per paragraph, blank lines) and shorten pauses — cut only with permission, and list what
   you'd cut in order of least value.
8. **Pauses: both extremes failed.** A "..." every phrase made it sleepy; no paragraph breaks made it rushed.
   → ElevenLabs rhythm: one clean thought, then a pause, then the next. Big held pauses only around the hook word.
9. **The client insisted: lead with pain.** A dream-first opening was rejected until it came *after* the pain.
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
20. **No-voice versions were pointless to the client.** → Deliver one final mix unless asked.
21. **Uploads over 30 MB fail.** → Always produce a share encode (CRF 21–22) alongside the master.
22. **A stop-hook demanded commits while a render was still writing the MP4.** → Put the partial file in
    `.git/info/exclude`, remove the line and commit when the render completes.
23. **Overriding `window.render` with a wrapper that called `render` caused infinite recursion** (function declarations
    are window properties). → `const baseRender = render; window.render = t => baseRender(warp(t));`
24. **HuggingFace/OpenAI model downloads are blocked offline** → `pip install pocketsphinx` ships an English model and
    gives word timestamps good enough to sync (it mishears words; match by order/sound, not spelling).

## Advice & communication
25. **Data claims about video vs posts**: LinkedIn B2B benchmarks (video lowest CTR) were correct for that platform but
    the client's point (Reels/TikTok reach) was also right. → Always state the platform and metric a statistic applies to.
26. **Pricing**: the R20k instinct was right for SA market (freelance R5–20k, mid studio R30–80k per 60 s).
    → Anchor at value, discount visibly for a first client, push retainers.

## From an earlier Remotion laptop build (promo for an AI agent)
27. **"Can I not even see half a clip?"** — long silent work made the client anxious. → Storyboard sheet early,
    a 5–10 s preview **with sound** before the full render, status lines every few minutes.
28. **Brief times were wrong** ("click Approve at 20.3" was mid-"until"; the word was 20.9). → Sync to the stressed
    syllable from the loudness contour; tell the client which times moved.
29. **The same transition whoosh on every cut** was the original complaint. → Music carries transitions; UI sounds
    are chord notes; ≤ 3 different air moves per film. (The example cue list in `sound_design.py` over-uses whooshes — re-cue it.)
30. **Old cut looked cheap**: tiny UI, empty frames between scenes, floating bubbles, flat green wash, same pop on
    everything, generic font. → See SKILL.md §2 table.
31. **Data contradiction in the brief** (60 days overdue vs 14 for the same invoice). → Make fictional data identical everywhere.
32. **A heavy grey "problem" veil looked muddy.** → Keep it ~0.2, cool, and lift the light at the turn.
33. **Crossfading light tint → deep green went through grey.** → Route via a vivid midpoint.
34. **Rolling-digit odometer smeared ("59/60") at 30 fps.** → Whole-number counters with a settle nudge.
35. **Shared-element handover jumped** because the source sat inside a scaled container. → Start the flying copy at
    the same scale + transform-origin; hide the source on that exact frame.
36. **`-tune film` with grain made a 228 MB master** (20 MB without). → CRF 18, no tune.
37. **A single long render shut the laptop down.** → `--gl=angle`, chunked resumable renders, keep-awake.
38. **Windows paths with spaces / URL-encoded `import.meta.url`** created wrong output paths/junk folders. → Relative
    forward-slash paths; `fileURLToPath`.
39. **`npx create-video` in a non-empty folder hangs** on an interactive prompt. → Scaffold by hand.
40. **No tick glyph in most fonts; emoji icons look cheap.** → Draw icons as SVG.
41. **Untagged HD files shift greens between players.** → Render/encode with BT.709 tags.

## From the Avant Intelligence round (2026-10-03)
42. **Two new 27–40 s films built without a script were called "perfect but bland: no focus, no storytelling".**
    The client preferred the earlier 60 s voice-led films (one spark followed through the whole story, a narrated
    problem → agents → document → loop → grid → logo). → Never build a brand film without a story spine. If the
    script isn't ready, use the client's last approved script as a scratch voice, or write a beat sheet with a
    narrative, not just abstract motion. Keep ONE focal object from the first frame to the logo.
43. **The client's own approved designs beat a fresh recipe for the same client.** For a rebrand of the same
    business, re-skin the approved film (palette, logo, agent shades, ending) before inventing a new one, and treat
    the recipe engine as the source of *additions*, not replacements.
44. **When a name changes, mute the old name in the voiceover** (find the word from the loudness contour and mute
    with 40 ms fades). Fill the gap with the logo moment and a musical sting instead of leaving dead air.

## From the Avant signature round and portfolio (2026-10-07)
45. **Study a reference at full resolution, frame by frame, before building.** The first Avant films missed because
    they were built from impressions; the Agents study hit because every beat was measured from frames.
46. **A replica is a study, never a deliverable.** Keep the palette, camera language and holds; replace every
    signature device with one taken from the client's own logo, name or promise (Λ climb, aperture dive through the
    apex, approve-draft). The replica stays out of portfolios.
47. **Colours: vivid on black, one gradient world.** "Dull and childish" came from mid-grey and pastel-on-grey; the
    fix was saturated hues on #07080B and one full-bleed lilac/cyan/pink/navy world (see `signature-vivid`).
48. **Hold after every move.** 0.4–0.8 s of stillness after each move is what made the films read as premium.
49. **Text over moving objects goes on top in the layer order** (the falling card covered "Every invoice.").
50. **vercel.app, lovable.app and Lovable asset URLs are blocked here.** Ask for screenshots / a laptop screen
    recording; never ship a static screenshot where the client expects their scroll animation.
51. **Artifact pages: embed images and video in the page.** Relative files showed as "?" on the user's phone. The
    16 MB page limit means ~11 MB of video total: 720p, CRF 25–28, AAC 80k. Tell the user the portfolio copy is
    compressed and send full-quality files separately.
52. **Don't fix voice pace with the speed slider** (see script-voice-pacing §4).
53. **A verbal price is a promise.** Writing a higher number than the one agreed in a meeting needs the added value
    spelled out next to it, or a conversation first.
54. **Round prices read premium; charm prices (R1,999) read as value.** Tell the user which signal they're sending.
55. **Check "In use" before showing a third-party name**: ADC Innovations is a placeholder — say so wherever it
    appears (portfolio note).
56. **Brand-board native beats brand-coloured.** SmartTech used the brand bible's colours; Klick Kulture used the brand
    board's *devices* (their cutout collages, like-icons, chevrons, X marks, label chips, own copy) as the film's
    vocabulary. The owner called the second one "unique to them". Inventory the board's devices before designing.
57. **Never use people from the client's team** (director portraits in a services guide) unless the client asks.
58. **Don't trust self-review on meaning-carrying transitions.** The cursor → network → check-box chain looked "messy"
    in stills but was the owner's favourite in motion. Judge transitions in motion, not from contact sheets.
59. **A still photo can snap.** Split the moving part (fingertips) into its own layer with an overlap band, rotate it
    about the knuckle (press +4°, flick −12°, damped settle) with 2–3 blur ghosts; the base keeps the knuckle so no gap
    opens. Reads as a snap at speed; a fully physical snap needs real footage.
60. **Never a flat glow dot or a flat CSS sphere as the focus point.** The owner called the purple dot "dog shit…
    no depth… childish and flat". The focus object is an ElevenLabs-style LIQUID ORB: a glass sphere with marbled
    pastel liquid moving inside (9 blurred blobs, some multiply for dark pockets, a light ribbon, sphere shading,
    a soft highlight, rim light) — for Obsidian: white / soft pink / lilac / magenta on plum-black.
61. **Camera language is part of the brief, not a bonus.** A film where the camera only trucked right was rejected
    ("you didn't use the 360° or moving-down movements"). Every film needs: a vertical fall or drop, a dive THROUGH
    an object into the next world, and at least one 360° orbit (rings, a spinning phone, an orbiting stack).
62. **Obsidian favourites (owner, 2026-10-10):** the flat template laid at an angle whose grid layers pop out of it
    (exploded view) and the site containers moving to the right. Owner's chain: the website frame lands on the TOP
    layer → different templates pop out and move right → the last template becomes a phone.
63. **Obsidian type:** Bricolage wide-tracked caps + Red Hat Mono were rejected; use Inter, tight tracking (the approved
    signature type) and JetBrains Mono only inside code. The low-poly "obsidian shard" was rejected — don't reuse it.
64. **Liquid that moves like clouds = a WebGL shader, not CSS blobs** (owner, 2026-10-10: "make the liquids move like
    clouds and liquids"). obsidian-ad/brand-film/src/gl.tsx: (a) World — domain-warped fbm (simplex, 3-octave warps,
    warp ×1.7–1.9, zoom ≈1.25) painted with a 5-colour palette, rendered at half res, with an ink-wipe from a point so a
    new colour world spreads out of the ball; (b) Balls — metaballs (smooth-min, k ≈ 40–60 px) so drops merge and split
    like real liquid, sphere normal from the field, swirling fbm inside at ≈ rel×0.38 (higher = crinkly foil, rejected
    in testing), rim + specular, optional transparency and a purple core. Render with --gl=angle (chromiumOptions
    { gl: "angle" } for stills). Cost: ~1 s/frame at 1080×1920 with 4 tabs.
65. **Colour worlds** (owner storyboard, Obsidian 30 s): the background becomes each hero section's world as the ball
    passes it (white hero → white world, black+green hero → black+green world); the ball takes the world's colours but
    keeps a purple core so the brand never disappears; it turns fully purple again on the owner's own site.
