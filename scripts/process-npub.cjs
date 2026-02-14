#!/usr/bin/env node
/**
 * Process single npub and extract account for follow-pack
 * Usage: node process-npub.cjs <npub> <category>
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

// Fetch metadata for pubkey
async function fetchMetadata(pubkey) {
  const pool = new SimplePool();
  
  console.log(`🔍 Fetching metadata from relays...`);
  
  try {
    const event = await pool.get(RELAYS, {
      kinds: [0],
      authors: [pubkey]
    });
    
    pool.close(RELAYS);
    
    if (!event) {
      throw new Error('Metadata not found on any relay');
    }
    
    const metadata = JSON.parse(event.content);
    return {
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
    };
  } catch (error) {
    console.error('❌ Error fetching metadata:', error.message);
    process.exit(1);
  }
}

// Check for duplicates in existing accounts
function checkDuplicate(account, existingAccounts) {
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
  
  const isDuplicate = existingNpubs.has(account.npub) || existingHex.has(account.pubkey);
  return {
    ...account,
    isDuplicate,
    duplicateType: existingNpubs.has(account.npub) ? 'npub' : 
                   existingHex.has(account.pubkey) ? 'hex' : null
  };
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

// Format output
function formatOutput(account, category) {
  console.log('\n' + '='.repeat(70));
  console.log('📋 ACCOUNT ANALYSIS');
  console.log('='.repeat(70));
  console.log(`Category: ${category}`);
  console.log('='.repeat(70));
  
  if (account.isDuplicate) {
    console.log('\n⚠️  DUPLICATE DETECTED');
    console.log(`This account already exists in the database (${account.duplicateType} match)`);
    console.log('='.repeat(70));
    return;
  }
  
  console.log('\n✅ NEW ACCOUNT:\n');
  console.log(`Name: ${account.name}`);
  console.log(`NPUB: ${account.npub}`);
  console.log(`Hex: ${account.pubkey}`);
  console.log(`Categories: [${category}]`);
  console.log(`Bio: ${account.bio?.slice(0, 120) || '[no bio]'}${account.bio?.length > 120 ? '...' : ''}`);
  if (account.nip05) console.log(`NIP-05: ${account.nip05}`);
  if (account.lud16) console.log(`Lightning: ${account.lud16}`);
  if (account.website) console.log(`Website: ${account.website}`);
  console.log(`Picture: ${account.picture ? '✓ Available' : '✗ Not available'}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('ACCOUNT STRUCTURE FOR accounts.ts:');
  console.log('='.repeat(70));
  
  const output = {
    npub: account.npub,
    name: account.name,
    username: account.username,
    picture: account.picture,
    bio: account.bio,
    categories: [category],
    tags: [category],
    nip05: account.nip05,
    lud16: account.lud16,
    website: account.website,
    activity: 'medium',
    contentTypes: ['text'],
    addedAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  console.log(JSON.stringify(output, null, 2));
  
  // Save to temp file
  const outputPath = path.join(__dirname, 'temp-npub-result.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    category,
    account: output,
    isDuplicate: false,
    processedAt: new Date().toISOString()
  }, null, 2));
  
  console.log('\n💾 Results saved to:', outputPath);
  console.log('='.repeat(70));
}

// Main
async function main() {
  const npub = process.argv[2];
  const category = process.argv[3] || 'parents';
  
  if (!npub) {
    console.log('Usage: node process-npub.cjs <npub> <category>');
    console.log('Example: node process-npub.cjs npub1abc... parents');
    process.exit(1);
  }
  
  console.log('='.repeat(70));
  console.log('🔍 Processing Nostr Public Key (npub)');
  console.log('='.repeat(70));
  console.log(`NPUB: ${npub}`);
  console.log(`Category: ${category}`);
  console.log('='.repeat(70) + '\n');
  
  // Decode npub to hex
  let pubkey;
  try {
    const decoded = nip19.decode(npub);
    if (decoded.type !== 'npub') {
      throw new Error('Invalid npub format');
    }
    pubkey = decoded.data;
    console.log(`✅ Decoded npub to hex: ${pubkey.slice(0, 20)}...`);
  } catch (error) {
    console.error('❌ Error decoding npub:', error.message);
    process.exit(1);
  }
  
  // Fetch metadata
  const account = await fetchMetadata(pubkey);
  
  console.log(`\n✅ Successfully fetched metadata`);
  
  // Check duplicates
  const existingAccounts = loadExistingAccounts();
  console.log(`📚 Loaded ${existingAccounts.length} existing accounts for duplicate check`);
  
  const checkedAccount = checkDuplicate(account, existingAccounts);
  
  // Format output
  formatOutput(checkedAccount, category);
}

main().catch(console.error);
