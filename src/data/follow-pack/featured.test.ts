import { describe, expect, it } from 'vitest';
import { curatedAccounts } from './accounts';
import { FEATURED_PER_CATEGORY, featuredByCategory, getFeaturedAccounts } from './featured';

// featured.ts is a derived file (see scripts/generate-featured-accounts.mjs).
// These tests are the drift guard: whenever accounts.ts changes in a way that
// affects the sample, regenerate with:
//
//   node scripts/generate-featured-accounts.mjs

describe('follow-pack featured sample stays in sync with accounts.ts', () => {
  it('matches the generation rule: first N accounts per category, dataset order', () => {
    const categoryIds = [...new Set(curatedAccounts.flatMap((a) => a.categories))].sort();
    const expected = Object.fromEntries(
      categoryIds.map((id) => [
        id,
        curatedAccounts.filter((a) => a.categories.includes(id)).slice(0, FEATURED_PER_CATEGORY),
      ])
    );
    expect(featuredByCategory).toEqual(expected);
  });

  it('contains only entries that exist verbatim in the full dataset', () => {
    // Note: a plain npub -> account map would be wrong here — accounts.ts
    // contains a few npubs twice with different metadata (e.g. Steve /
    // npub17f66kd7… as doomscrolling and again as photography), so membership
    // is checked by deep equality against the whole dataset.
    for (const sample of Object.values(featuredByCategory)) {
      for (const entry of sample) {
        expect(curatedAccounts).toContainEqual(entry);
      }
    }
  });

  it('never serves more than FEATURED_PER_CATEGORY accounts', () => {
    for (const sample of Object.values(featuredByCategory)) {
      expect(sample.length).toBeLessThanOrEqual(FEATURED_PER_CATEGORY);
    }
    expect(getFeaturedAccounts('artists').length).toBeLessThanOrEqual(FEATURED_PER_CATEGORY);
    expect(getFeaturedAccounts('artists', 3)).toHaveLength(3);
  });

  it('returns an empty list for categories absent from the data', () => {
    // The bitcoin/privacy landing pages pass category ids that have no
    // accounts yet; they must keep rendering the empty state.
    expect(getFeaturedAccounts('privacy')).toEqual([]);
    expect(getFeaturedAccounts('bitcoin')).toEqual([]);
  });
});
