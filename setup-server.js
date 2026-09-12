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

/** GET /workflow-content — return raw markdown content for preview */
function handleWorkflowContent(req, res, url) {
  const name = url.searchParams.get('name');
  const category = url.searchParams.get('category');
  const registry = readRegistry();

  let cat = category;
  if (!cat && name && registry.workflows[name]) {
    cat = registry.workflows[name].category;
  }

  if (!name || !cat) {
    return json(res, 400, { error: 'Missing name or category parameter' });
  }

  const filePath = path.join(__dirname, 'workflows', cat, `${name}.md`);
  if (!fs.existsSync(filePath)) {
    return json(res, 404, { error: `Workflow file not found: ${cat}/${name}.md` });
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    cors(res);
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(content);
  } catch (err) {
    json(res, 500, { error: err.message });
  }
}

/** POST /install — directly install selected workflows into target directory */
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
    send('log', `📁 Target directory: ${targetDir || '(current workspace)'}`);
    send('log', '');

    try {
      const baseTarget = targetDir ? path.resolve(targetDir) : process.cwd();
      const agentsWorkflows = path.join(baseTarget, '.agents', 'workflows');
      const agentWorkflows = path.join(baseTarget, '.agent', 'workflows');
      fs.mkdirSync(agentsWorkflows, { recursive: true });
      fs.mkdirSync(agentWorkflows, { recursive: true });

      const registry = readRegistry();
      let installedCount = 0;

      send('log', `▶ Installing directly from local workflow bundle...`);
      send('log', '─'.repeat(50));

      for (const name of workflows) {
        const wf = registry.workflows[name];
        if (!wf) {
          send('log', `⚠️ Workflow "${name}" not found in registry, skipping.`);
          continue;
        }

        const sourceFile = path.join(__dirname, 'workflows', wf.category, `${name}.md`);
        if (!fs.existsSync(sourceFile)) {
          send('log', `❌ Source file not found: workflows/${wf.category}/${name}.md`);
          continue;
        }

        const content = fs.readFileSync(sourceFile, 'utf-8');
        fs.writeFileSync(path.join(agentsWorkflows, `${name}.md`), content, 'utf-8');
        fs.writeFileSync(path.join(agentWorkflows, `${name}.md`), content, 'utf-8');
        installedCount++;
        send('log', `  ✔ Installed: ${name} (${wf.category}) — ${wf.description}`);
      }

      send('log', '─'.repeat(50));
      send('log', `✅ Installation complete! ${installedCount} workflow(s) written to disk.`);
      send('log', `📍 Destination: ${agentsWorkflows}`);
      send('log', `💡 In Antigravity or Cursor, type /${workflows[0] || 'workflow-name'} to execute!`);
      send('done', { code: 0, workflows, installedCount });
      res.end();
    } catch (err) {
      send('log', `❌ Installation error: ${err.message}`);
      send('done', { code: 1, error: err.message });
      res.end();
    }
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
  if (req.method === 'GET' && url.pathname === '/workflow-content') {
    return handleWorkflowContent(req, res, url);
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
