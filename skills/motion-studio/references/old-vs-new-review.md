# Review: the older playbook vs. what the later films proved

The older playbook was written around a single promo for one client. The later films (two brand films, one of them
founder-approved) taught more about story, pacing, camera and brand. Every rule from the older file was judged on
**evidence**: did it fix a real problem, and does it still hold for *any* SaaS brand? Verdicts are folded into SKILL.md.

| Older rule | Verdict | Reasoning |
|---|---|---|
| Voice is the master clock; land hits on the **stressed syllable** of the meaning word | **Keep, upgraded** | Same principle we used; syllable-level is more precise than word-level. Combined: offline word alignment finds the word, the loudness contour finds the syllable. |
| One timeline file read by picture and sound | **Keep** | Identical to what made re-timing to a new voice take a 10-minute job. |
| Never an empty frame; overlap shots; shared-element morphs | **Keep** | Agrees with the ElevenLabs principle; "fade to empty background" is the clearest cheap tell. |
| Musical UI sounds in the current chord; ≤ 3 whooshes per film | **Keep — it corrects our work** | It came from a real complaint ("the same sound over and over"). Our later films put a whoosh on most moves; nobody complained, but repetition is a known cheapness signal and costs nothing to avoid. |
| Duck music under the voice; master to −16 LUFS / TP −1.5 | **Keep — it corrects our work** | Our films were never loudness-normalised. −14 to −16 LUFS is standard for web/social; verified with `finish.sh`. |
| Grade in RGB with BT.709 tags; light grain | **Keep, optional strength** | Tags prevent colour shifts between players (real issue). Grain also hides banding in dark gradients — useful for dark-brand films. Keep subtle. |
| Text floor 24 px; contrast computed | **Keep, reworded** | Correct, but measured as **effective size = px × camera zoom**, because our films use big zooms. |
| "Fill the frame: cards 900–1320 px wide" | **Modify** | Right for UI-demo shots. Wrong as a universal rule: the approved brand films used small elements in large space and let the camera zoom do the work. Rule now: fill the frame *at the moment it's read*. |
| Off-white paper background with soft light, "never objects" | **Modify** | A light family that fits light brands. Brand bibles decide; a navy brand got the dark family (texture + grid + glow) and it was the approved one. Both families are now documented. |
| Easing curves + springs (OUT/IN/CAMERA/SWEEP) | **Keep for elements; override for camera** | Good element curves. But chaining a CAMERA bezier key-to-key causes the stop-start judder that was our #1 complaint → camera uses a monotone spline. |
| "Slow camera push-in, max ~4.5 %" | **Override** | Too timid for the requested ElevenLabs feel. Subtle pushes on holds, but big zoom-throughs/pull-backs are the signature. |
| Motion inventory: no repeated treatment across content types | **Keep** | Cheap, objective check; matches our "every object transforms into the next" lesson. |
| Send a storyboard + preview with sound early; status updates | **Keep** | Fits every client; our draft-before-voice step proved it (the draft was approved as-is). |
| "If told 'just start', don't ask questions" | **Merge** | Ask the intake in one message with defaults; if the user says "just start", take the defaults and say which. |
| Fix data contradictions; fictional data; no invented stats; no real third-party logos | **Keep** | Agrees with our claims-check lesson. |
| Copy gate: no em-dashes on screen; banned words (elevate, seamless, unleash, empower, leverage, robust, game-changer, cutting-edge) | **Keep as default** | These words read as generic AI copy and lower trust; clients can override. |
| Chat UI: brand's agent on the right, client on the left | **Keep** | Matches messaging-app convention, so it reads instantly. |
| Remotion as *the* engine | **Modify** | Best on a laptop (live preview, ecosystem). In cloud sessions the HTML/Playwright engine is proven. Both are documented. |
| Weak-laptop rendering (GPU flag, chunked resumable renders) | **Keep as troubleshooting** | Real fixes for real crashes; hardware-specific numbers kept as examples. |
| Specific font for one client, a regional compliance phrase, one client's names | **Generalise** | Client-specific. Kept only as examples of the rule behind them. |
| Vetted third-party skill list | **Keep, dated** | Useful starting list plus a vetting checklist; repos change, so it carries its vetting date. |
| "Load the `10k-websites` house-style skill" | **Optional** | External dependency; use it if installed. |

## What the later work adds that the older file lacked
Intake questions · brand-bible extraction (real logo vectors, never redraw) · logo-anatomy concepts · pain-first story
with callbacks · ElevenLabs pacing (pause between thoughts, hook word with held silence) · proven voice settings ·
monotone-spline camera with log zoom · zoom-through hidden cuts · object-becomes-object transitions · motion blur via
60→30 fps blend · offline alignment · pause insertion with time-warp · reference-clip analysis · pricing.
