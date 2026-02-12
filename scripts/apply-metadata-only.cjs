const fs = require('fs');
const path = require('path');

const metadataCachePath = path.join(process.cwd(), 'scripts/metadata-cache.json');
const accountsPath = path.join(process.cwd(), 'src/data/follow-pack/accounts.ts');

// Load metadata cache
let metadataCache = new Map();
if (fs.existsSync(metadataCachePath)) {
  const cached = JSON.parse(fs.readFileSync(metadataCachePath, 'utf8'));
  metadataCache = new Map(Object.entries(cached));
  console.log(`Loaded ${metadataCache.size} cached metadata entries`);
}

// Read accounts file
const content = fs.readFileSync(accountsPath, 'utf8');

// Extract all npubs
const npubs = [];
const npubRegex = /npub: "(npub1[a-z0-9]+)"/g;
let match;
while ((match = npubRegex.exec(content)) !== null) {
  if (!npubs.includes(match[1])) {
    npubs.push(match[1]);
  }
}

console.log(`Found ${npubs.length} unique npubs`);

function escapeString(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .trim();
}

function applyMetadata() {
  console.log('\nApplying metadata to accounts...');
  
  // Parse the current accounts file more carefully
  const lines = content.split('\n');
  const today = new Date().toISOString().split('T')[0];
  
  const categoryInfo = {
    jumpstart: { name: 'Jumpstart', desc: 'Essential accounts for new Nostr users' },
    legit: { name: "Who's Who", desc: 'Verified Nostr personalities' },
    merchants: { name: 'Merchant', desc: 'Bitcoin/Lightning accepting merchants' },
    mystics: { name: 'Mystic', desc: 'Spiritual and mystical thinkers' },
    artists: { name: 'Artist', desc: 'Visual artists and creators' },
    sovereign: { name: 'Sovereign', desc: 'Freedom and privacy advocates' },
    niche: { name: 'Niche', desc: 'Unique special interest accounts' },
    doomscrolling: { name: 'Entertainment', desc: 'Entertaining and funny accounts' },
    cool_people: { name: 'Cool Person', desc: 'Community recommended interesting folks' }
  };
  
  let currentCategory = null;
  let categoryIndex = 0;
  let output = `// Curated Nostr Accounts Database
// Generated from imported follow packs (naddr) with fetched metadata
// Last Updated: ${today}

import type { CuratedAccount } from '../../types/follow-pack';

export const curatedAccounts: CuratedAccount[] = [
`;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for category header - match category names exactly
    const catMatch = line.match(/\/\/ (JUMPSTART|LEGIT|MERCHANTS|MYSTICS|ARTISTS|SOVEREIGN|NICHE|DOOMSCROLLING|COOL_PEOPLE)$/);
    if (catMatch) {
      currentCategory = catMatch[1].toLowerCase();
      categoryIndex = 0;
      output += `\n  // ${catMatch[1]}\n`;
      continue;
    }
    
    // Check for account entry
    const npubMatch = line.match(/npub: "(npub1[a-z0-9]+)"/);
    if (npubMatch && currentCategory) {
      const npub = npubMatch[1];
      const meta = metadataCache.get(npub);
      categoryIndex++;
      
      const fallbackName = `${categoryInfo[currentCategory].name} ${categoryIndex}`;
      const name = escapeString(meta?.name) || fallbackName;
      const bio = escapeString(meta?.about || categoryInfo[currentCategory].desc).substring(0, 250);
      const picture = escapeString(meta?.picture);
      const nip05 = escapeString(meta?.nip05);
      const lud16 = escapeString(meta?.lud16);
      
      output += `  {\n`;
      output += `    npub: "${npub}",\n`;
      output += `    name: "${name}",\n`;
      if (picture) output += `    picture: "${picture}",\n`;
      output += `    bio: "${bio}",\n`;
      output += `    categories: ["${currentCategory}"],\n`;
      output += `    tags: ["${currentCategory}"],\n`;
      if (nip05) output += `    nip05: "${nip05}",\n`;
      if (lud16) output += `    lud16: "${lud16}",\n`;
      output += `    activity: "medium",\n`;
      output += `    contentTypes: ["text"],\n`;
      output += `    addedAt: "${today}",\n`;
      output += `    updatedAt: "${today}",\n`;
      output += `  },\n`;
      
      // Skip the old account lines until we hit the next account or category
      while (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.match(/npub: "(npub1[a-z0-9]+)"/) || 
            nextLine.match(/\/\/ (JUMPSTART|LEGIT|MERCHANTS|MYSTICS|ARTISTS|SOVEREIGN|NICHE|DOOMSCROLLING|COOL_PEOPLE)$/) ||
            nextLine.match(/^\];/)) {
          break;
        }
        i++;
      }
    }
  }
  
  output += `];\n\nexport default curatedAccounts;\n`;
  
  fs.writeFileSync(accountsPath, output);
  console.log('✓ Accounts file updated with metadata');
  
  // Summary
  let withMeta = 0;
  npubs.forEach(n => {
    if (metadataCache.has(n)) withMeta++;
  });
  console.log(`\nMetadata coverage: ${withMeta}/${npubs.length} (${Math.round((withMeta/npubs.length)*100)}%)`);
}

applyMetadata();
