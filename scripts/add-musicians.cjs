const fs = require('fs');
const path = require('path');

// Read temp results
const tempPath = path.join(__dirname, 'temp-naddr-results.json');
const data = JSON.parse(fs.readFileSync(tempPath, 'utf8'));

// Deduplicate by npub
const seen = new Set();
const unique = [];
data.accounts.forEach(acc => {
  if (!seen.has(acc.npub)) {
    seen.add(acc.npub);
    unique.push(acc);
  }
});

// Generate TypeScript code
let output = '\n  // MUSICIANS\n\n  // Added 2026-02-13 from naddr\n';

unique.forEach((acc, index) => {
  // Escape quotes in bio
  const bio = acc.bio ? acc.bio.replace(/"/g, '\\"').replace(/\n/g, '\\n') : '';
  const name = acc.name.replace(/"/g, '\\"');
  
  output += `  {\n`;
  output += `    npub: "${acc.npub}",\n`;
  output += `    name: "${name}",\n`;
  if (acc.picture) {
    output += `    picture: "${acc.picture}",\n`;
  }
  output += `    bio: "${bio}",\n`;
  output += `    categories: ["${acc.categories[0]}"],\n`;
  output += `    tags: ["${acc.tags[0]}"],\n`;
  if (acc.nip05) {
    output += `    nip05: "${acc.nip05}",\n`;
  }
  if (acc.lud16) {
    output += `    lud16: "${acc.lud16}",\n`;
  }
  if (acc.website) {
    output += `    website: "${acc.website}",\n`;
  }
  output += `    activity: "${acc.activity}",\n`;
  output += `    contentTypes: ${JSON.stringify(acc.contentTypes)},\n`;
  output += `    addedAt: "${acc.addedAt}",\n`;
  output += `    updatedAt: "${acc.updatedAt}",\n`;
  output += `  },\n`;
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
const newContent = accountsContent.slice(0, mysticsIndex) + output + accountsContent.slice(mysticsIndex);

// Write back
fs.writeFileSync(accountsPath, newContent);

console.log(`✅ Added ${unique.length} musician accounts to accounts.ts`);
console.log(`📍 Inserted before MYSTICS section at position ${mysticsIndex}`);
