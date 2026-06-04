// Migrate externally-hotlinked images (zhihu/github/substack/medium/...) into
// the unified asset pipeline: download → push to beatai-assets → rewrite the
// referencing markdown (+ _meta.json) to jsDelivr URLs. The runtime proxy
// (src/utils/markdown.js → pic.gitlab.cx) then handles the display layer.
//
// Two phases, so dead links surface BEFORE anything irreversible happens:
//   node scripts/migrate-external-images.mjs            # download only, write manifest, report. NO push.
//   node scripts/migrate-external-images.mjs --apply    # read manifest, push to beatai-assets, rewrite files.
//       add --skip-failed to --apply to proceed while leaving dead links untouched in the md.
//
// Re-running the download phase is cheap: already-staged files (content-addressed
// by sha1 of the original URL) are skipped.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { publishToAssetsRepo } from './lib/assets-repo.mjs';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), '..');
const STAGING = path.join(os.tmpdir(), 'beatai-migrate', 'staging');
const MANIFEST = path.join(os.tmpdir(), 'beatai-migrate', 'manifest.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// Each book: which dir to scan, which extra non-md files to also scan+rewrite,
// and the subpath under beatai-assets to store migrated images at.
const BOOKS = [
  { name: 'rust-course', dir: 'public/docs/rust-course', extra: [], assetPrefix: 'rust-course/_external' },
  { name: 'ai-insights', dir: 'public/docs/ai-insights', extra: ['public/docs/ai-insights/_meta.json'], assetPrefix: 'ai-insights/_external' },
];

const IMG_HOST_OK = /^https?:\/\//i;
// Markdown image (strict: alt has no ']'), HTML <img src>, JSON "cover": "...".
// These catch extension-less image URLs (github user-attachments, avatars).
const MD_IMG_RE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const HTML_IMG_RE = /<img[^>]+src=["']([^"']+)["']/gi;
const JSON_COVER_RE = /"cover"\s*:\s*"([^"]+)"/g;
// Bare image URLs (own line, or alt text containing ']' that defeats MD_IMG_RE).
// Extension-anchored, so it never matches .html/.rs navigational links.
const BARE_IMG_RE = /https?:\/\/[^\s)"'<>\]]+\.(?:png|jpe?g|gif|webp|svg|avif)/gi;

function isExternal(url) {
  return IMG_HOST_OK.test(url) && !url.includes('beatai-org/beatai-assets');
}

// github.com/<o>/<r>/blob/<ref>/<path>[?raw=true] → raw.githubusercontent.com/<o>/<r>/<ref>/<path>
function normalizeForDownload(url) {
  const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+?)(\?raw=true)?$/i);
  if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}`;
  return url;
}

function extFromUrl(url) {
  const clean = url.split('?')[0].split('#')[0];
  const m = clean.match(/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i);
  return m ? `.${m[1].toLowerCase().replace('jpeg', 'jpg')}` : '';
}

function extFromContentType(ct) {
  if (!ct) return '';
  const map = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg', 'image/avif': '.avif', 'image/bmp': '.bmp', 'image/x-icon': '.ico' };
  return map[ct.split(';')[0].trim().toLowerCase()] || '';
}

function hash16(s) {
  return crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);
}

function walkMd(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(full));
    else if (e.isFile() && /\.mdx?$/.test(e.name)) out.push(full);
  }
  return out;
}

// Collect distinct external URLs across a book, with the files referencing each.
function collect() {
  const byUrl = new Map(); // url -> { url, book, assetPrefix, files:Set }
  for (const book of BOOKS) {
    const files = [...walkMd(path.join(REPO_ROOT, book.dir)),
                   ...book.extra.map((p) => path.join(REPO_ROOT, p))].filter(fs.existsSync);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      for (const re of [MD_IMG_RE, HTML_IMG_RE, JSON_COVER_RE, BARE_IMG_RE]) {
        re.lastIndex = 0;
        let mm;
        while ((mm = re.exec(text))) {
          const url = mm[1] || mm[0];
          if (!isExternal(url)) continue;
          if (!byUrl.has(url)) byUrl.set(url, { url, book: book.name, assetPrefix: book.assetPrefix, files: new Set() });
          byUrl.get(url).files.add(file);
        }
      }
    }
  }
  return [...byUrl.values()];
}

function download(entry) {
  const dl = normalizeForDownload(entry.url);
  let ext = extFromUrl(entry.url) || extFromUrl(dl);
  // tentative dest (may fix ext after content-type sniff)
  const base = hash16(entry.url);
  const tmpOut = path.join(STAGING, entry.assetPrefix, `${base}.bin`);
  fs.mkdirSync(path.dirname(tmpOut), { recursive: true });
  let ct = '';
  try {
    ct = execFileSync('curl', ['-L', '--fail', '-sS', '--max-time', '40', '-A', UA,
      '-e', 'https://www.zhihu.com/', '-o', tmpOut, '-w', '%{content_type}', dl],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return { ...entry, status: 'failed', reason: (err.stderr || err.message || 'curl error').toString().split('\n')[0].slice(0, 160), downloadUrl: dl };
  }
  const size = fs.existsSync(tmpOut) ? fs.statSync(tmpOut).size : 0;
  if (size === 0) return { ...entry, status: 'failed', reason: 'empty body', downloadUrl: dl };
  if (!ext) ext = extFromContentType(ct);
  if (!ext) return { ...entry, status: 'failed', reason: `unknown image type (content-type=${ct || 'none'})`, downloadUrl: dl };
  if (!/^image\//i.test(ct) && ext !== '.svg') {
    // content-type not an image and not an svg page → suspicious
    return { ...entry, status: 'failed', reason: `non-image content-type=${ct}`, downloadUrl: dl };
  }
  const finalRel = `${entry.assetPrefix}/${base}${ext}`;
  const finalAbs = path.join(STAGING, finalRel);
  if (finalAbs !== tmpOut) { fs.mkdirSync(path.dirname(finalAbs), { recursive: true }); fs.renameSync(tmpOut, finalAbs); }
  return { ...entry, status: 'ok', destInRepo: finalRel, localPath: finalAbs, ext, size, contentType: ct, downloadUrl: dl };
}

function phaseDownload() {
  const entries = collect();
  console.log(`\n📋 待迁移外链：${entries.length} 个（去重后）\n`);
  const results = [];
  let okN = 0, failN = 0;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    // skip re-download if a staged file for this hash already exists
    const subdir = path.join(STAGING, e.assetPrefix);
    const existing = fs.existsSync(subdir) ? fs.readdirSync(subdir, { withFileTypes: true }).filter(d => d.isFile() && d.name.startsWith(hash16(e.url) + '.')).map(d => d.name) : [];
    let r;
    if (existing.length) {
      const ext = path.extname(existing[0]);
      const finalRel = `${e.assetPrefix}/${hash16(e.url)}${ext}`;
      r = { ...e, status: 'ok', destInRepo: finalRel, localPath: path.join(STAGING, finalRel), ext, size: fs.statSync(path.join(STAGING, finalRel)).size, contentType: '(cached)', downloadUrl: normalizeForDownload(e.url) };
    } else {
      r = download(e);
    }
    results.push(r);
    if (r.status === 'ok') { okN++; process.stdout.write(`  ✓ [${i + 1}/${entries.length}] ${e.book}  ${path.basename(r.destInRepo)}  ${(r.size / 1024).toFixed(0)}K\n`); }
    else { failN++; process.stdout.write(`  ✗ [${i + 1}/${entries.length}] ${e.book}  ${e.url}\n        ↳ ${r.reason}\n`); }
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    staging: STAGING,
    entries: results.map((r) => ({ ...r, files: [...r.files] })),
  };
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 下载汇总：✓ ${okN}  /  ✗ ${failN}   （manifest: ${MANIFEST}）`);
  if (failN) {
    console.log(`\n⚠ 以下 ${failN} 个下载失败（死链/防盗链/超时），需你决定如何处理：`);
    for (const r of results.filter(x => x.status === 'failed')) {
      console.log(`   - ${r.url}\n       ↳ ${r.reason}\n       ↳ 引用文件: ${[...r.files].map(f => path.relative(REPO_ROOT, f)).join(', ')}`);
    }
    console.log(`\n下一步：决定后跑  node scripts/migrate-external-images.mjs --apply [--skip-failed]`);
  } else {
    console.log(`\n✓ 全部下载成功，无死链。可直接跑  node scripts/migrate-external-images.mjs --apply`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  return { okN, failN };
}

function phaseApply({ skipFailed }) {
  if (!fs.existsSync(MANIFEST)) throw new Error(`manifest 不存在，先跑下载阶段：${MANIFEST}`);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const ok = manifest.entries.filter((e) => e.status === 'ok');
  const failed = manifest.entries.filter((e) => e.status !== 'ok');
  if (failed.length && !skipFailed) {
    console.error(`\n✗ 仍有 ${failed.length} 个死链未解决。加 --skip-failed 跳过它们（保留原 URL），或先修好再 --apply。`);
    for (const f of failed) console.error(`   - ${f.url}  (${f.reason})`);
    process.exit(1);
  }
  if (!ok.length) { console.log('没有可推送的图片。'); return; }

  // 1) push to beatai-assets
  const stageList = ok.map((e) => ({ srcAbs: e.localPath, destInRepo: e.destInRepo }));
  console.log(`\n▶ 推送 ${stageList.length} 张图到 beatai-assets ...`);
  const sha = publishToAssetsRepo(stageList, `Migrate external images into pipeline (${stageList.length} files: rust-course + ai-insights)`);
  console.log(`✓ beatai-assets @ ${sha}`);

  // 2) rewrite referencing files (literal replace; URLs are unique long strings)
  const CDN = 'https://cdn.jsdelivr.net/gh/beatai-org/beatai-assets';
  const fileEdits = new Map(); // absPath -> content
  for (const e of ok) {
    const target = `${CDN}@${sha}/${e.destInRepo}`;
    for (const file of e.files) {
      if (!fileEdits.has(file)) fileEdits.set(file, fs.readFileSync(file, 'utf8'));
      fileEdits.set(file, fileEdits.get(file).split(e.url).join(target));
    }
  }
  let replacedFiles = 0;
  for (const [file, content] of fileEdits) {
    const before = fs.readFileSync(file, 'utf8');
    if (before !== content) { fs.writeFileSync(file, content); replacedFiles++; console.log(`  ✎ ${path.relative(REPO_ROOT, file)}`); }
  }
  console.log(`\n✓ 改写完成：${ok.length} 个 URL → jsDelivr@${sha.slice(0, 10)}，触及 ${replacedFiles} 个文件`);
  if (failed.length) console.log(`· 跳过 ${failed.length} 个死链（原 URL 保留不动）`);
}

const args = process.argv.slice(2);
if (args.includes('--apply')) phaseApply({ skipFailed: args.includes('--skip-failed') });
else phaseDownload();
