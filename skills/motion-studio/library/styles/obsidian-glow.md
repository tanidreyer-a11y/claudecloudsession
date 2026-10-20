# Obsidian Glow (owner's own identity for carousels and website reels, 2026-10-20)
Owner's words: off-black and white, "that soft white glow", the Obsidian logo, his face and handles. It replaces the flat
black carousels with Claude emblems as the default. Layouts studied from two Instagram carousels he sent (a website list with a
soft-gradient cover; a "Websites 4 Designers" list with a container and a link pill). Method only (L3): our copy, our frames.
- **Look:** off-black `#0A0A0C`, one soft white glow rising from the bottom edge (white core in the bottom third, fading out by about
  70 % of the height), a faint white sheen from the opposite top corner, fine grain (SVG noise, overlay, 30 %). Neutral white only;
  no hue in the glow. The second brand colour (blue `#2F6BFF`) stays out of this family.
- **Type:** Archivo. Titles 650 / width 112 %, silver vertical gradient (`#FFFFFF` to `#A9ADB6`). Body 36–42 px, `#C4C6CD`.
  Anything that sits on the bright glow is dark ink `#0B0C0E` (handles, "Save for later"). Never white text on the glow.
- **Identity block:** round photo + name + Instagram and X handle with their glyphs. Handles are the owner's to supply; a missing
  one draws a dimmed placeholder and prints a warning. Never guess a handle.
- **Container:** the site recording or screenshot in a rounded box with a hairline border and a soft shadow. Colour lives only inside it.
## Carousel (`render_carousel.py`, `"style": "glow"`)
`glow_cover` {title, sub} (emblem top-left, identity at the bottom) · `site` {rank, name, line, url, image, aspect, focus, video?}
(topic label top, container, name, one line, link pill, handle + "Save for later") · `links` {title, body} (call to action + identity).
A `site` slide with `video` also writes `slide_NN.mp4` (the recording plays inside the container). 1080 x 1350.
Ranked lists ("top 3 3D platforms", "top 4 free templates on motion sites"): cover, one `site` slide per entry, `links` last.
Facts on those slides still follow the research rules in `obsidian-content/SKILL.md`.
## Website reel (`scripts/site_reel.py`, 9:16, 1080 x 1920, 60 fps, silent)
- **Container:** 16:9, touches both sides (1080 x 608), radius 18 (1.5 % of the width), centred at 45 % of the height. This is measured
  from the owner's reference reel (a phone recording of an Instagram reel). A 16:9 window crops about 18 % of a 2.16:1 recording;
  `focus` picks which side to protect. Alternative with no crop: `ch` 499 (full width, source shape).
- **Cut ("staggered cut", measured from that reference, 7 cuts):** the container swaps in one frame (one half-blended frame), the
  background follows 3 frames later (also one half-blended frame). No dissolve between sites, so no text-on-text ghosting.
  The reel's only other transition in the reference is a 0.25 s blur through white from a face clip into the sites; not used here.
- **Background:** per site, near-black with a soft glow from that site's own colour (sampled; override with `glow`), partner colour
  from the top. This is the colour variant; the white variant above is for carousels.
- **Text:** one topic line above the container ("3D animated websites"). Nothing else.
- **Intro (owner, 2026-10-20):** 2 s card before the first site on the Obsidian Glow background (off-black, white glow from the bottom, grain) with one header in
  Archivo 300 / 156 px / -0.035em that blurs to sharp in 0.5 s. Config `"intro": {"text": "3D animated<br>websites", "dur": 2.0, "size": 156, "y": 700}`.
  The site section after it is unchanged (checked frame by frame against the version before the intro).
- Run: `python3 -I skills/motion-studio/scripts/site_reel.py config.json out_dir` with `"stagger": 3`, `"cw": 1080, "ch": 608,
  "cy": 568, "radius": 18, "w": 1080, "h": 1920`, `"topic": {"text": "...", "y": 455, "size": 64}`.
