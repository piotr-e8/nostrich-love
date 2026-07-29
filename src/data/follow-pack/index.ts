// Follow Pack Data - Main exports
// Merging Phase 1 (100 accounts) + Phase 5 (200 additional accounts)

import { curatedAccounts as phase1Accounts } from './accounts';
import { additionalAccounts as phase5Accounts } from './additional-accounts';
import type { CuratedAccount } from '../../types/follow-pack';

const union = <T,>(a: T[] = [], b: T[] = []): T[] => [...new Set([...a, ...b])];

/**
 * accounts.ts is generated from imported naddr follow packs, and 13 npubs were
 * imported more than once — 542 rows for 527 distinct people. Left alone, the
 * same account appears twice in the browser and every category count is
 * inflated.
 *
 * Collapse the duplicates here rather than rewriting the 300 KB generated file:
 * the first row wins for scalar fields (name, bio, picture) and the list fields
 * are unioned, so someone imported under two packs keeps BOTH categories and
 * shows up under both filters.
 */
const dedupeByNpub = (accounts: CuratedAccount[]): CuratedAccount[] => {
  const byNpub = new Map<string, CuratedAccount>();

  for (const account of accounts) {
    const existing = byNpub.get(account.npub);
    if (!existing) {
      byNpub.set(account.npub, { ...account });
      continue;
    }
    existing.categories = union(existing.categories, account.categories);
    existing.tags = union(existing.tags, account.tags);
    existing.contentTypes = union(existing.contentTypes, account.contentTypes);
  }

  return [...byNpub.values()];
};

// Merge all accounts, one row per npub
export const curatedAccounts: CuratedAccount[] = dedupeByNpub([
  ...phase1Accounts,
  ...phase5Accounts,
]);

// Re-export categories
export {
  categories,
  categoryGroups,
  getCategoryById,
  getCategoriesByIds,
  getCategoryGroupById,
} from './categories';

// Re-export validation
export {
  validateNpub,
  validateAccount,
  validateAllAccounts,
  generateReport
} from './validation';

// Helper functions that work on merged dataset
export const getAccountsByCategory = (categoryId: string) => {
  return curatedAccounts.filter(account => 
    account.categories.includes(categoryId as any)
  );
};

export const getAccountsByTag = (tag: string) => {
  return curatedAccounts.filter(account => 
    account.tags.includes(tag.toLowerCase())
  );
};

export const searchAccounts = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return curatedAccounts.filter(account =>
    account.name.toLowerCase().includes(lowerQuery) ||
    account.username?.toLowerCase().includes(lowerQuery) ||
    account.bio.toLowerCase().includes(lowerQuery) ||
    account.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getAccountByNpub = (npub: string) => {
  return curatedAccounts.find(account => account.npub === npub);
};

export const getTopAccountsByFollowers = (limit: number = 10) => {
  return [...curatedAccounts]
    .filter(a => a.followers)
    .sort((a, b) => (b.followers || 0) - (a.followers || 0))
    .slice(0, limit);
};

export const getVerifiedAccounts = () => {
  return curatedAccounts.filter(account => account.verified);
};

export const getAccountCount = () => curatedAccounts.length;

export const getCategoryCounts = () => {
  const counts: Record<string, number> = {};
  curatedAccounts.forEach(account => {
    account.categories.forEach(category => {
      counts[category] = (counts[category] || 0) + 1;
    });
  });
  return counts;
};
