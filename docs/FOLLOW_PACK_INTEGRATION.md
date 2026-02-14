# HR Agent Documentation - Follow Pack Integration

## Quick Start - Automated Workflow

When you return, just say:
- **"Process naddr"** → I'll ask for the naddr and category
- **"Add npubs"** → I'll ask for npub list and category  
- **"Search follows"** → I'll ask for source npub and target category

The system will automatically: extract → fetch → deduplicate → present → add (after your confirm)

---

## 🚀 Production Commands

### Multi-Category Support (NEW!)
Accounts can now have multiple categories! When searching follows, if an account already exists in the database, the script will:
1. ✅ Add the new category to the existing account's categories array
2. 🔄 Show which accounts were updated vs. which are new
3. ✓ Skip accounts that already have the category

### Process naddr (kind 39089)
```bash
node scripts/process-naddr.cjs "<naddr>" <category>
# Then manually add accounts from temp-naddr-results.json to accounts.ts
```

**Example**:
```bash
node scripts/process-naddr.cjs "naddr1qvzqqqyckypzqxeup6tez2tf4yyp0n6fgzaglh0gw99ewytpccreulnpzsp5z5a3qythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqjxywtrxsunyd3h956nzdp4956rswtp94skgdnx95ursdmzxsex2vfc8pjnxtl48jy" artists
```

**What it does**:
1. ✅ Decodes naddr (NIP-19)
2. ✅ Fetches kind 39089 event from relay
3. ✅ Extracts pubkeys from p-tags
4. ✅ Fetches metadata (kind 0) from multiple relays
5. ✅ Checks duplicates against accounts.ts
6. ✅ Saves results to `scripts/temp-naddr-results.json`
7. ✅ Shows summary with new vs duplicates

**Next step**: Review temp-naddr-results.json and add accounts to accounts.ts

### Search Follows with Multi-Category Support
```bash
node scripts/search-follows-v2.cjs <source_npub> <category>
```

**Example - Find Christians from a parent's follows:**
```bash
node scripts/search-follows-v2.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 christians
```

**What it does:**
1. ✅ Fetches all contacts from source npub
2. ✅ Scores each contact for category match
3. ✅ **NEW**: If account exists with different category → updates categories array
4. ✅ Shows updated accounts vs. new accounts
5. ✅ Saves results to `temp-search-results.json`

**Example output:**
```
🔄 ACCOUNTS UPDATED WITH NEW CATEGORY:
1. Jason Hodlers (Score: 45)
   Previous categories: [parents]
   Updated to: [parents, christians]

2. Luke Dashjr (Score: 40)
   Previous categories: [parents]
   Updated to: [parents, christians]

✨ NEW ACCOUNTS TO ADD:
1. New Christian Account (Score: 35)
   NPUB: npub1...
```

---

## Input Types Supported

### 1. naddr (kind 39089 Follow Packs) - READY ✅
**Input**: naddr string(s)  
**Category**: artists, music, photography, etc.

**Process**:
1. Run: `node scripts/process-naddr.cjs "<naddr>" <category>`
2. Review output and `temp-naddr-results.json`
3. Add new accounts to `/src/data/follow-pack/accounts.ts`
4. Update "Last Updated" date in header comment

**Duplicate Prevention**: Checks both npub and hex pubkey against existing accounts

### 2. npub Only - TODO
**Input**: npub string(s)  
**Script**: `scripts/process-npub.cjs` (needs creation)

**Process**:
1. Convert npub to hex (NIP-19 decode)
2. Fetch metadata (kind 0) from relays
3. Check duplicates
4. Auto-categorize based on profile
5. Present for confirmation
6. Add to accounts.ts

### 3. Search Follows - TODO
**Input**: Source npub + target category  
**Script**: `scripts/search-follows.cjs` (needs creation)

**Process**:
1. Fetch kind 3 (contacts) for source
2. Fetch metadata for each contact
3. Score for category match (see algorithm below)
4. Filter by threshold (default 60)
5. Present candidates for selection
6. Add confirmed to accounts.ts

---

## Duplicate Prevention

Before adding ANY account:
1. Check if npub exists in `/src/data/follow-pack/accounts.ts`
2. Check if hex pubkey exists in `/data/follow-pack/accounts.ts`
3. Check metadata cache for existing entries
4. Skip if already present, show duplicate notification

---

## Current Architecture

### Scripts Available (`/scripts/`)
- `fetch-nostr-accounts.js` - Fetch from starter packs (kind 39089)
- `fetch-metadata-v2.cjs` - Fetch profile metadata
- `fetch-and-apply-fixed.cjs` - Fetch + apply with cache
- `convert-pubkeys.cjs` - Hex ↔ npub conversion
- `generate-final-accounts.cjs` - Generate accounts.ts
- `validate-accounts.ts` - Validate curated data
- `metadata-cache.json` - Cached metadata

### Follow Pack Categories (15 total)
1. `jumpstart` - Essential starter accounts
2. `artists` - Visual artists, digital creators
3. `photography` - Photographers ✨ NEW
4. `musicians` - Musicians, producers, bands 🎵 NEW
5. `permaculture` - Homesteaders, farmers, regenerative agriculture 🌱 NEW
6. `parents` - Parents & Families 👨‍👩‍👧‍👦 NEW
7. `christians` - Christians ⛪ NEW
8. `foodies` - Chefs, Cooks & Foodies 🍳 NEW
9. `mystics` - Spiritual thinkers
10. `cool_people` - Community recommendations
11. `sovereign` - Freedom advocates
12. `legit` - Verified personalities
13. `niche` - Special interests
14. `merchants` - Bitcoin businesses
15. `doomscrolling` - Entertainment

**Multi-category accounts example:**
- Jason Hodlers: `["parents", "christians"]`
- Luke Dashjr: `["parents", "christians"]`
- berean jones: `["parents", "christians"]`
- NEEDcreations: `["parents", "foodies"]`
- daniel: `["jumpstart", "foodies"]`

**Proposed new categories**: books

### Community Landing Pages (6 pages)
All currently use **mocked** data:
- `/nostr-for-artists` → links to `?category=artists`
- `/nostr-for-photographers` → needs real data
- `/nostr-for-musicians` → needs real data
- `/nostr-for-books` → needs real data
- `/nostr-for-parents` → needs real data
- `/nostr-for-foodies` → needs real data

---

## Workflow by Input Type

### Workflow A: naddr Input
```
User provides: naddr1, naddr2, ...
                    ↓
            Decode naddr (NIP-19)
                    ↓
            Extract p-tags (pubkeys)
                    ↓
            Fetch metadata (kind 0)
                    ↓
            Check duplicates
                    ↓
            Categorize accounts
                    ↓
            Present summary:
            ┌─────────────────────────────────────┐
            │ Found 15 accounts from 2 naddr     │
            │ ✓ 12 new accounts                   │
            │ ✗ 3 duplicates (skipped)            │
            │ Categories: artists(8), music(4)    │
            │                                     │
            │ Preview:                            │
            │ - Alice (artists) - Digital painter │
            │ - Bob (artists) - Photographer      │
            │ - ...                               │
            │                                     │
            │ [Confirm Add All] [Review Each]     │
            └─────────────────────────────────────┘
                    ↓
            Add to accounts.ts
                    ↓
            Update community pages (optional)
```

### Workflow B: npub Input
```
User provides: npub1, npub2, ...
                    ↓
            Convert npub → hex (NIP-19)
                    ↓
            Fetch metadata (kind 0)
                    ↓
            Check duplicates
                    ↓
            Categorize based on:
            - Bio keywords
            - Website content
            - Existing tags
                    ↓
            Present summary with confirmation
                    ↓
            Add selected to accounts.ts
```

### Workflow C: Search Follows
```
User request: "Search follows of [npub] for [category]"
                    ↓
            Fetch kind 3 (contacts) for source npub
                    ↓
            For each contact:
              ├─ Fetch metadata
              ├─ Score for category match:
              │   • Bio keywords (0-40 pts)
              │   • Content analysis (0-30 pts)
              │   • NIP-05 domain (0-20 pts)
              │   • Existing labels (0-10 pts)
              └─ Tag with confidence score
                    ↓
            Filter: score > 60
                    ↓
            Present candidates:
            ┌────────────────────────────────────────┐
            │ Found 24 potential [category] accounts │
            │ in [source npub]'s follows            │
            │                                        │
            │ High confidence (80+ score):           │
            │ ☑️ @alice - Digital artist (95)        │
            │ ☑️ @bob - Portrait photographer (92)   │
            │ ☐ @charlie - Mixed content (78)        │
            │                                        │
            │ Medium confidence (60-79):             │
            │ ☐ @david - Occasional art posts (65)   │
            │                                        │
            │ [Add Selected] [Cancel]                │
            └────────────────────────────────────────┘
                    ↓
            YOU select which to add
                    ↓
            Check duplicates
                    ↓
            Add confirmed accounts
```

---

## Data Integrity Checks

Before writing to accounts.ts:
```typescript
// Duplicate checks
1. if (accounts.find(a => a.npub === newNpub)) → skip
2. if (accounts.find(a => hex(a.npub) === hexPubkey)) → skip
3. if (metadataCache[hexPubkey]) → update cache only

// Validation
4. Must have: npub, name, bio, categories
5. Categories must exist in categories.ts
6. Metadata fresh (< 30 days) or refetch
```

---

## Category Scoring Algorithm (for Search Follows)

```typescript
function scoreForCategory(metadata, targetCategory): number {
  let score = 0;
  const bio = (metadata.about || '').toLowerCase();
  
  // Bio keyword matching (40 pts max)
  const keywords = {
    'artists': ['art', 'artist', 'paint', 'draw', 'design', 'creative', 'portfolio'],
    'photography': ['photo', 'photographer', 'camera', 'shooting', 'portrait'],
    'music': ['music', 'musician', 'artist', 'producer', 'composer', 'band'],
    'books': ['book', 'author', 'writer', 'read', 'novel', 'literature'],
    'parenting': ['parent', 'mom', 'dad', 'family', 'kids', 'children'],
    'food': ['food', 'cook', 'chef', 'recipe', 'kitchen', 'restaurant']
  };
  
  const categoryKeywords = keywords[targetCategory] || [];
  categoryKeywords.forEach(kw => {
    if (bio.includes(kw)) score += 10;
  });
  score = Math.min(score, 40);
  
  // NIP-05 domain hints (20 pts)
  if (metadata.nip05?.includes(targetCategory)) score += 20;
  
  // LUD16 hints (10 pts)
  if (metadata.lud16?.includes(targetCategory)) score += 10;
  
  return Math.min(score, 70); // Cap before manual review
}
```

---

## Commands Reference

```bash
# Run account fetcher
npm run fetch-accounts

# Validate accounts
npx ts-node scripts/validate-accounts.ts

# Fetch and apply metadata
node scripts/fetch-and-apply-fixed.cjs

# Generate final accounts file
node scripts/generate-final-accounts.cjs
```

---

## File Locations

**Scripts**: `/scripts/`
**Follow Pack Data**: `/src/data/follow-pack/`
**Follow Pack Components**: `/src/components/follow-pack/`
**Community Components**: `/src/components/community/`
**Community Pages**: `/src/pages/nostr-for-*.astro`
**Types**: `/src/types/follow-pack/index.ts`

---

## Confirmation Screen Format

When presenting accounts for confirmation, I'll show:

```
┌────────────────────────────────────────────────────┐
│ PROPOSED ACCOUNTS TO ADD                           │
├────────────────────────────────────────────────────┤
│ Source: 3 npubs / 2 naddr / search follows         │
│ Total found: 15 accounts                           │
│ Duplicates skipped: 3                              │
│ New to add: 12                                     │
├────────────────────────────────────────────────────┤
│                                                    │
│ 1. Alice Wonderland (@alice)                      │
│    Categories: [artists] [cool_people]            │
│    Bio: Digital artist creating surreal...        │
│    Followers: 1,234 | NIP-05: alice@primal.net    │
│    [☑️ Include] [❌ Skip]                          │
│                                                    │
│ 2. Bob Smith (@bob_photo)                         │
│    Categories: [photography]                      │
│    Bio: Landscape photographer...                 │
│    ⚠️ LOW CONFIDENCE - verify category            │
│    [☑️ Include] [❌ Skip]                          │
│                                                    │
├────────────────────────────────────────────────────┤
│ [✅ Add All Valid] [🔍 Review Each] [❌ Cancel]    │
└────────────────────────────────────────────────────┘
```

---

## Questions for User (Before Starting)

When you provide data, please specify:

1. **Input type**: naddr / npub / search follows
2. **Source**: The actual naddr(s) or npub(s)
3. **Target category**: Which category to assign (or auto-categorize?)
4. **Search follows params** (if applicable):
   - Source npub (whose follows to search)
   - Target category to filter for
   - Minimum confidence threshold (default: 60)
5. **Duplicate handling**: Skip duplicates / Update existing / Ask per duplicate

---

## Next Steps - Ready When You Are

Provide me with:
- **Input type** (naddr / npub / search follows)
- **The data** (naddr(s), npub(s), or source+target)
- **Target category** (or auto-categorize)

I'll execute the workflow and present results for your confirmation.

---

## 📊 Production Run Log

### Run #1 - 2026-02-13
**Input**: naddr (kind 39089)  
**Category**: artists  
**Command**:
```bash
node scripts/process-naddr.cjs "naddr1qvzqqqyckypzqxeup6tez2tf4yyp0n6fgzaglh0gw99ewytpccreulnpzsp5z5a3qythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqjxywtrxsunyd3h956nzdp4956rswtp94skgdnx95ursdmzxsex2vfc8pjnxtl48jy" artists
```

**Results**:
- **Source**: naddr (kind 39089) from pubkey 1b3c0e97...
- **Identifier**: b9c49267-5145-489a-ad6f-887b42e188e3
- **Total p-tags found**: 11 pubkeys
- **Metadata fetched**: 12/11 accounts (one relay returned extra)
- **Existing accounts checked**: 433
- **New accounts**: 3 (after deduplication)
- **Duplicates skipped**: 8

**New Accounts Added**:
1. **grawoig** - artist composer maxi
   - npub: npub1xtga7d2a9nhw5hx3csw4wju3qhrgamha0s9a98jfc9f0uuwycl2ssg89t4
   - Website: grawoig.com
   - Lightning: justelephant4@primal.net

2. **zed-erwan☕️✏️🎨** - Sketch artist
   - npub: npub1r2sah0htqnw7xrs70gq00m48vp25neu8ym2n2ghrny92dqqf7sest8hth0
   - Bio: Daily sketches and travel journal
   - Lightning: zederwan@minibits.cash

3. **BitcoinArtMag** - Bitcoin Art Magazine
   - npub: npub1zrclffvv67nlda0ds8kw755lzm8yy9eavxta54qn4g8wegxzzv3q8amvxc
   - NIP-05: BitcoinArtMag@primal.net
   - Lightning: BitcoinArtMag@primal.net

**Issues Found**:
- zed-erwan appeared twice in source naddr (same npub listed in 2 p-tags)
- All 8 duplicates already existed in accounts.ts

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Added 3 new artist accounts
- `scripts/temp-naddr-results.json` - Saved processing results

**Status**: ✅ COMPLETE

### Run #2 - 2026-02-13
**Input**: naddr (kind 39089)  
**Category**: photography (NEW CATEGORY)  
**Command**:
```bash
node scripts/process-naddr.cjs "naddr1qvzqqqyckypzqxeup6tez2tf4yyp0n6fgzaglh0gw99ewytpccreulnpzsp5z5a3qythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qy88wumn8ghj7mn0wvhxcmmv9uqzgcehxv6xgeryvckkywfnvykngvp3vyknsv3evykkgepev5mrsepnv4jngwqsal2xr" photography
```

**Results**:
- **Source**: naddr (kind 39089) from pubkey 1b3c0e97...
- **Identifier**: c734dddf-b93a-401a-829a-dd9e68d3ee48
- **Total p-tags found**: 10 pubkeys
- **Metadata fetched**: 10/10 accounts
- **Existing accounts checked**: 436
- **New accounts**: 6 (after deduplication)
- **Duplicates skipped**: 4

**New Category Created**: `photography`
- Added to `/src/types/follow-pack/index.ts` (CategoryId type)
- Added to `/src/data/follow-pack/categories.ts` with:
  - Name: Photography
  - Icon: camera
  - Color: #14B8A6 (Teal)
  - Order: 3 (between artists and mystics)
- Updated all subsequent category order numbers

**New Accounts Added**:
1. **Matt** - ₿ 📷 🚵‍♂️ Photographer
   - npub: npub1cllf97qv29kqc493t6xj26kqw2qsxmvnf6sl7w0mpnv2plt8wumqta3zny
   - NIP-05: mattyb@plume.website

2. **tumasphoto** - Photography only account
   - npub: npub1m85lkfcs73qgpdmm5l5zsjr0wd2khccum6vl8u39v7dvt407tcdq6uxjkj
   - Lightning: tuma@minibits.cash

3. **jwilly** - Bitcoin & Surfing Photographer
   - npub: npub1xnad2fz00h5yfswfuqq7yum76glna2tvak3wyrfyr4r0aevzfutqqlz5lt
   - Bio: Photographer & Videographer 📸 | 🎥

4. **animalstr** - Wildlife photographer
   - npub: npub14ahvu0w8fktqasu74du00htka07eth7vwymngc59hha5m83ppr3qdurduk
   - NIP-05: _@animalstr.com

5. **naturestr** - Nature/outdoor photographer
   - npub: npub1nquqjk6ntsg8dg9657j9ackqd8q26cwhz40g6tymgt43aazksgxqccxccs
   - NIP-05: _@naturestr.com

6. **Karine Studio** - Photography studio
   - npub: npub1l9kr6ajfwp6vfjp60vuzxwqwwlw884dff98a9cznujs520shsf9s35xfwh
   - Lightning: karine@blink.sv

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Added 6 photography accounts
- `/src/data/follow-pack/categories.ts` - Added photography category, reordered others
- `/src/types/follow-pack/index.ts` - Added 'photography' to CategoryId type
- `scripts/temp-naddr-results.json` - Saved processing results

**Status**: ✅ COMPLETE

### Run #3 - 2026-02-13
**Input**: naddr (kind 39089)  
**Category**: musicians (NEW CATEGORY)  
**Command**:
```bash
node scripts/process-naddr.cjs "naddr1qvzqqqyckypzq2x2qxdh3dy5cfdfmgkkgkt44pgpcl5ekyfs9ewtuaywukflevkvqythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqxxumm6dfmxwvm60qe8ydcmkr4z6" musicians
```

**Results**:
- **Source**: naddr (kind 39089) from pubkey 28ca019b...
- **Identifier**: nozjvg3zx2r7
- **Total p-tags found**: 38 pubkeys
- **Metadata fetched**: 43/38 accounts (some relays returned extra)
- **Existing accounts checked**: 442
- **New accounts**: 34 (after deduplication from 39 total)
- **Duplicates skipped**: 5 (4 existing + 1 internal duplicate)

**New Category Created**: `musicians` 🎵
- Added to `/src/types/follow-pack/index.ts` (CategoryId type)
- Added to `/src/data/follow-pack/categories.ts` with:
  - Name: Musicians
  - Icon: music
  - Color: #8B5CF6 (Purple)
  - Order: 4 (between photography and mystics)
- Updated all subsequent category order numbers

**New Accounts Added** (34 musicians):

**Notable Artists**:
1. **JoeMartin** - 21st century troubadour from Isle of Man 🇮🇲
   - npub: npub19r9qrxmckj2vyk5a5ttyt966s5qu06vmzyczuh97wj8wtyluktxqymeukr
   - NIP-05: joemartinmusic@tunestr.io

2. **Ainsley** - Singer/Songwriter, Pop/Rock Artist
   - npub: npub13qrrw2h4z52m7jh0spefrwtysl4psfkfv6j4j672se5hkhvtyw7qu0almy
   - "Disrupting music one zap at a time"

3. **wavlake** - Stream Anywhere, Earn Everywhere ⚡️🎵
   - npub: npub1yfg0d955c2jrj2080ew7pa4xrtj7x7s7umt28wh0zurwmxgpyj9shwv6vg
   - NIP-05: _@wavlake.com

4. **fountain_app** - Podcast & music platform
   - npub: npub1v5ufyh4lkeslgxxcclg8f0hzazhaw7rsrhvfquxzm2fk64c72hps45n0v5
   - NIP-05: fountain@fountain.fm

5. **Alicia Stockman** - Americana Roots Singer-Songwriter
   - npub: npub1l3y60kjywvrrln5ftse553h2ltg53sm3zy55grvlncd78x3k5uqsmw8dff

6. **The Higher Low** - Album: "FREEDOM IN THE DIGITAL AGE"
   - npub: npub1jp9s6r7fpuz0q09w7t9q0j3lmvd97gqzqzgps88gu870gulh24xs9xal58

**Music Platforms & Projects**:
- **OpenMike** - Running tunestr (independent music + independent money)
- **Music Side Project** - Decentralized Music For The Masses, RSS Music Player
- **New Music Nudge Unit** - Documenting musicians introduced to v4v
- **PhantomPowerMedia** - Value4Value podcast for indie musicians

**Artists** (28 more): Longy, Horszt, Sara Jade, justloud, TWIN, jonesy, Amber Sweeney, Kavinya, Nick Malster, merryoscar, bencousens, means, billiv, Sam Sethi, rheedio, reelrichard, ivylumi, phillip, Ian, JSTR, Zhaklina, thomasdibb, flipacoin

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Added 34 musician accounts (MUSICIANS section)
- `/src/data/follow-pack/categories.ts` - Added musicians category, reordered others
- `/src/types/follow-pack/index.ts` - Added 'musicians' to CategoryId type
- `scripts/temp-naddr-results.json` - Saved processing results
- `scripts/add-musicians.cjs` - Helper script to add accounts

**Status**: ✅ COMPLETE

### Run #4 - 2026-02-13
**Input**: naddr (kind 39089)  
**Category**: permaculture (NEW CATEGORY)  
**Command**:
```bash
node scripts/process-naddr.cjs "naddr1qvzqqqyckypzq96n3hp2vfmf6z2y8uvvxl97xk86kkalnqghx4p25lzl79c76a7yqythwumn8ghj7un9d3shjtnswf5k6ctv9ehx2ap0qqxxx6t0vv6nser4w4n8guggtcxx7" permaculture
```

**Results**:
- **Source**: naddr (kind 39089) from pubkey 17538dc2...
- **Identifier**: cioc58duuftq
- **Total p-tags found**: 48 pubkeys
- **Metadata fetched**: 52/48 accounts (some relays returned extra)
- **Existing accounts checked**: 479
- **New accounts**: 43 (after deduplication from 47 total)
- **Duplicates skipped**: 9 (5 existing + 4 internal duplicates)

**New Category Created**: `permaculture` 🌱
- Added to `/src/types/follow-pack/index.ts` (CategoryId type)
- Added to `/src/data/follow-pack/categories.ts` with:
  - Name: Permaculture
  - Icon: leaf
  - Color: #22C55E (Green)
  - Order: 5 (between musicians and mystics)
- Updated all subsequent category order numbers

**New Accounts Added** (43 permaculture practitioners):

**Featured Homesteaders & Farmers**:
1. **Niel Liesmons** - Designer that codes, #WordStudy #Dadstr #Farmstr
   - npub: npub149p5act9a5qm9p47elp8w8h3wpwn2d7s2xecw2ygnrxqp4wgsklq9g722q

2. **jackspirko** - Host of The Survival Podcast & The Bitcoin Breakout, Founder of #grownostr
   - npub: npub15879mltlln6k8jy32k6xvagmtqx3zhsndchcey8gjyectwldk88sq5kv0n
   - NIP-05: jackspirko@primal.net

3. **The Fertile Crescent** - "a Bitcoin farm 🌱"
   - npub: npub1g6fz8axwfp9m5nsjt2xg4ysr9ctwt5rmwgl2tk30y5ajvf76jtrsskpcks

4. **Lost Sheep Ranch** - Selling 100% grassfed lamb and pasture raised eggs for bitcoin
   - npub: npub1uus3cgn5xlwt2kp8z26mrwlm9g3myaj5vjwaclqlkknam6r6lmhqjhwkxn

5. **FloofFarm** - Dairy goat farm in Washington, breeding American Dairy Goats
   - npub: npub1dqdeuwzfy9vzajkzk3jp4yeh79akv6v2qyr9d9xfrhzvx3wxmc0qrzw9nn
   - NIP-05: flooffarm@coinos.io

**Notable Accounts**:
- **rev.hodl** - "Homesteading, Permaculture, Bitcoin, Freedom. All one or all none!"
- **AU9913** - Papa, Regen Rancher #permaculture, Dev
- **bitcoinbonden** - Norwegian farmer selling beef, pork and firewood for #bitcoin
- **lacruzboss** - 🇸🇻 Jungle coffee provider from El Salvador
- **Jordan Richner** - Rancher, Soil Scientist, Bushcrafter, Woodworker
- **MowMow** - "I'm a goat. CEO of weed control and maintenance"
- **NaturalNerd** - "Hillbilly engineer and plant nerd going feral"
- **Permanerd 🌱 💻** - Father, husband, homesteader, permaculturer, hunter
- **Homestead Citadel** - Bitcoin homesteader and citadel builder
- **GnosisMycelium** - "Gnosis translates from Greek to 'knowledge'..."
- **BTCbeeRancher** - Keeping bees in horizontal hives
- **Acme Acres** - Family farm-to-table provider of premium grass-fed beef
- **Sand Hill Thicket** - Gulf Coast sheep, cats, and food
- **Be The Change** - Homesteaders in the South
- **Stacking Functions** - Urban Homesteader, Edible Landscaper
- **A.A.Ron** - Alaskan. Electrical enginerd. Hunter, fisherman, gardener
- **FlyoverJoe** - "Out here in the middle of nowhere"
- **Jen** - Homesteader passionate about regen agriculture
- **Maria2000** - Country living, chickens, peaceful life
- **jesssowards** - Homesteader, Gardener from South Carolina

Plus 23 more: WedgeSocial, ender, RecoveringAcademic, ornedii, jsm, phenixfalconer, TBone, dwright5816, JoJ, JayW132, Kayne, The Bird, Little Spoon, Ragamuffin, hbhgardens, DefiantDandelion

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Added 43 permaculture accounts (PERMACULTURE section)
- `/src/data/follow-pack/categories.ts` - Added permaculture category (12 total now)
- `/src/types/follow-pack/index.ts` - Added 'permaculture' to CategoryId type
- `scripts/temp-naddr-results.json` - Saved processing results
- `scripts/add-permaculture.cjs` - Helper script to add accounts

**Status**: ✅ COMPLETE

### Run #5 - 2026-02-13
**Input**: Search follows (source npub + target category)  
**Category**: parents (NEW CATEGORY)  
**Command**:
```bash
node scripts/search-follows.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 parents
```

**Results**:
- **Source**: npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 (pitiunited)
- **Total contacts searched**: 2,536
- **Metadata fetched**: 2,639/2,536 accounts
- **High confidence (40+ score)**: 0 accounts
- **Medium confidence (20-39 score)**: 19 accounts
- **Low confidence (<20)**: 2,406 accounts
- **Duplicates (already in db)**: 214 accounts
- **New unique accounts**: 15 (after deduplication from 19)

**New Category Created**: `parents` 👨‍👩‍👧‍👦
- Added to `/src/types/follow-pack/index.ts` (CategoryId type)
- Added to `/src/data/follow-pack/categories.ts` with:
  - Name: Parents & Families
  - Icon: heart
  - Color: #F472B6 (Pink)
  - Order: 6 (between permaculture and mystics)

**New Accounts Added** (15 parents):

1. **momotahmasbi** - The Host of Round the Fire with Momo
2. **Jason Hodlers** - Christian, homeschooling father of 6
3. **Golfwinch** - Bitcoin maximalist, family-focused
4. **NEEDcreations** - Bitcoin educator, children's book author
5. **bitcoinmd** - Christian, husband, father, physician
6. **Luke Dashjr** - Father of 11 children, Bitcoin Core developer
7. **DaddyJones** - Stay at home Daddy of four Homesteaders
8. **beards&bullmkts** - #plebdad, God, Family, btc
9. **kidwarp** - Father & American, start a family citadel
10. **pringlestax** - Imparts wisdom from grandparents to kids
11. **Michelle** - Wife, mom of 3, homeschooler
12. **berean jones** - Husband, Father
13. **mikemonty** - Homeschool dad
14. **bitcoin4all** - Wrote kids book "The Winds Of Uncertainty"
15. **BecomingB** - Husband, father, homeschooler

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Added 15 parent accounts (PARENTS section)
- `/src/data/follow-pack/categories.ts` - Added parents category (13 total now)
- `/src/types/follow-pack/index.ts` - Added 'parents' to CategoryId type
- `scripts/temp-search-results.json` - Saved search results
- `scripts/add-parents.cjs` - Helper script to add accounts

**Status**: ✅ COMPLETE

### Run #6 - 2026-02-13
**Input**: Search follows with multi-category support  
**Category**: christians (added to existing parent accounts)  
**Command**:
```bash
node scripts/search-follows-v2.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 christians
```

**Results**:
- **Source**: npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 (pitiunited)
- **Feature**: Multi-category support - accounts can now have multiple categories!
- **Accounts updated** (added 'christians' to existing 'parents'):
  1. **Jason Hodlers 🪢** - ["parents"] → ["parents", "christians"]
  2. **Luke Dashjr** - ["parents"] → ["parents", "christians"]
  3. **berean jones** - ["parents"] → ["parents", "christians"]

**New Capability**: 
- Accounts are no longer limited to single category
- When searching follows, existing accounts get updated with new categories
- Shows clear distinction between "updated" vs "new" accounts
- Prevents duplicate categories on same account

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Updated 3 accounts with dual categories
- `scripts/search-follows-v2.cjs` - New script with multi-category support
- `/docs/FOLLOW_PACK_INTEGRATION.md` - Updated documentation

**Status**: ✅ COMPLETE - Multi-category support now active!

### Run #7 - 2026-02-13
**Input**: Search follows for foodies  
**Category**: foodies (NEW CATEGORY)  
**Command**:
```bash
node scripts/search-follows-v2.cjs npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 foodies
```

**Results**:
- **Source**: npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4 (pitiunited)
- **Total contacts searched**: 2,640
- **Accounts updated with 'foodies' category**: 5
  - **daniel** - ["jumpstart"] → ["jumpstart", "foodies"]
  - **NEEDcreations** - ["parents"] → ["parents", "foodies"]
  - **Lois 🧘‍♀️🫖✨🙏** - ["mystics"] → ["mystics", "foodies"]
  - **GreatGhee** - ["merchants"] → ["merchants", "foodies"]
  - **heatherlarson** - ["mystics"] → ["mystics", "foodies"]

- **New foodie accounts added**: 16
  1. **seth** - 👨🏻‍🍳 https://zap.cooking
  2. **ZapCooking** - Food. Friends. Freedom ⚡️
  3. **chefberk** - Culinary Artist | Sous Chef
  4. **chef4brains** - "If more of us valued food and cheer..."
  5. **awayslice** - Beefsteak CEO
  6. **ck** - Home cooking + Bitcoin
  7. **thor** - Interested in tech, cooking, history
  8. **beejay** - Twin Cities native, cookbook author
  9. **PUMBA21 🧡🍪** - Home cooking, raw feeding
  10. **HighonBTC** - cooking from scratch with ghee
  11. Plus 6 more...

**New Category Created**: `foodies` 🍳
- Icon: utensils
- Color: Coral (#FF6B6B)
- Order: 8

**Multi-category showcase**: NEEDcreations now has ["parents", "foodies"] - a parent who cooks!

**Files Modified**:
- `/src/data/follow-pack/accounts.ts` - Added 16 foodie accounts, updated 5 with dual categories
- `/src/data/follow-pack/categories.ts` - Added foodies category (15 total)
- `/src/types/follow-pack/index.ts` - Added 'foodies' to CategoryId type
- `scripts/add-foodies.cjs` - Helper script
- `/docs/FOLLOW_PACK_INTEGRATION.md` - Updated documentation

**Status**: ✅ COMPLETE - Foodies category active!

---

## Automation Status

| Feature | Status | Script |
|---------|--------|--------|
| Process naddr | ✅ READY | `scripts/process-naddr.cjs` |
| Process npub | ✅ READY | `scripts/process-npub.cjs` |
| Search follows | ✅ READY | `scripts/search-follows-v2.cjs` (multi-category support) |
| Auto-add to file | 🔄 MANUAL | Currently requires manual edit |
| Deduplication | ✅ WORKING | Built into process-naddr |
| Metadata fetch | ✅ WORKING | Multi-relay fallback |
| Category validation | ✅ WORKING | Validates against categories.ts |
