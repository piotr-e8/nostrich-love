import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import type { EventTemplate, VerifiedEvent } from 'nostr-tools/pure';
import FileStorage from './file-storage.js';
import { SimplePool } from 'nostr-tools';

// AI Identity Configuration
export interface AIIdentityConfig {
  name: string;
  version: string;
}

// Memory Event Structure
export interface AIMemoryEvent {
  id: string;
  kind: number;
  pubkey: string;
  created_at: number;
  tags: string[][];
  content: string;
  sig: string;
}

// AI Identity Manager with File Storage
export class AIIdentity {
  private nsec: Uint8Array | null = null;
  private npub: string = '';
  private config: AIIdentityConfig;
  private storage: FileStorage;
  private relayPool: SimplePool;
  private localRelay = 'ws://localhost:7777';
  private created_at: number = 0;

  constructor(config: AIIdentityConfig) {
    this.config = config;
    this.storage = new FileStorage();
    this.relayPool = new SimplePool();
  }

  // Initialize identity (load from file or create new)
  async initialize(password?: string): Promise<void> {
    await this.storage.initialize();
    
    const stored = await this.storage.loadIdentity(password);
    
    if (stored) {
      this.nsec = stored.nsec;
      this.npub = stored.npub;
      this.created_at = stored.created_at;
      console.log(`🎸 Loaded identity: ${this.config.name}`);
      console.log(`📇 npub: ${this.npub}`);
      await this.syncFromRelay();
    } else {
      await this.createIdentity(password);
    }
  }

  private async createIdentity(password?: string): Promise<void> {
    this.nsec = generateSecretKey();
    this.npub = getPublicKey(this.nsec);
    this.created_at = Math.floor(Date.now() / 1000);

    await this.storage.saveIdentity({
      name: this.config.name,
      npub: this.npub,
      nsec: this.nsec,
      version: this.config.version,
      created_at: this.created_at
    }, password);

    console.log(`🎸 Created new identity: ${this.config.name}`);
    console.log(`📇 npub: ${this.npub}`);
    console.log(`💾 Saved to: ${this.storage.getStoragePath()}`);
  }

  signMemory(content: string, tags: string[][] = []): AIMemoryEvent | null {
    if (!this.nsec) {
      console.error('Identity not initialized');
      return null;
    }

    const eventTemplate: EventTemplate = {
      kind: 30078,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['d', `${this.config.name.toLowerCase()}-memory`],
        ['ai', this.config.name.toLowerCase()],
        ...tags
      ],
      content
    };

    const signedEvent = finalizeEvent(eventTemplate, this.nsec);
    console.log(`✍️  Signed memory event: ${signedEvent.id.slice(0, 16)}...`);
    return signedEvent as AIMemoryEvent;
  }

  async storeMemory(memory: AIMemoryEvent, publishToRelay: boolean = true): Promise<void> {
    await this.storage.saveMemory(memory);
    
    if (publishToRelay) {
      try {
        await this.relayPool.publish([this.localRelay], memory);
        console.log(`📡 Published to relay: ${memory.id.slice(0, 16)}...`);
      } catch (e) {
        console.warn('⚠️  Failed to publish to relay (is it running?):', e);
      }
    }
  }

  async syncFromRelay(): Promise<void> {
    try {
      const events = await this.relayPool.querySync(
        [this.localRelay],
        {
          kinds: [30078],
          authors: [this.npub],
          '#d': [`${this.config.name.toLowerCase()}-memory`]
        }
      );
      
      for (const event of events) {
        const existing = await this.storage.getMemory(event.id);
        if (!existing) {
          await this.storage.saveMemory(event as AIMemoryEvent);
        }
      }
      
      console.log(`📥 Synced ${events.length} memories from relay`);
    } catch (e) {
      console.warn('⚠️  Failed to sync from relay (is it running?):', e);
    }
  }

  static verifyMemory(event: AIMemoryEvent): boolean {
    const isValid = verifyEvent(event as VerifiedEvent);
    console.log(`🔐 Signature ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
    return isValid;
  }

  getInfo() {
    return {
      name: this.config.name,
      version: this.config.version,
      npub: this.npub,
      initialized: !!this.nsec,
      storage_path: this.storage.getStoragePath()
    };
  }

  async getStats(): Promise<{ memories: number }> {
    const memories = await this.storage.getAllMemories();
    return { memories: memories.length };
  }
}

export default AIIdentity;
