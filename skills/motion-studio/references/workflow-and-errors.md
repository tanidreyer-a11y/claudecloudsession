# The real build workflow (as it runs in this environment) and the errors it prevents

## Pipeline that worked (Avant signature series, OBSIDIAN v3)
1. **Read** `history/locked.md` → lessons-learned → the brand file → the relevant style card(s).
2. **Reference study** (if a reference is given): find the active picture area with `cropdetect`, pull frames every
   0.5–0.8 s at full resolution, tile them, describe every beat (object, camera, transition, hold, colour, type).
   Phone recordings: crop to the video inside the app UI. Note duplicates (ref10 = ref01).
3. **Concept**: one sentence spine + 6–9 beats; every device must come from the client's mark/name/promise.
4. **Build in Remotion** (template: `avant-intelligence/films-v3-agents`): one component per act, all timing in seconds,
   `prog()/win()` helpers, deterministic `h(i)` randomness, world-space camera for travel, clipPath for dives.
   16:9 and 9:16 from one component via `useVideoConfig` (layout flag `wide`).
5. **Stills sheet before any render** (`BROWSER=… FFMPEG=… node stills.mjs <Comp> out/sheet.jpg t1,t2,…`) at every
   transition and hold; fix layout/overlap issues here (cheap) not after a 15-min render.
6. **Score** with the audio kit (`audio/build*.py`): chord per world, notes for objects, ≤ 3 air moves; cues read the
   same timings as the picture.
7. **Render** 60 fps (`--concurrency 4`, headless-shell path), blend to 30 fps (`tmix=frames=2`), mux audio,
   `finish.sh` (−16 LUFS, BT.709, web copy under budget).
8. **QA the encoded web file** (frames at every transition), then commit + push, then send.
9. **Learning loop** (`learning-loop.md`).

## Errors met and how to avoid them
| Error | Fix |
|---|---|
| Remotion tries to download Chrome (403) | always pass the headless-shell path (`--browser-executable` / `BROWSER=`) |
| `ffmpeg` not found in finish.sh | `FFMPEG=<imageio binary> bash finish.sh …` |
| Concurrency 6 fails | the machine has 4 cores: `--concurrency 4` |
| Playwright Chromium can't play H.264 | test pages with VP9/webm; real browsers play the mp4 fine |
| vercel.app / lovable.app / CDN blocked | clone the repo, serve local node_modules via file://, or ask for screenshots/recordings |
| Background command "timed out" while the render finished | check the output file before re-running |
| `pkill -f` pattern killed its own shell | never pkill a pattern that matches the running command |
| Window `render` shadowed by a wrapper → infinite recursion | keep `const baseRender = render` before reassigning |
| Text hidden behind moving objects | draw type layers after (above) the objects |
| Element clashes (label over card, title over sun) | stills sheet at every beat before rendering |
| `toLocaleString` gives odd separators in headless Chrome | format numbers manually (`/\B(?=(\d{3})+(?!\d))/g`) |
| Artifact images show "?" on phone | embed images/videos in the page (data/blob), keep page ≤ 16 MB |
| Artifact `assets` capability makes the page org-only | don't use it for client-facing pages |
| Git push "remote end hung up" | retry with backoff (2, 4, 8, 16 s) |
| Stop hook: untracked files | commit and push after every deliverable, gitignore raw renders |
