name: Obsidian Precision
source: OUR house style for Obsidian (Nathaniel Dreyer's studio, "Digital precision that builds reputation"), distilled
  2026-10-10 from two builds: OBS-LOVIO (obsidian-ad/brand-film/src/Film7.tsx — a frame-for-frame STUDY of a reference
  UI ad, used to learn timing, transitions and cursor work; never shipped as an Obsidian creative) and OBS-SCRATCH
  ("Built from scratch", src/Film8.tsx — the first ORIGINAL film in this style). The owner approved: smooth hero
  transitions, the typed opening, the typing/letter/cursor/click sound work, the monochrome palette and the white
  emblem. He rejected: white flashes between heroes, awkward copy pairs ("Where the quiet begins" → "This isn't"),
  anything that reads like a copy of the reference.
vibe_axes:
  energy: 3   # a move every 0.8–1.5 s, one beat of rest after each hero lands; drums only in the middle acts
  warmth: 2   # cool, technical, quiet confidence; warmth comes from people inside the work (tennis, a guest booking)
  density: 3  # one hero at a time; annotations and cards orbit it, never cover it
  realism: 4  # real hero-section screenshots and real footage inside a graphic UI world
  polish: 5
structure: |
  Built from scratch (the default spine; swap acts, keep the order of ideas):
  1. A caret types a short line big ("|Build / from scratch."). No search bars, no prompt UI.
  2. The caret becomes the hairline that opens ONE container; a 12-col grid and wireframe blocks build a site
     ("design-tool" detail: selection handles, a label chip, snap-to-centre) → the wireframe resolves into a real hero.
  3. The cursor clicks the hero's own CTA → the next hero opens FROM the click point inside the same container →
     a third hero dissolves in soft blobs. Each hero carries a mono case tag above the container ("02 — SOLT · …").
  4. A "material dive": the camera pushes into a surface in the last hero (chrome) and comes out in the next world.
  5. A craft beat: one giant word written by the hairline + the brand's grey shape (chrome spiral) in front, with
     annotation labels; a real UI control is clicked (Light/Dark) and the layout switches.
  6. A service beat per offer: ADS = "one shoot, every format" (crop marks reframe one shot 9:16 → 1:1 → 16:9 with real
     ad UI); AGENTS = a chat that answers inside a calm scene (the train window, 02:14).
  7. The services list (word rows + thumbnails; the last scene shrinks into the first thumbnail).
  8. Pull back over the wall of every site → the line ("Built from scratch. Every time.") → 3D emblem → lockup + the
     tagline typed with the same caret that opened the film.
pacing: 40 s master (cut-downs 15 s / 6 s keep acts 1–3 + 8). Hero holds 1.2–2 s; transitions 0.4–0.6 s; text types at
  12–18 chars/s; nothing on screen without a job.
camera: 2D-flat UI with depth from blur, scale and shadows; fixed container (175, 45, 1570 × 965 on 1920 × 1080);
  geometric dolly-outs (log-interpolated scale about a focus point), pushes INTO surfaces, shrinks INTO list slots.
transitions (all proven, smooth on the frame-jump scan):
  - caret-opens-frame — the typing caret stretches to full height, then splits into the container's edges (0.9 s)
  - wireframe-resolves — grid + grey blocks → the real hero fills left→right through a soft mask, blurred → sharp
  - click-opens-next — the cursor clicks a CTA; the next hero opens as an ellipse from the click point, over-bright,
    and settles (0.45 s) with a faint halo on the opening edge
  - blob-dissolve — 4 soft blobs (staggered 0.07 s) reveal the next hero blurred; it sharpens over 0.55 s
  - material-dive — scale ×9 (ease-in) into a light patch of the hero with rising blur; cross-fade into the next world
  - hairline-write — a vertical white hairline sweeps and reveals a giant word behind it
  - layout-switch — a real control is clicked; two eased washes (0.15 s each) hide the swap; the new layout lands with
    a dot-matrix sparkle in the top band and a script word writing on
  - crop-reframe — dim outside a crop rect with corner marks; the rect morphs between ad formats (0.5 s, move curve)
  - shape-match-cut — a rounded rect (the 16:9 banner) morphs onto the next shot's own rounded rect (the train window)
    tracked every 0.25 s; the old content fades inside it
  - shrink-to-list — the whole scene scales into the list's thumbnail slot and keeps playing there
  - wall-pullback — the last hero grows back into the container, then the camera pulls back over a 4×3 wall of sites
  NEVER: full-frame white blooms/flashes between heroes; a second copy of an element popping in at a cut; a headline
  changing size across a cut; ease-out starts on anything that covers the frame (use in-out).
typography: Inter 500 for display (-0.035 to -0.045em), Inter 300/400 for lines; Archivo Expanded (ArchivoW, stretch
  125%, 800–900) for the giant words; Instrument Serif Italic for ONE written word per film; JetBrains Mono 15–19 px,
  letter-spacing 0.14–0.16em, for tags, labels, counters and annotation chips. Grey ink gradient for the second half of
  a line (#C9CBD2 → #6E717B on dark; #111115 → #8E919B on light).
colour: monochrome — near-black (#060608–#121216), graphite, silver (#9A9CA5–#DCDEE2), white; light-grey gradient for
  "light layout" worlds, black→silver gradient for "dark layout". Colour lives ONLY inside the hero images and the
  footage. The emblem is white (or black on white). No purple, no brand hues.
ui_treatment: one fixed container with a blurred copy of its hero behind it; white/graphite glass cards (radius 18–34,
  1–1.5 px white borders); mono case tags above the container; design-tool details (12-col grid, selection handles,
  label chips, snap guide, leader-line annotations); real controls (segmented Light/Dark, CTA pills); social ad UI only
  inside the ads beat (story progress bars, feed icons, banner CTA); a chat card for agents.
motion_feel: the house settle curve cubic-bezier(.3, 0, .2, 1) for arrivals, the move curve (.6, 0, .2, 1) for
  rect/camera moves, back-ease only for small pops (cards, chips); everything blurs in (12–26 px → 0) rather than
  fading; cursor arrives early and hovers 0.2–0.7 s before it clicks; idle float on held objects (±8 px, ±2°).
sound: D-minor bed (numpy), 110 bpm pulse only in the middle acts; recorded UI layer (Kenney Interface Sounds, CC0) for
  every action — ticks for typing, click_002/003 for cursor clicks, drop/select for blocks and pops, maximize/minimize
  for container moves, switch/toggle for layout changes, scroll for list steps, confirmation for success states;
  one bell per hero arrival; booms only at act changes; master −16 LUFS.
signature_moves:
  - the caret that types the first word stretches into the hairline that opens the frame, and returns after the tagline
  - a wireframe on a 12-col grid snaps to centre and resolves into a real site
  - the cursor clicks a hero's own CTA and the next site opens from that click
  - one shoot reframed into every ad format with crop marks
  - the agent answers a 02:14 enquiry in the calm of a train window
  - the camera pulls back over the wall of every site: "Built from scratch. Every time."
do_not_copy: when a reference teaches a move, take the MECHANISM (how the frame changes, its timing and curve) and
  rebuild it from Obsidian's own motifs (caret, hairline, grid, container, emblem bars, monochrome). Never reuse a
  reference's beat order, copy lines, word pairs, product props, layout compositions, palette or logo. A study build
  (like OBS-LOVIO) stays internal.
best_for: Obsidian itself; premium studios and agencies selling websites, ads and AI agents; any brand whose product is
  a screen (SaaS, hospitality booking, property) and wants a quiet, expensive, technical feel.
clashes_with: Kinetic Pop (too loud), Brand Board Collage (fights the monochrome), Signature Vivid (vivid hues), Cream
  Cascade (warm, dense).
