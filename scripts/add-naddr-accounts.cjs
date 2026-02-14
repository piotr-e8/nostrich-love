#!/usr/bin/env node
/**
 * Add processed naddr accounts to accounts.ts
 * Usage: node add-naddr-accounts.cjs
 */

const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, 'temp-three-naddrs-results.json');
const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');

// Read results
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

// Read existing accounts file
let accountsContent = fs.readFileSync(accountsPath, 'utf8');

// Extract all new accounts (removing duplicates by npub)
const seenNpubs = new Set();
const uniqueAccounts = [];

// First, collect all existing npubs from the file
const existingMatches = accountsContent.match(/npub1[a-z0-9]{58}/g) || [];
existingMatches.forEach(npub => seenNpubs.add(npub));

console.log(`📚 Found ${seenNpubs.size} existing accounts`);

// Process new accounts from all nadrs
results.newAccounts.forEach(account => {
  if (!seenNpubs.has(account.npub)) {
    seenNpubs.add(account.npub);
    uniqueAccounts.push(account);
  }
});

console.log(`✅ Found ${uniqueAccounts.length} unique new accounts to add`);

// Group by primary category
const byCategory = {};
uniqueAccounts.forEach(acc => {
  const primaryCat = acc.categories[0] || 'jumpstart';
  if (!byCategory[primaryCat]) {
    byCategory[primaryCat] = [];
  }
  byCategory[primaryCat].push(acc);
});

// Generate TypeScript code
let tsCode = '';

Object.entries(byCategory)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([category, accounts]) => {
    tsCode += `\n  // ${category.toUpperCase()}\n`;
    
    accounts.forEach(acc => {
      // Escape quotes in bio and name
      const safeName = (acc.name || 'Unknown').replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 50);
      const safeBio = (acc.bio || '').replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 200);
      
      tsCode += `  {\n`;
      tsCode += `    npub: "${acc.npub}",\n`;
      tsCode += `    name: "${safeName}",\n`;
      if (acc.username && acc.username !== acc.name) {
        tsCode += `    username: "${acc.username.replace(/"/g, '\\"')}",\n`;
      }
      if (acc.picture) {
        tsCode += `    picture: "${acc.picture}",\n`;
      }
      tsCode += `    bio: "${safeBio}",\n`;
      tsCode += `    categories: [${acc.categories.map(c => `"${c}"`).join(', ')}],\n`;
      tsCode += `    tags: [${acc.tags.map(t => `"${t}"`).join(', ')}],\n`;
      if (acc.nip05) {
        tsCode += `    nip05: "${acc.nip05}",\n`;
      }
      if (acc.website) {
        tsCode += `    website: "${acc.website}",\n`;
      }
      if (acc.lud16) {
        tsCode += `    lud16: "${acc.lud16}",\n`;
      }
      tsCode += `    activity: "${acc.activity || 'medium'}",\n`;
      tsCode += `    contentTypes: ["text"],\n`;
      tsCode += `    addedAt: "${acc.addedAt || new Date().toISOString().split('T')[0]}",\n`;
      tsCode += `    updatedAt: "${acc.updatedAt || new Date().toISOString().split('T')[0]}",\n`;
      tsCode += `  },\n`;
    });
  });

// Find the insertion point - before the last closing bracket and semicolon
const lastBracketIndex = accountsContent.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error('❌ Could not find insertion point in accounts.ts');
  process.exit(1);
}

// Insert the new accounts before the closing bracket
const newContent = 
  accountsContent.slice(0, lastBracketIndex) + 
  tsCode + 
  accountsContent.slice(lastBracketIndex);

// Write back
fs.writeFileSync(accountsPath, newContent);

console.log(`\n✅ Successfully added ${uniqueAccounts.length} accounts to accounts.ts`);

// Summary
console.log('\n📊 Category breakdown:');
Object.entries(byCategory)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([cat, accs]) => {
    console.log(`   ${cat}: ${accs.length}`);
  });

console.log('\n📝 Sample of added accounts:');
uniqueAccounts.slice(0, 5).forEach(acc => {
  console.log(`   - ${acc.name} (${acc.categories.join(', ')})`);
});
