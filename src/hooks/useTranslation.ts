import { useState, useEffect } from 'react';
import type { Locale } from '../i18n/types';
import { getCurrentLocale, t as translate, getValue as getTranslationValue } from '../i18n';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(getCurrentLocale());
  
  useEffect(() => {
    // Update locale immediately on mount
    setLocale(getCurrentLocale());
    
    const handleUrlChange = () => {
      setLocale(getCurrentLocale());
    };
    
    // Listen for URL changes (when user navigates to different language path)
    window.addEventListener('popstate', handleUrlChange);
    
    // Also check for changes periodically (for programmatic navigation)
    const interval = setInterval(() => {
      const currentLocale = getCurrentLocale();
      if (currentLocale !== locale) {
        setLocale(currentLocale);
      }
    }, 100);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      clearInterval(interval);
    };
  }, [locale]);
  
  const t = (key: string) => translate(key, locale);
  const getValue = (key: string) => getTranslationValue(key, locale);
  
  return { t, getValue, locale };
}
