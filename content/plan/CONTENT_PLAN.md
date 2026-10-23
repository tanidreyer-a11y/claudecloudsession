# OBSIDIAN CONTENT PLAN (for a fresh chat)
Version 2026-10-23. Owner: Nathaniel Dreyer. Two files go together: this plan and `obsidian-content-kit.zip`.
Follow this plan exactly. When something is missing, ask the owner one clear question. Never guess, never fake.

## 0. Start here (for the chat)
1. Unzip `obsidian-content-kit.zip`. Read this whole plan.
2. Before designing anything, look at `references/` (the owner's reference carousels) and `examples/` (approved Obsidian slides).
3. Make today's post first (section 9).
4. **Where to run it.** Capturing websites needs open internet, so run this in **Claude Code on the owner's computer** (desktop app or terminal).
   It needs Node, Python 3 with Pillow, ffmpeg, Chrome or Chromium, and Playwright (`npm i -g playwright && npx playwright install chromium`).
   In Anthropic's cloud sessions most tool websites are blocked by the environment's network settings, and the browser cannot record
   HTTPS pages there. If a capture fails, say which one and ask the owner for that single file. Never draw a fake UI of a real product.

## 1. Who we are
- **Obsidian:** a creative studio, web only: front-end design and UI/UX, scroll-scrub animated websites, 3D interactive websites.
  Tagline: "Digital precision that builds reputation."
- **Owner:** Nathaniel Dreyer. Instagram **@_studioobsidian**. Profile line: "Building premium digital experiences."
  X handle: NOT ON FILE. LinkedIn: NOT ON FILE. Ask for both; never guess. WhatsApp 079 244 9607 is the only contact in calls to action.
- **Voice:** "Websites don't just sit still. They tell a story and reflect quality and reputation." Plain, confident, premium.
  Never pitch on price. Never present our work as template work.

## 2. Audiences
- **Buyers:** business owners whose website does not show the quality of their work. Posts: showcase and proof. Speak to an owner, not a developer.
- **Peers:** designers and vibe coders who build with AI. Posts: tools, skills, news, saves.
- Mix: about 2 buyer posts and 5 peer posts a week. A peer-only feed grows peers, not clients.

## 3. The look: "Obsidian Glow" (owner-approved 2026-10-20)
- **Canvas:** carousel 1080 x 1350 (4:5). Reel 1080 x 1920 (9:16). Stills JPG quality 95, video H.264 MP4.
- **Background ("the plate"):** off-black `#0A0A0C` with one soft WHITE glow rising from the bottom edge (bright in the bottom third,
  gone by about 70 % of the height), a faint white sheen from the opposite top corner, fine film grain. Neutral white only, no hue.
  The glow corner changes from slide to slide (bottom left, centre, bottom right).
- **Type:** Archivo only. Titles weight 650, width 112 %, tracking -0.03em, sentence case, silver gradient (white to `#A9ADB6`).
  Body 36 to 42 px, `#C4C6CD`. Dark ink `#0B0C0E` is the only text colour allowed on the bright glow.
  JetBrains Mono for code only. Never Inter. No ALL-CAPS tracked labels. No emoji on slides. No purple of our own.
- **Marks:** the Obsidian emblem (two parallel slanted bars rising to the right, white) with the word "Obsidian", top left of covers.
- **Identity block** (covers and closing slides): round photo, "Nathaniel Dreyer", "Building premium digital experiences.",
  Instagram glyph and @_studioobsidian. Add the X row only once the owner gives the handle.
- **UI box:** every screenshot or recording sits in a rounded box (984 px wide, 28 px radius, hairline border, soft shadow).
  Colour lives only inside the box.
- **Removed on the owner's request:** the "Save for later" button. Do not add it back.

## 4. References (what to take, method only; never copy their words, layouts one to one, or brands)
- `references/suraj-dsgn_websites-list_slide-1..7.png`: a soft gradient cover, then one website per slide on a card with its name and
  link, and a "Want the links?" closing slide. Take: the cover glow (we do it in white and black) and one-site-per-slide rhythm.
- `references/noahelhadedy_websites-4-designers_slide-1..7.png`: black slides, a small topic label at the top, a big container with the
  site's UI, a domain pill under it, the creator's avatar and handle, a comment-for-links closing slide. Take: the topic label, the
  container, the domain pill, the identity row.
- `examples/glow_example_*.jpg`: our approved version of both. `examples/glow_claude-emblem_example.jpg`: the Claude emblem on top of a UI box.

## 5. The Claude emblem (owner, 2026-10-22)
Owner: "screenshots or screen recordings of UI with the Claude emblem on top."
- Set `"claude": true` in slides.json. The cover then carries the Claude symbol above the title (with `logo_label`), every UI slide carries
  it on top of the UI box (optional `claude_label`), and the closing slide carries:
  "Claude and Claude Code are trademarks of Anthropic. Obsidian is not affiliated with Anthropic."
- **Recommendation (the owner may override):** put the Claude symbol on UI that involves Claude (Claude Code, work made with Claude), not
  on another company's product. On a Figma or Vercel screen it reads as if that product were Claude. Use `"claude_mark": false` on those slides.
- Anthropic has not approved our use of its marks; the owner chose to use them. Never recolour or redraw the marks (`assets/marks/SOURCE.md`).

## 6. Slides (renderer: `scripts/render_carousel.py`)
`python3 scripts/render_carousel.py <post_folder>` reads `<post_folder>/slides.json` and writes `out/slide_NN.jpg` (and `slide_NN.mp4` for
any slide with a `video`). Slide types:
- `glow_cover` {title, sub, logo_label?, video?}: emblem top left, silver title, one sub line, identity block. With `video`, the clip sits
  under the glow, blurred, dimmed and desaturated, as texture.
- `site` {rank, name, line, url?, image, aspect, focus?, video?, claude_mark?, claude_label?}: topic label, UI box, rank + name, one
  sentence, domain pill, photo + handle. `rank` can be a number ("1") or a job ("Design").
- `links` {title, body}: the closing slide with the emblem lockup and identity block.
Top level: `style: "glow"`, `topic`, `identity`, `claude`. Optional `glow` per slide: bl, br, bc. `size` shrinks a long name.
Hook: 8 words or fewer, a claim the reader recognises from their own work. 6 to 9 slides. 35 words of body at most per slide.

## 7. Visuals without anyone recording by hand
- **Mode A, UI recording:** `node scripts/capture_ui.cjs shots.json shots/` opens each URL in a real browser, saves `<name>.png` and a
  5-second `<name>.mp4` while it scrolls or clicks as the JSON says. A page it cannot reach writes `<name>.FAILED.txt`; report it.
- **Mode B, screenshot:** the same command; use the PNG only.
- **Mode C, plain plate:** no capture; text on the glow (news, checklists, saves).
- Capture rules: public pages only, no logged-in screens, no personal data, 16:9 (1600 x 900), dark mode where the site has one,
  hide cookie banners with `"hide"`. Credit the domain on the slide.
- The owner's own live sites, for showcase, motion and 3D posts: `battoluxurywatch.vercel.app`, `headsetwebsite.vercel.app`,
  `mizukagami-sand.vercel.app`, `scroll-cinematic-hero.vercel.app`, `3-d-demo-web-dev-surgery.vercel.app` (GSAP ScrollTrigger + Lenis
  in its code), `interactive-art-weave.lovable.app` (three.js, GSAP, Lenis in its package.json), `cinematic-obsidian.vercel.app`,
  `capeatlanticcigars.vercel.app`, `northlights-ashy.vercel.app`, `arctic-scroll-lights.vercel.app`, `arch-haven-gallery.vercel.app`,
  `obsidian-real-estate.vercel.app`, `realestatepropdemo.vercel.app`. "We built" only for these.

## 8. Reels (`scripts/site_reel.py`)
9:16, silent unless told. A 2.5 s intro (texture video under the glow, the silver header blurring to sharp, the identity block), then each
site in a 16:9 box that touches both sides (1080 x 608, radius 18, centred at 45 % of the height), 4 s per site, each on its own
near-black background with a soft glow in that site's colour. Cut: the box swaps first, the background follows 3 frames later (each with
one half-blended frame). No dissolves, no text on the previews. Config format is at the top of the script.

## 9. TODAY: "One tool per job" (Tools post, carried over from Thu 22 Oct)
Peer post. 8 slides: cover, six tools (one per job), closing tip. Draft: `today/slides.json`. Capture list: `today/shots.json`.
1. `mkdir -p today/shots && node scripts/capture_ui.cjs today/shots.json today/shots`
2. Fill the three lines marked VERIFY from the official pages you just captured (read the screenshot; quote nothing you did not read).
3. Re-check the version facts on posting day: `npm view three version time.modified`, same for `gsap` (also `license`), `playwright`.
   Checked on 22 Oct 2026 from the npm registry: three 0.186.1 (24 Sep 2026, MIT), React Three Fiber 9.8.2 (21 Oct), GSAP 3.15.0
   (13 Apr 2026, "Standard 'no charge' license"; no release in six months), Playwright 1.64.1 (22 Oct, Apache-2.0), Vercel CLI 65.1.0
   (22 Oct), Figma Code Connect 2.0.2 (14 Oct). Update the dates in the slide lines if they changed.
4. `python3 scripts/render_carousel.py today`. Look at every slide at phone size: overflow, one-word last lines, dark ink on the glow.
5. The picks are the owner's to change. If he does not use one of them, swap it before posting (a tools post from someone who does not
   use the tools does not hold up).
6. Write the captions (section 11) and deliver (section 12).

## 10. The plan from today (topics are seeds, not facts; research each on the day)
| Date | Slot | Format | Seed | Visual |
|---|---|---|---|---|
| Fri 23 Oct | Tools (carried over) | Carousel 8 | One tool per job (section 9) | A |
| Sat 24 Oct | Top-N (peer) | Carousel 6 | "Top 3 3D platforms for websites" (candidates to verify: three.js, React Three Fiber, Spline) | A/B |
| Sun 25 Oct | Save (peer) | Carousel 7 | The brief that beats "make it modern": a design-brief template | C |
| Mon 26 Oct | News roundup | Carousel 5 | The 3 most useful updates for web builders in the last 7 days | C |
| Tue 27 Oct | Skills | Carousel 7 | Motion compared: GSAP vs Motion (motion.dev) vs CSS scroll-driven animations | C + code card |
| Wed 28 Oct | Showcase (buyer) | Reel + carousel | Our sites (section 7 list), the next batch | A |
| Thu 29 Oct | Tools | Carousel 8 | Fonts that are not Inter: alternatives by mood, licence and source | C |
| Fri 30 Oct | Proof (buyer) | Reel 20-30 s | How one of our heroes is built, layer by layer | A |
| Sat 31 Oct | Skills | Carousel 7 | Turn your style into a skill (Anthropic's skill docs) | C, Claude marks |
| Sun 1 Nov | Save | Carousel 8 | Launch checklist for AI-built sites: performance, SEO, accessibility | C |
| Mon 2 Nov | News roundup | Carousel 5 | 3 updates from the last 7 days | C |
| Tue 3 Nov | Skills | Carousel 7 | 5 MCP servers a web designer should connect, official ones first | C + code card |
| Wed 4 Nov | Showcase (buyer) | Reel + carousel | Our sites, another batch | A |
| Thu 5 Nov | Tools | Carousel 7 | Scroll-scrub performance: frames, formats (AVIF, WebP), preload, mobile | C + B |
| Fri 6 Nov | Proof (buyer) | Carousel | Case study: brief, build, result (the owner supplies the client and numbers) | B |
| Sat 7 Nov | Top-N | Carousel 6 | "Top 4 free templates on motion sites" (check each page and licence) | A/B |
| Sun 8 Nov | Save | Carousel 7 | "AI will replace web designers": what surveys and job data say (primary studies only) | C |
| Mon 9 Nov | News roundup | Carousel 5 | 3 updates from the last 7 days | C |
| Tue 10 Nov | Skills | Carousel 8 | The 5 newest, most active web-design skills | C + code card |
| Wed 11 Nov | Recap + offer | Carousel 8 | The tools that mattered, then "Obsidian builds the sites these tools can't" | C |
| Thu 12 Nov | Tools | Carousel 8 | The vibe coder's QA pack: web-design-guidelines (Vercel), webapp-testing, accessibility | C/B |
| Fri 13 Nov | Proof (buyer) | Carousel or reel | "Your website doesn't show the quality of the work you actually do": before vs after | B/A |
| Sat 14 Nov | Skills | Carousel 8 | Figma to code with Claude: Figma MCP and official skills | C + code card, Claude marks |
| Sun 15 Nov | Save | Carousel 8 | The AI-design tells checklist | C |
| Mon 16 Nov | News roundup | Carousel 5 | 3 updates from the last 7 days | C |
| Tue 17 Nov | Skills | Carousel 6 | How to vet a skill before you install it | C |
If nothing from the last 7 days qualifies for a news post, run a Tools post instead. Never recycle old news as new.
The glow family has no text-only slide type yet. For Mode C posts, ask the owner whether to build one (same plate, kicker, title, body,
source line in dark ink) or use the older black slide types in the renderer.

## 11. Captions
- Instagram: casual, 5 hashtags at most, ends with a clear next step.
- LinkedIn: first person, 3 hashtags at most, ends with one question to the reader.
- X: 270 characters at most (count them), 0 to 2 hashtags, @tags only for handles confirmed today on the subject's own site or profile.
- Owner-approved lines for buyer posts: "Step into a world of premium design with the future of web development." and "Websites don't just sit
  still. They tell a story. They reflect quality and reputation." Use each at most once a week.
- No promises of results, no price talk, no "game-changer", no emoji in headlines.

## 12. Truth and delivery
- Every factual claim traces to a primary source opened that day (official site, docs, changelog, repo, npm registry). Listicles, X threads
  and YouTube summaries are leads only. News must be 7 days old or less, with the source date on the slide. No numbers you did not read
  that day. Never invent people, quotes, handles or results. Never present someone else's work as ours.
- Deliver: every slide as its own JPG (01 to NN), the MP4s for video slides, the three captions in code blocks, the sources, and one zip.
  No PDF. Never a grid or contact sheet as a deliverable.

## 13. Ask the owner (open items)
1. His X handle and LinkedIn page.
2. Which of today's six tools he does not use, so they can be swapped.
3. Norr's web address (its link pill stays off until then).
4. Footage for the proof posts (30 Oct, 6 Nov, 13 Nov); the 6 Nov case study also needs a client and numbers.
