import { useState, useEffect } from 'react';
import type { Locale } from '../i18n/types';
import { getCurrentLocale, t as translate, getValue as getTranslationValue } from '../i18n';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');
  
  useEffect(() => {
    setLocale(getCurrentLocale());
  }, []);
  
  const t = (key: string) => translate(key, locale);
  const getValue = (key: string) => getTranslationValue(key, locale);
  
  return { t, getValue, locale };
}
