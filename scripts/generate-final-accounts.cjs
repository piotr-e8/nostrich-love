const fs = require('fs');
const path = require('path');
const { nip19 } = require('nostr-tools');

const metadataCachePath = path.join(process.cwd(), 'scripts/metadata-cache.json');
const sourcePath = path.join(process.cwd(), 'data/follow-pack/accounts.ts');
const outputPath = path.join(process.cwd(), 'src/data/follow-pack/accounts.ts');

// Load metadata cache
let metadataCache = new Map();
if (fs.existsSync(metadataCachePath)) {
  const cached = JSON.parse(fs.readFileSync(metadataCachePath, 'utf8'));
  metadataCache = new Map(Object.entries(cached));
  console.log(`Loaded ${metadataCache.size} cached metadata entries`);
}

// Read source file with hex pubkeys
const sourceContent = fs.readFileSync(sourcePath, 'utf8');

// Extract categories and their pubkeys
const categories = ['jumpstart', 'legit', 'merchants', 'mystics', 'artists', 'sovereign', 'niche', 'doomscrolling', 'cool_people'];
const categoryData = {};

categories.forEach(cat => {
  // Find the array for this category
  const startMarker = cat + ': [';
  const startIdx = sourceContent.indexOf(startMarker);
  if (startIdx === -1) {
    categoryData[cat] = [];
    return;
  }
  
  // Find the end of the array
  let endIdx = sourceContent.indexOf('],', startIdx);
  if (endIdx === -1) {
    endIdx = sourceContent.indexOf(']', startIdx);
  }
  
  if (endIdx === -1) {
    categoryData[cat] = [];
    return;
  }
  
  // Extract and parse pubkeys
  const arrayContent = sourceContent.substring(startIdx + startMarker.length, endIdx);
  const pubkeys = arrayContent.match(/"[a-f0-9]{64}"/g);
  categoryData[cat] = pubkeys ? pubkeys.map(p => p.replace(/"/g, '')) : [];
});

// Print summary
let totalAccounts = 0;
Object.entries(categoryData).forEach(([cat, pubkeys]) => {
  console.log(`  ${cat}: ${pubkeys.length} pubkeys`);
  totalAccounts += pubkeys.length;
});
console.log(`\nTotal: ${totalAccounts} accounts`);

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

// Generate output
const today = new Date().toISOString().split('T')[0];
let output = `// Curated Nostr Accounts Database
// Generated from imported follow packs (naddr) with fetched metadata
// Last Updated: ${today}

import type { CuratedAccount } from '../../types/follow-pack';

export const curatedAccounts: CuratedAccount[] = [
`;

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

let accountsWithMeta = 0;

Object.entries(categoryData).forEach(([category, pubkeys]) => {
  if (pubkeys.length === 0) return;
  
  output += `\n  // ${category.toUpperCase()}\n`;
  
  pubkeys.forEach((pubkey, index) => {
    try {
      // Convert hex to npub
      const npub = nip19.npubEncode(pubkey);
      const meta = metadataCache.get(npub);
      
      if (meta) accountsWithMeta++;
      
      const fallbackName = `${categoryInfo[category].name} ${index + 1}`;
      const name = escapeString(meta?.name) || fallbackName;
      const bio = escapeString(meta?.about || categoryInfo[category].desc).substring(0, 250);
      const picture = escapeString(meta?.picture);
      const nip05 = escapeString(meta?.nip05);
      const lud16 = escapeString(meta?.lud16);
      
      output += `  {\n`;
      output += `    npub: "${npub}",\n`;
      output += `    name: "${name}",\n`;
      if (picture) output += `    picture: "${picture}",\n`;
      output += `    bio: "${bio}",\n`;
      output += `    categories: ["${category}"],\n`;
      output += `    tags: ["${category}"],\n`;
      if (nip05) output += `    nip05: "${nip05}",\n`;
      if (lud16) output += `    lud16: "${lud16}",\n`;
      output += `    activity: "medium",\n`;
      output += `    contentTypes: ["text"],\n`;
      output += `    addedAt: "${today}",\n`;
      output += `    updatedAt: "${today}",\n`;
      output += `  },\n`;
    } catch (e) {
      console.error(`Error processing pubkey ${pubkey.substring(0, 16)}...: ${e.message}`);
    }
  });
});

output += `];\n\nexport default curatedAccounts;\n`;

fs.writeFileSync(outputPath, output);
console.log(`\n✓ Generated ${outputPath}`);
console.log(`✓ Metadata coverage: ${accountsWithMeta}/${totalAccounts} (${Math.round((accountsWithMeta/totalAccounts)*100)}%)`);
