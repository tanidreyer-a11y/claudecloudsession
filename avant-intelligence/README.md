# Avant Intelligence (name pending: Avant Intelligence or Aether Intelligence)

- `brand/logo_source.jpg`: client logo as supplied. `brand/avant_wordmark.svg`: traced vector (not redrawn).
  Colours: black #030708 · white #FFFFFF · neon blue #3BC1EC (sampled from the Λ).
- `films/`: Remotion project with two compositions.
  - **Wide** (Video 1, 16:9, 40 s): logo anatomy. Tasks scatter, four agents ignite (Documents · Finance ·
    Follow-ups · Approvals, each a shade), a dive into the Finance agent's work, then the agents climb into the blue Λ.
  - **Tall** (Video 2, 9:16, 27.5 s): unanswered customer messages, a neon line arrives, the agents reply in their
    colours, the broken graph heals, then the Λ and the wordmark.
- Timelines `films/src/timelineWide.json` / `timelineTall.json` are estimated. They are re-timed to the voiceover
  when the scripts are recorded. Sound: `films/audio/build.py` (self-generated, no third-party audio).
- Recipes: `recipes-16x9.json` (engine output; Video 1 = B with A's colour, Video 2 = A).
- `aether-logo-prompt.md`: prompt for the alternative name's wordmark.

Render (sandbox): `npx remotion render src/index.ts Wide out/wide60.mp4 --browser-executable=<headless_shell>`,
then blend 60→30 fps, mux the audio, and run `skills/motion-studio/scripts/finish.sh`.
