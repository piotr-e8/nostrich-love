# Nostr Beginner Guide - Translation Reference

## Overview

This document serves as a comprehensive reference for translating **UI elements** in the Nostr Beginner Guide into new languages. It catalogs all translation keys, their usage patterns, and provides guidance for adding new languages.

**For translating guide content (MDX files), see:** [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)

**Current Languages:** English (en), Polish (pl), Spanish (es)  
**Total Translation Keys:** ~690 unique keys  
**Translation Files Location:** `/src/i18n/locales/{en,pl,es}.json`

---

## Translation Scope

This document covers:
- ✅ **UI translations** - Buttons, labels, messages (JSON files)
- ✅ **Interactive components** - KeyGenerator, quizzes, tools
- ✅ **Navigation** - Menus, breadcrumbs, CTAs

For **guide content translation** (16 MDX files per language), see:
- 📄 [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md) - Complete guide file translation workflow

---

## Quick Start: Adding a New Language

### Step 1: Create Translation File

Create a new JSON file at `/src/i18n/locales/{locale}.json` (e.g., `de.json` for German).

### Step 2: Copy Structure

Copy the complete structure from `en.json` and translate all values while keeping keys intact.

### Step 3: Register Locale

Update `/src/i18n/types.ts`:
```typescript
export type Locale = 'en' | 'pl' | 'es' | 'de'; // Add your locale
```

### Step 4: Import Translation

Update `/src/i18n/index.ts` to import and register your translations.

---

## Translation Key Categories

### 1. UI Elements (`ui.*`)

Base key: `ui`

#### Buttons (`ui.buttons.*`)
| Key | English | Description |
|-----|---------|-------------|
| `submit` | "Submit" | Form submission |
| `next` | "Next" | Navigation forward |
| `previous` | "Previous" | Navigation back |
| `checkAnswer` | "Check Answer" | Quiz validation |
| `startLearning` | "Start Learning" | Begin guide |
| `learnMore` | "Learn More" | Additional info |

#### Search (`ui.search.*`)
| Key | English | Description |
|-----|---------|-------------|
| `placeholder` | "Search guides..." | Search input placeholder |
| `noResults` | "No guides found" | Empty search results |
| `searching` | "Searching..." | Search in progress |

#### Common (`ui.common.*`)
| Key | English |
|-----|---------|
| `loading` | "Loading..." |
| `error` | "Error" |
| `success` | "Success" |
| `minutes` | "min" |

#### Navigation (`ui.navigation.*`)
| Key | English |
|-----|---------|
| `nextGuide` | "Next Guide" |
| `previousGuide` | "Previous Guide" |
| `backToGuides` | "Back to Guides" |

#### Badges (`ui.badges.*`)
| Key | English |
|-----|---------|
| `earned` | "Earned" |
| `locked` | "Locked" |
| `viewAll` | "View All" |

#### Progress (`ui.progress.*`)
| Key | English |
|-----|---------|
| `completed` | "Completed" |
| `of` | "of" |
| `guidesCompleted` | "guides completed" |
| `currentStreak` | "Current streak" |

#### Quiz UI (`ui.quiz.*`)
| Key | English | Placeholders |
|-----|---------|--------------|
| `loading` | "Loading quiz..." | - |
| `gradeTitle` | "{{title}}: {{rate}}%" | `{{title}}`, `{{rate}}` |
| `scoreDisplay` | "{{score}}/{{total}}" | `{{score}}`, `{{total}}` |
| `conceptsMastered` | "Concepts mastered:" | - |
| `nextSteps` | "Next Steps" | - |
| `perfectScore` | "Perfect score!" | - |
| `reviewSections` | "Review these sections:" | - |
| `retakeQuiz` | "Retake Quiz" | - |
| `questionCounter` | "{{current}} of {{total}}" | `{{current}}`, `{{total}}` |
| `answered` | "Answered" | - |
| `backButton` | "Back" | - |
| `nextButton` | "Next" | - |
| `seeResults` | "See Results" | - |
| `severity.critical` | "P0 Critical" | - |
| `severity.warning` | "Best Practice" | - |
| `severity.info` | "Good to know" | - |
| `feedback.correct` | "Nice!" | - |
| `feedback.incorrect` | "Not quite" | - |

---

### 2. Interactive Components

#### 2.1 Key Generator (`keyGenerator.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Key Generator" |
| | `description` | "Generate your Nostr keys..." |
| Buttons | `buttons.generate` | "Generate Keys" |
| | `buttons.generating` | "Generating..." |
| | `buttons.regenerate` | "Generate New Keys" |
| Progress | `progress.collectingEntropy` | "Collecting entropy..." |
| | `progress.securityAcknowledgment` | "Security acknowledgment" |
| Security Warning | `securityWarning.title` | "Important Security Warning" |
| | `securityWarning.description` | "Your private key is like a password..." |
| Security Checklist | `securityChecklist.title` | "Security Checklist" |
| | `securityChecklist.items.understand.label` | "I understand that losing my private key..." |
| | `securityChecklist.items.threePlaces.label` | "I will store my keys in at least 3 separate places" |
| | `securityChecklist.items.neverShare.label` | "I will never share my private key (nsec) with anyone" |
| Keys Public | `keys.public.title` | "Public Key (npub)" |
| | `keys.public.badge` | "Safe to share" |
| | `keys.public.description` | "This is your public identifier..." |
| | `keys.public.copy` | "Copy npub" |
| | `keys.public.qrCode` | "Download QR" |
| Keys Private | `keys.private.title` | "Private Key (nsec)" |
| | `keys.private.badge` | "KEEP SECRET" |
| | `keys.private.description` | "This is your password..." |
| | `keys.private.copy` | "Copy nsec" |
| | `keys.private.download` | "Download Backup" |
| | `keys.private.qrCode` | "Download QR" |
| | `keys.private.show` | "Show private key" |
| | `keys.private.hide` | "Hide private key" |
| Modal | `modal.title` | "Wait! Have you completed the security checklist?" |
| | `modal.description` | "Copying your private key without proper security measures..." |
| | `modal.goBack` | "Go Back" |
| | `modal.copyAnyway` | "I understand, copy anyway" |
| Toast | `toast.success` | "Keys generated successfully!" |
| | `toast.copied` | "Copied {label} to clipboard" |
| | `toast.copyFailed` | "Failed to copy" |
| | `toast.downloaded` | "Backup file downloaded" |
| Backup File | `backupFile.title` | "NOSTR KEY BACKUP" |
| | `backupFile.generated` | "Generated" |
| | `backupFile.publicKey` | "Public Key (npub)" |
| | `backupFile.privateKey` | "Private Key (nsec)" |
| | `backupFile.hexPrivate` | "Hex Private Key" |
| | `backupFile.hexPublic` | "Hex Public Key" |
| | `backupFile.warnings.title` | "⚠️ IMPORTANT WARNINGS" |
| | `backupFile.warnings.keepSecret` | "Keep your private key secret" |
| | `backupFile.warnings.neverShare` | "Never share your nsec with anyone" |
| | `backupFile.warnings.storeBackups` | "Store backups in multiple secure locations" |
| | `backupFile.warnings.onlyPassword` | "Your private key is your only password - there is no reset" |

#### 2.2 Troubleshooting Wizard (`troubleshootingWizard.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Troubleshooting Wizard" |
| | `description` | "Diagnose and fix common Nostr issues..." |
| | `step` | "Step {current} of {total}" |
| | `back` | "Back" |
| | `startOver` | "Start Over" |
| | `saveDiagnosticInfo` | "Save Diagnostic Info" |
| | `stillNeedHelp` | "Still need help?" |
| | `askOnNostr` | "Ask on Nostr" |
| | `documentation` | "Documentation" |
| Severity | `severity.high` | "High Priority" |
| | `severity.medium` | "Medium Priority" |
| | `severity.low` | "Low Priority" |
| Sections | `stepsToFix` | "Steps to Fix" |
| | `proTips` | "Pro Tips" |
| | `helpfulResources` | "Helpful Resources" |
| Diagnostic Info | `diagnosticInfo.title` | "Diagnostic Information" |
| | `diagnosticInfo.description` | "Copy this information..." |
| | `diagnosticInfo.copy` | "Copy to Clipboard" |
| | `diagnosticInfo.close` | "Close" |

**Questions & Solutions:**
The Troubleshooting Wizard has an extensive question tree with 30+ questions and 20+ solutions. Each question has:
- `text` - The question text
- `options` - Array of option objects with `id`, `label`, `nextQuestion?`, `solution?`

Each solution has:
- `title` - Solution title
- `description` - Solution description
- `steps` - Array of step strings
- `tips?` - Optional array of pro tips
- `resources?` - Optional array of resource links

#### 2.3 NIP-05 Checker (`nip05Checker.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "NIP-05 Identity Checker" |
| | `description` | "Verify NIP-05 identifiers..." |
| | `whatIsNip05` | "What is NIP-05?" |
| | `aboutNip05` | "NIP-05 is a Nostr protocol..." |
| Benefits | `benefits.humanReadable` | "Human-readable identifier" |
| | `benefits.domainOwnership` | "Proves domain ownership" |
| | `benefits.checkmark` | "Verified checkmark in clients" |
| Form | `form.placeholder` | "username@domain.com" |
| | `form.verifyButton` | "Verify" |
| | `form.checking` | "Checking..." |
| | `form.recent` | "Recent checks:" |
| Results Valid | `results.valid.title` | "Valid NIP-05" |
| | `results.valid.description` | "This identifier is valid..." |
| | `results.valid.publicKey` | "Public Key" |
| | `results.valid.recommendedRelays` | "Recommended Relays" |
| Results Invalid | `results.invalid.title` | "Invalid NIP-05" |
| | `results.invalid.description` | "This identifier could not be verified..." |
| Actions | `results.checkAnother` | "Check Another" |
| | `results.getYourOwn` | "Get Your Own NIP-05" |
| Errors | `errors.invalidFormat.title` | "Invalid Format" |
| | `errors.invalidFormat.description` | "NIP-05 should be in format..." |
| | `errors.invalidFormat.fix` | "Enter a valid identifier..." |
| | `errors.domainNotFound.title` | "Domain Not Found" |
| | `errors.domainNotFound.description` | "The domain could not be reached..." |
| | `errors.domainNotFound.fix` | "Check the domain name..." |
| | `errors.notConfigured.title` | "Not Configured" |
| | `errors.notConfigured.description` | "The domain exists but..." |
| | `errors.notConfigured.fix` | "Contact the domain owner..." |
| | `errors.jsonError.title` | "JSON Error" |
| | `errors.jsonError.description` | "The server returned..." |
| | `errors.jsonError.fix` | "Try again later..." |
| | `errors.networkError.title` | "Network Error" |
| | `errors.networkError.description` | "Could not connect..." |
| | `errors.networkError.fix` | "Check your internet..." |
| Providers | `providers.title` | "NIP-05 Providers" |
| | `providers.getOne` | "Get a NIP-05" |

#### 2.4 Empty Feed Fixer (`emptyFeedFixer.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Empty Feed Fixer" |
| | `description` | "Fix your empty feed..." |
| | `setupProgress` | "Setup Progress" |
| Step 1 | `step1.title` | "Step 1: Follow People" |
| | `step1.description` | "Start by following..." |
| | `step1.following` | "Following" |
| | `step1.followAll` | "Follow All" |
| | `step1.follow` | "Follow" |
| | `step1.addCustom` | "Add Custom" |
| | `step1.continue` | "Continue" |
| Step 2 | `step2.title` | "Step 2: Connect Relays" |
| | `step2.description` | "Connect to relays..." |
| | `step2.connected` | "Connected" |
| | `step2.connect` | "Connect" |
| | `step2.connectAll` | "Connect All" |
| | `step2.continue` | "Continue" |
| | `step2.info` | "Relays store and forward..." |
| | `step2.recommended` | "Recommended" |
| Step 3 | `step3.title` | "Step 3: Make Your First Post" |
| | `step3.description` | "Create your first post..." |
| | `step3.completed` | "Setup Complete!" |
| | `step3.successMessage` | "You're all set!" |
| | `step3.awesome` | "Awesome!" |

**Starter Packs:**
| Key | English |
|-----|---------|
| `starterPacks.technology.name` | "Tech Enthusiasts" |
| `starterPacks.technology.description` | "Developers and tech professionals" |
| `starterPacks.bitcoin.name` | "Bitcoiners" |
| `starterPacks.bitcoin.description` | "Bitcoin enthusiasts and developers" |
| `starterPacks.art.name` | "Artists" |
| `starterPacks.art.description` | "Digital artists and creators" |
| `starterPacks.general.name` | "General" |
| `starterPacks.general.description` | "A mix of interesting people" |

**Relays:**
| Key | English |
|-----|---------|
| `relays.wssRelayDamus.name` | "Damus Relay" |
| `relays.wssRelayDamus.description` | "Main Damus relay" |
| `relays.wssRelayNostr.name` | "Nostr.watch" |
| `relays.wssRelayNostr.description` | "Public relay aggregator" |
| `relays.wssPurplePages.name` | "Purple Pages" |
| `relays.wssPurplePages.description` | "NIP-05 verification relay" |

#### 2.5 Backup Checklist (`backupChecklist.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Backup Checklist" |
| | `description` | "Secure your keys..." |
| | `progress` | "Progress" |
| Checklist | `checklist.copiedNpub.label` | "✓ Copied your npub (public key)" |
| | `checklist.copiedNpub.description` | "Your public identifier..." |
| | `checklist.copiedNsec.label` | "✓ Copied your nsec (private key)" |
| | `checklist.copiedNsec.description` | "Your secret password..." |
| | `checklist.copiedNsec.warning` | "⚠️ Never share this with anyone!" |
| | `checklist.passwordManager.label` | "✓ Saved in password manager" |
| | `checklist.passwordManager.description` | "Use 1Password, Bitwarden, etc." |
| | `checklist.paperBackup.label` | "✓ Created paper backup" |
| | `checklist.paperBackup.description` | "Write keys on paper..." |
| | `checklist.encryptedFile.label` | "✓ Saved encrypted file" |
| | `checklist.encryptedFile.description` | "Encrypt and store on USB/drive" |
| Buttons | `buttons.copyNpub` | "Copy npub" |
| | `buttons.copyNsec` | "Copy nsec" |
| | `buttons.completeAll` | "Complete All" |
| | `buttons.completeRequired` | "Complete Required" |
| | `buttons.skip` | "Skip for now" |
| Security Tips | `securityTips.title` | "🔒 Security Tips" |
| | `securityTips.items.0` | "Store backups in different physical locations" |
| | `securityTips.items.1` | "Use a password manager for digital copies" |
| | `securityTips.items.2` | "Never store nsec in plain text on cloud services" |
| | `securityTips.items.3` | "Consider a hardware wallet for large amounts" |
| Completion | `completion.title` | "🎉 Backup Complete!" |
| | `completion.description` | "Your keys are now backed up securely." |
| | `completion.reset` | "Reset Checklist" |
| Skip Modal | `skipModal.title` | "⚠️ Skip Backup?" |
| | `skipModal.description` | "We strongly recommend completing the backup..." |
| | `skipModal.risks.0` | "Permanent loss of account if keys are lost" |
| | `skipModal.risks.1` | "No way to recover access without backup" |
| | `skipModal.risks.2` | "All data and connections will be unrecoverable" |
| | `skipModal.goBack` | "Go Back" |
| | `skipModal.skipAnyway` | "Skip Anyway" |
| Confirm Modal | `confirmModal.title` | "Confirm Backup Complete?" |
| | `confirmModal.description` | "Only confirm after you've actually backed up..." |
| | `confirmModal.review` | "Review Checklist" |
| | `confirmModal.confirm` | "Yes, I've Backed Up" |

#### 2.6 Client Comparison Table (`clientComparisonTable.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Client Comparison" |
| | `description` | "Compare Nostr clients..." |
| | `searchPlaceholder` | "Search clients..." |
| | `clearFilters` | "Clear Filters" |
| | `export` | "Export" |
| Filters | `filters.button` | "Filters" |
| | `filters.platform` | "Platform" |
| | `filters.features` | "Features" |
| | `filters.difficulty` | "Difficulty" |
| Labels | `platformLabels.ios` | "iOS" |
| | `platformLabels.android` | "Android" |
| | `platformLabels.web` | "Web" |
| | `platformLabels.desktop` | "Desktop" |
| | `difficultyLabels.beginner` | "Beginner" |
| | `difficultyLabels.intermediate` | "Intermediate" |
| | `difficultyLabels.advanced` | "Advanced" |
| | `featureLabels.wallet` | "Wallet" |
| | `featureLabels.media` | "Media" |
| | `featureLabels.longform` | "Long-form" |
| | `featureLabels.privacy` | "Privacy" |
| No Results | `noResults.title` | "No clients found" |
| | `noResults.description` | "Try adjusting your filters..." |
| Card | `card.users` | "users" |
| | `card.rating` | "rating" |
| | `card.pros` | "Pros" |
| | `card.cons` | "Cons" |
| | `card.links.web` | "Web" |
| | `card.links.ios` | "iOS" |
| | `card.links.android` | "Android" |
| | `card.links.desktop` | "Desktop" |
| Clients | `clients.damus.{name,description,pros[],cons[]}` |
| | `clients.amethyst.{name,description,pros[],cons[]}` |
| | `clients.primal.{name,description,pros[],cons[]}` |
| | `clients.iris.{name,description,pros[],cons[]}` |
| | `clients.snort.{name,description,pros[],cons[]}` |
| | `clients.coracle.{name,description,pros[],cons[]}` |
| | `clients.current.{name,description,pros[],cons[]}` |
| | `clients.habla.{name,description,pros[],cons[]}` |
| | `clients.nostur.{name,description,pros[],cons[]}` |
| | `clients.plebstr.{name,description,pros[],cons[]}` |
| Tags | `tags.beginnerFriendly` | "Beginner Friendly" |
| | `tags.popular` | "Popular" |
| | `tags.powerUser` | "Power User" |
| | `tags.featureRich` | "Feature Rich" |
| | `tags.crossPlatform` | "Cross-Platform" |
| | `tags.webOnly` | "Web Only" |
| | `tags.minimal` | "Minimal" |
| | `tags.privacy` | "Privacy" |
| | `tags.walletFocused` | "Wallet Focused" |
| | `tags.longForm` | "Long-form" |
| | `tags.writers` | "Writers" |
| | `tags.ios` | "iOS" |
| | `tags.android` | "Android" |
| | `tags.desktop` | "Desktop" |

#### 2.7 Client Recommender (`clientRecommender.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Find Your Perfect Client" |
| | `description` | "Answer a few questions..." |
| | `retakeQuiz` | "Retake Quiz" |
| Steps | `steps.device.title` | "What device are you using?" |
| | `steps.device.description` | "Choose your primary device..." |
| | `steps.priority.title` | "What's most important to you?" |
| | `steps.priority.description` | "Select your top priority..." |
| | `steps.features.title` | "Any must-have features?" |
| | `steps.features.description` | "Select all that apply..." |
| | `steps.features.seeRecommendations` | "See Recommendations" |
| Device Options | `deviceOptions.ios.label` | "iPhone/iPad" |
| | `deviceOptions.android.label` | "Android Phone/Tablet" |
| | `deviceOptions.desktop.label` | "Desktop (Mac/Windows/Linux)" |
| | `deviceOptions.web.label` | "Web Browser" |
| Priority Options | `priorityOptions.easy.label` | "Easy to Use" |
| | `priorityOptions.easy.description` | "Simple interface, great for beginners" |
| | `priorityOptions.power.label` | "Power User Features" |
| | `priorityOptions.power.description` | "Advanced features and customization" |
| | `priorityOptions.privacy.label` | "Privacy Focused" |
| | `priorityOptions.privacy.description` | "Enhanced privacy and security features" |
| | `priorityOptions.webOnly.label` | "Web Only" |
| | `priorityOptions.webOnly.description` | "No app installation needed" |
| Feature Options | `featureOptions.wallet.label` | "Built-in Wallet" |
| | `featureOptions.images.label` | "Image Support" |
| | `featureOptions.longform.label` | "Long-form Posts" |
| Results | `results.topRecommendation` | "Your Top Recommendation" |
| | `results.beginnerFriendly` | "Beginner Friendly" |
| | `results.rating` | "Rating" |
| | `results.users` | "Users" |
| | `results.pros` | "Pros" |
| | `results.cons` | "Cons" |
| | `results.getApp` | "Get App" |
| | `results.tryWeb` | "Try Web Version" |
| | `results.alternatives` | "Alternatives" |

---

### 3. SIMULATORS

#### 3.1 Nostr Simulator (`nostrSimulator.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Nostr Simulator" |
| | `description` | "See how Nostr works..." |
| Controls | `controls.play` | "Play" |
| | `controls.pause` | "Pause" |
| | `controls.reset` | "Reset" |
| | `controls.step` | "Step" |
| | `controls.speed` | "Speed" |
| Nodes | `nodes.user` | "User" |
| | `nodes.relay` | "Relay" |
| | `nodes.client` | "Client" |
| Messages | `messages.sending` | "Sending..." |
| | `messages.received` | "Received" |
| | `messages.broadcasting` | "Broadcasting..." |
| | `messages.syncing` | "Syncing..." |

#### 3.2 Quickstart Simulator (`quickstartSimulator.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Quickstart Simulator" |
| | `description` | "Simulate the Nostr setup process..." |
| Steps | `steps.createKeys` | "Create Your Keys" |
| | `steps.chooseClient` | "Choose a Client" |
| | `steps.connectRelay` | "Connect to Relays" |
| | `steps.makePost` | "Make Your First Post" |
| | `steps.followPeople` | "Follow People" |
| Buttons | `buttons.next` | "Next" |
| | `buttons.previous` | "Previous" |
| | `buttons.restart` | "Start Over" |
| | `buttons.tryIt` | "Try It Yourself" |

#### 3.3 Protocol Comparison UI (`protocolComparisonUI.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Protocol Comparison" |
| | `description` | "See how Nostr compares..." |
| | `centralizedLabel` | "Centralized" |
| | `nostrLabel` | "Nostr" |
| Items | `items.identity.title` | "Identity" |
| | `items.identity.centralized` | "Email/phone required" |
| | `items.identity.nostr` | "Cryptographic keys" |
| | `items.data.title` | "Data" |
| | `items.data.centralized` | "Owned by platform" |
| | `items.data.nostr` | "Owned by you" |
| | `items.clients.title` | "Clients" |
| | `items.clients.centralized` | "One official app" |
| | `items.clients.nostr` | "Many compatible apps" |
| | `items.censorship.title` | "Censorship" |
| | `items.censorship.centralized` | "Platform decides" |
| | `items.censorship.nostr` | "Resistant by design" |
| Protocols | `protocols.nostr` | "Nostr" |
| | `protocols.activitypub` | "ActivityPub (Mastodon)" |
| | `protocols.atProtocol` | "AT Protocol (Bluesky)" |
| Features | `features.decentralization` | "Decentralization" |
| | `features.censorshipResistance` | "Censorship Resistance" |
| | `features.accountPortability` | "Account Portability" |
| | `features.easeOfUse` | "Ease of Use" |
| | `features.scalability` | "Scalability" |
| Details | `details.learnMore` | "Learn more about Nostr" |

#### 3.4 Post Flow Simulator (`postFlowSimulator.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Post Flow Simulator" |
| | `description` | "See how your posts flow..." |
| | `currentStepLabel` | "Current Step" |
| Stages | `stages.create` | "Create" |
| | `stages.sign` | "Sign" |
| | `stages.send` | "Send" |
| | `stages.broadcast` | "Broadcast" |
| | `stages.receive` | "Receive" |
| Labels | `labels.yourDevice` | "Your Device" |
| | `labels.relay` | "Relay" |
| | `labels.followers` | "Followers" |
| Buttons | `buttons.play` | "Play" |
| | `buttons.pause` | "Pause" |
| | `buttons.reset` | "Reset" |
| Step Descriptions | `stepDescriptions.0` | "You create a post..." |
| | `stepDescriptions.1` | "Your post is published..." |
| | `stepDescriptions.2` | "Your post is also published..." |
| | `stepDescriptions.3` | "Your followers receive..." |

#### 3.5 Zap Simulator (`zapSimulator.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Zap Simulator" |
| | `description` | "Simulate sending and receiving..." |
| Steps | `steps.createInvoice` | "Create Invoice" |
| | `steps.scan` | "Scan QR Code" |
| | `steps.pay` | "Pay with Wallet" |
| | `steps.confirm` | "Confirm Receipt" |
| Labels | `labels.amount` | "Amount (sats)" |
| | `labels.memo` | "Memo" |
| | `labels.sender` | "Sender" |
| | `labels.receiver` | "Receiver" |
| | `labels.invoice` | "Lightning Invoice" |
| Buttons | `buttons.create` | "Create Invoice" |
| | `buttons.pay` | "Pay Zap" |
| | `buttons.simulate` | "Simulate Zap" |

#### 3.6 Relay Visualizer (`relayVisualizer.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Relay Visualizer" |
| | `description` | "Visualize how relays connect..." |
| Controls | `controls.addRelay` | "Add Relay" |
| | `controls.removeRelay` | "Remove Relay" |
| | `controls.connect` | "Connect" |
| | `controls.disconnect` | "Disconnect" |
| Labels | `labels.connections` | "Connections" |
| | `labels.networkSize` | "Network Size" |
| | `labels.relayCount` | "{{count}} relays" |

#### 3.7 Relay World Map (`relayWorldMap.*`)

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Relay World Map" |
| | `description` | "See where Nostr relays are located..." |
| Regions | `regions.northAmerica` | "North America" |
| | `regions.southAmerica` | "South America" |
| | `regions.europe` | "Europe" |
| | `regions.asia` | "Asia" |
| | `regions.africa` | "Africa" |
| | `regions.oceania` | "Oceania" |
| Stats | `stats.totalRelays` | "Total Relays" |
| | `stats.topRegion` | "Top Region" |
| | `stats.avgLatency` | "Avg Latency" |

---

### 4. RELAY EXPLORER

**Base Key:** `relayExplorer`

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Relay Explorer" |
| | `description` | "Discover and test Nostr relays..." |
| Starter Pack | `starterPack.title` | "Quick Start Pack" |
| | `starterPack.description` | "Add recommended relays..." |
| | `starterPack.button` | "Add Starter Pack" |
| Actions | `testAll` | "Test All" |
| | `checking` | "Checking..." |
| Search | `search.placeholder` | "Search relays..." |
| Filters | `filters.topic.label` | "Topic" |
| | `filters.topic.bitcoin` | "Bitcoin" |
| | `filters.topic.technology` | "Technology" |
| | `filters.topic.general` | "General" |
| | `filters.topic.art` | "Art" |
| | `filters.type.label` | "Type" |
| | `filters.type.free` | "Free" |
| | `filters.type.paid` | "Paid" |
| Selected | `selected.title` | "Selected Relays" |
| | `selected.count` | "{count} selected" |
| | `selected.copy` | "Copy List" |
| | `selected.download` | "Download" |
| Custom Relay | `customRelay.placeholder` | "wss://..." |
| | `customRelay.add` | "Add" |
| | `customRelay.remove` | "Remove" |
| Toast | `toast.starterPackAdded` | "Starter pack added!" |
| | `toast.alreadyExists` | "Relay already exists" |
| | `toast.added` | "Relay added" |
| | `toast.removed` | "Relay removed" |
| | `toast.copied` | "Copied to clipboard" |
| | `toast.copyFailed` | "Failed to copy" |
| | `toast.downloaded` | "Downloaded" |
| | `toast.checkComplete` | "Check complete" |
| Card | `card.latency` | "{ms}ms" |
| | `card.latencyUnknown` | "Unknown" |
| | `card.users` | "{count} users" |
| | `card.location` | "Location" |
| | `card.features` | "Features" |
| | `card.select` | "Select" |
| | `card.deselect` | "Deselect" |
| Card Status | `card.status.online` | "Online" |
| | `card.status.offline` | "Offline" |
| | `card.status.checking` | "Checking..." |
| Region Labels | `regionLabels.na` | "North America" |
| | `regionLabels.eu` | "Europe" |
| | `regionLabels.asia` | "Asia" |
| | `regionLabels.other` | "Other" |
| Stats | `stats.popularRelays` | "Popular Relays" |
| | `stats.onlineNow` | "Online Now" |
| | `stats.freeRelays` | "Free Relays" |
| | `stats.selected` | "Selected" |

---

### 5. RELAY PLAYGROUND

**Base Key:** `relayPlayground`

| Section | Key | English |
|---------|-----|---------|
| Main | `title` | "Relay Playground" |
| | `description` | "Test and explore Nostr relays..." |
| Tabs | `tabs.connection` | "Connection" |
| | `tabs.health` | "Health" |
| | `tabs.nips` | "NIPs" |
| | `tabs.events` | "Events" |
| | `tabs.query` | "Query" |
| Search | `search.placeholder` | "Search relays..." |
| Buttons | `buttons.checkAll` | "Check All" |
| | `buttons.checking` | "Checking..." |
| | `buttons.connect` | "Connect" |
| | `buttons.disconnect` | "Disconnect" |
| | `buttons.inspect` | "Inspect" |
| | `buttons.clear` | "Clear" |
| | `buttons.copy` | "Copy" |
| | `buttons.export` | "Export" |
| Status | `status.online` | "Online" |
| | `status.offline` | "Offline" |
| | `status.checking` | "Checking..." |
| | `status.connected` | "Connected" |
| | `status.disconnected` | "Disconnected" |
| | `status.error` | "Error" |
| Connection Tab | `connectionTab.selectRelay` | "Select a relay" |
| | `connectionTab.connectionState` | "Connection State" |
| | `connectionTab.latency` | "Latency" |
| | `connectionTab.latencyMs` | "{ms}ms" |
| | `connectionTab.unknown` | "Unknown" |
| | `connectionTab.connected` | "Connected" |
| | `connectionTab.disconnected` | "Disconnected" |
| | `connectionTab.error` | "Error" |
| Health Tab | `healthTab.title` | "Health Check" |
| | `healthTab.uptime` | "Uptime" |
| | `healthTab.responseTime` | "Response Time" |
| | `healthTab.reliability` | "Reliability" |
| | `healthTab.lastChecked` | "Last Checked" |
| | `healthTab.history` | "History" |
| | `healthTab.noData` | "No data available" |
| NIPs Tab | `nipsTab.title` | "NIP Support" |
| | `nipsTab.description` | "NIPs are Nostr Implementation Possibilities..." |
| | `nipsTab.nip` | "NIP" |
| | `nipsTab.supported` | "Supported" |
| | `nipsTab.software` | "Software" |
| | `nipsTab.version` | "Version" |
| | `nipsTab.contact` | "Contact" |
| Events Tab | `eventsTab.title` | "Events" |
| | `eventsTab.description` | "View recent events from this relay..." |
| | `eventsTab.noEvents` | "No events found" |
| | `eventsTab.eventId` | "Event ID" |
| | `eventsTab.kind` | "Kind" |
| | `eventsTab.author` | "Author" |
| | `eventsTab.timestamp` | "Timestamp" |
| | `eventsTab.content` | "Content" |
| | `eventsTab.signature` | "Signature" |
| Query Tab | `queryTab.title` | "Query" |
| | `queryTab.description` | "Query events from this relay..." |
| | `queryTab.filters` | "Filters" |
| | `queryTab.authors` | "Authors" |
| | `queryTab.kinds` | "Kinds" |
| | `queryTab.since` | "Since" |
| | `queryTab.until` | "Until" |
| | `queryTab.limit` | "Limit" |
| | `queryTab.execute` | "Execute Query" |
| | `queryTab.results` | "Results" |
| | `queryTab.noResults` | "No results found" |
| Relay Card | `relayCard.location` | "Location" |
| | `relayCard.software` | "Software" |
| | `relayCard.version` | "Version" |
| Toast | `toast.copied` | "Copied to clipboard" |
| | `toast.copyFailed` | "Failed to copy" |
| | `toast.exported` | "Exported successfully" |

---

### 6. Navigation Components

#### 6.1 Guide Navigation (`guideNavigation.*`)

| Key | English | Placeholders |
|-----|---------|--------------|
| `previous` | "Previous" | - |
| `next` | "Next" | - |
| `backToAllGuides` | "Back to All Guides" | - |
| `exploreAllGuides` | "Explore All Guides" | - |
| `startOfLevel` | "Start of {level} Level" | `{level}` |
| `levelComplete` | "{level} Complete!" | `{level}` |
| `levelCompleteDescription` | "You've completed all {level} guides" | `{level}` |
| `continueToLevel` | "Continue to {level}" | `{level}` |
| `unlockRequirements` | "Complete more {currentLevel} guides to unlock {nextLevel}" | `{currentLevel}`, `{nextLevel}` |
| `offLevelMessage` | "This guide isn't part of your current {level} level" | `{level}` |

#### 6.2 Continue Learning (`continueLearning.*`)

| Key | English | Placeholders |
|-----|---------|--------------|
| `allLevelsComplete` | "All Levels Complete!" | - |
| `allLevelsCompleteDescription` | "Congratulations! You've completed all {level} guides and mastered Nostr!" | `{level}` |
| `levelComplete` | "Level Complete!" | - |
| `levelCompleteDescription` | "You've completed all {level} guides!" | `{level}` |
| `continueToLevel` | "Continue to {level}" | `{level}` |
| `locked` | "{level} is Locked" | `{level}` |
| `unlockRequirements` | "Complete {count} more {currentLevel} guide{plural} to unlock {nextLevel}" | `{count}`, `{currentLevel}`, `{nextLevel}`, `{plural}` |
| `browseAllGuides` | "Browse All Guides" | - |
| `guideComplete` | "Guide Complete!" | - |
| `testKnowledge` | "Test your knowledge?" | - |
| `nextGuide` | "Ready for the next guide?" | - |
| `quizDescription` | "Take the quiz to reinforce what you've learned." | - |
| `continueDescription` | "Continue your Nostr journey with {title}" | `{title}` |
| `takeQuiz` | "Take the Quiz" | - |
| `continueLearning` | "Continue Learning" | - |

---

### 7. Guides Page (`guidesPage.*`)

| Section | Key | English |
|---------|-----|---------|
| Hero | `hero.title` | "Learn Nostr Step by Step" |
| | `hero.description` | "Progressive skill levels from beginner to advanced..." |
| | `hero.yourProgress` | "Your Progress" |
| | `hero.startFirstGuide` | "Start your first guide to see progress" |
| CTA | `cta.notSure` | "Not sure where to start?" |
| | `cta.beginnerDescription` | "Begin with our beginner guides..." |
| | `cta.startLearning` | "Start Learning" |
| Filter | `filter.filterByInterest` | "Filter by interest" |

---

### 8. Skill Levels (`skillLevels.*`)

| Level | Key | English |
|-------|-----|---------|
| Beginner | `beginner.label` | "Beginner" |
| | `beginner.title` | "Getting Started" |
| | `beginner.subtitle` | "Start your Nostr journey here" |
| | `beginner.description` | "Start your Nostr journey with the fundamentals..." |
| Intermediate | `intermediate.label` | "Intermediate" |
| | `intermediate.title` | "Intermediate" |
| | `intermediate.subtitle` | "Level up your Nostr skills" |
| | `intermediate.description` | "Level up with deeper topics like NIP-05..." |
| Advanced | `advanced.label` | "Advanced" |
| | `advanced.title` | "Advanced" |
| | `advanced.subtitle` | "Master the protocol" |
| | `advanced.description` | "Master the protocol with privacy, security..." |

---

### 9. Interest Filter (`interestFilter.*`)

| Key | English |
|-----|---------|
| `allGuides` | "All Guides" |
| `bitcoin` | "Bitcoin" |
| `privacy` | "Privacy" |
| `security` | "Security" |
| `relays` | "Relays" |
| `tools` | "Tools" |
| `community` | "Community" |

---

### 10. Guide Card & Section (`guideCard.*`, `guideSection.*`)

| Component | Key | English |
|-----------|-----|---------|
| GuideCard Difficulty | `guideCard.difficulty.beginner` | "Beginner" |
| | `guideCard.difficulty.intermediate` | "Intermediate" |
| | `guideCard.difficulty.advanced` | "Advanced" |
| GuideCard Status | `guideCard.status.locked` | "Locked" |
| | `guideCard.status.completed` | "Completed" |
| | `guideCard.status.continueReading` | "Continue Reading" |
| | `guideCard.status.startLearning` | "Start Learning" |
| GuideCard More | `guideCard.moreLocked` | "+{count} more locked" |
| GuideSection | `guideSection.startHere` | "Start Here" |
| | `guideSection.complete` | "Complete" |
| | `guideSection.locked` | "Locked" |
| | `guideSection.unlockRequirement` | "Complete {count} more {level} guides to unlock" |

---

## Placeholder Patterns

Translations use several placeholder patterns for dynamic values:

### Single Braces (Simple Replacement)
```javascript
t('guideCard.moreLocked').replace('{count}', '5')
// Result: "+5 more locked"
```

### Double Braces (Template Variables)
```javascript
t('ui.quiz.gradeTitle') // "{{title}}: {{rate}}%"
// Used with: gradeTitle.replace('{{title}}', quizTitle).replace('{{rate}}', score)
```

### Multiple Placeholders
```javascript
t('continueLearning.unlockRequirements')
  .replace('{count}', '2')
  .replace('{currentLevel}', 'beginner')
  .replace('{nextLevel}', 'intermediate')
// Result: "Complete 2 more beginner guides to unlock intermediate"
```

---

## Translation System Architecture

### File Structure
```
src/
├── i18n/
│   ├── locales/
│   │   ├── en.json          # English (source of truth)
│   │   ├── pl.json          # Polish
│   │   ├── es.json          # Spanish
│   │   └── [new].json       # Your new language
│   ├── index.ts             # Translation functions
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
├── hooks/
│   └── useTranslation.ts     # React hook
└── components/
    └── [all components using translations]
```

### Usage in Components

```typescript
import { useTranslation } from '../../hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <h1>{t('keyGenerator.title')}</h1>
    <p>{t('keyGenerator.description')}</p>
  );
}
```

### With Placeholders

```typescript
const message = t('guideCard.moreLocked').replace('{count}', String(totalCount - 3));
```

---

## Complete Translation Checklist

When adding a new language, ensure you translate:

### ✅ Core UI (ui.*)
- [ ] All buttons (submit, next, previous, etc.)
- [ ] Search placeholders and messages
- [ ] Common messages (loading, error, success)
- [ ] Navigation labels
- [ ] Badge labels
- [ ] Progress indicators
- [ ] Quiz UI elements

### ✅ Guide Content (guides.*)
- [ ] All 15 guide titles and descriptions
- [ ] All quiz titles
- [ ] All quiz questions (prompts, options, explanations)
- [ ] Quiz severity labels

### ✅ Interactive Components
- [ ] Key Generator (all 50+ keys)
- [ ] Troubleshooting Wizard (all questions and solutions)
- [ ] NIP-05 Checker (all error messages)
- [ ] Empty Feed Fixer (all steps and starter packs)
- [ ] Backup Checklist (all checklist items)
- [ ] Client Comparison Table (all client descriptions)
- [ ] Client Recommender (all questions and options)

### ✅ Simulators
- [ ] Nostr Simulator
- [ ] Quickstart Simulator
- [ ] Protocol Comparison
- [ ] Post Flow Simulator
- [ ] Zap Simulator
- [ ] Relay Visualizer
- [ ] Relay World Map

### ✅ Relay Tools
- [ ] Relay Explorer (all filters, cards, toasts)
- [ ] Relay Playground (all tabs, buttons, status)

### ✅ Navigation
- [ ] Guide Navigation (all labels with placeholders)
- [ ] Continue Learning (all messages with placeholders)
- [ ] Guides Page (hero, CTA, filter)
- [ ] Skill Levels (all 3 levels)
- [ ] Interest Filter (all 7 options)
- [ ] Guide Card (difficulty, status)
- [ ] Guide Section (badges, unlock requirements)

---

## Translation Tips

### 1. Keep Technical Terms in English
Some terms should remain in English across all languages:
- `npub` (public key)
- `nsec` (private key)
- `NIP-05` (protocol identifier)
- `Zap` (Lightning payment)
- `Relay` (server)
- `Client` (application)
- `Nostr` (protocol name)

### 2. Use Informal "You"
- English: "You" (not "Thou")
- Polish: "ty" (not "Pan/Pani")
- Spanish: "tú" (not "usted")

### 3. Handle Placeholders Carefully
Always preserve placeholder syntax:
- ✅ Good: `"+{count} więcej zablokowanych"` (Polish)
- ❌ Bad: `"+{liczba} więcej zablokowanych"` (changed placeholder)

### 4. Test Dynamic Content
Some strings have multiple placeholders:
```javascript
// English
"Complete {count} more {currentLevel} guides to unlock {nextLevel}"

// Polish
"Ukończ {count} więcej przewodników na poziomie {currentLevel}, aby odblokować {nextLevel}"
```

### 5. Maintain Consistency
Use consistent terminology throughout:
- Choose one translation for "guide" and stick with it
- Use the same word for "relay" everywhere
- Keep "Zap" as "Zap" (don't translate)

---

## Common Translation Patterns

### Pattern 1: Simple String
```json
{
  "keyGenerator": {
    "title": "Key Generator"
  }
}
```

### Pattern 2: String with Placeholder
```json
{
  "guideCard": {
    "moreLocked": "+{count} more locked"
  }
}
```

### Pattern 3: Nested Categories
```json
{
  "keyGenerator": {
    "keys": {
      "public": {
        "title": "Public Key",
        "copy": "Copy"
      },
      "private": {
        "title": "Private Key",
        "copy": "Copy"
      }
    }
  }
}
```

### Pattern 4: Arrays
```json
{
  "backupChecklist": {
    "securityTips": {
      "items": [
        "Store backups in different physical locations",
        "Use a password manager for digital copies",
        "Never store nsec in plain text on cloud services",
        "Consider a hardware wallet for large amounts"
      ]
    }
  }
}
```

---

## Files That Need Updates for New Languages

When adding a new language, you must update:

1. **`/src/i18n/locales/{locale}.json`** - Create translation file
2. **`/src/i18n/types.ts`** - Add locale to `Locale` type
3. **`/src/i18n/index.ts`** - Import and register translations
4. **`/src/components/layout/LanguageSwitcher.tsx`** - Add language option (if exists)

---

## Testing Translations

After adding translations, test:

1. **Switch to the new language** - Verify UI updates
2. **Check all interactive components** - KeyGenerator, Troubleshooting, etc.
3. **Verify placeholders work** - Dynamic content displays correctly
4. **Test edge cases** - Long text, special characters
5. **Check RTL support** (if applicable) - Right-to-left languages

---

## Maintenance

### Adding New Translation Keys

When adding new features:

1. Add keys to **all** language files (EN first)
2. Use English as fallback in code: `t('newKey') || 'Default'`
3. Document new keys in this reference
4. Notify translators of new keys needed

### Updating Existing Translations

When modifying text:

1. Update in **all** language files
2. Keep placeholder names consistent
3. Test that placeholders still work
4. Update this reference document

---

## Questions?

If you have questions about translations:

1. Check this reference document first
2. For guide content: See [GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)
3. Look at existing translations (en.json, pl.json, es.json)
4. Check component code for usage patterns
5. Ask in the project discussions

---

## Related Documentation

- **[GUIDE_TRANSLATION_PROCESS.md](./GUIDE_TRANSLATION_PROCESS.md)** - Complete workflow for translating guide MDX files (16 guides per language)
- **[TRANSLATION_MAINTENANCE.md](./TRANSLATION_MAINTENANCE.md)** - Known issues and troubleshooting

---

## License

This translation reference is part of the Nostr Beginner Guide project and follows the same license terms.

---

**Last Updated:** 2025-02-23  
**Version:** 1.1  
**Maintainers:** Project maintainers
