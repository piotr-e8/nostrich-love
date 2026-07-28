import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LOCALE,
  splitLocale,
  stripLocale,
  localePath,
  guidePath,
  guidesIndexPath,
  langParam,
  isLocale,
  hasLocalizedVersions,
} from './paths';

// Regression tests for a live incident: English guides were only reachable at
// /en/guides/<slug>/ while /guides/<slug>/ returned 404, which broke ~98
// internal links including the whole "continue learning" flow.

describe('splitLocale', () => {
  it('treats an un-prefixed path as the default locale', () => {
    expect(splitLocale('/guides/faq')).toEqual({ locale: 'en', path: '/guides/faq' });
  });

  it('extracts a locale prefix', () => {
    expect(splitLocale('/pl/guides/faq')).toEqual({ locale: 'pl', path: '/guides/faq' });
  });

  it('does not mistake a path segment that merely starts with a locale code', () => {
    // "/entertainment" begins with "en" but is not the en locale
    expect(splitLocale('/entertainment')).toEqual({ locale: 'en', path: '/entertainment' });
  });

  it('handles a bare locale root', () => {
    expect(splitLocale('/pl')).toEqual({ locale: 'pl', path: '/' });
  });
});

describe('localePath', () => {
  it('leaves English un-prefixed', () => {
    expect(localePath('/guides/faq', 'en')).toBe('/guides/faq');
  });

  it('prefixes every other locale', () => {
    expect(localePath('/guides/faq', 'pl')).toBe('/pl/guides/faq');
  });

  it('replaces an existing prefix instead of stacking one', () => {
    // the original bug produced /en/zh/guides/... in hreflang
    expect(localePath('/zh/guides/faq', 'en')).toBe('/guides/faq');
    expect(localePath('/zh/guides/faq', 'pl')).toBe('/pl/guides/faq');
  });

  it('is idempotent', () => {
    const once = localePath('/guides/faq', 'ar');
    expect(localePath(once, 'ar')).toBe(once);
  });

  it('keeps the root sane', () => {
    expect(localePath('/', 'en')).toBe('/');
    expect(localePath('/', 'de')).toBe('/de/');
  });
});

describe('guidePath', () => {
  it('builds un-prefixed English guide URLs', () => {
    expect(guidePath('what-is-nostr')).toBe('/guides/what-is-nostr');
    expect(guidePath('what-is-nostr', 'en')).toBe('/guides/what-is-nostr');
  });

  it('builds prefixed URLs for other locales', () => {
    expect(guidePath('what-is-nostr', 'pl')).toBe('/pl/guides/what-is-nostr');
  });

  it('tolerates a leading slash on the slug', () => {
    expect(guidePath('/quickstart', 'es')).toBe('/es/guides/quickstart');
  });

  it('never emits /en/, which only 301-redirects', () => {
    for (const slug of ['faq', 'quickstart', 'outbox-model']) {
      expect(guidePath(slug, 'en')).not.toContain('/en/');
    }
  });
});

describe('guidesIndexPath', () => {
  it('matches the route Astro emits per locale', () => {
    expect(guidesIndexPath('en')).toBe('/guides/');
    expect(guidesIndexPath('hi')).toBe('/hi/guides/');
  });
});

describe('langParam', () => {
  // getStaticPaths relies on undefined to emit the un-prefixed route
  it('is undefined for the default locale and the code otherwise', () => {
    expect(langParam('en')).toBeUndefined();
    expect(langParam('pl')).toBe('pl');
  });
});

describe('isLocale', () => {
  it('accepts known locales and rejects everything else', () => {
    expect(isLocale('pl')).toBe(true);
    expect(isLocale('EN')).toBe(false);
    expect(isLocale('klingon')).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe('hasLocalizedVersions', () => {
  // Emitting hreflang for pages with no translations advertised 404s and got
  // the whole cluster discarded.
  it('is true only for guide routes', () => {
    expect(hasLocalizedVersions('/guides/')).toBe(true);
    expect(hasLocalizedVersions('/guides/faq')).toBe(true);
    expect(hasLocalizedVersions('/pl/guides/faq')).toBe(true);
  });

  it('is false for English-only pages', () => {
    for (const p of ['/about', '/glossary', '/tools', '/simulators/damus', '/nostr-for-parents', '/']) {
      expect(hasLocalizedVersions(p)).toBe(false);
    }
  });
});

describe('stripLocale', () => {
  it('is the inverse of localePath for every locale', () => {
    for (const l of ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'] as const) {
      expect(stripLocale(localePath('/guides/faq', l))).toBe('/guides/faq');
    }
  });
});

describe('DEFAULT_LOCALE', () => {
  it('is English, matching prefixDefaultLocale:false in astro.config.mjs', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });
});
