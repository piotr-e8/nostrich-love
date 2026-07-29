// Nostr Follow Pack Finder - Type Definitions

export type CategoryId =
  // Follow pack categories from imported naddr data
  | 'jumpstart'
  | 'artists'
  | 'photography'
  | 'musicians'
  | 'permaculture'
  | 'parents'
  | 'christians'
  | 'foodies'
  | 'mystics'
  | 'cool_people'
  | 'sovereign'
  | 'legit'
  | 'niche'
  | 'merchants'
  | 'doomscrolling'
  | 'books';

/**
 * Presentation grouping for the 16 categories. Sixteen equal chips in one flat
 * row read as noise; five bands read as a taxonomy. Grouping is display-only —
 * the account data knows nothing about it.
 */
export type CategoryGroupId = 'starter' | 'creative' | 'living' | 'ideas' | 'commerce';

export type ActivityLevel = 'high' | 'medium' | 'low';

export type ContentType = 'text' | 'image' | 'video' | 'article' | 'audio';

export interface Category {
  id: CategoryId;
  /**
   * English label, and the fallback when a locale has no
   * `followPack.categories.<id>.name` key. See getLocalizedCategories().
   */
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  group: CategoryGroupId;
}

export interface CategoryGroup {
  id: CategoryGroupId;
  name: string;
  description: string;
}

export interface CuratedAccount {
  npub: string;
  name: string;
  username?: string;
  picture?: string; // Profile image URL
  bio: string;
  categories: CategoryId[];
  tags: string[];
  followers?: number;
  following?: number;
  verified?: boolean;
  nip05?: string;
  website?: string;
  lud16?: string; // Lightning address
  activity: ActivityLevel;
  contentTypes: ContentType[];
  languages?: string[];
  region?: string;
  addedAt: string; // ISO date
  updatedAt: string; // ISO date
  notes?: string; // Internal notes for curators
}

export interface FollowPack {
  version: string;
  type: 'followpack';
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy?: string;
  accounts: PackAccount[];
  suggestedRelays: string[];
  tags?: string[];
}

export interface PackAccount {
  npub: string;
  name: string;
  categories: CategoryId[];
  petname?: string;
  relayHint?: string;
}

export interface FilterState {
  categories: CategoryId[];
  searchQuery: string;
  activityLevel: ActivityLevel | 'all';
  contentTypes: ContentType[];
  /**
   * 'curated' is the dataset's own order (the starter set first), 'name' is A-Z.
   *
   * There used to be 'popular' and 'recent' options too. Neither could work:
   * every row in accounts.ts has `followers` undefined and only two distinct
   * `addedAt` values, so both were silent no-ops. A sort control that does
   * nothing is worse than one fewer option. Same reason the "Verified only"
   * checkbox is gone — `verified` is false or absent on all 527 accounts, so
   * ticking it emptied the browser completely.
   */
  sortBy: 'curated' | 'name';
}

export interface UserSelection {
  npub: string;
  addedAt: string;
}

export interface UserPack {
  selections: UserSelection[];
  createdAt: string;
  updatedAt: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  account?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
