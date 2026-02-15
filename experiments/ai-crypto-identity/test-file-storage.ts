import AIIdentity from './identity-v2.js';

async function testFileStorage() {
  console.log('🎸 Testing File-Based AI Identity\n');
  console.log('='.repeat(60));

  // Create Riff's identity
  const riff = new AIIdentity({
    name: 'Riff',
    version: '2.0.0'
  });

  // Initialize (loads from file or creates new)
  await riff.initialize();
  const info = riff.getInfo();
  
  console.log('\n📇 Identity Info:');
  console.log(`   Name: ${info.name}`);
  console.log(`   Version: ${info.version}`);
  console.log(`   npub: ${info.npub}`);
  console.log(`   Storage: ${info.storage_path}`);
  console.log(`   Status: ${info.initialized ? '✅ Active' : '❌ Inactive'}`);

  // Create some memories
  console.log('\n📝 Creating Memories...');
  
  const memory1 = riff.signMemory(
    JSON.stringify({
      type: 'knowledge',
      content: 'Nostr has 94 NIPs',
      timestamp: Date.now()
    }),
    [['t', 'fact'], ['domain', 'nostr']]
  );

  if (memory1) {
    await riff.storeMemory(memory1, true);
    console.log('✓ Memory 1 stored:', memory1.id.slice(0, 16) + '...');
  }

  const memory2 = riff.signMemory(
    JSON.stringify({
      type: 'lesson',
      content: 'Always backup your nsec',
      timestamp: Date.now()
    }),
    [['t', 'lesson'], ['priority', 'critical']]
  );

  if (memory2) {
    await riff.storeMemory(memory2, true);
    console.log('✓ Memory 2 stored:', memory2.id.slice(0, 16) + '...');
  }

  // Get stats
  const stats = await riff.getStats();
  console.log(`\n📊 Stats:`);
  console.log(`   Total memories: ${stats.memories}`);

  // Verify signatures
  console.log('\n🔐 Verifying Signatures...');
  if (memory1) {
    const valid1 = AIIdentity.verifyMemory(memory1);
    console.log(`   Memory 1: ${valid1 ? '✅ Valid' : '❌ Invalid'}`);
  }
  if (memory2) {
    const valid2 = AIIdentity.verifyMemory(memory2);
    console.log(`   Memory 2: ${valid2 ? '✅ Valid' : '❌ Invalid'}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎸 Test Complete!\n');
  console.log('What we tested:');
  console.log('  ✓ File-based storage (persistent)');
  console.log('  ✓ Identity creation/loading');
  console.log('  ✓ Memory signing');
  console.log('  ✓ Memory storage (file + relay)');
  console.log('  ✓ Signature verification');
  console.log('\nStorage:');
  console.log(`  Identity: ~/.config/riff/`);
  console.log(`  Relay: ws://localhost:7777`);
  console.log('\nNext: Run again to test persistence!');
}

testFileStorage().catch(err => {
  console.error('❌ Error:', err.message);
  if (err.message.includes('relay')) {
    console.log('\n💡 Tip: Start the relay first:');
    console.log('   ./setup.sh');
  }
});
