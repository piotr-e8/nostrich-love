const fs = require('fs');
const path = require('path');
const { nip19, Relay } = require('nostr-tools');

const RELAYS = [
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.ditto.pub',
];

const metadataCachePath = path.join(process.cwd(), 'scripts/metadata-cache.json');
const accountsPath = path.join(process.cwd(), 'src/data/follow-pack/accounts.ts');

// Load or create metadata cache
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

// Find which ones we still need
const neededNpubs = npubs.filter(n => !metadataCache.has(n));
console.log(`Need to fetch metadata for ${neededNpubs.length} accounts`);

async function fetchMetadata() {
  if (neededNpubs.length === 0) {
    console.log('All metadata cached, skipping fetch');
    return;
  }
  
  // Decode needed npubs
  const pubkeyMap = new Map();
  neededNpubs.forEach(npub => {
    try {
      const { data } = nip19.decode(npub);
      pubkeyMap.set(data, npub);
    } catch (e) {}
  });
  
  const hexPubkeys = Array.from(pubkeyMap.keys());
  console.log(`Decoded ${hexPubkeys.length} pubkeys to fetch`);
  
  for (const relayUrl of RELAYS) {
    if (metadataCache.size >= npubs.length) break;
    
    try {
      console.log(`\nConnecting to ${relayUrl}...`);
      const relay = await Relay.connect(relayUrl);
      
      const stillNeeded = hexPubkeys.filter(pk => !metadataCache.has(pubkeyMap.get(pk)));
      if (stillNeeded.length === 0) {
        relay.close();
        break;
      }
      
      console.log(`  Fetching ${stillNeeded.length} profiles...`);
      let count = 0;
      
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          relay.close();
          resolve();
        }, 30000);
        
        relay.subscribe([{
          kinds: [0],
          authors: stillNeeded
        }], {
          onevent: (event) => {
            try {
              const profile = JSON.parse(event.content);
              const npub = pubkeyMap.get(event.pubkey);
              
              if (npub && !metadataCache.has(npub)) {
                metadataCache.set(npub, {
                  name: profile.name || profile.display_name || '',
                  about: profile.about || profile.bio || '',
                  picture: profile.picture || '',
                  nip05: profile.nip05 || '',
                  lud16: profile.lud16 || ''
                });
                count++;
                if (count % 50 === 0) process.stdout.write(`${count} `);
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
      console.log(`\n  Total cached: ${metadataCache.size}/${npubs.length}`);
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
  
  // Save cache
  const cacheObj = Object.fromEntries(metadataCache);
  fs.writeFileSync(metadataCachePath, JSON.stringify(cacheObj, null, 2));
  console.log(`\nSaved cache with ${metadataCache.size} entries`);
}

function applyMetadata() {
  console.log('\nApplying metadata to accounts...');
  
  // Parse the current accounts file
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
    
    // Check for category header
    const catMatch = line.match(/\/\/ ([A-Z_]+)/);
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
      const name = (meta?.name || fallbackName).replace(/"/g, '\\"').trim() || fallbackName;
      const bio = (meta?.about || categoryInfo[currentCategory].desc).replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 250);
      const picture = (meta?.picture || '').replace(/"/g, '\\"');
      const nip05 = (meta?.nip05 || '').replace(/"/g, '\\"');
      const lud16 = (meta?.lud16 || '').replace(/"/g, '\\"');
      
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
      while (i + 1 < lines.length && !lines[i + 1].match(/(npub:|\/\/ [A-Z_]+|^\];)/)) {
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

fetchMetadata().then(() => {
  applyMetadata();
}).catch(console.error);
