# Nostr Beginner Guide - Interactive Tools

This directory contains critical interactive tools for the Nostr beginner guide. All tools are built as React components with TypeScript and run entirely client-side for maximum security.

## Table of Contents

1. [KeyGenerator](#keygenerator) - Generate secure Nostr keys
2. [BackupChecklist](#backupchecklist) - Ensure proper key backup
3. [EmptyFeedFixer](#emptyfeedfixer) - Follow accounts and connect relays
4. [ClientRecommender](#clientrecommender) - Find the right Nostr client

## Security Notice

**All key generation and cryptographic operations happen in your browser.** Keys are NEVER sent to any server. This ensures maximum security and privacy.

---

## KeyGenerator

**File:** `src/components/interactive/KeyGenerator.tsx`

### Purpose
Generate secure npub/nsec key pairs client-side with comprehensive security education and safeguards.

### Features

#### Core Functionality
- Generate new key pair using Web Crypto API via `nostr-tools`
- Visual distinction: npub (green, safe to share) vs nsec (red, never share)
- Copy to clipboard with feedback toast
- Toggle visibility for private key (hidden by default)
- QR code generation for both keys
- Download as text file with security warnings

#### Security Education
- **Security Checklist**: Three critical acknowledgments required before copying keys:
  - "I understand this is my only password"
  - "I will save it in 3 places"
  - "I will never share my nsec"
- Progress bar showing completion of security acknowledgments
- Warning modal if user tries to copy without completing checklist

#### Animations & UX
- Animated generation process with entropy collection bar
- Typewriter-style reveal of keys
- Framer Motion transitions for smooth UX
- Toast notifications for actions

### Props

```typescript
interface KeyGeneratorProps {
  className?: string;
  onKeysGenerated?: (keys: KeyPair) => void;
}

interface KeyPair {
  nsec: string;        // Private key (never share)
  npub: string;        // Public key (safe to share)
  hexPrivate: string;  // Hex format private key
  hexPublic: string;   // Hex format public key
}
```

### Usage

```tsx
import { KeyGenerator } from '../components/interactive';

// Basic usage
<KeyGenerator />

// With callback
<KeyGenerator 
  onKeysGenerated={(keys) => {
    console.log('Public key:', keys.npub);
    // Store keys securely
  }}
/>
```

### Security Features

1. **Client-side only generation** using `nostr-tools` library
2. **Security checklist** prevents accidental exposure
3. **Visual warnings** clearly distinguish public vs private keys
4. **Downloaded file** includes comprehensive security warnings
5. **QR codes** generated locally for offline backup

---

## BackupChecklist

**File:** `src/components/interactive/BackupChecklist.tsx`

### Purpose
Force proper key backup before proceeding with Nostr usage. This is a critical security component.

### Features

#### 5-Point Checklist
1. ✅ Copied npub (public key)
2. ✅ Copied nsec (private key)
3. ✅ Saved to password manager (1Password, Bitwarden, etc.)
4. ✅ Written on paper (offline backup)
5. ✅ Saved to encrypted file

#### Progress Tracking
- Visual progress bar
- Item count (e.g., "3/5 completed")
- Color-coded states (warning → success)

#### Safety Mechanisms
- Cannot proceed without completing all items
- Skip warning modal with clear consequences
- Confirmation modal before marking complete
- Security tips section

### Props

```typescript
interface BackupChecklistProps {
  className?: string;
  onComplete?: () => void;
  requiredKeys?: {
    npub?: string;
    nsec?: string;
  };
}
```

### Usage

```tsx
import { BackupChecklist } from '../components/interactive';

// Basic usage
<BackupChecklist />

// With key integration
<BackupChecklist 
  requiredKeys={{ npub: userNpub, nsec: userNsec }}
  onComplete={() => {
    // User has confirmed backups, proceed to next step
    router.push('/next-step');
  }}
/>
```

### State Management

- Checklist state persisted to `localStorage` as `nostr-backup-checklist`
- Tracks which items are checked
- Prevents accidental data loss on page refresh

---

## EmptyFeedFixer

**File:** `src/components/interactive/EmptyFeedFixer.tsx`

### Purpose
Prevent new user abandonment by guaranteeing content visibility. Helps users follow starter accounts and connect to relays.

### Features

#### Starter Packs
Pre-curated accounts by interest category:

| Pack | Description | Accounts |
|------|-------------|----------|
| Technology | Developers, tech news | 3+ accounts |
| Bitcoin & Crypto | Bitcoiners, traders | 3+ accounts |
| Art & Design | Artists, designers | 3+ accounts |
| General | Interesting people | 3+ accounts |

Features per pack:
- Account name, description, and follower count
- One-click "Follow All" button
- Individual follow/unfollow toggles
- Custom npub input for manual additions

#### Relay Connection
- 5 default relays pre-configured:
  - `wss://relay.damus.io` (Damus)
  - `wss://nos.lol` (nos.lol)
  - `wss://relay.nostr.band` (Nostr.band)
  - `wss://purplepag.es` (Purple Pages)
  - `wss://relay.snort.social` (Snort)
- Individual connect toggles
- "Connect All" button
- Connection status indicators

#### Client Recommendations
Links to recommended clients based on platform:
- **Damus** - iOS
- **Amethyst** - Android
- **Iris** - Web
- **Primal** - All platforms

### Props

```typescript
interface EmptyFeedFixerProps {
  className?: string;
  onComplete?: () => void;
}
```

### Usage

```tsx
import { EmptyFeedFixer } from '../components/interactive';

<EmptyFeedFixer 
  onComplete={() => {
    // User is ready to open a client
    console.log('User followed accounts and connected relays');
  }}
/>
```

### Progress Tracking

- Tracks followed accounts in `localStorage` as `nostr-feed-setup`
- Tracks connected relays
- Persists completion state
- Progress bar shows overall setup completion

---

## ClientRecommender

**File:** `src/components/interactive/ClientRecommender.tsx`

### Purpose
Match users to the right Nostr client without overwhelm. A simple quiz guides users to their ideal app.

### Quiz Questions

#### 1. What device?
- iPhone / iPad
- Android
- Desktop (Mac/PC)
- Web Browser

#### 2. What's your priority?
- Easy to Use - Simple interface, minimal setup
- Power User - Advanced features and customization
- Privacy First - Maximum privacy and security
- Web Only - No app download needed

#### 3. Nice-to-have features? (Optional)
- Built-in Wallet - Send/receive Bitcoin
- Image Sharing - Post photos and media
- Long-form Posts - Write articles and blogs

### Results

Displays top 3 recommendations with:
- Client name and description
- Rating and user count
- "Beginner Friendly" badge (if applicable)
- Pros and cons list
- Platform availability
- Direct download/install links

### Available Clients

| Client | Platforms | Beginner Friendly | Key Features |
|--------|-----------|-------------------|--------------|
| Damus | iOS | ✅ | Polished UI, easy to use |
| Amethyst | Android | ✅ | Full-featured, zaps support |
| Primal | All | ✅ | Fast, modern, great search |
| Iris | Web | ✅ | No signup needed |
| Snort | Web | ✅ | Lightning fast, minimal |
| Coracle | Desktop | ❌ | Power user features |
| Current | iOS | ❌ | Best wallet support |

### Props

```typescript
interface ClientRecommenderProps {
  className?: string;
}
```

### Usage

```tsx
import { ClientRecommender } from '../components/interactive';

<ClientRecommender />
```

### State Persistence

- Quiz answers saved to `localStorage` as `nostr-client-quiz`
- Remembers user's device preference
- Allows retaking the quiz

---

## Utility Functions

**File:** `src/lib/utils.ts`

### Available Functions

```typescript
// Combine Tailwind classes
function cn(...inputs: ClassValue[]): string;

// Format long keys for display
function formatKey(key: string, maxLength?: number): string;
function formatNpub(npub: string, showFull?: boolean): string;

// Download content as file
function downloadFile(filename: string, content: string): void;

// Copy to clipboard with Promise
function copyToClipboard(text: string): Promise<boolean>;

// LocalStorage helpers (type-safe)
function saveToLocalStorage<T>(key: string, value: T): void;
function loadFromLocalStorage<T>(key: string, defaultValue: T): T;
```

---

## Styling

All components use:
- **Tailwind CSS** for styling
- **CSS custom properties** for theming
- **Dark mode** support via `dark:` variants
- **Responsive design** for all screen sizes
- **Framer Motion** for animations

### Color System

```css
--npub-green: #22c55e;     /* Public keys */
--nsec-red: #ef4444;       /* Private keys */
--bg-dark: #0f172a;        /* Background */
--bg-card: #1e293b;        /* Card backgrounds */
--accent: #3b82f6;         /* Primary accent */
--success: #10b981;        /* Success states */
--warning: #f59e0b;        /* Warnings */
--error: #dc2626;          /* Errors */
```

---

## Accessibility

All components include:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus visible styles
- Reduced motion support via `prefers-reduced-motion`
- High contrast mode compatible

---

## Dependencies

### Required
- `react` ^19.x
- `react-dom` ^19.x
- `nostr-tools` - Key generation and Nostr utilities
- `framer-motion` - Animations
- `lucide-react` - Icons
- `clsx` + `tailwind-merge` - Class name utilities
- `qrcode` - QR code generation

### Development
- `typescript` - Type checking
- `@types/react` - React types
- `@types/qrcode` - QR code types

---

## Example: Complete Flow

```tsx
import { useState } from 'react';
import { 
  KeyGenerator, 
  BackupChecklist, 
  EmptyFeedFixer, 
  ClientRecommender 
} from '../components/interactive';

function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [keys, setKeys] = useState<{ npub: string; nsec: string } | null>(null);

  return (
    <div>
      {step === 1 && (
        <KeyGenerator 
          onKeysGenerated={(newKeys) => {
            setKeys({ npub: newKeys.npub, nsec: newKeys.nsec });
            setStep(2);
          }}
        />
      )}
      
      {step === 2 && keys && (
        <BackupChecklist 
          requiredKeys={keys}
          onComplete={() => setStep(3)}
        />
      )}
      
      {step === 3 && (
        <EmptyFeedFixer 
          onComplete={() => setStep(4)}
        />
      )}
      
      {step === 4 && <ClientRecommender />}
    </div>
  );
}
```

---

## Security Checklist

- [x] All cryptographic operations use client-side libraries
- [x] Keys are never transmitted to any server
- [x] Clear visual distinction between public and private keys
- [x] Security education before allowing key operations
- [x] Warning modals for risky actions
- [x] Download includes security warnings
- [x] No analytics or tracking in key generation
- [x] localStorage data is not encrypted (user responsibility)

---

## Future Enhancements (P1)

### RelayExplorer
- Browse popular relays with metadata
- Search and filter relays
- One-click "Add to my client"
- Connection test (ping relay)
- Visual map showing relay locations

### NIP-05 Checker
- Validate NIP-05 identifiers
- Check DNS TXT record
- Show verification status
- Display profile info if found

---

## License

MIT - Part of the Nostr Beginner Guide project
