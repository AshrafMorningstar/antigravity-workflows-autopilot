/**
 * setup-server.js
 * Antigravity Workflows — Fully Automatic Setup Server
 *
 * Run with:  node setup-server.js
 * Opens:    http://localhost:3737
 *
 * Zero extra npm installs required — uses only Node.js built-ins.
 */

import http from 'http';
import { execFile, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3737;
const REGISTRY_PATH = path.join(__dirname, 'workflows', 'registry.json');
const HTML_PATH = path.join(__dirname, 'setup.html');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readRegistry() {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { workflows: {}, categories: {} };
  }
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, statusCode, data) {
  cors(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

// ── Route handlers ────────────────────────────────────────────────────────────

/** GET /workflows — return the full registry */
function handleWorkflows(req, res) {
  const registry = readRegistry();
  json(res, 200, registry);
}

/** POST /install — install selected workflows into a target directory
 *  Body: { workflows: string[], targetDir: string }
 *  Streams SSE progress events back to the client.
 */
function handleInstall(req, res) {
  readBody(req).then(body => {
    const workflows = Array.isArray(body.workflows) ? body.workflows : [];
    const targetDir = (body.targetDir || '').trim();

    if (workflows.length === 0) {
      json(res, 400, { error: 'No workflows selected.' });
      return;
    }

    // Server-Sent Events for live streaming
    cors(res);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const send = (type, data) => {
      res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    };

    send('log', `🚀 Starting installation of ${workflows.length} workflow(s)...`);
    send('log', `📁 Target directory: ${targetDir || '(current directory)'}`);
    send('log', '');

    // Build npx command arguments
    const args = ['antigravity-workflows', 'install', ...workflows];
    const spawnOpts = {
      cwd: targetDir || __dirname,
      shell: true,
      env: { ...process.env },
    };

    send('log', `▶ Running: npx ${args.join(' ')}`);
    send('log', '─'.repeat(50));

    const child = spawn('npx', args, spawnOpts);

    child.stdout.on('data', chunk => {
      chunk.toString().split('\n').forEach(line => {
        if (line.trim()) send('log', line);
      });
    });

    child.stderr.on('data', chunk => {
      chunk.toString().split('\n').forEach(line => {
        if (line.trim()) send('log', `  ${line}`);
      });
    });

    child.on('close', code => {
      send('log', '─'.repeat(50));
      if (code === 0) {
        send('log', `✅ Installation complete! ${workflows.length} workflow(s) installed.`);
        send('log', `📍 Installed to: ${path.join(targetDir || __dirname, '.agents', 'workflows')}`);
        send('done', { code: 0, workflows });
      } else {
        send('log', `❌ Installation failed (exit code ${code}).`);
        send('log', '💡 Tip: Make sure Node.js and npx are installed and accessible.');
        send('done', { code, workflows });
      }
      res.end();
    });

    child.on('error', err => {
      send('log', `❌ Error: ${err.message}`);
      send('log', '💡 Is Node.js installed? Try: node --version');
      send('done', { code: 1, error: err.message });
      res.end();
    });
  });
}

/** GET / — serve the setup.html UI */
function handleRoot(req, res) {
  cors(res);
  try {
    const html = fs.readFileSync(HTML_PATH, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch {
    res.writeHead(500);
    res.end('setup.html not found. Make sure it is in the same directory as setup-server.js.');
  }
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/workflows') {
    return handleWorkflows(req, res);
  }
  if (req.method === 'POST' && url.pathname === '/install') {
    return handleInstall(req, res);
  }
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/setup.html')) {
    return handleRoot(req, res);
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  🚀  Antigravity Workflows — Setup Server           ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  🌐  Open in browser:  ${url}              ║`);
  console.log('║  🛑  Stop server:      Ctrl + C                      ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('\n');

  // Auto-open browser on Windows
  execFile('cmd', ['/c', `start ${url}`], { shell: false }, () => {});
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Open your browser and go to: http://localhost:${PORT}\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
