// /src/data/glossary/index.ts
// Shared shape for the localized glossary (extracted from the former inline
// array in src/pages/glossary.astro).
//
// This module deliberately contains NO term data and imports none of the
// per-locale files: it sits on the client import path (src/i18n/paths.ts
// imports GLOSSARY_LOCALES for hreflang/language-switcher gating), and the
// term records must never ride into a client chunk. Pages and tests import
// the per-locale files (./en, ./pl, ...) directly.
//
// Adding a locale = one data file here + one entry in GLOSSARY_LOCALES.
// zh/ar/hi are deferred until native review (task #15) — shipping
// machine-translated definitions is the only thing "free" would buy.
import type { Locale } from '../../config/locales';

/** Locales the glossary route actually ships in. Order = hreflang emission order. */
export const GLOSSARY_LOCALES = ['en', 'pl', 'es', 'de'] as const satisfies readonly Locale[];

export type GlossaryLocale = (typeof GLOSSARY_LOCALES)[number];

/**
 * Stable, locale-independent term ids. Every locale file must cover exactly
 * this set — Record<TermId, ...> enforces it at compile time, and
 * tests/glossary-parity.test.ts enforces it at runtime (against `as` casts).
 *
 * `nsec-format`/`npub-format` are the bech32-encoding entries the old page
 * rendered as "_nsec"/"_npub"; kept as distinct terms (merging is Piotr's
 * call, see docs/audit-2026-07 external-funnel plan §4).
 */
export const TERM_IDS = [
  'nostr',
  'npub',
  'nsec',
  'relay',
  'client',
  'nip',
  'zap',
  'nip05',
  'event',
  'kind',
  'pubkey',
  'nsec-format',
  'npub-format',
  'feed',
  'follow-list',
  'relay-list',
  'dm',
  'mention',
  'hashtag',
  'thread',
  'repost',
  'reaction',
  'lnurl',
  'lightning-address',
  'nostr-address',
  'censorship-resistance',
] as const;

export type TermId = (typeof TERM_IDS)[number];

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export type GlossaryData = Record<TermId, GlossaryEntry>;

/**
 * Term id -> the guide that explains it properly.
 *
 * The glossary defined 26 terms and linked to nothing, so it was a leaf: real
 * inbound interest with no route onward, and none of the guides gained a
 * contextual link from the page most likely to be quoted for their vocabulary.
 *
 * Locale-independent by construction — term ids and guide slugs are the same in
 * every locale, and guidePath() adds the prefix — so one map serves all four
 * shipped glossary locales. Terms with no obvious home are simply absent;
 * inventing a link for the sake of coverage would be worse than none.
 */
export const TERM_GUIDES: Partial<Record<TermId, string>> = {
  nostr: 'what-is-nostr',
  npub: 'keys-and-security',
  nsec: 'keys-and-security',
  pubkey: 'keys-and-security',
  'npub-format': 'keys-and-security',
  'nsec-format': 'keys-and-security',
  relay: 'relays-demystified',
  'relay-list': 'relay-guide',
  client: 'multi-client',
  nip: 'what-is-nostr',
  event: 'what-is-nostr',
  kind: 'what-is-nostr',
  zap: 'zaps-and-lightning',
  lnurl: 'zaps-and-lightning',
  'lightning-address': 'zaps-and-lightning',
  nip05: 'nip05-identity',
  'nostr-address': 'nip05-identity',
  dm: 'nip17-private-messages',
  feed: 'outbox-model',
  'follow-list': 'finding-community',
  mention: 'finding-community',
  hashtag: 'finding-community',
  'censorship-resistance': 'what-is-nostr',
};

/** Per-locale <title> (SEO.astro appends " | Nostrich.love") and meta description. */
export interface GlossaryMeta {
  seoTitle: string;
  description: string;
}

export function isGlossaryLocale(locale: Locale): locale is GlossaryLocale {
  return (GLOSSARY_LOCALES as readonly Locale[]).includes(locale);
}
