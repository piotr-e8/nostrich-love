import { useCallback, useSyncExternalStore } from 'react';
import type { Locale } from '../i18n/types';
import { getCurrentLocale, t as translate, getValue as getTranslationValue, I18N_READY_EVENT } from '../i18n';

// The locale is derived from the URL, and every language switch is a full page
// load (LanguageSwitcher sets window.location.href; there is no client-side
// router). The only moments a mounted component could need a re-read are a
// history hop (popstate) and the i18n loader announcing that strings arrived
// (I18N_READY_EVENT). Subscribing to those two events replaces the previous
// per-instance 100 ms setInterval poll.
//
// Correctness at mount does not depend on either event: src/i18n/index.ts
// top-level awaits the locale load, so no component module can even evaluate
// before its strings are in place. Note that an event re-check only re-renders
// when the snapshot (the locale string) actually changed — an I18N_READY_EVENT
// for the already-current locale is a deliberate no-op (see i18n/index.ts).
function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener('popstate', onStoreChange);
  window.addEventListener(I18N_READY_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('popstate', onStoreChange);
    window.removeEventListener(I18N_READY_EVENT, onStoreChange);
  };
}

// In the browser this reads the locale from the URL; during SSR
// getCurrentLocale() has no window and falls back to 'en', matching what the
// previous useState(getCurrentLocale()) initialiser did in both environments.
const getSnapshot = (): Locale => getCurrentLocale();
const getServerSnapshot = (): Locale => getCurrentLocale();

export function useTranslation() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const t = useCallback((key: string) => translate(key, locale), [locale]);
  const getValue = useCallback((key: string) => getTranslationValue(key, locale), [locale]);

  return { t, getValue, locale };
}
