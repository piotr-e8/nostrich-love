// Follow Pack Data - Main exports
// Merging Phase 1 (100 accounts) + Phase 5 (200 additional accounts)

import { curatedAccounts as phase1Accounts } from './accounts';
import { additionalAccounts as phase5Accounts } from './additional-accounts';
import type { CuratedAccount } from '../../types/follow-pack';

// Merge all accounts
export const curatedAccounts: CuratedAccount[] = [...phase1Accounts, ...phase5Accounts];

// Re-export categories
export { categories, getCategoryById, getCategoriesByIds } from './categories';

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
