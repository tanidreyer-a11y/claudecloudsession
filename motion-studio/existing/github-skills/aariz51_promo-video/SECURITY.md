# Security Policy

Please report vulnerabilities privately to the repository owner rather than opening a public issue. Include the affected route or component, reproduction steps, impact, and any suggested mitigation.

The open-source local build holds no project credentials: it requires no
OpenRouter, OpenAI or Anthropic key, and it authenticates model calls by running
your own Claude Code or Codex CLI, whose credentials it never reads or stores.
Projects, uploads and renders stay in the local `.launchlayer` directory.

Do not include real API keys, cookies, access tokens, signed storage URLs, user assets, or personal data in a report. The most sensitive boundaries are Supabase service-role access, public showcase allowlisting, workflow ownership checks, generated-file validation, and Sandbox command construction.
