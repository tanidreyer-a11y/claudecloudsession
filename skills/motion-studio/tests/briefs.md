# Phase 3 — five test briefs (all companies fictional)

| # | Brief | Axes (E·W·D·R·P) | UI | Imagery | Format | Engine output |
|---|---|---|---|---|---|---|
| 1 | **Crumb & Co**, artisan bakery in Johannesburg (Parkhurst). Goal: Saturday pre-orders on WhatsApp. | 3·5·3·5·4 | no | yes (client photos + generated) | 9:16, 30 s Reels | runs/crumb-and-co.md |
| 2 | **Mokoena Attorneys**, commercial law firm, Sandton. Goal: LinkedIn trust film for CFOs. | 2·2·2·3·5 | no | yes (office/city stills) | 16:9, 45 s | runs/mokoena-attorneys.md |
| 3 | **Tally AI**, pre-launch AI bookkeeping agent (reconciles bank vs books). Goal: waitlist sign-ups. | 4·3·3·2·4 | yes | no | 9:16, 20 s Short | runs/tally-ai.md → **rendered** |
| 4 | **Iron Hour**, 45-minute strength gym, Cape Town. Goal: free first class bookings. | 5·4·4·4·3 | no | yes (members with consent / generated) | 9:16, 15 s | runs/iron-hour.md |
| 5 | **Kestrel Estates**, luxury property agent, Franschhoek. Goal: seller valuations. | 2·4·2·5·5 | no | yes (listings + landscape) | 16:9, 60 s | runs/kestrel-estates.md |

Each brief was run in order with history on (`MS_HISTORY=tests/runs/history.json`, seeded with the two real films),
recording recipe A each time, so later briefs were steered away from earlier picks. Re-run:
`MS_HISTORY=tests/runs/history.json python3 scripts/recipe.py --axes ... --ui ... --imagery ... --brand <slug>`.
