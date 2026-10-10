# Library

- `styles/`: 15 Style Cards, one per reference film (exact schema; studied for style only). Cards are the *source*,
  not templates.
- `slots.yaml`: the cross-reference. Every card is broken into parts per slot. Each part lists every card, approved
  film and shot card it appears in, its vibe range, what it needs (ui / imagery), and its clash and affinity pairs.
  `scripts/recipe.py` recombines these into recipes.
- `shots/`: 152 shot recipe cards from Vincentwei1021/video-shotcraft (Apache-2.0, see LICENSE and ATTRIBUTION.md;
  written in Chinese). Parts cite them as `shot:<folder>/<name>`.

| Card | Source | Energy·Warmth·Density·Realism·Polish | Needs |
|---|---|---|---|
| Midnight Signal | ref10 (+ref01) ElevenLabs Agents | 2·2·2·2·5 | — |
| Kinetic Pop | ref05 SaaS demo template | 5·4·3·2·3 | — |
| Paper Lab | ref02 ElevenLabs light | 2·3·2·2·5 | — |
| Deep Glass | ref03 NeuraFlow / Zelios | 3·2·3·3·5 | UI |
| Cream Cascade | ref04 localized ads | 3·4·4·4·4 | imagery |
| Cobalt Campaign | ref06 NIVO (image-led model) | 3·3·4·4·5 | imagery + UI |
| Sunset Prompt | ref07 model-launch Short | 4·4·2·2·4 | UI |
| Lavender Desk | ref08 Ester Intelligence | 2·3·3·4·4 | UI |
| Desert Glass | ref09 nexl | 2·5·3·5·5 | imagery |
| Enterprise Grid | ref12 ElevenLabs enterprise (dark/light, line text, benchmark rail, dotted globe) | 3·2·2·1·5 | — |
| Frost Trust | ref11 ElevenLabs security (frosted tiles, padlock, dot field) | 2·3·2·2·5 | — |
| Signature Vivid | OUR Avant films (Ahead, One Line, Every City) — the owner's favourite | 3·3·3·2·5 | — |
| Crossroads | OUR approved SmartTech film (technique only; colours stay with the brand) | 3·2·3·2·5 | — |
| Obsidian Precision | OUR Obsidian house style (OBS-SCRATCH "Built from scratch"; studied from a UI-ad reference, mechanisms only) — monochrome, one container, caret/hairline, click-opens-next | 3·2·3·4·5 | ui + imagery |
| Brand Board Collage | OUR approved Klick Kulture film — the brand board's own devices as the cast; template in templates/brand-collage-film/ | 4·4·3·3·5 | imagery + voice |

Cross-reference at a glance: `python3 scripts/recipe.py --report` (parts per card, usage, never-used parts,
clash-free combinations ≈ 125 billion today).
