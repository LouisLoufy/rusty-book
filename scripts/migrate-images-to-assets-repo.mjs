#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DOCS_DIR = path.join(REPO_ROOT, 'public', 'docs');

// Keep in sync with src/utils/contentAssetCdn.js
const ASSETS_ROOT = '/docs/';
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;

const assetsRepos = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, 'src/config/assetsRepos.json'), 'utf8')
);
const pinPath = path.join(REPO_ROOT, 'src/config/assetsPin.json');

function findRoute(docsPath) {
  for (const route of assetsRepos.routes || []) {
    if (route.match && docsPath.startsWith(route.match)) return route;
  }
  return null;
}

function walkImageFiles(dir) {
  const out = [];
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && IMAGE_EXT_RE.test(entry.name)) out.push(full);
    }
  })(dir);
  return out;
}

function planMigration() {
  const byRepo = new Map();
  for (const absSrc of walkImageFiles(PUBLIC_DOCS_DIR)) {
    const relFromDocs = path.relative(PUBLIC_DOCS_DIR, absSrc).split(path.sep).join('/');
    const docsPath = `${ASSETS_ROOT}${relFromDocs}`;
    const route = findRoute(docsPath);
    if (!route) continue;
    const subpath = docsPath.slice(ASSETS_ROOT.length);
    const list = byRepo.get(route.repo) || [];
    list.push({ src: absSrc, destInRepo: subpath });
    byRepo.set(route.repo, list);
  }
  return byRepo;
}

function gitTry(args, opts = {}) {
  try {
    execFileSync('git', args, { stdio: 'pipe', ...opts });
    return true;
  } catch {
    return false;
  }
}

function git(args, opts = {}) {
  execFileSync('git', args, { stdio: 'inherit', ...opts });
}

function gitCapture(args, opts = {}) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
}

function pushToRepo(repoKey, files) {
  const repo = assetsRepos.repos[repoKey];
  if (!repo) throw new Error(`No repo config for ${repoKey}`);

  const remote = `https://github.com/${repo.owner}/${repo.name}.git`;
  const workdir = path.join(os.tmpdir(), `beatai-assets-${repoKey}-${Date.now()}`);
  console.log(chalk.cyan(`\n[${repoKey}] workdir: ${workdir}`));
  console.log(chalk.cyan(`[${repoKey}] cloning ${remote} ...`));

  git(['clone', remote, workdir]);

  // Raise the HTTPS push buffer for this clone — 100MB+ pushes routinely hit
  // GitHub's default-sized POST limit and fail with "RPC failed; HTTP 400".
  git(['-C', workdir, 'config', 'http.postBuffer', '524288000']);

  const isEmpty = !gitTry(['-C', workdir, 'rev-parse', '--verify', 'HEAD']);
  if (isEmpty) {
    console.log(chalk.gray(`[${repoKey}] empty remote, initializing main branch`));
    git(['-C', workdir, 'checkout', '-b', 'main']);
  }

  console.log(chalk.cyan(`[${repoKey}] copying ${files.length} files ...`));
  for (const { src, destInRepo } of files) {
    const dest = path.join(workdir, destInRepo);
    fs.ensureDirSync(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }

  git(['-C', workdir, 'add', '.']);
  const status = gitCapture(['-C', workdir, 'status', '--porcelain']);
  if (!status) {
    console.log(chalk.yellow(`[${repoKey}] nothing changed, skipping commit`));
  } else {
    git(['-C', workdir, 'commit', '-m', `Import ${files.length} images from beatai main repo`]);
    git(['-C', workdir, 'push', '-u', 'origin', 'main']);
  }

  const sha = gitCapture(['-C', workdir, 'rev-parse', 'HEAD']);
  console.log(chalk.green(`[${repoKey}] HEAD = ${sha}`));
  return sha;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has('--yes');

  const byRepo = planMigration();
  if (byRepo.size === 0) {
    console.log(chalk.yellow('No routable image files found under public/docs/.'));
    return;
  }

  let totalBytes = 0;
  console.log(chalk.bold('Migration plan:'));
  for (const [repoKey, files] of byRepo) {
    const repo = assetsRepos.repos[repoKey];
    const bytes = files.reduce((sum, f) => sum + fs.statSync(f.src).size, 0);
    totalBytes += bytes;
    console.log(
      `  ${chalk.cyan(repoKey.padEnd(10))} → ${repo.owner}/${repo.name}  ` +
      `${chalk.yellow(files.length.toString().padStart(4))} files  ` +
      `${chalk.gray((bytes / 1024 / 1024).toFixed(1) + ' MB')}`
    );
  }
  console.log(chalk.gray(`  total: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`));

  if (!apply) {
    console.log(chalk.yellow('\nDry run. Pass --yes to push and update assetsPin.json.'));
    return;
  }

  const pin = JSON.parse(fs.readFileSync(pinPath, 'utf8'));
  for (const [repoKey, files] of byRepo) {
    const sha = pushToRepo(repoKey, files);
    pin[repoKey] = sha;
  }
  fs.writeFileSync(pinPath, JSON.stringify(pin, null, 2) + '\n');
  console.log(chalk.green(`\nUpdated ${path.relative(REPO_ROOT, pinPath)}`));
  console.log(chalk.green('Done. Review with: git diff src/config/assetsPin.json'));
}

main();
