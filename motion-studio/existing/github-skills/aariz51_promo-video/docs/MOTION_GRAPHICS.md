# Motion graphics

LaunchLayer ships a small library of reusable motion techniques that generated
scenes import. This document explains what it is, where it came from, and why
it is built the way it is.

## The problem it solves

The pipeline's creative stages were already strong: a measured run produced a
frame-accurate nine-scene storyboard with real product screens and correct
credibility guardrails. The rendered film was still weak, and measurably so —
**73 % of its running time was near-static, with one eight-second stretch where
nothing moved.** Good direction, thin motion.

Writing every animation from scratch, in one response, alongside nine scenes of
copy and layout, is too much to ask of any model. Giving it a set of ready
techniques to *choose from* is not.

## Source: Creatorberry/flick

[Creatorberry/flick](https://github.com/Creatorberry/flick) (MIT) is an agent
skill that turns a video or transcript into Remotion scene animations. Its
`saved-animations/` folder holds fourteen real, working scene components.

Because flick's scenes are Remotion + React — the same technology LaunchLayer
already renders with — the techniques transfer directly. The components
themselves do not:

- they are **content-bound** — hardcoded image filenames, fixed durations, and
  copy about GitHub repos, terminals and token counts;
- they are **subject-bound** — most are developer-tool stories (`token-waste-terminal`,
  `pdf-token-limit`, `agent-role-showcase`) that would be wrong for, say, a
  pregnancy-safety app;
- two of them **import modules that are not in the repository**
  (`../animation/gsapEquivalent`, `../components/VantaRealBackground`), so a
  verbatim copy would not compile.

So the integration extracts the *motion*, not the files: each technique was
rewritten as a parameterised, content-neutral component that type-checks inside
this template and adds no dependencies. flick is credited in
`src/motion/index.ts` and in the catalogue.

## What was built

`generator/promo-video/template/src/motion/`

| Component | Adapted from | What it does |
| --- | --- | --- |
| `ScreenCarousel3D` | `content-carousel` | perspective row of screens moving past camera; active card sharp, neighbours rotated, dimmed, blurred |
| `ConstellationMerge` | `tool-constellation-merge` | satellite tiles pop in, orbit inward, are absorbed into a central mark |
| `CardToHeaderPush` | `page-card-to-header-zoom` | a card holds frame, then exits while the camera pushes into the layer behind |
| `FastScreenScroll` | `fast-page-scroll` | framed screen scrolls faster than it can be read, for several passes |
| `EditorialHighlight` | `website-resource-reveal` | headline arrives, colour bar sweeps behind one phrase, callouts stagger in |
| `FrameScatter` | `video-to-frames` | a source card shrinks and thumbnails fan out from it |

Plus `timing.ts` — `ramp`, `pulse`, `local`, `stagger`, `clamp` and `inWindow`.

Every component:

- takes a `from` / `durationInFrames` window and **renders nothing outside it**.
  (An early version did not, and a smoke test caught it immediately: components
  kept drawing their final state for the rest of the film and silently covered
  the scenes that followed.)
- takes the product's own screens, copy, palette and coordinates, so two
  products get two different films from the same library;
- imports only React, Remotion and template-local modules — no new dependencies,
  no remote assets. `src/lib/pipeline/motion-library.test.ts` enforces this.

## How a technique gets chosen

The library is offered to the model, never imposed. `customizeTemplateMessages`
appends the catalogue (`generator/promo-video/docs/motion-graphics.md`) with
selection rules:

- two to four different techniques across nine scenes;
- never the same technique in consecutive scenes;
- a scene may use none, when a plain hero shot is stronger;
- match the reference video's energy and the product's seriousness;
- **motion density**: nothing may sit still longer than ~1.2 s.

The decision layer is the film's own creative direction and storyboard, which
the model has already written by this point. That is what keeps the output
dynamic: the same library produces a calm, editorial treatment for a medical
product and a fast, punchy one for a consumer app.

## Why the library is not model-writable

The generated-file allowlist is unchanged — the model still writes only the nine
scenes, `theme.ts`, `fonts.ts` and `build_audio.py`. `src/motion/` is fixed
template code it imports. That keeps every existing guardrail intact: the
techniques always compile, they cannot be quietly broken by a bad generation,
and the type checker catches a misused prop before anything renders.

```text
storyboard  ──▶  scene files the model writes  ──▶  import { … } from "../motion"
                                                            │
                                    fixed, type-checked motion library
                                                            │
                                                  Remotion + FFmpeg ──▶ MP4
```

## Measured effect

Three real SafeMama productions through a Codex subscription, same brief, same
assets, same YouTube reference, measured with `npm run inspect`:

| | moving | longest still hold |
| --- | --- | --- |
| Baseline, no library | 27 % | 8.25 s |
| Library available | 31 % | 7.00 s |
| Library + the pacing rule below | 31 % | 5.25 s |

The worst-case hold fell by 36 %, and the films changed character completely:
the baseline was small cards drifting in empty space, while the latest carries a
highlighted headline in every scene, a visible dissolve, cursor interaction, a
consistent scene grammar and a closing lockup with a CTA.

The overall moving percentage is stubborn, and honestly so: the model writes a
calm, editorial film for a medical product whose scenes exist to be *read*. The
45 % target in `npm run inspect` is a generic heuristic, not a law — a pregnancy
safety app should not move like a game trailer. A 5.25 s hold is still too long
by any standard, and the next lever is the storyboard stage, which chooses
seven- and nine-second scenes in the first place.

The pacing rule that produced the third row names the failure mode directly:
writing one entrance animation and then holding for the rest of a long scene
produces a slideshow, so any scene over about four seconds must contain two or
three distinct visual events.

## Both runtimes

The catalogue is passed by the hosted workflow and the local runner alike, from
the same prompt builder, so a film generated through OpenRouter and one
generated through a local Claude Code or Codex login draw on the same library.
