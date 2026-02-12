// Nostr Follow Pack Finder - Type Definitions

export type CategoryId =
  // Follow pack categories from imported naddr data
  | 'jumpstart'
  | 'artists'
  | 'mystics'
  | 'cool_people'
  | 'sovereign'
  | 'legit'
  | 'niche'
  | 'merchants'
  | 'doomscrolling';

export type ActivityLevel = 'high' | 'medium' | 'low';

export type ContentType = 'text' | 'image' | 'video' | 'article' | 'audio';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
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
  verifiedOnly: boolean;
  sortBy: 'popular' | 'active' | 'name' | 'recent';
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
