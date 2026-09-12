import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_REGISTRY_PATH = path.resolve(__dirname, '../../workflows/registry.json');
const LOCAL_WORKFLOWS_DIR = path.resolve(__dirname, '../../workflows');
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/harikrishna8121999/antigravity-workflows/main';

/**
 * Loads the workflow registry from local bundle first, falling back to remote.
 */
export async function getRegistry() {
  if (existsSync(LOCAL_REGISTRY_PATH)) {
    try {
      const data = await fs.readFile(LOCAL_REGISTRY_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (_) {}
  }

  const res = await fetch(`${GITHUB_RAW_URL}/workflows/registry.json`);
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.statusText}`);
  return await res.json();
}

/**
 * Loads the workflow markdown content from local bundle first, falling back to remote.
 */
export async function getWorkflowMarkdown(category, name) {
  const localFile = path.join(LOCAL_WORKFLOWS_DIR, category, `${name}.md`);
  if (existsSync(localFile)) {
    return await fs.readFile(localFile, 'utf-8');
  }

  const url = `${GITHUB_RAW_URL}/workflows/${category}/${name}.md`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${name}: ${res.statusText}`);
  return await res.text();
}
