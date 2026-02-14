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
    id: 'photography',
    name: 'Photography',
    description: 'Photographers capturing moments, landscapes, wildlife, and street scenes',
    icon: 'camera',
    color: '#14B8A6', // Teal
    order: 3
  },
  {
    id: 'musicians',
    name: 'Musicians',
    description: 'Musicians, producers, bands, and music creators on Nostr',
    icon: 'music',
    color: '#8B5CF6', // Purple
    order: 4
  },
  {
    id: 'permaculture',
    name: 'Permaculture',
    description: 'Homesteaders, farmers, gardeners, and regenerative agriculture practitioners',
    icon: 'leaf',
    color: '#22C55E', // Green
    order: 5
  },
  {
    id: 'parents',
    name: 'Parents & Families',
    description: 'Parents, homeschoolers, and family-focused accounts',
    icon: 'heart',
    color: '#F472B6', // Pink
    order: 6
  },
  {
    id: 'christians',
    name: 'Christians',
    description: 'Christian believers, churches, and faith-focused accounts',
    icon: 'church',
    color: '#FFD700', // Gold
    order: 7
  },
  {
    id: 'foodies',
    name: 'Foodies',
    description: 'Chefs, cooks, food bloggers, and culinary enthusiasts',
    icon: 'utensils',
    color: '#FF6B6B', // Coral
    order: 8
  },
  {
    id: 'mystics',
    name: 'Mystics & Spirituality',
    description: 'Spiritual thinkers, mystics, and those exploring consciousness',
    icon: 'sparkles',
    color: '#6366F1', // Indigo
    order: 9
  },
  {
    id: 'cool_people',
    name: 'Cool People',
    description: 'Interesting folks recommended by the community',
    icon: 'heart',
    color: '#3B82F6', // Blue
    order: 10
  },
  {
    id: 'sovereign',
    name: 'Sovereign Individuals',
    description: 'Freedom advocates, privacy enthusiasts, and independent thinkers',
    icon: 'shield',
    color: '#EF4444', // Red
    order: 11
  },
  {
    id: 'legit',
    name: 'Who\'s Who',
    description: 'Verified and well-known Nostr personalities and contributors',
    icon: 'badge-check',
    color: '#10B981', // Emerald
    order: 12
  },
  {
    id: 'niche',
    name: 'Niche & Unique',
    description: 'Special interest accounts and unique perspectives',
    icon: 'star',
    color: '#06B6D4', // Cyan
    order: 13
  },
  {
    id: 'merchants',
    name: 'Merchants & Shops',
    description: 'Businesses and merchants accepting Bitcoin and Lightning payments',
    icon: 'shopping-bag',
    color: '#8B5CF6', // Purple
    order: 14
  },
  {
    id: 'doomscrolling',
    name: 'Entertainment',
    description: 'Funny, interesting, and entertaining accounts for your feed',
    icon: 'smile',
    color: '#F97316', // Orange
    order: 15
  },
  {
    id: 'books',
    name: 'Book Lovers',
    description: 'Readers, authors, book reviewers, and literary enthusiasts',
    icon: 'book',
    color: '#4B5563', // Gray/Charcoal
    order: 16
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const getCategoriesByIds = (ids: string[]): Category[] => {
  return ids.map(id => getCategoryById(id)).filter((c): c is Category => c !== undefined);
};
