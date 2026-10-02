# LaunchLayer Hackathon Submission

## Track

**UX for Agentic Applications**

Supporting capability: **Multimodal Intelligence**

## One-Line Pitch

LaunchLayer is the distribution layer for AI apps: an observable agentic workflow that turns a product brief, real screens, and a style-only motion reference into original launch films.

## Problem Statement

AI builders can now ship functional products in days, but communicating those products remains slow and fragmented. A credible launch film still needs reference research, product understanding, creative direction, storyboarding, motion design, voice, sound, rendering, and multi-format adaptation. Founders either coordinate several specialists, accept generic template videos, or launch without the storytelling their product needs.

## Solution

LaunchLayer encodes that creative team as one durable, human-steerable agent loop. The user provides product truth, real UI, brand assets, and a video whose motion language they admire. The system watches 36 chronological frames, studies the app, derives an original direction, writes the production, builds synchronized narration and sound, verifies constraints, and renders native vertical and landscape films. Every stage is visible, so the user can understand progress and recover from failure without losing context.

## Why Agentic UX

The main innovation is not a single generation call. LaunchLayer exposes nine responsibilities: environment preflight, input grounding, reference observation, product understanding, creative direction, storyboarding, code customization, audio production, and delivery verification. The interface shows each responsibility's status and result, while durable orchestration preserves state across refreshes and retries. This makes agency legible and controllable instead of presenting a black-box spinner.

## Technical Implementation

- **Next.js 15 + React 19 + TypeScript** for the responsive product experience.
- **Vercel Workflow DevKit** for durable, retryable, observable stages.
- **Vercel Sandbox** for isolated media and code execution.
- **OpenRouter** for multimodal analysis, planning, constrained code generation, and TTS.
- **Remotion + FFmpeg** for frame-locked films and native format rendering.
- **Supabase** for shared authentication, RLS-protected project state, audit history, and private final media.

The YouTube or uploaded reference is style-only. It contributes pacing, composition, typography, transition, and camera principles, while output media uses only the user's assets and original generated code. The voice pipeline measures every natural take, schedules lines without overlap, and pronounces camel-cased product names clearly. Only final MP4s are persisted; intermediate production data is deleted with the Sandbox.

## Codex Usage

ChatGPT Codex was used as the engineering partner to audit the original Promo-Video repository, convert its workflow into a SaaS architecture, implement the Next.js product, build Vercel Workflow and Sandbox integration, add Supabase isolation, diagnose production failures from logs and screenshots, create regression tests, harden cost and retry behavior, and verify responsive playback. The public Git history shows the progression from initial product shell through YouTube reliability, Sandbox constraints, delivery recovery, final-output-only storage, fullscreen previews, audio safety, and hackathon polish.

## Impact

LaunchLayer gives independent builders and small teams agency-quality launch storytelling without coordinating a full production crew. It turns distribution into a repeatable product workflow, shortens time to launch, adapts one campaign to multiple surfaces, and keeps the creative process understandable enough for a human to trust and steer.

## Links

- Application: `https://launchlayer-eight.vercel.app`
- Public demo: `https://launchlayer-eight.vercel.app/demo`
- GitHub: `https://github.com/aariz51/Promo-video`

## Presentation Outline

1. Building is solved; distribution is not.
2. The fragmented launch-film workflow.
3. LaunchLayer's product brief and reference inputs.
4. Nine-stage observable agent architecture.
5. Real SafeMama vertical and landscape results.
6. Technical architecture and style-only safety boundary.
7. Codex build evidence and commit history.
8. Impact: one launch system for every AI builder.
