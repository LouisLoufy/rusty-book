#!/usr/bin/env node

// One-shot migration: push public/images/llc/best-practices/*.jpg to
// beatai-assets at llc/best-practices/<file>.jpg and rewrite
// public/docs/llc-content/zh/bp01.mdx to use jsDelivr URLs at the new SHA.
//
// After this script, public/images/llc/ can be git-rm'd and the local
// files referenced by bp01.mdx will instead resolve through jsDelivr.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  publishToAssetsRepo,
  walkFiles,
} from './lib/assets-repo.mjs';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..');
const SRC_DIR = path.join(REPO_ROOT, 'public/images/llc/best-practices');
const MDX_PATH = path.join(REPO_ROOT, 'public/docs/llc-content/zh/bp01.mdx');

const files = walkFiles(SRC_DIR);
if (files.length === 0) {
  console.error(`No files under ${SRC_DIR}`);
  process.exit(1);
}

const stageList = files.map((srcAbs) => ({
  srcAbs,
  destInRepo: `llc/best-practices/${path.basename(srcAbs)}`,
}));

console.log(`Pushing ${stageList.length} files to beatai-assets ...`);
const sha = publishToAssetsRepo(
  stageList,
  `Add llc-content best-practices images (${stageList.length} files)`
);
console.log(`SHA: ${sha}`);

const CDN_PREFIX = `https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets@${sha}/llc/best-practices/`;
const mdx = fs.readFileSync(MDX_PATH, 'utf8');
const updated = mdx.replace(/\/images\/llc\/best-practices\//g, CDN_PREFIX);
const before = (mdx.match(/\/images\/llc\/best-practices\//g) || []).length;
const after = (updated.match(/\/images\/llc\/best-practices\//g) || []).length;
console.log(`mdx: rewrote ${before - after} refs`);

fs.writeFileSync(MDX_PATH, updated);
console.log(`Wrote ${path.relative(REPO_ROOT, MDX_PATH)}`);
