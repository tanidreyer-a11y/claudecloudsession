# HANDOFF — read this first (new Claude session, 2026-10-10)

Owner: **Nathaniel Dreyer**, business **Obsidian** (premium marketing videos + 3D websites, South Africa).
WhatsApp **079 244 9607** · email tanidreyer@gmail.com. Work branch: `claude/kind-feynman-llu7qu` (not merged to main).

## How to work with Nathaniel (his rules)
- Advisor, not assistant: challenge assumptions, uncomfortable truth first, tag claims [Certain]/[Likely]/[Guessing],
  never "Great question/Absolutely/Definitely", don't fold without new information, let him decide. Simple language.
- **Ask before doing anything** that assumes or decides for him (e.g. never state who a film was made for).
- **Feedback by exception (locked L7):** he tells you what he does NOT like; approval/silence = keep. No questionnaires.
- Commit + push after every change.

## The skill (the important part)
`skills/motion-studio/` (packaged: `skills/motion-studio.skill`). Read in this order:
1. `history/locked.md` — L1–L11 override everything (quality floor = SmartTech "Crossroads"; vivid colours; never a
   replica; Oliver voice settings; focus point; feedback by exception; brand-board pieces by default (his own/generated
   pieces welcome); text inside the scene; voice = emotion / screen = information; object-to-object transitions).
2. `references/lessons-learned.md` (1–59), then `SKILL.md`, `intake.md` (client brief), `imagery.md`.
3. Styles: `library/styles/` (14 cards, newest **brand-board-collage** = the Klick Kulture look); parts: `library/slots.yaml`.
4. Templates: `templates/brand-collage-film/` (full source of the approved KK film), `templates/remotion/` (neutral).
5. Brands: `brands/klick-kulture.md` (+ assets), `smarttechnxt.md`, `avant-intelligence.md`, `adc-innovations.md`.
Reference videos (his screen recordings of ads): `motion-studio/references/videos/ref01–ref12` — new ones go there as ref13+.

## Projects and where they are
| Project | Where | State |
|---|---|---|
| **Klick Kulture** (agency, Garden Route) — contact **Marica** Tomicic (spelled MARICA, not Maritca), marica@klickkulture.co.za; partner Jessica Teague | `klick-kulture/` | Demo film **v2 approved** (`KlickKulture-MakesYouClick-v2.mp4`, 9:16, 42 s); Nathaniel is emailing it. Quote KK-004 sent (`Obsidian-Quote-KK-004.docx`). Waiting for her + partner's reaction. Optional: more physical snap (he films his own hand on a white wall), 16:9 version. Never use photos of the KK team. Never mention build time (2 h) to the client. |
| SmartTech NXT | `smarttechnxt-ad/` | "Crossroads" approved = quality floor |
| Avant Intelligence | `avant-intelligence/` | Signature series (Ahead, One Line, Every City, Starlight). Preview URL may need a Vercel login — check. |
| OBSIDIAN own ad | `obsidian-ad/` | v4 to do: refine logo 05, hero images, **re-render with the correct number 079 244 9607** (old renders show a wrong number) |
| Portfolio | `portfolio/` (artifact https://claude.ai/artifact/U68sJgXttYz4TXj5CcQKMH) · `portfolio-site/` | Artifact link works (send the LINK, not the HTML file). `portfolio-site/` is ready for Vercel: import repo, Root Directory `portfolio-site` (the Vercel connector lacked permission to create projects). |
| Cape Atlantic (interactive-art-weave repo) | separate repo | Waiting for his laptop scroll screen recording |

## Open ideas / pending decisions (his call)
- Outreach to agencies like Klick Kulture (Jo'burg/Pretoria/Cape Town first; Garden Route only after the KK deal).
  Message: "Hi [Name], I'm Nathaniel from Obsidian. I make premium, story-led brand films that agencies deliver to their
  clients under their own name. Here's some of my work: [link]. If you have a client who could use a video like this,
  I'd be happy to make a short sample for one of them… Would that be useful?"
- Own domain (e.g. obsidian.co.za) + Google Business Profile + directory listings (Clutch, DesignRush) for SEO/AI search.
- Higgsfield subscription (video clips) — suggested: one month, test on a real project.

## Running the films on a laptop
Needs Node 20+, ffmpeg, Python 3 with numpy + scipy + pillow + pymupdf.
`cd klick-kulture/film && npm i && npm i @fontsource/aileron @fontsource/poppins @fontsource-variable/archivo` →
`npx remotion studio src/index.ts` to preview. `render.sh` has sandbox paths (headless_shell, ffmpeg) — on a laptop
drop `--browser-executable` and use the system `ffmpeg`.
