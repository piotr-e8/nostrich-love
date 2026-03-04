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
