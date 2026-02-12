/**
 * Mock Data Index
 * Central export point for all Nostr mock data
 */

// Export types
export * from './types';

// Export utilities
export * from './utils';

// Export data
export { 
  mockUsers, 
  getUserByPubkey, 
  getUserByUsername, 
  getVerifiedUsers, 
  getUsersByBadge, 
  getRandomUsers, 
  userStats 
} from './users';

export { 
  mockNotes, 
  notesByCategory, 
  getNoteById, 
  getNotesByAuthor, 
  getNotesWithImages, 
  getMostLikedNotes, 
  getMostZappedNotes, 
  getRecentNotes, 
  noteStats 
} from './notes';

export { 
  mockThreads, 
  getThreadById, 
  getThreadByRootNoteId, 
  getThreadsByCategory, 
  getThreadsByParticipant, 
  getMostActiveThreads, 
  getRecentThreads, 
  threadStats 
} from './threads';

export { 
  mockRelays, 
  getRelayById, 
  getRelayByUrl, 
  getOnlineRelays, 
  getPaidRelays, 
  getFreeRelays, 
  getRelaysBySoftware, 
  getRelaysByNip, 
  getRelaysWithFeature, 
  getFastestRelays, 
  getLargestRelays, 
  relayStats, 
  recommendedRelays, 
  recommendedPaidRelays 
} from './relays';

// Re-export with alternative names for convenience
export { mockUsers as users } from './users';
export { mockNotes as notes } from './notes';
export { mockThreads as threads } from './threads';
export { mockRelays as relays } from './relays';
