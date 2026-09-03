import { t } from '../i18n';

// Every relay below answered a NIP-11 request on 2026-09-02, checked host by
// host (docs/audit-2026-09/relays-verified.md, re-fetched by hand for this file).
// wss://140.fz7.io was dropped: no DNS record at all, so there is nothing to
// browse. The descriptions used to be invented marketing lines in English; they
// now come from the operators' own NIP-11 text, through t().

export type RelayCategory =
  | 'general'
  | 'news';

export interface TopicalRelay {
  id: string;
  url: string;
  /** Operator's own name for the relay. A proper noun, not translated. */
  name: string;
  /** i18n key. Read `description` instead unless you are calling t() yourself. */
  descriptionKey: string;
  /** Resolved through t() at read time, so it follows the reader's language. */
  readonly description: string;
  category: RelayCategory;
  tags: string[];
  /** Date the NIP-11 document was last fetched by hand. */
  checkedDate: string;
  featured?: boolean;
}

type RelaySeed = Omit<TopicalRelay, 'description' | 'descriptionKey'>;

// The payload is a plain constant, but the locale is not known when this module
// is evaluated: the browser reads it from the URL and the build sets it per page.
// A getter resolves the string at render time instead, which keeps every consumer
// working with `relay.description` while the text follows the reader's language.
function withDescription(seed: RelaySeed): TopicalRelay {
  const descriptionKey = `relayFeedBrowser.relays.${seed.id}.description`;
  return {
    ...seed,
    descriptionKey,
    get description() {
      return t(descriptionKey);
    },
  };
}

const RELAY_SEEDS: RelaySeed[] = [
  {
    id: "spatia-arcana",
    url: "wss://spatia-arcana.com",
    name: "Spatia Arcana",
    category: "general",
    tags: ["community", "discovery"],
    checkedDate: "2026-09-02",
    featured: true,
  },
  {
    id: "christpill",
    url: "wss://christpill.nostr1.com",
    name: "Christpill",
    category: "general",
    tags: ["christianity", "faith", "community"],
    checkedDate: "2026-09-02",
  },
  {
    id: "chillstr",
    url: "wss://chillstr.nostr1.com",
    name: "Chillstr",
    category: "general",
    tags: ["meditation", "mindfulness", "paid"],
    checkedDate: "2026-09-02",
  },
  {
    id: "utxo-news",
    url: "wss://news.utxo.one",
    name: "NewsBot Relay",
    category: "news",
    tags: ["news", "headlines", "bot"],
    checkedDate: "2026-09-02",
  },
  {
    id: "holoboard",
    url: "wss://relay.holoboard.space",
    name: "Holoboard",
    category: "general",
    tags: ["bulletin-board", "sats", "paid"],
    checkedDate: "2026-09-02",
  },
];

export const TOPICAL_RELAYS: TopicalRelay[] = RELAY_SEEDS.map(withDescription);

export const getRelaysByCategory = (category: RelayCategory): TopicalRelay[] =>
  TOPICAL_RELAYS.filter(r => r.category === category);

export const getFeaturedRelays = (): TopicalRelay[] =>
  TOPICAL_RELAYS.filter(r => r.featured);

export interface RelayCategoryOption {
  id: RelayCategory;
  /** i18n key. Read `label` instead unless you are calling t() yourself. */
  labelKey: string;
  /** Resolved through t() at read time. */
  readonly label: string;
}

// Derived from the relays that actually exist. The old list hardcoded eight
// categories, five of which (art, music, dev, gaming, regional) matched no relay
// at all, so those filter buttons led to an empty screen.
export const RELAY_CATEGORIES: RelayCategoryOption[] = Array.from(
  new Set(TOPICAL_RELAYS.map(r => r.category)),
).map((id) => {
  const labelKey = `relayFeedBrowser.categories.${id}`;
  return {
    id,
    labelKey,
    get label() {
      return t(labelKey);
    },
  };
});
