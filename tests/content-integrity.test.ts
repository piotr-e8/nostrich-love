import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Data-integrity checks.
 *
 * Every case here corresponds to a defect that reached production. They are
 * cheap, they run without a browser, and they fail loudly the moment content
 * and code drift apart again — which is how all four originally happened.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOCALES = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'] as const;
const GUIDES_DIR = join(ROOT, 'src/content/guides');
const LOCALES_DIR = join(ROOT, 'src/i18n/locales');

const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf-8'));
const loadLocale = (l: string) => readJson(join(LOCALES_DIR, `${l}.json`));

function walkSource(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'simulators' || entry.name === 'node_modules') continue;
      walkSource(full, out);
    } else if (/\.(ts|tsx|astro)$/.test(entry.name) && !entry.name.endsWith('.test.ts')) {
      out.push(full);
    }
  }
  return out;
}

/** Resolve a dotted key, honouring array indices the way i18n/index.ts does. */
function resolve(obj: unknown, key: string): unknown {
  let cur: any = obj;
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in cur) cur = cur[part];
    else return undefined;
  }
  return cur;
}

describe('guide content', () => {
  const slugsFor = (l: string) =>
    readdirSync(join(GUIDES_DIR, l))
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
      .sort();

  it('every locale has the same guide slugs as English', () => {
    const en = slugsFor('en');
    expect(en.length).toBeGreaterThan(0);
    for (const l of LOCALES) {
      expect({ locale: l, slugs: slugsFor(l) }).toEqual({ locale: l, slugs: en });
    }
  });

  it('no guide links to /en/, which only 301-redirects', () => {
    const offenders: string[] = [];
    for (const l of LOCALES) {
      for (const slug of slugsFor(l)) {
        const body = readFileSync(join(GUIDES_DIR, l, `${slug}.mdx`), 'utf-8');
        if (/\]\(\/en\/|href="\/en\//.test(body)) offenders.push(`${l}/${slug}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('non-English guides link to their own locale, not to English paths', () => {
    const offenders: string[] = [];
    for (const l of LOCALES.filter((x) => x !== 'en')) {
      for (const slug of slugsFor(l)) {
        const body = readFileSync(join(GUIDES_DIR, l, `${slug}.mdx`), 'utf-8');
        // an un-prefixed /guides/ link inside a translated guide sends the
        // reader back to English mid-article
        if (/\]\(\/guides\/|href="\/guides\//.test(body)) offenders.push(`${l}/${slug}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('nip05 guide correctness', () => {
  // The guide told readers to put an npub in nostr.json; the spec requires
  // lowercase hex, so every reader who followed it shipped a broken NIP-05.
  it('never shows an npub as a nostr.json value', () => {
    const offenders: string[] = [];
    for (const l of LOCALES) {
      const body = readFileSync(join(GUIDES_DIR, l, 'nip05-identity.mdx'), 'utf-8');
      if (/"[\w-]+"\s*:\s*"npub1/.test(body)) offenders.push(l);
    }
    expect(offenders).toEqual([]);
  });

  it('uses 64-character lowercase hex keys in its examples', () => {
    for (const l of LOCALES) {
      const body = readFileSync(join(GUIDES_DIR, l, 'nip05-identity.mdx'), 'utf-8');
      const values = [...body.matchAll(/"[\w-]+"\s*:\s*"([0-9a-fA-F]{20,})"/g)].map((m) => m[1]);
      expect(values.length).toBeGreaterThan(0);
      for (const v of values) expect(v).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});

describe('translation keys', () => {
  const en = loadLocale('en');

  it('every key referenced in source exists in en.json', () => {
    const call = /\b(?:t|getValue|translate)\(\s*['"]([A-Za-z0-9_][A-Za-z0-9_.]*)['"]/g;
    const missing = new Set<string>();
    for (const file of walkSource(join(ROOT, 'src'))) {
      const src = readFileSync(file, 'utf-8');
      for (const m of src.matchAll(call)) {
        if (resolve(en, m[1]) === undefined) missing.add(m[1]);
      }
    }
    // a missing key renders as the raw dotted string on screen
    expect([...missing].sort()).toEqual([]);
  });

  it('guide keys use the same casing in every locale', () => {
    // hi.json stored 13 guide blocks under kebab-case keys, so 12 of 16 guides
    // silently fell back to English
    const enGuides = Object.keys(en.guides ?? {}).sort();
    for (const l of LOCALES) {
      const theirs = Object.keys(loadLocale(l).guides ?? {});
      const kebab = theirs.filter((k) => k.includes('-') && enGuides.includes(k.replace(/-(\w)/g, (_, c) => c.toUpperCase())));
      expect({ locale: l, kebab }).toEqual({ locale: l, kebab: [] });
      expect({ locale: l, missing: enGuides.filter((k) => !theirs.includes(k)) })
        .toEqual({ locale: l, missing: [] });
    }
  });
});

describe('badge persistence', () => {
  // /badges read `unlockedAt`; both writers persist `earned`/`earnedAt`, so
  // every user saw "0 of N badges earned" forever.
  const read = (p: string) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf-8') : '');

  it('readers and writers agree on the persisted field names', () => {
    const writers = read('src/utils/gamification.ts') + read('src/utils/gamificationEngine.ts');
    const reader = read('src/pages/badges.astro');

    expect(writers).toMatch(/earnedAt/);
    // the reader must not reach for a field no writer produces
    expect(reader).not.toMatch(/\.unlockedAt/);
  });

  it('the badge-earned event name matches between dispatcher and listener', () => {
    // Every dispatcher and the listener must reference the shared
    // BADGE_EARNED_EVENT constant — a hardcoded string on either side is
    // exactly the drift that broke the modal (#49).
    const engine = read('src/utils/gamificationEngine.ts');
    const gamification = read('src/utils/gamification.ts');
    const listener = read('src/components/gamification/BadgeEarnedModalListener.tsx');

    expect(gamification).toMatch(/export const BADGE_EARNED_EVENT/);
    expect(gamification).toMatch(/CustomEvent\(\s*BADGE_EARNED_EVENT/);
    expect(engine).toMatch(/CustomEvent\(\s*BADGE_EARNED_EVENT/);
    expect(listener).toMatch(/addEventListener\(\s*BADGE_EARNED_EVENT/);
    expect(listener).toMatch(/removeEventListener\(\s*BADGE_EARNED_EVENT/);

    // no stray hardcoded event names in dispatch/listen calls
    const all = engine + gamification + listener;
    expect(all).not.toMatch(/CustomEvent\(\s*['"]badge-/);
    expect(all).not.toMatch(/addEventListener\(\s*['"]badge-/);
  });
});

describe('learning paths', () => {
  it('every guide slug appears in exactly one skill level', async () => {
    const { SKILL_LEVELS } = await import('../src/data/learning-paths');
    const sequenced = Object.values(SKILL_LEVELS).flatMap((l: any) => l.sequence);
    const onDisk = readdirSync(join(GUIDES_DIR, 'en'))
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));

    expect([...sequenced].sort()).toEqual([...onDisk].sort());
    expect(new Set(sequenced).size).toBe(sequenced.length); // no duplicates
  });

  /**
   * Three orderings used to disagree at once: the hand-written GUIDE_ORDER in
   * [slug].astro, SKILL_LEVELS.sequence, and the `category` frontmatter field.
   * The visible symptom was that `what-is-nostr` — the first guide of the course
   * — offered "Previous → protocol-comparison", the hardest guide on the site.
   * These three cases pin the spine down so it cannot drift apart again.
   */
  it('the guide page derives its reading order instead of restating it', () => {
    const src = readFileSync(join(ROOT, 'src/pages/[...lang]/guides/[slug].astro'), 'utf-8');
    const decl = src.match(/const GUIDE_ORDER = [\s\S]*?;/)?.[0] ?? '';

    expect(decl).toContain('getAllGuidesOrdered()');
    // A literal array here is how the drift started.
    expect(decl).not.toMatch(/\[[\s\S]*'[a-z-]+'[\s\S]*\]/);
  });

  it('reading order starts at the first beginner guide, not an advanced one', async () => {
    const { getAllGuidesOrdered, SKILL_LEVELS, getGuideLevel } = await import(
      '../src/data/learning-paths'
    );
    const ordered = getAllGuidesOrdered();

    expect(ordered[0]).toBe(SKILL_LEVELS.beginner.sequence[0]);
    expect(getGuideLevel(ordered[0])).toBe('beginner');
    expect(getGuideLevel(ordered[ordered.length - 1])).toBe('advanced');
  });

  it('the level badge comes from SKILL_LEVELS, not from frontmatter category', () => {
    const src = readFileSync(join(ROOT, 'src/pages/[...lang]/guides/[slug].astro'), 'utf-8');

    // `category` may stay in the schema, but it must not be what the reader is
    // shown as their level: 7 of 16 guides disagreed with the hub when it was.
    expect(src).toContain('getGuideLevel(');
    expect(src).toMatch(/skillLevels\.\$\{guideLevel\}\.label/);
    expect(src).not.toMatch(/\{categoryLabel\}/);
  });
});
