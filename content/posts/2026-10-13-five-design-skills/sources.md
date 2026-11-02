# Sources · Day 1 (checked 13 Oct 2026)

Every claim on the slides was checked against the primary source the same day. Listicles were used only as leads.

| Slide | Claim | Primary source | How it was checked |
|---|---|---|---|
| 2 | "samples from this high-probability center"; models "almost always conform to Inter fonts, purple gradients on white backgrounds, and minimal animations" | Anthropic, *Improving frontend design through Skills*, 12 Nov 2025: https://claude.com/blog/improving-frontend-design-through-skills | Page opened; quotes copied verbatim |
| 3 | frontend-design makes Claude plan palette/type/layout, then review the plan against generic defaults and revise before building | https://github.com/anthropics/claude-plugins-official (plugins/frontend-design/skills/frontend-design/SKILL.md, last commit 10 Oct 2026) | Repo cloned, SKILL.md read in full |
| 3 | `/plugin install frontend-design@claude-plugins-official` | same repo, README line 16 | Copied from README |
| 4 | 1 skill, 24 commands, 59 deterministic detector rules, no API key; `npx impeccable install` then `/impeccable init`; author Paul Bakaus | https://github.com/pbakaus/impeccable (README, package.json author; last commit 14 Oct 2026 UTC) | Repo cloned, README read |
| 5 | 79 searchable UI styles, 192 reasoning rules; marketplace + install commands | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (README badges + lines 258–259; last commit 12 Oct 2026) | Repo cloned, README read |
| 6 | Official GSAP skills incl. ScrollTrigger (pin, scrub), React, performance; every plugin free after Webflow's acquisition; `npx skills add https://github.com/greensock/gsap-skills` | https://github.com/greensock/gsap-skills (README, skills/gsap-scrolltrigger/SKILL.md; last commit 21 Apr 2026) | Repo cloned, README + skill read |
| 7 | webapp-testing uses Playwright, captures screenshots, reads browser logs; ships in `example-skills@anthropic-agent-skills` | https://github.com/anthropics/skills (skills/webapp-testing/SKILL.md, .claude-plugin/marketplace.json; last commit 9 Oct 2026) | Repo cloned, marketplace.json parsed |
| 8 | "All five are public repos, updated in 2026" | last-commit dates above | git log on each clone |

Leads used (not cited on slides): firecrawl.dev, snyk.io, designrevision.com, shiftpress.ai, chaseai.io listicles on Claude design skills.
Not used: install counts and star counts (could not be read from a primary source today; skills.sh did not resolve from this environment).

## Tags and marks (checked 13 Oct 2026)
| Item | Source |
|---|---|
| X @AnthropicAI | footer of https://www.anthropic.com |
| X @claudeai, Instagram @claudeai | footer of https://claude.com |
| X @pbakaus | https://github.com/pbakaus (profile link twitter.com/pbakaus) |
| Clawd (shape + #D77757) | welcome screen of the installed Claude Code CLI v2.1.296, captured in a terminal |
| Claude symbol (#D97757) | simple-icons 16.35.0, source https://claude.ai |
| Trademark rules | https://www.anthropic.com/legal/trademark-guidelines (effective 1 Aug 2024) |
Not tagged: GreenSock and Next Level Builder (no handle found on their own sites/repos from this environment).
