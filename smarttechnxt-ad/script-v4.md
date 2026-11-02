# SmartTechNXT: "The Welcome" (v4, more breathing room, DaVinci workflow)

v3 was too dense for a slow read. v4 cuts about 118 words to about 88 and moves the pacing out of
ElevenLabs and into the DaVinci timeline, where you control it frame by frame.

Cut from v3: "Systems that never speak to each other", "invoices, claims, month-end",
"No stacks. No bottlenecks.", "Every decision... traceable". The visuals still show silos and the
audit trail, so the picture carries those ideas without narration.

Visuals, palette and logo motifs are unchanged from v3 (see `script-v3.md`).

## Script, clean (read this / edit this)

Every new beginning... arrives with paperwork.

A new client. A new employee.

Forms. Copies. Signatures.

Checked... and checked again.

Details typed... from one screen to the next.

And somewhere between the files... the welcome gets lost.

What if onboarding... simply flowed?

This is SmartTechNXT.

Intelligent software robots... working alongside your people.

They read every document.

Validate every detail.

And set up each account... before day one.

Every step... recorded.

And beyond onboarding... the same quiet precision.

Just your people... free for the work that matters.

SmartTechNXT.

Smart technology... in service of people.

## Script, ElevenLabs paste version (Multilingual v2 model)

Break tags only work on Multilingual v2 / Turbo / Flash, not on Eleven v3. Max 3 s per tag.
Too many tags in one generation can cause artefacts; if that happens, generate in 3 chunks (Acts 1, 2 and 3).

```
Every new beginning... <break time="0.6s" /> arrives with paperwork. <break time="1.5s" />
A new client. <break time="0.8s" /> A new employee. <break time="1.5s" />
Forms. <break time="0.5s" /> Copies. <break time="0.5s" /> Signatures. <break time="1.5s" />
Checked... <break time="0.8s" /> and checked again. <break time="1.5s" />
Details typed... <break time="0.6s" /> from one screen to the next. <break time="1.5s" />
And somewhere between the files... <break time="1.0s" /> the welcome gets lost. <break time="3.0s" />
What if onboarding... <break time="1.0s" /> simply flowed? <break time="2.0s" />
This is SmartTechNXT. <break time="2.0s" />
Intelligent software robots... <break time="0.6s" /> working alongside your people. <break time="1.5s" />
They read every document. <break time="1.0s" />
Validate every detail. <break time="1.0s" />
And set up each account... <break time="0.8s" /> before day one. <break time="1.5s" />
Every step... <break time="0.6s" /> recorded. <break time="1.5s" />
And beyond onboarding... <break time="0.8s" /> the same quiet precision. <break time="1.5s" />
Just your people... <break time="0.8s" /> free for the work that matters. <break time="2.5s" />
SmartTechNXT. <break time="1.2s" />
Smart technology... <break time="0.8s" /> in service of people.
```

Settings: Stability 50 to 55, Similarity 75, Style 10 to 15, Speed 0.85 to 0.88 (lower than v3).
Expected length: about 75 to 80 s.

## DaVinci Resolve: pacing in the edit (recommended)

Break tags get you close. The Edit page gets it exact.

1. Import the VO onto audio track A1.
2. Blade (B) in the silence before each line and ripple-drag the clips apart to the gaps below.
   If a gap sounds dead, lay about 0.5 s of room tone or the music bed under it; never leave pure digital silence.
3. Add a timeline marker (M) at the first syllable of every key word: Forms, Copies, Signatures,
   lost, flowed, SmartTechNXT, read, Validate, day one, recorded. Visuals snap to those markers.
4. Lay the music on A2, ducked about 12 dB under the voice (Fairlight: sidechain, or keyframe by hand).

| After the line | Gap | Why |
|---|---|---|
| arrives with paperwork | 1.5 s | Let the first image land |
| A new employee | 1.5 s | |
| Signatures | 1.5 s | |
| checked again | 1.5 s | |
| the next | 1.5 s | |
| the welcome gets lost | 3.0 s | The emotional low point. The longest silence in the film. |
| simply flowed? | 2.0 s | The question hangs |
| This is SmartTechNXT | 2.0 s | Logo reveal needs air |
| alongside your people | 1.5 s | |
| every document / every detail | 1.0 s each | A rhythmic triplet, kept tight on purpose |
| before day one | 1.5 s | |
| recorded | 1.5 s | |
| quiet precision | 1.5 s | |
| work that matters | 2.5 s | Breath before the sign-off |
| SmartTechNXT (final) | 1.2 s | |
| in service of people | 3.0 s hold | End card holds on silence and music |
