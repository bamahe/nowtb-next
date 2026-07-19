/**
 * clean-wp-artifacts.mjs
 *
 * One-time script to permanently strip WordPress artifacts from content JSON files.
 * Mirrors what cleanWpContent() does at runtime, but writes the result back to disk
 * so the server never has to do it again.
 *
 * Run: node scripts/clean-wp-artifacts.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');

// Files to clean and the field(s) that hold HTML content
const TARGETS = [
  { file: 'pages-content.json', field: 'content' },
  { file: 'posts-export.json', field: 'content' },
  { file: 'market-updates-export.json', field: 'content' },
  { file: 'guides-content.json', field: 'content' },
];

// ─── Cleaning Rules ────────────────────────────────────────

function cleanContent(html) {
  if (!html) return html;
  let s = html;

  // 1. Strip <style>...</style> blocks (the biggest win — 14 MB of dead CSS)
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');

  // 2. Strip WordPress HTML comments: <!-- wp:html -->, <!-- /wp:paragraph -->, etc.
  s = s.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Strip known shortcodes
  s = s.replace(/\[showcaseidx[^\]]*\]/gi, '');
  s = s.replace(/\[nowtb_[^\]]*\]/gi, '');
  s = s.replace(/\[last_updated\]/gi, '');
  s = s.replace(/\[idx-listings[^\]]*\]/gi, '');
  s = s.replace(/\[showcaseidx_search[^\]]*\]/gi, '');

  // 4. Fix absolute WP image URLs → relative
  s = s.replace(/https?:\/\/nowtb\.com\/wp-content\/uploads\//gi, '/wp-content/uploads/');

  // 5. Remove WP theme-fighting inline styles (font-size, color, line-height with !important)
  //    These are the "Type A" junk styles that only existed to override WP theme CSS.
  //    Keep functional styles (background, display, padding, grid, etc.) for CTA boxes.
  s = s.replace(/font-family:[^;"]*!important;?\s*/gi, '');

  // 6. Strip max-width and margin:auto from inline styles (forces WP-era width constraints)
  s = s.replace(/max-width:\s*\d+px\s*!important;?\s*/gi, '');
  s = s.replace(/margin:\s*\d+px\s+auto\s*!important;?\s*/gi, '');

  // 7. Remove empty style attributes left after cleaning
  s = s.replace(/\s*style="\s*"/gi, '');

  // 8. Remove wp-block-* classes (no Tailwind equivalent, just noise in DOM)
  s = s.replace(/\s*class="wp-block-[^"]*"/gi, '');
  // Also clean wp-block classes when mixed with other classes
  s = s.replace(/wp-block-\w+\s*/g, '');

  // 9. Remove .entry-content and .single-post classes (WP theme selectors)
  s = s.replace(/\s*class="entry-content[^"]*"/gi, '');

  // 10. Collapse multiple blank lines / whitespace runs
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/^\s+$/gm, '');

  return s.trim();
}

// ─── Main ──────────────────────────────────────────────────

let totalSaved = 0;

for (const target of TARGETS) {
  const filePath = path.join(DATA_DIR, target.file);

  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${target.file} (not found)`);
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const sizeBefore = Buffer.byteLength(raw);
  const data = JSON.parse(raw);

  let cleaned = 0;
  for (const item of data) {
    const content = item[target.field];
    if (!content) continue;

    const cleanedContent = cleanContent(content);
    if (cleanedContent !== content) {
      item[target.field] = cleanedContent;
      cleaned++;
    }
  }

  const output = JSON.stringify(data);
  const sizeAfter = Buffer.byteLength(output);
  const saved = sizeBefore - sizeAfter;
  totalSaved += saved;

  fs.writeFileSync(filePath, output);

  console.log(`  ${target.file}:`);
  console.log(`    ${cleaned}/${data.length} items cleaned`);
  console.log(`    ${(sizeBefore / 1024 / 1024).toFixed(1)} MB → ${(sizeAfter / 1024 / 1024).toFixed(1)} MB (saved ${(saved / 1024 / 1024).toFixed(1)} MB)`);
}

console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
