// Usage:
//   node scripts/optimize-ai-insights-images.mjs --dry-run    # 仅估算，不动文件
//   node scripts/optimize-ai-insights-images.mjs              # 实际转码 + 改写 .md
//
// 一次性回收 public/docs/ai-insights/ 下历史文章的图片体积。新文章的压缩由
// material-pipeline 的 compress-images.js 负责（在 translate 之后、review 之前）。
//
// 实现：薄壳；调 scripts/lib/image-webp.mjs 完成转码 + md 改写。

import { join } from 'node:path';
import { compressTree, rewriteMdRefs, walkFiles, fmtMB, checkTools } from './lib/image-webp.mjs';

const ROOT = '/Users/sunfei/development/beatai';
const TARGET = join(ROOT, 'public/docs/ai-insights');

const DRY = process.argv.includes('--dry-run');

const tools = checkTools();
if (!tools.ok) {
  console.error('✗ 缺少必需工具:');
  for (const t of tools.missing) console.error(`   ${t}`);
  console.error('  请先 `brew install webp` 或设置 CWEBP_BIN / GIF2WEBP_BIN 环境变量。');
  process.exit(1);
}

console.log(`📋 target:    ${TARGET}`);
console.log(`📋 dry-run:   ${DRY ? 'yes' : 'no'}`);
console.log('');
console.log('▶ 转码');

const result = compressTree({ root: TARGET, dryRun: DRY, logRoot: ROOT });

console.log('');
console.log(`📊 总量:`);
console.log(`   scanned:    ${result.pngCount} png + ${result.gifCount} gif`);
console.log(`   converted:  ${result.converted}`);
console.log(`   failed:     ${result.failed}`);
console.log(`   ${DRY ? '估算' : '实际'}: ${fmtMB(result.totalBefore)} → ${DRY ? '≈' : ''}${fmtMB(result.totalAfter)} (省 ≈ ${fmtMB(result.totalBefore - result.totalAfter)}, ${result.totalBefore > 0 ? Math.round((1 - result.totalAfter / result.totalBefore) * 100) : 0}%)`);
if (result.failures.length > 0) {
  console.log('');
  console.log('⚠ 转码失败:');
  for (const f of result.failures) console.log(`   ${f.src}  →  ${f.error.split('\n')[0]}`);
}

if (DRY) {
  console.log('');
  console.log('--dry-run，未改任何文件，未改写 .md。');
  process.exit(0);
}

console.log('');
console.log('▶ 改写 .md 图片引用');
const mds = walkFiles(TARGET, ['.md']);
const mdResult = rewriteMdRefs({ mdFiles: mds });
console.log(`   .md touched:    ${mdResult.mdsTouched}`);
console.log(`   refs replaced:  ${mdResult.refsReplaced}`);
