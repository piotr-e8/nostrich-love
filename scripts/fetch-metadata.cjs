const fs = require('fs');
const path = require('path');
const { nip19, Relay } = require('nostr-tools');

const RELAYS = [
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.ditto.pub',
  'wss://relay.snort.social'
];

// Read current accounts
const accountsPath = path.join(process.cwd(), 'src/data/follow-pack/accounts.ts');
const content = fs.readFileSync(accountsPath, 'utf8');

// Parse existing accounts
const accounts = [];
const accountMatches = content.matchAll(/npub: "(npub1[a-z0-9]+)",\s*\n\s*name: "([^"]+)",\s*\n\s*bio: "([^"]+)",\s*\n\s*categories: \["([^"]+)"\]/g);

for (const match of accountMatches) {
  accounts.push({
    npub: match[1],
    name: match[2],
    bio: match[3],
    category: match[4]
  });
}

console.log(`Found ${accounts.length} accounts to fetch metadata for`);

async function fetchMetadata() {
  const metadata = new Map();
  const batchSize = 100;
  
  for (let i = 0; i < accounts.length; i += batchSize) {
    const batch = accounts.slice(i, i + batchSize);
    console.log(`\nFetching batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(accounts.length/batchSize)} (${batch.length} accounts)`);
    
    for (const relayUrl of RELAYS) {
      if (metadata.size >= accounts.length) break;
      
      try {
        const relay = await Relay.connect(relayUrl);
        console.log(`  Connected to ${relayUrl}`);
        
        // Get pubkeys that still need metadata
        const remaining = batch.filter(a => !metadata.has(a.npub));
        if (remaining.length === 0) continue;
        
        const pubkeys = remaining.map(a => {
          const { data } = nip19.decode(a.npub);
          return data;
        });
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            relay.close();
            resolve();
          }, 15000);
          
          let received = 0;
          
          relay.subscribe([{
            kinds: [0],
            authors: pubkeys
          }], {
            onevent: (event) => {
              try {
                const profile = JSON.parse(event.content);
                const npub = nip19.npubEncode(event.pubkey);
                
                if (!metadata.has(npub)) {
                  metadata.set(npub, {
                    name: profile.name || profile.display_name || '',
                    about: profile.about || profile.bio || '',
                    picture: profile.picture || '',
                    nip05: profile.nip05 || ''
                  });
                  received++;
                  
                  if (received % 10 === 0) {
                    process.stdout.write(`  ${received}/${remaining.length} `);
                  }
                }
              } catch (e) {
                // Invalid JSON, skip
              }
            },
            onclose: () => {
              clearTimeout(timeout);
              resolve();
            }
          });
        });
        
        relay.close();
        console.log(`  Got ${metadata.size}/${accounts.length} total`);
        
      } catch (e) {
        console.log(`  Error with ${relayUrl}: ${e.message}`);
      }
    }
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, 1000));
  }
  
  return metadata;
}

fetchMetadata().then(metadata => {
  console.log(`\n\nFetched metadata for ${metadata.size}/${accounts.length} accounts`);
  
  // Generate updated accounts file
  const today = new Date().toISOString().split('T')[0];
  let accountsCode = `// Curated Nostr Accounts Database
// Generated from imported follow packs (naddr) with fetched metadata
// Last Updated: ${today}

import type { CuratedAccount } from '../../types/follow-pack';

export const curatedAccounts: CuratedAccount[] = [
`;

  const categoryNames = {
    jumpstart: 'Jumpstart',
    legit: "Who's Who",
    merchants: 'Merchant',
    mystics: 'Mystic',
    artists: 'Artist',
    sovereign: 'Sovereign',
    niche: 'Niche',
    doomscrolling: 'Entertainment',
    cool_people: 'Cool Person'
  };

  // Group by category for cleaner output
  const byCategory = {};
  accounts.forEach(acc => {
    if (!byCategory[acc.category]) byCategory[acc.category] = [];
    byCategory[acc.category].push(acc);
  });

  Object.entries(byCategory).forEach(([category, catAccounts]) => {
    accountsCode += `\n  // ${category.toUpperCase()}\n`;
    
    catAccounts.forEach((acc, index) => {
      const meta = metadata.get(acc.npub);
      const name = (meta?.name || `${categoryNames[category]} ${index + 1}`).replace(/"/g, '\\"');
      const bio = (meta?.about || acc.bio).replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 200);
      const picture = (meta?.picture || '').replace(/"/g, '\\"');
      const nip05 = (meta?.nip05 || '').replace(/"/g, '\\"');
      
      accountsCode += `  {\n`;
      accountsCode += `    npub: "${acc.npub}",\n`;
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
  console.log(`\nUpdated ${accountsPath}`);
  console.log(`\nMetadata coverage: ${Math.round((metadata.size / accounts.length) * 100)}%`);
}).catch(console.error);
