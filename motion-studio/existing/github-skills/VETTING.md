# Vetting report (2026-10-02)

Rule: copy **knowledge only** (SKILL.md, reference markdown, licences). No hooks, MCP configs, settings, install
scripts or executable code are copied. Full clones live outside the repo at /home/user/<owner>/<repo> for reading.

| Repo | Licence | Found | Verdict |
|---|---|---|---|
| remotion-dev/skills | none file (official Remotion) | 12 SKILL.md; mentions ELEVENLABS / Google Maps keys in examples | Knowledge only ✔ |
| haidrrrry/claude-remotion-skill | MIT | clean | Knowledge only ✔ (springs, staggers, 5-layer finishing stack, render-inspect loop) |
| iart-ai/motion-design-skills | MIT | clean, 9 skills | Knowledge only ✔ |
| noamdorr/saas-product-demo-video | MIT | Gemini key in an optional step | Knowledge only ✔ |
| chandreshpv/remotion-product-videos-claude-skill | MIT | clean | Knowledge only ✔ |
| aariz51/promo-video | MIT | full app: runs CLIs (child_process), OpenAI/Anthropic/Groq/OpenRouter keys | Knowledge only ✔ — never run its code |
| GordenSun/react-bits-video | MIT | render script spawns ffmpeg | Knowledge only ✔ |
| Barty-Bart/motion-graphics (motion-broll) | MIT | engine spawns render | Knowledge only ✔ |
| DojoCodingLabs/remotion-superpowers | MIT | **hooks/hooks.json + .mcp.json (5 paid-API MCPs: ElevenLabs, KIE, Pexels, TwelveLabs…)**, setup script | Knowledge only ✔ — hooks/MCP excluded, do NOT install the plugin |
| codeverbojan/remotion-cinematic | MIT | `.claude/settings.json`, Anthropic key | Technique only (arc cursor, AutoZoom read as .txt) |
| Vincentwei1021/video-shotcraft | Apache-2.0 | 152 shot recipe cards; workbench runs vite | Knowledge only ✔ — big shot library |
| BayramAnnakov/remotion-video-director | none file | ElevenLabs key in docs | Knowledge only ✔ |
Not found under the old names: haidrrrry/remotion-motion-graphics (same author's repo above is the one).
