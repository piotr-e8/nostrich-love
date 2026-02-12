/**
 * Mock Relay Database
 * 30+ realistic Nostr relay configurations
 */

import type { MockRelay } from './types';
import { generateHex, generateTimestamp } from './utils';

export const mockRelays: MockRelay[] = [
  // Major Public Relays
  {
    id: generateHex(32),
    url: 'wss://relay.damus.io',
    name: 'Damus Relay',
    description: 'Main relay operated by Damus team. High performance, reliable.',
    owner: 'Damus',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 45,
    userCount: 45230,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['search', 'trending'],
  },
  {
    id: generateHex(32),
    url: 'wss://relay.snort.social',
    name: 'Snort Social',
    description: 'Official Snort relay. Fast and reliable.',
    owner: 'Snort',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 38,
    userCount: 32100,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['search'],
  },
  {
    id: generateHex(32),
    url: 'wss://nos.lol',
    name: 'Nos LOL',
    description: 'General purpose relay with good uptime.',
    owner: 'Community',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: false,
    isOnline: true,
    latency: 52,
    userCount: 28900,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.primal.net',
    name: 'Primal Relay',
    description: 'High-performance relay operated by Primal. Excellent caching.',
    owner: 'Primal',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42, 50],
    software: 'custom',
    version: '2.1.0',
    isPaid: false,
    isOnline: true,
    latency: 25,
    userCount: 38900,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['search', 'trending', 'recommendations'],
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostr.band',
    name: 'Nostr Band',
    description: 'Relay with advanced search and analytics.',
    owner: 'Nostr Band',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 50],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 41,
    userCount: 21500,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['search', 'analytics'],
  },
  
  // Regional Relays
  {
    id: generateHex(32),
    url: 'wss://relay.current.fyi',
    name: 'Current FYI',
    description: 'US-based relay with good performance.',
    owner: 'Current',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: false,
    isOnline: true,
    latency: 35,
    userCount: 18700,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://nostr-relay.wlvs.space',
    name: 'Wolves Relay',
    description: 'Community relay with focus on freedom and privacy.',
    owner: 'WLVS',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 48,
    userCount: 12300,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://nostr.oxtr.dev',
    name: 'Oxtr Dev',
    description: 'Developer-focused relay with NIP support.',
    owner: 'Oxtr',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 55,
    userCount: 9800,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['search'],
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostr.bg',
    name: 'Nostr Bulgaria',
    description: 'Relay serving the Bulgarian Nostr community.',
    owner: 'Nostr BG',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: false,
    isOnline: true,
    latency: 62,
    userCount: 3400,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://nostr.fmt.wiz.biz',
    name: 'Wiz Business',
    description: 'Business and finance focused relay.',
    owner: 'Wiz',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 43,
    userCount: 15600,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  
  // Paid Relays
  {
    id: generateHex(32),
    url: 'wss://nostr.milks.io',
    name: 'Milks Relay',
    description: 'High-quality paid relay. No spam, high performance.',
    owner: 'Milks',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'strfry',
    version: '1.0.0',
    isPaid: true,
    paymentTerms: '1000 sats/month',
    isOnline: true,
    latency: 28,
    userCount: 4500,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: true,
      paymentRequired: true,
      writeRestricted: false,
    },
    features: ['search', 'spam-free'],
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostrplebs.com',
    name: 'Nostr Plebs',
    description: 'Community-supported relay with premium features.',
    owner: 'Nostr Plebs',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: true,
    paymentTerms: 'One-time 5000 sats',
    isOnline: true,
    latency: 39,
    userCount: 3200,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: true,
      paymentRequired: true,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://paid.no.str.cr',
    name: 'NoStr Cr Paid',
    description: 'Premium relay with guaranteed uptime and support.',
    owner: 'NoStr',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42, 50],
    software: 'strfry',
    version: '1.0.0',
    isPaid: true,
    paymentTerms: '2000 sats/month',
    isOnline: true,
    latency: 32,
    userCount: 2100,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: true,
      paymentRequired: true,
      writeRestricted: false,
    },
    features: ['search', 'priority-support'],
  },
  
  // Specialized Relays
  {
    id: generateHex(32),
    url: 'wss://relay.mostr.pub',
    name: 'Mostr Pub',
    description: 'Bridge relay connecting Nostr and ActivityPub (Mastodon).',
    owner: 'Mostr',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 57],
    software: 'custom',
    version: '1.5.0',
    isPaid: false,
    isOnline: true,
    latency: 58,
    userCount: 18900,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['bridge', 'activitypub'],
  },
  {
    id: generateHex(32),
    url: 'wss://relay.bitcoiner.social',
    name: 'Bitcoiner Social',
    description: 'Bitcoin-focused community relay.',
    owner: 'Bitcoiner Social',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 44,
    userCount: 23400,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostr.com.au',
    name: 'Nostr Australia',
    description: 'Relay for the Australian Nostr community.',
    owner: 'Nostr AU',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: false,
    isOnline: true,
    latency: 67,
    userCount: 5600,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostrview.com',
    name: 'Nostr View',
    description: 'Relay optimized for media and image sharing.',
    owner: 'Nostr View',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 68, 94],
    software: 'custom',
    version: '3.0.1',
    isPaid: false,
    isOnline: true,
    latency: 51,
    userCount: 12800,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['media', 'images'],
  },
  
  // Development/Testing Relays
  {
    id: generateHex(32),
    url: 'wss://relay.stoner.com',
    name: 'Stoner Relay',
    description: 'Experimental relay for testing new features.',
    owner: 'Stoner',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42, 50, 56, 57],
    software: 'experimental',
    version: '0.9.0-beta',
    isPaid: false,
    isOnline: true,
    latency: 72,
    userCount: 3400,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
    features: ['experimental', 'beta-features'],
  },
  {
    id: generateHex(32),
    url: 'wss://test.nostr.cloud',
    name: 'Nostr Test Cloud',
    description: 'Testing relay for developers. Data may be cleared.',
    owner: 'Nostr Cloud',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'nostr-rs-relay',
    version: '0.9.0-dev',
    isPaid: false,
    isOnline: true,
    latency: 85,
    userCount: 890,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  
  // Offline/Problematic Relays
  {
    id: generateHex(32),
    url: 'wss://relay.old.nostr',
    name: 'Old Nostr Relay',
    description: 'Legacy relay, currently offline for maintenance.',
    owner: 'Unknown',
    supportedNips: [1, 2, 4, 9, 11],
    software: 'unknown',
    version: '0.1.0',
    isPaid: false,
    isOnline: false,
    latency: 9999,
    userCount: 0,
    lastSeen: generateTimestamp(7),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.spam.nostr',
    name: 'Spam Relay',
    description: 'Known for spam, not recommended.',
    owner: 'Spam Corp',
    supportedNips: [1, 2],
    software: 'unknown',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 120,
    userCount: 150,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  
  // More Active Relays
  {
    id: generateHex(32),
    url: 'wss://relay.nostr.info',
    name: 'Nostr Info',
    description: 'Information and news focused relay.',
    owner: 'Nostr Info',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 47,
    userCount: 16500,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.plebstr.com',
    name: 'Plebstr Relay',
    description: 'Relay for Plebstr client users.',
    owner: 'Plebstr',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 41,
    userCount: 19800,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostr.wine',
    name: 'Nostr Wine',
    description: 'Sophisticated relay for quality discussions.',
    owner: 'Nostr Wine',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: true,
    paymentTerms: '500 sats/month',
    isOnline: true,
    latency: 36,
    userCount: 4200,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: true,
      paymentRequired: true,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.snort.social/paid',
    name: 'Snort Premium',
    description: 'Premium relay for Snort users.',
    owner: 'Snort',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42, 50],
    software: 'strfry',
    version: '1.0.0',
    isPaid: true,
    paymentTerms: '2000 sats/month',
    isOnline: true,
    latency: 29,
    userCount: 6800,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: true,
      paymentRequired: true,
      writeRestricted: false,
    },
    features: ['search', 'priority'],
  },
  {
    id: generateHex(32),
    url: 'wss://relay.amethyst.social',
    name: 'Amethyst Relay',
    description: 'Official relay for Amethyst Android users.',
    owner: 'Amethyst',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 42,
    userCount: 24500,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.iris.to',
    name: 'Iris Relay',
    description: 'Relay operated by Iris.to team.',
    owner: 'Iris',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'nostr-rs-relay',
    version: '0.8.2',
    isPaid: false,
    isOnline: true,
    latency: 49,
    userCount: 14200,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.coracle.social',
    name: 'Coracle Relay',
    description: 'Relay for Coracle client users.',
    owner: 'Coracle',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 42],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 53,
    userCount: 11200,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
  {
    id: generateHex(32),
    url: 'wss://relay.nostriches.org',
    name: 'Nostriches',
    description: 'Community relay with ostrich theme.',
    owner: 'Nostriches',
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    software: 'strfry',
    version: '1.0.0',
    isPaid: false,
    isOnline: true,
    latency: 56,
    userCount: 7800,
    lastSeen: generateTimestamp(1),
    restrictions: {
      authRequired: false,
      paymentRequired: false,
      writeRestricted: false,
    },
  },
];

// Helper functions
export function getRelayById(id: string): MockRelay | undefined {
  return mockRelays.find(r => r.id === id);
}

export function getRelayByUrl(url: string): MockRelay | undefined {
  return mockRelays.find(r => r.url === url);
}

export function getOnlineRelays(): MockRelay[] {
  return mockRelays.filter(r => r.isOnline);
}

export function getPaidRelays(): MockRelay[] {
  return mockRelays.filter(r => r.isPaid);
}

export function getFreeRelays(): MockRelay[] {
  return mockRelays.filter(r => !r.isPaid);
}

export function getRelaysBySoftware(software: string): MockRelay[] {
  return mockRelays.filter(r => r.software?.toLowerCase() === software.toLowerCase());
}

export function getRelaysByNip(nip: number): MockRelay[] {
  return mockRelays.filter(r => r.supportedNips.includes(nip));
}

export function getRelaysWithFeature(feature: string): MockRelay[] {
  return mockRelays.filter(r => r.features?.includes(feature));
}

export function getFastestRelays(count: number = 5): MockRelay[] {
  return [...mockRelays]
    .filter(r => r.isOnline)
    .sort((a, b) => a.latency - b.latency)
    .slice(0, count);
}

export function getLargestRelays(count: number = 5): MockRelay[] {
  return [...mockRelays]
    .sort((a, b) => b.userCount - a.userCount)
    .slice(0, count);
}

// Relay statistics
export const relayStats = {
  total: mockRelays.length,
  online: mockRelays.filter(r => r.isOnline).length,
  offline: mockRelays.filter(r => !r.isOnline).length,
  paid: mockRelays.filter(r => r.isPaid).length,
  free: mockRelays.filter(r => !r.isPaid).length,
  withAuth: mockRelays.filter(r => r.restrictions?.authRequired).length,
  avgLatency: Math.floor(
    mockRelays
      .filter(r => r.isOnline && r.latency < 1000)
      .reduce((acc, r) => acc + r.latency, 0) / 
    mockRelays.filter(r => r.isOnline && r.latency < 1000).length
  ),
  totalUsers: mockRelays.reduce((acc, r) => acc + r.userCount, 0),
  softwareTypes: [...new Set(mockRelays.map(r => r.software).filter(Boolean))],
};

// Default relay recommendations for new users
export const recommendedRelays = [
  'wss://relay.damus.io',
  'wss://relay.snort.social',
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
];

// Paid relay recommendations
export const recommendedPaidRelays = [
  'wss://nostr.milks.io',
  'wss://relay.nostrplebs.com',
  'wss://relay.snort.social/paid',
  'wss://relay.nostr.wine',
];

export default mockRelays;
