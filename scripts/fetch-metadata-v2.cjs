const fs = require('fs');
const path = require('path');
const { nip19, Relay } = require('nostr-tools');

const RELAYS = [
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.ditto.pub',
];

// Read current accounts
const accountsPath = path.join(process.cwd(), 'src/data/follow-pack/accounts.ts');
const content = fs.readFileSync(accountsPath, 'utf8');

// Parse existing accounts
const accounts = [];
const accountRegex = /npub: "(npub1[a-z0-9]+)",\s*\n\s*name: "([^"]+)",/g;
let match;

// Get all npubs from the file
while ((match = accountRegex.exec(content)) !== null) {
  accounts.push({
    npub: match[1],
    oldName: match[2]
  });
}

console.log(`Found ${accounts.length} accounts to fetch metadata for`);

// Decode all npubs to hex once
const pubkeyMap = new Map();
accounts.forEach(acc => {
  try {
    const { data } = nip19.decode(acc.npub);
    pubkeyMap.set(data, acc.npub);
  } catch (e) {
    console.error(`Failed to decode ${acc.npub}`);
  }
});

const hexPubkeys = Array.from(pubkeyMap.keys());
console.log(`Decoded ${hexPubkeys.length} pubkeys`);

async function fetchAllMetadata() {
  const metadata = new Map();
  
  for (const relayUrl of RELAYS) {
    if (metadata.size >= accounts.length) break;
    
    try {
      console.log(`\nConnecting to ${relayUrl}...`);
      const relay = await Relay.connect(relayUrl);
      
      // Get pubkeys we still need
      const neededPubkeys = hexPubkeys.filter(pk => !metadata.has(pubkeyMap.get(pk)));
      if (neededPubkeys.length === 0) {
        relay.close();
        break;
      }
      
      console.log(`  Fetching ${neededPubkeys.length} profiles...`);
      
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          relay.close();
          resolve();
        }, 30000);
        
        let count = 0;
        
        relay.subscribe([{
          kinds: [0],
          authors: neededPubkeys
        }], {
          onevent: (event) => {
            try {
              const profile = JSON.parse(event.content);
              const npub = pubkeyMap.get(event.pubkey);
              
              if (npub && !metadata.has(npub)) {
                metadata.set(npub, {
                  name: profile.name || profile.display_name || '',
                  about: profile.about || profile.bio || '',
                  picture: profile.picture || '',
                  nip05: profile.nip05 || ''
                });
                count++;
                
                if (count % 50 === 0) {
                  process.stdout.write(`${count} `);
                }
              }
            } catch (e) {}
          },
          onclose: () => {
            clearTimeout(timeout);
            resolve();
          }
        });
      });
      
      relay.close();
      console.log(`\n  Total: ${metadata.size}/${accounts.length}`);
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
  
  return metadata;
}

fetchAllMetadata().then(metadata => {
  console.log(`\n\n✓ Fetched metadata for ${metadata.size}/${accounts.length} accounts (${Math.round((metadata.size/accounts.length)*100)}%)`);
  
  // Now regenerate the accounts file with metadata
  const today = new Date().toISOString().split('T')[0];
  
  // Parse the original file structure
  const categories = {};
  const catRegex = /\/\/ ([A-Z_]+)[\s\S]*?(?=\/\/ [A-Z_]+|export default)/g;
  let catMatch;
  
  // Extract category positions
  const lines = content.split('\n');
  let currentCategory = null;
  
  lines.forEach((line, idx) => {
    const catHeader = line.match(/\/\/ ([A-Z_]+)$/);
    if (catHeader) {
      currentCategory = catHeader[1].toLowerCase();
      if (!categories[currentCategory]) categories[currentCategory] = [];
    }
    
    const npubMatch = line.match(/npub: "(npub1[a-z0-9]+)"/);
    if (npubMatch && currentCategory) {
      categories[currentCategory].push(npubMatch[1]);
    }
  });
  
  // Generate new file
  let accountsCode = `// Curated Nostr Accounts Database
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

  Object.entries(categories).forEach(([category, npubs]) => {
    accountsCode += `\n  // ${category.toUpperCase()}\n`;
    
    npubs.forEach((npub, index) => {
      const meta = metadata.get(npub);
      const fallbackName = `${categoryInfo[category].name} ${index + 1}`;
      const name = (meta?.name || fallbackName).replace(/"/g, '\\"').trim() || fallbackName;
      const bio = (meta?.about || categoryInfo[category].desc).replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 250);
      const picture = (meta?.picture || '').replace(/"/g, '\\"');
      const nip05 = (meta?.nip05 || '').replace(/"/g, '\\"');
      
      accountsCode += `  {\n`;
      accountsCode += `    npub: "${npub}",\n`;
      accountsCode += `    name: "${name}",\n`;
      if (picture) accountsCode += `    picture: "${picture}",\n`;
      accountsCode += `    bio: "${bio}",\n`;
      accountsCode += `    categories: ["${category}"],\n`;
      accountsCode += `    tags: ["${category}"],\n`;
      if (nip05) accountsCode += `    nip05: "${nip05}",\n`;
      accountsCode += `    activity: "medium",\n`;
      accountsCode += `    contentTypes: ["text"],\n`;
      accountsCode += `    addedAt: "${today}",\n`;
      accountsCode += `    updatedAt: "${today}",\n`;
      accountsCode += `  },\n`;
    });
  });

  accountsCode += `];\n\nexport default curatedAccounts;\n`;

  fs.writeFileSync(accountsPath, accountsCode);
  console.log(`\n✓ Updated ${accountsPath}`);
  
  // Summary
  console.log('\n--- Metadata Coverage by Category ---');
  Object.entries(categories).forEach(([cat, npubs]) => {
    const withMeta = npubs.filter(n => metadata.has(n)).length;
    console.log(`${cat}: ${withMeta}/${npubs.length} (${Math.round((withMeta/npubs.length)*100)}%)`);
  });
  
}).catch(console.error);
