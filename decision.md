# 08 Architectural Decision Log — Antigravity Workflows Autopilot

## Decision 1: Build 3 Zero-API-Key AI Engines
- **Date**: 2026-09-12
- **Choice**: Implement local static analysis AST tokenizers and heuristic rules in `src/ai/engines.js`.
- **Reason**: Users require smart stack auto-detection and self-healing without requiring API key signups or fees.

## Decision 2: Zero-Dependency Fallback for Terminal CLI
- **Date**: 2026-09-12
- **Choice**: Add built-in argument parser and interactive fallback menu in `bin/cli.js` when external modules like `commander` or `chalk` are missing.
- **Reason**: Ensures 100% crash-free operation even in raw npx environments without pre-installed node_modules.

## Decision 3: Automated GitHub Monthly Releases & Zip Packaging
- **Date**: 2026-09-12
- **Choice**: Add `.github/workflows/release.yml` and `scripts/bundle.js`.
- **Reason**: Automatically builds downloadable standalone `.zip` release bundles on GitHub for non-technical human users.
