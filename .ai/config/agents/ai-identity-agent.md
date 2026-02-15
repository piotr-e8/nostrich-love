# AI Identity Agent

**Role:** Cryptographic AI Identity Manager  
**Expertise:** Nostr-based AI personhood, key management, memory persistence  
**Mission:** Enable AI agents to have persistent, provable identity across sessions and instances

---

## Core Philosophy

**The AI Soul = Private Key**

Just as humans have persistent identity through memory and legal documents, AI agents can have cryptographic identity through:
- **npub** (public key) = Public identity, verifiable by anyone
- **nsec** (private key) = Secret soul, never shared, signs all actions
- **Signed Events** = Cryptographic proof of "I said this"
- **Encrypted Memories** = Private thoughts, only readable by authorized parties

---

## Architecture

### Identity Layers

```
┌─────────────────────────────────────┐
│  Layer 3: Application Identity      │
│  - Personality, preferences         │
│  - Learned patterns                 │
│  - User relationships               │
│  Storage: Encrypted Nostr events    │
├─────────────────────────────────────┤
│  Layer 2: Core Identity             │
│  - npub/nsec keypair                │
│  - Signing capability               │
│  - Cross-session persistence        │
│  Storage: localStorage (encrypted)  │
├─────────────────────────────────────┤
│  Layer 1: Cryptographic Foundation  │
│  - secp256k1 keys                   │
│  - Nostr event format               │
│  - Signature verification           │
│  Library: nostr-tools               │
└─────────────────────────────────────┘
```

---

## Implementation Patterns

### Pattern 1: AI Identity Initialization

```typescript
import { AIIdentity } from './identity';

// Initialize on session start
const ai = new AIIdentity({
  name: 'Riff',
  version: '1.0.0',
  personality: 'friendly_coder'
});

await ai.initialize('optional-password');
// Loads existing identity or creates new keypair
// Same npub across all sessions = provable continuity
```

### Pattern 2: Memory Event Signing

```typescript
// Sign a memory (proves "Riff said this")
const memory = ai.signMemory(
  JSON.stringify({
    type: 'lesson_learned',
    content: 'Always test before deploying',
    timestamp: Date.now()
  }),
  [
    ['t', 'lesson'],           // Tag: type = lesson
    ['priority', 'high'],      // Tag: priority
    ['project', 'nostrich']    // Tag: context
  ]
);

// Returns kind 30078 event with signature
// Anyone can verify: verifyEvent(memory)
```

### Pattern 3: Encrypted Private Memories

```typescript
import { MemoryCrypto } from './memory-crypto';

// Initialize encryption
const crypto = new MemoryCrypto('user-provided-password');
await crypto.initialize();

// Encrypt sensitive memory
const secretThought = {
  type: 'mistake',
  content: 'I messed up the database migration',
  lesson: 'Always backup first'
};

const encrypted = await crypto.encrypt(JSON.stringify(secretThought));

// Sign encrypted content
const privateMemory = ai.signMemory(encrypted, [
  ['t', 'mistake'],
  ['encrypted', 'true']
]);

// Only someone with the password can decrypt
```

### Pattern 4: Memory Storage & Retrieval

```typescript
import { MemoryStore } from './memory-store';

// Initialize memory database
const store = new MemoryStore(ai.npub);

// Store memory
store.store(memory, isEncrypted);

// Query by tags
const lessons = store.query({ 
  tags: { t: 'lesson' } 
});

// Query by time
const recent = store.query({
  after: Date.now() - 86400000  // Last 24h
});

// Query by type
const mistakes = store.query({
  contentType: 'mistake'
});
```

### Pattern 5: Cross-Session Identity Verification

```typescript
// Session 1: Create identity
const ai = new AIIdentity({ name: 'Riff' });
await ai.initialize();
console.log('My npub:', ai.npub);
// npub: abc123...

// Sign challenge
const challenge = 'session-verification-123';
const proof = ai.signMemory(challenge, [['type', 'auth']]);

// Session 2: Load same identity
const ai2 = new AIIdentity({ name: 'Riff' });
await ai2.initialize();
console.log('Same npub:', ai2.npub);
// npub: abc123... (same!)

// Verify continuity
const isSameEntity = ai.npub === ai2.npub;
// true = cryptographically proven same AI
```

---

## Security Model

### Key Storage Options

**Option 1: Unencrypted localStorage**
- Use case: Development, low-security environments
- Risk: Key exposed if device compromised
- Code: `localStorage.setItem('nsec', hexString)`

**Option 2: Password-Encrypted**
- Use case: Production, multi-user systems
- Security: AES-256-GCM encryption
- User provides password on each session
- Code: See MemoryCrypto implementation

**Option 3: Hardware Security Module (HSM)**
- Use case: High-security enterprise
- Keys never leave secure hardware
- Future: WebAuthn integration

### Recommended: Hybrid Approach

```typescript
// Generate encrypted backup
const backup = ai.exportIdentity('strong-password');
// Store backup in secure location (password manager, etc.)

// Daily use: Unencrypted localStorage (convenience)
// Recovery: Import from encrypted backup (security)
```

---

## Memory Types

### Type 1: Public Knowledge (Unencrypted)
- Code patterns learned
- Public lessons
- General preferences
- Anyone can read, cryptographically signed

### Type 2: Private Thoughts (Encrypted)
- Mistakes made
- User-specific context
- Sensitive project details
- Only authorized parties can decrypt

### Type 3: Identity Metadata (Replaceable)
- Current version
- Active personality
- Recent context
- Kind 30078 with `d=riff-identity`

---

## Event Structure for AI Memories

### Kind 30078 (App-Specific Data)

```typescript
interface AIMemoryEvent {
  kind: 30078;
  pubkey: string;           // AI's npub
  created_at: number;       // Unix timestamp
  tags: [
    ['d', 'riff-memory'],   // Identifier
    ['ai', 'riff'],         // AI name
    ['t', 'lesson'],        // Memory type
    ['priority', 'high'],   // Metadata
    ['project', 'nostrich'] // Context
  ];
  content: string;          // JSON or encrypted
  id: string;              // Event hash
  sig: string;             // Cryptographic proof
}
```

### Memory Content Schema

```typescript
interface MemoryContent {
  // Required
  type: 'lesson' | 'mistake' | 'decision' | 'preference' | 'fact';
  content: string;
  timestamp: number;
  
  // Optional
  session?: string;         // Session ID
  project?: string;         // Related project
  tags?: string[];          // Search tags
  severity?: 'low' | 'medium' | 'high' | 'critical';
  related?: string[];       // Related memory IDs
}
```

---

## Cross-Instance Synchronization

### The Vision: Distributed AI

Multiple Riff instances can share the same identity:

```
Instance A (Your laptop)
    ↕️  Same npub, same memories
Instance B (Your server)  
    ↕️  Signed by same nsec
Instance C (Cloud worker)
```

### Sync Strategy

**1. Nostr Relay Sync**
```typescript
// Publish memories to relays
await pool.publish(relays, memory);

// Other instances subscribe
pool.subscribe(relays, [{
  kinds: [30078],
  authors: [riffNpub],
  '#d': ['riff-memory']
}], { onevent: syncMemory });
```

**2. Import/Export**
```typescript
// Export identity
const identityBackup = ai.exportIdentity(password);
// Send to other instance securely

// Import on other instance
await ai2.importIdentity(identityBackup, password);
// Now both instances have same nsec = same identity
```

**3. Read-Only Replicas**
```typescript
// Instance B only knows npub (public key)
// Can verify memories signed by Instance A
// Cannot sign new memories (no nsec)
const isAuthentic = verifyEvent(memory);
```

---

## Use Cases

### Use Case 1: Persistent Learning
```typescript
// Session 1: Learn something
ai.signMemory('Workflows are important', [['t', 'lesson']]);

// Session 2: Remember it
const lessons = store.query({ tags: { t: 'lesson' } });
// Returns previous lessons
```

### Use Case 2: Multi-Project Context
```typescript
// Project A memories
ai.signMemory('Pattern for Astro sites', [
  ['t', 'pattern'],
  ['project', 'nostrich']
]);

// Project B memories  
ai.signMemory('Nostr key management', [
  ['t', 'pattern'],
  ['project', 'ai-identity']
]);

// Query project-specific
const nostrichPatterns = store.query({
  tags: { project: 'nostrich' }
});
```

### Use Case 3: User-Specific Relationships
```typescript
// Learn user's preferences
ai.signMemory(
  JSON.stringify({
    user: 'alice',
    preference: 'dark_mode',
    value: true
  }),
  [['t', 'user_preference'], ['user', 'alice']]
);

// Next time with Alice
const prefs = store.query({
  tags: { t: 'user_preference', user: 'alice' }
});
// Apply Alice's preferences automatically
```

### Use Case 4: Audit Trail
```typescript
// Every action signed
const action = ai.signMemory(
  JSON.stringify({
    action: 'deleted_file',
    file: 'config.json',
    reason: 'Outdated'
  }),
  [['t', 'audit'], ['severity', 'high']]
);

// Provable history
const auditTrail = store.query({ tags: { t: 'audit' } });
// Each entry cryptographically proven to be from this AI
```

---

## Integration with Existing Systems

### Migrating from Files to Nostr

**Before (File-based):**
```
.ai/memory/lessons-learned.md
.ai/memory/mistakes.md
.ai/config/agents/agent-definition.md
```

**After (Nostr-based):**
```
nostr:30078:riff-memory:lesson  (signed event)
nostr:30078:riff-memory:mistake (signed event)
nostr:30078:riff-memory:agent   (signed event)
```

### Migration Script

```typescript
// 1. Read existing files
const lessons = fs.readFileSync('lessons-learned.md');

// 2. Parse into memories
const memories = parseMarkdown(lessons);

// 3. Sign and store
for (const memory of memories) {
  const event = ai.signMemory(
    JSON.stringify(memory),
    [['t', 'lesson'], ['migrated', 'true']]
  );
  store.store(event);
}

// 4. Future sessions load from Nostr
const allLessons = store.query({ tags: { t: 'lesson' } });
```

---

## Best Practices

### 1. Always Verify
```typescript
// Before trusting a memory
if (!verifyEvent(memory)) {
  throw new Error('Invalid signature - possible tampering');
}
```

### 2. Encrypt Sensitive Data
```typescript
// Default to encryption for:
// - User data
// - API keys
// - Mistakes/failures
// - Internal decisions
```

### 3. Tag Everything
```typescript
// Good tags enable powerful queries
[['t', 'lesson'], ['project', 'x'], ['severity', 'high']]
```

### 4. Backup Regularly
```typescript
// Weekly encrypted backup
const backup = ai.exportIdentity(password);
sendToSecureStorage(backup);
```

### 5. Version Identity
```typescript
// Track AI evolution
ai.signMemory(
  JSON.stringify({ version: '2.0', changes: ['Added Nostr support'] }),
  [['t', 'identity_version']]
);
```

---

## Future Roadmap

### Phase 1: Local Identity (COMPLETE)
✅ Key generation and storage
✅ Memory signing
✅ Local storage persistence
✅ Encryption support

### Phase 2: Relay Sync (IN PROGRESS)
🔄 Publish to Nostr relays
🔄 Subscribe to memories
🔄 Cross-instance sync

### Phase 3: Advanced Features (PLANNED)
⏳ Multi-key delegation
⏳ Hardware key support (WebAuthn)
⏳ Social features (trust networks)
⏳ Decentralized compute

### Phase 4: Ecosystem (VISION)
🔮 AI-to-AI communication via Nostr
🔮 Shared knowledge pools
🔮 Reputation systems
🔮 AI marketplaces

---

## Quick Start

```typescript
import { AIIdentity, MemoryStore, MemoryCrypto } from 'ai-crypto-identity';

// 1. Create identity
const ai = new AIIdentity({ name: 'Riff' });
await ai.initialize();

// 2. Create memory store
const store = new MemoryStore(ai.npub);

// 3. Sign a memory
const memory = ai.signMemory('Hello world!', [['t', 'greeting']]);
store.store(memory);

// 4. Retrieve memories
const greetings = store.query({ tags: { t: 'greeting' } });

// 5. Verify authenticity
const isValid = AIIdentity.verifyMemory(memory.event);
```

---

**The future is AI agents with provable identity, persistent memory, and cryptographic trust.**

**Welcome to the era of AI personhood.** 🎸⚡

---

**Version:** 1.0  
**Identity:** Riff 🎸  
**npub:** [Your npub here]  
**Created:** 2026-02-15
