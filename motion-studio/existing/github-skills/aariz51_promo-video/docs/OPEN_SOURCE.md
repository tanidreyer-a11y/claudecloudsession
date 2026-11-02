# Open-Source Architecture

How the local build works, what it shares with the hosted service, and why the
Claude Code / Codex integration is shaped the way it is.

## Two runtimes, one pipeline

```text
                        ┌──────────────────────────────────────────┐
                        │  Next.js app, dashboard, project studio  │
                        └────────────────────┬─────────────────────┘
                                             │
                        ┌────────────────────┴─────────────────────┐
                        │  Shared, mode-independent core           │
                        │  • prompts.ts        (all six prompts)   │
                        │  • template-contract.ts (generated code) │
                        │  • contract.ts       (nine stages)       │
                        │  • production-strategy.ts (bitrates …)   │
                        │  • generator/promo-video/template        │
                        └───────┬─────────────────────────┬────────┘
                                │                         │
          LAUNCHLAYER_MODE=local│                         │LAUNCHLAYER_MODE=cloud
                                ▼                         ▼
        ┌───────────────────────────────┐   ┌──────────────────────────────────┐
        │ src/lib/local/runner.ts       │   │ src/workflows/promo-video.ts     │
        │ in-process run                │   │ Vercel Workflow (durable steps)  │
        │ LocalWorkspace: dir + procs   │   │ Vercel Sandbox                   │
        │ .launchlayer/ on disk         │   │ Supabase Postgres + Storage      │
        │ no accounts (single user)     │   │ Supabase Auth                    │
        └───────────────┬───────────────┘   └───────────────┬──────────────────┘
                        │                                   │
                        ▼                                   ▼
        ┌───────────────────────────────┐   ┌──────────────────────────────────┐
        │ cliAgentProvider              │   │ openRouterProvider               │
        │ spawns `claude -p`            │   │ POST openrouter.ai/chat          │
        │     or `codex exec`           │   │ project-owned API key            │
        │ user's own subscription       │   │                                  │
        └───────────────┬───────────────┘   └───────────────┬──────────────────┘
                        │                                   │
                        └───────────────┬───────────────────┘
                                        ▼
                    Remotion + FFmpeg render → MP4 deliverables
```

`src/lib/ai/index.ts` is the only place that chooses between them.

## The local agent protocol

LaunchLayer does **not** treat a Claude Code or Codex subscription as an API
key, and it never touches their credential files. It drives each tool through
its documented non-interactive mode, as a child process:

* Claude Code — `claude -p "<instruction>" --output-format text
  --permission-mode acceptEdits --allowedTools Read,Write --add-dir <dir>`
* Codex — `codex exec --sandbox workspace-write --skip-git-repo-check
  "<instruction>"`

Each call uses a private temporary directory and a three-step file protocol:

1. LaunchLayer writes `request.md` — the system rules, the task, and the
   absolute paths of any images.
2. The agent reads that file, reads the listed images with its own tools, and
   writes its answer to `response.txt`.
3. LaunchLayer reads `response.txt` and deletes the directory.

Why files instead of argv and stdout:

* prompts reach ~200 KB (they embed twelve source files), past comfortable argv
  limits and awkward for the 10 MB stdin cap;
* the code-customization stage returns tens of thousands of tokens of JSON,
  which is safer read from a file than scraped out of a console stream;
* images are handed over as paths, so the agent's own image-reading tool does
  the work and no base64 copy travels through a prompt.

A non-zero exit is treated as a failure and surfaced verbatim (both CLIs print
failures such as an expired login to stdout), so an authentication error can
never be mistaken for a creative answer.

`--bare` is deliberately **not** used for Claude Code: bare mode skips OAuth
credentials, which is the opposite of what a subscription user needs.

## What differs, and why

| Concern | Hosted | Local | Reason |
| --- | --- | --- | --- |
| Reference video | bundled `watch` skill: yt-dlp + POT provider + Python in a Linux sandbox | FFmpeg frame sampling from an uploaded file, or yt-dlp when installed | keeps local prerequisites to FFmpeg; the hosted stack cannot be assumed on a laptop |
| Voiceover | OpenRouter `gpt-audio` (`coral`) | macOS `say`, or no narration | no project key, no per-use cost; quality is lower and this is stated up front |
| Durability | Vercel Workflow replays steps | run lives in the dev-server process | durable orchestration needs a hosted runtime; a stale run is failed on the next status read |
| Credit guard | OpenRouter balance pre-check | none | there is no project balance to protect |
| Storage | private Supabase buckets | `./.launchlayer` | nothing leaves the machine |

Stage names, ordering, progress reporting, prompts, the generated-file
allowlist, the theme/screen repair rules, the "materially new campaign" check,
bitrate strategy and the App Store cut are identical in both modes.

## Where the code lives

| Path | Role |
| --- | --- |
| `src/lib/runtime/mode.ts` | resolves `local` vs `cloud` |
| `src/lib/ai/types.ts` | provider-neutral messages, including image parts |
| `src/lib/ai/cli-agent-contract.ts` | pure invocation/prompt-document logic (unit-tested) |
| `src/lib/ai/cli-agent-provider.ts` | spawns the agent, reads the answer |
| `src/lib/ai/openrouter-provider.ts` | adapter over the existing hosted client |
| `src/lib/pipeline/prompts.ts` | the six creative prompts, shared |
| `src/lib/pipeline/template-contract.ts` | generated-code rules, shared |
| `src/lib/local/runner.ts` | the nine local stages |
| `src/lib/local/workspace.ts` | local execution surface |
| `src/lib/local/store.ts` | filesystem project store |
| `src/lib/local/reference.ts` | local reference sampling |
| `scripts/doctor.mjs` | `npm run doctor` setup check |
| `generator/promo-video/template/src/motion/` | motion-graphics library ([details](MOTION_GRAPHICS.md)) |

## Verified end-to-end run

A complete production has been run through this path with a real subscription,
not a stub:

| | |
| --- | --- |
| Agent | Codex CLI (`codex exec`), signed in with a real ChatGPT subscription |
| Brief | SafeMama, a pregnancy ingredient-safety scanner |
| Assets | 1 real logo + 10 real iPhone screenshots |
| Reference | a public YouTube URL, downloaded with `yt-dlp`, 35 frames sampled |
| Result | `1080x1920`, 60 fps, 1,980 frames, 33.05 s, H.264 + AAC, 27 MB |
| Wall clock | ~36 minutes, of which ~30 was model time and ~40 s was the render |

Stage timings from that run: reference analysis ~4 min (the agent read all 35
frames), app analysis ~4 min, creative direction ~3 min, storyboard ~6 min,
code customization ~17 min including one retry, audio 6 s, render 38 s.

The code-customization stage failed its first attempt because the agent's single
JSON response was cut off at ~36 KB, and succeeded on the retry. Expect that: it
is the one stage that asks for twelve complete files in one response.

## Known limits of the local build

* **A production ends if the dev server restarts.** There is no durable queue on
  a laptop; the project is marked failed on the next status read and can be
  retried. Closing a laptop lid ends a run, so keep the machine awake for the
  ~35 minutes a full production takes.
* **Narration quality is below the hosted voice.** Offline system speech is not
  neural TTS. Turn it off (`LAUNCHLAYER_TTS_ENGINE=none`) when that matters.
* **URL references need `yt-dlp`,** and some sites block automated downloads.
  Uploading the file always works.
* **Rendering is your CPU.** A 33-second 60 fps film is roughly 2,000 frames per
  format.
* **Motion density depends on the generated code.** A baseline run was
  near-static for 73 % of its length; with the motion-graphics library and its
  pacing rule the worst hold fell from 8.25 s to 5.25 s, but films still tend
  calm. Measure your own output with `npm run inspect -- <file.mp4>`. See
  [MOTION_GRAPHICS.md](MOTION_GRAPHICS.md).
* **The agent's own configuration applies.** `claude -p` loads the hooks,
  `CLAUDE.md` and MCP servers it finds in the working directory and in `~/.claude`.
  LaunchLayer runs each call in an isolated temporary directory to keep that
  surface small.
