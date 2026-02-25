import type { Locale, Translations } from './types';

export type { Locale } from './types';

// Import translations
import en from './locales/en.json';
import pl from './locales/pl.json';
import es from './locales/es.json';
import de from './locales/de.json';

const translations: Record<Locale, Translations> = { en, pl, es, de };

/**
 * Get current locale from URL path
 * Returns 'en', 'pl', 'es', or 'de' based on URL prefix
 */
export function getCurrentLocale(path: string = typeof window !== 'undefined' ? window.location.pathname : ''): Locale {
  if (path.startsWith('/pl/')) return 'pl';
  if (path.startsWith('/es/')) return 'es';
  if (path.startsWith('/de/')) return 'de';
  return 'en';
}

/**
 * Get translation for a key
 * Supports dot notation: t('ui.buttons.submit')
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
      value = translations['en'];
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
  return translations[locale] || translations['en'];
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
  return ['en', 'pl', 'es', 'de'];
}
