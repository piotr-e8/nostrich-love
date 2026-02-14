# Quick Start Guide - Follow Pack Tools

## 🆕 Starting a New Session

**Important**: In a new session, I need to **read files first** before running commands!

### What I'll Do Automatically:
When you say: "Process naddr..." or "Search follows...", I will:
1. ✅ Read the script files to understand current implementation
2. ✅ Check existing categories in `categories.ts` and `types`
3. ✅ Verify the accounts database structure
4. ✅ Run the command
5. ✅ Add results to the database

### Or You Can Tell Me Explicitly:
```
"Read the scripts and process this naddr: <naddr> for <category>"
```

### Files I'll Read in New Session:
```
/scripts/process-naddr.cjs          - Main processing script
/scripts/process-npub.cjs            - Single npub script  
/scripts/search-follows-v2.cjs       - Search follows script
/src/types/follow-pack/index.ts      - Category types
/src/data/follow-pack/categories.ts  - Category definitions
/src/data/follow-pack/accounts.ts    - Accounts database
```

---

## 📚 Documentation Location
**Main doc**: `/docs/FOLLOW_PACK_INTEGRATION.md`

## 🚀 Available Tools

### 1. Process naddr (kind 39089 follow packs)
**Script**: `scripts/process-naddr.cjs`

**Usage**:
```bash
node scripts/process-naddr.cjs "<naddr>" <category>
```

**Example**:
```bash
node scripts/process-naddr.cjs "naddr1qvzqqqyckypzqxeup6tez2tf4yyp0n6fgzaglh0gw99ewytpccreulnpzsp5z5a3qythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqjxywtrxsunyd3h956nzdp4956rswtp94skgdnx95ursdmzxsex2vfc8pjnxtl48jy" artists
```

**What it does**:
1. Decodes naddr to extract pubkeys
2. Fetches metadata for each pubkey
3. Checks duplicates
4. Saves to `temp-naddr-results.json`
5. Shows summary

**Next step**: Review results and add to accounts.ts

---

### 2. Process npub (single account)
**Script**: `scripts/process-npub.cjs`

**Usage**:
```bash
node scripts/process-npub.cjs <npub> <category>
```

**Example**:
```bash
node scripts/process-npub.cjs npub1abc... parents
```

**What it does**:
1. Fetches metadata for single npub
2. Checks if already in database
3. Shows account details
4. Saves to `temp-npub-result.json`

---

### 3. Search Follows (Multi-Category Support!) ⭐
**Script**: `scripts/search-follows-v2.cjs`

**Usage**:
```bash
node scripts/search-follows-v2.cjs <source_npub> <category>
```

**Example**:
```bash
# Find parents from someone's follows
node scripts/search-follows-v2.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 parents

# Find Christians (will update existing parent accounts with 'christians' category!)
node scripts/search-follows-v2.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 christians

# Find foodies
node scripts/search-follows-v2.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 foodies
```

**What it does**:
1. Fetches all contacts from source npub
2. Scores each for category match
3. **NEW**: If account exists → adds new category to categories array
4. Shows "updated" vs "new" accounts
5. Saves to `temp-search-results.json`

**Categories available**:
- parents, christians, foodies, artists, photography, musicians, permaculture

---

## 📊 Current Categories (15 total)

1. jumpstart
2. artists
3. photography
4. musicians
5. permaculture
6. parents
7. christians
8. foodies ⭐ NEW
9. mystics
10. cool_people
11. sovereign
12. legit
13. niche
14. merchants
15. doomscrolling

---

## 🔄 Workflow Examples

### Example 1: Add naddr for artists
```bash
node scripts/process-naddr.cjs "<naddr>" artists
# Review temp-naddr-results.json
# Add accounts to accounts.ts
```

### Example 2: Search follows for multiple categories
```bash
# First search for parents
node scripts/search-follows-v2.cjs <npub> parents

# Then search same npub for christians (will update existing parents!)
node scripts/search-follows-v2.cjs <npub> christians

# Then search for foodies (will update any existing accounts!)
node scripts/search-follows-v2.cjs <npub> foodies
```

### Example 3: Add single npub
```bash
node scripts/process-npub.cjs <npub> <category>
# Review temp-npub-result.json
# Add to accounts.ts
```

---

## 🆕 Adding New Categories

If you want a category that doesn't exist yet (e.g., "books", "sports", "developers"):

**I'll need to:**
1. Add category to `/src/types/follow-pack/index.ts`
2. Add category to `/src/data/follow-pack/categories.ts`
3. Add keywords to `CATEGORY_KEYWORDS` in `search-follows-v2.cjs`
4. Then run the search

**Just say**: "Create a new category called 'books' and search follows of [npub] for it"

---

## 📝 Notes

- **Multi-category support**: Accounts can belong to multiple categories
- **Duplicate prevention**: Checks npub before adding
- **Auto-update**: Existing accounts get new categories added automatically
- **Pictures**: Fetched automatically when available
- **Documentation**: All runs logged in `/docs/FOLLOW_PACK_INTEGRATION.md`

---

## 🆘 Troubleshooting

**Script not found?**
```bash
cd /Users/piotrczarnoleski/nostr-beginner-guide
node scripts/<script-name>.cjs <args>
```

**Need to add category?**
1. Add to `/src/types/follow-pack/index.ts` (CategoryId type)
2. Add to `/src/data/follow-pack/categories.ts`
3. Add keywords to `CATEGORY_KEYWORDS` in search script

**Want to see all accounts?**
```bash
grep -c "npub1" src/data/follow-pack/accounts.ts
```

---

**Ready to go!** Just say: "Search follows of [npub] for [category]" or "Process naddr [naddr] [category]"
