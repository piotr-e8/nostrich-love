// /src/config/locales.ts
export const locales = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi'] as const;

export type Locale = typeof locales[number];

export const localeConfig: Record<Locale, {
  htmlLang: string;
  ogLocale: string;
  name: string;
  direction: 'ltr' | 'rtl';
}> = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    name: 'English',
    direction: 'ltr',
  },
  pl: {
    htmlLang: 'pl',
    ogLocale: 'pl_PL',
    name: 'Polski',
    direction: 'ltr',
  },
  es: {
    htmlLang: 'es',
    ogLocale: 'es_ES',
    name: 'Español',
    direction: 'ltr',
  },
  de: {
    htmlLang: 'de',
    ogLocale: 'de_DE',
    name: 'Deutsch',
    direction: 'ltr',
  },
  zh: {
    htmlLang: 'zh',
    ogLocale: 'zh_CN',
    name: '中文',
    direction: 'ltr',
  },
  ar: {
    htmlLang: 'ar',
    ogLocale: 'ar_SA',
    name: 'العربية',
    direction: 'rtl',
  },
  hi: {
    htmlLang: 'hi',
    ogLocale: 'hi_IN',
    name: 'हिन्दी',
    direction: 'ltr',
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale];
}
