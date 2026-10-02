# Maintenance commands

Run these when the user types them (or asks in plain words). Each one ends with a commit and push if the skill
lives in a repo.

## add-reference <video or link>
1. Save the file to the research folder (in the user's repo: `motion-studio/references/videos/refNN.ext`).
2. `python3 scripts/teardown.py <video> <out_dir>`, then look at `sheet.jpg`. If text reads sideways, re-run with
   `--rotate cw|ccw|180`.
3. Watch it frame by frame (cuts.jpg + strips across transitions). Write a Style Card in the exact schema
   (copy any card in `library/styles/`):
   name · source · vibe_axes · structure · pacing · camera · transitions · typography · colour · ui_treatment ·
   motion_feel · sound · signature_moves · do_not_copy · best_for · clashes_with.
   Use measured numbers (cuts, LUFS, palette); mark anything guessed.
4. **Cross-reference**: for every slot, either add the card id to the `from:` list of an existing part in
   `library/slots.yaml` (same technique), or add a NEW part (new id) if it's genuinely different. Add clash and
   affinity pairs it implies. Mark parts that need imagery or UI.
5. If the same ad appears twice (e.g. ref01/ref10), merge into one card and list both sources.
6. `python3 scripts/recipe.py --report` → confirm the card contributes parts and the combination count grew.
7. Show the user the card in plain words for approval before committing.

## add-brand <name>
1. Copy `brands/_template.md` → `brands/<slug>.md`.
2. Fill it from the intake answers and the brand bible (`scripts/extract_brand_pdf.py` for logo vectors, colours,
   fonts). Set `status: incomplete` and list what's missing under "To complete".
3. `locked: true` only if the client has a real brand system that must be followed.

## feedback <project id> "<what the client said>"
1. Add the quote and a verdict to that project in `history/projects.json` (`feedback`, `loved`, `rejected`).
2. Turn it into a rule:
   - a part that failed gets a clash pair or narrower axes;
   - a pair that worked gets an affinity;
   - a general lesson goes into `references/lessons-learned.md` as "what happened → why → do this instead".
3. Update the brand profile's History / do-not-repeat list.

## library-report
`python3 scripts/recipe.py --report` → cards, parts per slot, usage counts, never-used parts, clash-free combination
count. Suggest which references would fill the gaps (e.g. "no warm hype styles yet: a food or fitness reference would help").
