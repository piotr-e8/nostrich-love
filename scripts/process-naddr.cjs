#!/usr/bin/env node
/**
 * Process naddr and extract accounts for follow-pack
 * Usage: node process-naddr.js <naddr> <category>
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

// Decode naddr and fetch event
async function fetchNaddrEvent(naddr) {
  try {
    const decoded = nip19.decode(naddr);
    
    if (decoded.type !== 'naddr') {
      throw new Error(`Invalid naddr type: ${decoded.type}`);
    }
    
    const { identifier, pubkey, kind, relays } = decoded.data;
    console.log(`📍 Decoded naddr:`);
    console.log(`   Kind: ${kind}`);
    console.log(`   Pubkey: ${pubkey.slice(0, 20)}...`);
    console.log(`   Identifier: ${identifier}`);
    console.log(`   Relays: ${relays?.join(', ') || 'none specified'}`);
    
    const pool = new SimplePool();
    const eventRelays = relays?.length > 0 ? relays : RELAYS;
    
    console.log(`\n🔍 Fetching event from ${eventRelays.length} relays...`);
    
    const event = await pool.get(eventRelays, {
      kinds: [kind],
      authors: [pubkey],
      '#d': [identifier]
    });
    
    pool.close(eventRelays);
    
    if (!event) {
      throw new Error('Event not found on any relay');
    }
    
    return event;
  } catch (error) {
    console.error('❌ Error fetching naddr:', error.message);
    process.exit(1);
  }
}

// Extract pubkeys from p-tags
function extractPubkeys(event) {
  const pTags = event.tags.filter(tag => tag[0] === 'p');
  const pubkeys = pTags.map(tag => tag[1]).filter(Boolean);
  
  console.log(`\n📊 Event Analysis:`);
  console.log(`   Total tags: ${event.tags.length}`);
  console.log(`   p-tags (pubkeys): ${pubkeys.length}`);
  console.log(`   Created: ${new Date(event.created_at * 1000).toISOString()}`);
  console.log(`   Content preview: ${event.content?.slice(0, 100) || '[no content]'}...`);
  
  return pubkeys;
}

// Fetch metadata for pubkeys
async function fetchMetadata(pubkeys) {
  const pool = new SimplePool();
  const results = [];
  
  console.log(`\n🔍 Fetching metadata for ${pubkeys.length} pubkeys...`);
  
  // Fetch in batches of 10
  const batchSize = 10;
  for (let i = 0; i < pubkeys.length; i += batchSize) {
    const batch = pubkeys.slice(i, i + batchSize);
    console.log(`   Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pubkeys.length / batchSize)} (${batch.length} pubkeys)`);
    
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
            website: metadata.website || '',
            fetchedAt: new Date().toISOString()
          });
        } catch (e) {
          console.log(`   ⚠️ Failed to parse metadata for ${event.pubkey.slice(0, 16)}...`);
        }
      }
    } catch (error) {
      console.log(`   ⚠️ Error fetching batch: ${error.message}`);
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  pool.close(RELAYS);
  return results;
}

// Check for duplicates in existing accounts
function checkDuplicates(accounts, existingAccounts) {
  const existingNpubs = new Set(existingAccounts.map(a => a.npub));
  const existingHex = new Set();
  
  // Try to decode existing npubs to hex for comparison
  for (const acc of existingAccounts) {
    try {
      const decoded = nip19.decode(acc.npub);
      if (decoded.type === 'npub') {
        existingHex.add(decoded.data);
      }
    } catch (e) {
      // Skip invalid npubs
    }
  }
  
  return accounts.map(acc => {
    const isDuplicate = existingNpubs.has(acc.npub) || existingHex.has(acc.pubkey);
    return {
      ...acc,
      isDuplicate,
      duplicateType: existingNpubs.has(acc.npub) ? 'npub' : 
                     existingHex.has(acc.pubkey) ? 'hex' : null
    };
  });
}

// Load existing accounts
function loadExistingAccounts() {
  try {
    const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');
    const content = fs.readFileSync(accountsPath, 'utf8');
    
    // Extract npubs using regex
    const npubMatches = content.match(/npub1[a-z0-9]{58}/g) || [];
    
    // Create minimal account objects for duplicate checking
    return npubMatches.map(npub => ({ npub }));
  } catch (error) {
    console.warn('⚠️ Could not load existing accounts:', error.message);
    return [];
  }
}

// Format output for confirmation
function formatOutput(accounts, category) {
  const newAccounts = accounts.filter(a => !a.isDuplicate);
  const duplicates = accounts.filter(a => a.isDuplicate);
  
  console.log('\n' + '='.repeat(70));
  console.log('📋 PROPOSED ACCOUNTS TO ADD');
  console.log('='.repeat(70));
  console.log(`Source: naddr`);
  console.log(`Target Category: ${category}`);
  console.log(`Total found: ${accounts.length} accounts`);
  console.log(`✓ New accounts: ${newAccounts.length}`);
  console.log(`✗ Duplicates skipped: ${duplicates.length}`);
  console.log('='.repeat(70));
  
  if (newAccounts.length === 0) {
    console.log('\n✅ All accounts already exist in the database!');
    return;
  }
  
  console.log('\n🆕 NEW ACCOUNTS:\n');
  
  newAccounts.forEach((acc, index) => {
    console.log(`${index + 1}. ${acc.name}`);
    console.log(`   NPUB: ${acc.npub}`);
    console.log(`   Categories: [${category}]`);
    console.log(`   Bio: ${acc.bio?.slice(0, 80) || '[no bio]'}${acc.bio?.length > 80 ? '...' : ''}`);
    if (acc.nip05) console.log(`   NIP-05: ${acc.nip05}`);
    if (acc.lud16) console.log(`   Lightning: ${acc.lud16}`);
    console.log('');
  });
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  DUPLICATES (skipped):\n');
    duplicates.forEach((acc, index) => {
      console.log(`   ${index + 1}. ${acc.name} (${acc.npub.slice(0, 20)}...)`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('NEXT STEPS:');
  console.log('='.repeat(70));
  console.log(`Run: node scripts/add-accounts.js ${category}`);
  console.log('This will add all new accounts to the database.');
  console.log('='.repeat(70));
  
  // Save results to temp file for next step
  const output = {
    category,
    accounts: newAccounts.map(acc => ({
      npub: acc.npub,
      name: acc.name,
      username: acc.username,
      picture: acc.picture,
      bio: acc.bio,
      categories: [category],
      tags: [category],
      nip05: acc.nip05,
      lud16: acc.lud16,
      website: acc.website,
      activity: 'medium',
      contentTypes: ['text'],
      addedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    })),
    duplicates: duplicates.map(acc => acc.npub),
    processedAt: new Date().toISOString()
  };
  
  const outputPath = path.join(__dirname, 'temp-naddr-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
}

// Main
async function main() {
  const naddr = process.argv[2];
  const category = process.argv[3] || 'artists';
  
  if (!naddr) {
    console.log('Usage: node process-naddr.js <naddr> <category>');
    console.log('Example: node process-naddr.js naddr1qvzqq... artists');
    process.exit(1);
  }
  
  console.log('='.repeat(70));
  console.log('🚀 Processing Nostr Address (naddr)');
  console.log('='.repeat(70));
  console.log(`Naddr: ${naddr.slice(0, 40)}...`);
  console.log(`Category: ${category}`);
  console.log('='.repeat(70) + '\n');
  
  // Step 1: Fetch event
  const event = await fetchNaddrEvent(naddr);
  
  // Step 2: Extract pubkeys
  const pubkeys = extractPubkeys(event);
  
  if (pubkeys.length === 0) {
    console.log('\n❌ No pubkeys found in event');
    process.exit(1);
  }
  
  // Step 3: Fetch metadata
  const accounts = await fetchMetadata(pubkeys);
  
  console.log(`\n✅ Successfully fetched metadata for ${accounts.length}/${pubkeys.length} accounts`);
  
  // Step 4: Check duplicates
  const existingAccounts = loadExistingAccounts();
  console.log(`\n📚 Loaded ${existingAccounts.length} existing accounts for duplicate check`);
  
  const checkedAccounts = checkDuplicates(accounts, existingAccounts);
  
  // Step 5: Format output
  formatOutput(checkedAccounts, category);
}

main().catch(console.error);
