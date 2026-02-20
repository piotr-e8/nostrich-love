import { useState, useEffect } from 'react';
import type { Locale } from '../i18n/types';
import { getCurrentLocale, t as translate } from '../i18n';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');
  
  useEffect(() => {
    setLocale(getCurrentLocale());
  }, []);
  
  const t = (key: string) => translate(key, locale);
  
  return { t, locale };
}
