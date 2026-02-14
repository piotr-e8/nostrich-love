const fs = require('fs');
const path = require('path');

// Read temp results
const tempPath = path.join(__dirname, 'temp-search-results.json');
const data = JSON.parse(fs.readFileSync(tempPath, 'utf8'));

// Get medium confidence accounts and deduplicate by npub
const seen = new Set();
const uniqueAccounts = [];

data.mediumConfidence.forEach(acc => {
  if (!seen.has(acc.npub)) {
    seen.add(acc.npub);
    uniqueAccounts.push(acc);
  }
});

console.log(`Found ${data.mediumConfidence.length} accounts, ${uniqueAccounts.length} unique`);

// Generate TypeScript code for accounts
let accountsOutput = '\n  // PARENTS\n\n  // Added 2026-02-13 from search follows\n';

uniqueAccounts.forEach((acc) => {
  // Escape quotes and newlines in bio
  const bio = acc.bio ? acc.bio.replace(/"/g, '\\"').replace(/\n/g, '\\n') : '';
  const name = acc.name.replace(/"/g, '\\"');
  
  accountsOutput += `  {\n`;
  accountsOutput += `    npub: "${acc.npub}",\n`;
  accountsOutput += `    name: "${name}",\n`;
  accountsOutput += `    bio: "${bio}",\n`;
  accountsOutput += `    categories: ["${acc.categories[0]}"],\n`;
  accountsOutput += `    tags: ["${acc.tags[0]}"],\n`;
  accountsOutput += `    activity: "${acc.activity}",\n`;
  accountsOutput += `    contentTypes: ${JSON.stringify(acc.contentTypes)},\n`;
  accountsOutput += `    addedAt: "${acc.addedAt}",\n`;
  accountsOutput += `    updatedAt: "${acc.updatedAt}",\n`;
  accountsOutput += `  },\n`;
});

// Read accounts.ts
const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');
let accountsContent = fs.readFileSync(accountsPath, 'utf8');

// Find the MYSTICS section and insert before it
const mysticsIndex = accountsContent.indexOf('\n  // MYSTICS');
if (mysticsIndex === -1) {
  console.error('Could not find MYSTICS section');
  process.exit(1);
}

// Insert the new accounts
const newContent = accountsContent.slice(0, mysticsIndex) + accountsOutput + accountsContent.slice(mysticsIndex);

// Write back
fs.writeFileSync(accountsPath, newContent);

console.log(`✅ Added ${uniqueAccounts.length} parent accounts to accounts.ts`);
console.log(`📍 Inserted before MYSTICS section`);
