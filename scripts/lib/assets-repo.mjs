// Helper for pushing files to the beatai-assets repo and baking
// jsDelivr URLs into freshly-published markdown.
//
// Used by:
//   - .claude/skills/material-pipeline/scripts/publish.js (per-publish)
//
// All site markdown stores absolute jsDelivr URLs directly — there is no
// runtime rewriter. Publish.js calls publishToAssetsRepo() to push images,
// gets back the new SHA, then calls bakeMdImagesToCdn() to rewrite the
// staged markdown's relative image refs into self-contained jsDelivr URLs
// pinned at that SHA before copying the md into the main repo.

import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single assets repo. To add another, refactor this constant into a
// resolver keyed by some routing rule (e.g. book name) and thread the
// key through publishToAssetsRepo + bakeMdImagesToCdn.
export const PRIMARY_REPO = { owner: 'beatai-org', name: 'beatai-assets' };

const CDN_BASE = `https://cdn.jsdelivr.net/gh/${PRIMARY_REPO.owner}/${PRIMARY_REPO.name}`;
const CACHE_ROOT = path.join(os.homedir(), '.cache', 'beatai-assets');
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;

// Body markdown: ![alt](./relpath) or ![alt](../relpath)
const BODY_IMG_RE = /(!\[[^\]]*\]\()(\.{1,2}\/[^)\s]+)(\))/g;
// Frontmatter: cover: ./relpath  (optionally quoted)
const FRONTMATTER_COVER_RE = /^(cover:\s*)("?)(\.{1,2}\/[^"\s]+)("?)$/m;

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

// Get a ready-to-use working tree. First call clones into a stable cache
// dir; subsequent calls fetch + hard-reset to origin/main so the caller
// starts from latest upstream. Empty remotes get an orphan main branch.
export function getRepoWorkdir() {
  const remote = `https://github.com/${PRIMARY_REPO.owner}/${PRIMARY_REPO.name}.git`;
  const workdir = path.join(CACHE_ROOT, `${PRIMARY_REPO.owner}__${PRIMARY_REPO.name}`);

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

  if (gitTry(['-C', workdir, 'fetch', 'origin', 'main'])) {
    git(['-C', workdir, 'reset', '--hard', 'origin/main']);
    git(['-C', workdir, 'clean', '-fdx']);
  }
  return workdir;
}

// Stage files in the repo workdir at their target paths (relative to repo
// root), commit, push, and return the resulting HEAD SHA. If staging
// produces no diff the existing HEAD is returned unchanged.
//
// stageList: [{ srcAbs: '/.../foo.webp', destInRepo: 'ai-insights/2026-.../foo.webp' }]
export function publishToAssetsRepo(stageList, commitMessage) {
  if (!Array.isArray(stageList) || stageList.length === 0) {
    throw new Error('publishToAssetsRepo: stageList is empty');
  }
  const workdir = getRepoWorkdir();

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

// Walk a directory and yield every file (recursive). Absolute paths.
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

// Convert a relative image ref into its jsDelivr URL pinned at `sha`,
// based on where the md WILL live in the main repo and the publicDocs root.
// Returns null if the relative path resolves outside publicDocsRoot or to a
// non-image extension (caller should fall back to leaving the ref untouched).
export function cdnUrlFromRelPath(relPath, virtualMdPath, publicDocsRoot, sha) {
  const imgAbs = path.resolve(path.dirname(virtualMdPath), relPath);
  if (!imgAbs.startsWith(publicDocsRoot + path.sep)) return null;
  if (!IMAGE_EXT_RE.test(imgAbs)) return null;
  const relFromDocs = path.relative(publicDocsRoot, imgAbs).split(path.sep).join('/');
  return `${CDN_BASE}@${sha}/${relFromDocs}`;
}

// Rewrite every relative image ref (body + frontmatter cover) in `content`
// to its jsDelivr URL. virtualMdPath = where the md is going to live in the
// main repo (so relative paths resolve correctly). Returns the new content.
export function bakeMdImagesToCdn(content, virtualMdPath, publicDocsRoot, sha) {
  content = content.replace(BODY_IMG_RE, (match, prefix, relPath, suffix) => {
    const url = cdnUrlFromRelPath(relPath, virtualMdPath, publicDocsRoot, sha);
    return url ? `${prefix}${url}${suffix}` : match;
  });
  content = content.replace(FRONTMATTER_COVER_RE, (match, prefix, q1, relPath, q2) => {
    const url = cdnUrlFromRelPath(relPath, virtualMdPath, publicDocsRoot, sha);
    return url ? `${prefix}${q1}${url}${q2}` : match;
  });
  return content;
}
