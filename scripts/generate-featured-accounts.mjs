#!/usr/bin/env node
// Regenerates src/data/follow-pack/featured.ts — the small, per-category
// sample of curatedAccounts that landing-page islands bundle instead of the
// full ~300 KB dataset (#62/#38).
//
// Selection rule (identical to what FeaturedCreatorsFromPack used to compute
// inline from the full dataset): for every category id present in the data,
// take the first FEATURED_PER_CATEGORY accounts, in dataset order, whose
// `categories` include that id.
//
// Run with: node scripts/generate-featured-accounts.mjs
// (Relies on Node's native TypeScript type stripping — Node >= 23.6 — to
// import the dataset. The vitest drift guard in
// src/data/follow-pack/featured.test.ts fails whenever this file is stale.)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const { curatedAccounts } = await import('../src/data/follow-pack/accounts.ts');

const FEATURED_PER_CATEGORY = 6;

const categoryIds = [...new Set(curatedAccounts.flatMap((a) => a.categories))].sort();

const featuredByCategory = Object.fromEntries(
  categoryIds.map((id) => [
    id,
    curatedAccounts.filter((a) => a.categories.includes(id)).slice(0, FEATURED_PER_CATEGORY),
  ])
);

const outPath = fileURLToPath(new URL('../src/data/follow-pack/featured.ts', import.meta.url));

const header = `// DERIVED FILE — do not edit by hand.
// Generated from ./accounts.ts by scripts/generate-featured-accounts.mjs
// (run: node scripts/generate-featured-accounts.mjs).
//
// Why: the full dataset is ~300 KB and was bundled into every landing-page
// island that only shows ${FEATURED_PER_CATEGORY} featured accounts. This file carries just the
// first ${FEATURED_PER_CATEGORY} accounts per category (dataset order). The vitest drift guard
// in ./featured.test.ts fails when this file is out of sync with accounts.ts.

import type { CuratedAccount } from '../../types/follow-pack';

export const FEATURED_PER_CATEGORY = ${FEATURED_PER_CATEGORY};

export const featuredByCategory: Record<string, CuratedAccount[]> = `;

const footer = `;

export const getFeaturedAccounts = (
  categoryId: string,
  max: number = FEATURED_PER_CATEGORY
): CuratedAccount[] => (featuredByCategory[categoryId] ?? []).slice(0, max);
`;

writeFileSync(outPath, header + JSON.stringify(featuredByCategory, null, 2) + footer);

const total = Object.values(featuredByCategory).reduce((n, list) => n + list.length, 0);
console.log(`Wrote ${outPath}: ${categoryIds.length} categories, ${total} accounts`);
