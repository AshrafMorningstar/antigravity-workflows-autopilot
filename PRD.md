# 01 Product Requirements Document (PRD) — Antigravity Workflows Autopilot

## 1. Problem Statement
Developers using Google Antigravity, Cursor AI, and agentic AI coding assistants often struggle with setting up prompt workflows manually, executing complex commands, configuring workspace directories, or choosing the right workflow for their specific tech stack. Existing tools can be overly complicated or require external API keys, manual folder creation, and cryptic command-line flags.

## 2. Target Users
- Developers & Engineers looking for 1-click workflow automation for Google Antigravity.
- Beginners, non-technical creators, and users (down to a 7-year-old child) needing simple visual or terminal launchers.
- Open-source maintainers requiring stack auto-detection and offline AI workflow recommendations without external API fees.

## 3. Product Vision
Antigravity Workflows Autopilot is the ultimate zero-config, zero-API-key 1-click GUI & terminal automation suite for Antigravity AI coding assistants. It automatically detects project stacks, recommends optimal workflows, self-heals broken project environments, and installs workflows seamlessly across `.agents/workflows/` and `.agent/workflows/`.

## 4. Core Features
- **1-Click GUI Studio (`setup-server.js` + `setup.html`)**: Dark-mode visual dashboard with category filtering, real-time live installation logging, workflow content previews, and target directory selection.
- **Child-Friendly Interactive CLI (`bin/cli.js`)**: Simple arrow/number menu launcher with color-coded badges and instant zero-config setup.
- **3 Zero-API-Key Built-In AI Engines (`src/ai/engines.js`)**:
  1. *Stack Auto-Detector AI*: Scans files (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.) to detect technology stacks.
  2. *Workflow Recommender AI*: Suggests the exact set of workflows matching the codebase.
  3. *Self-Healing & Error Diagnostic AI*: Detects missing folders, broken configs, missing dependencies, or port conflicts and auto-repairs them.
- **Multi-Platform 1-Click Installers**: `start-setup.bat`, `setup.bat`, `install.bat`, `install.ps1`, `install.sh`, and `scripts/install-all.js`.
- **Automated GitHub Release & Packaging System**: GitHub Actions workflow for monthly tagged releases (`release.yml`), bundling standalone `.zip` artifacts (`scripts/bundle.js`) for human downloads.
- **Copyright & License Protection**: Copyright system and automated scanner (`scripts/check-copyright.js`) enforcing Apache-2.0 notice headers.

## 5. App Flow Summary
1. User runs `start-setup.bat` (GUI) or `npx antigravity-workflows` / `install.bat` (Terminal).
2. The system checks Node environment, auto-installs missing dependencies if needed, and launches the interface.
3. Built-in AI auto-detects the project stack and recommends workflows.
4. With 1 click or keypress, selected workflows are written into `.agents/workflows/` and `.agent/workflows/`.
5. User invokes commands (`/new-feature`, `/unit-test`, `/ai-agent`, etc.) directly inside Antigravity or Cursor.

## 6. Success Metrics
- 100% successful zero-error installation rate on clean systems.
- Zero external API key dependencies.
- Sub-second stack detection and workflow installation.

## 7. Out of Scope
- Paid cloud API subscriptions (strictly free and local).
- Proprietary closed-source binaries.
