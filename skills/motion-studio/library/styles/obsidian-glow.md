# Obsidian Glow (owner's own identity for carousels and website reels, 2026-10-20)
Owner's words: off-black and white, "that soft white glow", the Obsidian logo, his face and handles. It replaces the flat
black carousels with Claude emblems as the default. Layouts studied from two Instagram carousels he sent (a website list with a
soft-gradient cover; a "Websites 4 Designers" list with a container and a link pill). Method only (L3): our copy, our frames.
- **Look:** off-black `#0A0A0C`, one soft white glow rising from the bottom edge (white core in the bottom third, fading out by about
  70 % of the height), a faint white sheen from the opposite top corner, fine grain (SVG noise, overlay, 30 %). Neutral white only;
  no hue in the glow. The second brand colour (blue `#2F6BFF`) stays out of this family.
- **Type:** Archivo. Titles 650 / width 112 %, silver vertical gradient (`#FFFFFF` to `#A9ADB6`). Body 36–42 px, `#C4C6CD`.
  Anything that sits on the bright glow is dark ink `#0B0C0E` (handles, "Save for later"). Never white text on the glow.
- **Identity block:** round photo + name + tagline + Instagram and X handle with their glyphs (`identity` in slides.json: name, instagram, x, tagline).
  On file (owner's Instagram screenshot, 2026-10-20): Instagram `@_studioobsidian`, tagline "Building premium digital experiences." X handle: not on file.
  A handle that is not set is left out and a warning is printed. Never guess a handle, never draw a placeholder.
- **Container:** the site recording or screenshot in a rounded box with a hairline border and a soft shadow. Colour lives only inside it.
## Carousel (`render_carousel.py`, `"style": "glow"`)
`glow_cover` {title, sub, video?} (emblem top-left, identity at the bottom; with `video` the owner's clip sits under the glow, blurred 14 px, dimmed to 45 %,
desaturated to 75 %, so only colour and movement remain, and slide_NN.mp4 is written) · `site` {rank, name, line, url?, image, aspect, focus, video?}
(topic label top, container, name, one line, link pill when a url is given, owner's photo and Instagram handle; no "Save for later", owner's call) ·
`links` {title, body} (call to action + identity). A `site` slide with `video` {src, start, dur, crop?} also writes `slide_NN.mp4` (the recording plays
inside the container). 1080 x 1350. Third-party footage as a background (the owner used a recording of motionsites.ai): crop its footer and logo out first.
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
- **Text:** none on the previews. (A topic line above the container is still supported with `"topic"`, but the owner removed it on 2026-10-20.)
- **Intro (owner, 2026-10-20):** 2.5 s card before the first site, built to match the carousel cover: the owner's video blurred, dimmed and desaturated as
  texture, the white glow over it, the silver header (Archivo 650, expanded, 112 px) blurring to sharp in 0.5 s, and the identity block. Config
  `"intro": {"text": "3D animated<br>websites", "dur": 2.5, "size": 112, "y": 690, "ident_bottom": 240, "video": {"src", "start", "crop"}}` plus top-level `identity`.
  The previews carry no text (owner: remove the topic line above the containers). The site section is unchanged (checked frame by frame).
- Run: `python3 -I skills/motion-studio/scripts/site_reel.py config.json out_dir` with `"stagger": 3`, `"cw": 1080, "ch": 608,
  "cy": 568, "radius": 18, "w": 1080, "h": 1920`, `"topic": {"text": "...", "y": 455, "size": 64}`.
