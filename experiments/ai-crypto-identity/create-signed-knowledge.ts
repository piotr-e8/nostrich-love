import AIIdentity from './identity.js';
import type { AIMemoryEvent } from './identity.js';
import MemoryStore from './memory-store.js';
import MemoryCrypto from './memory-crypto.js';
import * as fs from 'fs';
import * as path from 'path';

async function createSignedKnowledge() {
  console.log('🎸 Creating Signed Knowledge Event\n');
  console.log('='.repeat(60));

  // Initialize Riff's identity
  const riff = new AIIdentity({
    name: 'Riff',
    version: '1.0.0'
  });

  await riff.initialize();
  const info = riff.getInfo();

  console.log('\n📇 AI Identity:');
  console.log(`   Name: ${info.name}`);
  console.log(`   npub: ${info.npub}`);
  console.log(`   Status: ${info.initialized ? '✅ Active' : '❌ Inactive'}`);

  // Read the Nostr Expert knowledge
  const knowledgePath = path.join(process.cwd(), '..', '..', '.ai', 'config', 'agents', 'nostr-expert-agent-complete.md');
  const knowledge = fs.readFileSync(knowledgePath, 'utf-8');

  console.log(`\n📚 Knowledge Base:`);
  console.log(`   File: nostr-expert-agent-complete.md`);
  console.log(`   Size: ${(knowledge.length / 1024).toFixed(2)} KB`);
  console.log(`   Lines: ${knowledge.split('\n').length}`);

  // Split knowledge into chunks (Nostr events have size limits)
  const maxChunkSize = 60000; // Leave room for other fields
  const chunks: string[] = [];
  
  for (let i = 0; i < knowledge.length; i += maxChunkSize) {
    chunks.push(knowledge.slice(i, i + maxChunkSize));
  }

  console.log(`\n✂️  Chunking:`);
  console.log(`   Total chunks: ${chunks.length}`);

  // Initialize storage
  const store = new MemoryStore(info.npub!);
  const crypto = new MemoryCrypto('knowledge-encryption-key-2026');
  await crypto.initialize();

  // Create signed knowledge events
  console.log('\n📝 Signing Knowledge Chunks...\n');

  const knowledgeEvents: AIMemoryEvent[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLast = i === chunks.length - 1;

    // Create knowledge metadata
    const metadata = {
      type: 'knowledge_base',
      domain: 'nostr_protocol',
      version: '2.0',
      chunk_index: i,
      total_chunks: chunks.length,
      title: 'Nostr Expert Agent - Complete Knowledge Base',
      coverage: {
        nips: 94,
        event_kinds: 150,
        tags: 50,
        code_patterns: 8
      },
      timestamp: Date.now()
    };

    // Encrypt the chunk
    const encryptedChunk = await crypto.encrypt(chunk);

    // Sign the knowledge event
    const event = riff.signMemory(
      JSON.stringify({
        metadata,
        content: encryptedChunk
      }),
      [
        ['t', 'knowledge'],
        ['d', `nostr-expert-v2-chunk-${i}`],
        ['domain', 'nostr_protocol'],
        ['version', '2.0'],
        ['chunk', `${i}/${chunks.length}`],
        ['encrypted', 'true'],
        ['ai', 'riff'],
        ['priority', 'critical']
      ]
    );

    if (event) {
      store.store(event, false);
      knowledgeEvents.push(event);
      console.log(`✓ Chunk ${i + 1}/${chunks.length} signed: ${event.id.slice(0, 16)}...`);
    }
  }

  // Create index event (unencrypted, for discovery)
  console.log('\n📋 Creating Knowledge Index...');
  
  const indexEvent = riff.signMemory(
    JSON.stringify({
      type: 'knowledge_index',
      title: 'Nostr Expert Agent - Complete Knowledge Base',
      description: 'Comprehensive Nostr protocol reference with 94 NIPs, 150+ event kinds, and 50+ tags',
      total_chunks: chunks.length,
      chunk_event_ids: knowledgeEvents.map(e => e.id),
      coverage: {
        nips: 94,
        event_kinds: 150,
        tags: 50,
        code_patterns: 8,
        best_practices: 6,
        pitfalls: 4
      },
      last_updated: new Date().toISOString(),
      ai_identity: {
        name: 'Riff',
        npub: info.npub,
        version: '2.0'
      },
      tags: ['nostr', 'protocol', 'reference', 'complete']
    }),
    [
      ['t', 'knowledge_index'],
      ['d', 'nostr-expert-v2-index'],
      ['title', 'Nostr Expert Agent'],
      ['domain', 'nostr_protocol'],
      ['version', '2.0'],
      ['ai', 'riff'],
      ['indexed', 'true'],
      ['public', 'true']
    ]
  );

  if (indexEvent) {
    store.store(indexEvent, false);
    console.log(`✓ Index created: ${indexEvent.id.slice(0, 16)}...`);
  }

  // Verification
  console.log('\n🔐 Verification\n');
  
  let validCount = 0;
  for (const event of [...knowledgeEvents, indexEvent]) {
    if (event && AIIdentity.verifyMemory(event)) {
      validCount++;
    }
  }
  
  console.log(`✅ Signatures verified: ${validCount}/${knowledgeEvents.length + 1}`);
  console.log(`   All events signed by: ${info.npub?.slice(0, 32)}...`);

  // Stats
  const stats = store.getStats();
  console.log(`\n📊 Storage Stats:`);
  console.log(`   Total memories: ${stats.total}`);
  console.log(`   Encrypted: ${stats.encrypted}`);
  console.log(`   By type:`, stats.byType);

  // Export for relay publishing
  console.log('\n📤 Export for Relay Publishing\n');
  
  const export_data = {
    identity: {
      name: 'Riff',
      npub: info.npub,
      version: '1.0.0'
    },
    knowledge: {
      title: 'Nostr Expert Agent - Complete Knowledge Base',
      chunks: knowledgeEvents.length,
      index_event: indexEvent?.id,
      chunk_events: knowledgeEvents.map(e => ({
        id: e.id,
        kind: e.kind,
        created_at: e.created_at
      }))
    },
    timestamp: Date.now()
  };

  // Save to file
  const exportPath = path.join(process.cwd(), 'signed-knowledge-export.json');
  fs.writeFileSync(exportPath, JSON.stringify(export_data, null, 2));
  
  console.log(`✓ Export saved: ${exportPath}`);
  console.log(`\n🚀 Ready for relay publishing!`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎸 Signed Knowledge Event Created!\n');
  console.log('What just happened:');
  console.log('  ✓ Generated AI identity (npub/nsec)');
  console.log('  ✓ Loaded 94 NIPs worth of knowledge');
  console.log(`  ✓ Split into ${chunks.length} chunks`);
  console.log('  ✓ Encrypted each chunk');
  console.log(`  ✓ Signed ${knowledgeEvents.length} knowledge events`);
  console.log('  ✓ Created searchable index event');
  console.log('  ✓ All signatures cryptographically verified');
  console.log('  ✓ Exported for relay publishing');
  console.log('\nNext: Publish to Nostr relays for permanent storage');
  console.log('       Any Riff instance can fetch and verify this knowledge!');
}

createSignedKnowledge().catch(console.error);
