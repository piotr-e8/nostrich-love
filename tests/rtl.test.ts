import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * RTL ratchet.
 *
 * The site serves 7 locales and Arabic renders with <html dir="rtl">
 * (src/config/locales.ts). Mirroring is CSS-level, not markup-level: the ar
 * build emits the SAME class names as the en build, and Tailwind 3.4's native
 * logical utilities (ms-/me-/ps-/pe-/start-/end-/text-start/text-end/border-s/
 * border-e/rounded-s/rounded-e) resolve to margin-inline-start,
 * inset-inline-end, text-align:start, ... which the browser flips off `dir`.
 *
 * Measured 2026-07-30, after deleting the 8 /nostr-for-* audience pages: 2
 * mirrorable sites remain and 96 sites / 178 tokens of deliberately-physical
 * utilities. (Was 117/199 on 2026-07-29; the audience pages carried 17 sites
 * of decorative blur-blob offsets, and 4 more had already gone stale.)
 *
 * These tests don't demand perfection — they demand the physical-utility
 * surface NEVER GROWS. When you migrate something, lower the baseline in the
 * same commit so the ratchet holds at the new level.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const SOURCE_EXT = /\.(astro|tsx|ts|jsx|js|mdx|md)$/;

function sourceFiles(dir = SRC, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (SOURCE_EXT.test(entry)) out.push(p);
  }
  return out;
}

type Site = { at: string; tokens: string[]; line: string };

function scan(groups: Record<string, RegExp>): Site[] {
  const sites: Site[] = [];
  for (const file of sourceFiles()) {
    const rel = file.slice(SRC.length + 1);
    readFileSync(file, 'utf-8')
      .split('\n')
      .forEach((line, i) => {
        const tokens: string[] = [];
        for (const re of Object.values(groups)) {
          re.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = re.exec(line)) !== null) tokens.push(m[0]);
        }
        if (tokens.length) sites.push({ at: `${rel}:${i + 1}`, tokens, line: line.trim() });
      });
  }
  return sites;
}

// --- Group 1: physical utilities that HAVE an exact logical replacement -------
// Every one of these is a defect unless it is on the allowlist below, because
// Tailwind 3.4 ships a drop-in logical equivalent: ml-→ms-, mr-→me-, pl-→ps-,
// pr-→pe-, text-left→text-start, border-l→border-s, rounded-tl→rounded-ss,
// float-left→float-start, clear-left→clear-start, space-x-→gap-x-.
const MIRRORABLE: Record<string, RegExp> = {
  'ml-': /(?<![\w-])-?ml-(?:\[[^\]]+\]|[\w./]+)/g,
  'mr-': /(?<![\w-])-?mr-(?:\[[^\]]+\]|[\w./]+)/g,
  'pl-': /(?<![\w-])pl-(?:\[[^\]]+\]|[\w./]+)/g,
  'pr-': /(?<![\w-])pr-(?:\[[^\]]+\]|[\w./]+)/g,
  'text-left|text-right': /(?<![\w-])text-(?:left|right)(?![\w-])/g,
  'border-l|border-r': /(?<![\w-])border-[lr](?:-(?:\[[^\]]+\]|[\w./]+))?(?![\w-])/g,
  'rounded-l|rounded-r': /(?<![\w-])rounded-[lr](?:-(?:\[[^\]]+\]|[\w./]+))?(?![\w-])/g,
  'rounded-tl|tr|bl|br': /(?<![\w-])rounded-(?:tl|tr|bl|br)(?:-(?:\[[^\]]+\]|[\w./]+))?(?![\w-])/g,
  'float-left|float-right': /(?<![\w-])float-(?:left|right)(?![\w-])/g,
  'clear-left|clear-right': /(?<![\w-])clear-(?:left|right)(?![\w-])/g,
  'space-x-': /(?<![\w-])-?space-x-(?:\[[^\]]+\]|[\w./]+)(?![\w-])/g,
  'scroll-ml|mr|pl|pr': /(?<![\w-])-?scroll-(?:m|p)[lr]-(?:\[[^\]]+\]|[\w./]+)/g,
  'origin-left|origin-right|origin-corner':
    /(?<![\w-])origin-(?:left|right|top-left|top-right|bottom-left|bottom-right)(?![\w-])/g,
};

// Sites that are physical ON PURPOSE. Keyed by "path:line" — a line number
// shift is a deliberate tripwire: re-read the code and re-justify before you
// move the key. To REMOVE an entry, migrate the code to a logical utility.
const MIRRORABLE_ALLOWLIST: Record<string, string> = {
  // A rotate-45'd 2x2 square whose border-r + border-b draw a DOWNWARD-pointing
  // tooltip caret. The visible edges come from the rotation, not from reading
  // order, so border-s/border-e would put the caret on the wrong diagonal.
  'components/gamification/BadgeDisplay.tsx:227': 'rotate-45 caret built from physical borders — points down, not inline-end',
  'pages/badges.astro:200': 'rotate-45 caret built from physical borders — points down, not inline-end',
};

describe('mirrorable physical utilities (each has a logical drop-in)', () => {
  const sites = scan(MIRRORABLE);

  it(`no un-allowlisted site (allowlist holds ${Object.keys(MIRRORABLE_ALLOWLIST).length})`, () => {
    const unexpected = sites.filter((s) => !(s.at in MIRRORABLE_ALLOWLIST));
    expect(
      unexpected.map((s) => `${s.at} [${s.tokens.join(' ')}] ${s.line.slice(0, 120)}`),
      'These physical utilities have exact logical replacements in Tailwind 3.4 ' +
        '(ml-→ms-, mr-→me-, pl-→ps-, pr-→pe-, text-left→text-start, ' +
        'border-l→border-s, rounded-tl→rounded-ss, space-x-→gap-x-). Migrate them, ' +
        'or add the site to MIRRORABLE_ALLOWLIST with a one-line justification.'
    ).toEqual([]);
  });

  it('allowlist has no stale entries', () => {
    const live = new Set(sites.map((s) => s.at));
    const stale = Object.keys(MIRRORABLE_ALLOWLIST).filter((k) => !live.has(k));
    expect(
      stale,
      'These allowlist keys no longer point at a physical utility — the code moved ' +
        'or was migrated. Drop the entries (or re-key them to the new line).'
    ).toEqual([]);
  });
});

// --- Group 2: physical utilities with NO safe logical replacement -------------
// left-/right-/inset-x-/translate-x-/divide-x are legitimately physical in this
// codebase: the `left-1/2 + -translate-x-1/2` centering idiom, symmetric
// `left-0 right-0` full-bleed, decorative blur blobs, RelayWorldMap's
// geographic pins, and `divide-x + rtl:divide-x-reverse` (core Tailwind has no
// divide-s). They must not GROW unchecked, so the total is ratcheted.
const UNMIRRORABLE: Record<string, RegExp> = {
  'left-': /(?<![\w-])-?left-(?:\[[^\]]+\]|[\w./]+)/g,
  'right-': /(?<![\w-])-?right-(?:\[[^\]]+\]|[\w./]+)/g,
  'inset-x-': /(?<![\w-])-?inset-x-(?:\[[^\]]+\]|[\w./]+)/g,
  'translate-x-': /(?<![\w-])-?translate-x-(?:\[[^\]]+\]|[\w./]+)/g,
  'divide-x': /(?<![\w-])divide-x(?:-(?:\[[^\]]+\]|[\w./]+))?(?![\w-])/g,
};

// Baselines measured 2026-07-30. LOWER THEM, never raise: when you convert a
// `left-0 right-0` pair to `inset-x-0`, or delete a decorative blob, subtract
// the tokens you removed in the same commit. Raising a baseline means you added
// a physical direction utility — say why in the commit message.
const UNMIRRORABLE_SITES_BASELINE = 96;
const UNMIRRORABLE_TOKENS_BASELINE = 178;

describe('unmirrorable physical utilities (ratchet, must not grow)', () => {
  const sites = scan(UNMIRRORABLE);
  const tokens = sites.reduce((n, s) => n + s.tokens.length, 0);

  it(`site count <= ${UNMIRRORABLE_SITES_BASELINE}`, () => {
    expect(
      sites.length,
      `${sites.length} lines carry left-/right-/inset-x-/translate-x-/divide-x ` +
        `(baseline ${UNMIRRORABLE_SITES_BASELINE}). If the new one is a centering idiom ` +
        `(left-1/2 + -translate-x-1/2), a symmetric left-0/right-0 pair, or a map/decorative ` +
        `coordinate, raise the baseline deliberately. Otherwise use start-/end-/ms-/me-.`
    ).toBeLessThanOrEqual(UNMIRRORABLE_SITES_BASELINE);
  });

  it(`token count <= ${UNMIRRORABLE_TOKENS_BASELINE}`, () => {
    expect(tokens, `${tokens} tokens vs baseline ${UNMIRRORABLE_TOKENS_BASELINE}`).toBeLessThanOrEqual(
      UNMIRRORABLE_TOKENS_BASELINE
    );
  });
});

// --- Directional icons must mirror ------------------------------------------
// An inline <svg> whose path is a horizontal arrow or chevron reads "forward"
// / "back". In RTL forward is leftward, so it needs rtl:rotate-180. Vertical
// and diagonal glyphs (checkmarks, external-link, TrendingUp, a rotate-90'd
// arrow) must NOT be listed here — rotating them 180deg is a bug.
const HORIZONTAL_ARROW_PATHS = new Set([
  'M13 7l5 5m0 0l-5 5m5-5H6', // arrow-right
  'M9 5l7 7-7 7', // chevron-right
  'M15 19l-7-7 7-7', // chevron-left
  'M10 19l-7-7m0 0l7-7m-7 7h18', // arrow-left
  'M14 5l7 7m0 0l-7 7m7-7H3', // arrow-right (large)
  'M17 8l4 4m0 0l-4 4m4-4H3', // arrow-right (narrow)
  'M7 16l-4-4m0 0l4-4m-4 4h18', // arrow-left (narrow)
  'M11 19l-7-7 7-7m8 14l-7-7 7-7', // chevrons-left
  'M13 5l7 7-7 7M5 5l7 7-7 7', // chevrons-right
]);

describe('directional inline SVGs carry rtl:rotate-180', () => {
  it('every horizontal arrow/chevron mirrors in RTL', () => {
    const missing: string[] = [];
    for (const file of sourceFiles()) {
      if (!/\.(astro|tsx|mdx)$/.test(file)) continue;
      const src = readFileSync(file, 'utf-8');
      for (const m of src.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)) {
        const [, attrs, body] = m;
        const ds = [...body.matchAll(/d=["{]?["`]?([^"`}]+)/g)].map((x) => x[1].trim());
        if (!ds.some((d) => HORIZONTAL_ARROW_PATHS.has(d))) continue;
        if (/rtl:(-)?rotate-180|rtl:-scale-x/.test(attrs)) continue;
        const line = src.slice(0, m.index).split('\n').length;
        missing.push(`${file.slice(SRC.length + 1)}:${line}`);
      }
    }
    expect(
      missing,
      'A horizontal arrow/chevron points the wrong way in Arabic. Add rtl:rotate-180 ' +
        'to its className. If the glyph is not directional, it should not match ' +
        'HORIZONTAL_ARROW_PATHS — check the path data.'
    ).toEqual([]);
  });
});

// --- Guards on the assumptions the tests above rest on -----------------------

describe('RTL migration guards', () => {
  it('tailwindcss-rtl is not a tailwind plugin', () => {
    const cfg = readFileSync(join(ROOT, 'tailwind.config.js'), 'utf-8');
    const plugins = /plugins:\s*\[([^\]]*)\]/.exec(cfg)?.[1] ?? '';
    expect(
      plugins.includes('tailwindcss-rtl'),
      'tailwindcss-rtl targets Tailwind 1.x and emits `[dir="rtl"] .start-0 { right: 0 }` — ' +
        'specificity (0,2,0) beats core\'s (0,1,0), so a PHYSICAL property shadows every ' +
        'native logical one on any page with a dir attribute. Do not re-add it.'
    ).toBe(false);
  });

  it('tailwindcss-rtl is not a dependency', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    expect(Object.keys(deps)).not.toContain('tailwindcss-rtl');
  });

  it('ar is the only RTL locale (the premise of every check above)', () => {
    const cfg = readFileSync(join(ROOT, 'src/config/locales.ts'), 'utf-8');
    const rtl = [...cfg.matchAll(/(\w+):\s*\{[^}]*?direction:\s*'rtl'/g)].map((m) => m[1]);
    expect(rtl).toEqual(['ar']);
  });

  it('no corrupted logical class tokens', () => {
    const CORRUPTION: Record<string, RegExp> = {
      'doubled prefix (ms-ms-)': /(?<![\w-])-?(ms|me|ps|pe|start|end)-\1-/g,
      'two scale parts (ms-2-3)': /(?<![\w-])-?(ms|me|ps|pe|start|end)-\d+(\.\d+)?-\d/g,
      'glued token (ms-2absolute)': /(?<![\w-])-?(ms|me|ps|pe|start|end)-[\d.]+[a-z]{2,}/g,
      'stray text-start-/text-end-': /(?<![\w-])text-(start|end)-/g,
      'double rtl: prefix': /(?<![\w-])rtl:rtl:/g,
    };
    const hits: string[] = [];
    for (const file of sourceFiles()) {
      const src = readFileSync(file, 'utf-8');
      for (const [name, re] of Object.entries(CORRUPTION)) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) {
          const line = src.slice(0, m.index).split('\n').length;
          hits.push(`${file.slice(SRC.length + 1)}:${line} — ${name}: ${m[0]}`);
        }
      }
    }
    expect(hits, 'A class name was mangled during the physical→logical rewrite.').toEqual([]);
  });
});
