#!/usr/bin/env node

// One-shot migration: rewrite every relative image reference in public/docs/**/*.md
// to a full jsDelivr URL pointing at the configured beatai-assets commit.
//
// After this migration, the runtime rewriter (src/utils/contentAssetCdn.js) is
// no longer needed — md files are self-contained.
//
// Handles:
//   - Body markdown: ![alt](./relpath)  and  ![alt](../relpath)
//   - Frontmatter:    cover: ./relpath
//
// Skips:
//   - rust-course/** (already uses upstream jsDelivr URLs)
//   - References starting with http(s):// (external URLs)
//   - .mdx files (separate concern)
//
// Usage:
//   node scripts/rewrite-md-images-to-jsdelivr.mjs            # dry-run
//   node scripts/rewrite-md-images-to-jsdelivr.mjs --yes      # write changes
//   node scripts/rewrite-md-images-to-jsdelivr.mjs --sha <X>  # override pinned SHA

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DOCS = path.join(REPO_ROOT, 'public', 'docs');

const args = process.argv.slice(2);
const APPLY = args.includes('--yes');
const shaIdx = args.indexOf('--sha');
const SHA = shaIdx >= 0 ? args[shaIdx + 1] : 'd636560ddb58a0d75173d1977cf7a323f1319997';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets@${SHA}`;

const SKIP_DIRS = new Set(['rust-course']);
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;

// Matches ![alt](./path) or ![alt](../path) — the path must start with ./ or ../
const BODY_IMG_RE = /(!\[[^\]]*\]\()(\.{1,2}\/[^)\s]+)(\))/g;

// Matches a frontmatter line: cover: ./path  (or with quotes)
const FRONTMATTER_COVER_RE = /^(cover:\s*)("?)(\.{1,2}\/[^"\s]+)("?)$/m;

function resolveCdnUrl(mdAbsPath, relPath) {
  const imgAbs = path.resolve(path.dirname(mdAbsPath), relPath);
  if (!imgAbs.startsWith(PUBLIC_DOCS + path.sep)) {
    return { ok: false, reason: 'resolves outside public/docs/' };
  }
  if (!IMAGE_EXT_RE.test(imgAbs)) {
    return { ok: false, reason: 'not a recognised image extension' };
  }
  const relFromDocs = path.relative(PUBLIC_DOCS, imgAbs).split(path.sep).join('/');
  return { ok: true, url: `${CDN_BASE}/${relFromDocs}` };
}

function rewriteContent(mdAbsPath, content) {
  let edits = 0;
  let warnings = [];

  content = content.replace(BODY_IMG_RE, (match, prefix, relPath, suffix) => {
    const r = resolveCdnUrl(mdAbsPath, relPath);
    if (!r.ok) {
      warnings.push(`body: ${relPath} → ${r.reason}`);
      return match;
    }
    edits++;
    return `${prefix}${r.url}${suffix}`;
  });

  content = content.replace(FRONTMATTER_COVER_RE, (match, prefix, q1, relPath, q2) => {
    const r = resolveCdnUrl(mdAbsPath, relPath);
    if (!r.ok) {
      warnings.push(`cover: ${relPath} → ${r.reason}`);
      return match;
    }
    edits++;
    return `${prefix}${q1}${r.url}${q2}`;
  });

  return { content, edits, warnings };
}

function* walkMd(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walkMd(path.join(dir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield path.join(dir, entry.name);
    }
  }
}

let totalFiles = 0;
let touchedFiles = 0;
let totalEdits = 0;
const allWarnings = [];

for (const md of walkMd(PUBLIC_DOCS)) {
  totalFiles++;
  const original = fs.readFileSync(md, 'utf8');
  const { content: rewritten, edits, warnings } = rewriteContent(md, original);
  for (const w of warnings) {
    allWarnings.push(`  ${path.relative(REPO_ROOT, md)} :: ${w}`);
  }
  if (edits > 0) {
    touchedFiles++;
    totalEdits += edits;
    if (APPLY) {
      fs.writeFileSync(md, rewritten);
    }
  }
}

console.log(`SHA:           ${SHA}`);
console.log(`Scanned:       ${totalFiles} .md files`);
console.log(`Would change:  ${touchedFiles} files, ${totalEdits} edits`);
if (allWarnings.length) {
  console.log(`Warnings (${allWarnings.length}):`);
  for (const w of allWarnings) console.log(w);
}
if (!APPLY) {
  console.log(`\nDry-run. Pass --yes to write changes.`);
}
