import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { locales } from '../src/config/locales';

// vercel.json reached production unvalidated and failed the deploy: two header
// entries carried a "//" key used as a comment, and Vercel's schema rejects
// additional properties outright ("headers[1] should NOT have additional
// property //"). The build failed AFTER the merge landed, so main was green
// locally and the site was still serving the previous deploy.
//
// JSON has no comments. The rationale that used to live in those "//" keys is
// recorded here instead, next to the assertion that keeps the file loadable.
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));

/** Keys Vercel accepts on a headers[] entry. Anything else fails the deploy. */
const HEADER_KEYS = new Set(['source', 'headers', 'has', 'missing']);
/** Keys Vercel accepts on a redirects[] entry. */
const REDIRECT_KEYS = new Set([
  'source',
  'destination',
  'permanent',
  'statusCode',
  'has',
  'missing',
]);

describe('vercel.json', () => {
  it('is valid JSON with the sections the site depends on', () => {
    expect(Array.isArray(config.headers)).toBe(true);
    expect(Array.isArray(config.redirects)).toBe(true);
  });

  it('has no unknown keys on headers entries', () => {
    const offenders = config.headers.flatMap((entry: object, index: number) =>
      Object.keys(entry)
        .filter((key) => !HEADER_KEYS.has(key))
        .map((key) => `headers[${index}].${key}`)
    );
    expect(
      offenders,
      'Vercel rejects additional properties and fails the whole deploy. ' +
        'JSON has no comments — put the reasoning in the commit message or in this test.'
    ).toEqual([]);
  });

  it('has no unknown keys on redirect entries', () => {
    const offenders = config.redirects.flatMap((entry: object, index: number) =>
      Object.keys(entry)
        .filter((key) => !REDIRECT_KEYS.has(key))
        .map((key) => `redirects[${index}].${key}`)
    );
    expect(offenders).toEqual([]);
  });

  it('every header entry declares at least one key/value pair', () => {
    for (const entry of config.headers) {
      expect(Array.isArray(entry.headers)).toBe(true);
      expect(entry.headers.length).toBeGreaterThan(0);
      for (const header of entry.headers) {
        expect(Object.keys(header).sort()).toEqual(['key', 'value']);
      }
    }
  });

  // --- the two rules whose rationale the "//" keys used to carry -------------

  it('serves unhashed public assets with a long immutable cache', () => {
    // These filenames are stable and live outside Astro's hashed _astro/ output,
    // so they inherited the HTML policy (max-age=0, must-revalidate) and the
    // 262 KB share card was re-fetched from origin on every preview render.
    const rule = config.headers.find((entry: { source: string }) =>
      entry.source.includes('preview_image.png')
    );
    expect(rule, 'the immutable-cache rule for public/ assets is gone').toBeDefined();
    const cacheControl = rule.headers.find(
      (header: { key: string }) => header.key === 'Cache-Control'
    );
    expect(cacheControl.value).toContain('immutable');
  });

  it('keeps *.vercel.app preview hostnames out of the index', () => {
    // Every alias serves the complete site with a canonical pointing at the
    // apex, but canonical is a hint, and Google discounts it from a host whose
    // content visibly differs — nostr-beginner-guide.vercel.app was serving
    // /simulators/ at 200 while the apex 308s it to sandstr.app. Removing the
    // aliases in the Vercel dashboard is the real fix; this is the half that
    // lives in the repo.
    const rule = config.headers.find((entry: { has?: { type: string; value: string }[] }) =>
      entry.has?.some((condition) => condition.type === 'host' && condition.value.includes('vercel'))
    );
    expect(rule, 'the *.vercel.app noindex rule is gone').toBeDefined();
    expect(rule.headers).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex' });
  });

  // --- host and locale-landing redirects -------------------------------------

  it('sends www to the apex, and does so before any other redirect', () => {
    // www answered 200 for every path instead of redirecting, so the whole site
    // existed on two hosts. Both emit a canonical pointing at the apex, but
    // canonical is a hint; a 308 is not.
    //
    // Order matters and is the reason this asserts index 0. Vercel stops at the
    // first matching redirect, and a relative destination keeps the request on
    // the host it arrived on — so if /en/guides matched first, a www reader
    // would be sent to www.nostrich.love/guides and only then bounced here.
    const rule = config.redirects[0];
    expect(rule.has).toContainEqual({ type: 'host', value: '^www\\.nostrich\\.love$' });
    expect(rule.destination).toBe('https://nostrich.love/:path*');
    expect(rule.permanent).toBe(true);

    // The host value is a regex, so the anchors and the escaped dots are load
    // bearing: a bare "www.nostrich.love" would also match a host that merely
    // contains it, e.g. www-nostrich.love.example.com.
    const host = new RegExp(rule.has[0].value);
    expect(host.test('www.nostrich.love')).toBe(true);
    expect(host.test('nostrich.love')).toBe(false);
    expect(host.test('evil-www.nostrich.love.example.com')).toBe(false);
  });

  it('lands every prefixed locale on its guides hub instead of a 404', () => {
    // /pl/, /es/, /de/, /zh/, /ar/ and /hi/ all returned 404: the homepage is an
    // English-only route, so the locale prefixes exist for /guides and /glossary
    // but not for the root. localeEntryPath() in src/i18n/paths.ts already sends
    // a reader who switches language on the homepage to that locale's guides
    // hub; this makes the bare URL agree with it.
    //
    // This is NOT the hreflang fix. An hreflang alternate has to be a canonical
    // URL that answers 200, and it has to be reciprocal — /pl/guides/ already
    // names /guides/ as its English alternate and cannot also name /. Annotating
    // the homepage cluster needs real localized homepages.
    const landing = config.redirects.filter(
      (entry: { destination: string }) => entry.destination === '/:lang/guides/'
    );
    expect(landing).toHaveLength(2);

    // Both spellings are needed: Vercel matches the source literally, which is
    // why /en/guides and /en/guides/ are two separate entries further down.
    expect(landing.map((entry: { source: string }) => entry.source).sort()).toEqual([
      '/:lang(pl|es|de|zh|ar|hi)',
      '/:lang(pl|es|de|zh|ar|hi)/',
    ]);
    for (const entry of landing) expect(entry.permanent).toBe(true);

    // vercel.json is static JSON and cannot import src/config/locales.ts, so the
    // locale list is duplicated here the same way astro.config.mjs duplicates it
    // for the sitemap. This is the assertion that keeps the copy honest: adding
    // a locale without touching vercel.json fails here rather than shipping a
    // 404 on the new /{locale}/.
    const declared = landing[0].source.match(/\(([^)]+)\)/)?.[1].split('|');
    expect(declared).toEqual(locales.filter((locale) => locale !== 'en'));
  });
});
