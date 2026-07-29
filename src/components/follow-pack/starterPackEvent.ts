// Everything about publishing a follow pack to Nostr that is NOT React.
//
// Extracted from ExportModal.tsx for two reasons:
//   1. The relay list and the event shape are the two things a user consents to.
//      They need to be assertable in a unit test, and importable by the page so
//      the FAQ cannot describe a different set of relays than the code uses.
//   2. Publishing is irreversible. Keeping the payload builder pure makes it
//      possible to prove what the signed event contains without a browser.
//
// Audit finding #112: the modal used to publish a signed event to all three
// relays from a mount effect — no dialog, no button, no opt-in. Nothing in this
// module talks to the network; the caller decides when, and only after the user
// has confirmed.

import { finalizeEvent, generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';
import type { CuratedAccount } from '../../types/follow-pack';

/**
 * The relays a publish reaches. The consent panel in ExportModal renders this
 * array, and /follow-pack's FAQ prints it, so a relay added here cannot escape
 * the disclosure the user reads. tests/follow-pack.test.ts pins both.
 */
export const PUBLISH_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://nostr.mom',
] as const;

/** NIP-51 addressable starter pack. */
export const STARTER_PACK_KIND = 39089;

export interface StarterPackEventTemplate {
  kind: number;
  created_at: number;
  tags: string[][];
  content: string;
}

/**
 * Build the unsigned kind-39089 event for a pack.
 *
 * The `p` tags ARE the user's selection: anyone who reads the published list
 * learns exactly which accounts they picked. That is why the consent copy spells
 * it out rather than saying "publishes your pack".
 */
export function buildStarterPackEvent(
  selectedAccounts: CuratedAccount[],
  packName: string,
  identifier: string = `followpack-${Date.now()}`,
  now: number = Math.floor(Date.now() / 1000)
): { template: StarterPackEventTemplate; identifier: string; undecodable: string[] } {
  const undecodable: string[] = [];

  const pTags = selectedAccounts.map(account => {
    try {
      const decoded = nip19.decode(account.npub);
      return ['p', decoded.data as string];
    } catch {
      // Relays will reject a non-hex pubkey; record it so the UI can say which
      // account did not make it instead of silently shipping a bad tag.
      undecodable.push(account.name);
      return ['p', account.npub];
    }
  });

  return {
    identifier,
    undecodable,
    template: {
      kind: STARTER_PACK_KIND,
      created_at: now,
      tags: [
        ['d', identifier],
        ['title', packName],
        [
          'description',
          `Curated follow pack with ${selectedAccounts.length} accounts from nostrich.love`,
        ],
        ...pTags,
      ],
      content: '',
    },
  };
}

export interface SignedStarterPack {
  event: ReturnType<typeof finalizeEvent>;
  identifier: string;
  pubkey: string;
  npub: string;
  undecodable: string[];
}

/**
 * Sign a pack with a throwaway key.
 *
 * The secret key never leaves this function: it is not returned, stored or
 * displayed. That keeps the user's real identity out of it, and it also means
 * the published list can never be edited or deleted by anyone — which the
 * consent copy has to say out loud.
 */
export function signStarterPack(
  selectedAccounts: CuratedAccount[],
  packName: string
): SignedStarterPack {
  const { template, identifier, undecodable } = buildStarterPackEvent(selectedAccounts, packName);
  const sk = generateSecretKey();
  const pubkey = getPublicKey(sk);

  return {
    event: finalizeEvent(template, sk),
    identifier,
    pubkey,
    npub: nip19.npubEncode(pubkey),
    undecodable,
  };
}
