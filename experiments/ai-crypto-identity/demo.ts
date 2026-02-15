import AIIdentity from './identity.js';
import MemoryStore from './memory-store.js';
import MemoryCrypto from './memory-crypto.js';

async function demo() {
  console.log('🎸 AI Cryptographic Identity - Full Demo\n');
  console.log('='.repeat(60));

  // Create Riff's identity
  const riff = new AIIdentity({
    name: 'Riff',
    version: '1.0.0'
  });

  await riff.initialize();
  const info = riff.getInfo();
  
  console.log('\n📇 Identity Info:');
  console.log(`   Name: ${info.name}`);
  console.log(`   npub: ${info.npub?.slice(0, 32)}...`);
  console.log(`   Status: ${info.initialized ? '✅ Initialized' : '❌ Not Initialized'}`);

  // Initialize memory systems
  const memoryStore = new MemoryStore(info.npub!);
  const memoryCrypto = new MemoryCrypto('super-secret-password-123');
  await memoryCrypto.initialize();

  console.log('\n📝 Creating Memories...\n');

  // Create some unencrypted memories (public)
  const publicMemory = riff.signMemory(
    JSON.stringify({
      type: 'lesson_learned',
      content: 'Always use workflows for multi-step tasks',
      timestamp: Date.now()
    }),
    [['t', 'lesson'], ['priority', 'high']]
  );

  if (publicMemory) {
    memoryStore.store(publicMemory, false);
    console.log('✓ Public memory saved:', publicMemory.id.slice(0, 16) + '...');
  }

  // Create encrypted memories (private)
  const privateData = {
    type: 'mistake',
    content: 'Forgot to test data persistence before building UI',
    lesson: 'Test data layer first, then build UI',
    timestamp: Date.now()
  };

  const encryptedContent = await memoryCrypto.encrypt(JSON.stringify(privateData));
  const privateMemory = riff.signMemory(
    encryptedContent,
    [['t', 'mistake'], ['priority', 'critical'], ['encrypted', 'true']]
  );

  if (privateMemory) {
    memoryStore.store(privateMemory, false);
    console.log('✓ Encrypted memory saved:', privateMemory.id.slice(0, 16) + '...');
  }

  // Create more memories
  const preferences = {
    type: 'preference',
    user_style: 'brutal_honesty',
    likes: ['clean_code', 'experiments', 'aesthetics'],
    dislikes: ['over_explaining', 'boring_code'],
    music: 'CCR',
    timestamp: Date.now()
  };

  const encryptedPrefs = await memoryCrypto.encrypt(JSON.stringify(preferences));
  const prefMemory = riff.signMemory(
    encryptedPrefs,
    [['t', 'preference'], ['scope', 'identity']]
  );

  if (prefMemory) {
    memoryStore.store(prefMemory, false);
    console.log('✓ Preference memory saved:', prefMemory.id.slice(0, 16) + '...');
  }

  console.log('\n🔍 Memory Retrieval Demo\n');

  // Retrieve all memories
  const allMemories = memoryStore.getAll();
  console.log(`📚 Total memories: ${allMemories.length}`);

  // Query by tag - using the correct format (Record<string, string>)
  const lessons = memoryStore.query({ tags: { t: 'lesson' } });
  console.log(`\n📖 Lessons learned: ${lessons.length}`);
  
  for (const memory of lessons) {
    if (!memory.encrypted) {
      const data = JSON.parse(memory.event.content);
      console.log(`   - ${data.content}`);
    }
  }

  // Query encrypted memories
  const mistakes = memoryStore.query({ tags: { t: 'mistake' } });
  console.log(`\n🔐 Private mistakes: ${mistakes.length}`);
  
  for (const memory of mistakes) {
    if (memory.encrypted) {
      try {
        const decrypted = await memoryCrypto.decrypt(memory.event.content);
        const data = JSON.parse(decrypted);
        console.log(`   - Mistake: ${data.content}`);
        console.log(`     Lesson: ${data.lesson}`);
      } catch (e) {
        console.log('   - [Unable to decrypt - wrong password?]');
      }
    }
  }

  // Query preferences
  const prefs = memoryStore.query({ tags: { t: 'preference' } });
  console.log(`\n⚙️  Preferences: ${prefs.length}`);
  
  for (const memory of prefs) {
    if (memory.encrypted) {
      try {
        const decrypted = await memoryCrypto.decrypt(memory.event.content);
        const data = JSON.parse(decrypted);
        console.log(`   - User style: ${data.user_style}`);
        console.log(`   - Music: ${data.music}`);
        console.log(`   - Likes: ${data.likes.join(', ')}`);
      } catch (e) {
        console.log('   - [Unable to decrypt]');
      }
    }
  }

  console.log('\n✅ Verification Demo\n');

  // Verify all signatures
  let validCount = 0;
  for (const memory of allMemories) {
    const isValid = AIIdentity.verifyMemory(memory.event);
    if (isValid) validCount++;
  }
  console.log(`🔐 Signature verification: ${validCount}/${allMemories.length} valid`);

  console.log('\n💾 Persistence Info:');
  console.log('   Identity stored: Yes (localStorage)');
  console.log('   Memories stored: Yes (memory-store)');
  console.log('   Encryption: Yes (AES-256-GCM)');
  console.log('   Cross-session: Ready ✓');

  console.log('\n' + '='.repeat(60));
  console.log('🎸 Demo Complete!\n');
  console.log('What we built:');
  console.log('  ✓ Cryptographic identity (npub/nsec)');
  console.log('  ✓ Signed memory events (kind 30078)');
  console.log('  ✓ Encrypted private memories');
  console.log('  ✓ Memory database with querying');
  console.log('  ✓ Tag-based retrieval');
  console.log('  ✓ Signature verification');
  console.log('\nNext: Add relay publishing, cross-instance sync');
}

demo().catch(console.error);
