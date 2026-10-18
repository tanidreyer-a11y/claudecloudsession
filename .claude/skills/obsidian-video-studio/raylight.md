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

## How the two fit (owner's model, 2026-10-18)
**Raylight is a parts library: templates, transitions and UI you can use inside a video. This skill file is the director and
the builder of the whole film:** locked rules, brand file, intake, motion and camera rules, kit, sound, finishing, QA, delivery.
Raylight never decides the look, the pacing or the rules; it supplies parts, and every part is judged against the skill's rules.
- A template supplies a proven structure (scene beats, camera moves, 3D device or tilted-screen layouts, liquid glass, UI
  shapes). Pick the closest one in the PLAN step, read its beat sheet, and mirror its measured moves with our content.
- A Raylight-made part comes into the film as a finished clip, or its measured numbers are used to build the same move in our
  kit. Either way the skill's palette (`LOOKS.lumen`), font, sound and finish apply.
- Grade frames once: before exporting a Raylight clip that will go under our `<Finish>`, set its grain, chromatic aberration and
  vignette to 0 and mute its audio. That is housekeeping, not a ban on combining.

## Which rules win
1. `skills/motion-studio/history/locked.md` (the owner's locks) beats everything.
2. The brand file (`skills/motion-studio/brands/<slug>.md`).
3. This skill's own rules (`continuity.md`, the kit). Raylight's `craft-rules` and template beat sheets supply measured
   numbers (timings, easings, effect values, camera moves) when we build or adapt a part; where one disagrees with a lock or
   the brand, it loses.
| Topic | Raylight says | We say | Resolution |
|---|---|---|---|
| Cuts | prefers hard cuts, cut on motion (`add_speed_cut`) | L6 never hard cuts to black; L11 object to object | **OPEN, the owner decides.** Default until then: in the Raylight lane only `add_speed_cut` (one continuous move across the cut), never a cut to black. |
| Font | defaults to Inter | Inter is an AI tell (SKILL.md section 8) | Before the first edit set the project font to the brand font and read `get_project_overview` `styleDigest`. |
| Text | one text idea at a time, weight 500, headline caps enforced by the editor | L9 text in the scene | Follow Raylight's sizes inside Raylight. |
| Colour | about 3 colours | `LOOKS.lumen` (black, white, electric blue, bulb white) | Same direction. Set the lumen colours first. |
| Bounce | accent only | same | No conflict. |
| Effects | graded bloom, vignette, depth of field, grain | `<Finish>` | One stack only, in the lane that renders the final frames. |
| Sound | `add_sound`, `check_sync` | `sfx_code.py` | Raylight lane: its sound tools and `check_sync`. Plate: ours, with Raylight's audio muted. |

## Workflow when a Raylight part is used
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

## Combining them in one film (owner wants both: "I need a combination")
The skill file leads; Raylight parts come in as clips or as measured moves. Two routes:
**Route 1: our video inside Raylight's 3D (recommended first test).** Render a focus-follow UI clip in Remotion (for example
`DEMO-SAAS`, `STUDY-LIVE`). `upload_media` it to the Raylight project, then put it on a template's screen slot
(`add_shot` with `mediaSrc`, or `add_image`/video layer with `set_device_frame` for a MacBook or phone). Raylight supplies the
tilted device, dollies, liquid glass and depth of field; we supply the screen content, which is the part that looks bespoke.
Templates built for this: "Macbook pro around Linear", "Dark cinematic mobile app", "SAAS Demo Video".
Raylight's effects finish this route; sound is ours (laid under the export) or Raylight's, not both.
**Route 2: Raylight scenes inside our film.** `save_as_video` a Raylight act, then play it with `<OffthreadVideo>` in a Remotion
composition and join it to our acts with a match cut (`Matte`, `screenOf`, `worldAt` in `src/fx/Camera.tsx`). Before exporting
set Raylight's grain, chromatic aberration and vignette to 0 and mute its audio, so the frames are only graded once.
`<Finish>` and `post_fx.sh` finish this route.
Either way: the same palette (`LOOKS.lumen`) and font on both sides, 30 fps, 1080x1920 (check the Raylight project's canvas and
frame rate with `get_project_overview` first), and one pass of captions.
Untested limits: whether this container can reach Raylight's signed upload URL, the maximum upload size, and the export frame
rate. Test with one short clip first.

## Money (unverified; from tool descriptions and a Raylight template's on-screen copy, 2026-10-18)
- Referrals: `list_videos` and `update_share_page` say new Raylight accounts that start on a video's share page count toward
  the owner's referral earnings. The rate is not stated anywhere I could open.
- Template marketplace: the official "Raylight Marketplace" template shows a creator offer ("You can make serious designing
  money in Raylight", a "3D Mobile" template at $49, "You get 50%", "Apply now", raylight.app/creators). That is promotional
  copy inside a template, not terms. Confirm at raylight.app/creators before building a business plan on it.

## Status
Nothing in this file has been run end to end: no editor tab was connected on 2026-10-18. The first real test needs the owner
to open a project from `list_projects` and keep the tab open.
