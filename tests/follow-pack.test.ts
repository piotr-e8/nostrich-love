/**
 * /follow-pack regression coverage.
 *
 * Two things are pinned here.
 *
 * 1. CONSENT (audit finding #112). The export modal used to publish a signed
 *    NIP-51 event to three public relays from a mount effect — no dialog, no
 *    button, no opt-in. The user's first sign of it was a spinner reading
 *    "Publishing list to Nostr relays...", i.e. a notification after the fact.
 *    Publishing is irreversible (throwaway signing key, no delete on Nostr), so
 *    the tests below assert that nothing can publish without a click and that
 *    the disclosure the user reads is generated from the same relay list the
 *    code publishes to.
 *
 * 2. TAXONOMY. The page used to advertise ten categories — Influencers,
 *    Developers, Bitcoiners, Creators, Education, News, Privacy, Plebs, Humor,
 *    Regional — of which ZERO existed in the dataset, and claimed "100+"
 *    accounts against a set of 527. The tests below tie the copy to the data.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PUBLISH_RELAYS,
  STARTER_PACK_KIND,
  buildStarterPackEvent,
} from '../src/components/follow-pack/starterPackEvent';
import { categories, categoryGroups } from '../src/data/follow-pack/categories';
import { curatedAccounts, getCategoryCounts } from '../src/data/follow-pack';
import type { CuratedAccount } from '../src/types/follow-pack';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf-8');

/** Collapse whitespace so assertions survive JSX line wrapping. */
const flat = (src: string) => src.replace(/\s+/g, ' ');

/**
 * An .astro file's rendered part: frontmatter and HTML comments dropped, so
 * assertions about what a READER sees are not satisfied (or broken) by a code
 * comment that merely mentions the string.
 */
const astroTemplate = (src: string) =>
  src
    .replace(/^---[\s\S]*?\n---\n/, '')
    .replace(/<!--[\s\S]*?-->/g, '');

const EXPORT_MODAL = 'src/components/follow-pack/ExportModal.tsx';
const PAGE = 'src/pages/follow-pack.astro';
const LOCALES = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'];

// --- The relay list is the disclosure ----------------------------------------

describe('publish target', () => {
  it('is exactly the three relays the copy names', () => {
    expect([...PUBLISH_RELAYS]).toEqual([
      'wss://relay.damus.io',
      'wss://nos.lol',
      'wss://nostr.mom',
    ]);
  });

  it('is rendered from the constant in the consent panel, never hand-typed', () => {
    const src = read(EXPORT_MODAL);

    // A hardcoded wss:// URL in the component is how the disclosure and the
    // actual publish target drift apart.
    const hardcoded = src.match(/['"`]wss:\/\/[^'"`]+['"`]/g) ?? [];
    expect(
      hardcoded,
      'Relay URLs must come from PUBLISH_RELAYS so a relay added there cannot ' +
        'escape the consent copy the user reads.'
    ).toEqual([]);

    // ...and the panel must actually enumerate them.
    expect(src).toMatch(/RELAYS\.map\(/);
    expect(src).toMatch(/RELAYS\.length/);
  });

  it('is named in the page FAQ from the same constant', () => {
    const page = read(PAGE);
    expect(page).toMatch(/import \{ PUBLISH_RELAYS \}/);
    expect(page).toMatch(/PUBLISH_RELAYS\.join\(/);
    expect(page.match(/['"`]wss:\/\//g) ?? []).toEqual([]);
  });
});

// --- Nothing publishes without a click ---------------------------------------

/** Return the balanced `(...)` argument text of every `name(` call site. */
function callBlocks(src: string, name: string): string[] {
  const blocks: string[] = [];
  const needle = `${name}(`;
  let from = 0;

  for (;;) {
    const start = src.indexOf(needle, from);
    if (start === -1) break;

    let depth = 0;
    let i = start + needle.length - 1;
    for (; i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') {
        depth--;
        if (depth === 0) break;
      }
    }
    blocks.push(src.slice(start, i + 1));
    from = i + 1;
  }

  return blocks;
}

describe('consent gate (finding #112)', () => {
  const src = read(EXPORT_MODAL);

  it('no useEffect publishes, signs, or opens a socket', () => {
    const effects = callBlocks(src, 'useEffect');
    expect(effects.length).toBeGreaterThan(0); // sanity: the parser found them

    const offenders = effects
      .filter(block => /publishToNostr\s*\(|signStarterPack\s*\(|new WebSocket\s*\(/.test(block))
      .map(block => block.slice(0, 120));

    expect(
      offenders,
      'Publishing must be triggered by the user, never by the modal opening. ' +
        'This is exactly the shape of finding #112.'
    ).toEqual([]);
  });

  it('publishing is reachable only from a click handler', () => {
    const handlers = src.match(/onClick=\{publishToNostr\}/g) ?? [];
    expect(handlers.length).toBeGreaterThan(0);

    // No bare invocation anywhere — the only references are the definition and
    // the onClick bindings.
    expect(src.match(/publishToNostr\s*\(\s*\)/g) ?? []).toEqual([]);
  });

  it('discloses permanence, publicness and the discarded key before publishing', () => {
    const copy = flat(src);
    for (const phrase of [
      'public and effectively permanent',
      'not even you',
      'edit or delete this list later',
      'Nostr has no reliable delete',
      'anyone reading the list learns',
      'Keep it local',
    ]) {
      expect(copy, `consent copy must say "${phrase}"`).toContain(phrase);
    }
  });

  it('offers the local exports as the default tab', () => {
    expect(src).toMatch(/useState<ExportMethod>\('qr'\)/);
    expect(src).toContain('Nothing leaves your browser on this tab.');
  });
});

// --- The event a user consents to --------------------------------------------

const account = (npub: string, name: string): CuratedAccount => ({
  npub,
  name,
  bio: '',
  categories: ['jumpstart'],
  tags: [],
  activity: 'medium',
  contentTypes: ['text'],
  addedAt: '2026-02-12',
  updatedAt: '2026-02-12',
});

describe('buildStarterPackEvent', () => {
  const picks = [
    account('npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc', 'Gigi'),
    account('npub1rtlqca8r6auyaw5n5h3l5422dm4sry5dzfee4696fqe8s6qgudks7djtfs', 'HODL'),
  ];

  const { template, identifier } = buildStarterPackEvent(picks, 'My Pack', 'followpack-1', 1000);

  it('is an addressable NIP-51 starter pack', () => {
    expect(template.kind).toBe(STARTER_PACK_KIND);
    expect(STARTER_PACK_KIND).toBe(39089);
    expect(template.created_at).toBe(1000);
    expect(template.content).toBe('');
    expect(identifier).toBe('followpack-1');
  });

  it('carries the d/title/description tags', () => {
    expect(template.tags[0]).toEqual(['d', 'followpack-1']);
    expect(template.tags[1]).toEqual(['title', 'My Pack']);
    expect(template.tags[2]).toEqual([
      'description',
      'Curated follow pack with 2 accounts from nostrich.love',
    ]);
  });

  it('carries one 64-char hex p tag per selected account and nothing else', () => {
    const pTags = template.tags.filter(t => t[0] === 'p');
    expect(pTags).toHaveLength(picks.length);
    for (const [, pubkey] of pTags) {
      expect(pubkey).toMatch(/^[0-9a-f]{64}$/);
    }
    expect(template.tags).toHaveLength(3 + picks.length);
  });

  it('uses the name given at call time, not a default', () => {
    const { template: renamed } = buildStarterPackEvent(picks, 'Typed By The User');
    expect(renamed.tags.find(t => t[0] === 'title')).toEqual(['title', 'Typed By The User']);
  });

  it('reports npubs it could not decode instead of silently shipping them', () => {
    const { undecodable, template: broken } = buildStarterPackEvent(
      [account('not-an-npub', 'Broken')],
      'Pack'
    );
    expect(undecodable).toEqual(['Broken']);
    expect(broken.tags.filter(t => t[0] === 'p')).toHaveLength(1);
  });
});

// --- Taxonomy and counts -----------------------------------------------------

describe('category taxonomy', () => {
  const counts = getCategoryCounts();

  it('every declared category has accounts in it', () => {
    const empty = categories.filter(c => (counts[c.id] ?? 0) === 0).map(c => c.id);
    expect(empty, 'an empty category is an empty result set for whoever clicks it').toEqual([]);
  });

  it('every category id used by the data is declared', () => {
    const declared = new Set(categories.map(c => c.id));
    const orphans = Object.keys(counts).filter(id => !declared.has(id as never));
    expect(orphans).toEqual([]);
  });

  it('every category belongs to a declared display group', () => {
    const groupIds = new Set(categoryGroups.map(g => g.id));
    const stray = categories.filter(c => !groupIds.has(c.group)).map(c => c.id);
    expect(stray).toEqual([]);
    // Every group must be populated too, or the page renders an empty band.
    for (const group of categoryGroups) {
      expect(
        categories.some(c => c.group === group.id),
        `group "${group.id}" has no categories`
      ).toBe(true);
    }
  });

  it('holds one row per npub (accounts.ts imported 15 duplicates)', () => {
    const npubs = curatedAccounts.map(a => a.npub);
    expect(new Set(npubs).size).toBe(npubs.length);
  });

  it('resolves labels through i18n, not just the English fallback', async () => {
    const { getCategoryGroupsWithCounts } = await import('../src/data/follow-pack/localize');

    const en = getCategoryGroupsWithCounts(counts, 'en');
    const pl = getCategoryGroupsWithCounts(counts, 'pl');

    // All 16 categories reachable through the localized view, grouped.
    expect(en.reduce((n, g) => n + g.categories.length, 0)).toBe(categories.length);

    // A translated locale must actually differ, or the keys are dead weight and
    // every reader is silently getting English.
    expect(pl[0].name).not.toBe(en[0].name);
    expect(pl[0].categories[0].name).not.toBe(en[0].categories[0].name);

    // Counts survive localization.
    for (const group of pl) {
      for (const category of group.categories) {
        expect(category.count).toBe(counts[category.id]);
      }
    }
  });

  it('every category is labelled and described in all seven locales', () => {
    for (const locale of LOCALES) {
      const json = JSON.parse(read(`src/i18n/locales/${locale}.json`));
      const ns = json.followPack;
      expect(ns, `${locale}.json has no followPack namespace`).toBeTruthy();

      for (const category of categories) {
        const entry = ns.categories?.[category.id];
        expect(entry?.name, `${locale}: followPack.categories.${category.id}.name`).toBeTruthy();
        expect(
          entry?.description,
          `${locale}: followPack.categories.${category.id}.description`
        ).toBeTruthy();
      }

      for (const group of categoryGroups) {
        expect(ns.groups?.[group.id]?.name, `${locale}: followPack.groups.${group.id}.name`).toBeTruthy();
      }
    }
  });
});

// --- The page cannot advertise what the data does not hold -------------------

describe('/follow-pack copy', () => {
  const page = read(PAGE);
  const rendered = astroTemplate(page);

  it('names no category that does not exist', () => {
    // The ten fictional labels the page used to advertise.
    const fictional = [
      'Influencers',
      'Developers',
      'Bitcoiners',
      'Creators',
      'Plebs',
      'Regional',
    ];
    const found = fictional.filter(label => rendered.includes(label));
    expect(found, 'these labels match no category id in the dataset').toEqual([]);
  });

  it('states no hardcoded account count', () => {
    expect(rendered).not.toMatch(/100\+/);
    // Counts must be interpolated from the dataset.
    expect(page).toMatch(/getAccountCount\(\)/);
    expect(page).toMatch(/getCategoryCounts\(\)/);
  });

  it('renders the categories server-side so the static HTML is not empty', () => {
    expect(page).toMatch(/getCategoryGroupsWithCounts/);
    expect(page).toMatch(/groups\.map/);
  });

  it('says an empty feed is why beginners quit', () => {
    expect(flat(rendered).toLowerCase()).toContain('number one reason beginners quit');
  });
});
