#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const changelogPath = path.join(repoRoot, 'CHANGELOG.md');

function printHelp() {
  console.log(`
Usage:
  node scripts/update-changelog.mjs --version <version> --message <message> [--date <YYYY-MM-DD>]

Example:
  node scripts/update-changelog.mjs --version 0.11.1 --message "Refine docs navigation" --date 2026-03-20
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

    if (key === 'help') {
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

function buildReleaseEntry({ version, date, message }) {
  return `## [${version}] - ${date}

- ${message}

`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  assertRequired(args.version, 'version');
  assertRequired(args.message, 'message');

  const date = args.date || new Date().toISOString().slice(0, 10);
  const versionHeader = `## [${args.version}]`;
  const unreleasedHeader = '## [Unreleased]';
  const releaseEntry = buildReleaseEntry({
    version: args.version,
    date,
    message: args.message
  });

  const current = await fs.readFile(changelogPath, 'utf8');

  if (current.includes(versionHeader)) {
    throw new Error(`CHANGELOG already contains ${versionHeader}`);
  }

  if (!current.includes(unreleasedHeader)) {
    throw new Error(`CHANGELOG is missing ${unreleasedHeader}`);
  }

  const updated = current.includes(`${unreleasedHeader}\n\n`)
    ? current.replace(
      `${unreleasedHeader}\n\n`,
      `${unreleasedHeader}\n\n${releaseEntry}`
    )
    : current.replace(
      `${unreleasedHeader}\n`,
      `${unreleasedHeader}\n\n${releaseEntry}`
    );

  await fs.writeFile(changelogPath, updated, 'utf8');
  console.log(`Updated CHANGELOG.md for v${args.version}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
