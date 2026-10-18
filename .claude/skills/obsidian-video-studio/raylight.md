# Raylight lane (detail file of obsidian-video-studio)

Raylight (raylight.app) is a motion-design video editor. Its MCP server is connected to the owner's claude.ai account.
This file decides WHEN to use it, how it coexists with our Remotion kit, and which rules win when they disagree.
Facts checked on 2026-10-18 in a cloud session (tool lists, `get_design_guide craft-rules`, `list_templates`).

## What it is, and the hard limit
- Tools: `get_editor_status`, `list_projects`, `list_templates`, `start_from_template`, `get_design_guide`, `get_project_overview`,
  `get_shot_details`, `apply_edits` (up to 200 edits per call), `render_stills`, `render_filmstrip`, `render_waveform`,
  `check_sync`, `save_as_video`, `upload_media`, `list_videos`, `update_share_page`, import tools.
- **Every edit and render runs through the owner's LIVE editor tab.** `get_editor_status` returned `connected: false` on
  2026-10-18. A cloud session cannot open that tab. The owner opens the project link (`list_projects` gives it) and keeps the
  tab open, or nothing works. Never promise a Raylight edit before `get_editor_status` says connected.
- `list_templates` returns the free templates only (about 50). The ones with a `designGuideTopic` are the official hand-built
  ones. Many are recreations of other brands' motion (Linear, Apple, Fey, Revolut, X, ChatGPT, Airbnb, Claude). L3 applies:
  keep the style and the moves, replace every signature device, logo and word with the client's. Never ship a template as-is.
- Free-plan share pages carry a "Made in Raylight" block; hiding it needs the Max plan (`update_share_page` description).
  Check the plan before promising a client a clean link.
- **Not verified:** Raylight's licence terms for client work, and for redistributing templates or its guide text. Read the
  terms at raylight.app before selling anything that touches them. A Gumroad pack must NOT contain Raylight templates or
  guide text; it tells buyers to connect their own Raylight account.

## One engine per film
| Job | Lane |
|---|---|
| Bespoke brand film, focus-follow UI walkthrough, one-shot point film, voice-HUD ad, sound made in code | **Remotion** (our kit) |
| Fast SaaS / product launch from a proven template: tilted 3D screenshots, MacBook / phone devices, liquid glass, dollies | **Raylight** |
| The client will edit copy or screens themselves later | **Raylight** (they can open and edit it) |
| Needs our loop, our sound design or our loudness chain | **Remotion**, or a Raylight export used as a plate (below) |
Never two engines in one timeline. Never two finishing stacks on the same frames (grain, chromatic aberration, vignette).

## Which rules win
1. `skills/motion-studio/history/locked.md` (the owner's locks) beats everything.
2. The brand file (`skills/motion-studio/brands/<slug>.md`).
3. Inside the Raylight lane: Raylight's `craft-rules` for the numbers (timings, easings, effect values, camera moves).
   Inside the Remotion lane: `continuity.md`.
| Topic | Raylight says | We say | Resolution |
|---|---|---|---|
| Cuts | prefers hard cuts, cut on motion (`add_speed_cut`) | L6 never hard cuts to black; L11 object to object | **OPEN, the owner decides.** Default until then: in the Raylight lane only `add_speed_cut` (one continuous move across the cut), never a cut to black. |
| Font | defaults to Inter | Inter is an AI tell (SKILL.md section 8) | Before the first edit set the project font to the brand font and read `get_project_overview` `styleDigest`. |
| Text | one text idea at a time, weight 500, headline caps enforced by the editor | L9 text in the scene | Follow Raylight's sizes inside Raylight. |
| Colour | about 3 colours | `LOOKS.lumen` (black, white, electric blue, bulb white) | Same direction. Set the lumen colours first. |
| Bounce | accent only | same | No conflict. |
| Effects | graded bloom, vignette, depth of field, grain | `<Finish>` | One stack only, in the lane that renders the final frames. |
| Sound | `add_sound`, `check_sync` | `sfx_code.py` | Raylight lane: its sound tools and `check_sync`. Plate: ours, with Raylight's audio muted. |

## Raylight lane workflow
0. Main workflow step 0 first (locked rules, brand file, intake).
1. `get_editor_status`. Not connected: `list_projects`, give the exact `editUrl`, stop and wait for the owner.
2. `list_templates`. Pick the closest official template. `get_design_guide` with that template's topic (its beat sheet), and
   `craft-rules` once per session. Do not re-read them.
3. One-paragraph storyboard in chat (scenes, palette, type). The owner says go.
4. `start_from_template`, then `apply_edits`: one batch per scene. Lint findings are mistakes you just made; fix them.
   `render_stills` or `render_filmstrip` after every scene and look at them.
5. Sound with Raylight's tools; verify with `check_sync`.
6. `save_as_video`. Final: normalise with `finish.sh` (−14 LUFS), add no extra grain. Plate: see below.
7. `update_share_page`: ask the owner before making a video public.

## Raylight export as a plate in Remotion
`save_as_video` gives an mp4. Play it with `<OffthreadVideo>` inside a Remotion composition and add our captions, HUD,
sound and finishing on top. Before exporting set Raylight's grain, chromatic aberration and vignette to 0 and mute its audio,
so the frames are only graded once.

## Status
Nothing in this file has been run end to end: no editor tab was connected on 2026-10-18. The first real test needs the owner
to open a project from `list_projects` and keep the tab open.
