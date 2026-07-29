// /src/i18n/paths.ts
// Single source of truth for locale-aware URL building.
// English is the default locale and is served WITHOUT a prefix
// (matches `prefixDefaultLocale: false` in astro.config.mjs):
//   en -> /guides/what-is-nostr
//   pl -> /pl/guides/what-is-nostr
import { locales, type Locale } from '../config/locales';

export const DEFAULT_LOCALE: Locale = 'en';

/** Matches a leading locale segment, e.g. "/pl/" or "/pl" at end of path. */
const LOCALE_PREFIX = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Resolve the locale of a path and return the path with the prefix removed.
 * `/pl/guides/faq` -> { locale: 'pl', path: '/guides/faq' }
 * `/guides/faq`    -> { locale: 'en', path: '/guides/faq' }
 */
export function splitLocale(path: string): { locale: Locale; path: string } {
  const match = path.match(LOCALE_PREFIX);
  if (!match) return { locale: DEFAULT_LOCALE, path: path || '/' };
  return {
    locale: match[1] as Locale,
    path: path.slice(match[0].length) || '/',
  };
}

/** Remove a leading locale segment, if any. */
export function stripLocale(path: string): string {
  return splitLocale(path).path;
}

/**
 * Build a locale-aware path. Accepts an already-prefixed path safely —
 * the existing prefix is replaced rather than stacked, which is what
 * produced URLs like `/en/zh/guides/...` before.
 */
export function localePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const bare = stripLocale(path.startsWith('/') ? path : `/${path}`);
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === '/' ? `/${locale}/` : `/${locale}${bare}`;
}

/** Path to a guide page in a given locale. */
export function guidePath(slug: string, locale: Locale = DEFAULT_LOCALE): string {
  return localePath(`/guides/${slug.replace(/^\/+/, '')}`, locale);
}

/** Path to the guides index in a given locale. */
export function guidesIndexPath(locale: Locale = DEFAULT_LOCALE): string {
  return localePath('/guides/', locale);
}

/**
 * Client-side guide path that keeps the reader in the locale they are
 * currently browsing. Use this in React islands, which are rendered once
 * per locale and cannot hardcode a prefix. Falls back to English during SSR.
 */
export function guidePathFromLocation(slug: string): string {
  if (typeof window === 'undefined') return guidePath(slug);
  return guidePath(slug, splitLocale(window.location.pathname).locale);
}

/**
 * The `lang` route param for a locale. `undefined` for English so that
 * Astro's `[...lang]` rest param emits the un-prefixed route.
 */
export function langParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

/**
 * Whether a path actually exists in every locale.
 *
 * Only the guides are translated — `src/pages/[...lang]/guides/**` is the
 * only locale-aware route. Everything else (/about, /glossary, /tools,
 * /follow-pack, /badges, ...) is English-only, so emitting hreflang for
 * those pages advertises alternates that return 404 and gets the whole
 * cluster discarded by search engines.
 *
 * Extend this when a new route gains locale variants.
 */
export function hasLocalizedVersions(path: string): boolean {
  const bare = stripLocale(path);
  return bare === '/guides' || bare === '/guides/' || bare.startsWith('/guides/');
}
