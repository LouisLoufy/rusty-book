#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'public', 'docs');
const rootMetaPath = path.join(docsRoot, '_meta.json');

function printHelp() {
  console.log(`
Usage:
  node scripts/register-markdown-book.mjs --id <book-id> --title <title> --description <description> [options]

Required:
  --id                 Markdown book id in kebab-case, for example ai-patterns
  --title              Book title shown in navigation
  --description        Short book description

Optional:
  --github-repo        Repository URL shown in the sidebar
  --repo-title         Repository label shown in the sidebar
  --section-title      First section title, default: Start Here
  --doc-slug           First document slug under the book, default: intro
  --doc-title          First document title, default: Introduction
  --doc-file           First markdown filename, default: <doc-slug>.md
  --dry-run            Print planned changes without writing files
  --help               Show this help message

Examples:
  npm run register-markdown-book -- --id ai-patterns --title "AI Patterns" --description "Agent patterns and field notes"
  npm run register-markdown-book -- --id compiler-notes --title "Compiler Notes" --description "Low-level notes" --github-repo https://github.com/acme/compiler-notes --section-title "Getting Started"
`.trim());
}

function toCamelCase(key) {
  return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const rawKey = token.slice(2);
    const key = toCamelCase(rawKey);

    if (key === 'dryRun' || key === 'help') {
      args[key] = true;
      continue;
    }

    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${rawKey}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function assertRequired(value, flagName) {
  if (!value?.trim()) {
    throw new Error(`Missing required argument: --${flagName}`);
  }
}

function validateBookId(bookId) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bookId)) {
    throw new Error('Book id must use kebab-case, for example ai-patterns');
  }
}

function validateRelativePath(value, label) {
  const normalized = path.posix.normalize(value);

  if (
    !value ||
    value.startsWith('/') ||
    normalized.startsWith('../') ||
    normalized === '..' ||
    normalized.includes('/../')
  ) {
    throw new Error(`${label} must stay within the book directory`);
  }
}

async function readJson(jsonPath) {
  const content = await fs.readFile(jsonPath, 'utf8');
  return JSON.parse(content);
}

async function writeJson(jsonPath, data) {
  await fs.writeFile(jsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function ensurePathDoesNotExist(targetPath, label) {
  try {
    await fs.access(targetPath);
    throw new Error(`${label} already exists: ${targetPath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

function buildBookFiles(options) {
  const {
    id,
    title,
    description,
    githubRepo = '',
    repoTitle = githubRepo ? 'Source Repository' : '',
    sectionTitle = 'Start Here',
    docSlug = 'intro',
    docTitle = 'Introduction',
    docFile = `${docSlug}.md`
  } = options;

  validateRelativePath(docSlug, 'doc-slug');
  validateRelativePath(docFile, 'doc-file');

  const normalizedDocSlug = docSlug.replace(/^\/+|\/+$/g, '');
  const docPath = `/${id}/${normalizedDocSlug}`;
  const docFilePath = `/docs/${id}/${docFile}`;

  const bookMeta = {
    id,
    title,
    description,
    githubRepo,
    repoTitle,
    sections: [
      {
        title: sectionTitle,
        path: docPath,
        file: docFilePath,
        items: [
          {
            title: docTitle,
            path: docPath,
            file: docFilePath,
            tags: []
          }
        ]
      }
    ]
  };

  const markdown = `---
title: ${docTitle}
description: ${description}
---

# ${docTitle}

TODO: Add content for ${title}.
`;

  return {
    manifestEntry: {
      id,
      title,
      description,
      metaFile: `/docs/${id}/_meta.json`
    },
    bookMeta,
    markdown,
    docFile,
    docPath
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  assertRequired(args.id, 'id');
  assertRequired(args.title, 'title');
  assertRequired(args.description, 'description');
  validateBookId(args.id);

  const manifest = await readJson(rootMetaPath);
  if (!Array.isArray(manifest.books)) {
    throw new Error(`Root manifest must contain a books array: ${rootMetaPath}`);
  }

  if (manifest.books.some((book) => book.id === args.id)) {
    throw new Error(`Book id already registered in root manifest: ${args.id}`);
  }

  const files = buildBookFiles(args);
  const bookDir = path.join(docsRoot, args.id);
  const bookMetaPath = path.join(bookDir, '_meta.json');
  const markdownPath = path.join(bookDir, files.docFile);

  await ensurePathDoesNotExist(bookDir, 'Book directory');
  await ensurePathDoesNotExist(bookMetaPath, 'Book meta file');
  await ensurePathDoesNotExist(markdownPath, 'Starter markdown file');

  if (args.dryRun) {
    console.log('Dry run only. Planned changes:\n');
    console.log(`- add manifest entry to ${path.relative(repoRoot, rootMetaPath)}`);
    console.log(`- create ${path.relative(repoRoot, bookMetaPath)}`);
    console.log(`- create ${path.relative(repoRoot, markdownPath)}`);
    console.log(`- first route: ${files.docPath}`);
    return;
  }

  manifest.books.push(files.manifestEntry);

  await fs.mkdir(bookDir, { recursive: true });
  await fs.mkdir(path.dirname(markdownPath), { recursive: true });
  await writeJson(rootMetaPath, manifest);
  await writeJson(bookMetaPath, files.bookMeta);
  await fs.writeFile(markdownPath, files.markdown, 'utf8');

  console.log(`Registered Markdown book: ${args.id}`);
  console.log(`- root manifest: ${path.relative(repoRoot, rootMetaPath)}`);
  console.log(`- book meta: ${path.relative(repoRoot, bookMetaPath)}`);
  console.log(`- starter doc: ${path.relative(repoRoot, markdownPath)}`);
  console.log(`- entry route: ${files.docPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
