// /src/config/locales.ts
export const locales = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'] as const;

export type Locale = typeof locales[number];

/**
 * Writing system, used to decide whether the Latin display face (Fraunces) is
 * worth downloading. `latinExtended` marks the locales whose text needs glyphs
 * outside Latin-1 — today that is Polish only; Spanish and German accents all
 * live in U+00C0–U+00FF and ship in the base latin subset.
 * See docs/internal/VISUAL_SYSTEM.md.
 */
export const localeConfig: Record<Locale, {
  htmlLang: string;
  ogLocale: string;
  name: string;
  direction: 'ltr' | 'rtl';
  script: 'latin' | 'han' | 'arabic' | 'devanagari';
  latinExtended: boolean;
}> = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    name: 'English',
    direction: 'ltr',
    script: 'latin',
    latinExtended: false,
  },
  pl: {
    htmlLang: 'pl',
    ogLocale: 'pl_PL',
    name: 'Polski',
    direction: 'ltr',
    script: 'latin',
    latinExtended: true,
  },
  es: {
    htmlLang: 'es',
    ogLocale: 'es_ES',
    name: 'Español',
    direction: 'ltr',
    script: 'latin',
    latinExtended: false,
  },
  de: {
    htmlLang: 'de',
    ogLocale: 'de_DE',
    name: 'Deutsch',
    direction: 'ltr',
    script: 'latin',
    latinExtended: false,
  },
  zh: {
    htmlLang: 'zh',
    ogLocale: 'zh_CN',
    name: '中文',
    direction: 'ltr',
    script: 'han',
    latinExtended: false,
  },
  ar: {
    htmlLang: 'ar',
    ogLocale: 'ar_SA',
    name: 'العربية',
    direction: 'rtl',
    script: 'arabic',
    latinExtended: false,
  },
  hi: {
    htmlLang: 'hi',
    ogLocale: 'hi_IN',
    name: 'हिन्दी',
    direction: 'ltr',
    script: 'devanagari',
    latinExtended: false,
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale];
}

/**
 * True when this locale's headings should be set in the Latin display face.
 * Han, Arabic and Devanagari readers keep their system fonts, which render
 * those scripts far better than any Latin face we could ship — and they never
 * download the woff2 at all.
 */
export function usesDisplayFace(locale: Locale): boolean {
  return localeConfig[locale].script === 'latin';
}
