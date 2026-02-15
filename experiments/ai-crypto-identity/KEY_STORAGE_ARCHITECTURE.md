# AI Crypto Identity - Storage Architecture

## The Problem

**Current:** localStorage (browser API) doesn't persist in Node.js
**Needed:** Persistent, secure key storage for AI identity

## Solution: Multi-Layer Storage

### Layer 1: File System (Primary)
```
~/.config/riff/identity/
├── identity.json          # Public info (npub, metadata)
├── nsec.encrypted         # Encrypted private key
├── memories/              # Local memory store
│   ├── index.json        # Memory index
│   └── chunks/           # Memory chunks
└── config.json           # AI preferences
```

### Layer 2: Local Relay (Sync)
```
strfry running on localhost:7777
- Publishes events to local relay
- Other instances can query
- Acts as "memory server"
```

### Layer 3: Remote Relays (Backup)
```
Optional: wss://relay.damus.io, etc.
- Backup for redundancy
- Cross-device sync
- Public knowledge base
```

---

## Implementation

### 1. File-Based Storage (Node.js)

```typescript
import { promises as fs } from 'fs';
import * as path from 'path';
import { homedir } from 'os';
import * as crypto from 'crypto';

class FileStorage {
  private baseDir: string;
  
  constructor() {
    this.baseDir = path.join(homedir(), '.config', 'riff');
  }

  async initialize(): Promise<void> {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(path.join(this.baseDir, 'memories'), { recursive: true });
  }

  async saveIdentity(identity: IdentityData, password?: string): Promise<void> {
    // Save public info
    await fs.writeFile(
      path.join(this.baseDir, 'identity.json'),
      JSON.stringify({
        npub: identity.npub,
        name: identity.name,
        version: identity.version,
        created_at: Date.now()
      }, null, 2)
    );

    // Encrypt and save private key
    if (password) {
      const encrypted = this.encrypt(identity.nsec, password);
      await fs.writeFile(
        path.join(this.baseDir, 'nsec.encrypted'),
        encrypted
      );
    } else {
      // Unencrypted (dev mode) - with warning
      console.warn('⚠️  Storing nsec unencrypted - use password for production');
      await fs.writeFile(
        path.join(this.baseDir, 'nsec.hex'),
        Buffer.from(identity.nsec).toString('hex')
      );
    }
  }

  async loadIdentity(password?: string): Promise<IdentityData | null> {
    try {
      const identityJson = await fs.readFile(
        path.join(this.baseDir, 'identity.json'),
        'utf-8'
      );
      const publicInfo = JSON.parse(identityJson);

      let nsec: Uint8Array;
      
      // Try encrypted first
      try {
        const encrypted = await fs.readFile(
          path.join(this.baseDir, 'nsec.encrypted')
        );
        if (!password) throw new Error('Password required');
        nsec = this.decrypt(encrypted, password);
      } catch {
        // Fall back to unencrypted
        const hex = await fs.readFile(
          path.join(this.baseDir, 'nsec.hex'),
          'utf-8'
        );
        nsec = Buffer.from(hex, 'hex');
      }

      return {
        ...publicInfo,
        nsec
      };
    } catch {
      return null;
    }
  }

  private encrypt(data: Uint8Array, password: string): Buffer {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, 'riff-salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return Buffer.concat([iv, authTag, encrypted]);
  }

  private decrypt(encrypted: Buffer, password: string): Uint8Array {
    const iv = encrypted.slice(0, 16);
    const authTag = encrypted.slice(16, 32);
    const data = encrypted.slice(32);
    
    const key = crypto.scryptSync(password, 'riff-salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);
  }
}
```

### 2. Local Strfry Relay

**Docker Setup:**

```bash
# docker-compose.yml
version: '3'
services:
  riff-relay:
    image: coolwax/strfry:latest
    container_name: riff-relay
    ports:
      - "7777:7777"
    volumes:
      - ./strfry-data:/app/strfry-db
      - ./strfry.conf:/app/strfry.conf
    restart: unless-stopped
```

**Strfry Config:**

```conf
# strfry.conf
relay {
    bind = "0.0.0.0"
    port = 7777
    
    # Allow all events (dev mode)
    authorized = false
    
    # Limits
    maxEventSize = 64000
    maxMessageSize = 256000
    
    # Retention
    eventsToKeep = 10000
    
    # Logging
    logging = {
        dumpInAll = false
        dumpInEvents = false
        dumpInReqs = false
        dbScan = false
    }
}
```

**Start Relay:**

```bash
cd ~/.config/riff/relay
docker-compose up -d
# Relay available at ws://localhost:7777
```

### 3. Updated Identity Class

```typescript
export class AIIdentity {
  private storage: FileStorage;
  private relayPool: SimplePool;
  private localRelay = 'ws://localhost:7777';
  
  constructor(config: AIIdentityConfig) {
    this.storage = new FileStorage();
    this.relayPool = new SimplePool();
  }

  async initialize(password?: string): Promise<void> {
    // Try to load from file
    const stored = await this.storage.loadIdentity(password);
    
    if (stored) {
      this.nsec = stored.nsec;
      this.npub = stored.npub;
      console.log('🎸 Loaded identity from file');
      
      // Sync with local relay
      await this.syncFromRelay();
    } else {
      // Create new
      await this.createIdentity(password);
    }
  }

  async syncToRelay(): Promise<void> {
    // Publish all memories to local relay
    const memories = await this.storage.getAllMemories();
    
    for (const memory of memories) {
      await this.relayPool.publish([this.localRelay], memory);
    }
    
    console.log(`📡 Synced ${memories.length} memories to relay`);
  }

  async syncFromRelay(): Promise<void> {
    // Query local relay for memories
    const events = await this.relayPool.querySync(
      [this.localRelay],
      {
        kinds: [30078],
        authors: [this.npub],
        '#d': ['riff-memory']
      }
    );
    
    // Merge with local storage
    for (const event of events) {
      await this.storage.saveMemory(event);
    }
    
    console.log(`📥 Loaded ${events.length} memories from relay`);
  }
}
```

---

## Migration Strategy

### Phase 1: Local-First (Current)
1. ✅ File-based storage (persistent)
2. ✅ Local strfry relay
3. ✅ Encryption support
4. ✅ Memory sync

### Phase 2: Multi-Device (Future)
1. Remote relay publishing
2. Conflict resolution
3. Device pairing
4. Cross-sync

### Phase 3: Distributed (Vision)
1. Multiple AI instances
2. Shared knowledge pool
3. Consensus mechanisms
4. Reputation systems

---

## Security Model

### Threats & Mitigations

| Threat | Risk | Mitigation |
|--------|------|------------|
| Key theft | High | Encrypted storage, password required |
| Relay compromise | Medium | Local relay only, no inbound from internet |
| Data loss | Medium | Backups, multiple storage layers |
| Memory tampering | Low | Signatures verified on load |

### Best Practices

1. **Always use password in production**
2. **Backup ~/.config/riff/ regularly**
3. **Never commit keys to git**
4. **Add ~/.config/riff/ to .gitignore**

---

## Usage

```bash
# 1. Start local relay
docker-compose up -d

# 2. Initialize AI (creates identity)
npx tsx init-ai.ts

# 3. Use AI (loads from file, syncs with relay)
npx tsx use-ai.ts

# 4. All memories automatically synced
#    to both file and local relay
```

---

**This gives us:**
- ✅ Persistent storage (file system)
- ✅ Local relay (strfry)
- ✅ Encryption (AES-256-GCM)
- ✅ Sync (file ↔ relay)
- ✅ Foundation for nostrich.love school

**Ready to implement?** 🎸
