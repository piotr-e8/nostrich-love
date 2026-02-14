const fs = require('fs');
const data = require('./temp-search-results.json');

// Remove duplicates by npub
const seen = new Set();
const uniqueAccounts = data.newAccounts.filter(acc => {
  if (seen.has(acc.npub)) return false;
  seen.add(acc.npub);
  return true;
});

console.log('Adding', uniqueAccounts.length, 'unique book accounts');

// Read current accounts.ts
let accountsTs = fs.readFileSync('./src/data/follow-pack/accounts.ts', 'utf8');

// Find insertion point - right before '// MYSTICS'
const insertMarker = '// MYSTICS';
const insertPosition = accountsTs.indexOf(insertMarker);

if (insertPosition === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

// Create the new accounts section
const newAccountsSection = uniqueAccounts.map(acc => {
  // Properly escape the bio for TypeScript string literal
  let safeBio = acc.bio || '';
  safeBio = safeBio.replace(/\\/g, '\\\\');
  safeBio = safeBio.replace(/"/g, '\\"');
  safeBio = safeBio.replace(/\n/g, ' ');
  safeBio = safeBio.replace(/\r/g, ' ');
  safeBio = safeBio.substring(0, 250);
  
  const safeName = acc.name ? acc.name.replace(/"/g, '\\"') : 'Unknown';
  
  return `  // BOOKS
  {
    npub: "${acc.npub}",
    name: "${safeName}",
    picture: "${acc.picture || ''}",
    bio: "${safeBio}",
    categories: ["books"],
    tags: ["books"],
    nip05: "${acc.nip05 || ''}",
    lud16: "${acc.lud16 || ''}",
    activity: "${acc.activity || 'medium'}",
    contentTypes: ["text"],
    addedAt: "2026-02-13",
    updatedAt: "2026-02-13",
  },`;
}).join('\n');

// Insert the new accounts
const beforeInsert = accountsTs.substring(0, insertPosition);
const afterInsert = accountsTs.substring(insertPosition);
const newContent = beforeInsert + '\n  // BOOKS\n' + newAccountsSection + '\n\n  ' + afterInsert;

// Write back
fs.writeFileSync('./src/data/follow-pack/accounts.ts', newContent);
console.log('✅ Successfully added', uniqueAccounts.length, 'book accounts');
