import type { Locale, Translations } from './types';
import { locales } from '../config/locales';

export type { Locale } from './types';

const FALLBACK_LOCALE: Locale = 'en';

/**
 * Dispatched on `window` (browser only) once translation strings for the
 * current locale have arrived. `useTranslation` subscribes to this instead of
 * polling. Because this module top-level awaits the load, importers always
 * run after the strings are already in place, so today the event fires before
 * any subscriber exists and is effectively a no-op.
 *
 * Caveat for future lazy locale loading: `useTranslation`'s snapshot is the
 * URL-derived locale, so firing this event for an already-current locale will
 * NOT re-render mounted components (useSyncExternalStore skips re-render when
 * the snapshot is unchanged). If strings ever start arriving after mount,
 * add a version counter to the snapshot alongside the locale.
 */
export const I18N_READY_EVENT = 'i18n-ready';

// Statically importing all seven locales put 564 KB of translations into a
// single client chunk that every interactive page downloaded — roughly 6x more
// than any reader needs, since a page is built for exactly one locale.
//
// The server still needs all seven (one build renders every locale). The client
// loads only the locale it is showing, plus English, because getValue() falls
// back to English and several locales are far from complete (ar is missing
// ~1100 keys, hi ~1600) — without the fallback those readers would see raw
// dotted keys.
//
// Top-level await keeps t() and getValue() synchronous for callers: this module
// finishes resolving before any importer runs, and islands are loaded
// asynchronously anyway.
const translations: Partial<Record<Locale, Translations>> = {};

if (import.meta.env.SSR) {
  Object.assign(translations, (await import('./locales.server')).default);
} else {
  const load = async (locale: Locale) => {
    translations[locale] = (await import(`./locales/${locale}.json`)).default as Translations;
  };
  const current = getCurrentLocale();
  await Promise.all(
    current === FALLBACK_LOCALE ? [load(current)] : [load(current), load(FALLBACK_LOCALE)]
  );
  window.dispatchEvent(new CustomEvent(I18N_READY_EVENT, { detail: { locale: current } }));
}

/**
 * Get current locale from URL path
 * Returns 'en', 'pl', 'es', 'de', 'zh', 'ar', or 'hi' based on URL prefix
 */
export function getCurrentLocale(path: string = typeof window !== 'undefined' ? window.location.pathname : ''): Locale {
  if (path.startsWith('/pl/')) return 'pl';
  if (path.startsWith('/es/')) return 'es';
  if (path.startsWith('/de/')) return 'de';
  if (path.startsWith('/zh/')) return 'zh';
  if (path.startsWith('/ar/')) return 'ar';
  if (path.startsWith('/hi/')) return 'hi';
  return 'en';
}

/**
 * Get translation for a key
 * Supports dot notation: t('ui.search.placeholder')
 * Falls back to English if translation missing
 */
export function t(key: string, locale: Locale = getCurrentLocale()): string {
  const result = getValue(key, locale);
  return typeof result === 'string' ? result : key;
}

/**
 * Get any value from translations (strings, objects, arrays)
 * Supports dot notation: getValue('guides.whatIsNostr.quiz.questions')
 * Falls back to English if translation missing
 */
export function getValue(key: string, locale: Locale = getCurrentLocale()): any {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations[FALLBACK_LOCALE];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return undefined;
        }
      }
      break;
    }
  }
  
  return value;
}

/**
 * Get all translations for a specific locale
 */
export function getTranslations(locale: Locale): Translations {
  return (translations[locale] || translations[FALLBACK_LOCALE]) as Translations;
}

/**
 * Get guide metadata for a specific locale
 */
export function getGuideMetadata(guideId: string, locale: Locale): { title: string; description: string } | null {
  const guide = translations[locale]?.guides[guideId];
  if (!guide) return null;
  
  return {
    title: guide.title,
    description: guide.description,
  };
}

/**
 * Check if translation exists for a key
 */
export function hasTranslation(key: string, locale: Locale): boolean {
  const translation = t(key, locale);
  return translation !== key;
}

/**
 * Get available locales
 */
export function getAvailableLocales(): Locale[] {
  return [...locales] as Locale[];
}
