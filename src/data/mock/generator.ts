/**
 * Data Generator
 * Programmatic utilities for creating new mock data
 */

import type { MockUser, MockNote, MockThread, MockRelay, NostrEvent, ContentCategory } from './types';
import { EventKind } from './types';
import {
  generateHex,
  generateNpub,
  generateRealisticTimestamp,
  generateSig,
  generateFollowerCount,
  generateEngagement,
  createTags,
  getSampleImages,
  extractHashtags,
  extractMentions,
  extractUrls,
  generateAvatarGradient,
  validateEvent,
} from './utils';
import { mockUsers } from './users';

// Content generators for different categories
const contentGenerators: Record<ContentCategory, string[]> = {
  bitcoin: [
    'Bitcoin is the hardest money ever created. Change my mind.',
    'Just stacked some sats. The journey continues!',
    'Not your keys, not your coins. Simple as that.',
    'The halving is coming. Are you ready?',
    'Lightning Network just keeps getting better.',
  ],
  tech: [
    'Nostr is what social media should have been from the start.',
    'Decentralization is the future. No more platform risk.',
    'Just deployed my own relay. Feels good.',
    'The simplicity of the Nostr protocol is beautiful.',
    'Web5 who? Nostr is here today.',
  ],
  programming: [
    'Code review tip: focus on the logic, not the style.',
    'Rust\'s borrow checker is frustrating until it\'s not.',
    'TypeScript makes JavaScript actually enjoyable.',
    'Just refactored 500 lines into 50. Clean code matters.',
    'Functional programming changed how I think.',
  ],
  philosophy: [
    'Freedom is not given. It is taken.',
    'Question everything, especially your own beliefs.',
    'The unexamined life is not worth living.',
    'Truth is treason in an empire of lies.',
    'Individual liberty is the foundation of society.',
  ],
  personal: [
    'Coffee and code. Perfect morning.',
    'Just hit a new PR at the gym!',
    'Grateful for this community.',
    'Taking a break from screens this weekend.',
    'Small wins add up. Keep going.',
  ],
  memes: [
    'Money printer go brrrrrr',
    'Me checking Bitcoin price every 5 minutes',
    'Fiat: infinite supply. Bitcoin: 21 million.',
    'When someone asks if it\'s too late to buy Bitcoin',
    'DCA gang rise up',
  ],
  questions: [
    'Best resources for learning Rust?',
    'How do you secure your seed phrase?',
    'What\'s your favorite Nostr client?',
    'Thoughts on Taproot?',
    'Lightning wallet recommendations?',
  ],
  nostr: [
    'Nostr feels like early Twitter.',
    'Just got my first zap!',
    'Running my own relay was easier than expected.',
    'The zaps feature is genius.',
    'Nostr makes me excited about social again.',
  ],
  art: [
    'Just finished this piece.',
    'Digital art is the future.',
    'Working on a new collection.',
    'Art is how we decorate space.',
    'Creative process is messy but beautiful.',
  ],
  music: [
    'New track dropping soon.',
    'What are you listening to?',
    'Just recorded a new riff.',
    'Music is the universal language.',
    'Practice makes perfect.',
  ],
  politics: [
    'Censorship is not safety.',
    'Privacy is a fundamental right.',
    'Bitcoin is protest.',
    'Decentralize everything.',
    'Freedom of speech matters.',
  ],
  science: [
    'The universe is vast.',
    'Science is about finding truth.',
    'Curiosity drives discovery.',
    'Every answer leads to more questions.',
    'The scientific method is humanity\'s gift.',
  ],
  news: [
    'Breaking: new development in Bitcoin.',
    'Conference season is here.',
    'Adoption continues to grow.',
    'Another country considering Bitcoin.',
    'Technology keeps improving.',
  ],
  other: [
    'Just a thought.',
    'Life is weird and wonderful.',
    'Appreciating the moment.',
    'Random observation.',
    'Thanks for being awesome.',
  ],
};

// User name generators
const firstNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
  'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sarah', 'Tom',
  'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Emma', 'Liam', 'Sophia', 'Lucas',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
];

const adjectives = [
  'Happy', 'Crypto', 'Digital', 'Nostr', 'Bitcoin', 'Tech', 'Cyber', 'Virtual', 'Web3', 'Decentralized',
  'Private', 'Secure', 'Free', 'Open', 'Global', 'Local', 'Fast', 'Smart', 'Wise', 'Bright',
];

const nouns = [
  'User', 'Node', 'Relay', 'Miner', 'Stacker', 'Coder', 'Builder', 'Thinker', 'Dreamer', 'Explorer',
  'Pioneer', 'Creator', 'Maker', 'Hodler', 'Runner', 'Rider', 'Walker', 'Surfer', 'Climber', 'Flyer',
];

/**
 * Generate a random username
 */
export function generateUsername(): string {
  const type = Math.random();
  if (type < 0.33) {
    // FirstNameLastName
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]}_${lastNames[Math.floor(Math.random() * lastNames.length)]}`.toLowerCase();
  } else if (type < 0.66) {
    // AdjectiveNoun
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}`.toLowerCase();
  } else {
    // Random alphanumeric
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}

/**
 * Generate a random display name
 */
export function generateDisplayName(): string {
  const type = Math.random();
  if (type < 0.4) {
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  } else if (type < 0.7) {
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  } else {
    return generateUsername();
  }
}

/**
 * Generate a random bio
 */
export function generateBio(): string {
  const bios = [
    'Just here for the tech.',
    'Bitcoin enthusiast. Nostr user.',
    'Building the future, one block at a time.',
    'Privacy advocate. Freedom lover.',
    'Developer. Open source contributor.',
    'Digital nomad. Bitcoin traveler.',
    'Learning something new every day.',
    'Stacking sats and staying humble.',
    'Decentralization maximalist.',
    'Exploring the Nostr ecosystem.',
    'Freedom is the goal.',
    'Bitcoin fixes this.',
    'Just a person on the internet.',
    'Crypto curious.',
    'Running my own relay.',
    'Coding by day, Bitcoin by night.',
    'Seeking truth in a world of lies.',
    'Individual liberty above all.',
    'Ask me about Bitcoin.',
    'Living the dream.',
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

/**
 * Generate a random location
 */
export function generateLocation(): string {
  const locations = [
    'USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
    'Japan', 'South Korea', 'Singapore', 'Australia', 'Brazil', 'Mexico',
    'Cyberspace', 'The Internet', 'Remote', 'Earth', 'Moon', 'Bitcoinland',
    'NYC', 'London', 'Tokyo', 'Berlin', 'Paris', 'Toronto', 'Austin', 'Miami',
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

/**
 * Generate a random website
 */
export function generateWebsite(): string | undefined {
  if (Math.random() < 0.4) {
    return undefined;
  }
  const sites = [
    'https://github.com',
    'https://twitter.com',
    'https://linkedin.com',
    'https://medium.com',
    'https://substack.com',
    'https://wordpress.com',
  ];
  return `${sites[Math.floor(Math.random() * sites.length)]}/${generateUsername()}`;
}

/**
 * Generate a random Lightning address
 */
export function generateLightningAddress(): string | undefined {
  if (Math.random() < 0.5) {
    return undefined;
  }
  const providers = ['getalby.com', 'walletofsatoshi.com', 'strike.me', 'sbw.app'];
  return `${generateUsername()}@${providers[Math.floor(Math.random() * providers.length)]}`;
}

/**
 * Create a new mock user
 */
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  const pubkey = generateNpub();
  const username = overrides?.username || generateUsername();
  
  return {
    pubkey,
    displayName: overrides?.displayName || generateDisplayName(),
    username,
    avatar: generateAvatarGradient(pubkey),
    bio: overrides?.bio || generateBio(),
    website: overrides?.website || generateWebsite(),
    location: overrides?.location || (Math.random() < 0.6 ? generateLocation() : undefined),
    lightningAddress: overrides?.lightningAddress || generateLightningAddress(),
    nip05: overrides?.nip05 || (Math.random() < 0.2 ? `${username}@example.com` : undefined),
    followersCount: overrides?.followersCount || generateFollowerCount(),
    followingCount: overrides?.followingCount || Math.floor(Math.random() * 1000),
    createdAt: overrides?.createdAt || generateRealisticTimestamp(365),
    lastActive: overrides?.lastActive || generateRealisticTimestamp(7),
    isVerified: overrides?.isVerified || Math.random() < 0.1,
    badges: overrides?.badges || (Math.random() < 0.2 ? ['bitcoiner'] : undefined),
    ...overrides,
  };
}

/**
 * Create multiple mock users
 */
export function createMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, () => createMockUser());
}

/**
 * Generate random content for a category
 */
export function generateContent(category: ContentCategory): string {
  const templates = contentGenerators[category] || contentGenerators.other;
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Create a new mock note
 */
export function createMockNote(
  author: MockUser,
  category: ContentCategory = ContentCategory.OTHER,
  overrides?: Partial<MockNote>
): MockNote {
  const content = overrides?.content || generateContent(category);
  const mentions = extractMentions(content);
  const hashtags = extractHashtags(content);
  const links = extractUrls(content);
  const timestamp = overrides?.created_at || generateRealisticTimestamp(30);
  const isHighQuality = author.isVerified || author.followersCount > 5000;
  const engagement = generateEngagement(author.followersCount, isHighQuality);
  
  return {
    id: overrides?.id || generateHex(),
    pubkey: overrides?.pubkey || author.pubkey,
    created_at: timestamp,
    kind: overrides?.kind || EventKind.TEXT_NOTE,
    tags: overrides?.tags || createTags(mentions, hashtags),
    content,
    sig: overrides?.sig || generateSig(),
    likes: overrides?.likes ?? engagement.likes,
    reposts: overrides?.reposts ?? engagement.reposts,
    replies: overrides?.replies ?? 0,
    zaps: overrides?.zaps ?? engagement.zaps,
    zapAmount: overrides?.zapAmount ?? engagement.zapAmount,
    isRepost: overrides?.isRepost || false,
    repostedBy: overrides?.repostedBy,
    images: overrides?.images || (Math.random() < 0.2 ? getSampleImages(Math.floor(Math.random() * 3) + 1) : undefined),
    mentions,
    hashtags,
    links,
    category,
    ...overrides,
  };
}

/**
 * Create multiple mock notes
 */
export function createMockNotes(
  authors: MockUser[],
  count: number,
  categoryDistribution?: Partial<Record<ContentCategory, number>>
): MockNote[] {
  const categories = Object.values(ContentCategory);
  
  return Array.from({ length: count }, () => {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    return createMockNote(author, category);
  });
}

/**
 * Create a mock relay
 */
export function createMockRelay(overrides?: Partial<MockRelay>): MockRelay {
  const isPaid = overrides?.isPaid ?? Math.random() < 0.2;
  const isOnline = overrides?.isOnline ?? Math.random() > 0.05;
  
  return {
    id: overrides?.id || generateHex(32),
    url: overrides?.url || `wss://relay${Math.floor(Math.random() * 1000)}.nostr.test`,
    name: overrides?.name || `Relay ${Math.floor(Math.random() * 1000)}`,
    description: overrides?.description || 'A Nostr relay',
    owner: overrides?.owner || 'Community',
    supportedNips: overrides?.supportedNips || [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: overrides?.software || 'strfry',
    version: overrides?.version || '1.0.0',
    isPaid,
    paymentTerms: isPaid ? `${1000 + Math.floor(Math.random() * 4000)} sats/month` : undefined,
    isOnline,
    latency: overrides?.latency ?? (isOnline ? Math.floor(Math.random() * 100) + 20 : 9999),
    userCount: overrides?.userCount ?? Math.floor(Math.random() * 50000),
    lastSeen: overrides?.lastSeen || generateRealisticTimestamp(1),
    restrictions: overrides?.restrictions || {
      authRequired: isPaid,
      paymentRequired: isPaid,
      writeRestricted: false,
    },
    features: overrides?.features || (Math.random() < 0.3 ? ['search'] : undefined),
    ...overrides,
  };
}

/**
 * Create multiple mock relays
 */
export function createMockRelays(count: number): MockRelay[] {
  return Array.from({ length: count }, () => createMockRelay());
}

/**
 * Create a mock thread (simplified)
 */
export function createMockThread(
  rootAuthor: MockUser,
  replyCount: number = 5,
  overrides?: Partial<MockThread>
): MockThread {
  const rootNote = createMockNote(rootAuthor, ContentCategory.QUESTIONS);
  const participants = new Set<string>([rootAuthor.pubkey]);
  const notes: MockNote[] = [rootNote];
  
  for (let i = 0; i < replyCount; i++) {
    const replyAuthor = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    participants.add(replyAuthor.pubkey);
    
    const replyNote = createMockNote(replyAuthor, ContentCategory.OTHER, {
      tags: createTags([], [], rootNote.id, rootNote.id),
    });
    notes.push(replyNote);
  }
  
  return {
    id: overrides?.id || generateHex(),
    rootNoteId: rootNote.id,
    participants: Array.from(participants),
    notes,
    replyCount: notes.length - 1,
    lastActivity: Math.max(...notes.map(n => n.created_at)),
    category: rootNote.category,
    ...overrides,
  };
}

/**
 * Create multiple mock threads
 */
export function createMockThreads(count: number): MockThread[] {
  return Array.from({ length: count }, () => 
    createMockThread(
      mockUsers[Math.floor(Math.random() * mockUsers.length)],
      Math.floor(Math.random() * 10) + 2
    )
  );
}

/**
 * Batch data generator for complete datasets
 */
export function generateCompleteDataset(options: {
  userCount?: number;
  notesPerUser?: number;
  threadCount?: number;
  relayCount?: number;
} = {}): {
  users: MockUser[];
  notes: MockNote[];
  threads: MockThread[];
  relays: MockRelay[];
} {
  const {
    userCount = 50,
    notesPerUser = 5,
    threadCount = 20,
    relayCount = 30,
  } = options;
  
  const users = createMockUsers(userCount);
  const notes = createMockNotes(users, userCount * notesPerUser);
  const threads = createMockThreads(threadCount);
  const relays = createMockRelays(relayCount);
  
  return { users, notes, threads, relays };
}

// Export all generators
export const DataGenerator = {
  generateUsername,
  generateDisplayName,
  generateBio,
  generateLocation,
  generateWebsite,
  generateLightningAddress,
  createMockUser,
  createMockUsers,
  generateContent,
  createMockNote,
  createMockNotes,
  createMockRelay,
  createMockRelays,
  createMockThread,
  createMockThreads,
  generateCompleteDataset,
};

export default DataGenerator;
