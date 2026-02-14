#!/usr/bin/env node
/**
 * Search for pitiunited's npub using relays
 */

import { SimplePool, nip19 } from 'nostr-tools';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.nostr.band'
];

async function findPitiunited() {
  console.log('🔍 Searching for pitiunited on Nostr...\n');
  
  const pool = new SimplePool();
  
  try {
    // Search by name in metadata
    console.log('📡 Querying relays for "pitiunited"...');
    
    const events = await pool.querySync(RELAYS, {
      kinds: [0],
      search: 'pitiunited',
      limit: 20
    });
    
    console.log(`✅ Found ${events.length} potential matches\n`);
    
    if (events.length === 0) {
      console.log('❌ No accounts found with name "pitiunited"');
      console.log('\nTrying alternative search methods...');
      
      // Try another approach - search for any mentions
      const mentionEvents = await pool.querySync(RELAYS, {
        kinds: [1],
        search: 'pitiunited',
        limit: 10
      });
      
      console.log(`Found ${mentionEvents.length} mention events`);
      
      // Extract unique pubkeys
      const pubkeys = [...new Set(mentionEvents.map(e => e.pubkey))];
      console.log(`Unique pubkeys: ${pubkeys.length}`);
      
      if (pubkeys.length > 0) {
        // Fetch metadata for these pubkeys
        const metadataEvents = await pool.querySync(RELAYS, {
          kinds: [0],
          authors: pubkeys.slice(0, 10)
        });
        
        console.log('\n📋 Potential matches:\n');
        for (const event of metadataEvents) {
          try {
            const metadata = JSON.parse(event.content);
            const npub = nip19.npubEncode(event.pubkey);
            console.log(`Name: ${metadata.name || 'N/A'}`);
            console.log(`Display Name: ${metadata.display_name || 'N/A'}`);
            console.log(`Username: ${metadata.username || 'N/A'}`);
            console.log(`NIP-05: ${metadata.nip05 || 'N/A'}`);
            console.log(`npub: ${npub}`);
            console.log(`Bio: ${metadata.about?.substring(0, 100) || 'N/A'}...`);
            console.log('-'.repeat(80));
          } catch (e) {
            // Invalid JSON
          }
        }
      }
      
      return;
    }
    
    console.log('\n📋 Accounts found:\n');
    for (const event of events) {
      try {
        const metadata = JSON.parse(event.content);
        const npub = nip19.npubEncode(event.pubkey);
        console.log(`Name: ${metadata.name || 'N/A'}`);
        console.log(`Display Name: ${metadata.display_name || 'N/A'}`);
        console.log(`Username: ${metadata.username || 'N/A'}`);
        console.log(`NIP-05: ${metadata.nip05 || 'N/A'}`);
        console.log(`npub: ${npub}`);
        console.log(`Bio: ${metadata.about?.substring(0, 100) || 'N/A'}...`);
        console.log('-'.repeat(80));
      } catch (e) {
        // Invalid JSON
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    pool.close(RELAYS);
  }
}

// Run the script
findPitiunited().catch(console.error);
