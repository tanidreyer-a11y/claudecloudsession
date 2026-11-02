# Replacing the AI APIs with local models — feasibility study

**Status: investigation only. Nothing in this document is implemented.**

The question: can LaunchLayer's AI work be done by open-source models we run
ourselves, at roughly today's quality, to remove recurring inference cost?

Short answer: **partly, and the split is not where most people guess.** The
voiceover is an easy and immediate win. Image understanding is a realistic
medium-term win. The stage that actually decides whether a film is any good —
writing ~2,000 lines of type-checking Remotion code as one structured response —
is the one local models are furthest from, and it is also the most expensive
stage today. A wholesale swap would trade a ~$1–2 API cost per film for a
visible drop in output quality.

Note also what already changed: in open-source mode the project pays **nothing**
for inference, because the work runs on the user's own Claude Code or Codex
subscription. The remaining cost question is only about the hosted service and
about users who want no subscription at all.

---

## 1. Every AI operation in the pipeline today

Six model calls plus one speech call per film. All of them are defined in
`src/lib/pipeline/prompts.ts`.

### 1.1 Reference breakdown — `referenceBreakdownMessages`

| | |
| --- | --- |
| Input | 36 sampled frames (images) + a text media report |
| Output | ~3–6 KB of prose: macro structure, transitions, camera, typography, pacing, colour, composition, inferred sound |
| Model today | `OPENROUTER_VISION_MODEL` |
| Genuine ML problem? | Yes — multi-image temporal reasoning |
| Local replacement | Plausible with a map-reduce redesign |
| Deterministic alternative | No. Shot-boundary and colour statistics can be computed with FFmpeg/OpenCV, but "why this cut works" cannot |
| Fine-tuning needed? | Not required; a captioning prompt library gets most of the way |

The weak point for a local VLM is 36 images in one context. The fix is
architectural, not model-scale: caption each frame individually (cheap, batched,
parallel), then have a text model synthesise the breakdown from 36 captions plus
the FFmpeg-measured timeline. That also makes the stage cheaper on any backend.

### 1.2 Reference fallback — `referenceFallbackMessages`

Text only, used when no reference video is available. Small, generic, and the
easiest call in the pipeline to run locally. A 7–8B model is adequate.

### 1.3 Application analysis — `applicationMessages`

| | |
| --- | --- |
| Input | logo + product screenshots (typically 3–15 images) + the brief |
| Output | product story, money-shot screen, sampled palette, type personality, credibility guardrails |
| Genuine ML problem? | Yes — UI understanding and grounded copywriting |
| Local replacement | **Best vision candidate.** Few images, single-image reasoning, concrete answers |
| Deterministic alternative | Partly: the palette can be extracted properly with k-means on the actual pixels, which would be *more* accurate than asking a model to eyeball it |

### 1.4 Creative direction — `creativeDirectionMessages`

Pure long-form text synthesis. A good 30B-class local model produces something
usable; the gap versus a frontier model is taste, specificity and restraint,
which is exactly what a launch film sells. Measurable only by human preference.

### 1.5 Storyboard and production plan — `storyboardMessages`

Long input (master prompt + all prior analyses), long structured-prose output
with nine scenes, each with duration, VO, on-screen text, animation, camera,
transition, SFX. Local models drift on long structured output: scenes lose
fields, durations stop summing to the target. Mitigation is to request one scene
per call and validate the schema — more calls, more time, better reliability.

### 1.6 Code customization — `customizeTemplateMessages` ← **the hard one**

| | |
| --- | --- |
| Input | ~60–90 K tokens: twelve complete source files, the motion-language doc, the storyboard, the asset manifest |
| Output | one JSON object containing twelve complete rewritten files, up to 48 K tokens |
| Hard gates | valid JSON · every allowlisted path present · compiles under `tsc --strict` · preserves the `COLORS` API, shared components, `Root.tsx`, `Film.tsx`, timing conventions · at least seven of nine scenes materially rewritten · audio scheduler intact · no new dependencies · no remote assets |
| Genuine ML problem? | Yes — constrained, long-form code generation |
| Local replacement | **Not at parity today** on a laptop-sized model |

Everything else in the pipeline is prose that a human skims. This stage either
compiles and renders or the run fails, and `hasMaterialCampaignRewrite` also
rejects a lazy near-copy of the bundled example. The failure modes we already
see with a frontier model — truncated JSON (there is a repair function for it),
unused-import type errors, dropped files — get much worse as model size drops.

The single highest-leverage change here is not a different model, it is a
different request shape: **one file per call** with the file's current contents
and the storyboard, validated and type-checked incrementally, instead of one
giant JSON blob. That would benefit the hosted path too, and it is the
prerequisite for any local-model attempt.

### 1.7 Voiceover — `generator/promo-video/template/scripts/build_audio.py`

| | |
| --- | --- |
| Input | 6–8 narration lines, under 45 words total |
| Output | one WAV per line, then a frame-locked mix |
| Model today | OpenRouter `gpt-audio`, voice `coral` |
| Local replacement | **Yes — the clearest win in the whole pipeline** |

The open-source build already replaces it with the operating system's offline
voice (`say`), which costs nothing but sounds synthetic. A neural local TTS
would close most of the quality gap (§2.3).

### 1.8 Already deterministic — keep it that way

Frame sampling, duration probing, voice-cue scheduling and overlap prevention,
SFX normalisation and mixing, loudness limiting, the App Store speed-ramp cut,
bitrate strategy, size fitting, and output validation are all plain code today.
None of them should become model calls.

---

## 2. Candidate local models

Model families move fast; treat these as categories with current exemplars, and
re-benchmark before committing.

### 2.1 Text and code

| Model | Size on disk (4-bit) | Fits | Suited to |
| --- | --- | --- | --- |
| Qwen3-Coder 30B-A3B (MoE) | ~18 GB | 32 GB Mac | code customization attempts; only 3B active params, so it is fast |
| Devstral / Codestral-class 22–24B | ~14 GB | 24–32 GB Mac | code customization, single-file calls |
| gpt-oss-20b | ~13 GB (MXFP4) | 16–24 GB Mac | direction, storyboard, fallback prose |
| Llama 3.3 70B | ~40 GB | 64 GB+ Mac | best laptop-scale prose quality |
| Qwen3 / DeepSeek 235B–480B MoE | 120 GB+ | server or 512 GB Studio | closest to frontier; not a laptop target |

### 2.2 Vision

| Model | Size (4-bit) | Suited to |
| --- | --- | --- |
| Qwen2.5-VL / Qwen3-VL 7B | ~6 GB | per-frame captioning at volume |
| Qwen2.5-VL 32B | ~20 GB | application analysis, screen understanding |
| InternVL3 8–38B | 6–24 GB | alternative with strong document/UI reading |
| MiniCPM-V 2.6 8B | ~6 GB | fast multi-image on modest hardware |
| Llama 3.2 Vision 11B | ~8 GB | permissive licence, weaker UI reading |

### 2.3 Speech

| Model | Licence | Notes |
| --- | --- | --- |
| **Kokoro-82M** | Apache-2.0 | ~300 MB, faster than real time on CPU, clearly the best fit for 6–8 short lines |
| Chatterbox | MIT | expressive, heavier |
| F5-TTS / Parler-TTS | permissive | good quality, slower, more setup |
| XTTS-v2 | non-commercial terms | voice cloning; licence makes it unsuitable for a hosted service |
| Piper | MIT | tiny and fast, noticeably robotic; a good CPU-only fallback |
| macOS `say` | system | what the open-source build uses today |

### 2.4 Supporting models

* **Whisper** (`whisper.cpp`, `faster-whisper`, MLX) — only needed if we restore
  transcript-aware reference analysis, which the hosted `watch` skill runs with
  `--no-whisper` today.
* **Embeddings** (`bge-m3`, `nomic-embed-text`) — only needed if the motion
  language and past storyboards become a retrieval corpus (§4).

### 2.5 Runtime

Ollama or LM Studio for a one-command install; **MLX** for the best tokens/sec
on Apple Silicon; llama.cpp when GBNF grammar-constrained JSON is wanted;
vLLM if this ever runs on a shared server with batching.

### 2.6 Hardware

| Machine | Feasible |
| --- | --- |
| 16 GB M-series | TTS, per-frame captioning, fallback prose. Not code customization |
| 32 GB M-series | + application analysis (32B VLM), 30B MoE code attempts |
| 64 GB M-series | + 70B prose, comfortable parallel vision |
| 128 GB+ Studio / A100-class server | 120B MoE; the only configuration worth benchmarking against the hosted output |

---

## 3. Cost

### Today, per film (hosted mode)

Roughly 250–400 K input tokens and 60–100 K output tokens across six calls,
plus a short TTS call. At current frontier pricing that lands near **$1–2.50 per
film**, which matches the $2.50 credit reserve the code requires before a run
(`PRODUCTION_CREDIT_RESERVE_USD`). The code-customization stage is the majority
of it, and a retry doubles that stage.

### Local

* Marginal inference cost: **$0**.
* Hardware: a 64 GB Apple Silicon machine is roughly $3,500–4,500 new; a shared
  GPU server with a 120B MoE is $1.5–3 K/month hosted, or a one-off card
  purchase plus power.
* Electricity: cents per film.
* Engineering: the real cost — the redesign in §1.6, an evaluation harness, per
  stage prompt re-tuning, model updates, and support for users whose machines
  cannot run it.

### Break-even

At $1.50/film against $4,000 of dedicated hardware, break-even is ~2,700 films —
before engineering time. Below a few thousand films a year, local models are a
*product* decision (privacy, offline, no subscription), not a cost saving.

### Where cost remains regardless

* Rendering compute (already local in open-source mode, Vercel Sandbox in hosted
  mode — this is a real and growing hosted cost).
* Storage and bandwidth for delivered MP4s.
* Reference downloading (proxies/cookies for sites that block servers).

**"Zero API cost" is already achieved for the project in open-source mode**, by
shifting inference to the user's own subscription. Achieving it for the hosted
service means paying for hardware instead, and accepting the quality trade in
§1.6 until the redesign lands.

---

## 4. Can local models reach today's quality?

Honest per-stage assessment.

| Stage | Parity outlook | Why |
| --- | --- | --- |
| Reference fallback | **Likely parity** | short, generic, low stakes |
| Application analysis | **Likely parity** with a 32B VLM | few images, concrete questions; palette extraction is better done deterministically anyway |
| Reference breakdown | **Near parity after redesign** | needs map-reduce captioning; a monolithic 36-image call will not work locally |
| Creative direction | **Noticeable gap** | taste and specificity; 70B narrows it, does not close it |
| Storyboard | **Noticeable gap** | long structured output drifts; per-scene calls plus schema validation recover most of it |
| Code customization | **Far from parity** | strict compile + API-preservation + originality gates; smallest margin for error, largest output |
| Voiceover | **Parity or better with Kokoro** | short lines, controlled text; today's local fallback (`say`) is the weak link, not the ceiling |

### What would help

* **Request-shape redesign before model choice** — per-file code calls, per-scene
  storyboard calls, per-frame captioning. This is worth doing even if we never
  ship a local model.
* **Grammar-constrained decoding** (llama.cpp GBNF / structured outputs) to make
  malformed JSON impossible rather than repaired after the fact.
* **A compile-repair loop**: feed `tsc` errors straight back to the model. Local
  inference is free, so five cheap attempts can beat one expensive one.
* **Fine-tuning**: a LoRA on (storyboard → template diff) pairs is the single
  most promising quality lever for §1.6, and needs perhaps 500–2,000 accepted
  examples. We do not have that dataset yet; the hosted service could start
  collecting it (with consent) from successful runs.
* **RAG**: retrieval over the motion-language doc and past accepted storyboards
  would help a smaller model stay inside the house style.

### How to measure parity

Build a golden set of ~30 briefs (varied categories, screenshot counts, with and
without a reference) and score both backends.

**Hard gates — automatic, pass/fail per run:**

1. valid JSON first try, and after repair
2. all twelve allowlisted files present, no extra paths
3. `tsc --noEmit` passes
4. `hasMaterialCampaignRewrite` passes
5. render completes; dimensions and frame rate exact
6. App Store cut ≤ 30.0 s at 30 fps
7. audio scheduler markers intact, no VO overlap
8. no invented claim: every on-screen and spoken claim traceable to the brief
   (an LLM-as-judge check against the brief, spot-audited by a human)

Report **pass@1** and **pass@3** per backend. Anything below ~90 % pass@1 on
gates 1–5 is not shippable, whatever the prose quality.

**Soft quality — human, blind, pairwise:** 30 films, A/B, five axes (hook
strength, copy quality, motion coherence, brand fit, "would I post this"). A
local backend is a credible replacement at ≥45 % preference against the hosted
one; below ~35 % it is a downgrade users will notice.

---

## 5. Proposed future architecture

```text
        AI provider interface (already exists: src/lib/ai)
                              │
   ┌──────────────┬───────────┴────────────┬─────────────────────┐
   │ OpenRouter   │ Claude Code / Codex    │ LocalModelProvider  │  ← new
   │ (hosted)     │ (open source, today)   │ (future)            │
   └──────────────┴────────────────────────┴──────────┬──────────┘
                                                      │
                         ┌────────────────────────────┴────────────┐
                         │ per-stage routing policy                │
                         │  captioning   → Qwen-VL 7B   (local)    │
                         │  app analysis → Qwen-VL 32B  (local)    │
                         │  direction    → 70B / gpt-oss(local)    │
                         │  storyboard   → per-scene, schema-checked│
                         │  code         → frontier, or local + a  │
                         │                 compile-repair loop     │
                         │  TTS          → Kokoro-82M   (local)    │
                         └─────────────────────────────────────────┘
```

Two things matter in this picture. First, the provider interface it plugs into
already exists — a local backend is a new `AiProvider`, not a rewrite. Second,
routing is **per stage**: the pipeline should be able to run TTS and captioning
locally while the code stage still goes to a frontier model, and to change that
mix per deployment.

### Roadmap

| Phase | Work | Outcome |
| --- | --- | --- |
| 0 | Evaluation harness: 30-brief golden set, the eight hard gates, a scoring CLI | Nothing can be judged without this |
| 1 | Kokoro-82M as a `LAUNCHLAYER_TTS_ENGINE` option | Removes the TTS API call and fixes the weakest part of the local build |
| 2 | Map-reduce reference analysis (per-frame captions + synthesis) | Cheaper on every backend; makes local vision viable |
| 3 | Per-file code customization + per-scene storyboard + compile-repair loop | Higher reliability everywhere; prerequisite for local code generation |
| 4 | `LocalModelProvider` (Ollama/MLX) with per-stage routing, non-code stages first | Measurable hybrid, no quality cliff |
| 5 | Benchmark local code generation against the gates; LoRA only if gates are close | Evidence-based go/no-go |

### Risks

* **Quality regression is the main risk**, concentrated in one stage.
* **Licence compliance**: check each model's terms before hosted use (XTTS-v2 is
  the clear example of a model that cannot be used commercially).
* **Support burden**: an open-source user with 16 GB of RAM cannot run the code
  model; the Claude Code / Codex path must remain the default.
* **Maintenance**: local models need re-evaluation on every upgrade; the golden
  set is what makes that cheap.
* **Latency**: a 30B local model generating 40 K tokens takes minutes, and a
  repair loop multiplies it. Free is not the same as fast.

### Recommendation

Do phases 0–3 regardless — they improve the hosted service and the open-source
build immediately, and cost nothing in quality. Treat phase 4 as a real feature
(privacy, offline, no subscription) rather than a cost saving, and gate phase 5
strictly on the hard-gate numbers.
