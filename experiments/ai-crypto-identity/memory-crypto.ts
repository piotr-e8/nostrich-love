import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';

/**
 * Memory Encryption using HKDF + AES-256-GCM
 * 
 * Uses a password to derive a master key, then derives
 * per-message encryption keys using HKDF.
 */
export class MemoryCrypto {
  private masterKey: Uint8Array | null = null;
  private password: string;

  constructor(password: string) {
    this.password = password;
  }

  // Initialize with password
  async initialize(): Promise<void> {
    // Derive master key from password using HKDF
    const passwordBytes = new TextEncoder().encode(this.password);
    this.masterKey = hkdf(sha256, passwordBytes, new Uint8Array(0), 'ai-memory-key', 32);
  }

  // Encrypt data
  async encrypt(plaintext: string): Promise<string> {
    if (!this.masterKey) {
      await this.initialize();
    }

    // Generate random nonce
    const nonce = randomBytes(12);
    
    // Derive encryption key for this message
    const encKey = hkdf(sha256, this.masterKey!, nonce, 'memory-enc', 32);
    
    // Encrypt using Web Crypto API (AES-256-GCM)
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encKey.buffer as ArrayBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce.buffer as ArrayBuffer },
      cryptoKey,
      data
    );

    // Combine nonce + ciphertext
    const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
    combined.set(nonce);
    combined.set(new Uint8Array(ciphertext), nonce.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
  }

  // Decrypt data
  async decrypt(ciphertext: string): Promise<string> {
    if (!this.masterKey) {
      await this.initialize();
    }

    // Decode base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    
    // Extract nonce and ciphertext
    const nonce = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Derive decryption key
    const decKey = hkdf(sha256, this.masterKey!, nonce, 'memory-enc', 32);

    // Decrypt using Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      decKey.buffer as ArrayBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce.buffer as ArrayBuffer },
      cryptoKey,
      encrypted.buffer as ArrayBuffer
    );

    return new TextDecoder().decode(decrypted);
  }
}

export default MemoryCrypto;
