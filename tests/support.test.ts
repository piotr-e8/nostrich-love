import { describe, it, expect } from 'vitest';
import { bech32 } from 'bech32';
import { SUPPORT } from '../src/data/support';

/**
 * Money-path pins. A donation address with a single flipped character is a
 * silent total loss, so the exact strings are asserted here and their
 * encodings are structurally validated. Any intentional change must update
 * this file in the same commit.
 */
describe('support endpoints are pinned and well-formed', () => {
  it('the exact strings never drift', () => {
    expect(SUPPORT.npub).toBe('npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl');
    expect(SUPPORT.lightning).toBe('nostrich@wallet.yakihonne.com');
    expect(SUPPORT.bitcoin).toBe('bc1qaeakx2pe675t39rje8yj4hjjm9fs29vqjg4dm3');
  });

  it('the npub decodes to the project pubkey from .well-known/nostr.json', () => {
    const { prefix, words } = bech32.decode(SUPPORT.npub, 90);
    expect(prefix).toBe('npub');
    const hex = Buffer.from(bech32.fromWords(words)).toString('hex');
    expect(hex).toBe('0e97a44ae4882a34ef06e253ebf226bd38f2e182ceca76d4fd1a450189a5b19d');
  });

  it('the bitcoin address is valid bech32 on mainnet', () => {
    const { prefix, words } = bech32.decode(SUPPORT.bitcoin);
    expect(prefix).toBe('bc');
    expect(words[0]).toBe(0); // segwit v0
    expect(bech32.fromWords(words.slice(1))).toHaveLength(20); // P2WPKH program
  });

  it('the lightning address parses as user@domain', () => {
    expect(SUPPORT.lightning).toMatch(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/);
  });
});
