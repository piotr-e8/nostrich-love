# Curated Accounts Database

This directory contains the curated Nostr accounts database for the Follow Pack Finder tool.

## Structure

```
/data/follow-pack/
├── index.ts           # Main exports
├── categories.ts      # Category definitions
├── accounts.ts        # Curated account data
├── validation.ts      # Data validation utilities
└── README.md          # This file
```

## Account Categories

We organize accounts into the following categories:

1. **Influencers** - High-profile accounts with significant followings
2. **Developers** - Protocol developers, client creators, tool builders
3. **Bitcoiners** - Bitcoin maximalists, Lightning enthusiasts
4. **Creators** - Artists, musicians, writers, photographers
5. **Education** - Teachers, tutorial creators, explainers
6. **News & Media** - Journalists, news aggregators, commentators
7. **Privacy & Security** - Privacy advocates, security researchers
8. **Plebs** - Regular community members, everyday users
9. **Humor & Memes** - Comedy accounts, meme creators
10. **Regional** - Language-specific and region-focused communities

## Adding New Accounts

To add a new account to the database:

1. **Edit `accounts.ts`**
2. **Add account object** following this template:

```typescript
{
  npub: "npub1...",              // Required: Valid npub
  name: "Display Name",          // Required: Display name
  username: "handle",            // Optional: Handle/username
  bio: "Short description",      // Required: Max 160 chars
  categories: ["developers"],    // Required: Array of category IDs
  tags: ["nostr", "bitcoin"],    // Required: Array of tags
  followers: 10000,              // Optional: Approximate followers
  following: 500,                // Optional: Approximate following
  verified: true,                // Optional: Has NIP-05 or similar
  nip05: "user@domain.com",      // Optional: NIP-05 identifier
  website: "https://example.com", // Optional: Website URL
  lud16: "user@wallet.com",      // Optional: Lightning address
  activity: "high",              // Required: "high" | "medium" | "low"
  contentTypes: ["text"],        // Required: Content types
  languages: ["en"],             // Optional: ISO language codes
  region: "Americas",            // Optional: Region
  addedAt: "2026-02-12",         // Required: ISO date
  updatedAt: "2026-02-12",       // Required: ISO date
  notes: "Internal notes"        // Optional: For curators
}
```

3. **Validate your changes:**
```bash
npx ts-node scripts/validate-accounts.ts
```

4. **Submit a PR** with:
   - Clear description of the account(s) being added
   - Why they should be included
   - Verification of npub accuracy

## Data Quality Guidelines

### Required Fields
- **npub** - Must be valid npub1 format
- **name** - Display name
- **bio** - Short description (max 160 chars)
- **categories** - At least one valid category
- **tags** - Relevant hashtags/keywords
- **activity** - Activity level estimation
- **contentTypes** - Types of content posted
- **addedAt/updatedAt** - ISO 8601 dates

### Verification
- Prefer accounts with NIP-05 verification
- Double-check npubs (typos are common!)
- Verify account is active (posts within last 30 days)
- Ensure content is appropriate and valuable

### Diversity Goals
We aim for a diverse, representative list:
- Geographic diversity (all regions)
- Gender diversity
- Content type diversity (not just text)
- Experience levels (not just influencers)
- Language diversity

## Validation

Run validation at any time:

```bash
# Validate all accounts
npx ts-node scripts/validate-accounts.ts

# Or use npm script (when added to package.json)
npm run validate-accounts
```

Validation checks:
- ✅ Valid npub format
- ✅ Required fields present
- ✅ Category IDs valid
- ✅ No duplicate npubs
- ⚠️ Warnings for optional field issues

## Target Numbers

**Phase 1** (Current): 100 accounts ✓
**Phase 2**: 300 accounts
**Phase 3**: 500+ accounts

## Maintenance

- Review inactive accounts quarterly
- Update follower counts monthly
- Add rising stars as discovered
- Remove accounts that become inactive or problematic

## Contributing

We welcome contributions! Please:
1. Focus on quality over quantity
2. Verify all data carefully
3. Follow the existing format
4. Run validation before submitting
5. Include context in PR descriptions

## License

This data is part of Nostrich.love and follows the same license (MIT).
