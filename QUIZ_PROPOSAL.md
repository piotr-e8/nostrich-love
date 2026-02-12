# Nostr Guide Quizzes - Proposal Document

## Overview
Based on analysis of all 16 guides, here are quiz proposals for each guide that would benefit from knowledge verification.

**Already has quizzes:**
- `keys-and-security` - Has SecurityQuiz.tsx
- `privacy-security` - Has SecurityQuiz.tsx

**Recommended for quizzes (12 guides):**

### Getting Started (Beginner)
1. ✅ **what-is-nostr** - Core concepts every user must understand
2. ⏸️ **quickstart** - Optional (hands-on guide, per user request)
3. ✅ **protocol-comparison** - Helps users choose the right protocol

### Intermediate
4. ✅ **relays-demystified** - Critical for understanding Nostr
5. ✅ **nip05-identity** - Technical setup knowledge
6. ✅ **zaps-and-lightning** - Important for value transfer
7. ✅ **finding-community** - Practical usage skills
8. ⏸️ **nostr-tools** - Optional (directory/reference guide)
9. ✅ **troubleshooting** - Problem-solving skills

### Advanced
10. ✅ **relay-guide** - Deep technical knowledge
11. ✅ **nip17-private-messages** - Security-critical
12. ✅ **multi-client** - Power user workflows

**Skip:**
- ❌ **faq** - Reference material, per user request
- ❌ **index** - Navigation page only

---

## Quiz Proposals

### 1. WhatIsNostr Quiz (6 questions)
**Focus:** Core protocol concepts, key differences from traditional social media

**Questions:**
1. **Protocol vs Platform** (Critical)
   - Q: What's the key difference between Nostr and Twitter?
   - A: Nostr is a protocol (like email), not a platform
   - Why: Understanding this is foundational

2. **Key Types** (Critical)
   - Q: Which key is safe to share publicly?
   - A: npub (public key)
   - Why: Security essential

3. **Censorship Resistance** (Info)
   - Q: Can someone ban you from Nostr entirely?
   - A: No, but they can ignore your posts
   - Why: Core value proposition

4. **Relays** (Warning)
   - Q: What do relays do?
   - A: Store and forward messages
   - Why: Technical foundation

5. **Data Portability** (Info)
   - Q: What happens to your data if you switch clients?
   - A: It comes with you (stored on relays)
   - Why: Key benefit

6. **Responsibility** (Warning)
   - Q: What happens if you lose your private key?
   - A: You lose your account forever
   - Why: Understanding trade-offs

---

### 2. ProtocolComparison Quiz (5 questions)
**Focus:** Nostr vs ActivityPub vs Bluesky differences

**Questions:**
1. **Identity Model** (Info)
   - Q: How is identity handled in Nostr vs Mastodon?
   - A: Nostr: Self-sovereign keys | Mastodon: Server-assigned handles
   - Why: Key architectural difference

2. **Censorship Resistance** (Warning)
   - Q: Which protocol offers the highest censorship resistance?
   - A: Nostr
   - Why: Nostr's main advantage

3. **Data Portability** (Info)
   - Q: Which protocol has native data portability?
   - A: Nostr and Bluesky (ActivityPub is server-dependent)
   - Why: Important for user freedom

4. **Network Type** (Info)
   - Q: What type of network is Nostr?
   - A: Permissionless relay network
   - Why: Technical distinction

5. **Best Use Case** (Info)
   - Q: Who should choose Nostr?
   - A: Those prioritizing censorship resistance and data ownership
   - Why: Helps users decide

---

### 3. RelaysDemystified Quiz (5 questions)
**Focus:** Understanding how relays work and why posts don't always sync

**Questions:**
1. **Relay Function** (Critical)
   - Q: What is the post office analogy for relays?
   - A: Relays are like post offices where messages live and travel
   - Why: Core concept

2. **Why Posts Don't Sync** (Critical)
   - Q: If you post to Relay A and your friend only uses Relay B, what happens?
   - A: They won't see your post unless they also connect to Relay A
   - Why: Most common confusion

3. **Free vs Paid** (Info)
   - Q: What's a benefit of paid relays?
   - A: Better performance, less spam, supports operators
   - Why: Informed choices

4. **Multiple Relays** (Warning)
   - Q: How many relays should you connect to for good coverage?
   - A: 4-8 relays
   - Why: Best practice

5. **NIP-65** (Info - Advanced)
   - Q: What does NIP-65 (outbox model) do?
   - A: Lets you publish your preferred relay list so clients know where to find you
   - Why: Advanced optimization

---

### 4. NIP05Identity Quiz (5 questions)
**Focus:** NIP-05 setup, benefits, and verification

**Questions:**
1. **Purpose** (Info)
   - Q: What does a NIP-05 identifier look like?
   - A: you@domain.com (human-readable format)
   - Why: Basic understanding

2. **Benefits** (Info)
   - Q: What's a major benefit of having a NIP-05?
   - A: Easy to share, professional appearance, verification badge
   - Why: Why bother setting it up

3. **Required?** (Warning)
   - Q: Do you need a NIP-05 to use Nostr?
   - A: No, it's optional but recommended
   - Why: Managing expectations

4. **Setup Location** (Critical)
   - Q: Where must the nostr.json file be hosted?
   - A: At /.well-known/nostr.json on your domain
   - Why: Technical requirement

5. **Centralization Concern** (Warning)
   - Q: Does NIP-05 mean centralized identity?
   - A: No, you can have multiple and change anytime
   - Why: Addressing misconceptions

---

### 5. ZapsAndLightning Quiz (6 questions)
**Focus:** Lightning Network basics, wallet setup, and zap etiquette

**Questions:**
1. **What are Zaps** (Info)
   - Q: What are zaps in Nostr?
   - A: Bitcoin tips sent over Lightning Network
   - Why: Core concept

2. **Wallet Types** (Warning)
   - Q: What's the difference between custodial and non-custodial wallets?
   - A: Custodial: They hold your keys | Non-custodial: You control keys
   - Why: Security understanding

3. **Required?** (Info)
   - Q: Do you need Bitcoin to use Nostr?
   - A: No, zaps are completely optional
   - Why: Lower barriers

4. **Receiving Setup** (Critical)
   - Q: What do you need to receive zaps?
   - A: Lightning wallet with address (e.g., you@walletofsatoshi.com) added to profile
   - Why: Practical setup

5. **Zap Amounts** (Info)
   - Q: What's a standard "thank you" zap amount?
   - A: 100 sats
   - Why: Etiquette

6. **Wallet Security** (Critical)
   - Q: What must you do when setting up Phoenix wallet?
   - A: Write down the recovery seed phrase
   - Why: Security essential

---

### 6. FindingCommunity Quiz (5 questions)
**Focus:** Discovery strategies, hashtags, and engagement

**Questions:**
1. **Hashtag Strategy** (Info)
   - Q: How many relevant hashtags should you use per post?
   - A: 2-5 hashtags
   - Why: Best practice

2. **Finding People** (Info)
   - Q: What's the "follow the followers" method?
   - A: Find one person you like, see who they follow, follow interesting ones
   - Why: Discovery technique

3. **Starting Point** (Warning)
   - Q: How many accounts should you aim to follow initially?
   - A: 50-100 active follows
   - Why: Sweet spot for engagement

4. **Engagement** (Info)
   - Q: What's the 80/20 rule for engagement?
   - A: 80% adding value, 20% self-promotion
   - Why: Community building

5. **DM Safety** (Warning)
   - Q: What should you never share in DMs?
   - A: Your private key (nsec)
   - Why: Security

---

### 7. Troubleshooting Quiz (6 questions)
**Focus:** Common problems and solutions

**Questions:**
1. **Empty Feed** (Critical)
   - Q: Why is your feed empty?
   - A: Not following anyone or not connected to relays
   - Why: #1 beginner issue

2. **Missing Posts** (Warning)
   - Q: Why can't you see your old posts?
   - A: Relay storage limits or different relay configuration
   - Why: Common confusion

3. **Key Loss** (Critical)
   - Q: Can you recover your account if you lose your private key?
   - A: No, there is no recovery
   - Why: Critical understanding

4. **Relay Connection** (Warning)
   - Q: Relay URL must start with what?
   - A: wss:// (secure WebSocket)
   - Why: Technical detail

5. **Impersonation** (Info)
   - Q: How can you protect against impersonation?
   - A: Get NIP-05 verified and share your npub widely
   - Why: Identity protection

6. **Zap Issues** (Warning)
   - Q: Why might zaps not work?
   - A: No wallet connected, insufficient balance, or wallet offline
   - Why: Practical troubleshooting

---

### 8. RelayGuide Quiz (5 questions)
**Focus:** Advanced relay management and optimization

**Questions:**
1. **Relay Types** (Info)
   - Q: What's the difference between free and paid relays?
   - A: Free: open to all, may be slower | Paid: better performance, less spam
   - Why: Informed choices

2. **How Many Relays** (Warning)
   - Q: What's the recommended number of relays for an active user?
   - A: 5-10 relays
   - Why: Optimization

3. **Why Pay** (Info)
   - Q: When should you consider paid relays?
   - A: When you're serious about Nostr or free relays aren't meeting needs
   - Why: Value proposition

4. **Own Relay** (Info - Advanced)
   - Q: What are benefits of running your own relay?
   - A: Complete control, privacy, custom policies
   - Why: Advanced use case

5. **Decentralization** (Warning)
   - Q: Why shouldn't you rely only on popular relays?
   - A: Concentrates power and goes against Nostr's decentralized ethos
   - Why: Philosophical alignment

---

### 9. NIP17PrivateMessages Quiz (5 questions)
**Focus:** NIP-17 vs NIP-04 security differences and migration

**Questions:**
1. **NIP-17 Purpose** (Critical)
   - Q: What is NIP-17?
   - A: Private Direct Messages using seal + gift wrap encryption
   - Why: Core concept

2. **NIP-04 Problem** (Critical)
   - Q: What's the security issue with NIP-04?
   - A: Metadata is visible (who talks to whom), content encrypted but envelope exposes sender/recipient
   - Why: Why upgrade

3. **Seal + Gift Wrap** (Info)
   - Q: What does the "gift wrap" layer hide?
   - A: All metadata - sender and recipient information
   - Why: Privacy improvement

4. **Client Support** (Warning)
   - Q: What happens if you send NIP-17 to someone with NIP-04-only client?
   - A: They see unreadable/gibberish messages
   - Why: Compatibility issue

5. **Migration** (Info)
   - Q: What should you do before sending sensitive info via DM?
   - A: Verify both parties use NIP-17-capable clients
   - Why: Best practice

---

### 10. MultiClient Quiz (5 questions)
**Focus:** Multi-client workflows and syncing

**Questions:**
1. **Why Multiple Clients** (Info)
   - Q: Why use multiple Nostr clients?
   - A: Optimization, flexibility, different features for different tasks
   - Why: Power user benefits

2. **What Syncs** (Critical)
   - Q: What syncs automatically across clients?
   - A: Posts, follows, profile info (client settings don't sync)
   - Why: Understanding limitations

3. **Workflow** (Info)
   - Q: What's a common mobile + desktop workflow?
   - A: Desktop for writing/long-form, mobile for quick checks/notifications
   - Why: Practical usage

4. **Switching** (Warning)
   - Q: What do you need to switch clients?
   - A: Your nsec (private key)
   - Why: Security reminder

5. **Testing** (Info)
   - Q: How can you safely test a new client?
   - A: Create test keys first, try with test account
   - Why: Security best practice

---

## Implementation Options

### Option A: Individual Quiz Components (Recommended)
Create separate quiz components for each guide, similar to SecurityQuiz.tsx:
- `WhatIsNostrQuiz.tsx`
- `RelaysDemystifiedQuiz.tsx`
- etc.

**Pros:**
- Each quiz tailored to specific content
- Can place at end of each guide
- Easy to maintain separately
- Can have guide-specific result actions

**Cons:**
- More files to maintain
- Some code duplication

### Option B: Generic Quiz Component with Props
Create a reusable `GuideQuiz` component that accepts questions as props:

```tsx
<GuideQuiz 
  guideId="what-is-nostr"
  questions={QUESTIONS}
  redirectLinks={[...]}
/>
```

**Pros:**
- Single component to maintain
- Consistent styling
- Easy to add quizzes to new guides

**Cons:**
- Less flexibility for guide-specific features
- Questions defined in MDX files or separate data files

### Option C: Hybrid Approach
- Reusable quiz engine/component
- Question data in separate files per guide
- Guide-specific result screens

**Recommendation:** Start with **Option A** (individual components) for:
- Maximum flexibility
- Clear ownership per guide
- Easy to customize

Can refactor to Option B/C later if code duplication becomes an issue.

---

## Quiz Component Structure

Each quiz should follow SecurityQuiz.tsx pattern:

```tsx
// GuideQuiz.tsx structure
interface Question {
  id: string;
  title: string;
  prompt: string;
  options: Option[];
  correctId: string;
  explanation: string;
  severity: 'critical' | 'warning' | 'info';
}

// Features:
- Progress bar showing answered/total
- Multiple choice with single correct answer
- Immediate feedback (explanation after selecting)
- Severity indicators (Critical/Warning/Info)
- Results screen with:
  - Score percentage
  - Correct/incorrect breakdown
  - Links to review guide sections
  - Retake option
```

---

## Placement Strategy

### Option 1: End of Guide (Recommended)
Place quiz at the bottom of each guide, before the "Next Steps" section.

**Pros:**
- User has consumed all content
- Natural conclusion to learning
- Doesn't interrupt reading flow

### Option 2: Mid-Guide Checkpoints
Break guide into sections with mini-quizzes.

**Pros:**
- Reinforces learning as you go
- Keeps users engaged

**Cons:**
- Interrupts reading flow
- More complex to implement

### Option 3: Optional Pop-up
Quiz appears as optional "Test Your Knowledge" CTA.

**Pros:**
- Non-intrusive
- User-initiated

**Cons:**
- Lower completion rates
- May be missed

**Recommendation:** Option 1 (End of Guide) for consistency with existing SecurityQuiz implementation.

---

## Next Steps

1. **Review this proposal** - Confirm which guides get quizzes
2. **Prioritize implementation order** (suggested: core guides first)
3. **Confirm quiz placement** (end of guide recommended)
4. **Approve component structure** (individual components recommended)

Once approved, I can:
1. Create quiz components for approved guides
2. Add quiz imports to MDX files
3. Test quiz functionality
4. Document quiz creation process for future guides

---

## Priority Tiers

### Tier 1 (Must Have)
- what-is-nostr (core concepts)
- relays-demystified (critical for usage)
- zaps-and-lightning (unique Nostr feature)

### Tier 2 (Should Have)
- protocol-comparison (decision helper)
- nip05-identity (setup knowledge)
- troubleshooting (practical skills)
- nip17-private-messages (security)

### Tier 3 (Nice to Have)
- finding-community (engagement)
- relay-guide (advanced)
- multi-client (power users)
- nostr-tools (reference)

---

## Summary

**Total Quizzes Proposed:** 12
**Already Complete:** 2 (keys-and-security, privacy-security)
**New Quizzes Needed:** 10

**Estimated Implementation Time:**
- Tier 1 (3 quizzes): ~2-3 hours
- Tier 2 (4 quizzes): ~3-4 hours  
- Tier 3 (3 quizzes): ~2-3 hours
- **Total: ~7-10 hours**

**Ready to proceed?** Confirm:
1. Which tier(s) to implement
2. Any guides to exclude
3. Preferred implementation option
4. Quiz placement strategy
