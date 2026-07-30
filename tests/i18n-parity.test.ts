import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Translation-parity ratchet.
 *
 * Measured 2026-07-28 (docs/internal/TRANSLATION_PARITY_2026-07.md): the
 * UI-string gap against en.json was ar 1123 / hi 1589 / pl 390 / es 252 /
 * de 18 / zh 0 missing leaf keys, and several guide translations had been
 * silently abridged to 13–36% of the English content.
 *
 * These tests don't demand perfection — they demand the gap NEVER GROWS.
 * When you close part of the gap, lower the baseline in the same commit so
 * the ratchet holds at the new level.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOCALES_DIR = join(ROOT, 'src/i18n/locales');
const GUIDES_DIR = join(ROOT, 'src/content/guides');

// --- UI leaf-key parity ------------------------------------------------------

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function leaves(obj: Json, prefix = ''): Set<string> {
  const out = new Set<string>();
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => leaves(v, `${prefix}${i}.`).forEach((k) => out.add(k)));
  } else if (obj !== null && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      leaves(v, `${prefix}${k}.`).forEach((x) => out.add(x));
    }
  } else {
    out.add(prefix.slice(0, -1));
  }
  return out;
}

const loadLeaves = (l: string): Set<string> =>
  leaves(JSON.parse(readFileSync(join(LOCALES_DIR, `${l}.json`), 'utf-8')));

// Baselines = the measured gap. Lower them as translations land; never raise.
const MISSING_BASELINE: Record<string, number> = {
  pl: 0,
  es: 0,
  de: 0,
  zh: 0,
  ar: 0,
  hi: 0,
};

describe('UI string parity ratchet (missing keys vs en must not grow)', () => {
  const en = loadLeaves('en');
  for (const [locale, baseline] of Object.entries(MISSING_BASELINE)) {
    it(`${locale}: missing-key count <= ${baseline}`, () => {
      const localeLeaves = loadLeaves(locale);
      const missing = [...en].filter((k) => !localeLeaves.has(k));
      expect(
        missing.length,
        `${locale}.json is missing ${missing.length} keys vs en.json (baseline ${baseline}). ` +
          `New en.json keys must ship with translations, or raise the gap knowingly. ` +
          `First missing: ${missing.slice(0, 5).join(', ')}`
      ).toBeLessThanOrEqual(baseline);
    });
  }
});

// --- Placeholder & array-shape integrity ------------------------------------
//
// The codebase interpolates with plain .replace() using TWO conventions
// (docs/internal/LESSONS_AR_LOCALE.md): quiz components use {{double}},
// everything else {single}. A translation that renames, drops, or re-braces
// a token ships a visible "{count}" (or a silently empty slot) to users.
// So: for every key present in both en and a locale, the MULTISET of
// placeholder tokens must match en exactly — {{x}} and {x} are distinct.
//
// Exception: tokens listed in OPTIONAL_TOKENS are en-morphology hacks
// (code substitutes 's'/'' into them). Locales whose plural is not formed
// by suffixing 's' (pl, zh, ar, hi) must NOT carry them — a Latin "s"
// inside Polish or Devanagari text is the bug the exemption prevents.
const OPTIONAL_TOKENS: Record<string, string[]> = {
  'continueLearning.unlockRequirements': ['{plural}'],
};

type Entry = [path: string, value: Json];

function* walkEntries(obj: Json, prefix = ''): Generator<Entry> {
  if (Array.isArray(obj)) {
    yield [prefix.slice(0, -1), obj];
    for (let i = 0; i < obj.length; i++) {
      const v = obj[i];
      if (v !== null && typeof v === 'object') yield* walkEntries(v, `${prefix}${i}.`);
      else yield [`${prefix}${i}`, v];
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (v !== null && typeof v === 'object') yield* walkEntries(v, `${prefix}${k}.`);
      else yield [`${prefix}${k}`, v];
    }
  }
}

function placeholderTokens(s: string): string[] {
  const out: string[] = [];
  for (const m of s.match(/\{\{\s*[\w.]+\s*\}\}/g) || []) out.push(m.replace(/\s+/g, ''));
  const rest = s.replace(/\{\{\s*[\w.]+\s*\}\}/g, '');
  for (const m of rest.match(/\{\s*[\w.]+\s*\}/g) || []) out.push(m.replace(/\s+/g, ''));
  return out.sort();
}

const getAtPath = (obj: Json, path: string): Json | undefined =>
  path.split('.').reduce<Json | undefined>(
    (a, s) => (a !== null && typeof a === 'object' ? (a as any)[s] : undefined),
    obj
  );

const loadJson = (l: string): Json =>
  JSON.parse(readFileSync(join(LOCALES_DIR, `${l}.json`), 'utf-8'));

describe('placeholder & array-shape parity vs en', () => {
  const enJson = loadJson('en');
  const enEntries = [...walkEntries(enJson)];

  for (const locale of Object.keys(MISSING_BASELINE)) {
    it(`${locale}: every shared key has en's exact placeholder multiset`, () => {
      const loc = loadJson(locale);
      const errors: string[] = [];
      for (const [path, enVal] of enEntries) {
        if (typeof enVal !== 'string') continue;
        const locVal = getAtPath(loc, path);
        if (typeof locVal !== 'string') continue; // missing keys are the ratchet's job
        const optional = new Set(OPTIONAL_TOKENS[path] || []);
        const a = placeholderTokens(enVal).filter((t) => !optional.has(t));
        const b = placeholderTokens(locVal).filter((t) => !optional.has(t));
        if (a.join(' ') !== b.join(' ')) {
          errors.push(`${path}: en [${a.join(' ')}] vs ${locale} [${b.join(' ')}]`);
        }
      }
      expect(errors, `placeholder drift in ${locale}.json:\n${errors.join('\n')}`).toEqual([]);
    });

    it(`${locale}: every array shared with en has the same length`, () => {
      const loc = loadJson(locale);
      const errors: string[] = [];
      for (const [path, enVal] of enEntries) {
        if (!Array.isArray(enVal)) continue;
        const locVal = getAtPath(loc, path);
        if (locVal === undefined) continue;
        if (!Array.isArray(locVal)) {
          errors.push(`${path}: en is array[${enVal.length}], ${locale} is ${typeof locVal}`);
        } else if (locVal.length !== enVal.length) {
          errors.push(`${path}: en has ${enVal.length} items, ${locale} has ${locVal.length}`);
        }
      }
      expect(errors, `array-shape drift in ${locale}.json:\n${errors.join('\n')}`).toEqual([]);
    });
  }
});

// --- Guide structural parity -------------------------------------------------

const stripToBody = (src: string) =>
  src
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^import .*$/gm, '');

const headingCount = (p: string) =>
  (stripToBody(readFileSync(p, 'utf-8')).match(/^#{2,4} /gm) || []).length;

// Guides with a known, deliberate structural deviation from en. Remove
// entries as they are reconciled; everything NOT listed here is required
// to be at parity (±2 headings) and must stay there.
const KNOWN_ABRIDGED: Record<string, string[]> = {
  // pl/protocol-comparison has 5 EXTRA sections vs en (translator added
  // material; 129% of en volume). Not a defect — reconcile deliberately:
  // either port the extra sections to en or trim pl to parity.
  pl: ['protocol-comparison'],
};

const GUIDE_LOCALES = ['pl', 'es', 'de', 'zh', 'ar', 'hi'];

describe('guide structural parity (heading count vs en)', () => {
  const slugs = ['what-is-nostr', 'quickstart', 'keys-and-security', 'relay-guide',
    'relays-demystified', 'privacy-security', 'protocol-comparison', 'troubleshooting',
    'zaps-and-lightning', 'nip05-identity', 'nip17-private-messages', 'multi-client',
    'finding-community', 'nostr-tools', 'outbox-model', 'faq'];

  for (const slug of slugs) {
    const enPath = join(GUIDES_DIR, 'en', `${slug}.mdx`);
    if (!existsSync(enPath)) continue;
    const enHeadings = headingCount(enPath);

    for (const locale of GUIDE_LOCALES) {
      const p = join(GUIDES_DIR, locale, `${slug}.mdx`);
      const isKnownAbridged = (KNOWN_ABRIDGED[locale] || []).includes(slug);
      it(`${locale}/${slug}: exists and ${isKnownAbridged ? 'is tracked as abridged' : `has ${enHeadings}±2 headings`}`, () => {
        expect(existsSync(p), `${locale}/${slug}.mdx is missing`).toBe(true);
        if (!isKnownAbridged) {
          const h = headingCount(p);
          expect(
            Math.abs(h - enHeadings),
            `${locale}/${slug}.mdx has ${h} headings vs ${enHeadings} in en — a translation was abridged or en gained sections that were not ported`
          ).toBeLessThanOrEqual(2);
        }
      });
    }
  }
});
