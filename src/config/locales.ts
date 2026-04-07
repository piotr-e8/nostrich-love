// /src/config/locales.ts
export const locales = ['en', 'pl', 'es', 'de', 'zh'] as const;

export type Locale = typeof locales[number];

export const localeConfig: Record<Locale, {
  htmlLang: string;
  ogLocale: string;
  name: string;
}> = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    name: 'English',
  },
  pl: {
    htmlLang: 'pl',
    ogLocale: 'pl_PL',
    name: 'Polski',
  },
  es: {
    htmlLang: 'es',
    ogLocale: 'es_ES',
    name: 'Español',
  },
  de: {
    htmlLang: 'de',
    ogLocale: 'de_DE',
    name: 'Deutsch',
  },
  zh: {
    htmlLang: 'zh',
    ogLocale: 'zh_CN',
    name: '中文',
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale];
}
