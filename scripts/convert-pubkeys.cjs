const fs = require('fs');
const path = require('path');
const { nip19 } = require('nostr-tools');

// Read the data file
const dataPath = path.join(process.cwd(), 'data/follow-pack/accounts.ts');
const content = fs.readFileSync(dataPath, 'utf8');

// Extract pubkeys from each category
const categories = ['jumpstart', 'legit', 'merchants', 'mystics', 'artists', 'sovereign', 'niche', 'doomscrolling', 'cool_people'];
const categoryData = {};

categories.forEach(cat => {
  // Find the array for this category
  const regex = new RegExp(cat + ':\\s*\\[([^\\]]*)\\]', 's');
  const catMatch = content.match(regex);
  if (catMatch) {
    const pubkeys = catMatch[1].match(/"[a-f0-9]{64}"/g);
    categoryData[cat] = pubkeys ? pubkeys.map(p => p.replace(/"/g, '')) : [];
  } else {
    categoryData[cat] = [];
  }
});

// Print summary
console.log('Categories found:');
Object.entries(categoryData).forEach(([cat, pubkeys]) => {
  console.log('  ' + cat + ': ' + pubkeys.length + ' pubkeys');
});

// Generate CuratedAccount objects
const today = new Date().toISOString().split('T')[0];
let accountsCode = '// Curated Nostr Accounts Database\n';
accountsCode += '// Generated from imported follow packs (naddr)\n';
accountsCode += '// Last Updated: ' + today + '\n\n';
accountsCode += "import type { CuratedAccount } from '../../types/follow-pack';\n\n";
accountsCode += 'export const curatedAccounts: CuratedAccount[] = [\n';

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

let accountCount = 0;
Object.entries(categoryData).forEach(([category, pubkeys]) => {
  if (pubkeys.length === 0) return;
  
  accountsCode += '\n  // ' + category.toUpperCase() + ' - ' + categoryInfo[category].desc + '\n';
  
  pubkeys.forEach((pubkey, index) => {
    try {
      const npub = nip19.npubEncode(pubkey);
      accountsCode += '  {\n';
      accountsCode += '    npub: "' + npub + '",\n';
      accountsCode += '    name: "' + categoryInfo[category].name + ' ' + (index + 1) + '",\n';
      accountsCode += '    bio: "' + categoryInfo[category].desc + '",\n';
      accountsCode += '    categories: ["' + category + '"],\n';
      accountsCode += '    tags: ["' + category + '"],\n';
      accountsCode += '    activity: "medium",\n';
      accountsCode += '    contentTypes: ["text"],\n';
      accountsCode += '    addedAt: "' + today + '",\n';
      accountsCode += '    updatedAt: "' + today + '",\n';
      accountsCode += '  },\n';
      accountCount++;
    } catch (e) {
      console.error('Error encoding pubkey: ' + e.message);
    }
  });
});

accountsCode += '];\n\nexport default curatedAccounts;\n';

console.log('\nGenerated ' + accountCount + ' accounts');

const outputPath = path.join(process.cwd(), 'src/data/follow-pack/accounts.ts');
fs.writeFileSync(outputPath, accountsCode);
console.log('\nWritten to: ' + outputPath);
