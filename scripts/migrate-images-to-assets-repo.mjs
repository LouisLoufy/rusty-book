#!/usr/bin/env node

// One-shot importer: walk `public/docs/` for image files and push them into
// the assets repos configured in src/config/assetsRepos.json, then update
// src/config/assetsPin.json. Originally used to seed beatai-assets in S2; kept
// around for future one-time backfills (e.g. introducing a new route to a
// new repo, then bulk-staging matching files into it).

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

import {
  ASSETS_ROOT,
  getAssetsRepos,
  publishToAssetsRepo,
  repoConfig,
  routeForDocsPath,
  writePin,
} from './lib/assets-repo.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DOCS_DIR = path.join(REPO_ROOT, 'public', 'docs');

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;

function walkImageFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
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
    const route = routeForDocsPath(docsPath);
    if (!route) continue;
    const destInRepo = docsPath.slice(ASSETS_ROOT.length);
    const list = byRepo.get(route.repo) || [];
    list.push({ srcAbs: absSrc, destInRepo });
    byRepo.set(route.repo, list);
  }
  return byRepo;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has('--yes');

  // Probe config early so misconfig errors before any side effects.
  getAssetsRepos();

  const byRepo = planMigration();
  if (byRepo.size === 0) {
    console.log(chalk.yellow('No routable image files found under public/docs/.'));
    return;
  }

  let totalBytes = 0;
  console.log(chalk.bold('Migration plan:'));
  for (const [repoKey, files] of byRepo) {
    const repo = repoConfig(repoKey);
    const bytes = files.reduce((sum, f) => sum + fs.statSync(f.srcAbs).size, 0);
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

  for (const [repoKey, files] of byRepo) {
    console.log(chalk.cyan(`\n[${repoKey}] staging ${files.length} files ...`));
    const sha = publishToAssetsRepo(
      repoKey,
      files,
      `Import ${files.length} images from beatai main repo`
    );
    writePin(repoKey, sha);
    console.log(chalk.green(`[${repoKey}] HEAD = ${sha}`));
  }

  console.log(chalk.green('\nDone. Review with: git diff src/config/assetsPin.json'));
}

main();
