# 07 Project Rules & AI Guardrails — Antigravity Workflows Autopilot

1. **Zero External API Dependency Constraint**: All AI stack auto-detection, workflow matching, self-healing, and installer features MUST run locally without requiring external API keys (OpenAI, Anthropic, Gemini API keys are never required).
2. **Stack-Agnostic Workflows**: Workflows in `workflows/` MUST remain stack-agnostic, using progressive disclosure and clear guidelines.
3. **Dual Directory Delivery**: When installing workflows, files MUST be written to both `.agents/workflows/` and `.agent/workflows/` for 100% compatibility across legacy and modern Antigravity / Cursor environments.
4. **Zero-Crash Terminal Execution**: CLI commands MUST provide native Node.js fallback logic so `npx antigravity-workflows` never crashes even if `node_modules` is absent.
5. **Copyright Preservation**: Source files must retain open-source copyright headers and license attribution.
