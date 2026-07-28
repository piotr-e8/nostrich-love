// Server-only locale registry.
//
// A single build renders all seven locales, so the server genuinely needs every
// file at once. The client does not: each page is built for one locale, so
// src/i18n/index.ts loads only what that page needs.
//
// Keep this module out of any client-reachable import path — it is pulled in
// behind an `import.meta.env.SSR` guard so bundlers drop it from client output.
import type { Locale, Translations } from './types';

import en from './locales/en.json';
import pl from './locales/pl.json';
import es from './locales/es.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';

const all = { en, pl, es, de, zh, ar, hi } as unknown as Record<Locale, Translations>;

export default all;
