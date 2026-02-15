import { getPublicKey } from 'nostr-tools/pure';
import * as nip44 from 'nostr-tools/nip44';
import type { AIMemoryEvent } from './identity.js';

// Memory with metadata
export interface StoredMemory {
  event: AIMemoryEvent;
  encrypted: boolean;
  decryptedContent?: string;
  tags: Map<string, string[]>;
  timestamp: number;
}

// Query filters
export interface MemoryQuery {
  tags?: Record<string, string>;  // { "t": "lesson", "priority": "high" }
  after?: number;                 // Unix timestamp
  before?: number;                // Unix timestamp
  contentType?: string;           // "lesson", "mistake", "decision"
  encrypted?: boolean;            // true, false, or undefined (both)
}

// AI Memory Store
export class MemoryStore {
  private memories: Map<string, StoredMemory> = new Map();
  private storageKey: string;
  private encryptionKey?: Uint8Array;

  constructor(identityName: string, encryptionKey?: Uint8Array) {
    this.storageKey = `ai-memories-${identityName.toLowerCase()}`;
    this.encryptionKey = encryptionKey;
    this.loadFromStorage();
  }

  // Load memories from localStorage
  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.memories = new Map(Object.entries(parsed));
        console.log(`🧠 Loaded ${this.memories.size} memories from storage`);
      } catch (e) {
        console.error('Failed to load memories:', e);
      }
    }
  }

  // Save memories to localStorage
  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    
    const obj = Object.fromEntries(this.memories);
    localStorage.setItem(this.storageKey, JSON.stringify(obj));
  }

  // Store a new memory
  store(memory: AIMemoryEvent, encryptContent: boolean = false): StoredMemory {
    const tags = this.parseTags(memory.tags);
    let content = memory.content;
    let isEncrypted = false;

    // Encrypt content if requested and we have an encryption key
    if (encryptContent && this.encryptionKey) {
      const recipientPubkey = getPublicKey(this.encryptionKey);
      const conversationKey = nip44.getConversationKey(this.encryptionKey, recipientPubkey);
      content = nip44.encrypt(memory.content, conversationKey);
      isEncrypted = true;
      console.log(`🔒 Memory encrypted`);
    }

    const stored: StoredMemory = {
      event: memory,
      encrypted: isEncrypted,
      decryptedContent: isEncrypted ? undefined : memory.content,
      tags,
      timestamp: memory.created_at
    };

    this.memories.set(memory.id, stored);
    this.saveToStorage();
    
    console.log(`💾 Stored memory: ${memory.id.slice(0, 16)}...`);
    return stored;
  }

  // Parse tags into a Map for easier querying
  private parseTags(tags: string[][]): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const [key, ...values] of tags) {
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(...values);
    }
    return map;
  }

  // Retrieve a single memory by ID
  get(id: string): StoredMemory | null {
    const memory = this.memories.get(id);
    if (memory && memory.encrypted && !memory.decryptedContent && this.encryptionKey) {
      // Auto-decrypt if we have the key
      this.decryptMemory(memory);
    }
    return memory || null;
  }

  // Query memories with filters
  query(filters: MemoryQuery = {}): StoredMemory[] {
    let results = Array.from(this.memories.values());

    // Filter by tags
    if (filters.tags) {
      results = results.filter(m => {
        for (const [key, value] of Object.entries(filters.tags!)) {
          const tagValues = m.tags.get(key);
          if (!tagValues || !tagValues.includes(value)) {
            return false;
          }
        }
        return true;
      });
    }

    // Filter by time range
    if (filters.after) {
      results = results.filter(m => m.timestamp >= filters.after!);
    }
    if (filters.before) {
      results = results.filter(m => m.timestamp <= filters.before!);
    }

    // Filter by encryption status
    if (filters.encrypted !== undefined) {
      results = results.filter(m => m.encrypted === filters.encrypted);
    }

    // Filter by content type (stored in event content)
    if (filters.contentType) {
      results = results.filter(m => {
        try {
          const content = JSON.parse(m.decryptedContent || m.event.content);
          return content.type === filters.contentType;
        } catch {
          return false;
        }
      });
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);

    // Auto-decrypt if needed
    if (this.encryptionKey) {
      results.forEach(m => {
        if (m.encrypted && !m.decryptedContent) {
          this.decryptMemory(m);
        }
      });
    }

    return results;
  }

  // Decrypt a memory
  private decryptMemory(memory: StoredMemory): boolean {
    if (!this.encryptionKey || !memory.encrypted) return false;

    try {
      const recipientPubkey = getPublicKey(this.encryptionKey);
      const conversationKey = nip44.getConversationKey(this.encryptionKey, recipientPubkey);
      memory.decryptedContent = nip44.decrypt(memory.event.content, conversationKey);
      return true;
    } catch (e) {
      console.error('Failed to decrypt memory:', e);
      return false;
    }
  }

  // Get all memories
  getAll(): StoredMemory[] {
    return this.query();
  }

  // Get memory count
  count(): number {
    return this.memories.size;
  }

  // Delete a memory
  delete(id: string): boolean {
    const deleted = this.memories.delete(id);
    if (deleted) {
      this.saveToStorage();
      console.log(`🗑️  Deleted memory: ${id.slice(0, 16)}...`);
    }
    return deleted;
  }

  // Clear all memories
  clear(): void {
    this.memories.clear();
    this.saveToStorage();
    console.log('🗑️  Cleared all memories');
  }

  // Get stats
  getStats(): { total: number; encrypted: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    for (const memory of this.memories.values()) {
      try {
        const content = JSON.parse(memory.decryptedContent || memory.event.content);
        const type = content.type || 'unknown';
        byType[type] = (byType[type] || 0) + 1;
      } catch {
        byType['unknown'] = (byType['unknown'] || 0) + 1;
      }
    }

    return {
      total: this.memories.size,
      encrypted: Array.from(this.memories.values()).filter(m => m.encrypted).length,
      byType
    };
  }
}

export default MemoryStore;
