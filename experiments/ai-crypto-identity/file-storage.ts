import { promises as fs } from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import * as crypto from 'crypto';
import type { AIMemoryEvent } from './identity.js';

export interface IdentityData {
  name: string;
  npub: string;
  nsec: Uint8Array;
  version: string;
  created_at: number;
}

export class FileStorage {
  private baseDir: string;
  private memoriesDir: string;
  
  constructor() {
    this.baseDir = path.join(homedir(), '.config', 'riff');
    this.memoriesDir = path.join(this.baseDir, 'memories');
  }

  async initialize(): Promise<void> {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(this.memoriesDir, { recursive: true });
    await fs.mkdir(path.join(this.memoriesDir, 'chunks'), { recursive: true });
    console.log('📁 Storage initialized:', this.baseDir);
  }

  async saveIdentity(identity: IdentityData, password?: string): Promise<void> {
    // Save public info
    await fs.writeFile(
      path.join(this.baseDir, 'identity.json'),
      JSON.stringify({
        npub: identity.npub,
        name: identity.name,
        version: identity.version,
        created_at: identity.created_at
      }, null, 2)
    );

    // Encrypt and save private key
    if (password) {
      const encrypted = this.encrypt(identity.nsec, password);
      await fs.writeFile(
        path.join(this.baseDir, 'nsec.encrypted'),
        encrypted
      );
      console.log('🔐 Private key encrypted and saved');
    } else {
      // Unencrypted (dev mode) - with warning
      console.warn('⚠️  WARNING: Storing nsec unencrypted - use password for production');
      await fs.writeFile(
        path.join(this.baseDir, 'nsec.hex'),
        Buffer.from(identity.nsec).toString('hex')
      );
    }
  }

  async loadIdentity(password?: string): Promise<IdentityData | null> {
    try {
      // Load public info
      const identityJson = await fs.readFile(
        path.join(this.baseDir, 'identity.json'),
        'utf-8'
      );
      const publicInfo = JSON.parse(identityJson);

      let nsec: Uint8Array;
      
      // Try encrypted first
      try {
        const encrypted = await fs.readFile(
          path.join(this.baseDir, 'nsec.encrypted')
        );
        if (!password) {
          throw new Error('Password required for encrypted key');
        }
        nsec = this.decrypt(encrypted, password);
        console.log('🔐 Decrypted private key');
      } catch (e) {
        // Fall back to unencrypted
        const hex = await fs.readFile(
          path.join(this.baseDir, 'nsec.hex'),
          'utf-8'
        );
        nsec = new Uint8Array(Buffer.from(hex, 'hex'));
        console.log('⚠️  Loaded unencrypted private key');
      }

      return {
        ...publicInfo,
        nsec
      };
    } catch (e) {
      return null;
    }
  }

  async saveMemory(memory: AIMemoryEvent): Promise<void> {
    const memoryPath = path.join(this.memoriesDir, 'chunks', `${memory.id}.json`);
    await fs.writeFile(memoryPath, JSON.stringify(memory, null, 2));
  }

  async getMemory(id: string): Promise<AIMemoryEvent | null> {
    try {
      const memoryPath = path.join(this.memoriesDir, 'chunks', `${id}.json`);
      const data = await fs.readFile(memoryPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async getAllMemories(): Promise<AIMemoryEvent[]> {
    try {
      const chunksDir = path.join(this.memoriesDir, 'chunks');
      const files = await fs.readdir(chunksDir);
      
      const memories: AIMemoryEvent[] = [];
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readFile(path.join(chunksDir, file), 'utf-8');
          memories.push(JSON.parse(data));
        }
      }
      
      return memories;
    } catch {
      return [];
    }
  }

  async saveMemoryIndex(index: any): Promise<void> {
    await fs.writeFile(
      path.join(this.memoriesDir, 'index.json'),
      JSON.stringify(index, null, 2)
    );
  }

  async getMemoryIndex(): Promise<any | null> {
    try {
      const data = await fs.readFile(
        path.join(this.memoriesDir, 'index.json'),
        'utf-8'
      );
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private encrypt(data: Uint8Array, password: string): Buffer {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, 'riff-salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return Buffer.concat([iv, authTag, encrypted]);
  }

  private decrypt(encrypted: Buffer, password: string): Uint8Array {
    const iv = encrypted.slice(0, 16);
    const authTag = encrypted.slice(16, 32);
    const data = encrypted.slice(32);
    
    const key = crypto.scryptSync(password, 'riff-salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    return new Uint8Array(Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]));
  }

  getStoragePath(): string {
    return this.baseDir;
  }
}

export default FileStorage;
