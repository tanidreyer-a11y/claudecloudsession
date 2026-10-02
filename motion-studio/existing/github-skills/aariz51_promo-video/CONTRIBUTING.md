# Contributing

Contributions are welcome through focused issues and pull requests.

1. Create a branch from `main`.
2. Keep changes scoped and preserve the style-only reference boundary.
3. Never commit credentials, signed URLs, private product assets, or generated user media.
4. Add or update tests for changed pipeline behavior.
5. Run `npm run verify` before opening a pull request.

## Working on the open-source (local) build

`npm run doctor` checks your toolchain and your Claude Code / Codex login. The
local runtime lives in `src/lib/local/`; the model runtime in `src/lib/ai/`.

Creative prompts (`src/lib/pipeline/prompts.ts`) and the generated-code contract
(`src/lib/pipeline/template-contract.ts`) are shared by the local runner and the
hosted workflow. Change them once, and expect both to change.

Two suites are opt-in because they cost time or subscription usage:

```bash
LAUNCHLAYER_LIVE_AGENT_TEST=1 npx vitest run cli-agent-provider.live   # one real agent call
LAUNCHLAYER_E2E=1 npx vitest run runner.e2e                            # full local render
```

Never add a project-owned API key to the local path, and never read a user's
agent credentials: shell out to their CLI and let it authenticate itself.

Changes to `generator/promo-video/` must preserve frame-locked timing, the generated-file allowlist, non-overlapping narration, and original-output requirements.
