// Account Categories for Follow Pack Finder
//
// The 16 ids below are the ids that actually appear in accounts.ts — they came
// from the naddr follow packs the dataset was imported from, so several are
// opaque ("jumpstart", "legit", "doomscrolling", "mystics"). The `name` and
// `description` here are the HUMAN labels: what a beginner needs to read to
// decide whether a bucket is for them.
//
// `name`/`description` are also the English fallback for the i18n keys
// `followPack.categories.<id>.{name,description}` — see ./localize.ts. Keeping
// the strings here as well means client islands render correct labels without
// pulling the translation bundle into the page.
//
// Order matters: categories are displayed in this order, grouped by `group`.

import type { Category, CategoryGroup } from '../../types/follow-pack';

/**
 * Display bands. Sixteen flat chips read as noise; five labelled bands read as
 * a taxonomy a newcomer can navigate.
 */
export const categoryGroups: CategoryGroup[] = [
  {
    id: 'starter',
    name: 'Where to start',
    description: 'If you only pick from one band, pick from this one.',
  },
  {
    id: 'creative',
    name: 'Creative work',
    description: 'People posting things they made.',
  },
  {
    id: 'living',
    name: 'Food, land and family',
    description: 'Everyday life, cooking, growing things, raising kids.',
  },
  {
    id: 'ideas',
    name: 'Ideas and beliefs',
    description: 'Long-form thinking, faith, freedom and self-reliance.',
  },
  {
    id: 'commerce',
    name: 'Commerce and fun',
    description: 'Places to spend sats, and accounts that are just enjoyable.',
  },
];

export const categories: Category[] = [
  // --- Where to start -------------------------------------------------------
  {
    id: 'jumpstart',
    name: 'Start Here',
    description: 'A hand-picked starter set — if you follow nothing else, follow these.',
    icon: 'rocket',
    color: '#B45309', // Amber 700 — passes AA as text on white
    order: 1,
    group: 'starter',
  },
  {
    id: 'legit',
    // Was "Who's Who", which implied a vetting authority nobody exercised:
    // every row in accounts.ts has verified false/absent.
    name: 'Familiar Faces',
    description: 'Long-standing, widely-followed accounts: protocol authors, client developers, names you will keep seeing.',
    icon: 'badge-check',
    color: '#047857', // Emerald 700
    order: 2,
    group: 'starter',
  },
  {
    id: 'cool_people',
    name: 'Community Favorites',
    description: 'Accounts other Nostr users keep recommending. No single theme — just good company.',
    icon: 'heart',
    color: '#1D4ED8', // Blue 700
    order: 3,
    group: 'starter',
  },

  // --- Creative work --------------------------------------------------------
  {
    id: 'artists',
    name: 'Artists & Illustrators',
    description: 'Visual artists, illustrators and designers posting their own work.',
    icon: 'palette',
    color: '#BE185D', // Pink 700
    order: 4,
    group: 'creative',
  },
  {
    id: 'photography',
    name: 'Photographers',
    description: 'Landscape, street, wildlife and portrait work, usually at full resolution.',
    icon: 'camera',
    color: '#0F766E', // Teal 700
    order: 5,
    group: 'creative',
  },
  {
    id: 'musicians',
    name: 'Musicians',
    description: 'Musicians, producers and bands posting tracks, gigs and work in progress.',
    icon: 'music',
    color: '#6D28D9', // Violet 700
    order: 6,
    group: 'creative',
  },
  {
    id: 'books',
    name: 'Readers & Writers',
    description: 'Book reviews, reading lists, and authors talking about their craft.',
    icon: 'book',
    color: '#374151', // Gray 700
    order: 7,
    group: 'creative',
  },

  // --- Food, land and family ------------------------------------------------
  {
    id: 'foodies',
    name: 'Food & Cooking',
    description: 'Recipes, home cooking, baking, and places worth eating at.',
    icon: 'utensils',
    color: '#B91C1C', // Red 700
    order: 8,
    group: 'living',
  },
  {
    id: 'permaculture',
    name: 'Growing Food & Homesteading',
    description: 'Gardeners, farmers and homesteaders documenting regenerative practice.',
    icon: 'leaf',
    color: '#15803D', // Green 700
    order: 9,
    group: 'living',
  },
  {
    id: 'parents',
    name: 'Parents & Family Life',
    description: 'Parents, homeschoolers and family-focused accounts.',
    icon: 'heart',
    color: '#A21CAF', // Fuchsia 700
    order: 10,
    group: 'living',
  },

  // --- Ideas and beliefs ----------------------------------------------------
  {
    id: 'mystics',
    name: 'Philosophy & Spirituality',
    description: 'Contemplative writing on meaning, consciousness and the inner life.',
    icon: 'sparkles',
    color: '#4338CA', // Indigo 700
    order: 11,
    group: 'ideas',
  },
  {
    id: 'christians',
    name: 'Christian Faith',
    description: 'Christian believers, pastors and faith-centred accounts.',
    icon: 'church',
    color: '#A16207', // Yellow 700 — the old #FFD700 was unreadable as text
    order: 12,
    group: 'ideas',
  },
  {
    id: 'sovereign',
    name: 'Freedom & Self-Reliance',
    description: 'Privacy advocates, self-custody, and independent-living writing.',
    icon: 'shield',
    color: '#C2410C', // Orange 700
    order: 13,
    group: 'ideas',
  },

  // --- Commerce and fun -----------------------------------------------------
  {
    id: 'merchants',
    name: 'Shops That Take Bitcoin',
    description: 'Small businesses and makers you can pay over Lightning.',
    icon: 'shopping-bag',
    color: '#7E22CE', // Purple 700
    order: 14,
    group: 'commerce',
  },
  {
    id: 'doomscrolling',
    // Was "Entertainment", which hid what the id admits.
    name: 'Fun & Time-Wasting',
    description: 'Memes, jokes and light entertainment for when you just want to scroll.',
    icon: 'smile',
    color: '#9A3412', // Orange 800
    order: 15,
    group: 'commerce',
  },
  {
    id: 'niche',
    name: 'Oddly Specific',
    description: 'Very narrow interests and unusual perspectives you will not find elsewhere.',
    icon: 'star',
    color: '#0E7490', // Cyan 700
    order: 16,
    group: 'commerce',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const getCategoriesByIds = (ids: string[]): Category[] => {
  return ids.map(id => getCategoryById(id)).filter((c): c is Category => c !== undefined);
};

export const getCategoryGroupById = (id: string): CategoryGroup | undefined => {
  return categoryGroups.find(g => g.id === id);
};
