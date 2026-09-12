# 03 Security & Access Document — Antigravity Workflows Autopilot

## 1. Authentication & Security Boundaries
- **Zero API Keys**: No third-party API keys or sensitive external service credentials are used or stored.
- **Local Network Execution**: The GUI setup server listens exclusively on `127.0.0.1:3737` to prevent remote access from untrusted local network devices.
- **CORS Restricted**: Server-Sent Events and API endpoints restrict cross-origin requests.

## 2. Sensitive Information Audit Policy
- Automated repository audits ensure zero hardcoded passwords, tokens, API keys, private ssh keys, or sensitive developer credentials exist anywhere in source code or revision history.
- Run `node scripts/check-copyright.js` to verify integrity.

## 3. Data Isolation & File System Permissions
- Workflow files are written strictly to user-designated workspace directories (`.agents/workflows/` and `.agent/workflows/`).
- System root directories, hidden system files, and binary executables are never modified or overwritten.

## 4. Error Handling & Fail-Safe Defaults
- If a target directory is unwritable, the installer catches the permission error and displays a clear, actionable solution.
- If dependencies are missing, the CLI falls back to native Node.js standard library utilities automatically.
