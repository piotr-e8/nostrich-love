#!/usr/bin/env node
/**
 * Fails if any internal link in the built site points at a page that was not
 * emitted.
 *
 * This exists because /guides/<slug>/ 404'd in production for months: the
 * English guides lived only under /en/, and ~98 in-content and in-component
 * links pointed at the un-prefixed path. Nothing caught it — the build was
 * green the whole time.
 *
 * Caveat worth knowing: this only sees links present in the emitted HTML.
 * Links that a React island builds at runtime are invisible here, which is
 * exactly how 14 quiz components kept pointing at /en/guides/ after the rest
 * was fixed. Keep such paths going through src/i18n/paths.ts, which is unit
 * tested.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('..', import.meta.url)), 'dist');

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(2);
}

function htmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const exists = (href) => {
  const path = href.split('#')[0].split('?')[0];
  if (!path.startsWith('/')) return true;
  const rel = path.replace(/^\/+/, '');
  if (rel === '') return true;
  const candidates = [
    join(DIST, rel),
    join(DIST, rel, 'index.html'),
    join(DIST, `${rel.replace(/\/$/, '')}.html`),
    join(DIST, rel.replace(/\/$/, ''), 'index.html'),
  ];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
};

const SKIP = /^(\/\/|\/_astro|\/pagefind)/;
const broken = new Map();
const pages = htmlFiles(DIST);

for (const page of pages) {
  const html = readFileSync(page, 'utf-8');
  for (const match of new Set(html.match(/href="\/[^"#][^"]*"/g) ?? [])) {
    const href = match.slice(6, -1);
    if (SKIP.test(href) || exists(href)) continue;
    if (!broken.has(href)) broken.set(href, new Set());
    broken.get(href).add(page.slice(DIST.length + 1));
  }
}

console.log(`checked ${pages.length} pages`);

if (broken.size === 0) {
  console.log('no broken internal links');
  process.exit(0);
}

console.error(`\n${broken.size} broken internal link target(s):\n`);
for (const [href, sources] of [...broken].sort((a, b) => b[1].size - a[1].size)) {
  const list = [...sources];
  const shown = list.slice(0, 3).join(', ');
  const more = list.length > 3 ? ` (+${list.length - 3} more)` : '';
  console.error(`  ${href}\n      on ${list.length} page(s): ${shown}${more}`);
}
process.exit(1);
