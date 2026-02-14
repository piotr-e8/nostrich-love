#!/usr/bin/env node
/**
 * Search npub's follows for accounts matching a category
 * Usage: node search-follows.cjs <source_npub> <target_category>
 */

const { nip19, SimplePool } = require('nostr-tools');
const fs = require('fs');
const path = require('path');

// Relays to query
const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.ditto.pub'
];

// Category keywords for scoring
const CATEGORY_KEYWORDS = {
  'parents': ['parent', 'mom', 'dad', 'father', 'mother', 'family', 'kids', 'children', 'baby', 'toddler', 'parenting', 'homeschool', 'family life', 'raising', 'child'],
  'artists': ['art', 'artist', 'paint', 'draw', 'design', 'creative', 'portfolio', 'illustration'],
  'photography': ['photo', 'photographer', 'camera', 'shooting', 'portrait', 'landscape'],
  'musicians': ['music', 'musician', 'artist', 'producer', 'composer', 'band', 'song'],
  'permaculture': ['farm', 'garden', 'homestead', 'grow', 'agriculture', 'permaculture', 'organic', 'sustainable']
};

// Decode npub to hex
function decodeNpub(npub) {
  try {
    const decoded = nip19.decode(npub);
    if (decoded.type !== 'npub') {
      throw new Error('Invalid npub format');
    }
    return decoded.data;
  } catch (error) {
    console.error('❌ Error decoding npub:', error.message);
    process.exit(1);
  }
}

// Fetch contacts (kind 3) for a pubkey
async function fetchContacts(pubkey) {
  const pool = new SimplePool();
  
  console.log(`🔍 Fetching contacts from relays...`);
  
  try {
    const event = await pool.get(RELAYS, {
      kinds: [3],
      authors: [pubkey]
    });
    
    pool.close(RELAYS);
    
    if (!event) {
      throw new Error('Contacts not found on any relay');
    }
    
    // Extract pubkeys from p-tags
    const pTags = event.tags.filter(tag => tag[0] === 'p');
    const pubkeys = pTags.map(tag => tag[1]).filter(Boolean);
    
    console.log(`✅ Found ${pubkeys.length} contacts`);
    
    // Process all contacts (removed limit)
    console.log(`📋 Processing all ${pubkeys.length} contacts`);
    
    return pubkeys;
  } catch (error) {
    console.error('❌ Error fetching contacts:', error.message);
    process.exit(1);
  }
}

// Fetch metadata for multiple pubkeys
async function fetchMetadataBatch(pubkeys) {
  const pool = new SimplePool();
  const results = [];
  
  console.log(`\n🔍 Fetching metadata for ${pubkeys.length} contacts...`);
  
  // Fetch in batches of 10
  const batchSize = 10;
  for (let i = 0; i < pubkeys.length; i += batchSize) {
    const batch = pubkeys.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(pubkeys.length / batchSize);
    
    process.stdout.write(`   Batch ${batchNum}/${totalBatches} (${batch.length} pubkeys)... `);
    
    try {
      const events = await pool.querySync(RELAYS, {
        kinds: [0],
        authors: batch
      });
      
      for (const event of events) {
        try {
          const metadata = JSON.parse(event.content);
          results.push({
            pubkey: event.pubkey,
            npub: nip19.npubEncode(event.pubkey),
            name: metadata.name || metadata.display_name || 'Unknown',
            username: metadata.username || metadata.name || '',
            picture: metadata.picture || '',
            bio: metadata.about || '',
            nip05: metadata.nip05 || '',
            lud16: metadata.lud16 || metadata.lnurl || '',
            website: metadata.website || ''
          });
        } catch (e) {
          // Skip invalid metadata
        }
      }
      
      process.stdout.write(`✓\n`);
    } catch (error) {
      process.stdout.write(`⚠️\n`);
    }
    
    // Small delay between batches
    if (i + batchSize < pubkeys.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  pool.close(RELAYS);
  return results;
}

// Score account for category match
function scoreForCategory(account, category) {
  const keywords = CATEGORY_KEYWORDS[category] || [];
  if (keywords.length === 0) return 0;
  
  let score = 0;
  const bioLower = (account.bio || '').toLowerCase();
  const nameLower = (account.name || '').toLowerCase();
  
  // Bio keyword matching (40 pts max)
  keywords.forEach(kw => {
    if (bioLower.includes(kw)) score += 10;
  });
  score = Math.min(score, 40);
  
  // Name contains keywords (20 pts)
  keywords.forEach(kw => {
    if (nameLower.includes(kw)) score += 5;
  });
  score = Math.min(score, 20);
  
  // NIP-05 domain hints (15 pts)
  if (account.nip05) {
    const nip05Lower = account.nip05.toLowerCase();
    keywords.forEach(kw => {
      if (nip05Lower.includes(kw)) score += 5;
    });
  }
  
  // LUD16 hints (10 pts)
  if (account.lud16) {
    const lud16Lower = account.lud16.toLowerCase();
    keywords.forEach(kw => {
      if (lud16Lower.includes(kw)) score += 5;
    });
  }
  
  return Math.min(score, 70);
}

// Load existing accounts for duplicate check
function loadExistingAccounts() {
  try {
    const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');
    const content = fs.readFileSync(accountsPath, 'utf8');
    const npubMatches = content.match(/npub1[a-z0-9]{58}/g) || [];
    return new Set(npubMatches);
  } catch (error) {
    return new Set();
  }
}

// Format output
function formatOutput(accounts, category, sourceNpub) {
  const existingNpubs = loadExistingAccounts();
  
  // Check duplicates and sort by score
  const scored = accounts.map(acc => {
    const score = scoreForCategory(acc, category);
    const isDuplicate = existingNpubs.has(acc.npub);
    return { ...acc, score, isDuplicate };
  }).sort((a, b) => b.score - a.score);
  
  const highConfidence = scored.filter(a => a.score >= 40 && !a.isDuplicate);
  const mediumConfidence = scored.filter(a => a.score >= 20 && a.score < 40 && !a.isDuplicate);
  const lowConfidence = scored.filter(a => a.score < 20 && !a.isDuplicate);
  const duplicates = scored.filter(a => a.isDuplicate);
  
  console.log('\n' + '='.repeat(80));
  console.log(`📊 SEARCH RESULTS: ${category.toUpperCase()} ACCOUNTS`);
  console.log('='.repeat(80));
  console.log(`Source: ${sourceNpub.slice(0, 30)}...`);
  console.log(`Total contacts searched: ${accounts.length}`);
  console.log(`High confidence (40+): ${highConfidence.length}`);
  console.log(`Medium confidence (20-39): ${mediumConfidence.length}`);
  console.log(`Low confidence (<20): ${lowConfidence.length}`);
  console.log(`Duplicates (already in db): ${duplicates.length}`);
  console.log('='.repeat(80));
  
  // Save results
  const output = {
    category,
    sourceNpub,
    searchedAt: new Date().toISOString(),
    highConfidence: highConfidence.map(a => ({
      npub: a.npub,
      name: a.name,
      bio: a.bio,
      score: a.score,
      nip05: a.nip05,
      lud16: a.lud16,
      categories: [category],
      tags: [category],
      activity: 'medium',
      contentTypes: ['text'],
      addedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    })),
    mediumConfidence: mediumConfidence.map(a => ({
      npub: a.npub,
      name: a.name,
      bio: a.bio,
      score: a.score,
      categories: [category],
      tags: [category],
      activity: 'medium',
      contentTypes: ['text'],
      addedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    })),
    duplicates: duplicates.map(a => a.npub)
  };
  
  const outputPath = path.join(__dirname, 'temp-search-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  // Display high confidence
  if (highConfidence.length > 0) {
    console.log('\n🎯 HIGH CONFIDENCE MATCHES:\n');
    highConfidence.slice(0, 20).forEach((acc, i) => {
      console.log(`${i + 1}. ${acc.name} (Score: ${acc.score})`);
      console.log(`   NPUB: ${acc.npub}`);
      console.log(`   Bio: ${acc.bio?.slice(0, 100) || '[no bio]'}${acc.bio?.length > 100 ? '...' : ''}`);
      if (acc.nip05) console.log(`   NIP-05: ${acc.nip05}`);
      if (acc.lud16) console.log(`   Lightning: ${acc.lud16}`);
      console.log('');
    });
  }
  
  // Display medium confidence
  if (mediumConfidence.length > 0) {
    console.log('\n📋 MEDIUM CONFIDENCE MATCHES:\n');
    mediumConfidence.slice(0, 10).forEach((acc, i) => {
      console.log(`${i + 1}. ${acc.name} (Score: ${acc.score})`);
      console.log(`   NPUB: ${acc.npub}`);
      console.log(`   Bio: ${acc.bio?.slice(0, 80) || '[no bio]'}${acc.bio?.length > 80 ? '...' : ''}`);
      console.log('');
    });
  }
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  DUPLICATES (already in database):\n');
    duplicates.slice(0, 5).forEach((acc, i) => {
      console.log(`   ${i + 1}. ${acc.name} (${acc.npub.slice(0, 20)}...)`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`💾 Full results saved to: ${outputPath}`);
  console.log('='.repeat(80));
  
  return output;
}

// Main
async function main() {
  const sourceNpub = process.argv[2];
  const category = process.argv[3] || 'parents';
  
  if (!sourceNpub) {
    console.log('Usage: node search-follows.cjs <source_npub> <category>');
    console.log('Example: node search-follows.cjs npub1abc... parents');
    process.exit(1);
  }
  
  console.log('='.repeat(80));
  console.log('🔍 SEARCHING FOLLOWS FOR CATEGORY MATCHES');
  console.log('='.repeat(80));
  console.log(`Source NPUB: ${sourceNpub}`);
  console.log(`Target Category: ${category}`);
  console.log('='.repeat(80) + '\n');
  
  // Decode source npub
  const sourcePubkey = decodeNpub(sourceNpub);
  console.log(`✅ Decoded source npub\n`);
  
  // Fetch contacts
  const contactPubkeys = await fetchContacts(sourcePubkey);
  
  if (contactPubkeys.length === 0) {
    console.log('\n❌ No contacts found');
    process.exit(1);
  }
  
  // Fetch metadata for contacts
  const accounts = await fetchMetadataBatch(contactPubkeys);
  
  console.log(`\n✅ Successfully fetched metadata for ${accounts.length}/${contactPubkeys.length} contacts\n`);
  
  // Score and format output
  formatOutput(accounts, category, sourceNpub);
}

main().catch(console.error);
