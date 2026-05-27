#!/usr/bin/env node

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { execFile, execSync } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const extractScriptPath = path.join(repoRoot, '.claude', 'skills_bak', 'extract-article', 'scripts', 'extract_html.py');
const deepLearningRoot = path.join(repoRoot, 'public', 'docs', 'learn-ai', 'deep-learning');
const metaPath = path.join(deepLearningRoot, '_meta.json');
const defaultSummaryPath = path.join(os.homedir(), 'Downloads', 'test-book', 'SUMMARY.md');
const siteBaseUrl = 'https://www.rethink.fun';

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${token}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function parseSummaryEntries(summaryContent) {
  const entries = summaryContent
    .split('\n')
    .map((line) => line.match(/^\s*-\s+\[(.+?)\]\((.+?\.md)\)\s*$/))
    .filter(Boolean)
    .map((match) => ({
      title: match[1].trim(),
      sourcePath: match[2].trim()
    }))
    .filter((entry) => entry.sourcePath !== 'README.md' && entry.sourcePath !== 'AFTER.md');

  const deduped = [];
  const pathToIndex = new Map();

  for (const entry of entries) {
    const existingIndex = pathToIndex.get(entry.sourcePath);

    if (existingIndex !== undefined) {
      deduped[existingIndex] = entry;
      continue;
    }

    pathToIndex.set(entry.sourcePath, deduped.length);
    deduped.push(entry);
  }

  return deduped;
}

function flattenMetaItems(meta) {
  return meta.sections
    .flatMap((section) => section.items)
    .filter((item) => !item.file.endsWith('/AFTER.md'))
    .map((item) => ({
      title: item.title,
      file: item.file
    }));
}

function encodeUrlPath(markdownPath) {
  const htmlPath = markdownPath.replace(/\.md$/i, '.html');
  return htmlPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function buildSourceUrl(markdownPath) {
  if (markdownPath === 'README.md') {
    return `${siteBaseUrl}/`;
  }

  return `${siteBaseUrl}/${encodeUrlPath(markdownPath)}`;
}

// Rewrite upstream rethink.fun image refs to jsDelivr URLs pointing at
// beatai-assets. Images must already exist in beatai-assets at
// learn-ai/deep-learning/imgs/<filename> — this script does NOT download
// new images. If upstream adds new image files, they need to be pushed to
// beatai-assets before sync, or the rewritten URLs will 404 on jsDelivr.
function replaceImageUrls(markdown, assetsRepoSha) {
  const cdnBase = `https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets@${assetsRepoSha}/learn-ai/deep-learning/imgs`;
  return markdown.replace(/!\[([^\]]*)\]\((https?:\/\/(?:www\.)?rethink\.fun\/imgs\/([^)\s]+))\)/g, (_, alt, _url, filename) => {
    return `![${alt}](${cdnBase}/${filename})`;
  });
}

function normalizeLocalPaths(markdown) {
  return markdown.replace(/E:\\[^"'\n]*/g, (match) => {
    const prefix = 'E:\\电子书\\RethinkFun深度学习\\';
    const rel = match.startsWith(prefix) ? match.slice(prefix.length) : match;
    return './' + rel.replace(/\\/g, '/');
  });
}

function cleanExtractedMarkdown(markdown, assetsRepoSha) {
  return normalizeLocalPaths(replaceImageUrls(markdown, assetsRepoSha))
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

async function fetchPageMarkdown(url) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'deep-learning-page-'));
  const htmlPath = path.join(tempDir, 'page.html');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    await fs.writeFile(htmlPath, html, 'utf8');

    const { stdout } = await execFileAsync('python3', [extractScriptPath, htmlPath], {
      cwd: repoRoot,
      maxBuffer: 16 * 1024 * 1024
    });

    return stdout;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

// Query the current HEAD SHA of beatai-assets main branch so synced md
// pins images to that immutable commit (matches the publish pipeline's
// behavior). Pinning to @main directly would risk a 12h jsDelivr cache
// stale window if a sync follows soon after an upstream image change.
function getCurrentAssetsRepoSha() {
  const out = execSync(
    'git ls-remote https://github.com/beatai-org/beatai-assets.git refs/heads/main',
    { encoding: 'utf8' }
  ).trim();
  const sha = out.split(/\s+/)[0];
  if (!/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`Could not parse SHA from ls-remote output: ${out}`);
  }
  return sha;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const summaryPath = path.resolve(args.summary || defaultSummaryPath);
  const offset = Number.parseInt(args.offset || '0', 10);
  const limit = Number.parseInt(args.limit || '0', 10);
  const summaryContent = await fs.readFile(summaryPath, 'utf8');
  const summaryEntries = parseSummaryEntries(summaryContent);
  const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
  const metaItems = flattenMetaItems(meta);

  if (summaryEntries.length !== metaItems.length) {
    throw new Error(`Entry count mismatch: summary=${summaryEntries.length}, meta=${metaItems.length}`);
  }

  const assetsRepoSha = getCurrentAssetsRepoSha();
  console.log(`beatai-assets HEAD = ${assetsRepoSha.slice(0, 12)} — synced md will pin images to this SHA.`);

  const endExclusive = limit > 0 ? Math.min(offset + limit, metaItems.length) : metaItems.length;

  for (let index = offset; index < endExclusive; index += 1) {
    const metaItem = metaItems[index];
    const summaryEntry = summaryEntries[index];

    if (metaItem.title.trim() !== summaryEntry.title.trim()) {
      throw new Error(`Title mismatch at index ${index}: meta="${metaItem.title}", summary="${summaryEntry.title}"`);
    }

    const sourceUrl = buildSourceUrl(summaryEntry.sourcePath);
    const extractedMarkdown = await fetchPageMarkdown(sourceUrl);
    const cleanedMarkdown = cleanExtractedMarkdown(extractedMarkdown, assetsRepoSha);
    const absoluteTargetPath = path.join(repoRoot, 'public', metaItem.file.replace(/^\//, ''));

    await fs.writeFile(absoluteTargetPath, cleanedMarkdown, 'utf8');
    console.log(`Synced ${metaItem.file} <- ${sourceUrl}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
