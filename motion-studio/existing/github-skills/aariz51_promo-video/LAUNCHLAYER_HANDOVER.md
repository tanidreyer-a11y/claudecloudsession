# LaunchLayer Handover

> Historical maintainer note for the hosted deployment, kept for provenance.
> For running the project yourself, see [README.md](README.md) and
> [docs/OPEN_SOURCE.md](docs/OPEN_SOURCE.md) instead.

## 1) Current Project State (as of 2026-08-03)

- Repository: `https://github.com/aariz51/Promo-Video-`
- Goal: Hackathon MVP for launchable promo-video SaaS with vertical + landscape generation preview, based on cloned Caption AI + Promo-Video flow.
- Primary live deployment used for final checks: `https://launchlayer-eight.vercel.app`
- Last successful deployment state verified as `READY` and homepage + `/demo` are reachable.
- Latest known good commit on this branch: `25f1d9d`.

## 2) What was implemented

### 2.1 Landing preview behavior
- Updated the preview surface in `src/components/landing-experience.tsx`.
- The landing page now plays the real SafeMama demo movie directly in the mock-up preview area where the old placeholder/previous video was used.
- The preview video element is set to:
  - `autoPlay`
  - `muted`
  - `loop`
  - `playsInline`
  - `preload="metadata"`
- The source file path used in UI is `/safemama-launch-landscape.mp4`.

### 2.2 Public asset strategy
- Added copied asset: `public/safemama-launch-landscape.mp4`
- Source reference used: the SafeMama launch-video render output (`out/safemama-launch-landscape.mp4`) from the original local production.
- Verified SHA256 of copied file matches the original source.

### 2.3 Deployment alignment
- Changes were committed and pushed to GitHub main.
- Deployment issues were fixed by using the current active Vercel account context with writable project/team access.
- Production alias is configured to: `launchlayer-eight.vercel.app`.

## 3) Why we chose this approach

- For hackathon evaluation, success metric is: input brief + assets -> generate and render outputs that can be previewed and shown in demo.
- Storing large intermediate checkpoints/artifacts was removed/avoided where possible to prevent object size failures and reduce cost.
- Focus is now: one clean end-to-end generation path plus visual verification in browser, not a “production asset warehouse” model.

## 4) Required secrets and env vars

Use the same credential convention as existing project environment.

- Core for AI orchestration:
  - `OPENROUTER_API_KEY` (primary)
  - Any legacy `OPENAI_API_KEY` should not be used for standard video runs unless explicitly required.
- DB / auth:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY` if app uses that pattern)
  - service role / admin key if needed by backend routes
- YouTube extraction layer:
  - `YOUTUBE_COOKIES_B64` (preferred)
  - or `YOUTUBE_PROXY_URL` fallback when cookie approach is unavailable
- Cron cleanup (if enabled in deployed workflow):
  - `CRON_SECRET`
- Session-specific values for the hosted deployment live only in the maintainer's private secret store, never in this repository.

Important: keep all env variables in Vercel and do not hardcode secrets anywhere.

## 5) Known failures and root causes (so next dev does not repeat billing pain)

### 5.1 `analyzeReference` failures
- Error patterns:
  - `python 3.9 deprecated` (toolchain mismatch)
  - YouTube bot gate requiring auth/cookies
- Fix:
  - ensure environment/sandbox path uses supported runtime
  - provide `YOUTUBE_COOKIES_B64`
  - verify URL is accepted in analysis skill before triggering full render

### 5.2 Vercel sandbox preflight failure
- Error: `snapshotExpiration must be 0 or >= 86400000`
- Fix in workflow config: do not pass invalid retention values; use 0 (no expiry) or at least 86400000 ms.

### 5.3 `verifyRenderAndUpload` object size failure
- Error: `The object exceeded the maximum allowed size`
- Fix: avoid persisting large intermediate artifacts and keep output handling optimized for demo-size outputs.

### 5.4 Wrong upload MIME in creative direction stage
- Error: `mime type text/markdown; charset=utf-8 is not supported`
- Fix: normalize response/content-type where required by workflow storage/upload contracts.

### 5.5 “Production checkpoint above 45 MB” stop
- Error from output/package protection limits.
- Fix: reduce checkpoint payload and avoid storing non-essential artifacts; keep output bounded for demo usage.

### 5.6 Reusing previous app output
- A generated SafeMama output from prior run may appear selected if project/project state is not reset.
- Fix:
  - either create fresh project record before generation, or
  - explicitly reset project state + run “retire/replace” flow and generate again.

## 6) Cost-protection / operational discipline

- YouTube + rendering calls consume credits; do not repeatedly press retry on failing flows without fixing config first.
- Validate quickly with short, known-good links first.
- Keep local dev verification at mock/stub level first, then run one real production run.
- After each failed paid run, review workflow logs and clear only the necessary state before retry.

## 7) Runbook for a new developer

### 7.1 Local setup
1. Open repo.
2. Install deps.
3. Populate `.env.local` with required env vars.
4. Start app and verify `/` and `/demo` pages.

### 7.2 Run production flow safely
1. Confirm YouTube test link.
2. Ensure `YOUTUBE_COOKIES_B64` or proxy is set for non-authenticated videos.
3. Create a new project in UI.
4. Paste only required brief/assets/reference inputs.
5. Start generation once.
6. If any stage fails, fix root cause and restart from clean project state.

### 7.3 Vercel commands (account/accounting aware)
1. Set project and add env vars with `vercel env add ...`.
2. Deploy with: `vercel --prod --yes`.
3. Verify `launchlayer-eight.vercel.app` responds.
4. Verify deployment is fully Ready and checkpoints are not exceeding size limits.

## 8) Submission checklist for hackathon handoff

- GitHub repo (public/private per judge rules): `aariz51/Promo-Video-`
- Live Vercel link: `https://launchlayer-eight.vercel.app`
- YouTube/recording/demo video for final judge submission
- PPT + PDF deck (from NotebookLM/NotebookLM-inspired template):
  - Problem, approach, architecture, workflow, result, Codex usage, impact
- Project description doc with clear links (repo, demo, PPT, PDF)
- Mention explicitly that this is an agentic workflow for launch film generation and highlight reliability/cost-control.

## 9) Handoff notes for debugging speed

- Keep this handoff document + latest deployment URL open in every handoff session.
- If generation fails at any stage, read that stage name and the exact exception, fix just that stage, then rerun.
- Avoid touching UI and infra in the same retry wave unless needed.
- Every paid-run failure should be accompanied by a short note: expected result, actual error, and one config change.

