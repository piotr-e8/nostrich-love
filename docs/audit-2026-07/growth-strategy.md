# Growth strategy — from the 2026-07 audit

Two strategists worked independently from opposite premises (SEO-compounding vs
Nostr-native loops). **They converged on the same wedge**, which is the
strongest signal in the whole exercise. Three judge panels then scored both and
named the claims that were wishful thinking; those are cut here rather than
softened.

Source material: `market-research.md` in this directory.

---

## The wedge

**Task × client instructional pages, built on the simulators.**
"How to back up your key in Damus", "How to change your relays in Primal",
"How to turn on private messages in Amethyst".

Why this and not general Nostr education:

- `awesome-nostr` (2,949★, pushed daily) is the ecosystem's canonical directory.
  Its **Tutorials section contains only developer content** — build-your-first-app
  videos, "how to set up a paid relay", strfry. There is no end-user task
  tutorial anywhere in it.
- Page 1 for `damus tutorial` is four GitHub forks of the damus repo plus a 2023
  blog post and its scraped mirror. `primal tutorial` returns a Typefully thread
  and two raw `nostr.com/nevent1q…` permalinks.
- The simulators are already built. Each task page has a working demo attached,
  which nobody else can offer cheaply.

### What the judges cut

Do not repeat these in a pitch or a plan — they were checked and do not hold:

| Claim | Why it fails |
|---|---|
| "Structurally uncopyable without building 10 simulators first" | False, and it was load-bearing under both plans. "How to back up your key in Damus" is 600 words and a few screenshots. |
| "Zero competition" on the task cluster | Overstated. Thin incumbents ≠ none. |
| Traffic bands (7–14k, 5–12k sessions at month 12) | Built on Wikipedia pageviews as a demand proxy. No Search Console, Ahrefs or GKP data exists for this site or any competitor. |
| HN points → sessions ("3,000–8,000 visits in 48h") | No source for the conversion. |
| Embeddable simulators → "5–15 embedding sites in 6 months" | No Nostr client has ever embedded a third-party widget. |
| "10 simulators" | The live page renders 9. `src/pages/simulators/` has 9 routes; `src/simulators/` has 10 directories. |
| awesome-nostr + nstart as "the two highest-authority backlinks" | README links are `nofollow`; nstart is 66★. They are referral and positioning, not SEO. |

**There is no traffic baseline.** Cloudflare Web Analytics records no custom
events and samples beyond 24 hours. Instrument before forecasting.

---

## 30 days

Most of this block was completed during the audit session. What remains:

| Status | Action |
|---|---|
| ✅ done `2c86270` | Server-render the guides hub |
| ✅ done `0c47a5c` | Delete the level-gate |
| ✅ done `0011dfd`, `7e273e7` | Fix the harmful content claims (NIP-05 hex, nsec pasting, NIP-17 privacy) |
| ✅ done `264a1c9` | Fix the crashing simulators |
| ✅ done `7832ee8` | CI gate — both plans scheduled this for month 12; it was cheaper than they thought |
| ☐ | **Connect Search Console.** Without it every number below stays a guess. |
| ☐ | **Retitle the guides to query strings.** `what-is-nostr` → "What Is Nostr? A Beginner's Guide (2026)"; `keys-and-security` → "nsec vs npub: Nostr Keys Explained". Current titles ("Nostr Explained Simply", "Your Keys, Your Identity") match no query. Half a day, cheapest ranking action available. |
| ☐ | **Two PRs to `awesome-nostr`.** Line 789 has anchor text "nostrich.love" pointing at `uselessshit.co`. Fix it, and add the site to the (empty of end-user content) Tutorials section. |
| ☐ | **Fix `/simulators` copy**: `index.astro:15` says "7 different Nostr clients". |
| ☐ | **Revive the site npub** `npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl` and fix its NIP-65 relay list. |
| ☐ | **Weekly Stacker News cadence** in `~nostr`, 30 sats/post, one deep page per week — never the homepage. |

---

## 90 days

- **Split `protocol-comparison.mdx`** (2,826 words) into `/nostr-vs-bluesky/`,
  `/nostr-vs-mastodon/`, `/nostr-vs-twitter/`. The judges flagged that both
  plans buried this: it is the **only lever touching a pool larger than the
  capped Nostr niche** — Bluesky ~7×, Fediverse ~3×, Mastodon ~2.5×. Page 1 for
  `nostr vs bluesky` is a Slashdot auto-generated stub.
- **Rewrite the 9 simulator pages as real client pages** — page-level `<h1>`
  ("How to Use Damus — Interactive Demo and Setup Guide"), 600+ crawlable words.
  They currently emit ~100. Note: they are `noindex` right now pending the
  sandstr split; that has to be resolved first.
- **First 20 task × client pages** — 4 clients × 5 tasks.
- **JSON-LD** via an optional `schema` prop on `SEO.astro`: Organization +
  WebSite on the homepage, BreadcrumbList + Article on guides, FAQPage on the
  FAQ. Currently zero structured data on 152 pages.
- **Standalone URLs for the tools**: `/tools/nip05-checker/`,
  `/tools/key-generator/`, `/tools/client-recommender/`. The leading result for
  `nip05 checker` is a bare PHP page.
- **NIP-23 syndication** — publish the 16 EN guides as kind 30023 from the site
  npub.
- **`Show HN`** pointing at `/simulators/`, once. Precedent: Nostr Web 101 pts,
  Oracolo 90, Freeport 67 — against usenostr.org's 33 for a beginner guide. The
  simulator angle is the differentiator, not the guide.

---

## 12 months

- Complete the task × client matrix to ~60–80 pages at a sustainable 4–6/month.
- **Localize the wedge, not the shell.** The judges rescued this from the losing
  plan: translate the client pages and top task pages into de/pl/es. A task page
  has value translated; translated navigation does not. Freeze zh/ar/hi.
- Publish the 542-account dataset as kind 39089 follow packs. **First fix
  `nostr:list?d=` and `nostr:followpack?d=`** — both are invalid per NIP-21, and
  in `FollowPackGenerator` that is the only share mechanism. Both plans missed
  this; the research caught it.
- 10 × 60-second vertical shorts using the existing `MobilePhoneFrame`.
- CC-BY-4.0 data endpoints (`/data/accounts.json`, `/data/clients.json`) as a
  citation surface.
- Client partnerships (jb55/Damus, Vitor Pamplona/Amethyst) — **only after**
  awesome-nostr, nstart and Nostr Compass have created social proof.

---

## Stop doing

Both plans agreed on all of this:

- **zh, ar and hi content.** zh.wikipedia has no Nostr article at all and
  Chinese readers reach content via Baidu/WeChat/Zhihu, not Google. The Arabic
  guides are abridged summaries at 14–53% of English. *(Caveat: this conflicts
  with the grant positioning — see `session-handoff.md` §5.)*
- **Six of the eight `/nostr-for-*` pages** — same 198–231 line template,
  160–240 unique words, zero inbound internal links.
- **New simulators and new guides.** Nine and sixteen are enough.
- **The `shared` simulator framework** — 1,155 of its 2,550 lines have no
  importers.
- **Bullet-skeleton content.** Measured flowing-prose share: troubleshooting
  0.04 (34 prose words), protocol-comparison 0.05, multi-client 0.06.

Explicitly do **not**:

- Submit to **Hacker News as a guide**. usenostr.org ran exactly that in April
  2026: 33 points, zero comments. The novelty is spent. Show HN with the
  simulators is a different pitch.
- Add the site to **Wikipedia's External links** yourself. Editor Grayfell
  patrols the Nostr article and reverts primary-source additions.
- Submit to **Privacy Guides**. Their criteria require a social network to let
  you limit who follows you — Nostr cannot.
- Build **email capture**. No backend (`output: 'static'`, `adapter: undefined`)
  and it contradicts the "no tracking, no cookies" claim on `/about`.
- Wire `gamification.ts:920` `publishBadgeToNostr` (NIP-58). **It takes the
  user's private key as an argument.**

---

## Named targets

Kept verbatim because re-deriving them costs hours.

**Repos / directories**
- `github.com/aljazceru/awesome-nostr` — 2,949★, pushed daily, no CONTRIBUTING.md
- `github.com/dtonon/nstart` — 66★, PR to `src/routes/[lang]/finish/+page.svelte`
- `nostrapps.com` — submissions via gitworkshop.dev

**People / publications**
- Derek Ross — `npub18ams6ewn5aj2n3wt2qawzglx9mr4nzksxhvrdc4gzrecw7n5tvjqctp424`, derekross.me, grownostr.org
- Nostr Compass — `npub1wav4fae3gyfy3xj298kxj2mj8phavz7vavps34przq02j7w902qq902923`, nostrcompass.org
- Plebchain Radio — fountain.fm/show/0N6GGdZuYNNG7ysagCg9 (Avi Burra + QW; prior guests include Vitor Pamplona)
- ON NOSTR — onnostr.substack.com, runs a "5 Nostr Clients to Try Out" format

**Communities**
- `stacker.news/~nostr` — 30 sats/post, verified active July 2026
- NostrZH 中文社区 — nostrzh.org; its 资源与链接 page already lists nostr.how
- bitcoinarabic.org — working bylined-contributor pipeline
- Nostriga 2026 — 28–30 Aug, Riga, unconference

**Keyword → page**

| Query | Target | Incumbent |
|---|---|---|
| `nostr vs bluesky` | `/nostr-vs-bluesky/` (new) | Slashdot auto-generated stub |
| `nostr vs mastodon` | `/nostr-vs-mastodon/` (new) | nostr.co.uk, soapbox.pub |
| `nostr vs twitter` | `/nostr-vs-twitter/` (new) | 3 of 5 are programmatic directories |
| `damus tutorial` | `/simulators/damus/` | four GitHub forks + 2023 blog post |
| `how to use amethyst nostr` | `/simulators/amethyst/` | reclaimthenet.org (2023) |
| `primal nostr tutorial` | `/simulators/primal/` | a Typefully thread |
| `how to back up your key in damus` | task × client page | none |
| `nip05 checker` | `/tools/nip05-checker/` | a bare PHP page |
