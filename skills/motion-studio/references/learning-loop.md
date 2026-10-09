# The learning loop — how this skill gets smarter with every project (and never dumber)

Three files do the remembering:
- `history/debriefs/<date>-<client>-<film>.md` — the owner's answers after each film (template below). Never edited
  later; it's the record to revert back to.
- `history/locked.md` — decisions the owner has **locked in**. A locked rule overrides every other file in this skill
  (except the Non-negotiables in SKILL.md). Only the owner can unlock one.
- `references/lessons-learned.md` — the numbered lessons Claude writes from the debriefs.

## After every delivered film (always — part of "done") — feedback by exception (locked L7)
The owner tells Claude what he does NOT like. Approval or silence = the skill is working; keep everything.
Do NOT send the debrief questionnaire. At most, name your own one weakest moment honestly (so he can veto it).
1. Save the owner's words verbatim to a new debrief file, with the film path, recipe and versions — including praise
   (what he names as favourite becomes the brand file's "loved" list and the style card's signature moves).
2. When he approves a film, add what it proved to the skill: a style card / template if it is a new look, the brand
   file, new slot parts, and lessons.
3. For each answer that names a change: make it (in the film or the skill), then ask **"Lock this in?"**
   - Yes → add it to `history/locked.md` (date, rule, why, the film it came from) and to the relevant card/reference.
   - No → record it only as a lesson ("tried, owner unsure").
4. Commit + push, so the record exists outside this session.

## Debrief questions (ONLY if the owner asks for a structured review — not by default, see L7)
```
1. Score 1–10, and the one moment you'd show a client first?
2. The one moment you'd cut or change?
3. Colours: right / too dull / too loud? (which scene)
4. Pace: right / too fast / too slow? (which scene or line)
5. Voice (if any): right / too fast / too slow / wrong tone? (which line)
6. Sound: right / too busy / too empty?
7. Did it feel like OUR work or like a copy of a reference?
8. Anything I did that you want as a permanent rule? (I'll ask "lock in?")
9. Anything I did that you never want again?
10. What did the client say? (fill in later if not yet)
```

## Guardrails — so the system only gets smarter
- **Evidence wins over memory.** A rule backed by an approved film (owner said yes) beats a rule from research or
  a guess. If research contradicts an approved film, keep the film's rule and note the research.
- **Never delete a lesson; supersede it.** Write "Superseded by #N" next to the old one, so the reasoning stays.
- **No silent changes.** Every change to SKILL.md, a card or `slots.yaml` goes in the commit message with the
  debrief it came from.
- **Locked rules are only changed by the owner**, never by Claude, a client or a reference.
- **One project ≠ a rule.** A single client's taste goes into their brand file; it becomes a general rule only after
  the owner locks it or it repeats across two clients.
- Before each new film: read `history/locked.md`, then lessons-learned, then the brand file. Quote the locked rules
  that apply in the creative brief.
