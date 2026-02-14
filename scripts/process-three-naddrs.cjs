#!/usr/bin/env node
/**
 * Process 3 naddr follow packs and extract accounts
 * Usage: node process-three-naddrs.js
 */

const { nip19, SimplePool } = require('nostr-tools');
const fs = require('fs');
const path = require('path');

// The 3 nadrs to process
const NADRS = [
  {
    id: 'naddr1',
    value: 'naddr1qvzqqqyckypzqxeup6tez2tf4yyp0n6fgzaglh0gw99ewytpccreulnpzsp5z5a3qythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqjxywtrxsunyd3h956nzdp4956rswtp94skgdnx95ursdmzxsex2vfc8pjnxtl48jy',
    defaultCategory: 'artists'
  },
  {
    id: 'naddr2',
    value: 'naddr1qvzqqqyckypzq96n3hp2vfmf6z2y8uvvxl97xk86kkalnqghx4p25lzl79c76a7yqythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqxxx6t0vv6nser4w4n8guggtcxx7',
    defaultCategory: 'artists'
  },
  {
    id: 'naddr3',
    value: 'naddr1qvzqqqyckypzq96n3hp2vfmf6z2y8uvvxl97xk86kkalnqghx4p25lzl79c76a7yqythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qy88wumn8ghj7mn0wvhxcmmv9uqzgcehxv6xgeryvckkywfnvykngvp3vyknsv3evykkgepev5mrsepnv4jngwqsal2xr',
    defaultCategory: 'artists'
  }
];

// Relays to query
const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.snort.social'
];

// Decode naddr and fetch event
async function fetchNaddrEvent(naddr) {
  try {
    const decoded = nip19.decode(naddr);
    
    if (decoded.type !== 'naddr') {
      throw new Error(`Invalid naddr type: ${decoded.type}`);
    }
    
    const { identifier, pubkey, kind, relays } = decoded.data;
    console.log(`\n📍 Decoded naddr:`);
    console.log(`   Kind: ${kind}`);
    console.log(`   Pubkey: ${pubkey.slice(0, 20)}...`);
    console.log(`   Identifier: ${identifier}`);
    console.log(`   Relays: ${relays?.join(', ') || 'none specified'}`);
    
    const pool = new SimplePool();
    const eventRelays = relays?.length > 0 ? relays : RELAYS;
    
    console.log(`🔍 Fetching event from ${eventRelays.length} relays...`);
    
    const event = await pool.get(eventRelays, {
      kinds: [kind],
      authors: [pubkey],
      '#d': [identifier]
    });
    
    pool.close(eventRelays);
    
    if (!event) {
      throw new Error('Event not found on any relay');
    }
    
    return { event, decoded: decoded.data };
  } catch (error) {
    console.error('❌ Error fetching naddr:', error.message);
    return null;
  }
}

// Extract pubkeys from p-tags
function extractPubkeys(event) {
  const pTags = event.tags.filter(tag => tag[0] === 'p');
  const pubkeys = pTags.map(tag => tag[1]).filter(Boolean);
  
  console.log(`📊 Event Analysis:`);
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
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  pool.close(RELAYS);
  return results;
}

// Analyze bio and determine categories
function analyzeCategories(bio, name) {
  const bioLower = (bio || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();
  const categories = [];
  
  // Artists
  if (bioLower.match(/art|artist|designer|creative|illustration|drawing|painting|digital art|nft|visual|graphic/)) {
    categories.push('artists');
  }
  
  // Photography
  if (bioLower.match(/photographer|photography|photo|camera|portrait|landscape|street photography/)) {
    categories.push('photography');
  }
  
  // Musicians
  if (bioLower.match(/musician|music|producer|dj|band|singer|songwriter|composer|audio/)) {
    categories.push('musicians');
  }
  
  // Permaculture
  if (bioLower.match(/permaculture|homestead|farmer|garden|grow|agriculture|farm|sustainable|organic/)) {
    categories.push('permaculture');
  }
  
  // Parents
  if (bioLower.match(/parent|mom|dad|mother|father|family|kids|children|homeschool|unschool/)) {
    categories.push('parents');
  }
  
  // Christians
  if (bioLower.match(/christian|jesus|god|church|faith|bible|prayer|christ|gospel/)) {
    categories.push('christians');
  }
  
  // Foodies
  if (bioLower.match(/food|chef|cook|culinary|recipe|kitchen|baking|cooking|restaurant/)) {
    categories.push('foodies');
  }
  
  // Mystics
  if (bioLower.match(/mystic|spiritual|meditation|consciousness|mindfulness|energy|healing|yoga/)) {
    categories.push('mystics');
  }
  
  // Sovereign
  if (bioLower.match(/sovereign|freedom|liberty|privacy|security|anarchist|cypherpunk|prepper/)) {
    categories.push('sovereign');
  }
  
  // Books
  if (bioLower.match(/book|author|writer|reading|literature|novel|poet|poetry/)) {
    categories.push('books');
  }
  
  // Cool people (general interesting accounts)
  if (categories.length === 0 && bioLower.length > 20) {
    categories.push('cool_people');
  }
  
  // Default to jumpstart if no category matched
  if (categories.length === 0) {
    categories.push('jumpstart');
  }
  
  return categories;
}

// Load existing accounts
function loadExistingAccounts() {
  try {
    const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');
    const content = fs.readFileSync(accountsPath, 'utf8');
    
    // Extract npubs using regex
    const npubMatches = content.match(/npub1[a-z0-9]{58}/g) || [];
    
    // Create minimal account objects for duplicate checking
    return new Set(npubMatches);
  } catch (error) {
    console.warn('⚠️ Could not load existing accounts:', error.message);
    return new Set();
  }
}

// Main processing function
async function processNaddrs() {
  console.log('='.repeat(80));
  console.log('🚀 Processing 3 Naddr Follow Packs');
  console.log('='.repeat(80));
  
  const allResults = {
    processedAt: new Date().toISOString(),
    nadrs: [],
    allAccounts: [],
    duplicates: [],
    newAccounts: []
  };
  
  const existingNpubs = loadExistingAccounts();
  console.log(`📚 Loaded ${existingNpubs.size} existing accounts for duplicate checking`);
  
  for (const naddrConfig of NADRS) {
    console.log('\n' + '='.repeat(80));
    console.log(`Processing ${naddrConfig.id}...`);
    console.log('='.repeat(80));
    
    // Step 1: Fetch event
    const result = await fetchNaddrEvent(naddrConfig.value);
    if (!result) {
      console.log(`❌ Failed to process ${naddrConfig.id}`);
      continue;
    }
    
    const { event, decoded } = result;
    
    // Step 2: Extract pubkeys
    const pubkeys = extractPubkeys(event);
    
    if (pubkeys.length === 0) {
      console.log(`⚠️ No pubkeys found in ${naddrConfig.id}`);
      continue;
    }
    
    // Step 3: Fetch metadata
    const accounts = await fetchMetadata(pubkeys);
    
    console.log(`\n✅ Successfully fetched metadata for ${accounts.length}/${pubkeys.length} accounts`);
    
    // Analyze categories for each account
    const analyzedAccounts = accounts.map(acc => {
      const categories = analyzeCategories(acc.bio, acc.name);
      return {
        ...acc,
        categories,
        tags: categories,
        activity: 'medium',
        contentTypes: ['text'],
        addedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
    });
    
    // Check duplicates
    const newAccounts = analyzedAccounts.filter(acc => !existingNpubs.has(acc.npub));
    const duplicates = analyzedAccounts.filter(acc => existingNpubs.has(acc.npub));
    
    // Add to existing set to prevent duplicates across nadrs
    newAccounts.forEach(acc => existingNpubs.add(acc.npub));
    
    const naddrResult = {
      id: naddrConfig.id,
      identifier: decoded.identifier,
      kind: decoded.kind,
      pubkey: decoded.pubkey,
      totalPubkeys: pubkeys.length,
      metadataFound: accounts.length,
      newAccounts: newAccounts.length,
      duplicates: duplicates.length,
      accounts: analyzedAccounts
    };
    
    allResults.nadrs.push(naddrResult);
    allResults.allAccounts.push(...analyzedAccounts);
    allResults.newAccounts.push(...newAccounts);
    allResults.duplicates.push(...duplicates.map(d => d.npub));
    
    console.log(`\n📊 Summary for ${naddrConfig.id}:`);
    console.log(`   Total accounts: ${analyzedAccounts.length}`);
    console.log(`   New accounts: ${newAccounts.length}`);
    console.log(`   Duplicates: ${duplicates.length}`);
    
    // Show category distribution
    const categoryCount = {};
    newAccounts.forEach(acc => {
      acc.categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });
    
    console.log(`   Category distribution:`, categoryCount);
  }
  
  // Save results
  const outputPath = path.join(__dirname, 'temp-three-naddrs-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
  
  // Generate markdown report
  generateReport(allResults);
  
  return allResults;
}

// Generate markdown report
function generateReport(results) {
  let report = `# Naddr Processing Results\n\n`;
  report += `**Processed:** ${results.processedAt}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total accounts found:** ${results.allAccounts.length}\n`;
  report += `- **New accounts:** ${results.newAccounts.length}\n`;
  report += `- **Duplicates skipped:** ${results.duplicates.length}\n\n`;
  
  // Per-naddr breakdown
  report += `## Per-Naddr Breakdown\n\n`;
  results.nadrs.forEach(naddr => {
    report += `### ${naddr.id}\n`;
    report += `- Identifier: ${naddr.identifier}\n`;
    report += `- Kind: ${naddr.kind}\n`;
    report += `- Pubkeys found: ${naddr.totalPubkeys}\n`;
    report += `- Metadata retrieved: ${naddr.metadataFound}\n`;
    report += `- New accounts: ${naddr.newAccounts}\n`;
    report += `- Duplicates: ${naddr.duplicates}\n\n`;
  });
  
  // Category breakdown
  const categoryCount = {};
  results.newAccounts.forEach(acc => {
    acc.categories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  
  report += `## Category Distribution (New Accounts)\n\n`;
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      report += `- **${cat}:** ${count} accounts\n`;
    });
  
  report += `\n## New Accounts by Category\n\n`;
  
  // Group by primary category
  const byCategory = {};
  results.newAccounts.forEach(acc => {
    const primaryCat = acc.categories[0];
    if (!byCategory[primaryCat]) {
      byCategory[primaryCat] = [];
    }
    byCategory[primaryCat].push(acc);
  });
  
  Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([cat, accounts]) => {
      report += `### ${cat} (${accounts.length})\n\n`;
      accounts.slice(0, 20).forEach(acc => {
        report += `- **${acc.name}** (${acc.npub})\n`;
        report += `  - Bio: ${acc.bio?.slice(0, 100) || 'N/A'}${acc.bio?.length > 100 ? '...' : ''}\n`;
        report += `  - Categories: ${acc.categories.join(', ')}\n`;
        if (acc.nip05) report += `  - NIP-05: ${acc.nip05}\n`;
        if (acc.lud16) report += `  - Lightning: ${acc.lud16}\n`;
        report += `\n`;
      });
      if (accounts.length > 20) {
        report += `*... and ${accounts.length - 20} more*\n\n`;
      }
    });
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'progress', 'naddr-processing-results.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n📝 Report saved to: ${reportPath}`);
}

// Run the script
processNaddrs().catch(console.error);
