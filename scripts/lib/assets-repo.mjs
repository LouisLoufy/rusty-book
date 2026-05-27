// Shared helper for publishing files into one of the configured
// beatai-assets repos and keeping src/config/assetsPin.json in lock-step.
//
// Used by:
//   - .claude/skills/material-pipeline/scripts/publish.js (per-publish)
//   - scripts/migrate-images-to-assets-repo.mjs (one-shot backfills)
//
// Config:
//   - src/config/assetsRepos.json defines { repos, routes }; route.match is a
//     /docs/<prefix>, route.repo is a key into repos
//   - src/config/assetsPin.json maps repoKey → commit SHA (or null)

import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

// All routable assets live under /docs/. Kept in sync with the runtime
// rewriter at src/utils/contentAssetCdn.js.
export const ASSETS_ROOT = '/docs/';

const CONFIG_PATH = path.join(REPO_ROOT, 'src/config/assetsRepos.json');
const PIN_PATH = path.join(REPO_ROOT, 'src/config/assetsPin.json');
const CACHE_ROOT = path.join(os.homedir(), '.cache', 'beatai-assets');

let assetsReposCache = null;

export function getAssetsRepos() {
  if (assetsReposCache) return assetsReposCache;
  assetsReposCache = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  return assetsReposCache;
}

export function routeForDocsPath(docsPath) {
  const cfg = getAssetsRepos();
  for (const route of cfg.routes || []) {
    if (route.match && docsPath.startsWith(route.match)) return route;
  }
  return null;
}

export function repoConfig(repoKey) {
  const cfg = getAssetsRepos();
  const repo = cfg.repos?.[repoKey];
  if (!repo) throw new Error(`Unknown assets repo key: ${repoKey}`);
  return repo;
}

function git(args, opts = {}) {
  execFileSync('git', args, { stdio: 'inherit', ...opts });
}

function gitTry(args, opts = {}) {
  try {
    execFileSync('git', args, { stdio: 'pipe', ...opts });
    return true;
  } catch {
    return false;
  }
}

function gitCapture(args, opts = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts
  }).trim();
}

// Get a ready-to-use working tree for the given repo. First call clones into a
// stable cache dir; subsequent calls fetch + hard-reset to origin/main so the
// caller starts from latest upstream. Empty remotes get an orphan main branch.
export function getRepoWorkdir(repoKey) {
  const repo = repoConfig(repoKey);
  const remote = `https://github.com/${repo.owner}/${repo.name}.git`;
  const workdir = path.join(CACHE_ROOT, `${repo.owner}__${repo.name}`);

  if (!fs.existsSync(path.join(workdir, '.git'))) {
    fs.ensureDirSync(CACHE_ROOT);
    fs.removeSync(workdir);
    git(['clone', remote, workdir]);
    // 100MB+ HTTPS pushes routinely fail with "RPC failed; HTTP 400" on
    // GitHub's default postBuffer.
    git(['-C', workdir, 'config', 'http.postBuffer', '524288000']);
    if (!gitTry(['-C', workdir, 'rev-parse', '--verify', 'HEAD'])) {
      git(['-C', workdir, 'checkout', '-b', 'main']);
    }
    return workdir;
  }

  // Existing clone — reset to latest origin/main, drop any stale staging
  if (gitTry(['-C', workdir, 'fetch', 'origin', 'main'])) {
    git(['-C', workdir, 'reset', '--hard', 'origin/main']);
    git(['-C', workdir, 'clean', '-fdx']);
  }
  return workdir;
}

// Stage files into the repo workdir at their target paths (relative to repo
// root), commit, push, and return the resulting HEAD SHA. If staging produces
// no diff the existing HEAD is returned unchanged.
//
// stageList: [{ srcAbs: '/.../foo.webp', destInRepo: 'ai-insights/2026-.../foo.webp' }]
export function publishToAssetsRepo(repoKey, stageList, commitMessage) {
  if (!Array.isArray(stageList) || stageList.length === 0) {
    throw new Error('publishToAssetsRepo: stageList is empty');
  }
  const workdir = getRepoWorkdir(repoKey);

  for (const { srcAbs, destInRepo } of stageList) {
    if (!srcAbs || !destInRepo) {
      throw new Error(`publishToAssetsRepo: invalid stage entry ${JSON.stringify({ srcAbs, destInRepo })}`);
    }
    const dest = path.join(workdir, destInRepo);
    fs.ensureDirSync(path.dirname(dest));
    fs.copyFileSync(srcAbs, dest);
  }

  git(['-C', workdir, 'add', '.']);
  const status = gitCapture(['-C', workdir, 'status', '--porcelain']);
  if (!status) {
    return gitCapture(['-C', workdir, 'rev-parse', 'HEAD']);
  }

  git(['-C', workdir, 'commit', '-m', commitMessage]);
  git(['-C', workdir, 'push', 'origin', 'main']);
  return gitCapture(['-C', workdir, 'rev-parse', 'HEAD']);
}

export function readPin() {
  return JSON.parse(fs.readFileSync(PIN_PATH, 'utf8'));
}

export function writePin(repoKey, sha) {
  const pin = readPin();
  pin[repoKey] = sha;
  fs.writeFileSync(PIN_PATH, JSON.stringify(pin, null, 2) + '\n');
}

// Walk a directory and yield every file (recursive). Returns absolute paths.
export function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(full);
    }
  })(dir);
  return out;
}
