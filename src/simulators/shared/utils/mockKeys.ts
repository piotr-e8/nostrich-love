/**
 * Mock Key Generation Utilities
 * Creates realistic-looking Nostr keys for simulation
 * NO REAL CRYPTOGRAPHY - Visual simulation only
 */

import type { MockKeyPair } from '../types';

// Base32 alphabet for bech32 encoding simulation
const BECH32_CHARS = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

// Common name parts for generating display names
const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
  'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rose', 'Sam', 'Tina',
  'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Alex', 'Bella', 'Charlie', 'Diana',
  'Ethan', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia', 'Kevin', 'Luna', 'Max', 'Nina',
  'Oscar', 'Penny', 'Quentin', 'Rachel', 'Steve', 'Tara', 'Ulysses', 'Violet', 'Will', 'Xena',
  'Yuri', 'Zoe', 'Aaron', 'Betty', 'Chris', 'Daisy', 'Eric', 'Faith', 'Gavin', 'Heather'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes'
];

const ADJECTIVES = [
  'Happy', 'Creative', 'Digital', 'Crypto', 'Sats', 'Lightning', 'Nostr', 'Open', 'Free', 'Global',
  'Bitcoin', 'Decentralized', 'Private', 'Secure', 'Fast', 'Orange', 'Purple', 'Electric', 'Cyber', 'Virtual',
  'Quantum', 'Neural', 'Solar', 'Lunar', 'Stellar', 'Cosmic', 'Atomic', 'Binary', 'Network', 'Peer'
];

const NOUNS = [
  'Nostrich', 'Pleb', 'Stacker', 'Builder', 'Coder', 'Writer', 'Thinker', 'Dreamer', 'Explorer', 'Pioneer',
  'Wizard', 'Ninja', 'Guru', 'Master', 'Hero', 'Legend', 'Champion', 'Warrior', 'Knight', 'Guardian',
  'Soul', 'Spirit', 'Mind', 'Heart', 'Voice', 'Vision', 'Light', 'Spark', 'Flame', 'Wave',
  'Node', 'Relay', 'Key', 'Block', 'Chain', 'Coin', 'Wallet', 'Signal', 'Pulse', 'Echo'
];

/**
 * Generate random string of specified length from charset
 */
function generateRandomString(length: number, charset: string): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generate a fake hex pubkey (64 characters)
 */
export function generateMockPubkey(): string {
  return generateRandomString(64, '0123456789abcdef');
}

/**
 * Generate a fake bech32-encoded npub (looks like npub1...)
 * Format: npub1 + 59 characters from bech32 charset
 */
export function generateMockNpub(): string {
  const payload = generateRandomString(59, BECH32_CHARS);
  return `npub1${payload}`;
}

/**
 * Generate a fake bech32-encoded nsec (looks like nsec1...)
 * Format: nsec1 + 59 characters from bech32 charset
 */
export function generateMockNsec(): string {
  const payload = generateRandomString(59, BECH32_CHARS);
  return `nsec1${payload}`;
}

/**
 * Generate a random display name
 */
export function generateMockDisplayName(): string {
  const useRealName = Math.random() > 0.5;
  
  if (useRealName) {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${last}`;
  } else {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(Math.random() * 9999);
    return `${adj}${noun}${number}`;
  }
}

/**
 * Generate a complete mock key pair
 */
export function generateMockKeyPair(): MockKeyPair {
  const pubkey = generateMockPubkey();
  const npub = generateMockNpub();
  const nsec = generateMockNsec();
  const displayName = generateMockDisplayName();
  
  return {
    pubkey,
    npub,
    nsec,
    displayName,
  };
}

/**
 * Generate multiple mock key pairs
 */
export function generateMockKeyPairs(count: number): MockKeyPair[] {
  return Array.from({ length: count }, () => generateMockKeyPair());
}

/**
 * Validate npub format (basic visual check)
 */
export function isValidNpubFormat(npub: string): boolean {
  return /^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{59}$/.test(npub);
}

/**
 * Validate nsec format (basic visual check)
 */
export function isValidNsecFormat(nsec: string): boolean {
  return /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{59}$/.test(nsec);
}

/**
 * Truncate npub for display (e.g., npub1abc...xyz)
 */
export function truncateNpub(npub: string, startChars = 8, endChars = 4): string {
  if (npub.length <= startChars + endChars + 3) return npub;
  return `${npub.slice(0, startChars)}...${npub.slice(-endChars)}`;
}

/**
 * Truncate nsec for display
 */
export function truncateNsec(nsec: string, startChars = 8, endChars = 4): string {
  if (nsec.length <= startChars + endChars + 3) return nsec;
  return `${nsec.slice(0, startChars)}...${nsec.slice(-endChars)}`;
}

/**
 * Convert hex pubkey to npub format (mock conversion)
 */
export function pubkeyToNpub(pubkey: string): string {
  // In real implementation this would use bech32 encoding
  // For mock, we just generate a consistent-looking npub
  if (!pubkey || pubkey.length !== 64) {
    return generateMockNpub();
  }
  
  // Generate deterministic mock npub from pubkey
  const seed = pubkey.slice(0, 16);
  const payload = generateRandomString(59, BECH32_CHARS);
  return `npub1${payload}`;
}

/**
 * Predefined mock key pairs for consistent testing
 */
export const PREDEFINED_MOCK_KEYS: MockKeyPair[] = [
  {
    pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    npub: 'npub1qgp0gyd63t5t0qd09j0q3z9g7v8f6e5d4c3b2a1m0n9b8v7c6x5z4a3s2d1f',
    nsec: 'nsec1qgp0gyd63t5t0qd09j0q3z9g7v8f6e5d4c3b2a1m0n9b8v7c6x5z4a3s2d1f',
    displayName: 'Alice Nakamoto',
  },
  {
    pubkey: 'b2c3d4e5f6a7890123456789012345678901abcdef2345678901abcdef234567',
    npub: 'npub1rhp1hzd74u6u1re1qe0r1a4s0f7t8y9u0i1o2p3l4k5j6h7g8f9d0s1a2z3x',
    nsec: 'nsec1rhp1hzd74u6u1re1qe0r1a4s0f7t8y9u0i1o2p3l4k5j6h7g8f9d0s1a2z3x',
    displayName: 'Bob Cryptographer',
  },
  {
    pubkey: 'c3d4e5f6a7b8901234567890123456789012abcdef3456789012abcdef345678',
    npub: 'npub1sip1i2e85v7v2rf2qf2b5t1u0y9i8o7p6l5k4j3h2g1f0d9s8a7z6x5c4v3b',
    nsec: 'nsec1sip1i2e85v7v2rf2qf2b5t1u0y9i8o7p6l5k4j3h2g1f0d9s8a7z6x5c4v3b',
    displayName: 'Carol Lightning',
  },
];

/**
 * Get a predefined mock key by index
 */
export function getPredefinedMockKey(index: number): MockKeyPair {
  return PREDEFINED_MOCK_KEYS[index % PREDEFINED_MOCK_KEYS.length];
}
