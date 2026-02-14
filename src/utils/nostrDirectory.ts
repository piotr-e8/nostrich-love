import { nip19 } from 'nostr-tools';
import {
  type NostrDirectoryResponse,
  type CachedNostrEntry,
  type BatchConfig,
  CACHE_CONFIG,
  API_CONFIG,
  DEFAULT_BATCH_CONFIG,
} from '../types/nostrDirectory';

/**
 * Converts a hex pubkey to npub format
 * @param hexPubkey - The hex-encoded public key
 * @returns The npub-encoded public key or null if invalid
 */
function hexToNpub(hexPubkey: string): string | null {
  try {
    // Validate hex string
    if (!/^[0-9a-fA-F]{64}$/.test(hexPubkey)) {
      console.error(`Invalid hex pubkey format: ${hexPubkey}`);
      return null;
    }

    // nip19.npubEncode accepts hex string directly
    return nip19.npubEncode(hexPubkey);
  } catch (error) {
    console.error('Error converting hex to npub:', error);
    return null;
  }
}

/**
 * Gets cache key for a Twitter handle
 * @param handle - The Twitter handle
 * @returns The localStorage cache key
 */
function getCacheKey(handle: string): string {
  return `${CACHE_CONFIG.keyPrefix}${handle.toLowerCase()}`;
}

/**
 * Retrieves cached entry for a handle if valid
 * @param handle - The Twitter handle
 * @returns The cached npub or null if not found/expired
 */
function getCachedEntry(handle: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cacheKey = getCacheKey(handle);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      return null;
    }

    const entry: CachedNostrEntry = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - entry.timestamp < CACHE_CONFIG.ttlMs) {
      return entry.npub;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error(`Error reading cache for ${handle}:`, error);
    return null;
  }
}

/**
 * Stores entry in cache
 * @param handle - The Twitter handle
 * @param npub - The npub to cache
 */
function setCachedEntry(handle: string, npub: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cacheKey = getCacheKey(handle);
    const entry: CachedNostrEntry = {
      npub,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.error(`Error writing cache for ${handle}:`, error);
  }
}

/**
 * Fetches a Nostr pubkey for a Twitter handle from nostr.directory
 * @param twitterHandle - The Twitter handle (without @)
 * @returns Promise resolving to npub or null if not found
 */
export async function findTwitterOnNostr(
  twitterHandle: string
): Promise<string | null> {
  // Normalize handle (remove @ prefix if present)
  const handle = twitterHandle.replace(/^@/, '').trim().toLowerCase();

  if (!handle) {
    console.error('Empty Twitter handle provided');
    return null;
  }

  // Check cache first
  const cached = getCachedEntry(handle);
  if (cached) {
    console.log(`Cache hit for ${handle}`);
    return cached;
  }

  try {
    const url = `${API_CONFIG.baseUrl}?name=${encodeURIComponent(handle)}`;
    console.log(`[nostr.directory] Fetching data for ${handle}...`);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`[nostr.directory] Timeout reached for ${handle} after 30s`);
      controller.abort();
    }, 30000); // 30 seconds timeout

    try {
        const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`[nostr.directory] Response received for ${handle}: status ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`[nostr.directory] No Nostr account found for ${handle} (404)`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NostrDirectoryResponse = await response.json();

      // Extract pubkey from response
      const pubkey = data.names?.[handle];

      if (!pubkey) {
        console.log(`[nostr.directory] No pubkey found in response for ${handle}`);
        return null;
      }

      // Convert to npub
      const npub = hexToNpub(pubkey);

      if (npub) {
        // Cache the result
        setCachedEntry(handle, npub);
        console.log(`[nostr.directory] Found Nostr account for ${handle}: ${npub}`);
      }

      return npub;
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[nostr.directory] Request timed out for ${handle} (30s exceeded)`);
        return null;
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(`[nostr.directory] Error fetching Nostr data for ${handle}:`, error);
    return null;
  }
}

/**
 * Looks up multiple Twitter handles in batches
 * @param handles - Array of Twitter handles (without @)
 * @param config - Optional batch configuration
 * @returns Promise resolving to Map of handle -> npub
 */
export async function findMultipleTwitterOnNostr(
  handles: string[],
  config: Partial<BatchConfig> = {}
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const { batchSize, delayMs } = { ...DEFAULT_BATCH_CONFIG, ...config };

  // Remove duplicates and normalize
  const uniqueHandles = [...new Set(
    handles.map((h) => h.replace(/^@/, '').trim().toLowerCase()).filter(Boolean)
  )];

  if (uniqueHandles.length === 0) {
    return results;
  }

  console.log(`Processing ${uniqueHandles.length} handles in batches of ${batchSize}...`);

  // Process in batches
  for (let i = 0; i < uniqueHandles.length; i += batchSize) {
    const batch = uniqueHandles.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(uniqueHandles.length / batchSize);

    console.log(`Processing batch ${batchNum}/${totalBatches}...`);

    // Process batch in parallel
    const batchPromises = batch.map(async (handle) => {
      try {
        const npub = await findTwitterOnNostr(handle);
        if (npub) {
          results.set(handle, npub);
        }
      } catch (error) {
        console.error(`Error processing ${handle}:`, error);
      }
    });

    await Promise.all(batchPromises);

    // Delay between batches (except for the last one)
    if (i + batchSize < uniqueHandles.length) {
      console.log(`Waiting ${delayMs}ms before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.log(`Completed! Found ${results.size}/${uniqueHandles.length} Nostr accounts`);
  return results;
}

/**
 * Parses Twitter "following" CSV export file
 * Expected format: account_id,created_at,follower_count,following_count,...
 * @param file - The CSV file from Twitter export
 * @returns Promise resolving to array of Twitter handles
 */
export async function parseTwitterFollowingCSV(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        
        if (!text) {
          reject(new Error('Failed to read file'));
          return;
        }

        const lines = text.split('\n');
        
        if (lines.length === 0) {
          resolve([]);
          return;
        }

        // Parse CSV header
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const handleIndex = headers.indexOf('username');
        const screenNameIndex = headers.indexOf('screen_name');
        const accountIdIndex = headers.indexOf('account_id');

        // Determine which column contains the handle
        const targetIndex = handleIndex !== -1 ? handleIndex : 
                           screenNameIndex !== -1 ? screenNameIndex : 
                           accountIdIndex !== -1 ? accountIdIndex : -1;

        if (targetIndex === -1) {
          // Try to find any column that looks like it contains handles
          console.warn('Could not identify handle column, using first column');
        }

        const handles: string[] = [];

        // Parse each row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (!line) continue;

          // Handle quoted CSV values
          const values: string[] = [];
          let currentValue = '';
          let insideQuotes = false;

          for (const char of line) {
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim());

          const handle = targetIndex !== -1 ? values[targetIndex] : values[0];
          
          if (handle) {
            // Remove @ if present and any surrounding quotes
            const cleanHandle = handle.replace(/^@/, '').replace(/^"/, '').replace(/"$/, '').trim();
            if (cleanHandle) {
              handles.push(cleanHandle);
            }
          }
        }

        console.log(`Parsed ${handles.length} handles from CSV`);
        resolve(handles);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Clears all cached nostr.directory entries from localStorage
 */
export function clearNostrDirectoryCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_CONFIG.keyPrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} cached entries`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Gets cache statistics
 * @returns Object with cache statistics
 */
export function getCacheStats(): { total: number; expired: number } {
  if (typeof window === 'undefined') {
    return { total: 0, expired: 0 };
  }

  let total = 0;
  let expired = 0;
  const now = Date.now();

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_CONFIG.keyPrefix)) {
        total++;
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CachedNostrEntry = JSON.parse(cached);
          if (now - entry.timestamp >= CACHE_CONFIG.ttlMs) {
            expired++;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting cache stats:', error);
  }

  return { total, expired };
}
