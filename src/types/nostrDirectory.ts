/**
 * Type definitions for nostr.directory API integration
 */

/**
 * Response from nostr.directory API for a single handle
 */
export interface NostrDirectoryResponse {
  names?: Record<string, string>;
}

/**
 * Cached entry with metadata
 */
export interface CachedNostrEntry {
  npub: string;
  timestamp: number;
}

/**
 * Configuration for batch processing
 */
export interface BatchConfig {
  batchSize: number;
  delayMs: number;
}

/**
 * Default batch configuration
 */
export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  batchSize: 5,
  delayMs: 1000,
};

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  keyPrefix: 'nostr-dir-',
  ttlMs: 24 * 60 * 60 * 1000, // 24 hours
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: 'https://nostr.directory/.well-known/nostr.json',
} as const;
