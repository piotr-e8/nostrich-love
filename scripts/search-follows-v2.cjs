#!/usr/bin/env node
/**
 * Search npub's follows for accounts matching a category
 * Usage: node search-follows.cjs <source_npub> <target_category>
 * 
 * Now supports adding multiple categories to existing accounts!
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
  'christians': ['christian', 'jesus', 'god', 'bible', 'faith', 'church', 'catholic', 'prayer', 'gospel', 'christ', 'religious', 'worship', 'pastor', 'ministry'],
  'foodies': ['food', 'cook', 'cooking', 'chef', 'recipe', 'kitchen', 'restaurant', 'meal', 'eat', 'dining', 'cuisine', 'baking', 'grill', 'bbq', 'foodie', 'culinary'],
  'artists': ['art', 'artist', 'paint', 'draw', 'design', 'creative', 'portfolio', 'illustration'],
  'photography': ['photo', 'photographer', 'camera', 'shooting', 'portrait', 'landscape'],
  'musicians': ['music', 'musician', 'artist', 'producer', 'composer', 'band', 'song'],
  'permaculture': ['farm', 'garden', 'homestead', 'grow', 'agriculture', 'permaculture', 'organic', 'sustainable'],
  'books': ['book', 'books', 'reading', 'reader', 'author', 'writer', 'writing', 'literature', 'novel', 'fiction', 'non-fiction', 'review', 'literary', 'bibliophile', 'bookworm', 'library', 'publisher']
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

// Load existing accounts from accounts.ts
function loadExistingAccounts() {
  try {
    const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');
    const content = fs.readFileSync(accountsPath, 'utf8');
    
    // Parse accounts from TypeScript file
    const accounts = [];
    const npubMatches = content.matchAll(/npub: "(npub1[a-z0-9]{58})"/g);
    
    for (const match of npubMatches) {
      const npub = match[1];
      // Find the account block
      const startIdx = content.indexOf(`npub: "${npub}"`);
      const blockStart = content.lastIndexOf('{', startIdx);
      const blockEnd = content.indexOf('},', startIdx) + 2;
      const block = content.slice(blockStart, blockEnd);
      
      // Extract categories
      const catMatch = block.match(/categories: \[([^\]]+)\]/);
      const categories = catMatch ? catMatch[1].match(/"([^"]+)"/g)?.map(c => c.replace(/"/g, '')) || [] : [];
      
      // Extract other fields
      const nameMatch = block.match(/name: "([^"]+)"/);
      const bioMatch = block.match(/bio: "([^"]+)"/);
      const pictureMatch = block.match(/picture: "([^"]+)"/);
      
      accounts.push({
        npub,
        name: nameMatch ? nameMatch[1] : '',
        bio: bioMatch ? bioMatch[1] : '',
        picture: pictureMatch ? pictureMatch[1] : '',
        categories,
        block
      });
    }
    
    return accounts;
  } catch (error) {
    console.warn('⚠️ Could not load existing accounts:', error.message);
    return [];
  }
}

// Update categories for existing account
function updateAccountCategories(npub, newCategory, accountsPath) {
  let content = fs.readFileSync(accountsPath, 'utf8');
  
  // Find the account block
  const npubIdx = content.indexOf(`npub: "${npub}"`);
  if (npubIdx === -1) return false;
  
  const blockStart = content.lastIndexOf('{', npubIdx);
  const blockEnd = content.indexOf('},', npubIdx) + 2;
  const block = content.slice(blockStart, blockEnd);
  
  // Check if category already exists
  const catMatch = block.match(/categories: \[([^\]]+)\]/);
  if (!catMatch) return false;
  
  const currentCats = catMatch[1].split(',').map(c => c.trim().replace(/"/g, '')).filter(Boolean);
  
  if (currentCats.includes(newCategory)) {
    return 'already_has_category';
  }
  
  // Add new category
  const newCats = [...currentCats, newCategory];
  const newCatStr = `categories: [${newCats.map(c => `"${c}"`).join(', ')}]`;
  
  // Update content
  const newBlock = block.replace(/categories: \[[^\]]+\]/, newCatStr);
  content = content.slice(0, blockStart) + newBlock + content.slice(blockEnd);
  
  fs.writeFileSync(accountsPath, content);
  return true;
}

// Format output
function formatOutput(accounts, category, sourceNpub) {
  const accountsPath = path.join(__dirname, '..', 'src', 'data', 'follow-pack', 'accounts.ts');
  const existingAccounts = loadExistingAccounts();
  const existingNpubs = new Map(existingAccounts.map(a => [a.npub, a]));
  
  // Check duplicates and categorize
  const results = {
    newAccounts: [],
    updatedAccounts: [],
    alreadyHasCategory: [],
    lowScore: []
  };
  
  accounts.forEach(acc => {
    const score = scoreForCategory(acc, category);
    acc.score = score;
    
    if (score < 20) {
      results.lowScore.push(acc);
      return;
    }
    
    const existing = existingNpubs.get(acc.npub);
    
    if (existing) {
      if (existing.categories.includes(category)) {
        results.alreadyHasCategory.push({ ...acc, existingCategories: existing.categories });
      } else {
        // Update existing account
        const updateResult = updateAccountCategories(acc.npub, category, accountsPath);
        if (updateResult === true) {
          results.updatedAccounts.push({ ...acc, existingCategories: existing.categories, newCategories: [...existing.categories, category] });
        } else if (updateResult === 'already_has_category') {
          results.alreadyHasCategory.push({ ...acc, existingCategories: existing.categories });
        }
      }
    } else {
      results.newAccounts.push(acc);
    }
  });
  
  // Sort by score
  results.newAccounts.sort((a, b) => b.score - a.score);
  results.updatedAccounts.sort((a, b) => b.score - a.score);
  
  console.log('\n' + '='.repeat(80));
  console.log(`📊 SEARCH RESULTS: ${category.toUpperCase()} ACCOUNTS`);
  console.log('='.repeat(80));
  console.log(`Source: ${sourceNpub.slice(0, 30)}...`);
  console.log(`Total contacts searched: ${accounts.length}`);
  console.log(`✨ New accounts to add: ${results.newAccounts.length}`);
  console.log(`🔄 Accounts updated with category: ${results.updatedAccounts.length}`);
  console.log(`✓ Already has category: ${results.alreadyHasCategory.length}`);
  console.log(`✗ Low score (<20): ${results.lowScore.length}`);
  console.log('='.repeat(80));
  
  // Show updated accounts
  if (results.updatedAccounts.length > 0) {
    console.log('\n🔄 ACCOUNTS UPDATED WITH NEW CATEGORY:\n');
    results.updatedAccounts.forEach((acc, i) => {
      console.log(`${i + 1}. ${acc.name} (Score: ${acc.score})`);
      console.log(`   NPUB: ${acc.npub}`);
      console.log(`   Previous categories: [${acc.existingCategories.join(', ')}]`);
      console.log(`   Updated to: [${acc.newCategories.join(', ')}]`);
      console.log('');
    });
  }
  
  // Show new accounts
  if (results.newAccounts.length > 0) {
    console.log('\n✨ NEW ACCOUNTS TO ADD:\n');
    results.newAccounts.slice(0, 20).forEach((acc, i) => {
      console.log(`${i + 1}. ${acc.name} (Score: ${acc.score})`);
      console.log(`   NPUB: ${acc.npub}`);
      console.log(`   Bio: ${acc.bio?.slice(0, 100) || '[no bio]'}${acc.bio?.length > 100 ? '...' : ''}`);
      console.log('');
    });
  }
  
  // Save results
  const outputPath = path.join(__dirname, 'temp-search-results.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    category,
    sourceNpub,
    searchedAt: new Date().toISOString(),
    newAccounts: results.newAccounts.map(a => ({
      npub: a.npub,
      name: a.name,
      picture: a.picture,
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
    updatedAccounts: results.updatedAccounts,
    skipped: results.alreadyHasCategory.length + results.lowScore.length
  }, null, 2));
  
  console.log('\n' + '='.repeat(80));
  console.log(`💾 Results saved to: ${outputPath}`);
  console.log('='.repeat(80));
  
  return results;
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
