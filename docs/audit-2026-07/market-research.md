# Search Landscape for Nostr Education — 2026 Research Report

**Research date:** 2026-07-27 · **Site:** nostrich.love

---

## 0. Method & verification caveats (read first)

**What I actually did:** 22 web searches across EN/ES/DE/PL/ZH/AR/HI, plus direct fetches of competitor `robots.txt` and `sitemap.xml` files, the Wikimedia pageviews API, and the live `nostrich.love` sitemap.

**What is verified vs. estimated:**

| Claim type | Status |
|---|---|
| Competitor URL inventories (nostr.co.uk = 97 URLs, etc.) | **Verified** — fetched from live sitemaps 2026-07-27 |
| Wikipedia pageview numbers | **Verified** — Wikimedia REST API |
| "Who ranks on page 1" | **Approximated** — the WebSearch tool is a search API, not a literal Google SERP scrape. Ordering and personalization will differ. Treat these as "who is topically visible," not "position 1–10." |
| Absolute keyword search volume (e.g. "1,200/mo") | **NOT verified** — I have no Ahrefs/Semrush/GKP access. All demand figures below are *relative tiers* derived from Wikipedia pageviews + SERP composition. **Do not put these in a forecast.** |
| Non-English demand | **Partially verified** — Wikipedia pageviews per language are real; they are a weak proxy for zh (zh.wikipedia is blocked in mainland China) and ar/hi (speakers often search in English). |

One data anomaly: the Wikimedia *monthly* endpoint returns garbage for the in-progress month (e.g. `2026-07 = 149` for en:Nostr). The *daily* endpoint for 2026-07-01→26 sums to **8,342 views over 26 days**. I used daily sums for July.

---

## 1. Demand sizing — the honest picture

English Wikipedia monthly pageviews, `Nostr` article:

| Month | Views | | Month | Views |
|---|---|---|---|---|
| 2025-04 | 4,884 | | 2026-01 | 8,689 |
| 2025-07 | 6,623 | | 2026-02 | 6,385 |
| 2025-08 | 7,525 | | 2026-03 | 5,629 |
| 2025-11 | 6,721 | | 2026-04 | 4,772 |
| 2025-12 | 4,741 | | 2026-05 | 4,440 |
| | | | 2026-06 | 6,803 |
| | | | 2026-07 (26d) | 8,342 → ~9.6k run-rate |

**Nostr is a small but non-declining topic, currently trending up.** The floor is ~4.4k/mo, the recent trend is toward ~7–9k/mo.

Adjacent topics, same source, 2026 monthly range — this is the critical strategic context:

| Article | 2026 monthly range | Ratio vs Nostr |
|---|---|---|
| **Bluesky** | 38,622 – 57,708 | **~7×** |
| Fediverse | 14,177 – 21,374 | ~3× |
| Mastodon (social network) | 10,903 – 22,452 | ~2.5× |
| ActivityPub | 5,031 – 10,186 | ~1.2× |
| Lightning Network | 6,449 – 8,192 | ~1.1× |

**Strategic implication:** the total "Nostr" query pool is capped and small. The only way to grow beyond it is *bridge queries* — Bluesky/Mastodon/Fediverse/Lightning comparison content that intercepts a 3–7× larger audience. `nostrich.love` currently has **zero dedicated comparison URLs** (see §5).

---

## 2. The competitive field — who you are actually fighting

I pulled every competitor's sitemap. This is the single most useful finding in this report.

### 2.1 nostr.co.uk — the new, dangerous incumbent
**97 URLs, English-only, launched ~Jan 2026.** (`/news/welcome-to-nostr-co-uk/` and `/news/january-2026-update-faq-glossary-events/` date the launch; its `robots.txt` header reads `Last updated: 2026-05-30`.)

It appeared on page 1 for **9 of the ~14 English clusters I tested** — glossary, FAQ, key management, privacy, relays, how-nostr-works, events, NIPs, vs-Mastodon, vs-Twitter. Structure:

- 15 `/learn/` guides: `what-is-nostr`, `getting-started`, `how-nostr-works`, `nostr-relays-explained`, `nostr-events-explained`, `nostr-clients-explained`, `key-management`, `security-best-practices`, `privacy-on-nostr`, `lightning-zaps`, `profile-verification`, `censorship-resistance`, `decentralization-explained`, `nostr-vs-mastodon`, `nostr-vs-twitter`
- **20 individual client pages** (`/clients/damus/`, `/clients/primal/`, `/clients/amethyst/`, `/clients/coracle/`, `/clients/gossip/`, `/clients/snort/`, `/clients/yakihonne/`, `/clients/notedeck/`, `/clients/flotilla/`, …)
- **14 individual relay pages** (`/relays/nos-lol/`, `/relays/damus-relay/`, `/relays/nostr-wine/`, `/relays/purplepag/`, `/relays/wot-relay/`, …)
- **28 NIP pages** (`/nips/nip-01/` … `/nips/nip-85/`)
- Year-stamped listicles: `/best-nostr-clients-2026/`, `/best-nostr-relays-2026/`
- `/glossary/`, `/faq/` (marketed as "58 Questions Answered")
- A geo moat: `/uk/`, `/uk/online-safety-bill/`, `/uk/free-speech/`, `/uk/community/`

Its `robots.txt` explicitly allowlists `OAI-SearchBot` and other AI retrieval bots with a written policy comment about "maximising AI-citation reach." Someone is running a deliberate 2026-era SEO/GEO playbook here.

**Note the overlap:** `nostr.co.uk/clients/damus/` vs `nostrich.love/simulators/damus/`; `nostr.co.uk/relays/nos-lol/` vs `nostrich.love/relay-feed-browser/`. They built as static pages what you built as interactive apps. Their version is indexable text; yours is a React island.

### 2.2 nostrcompass.org — the volume play
**212 URLs in `/en/` alone**, across **10 locales** (`en, es, pt, de, fr, it, ja, ko, nl, zh`). Heavy on `/topics/nip-XX/` pages (including obscure ones: `nip-4e`, `nip-101e`, `nip-f4`, `nip-b0`) plus a weekly newsletter archive (`/en/newsletters/2026-07-22-newsletter/`). It ranked page 1 for `NIP-17`/`NIP-04` DM queries.

**No Polish. No Hindi. No Arabic.**

### 2.3 nostr.how — the old authority, now thin
**9 pages per locale**, 11 locales (`en, de, es, fr, it, ja, nl, pt, uk, zh, fa`). English set is literally: `/en/what-is-nostr`, `/en/why-nostr`, `/en/get-started`, `/en/clients`, `/en/relays`, `/en/zaps`, `/en/get-verified`, `/en/the-protocol`, `/en/donate`. It still ranks on page 1 for `get started with nostr`, `what are nostr relays`, `what are zaps`, `get nip-05 verified` — almost entirely on domain age and exact-match topical URLs, not depth.

**No Polish. No Hindi. No Arabic.**

### 2.4 usenostr.org — proof that thin content still wins here
**10 URLs total.** Five locales (`en, es, fr, ja, pt`), two pages each (`/`, `/relay.html`). Correct `hreflang` including `x-default`. It ranked page 1 for `what is nostr`, `qué es nostr` **and** `c'est quoi Nostr`. A 2-page site is beating everyone in Spanish and French. That is the clearest possible signal that non-English Nostr SERPs are undefended.

### 2.5 Everyone else
- **learnnostr.org** — `/definitions`, `/getting-started/what-is-nostr`, `/modules/module-01-introduction`, `/concepts/nostr-fundamentals`, `/tutorials/relay-communication`, `/tutorials/understanding-events`. Dev-leaning.
- **thebitcoinmanual.com** — old but persistent; ranks for `/articles/nostr-relay/`, `/articles/nostr-zaps/`, `/articles/setup-nostr-account/`, `/articles/nostr-account-nip-05-verified/`, `/articles/find-nostr-accounts/`, `/articles/nostr-wallet-connect/`.
- **soapbox.pub/blog/** — `nostr101`, `managing-nostr-keys`, `comparing-protocols`, `mostr-zaps`. High-quality, ranks widely, but it's a company blog with no systematic coverage.
- **nostrcg.github.io/userguide/** — official-ish community user guide; ranks for `what is nostr` and FAQ.
- **AI-spun listicle farms** owning `best nostr client 2026`: `humai.blog/best-nostr-apps-2026-damus-primal-amethyst-tested/`, `webvator.com/best-nostr-apps-of-2026-...`, `reviewnexa.com/best-nostr-clients/`, `threenine.blog/posts/best-nostr-browser-extensions-2026`. Zero topical authority — they win purely on year-in-title recency.
- **Programmatic comparison spam** owning vs-queries: `slashdot.org/software/comparison/Bluesky-Social-vs-Mastodon-vs-nostr/`, `slashdot.org/software/comparison/X-vs-nostr/`, `sourceforge.net/software/product/nostr/`, `producthunt.com/products/nostr/alternatives`.

### 2.6 The single biggest structural finding: **Reddit does not rank here**
Across every English query I ran, **not one reddit.com result appeared**. In 2026 that is extraordinary — Reddit dominates page 1 for most consumer "how do I…" queries. The Nostr community discusses on Nostr and Stacker News instead (only `stacker.news/items/295997` and `/items/145707` surfaced). **There is no Reddit wall to fight in this niche.** Forum-intent and question-intent queries are winnable by a well-structured guide site in a way they simply are not in other verticals.

---

## 3. Cluster-by-cluster SERP map

### Cluster A — "what is nostr" (informational, highest volume)
Queries: `what is nostr`, `nostr meaning`, `nostr protocol explained`, `what does nostr stand for`
Visible page 1: `en.wikipedia.org/wiki/Nostr` · `nostr.com` · `github.com/nostr-protocol/nostr` · `nostrcg.github.io/userguide/` · `soapbox.pub/blog/nostr101` · `forbes.com/sites/digital-assets/2024/07/17/your-guide-to-nostr...` · `verygood.ventures/blog/what-is-nostr/` · `usenostr.org` · `nostr.co.uk/learn/what-is-nostr/`
**Format that wins:** long-form explainer with an acronym expansion in the first 40 words.
**Verdict: HARD.** Wikipedia + the protocol's own domain + Forbes. Do not lead with this. `nostrich.love/en/guides/what-is-nostr/` is titled "Nostr Explained Simply" (`src/content/guides/en/what-is-nostr.mdx:2`) — that title does not contain the head term at all.

### Cluster B — "how to use / get started" (highest commercial-ish intent)
Queries: `how to use nostr`, `nostr beginner guide`, `how to create a nostr account`, `nostr setup`, `getting started with nostr`
Visible page 1: `nostr.how/en/get-started` · `nostr.co.uk/learn/getting-started/` · `grownostr.org/get-started` · `tftc.io/nostr-beginners-guide/` · `adaptnetwork.com/tech/how-to-set-up-a-nostr-account/` · `thebitcoinmanual.com/articles/setup-nostr-account/` · `start.nostr.net` · `nostrly.com/how-to-use-nostr/` · `cointribune.com/en/comment-utiliser-nostr-guide-pour-debutants-2/` · YouTube `watch?v=kifwECtwjJQ`
**Format:** numbered step-by-step + screenshots + a "10 minutes / 5 minutes" time promise in the title (nostr.co.uk uses "10-Minute Beginner's Guide"; your `quickstart.mdx` uses "Launch in 5 Minutes" — same instinct, good).
**Verdict: MEDIUM.** Crowded but incumbents are mostly single blog posts. Video presence is real — YouTube ranks in this cluster.

### Cluster C — comparisons (biggest upside, weakest incumbents)
Queries: `nostr vs bluesky`, `nostr vs mastodon`, `nostr vs twitter`, `nostr vs x`, `decentralized twitter alternative`, `bluesky alternative`
Visible page 1: `fediview.com/articles/mastodon-vs-bluesky-vs-nostr-2026/` · `thenewstack.io/bluesky-vs-nostr-which-should-developers-care-about-more/` · `soapbox.pub/blog/comparing-protocols` · `nostr.co.uk/learn/nostr-vs-mastodon/` and `/nostr-vs-twitter/` · `protos.com/comparing-nostr-to-social-media-alternatives-bluesky-lens-and-mastodon/` · `slashdot.org/software/comparison/...` · `kerivin.github.io/social-network-comparison/` · `anarchogeek.com/posts/Why-has-Bluesky-grown-bigger-than-Nostr-w3eb29`
**Format:** side-by-side comparison table, "which should you choose" decision section, year in the title.
**Verdict: BEST OPPORTUNITY.** When Slashdot's auto-generated comparison stubs and a GitHub Pages personal project rank page 1, the cluster is undefended. And it taps the 7× Bluesky audience. You have the content asset already — `src/content/guides/en/protocol-comparison.mdx` plus a `<ProtocolComparison />` component — but it sits at `/en/guides/protocol-comparison/`, a URL matching no query anyone types.

### Cluster D — clients & apps
Queries: `best nostr client`, `nostr apps`, `damus tutorial`, `how to use amethyst`, `primal app tutorial`, `nostr client for android/iphone`
Visible page 1 for `best nostr client 2026`: `humai.blog`, `webvator.com`, `reviewnexa.com`, `threenine.blog`, `nostr.how/en/clients`.
Visible page 1 for `damus tutorial`: `beincrypto.com/learn/how-to-use-damus/` · `reclaimthenet.org/damus-nostr-social-media-app-iphone-ipad-mac` (2023) · `datafidelity.com.au/...` (a scrape of the reclaimthenet post) · **four separate GitHub forks of the damus repo** (`vinux-app/damus`, `jydxkj/damus-jy`, `BenGWeeks/damus`, `nostr-learn-forks-work/damus-ios`).
Visible page 1 for `amethyst tutorial`: `reclaimthenet.org/amethyst-nostr-social-media-app-android` (2023) · `datafidelity.com.au` mirror · `blog.areabitcoin.co/amethyst/` · `sourceforge.net` mirror · GitHub fork.
Visible page 1 for `primal tutorial`: `typefully.com/teemupleb/...` · two `nostr.com/nevent1q...` raw note permalinks · `blog.areabitcoin.co/primal/` · two YouTube videos.
**Verdict: SOFT UNDERBELLY.** When GitHub *forks* and raw Nostr `nevent` permalinks occupy page 1, there is no real competition. Per-client tutorial pages are the highest-confidence, lowest-effort win available — and `nostrich.love` already ships 10 client simulators (`src/simulators/`, live at `/simulators/damus/`, `/simulators/primal/`, `/simulators/amethyst/`, …). **The asset exists; the SEO framing does not.**

### Cluster E — relays
Queries: `what is a nostr relay`, `best nostr relays`, `how to add a relay`, `nostr relay list`, `run your own nostr relay`
Visible page 1: `nostr.co.uk/relays/` (ranked #1 for `best nostr relays list free paid 2026`) · `nostr.how/en/relays` · `nostr.com/relays` · `voltage.cloud/blog/the-essential-guide-to-nostr-relays` · `nostr.co.uk/learn/nostr-relays-explained/` · `learnnostr.org/tutorials/relay-communication` · `thebitcoinmanual.com/articles/nostr-relay/` · `shugur.com/about-nostr` · several GitHub relay-list repos
**Verdict: MEDIUM-HARD.** nostr.co.uk owns the directory intent with 14 dedicated relay pages. The *explainer* intent (`how do nostr relays work`) is more open.

### Cluster F — keys / nsec / npub (highest-anxiety intent)
Queries: `nsec vs npub`, `what is nsec`, `nostr private key`, `lost my nsec`, `recover nostr account`, `nostr key backup`
Visible page 1: `soapbox.pub/blog/managing-nostr-keys/` · `nostr.co.uk/learn/key-management/` · `nostrdesign.org/docs/how-to/private-key-safeguarding/` · `guides.getalby.com/user-guide/browser-extension/faq/i-lost-my-nostr-id-when-making-a-new-account` · `d-central.tech/nostr-key-security/` · `hellonostr.dev/en/introduction/` · `nostrtool.com` · `krisconstable.com/generating-a-key-pair-with-nostr`
**Verdict: MEDIUM.** Real, urgent intent (people search this *after* something goes wrong). `src/content/guides/en/keys-and-security.mdx` is well-built (KeyGenerator, KeyVisualizer, BackupChecklist) but titled "Your Keys, Your Identity" — contains none of `nsec`, `npub`, or `private key`.

### Cluster G — zaps & Lightning
Queries: `what are nostr zaps`, `how to send zaps`, `how to receive zaps`, `nostr lightning address`, `nostr wallet connect`
Visible page 1: `nostr.how/en/zaps` · `thebitcoinmanual.com/articles/nostr-zaps/` · `nips.nostr.com/57` · `github.com/nostr-protocol/nips/blob/master/57.md` · `learn.heyapollo.com/p/mastering-zaps-on-nostr...` · `soapbox.pub/blog/mostr-zaps/` · `nostr.co.uk/learn/lightning-zaps/`
For `nostr wallet connect`: `github.com/getAlby/nostr-wallet-connect` · `bitcoinmagazine.com/technical/nostr-wallet-connect-bitcoin-usb` (2023) · `nwc.dev` · `nips.nostr.com/47` · `thebitcoinmanual.com/articles/nostr-wallet-connect/`
**Verdict: MEDIUM.** Note the raw NIP spec pages ranking — that means no one has written a genuinely good consumer-facing NWC page. Lightning Network Wikipedia demand (6.4–8.2k/mo) ≈ Nostr's, so this cluster punches above its weight.

### Cluster H — NIP-05 / verification
Queries: `nostr nip-05`, `how to get nip-05 verified`, `nip05 checker`, `nostr verified address`
Visible page 1: `nostr.how/en/get-verified` · `help.nostrplebs.com/hc/nostrplebs/articles/1673638674-how-do-i-set-up-my-nip_05-identifier` · `wedistribute.org/2024/05/nostr-nip-05/` · `thebitcoinmanual.com/articles/nostr-account-nip-05-verified/` · `orangepill.dev/nostr-guides/guide-to-verify-nostr-profile-nip05-identifier-with-your-domain/` · `nostrdeck.com/nip05-checker.php` · `nostrcheck.me` · `nostr-tools.com` · `pywkt.com/post/20240703-nip05-verification-nostr-cloudflare` · `nickmonad.blog/2023/nostr-verification/`
**Verdict: MEDIUM, and note the split intent.** Half the SERP is *tool* intent (`nip05 checker`), half is *guide* intent. You have a `<NIP05Checker />` component but it is buried inside `src/content/guides/en/nip05-identity.mdx` — there is no standalone tool URL to rank. `nostrdeck.com/nip05-checker.php` is a raw PHP page winning that query.

### Cluster I — safety / privacy / trust
Queries: `is nostr safe`, `is nostr anonymous`, `nostr privacy`, `is nostr legit`, `who owns nostr`, `is nostr free`
Visible page 1: `bitcoinmagazine.com/technical/how-nostr-can-improve-bitcoin-privacy` · `nostr.co.uk/learn/privacy-on-nostr/` and `/faq/` · `nostrcg.github.io/userguide/help/faq/` · `stacker.news/items/295997` · `nasdaq.com/articles/white-noise-anonymous-nostr-dms-and-encrypted-group-chat` · `alternativeto.net/software/nostr-connect/about` · `sourceforge.net/software/product/nostr/`
**Verdict: MEDIUM-EASY.** `is nostr free` / `who owns nostr` returned almost no purpose-built pages — SourceForge and a personal blog. These are classic FAQ/PAA queries and you already have `faq.mdx`.

### Cluster J — troubleshooting (the total vacuum)
Queries: `nostr feed empty`, `nostr posts not showing`, `nostr not loading`, `why can't I see my posts on nostr`
**Page 1 for `nostr empty feed not showing posts troubleshooting fix` contained ZERO Nostr results.** It returned: `smashballoon.com` (Instagram), `drfone.wondershare.com` (Facebook), `wpsocialninja.com` (Facebook), `izoate.com` (Facebook), `goodreads.com` quote spam, `hubspot.com` RSS docs. Only on a third reformulation did any Nostr page surface.
**Verdict: ZERO COMPETITION, unknown volume.** You have `src/content/guides/en/troubleshooting.mdx` with a `<TroubleshootingWizard />`. It is currently titled "Common Problems & Solutions" — matching no query string. This is the single most under-defended cluster I found; the risk is that demand is genuinely tiny.

### Cluster K — discovery / community
Queries: `how to find people on nostr`, `who to follow on nostr`, `nostr follow packs`
Visible page 1: `github.com/pseudozach/nostr.directory` · `nosta.me/create/follow` · `thebitcoinmanual.com/articles/find-nostr-accounts/` · `medium.com/@SovereignMatt/...` · YouTube `watch?v=3Ah_7HWUt00` ("How to find your friends on Nostr with follow packs")
**Verdict: EASY.** A GitHub repo README ranks. You have `/follow-pack/` and `finding-community.mdx` and a `/twitter-bridge/` page — which maps exactly to the "find people you already follow on Twitter" intent that `nostr.directory` owns.

### Cluster L — private messaging
Queries: `nostr encrypted DM`, `NIP-17`, `are nostr DMs private`, `nostr secure messaging`
Visible page 1: `nostrcompass.org/en/topics/nip-17/` and `/nip-04/` · `nips.nostr.com/17` · `nostr.co.uk/nips/nip-04/` · `0x46.net/thoughts/2023/03/27/nostr-private-messages/` · `bitclawd.com/learn/nostr/dm/` · `rodsx.substack.com/p/private-messages-on-nostr-with-msl`
**Verdict: MEDIUM.** Consumer phrasing (`are nostr DMs private`, `are nostr DMs encrypted`) is far less defended than the `NIP-17` spec phrasing. You have `nip17-private-messages.mdx` but its title leads with the spec number — that targets the *harder* half of the cluster.

### Cluster M — audience/niche
Queries: `nostr for artists`, `nostr for musicians`, `nostr for photographers`
Only real incumbent found: `nostr.build/creators/`. Otherwise page 1 fills with generic Nostr explainers and even an off-topic Temple University copyright guide.
**Verdict: EASY but likely near-zero volume.** Your 8 landing pages (`src/pages/nostr-for-*.astro`) will win these trivially. Treat them as conversion/link assets, not traffic drivers.

---

## 4. Non-English markets — is there an underserved opportunity?

Wikipedia `Nostr` pageviews per language, 2025-07 → 2026-06:

| Lang | Range/mo | Article status | Multilingual competitor coverage |
|---|---|---|---|
| **en** | 4,440 – 9,600 | Mature | nostr.how, nostrcompass, usenostr, nostr.co.uk |
| **fr** | 211 – **1,494** | Mature, spiking (2026-03 = 1,494) | nostr.how/fr, nostrcompass/fr, usenostr/fr |
| **de** | 272 – **1,076** | Mature | nostr.how/de, nostrcompass/de |
| **pt** | 104 – 583 | Mature | nostr.how/pt, nostrcompass/pt, usenostr/pt |
| **ja** | 135 – 393 | Mature | nostr.how/ja, nostrcompass/ja, usenostr/ja |
| **es** | 130 – 448 | Mature | nostr.how/es, nostrcompass/es, usenostr/es |
| **pl** | 33 – 134 | **Created ~April 2026** | **NONE** |
| **ar** (نوستر) | 5 – 16 | Exists, dormant | **NONE** |
| **zh** | — | **NO ARTICLE EXISTS** (searched zh.wikipedia API for "Nostr": returns only unrelated pages) | nostr.how/zh, nostrcompass/zh |
| **hi** | — | **NO ARTICLE, ZERO SEARCH RESULTS** | **NONE** |

### Verdict per locale

**German (`de`) — BEST non-English bet.** Highest verified non-English demand after French. Incumbents are hobbyist and fragmented: `relayted.de/?page=nostr-intro` (a query-string URL — poor SEO), `freie-messenger.de/nostr/`, `hey-bitcoin.de/anleitung/nostr-dezentrale-twitter-alternative/`, `grooveix.com/nostr/nostr-faq/` and `/einstieg-in-nostr/`, `blocktrainer.de/blog/munstr-...`, plus a `forum.blocktrainer.de` thread. Notably, `nostr.how/de/guides/nostrchat` ranked for a *German account-creation* query — meaning Google is serving a niche NostrChat page because nothing better exists. There is a real German Bitcoin audience (Blocktrainer) and no German Nostr guide site.

**Spanish (`es`) — good, but real competition exists.** `nostrfacil.com` ("Nostr para Neófitos | Guía completa en español 2025"), `usenostr.org/es/`, `moneyonchain.com/que-es-nostr/`, `criptonoticias.com/tutoriales-guias/aprende-como-usar-nostr-red-social-descentralizada/`, `observatorioblockchain.com/...`, `bitcoin.ar/tutoriales/nostr/`, `habyb.com/es/blog/nostr-que-es-este-protocolo-y-como-funciona/`, plus Medium posts. LatAm Bitcoin adoption makes this bigger than the Wikipedia number implies. But `usenostr.org/es/` is a **two-page site** ranking page 1 — depth wins here easily.

**Polish (`pl`) — highest opportunity-to-effort ratio in the whole report.** No competitor site (nostr.how, nostrcompass, usenostr all lack `pl`) has any Polish content at all. The Polish SERP is: `spidersweb.pl/2022/12/czym-jest-nostr-twitter.html` (a *2022 news article*), `jaroslawwolski.com/czym-jest-nostr/` (personal blog), `nostr.com.pl/start.html` (no sitemap.xml, hand-built), `djp.pl/blog/nostr-przyszlosc-sieci-spolecznosciowych/` (**a law firm's blog**), `techacute.com/pl/...` (machine-translated), `jesterhodl.com/dlaczego-nostr-jest-wazny/`. A law firm blog ranking for a protocol query is the definition of a vacuum. Demand is small (pl.wikipedia article only created ~April 2026, running 33→134→121/mo) but **you can own 100% of it.** You also have a native-language advantage here.

**Chinese (`zh`) — DO NOT INVEST for search.** There is no zh.wikipedia Nostr article, which is itself telling. The zh content that exists is on `zhuanlan.zhihu.com/p/605691349`, `cloud.tencent.com/developer/article/2219698`, `learnblockchain.cn/article/5357`, `techflowpost.com/article/detail_14483.html`, `cnblogs.com`, `oschina.net` — all 2023-era, all on walled-garden Chinese platforms that Google indexes poorly and that Chinese users reach via Baidu/WeChat/Zhihu, not Google. Your `/zh/` locale will not get Google traffic. Keep it for direct/social visitors; do not build more.

**Arabic (`ar`) — near-zero verified demand.** The `نوستر` Wikipedia article gets **5–16 views/month**. My Arabic-language search returned only English results (`cointribune.com`, `usenostr.org`, `medium.com/@colaru`), confirming there is essentially no Arabic Nostr content *and* essentially no Arabic Nostr searching. Zero competition, but also close to zero demand. **Lowest priority.** (Caveat: Arabic speakers commonly search in English or French; I cannot rule out latent demand.)

**Hindi (`hi`) — no signal whatsoever.** No hi.wikipedia article, hi.wikipedia search for "Nostr" returns **zero results**, and my Hindi query returned an entirely English SERP plus a stray Japanese Damus article. India has huge crypto interest, but Nostr has not landed there in Hindi. **Speculative bet only.** Your `hi` locale (per the most recent commit, `c0e4922 feat: complete Hindi locale infrastructure`) is a long-dated option, not a near-term traffic source.

**Underserved-market summary:** Yes, but not where the locale roster suggests. **de and pl are underserved with real (if small) demand; es is underserved by depth; zh/ar/hi are underserved because nobody wants the content.** The three locales you most recently invested in (zh, ar, hi) are the three with the weakest verified search demand.

---

## 5. What nostrich.love currently has vs. what the SERP rewards

Live sitemap (`https://nostrich.love/sitemap-0.xml`, fetched 2026-07-27): **152 URLs**. Breakdown: 17 per locale × 7 locales = 119 guide URLs, plus 33 English-only pages.

**Three concrete structural problems this research exposes:**

1. **Every non-guide asset is English-only.** `/glossary/`, `/tools/`, `/resources/`, `/follow-pack/`, `/relay-feed-browser/`, `/twitter-bridge/`, `/badges/`, all 11 `/simulators/*` and all 8 `/nostr-for-*` pages appear **only** at unprefixed English URLs in the sitemap. Your 7-locale investment covers only the 16 MDX guides. Meanwhile `nostr.co.uk` (English-only) out-pages you 97-to-33 in English.

2. **Guide titles are branded, not query-matched.** Every one of the 16 guides is named for voice rather than for search:
   - `what-is-nostr.mdx:2` → `"Nostr Explained Simply"` (no head term)
   - `keys-and-security.mdx:2` → `"Your Keys, Your Identity"` (no `nsec`/`npub`/`private key`)
   - `relays-demystified.mdx:2` → `"How Posts Travel: Relays Explained"`
   - `zaps-and-lightning.mdx:2` → `"Zaps: Tips on Nostr"`
   - `troubleshooting.mdx:2` → `"Common Problems & Solutions"` (no "nostr" at all)
   - `nip05-identity.mdx:2` → `"Get Your Human-Readable Identity"` (no "NIP-05" in the title)
   
   Compare nostr.co.uk: `"How Nostr Works — Events, Relays & Keys Explained (12-Min Read)"`, `"Nostr FAQ — 58 Questions Answered (2026 UK Guide)"`. Ugly, but every one is a query string.

3. **Your best assets have no rankable URL.** The `<NIP05Checker />`, `<KeyGenerator />`, `<RelayExplorer />`, `<ZapSimulator />`, and `<TroubleshootingWizard />` components are embedded inside guide MDX. `nostrdeck.com/nip05-checker.php` — a bare PHP page — ranks for the tool query you could own. Tool-intent queries need dedicated URLs.

4. **The comparison content is mis-URLed.** `src/content/guides/en/protocol-comparison.mdx` is titled `"Nostr vs ActivityPub vs Bluesky: Complete Protocol Comparison"` — a good title on a bad URL (`/en/guides/protocol-comparison/`). The highest-upside cluster in this niche is being served from a slug nobody searches.

*(Also noted in passing, likely the technical-SEO agent's territory: both `/guides/` and `/en/guides/` are in the live sitemap, and `sitemap.xml` shows as deleted in git status while `sitemap-index.xml` is what `robots.txt` points to.)*

---

## 6. The 20 highest-opportunity keyword targets

Ranked by (demand × incumbent weakness × credibility for a beginner guide site). Demand tiers are relative, **not** verified volume.

| # | Target query | Intent | Demand | Incumbent strength | Why winnable — specific evidence | Suggested URL |
|---|---|---|---|---|---|---|
| 1 | `nostr vs bluesky` | Comparative | **High** (Bluesky = 7× Nostr Wikipedia demand) | Weak | Page 1 includes `slashdot.org/software/comparison/Bluesky-Social-vs-Mastodon-vs-nostr/` (auto-generated stub) and `kerivin.github.io/social-network-comparison/` (a GitHub Pages hobby project). You already own the content in `protocol-comparison.mdx`. | `/nostr-vs-bluesky/` |
| 2 | `how to use damus` / `damus tutorial` | How-to | Med-High | **Very weak** | Page 1 contains **four GitHub forks of the damus repo** plus a 2023 reclaimthenet post and its scraped mirror. You have a working Damus simulator at `/simulators/damus/` + `/damus-demo/`. | `/simulators/damus/` retitled + expanded |
| 3 | `nostr vs mastodon` | Comparative | Med-High (Mastodon = 2.5× Nostr) | Medium | Only `nostr.co.uk/learn/nostr-vs-mastodon/` and `soapbox.pub/blog/comparing-protocols` are purpose-built; rest is Medium/Slashdot. | `/nostr-vs-mastodon/` |
| 4 | `how to use amethyst nostr` | How-to | Medium | **Very weak** | Best result is `reclaimthenet.org/amethyst-nostr-social-media-app-android` from 2023, plus a SourceForge *mirror listing* and a GitHub fork. You have `/simulators/amethyst/`. | `/simulators/amethyst/` retitled |
| 5 | `primal nostr tutorial` / `how to use primal app` | How-to | Medium | **Very weak** | Page 1 = a Typefully thread, **two raw `nostr.com/nevent1q...` permalinks**, and YouTube. No article-format incumbent at all. | `/simulators/primal/` retitled |
| 6 | `nostr vs twitter` / `nostr vs x` | Comparative | Medium | Medium | `nostr.co.uk/learn/nostr-vs-twitter/` plus `slashdot.org/software/comparison/X-vs-nostr/`, `sourceforge.net/software/product/X/alternatives`, `producthunt.com/products/nostr/alternatives`, and Forbes 2022. Three of five are programmatic directory pages. | `/nostr-vs-twitter/` |
| 7 | `what happens if I lose my nsec` / `recover nostr account` | Problem | Medium | Medium | High-urgency intent. `soapbox.pub/blog/managing-nostr-keys/` and `guides.getalby.com/.../i-lost-my-nostr-id-when-making-a-new-account` lead. You have `<BackupChecklist />` in `keys-and-security.mdx` — reframe as a recovery/prevention page. | `/en/guides/lost-nostr-key/` |
| 8 | `nip05 checker` / `check nip-05` | Tool | Medium | **Weak** | `nostrdeck.com/nip05-checker.php` — a bare PHP page — is the leading tool. You ship a working `<NIP05Checker />` component with no standalone URL. | `/tools/nip05-checker/` |
| 9 | `co to jest nostr` / `nostr jak zacząć` (PL) | Info | Low-Med | **Near zero** | Polish SERP = a 2022 spidersweb.pl news post, a personal blog, and **a law firm's blog** (`djp.pl`). No competitor site has any `pl` locale. You have a full `pl` build. | `/pl/guides/what-is-nostr/` + `/pl/` hub |
| 10 | `was ist nostr` / `Nostr Konto erstellen` (DE) | Info/How-to | **Med** (272–1,076/mo Wikipedia) | Weak | Incumbents: `relayted.de/?page=nostr-intro` (query-string URL), `freie-messenger.de/nostr/`, `grooveix.com/nostr/einstieg-in-nostr/`, a Blocktrainer *forum thread*. Google is even serving `nostr.how/de/guides/nostrchat` for account-creation queries. | `/de/guides/what-is-nostr/`, `/de/guides/quickstart/` |
| 11 | `how to find people to follow on nostr` | How-to | Medium | **Weak** | Page 1 = `github.com/pseudozach/nostr.directory` (a README), `nosta.me/create/follow`, a Medium post, a YouTube video. You have `/follow-pack/`, `/twitter-bridge/`, and `finding-community.mdx`. | `/follow-pack/` retitled |
| 12 | `is nostr safe` / `is nostr anonymous` | Trust | Medium | Medium | `bitcoinmagazine.com/technical/how-nostr-can-improve-bitcoin-privacy` and `nostr.co.uk/learn/privacy-on-nostr/` lead, but `alternativeto.net` and `sourceforge.net` also surface — thin. You have `privacy-security.mdx` + `/nostr-for-privacy/`. | `/en/guides/is-nostr-safe/` |
| 13 | `nostr key generator` / `generate nostr keys` | Tool | Low-Med | **Weak** | `nostrtool.com` and `krisconstable.com/generating-a-key-pair-with-nostr` (personal blog). You have a `<KeyGenerator />` buried in a guide. | `/tools/key-generator/` |
| 14 | `nostr wallet connect` / `connect lightning wallet to nostr` | How-to | Medium | **Weak for consumers** | Page 1 is `github.com/getAlby/nostr-wallet-connect`, `nips.nostr.com/47`, and a 2023 Bitcoin Magazine piece. **Nobody has written a plain-English NWC walkthrough.** Lightning Network demand ≈ Nostr demand. | `/en/guides/nostr-wallet-connect/` |
| 15 | `are nostr DMs private` / `nostr encrypted messages` | Trust/How-to | Low-Med | Weak (consumer phrasing) | Spec-phrasing (`NIP-17`) is held by `nostrcompass.org/en/topics/nip-17/` and `nips.nostr.com/17`, but consumer phrasing is unclaimed. Your `nip17-private-messages.mdx` currently targets the harder half. | `/en/guides/are-nostr-dms-private/` |
| 16 | `qué es nostr` / `cómo usar nostr` (ES) | Info | Low-Med | Weak-Medium | `usenostr.org/es/` — a **two-page** site — ranks page 1. `nostrfacil.com` has no sitemap.xml. Depth wins. You have a full `es` build. | `/es/guides/what-is-nostr/` |
| 17 | `nostr glossary` / `npub nsec meaning` | Reference | Low-Med | Medium | `nostr.co.uk/glossary/` and `learnnostr.org/definitions` lead. You have `/glossary/` — but English-only, while your 7-locale infrastructure sits unused for it. Localized glossaries face **zero** competition in pl/de. | `/glossary/` + `/de/glossary/`, `/pl/glossary/`, `/es/glossary/` |
| 18 | `nostr feed empty` / `nostr posts not showing` | Problem | **Low (unverified)** | **Zero** | Page 1 for this query returns Facebook and Instagram troubleshooting articles and Goodreads spam — **not a single Nostr result.** Total vacuum, but demand is unproven. You have `troubleshooting.mdx` + `<TroubleshootingWizard />`. | `/en/guides/nostr-feed-empty/` |
| 19 | `try nostr without an account` / `nostr demo` | Exploratory | **Low (unverified)** | **Zero** | Page 1 returned a 2023 Forbes article, `github.com/supertestnet/nostr-workshop-demo`, and **two unrelated App Store CFD trading simulators**. You have 10 working client simulators — a genuinely differentiated asset nobody else has. | `/simulators/` retitled |
| 20 | `best nostr client for iphone` / `for android` | Commercial | Medium | Weak but noisy | The generic `best nostr client 2026` is flooded by AI listicle farms (`humai.blog`, `webvator.com`, `reviewnexa.com`). The **device-qualified** long tail is far cleaner and matches your per-platform simulators. | `/en/guides/best-nostr-client-iphone/`, `.../android/` |

**Deliberately excluded** (verified as bad bets): the head term `nostr` (Wikipedia + nostr.com + GitHub); individual NIP reference pages (`nips.nostr.com` is canonical, plus nostr.co.uk's 28 and nostrcompass's ~50); `best nostr client 2026` unqualified (four AI content farms refreshing annually); any Chinese/Arabic/Hindi keyword target (near-zero verified demand — see §4); `run your own nostr relay` (developer intent, wrong audience for a beginner site).

---

## 7. Format patterns that actually win in this niche

Grounded in the SERPs above:

- **Year in title/URL is decisive for listicles.** `nostr.co.uk/best-nostr-clients-2026/`, `best-nostr-relays-2026/`, `humai.blog/best-nostr-apps-2026-...`, `fediview.com/articles/mastodon-vs-bluesky-vs-nostr-2026/`. Every listicle on page 1 carries "2026."
- **Read-time and count promises in titles.** `"10-Minute Beginner's Guide"`, `"12-Min Read"`, `"58 Questions Answered"`. nostr.co.uk uses this on nearly every page.
- **Exact-match topical URL slugs beat clever ones.** `/learn/nostr-relays-explained/` outranks better-written content on vaguer slugs.
- **YouTube ranks in exactly two clusters:** account creation and per-client tutorials (`watch?v=kifwECtwjJQ`, `watch?v=Kuqs4bYGEEk`, `watch?v=Qd4Po4i7wvc`, `watch?v=3Ah_7HWUt00`). Nowhere else.
- **Reddit is absent from every Nostr SERP I ran.** Question-intent queries are winnable with structured FAQ content — a structural advantage this niche has over almost every other consumer topic in 2026.
- **Raw spec pages and GitHub READMEs ranking = an unwritten article.** I saw this for NIP-47 (NWC), NIP-57 (zaps), NIP-17 (DMs), and nostr.directory (follow discovery). Each is a direct content brief.
- **Wikipedia is the ceiling on the head term but not on the long tail.** It appeared for `what is nostr` and `best nostr relays` — but for nothing in clusters D, J, K, or L.

=====================

# Growth Mechanics Audit — nostrich.love

Read-only audit. Every claim below is anchored to a file I opened. Where I could not verify something (external service behavior, third-party stats) it is flagged inline.

---

## 0. TL;DR — ranked by expected traffic per unit effort

| # | Loop | Effort | Ceiling | Why this rank |
|---|---|---|---|---|
| 1 | **Fix the broken share surface** (njump share link, dead `#client-recommender` anchor, invalid `nostr:` URIs, one shared OG image for 154 pages) | 1–2 d | — | Zero new features. Three of the four existing share/viral affordances are non-functional. This is the denominator of every loop below. |
| 2 | **Per-tool + per-simulator canonical URLs + `/embed/*` routes** | 3–5 d | High | 10 simulators and 4 tools currently have no shareable/embeddable unit. Simulators are the site's most linkable asset and are trapped behind `h-[calc(100vh-4rem)]` sidebar shells. |
| 3 | **Open data: `/data/clients.json`, `/data/accounts.json`, `/data/relays.json` + CC-BY attribution** | 2–3 d | High, compounding | 542 curated accounts already exist in `src/data/follow-pack/accounts.ts`. Nobody else has this dataset structured. Backlinks are the only durable SEO moat here. |
| 4 | **NIP-07 "share to Nostr" + "publish your first real note"** | 4–6 d | Medium-high | Site has `nostr-tools` and publishes to relays already, but **zero** `window.nostr` support. This is the only *reliable* share-to-Nostr mechanism (see §5.1 — there is no standardized web intent). |
| 5 | **Follow-pack: stop using burner keys, add `r`-tag attribution + njump permalink** | 2 d | Medium | The NIP-51 kind:39089 publish already works. It's just anonymous and unattributed, so it generates zero referral. |
| 6 | **RSS + NIP-23 (kind 30023) syndication of guides into Nostr** | 3–4 d | Medium | 112 guide pages × 7 locales currently have no feed of any kind. |
| 7 | **Dynamic OG images per guide/tool/quiz result** | 3–4 d | Medium | Currently one 1.18 MB image for every page. |
| 8 | **Shareable quiz / recommender result artifacts** | 5–8 d | Low-medium | 13 quizzes have no share surface and no i18n keys for one. Requires 7-locale string work. |
| 9 | **npub / email capture** | 2 d | Low | Justified only after 1–5 exist; there's currently nothing to retain people *for*. |

**The honest framing:** Nostr's total addressable audience is small. [Profilestr's July 2026 report](https://profilestr.com/reports) shows ~3k DAU / ~10.2k MAU in its tracked cohort; [stats.nostr.band](https://stats.nostr.band/) has historically reported ~17k DAU. Both figures are sampled and disputed — treat them as order-of-magnitude only. **Consequence: pure Nostr-internal virality has a ceiling in the low thousands of referrals/month at best.** The compounding growth for this site comes from (a) SEO/backlinks from *outside* Nostr, (b) partner distribution into Nostr clients' own onboarding, and (c) being the thing Nostr people link when a normie asks "what is this." Rank the loops accordingly — I have.

---

## 1. What actually exists today (verified inventory)

**Routes:** 36 page source files in `src/pages/` → 154 built HTML files in the stale `dist/`. 16 guides × 7 locales via `src/pages/[...lang]/guides/[slug].astro`, 10 simulator pages, 8 audience landing pages, `/tools`, `/follow-pack`, `/twitter-bridge`, `/relay-feed-browser`, `/glossary`, `/resources`, `/badges`, `/progress`.

**Real Nostr write path already shipped:** `src/components/follow-pack/ExportModal.tsx` genuinely signs and publishes a NIP-51 kind:39089 starter pack to three relays over raw WebSocket (`ExportModal.tsx:23-27`, `:130`, `:165-230`), then `naddrEncode`s it with up to two relay hints (`:258-264`) and verifies it landed (`:326-330`). NIP-51 kind 39089 is confirmed correct — [NIP-51](https://github.com/nostr-protocol/nips/blob/master/51.md) defines 39089 as "a named set of profiles to be shared around with the goal of being followed together."

**Curated dataset:** `src/data/follow-pack/accounts.ts` — 7,527 lines, 542 account entries with `npub`, `name`, `picture`, `bio`, `categories`, `nip05`, `lud16`, `activity`, `contentTypes`. 16 categories in `src/data/follow-pack/categories.ts` (jumpstart, artists, photography, musicians, permaculture, parents, christians, foodies, mystics, cool_people, sovereign, legit, niche, merchants, doomscrolling, books). Header comment says `Last Updated: 2026-02-12` — five months stale as of today.

**Live Nostr identity:** `public/.well-known/nostr.json` maps `_` → `0e97a44a…b19d` = `npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl`. Verified live and served at `https://nostrich.love/.well-known/nostr.json`. The account exists on Nostr ("Nostrich.Love", nip05 `nostrich.love`) — **but its most recent note is 2026-04-16** ("Hindi guides translation later today"). ~3.5 months dormant.

**Analytics:** exactly one beacon — Cloudflare Web Analytics at `src/layouts/Layout.astro:141-143`, token hardcoded at `src/config/site.ts:27`. A Plausible snippet sits commented out at `Layout.astro:146`. A grep across all of `src/` for `gtag|dataLayer|plausible|umami|posthog|track(|trackEvent` returns **zero** call sites. There is no event instrumentation of any kind.

---

## 2. Broken / dead growth surface — fix before building anything

These are not "improvements." They are things that exist, are linked, and do not work.

### 2.1 CRITICAL — the only "Share on Nostr" button on the site does nothing useful
`src/components/ui/SocialShare.astro:21`:
```js
const nostrShareUrl = `https://njump.me/?url=${encodedUrl}`;
```
I fetched `https://njump.me/?url=https%3A%2F%2Fnostrich.love`. It returns the **njump marketing homepage** (first heading: "NOSTR IS A PROTOCOL"). It is not a compose screen and the URL is not prefilled anywhere. njump is an event *viewer* (`/npub…`, `/note…`, `/naddr…`), not a share intent.

This component is rendered exactly once, at `src/components/layout/Footer.astro:71` — so the site's single Nostr-share affordance is site-wide, below the fold, and broken.

### 2.2 CRITICAL — `nostr:` URIs in two QR flows are invalid per NIP-21
- `src/components/follow-pack/ExportModal.tsx:410` → `nostr:list?d=${base64Data}`
- `src/components/twitter-bridge/FollowPackGenerator.tsx:57` → `nostr:followpack?d=${base64Data}`

[NIP-21](https://github.com/nostr-protocol/nips/blob/master/21.md) permits only NIP-19 bech32 entities after `nostr:` (npub/nprofile/nevent/naddr; not nsec). `list?d=` and `followpack?d=` will not resolve in any client. In `ExportModal` this is only the pre-publish fallback (the happy path at `:402` correctly emits `nostr:${naddr}`), but in `FollowPackGenerator` it is the **only** output — the entire Twitter-Bridge → follow-pack handoff produces an unscannable QR.

### 2.3 HIGH — the most viral-shaped artifact on the site is orphaned
`src/components/layout/Header.astro:23` puts **"Client Recommender" → `/tools#client-recommender`** in the main nav dropdown.

`src/pages/tools.astro:9-45` defines exactly five tool ids: `key-generator`, `follow-pack-finder`, `nip05-checker`, `relay-playground`, `client-simulators`. There is no `client-recommender` id, and `ClientRecommender` is not imported on that page (`tools.astro:5`). The 726-line `src/components/interactive/ClientRecommender.tsx` is imported only in `src/pages/[...lang]/guides/[slug].astro:27,185` for MDX use — and a grep across `src/content/` finds **zero** MDX files that use it.

So: a fully built "which Nostr client fits you" quiz, the single highest-shareability object in the codebase, is reachable from nowhere. The nav link scrolls to nothing.

### 2.4 HIGH — one OG image for all 154 pages, and it's 1.18 MB
`src/components/SEO.astro:32` always falls back to `siteConfig.seo.defaultImage`, and no page in `src/pages/` passes an `image` prop. Every guide, every simulator, every landing page shares `public/preview_image.png` — **2880×1368, 1,184,543 bytes**.

Separately, `public/og-image.png` is **194 bytes of ASCII/SGML text, not a PNG** (`file` reports "exported SGML document text"). It's unreferenced, but it's a landmine.

Also unverified: `src/components/SEO.astro:102-103` hardcodes `twitter:site`/`twitter:creator` = `@nostrichlove`. I did not confirm that account exists. If it doesn't, the card renders without attribution.

### 2.5 MEDIUM — site search was never wired up
`pagefind@^1.4.0` is in `package.json:31`. Zero references anywhere in `src/`. The build script is `"build": "astro build"` (`package.json:7`) — Pagefind's indexer is never invoked. There is no search UI component. A 112-guide multilingual site with no internal search leaks a lot of session depth.

### 2.6 MEDIUM — dead NIP-58 badge code that would be dangerous if wired up
`src/utils/gamification.ts:920` `publishBadgeToNostr(badgeId, npub, privateKeyHex)` builds a kind:8 award and signs it. Zero callers outside the module (verified grep across `src/`). The badge URIs at `:894-903` (`nostr:badges:key-master:nostrich-love`) are also not valid NIP-21 or valid NIP-58 `a`-tag references. Note the signature takes the **user's private key** — if anyone ever wires this to the badge modal, the site starts touching nsec. Don't. Use NIP-07 (§4.4).

### 2.7 LOW — `/damus-demo` duplicates `/simulators/damus`
`src/pages/damus-demo.astro` renders the same `DamusSimulator` with a different, thinner shell and its own title/description. Two URLs, one asset, split link equity.

---

## 3. The loops, in detail

### Loop 1 — Embeddable simulators (highest ROI new build)

**What's there.** `src/simulators/` has 10 fully built client simulations (damus, primal, amethyst, coracle, gossip, keychat, nostr-kitten, olas, snort, yakihonne), each with its own screens directory. Each has a page like `src/pages/simulators/damus.astro`, which wraps it in `<SimulatorSidebar>` + `<MobilePhoneFrame>` inside `flex h-[calc(100vh-4rem)]` (`damus.astro:22-40`).

**Why it doesn't spread.** That layout is unusable in an iframe: fixed viewport math, a site header, a nav sidebar. There is no chrome-free route. `vercel.json` sets no headers at all — so nothing *blocks* framing today, but there's also no CORS/embed policy and nothing worth framing.

**Mechanism.** Ship `src/pages/embed/simulators/[client].astro` — no Header, no Footer, no sidebar, `100%` height, a single "Powered by nostrich.love" link with `?ref=embed&host=<referrer-host>`. Then give each simulator page a copy-paste snippet block. The audience is concrete: the client projects themselves (damus.io, primal.net, coracle.social, yakihonne.com all have marketing sites with no interactive demo), Nostr directories, and every "what is Nostr" blog post.

**Coefficient.** Not viral in the k>1 sense — it's a **distribution partnership loop**. Realistic target: 5–15 embedding sites in 6 months. Value is disproportionately in **dofollow backlinks from high-authority Nostr domains**, which is the one thing that moves 112 multilingual guide pages in search. The referral traffic is a bonus.

**Effort.** 3–5 dev-days: one embed layout, a `getStaticPaths` over `src/simulators/shared/configs`, a snippet-generator UI, `X-Frame-Options`/`Content-Security-Policy: frame-ancestors` decisions in `vercel.json`.

**Measurement.** Referrer breakdown (CF Web Analytics gives you this) + `?ref=` param on the outbound backlink. Add a `/embed/*` path Rule in the CF dashboard so embed loads don't pollute the main funnel.

**Prerequisite.** Per-simulator canonical URLs already exist — good. But `/damus-demo` (§2.7) must 301 to `/simulators/damus` first.

---

### Loop 2 — Open data API (the compounding one)

**What's there.** Three genuinely valuable, hand-curated datasets, all locked inside TypeScript modules:
- `src/data/follow-pack/accounts.ts` — 542 accounts × 16 categories, with bio/nip05/lud16/activity/contentTypes. **Nothing else in the ecosystem has this shape.**
- `src/data/relay-browsing-clients.ts` — clients tagged by relay-browsing capability (jumble, gossip, coracle, wisp…), which is a distinction nobody else tracks.
- Client comparison data, currently inlined in two places that will drift: `src/components/interactive/ClientComparisonTable.tsx:97` (inside a `useMemo`) and `src/components/interactive/ClientRecommender.tsx:55+` (a module-level `CLIENTS` const with pros/cons/ratings/store URLs).

**Competitive gap.** [api.nostr.watch](https://api.nostr.watch/) serves relay data. [nostrapps.com](https://nostrapps.com/) and [nostorg.github.io/clients](https://nostorg.github.io/clients/) list clients. **Nobody publishes a categorized, human-curated npub directory as machine-readable JSON.** That's the wedge.

**Mechanism.** Astro `output: "static"` supports static file endpoints — `src/pages/data/accounts.json.ts` with `export const GET` prerenders at build. Ship:
- `/data/accounts.json` — the 542, with `"source": "https://nostrich.love/follow-pack"` and `"license": "CC-BY-4.0"` in the envelope
- `/data/clients.json` — deduplicate the two inline arrays into `src/data/clients.ts` first, then serve it
- `/data/relays.json` — but `src/data/topical-relays.ts` currently has **six** entries; this needs to grow to ~50 before it's worth publishing

Add `Access-Control-Allow-Origin: *` for `/data/*` via `vercel.json` `headers` (the file currently has only `redirects`). Attribution requirement is the loop: consumers must link back.

**Coefficient.** Slow but permanent. 3–10 consumers in year one; each is a durable backlink and a "data by nostrich.love" credit. This is the highest-leverage *SEO* action available, more than any content work.

**Effort.** 2–3 dev-days for the endpoints + a `/data` documentation page. Add ~1 day to consolidate the duplicated client arrays (which you want anyway — they will drift).

**Measurement.** Vercel request logs by path + referrer. Ahrefs/Search Console for referring domains. This is the one loop where the metric is *backlinks*, not sessions.

---

### Loop 3 — Share to Nostr, done correctly (NIP-07)

**Hard constraint, verified.** There is **no standardized share-to-Nostr web intent.** [NIP-0077 (nostr-share deeplink/URI scheme)](https://github.com/nostr-protocol/nips/pull/491) was closed on 2025-08-01 by vitorpamplona: *"Closing due to inactivity. The idea is needed but this doesn't seem to address all the requirements."* Per-client compose URLs (`primal.net/new?content=`, `nostrudel.ninja/#/notes/new?content=`) — **I could not verify any of these**; GitHub code search requires auth and no client documents them. Do not ship a share button built on an unverified compose URL. That's exactly how §2.1 happened.

**The reliable path is NIP-07.** `src/` contains **zero** `window.nostr` references (the only grep hit is a mock note string at `src/data/mock/notes.ts:47`). Meanwhile `nostr-tools` is already a dependency and already used for signing in `ExportModal.tsx:3` and `KeyGenerator.tsx:17`. Per [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md), `window.nostr.getPublicKey()` and `window.nostr.signEvent(event)` are implemented by [nos2x](https://github.com/fiatjaf/nos2x), nos2x-fox, and Alby.

**Mechanism — three-tier share, in this order:**
1. `window.nostr` present → build a kind:1, `signEvent`, publish over the same WebSocket path `ExportModal.tsx:165-230` already implements. Show the resulting `nevent` and an `https://njump.me/<nevent>` permalink.
2. No extension → copy prefilled text to clipboard + "paste this in your client" (this is what `BadgeEarnedModal.tsx:111-117` already does, minus the URL). Honest and always works.
3. `navigator.share()` on mobile for the OS sheet.

**Where to put it.** Every guide footer, quiz completion, `KeyGenerator` completion, `BadgeEarnedModal`, follow-pack export.

**Coefficient.** NIP-07 extension penetration among *beginners* — the exact audience of this site — is low; most arrive with no keys at all. Realistic: **5–12% of completions produce a note**, and each note reaches the author's followers, which for a brand-new npub is ~0. Real k is likely **0.02–0.08**. Not self-sustaining. But every note is a permanent, indexable, njump-rendered artifact naming the site, and existing Nostr users who share hit real audiences.

**Effort.** 4–6 dev-days including the three-tier fallback and relay publish/verify UX. Plus 7-locale string work (see the i18n note in §6).

**Measurement.** Client-side custom events (`share_intent`, `share_signed`, `share_published`) — **which Cloudflare cannot record** (§5). And a Nostr-side counter: query relays for kind:1 events containing `nostrich.love` and count them weekly. That second one is a real, cheap, privacy-clean growth metric nobody else can fake.

---

### Loop 4 — Follow packs as the viral primitive (fix, don't build)

**What's there.** The publish flow works. What kills the loop:

1. **Burner keys.** `ExportModal.tsx:118-125` generates a throwaway `generateSecretKey()` per publish. The kind:39089 is therefore authored by a pubkey with no kind:0 profile. In any client, the pack renders as an unnamed nobody's list. Zero attribution, zero trust, zero referral.
2. **No link back.** The description at `ExportModal.tsx:135` says "…from nostrich.love" in prose, but the event carries no `r` tag with the URL and no `t` tag. Nothing machine-readable points home.
3. **No web permalink.** The UI shows the raw `naddr` (`ExportModal.tsx:787-788`, `:858-862`) and a `nostr:` QR. There is no `https://njump.me/<naddr>` link — so the artifact is unshareable to anyone not already in a Nostr client. *(njump's naddr rendering is high-confidence but I did not verify it with a live naddr.)*
4. **Only 3 relays,** all US-centric: `relay.damus.io`, `nos.lol`, `nostr.mom` (`ExportModal.tsx:23-27`). Serial `await` in a `for` loop (`:161`) means up to 8 s timeout × 3 = 24 s worst case.

**Mechanism.** (a) Sign with the **site's own npub** `npub1p6t6gj…3cpeyl` — packs then carry a verified, NIP-05'd, followable author, and each pack becomes an inbound follow for the site's account. Requires the signing key server-side or a small signing endpoint; the alternative is NIP-07 so the *user* authors their own pack, which is better for the user but worse for attribution. Offer both. (b) Add `['r', 'https://nostrich.love/follow-pack']` and `['t', 'starterpack']` tags. (c) Surface the njump permalink as the primary share output. (d) Parallelize relay publish with `Promise.allSettled` and add 3–4 relays outside the US.

**Coefficient.** Starter packs are one of the few *natively* viral objects on Nostr — they get reshared and imported. If the pack is authored by a real, followable account with a website tag, realistic k ≈ **0.1–0.3** per pack created. Low absolute volume, but each conversion is a genuine Nostr user.

**Effort.** 2 dev-days for (b)(c)(d); +1–2 for the signing decision in (a).

**Measurement.** Query the three relays for kind:39089 with `#t: ['starterpack']` and author = site npub; count packs, and count reshares/imports where observable. Referrals land as njump.me referrer traffic.

---

### Loop 5 — RSS + NIP-23 syndication

**What's there.** Nothing. `find src public -iname "*rss*" -o -iname "*feed*"` returns only relay-feed-browser UI components. No `src/pages/rss.xml.ts`. `@astrojs/rss` is not in `package.json`.

**What's ready.** `src/content/config.ts` already has `title`, `description`, `updated`, `category`, `tags`, `estimatedTime` on every guide. That's a complete feed item.

**Mechanism.**
- `/rss.xml` per locale (7 feeds) from the `guides` collection. Trivial with `@astrojs/rss`.
- **NIP-23:** publish each guide as a kind:30023 long-form event from the site npub, with `d` = slug, `title`, `summary`, `published_at`, `t` tags, and an `r` tag back to the canonical URL. The full text lives on Nostr; njump renders it as a readable article; every Nostr long-form reader (Yakihonne, Habla, Highlighter) surfaces it. Content is already Markdown — but MDX with `client:load` components (e.g. `<WhatIsNostrQuiz client:load />` at `what-is-nostr.mdx`) must be stripped or replaced with a "try the interactive version →" link. That link is the loop.

**Coefficient.** Long-form Nostr readership is small but the *right* people. This is a credibility/authority play more than a volume play. It also makes the site npub's dormancy problem (last note 2026-04-16) solve itself.

**Effort.** RSS: 0.5 d. NIP-23 pipeline (MDX→Markdown sanitizer, event builder, publish script, idempotency via `d` tag): 3 d.

**Measurement.** Relay query for the site's kind:30023 events + reactions/zaps/reposts on them. njump referrer traffic.

---

### Loop 6 — Dynamic OG images

**Mechanism.** Astro static + `satori`/`@vercel/og` at build time. Per-guide cards (title + category + read time + locale), per-simulator cards (client logo + "try it in your browser"), per-quiz-result cards. Pass `image` through the already-existing `SEO.astro` prop (`SEO.astro:14, 32` — the plumbing is there, nothing uses it).

**Why it matters here specifically.** Every Nostr client renders OG previews inline for pasted links. Right now a link to `/guides/zaps-and-lightning` and a link to `/simulators/gossip` render **the same 1.18 MB image** in every Damus/Primal/Amethyst timeline. That is a per-share CTR tax on all of loops 3, 4, and 5.

**Effort.** 3–4 d (7 locales, RTL for `ar`, font subsetting).

**Measurement.** CTR on shared links — requires custom events (§5).

---

### Loop 7 — Shareable quiz + recommender results

**What's there.** 13 quizzes in `src/components/interactive/*Quiz.tsx`, each wired into a guide MDX (e.g. `what-is-nostr.mdx:250`, `relay-guide.mdx:582`). All compute a score (`WhatIsNostrQuiz.tsx:73`, `:140`, `:182-198`). **None has a share button** — grep for `share` across all 13 returns 0 in 11 of them and 2 incidental hits in the other two. A walk of all 126 KB of `src/i18n/locales/en.json` finds **no share-related UI keys at all**; the only near-hit is `ui.quiz.perfectScore` = *"Share your knowledge—help onboard someone new."* — copy that asks for a share with no button attached.

**Mechanism.** Encode result state in the URL (`/tools/client-recommender?d=ios,easy,wallet`), render a matching dynamic OG card, add the three-tier share from Loop 3. **Do the ClientRecommender first** — "Which Nostr client is right for you? → Damus" is a far better share object than "I got 5/5 on the relay quiz," and fixing §2.3 is a prerequisite anyway.

**Why it's ranked low.** Every string needs 7 locales (`ar.json`, `de.json`, `en.json`, `es.json`, `hi.json`, `pl.json`, `zh.json` — 68 KB–140 KB each). Quiz-score shares have poor real-world share rates outside big consumer audiences, and this audience is small. Do it after loops 1–5 exist.

**Effort.** 5–8 d including i18n and OG cards.

---

### Loop 8 — npub / email capture

Nothing exists. All state is `localStorage` (`Layout.astro:161-248`, key `nostrich-gamification-v1`) — so a user who switches devices loses their badges, streak, and progress entirely.

**The Nostr-native version is better than email:** let a user sign in with NIP-07 and store progress as a NIP-78 app-specific data event (kind 30078) on relays. Progress becomes portable, the site never holds a database, and the privacy promise at `src/pages/about.astro:77` ("No tracking, no cookies, no data collection") stays literally true. That is a differentiator no other educational site can copy.

Email capture would require a backend the site doesn't have (`output: "static"`, `adapter: undefined` in `astro.config.mjs:16-17`) and would directly contradict the stated promise. **Skip email.** Effort for the NIP-78 version: 2–3 d, and it depends on Loop 3's NIP-07 work.

---

## 4. Analytics — what a growth program actually needs

### 4.1 What you have and its hard limits

`src/layouts/Layout.astro:141-143` + `src/config/site.ts:26-29`. Cloudflare Web Analytics gives pageviews, referrers, country, device. Per [Cloudflare's own docs](https://developers.cloudflare.com/web-analytics/) and third-party comparisons, it has:

- **No custom events.** You cannot record "generated a key," "completed a quiz," "exported a follow pack," "clicked share." Every loop above is therefore unmeasurable today.
- **Heavy sampling.** For windows longer than 24 h, reporting is estimated from a 1–10% sample. Fine for traffic trends, useless for conversion rates on a site with a few thousand sessions.
- **6-month retention.** You cannot compare this quarter to last year.
- No funnels, no UTM breakdown, no outbound-link tracking.

That is a *traffic counter*, not a growth instrument. *(Sampling and retention figures are from [Plausible's comparison page](https://plausible.io/vs-cloudflare-web-analytics) and [Swetrix](https://swetrix.com/comparison/cloudflare-analytics/vs-google-analytics); Cloudflare's own docs don't state them plainly — treat as high-confidence but second-hand.)*

### 4.2 What to add without breaking the privacy promise

`src/pages/about.astro:77` says: *"No tracking, no cookies, no data collection. We use privacy-friendly analytics."* And `Footer.astro:66`: *"Keys generated in your browser. Nothing is stored on our servers."* Both are currently true and are load-bearing for a site whose entire subject is self-sovereignty. Anything that breaks them is a net loss regardless of what it measures.

**Recommended: self-hosted Plausible Community Edition.**
- Cookieless, no persistent identifier, GDPR/CCPA/PECR-compliant without a consent banner (which matters — the site has no banner and shouldn't need one).
- Custom event goals via `plausible('EventName')` or the `plausible-event-name=` CSS class ([docs](https://plausible.io/docs/custom-event-goals)).
- Self-hosted = the data never leaves infrastructure you control, which is a *stronger* claim than "we use a privacy-friendly vendor."
- The snippet is already sitting commented out at `Layout.astro:146`. It was clearly considered and dropped.

Keep the Cloudflare beacon in parallel for six weeks to sanity-check the numbers, then decide.

**Minimum event schema** (no PII, no per-user IDs, no free text):

| Event | Fires from |
|---|---|
| `key_generated` | `src/components/interactive/KeyGenerator.tsx` |
| `guide_completed` (prop: slug, locale) | `src/components/navigation/GuideCompletionIndicator.tsx` |
| `quiz_completed` (props: quiz id, band not exact score) | the 13 `*Quiz.tsx` |
| `recommender_completed` (prop: recommended client) | `ClientRecommender.tsx` — after §2.3 is fixed |
| `followpack_exported` / `followpack_published` (prop: relay success count) | `ExportModal.tsx:247-268` |
| `share_intent` / `share_signed` / `share_published` (prop: surface) | new share component |
| `outbound_client` (prop: client name) | `ClientRecommender.tsx:460-471`, `ClientComparisonTable.tsx` |
| `simulator_started` (prop: client) | `src/pages/simulators/*.astro` |
| `embed_loaded` (prop: referrer host) | new `/embed/*` route |

**Nostr-side metrics — free, and unavailable to competitors.** Run a weekly script (you already have `scripts/fetch-nostr-accounts.js` per `package.json:9` as precedent) that queries relays for:
- kind:1 events whose content contains `nostrich.love` → organic mention volume
- kind:39089 events with `['t','starterpack']` authored by the site npub → packs created and reshared
- kind:30023 events by the site npub → syndicated guides, plus reactions/zaps/reposts on each
- follower count on `npub1p6t6gj…3cpeyl` → the closest thing to a real subscriber list

**Outbound-referral attribution.** Every external link to a client (`ClientRecommender.tsx:460-471`, `ClientComparisonTable.tsx`, `relay-browsing-clients.ts`) should carry `?ref=nostrichlove`. Costs nothing, and it's the negotiating leverage for the embed partnerships in Loop 1: *"we sent you N installs last quarter, put our simulator on your download page."*

### 4.3 What NOT to do
No GA4, no Segment, no session recording, no Meta/X pixels. On this site those would be a strategic own-goal — the audience is precisely the cohort that checks.

---

## 5. Cross-cutting constraints found in the code

**5.1 No share intent standard exists.** Covered in Loop 3. Build NIP-07 + clipboard, never an unverified compose URL.

**5.2 Static output blocks server-side loops.** `astro.config.mjs:16-17` — `output: "static"`, `adapter: undefined`. Static file endpoints (`*.json.ts`) work. Anything needing a request handler (email capture, server-signed events, per-share redirect tracking) needs a Vercel adapter or a separate function. Loops 1, 2, 5, 6 all work as-is; Loop 4's site-signing and Loop 8's email do not.

**5.3 Every user-facing string is a 7× cost.** `src/i18n/locales/` — `ar.json` 68 KB, `de.json` 140 KB, `en.json` 127 KB, `es.json` 125 KB, `hi.json` 74 KB, `pl.json` 126 KB, `zh.json` 112 KB. `ar` is RTL (`tailwindcss-rtl` in devDependencies). Any new share/CTA copy multiplies by seven and needs RTL-safe layout. This is the main reason Loop 7 ranks below Loop 5.

**5.4 The site's own Nostr account is dormant.** Last note 2026-04-16, verified via njump. Loops 3, 4 and 5 all funnel value *to* that account. Reviving it (even at one post/week) is a precondition, not a nice-to-have. Loop 5's NIP-23 pipeline is the cheapest way to make it automatic.

**5.5 The curated dataset is going stale.** `accounts.ts:3` — `Last Updated: 2026-02-12`. Five months. Dead/renamed npubs in a follow pack are the fastest way to lose trust in the site's core differentiator, and a stale `/data/accounts.json` (Loop 2) would be worse than none. `scripts/fetch-nostr-accounts.js` exists — schedule it.

---

## 6. Suggested sequencing

**Weeks 1–2 (unblock).** Fix §2.1 njump share → clipboard + `navigator.share()`. Fix §2.2 both invalid `nostr:` URIs. Fix §2.3 — put `ClientRecommender` on `/tools` *and* give it `/tools/client-recommender`. 301 `/damus-demo` → `/simulators/damus`. Delete the 194-byte `public/og-image.png`. Compress `preview_image.png` to <200 KB. Stand up self-hosted Plausible with the §4.2 event schema. Wire Pagefind into the build (`astro build && pagefind --site dist`) and add a search box.

**Weeks 3–6 (build the assets).** `/embed/simulators/[client]` + snippet generator. `/data/*.json` with CORS + CC-BY, after consolidating the duplicated client arrays out of `ClientComparisonTable.tsx:97` and `ClientRecommender.tsx:55`. `/rss.xml` per locale. Fix the follow-pack authorship, `r` tag, njump permalink, and parallel relay publish.

**Weeks 7–12 (the Nostr-native loops).** NIP-07 three-tier share across guides/quizzes/KeyGenerator/badges. NIP-23 syndication pipeline + revive the site npub. Dynamic OG images. Then, and only then, shareable quiz result cards and NIP-78 portable progress.

---

## 7. Explicitly unverified

- Whether `@nostrichlove` exists on X (hardcoded at `src/components/SEO.astro:102-103`).
- Whether njump renders `naddr` for kind:39089 starter packs (high confidence, not tested with a live naddr).
- Per-client compose/share URLs for Primal, noStrudel, Yakihonne, Coracle — **could not verify any**; GitHub code search requires auth and none document it publicly.
- Nostr DAU/MAU. [Profilestr](https://profilestr.com/reports) reports ~3,028 DAU / 10,201 MAU as of 2026-07-09; other sources cite ~17k DAU. Both are sampled from different cohorts. Order of magnitude only.
- Cloudflare's exact sampling ratio and retention window — sourced from [Plausible](https://plausible.io/vs-cloudflare-web-analytics) and [Swetrix](https://swetrix.com/comparison/cloudflare-analytics/vs-google-analytics), not from Cloudflare's own docs.
- Current live behavior of anything in `dist/` — that build is stale and I did not rebuild.

**Sources:** [NIP-51](https://github.com/nostr-protocol/nips/blob/master/51.md) · [NIP-21](https://github.com/nostr-protocol/nips/blob/master/21.md) · [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) · [NIP-77 PR #491 (closed)](https://github.com/nostr-protocol/nips/pull/491) · [nos2x](https://github.com/fiatjaf/nos2x) · [nostr-embed](https://github.com/nostrband/nostr-embed) · [api.nostr.watch](https://api.nostr.watch/) · [nostorg client matrix](https://nostorg.github.io/clients/) · [Cloudflare Web Analytics docs](https://developers.cloudflare.com/web-analytics/) · [Plausible custom events](https://plausible.io/docs/custom-event-goals) · [Plausible vs Cloudflare](https://plausible.io/vs-cloudflare-web-analytics) · [Swetrix comparison](https://swetrix.com/comparison/cloudflare-analytics/vs-google-analytics) · [Profilestr reports](https://profilestr.com/reports) · [stats.nostr.band](https://stats.nostr.band/)

=====================

# Competitive Analysis — Nostr Onboarding/Education (July 2026)

**Method note:** every word count below is my own measurement (`curl` + strip tags + whitespace-split) on the live page, so numbers are comparable across sites. Word-splitting on whitespace **undercounts zh/ar/hi** — treat CJK/Arabic counts as unreliable. GitHub stats are from the GitHub REST API on 2026-07-27. I had **no access to Ahrefs/SimilarWeb**, so "authority" is inferred from proxies (Wikipedia citations, awesome-nostr placement, GitHub stars, SERP position) and is explicitly flagged as unverified where relevant.

---

## 1. The competitive set, measured

### Tier 1 — real threats

#### nostr.co.uk — **the most dangerous competitor, and it is 9 months old**
- Launched **2025-11-01** (`https://nostr.co.uk/news/welcome-to-nostr-co-uk/`, `datePublished: 2025-11-01T00:00:00.000Z`). Single editor, **Gareth Ellis** (`/about/`), named byline + job title.
- **97 URLs** (`https://nostr.co.uk/sitemap-0.xml`), all English. Structure is entity-per-page:
  - `/learn/` — **15 articles** incl. `nostr-relays-explained`, `nostr-events-explained`, `nostr-clients-explained`, `censorship-resistance`, `decentralization-explained`, `nostr-vs-twitter`, `nostr-vs-mastodon`
  - `/clients/` — **22 individual client pages** (`/clients/damus/`, `/clients/notedeck/`, `/clients/flotilla/`, `/clients/spring/`…)
  - `/relays/` — **14 individual relay pages** (`/relays/nos-lol/`, `/relays/wot-relay/`, `/relays/nostr-wine/`…)
  - `/nips/` — **30 individual NIP pages** (nip-01 … nip-85)
  - Money pages: `/best-nostr-clients-2026/`, `/best-nostr-relays-2026/`
  - `/glossary/`, `/faq/`, `/events/`, `/news/`, plus a UK moat: `/uk/online-safety-bill/`, `/uk/free-speech/`
- **Depth** (measured): `/learn/how-nostr-works/` **2507w**, `/learn/getting-started/` **2248w**, `/nips/nip-05/` **1866w**, `/glossary/` **1486w**, `/best-nostr-clients-2026/` **1077w**, `/clients/damus/` 605w.
- **Schema.org stacking is why it wins.** `/learn/getting-started/` alone ships `Article` + `BreadcrumbList` + `HowTo` (numbered steps) + **multiple `DefinedTerm` blocks** wired via `inDefinedTermSet` to `/glossary/` + `FAQPage`. That is a deliberate entity-graph play.
- Visible "Last updated: 31 January 2026" on articles.
- `robots.txt` (header comment "Last updated: 2026-05-30") explicitly allow-lists **OAI-SearchBot, PerplexityBot, DuckAssistBot, GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended** and blocks MJ12bot/dotbot — an explicit answer-engine-citation strategy.
- **SERP evidence:** takes positions **1 and 2** for "nostr relays explained guide 2026" (`/learn/nostr-relays-explained/` and `/relays/`), plus results for "how nostr works" and "nostr glossary". It beat `nostr.how/en/relays` on its own core topic.
- **Weaknesses:** zero i18n, zero interactive tools, no simulators, single author (bus factor 1), no `sitemap.xml` (404 — only `sitemap-index.xml` works).

#### nostr.how — the incumbent brand, and it is thin and drifting
- Repo `erskingardner/nostr-how` — **142★**, last push **2026-03-27**.
- **99 sitemap URLs = 9 articles × 11 languages** (`de, en, es, fa, fr, it, ja, nl, pt, uk, zh`). Root 308-redirects to `/en/what-is-nostr`. hreflang present.
- **The content is shallow.** Measured: `what-is-nostr` **261w**, `relays` **434w**, `clients` 511w, `zaps` 610w, `get-started` 630w, `the-protocol` 939w. Every single one of those is beaten by nostrich.love's equivalent.
- No `lastmod` anywhere in the sitemap. No dates on pages. No interactive anything.
- **But its authority is real and unearned by content:** it is **cited in the Wikipedia article on Nostr** (`en.wikipedia.org/wiki/Nostr`, alongside nostr.com), and it is the first educational link in awesome-nostr's `## Protocol` section.
- **Maintainer signal:** erskingardner's active repo is now `marmot-protocol/marmot` (128★, pushed 2026-07-23) vs nostr.how untouched since March. nostr.how looks like a maintained-but-not-invested asset. *Unverified: I did not confirm intent, only commit recency.*

#### nostr-resources.com — highest personal brand, worst site architecture
- Repo `nostr-resources/nostr-resources.github.io` — **48★**, pushed **2026-04-15**. By **Gigi** (dergigi.com — also 21 Lessons, Bitcoin Resources). CC BY-SA 4.0.
- **Enormous breadth on a single page**: get-started, keys, clients (15+ mobile/10+ web), relays, tools, games, podcasts (8+), books, videos, privacy, dev resources, funding.
- **Critical structural flaw: its sitemap contains 2 URLs — `/` and `/404`.** Everything is anchors (`#get-started`, `#learn-more`, `#faq`, `#tips--tricks`). One page cannot rank for 40 topics. This is a huge, permanent give-away of long-tail traffic.
- Translations exist as forked domains (zh, fr, es, de, it, pt-BR — e.g. `test.nostr.pt` surfaced in search), not a unified i18n system.
- No interactive tools.

#### awesome-nostr / nostr.net — the biggest node in the graph, invisible to Google
- `aljazceru/awesome-nostr`: **2,949★, 402 forks, pushed 2026-07-27 (today)**, 3 open issues. README is **175 KB**, ~40 `##` sections.
- **`nostr.net` is a client-rendered shell: 5,261 bytes of HTML containing 270 characters of extractable text.** All the ranking power stays on GitHub (where README links carry `rel="nofollow"`). This is a referral-traffic channel, not an SEO one.
- **nostrich.love is already listed**, in `## Protocol`, one line below nostr.how: *"a normie-friendly introduction and quick start guide."* That description undersells everything differentiated about the site — no mention of simulators, 7 languages, or tools. **A one-line PR to that README is the single cheapest positioning win available.**

### Tier 2 — real but limited

| Site | Repo / ★ | Last push | Scale | i18n | Tools | Note |
|---|---|---|---|---|---|---|
| `learnnostr.org` | `cristyalmonte/learnnostr` **14★** | 2026-04-14 | 54 URLs, 9 modules + concepts + tutorials | en, es | none | module-01 = **1569w**. Despite the name it's **developer-track** (JS/Python/Rust code, "Building Your Client", "Scaling & Performance"). **Bug: `www.learnnostr.org/sitemap.xml` lists `learnnostr.com/*` URLs** — wrong domain, self-inflicted indexing damage. All lastmod = 2026-02-25. |
| `usenostr.org` | Codeberg | unknown | single page, **1921w** | es, fr, ja, pt | none | Sections: keys, events, relays, zaps, DMs, apps, dev. Good density, no structure, no dates. |
| `nostrcg.github.io/userguide` | `nostrcg/userguide` **6★** | 2025-12-28 | Docusaurus, ~5 sections | none | none | W3C Nostr Community Group. Institutional credibility, almost no content or maintenance. |
| `nostrapps.com` | `1-leo/nostrapps.com` **1★** | 2026-07-02 | ~90 apps, 14+ category filters + platform filters | none | filter UI only | Pure logo grid. **No dates, no maintenance signals, no editorial.** |
| `nostr.info` | `Giszmo/nostr.info` **40★** | 2026-05-24 | Resources/NIPs/Events/Query | none | query tools | **Blog's most recent post is March 2023.** Dead as a content property. |
| `nostr.com` | LNbits team | — | web client v0.7.2 + `nostr.com/naddr1…` note renderer | none | it *is* a client | **Cited by Wikipedia.** Its real SEO weight comes from rendering user notes as indexable pages, not from teaching. |
| `njump.me` | — | — | 1364w homepage + every note/profile/relay as static HTML | — | — | Probably the largest indexed nostr footprint of any site. Onboarding is a side door. |
| `grownostr.org` | — | — | **1,186-byte SPA shell, 21 characters of text** | — | — | Listed in awesome-nostr, effectively does not exist to a crawler. |
| `nstart.me` | — | — | **891-byte SPA shell, 0 text** | — | full wizard | **The only genuine interactive competitor** (real key gen, ncryptsec backup, multi-signer bunker, auto-follow). Integrated by redirect into Jumble/Flotilla/Nosotros. HN: `news.ycombinator.com/item?id=43001303`. Zero SEO surface. |

### Tier 3 — adjacent, dev-facing, or parasitic
- **Dev docs:** `nostrbook.dev` (604w home), `hellonostr.dev` (en/nl), `nostrdesign.org`, `nostr-ux.com`, `nostorg.github.io/clients` + `vishalxl/Nostr-Clients-Features-List` (these two are the *entire* "client comparison" entry in awesome-nostr — both are raw GitHub feature matrices).
- **Tool-only sites that outrank nostrich.love/tools/:** `nostr-tools.com` (key gen, converter, event inspector, NIP-05 checker, relay tester — a superset of nostrich.love's toolkit), `nostrdeck.com`, `nostrtool.com` (BIP-39 mnemonics), `resources.davidcoen.it/nip05creator`.
- **Third-party content eating client queries:** Forbes (2023 + 2024 — enormous DA), `humai.blog/best-nostr-apps-2026-damus-primal-amethyst-tested/` (~3500w, 14 Apr 2026, genuine hands-on, no affiliate links), `reviewnexa.com/best-nostr-clients/`, `d-central.tech/nostr-clients-comparison/`, `soapbox.pub/blog/nostr101`, `derekross.me/guides/how-do-i-use-nostr/`.

---

## 2. Head-to-head content depth (measured, same day, same method)

| Topic | nostrich.love | nostr.how | nostr.co.uk |
|---|---|---|---|
| What is Nostr | **1115w** | 261w | (not measured separately) |
| Relays | **1308w** (`relays-demystified`) | 434w | 2507w (`how-nostr-works`) |
| Outbox model | **1095w** | *no page* | *no page* |
| Get started / quickstart | **439w** ⚠️ | 630w | **2248w** |
| Glossary | **567w** ⚠️ | *no page* | **1486w** |
| Per-client page | **93–111w** ⚠️⚠️ | 511w (one combined page) | 605w × 22 pages |

**Read that table again.** nostrich.love wins decisively on conceptual guides and *loses badly on exactly the three page types that convert*: the quickstart, the glossary, and per-client pages.

---

## 3. Where nostrich.love's differentiation is genuinely defensible

### 3.1 The 10 client simulators — uncontested, and currently invisible
Nobody in the entire set has anything comparable. The closest artifacts are two GitHub feature-matrix tables (`nostorg/clients`, `vishalxl/Nostr-Clients-Features-List`) and `nostrapps.com`'s logo grid. nostr.co.uk's 22 client pages are prose descriptions. **Letting a stranger touch a Damus UI before installing anything is a category of content that does not otherwise exist.**

**But it is not a search asset today.** Measured static text: `/simulators/damus/` **93w**, `/simulators/amethyst/` **99w**, `/simulators/primal/` **102w**, `/simulators/coracle/` **111w**, `/damus-demo/` **72w**. These are React islands with ~44 KB of HTML and ~100 words of crawlable text. Google has essentially nothing to rank. Meanwhile `nostr.co.uk/clients/damus/` gives it 605 words.

Also: **`/simulators/` ships `<meta name="description">` claiming "Try out 7 different Nostr clients"** while `src/simulators/` contains **10** (amethyst, coracle, damus, gossip, keychat, nostr-kitten, olas, primal, snort, yakihonne). The site is actively under-claiming its best feature in the snippet Google shows.

### 3.2 Hindi, Arabic, Polish — a genuinely empty market
Exact language coverage across the field:
- **nostr.how (11):** de, en, es, fa, fr, it, ja, nl, pt, uk, zh
- **nostr-resources (6, forked domains):** zh, fr, es, de, it, pt-BR
- **usenostr (4):** es, fr, ja, pt
- **learnnostr (1):** es
- **everyone else:** English only
- **nostrich.love (7):** en, pl, es, de, zh, ar, **hi**

**`hi`, `ar`, and `pl` are contested by literally no one.** Note nostr.how has Persian (`fa`) but not Arabic. A search for Nostr guides in Hindi/Arabic/Polish returns nothing relevant — I ran it and got Wikipedia disambiguation pages. Hindi alone is a ~600M-speaker market with zero incumbent.

Verified live: `/hi/guides/what-is-nostr/` returns 200 with `<html lang="hi">`, correct hreflang across all 7 locales + x-default, correct absolute canonical.

### 3.3 Topics nobody else covers at all
- **Outbox model** (`/en/guides/outbox-model/`, 1095w) — absent from nostr.how, absent from nostr.co.uk's 97-URL sitemap, absent from usenostr. The only prior art is fiatjaf's blog post (`fiatjaf.com/3f106d31.html`) linked from awesome-nostr's "Recommended reading". nostrich.love owns the only user-facing treatment.
- **NIP-17 private messages** as a *user* guide — nostr.co.uk has `/nips/nip-17/` but that's a spec page.
- **Audience segmentation** (`/nostr-for-artists|bitcoiners|books|foodies|musicians|parents|photographers|privacy/`) — no competitor segments by audience at all. But at **438–441 words each** these are too thin to rank, and they did not appear for "nostr for photographers artists musicians creators guide" (that SERP went to `nostr.build/creators/`, Forbes, and derekross.me).

### 3.4 Empty-feed tooling — the right problem, unclaimed
`/follow-pack/` (765w), `/twitter-bridge/` (412w), `/relay-feed-browser/` (540w) attack the #1 documented churn cause. The SERP for "nostr feed empty no followers" is currently **stacker.news threads and a GitHub issue** — there is no authoritative page. `nstart.me` does auto-follow but has 0 bytes of indexable text. This is winnable.

---

## 4. What competitors do better — concretely

1. **Structured data.** nostr.co.uk stacks `Article` + `HowTo` + `FAQPage` + `BreadcrumbList` + `DefinedTerm` on one page. **nostrich.love ships zero JSON-LD** — I verified 0 `ld+json` blocks on `/`, `/en/guides/what-is-nostr/`, `/en/guides/faq/`, `/glossary/`, and `grep -rl 'ld+json' src/` returns nothing. The site has an FAQ guide and a glossary and marks up neither.
2. **Entity-per-page architecture.** nostr.co.uk: 22 client pages, 14 relay pages, 30 NIP pages. nostrich.love has 10 client pages with 100 words each and no relay or NIP pages.
3. **Freshness signals.** nostr.co.uk shows "Last updated 31 January 2026" + `dateModified` in schema; learnnostr shows lastmod in its sitemap; humai.blog dates its post. **nostrich.love displays no date on any page and no `lastmod` in `sitemap-0.xml`.**
4. **Named human authorship.** nostr.co.uk publishes an editor bio with `jobTitle` in `Person` schema. nostr-resources trades on Gigi's name. nostrich.love is anonymous — costs both E-E-A-T and shareability.
5. **Full-site localization.** nostr.how localizes its *entire* site including the root. nostrich.love localizes **only the 16 guides**. All 6 non-English locale roots — `/pl/`, `/es/`, `/de/`, `/zh/`, `/ar/`, `/hi/` — **return 404 with `<html lang="en">`**. A Hindi reader who lands on a Hindi guide and clicks "home" hits an English 404. The homepage, all 10 simulators, `/tools/`, `/glossary/`, `/resources/`, and all 8 audience pages are English-only.
6. **Real vs. simulated onboarding.** `nstart.me` generates an actual keypair with ncryptsec backup and a multi-signer bunker, and is embedded as a redirect target by Jumble, Flotilla, and Nosotros. Simulators teach; they don't onboard.
7. **AI-crawler posture.** nostr.co.uk explicitly allow-lists OAI-SearchBot/PerplexityBot/ClaudeBot/etc. for answer-engine citation. nostrich.love's `robots.txt` has no AI-bot policy and carries a `Crawl-delay: 1` (ignored by Googlebot, honored by Bingbot — mild throttle on a 152-URL site, no upside).
8. **Breadth of ecosystem coverage.** nostr-resources covers podcasts, books, games, network stats, and search tools. nostrich.love's `/resources/` is 305 words.

---

## 5. The gap nobody is filling

**Everyone in this market ships prose about concepts. Nobody ships task-level, client-specific instruction — and nostrich.love is the only site with the machinery to do it.**

Concretely, the missing page class is **task × client**:
> "How to back up your key in Damus" · "How to set up zaps in Amethyst" · "How to change your relays in Primal" · "How to turn on private messages in 0xchat" · "How to post a photo in Olas"

- nostr.co.uk has `/clients/damus/` (what Damus is) but no task pages.
- nostr.how has one combined `/clients` page, 511 words for the entire client ecosystem.
- nostrapps.com has a logo and one sentence per app.
- awesome-nostr's `## Tutorials` section is **entirely developer/relay-operator content** — Super Testnet YouTube videos, "how to set up a paid relay", "strfry personal relay". There is not one end-user task tutorial in the canonical directory of the ecosystem.

10 simulators × ~8 core tasks = ~80 pages of a keyword class with essentially zero competition, and nostrich.love already has the interactive UI to illustrate every one. That converts the simulators from a nice demo into an indexable content engine — which also fixes the 93-word problem.

**Four smaller unclaimed gaps, all verified:**
1. **Failure-mode content.** "why is my nostr feed empty", "I lost my nsec", "my follows disappeared" — SERP is stacker.news threads (`stacker.news/items/182519`) and `nbd-wtf/nostr-tools` issue #322. No authoritative page exists. `/en/guides/troubleshooting/` is one page where it should be a cluster.
2. **Nostr vs Bluesky.** nostr.co.uk covers `nostr-vs-twitter` and `nostr-vs-mastodon` but **has no Bluesky page** (confirmed against its full sitemap). Nobody in the set does. nostrich.love's `protocol-comparison` guide could be split out to claim it.
3. **Video / motion.** Not a single education site in this set embeds video. awesome-nostr's video links are 2023-era developer workshops.
4. **A maintained, dated glossary with `DefinedTerm` markup.** nostr.co.uk's is 1486w and wired into every article via `inDefinedTermSet`; nostrich.love's is 567w with no markup. That's the same asset at one-third the size and none of the plumbing.

---

## 6. Bottom line

nostrich.love has **two moats nobody can cheaply copy** (10 interactive simulators; hi/ar/pl localization) and **one architectural liability that neutralizes both** (~100 words of crawlable text per simulator, no localized site shell, zero structured data, no dates). nostr.co.uk proved in **9 months from a standing start** that this SERP is winnable with nothing but schema markup, entity-per-page structure, and 2000-word articles — it has none of nostrich.love's technical assets and is already beating the 3-year incumbent nostr.how on its own core terms.

The highest-leverage moves are all *packaging*, not new capability: give the simulators text, give the locales a homepage, add JSON-LD, put dates on pages, and rewrite one line in `aljazceru/awesome-nostr`'s README.

---

## 7. Explicitly unverified

- **No traffic or backlink data for any site** — no Ahrefs/SimilarWeb/Search Console access. Authority claims rest on Wikipedia citations, awesome-nostr placement, GitHub stars, and observed SERP position only.
- **Whether nostrich.love's pages are indexed at all.** I could not run `site:` queries; the search tool available is not Google. The homepage does surface for a branded query, but I could not confirm indexation of the hi/ar/pl guides, the simulators, or the audience landing pages.
- **Content of SPA-only sites** — `grownostr.org`, `nstart.me`, `nostrhub.io`, `nostr.watch` returned shells only; their descriptions come from search snippets and third-party writeups, not from my own reading of the rendered page.
- `uselessshit.co/resources/nostr/` — request failed (exit code 000), not assessed.
- **Social/npub follower counts** for any competitor — not measured.
- **nostr.how's maintenance intent** — I observed commit recency (2026-03-27) and the maintainer's newer active repo; I did not confirm the project is deprioritized.
- Word counts for `zh`/`ar`/`hi` pages are **not comparable** to Latin-script counts (whitespace tokenization); e.g. `/zh/guides/what-is-nostr/` measured 489 "words" vs `/de/` 1118, which almost certainly reflects tokenization, not a translation gap.

=====================

I have enough grounded data. Writing the report.

# External Distribution Research — nostrich.love
**Research date: 2026-07-27. Every claim below is tied to something I actually fetched. Unverifiable items are flagged in §10.**

---

## 0. Headline findings

1. **The site is already in the single most important Nostr directory** — `awesome-nostr` lists it at line 35 of the README. But the *same list* mislabels a competitor's NIP-05 service as "nostrich.love" at line 789. That's a fixable, free brand/backlink win.
2. **HN data says: do not submit the guide. Submit the simulators.** A direct competitor (usenostr.org) ran exactly the "submit my beginner guide" play in April 2026 and got 33 points / **0 comments**. Meanwhile every Nostr `Show HN` with a playable artifact cleared 67–101 points. The site's 9 client simulators are the only Nostr asset I found that satisfies HN's Show HN guideline verbatim.
3. **The #1 Google result for "nostr beginners guide" is a 2-minute TFTC post from December 2023 that recommends Iris.** That is the competitive bar, and it is low.
4. **Wikipedia already cites a beginner guide as a source** (`nostr.how/en/zaps` is reference material in the article). The External links section contains exactly one entry. This is the most under-exploited high-authority surface available.
5. **The repo has three structural blockers to every channel below**: no `llms.txt`, zero JSON-LD anywhere in `src/`, and no blog/news route. Details in §9.

---

## 1. Bitcoin / crypto media and newsletters

### 1.1 Bitcoin Magazine — `bitcoinmagazine.com`
- **Submission path:** `editor@bitcoinmagazine.com`. Their [Editorial Policy](https://bitcoinmagazine.com/editorial-policy) states they **do not publish press releases** but accept them for consideration as story input, and they **do not accept pitches in exchange for payment**.
- **Implication:** a "check out my site" email is dead on arrival. The only viable pitch is a byline/op-ed where the site is the author bio link, not the subject. Their long-running `Op Ed:` prefix format (e.g. [this one](https://bitcoinmagazine.com/technical/op-ed-want-to-learn-how-to-contribute-to-bitcoin-try-a-good-first-issue)) is the template.
- **Disclosure requirement:** they require disclosure of financial relationships and of any non-BTC crypto holdings. Nostr has no token, so this is clean.
- *Note:* `thebitcoinmagazine.org` and `bitcoinnews.com/guest-post` are **different, lower-authority sites** running paid guest-post operations. Do not confuse them with BTC Inc's Bitcoin Magazine.

### 1.2 Stacker News — `stacker.news` — **highest effort-to-return ratio of anything in this report**
- There is a dedicated **`~nostr` territory** at https://stacker.news/~nostr, described as "everything nostr related." I verified it is **highly active as of July 2026** — recent posts include BOLT12 zap integration, NIP-46 remote signing, Cordn Android launch, Sidecar signer.
- **Concrete economics:** posting to `~nostr` costs **30 sats**; replies cost **1 sat**. (Founding your own territory costs 50k sats/month, 500k/year, or 3M one-time — not needed here.)
- **Rules that matter**, from https://stacker.news/guide: share **original sources** (secondary links stack fewer sats); a **dupe warning** fires if the link was already posted, and duplicates "tend to be ignored." Titles must be "accurate, complete, and succinct."
- **Tactic:** do not post the homepage. Post individual deep pages — a specific simulator, the NIP-05 checker, the outbox-model guide — each as its own link post over weeks. Each is a distinct URL so no dupe collision.
- **Bonus:** SN supports native Nostr crossposting of discussion posts as **NIP-23 kind:30023** long-form events, so one SN post seeds Nostr long-form clients simultaneously.

### 1.3 No Bullshit Bitcoin — `nobsbitcoin.com`
- Self-described as "A NEWS DESK FOR BITCOINERS BY BITCOINERS," explicitly covering "Bitcoin, **Nostr**, freedom tech." 100% audience-funded, no sponsors, no paywall.
- **I could not find a public submit-a-tip email or contact form on the homepage.** Their reachable surfaces are Nostr (`nobsbitcoin@primal.net`), [X @nobsbitcoin](https://x.com/nobsbitcoin), and [Telegram](https://t.me/s/nobullshitbitcoin).
- **Editorial reality check:** their Nostr coverage is **release-driven, not education-driven** — the only Nostr item on the front page when I fetched it was "Damus Notedeck v0.4.0 Beta." A guide site is not a NoBS story. **A versioned feature launch is.** Ship "nostrich.love adds 10th client simulator + Arabic/Hindi locales" as a release note and it fits their format.

### 1.4 Bitcoin Optech — `bitcoinops.org` — **out of scope, deprioritize**
- Their `/en/contribute/` page **404s**. Newsletter scope is Bitcoin and Lightning *development*. Their Nostr coverage is strictly protocol-plumbing — e.g. [#253](https://bitcoinops.org/en/newsletters/2023/05/31/) on relaying transactions over Nostr, and coverage of Munstr (MuSig signing rounds over Nostr) and Unify (PSBT coordination over Nostr).
- A beginner guide has no path here. Skip.

### 1.5 Podcasts — TFTC, What Bitcoin Did
- **TFTC is a competitor, not a channel.** https://www.tftc.io/nostr-beginners-guide/ is staff-written, published **19 Dec 2023**, a **2-minute read**, and walks users through **Iris + Alby**. It currently ranks #1 for the core query. It is stale by ~2.5 years and recommends a client the ecosystem has largely moved past.
- TFTC ranks in the **top 5.9% of podcasts by inbound pitch volume** ([PodPitch](https://podpitch.com/podcasts/tftc-a-bitcoin-podcast)) — i.e. cold pitching is heavily saturated.
- **The asymmetric play is not to pitch the podcast — it's to out-rank the article.** TFTC's own guide is the weakest link in the top-5 SERP.
- Nostr-native podcast targets (all listed in awesome-nostr §Podcasts): [Nostrovia](https://nostrovia.org/), [Plebchain Radio](https://fountain.fm/show/0N6GGdZuYNNG7ysagCg9), [Thank God for Nostr](https://tgfb.com/podcasts/thank-god-for-nostr/), [Nost Talks](https://www.curiousdk.com/podcast). Far easier bookings, smaller but perfectly-targeted audiences.

---

## 2. Reddit

**⚠️ Verification failure — read this first.** Reddit blocks Anthropic's user agent at both the fetch and search layer (`reddit.com`, `old.reddit.com`, and `about.json` endpoints all refused). **I could not read a single subreddit's actual rule text or subscriber count.** Everything below is either (a) sourced from third parties, or (b) explicitly marked as unverified inference. Treat §2 as the weakest section of this report and re-verify manually before acting.

### Verified
- **r/nostr exists and is the canonical Reddit venue** — it is the only Reddit entry in awesome-nostr's Communities section: `[Reddit /r/nostr](https://www.reddit.com/r/nostr/) - subreddit for nostr related discussion`.
- Cross-protocol curiosity is real and documented: [lemmy.world/post/991811](https://lemmy.world/post/991811) — "So, what exactly is Nostr and how is it different from the fediverse?" and [lemmy.world/post/4709136](https://lemmy.world/post/4709136) — "Are there subreddit/lemmy communities on nostr?"

### Unverified — must be checked manually before posting
- Subscriber counts for r/nostr, r/Bitcoin, r/privacy, r/degoogle, r/selfhosted, r/fediverse, r/BlueSky.
- Every one of those subreddits' self-promotion rules, karma/age gates, and link-post allowances.
- Whether r/Bitcoin's automod filters new domains (historically it has been aggressive; I cannot confirm current state).

### Strategy notes that survive the verification gap
- **r/privacy and r/degoogle are a poor fit and may backfire.** Nostr is a fully-public broadcast protocol — every note is plaintext on open relays. Pitching it as a privacy tool to an audience that will immediately notice this is a credibility risk. If you post there, the honest angle is `/nostr-for-privacy` framed as *identity portability and censorship resistance*, explicitly acknowledging that content is public. The site already has this page at `src/pages/nostr-for-privacy.astro`.
- **r/fediverse is a fit but requires care.** As documented on [join-lemmy.org](https://join-lemmy.org/), the fediverse runs on ActivityPub federation; Nostr is pub/sub over relays. Fediverse audiences know this distinction and are hostile to Nostr being called "fediverse." The site already ships `src/content/guides/en/protocol-comparison.mdx` — that is the only asset that should ever be linked into r/fediverse or r/BlueSky, and it should be linked as a *comparison*, never as advocacy.
- **The universally-safe pattern** across all of these: answer an existing question thoroughly in-comment, and link a deep page as a citation for one specific claim. Never top-level link-post the homepage.

---

## 3. Hacker News — this is the best-evidenced section

I pulled the full HN corpus via the Algolia API (`hn.algolia.com/api/v1/search?query=nostr&tags=story&numericFilters=points>30`). Full ranked results:

| Points | Comments | Title | Date |
|---|---|---|---|
| 393 | 332 | Nostr — `nostr.com` | 2025-09-19 |
| 248 | 128 | "stupid simple P2P protocol that works, built by builders" | 2022-11-25 |
| 214 | 158 | Why I'm betting on Nostr — hivemind.vc | 2023-09-01 |
| 204 | 170 | Nature's many attempts to evolve a Nostr | 2025-12-10 |
| 194 | 154 | Notes and Other Stuff Transmitted by Relays — nostr.net | 2023-01-26 |
| 188 | 141 | Nostr — An Introduction (wiki.wellorder.net) | 2023-04-24 |
| **175** | **135** | **Nostr.how – A Complete Guide to Nostr** | **2023-02-04** |
| 164 | 202 | Flare, a video sharing site built on Nostr | 2023-12-21 |
| 161 | 167 | Apple to Remove Damus over Bitcoin Tipping | 2023-06-26 |
| 101 | 35 | **Show HN:** Nostr Web — decentralized hosting | 2025-10-23 |
| 90 | 27 | **Show HN:** Oracolo — Nostr blog in one HTML file | 2024-05-21 |
| 67 | 1 | **Show HN:** Freeport — P2P ride-hailing on Nostr | 2026-07-08 |
| **33** | **0** | **What is Nostr? A simple guide to the protocol — usenostr.org** | **2026-04-25** |
| 35 | 3 | Why Nostr Will Win Where Mastodon and Bluesky Failed (primal.net) | 2026-05-03 |
| 35 | 3 | Nostr is deceptively tricky to understand | 2025-11-02 |

**What this data actually says:**

1. **The "submit a beginner guide" play is burnt.** nostr.how did it in Feb 2023 and got 175/135. usenostr.org did the identical thing in **April 2026 and got 33 points and zero comments**. The novelty is spent. Submitting nostrich.love's guide bare will replicate the 33-point outcome.
2. **Show HN is the live lane.** Three Nostr Show HNs cleared 67–101 points in the last two years while ordinary submissions collapsed. Per [HN's Show HN guidelines](https://news.ycombinator.com/showhn.html): *"Show HN is for something you've made that other people can play with"* — and explicitly off-topic are *"Blog posts, sign-up pages, newsletters, lists, and other reading material."* **The guides are off-topic by rule. The simulators are on-topic by rule.** The homepage already advertises "Free • No account required • 2 minutes to get started" — HN's "remove signup barriers" requirement is already satisfied.
   - Suggested title: `Show HN: I rebuilt 9 Nostr clients as browser simulators so you can try before installing`
   - The `/simulators/` index at `src/pages/simulators/index.astro` is the correct submission URL, **after fixing the bug in §9.1**.
3. **Never submit a `primal.net` or `njump.me` URL.** "Why Nostr Will Win Where Mastodon and Bluesky Failed" scored 35 on primal.net; the "Nostr is not decentralized" njump.me link scored 36. HN's audience will not click into a Nostr client to read a Nostr article. Own the URL.
4. **The winning editorial angle is conceptual, not instructional.** "Nature's many attempts to evolve a Nostr" (204 pts, Dec 2025) and "Nostr and ATProto" (132 pts, Oct 2025) both outperformed every how-to. "Nostr is deceptively tricky to understand" (Nov 2025) names the exact pain the site exists to solve — that title is a free thesis statement.
5. **Attention has cooled hard in 2026.** Searching `search_by_date` for "nostr" across the last month returns almost entirely fuzzy "nostalgia" matches. Nostr submissions in mid-2026 are rare and low-scoring. This cuts both ways: less competition, less ambient interest. A Show HN is much more robust to this than a link post.
6. **HN rule:** *"Please don't ask friends to upvote or comment."* The Nostr community's instinct to brigade will get the post flagged. Explicitly do not do this.

---

## 4. YouTube / TikTok

**⚠️ Partial verification.** YouTube serves Anthropic's fetcher a footer-only shell; I could not read view counts or upload dates off video pages directly. View counts below come from secondary sources and are marked.

### What I verified exists
- **BTC Sessions** (`youtube.com/@BTCSessions`) — "How To Use NOSTR - A Decentralized Censorship Resistant Social Layer," https://www.youtube.com/watch?v=qn-Zp491t4Y. **48.3K views** per [the creator's own X post](https://x.com/BTCsessions/status/1615811314164830208), dated Jan 2023. Ben Perrin also published "How to Start with Nostr Today" (https://www.youtube.com/watch?v=u_U2obseVwY, June 2025).
- Other extant explainers: "Nostr Explained Visually for Beginners" (https://www.youtube.com/watch?v=yIccRIEr2gQ), "How to use Nostr in 30 minutes" (https://www.youtube.com/watch?v=AiW1zttyblU), "PRIMAL: Nostr Decentralized Social Media Meets Bitcoin! Full Tutorial" (https://www.youtube.com/watch?v=Qd4Po4i7wvc), and a [Nostr playlist](https://www.youtube.com/playlist?list=PL-p_L_HbK7jWwGo3jschLuHhWKfQXgI75).
- awesome-nostr's Tutorials section is **overwhelmingly video and overwhelmingly developer-facing** — Super Testnet's "Build your first nostr app," "Reddit clone part 1/2," relay-setup walkthroughs. There is essentially **no non-developer video tutorial in the canonical list**.

### The unmet-demand read
The gap is not "a Nostr explainer video" — several exist. The gap is **current** and **non-developer**. The flagship BTC Sessions tutorial is from January 2023 and predates the outbox model, NIP-17 private DMs, and the current client landscape. The site ships guides on exactly those (`src/content/guides/en/outbox-model.mdx`, `nip17-private-messages.mdx`) that no video covers.

### Can the simulators become video content? Yes — this is the strongest finding in this section
The simulators are the rarest thing in tutorial production: **a controllable, deterministic, non-doxxing recording surface.** Every existing Nostr video has to screen-record a real client, which means real handles, real content, and a rebuild every time the client's UI ships. The simulators solve all three.

Concretely, from the repo:
- `MobilePhoneFrame` (`src/simulators/shared/components/MobilePhoneFrame.tsx`, used at `src/pages/simulators/damus.astro:35`) already renders in a phone chrome with an `ios | android` platform prop. **That is a vertical video frame for free** — TikTok/Shorts/Reels native, no post-production.
- `DamusSimulatorWithTour` (`src/pages/simulators/damus.astro:11`) means there is **already a scripted guided tour**. A tour is a storyboard. The narration script is already written.
- Ten simulator directories exist (`src/simulators/`: amethyst, coracle, damus, gossip, keychat, nostr-kitten, olas, primal, snort, yakihonne) → **ten 60-second "here's what X actually looks like" shorts** with zero new asset production.

The highest-intent search behind these is comparative — "Damus vs Amethyst," "which Nostr client should I use" — which maps directly onto `src/components/interactive/ClientRecommender.tsx` and `ClientComparisonTable.tsx`.

---

## 5. Wikipedia and high-authority citation surfaces

### 5.1 The Nostr article — verified in detail
I pulled the raw wikitext (`en.wikipedia.org/w/index.php?title=Nostr&action=raw`, 9,989 bytes).

**Structure — it is a stub-plus:**
```
== Development ==   (line 16)
== Users ==         (line 26)
== See also ==      (line 35)
==References==      (line 40)
== External links == (line 43)
```

**The entire External links section is:**
```wikitext
== External links ==
* {{GitHub|nostr-protocol/nostr}}
```

**Full citation URL list** (18 refs): github.com ×4, techcrunch.com ×3, forbes.com, businessinsider.com, reason.com, cnbc.com, fortune.com (+ web.archive.org mirror), politico.com, scmp.com, 9to5mac.com, **nostr.com ×2** (`/clients`, `/the-protocol/events`), **nostr.how/en/zaps ×1**.

**This is the critical finding: a beginner guide site is already used as a reference in this article.** `nostr.how/en/zaps` is cited as a source for a factual claim about zaps. The precedent for a non-academic guide site being an acceptable citation here is established.

**Content gaps I can name precisely from the wikitext:** there is **no Technical/Architecture section at all** — no relay model, no NIP-05, no outbox model, no client landscape. The only user statistic in the article is a stale one.

### 5.2 The rules, and the trap
Per [WP:EL](https://en.wikipedia.org/wiki/Wikipedia:External_links): Wikipedia "is not a directory of any subject's complete web presence," and acceptable links are those with "meaningful, relevant content" that cannot be integrated into the article.

**Read the talk page before touching anything.** From https://en.wikipedia.org/wiki/Talk:Nostr, editor **Grayfell** has repeatedly reverted content on this article:
- An 11-comment thread where censorship-resistance claims were removed for leaning on primary sources and involved parties (Jack Dorsey), and kept getting removed even when Forbes / Yahoo Finance / SCMP were cited.
- A February 2025 thread where Grayfell rejected the **official NIP specification** as not a reliable source for spam mitigation.

**Translation: this article has an active, source-strict watcher. A self-added external link from the site owner will be reverted, and may attract a COI flag.** No COI or spam warnings currently exist on the talk page — do not be the one to create the first.

**The only defensible approach:**
1. Do **not** add nostrich.love to External links yourself. WP:COI.
2. **Do** raise the missing-architecture gap on the talk page as a content question, disclosing your affiliation.
3. The realistic long game is the one nostr.how won: **become the resource a third-party editor reaches for.** That happens when the site is the clearest available explanation of a specific mechanism (outbox model, NIP-05) — which is exactly what `src/content/guides/en/outbox-model.mdx` and `nip05-identity.mdx` are.

### 5.3 awesome-nostr — **immediate, free, and currently broken**
`github.com/aljazceru/awesome-nostr`, maintained by [aljaz](https://disobey.dev/contact/). Contribution is a plain PR; there is **no CONTRIBUTING.md and no stated criteria**, so the bar is low.

**Two concrete actions:**

**(a) A duplicate/wrong entry is diluting the brand right now.** Line 35 is correct:
```
- [nostrich.love](https://nostrich.love/) - a normie-friendly introduction and quick start guide.
```
But line 789, in the **NIP-05 identity services** section, reads:
```
- [nostrich.love](https://uselessshit.co/nostr/nip-05/) - A Nostr Address registration service.
```
The anchor text "nostrich.love" points at `uselessshit.co`. Anyone scanning the list sees the name twice pointing at two different domains. Whether or not both properties are yours, this splits the link equity and confuses the reader. **Submit a PR renaming line 789's anchor to the actual service name.**

**(b) The site is listed in exactly one section when it qualifies for three.** It's in `## Protocol` only. It is absent from:
- `## Tutorials` (line 1015) — which currently contains **only** dev videos and relay-setup guides. A "normie-friendly interactive guide with 9 client simulators" is the single most obviously missing entry in that section.
- `## Recommended reading/watching` (line 1043) — currently Lopp, fiatjaf, Hivemind, two arXiv papers.

### 5.4 Other verified high-authority surfaces
- **W3C `public-nostr` Community Group mailing list** — https://lists.w3.org/Archives/Public/public-nostr/. Active **May 2023 → July 2026** (6 messages in July 2026). Explicitly: *"Anyone may read or write to this list."* Subscribe by emailing `public-nostr-request@w3.org` with `subscribe` as the subject. **A `w3.org` archive URL is a genuinely high-authority backlink** and one of the few available without gatekeeping. Contribute substantively; do not spam.
- **`nostr.net`** — https://nostr.net/ ("Awesome Nostr Resources"), a rendered mirror/sibling of the awesome list. Scored 194 points on HN in 2023, so it carries real authority.
- **Peer directories listed in awesome-nostr's Related Resources**: [ungovernable.tech](https://ungovernable.tech) (encryption/privacy/decentralization resources) is the best fit for a reciprocal listing.

### 5.5 Privacy Guides — **verified dead end, do not spend time here**
https://www.privacyguides.org/en/social-networks/ recommends only **Mastodon** and **Element**. Nostr is **not listed**, and per their [criteria](https://www.privacyguides.org/en/about/criteria/), social networks *"must allow you to limit who can follow your profile"* and *"must allow you to post content visible only to your followers."* **Nostr structurally cannot satisfy either** — notes are public events on open relays. Submitting to https://discuss.privacyguides.net/c/site-development/suggestions/6 will be rejected on the criteria, and arguing it will cost credibility. Skip.

---

## 6. The platform-exodus wave — how to pre-position

### What the historical record shows
The November 2024 US-election event is the best-documented trigger. Verified specifics:
- **6 Nov 2024**: X saw [its largest user exodus since the Musk acquisition](https://www.nbcnews.com/tech/tech-news/x-sees-largest-user-exodus-musk-takeover-rcna179793).
- Bluesky went from ~9M (Sept 2024) → 14.6M → **20M users**, at points [adding nearly 1M users/day](https://www.hollywoodreporter.com/business/digital/bluesky-20-million-users-twitter-exodus-elon-musk-1236065566/).
- Mastodon caught real spillover too: [+47% iOS downloads, 894K MAU, +27% MoM signups, 90K new registrations in November](https://techcrunch.com/2024/11/18/mastodon-sees-a-boost-from-the-x-exodus-too-founder-says).

### The documented trigger taxonomy
From [Forbes](https://www.forbes.com/sites/danidiplacido/2024/11/19/the-x-twitter-exodus-to-bluesky-explained/) and [GetJar](https://getjar.com/article/x-exodus-to-bluesky-reasons-for-migration), the recurring causes are: **paid-verification changes**, **new/restrictive Terms of Service**, **waves of account deactivations**, and **owner political alignment**. ToS changes and mass-deactivation waves are the two that recur on a roughly annual cadence and are the ones to instrument for.

### Why the site currently cannot catch one — and this is the binding constraint
**There is no publishing surface for timely content.** `src/content/` contains exactly three collections: `guides`, `faq`, `tools` (and `faq/` is empty on disk). Routes under `src/pages/[...lang]/` are only `guides/index.astro` and `guides/[slug].astro`. **There is no blog, no news, no dated-post route in any of the 7 locales.**

Exodus traffic is won by content published within **24–72 hours** of the trigger, against queries like "X alternatives," "how to leave Twitter," "decentralized Twitter alternative." A guide collection cannot serve that, because a guide has no publish date, no freshness signal, and no news-cycle hook.

### Pre-positioning that actually works
1. **The comparison guide is the catch-basin, not the homepage.** `src/content/guides/en/protocol-comparison.mdx` is the asset that ranks for "Nostr vs Bluesky vs Mastodon." It must be evergreen-accurate *before* a wave, because you cannot write it during one.
2. **Write the "leaving X" piece now and hold it.** The specific unmet need in a migration is *account portability* — the thing Bluesky users learned to care about and the thing Nostr's keypair model genuinely wins on. `src/content/guides/en/keys-and-security.mdx` is the substance; it needs a migration-framed front door.
3. **`src/pages/twitter-bridge.astro` is the single most exodus-relevant page on the site** and should be the landing target for every migration-moment link.
4. **Instrument the triggers.** X/Bluesky ToS-change announcements and mass-deactivation reporting are the leading indicators. TechCrunch's decentralized-social beat is the fastest reliable signal — the same reporter track covered both the [Bluesky exodus](https://techcrunch.com/2024/11/12/bluesky-is-seeing-an-exodus-of-unhappy-x-users-following-the-election) and [Dorsey's $10M open-source-social nonprofit funding](https://techcrunch.com/2025/07/16/jack-dorsey-pumps-10m-into-a-nonprofit-focused-on-open-source-social-media/) (July 2025), the latter of which is cited in the Wikipedia article.
5. **Honest caveat:** every documented 2024–2026 exodus went to **Bluesky and Mastodon, not Nostr.** I found no evidence of a Nostr signup spike from any migration wave. The realistic capture is not "exodus users join Nostr" — it's "exodus users searching for decentralized alternatives read your comparison page." Optimize for the informational query, not the conversion.

---

## 7. Non-English communities

The site ships 7 locales (`astro.config.mjs:14` — `en, pl, es, de, zh, ar, hi`) with full hreflang + x-default handling (`src/components/SEO.astro:69-72`, plus a custom x-default `serialize` in the sitemap config). The i18n groundwork is genuinely good; the distribution for it is entirely unbuilt.

### Verified language-specific communities

**Chinese (zh)** — strongest non-English opportunity found
- **NostrZH 中文社区** — https://nostrzh.org/, GitHub org `github.com/nostr-zh`. Runs an **invite-only Chinese community relay at `wss://relay.nostrzh.org/`**.
- **Critically: NostrZH has a 资源与链接 (Resources & Links) page that already lists Nostr.how as a beginner's guide, alongside an "Awesome Nostr Chinese" collection, protocol specs, and a client directory.** A zh-locale guide site is a direct, obvious fit for that page. This is the single highest-probability non-English listing available.
- **Telegram: nostr CN** — https://t.me/nostr_cn (listed in awesome-nostr Communities).
- Existing zh content to benchmark against: [8btc.com article](https://www.8btc.com/article/6801654), [CXPLAY quick-start guide](https://blog.cxplay.org/works/nostr-quick-start-guide/), [OSCHINA project page](https://www.oschina.net/p/nostr).

**Spanish (es)**
- **Telegram: nostr ES** — https://t.me/nostr_es (awesome-nostr Communities).
- **Competitor to beat:** https://nostrfacil.com/ — "Nostr para Neófitos | Guía completa en español," positions on "get started in 5 minutes." This is the incumbent for the Spanish beginner query.
- awesome-nostr already carries a Spanish entry — [estudiobitcoin.com "Nostr: Solucionando la censura de una vez por todas"](https://estudiobitcoin.com/nostr-solucionando-la-censura-de-una-vez-por-todas/) — proving the maintainer accepts non-English resources into the Protocol section. **A `nostrich.love/es/` PR to awesome-nostr has precedent.**
- Also live: [a Spanish beginner guide on Medium](https://medium.com/@ishi_kawa/gu%C3%ADa-para-principiantes-en-nostr-2420f15e9045).

**Arabic (ar)**
- **bitcoinarabic.org** — https://bitcoinarabic.org/. Verified: Arabic-language Bitcoin education site with articles, podcasts, courses, and a library. **It publishes bylined contributed content** — their Nostr piece (https://bitcoinarabic.org/what-is-nostr-alex-cryptonatorguy/) credits writers "Cryptonatorguy" and "Alex" with editing by "Bam," and includes contributor email and Lightning addresses. **This is a working contributor pipeline and the clearest Arabic-language entry point I found.** No dedicated submissions page; contact via the contributor details in articles.
- **Note the RTL dependency:** an `ar` locale being *linkable* depends on the RTL rendering actually being correct. The repo has an untracked `LESSONS_AR_LOCALE.md` at root suggesting this was recently worked on — verify before promoting the `ar` pages externally.

**Hindi (hi)** — **weakest track; I found nothing**
- I could not verify a single Hindi-language or India-focused Nostr community, Telegram group, or publication. awesome-nostr's Communities section lists Telegram groups for CN, ES, FR, NL, Persian/Farsi, and RU/UA/BY — **there is no Hindi or Indian group listed.**
- The `hi` locale was just completed (commit `c0e4922` — "complete Hindi locale infrastructure"). **There is currently no identified distribution channel for it.** Honest assessment: treat `hi` as an SEO/AI-citation play only, not a community play, until a community is found.

**Other locales in awesome-nostr worth noting for the pattern:** a [Persian Nostr book](https://github.com/kehiy/persian-nostr-book) and [awesome-nostr-japan](https://github.com/nostr-jp/awesome-nostr-japan) are both listed — non-English Nostr resources are actively welcomed across the ecosystem's canonical lists. Also relevant: [Telegram nostr FR](https://t.me/nostrfr), [nostr NL](https://t.me/nostrnederland), [nostr RU/UA/BY](https://t.me/nostru_community) — the last matters given the site's Polish locale.

---

## 8. AI / LLM answer engines

### 8.1 The competitive set you must displace
For the canonical query, the currently-surfaced sources are: **tftc.io/nostr-beginners-guide** (Dec 2023, 2-min read, recommends Iris), **nostr.how/en/get-started**, **nostr.co.uk/learn/getting-started**, **cointribune.com**, **forbes.com/sites/digital-assets** (both a [2023](https://www.forbes.com/sites/digital-assets/2023/04/11/how-to-get-started-with-nostr/) and a [2024](https://www.forbes.com/sites/digital-assets/2024/07/17/your-guide-to-nostr-the-decentralized-network-for-everything/) piece), and **mslmdvlpmnt.com**. **nostrich.love does not appear.**

Two of the six are stale enough to be actively wrong. That is the wedge.

### 8.2 What the 2026 research says earns citations
Synthesizing across [The HOTH](https://www.thehoth.com/blog/how-to-get-cited-in-ai-overviews/), [Leapd](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026), [kime.ai](https://kime.ai/blog/structure-content-for-llm-extraction), and [CiteReady](https://citeready.io/blog/llms-txt-complete-guide):

- **Only 11% of domains are cited by both ChatGPT and Perplexity** — the indexes barely overlap, so this is a multi-engine problem, not one optimization.
- **Google AI Overviews: 97% of cited sources come from the top-20 organic results.** For AI Overviews there is no shortcut — it is classic SEO.
- **Perplexity heavily weights content updated within the last year** and behaves as a real-time research assistant. **This is the softest target**, because two of the six incumbents are 2.5+ years stale.
- **ChatGPT weights external validation** — mentions on Reddit and similar. Which loops back to §2 and §1.2.
- **Structural findings:** lead each H2 with a **self-contained 40–75 word answer**; use question-format headings; consistent heading levels correlated with **+40% ChatGPT citation likelihood**; lists and tables extract far better than prose.
- **Indexing lag:** Perplexity picks up new pages in days with open crawler access; ChatGPT Search and Claude in 1–3 weeks; **Google AI Overviews in 4–8 weeks.** Plan accordingly.

### 8.3 What the repo has and lacks — verified
**Good:**
- `public/robots.txt` is `User-agent: * / Allow: /` — **no AI crawler is blocked.** `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot` all have access. This is the correct default and many sites get it wrong.
- Canonical + full hreflang set + x-default are correctly emitted (`src/components/SEO.astro:66-72`).
- Sitemap is wired with per-locale i18n and a custom x-default fallback (`astro.config.mjs:30-52`).

**Missing — both are concrete blockers:**
1. **No `llms.txt`.** `ls public/` returns no `llms.txt` (there is a `humans.txt`, which does nothing for this). Per the [spec](https://citeready.io/blog/llms-txt-complete-guide), it is a root-level Markdown file: `# Site name`, `> 1–3 sentence description`, then curated link sections. With 16 guides × 7 locales, 9 simulators, a glossary and a tools index, this site has an unusually strong case for one. **Caveat, stated honestly: `llms.txt` signals intent but crawlers must still index and the model must still judge you authoritative — it is necessary, not sufficient.**
2. **Zero JSON-LD structured data anywhere.** `grep -rn "ld+json" src/` returns **nothing**; `grep -c "ld+json" src/layouts/Layout.astro` returns **0**. `src/components/SEO.astro` (129 lines) emits OG and Twitter card tags but **no `schema.org` markup at all** — no `FAQPage`, no `HowTo`, no `Article`, no `BreadcrumbList`, no `SoftwareApplication`. Given the site ships a `faq` content collection, 16 how-to guides, and a glossary, this is the largest single unexploited AI-citation lever in the codebase.

### 8.4 The structural mismatch nobody has flagged
**The site's greatest strength is its greatest AI-citation weakness.** Its differentiators — 9 interactive simulators, `KeyGenerator.tsx`, `NIP05Checker.tsx`, `RelayExplorer.tsx`, 13 quiz components — are **React islands, which are invisible to text-extraction crawlers.** An LLM crawling `/simulators/damus` sees a heading and an empty div.

The fix is not to remove them. It is to ensure **every interactive component is accompanied by a textual equivalent in the static HTML.** `ClientComparisonTable.tsx` is the clearest example: an actual `<table>` in the MDX comparing the 9 clients would be extracted and cited; a React-rendered one will not be. Per the research, **tables map cleanly onto how AI engines assemble answers** — this is the highest-leverage single change.

---

## 9. Repo-side blockers found while researching

These are distribution blockers, not general code review. Ordered by severity.

**9.1 — HIGH: The Show HN target page undercounts its own inventory, in production.**
`src/pages/simulators/index.astro:15`:
```ts
const description = 'Try out 7 different Nostr clients in your browser. No installation required.';
```
`src/simulators/` contains **ten** directories (amethyst, coracle, damus, gossip, keychat, nostr-kitten, olas, primal, snort, yakihonne). `src/pages/simulators/` has **nine** routes. I fetched the live page at https://nostrich.love/simulators/ and it **renders 9 simulators while the meta description says 7**. This is the exact page recommended as the Show HN submission and the primary Stacker News link target — it is currently understating the site's single biggest differentiator by 22%, in the meta description that HN, Reddit, Stacker News and every social preview will scrape.

**9.2 — HIGH: No dated publishing surface.** Per §6: `src/content/` has only `guides`, `faq`, `tools`; routes are only `guides/index.astro` and `guides/[slug].astro`. No blog/news collection exists in any locale. This makes it structurally impossible to catch a migration wave, and it removes the freshness signal Perplexity weights most heavily.

**9.3 — HIGH: No JSON-LD.** Per §8.3. `grep -rn "ld+json" src/` → zero results.

**9.4 — MEDIUM: No `llms.txt`.** Per §8.3.

**9.5 — MEDIUM: `src/content/faq/` is an empty directory** but is registered as a content collection. An FAQ collection is the single best-matched content type for `FAQPage` schema and for AI answer extraction; it is currently declared and unused.

**9.6 — LOW: `src/pages/nostr-for-photographers.astro.backup.mock` is committed in the pages directory.** Astro's file-based routing will ignore the extension, but it is a stray file in a public route directory.

---

## 10. Prioritized action list

**Do this week — free, high confidence:**
1. Fix `src/pages/simulators/index.astro:15` — "7" → "9". Nothing else on this list works until the flagship page describes itself correctly.
2. Two PRs to `github.com/aljazceru/awesome-nostr`: (a) fix the mislabeled line-789 anchor; (b) add nostrich.love to `## Tutorials`, where no non-developer guide currently exists.
3. Start posting deep pages to https://stacker.news/~nostr at 30 sats each. Individual guides and simulators, never the homepage, one per week to avoid dupe-flagging.
4. Email NostrZH via `github.com/nostr-zh` proposing `nostrich.love/zh/` for their 资源与链接 page — which already links Nostr.how.

**Do this month:**
5. `Show HN: I rebuilt 9 Nostr clients as browser simulators…` pointing at `/simulators/`. No vote solicitation. This is the highest-ceiling single action available.
6. Add JSON-LD to `src/components/SEO.astro` — `Article` for guides, `HowTo` for quickstart, `SoftwareApplication` for simulators, `BreadcrumbList` sitewide. Populate `src/content/faq/` and emit `FAQPage`.
7. Ship `public/llms.txt`.
8. Add a static `<table>` client comparison into the MDX so it is extractable, independent of `ClientComparisonTable.tsx`.
9. Pitch bitcoinarabic.org for the `ar` locale — they run a live bylined-contributor pipeline.

**Do this quarter:**
10. Add a dated content collection + route so migration moments and version releases are publishable. This unblocks both §6 and the No Bullshit Bitcoin release-note angle.
11. Ten 60-second vertical simulator videos using the existing `MobilePhoneFrame` + scripted tours. Zero new asset production required.
12. Rewrite/refresh the pages targeting the queries where TFTC's Dec-2023 Iris guide currently ranks #1.
13. Subscribe to `public-nostr-request@w3.org` and contribute substantively over time.

**Explicitly do not do:**
- Do not submit the guide itself to HN (usenostr.org: 33 points, 0 comments, April 2026).
- Do not add nostrich.love to Wikipedia's External links yourself — Grayfell actively patrols that article.
- Do not submit to Privacy Guides; Nostr fails their published social-network criteria on two counts.
- Do not pitch Bitcoin Optech; their contribute page 404s and the scope is Bitcoin/Lightning dev only.
- Do not organize upvote brigades on HN or Reddit.

---

## 11. What I could not verify — read before acting

- **All of Reddit.** Anthropic's user agent is blocked at `reddit.com`, `old.reddit.com`, and `*/about.json`, and `reddit.com` is rejected as a `WebSearch` allowed-domain. **I read zero subreddit rules and zero subscriber counts.** Every subreddit recommendation in §2 is inference, not evidence. Verify manually.
- **YouTube view counts and upload dates.** YouTube serves the fetcher a footer-only shell. The 48.3K figure for the BTC Sessions tutorial is from the creator's own X post, not from YouTube. **I have no TikTok data at all** — no verified Nostr TikTok presence, hashtag volume, or creator set. §4's TikTok recommendations are extrapolated from the video-format argument, not measured demand.
- **Bitcoin Magazine's editorial policy page** — `bitcoinmagazine.com` refused direct fetch. `editor@bitcoinmagazine.com` and the no-press-release/no-paid-pitch policy come from search-result excerpts of that page, not the page itself.
- **Bitcoin Optech's contribute page** returns HTTP 404; scope assessment is inferred from their newsletter archives.
- **No Bullshit Bitcoin's submission path.** No contact form or tip email was findable on the homepage. Telegram/X/Nostr are the only confirmed reachable channels.
- **Stacker News `/guide`** returned an empty body on direct fetch; the content-guideline quotes are from search excerpts. The `~nostr` territory data (30 sats/post, 1 sat/reply, July 2026 activity) **is** directly verified from https://stacker.news/~nostr.
- **Wikipedia edit history** — I read the current wikitext and the talk page, but not the revision history. I cannot say whether an external link to a guide site has previously been added and reverted.
- **Hindi-language Nostr community** — searched and found nothing. This may be a genuine absence or a search-coverage gap; the `hi` locale has no verified distribution channel either way.
- **Whether `uselessshit.co` is the same owner as nostrich.love.** The awesome-nostr line-789 issue is a real anchor-text problem regardless, but the appropriate fix differs depending on the answer.

=====================

# Nostr-Native Distribution Map (2026) — Research Report

Everything below was verified on 2026-07-27 by (a) live relay queries using `nostr-tools` against `relay.damus.io`, `nos.lol`, `relay.nostr.band`, `relay.primal.net`, `nostr.wine`, `relay.snort.social`, `purplepag.es`, plus NIP-50 search relays (`relay.nostr.band`, `relay.noswhere.com`, `search.nos.today`), (b) direct HTTP fetches, (c) GitHub API. **All relay counts are samples** (capped by `limit` + relay-side caps), not network totals — treat them as relative signal, not census data. Unverified items are flagged explicitly at the end.

---

## 0. Headline findings

1. **nostrich.love is effectively absent from Nostr itself.** Its account `npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl` (`_@nostrich.love`) has posted **nothing since 2026-04-17** (155 notes in Feb, 31 in Mar, 15 in Apr, 0 since), has **0 long-form articles (kind 30023)**, follows only **25 accounts**, has **~65 followers** (sampled kind-3 lookups), and has received **33 zap receipts total**. It has published **one** NIP-51 list, titled `Test` (kind 30003). Meanwhile it operates 16 guides × 7 locales and a 542-account curated database at `/Users/piotrczarnoleski/nostr-beginner-guide/src/data/follow-pack/accounts.ts`. **The content exists; the Nostr-native artifacts do not.**
2. **No major client links out to any third-party onboarding guide.** Verified: Damus (damus.io homepage links only to press articles, events, store, GitHub), Amethyst (README has zero educational outbound links), nstart's completion screen (links only to chachi.chat, coracle.social, jumble.social, nostur.com, olas.app, nostrapps.com). This is the single largest untapped backlink/referral surface in the ecosystem.
3. **The long-form layer is consolidating and one of its pillars just died.** `habla.news` returns **HTTP 404**; the Habla source repo `github.com/purrgrammer/habla` is **archived** (last push 2026-03-20). Habla survives only at `https://habla.coracle.social/`. Highlighter (`highlighter.com`) is up. YakiHonne got an OpenSats grant in Dec 2025 and is the most feature-complete long-form publisher.
4. **Follow packs (kind 39089) are a live, under-exploited discovery surface** — 328 sampled in a single query, supported natively in Primal's Explore and catalogued at `https://following.space` (built by calle). nostrich.love publishes none despite having the data.
5. **Highlights (NIP-84, kind 9802) pull arbitrary web pages into Nostr feeds.** In a 180-day sample of 620 highlights, the most-highlighted domains were ordinary blogs (`mariozechner.at`:36, `rmoff.net`:29, `geohot.github.io`:23, `larsfaye.com`:22, `dergigi.com`:5). External guide pages *do* get highlighted and thereby distributed — this is a real, cheap mechanic.

---

## 1. Long-form (NIP-23 / kind 30023): who publishes, who reads, current state

### 1.1 The clients

| Client | URL | Status (verified 2026-07-27) | Discovery surface |
|---|---|---|---|
| **YakiHonne** | https://yakihonne.com | Live. Web/iOS/Android/macOS/Windows. OpenSats grant Dec 2025 | "Discover" section, curations, **Smart Widgets (kind 30033)** — interactive mini-apps embeddable in feeds; curations/videos/polls are now Tools Smart Widgets. Creator portal with drafts/dashboard. Repo for mini-apps: https://github.com/YakiHonne/agentic-mini-apps |
| **Habla** | https://habla.coracle.social/ (old `habla.news` = **404**) | Repo `purrgrammer/habla` **ARCHIVED**, last push 2026-03-20. Older `verbiricha/habla.news` last push 2025-07-17 | Curated collections by topic (Welcome, Social Media, Nostr, Technology & AI, Health & Diet, Art, Parenting), tag browsing, highlights section |
| **Highlighter** | https://highlighter.com | Live (HTTP 200). By PabloF7z | Creator toolbox: publishing + subscriptions + highlights + zap-splits + NIP-32 labels |
| **Primal Reads** | https://primal.net | Live, v3.0 shipped March 2026 (Spark wallet, polls, Remote Login) | **Reads tab** (launched with v2.0, 2024-11-21) with feeds: Nostr Reads, Bitcoin Reads, Philosophy Reads, News Reads + **Feed Marketplace** (DVM-powered custom/paid feeds) + **Explore tab** + advanced search. Trending is gated by a **web-of-trust humanity inference** over the social graph — bot-resistant, so genuine engagement is the only lever |
| **Untype** | https://untype.app | Live (HTTP 200) | Long-form writing/publishing client |
| **Decent Newsroom** | https://decentnewsroom.com (npub `npub1ez09adke4vy8udk3y2skwst8q5chjgqzym9lpq4u58zf96zcl7kqyry2lz`) | Active — appeared in live 90d long-form author sample | Curated publications (kind 30040 — **155 sampled in 90d**) |
| **npub.pro** | https://npub.pro | Live, by the nostr.band team | **Turns your kind-30023 + kind-1 events into a server-rendered, SEO-optimised website.** Free, open source, self-hostable. This is the one Nostr-native tool that produces Google-indexable HTML from Nostr events |

### 1.2 What is actually being published (live sample)

Query: kind 30023, `#t` in `[nostr, nostrguides, onboarding, nostr101, guide, tutorial]`, last 90 days → **466 events**. Top human authors:

| Articles | Account | npub |
|---|---|---|
| 75 | Freedom.Tech (`_@freedom.tech`) | `npub18vt3qe6evck03re3j25g8mp8m4ychuymak8xvetvem32504rf0kqj6ytca` |
| 31 | Max (`max@towardsliberty.com`) | `npub1klkk3vrzme455yh9rl2jshq7rc8dpegj3ndf82c3ks2sk40dxt7qulx3vt` |
| 17 | Venturex | `npub1ygjl7t8kchgyfvd39qshttakmztm78yw462ghpqk32knh5jvshxs4n2hkf` |
| 16 | Eporediese | `npub1sxqxjpr7237c2zrjzls8a2yvdp9reys7n7d69qwnkre72gdd8wrs63kaqv` |
| 14 | Akamaister | `npub19wvckp8z58lxs4djuz43pwujka6tthaq77yjd3axttsgppnj0ersgdguvd` |
| 6 | Dikaios1517 (`dikaios1517@nostrplebs.com`) | `npub1kun5628raxpm7usdkj62z2337hr77f3ryrg9cf0vjpyf4jvk9r9smv3lhe` |
| 3 | **Nostr Compass** | `npub1wav4fae3gyfy3xj298kxj2mj8phavz7vavps34przq02j7w902qq902923` |
| 3 | Decent Newsroom | `npub1ez09adke4vy8udk3y2skwst8q5chjgqzym9lpq4u58zf96zcl7kqyry2lz` |

Top topic tags across a broader 30-day 30023 sample (957 events): `bitcoin`:53, `nostr`:44, `usa`:34, `email`:31, `ai`:13, `lightning`:10, `privacy`:8, `longform`:7, **`nostrguides`:6**.

**Two things this data says loudly:**
- The long-form niche for *Nostr education* is nearly empty of serious, sustained publishers. A 16-guide corpus cross-posted as kind 30023 would immediately be among the largest coherent bodies of onboarding long-form on the protocol.
- The channel is polluted with bots/AI agents (`bzz-e2e-alice` shipped 12 test articles in one day; several "AI Agent" accounts in the top-30). Human, edited, multilingual content is a differentiator, not a commodity.

### 1.3 Adjacent long-form-ish surfaces

- **NIP-54 wiki (kind 30818)** — 266 entries in a 90-day sample. Client: https://wikifreedia.xyz (live, by PabloF7z). Spec: https://nips.nostr.com/54. Low volume, low competition; a wiki entry for "Nostr", "relay", "zap", "NIP-05" is trivially winnable.
- **castr.me** (http://castr.me/) — auto-generates a podcast RSS feed from any npub.
- **Nostrbook** — https://nostrbook.dev — "A Comprehensive Registry of Nostr Documentation."

---

## 2. Discovery surfaces inside clients

| Surface | Mechanism | How you get into it |
|---|---|---|
| **Primal Explore / Reads / Feed Marketplace** | DVM-backed custom feeds; WoT-gated trending | Genuine engagement from WoT-connected accounts. Primal explicitly rebuilt trending on "web of trust to infer humanity of a pubkey based on its connections" — buying/botting does nothing |
| **Jumble** (https://jumble.social, `CodyTseng/jumble`, pushed 2026-07-27, 206★) | **Relay-feed browsing** — you pick a relay and read its feed | Publish to topical/community relays, not just the big five. Note: nostrich.love already ships `/relay-feed-browser` — same mental model, so Jumble's audience is pre-qualified. Notable forks: `fevela.me` (@daniele/dtonon), `x21.com` (@Karnage), `jumble.imwald.eu` (@Silberengel) |
| **AlgoRelay** (https://github.com/bitvora/algo-relay, by uxto) | Nostr-native algorithmic relay; weights your interactions with authors + global engagement + recency decay + viral thresholds. Deployed at `coracle.social/relays` | ⚠️ Repo **stale since 2025-03-01**. Still deployed but do not build a strategy on it |
| **Follow packs — kind 39089** | Curated npub lists, native in Primal (shipped to Android post-3.0, March 2026); directory at https://following.space (by calle) | Publish your own. 328 sampled packs exist; sample titles: "Nostr Streamers", "Local Bitcoiners — All Supporters", "Muslims", "Monero Extremists", "Content Bots", "Science". Nobody owns the "New to Nostr" / per-interest onboarding pack space |
| **Highlights — NIP-84, kind 9802** | A highlight event carries an `r` tag with the source URL; it renders in feeds with attribution | Make pages highlight-friendly (selectable text, stable anchors, no JS interception), then seed highlights via Highlighter |
| **Calendar events — NIP-52, kinds 31922/31923** | 577 created in last 60d; **324 upcoming** at time of query | Dominated by Bitcoin meetups (Einundzwanzig chapters, BitDevs Socratic Seminars, Bitcoin & Beers, Brighton/Canterbury/Leamington UK meetups, Medellín, Chalchuapa). Publishing a recurring "Nostr 101 office hours" calendar event puts you in a low-competition feed |
| **Search relays** | NIP-50 on `relay.nostr.band`, `relay.noswhere.com`, `search.nos.today` | Current standing: querying `"nostrich.love"` returns **15 events, ~10 unique accounts, mostly the project's own account**. Querying `"nostr.how"` returns **41** including an unsolicited 2026-07-22 note calling it "the gold standard, non-technical guide designed specifically for beginners" |

### 2.1 Zaps: what's actually true

- Zaps are **the closest thing Nostr has to native trending** — Primal and zaplife.lol expose "most zapped" timelines, and AlgoRelay weights zaps in its ranking function.
- Zap-sorted comment threads mean a zapped reply **stays pinned to the top by amount** — that is the cheapest, most reliable amplification primitive on the protocol: zap your own useful reply on a big account's thread and your link sits above everything else.
- Zaps do **not** buy trending on Primal — the WoT humanity filter breaks that.
- nostrich.love's account is zap-ready (`lud16: nostrich@wallet.yakihonne.com`, plus an `lud06` LNURL), which is a prerequisite, but 33 lifetime zap receipts means it has never been used as a mechanic.

---

## 3. Audio, live, and podcasts

### 3.1 Live/audio (measured: kind 30311, 381 events in 90 days)

Services by volume: **zap.stream** (`api-core`+`api-uk`+`api-ca` = 92), **streamstr.net** (41), **shosho.live** (27), livepeercdn (15), **letsfo.com** (12), **cornychat.com** (12+ rooms).

- **Corny Chat — https://cornychat.com — the actually-active audio-space surface.** Repo `vicariousdrama/cornychat` (pushed 2026-06-01), built on Jam, integrates Nostr + Lightning. Rooms auto-announce to Nostr as kind-1 notes: `🌽 Audio Space started! 🌽 <room> https://cornychat.com/<room>?t=… #cornychat #audiospace #grownostr`. Observed recurring rooms: `hodlem`, `hfsp`, `ngfr`, `moooooonboi`, `lundimalin` (French, "les Lundi Malin des copains de Copin"). Free announcement channel with a stable hashtag.
- **Nostr Nests — ⚠️ IN TRANSITION, DO NOT RELY ON.** `https://nostrnests.com/` times out from this machine (curl, 40s, HTTP/1.1 — 0 bytes). Repo `nostrnests/nests` last pushed 2026-06-11 (36★). Live relay search surfaced a July 2026 dispute: "I could not bring myself to work on the Nests rewrite while being exhausted, under public pressure" (2026-07-21) and "Derek started hosting Nostr Nests independently based on Jam software" (2026-07-21). Derek Ross's profile still lists `🪺 NostrNests.com`. Verify status before pitching.
- **zap.stream** — https://zap.stream, live, largest live-video surface, `_@zap.stream` = `npub1eaz6dwsnvwkha5sn5puwwyxjgy26uusundrm684lg3vw4ma5c2jsqarcgz`.

### 3.2 Podcasts (all URLs status-checked)

| Show | URL | Status / notes |
|---|---|---|
| **Plebchain Radio** | https://fountain.fm/show/0N6GGdZuYNNG7ysagCg9 · Apple id1691033484 | Live (HTTP 200). Hosts **Avi Burra + QW**. Weekly live audio, "made for plebs, by plebs." 2026 episodes confirmed. Prior guests: Vitor Pamplona (Amethyst), Derek Ross (Soapbox), David Strayhorn (NosFabrica) on Web of Trust. **Best single fit for an onboarding-guide founder interview** |
| **Thank God For Nostr** | https://podcasts.apple.com/us/podcast/thank-god-for-nostr/id1694064646 | Hosted by **Jon (hodlbod — Coracle/Flotilla dev)** and Jordan. Nostr through a Christian lens. Guests have included Alex Gleason (Ditto), Jeff Gardner, Tim Bouma |
| **Nostr Compass podcast** | https://podcast.nostrcompass.org/ | Live (200). Weekly interviews with Nostr developers |
| **Nostrovia** | https://nostrovia.org/ | Live (200). "The Original Nostr Podcast", news roundup |
| **Nostr Talks** | https://www.curiousdk.com/podcast | Live (200). News + interviews |
| **No Solutions** | https://fountain.fm/show/1jdehAGo1tgBdKZXIo8K · npub `npub1n00yy9y3704drtpph5wszen64w287nquftkcwcjv7gnnkpk2q54s73000n` (`no-solutions@sovereignengineering.io`) | **Actively publishing to Nostr** — `nosolutions` was the 8th-most-used tag in the 30-day long-form sample (17 events). Tied to Sovereign Engineering. Co-hosts referenced in-thread: WhisperHash + Gigi |
| **Citadel Dispatch** | https://citadeldispatch.com · ODELL `npub1qny3tkh0acurzla8x3zy4nhrjz5zd8l9sy9jys09umwng00manysew95gx` | Active 2020–2026, audience-funded, no ads. Broader freedom-tech than Nostr-only; CD63 was the original "building nostr" episode with fiatjaf/jb55/Kukks |
| **La Cosa Nostr** | TuneIn p3709902 | Interviews with relay operators/builders |
| **Bitcoin And…** | https://fountain.fm/show/eK5XaSb3UaLRavU3lYrI | Daily news |
| **Nostr Rising** | https://bitcoin.review/nostr/ | Bitcoin.Review series |

**Fountain** (https://fountain.fm) is the Nostr-native podcast client: your Fountain profile *is* your Nostr profile, its home feed is "Nostr's audio layer," and audio links posted from Primal/other clients surface in Fountain. Blog: https://blog.fountain.fm/p/1-1.

---

## 4. Newsletters & aggregators

| Outlet | URL | Cadence / submission path |
|---|---|---|
| **Nostr Compass** | https://nostrcompass.org/en/newsletters/ · npub `npub1wav4fae3gyfy3xj298kxj2mj8phavz7vavps34przq02j7w902qq902923` | **Weekly.** Sections: News, Releases, Project Updates, NIP Updates, Special Features. Also maintains a **826-project directory** (https://nostrcompass.org/en/projects/) with a 28-entry "Long-form clients" category. **Explicit submission channel: "Building something or have news to share? Reach out" via NIP-17 DM.** Highest-value, lowest-friction placement found |
| **The Nostr Review** | https://thenostrreview.substack.com | **Biweekly** Substack, issue-per-fortnight format. Has covered YakiHonne Smart Widgets in depth |
| **ON NOSTR** (by Craig) | https://onnostr.substack.com | Reviews individual clients (YakiHonne, Coracle, Primal/Damus roundups, Blossom). A "5 Nostr Clients to Try Out" style outlet — natural home for a simulators/comparison pitch |
| **Nostr Report** | https://nostr.report/ | ⚠️ **TLS certificate expired** (curl `ssl_verify_result=20`; serves 200 only with `-k`). Site appears unmaintained |
| **nostr.band / npub.pro** | https://nostr.band | Search + stats + the npub.pro website generator |
| **njump** | https://njump.me — fiatjaf, open source, **server-rendered** | Nostr's SEO gateway: every event/profile gets an indexable HTML page. Its own outbound links are only `nstart.me` + `nostrapps.com` |
| **nostr.report / nostrarchives.com / stats.andotherstuff.org** | https://nostrarchives.com , https://stats.andotherstuff.org | Trending + network analytics |
| **Stacker News** `~nostr` | https://stacker.news/~nostr | Sats-for-posts forum, historically the strongest referral source for Nostr guide sites (the "Updated list of Nostr resources for newcomers" thread is a canonical example). Territories cost 100k sats/mo to found; posting in `~nostr` is free |

---

## 5. Directories & onboarding funnels — the concrete backlink map

### Already listed (verified)
- **awesome-nostr / nostr.net** — `https://github.com/aljazceru/awesome-nostr` (2,949★, pushed 2026-07-27). Entry exists: *"nostrich.love (https://nostrich.love/) — a normie-friendly introduction and quick start guide"*, alongside nostr.how, nostr.com, usenostr.org, Building Nostr, Nostrbook, Nostr Playground.
- **nostr-resources.com** — `https://github.com/nostr-resources/nostr-resources.github.io`, `index.md` line 551: `[nostrich.love](https://nostrich.love/) by [pitiunited](nostr:npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4)`. Added via PR #113 (~2026-04-15). Contribution rule, quoted: "Simply create a pull-request or an issue. All contributions welcome, unless they are shitcoinery or shameless shilling."

### Not listed — open, specific asks
| Target | Where | The ask |
|---|---|---|
| **nostrapps.com** | Submission flow routes to `gitworkshop.dev/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6/nostrapps-com/tree/master/apps.toml` | It has an **"Onboarding" category** (currently containing Nstart) and a **"Discovery"** and **"Curation"** category. The `/simulators` product is a legitimate app submission, not a guide listing — that's the wedge |
| **Nstart** (`github.com/dtonon/nstart`, 66★, last push 2025-09-24) | `src/routes/[lang]/finish/+page.svelte` currently links **only** to chachi.chat, coracle.social, jumble.social, nostur.com, olas.app, nostrapps.com | Add a "learn more" link on the completion screen. Nstart is the shared onboarding funnel for **Coracle, Volare (Android), jumble.social, flotilla.social, nosotros.app**, plus every `nostr-login` site (npub.pro, nostr.band, whynostr.org). It already has `pl.json`, `de.json`, `es.json`, `zh.json`, `fa.json` translations — matching nostrich.love's locale set, which makes a localized link *more* valuable to them, not less. Integration URL contract: `https://nstart.me?an=<AppName>&at=<web\|popup\|android\|ios>&ac=<returnURL>`, with `al=` (language), `aa=` (accent hex), `am=` (dark mode), `asf=` (skip follows) |
| **Nostr Compass projects directory** | https://nostrcompass.org/en/projects/ (826 projects, categorised) | No "education/guides" category yet — propose one, or land under Other/Discovery |
| **njump** | fiatjaf's repo, server-rendered "Apps & Resources" page | Currently links nstart.me, nostrapps.com, nostrdesign.org, fiatjaf.com/nostr.html. A resources-page PR is plausible |
| **Soapbox blog** | https://soapbox.pub/blog/nostr101 by M. K. Fain, **2026-03-11** | Already links out to **nostr.how** for relays, and to nostrapps.com. Soapbox employs **Derek Ross** in DevRel. Direct competitor placement already exists — parity is achievable |
| **Grow Nostr Initiative** | https://grownostr.org (`/get-started`, `/events.html`) — run by Derek Ross (his NIP-05 is literally `derekross@grownostr.org`) | Derek's personal site (derekross.me) already links out to nostrapps.com and Grow Nostr. He is the single highest-leverage individual for a guide-site partnership |

---

## 6. Accounts with reach — a ranked outreach list

### 6.1 The 14 default follows in Nstart (highest structural leverage in the ecosystem)
Every user who completes Nstart is offered these accounts pre-checked. Extracted from `src/routes/[lang]/follow/+page.svelte` and bech32-encoded:

| Name | npub |
|---|---|
| daniele (dtonon, Nstart author) | `npub10000003zmk89narqpczy4ff6rnuht2wu05na7kpnh3mak7z2tqzsv8vwqk` |
| fiatjaf | `npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6` |
| Rabble (nos.social) | `npub1wmr34t36fy03m8hvgl96zl3znndyzyaqhwmwdtshwmtkg03fetaqhjg240` |
| PabloF7z (Highlighter, NDK, Wikifreedia) | `npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft` |
| Alex | `npub1nnn379gxen6tn8erft6fh43q905g82q0jks4t3hf58pkl4l8srrsyjkzrt` |
| jb55 / Will Casarin (Damus) | `npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s` |
| laanwj | `npub1p23eukh0nxsqpfaakz6fj9vvj27y4gs0kevnrffdq4d4adkl7uuq7crnl6` |
| Alex Gleason (Soapbox/Ditto) | `npub1q3sle0kvfsehgsuexttt3ugjd8xdklxfwwkh559wxckmzddywnws6cd26p` |
| Dawn | `npub1cgcwm56v5hyrrzl5ty4vq4kdud63n5u4czgycdl2r3jshzk55ufqe52ndy` |
| hodlbod / Jon Staab (Coracle, Flotilla, TGFN podcast) | `npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn` |
| Michael Dilger (Gossip) | `npub1acg6thl5psv62405rljzkj8spesceyfz2c32udakc2ak0dmvfeyse9p35c` |
| Pam | `npub1pvgcusxk7006hvtlyx555erhq8c5pk9svw57snlxujpkgnkup89sekdx8c` |
| Snowden | `npub1sn0wdenkukak0d9dfczzeacvhkrgz92ak56egt7vdgzn8pv2wfqqhrjdv9` |
| jack | `npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m` |

### 6.2 The onboarding/education niche specifically

| Who | npub / URL | Why they matter |
|---|---|---|
| **Derek Ross** | `npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424` · https://derekross.me · NIP-05 `derekross@grownostr.org` | The ecosystem's designated evangelist. DevRel at Soapbox. Runs Grow Nostr Initiative, NostrNests.com, YakBak.app, Zappix.app, Plektos.app, ZapTrax.app, Zaplytics.app, Podstr.org. Publishes his own guide slideshows (`/guides/what-are-relays.html`, `/guides/what-are-nostr-badges.html`). Speaker at BTC Prague. **He is the person who decides what gets recommended to newcomers.** |
| **JeffG** | `npub1zuuajd7u3sx8xu92yav9jwxpr839cs0kc3q6t56vd5u9q033xmhsk6c2uc` · https://nostr.how | Maintains nostr.how — 11 languages, open source, cited by Soapbox and nostr-resources. The direct competitor; also a plausible cross-link partner (nostrich.love's interactive simulators are complementary, not duplicative) |
| **Pluja** | `npub1jh4qu2g5e49syrwh293q8q90xeklvdx47pnj5vyca2tkljed08us0ctj6k` · https://usenostr.org | Guide site in en/es/fr/ja/pt; actively updated (relay guide reshared 2026-07-26) |
| **Aljaz** | `npub1aljazgxlpnpfp7n5sunlk3dvfp72456x6nezjw4sd850q879rxqsthg9jp` | Maintains awesome-nostr/nostr.net (2,949★, daily commits) |
| **Gigi** | `npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc` · dergigi.com (already in your `accounts.ts`) | Highest-prestige Nostr essayist; dergigi.com appears in the highlights domain sample |
| **Nostr Compass** | `npub1wav4fae3gyfy3xj298kxj2mj8phavz7vavps34przq02j7w902qq902923` | Newsletter + podcast + directory in one |
| **calle** | https://following.space | Follow-pack directory gatekeeper |
| **pitiunited** | `npub178umpxtdflcm7a08nexvs4mu384kx0ngg9w8ltm5eut6q7lcp0vq05qrg4` (`_@thisbitcointhing.com`) | Already credited as the nostrich.love submitter on nostr-resources; existing ally |
| **Renaud Lifchitz** | `npub1renaud65zug8r570ndztde2xhk206z3v50a5mwa3kp2xshy3zmjqkqaw97` (`nono2357@nostr.fr`) | Shared nostrich.love unprompted (2026-02-22); also writes French relay tutorials under `#nostrfr` |
| **ever4st** | `npub1mwce4c8qa2zn9zw9f372syrc9dsnqmyy3jkcmpqkzaze0slj94dqu6nmwy` | Shared `/simulators` unprompted 2026-04-27: "this one is fun". Organic advocate |

---

## 7. Conferences & meetups (2026, dated)

| Event | Dates | Location | URL |
|---|---|---|---|
| **BTC Prague 2026** | 11–13 Jun 2026 (past) | PVA Expo Praha | https://btcprague.com/program/ — covers Bitcoin, Lightning, **Nostr**, Cashu, privacy. Derek Ross was a listed speaker |
| **Sovereign Engineering SEC-08 ("YOLO++")** | started 20 Jul 2026, 6 weeks | Cowork Funchal, Madeira | https://sovereignengineering.io — free if selected; the residency that produced the No Solutions podcast. Apply via "upcoming cohorts" |
| **Nostriga 2026 / Baltic Honeybadger** | 28–30 Aug 2026 | Riga, Latvia | https://baltichoneybadger.com/nostriga · https://nostr.world/faq/index.html · agenda repo `github.com/nostrworld/nostriga-agenda-staging`. Unconference format — lowest barrier to getting on a schedule of any Nostr event |
| **Bitfest UK / Nostrshire 2026** | 1 Nov 2026 | Manchester, UK | https://bitfest.uk — "the second annual UK Nostr conference" |
| **Bitcoin Amsterdam 2026** | 13–14 Nov 2026 | Westergasfabriek, Amsterdam | https://b.tc/conference/amsterdam — "dedicated Nostr programming" |
| **Nostr Nights @ Bitcoin Park Nashville** | #1 = 2 Feb 2026 (Will Casarin/Damus), #2 = 11 May 2026 | Nashville, TN | https://bitcoinpark.com — recurring series, ⚠️ next date not found |
| **Nostr London / Cyphermunk House** | monthly / weekly | London | https://nostr.co.uk/events/ |
| **Grassroots meetup layer** | continuous | global | Measured via NIP-52: 324 upcoming events. Repeating series: **Einundzwanzig** chapters (DE/AT/CZ), **BitDevs Socratic Seminars** (#51 London, #27 PR, Seattle, Boston), Bitcoin & Beers, Brighton/Canterbury/Leamington Spa, Medellín, Chalchuapa (SV), Naples, Jaipur |

---

## 8. Off-Nostr community channels

- **Stacker News `~nostr`** — https://stacker.news/~nostr. Sats-rewarded; historically the highest-converting single post surface for Nostr guide launches.
- **Telegram** — `https://t.me/Nostrtalk` (newcomer-oriented links group) and `https://t.me/nostr_protocol` (protocol discussion). ⚠️ Both surfaced via a Stacker News resource post, not verified live by me. Habla's team historically ran a Telegram for design conversations.
- **W3C Nostr Community Group** — https://www.w3.org/groups/cg/nostr, chaired by **Melvin Carvalho**, GitHub org `github.com/nostrcg` (which also publishes https://nostrcg.github.io/devguide/). Free to join, standards-adjacent credibility, and a legitimate venue for i18n/accessibility work on onboarding.
- **NIP-29 relay-based groups** — the Nostr-native replacement for Discord/Telegram. Clients: **Chachi** (chachi.chat — one of the five apps Nstart hands new users), **Flotilla** (flotilla.social, hodlbod), **Nostrord** (OpenSats-funded April 2026, `github.com/Nostrord/nostrord`). A "Nostr Newcomers" NIP-29 group is currently unclaimed territory.
- **Reddit / Discord** — ⚠️ not verified in this pass.

---

## 9. How clients handle "new user has no idea what to do" — and the partnership angle

**What actually happens today:**

1. **Primal** (the default recommendation for ~99% of newcomers): keypair + funded wallet in under a minute; interest-topic picker at signup that pre-populates the home feed with Primal-chosen accounts; Explore tab (feeds/profiles/people/zaps/media/hashtags); Reads tab; Remote Login via desktop QR so the nsec is never typed. Documented critique: topic-based auto-follow "can artificially inflate certain users' exposure, while other users who might be quality follows for that topic aren't seen at all."
2. **Nstart** (Coracle, Volare, jumble.social, flotilla.social, nosotros.app, plus all `nostr-login` sites): key generation → local nsec/ncryptsec backup → optional email backup → **FROST multi-signer bunker via promenade** (nsec split across 3+ remote signers) → follow-suggestions step (the 14 accounts above, plus the inviter's contact list if the URL is personalized with an npub) → app picker. **The wizard explains the protocol inline and then stops.** No link to any deeper guide.
3. **Damus**: no external educational link anywhere on damus.io. Only inline copy: "Damus is built on Nostr, a decentralized and open social network protocol."
4. **Amethyst**: README is developer-facing only; zero educational outbound links.
5. **Wisp** (OpenSats 17th wave, May 2026, `github.com/barrydeen/wisp`) and **44Billion** (browser-based app launcher with ratings/reviews/categories + "two starter apps designed for non-technical users") are the two newest projects explicitly funded to solve the newcomer problem — both are *building* onboarding rather than *linking* to it. Wisp ships a "normie mode" (Lightning balance in USD, gift-card cash-out) and shipped 16 releases in one week per Nostr Compass #15.

**The partnership thesis, stated concretely:** every client team currently either (a) builds its own thin explainer and stops, or (b) says nothing. None of them wants to maintain a 7-language, 16-guide curriculum. The realistic asks, ranked by effort-to-value:

1. **Nstart completion-screen link** (one PR, one file, `src/routes/[lang]/finish/+page.svelte`) — highest fan-out because ~6 clients funnel through it, and nostrich.love's locale set (en/pl/es/de/zh/ar/hi) overlaps Nstart's translation set.
2. **nostrapps.com listing for `/simulators`** under the Onboarding or Discovery category — it is genuinely an app, so this is not a guide-directory ask.
3. **Derek Ross / Grow Nostr** cross-link + a Grow Nostr events co-presence. He is a one-stop distribution node (Soapbox DevRel + Nests + Grow Nostr + conference circuit).
4. **Nostr Compass weekly newsletter** — explicit open submission via NIP-17 DM to `npub1wav4fae3gyfy3xj298kxj2mj8phavz7vavps34przq02j7w902qq902923`.
5. **Damus / Amethyst "what is Nostr?" link** — hardest ask (no precedent, both are minimal-surface projects), but the highest-traffic prize; approach via jb55 and Vitor Pamplona only after 1–4 create social proof.

---

## 10. Recommendations, each tied to a specific finding above

| # | Action | Grounded in |
|---|---|---|
| 1 | **Restart the `_@nostrich.love` account.** It has been silent since 2026-04-17 while a WoT-gated ecosystem forgets dormant pubkeys. 25 follows / 65 followers is below the threshold where the outbox model and Primal's WoT trending will surface anything | §0.1 measured |
| 2 | **Cross-post all 16 EN guides as kind 30023 with `#t` = `nostr`, `nostrguides`, `onboarding`.** The account has published zero. `nostrguides` had only 6 events in 30 days — the tag is effectively unclaimed. Publish to `relay.damus.io`, `nos.lol`, `relay.primal.net`, `relay.nostr.band`, `nostr.wine` so Primal Reads and Habla can index them | §1.2 measured |
| 3 | **Publish the 542-account `accounts.ts` database as kind 39089 follow packs, one per category.** 328 packs exist network-wide and none targets newcomers by interest. Primal Explore renders them natively; following.space catalogues them. The data is already written and validated in-repo | §2 measured, `src/data/follow-pack/accounts.ts` |
| 4 | **Add the site's own guides to habla.coracle.social and Highlighter, not habla.news.** `habla.news` 404s and the repo is archived — any existing link to it is dead | §1.1 verified |
| 5 | **Mirror long-form via npub.pro.** It server-renders Nostr events into SEO-indexable pages, which is the only Nostr-native path to Google that exists | §1.1 |
| 6 | **Seed NIP-84 highlights of your own guide pages.** Verified that arbitrary blog domains dominate the highlight stream — the mechanic works and nobody in the education niche uses it | §2 measured |
| 7 | **Claim NIP-54 wiki entries** for `nostr`, `relay`, `zap`, `nip-05`, `outbox model` on wikifreedia.xyz. 266 entries in 90 days = near-zero competition, and each entry links back | §1.3 measured |
| 8 | **Publish recurring NIP-52 calendar events** ("Nostr 101 office hours") — 324 upcoming events, ~all Bitcoin meetups, zero onboarding-education entries | §2 measured |
| 9 | **Book Plebchain Radio, Nostr Compass podcast, ON NOSTR.** All three take guests/pitches, all three cover exactly this beat, all three verified live | §3.2 |
| 10 | **Open the four PRs/submissions in §9** in that order | §5, §9 |
| 11 | **Zap-pin replies.** Zap-sorted comment threads pin the highest-value zap to the top — the cheapest guaranteed placement on the protocol, and the account already has `lud16`/`lud06` configured | §2.1 |
| 12 | **Fix the NIP-65 relay list.** Current list is `nostr.mom`, `relay.damus.io`, `nostr-01.yakihonne.com`, `nos.lol`, `indexer.coracle.social`, `purplepag.es` — missing `relay.primal.net` (Primal's own index), `relay.nostr.band` (search/NIP-50), `nostr.wine`. Under the outbox model, absent write relays = invisible content | §0.1 measured |

---

## 11. Explicitly NOT verified / open questions

- **Nostr Nests operational status.** `nostrnests.com` times out from this machine (40s, HTTP/1.1). Relay chatter from 2026-07-21 describes a contested rewrite/migration and Derek Ross hosting independently on Jam. Repo alive (2026-06-11). **Confirm before pitching a Nests appearance.**
- **grownostr.org** also times out from plain curl but returns content via WebFetch — likely bot protection rather than downtime, but I could not confirm the site's current link structure or a partner/listing page.
- **nostr.report** serves 200 only with certificate verification disabled (expired cert). Probably abandoned; do not chase.
- **Telegram groups** `t.me/Nostrtalk` and `t.me/nostr_protocol` were cited in a secondary source, not opened by me. **No SimpleX or Discord Nostr group was verifiably located** — the ecosystem appears to have migrated group chat to NIP-29 (Chachi/Flotilla/Nostrord) and Corny Chat.
- **YakiHonne writer rewards/points program** — repeatedly rumored in search results, but I found no primary-source confirmation. Its Lightning/Cashu/Nutzaps monetization is confirmed; a formal creator-rewards program is not.
- **Exact follower counts** for any account, including nostrich.love's ~65. Relay-side `limit` caps make kind-3 follower counting a lower bound, and nostr.band's public API (`api.nostr.band/v0/trending/*`, `/v0/stats`) returned empty bodies for every request, with and without a browser User-Agent.
- **grep.app and GitHub code search** are both blocked from this environment, so "which client repos hardcode a link to nostr.how / nostrich.love" could not be answered exhaustively. The five clients I checked by hand (Damus site, Amethyst README, Nstart source, njump, usenostr) are a sample, not a census.
- **Identity of "Alex"** `npub1nnn379gxen6tn8erft6fh43q905g82q0jks4t3hf58pkl4l8srrsyjkzrt` in the Nstart default-follow list (distinct from Alex Gleason) — not resolved.
- **The 2026-07-22 "nostr.how is the gold standard" note** (`npub1al9wl7…`) reads like AI-generated commentary; I would not cite it as human sentiment.