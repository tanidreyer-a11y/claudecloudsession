# Sources: The scroll-scrub stack (made 17 Oct 2026, calendar day 3)

gsap.com, developer.mozilla.org, caniuse.com and ffmpeg.org were blocked by this environment's network policy on 17 Oct 2026, so every claim comes from the makers' own repositories (raw.githubusercontent.com), the npm registry, the local tools, or our own measurement.

| Claim on a slide | Source | How it was checked |
|---|---|---|
| 150 frames, 1440×900; JPEG 19.2 MB, WebP q80 8.3 MB, WebP 720×450 3.5 MB, AVIF q60 8.8 MB | our Northlight build, `obsidian-ad/brand-film/public/site/north/` | measured with Pillow (WebP q80 method 6, AVIF q60) on 17 Oct 2026 |
| H.264 video 3.0 MB (default) vs 5.9 MB (`-g 1`) | same frames, FFmpeg 6.1.1 libx264 crf 23, 30 fps | encoded and file sizes read on 17 Oct 2026 |
| Only 2 of 150 frames are keyframes (at 0 s and 3.4 s); a jump to 4.65 s decodes about 38 frames first | `ffprobe -show_entries packet=pts_time,flags` on the default file | 4.65 s = frame ~140; last keyframe = frame 102 |
| `-g` sets the GOP size | `ffmpeg -h full` (FFmpeg 6.1.1): "-g … set the group of picture (GOP) size" | read locally |
| GSAP is free including all bonus plugins, thanks to Webflow; install `npm install gsap` | https://raw.githubusercontent.com/greensock/GSAP/master/README.md ("GSAP is now 100% FREE including ALL of the bonus plugins … even for commercial use") | read 17 Oct 2026 |
| gsap 3.15.0 is the current version | https://registry.npmjs.org/gsap/latest (published 2026-04-13) | read 17 Oct 2026 |
| `scrub: true` = direct link; a number = seconds for the playhead to catch up | https://raw.githubusercontent.com/greensock/gsap-skills/main/skills/gsap-scrolltrigger/SKILL.md ("`true` = direct; number = seconds for playhead to 'catch up'") | read 17 Oct 2026 |
| Lenis: MIT, by darkroom.engineering, runs on native scroll so position: sticky, anchor links and accessibility keep working; `npm i lenis`; `lenis.on('scroll', ScrollTrigger.update)` | https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md; https://registry.npmjs.org/lenis/latest (1.3.27, MIT, published 2026-10-15) | read 17 Oct 2026 |
| animation-timeline: Chrome 115, Safari 26, Firefox 159 (beta, release 2026-10-27) | https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/animation-timeline.json and browsers/firefox.json | read 17 Oct 2026 |
| "WebP at shown size, half size on phones, first 20 frames first, video only with -g 1" | Obsidian's own rule of thumb (opinion, labelled "Our rule of thumb") | — |
