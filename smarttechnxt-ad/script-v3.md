# SmartTechNXT: "The Welcome" (v3, voiceover script and creative plan)

## Concept

Onboarding is supposed to be a welcome. For most businesses it is a stack of paper.
The film opens on that contrast: a new client or employee arrives and is met by forms,
copies and re-checks. SmartTechNXT's robots quietly take the weight away, and the
welcome comes back.

Why onboarding leads the film:
- It is the pain point from the client (the admin onboarding panel, the volume of paperwork).
- SmartTechNXT has dedicated pages for both HR onboarding and customer onboarding, so the claim is on-brand.
- A single concrete story works better than a list of everything they automate. The breadth
  (invoices, claims, month-end) gets one line in Act 3, so the film doesn't pitch onboarding only.

Length: about 70 to 75 s (about 118 words at a slow read of about 1.7 words/s, plus held pauses).
v2 ran about 90 s, which is too long for a premium ad; pacing that slow starts to drag after about 60 s.

## Script (paste into ElevenLabs)

Every new beginning... arrives with paperwork.

A new client. A new employee.
Forms. Copies. Signatures.
Checked... and checked again.

Details typed... from one screen to the next.
Systems that never speak to each other.

And somewhere between the files...
the welcome gets lost.

What if onboarding... simply flowed?

This is SmartTechNXT.

Intelligent software robots... working alongside your people.

They read every document.
Validate every detail.
And set up each account... before day one.

Every step recorded. Every decision... traceable.

And beyond onboarding...
invoices, claims, month-end...
the same quiet precision.

No stacks. No bottlenecks.
Just your people... free for the work that matters.

SmartTechNXT.
Smart technology... in service of people.

### ElevenLabs settings

- Voice: mature, warm female with a low register and no vocal fry. Avoid "bright" presets.
- Stability 50, Similarity 75, Style 15 to 20, Speaker boost on, Speed 0.88 to 0.92.
- Generate the whole script in ONE take so the tone stays continuous. Regenerate the whole take instead of patching single lines.
- A line break gives a breath and "..." gives a held pause. If a pause is too short, add a `<break time="0.8s" />` tag.
- Export an MP3 or WAV. The film gets cut to the real waveform, so the timings below are targets and not locks.

## Scene plan (target timings)

| # | Time | VO | Visual |
|---|---|---|---|
| 1 | 0:00-0:06 | Every new beginning... arrives with paperwork. | Deep navy. A door-shaped slit of lime light opens (the "welcome"). A single white sheet drifts across it and blocks it. |
| 2 | 0:06-0:12 | A new client. A new employee. | Two minimal line-figures appear, one on each side. A thin label rolls in under each. |
| 3 | 0:12-0:17 | Forms. Copies. Signatures. | A hard cut on each word. The sheets multiply into a stack behind each figure. Type is thin and wide-tracked. |
| 4 | 0:17-0:21 | Checked... and checked again. | A tick draws, erases and draws again. The stack grows a step. |
| 5 | 0:21-0:26 | Details typed... from one screen to the next. | Three floating UI panels. A cursor ferries one value between them, slowly, twice. |
| 6 | 0:26-0:30 | Systems that never speak to each other. | A dashed line tries to join the panels and breaks at every gap. |
| 7 | 0:30-0:36 | And somewhere between the files... the welcome gets lost. | The camera pulls back and the stacks tower. The lime door-light from scene 1 narrows to nothing. Two seconds of near-silence follow. |
| 8 | 0:36-0:40 | What if onboarding... simply flowed? | The top sheet lifts and folds into one clean line of lime light. |
| 9 | 0:40-0:44 | This is SmartTechNXT. | The line draws the logo mark. The wordmark focus-pulls in, then shrinks to a corner bug. |
| 10 | 0:44-0:48 | Intelligent software robots... working alongside your people. | A soft lime node settles beside a human figure, level with the person and not above them. |
| 11 | 0:48-0:55 | They read... Validate... And set up each account... before day one. | Three beats, each on its word. A scan line lifts fields into data chips, the chips lock into a form with ticks, and an account card resolves with a "Day 1" badge. |
| 12 | 0:55-0:59 | Every step recorded. Every decision... traceable. | An audit-trail list writes itself down the right edge with monospace timestamps. |
| 13 | 0:59-1:05 | Beyond onboarding... invoices, claims, month-end... | The same flow line runs on through three more stations, and each label lights as it is spoken. The broken dashed line from scene 6 is now solid. |
| 14 | 1:05-1:10 | No stacks. No bottlenecks. Just your people... | The stacks from Act 1 dissolve top-down into lime particles. The two figures stand in open space, and the door-light is fully open. |
| 15 | 1:10-1:15 | SmartTechNXT. Smart technology... in service of people. | The corner bug returns to the full lockup and the tagline tracks in. Hold for 2.5 s. |

## Visual system

- Palette (VERIFIED: pixel-sampled from the client's logo, `assets/logo-reference.png`):
  Navy `#163456` for the ground (about 95% of the logo image), Lime `#B2CB07` for light and single accents,
  White `#FFFFFF` for type and the hero "T". Derived tints: navy-light `#334D6B` for secondary lines and
  panels, lime-soft `#BDD01B` for glow edges. Lime stays under about 5% of any frame, which keeps it premium.
- Logo motifs to animate (taken from the lockup):
  - The white "T" in SMAR**T**ECH is taller than the other letters and outlined. The line of light from scene 8
    draws exactly this "T", so the logo reveal is the payoff of the metaphor rather than a pasted-on end card.
  - The lime circle mark with its "T." (T plus dot): the dot is the robot. It is the small lime node that sits
    beside the person in scene 10 and settles back into the mark at the close.
  - Thin, wide-set capitals in the wordmark: on-screen type copies that weight (Light, wide tracking).
- Still needed: a vector logo (SVG/AI/EPS) or a PNG at least 3000 px wide. The reference is 475x140 and will blur at 1080p.
- Type: one geometric sans (for example Manrope or Inter Tight) in Light and Regular weights only, with wide tracking on single words.
  Monospace appears only in the audit trail. Swap in the brand font if SmartTechNXT has one.
- Motion: slow ease-in-out (cubic 0.65, 0, 0.35, 1), no bounces or overshoot, and 0.6 to 1.2 s transitions.
  Every visual event lands on a spoken word, never between words.
- Restraint rules: one idea per frame, a lot of negative space, no stock photos, no robot mascots,
  no glowing "AI brain". The robots are shown only as the lime node and the line of light.
- Sound bed: sparse felt piano or a low pad, a paper-rustle texture in Act 1 that fades out at scene 8,
  and a soft tonal "resolve" on the logo.

## Claims check

Everything the film says maps to phrasing surfaced from smarttechnxt.com via search: "intelligent
software robots", customer and HR onboarding (document processing, validation, account setup,
systems access), audit trails, payment processing and claims, and "smart technology in service of
people". There are no statistics and no ROI figures. The line "before day one" is an interpretation
of "provisioning equipment and setting up systems access". Confirm it with the client before release.
