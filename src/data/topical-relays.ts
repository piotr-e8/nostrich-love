export type RelayCategory = 
  | 'general' 
  | 'bitcoin' 
  | 'art' 
  | 'music' 
  | 'tech' 
  | 'dev' 
  | 'gaming' 
  | 'regional';

export interface TopicalRelay {
  id: string;
  url: string;
  name: string;
  description: string;
  category: RelayCategory;
  tags: string[];
  location?: string;
  language?: string;
  addedBy?: string;
  addedDate: string;
  verified: boolean;
  featured?: boolean;
}

export const TOPICAL_RELAYS: TopicalRelay[] = [
  {
    id: "spatia-arcana",
    url: "wss://spatia-arcana.com",
    name: "Spatia Arcana",
    description: "Community-submitted topical relay for discovering niche communities",
    category: "general",
    tags: ["community", "discovery"],
    addedDate: "2026-03-04",
    verified: true,
    featured: true
  },
  {
    id: "christpill",
    url: "wss://christpill.nostr1.com",
    name: "Christpill",
    description: "Christian community relay for faith-based discussions and fellowship",
    category: "general",
    tags: ["christianity", "faith", "community", "religion"],
    addedDate: "2026-03-05",
    verified: true,
    featured: false
  },
  {
    id: "chillstr",
    url: "wss://chillstr.nostr1.com",
    name: "Chill Str",
    description: "Laid-back general chat relay for casual conversations and friendly discussions",
    category: "general",
    tags: ["casual", "chat", "community", "social"],
    addedDate: "2026-03-05",
    verified: true,
    featured: false
  },
  {
    id: "140-fz7",
    url: "wss://140.fz7.io",
    name: "140",
    description: "Twitter-style short-form posting relay with 140-character focus",
    category: "general",
    tags: ["short-form", "microblogging", "social"],
    addedDate: "2026-03-05",
    verified: true,
    featured: false
  },
  {
    id: "utxo-news",
    url: "wss://news.utxo.one",
    name: "UTXO News",
    description: "Bitcoin and cryptocurrency news aggregation relay with focus on UTXO-based discussions",
    category: "bitcoin",
    tags: ["bitcoin", "news", "utxo", "crypto", "finance"],
    addedDate: "2026-03-05",
    verified: true,
    featured: false
  },
  {
    id: "holoboard",
    url: "wss://relay.holoboard.space",
    name: "Holoboard",
    description: "Tech and innovation focused relay for forward-thinking discussions",
    category: "tech",
    tags: ["technology", "innovation", "future", "science"],
    addedDate: "2026-03-05",
    verified: true,
    featured: false
  }
];

export const getRelaysByCategory = (category: RelayCategory): TopicalRelay[] => 
  TOPICAL_RELAYS.filter(r => r.category === category);

export const getFeaturedRelays = (): TopicalRelay[] => 
  TOPICAL_RELAYS.filter(r => r.featured);

export const getVerifiedRelays = (): TopicalRelay[] =>
  TOPICAL_RELAYS.filter(r => r.verified);

export const RELAY_CATEGORIES: { id: RelayCategory; label: string; description: string }[] = [
  { id: 'general', label: 'General', description: 'Broad interest relays' },
  { id: 'bitcoin', label: 'Bitcoin', description: 'BTC-focused discussions' },
  { id: 'art', label: 'Art & Creative', description: 'Visual arts and creative content' },
  { id: 'music', label: 'Music', description: 'Music sharing and discussion' },
  { id: 'tech', label: 'Technology', description: 'Tech and innovation' },
  { id: 'dev', label: 'Development', description: 'Software development' },
  { id: 'gaming', label: 'Gaming', description: 'Gaming community' },
  { id: 'regional', label: 'Regional', description: 'Location-based communities' }
];
