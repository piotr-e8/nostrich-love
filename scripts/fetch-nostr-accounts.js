#!/usr/bin/env node
/**
 * Fetch real pubkeys from Nostr starter packs (kind 39098)
 * Queries damus, primal, and nos.lol relays
 */

import { SimplePool } from 'nostr-tools';
import { nip19 } from 'nostr-tools';
import fs from 'fs';
import path from 'path';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://nos.lol'
];

const MIN_FOLLOWERS = 100;

async function fetchStarterPacks() {
  console.log('🚀 Fetching starter packs from Nostr relays...\n');
  
  const pool = new SimplePool();
  const pubkeys = new Set();
  const pubkeyMetadata = new Map();
  
  try {
    // Fetch both kind 39089 (starter packs) and 39098 (media starter packs)
    console.log('📡 Querying for kind 39089 and 39098 events...');
    
    const events39089 = await pool.querySync(RELAYS, {
      kinds: [39089],
      limit: 100
    });
    
    const events39098 = await pool.querySync(RELAYS, {
      kinds: [39098],
      limit: 100
    });
    
    const allEvents = [...events39089, ...events39098];
    
    console.log(`✅ Found ${events39089.length} regular starter packs`);
    console.log(`✅ Found ${events39098.length} media starter packs`);
    console.log(`✅ Total: ${allEvents.length} starter pack events\n`);
    
    // Extract pubkeys from "p" tags
    allEvents.forEach(event => {
      event.tags.forEach(tag => {
        if (tag[0] === 'p' && tag[1]) {
          pubkeys.add(tag[1]);
        }
      });
    });
    
    console.log(`👥 Found ${pubkeys.size} unique pubkeys in starter packs\n`);
    
    if (pubkeys.size === 0) {
      console.log('❌ No pubkeys found. Exiting.');
      return;
    }
    
    // Fetch metadata for each pubkey to check followers
    console.log('📊 Fetching metadata and follower counts...');
    const pubkeyArray = Array.from(pubkeys);
    
    for (let i = 0; i < pubkeyArray.length; i++) {
      const pubkey = pubkeyArray[i];
      
      // Fetch kind 0 (metadata) for this user
      const metadataEvents = await pool.querySync(RELAYS, {
        kinds: [0],
        authors: [pubkey],
        limit: 1
      });
      
      if (metadataEvents.length > 0) {
        try {
          const metadata = JSON.parse(metadataEvents[0].content);
          const followerCount = metadata.followers || metadata.followerCount || 0;
          
          if (followerCount >= MIN_FOLLOWERS) {
            pubkeyMetadata.set(pubkey, {
              ...metadata,
              followerCount,
              relays: metadataEvents[0].tags
                .filter(t => t[0] === 'r')
                .map(t => t[1])
            });
          }
        } catch (e) {
          // Invalid metadata JSON
        }
      }
      
      // Progress update every 10 accounts
      if ((i + 1) % 10 === 0) {
        console.log(`  Progress: ${i + 1}/${pubkeyArray.length} accounts checked...`);
      }
    }
    
    console.log(`\n✅ Found ${pubkeyMetadata.size} accounts with ${MIN_FOLLOWERS}+ followers\n`);
    
    // Sort by follower count
    const sortedAccounts = Array.from(pubkeyMetadata.entries())
      .sort((a, b) => b[1].followerCount - a[1].followerCount);
    
    // Categorize accounts
    const categories = {
      tech: [],
      art: [],
      bitcoin: [],
      culture: [],
      community: [],
      business: [],
      media: [],
      music: [],
      photography: [],
      regional: []
    };
    
    sortedAccounts.forEach(([pubkey, metadata]) => {
      const account = categorizeAccount(pubkey, metadata);
      if (account && categories[account.category]) {
        categories[account.category].push(account);
      }
    });
    
    // Output results
    console.log('\n📋 CATEGORIZED ACCOUNTS:\n');
    console.log('=' .repeat(80));
    
    Object.entries(categories).forEach(([category, accounts]) => {
      if (accounts.length > 0) {
        console.log(`\n🏷️  ${category.toUpperCase()} (${accounts.length} accounts):\n`);
        accounts.slice(0, 5).forEach((account, idx) => {
          console.log(`${idx + 1}. ${account.name} (@${account.username || 'unknown'})`);
          console.log(`   npub: ${account.npub}`);
          console.log(`   Followers: ${account.followers}`);
          console.log(`   Bio: ${account.bio?.substring(0, 80)}${account.bio?.length > 80 ? '...' : ''}`);
          console.log(`   Website: ${account.website || 'N/A'}`);
          console.log(`   NIP-05: ${account.nip05 || 'N/A'}`);
          console.log('');
        });
        
        if (accounts.length > 5) {
          console.log(`   ... and ${accounts.length - 5} more\n`);
        }
      }
    });
    
    // Generate TypeScript output for accounts.ts
    console.log('\n\n📝 Generating TypeScript output for accounts.ts...\n');
    
    let tsOutput = '// Curated Nostr Accounts Database\n';
    tsOutput += `// Generated from kind 39089/39098 starter pack events\n`;
    tsOutput += `// Last Updated: ${new Date().toISOString().split('T')[0]}\n`;
    tsOutput += '// Note: Accounts filtered for 100+ followers\n\n';
    tsOutput += "import type { CuratedAccount } from '../../types/follow-pack';\n\n";
    tsOutput += 'export const curatedAccounts: CuratedAccount[] = [\n';
    
    Object.entries(categories).forEach(([category, accounts]) => {
      if (accounts.length > 0) {
        tsOutput += `\n  // ========== ${category.toUpperCase()} ==========\n`;
        accounts.forEach(account => {
          tsOutput += `  {\n`;
          tsOutput += `    npub: "${account.npub}",\n`;
          tsOutput += `    name: "${account.name.replace(/"/g, '\\"')}",\n`;
          if (account.username) {
            tsOutput += `    username: "${account.username}",\n`;
          }
          tsOutput += `    bio: "${(account.bio || '').replace(/"/g, '\\"').substring(0, 150)}",\n`;
          tsOutput += `    categories: ["${category}"],\n`;
          tsOutput += `    tags: [${account.tags.map(t => `"${t}"`).join(', ')}],\n`;
          tsOutput += `    followers: ${account.followers},\n`;
          tsOutput += `    activity: "${account.activity}",\n`;
          tsOutput += `    contentTypes: ["text"],\n`;
          if (account.nip05) {
            tsOutput += `    nip05: "${account.nip05}",\n`;
          }
          if (account.website) {
            tsOutput += `    website: "${account.website}",\n`;
          }
          if (account.lud16) {
            tsOutput += `    lud16: "${account.lud16}",\n`;
          }
          tsOutput += `    addedAt: "${new Date().toISOString().split('T')[0]}",\n`;
          tsOutput += `    updatedAt: "${new Date().toISOString().split('T')[0]}",\n`;
          tsOutput += `  },\n`;
        });
      }
    });
    
    tsOutput += '];\n\n';
    tsOutput += 'export default curatedAccounts;\n';
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'scripts', 'accounts-output.ts');
    fs.writeFileSync(outputPath, tsOutput);
    console.log(`✅ TypeScript output saved to: ${outputPath}`);
    console.log(`📊 Total accounts: ${sortedAccounts.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    pool.close(RELAYS);
  }
}

function categorizeAccount(pubkey, metadata) {
  const name = metadata.name || metadata.display_name || 'Unknown';
  const username = metadata.username || metadata.name;
  const bio = (metadata.about || '').toLowerCase();
  const nip05 = metadata.nip05 || '';
  const website = metadata.website || '';
  
  // Convert pubkey to npub
  const npub = nip19.npubEncode(pubkey);
  
  // Determine category based on bio, nip05, and other metadata
  let category = null;
  let tags = [];
  
  // Tech/Development keywords
  if (bio.match(/developer|programmer|engineer|coding|software|github|protocol|building|nostr dev|btc dev|lightning dev/)) {
    category = 'tech';
    tags = ['development', 'programming', 'technology'];
  }
  // Bitcoin keywords
  else if (bio.match(/bitcoin|btc|lightning|satoshi|stacker\.news|node runner|hodler|bitcoiner/)) {
    category = 'bitcoin';
    tags = ['bitcoin', 'lightning', 'crypto'];
  }
  // Art/Creative keywords
  else if (bio.match(/artist|designer|creative|illustration|digital art|nft|painting|drawing/)) {
    category = 'art';
    tags = ['art', 'design', 'creative'];
  }
  // Music keywords
  else if (bio.match(/musician|music|producer|dj|band|singer|songwriter|composer/)) {
    category = 'music';
    tags = ['music', 'audio', 'creative'];
  }
  // Photography keywords
  else if (bio.match(/photographer|photography|photo|camera|visual|nft photography/)) {
    category = 'photography';
    tags = ['photography', 'visual', 'art'];
  }
  // Media/Journalism keywords
  else if (bio.match(/journalist|reporter|news|media|podcaster|blogger|writer|author/)) {
    category = 'media';
    tags = ['media', 'journalism', 'content'];
  }
  // Business keywords
  else if (bio.match(/entrepreneur|founder|investor|ceo|business|startup|company|founder/)) {
    category = 'business';
    tags = ['business', 'entrepreneurship', 'finance'];
  }
  // Culture/Ideas keywords
  else if (bio.match(/philosopher|thinker|writer|think|ideas|commentary|politics|society/)) {
    category = 'culture';
    tags = ['culture', 'ideas', 'writing'];
  }
  // Community keywords
  else if (bio.match(/community|organizer|moderator|space|host|connector/)) {
    category = 'community';
    tags = ['community', 'social', 'events'];
  }
  // Default to culture for general accounts
  else {
    category = 'culture';
    tags = ['nostr', 'social'];
  }
  
  // Determine activity level based on follower count
  let activity = 'low';
  if (metadata.followerCount >= 10000) {
    activity = 'high';
  } else if (metadata.followerCount >= 1000) {
    activity = 'medium';
  }
  
  return {
    npub,
    name,
    username,
    bio: metadata.about || '',
    category,
    tags,
    followers: metadata.followerCount,
    activity,
    nip05,
    website,
    lud16: metadata.lud16 || metadata.lud06 || ''
  };
}

// Run the script
fetchStarterPacks().catch(console.error);
