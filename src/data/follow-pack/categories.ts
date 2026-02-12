// Account Categories for Follow Pack Finder
// Order matters - displayed in this order
// Based on imported follow pack data (naddr)

import type { Category } from '../../types/follow-pack';

export const categories: Category[] = [
  {
    id: 'jumpstart',
    name: 'Jumpstart Your Feed',
    description: 'Curated starter pack for new Nostr users - essential accounts to follow',
    icon: 'rocket',
    color: '#F59E0B', // Amber
    order: 1
  },
  {
    id: 'artists',
    name: 'Featured Artists',
    description: 'Curated list of visual artists, digital creators, and designers',
    icon: 'palette',
    color: '#EC4899', // Pink
    order: 2
  },
  {
    id: 'mystics',
    name: 'Mystics & Spirituality',
    description: 'Spiritual thinkers, mystics, and those exploring consciousness',
    icon: 'sparkles',
    color: '#6366F1', // Indigo
    order: 3
  },
  {
    id: 'cool_people',
    name: 'Cool People',
    description: 'Interesting folks recommended by the community',
    icon: 'heart',
    color: '#3B82F6', // Blue
    order: 4
  },
  {
    id: 'sovereign',
    name: 'Sovereign Individuals',
    description: 'Freedom advocates, privacy enthusiasts, and independent thinkers',
    icon: 'shield',
    color: '#EF4444', // Red
    order: 5
  },
  {
    id: 'legit',
    name: 'Who\'s Who',
    description: 'Verified and well-known Nostr personalities and contributors',
    icon: 'badge-check',
    color: '#10B981', // Emerald
    order: 6
  },
  {
    id: 'niche',
    name: 'Niche & Unique',
    description: 'Special interest accounts and unique perspectives',
    icon: 'star',
    color: '#06B6D4', // Cyan
    order: 7
  },
  {
    id: 'merchants',
    name: 'Merchants & Shops',
    description: 'Businesses and merchants accepting Bitcoin and Lightning payments',
    icon: 'shopping-bag',
    color: '#8B5CF6', // Purple
    order: 8
  },
  {
    id: 'doomscrolling',
    name: 'Entertainment',
    description: 'Funny, interesting, and entertaining accounts for your feed',
    icon: 'smile',
    color: '#F97316', // Orange
    order: 9
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const getCategoriesByIds = (ids: string[]): Category[] => {
  return ids.map(id => getCategoryById(id)).filter((c): c is Category => c !== undefined);
};
