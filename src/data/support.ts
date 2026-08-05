/**
 * Donation endpoints for the /support page and footers.
 *
 * MONEY-CRITICAL: these strings are pinned character-for-character by
 * tests/support.test.ts. If you change them here, change the test in the
 * same commit — a silent mismatch means donations go to the wrong place.
 *
 * Verified 2026-08 before first publication:
 * - lightning: LNURL-pay endpoint live at
 *   https://wallet.yakihonne.com/.well-known/lnurlp/nostrich with
 *   allowsNostr: true (zap receipts signed by the wallet service)
 * - bitcoin: bech32 checksum valid (P2WPKH)
 * - the project npub's profile lud16 matches SUPPORT.lightning
 */
export const SUPPORT = {
  npub: 'npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl',
  lightning: 'nostrich@wallet.yakihonne.com',
  bitcoin: 'bc1qaeakx2pe675t39rje8yj4hjjm9fs29vqjg4dm3',
} as const;
