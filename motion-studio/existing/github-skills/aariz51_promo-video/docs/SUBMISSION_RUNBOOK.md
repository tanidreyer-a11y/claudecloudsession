# Hackathon Submission Runbook

## Required Assets

Prepare these before opening the final form:

- Unique project name: **LaunchLayer**
- Primary track: **UX for Agentic Applications**
- Public deployed application: `https://launchlayer-eight.vercel.app`
- No-login judge route: `https://launchlayer-eight.vercel.app/demo`
- Public GitHub repository: `https://github.com/aariz51/Promo-video`
- Public demo video, no longer than 3 minutes
- Public Google Doc containing track, problem statement, and technical stack
- Presentation/PPT covering problem, approach, implementation, and impact
- Product thumbnail and 4-6 clear screenshots in case the project form requests them

No Codex feedback command, CLI submission command, or Codex session-ID command appears in the official hackathon guide. Submission is performed in the BlockseBlock web dashboard. Do not invent a command or expose a private task ID.

## Final Submission Flow

1. Open the hackathon page and choose **Create Project**.
2. Enter the unique project name and select the track.
3. Add the public app, GitHub, demo-video, Google Doc, and presentation links requested by the form.
4. Use **Submit Now**, read and enable both confirmation notes, then choose **Continue**.
5. Review every link in a private browser window.
6. Choose **Final Submit** only when complete; the guide says this action is irreversible.
7. Return to **Dashboard > My Projects** and confirm the status reads **Submitted**.

## Viability Gate

The organizers treat these as pass/fail before judging quality:

- The deployment opens without credentials.
- The core experience is functional.
- The repository is public and has visible commit history.
- The repository matches the demonstrated application.
- The demo is 3 minutes or less and shows end-to-end functionality plus Codex usage.

LaunchLayer addresses no-credential access through `/demo`; do not make judges register before they can see the result.

## Scoring Alignment

- **Technical execution, 50%:** show the nine-stage durable workflow, Sandbox execution, protected audio scheduling, deterministic verification, and two native renders.
- **Problem and impact, 20%:** lead with “Building is solved. Distribution isn't.” Explain the distribution bottleneck for rapidly shipped AI products.
- **Codex usage, 15%:** briefly show the commit history and explain how Codex helped turn the existing generator into a tested, deployed SaaS.
- **Originality, 10%:** emphasize observable agentic UX and the style-only reference boundary.
- **Completeness and demo, 5%:** use the public showcase, polished responsive site, and a rehearsed narrated demo.

## Final Technical Checks

- `main` contains the final commit and origin belongs to `aariz51`.
- Git author is `aariz51 <214028637+aariz51@users.noreply.github.com>`.
- `npm run verify` passes.
- `/` and `/demo` render at desktop and 390 px without overflow.
- Both showcase videos load and fullscreen preview works.
- Production auth callbacks are allowed by Supabase.
- `.env.local`, cookies, API keys, private assets, and user data are absent from Git history.
- The README, architecture, live app, and recorded demo make the same claims.
- The Google Doc, presentation, and video links are publicly viewable in an incognito window.

The published deadline in the reviewed guide is **August 3, 2026 at 11:59 PM**. Reopen the live BlockseBlock page immediately before final submission in case the organizer changes a field or deadline.
