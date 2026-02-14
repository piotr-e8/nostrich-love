#!/usr/bin/env node
/**
 * Search follows of a specific npub for category matches
 * Queries relays for kind 3 (follows) and kind 0 (metadata)
 */

import { SimplePool, nip19 } from 'nostr-tools';
import fs from 'fs';
import path from 'path';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://nos.lol'
];

// Target npub to analyze
const TARGET_NPUB = 'npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4';

// Category keywords
const CATEGORY_KEYWORDS = {
  permaculture: [
    'farm', 'garden', 'grow', 'homestead', 'permaculture', 'soil', 'organic', 'sustainable',
    'agriculture', 'food forest', 'regenerative', 'compost', 'seeds', 'plants', 'farming',
    'gardener', 'farmer', 'homesteader', 'chickens', 'livestock', 'crops', 'harvest',
    'off-grid', 'self-sufficient', 'perennial', 'aquaponics', 'hydroponics'
  ],
  parents: [
    'parent', 'mom', 'dad', 'mother', 'father', 'homeschool', 'unschool',
    'family', 'children', 'kids', 'parenting', 'motherhood', 'fatherhood',
    'child', 'toddler', 'baby', 'raising', 'parenthood', 'family life',
    'stay at home', 'sahm', 'sahd', 'new mom', 'new dad'
  ]
};

async function searchFollows() {
  console.log('🔍 Searching follows for category matches...\n');
  
  const pool = new SimplePool();
  
  try {
    // Decode npub to hex
    const { data: targetPubkey } = nip19.decode(TARGET_NPUB);
    console.log(`✅ Decoded npub to pubkey: ${targetPubkey.slice(0, 16)}...\n`);
    
    // Fetch kind 3 (contact list) event
    console.log('📡 Fetching follows list (kind 3)...');
    const contactEvents = await pool.querySync(RELAYS, {
      kinds: [3],
      authors: [targetPubkey],
      limit: 1
    });
    
    if (contactEvents.length === 0) {
      console.log('❌ No contact list found');
      return;
    }
    
    const follows = contactEvents[0].tags
      .filter(tag => tag[0] === 'p')
      .map(tag => tag[1]);
    
    console.log(`✅ Found ${follows.length} follows\n`);
    
    if (follows.length === 0) {
      console.log('❌ No follows found');
      return;
    }
    
    // Fetch metadata for each follow
    console.log('📊 Fetching metadata for followed accounts...');
    const accounts = [];
    
    // Process in batches of 50
    const batchSize = 50;
    for (let i = 0; i < follows.length; i += batchSize) {
      const batch = follows.slice(i, i + batchSize);
      
      const metadataEvents = await pool.querySync(RELAYS, {
        kinds: [0],
        authors: batch
      });
      
      for (const event of metadataEvents) {
        try {
          const metadata = JSON.parse(event.content);
          const npub = nip19.npubEncode(event.pubkey);
          
          accounts.push({
            pubkey: event.pubkey,
            npub,
            name: metadata.name || metadata.display_name || 'Unknown',
            username: metadata.username || metadata.name || '',
            bio: metadata.about || '',
            picture: metadata.picture || '',
            nip05: metadata.nip05 || '',
            website: metadata.website || '',
            lud16: metadata.lud16 || metadata.lud06 || ''
          });
        } catch (e) {
          // Invalid JSON
        }
      }
      
      if ((i + batchSize) % 50 === 0) {
        console.log(`  Progress: ${Math.min(i + batchSize, follows.length)}/${follows.length}...`);
      }
    }
    
    console.log(`\n✅ Fetched metadata for ${accounts.length} accounts\n`);
    
    // Categorize accounts
    const categorized = {
      permaculture: [],
      parents: []
    };
    
    for (const account of accounts) {
      const bioLower = account.bio.toLowerCase();
      const nameLower = account.name.toLowerCase();
      const text = `${bioLower} ${nameLower}`;
      
      for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        let score = 0;
        const matches = [];
        
        for (const keyword of keywords) {
          if (text.includes(keyword.toLowerCase())) {
            score++;
            matches.push(keyword);
          }
        }
        
        if (score > 0) {
          categorized[category].push({
            ...account,
            score,
            matches: [...new Set(matches)]
          });
        }
      }
    }
    
    // Sort by score and display results
    console.log('\n' + '='.repeat(80));
    console.log('📋 RESULTS BY CATEGORY:\n');
    
    const results = {};
    
    for (const [category, accounts] of Object.entries(categorized)) {
      // Sort by score (descending)
      accounts.sort((a, b) => b.score - a.score);
      
      console.log(`\n🏷️  ${category.toUpperCase()} (${accounts.length} matches):\n`);
      
      results[category] = accounts.slice(0, 25).map((account, idx) => {
        console.log(`${idx + 1}. ${account.name} (@${account.username || 'unknown'})`);
        console.log(`   npub: ${account.npub}`);
        console.log(`   Bio: ${account.bio?.substring(0, 100)}${account.bio?.length > 100 ? '...' : ''}`);
        console.log(`   Score: ${account.score}, Matches: ${account.matches.slice(0, 5).join(', ')}`);
        if (account.nip05) console.log(`   NIP-05: ${account.nip05}`);
        console.log('');
        
        return account;
      });
      
      if (accounts.length > 25) {
        console.log(`   ... and ${accounts.length - 25} more\n`);
      }
    }
    
    // Save results to file
    const outputPath = path.join(process.cwd(), 'scripts', 'search-follows-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ Results saved to: ${outputPath}`);
    
    // Generate TypeScript output
    console.log('\n\n📝 Generating TypeScript accounts...\n');
    generateTypeScriptOutput(results);
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
  } finally {
    pool.close(RELAYS);
  }
}

function generateTypeScriptOutput(results) {
  const today = new Date().toISOString().split('T')[0];
  
  let output = '';
  
  for (const [category, accounts] of Object.entries(results)) {
    if (accounts.length === 0) continue;
    
    output += `\n  // ========== ${category.toUpperCase()} ==========\n`;
    
    for (const account of accounts.slice(0, 20)) {
      output += `  {\n`;
      output += `    npub: "${account.npub}",\n`;
      output += `    name: "${(account.name || 'Unknown').replace(/"/g, '\\"')}",\n`;
      if (account.username && account.username !== account.name) {
        output += `    username: "${account.username}",\n`;
      }
      if (account.picture) {
        output += `    picture: "${account.picture}",\n`;
      }
      output += `    bio: "${(account.bio || '').replace(/"/g, '\\"').substring(0, 150)}${account.bio?.length > 150 ? '...' : ''}",\n`;
      output += `    categories: ["${category}"],\n`;
      output += `    tags: ["${category}", "${account.matches?.slice(0, 3).join('", "') || category}"],\n`;
      output += `    activity: "medium",\n`;
      output += `    contentTypes: ["text"],\n`;
      if (account.nip05) {
        output += `    nip05: "${account.nip05}",\n`;
      }
      if (account.website) {
        output += `    website: "${account.website}",\n`;
      }
      if (account.lud16) {
        output += `    lud16: "${account.lud16}",\n`;
      }
      output += `    addedAt: "${today}",\n`;
      output += `    updatedAt: "${today}",\n`;
      output += `  },\n`;
    }
  }
  
  const tsOutputPath = path.join(process.cwd(), 'scripts', 'search-follows-accounts.ts');
  fs.writeFileSync(tsOutputPath, output);
  console.log(`✅ TypeScript output saved to: ${tsOutputPath}`);
  console.log(`📊 Total accounts: ${Object.values(results).flat().length}`);
}

// Run the script
searchFollows().catch(console.error);
