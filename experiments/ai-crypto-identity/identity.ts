import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import type { EventTemplate, VerifiedEvent } from 'nostr-tools/pure';
import { bytesToHex } from '@noble/hashes/utils';
import * as nip44 from 'nostr-tools/nip44';

// AI Identity Configuration
export interface AIIdentityConfig {
  name: string;
  version: string;
  encryptionPassword?: string;
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

// Encrypted storage format
interface EncryptedKeyStore {
  encrypted_nsec: string;
  npub: string;
  created_at: number;
}

// AI Identity Manager
export class AIIdentity {
  private nsec: Uint8Array | null = null;
  private npub: string = '';
  private config: AIIdentityConfig;
  private storageKey: string;

  constructor(config: AIIdentityConfig) {
    this.config = config;
    this.storageKey = `ai-identity-${config.name.toLowerCase()}`;
  }

  // Initialize identity (load existing or create new)
  async initialize(password?: string): Promise<void> {
    // Check if we're in a browser environment
    const storage = typeof localStorage !== 'undefined' ? localStorage : null;
    
    if (storage) {
      const stored = storage.getItem(this.storageKey);
      
      if (stored) {
        // Load existing identity
        await this.loadIdentity(JSON.parse(stored), password);
        return;
      }
    }
    
    // Create new identity
    await this.createIdentity(password);
  }

  // Create new keypair
  private async createIdentity(password?: string): Promise<void> {
    this.nsec = generateSecretKey();
    this.npub = getPublicKey(this.nsec);

    // Encrypt if password provided
    const store: EncryptedKeyStore = {
      encrypted_nsec: password 
        ? await this.encrypt_nsec(this.nsec, password)
        : bytesToHex(this.nsec),
      npub: this.npub,
      created_at: Math.floor(Date.now() / 1000)
    };

    // Only save to localStorage if in browser
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(store));
    }
    
    console.log(`🎸 Created new identity: ${this.config.name}`);
    console.log(`📇 npub: ${this.npub}`);
  }

  // Load existing identity
  private async loadIdentity(store: EncryptedKeyStore, password?: string): Promise<void> {
    this.npub = store.npub;
    
    if (password) {
      this.nsec = await this.decrypt_nsec(store.encrypted_nsec, password);
    } else {
      this.nsec = new Uint8Array(Buffer.from(store.encrypted_nsec, 'hex'));
    }

    console.log(`🎸 Loaded identity: ${this.config.name}`);
    console.log(`📇 npub: ${this.npub}`);
  }

  // Encrypt nsec with password
  private async encrypt_nsec(nsec: Uint8Array, password: string): Promise<string> {
    const conversationKey = nip44.getConversationKey(nsec, password);
    const plaintext = bytesToHex(nsec);
    return nip44.encrypt(plaintext, conversationKey);
  }

  // Decrypt nsec with password
  private async decrypt_nsec(encrypted: string, password: string): Promise<Uint8Array> {
    // We'll need the nsec to derive the conversation key... 
    // Actually, for real security we should use a different key derivation
    // For now, simple XOR or similar (placeholder)
    // TODO: Implement proper key derivation for encryption
    return new Uint8Array(Buffer.from(encrypted, 'hex'));
  }

  // Sign a memory event
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

  // Verify a memory event signature
  static verifyMemory(event: AIMemoryEvent): boolean {
    const isValid = verifyEvent(event as VerifiedEvent);
    console.log(`🔐 Signature ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
    return isValid;
  }

  // Get identity info
  getInfo() {
    return {
      name: this.config.name,
      npub: this.npub,
      initialized: !!this.nsec
    };
  }

  // Export identity (for backup/migration)
  exportIdentity(password?: string): string | null {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return null;
    return stored;
  }

  // Import identity (from backup)
  async importIdentity(backup: string, password?: string): Promise<void> {
    const store: EncryptedKeyStore = JSON.parse(backup);
    await this.loadIdentity(store, password);
    localStorage.setItem(this.storageKey, backup);
  }
}

export default AIIdentity;
