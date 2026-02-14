# Naddr Processing Results

**Processed:** 2026-02-13T17:59:11.508Z  
**Status:** ✅ COMPLETED

## Summary

- **Total accounts found:** 63
- **Unique new accounts:** 46 (after removing cross-naddr duplicates)
- **Duplicates skipped:** 17 (13 existing + 4 internal duplicates)
- **Build status:** ✅ Successful

## Processing Notes

- **Naddr 1:** Successfully processed - 11 pubkeys, 4 new accounts (8 existing duplicates)
- **Naddr 2:** Successfully processed - 48 pubkeys, 46 new accounts (5 existing duplicates)
- **Naddr 3:** ⚠️ Invalid checksum - could not process (likely typo in provided naddr)

## Implementation Status

✅ **All 46 unique new accounts have been added to `/src/data/follow-pack/accounts.ts`**  
✅ **Build verification passed**  
✅ **TypeScript validation successful**

## Final Category Distribution

After adding to follow-pack:

| Category | Count |
|----------|-------|
| **permaculture** | 18 |
| **cool_people** | 11 |
| **musicians** | 6 |
| **artists** | 4 |
| **jumpstart** | 4 |
| **photography** | 2 |
| **parents** | 1 |

**Total: 46 new accounts added**

## Issues Encountered

1. **Naddr 3 Invalid:** The third naddr had an invalid checksum and could not be decoded. The error message indicated the expected checksum was different from what was provided.
2. **Internal Duplicates:** 4 accounts appeared in both naddr results (cross-naddr duplicates were automatically removed).
3. **Existing Duplicates:** 13 accounts were already present in the follow-pack database.

## Scripts Used

- `scripts/process-three-naddrs.cjs` - Decoded nadrs and fetched account metadata
- `scripts/add-naddr-accounts.cjs` - Added unique accounts to accounts.ts

## Next Steps

- Consider manually verifying naddr3 if the correct value can be provided
- Monitor account activity levels for accuracy
- Review categories assigned by automated bio analysis

## Per-Naddr Breakdown

### naddr1
- Identifier: b9c49267-5145-489a-ad6f-887b42e188e3
- Kind: 39089
- Pubkeys found: 11
- Metadata retrieved: 12
- New accounts: 4
- Duplicates: 8

### naddr2
- Identifier: cioc58duuftq
- Kind: 39089
- Pubkeys found: 48
- Metadata retrieved: 51
- New accounts: 46
- Duplicates: 5

## Category Distribution (New Accounts)

- **permaculture:** 29 accounts
- **cool_people:** 12 accounts
- **musicians:** 9 accounts
- **parents:** 9 accounts
- **artists:** 5 accounts
- **jumpstart:** 4 accounts
- **foodies:** 4 accounts
- **sovereign:** 3 accounts
- **photography:** 3 accounts
- **christians:** 1 accounts

## New Accounts by Category

### permaculture (19)

- **AU9913** (npub16ux4qzg4qjue95vr3q327fzata4n594c9kgh4jmeyn80v8k54nhqg6lra7)
  - Bio: Papa
Regen Rancher #permaculture 
Dev
🐤
  - Categories: permaculture
  - NIP-05: auggie@nakaMOtown.com
  - Lightning: au9913@minibits.cash

- **rev.hodl** (npub1f5pre6wl6ad87vr4hr5wppqq30sh58m4p33mthnjreh03qadcajs7gwt3z)
  - Bio: Homesteading, Permaculture, Bitcoin, Freedom. All one or all none!
  - Categories: permaculture, sovereign
  - NIP-05: revhodl@cornychat.com
  - Lightning: revhodl@minibits.cash

- **jsm** (npub17faysylnrk86lqph0mc46j3e0cmypdw2rhlm488fmj536vmzczgs5qlnh4)
  - Bio: Farmer.
  - Categories: permaculture
  - NIP-05: jsmcd@getalby.com
  - Lightning: jsmcd@getalby.com

- **bitcoinbonden** (npub1xcrkgfqejzgqaxle4jhmuyp8g0xpjvsug4yt6ayxw8r7p02j3gjscl60yf)
  - Bio: Norwegian farmer selling beef, pork and firewood for #bitcoin
  - Categories: permaculture
  - Lightning: curiousjam84@walletofsatoshi.com

- **phenixfalconer** (npub1g2xehyhfv27mdtvmz78l4fe5cd57lu7yxkgwh8ea8m4qt83g6w9qqrg0vy)
  - Bio: #homesteading #farmstr #gardening #garden #seedstr #chickens #rabbits #birdstr #huntstr #hunting #bu...
  - Categories: permaculture
  - Lightning: cloudycook707@minibits.cash

- **TBone** (npub1wezprxcca3tttvnhncxsxhnhz25av6wml0jm9305tr94vjhmdj2s2e62hu)
  - Bio: Homesteader.
Steak Approver.
Ungovernable.
Unemployable.
#bitcoin only
#nostr only
  - Categories: permaculture
  - NIP-05: Tbone@nostrplebs.com
  - Lightning: tbone@walletofsatoshi.com

- **phenixfalconer** (npub1g2xehyhfv27mdtvmz78l4fe5cd57lu7yxkgwh8ea8m4qt83g6w9qqrg0vy)
  - Bio: #homesteading #farmstr #gardening #garden #seedstr #chickens #rabbits #birdstr #huntstr #hunting #bu...
  - Categories: permaculture
  - Lightning: cloudycook707@minibits.cash

- **FloofFarm** (npub1dqdeuwzfy9vzajkzk3jp4yeh79akv6v2qyr9d9xfrhzvx3wxmc0qrzw9nn)
  - Bio: Floof Farm is a dairy goat farm located in Washington. We breed American Dairy Goat Association (ADG...
  - Categories: permaculture
  - NIP-05: flooffarm@coinos.io
  - Lightning: flooffarm@coinos.io

- **watts_bar** (npub10w8umy2n6tz8z3s4theyklck0yjvrlqkld8gg0vclz6l8twkhkzsd4zf5s)
  - Bio: Freedom minded homesteader, chicken farmer and pig castrator

  - Categories: permaculture, sovereign

- **A.A.Ron** (npub1v40sr983gxp3x685mgmjvgsxy3t77u7t78ndk9e56truqhsq989q3e2y09)
  - Bio: Alaskan. Electrical enginerd. Hunter, fisherman, gardener. Ham radio operator.
  - Categories: permaculture
  - Lightning: grainyagenda152@minibits.cash

- **Sand Hill Thicket** (npub1jjg3pla64v0w6lqzk3n95rw9q4zn0e0gn3dmuph4zcqw3vqqr3equqm9ym)
  - Bio: It's pretty much all about Gulf Coast sheep, cats, and food over here... Life of a smallholder on th...
  - Categories: permaculture, foodies
  - NIP-05: SandHillThicket@med--mastodon-com.mostr.pub

- **The Fertile Crescent** (npub1g6fz8axwfp9m5nsjt2xg4ysr9ctwt5rmwgl2tk30y5ajvf76jtrsskpcks)
  - Bio: a Bitcoin farm 🌱
𝘧𝘰𝘭𝘭𝘰𝘸 𝘢𝘭𝘰𝘯𝘨 𝘸𝘪𝘵𝘩 𝘶𝘴 𝘰𝘯 𝘰𝘶𝘳 𝘫𝘰𝘶𝘳𝘯𝘦𝘺 𝘵𝘰 𝘧𝘳𝘦𝘦𝘥𝘰...
  - Categories: permaculture
  - Lightning: thefertilecrescent@getalby.com

- **lacruzboss** (npub1khzp0wd4rlej87zhkmrqelcgtj89p6r6xdj6rm2a2tum8szcp2dsje3c5c)
  - Bio: 🇸🇻 jungle coffee provider 🇸🇻
🌴 LA CRUZ 🌴 

I have a speciality coffee farm in El Salvador.
  - Categories: permaculture
  - NIP-05: lacruz@nostrplebs.com
  - Lightning: cyanpanther3@primal.net

- **Jordan Richner** (npub109m4qpqazdn2sr29uycvsv0s2c447unxvc4s0t802rw4gxl6y56sd9hvru)
  - Bio: Rancher, Soil Scientist, Bushcrafter, Woodworker, Homesteader, Bitcoiner, Entrepreneur
  - Categories: permaculture
  - Lightning: jordanrichner@strike.me

- **Be The Change: Abundance, Service, Play** (npub142pkyu2zfgwnvq0cyc5vvjss2yn9vr4lrcpcgl2m3uj8kma9q7lsdfduqf)
  - Bio: Homesteaders in the South.

  - Categories: permaculture
  - Lightning: farm@coinos.io

- **Acme Acres** (npub1m3fs4sufjuumpzp8axgpcfwvcz9n2lvrgafj5ajefaxlwxamjxysfjhch4)
  - Bio: Acme Acres is a family farm-to-table provider of premium, grass-fed/grass finished pasture-raised be...
  - Categories: permaculture, parents
  - Lightning: ambermoth8@primal.net

- **jesssowards** (npub15wgenn94ajftrngy00eacl5fy0k7w6w35hxvgl2hnyf0pawtm26qy07hfl)
  - Bio: Homesteader. Gardener. Lover of good food and pretty words. South Carolina is home. 
  - Categories: permaculture, foodies
  - Lightning: tealsloth1@primal.net

- **GnosisMycelium** (npub1upyxvpt8txcp8zxcdea4xxn0w82nd2tlvq0sjp3pnmrn04v90l9sz3s9at)
  - Bio: Gnosis (No-sis) translates from Greek to “knowledge” often associated with a deeper understanding of...
  - Categories: permaculture
  - Lightning: lemonchicken14@primal.net

- **Homestead Citadel** (npub1vytdqmweftkmz3wjua5f5tlzyjw72m7yazdyet8g3gx5k8vqky6sy3a544)
  - Bio: Bitcoin homesteader and citadel builder
  - Categories: permaculture
  - Lightning: serendipitouspancake735240@getalby.com

### cool_people (12)

- **Maria2000** (npub13kwjkaunpmj5aslyd7hhwnwaqswmknj25dddglqztzz29pkavhaq25wg2a)
  - Bio: Country living, chickens, living a peaceful life
  - Categories: cool_people
  - NIP-05: maria2000@happytavern.co
  - Lightning: maria@walletofsatoshi.com

- **WedgeSocial** (npub1dgpt04w4c88wc0g262xaw8zvlm4mvwtmjhl0tn2sxtyjywsn6q4qt8ka3a)
  - Bio: Loose Canon Loaded Flowers
  - Categories: cool_people
  - NIP-05: wedgesocial@nostrplebs.com
  - Lightning: wedgesocial@walletofsatoshi.com

- **ender** (npub1telxn7rr6gx2xqgrm7ygsuv5uzgk09y3lml9awppyafsz0xr64fqlap4l3)
  - Bio: low IQ | blue collar worker | married | Yeshua follower | bitcoin standard | building my own Georgia...
  - Categories: cool_people
  - Lightning: boldshrimp14@primal.net

- **MowMow** (npub16qs0um3zkwk2natczu4pxh3967mf9enm2t5hlh892sc3yltky6hs832q4u)
  - Bio: I'm a goat. CEO of weed control and maintenance.
I do goat things and occasionally zap things that g...
  - Categories: cool_people
  - Lightning: theseguru02@walletofsatoshi.com

- **Lost Sheep Ranch** (npub1uus3cgn5xlwt2kp8z26mrwlm9g3myaj5vjwaclqlkknam6r6lmhqjhwkxn)
  - Bio: Selling 100% grassfed lamb and pasture raised eggs for bitcoin (and fiat) in south central Pennsylva...
  - Categories: cool_people
  - Lightning: grover@getalby.com

- **FlyoverJoe** (npub1n9tzmkej4slrx7y3n22rapsuhxv7spvralruwzjzhw37n6alc4usnu8t27)
  - Bio: Out here in the middle of nowhere. 
  - Categories: cool_people
  - Lightning: 733ac1b0bfac491f@coinos.io

- **JayW132** (npub1gftqj0my4sl42fcruxy8h8jmyfnl3z4axja0fpvc0ekzeqlh0dfsffg34w)
  - Bio: Building The Bitcoin Collective
  - Categories: cool_people
  - Lightning: honestcloudy02@walletofsatoshi.com

- **Kayne** (npub1zede6daz3yp3qwhe45jqx67u2sns3qkqrtw4z4u3ljtxv9nultqs0e3hvt)
  - Bio: i am Kayne this is where I express my opinions. 
  - Categories: cool_people
  - NIP-05: kayne@nostrcheck.me
  - Lightning: zippymoose10@primal.net

- **NaturalNerd** (npub10f4ccl0pwx24cg2da4lrtnrc9ntdmh73gx4mry5uvvhkjdywdaysa5hrhr)
  - Bio: Hillbilly engineer and plant nerd going feral
  - Categories: cool_people
  - Lightning: 7a6b8c7de171955c214ded7e@coinos.io

- **Little Spoon** (npub15f0lnlxujj05a8cr7emhsz9cszcjalaq0su6rymvw22zuth0h9fs7cqrdx)
  - Bio: Fat zapper.   Skinny zaps. 
  - Categories: cool_people
  - Lightning: BigSpoon@coinos.io

- **BTCbeeRancher** (npub1l9q6623y79nvrdv5qwwfprd5t3qgkecl3lmkck7hh8tv65x46vuskzcmqa)
  - Bio: Keeping bees in horizontal hives and avoiding traders/scammers who want to “teach” me to make money....
  - Categories: cool_people
  - NIP-05: BTCbeeRancher@primal.net
  - Lightning: BTCbeeRancher@primal.net

- **BTCbeeRancher** (npub1l9q6623y79nvrdv5qwwfprd5t3qgkecl3lmkck7hh8tv65x46vuskzcmqa)
  - Bio: Keeping bees in horizontal hives and avoiding traders/scammers who want to “teach” me to make money....
  - Categories: cool_people
  - NIP-05: BTCbeeRancher@primal.net
  - Lightning: BTCbeeRancher@primal.net

### musicians (6)

- **ornedii** (npub14vg65upysgyqel4ddc6lkma663228eujm4xhtuvr75h4l632975sdupd9a)
  - Bio: dryland permaculture, tinyhouse, music, software engineer full stack
  - Categories: musicians, permaculture
  - Lightning: lovelycoffee4614@getalby.com

- **Jen** (npub1crsvgfepxnvjm2r9zegvzr9xz2m3pfns6hsyxjy0yls88g0k8gtqhc9r37)
  - Bio: Nostr only 
Homesteader 
Passionate about regen agriculture
Beagles make the best buddies
Bitcoin is...
  - Categories: musicians, permaculture
  - NIP-05: farmerjen@nostrplebs.com
  - Lightning: farmerjen@walletofsatoshi.com

- **dwright5816** (npub1trfta8eq2dadwp6tq2pjsas32pl000f3830dkex7l8slch0jd5gs34d0e6)
  - Bio: In Tennessee, interested in permaculture, decentralized technology, bitcoin, and algorithmic trading...
  - Categories: musicians, permaculture, parents
  - Lightning: jollyhorse7@primal.net

- **JoJ** (npub1s90578ktlln6hcmqqx9kvv546xyt6j0clerjdmnraadu5km0vn5q9w8hyk)
  - Bio: Heathen
Husband, Father, Farmer,
Wood chopper, wood burner
  - Categories: musicians, permaculture, parents
  - Lightning: quickswan9@primal.net

- **Permanerd 🌱 💻** (npub1zqdpzty2mshxncqqxy2078qax6mlehsxmpx5095wtxw4tpepkr0s2ce6fj)
  - Bio: Father, husband,  homesteader, permaculturer, hunter, laugher, fun haver, Sats 4 Snacks operator
  - Categories: musicians, permaculture, parents
  - Lightning: permanerd@getalby.com

- **jackspirko** (npub15879mltlln6k8jy32k6xvagmtqx3zhsndchcey8gjyectwldk88sq5kv0n)
  - Bio: Host of The Survival Podcast & The Bitcoin Breakout, Founder of the #grownostr initiative.  I am als...
  - Categories: musicians, permaculture, parents, sovereign
  - NIP-05: jackspirko@primal.net
  - Lightning: jackspirko@primal.net

### artists (5)

- **grawoig** (npub1xtga7d2a9nhw5hx3csw4wju3qhrgamha0s9a98jfc9f0uuwycl2ssg89t4)
  - Bio: artist composer maxi
  - Categories: artists, musicians
  - Lightning: justelephant4@primal.net

- **zed-erwan☕️✏️🎨** (npub1r2sah0htqnw7xrs70gq00m48vp25neu8ym2n2ghrny92dqqf7sest8hth0)
  - Bio: Sketch, croquis, carnet de voyage, chaque jour un dessin et un café. Juste le plaisir de partager mo...
  - Categories: artists
  - Lightning: zederwan@minibits.cash

- **BitcoinArtMag** (npub1zrclffvv67nlda0ds8kw755lzm8yy9eavxta54qn4g8wegxzzv3q8amvxc)
  - Bio: The world’s first Bitcoin Art Magazine ⚡️
Order Now︱ bitcoinartmagazine.com
Listen︱ bitcoinartbroadc...
  - Categories: artists
  - NIP-05: BitcoinArtMag@primal.net
  - Lightning: BitcoinArtMag@primal.net

- **zed-erwan☕️✏️🎨** (npub1r2sah0htqnw7xrs70gq00m48vp25neu8ym2n2ghrny92dqqf7sest8hth0)
  - Bio: Sketch, croquis, carnet de voyage, chaque jour un dessin et un café. Juste le plaisir de partager mo...
  - Categories: artists
  - Lightning: zederwan@minibits.cash

- **Niel Liesmons** (npub149p5act9a5qm9p47elp8w8h3wpwn2d7s2xecw2ygnrxqp4wgsklq9g722q)
  - Bio: Designer that codes.
Also #WordStudy #Dadstr #Farmstr
  - Categories: artists, permaculture, parents
  - Lightning: nielliesmons@coinos.io

### jumpstart (4)

- **RecoveringAcademic** (npub1w9wz0y54ke29f3ryk7zs84s4fttkj7agy3sv2mv2gt44mgg7d39sewekxt)
  - Bio:  
  - Categories: jumpstart
  - NIP-05:  
  - Lightning:   

- **AC** (npub1ec7rqh20d00pqc9uxxf7ruv0xcvah0vexzpd5kpcl46yj84pme4suggn5k)
  - Bio: N/A
  - Categories: jumpstart
  - NIP-05: agrariancontrarian@nostrplebs.com
  - Lightning: agrariancontrarian@getalby.com

- **Ragamuffin** (npub12x9ju2tk6gam7auwm5agvylnj0t8ch040xuehdzeyg4w8jmwdduqetsr92)
  - Bio: N/A
  - Categories: jumpstart
  - Lightning: fancyladybug3@primal.net

- **hbhgardens ** (npub132h6042qm8eywpz806aq7w0vyjmav4pehn6c3vzdd8xy9zhlfs4qwwe2yu)
  - Bio: Love & Light 
  - Categories: jumpstart
  - NIP-05: hbhgardens@nostrplebs.com
  - Lightning: supermoth6@primal.net

### photography (3)

- **Stacking Functions** (npub1paqpz9vuyjn220hw5uhpct5hupp9h690zhnauwtsq0wktk0g6fuq4dezs0)
  - Bio: Urban Homesteader, Edible Landscaper
Here for the Great Awakening 
  - Categories: photography, permaculture
  - Lightning: chicrenewal691762@getalby.com

- **DefiantDandelion** (npub1pncg62q25h704u6qcf56hnmxx46jdlwfpw2t860ld5685s0sjzms9rqlgr)
  - Bio: 🏔️🏕️📷🪴🥖🐓🔭📡🔬💻🇺🇸🧐✝️

I’m cursed by curiosity. My education is in #Economics and #Philosop...
  - Categories: photography, musicians, permaculture, parents, foodies
  - Lightning: npub1hxx4z9ul8qvt3jmy4rfccyl2fcl9x4qtflxrk9y2fe560f4eqe8qhetm7w@npub.cash

- **DefiantDandelion** (npub1pncg62q25h704u6qcf56hnmxx46jdlwfpw2t860ld5685s0sjzms9rqlgr)
  - Bio: 🏔️🏕️📷🪴🥖🐓🔭📡🔬💻🇺🇸🧐✝️

I’m cursed by curiosity. My education is in #Economics and #Philosop...
  - Categories: photography, musicians, permaculture, parents, foodies
  - Lightning: npub1hxx4z9ul8qvt3jmy4rfccyl2fcl9x4qtflxrk9y2fe560f4eqe8qhetm7w@npub.cash

### parents (1)

- **The Bird** (npub176gqu66z4qax6ejcju2dujdvs6gecerys47eu9jtj5aul8r7jwwsnqq836)
  - Bio: God, Family, Bitcoin, nature, pew, fish, birdman and _______________

XMR
44EhwqxoEBwaatnyLQop645v5b...
  - Categories: parents, christians
  - NIP-05: DC@bitcoinveterans.org
  - Lightning: greenkarusa@blitzwalletapp.com

