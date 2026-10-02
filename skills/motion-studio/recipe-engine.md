# Recipe engine — cross-referencing the Style Cards so no two films look the same

## The idea
A Style Card (`library/styles/*.md`) describes one reference film's look as a whole. Copying a card makes every film
look like that reference. So every card has been broken into **slots**: structure, pacing, camera, transitions (3),
typography, colour, UI treatment, motion feel, sound and hook. All the parts live in one cross-referenced pool,
`library/slots.yaml`. Each part records:
- which cards (and approved films, and shot cards in `library/shots/`) it came from;
- which vibe ranges it suits (explicit, or derived from its source cards);
- what it needs (product UI, imagery);
- which other parts it clashes with, and which pairs are proven together.

Today that is 9 cards and 98 parts, which gives about 190 billion raw combinations, of which about 125 billion pass
the clash rules (`scripts/recipe.py --report`). Every new reference adds parts, so the space keeps growing.

## How a recipe is built (`scripts/recipe.py`)
1. **Target** = the brief's vibe axes (energy, warmth, density, realism, polish), plus `--ui yes/no` and `--imagery yes/no`.
2. **Base card**: the card nearest the target. It is penalised if it was a recent project's base, or if it needs imagery
   and there is none. Each of the 3 recipes gets a different base.
3. **Donor card**: a compatible card whose clash list doesn't name the base (and the other way round). Each recipe
   gets a different donor.
4. **Slot scoring**:
   - + base origin, + donor origin, + house techniques (approved films, shot cards);
   - − distance outside the part's vibe range;
   - + proven pairings;
   - − parts already used by the other recipes in this set;
   - − parts used in the last 5 projects;
   - − parts this brand used last time.
   A little seeded randomness is added. **One wildcard slot** per recipe ignores base/donor, so something from
   anywhere in the library can enter.
5. **Clash rules** are hard: a part that clashes with anything already chosen is skipped.
6. **Distinctness**: each recipe must differ from the others in at least 6 of the 9 single-choice slots.

## Presenting the 3 recipes to the client
For each recipe:
- name it after its lineage ("Desert Glass × Cream Cascade");
- write one line of logline for THIS business;
- list the slots in plain words, with the signature move and the fonts;
- say what it needs (photos, UI) and what it costs;
- give the risk in one line.

Then show the comparison table. Recommend one with a reason, and let the client pick, mix ("A's colour with C's
camera") or veto parts. Run with `--seed N` for a fresh set, or edit the JSON by hand. Never re-run the engine
silently until it shows "your" favourite.

## Anti-repetition rules
- After the client picks, record it:
  `python3 scripts/recipe.py --record /path/props.json --pick 2 --brand <slug> --client "<name>"`
  This writes to `history/projects.json`.
- Recipes in one set must not share their signature transition or colour family.
- Two consecutive projects (any clients) must not share more than half their slots. The engine penalises this;
  check the table before presenting.
- A brand's own colours and fonts (`brand-tokens`, `brand-font`) are used only for that brand's films. Never default
  another client to ADC Innovations' or SmartTechNXT's palette, type or signature moves. House techniques
  (spline-zoom-through, object-becomes-object) are allowed but rationed: at most one per film unless the client
  asks for that look.
- A locked brand (`locked: true` in its profile) keeps its palette and type, but structure, camera, hook and the
  signature transition must change from its last film.

## Growing the library
See maintenance.md: `add-reference`, `feedback`, `library-report`. New parts get new ids (never rename an id, because
history refers to it). Add clash and affinity pairs whenever a combination is proven bad or good on a real job.
