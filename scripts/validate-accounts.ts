#!/usr/bin/env node
/**
 * Validation script for curated accounts
 * Run with: npx ts-node scripts/validate-accounts.ts
 */

import { curatedAccounts, validateAllAccounts, generateReport } from '../src/data/follow-pack';
import { getAccountCount, getCategoryCounts } from '../src/data/follow-pack/accounts';

console.log('🔍 Validating curated accounts database...\n');

// Run validation
const result = validateAllAccounts(curatedAccounts);

// Print report
console.log(generateReport(result));

// Print summary
console.log('\n=== Summary ===');
console.log(`Total accounts: ${getAccountCount()}`);

console.log('\nAccounts per category:');
const counts = getCategoryCounts();
Object.entries(counts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });

// Exit with appropriate code
process.exit(result.valid ? 0 : 1);
