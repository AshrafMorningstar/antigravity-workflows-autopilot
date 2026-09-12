# 02 Technical Architecture Document — Antigravity Workflows Autopilot

## 1. Tech Stack
- **Runtime**: Node.js (v18+ compatible, native ESM modules).
- **GUI Server**: Built-in `http` Node server (`setup-server.js`) with Server-Sent Events (SSE) live streaming.
- **GUI Frontend**: Vanilla HTML5, HSL Hued Dark Mode CSS, Vanilla JavaScript (`setup.html`).
- **CLI Framework**: Commander.js + Chalk + Ora with built-in native fallback if dependencies are missing (`bin/cli.js`).
- **Offline AI Engines**: AST & static analysis tokenizers, heuristic stack detection, local self-healing logic (`src/ai/engines.js`).
- **Packaging & CI/CD**: GitHub Actions (`.github/workflows/`), Zip bundling script (`scripts/bundle.js`).

## 2. Directory Structure
```
antigravity-workflows-autopilot/
├── .agent/                    ← Antigravity compatibility workflow directory
├── .agents/                   ← Primary agent workflow directory
├── .github/
│   └── workflows/
│       ├── ci.yml             ← CI test workflow
│       └── release.yml        ← Automated monthly release workflow
├── bin/
│   └── cli.js                 ← CLI entry point with interactive menu & fallback
├── src/
│   ├── ai/
│   │   └── engines.js         ← 3 Zero-API-Key AI Engines
│   ├── commands/
│   │   ├── ai.js              ← AI stack detector CLI command
│   │   ├── info.js            ← Workflow detail viewer
│   │   ├── install.js         ← Core workflow installer
│   │   ├── list.js            ← Workflow list viewer
│   │   └── search.js          ← Workflow search command
│   └── utils.js               ← Helper methods & registry reader
├── scripts/
│   ├── bundle.js              ← Creates standalone zip release artifacts
│   ├── check-copyright.js     ← Audits copyright headers
│   └── install-all.js         ← Direct Node 1-click batch installer
├── project-logs/              ← Project work journals & decision tracking
│   ├── work.md
│   ├── decision.md
│   ├── progress.md
│   └── extras.md
├── test/
│   ├── cli.test.js            ← CLI unit tests
│   └── server.test.js         ← Server unit tests
├── workflows/                 ← Master workflow library (50+ markdown templates)
│   ├── ai-tools/
│   ├── creative/
│   ├── database/
│   ├── debugging/
│   ├── deployment/
│   ├── development/
│   ├── documentation/
│   ├── git/
│   ├── security/
│   ├── testing/
│   └── registry.json
├── install.bat                ← Windows 1-click installer
├── setup.bat                  ← Interactive Windows batch launcher
├── install.ps1                ← PowerShell 1-click installer
├── install.sh                 ← Mac/Linux bash installer
├── start-setup.bat            ← Windows 1-click GUI server launcher
├── setup-server.js            ← Zero-dependency HTTP server with SSE
├── setup.html                 ← Dark-mode visual web dashboard
├── package.json               ← NPM metadata & scripts
├── LICENSE                    ← Apache-2.0 License
├── PRD.md                     ← Master Document 01
├── Architecture.md            ← Master Document 02
├── security.md                ← Master Document 03
├── design.md                  ← Master Document 04
├── phases.md                  ← Master Document 05
├── flow.md                    ← Master Document 06
├── rules.md                   ← Master Document 07
├── decision.md                ← Master Document 08
└── memory.md                  ← Master Document 09
```

## 3. Environment & Configuration
- Zero environment variables required for basic operation.
- Zero API keys required for AI features.
- Target folder configurable via GUI input or CLI `--target` flag.
