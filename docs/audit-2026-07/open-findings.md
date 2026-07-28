# Open findings — audit of 2026-07-27

135 critical/high findings were re-verified by opening each file. This lists what
was **still broken at the end of that session**. Items fixed during the session are
not here — see the git log from `e94df88` to `7832ee8`.

Severity is the verifier's corrected value, not the original reporter's.

| # | Sev | Area | Finding | File | Effort |
|---|---|---|---|---|---|
| 1 | critical | accessibility | Every form control in the app is unlabeled — 49 inputs and 18 textareas, zero labels | `src/components/interactive/NIP05Checker.tsx` | M |
| 2 | critical | accessibility | Undefined Tailwind color classes make the KeyGenerator toast invisible (white text on white) | `src/components/interactive/KeyGenerator.tsx` | M |
| 3 | critical | architecture | Badge state model forked 5 ways; /badges reads a field nothing writes | `src/pages/badges.astro` | M |
| 4 | critical | architecture | Guide ordering has three sources of truth; outbox-model is missing from GUIDE_ORDER and its next guide jumps backwards | `src/pages/[...lang]/guides/[slug].astro` | S |
| 5 | critical | build-health | Unbound Copy identifier ships to production and throws ReferenceError | `src/simulators/yakihonne/screens/SettingsScreen.tsx` | S |
| 6 | critical | content-quality | NIP-05 guide tells readers to put npub in nostr.json — spec requires lowercase hex | `src/content/guides/en/nip05-identity.mdx` | S |
| 7 | critical | content-quality | NIP-05 guide invents a DNS TXT record step that does not exist in the protocol | `src/content/guides/en/nip05-identity.mdx` | S |
| 8 | critical | content-quality | Quickstart instructs beginners to paste their nsec to log in; NIP-07 / NIP-46 signers are absent from all 16 guides | `src/content/guides/en/quickstart.mdx` | M |
| 9 | critical | content-quality | NIP-17 guide tells privacy-seeking users relays cannot see who they message — the spec puts the recipient in a plaintext p tag | `src/content/guides/en/nip17-private-messages.mdx` | S |
| 10 | critical | content-quality | NIP-17 guide describes the seal and gift-wrap layers backwards and claims forward secrecy the spec disclaims | `src/content/guides/en/nip17-private-messages.mdx` | M |
| 11 | critical | content-quality | /nostr-for-parents promises family posts "stay private" and are "yours alone" on a fully public, undeletable network | `src/pages/nostr-for-parents.astro` | S |
| 12 | critical | gamification-state | /badges reads a field name that no writer ever produces — every user sees 0 of 8 badges earned forever | `src/pages/badges.astro` | S |
| 13 | critical | i18n-parity | 12 of 16 Hindi guide translation blocks are stored under kebab-case keys and are unreachable | `src/i18n/locales/hi.json` | S |
| 14 | critical | i18n-parity | 92 translation keys referenced in code do not exist in en.json; 23 of them render the raw dotted key as visible UI text | `src/components/interactive/WhatIsNostrQuiz.tsx` | M |
| 15 | critical | islands-hydration | All 7 locale JSON files ship to the browser on every page with a translated island (527 KB / 157 KB gzip) | `src/i18n/index.ts` | M |
| 16 | critical | performance | All 7 locale JSON files are bundled into a single 527KB client chunk | `src/i18n/index.ts` | M |
| 17 | critical | performance | 438 client:load directives and 1 client:visible — every island hydrates eagerly | `src/pages/index.astro` | M |
| 18 | critical | simulators | Gossip thread view crashes on every note click: .map() called on a number | `src/simulators/gossip/screens/ThreadScreen.tsx` | S |
| 19 | critical | simulators | YakiHonne settings key panel references an unimported Copy component -> ReferenceError | `src/simulators/yakihonne/screens/SettingsScreen.tsx` | S |
| 20 | critical | testing-ci-ops | Zero automated tests and zero CI for 84k LOC deploying straight to production | `package.json` | L |
| 21 | critical | ux-funnel | The /guides hub renders zero guide links server-side | `src/components/guides/GuidesContainer.tsx` | M |
| 22 | high | accessibility | Desktop user menu (Progress / Settings) is hover-only and unreachable by keyboard | `src/components/layout/Header.astro` | S |
| 23 | high | accessibility | Mobile menu ships an inverted aria-expanded | `src/components/layout/Header.astro` | S |
| 24 | high | accessibility | Skip link is a dead anchor on 13 pages that have no #main-content target | `src/pages/simulators/damus.astro` | S |
| 25 | high | accessibility | No modal in the codebase traps focus, moves initial focus, or restores focus on close | `src/components/gamification/BadgeEarnedModal.tsx` | M |
| 26 | high | accessibility | Almost no live regions — dynamic results are silent to screen readers | `src/components/interactive/KeyGenerator.tsx` | M |
| 27 | high | accessibility | RTL is broken for Arabic: 307 physical direction utilities, 0 logical ones | `src/components/layout/Header.astro` | L |
| 28 | high | accessibility | Simulator settings toggles are <div onClick> — not focusable, no role, no state | `src/simulators/damus/screens/SettingsScreen.tsx` | M |
| 29 | high | accessibility | Icon-only buttons across the app have no accessible name | `src/components/interactive/PrivacySecurityQuiz.tsx` | M |
| 30 | high | accessibility | Brand primary #8B5CF6 fails AA contrast on white — skip link, primary buttons, 100+ text usages | `src/layouts/Layout.astro` | M |
| 31 | high | accessibility | Quiz answer buttons convey selection/correctness only through dead colour, with no ARIA state | `src/components/interactive/PrivacySecurityQuiz.tsx` | M |
| 32 | high | accessibility | LanguageSwitcher: nameless trigger on mobile plus a fake listbox with no keyboard support | `src/components/LanguageSwitcher.tsx` | S |
| 33 | high | architecture | All 7 locale JSON files statically imported into one module (architecture view) | `src/i18n/index.ts` | M |
| 34 | high | architecture | 306KB curated-account database imported directly by a client island | `src/components/community/FeaturedCreatorsFromPack.tsx` | M |
| 35 | high | architecture | Two competing gamification engines plus a config plus an inline layout script — four writers on one localStorage key | `src/utils/gamificationEngine.ts` | M |
| 36 | high | architecture | No typecheck, lint or test gate; tsconfig scope produces 1,296 errors and hides real bugs | `package.json` | M |
| 37 | high | build-health | All 7 locale JSON files bundled into one 527 KB client chunk (build view) | `src/i18n/index.ts` | M |
| 38 | high | build-health | 306 KB of hardcoded account data compiled into a client bundle loaded by /tools/ and /follow-pack/ | `src/data/follow-pack/accounts.ts` | M |
| 39 | high | build-health | Type checking is entirely non-functional: 1,296 tsc errors, two files that are not valid TypeScript, no CI gate | `package.json` | M |
| 40 | high | build-health | Stale hand-written public/privacy.html shadows the real /privacy route on Vercel | `public/privacy.html` | S |
| 41 | high | content-quality | "Relays share posts with each other" is taught as fact in four guides and contradicted by the site's own protocol-comparison | `src/content/guides/en/relay-guide.mdx` | S |
| 42 | high | content-quality | Two flagship wallet recommendations shut down in Dec 2024 / Jan 2025 and are still the primary onboarding path | `src/content/guides/en/zaps-and-lightning.mdx` | M |
| 43 | high | content-quality | FAQ's "How do zaps work technically" reverses both halves of the NIP-57 flow and claims zaps are non-custodial | `src/content/guides/en/faq.mdx` | M |
| 44 | high | content-quality | Fabricated client UI walkthroughs and invented product descriptions throughout the client-facing guides | `src/content/guides/en/nip17-private-messages.mdx` | L |
| 45 | high | content-quality | NIP-17 guide omits the kind 10050 DM relay list, the spec-mandated top cause of undelivered DMs | `src/content/guides/en/nip17-private-messages.mdx` | M |
| 46 | high | content-quality | All 8 audience landing pages are one template with 160-240 unique words; the only substantive block is client-rendered | `src/pages/nostr-for-parents.astro` | L |
| 47 | high | content-quality | Guides are ~90% bullet fragments; median flowing prose is ~180 words per guide | `src/content/guides/en/nostr-tools.mdx` | L |
| 48 | high | gamification-state | Streak counter is permanently pinned at 0 for anyone who reads a guide | `src/components/progress/ProgressTracker.tsx` | S |
| 49 | high | gamification-state | BadgeEarnedModal is unreachable — listener and dispatcher use different event names | `src/components/gamification/BadgeEarnedModalListener.tsx` | S |
| 50 | high | gamification-state | Level-unlock threshold is computed three different ways, so the UI promises a number the engine does not honour | `src/utils/gamification.ts` | S |
| 51 | high | gamification-state | The privacy settings page cannot actually turn tracking off — two of three writers ignore it | `src/lib/progressService.ts` | S |
| 52 | high | gamification-state | Export/Import Data Portability silently discards badges, streak, levels and per-level completion | `src/lib/progressService.ts` | M |
| 53 | high | gamification-state | Arabic users earn the epic Privacy Expert badge after 2 questions; Hindi users get an English quiz | `src/i18n/locales/ar.json` | M |
| 54 | high | gamification-state | Two of the nine badges are mathematically unearnable; the config activities that would award them have no call sites | `src/config/gamification.ts` | M |
| 55 | high | i18n-parity | Only guides are localized: 33 of 152 built pages are English-only and the language switcher silently does nothing on them | `src/components/LanguageSwitcher.tsx` | L |
| 56 | high | i18n-parity | RTL is cosmetic: dir="rtl" is set but zero logical utilities are used, so tailwindcss-rtl is inert | `tailwind.config.js` | L |
| 57 | high | i18n-parity | Six Arabic guides are abridged summaries, not translations — 14% to 53% of the English content | `src/content/guides/ar/protocol-comparison.mdx` | L |
| 58 | high | i18n-parity | Every React island server-renders in English regardless of route — static HTML for /ar/ and /zh/ pages is English | `src/i18n/index.ts` | M |
| 59 | high | islands-hydration | Global Layout hydrates React + framer-motion on all 38 routes to render nothing | `src/layouts/Layout.astro` | S |
| 60 | high | islands-hydration | 431 of 434 client directives are client:load; many islands hydrate at 94-100% page depth | `src/content/guides/en` | M |
| 61 | high | islands-hydration | FAQ page mounts 29 separate React roots for accordions that need no JavaScript | `src/content/guides/en/faq.mdx` | M |
| 62 | high | islands-hydration | 299 KB follow-pack account dataset ships below the fold on 8 landing pages to render 6 items | `src/data/follow-pack/accounts.ts` | M |
| 63 | high | performance | 264KB 500x500 PNG logo rendered at 40x40 in the header of all 152 pages | `src/components/layout/Header.astro` | S |
| 64 | high | performance | useTranslation mounts a 100ms polling setInterval per component instance | `src/hooks/useTranslation.ts` | S |
| 65 | high | performance | Astro's image pipeline is configured but never used — 73 raw <img> tags | `astro.config.mjs` | L |
| 66 | high | performance | Render-blocking third-party Google Fonts with no preload, plus a dead no-op @font-face | `src/layouts/Layout.astro` | S |
| 67 | high | performance | framer-motion (118KB raw / 39KB gzip) loads on every page including the homepage | `src/layouts/Layout.astro` | M |
| 68 | high | performance | Gossip simulator page ships 573KB of HTML, half of it duplicated inline SVGs | `src/simulators/gossip` | M |
| 69 | high | performance | One 193KB stylesheet is loaded render-blocking by 152 pages | `tailwind.config.js` | M |
| 70 | high | repo-hygiene | public/site.webmanifest is invalid JSON and is linked from every page | `public/site.webmanifest` | S |
| 71 | high | repo-hygiene | AGENTS.md rule #2 tells every agent to generate URLs the site now 301-redirects away from | `AGENTS.md` | M |
| 72 | high | repo-hygiene | AGENTS.md's mandatory new-locale checklist points at three files that no longer exist | `AGENTS.md` | M |
| 73 | high | repo-hygiene | RULES.md documents 4 locales when the project has 7, and is untracked | `RULES.md` | M |
| 74 | high | repo-hygiene | 9 of the 14 documents AGENTS.md tells agents to load are unreachable from a fresh clone | `AGENTS.md` | S |
| 75 | high | repo-hygiene | scripts/verify-seo.js validates routes the routing refactor removed | `scripts/verify-seo.js` | S |
| 76 | high | repo-hygiene | A 65MB git worktree copy of the repo lives inside an un-gitignored .claude/ directory | `.gitignore` | S |
| 77 | high | repo-hygiene | tsconfig.json overrides TypeScript's default excludes, pulling learning/ into the program | `tsconfig.json` | S |
| 78 | high | security-privacy | Six client simulators ask beginners to paste their real nsec into a password field | `src/simulators/keychat/screens/LoginScreen.tsx` | M |
| 79 | high | security-privacy | Zero security headers in vercel.json (no CSP, frame-ancestors, Referrer-Policy) | `vercel.json` | M |
| 80 | high | security-privacy | Privacy policy claims "No third-party trackers" while every page loads Google Fonts | `src/pages/privacy.astro` | M |
| 81 | high | seo-technical | Guides index is a client-only React island — guide pages and all 8 audience landing pages are orphans with zero internal inbound links | `src/pages/[...lang]/guides/index.astro` | M |
| 82 | high | seo-technical | Zero JSON-LD structured data on all pages | `src/components/SEO.astro` | M |
| 83 | high | seo-technical | og:type is 'website' on all pages and no guide carries a publish/modified date — the article branch in SEO.astro is dead code | `src/pages/[...lang]/guides/[slug].astro` | M |
| 84 | high | simulators | Damus and Amethyst settings render recommendedRelays (a string[]) as objects — blank relay rows | `src/simulators/damus/screens/SettingsScreen.tsx` | S |
| 85 | high | simulators | Five of seven login screens generate malformed npub/nsec while the correct generator sits unused | `src/simulators/damus/screens/LoginScreen.tsx` | S |
| 86 | high | simulators | The entire simulator layer is English-only on a seven-locale site | `src/simulators` | L |
| 87 | high | simulators | /damus-demo is an indexed, header-less duplicate of /simulators/damus | `src/pages/damus-demo.astro` | S |
| 88 | high | simulators | Damus dark mode paints near-black text on a pure-black background | `src/simulators/damus/components/NoteCard.tsx` | S |
| 89 | high | testing-ci-ops | ErrorBoundary component exists but is imported by zero files | `src/components/ErrorBoundary.tsx` | M |
| 90 | high | testing-ci-ops | `npm run verify-seo` always exits 0 and prints 'Ready for Google indexing!' even when checks fail | `scripts/verify-seo.js` | S |
| 91 | high | testing-ci-ops | `npm run fetch-accounts` is silently broken — it filters on a kind-0 field that does not exist | `scripts/fetch-nostr-accounts.js` | M |
| 92 | high | testing-ci-ops | No error reporting, no uptime monitoring, no alerting anywhere in the stack | `src/layouts/Layout.astro` | M |
| 93 | high | testing-ci-ops | docs/DEPLOYMENT_CHECKLIST.md is materially wrong about locale count, page count, URLs and domain | `docs/DEPLOYMENT_CHECKLIST.md` | S |
| 94 | high | testing-ci-ops | The documented deploy command pushes to a home-lab host that is 51 commits behind | `docs/DEPLOYMENT_CHECKLIST.md` | S |
| 95 | high | testing-ci-ops | vercel.json ships redirects only — no security headers, no cache-control, no trailing-slash policy | `vercel.json` | S |
| 96 | high | testing-ci-ops | 16 npm advisories including 10 high, with no automated dependency updates | `package.json` | M |
| 97 | high | ux-funnel | Simulators index and 12 simulator pages are structural dead ends | `src/pages/simulators/index.astro` | S |
| 98 | high | ux-funnel | Quickstart's primary path button is a dead anchor | `src/content/guides/en/quickstart.mdx` | S |
| 99 | high | ux-funnel | Eight audience landing pages and /badges are orphans with zero inbound internal links | `src/components/layout/Header.astro` | S |
| 100 | high | ux-funnel | /nostr-for-bitcoiners and /nostr-for-privacy render a broken 'No accounts yet' empty state | `src/pages/nostr-for-bitcoiners.astro` | S |
| 101 | high | ux-funnel | The site captures no visitor signal at all — no email, no RSS, no follow CTA outside /about | `src/pages/about.astro` | M |
| 102 | high | ux-funnel | The only share widget always shares the homepage URL | `src/components/layout/Footer.astro` | S |
| 103 | high | ux-funnel | A single guide page ships ~295 KB gzip of JavaScript across 14 hydrated islands | `src/i18n/index.ts` | L |
| 104 | high | ux-funnel | On 13 of 16 guides a 320px fixed panel covers the mobile screen after 80% scroll | `src/components/navigation/ContinueLearning.tsx` | S |
| 105 | medium | accessibility | Simulator theme stylesheets remove focus outlines | `src/simulators/damus/damus.theme.css` | S |
| 106 | medium | architecture | ~4,600 LOC of dead code across simulators and components | `src/simulators/shared/hooks/useSimulator.ts` | M |
| 107 | medium | architecture | 13 quiz components of ~510 lines each are ~95% identical copy-paste | `src/components/interactive/SecurityQuiz.tsx` | L |
| 108 | medium | build-health | public/test-progress.html — a developer localStorage debug harness — is published to production | `public/test-progress.html` | S |
| 109 | medium | build-health | A single 193 KB stylesheet is served on all 152 pages, including simulator-only rules | `dist/_astro/_slug_.B1SINYHZ.css` | M |
| 110 | medium | content-quality | 12 of 18 recommended third-party domains no longer resolve, including a primary free NIP-05 provider | `src/content/guides/en/nostr-tools.mdx` | M |
| 111 | medium | gamification-state | A single corrupt localStorage value silently disables all future writes, permanently | `src/utils/gamification.ts` | S |
| 112 | medium | security-privacy | Follow-pack export publishes a signed event to three public relays with no user confirmation | `src/components/follow-pack/ExportModal.tsx` | S |
| 113 | medium | simulators | shared/hooks/useSimulator.ts contains JSX in a .ts file — both simulator barrels are unbuildable | `src/simulators/shared/hooks/useSimulator.ts` | S |
| 114 | medium | simulators | The sidebar's Start Tour button is dead on /simulators/coracle and /simulators/gossip | `src/components/navigation/SimulatorSidebar.tsx` | S |
| 115 | medium | simulators | Snort's dark-mode toggle is wired to a state field that does not exist | `src/simulators/snort/SnortSimulator.tsx` | S |
| 116 | medium | simulators | The shared simulator framework is ~45% dead code and shares little across ten clients | `src/simulators/shared/index.ts` | M |
| 117 | medium | simulators | ~3,900 lines of never-built dead simulator code: primal/mobile and a second Damus implementation | `src/simulators/primal/mobile/MobileSimulator.tsx` | S |
| 118 | medium | simulators | 18.4% verbatim duplication inside src/simulators; login screens are ~75% identical | `src/simulators/snort/screens/LoginScreen.tsx` | L |
| 119 | medium | testing-ci-ops | TypeScript is never typechecked; a file with JSX in a .ts extension sits in a public barrel | `src/simulators/shared/hooks/useSimulator.ts` | S |
| 120 | medium | testing-ci-ops | RelayFeedBrowser has no timeout, no onclose handler and an unguarded JSON.parse | `src/components/interactive/RelayFeedBrowser.tsx` | M |
| 121 | medium | ux-funnel | Guides are padlocked on a first visit and the explainer modal is unreachable | `src/components/gamification/GamificationExplainerWrapper.tsx` | M |
| 122 | low | architecture | src/lib and src/utils have no distinguishing rule; cn() defined twice and @utils resolves differently in tsconfig vs Vite | `astro.config.mjs` | S |
| 123 | low | content-quality | Rendering bugs shipped to production: an unclosed markdown link and 12 undefined MDX components | `src/content/guides/en/faq.mdx` | S |
| 124 | low | gamification-state | 25 quiz next-step links and every guide link on /progress build /en/… URLs | `src/components/interactive/PrivacySecurityQuiz.tsx` | S |
| 125 | low | repo-hygiene | public/test-progress.html ships a live debug page that can wipe learning progress | `public/test-progress.html` | S |
| 126 | low | seo-technical | Page-level hreflang and sitemap hreflang give Google contradictory answers for the same URLs | `astro.config.mjs` | S |
| 127 | low | testing-ci-ops | A debug page with a 'Clear Storage' button is published to production | `public/test-progress.html` | S |

---

## Detail

### 1. [critical] Every form control in the app is unlabeled — 49 inputs and 18 textareas, zero labels

**Area:** accessibility · **File:** `src/components/interactive/NIP05Checker.tsx` · **Effort:** M

**Evidence:** Re-ran a parse over all .tsx today: 49 non-checkbox <input> and 18 <textarea>; zero have aria-label, aria-labelledby, or an id matched by a `<label htmlFor>`. The string `htmlFor` appears 0 times in the entire .tsx tree, and `<label for=` appears 0 times across all .astro. NIP05Checker.tsx:336 is placeholder-only. Note the simulator login screens do render visible `<label>` elements (e.g. damus LoginScreen.tsx:102-104 "Private Key (nsec)") but with no htmlFor/id, so they are still not programmatically associated.

**Impact:** A screen-reader user tabbing to any tool hears "edit text, blank"; the entire interactive surface (NIP-05 checker, relay explorer/playground, guide + glossary search, follow-pack export) is unusable with AT. WCAG 3.3.2 (A), 4.1.2 (A).

**Suggested fix:** Add `<label htmlFor>` or aria-label to every input/textarea/select; add jsx-a11y/label-has-associated-control to CI.

### 2. [critical] Undefined Tailwind color classes make the KeyGenerator toast invisible (white text on white)

**Area:** accessibility · **File:** `src/components/interactive/KeyGenerator.tsx` · **Effort:** M

**Evidence:** tailwind.config.js:38-40 defines `success: "#22C55E", danger, warning` as flat colors with no numeric scale and no `error` key; no safelist. 391 references to `(success|error|warning|danger)-<n>` remain across 27 files. Grepped the fresh build: `grep -oE '\.(bg|text|border)-(success|error|warning)-[0-9]+' dist/_astro/*.css` returns zero matches. Confirmed live in Chrome on the built /tools page: an element with `class="bg-success-500 text-white"` computes `backgroundColor: rgba(0,0,0,0)` and `color: rgb(255,255,255)`. KeyGenerator.tsx:580-585 is exactly that class set, so the "Keys copied"/"Copy failed" toast is white text on a transparent box over the light page.

**Impact:** Copy/backup confirmations on the private-key generator are literally unreadable in light mode. Quiz correct/incorrect borders (PrivacySecurityQuiz.tsx:393-397) are not invisible but render fully uncoloured — the CheckCircle2/XCircle shapes still show, so that half of the finding is milder than stated.

**Suggested fix:** Add numeric scales for success/error/warning to tailwind.config.js or replace the 391 references with green-500/red-500/amber-500; add a post-build grep check.

### 3. [critical] Badge state model forked 5 ways; /badges reads a field nothing writes

**Area:** architecture · **File:** `src/pages/badges.astro` · **Effort:** M

**Evidence:** Architecture framing of the same verified defect (badges.astro:358/445 read `unlockedAt`; every writer stores `earned`/`earnedAt`). I confirmed the fork today: the shape is redeclared in src/utils/gamification.ts:105 (`badges: Record<BadgeId, BadgeStatus>`), src/utils/gamificationEngine.ts:23 (`badges: Record<string, { earned: boolean; earnedAt: number }>`, with a comment at :21 saying it MUST match gamification.ts), plus badge metadata in src/config/gamification.ts and src/components/gamification/types.ts.

**Impact:** No single owner of badge state means a rename in one place silently breaks readers elsewhere — which is exactly what happened. Any future badge work has 5 places to keep in sync.

**Suggested fix:** Make src/utils/gamification.ts the sole owner of the persisted shape, export a typed accessor (`isBadgeEarned(id)`), and have badges.astro, Layout.astro and gamificationEngine.ts consume it instead of reaching into localStorage directly.

### 4. [critical] Guide ordering has three sources of truth; outbox-model is missing from GUIDE_ORDER and its next guide jumps backwards

**Area:** architecture · **File:** `src/pages/[...lang]/guides/[slug].astro` · **Effort:** S

**Evidence:** The route moved to [...lang] in e94df88 but the bug survived. GUIDE_ORDER at lines 55-71 is a 15-slug array (comment on line 54: 'Legacy GUIDE_ORDER for backward compatibility'); `ls src/content/guides/en/` returns 16 .mdx files and 'outbox-model' is not in the array. Line 112 `const currentGuideNumGlobal = GUIDE_ORDER.indexOf(guideSlug) + 1` therefore yields 0, line 148 `prevGuideSlug = currentGuideNumGlobal > 1 ? ... : null` yields null, and line 149 `nextGuideSlug = currentGuideNumGlobal < totalGuidesGlobal ? GUIDE_ORDER[currentGuideNumGlobal] : null` yields GUIDE_ORDER[0] = 'protocol-comparison'. Confirmed in today's build: dist/guides/outbox-model/index.html serialises `nextGuide":[0,{"slug":[0,"protocol-comparison"],"title":[0,"Nostr vs ActivityPub vs Blues...`.

**Impact:** On all 7 locales of the outbox-model guide (7 pages), the 'Previous' link disappears and 'Next' sends the reader from an advanced relay-architecture guide back to the very first guide in the sequence. The progress indicator also shows position 0 of 15.

**Suggested fix:** Add 'outbox-model' to GUIDE_ORDER, or better: derive prev/next from SKILL_LEVELS in src/data/learning-paths.ts (which already lists all 16 slugs) and delete GUIDE_ORDER. Also reconcile the third count, `TOTAL_BEGINNER_GUIDES = 9` at src/utils/gamification.ts:223.

### 5. [critical] Unbound Copy identifier ships to production and throws ReferenceError

**Area:** build-health · **File:** `src/simulators/yakihonne/screens/SettingsScreen.tsx` · **Effort:** S

**Evidence:** Same defect as the simulators-dimension finding, verified from the build side. I rebuilt today (152 pages, exit 0) and grepped dist/_astro/YakiHonneSimulatorWithTour.B0TNWfX2.js: it contains `jsx(Copy,{className:"w-4 h-4"})` twice, and `grep -oE '(const|let|var|function) Copy\b|as Copy\b'` on that chunk returns nothing — Copy is a bare, never-declared global in shipped code. Confirms esbuild's type-stripping lets it through and `astro build` gives no warning.

**Impact:** A guaranteed runtime ReferenceError is deployed to nostrich.love with a clean green build. The build pipeline provides zero protection against unbound identifiers in JSX.

**Suggested fix:** Fix the import (S), then add `astro check` to the build/CI gate so this class of error cannot ship again — see the typecheck-gate finding.

### 6. [critical] NIP-05 guide tells readers to put npub in nostr.json — spec requires lowercase hex

**Area:** content-quality · **File:** `src/content/guides/en/nip05-identity.mdx` · **Effort:** S

**Evidence:** All three JSON examples are unchanged. Lines 248-254: `"names": { "alice": "<your-npub-here>", "bob": "<another-npub>" }`. Lines 265-270: `"alice": "npub1abc123..."`. Lines 413-419: `"alice": "npub1alice...", "bob": "npub1bob...", "carol": "npub1carol..."`. NIP-05 maps names to hex-formatted public keys in lowercase; an npub value fails verification in every client. The guide reinforces the error rather than catching it: line 313 says "Double-check your npub is correct in nostr.json" and line 370 "Ensure npub is correct (not nsec!)" — the troubleshooting section (311-378) never mentions key format at all.

**Impact:** The guide's single actionable deliverable cannot succeed. Every self-hosting reader ships a silently broken NIP-05, then reads a troubleshooting section that cannot diagnose it.

**Suggested fix:** Replace all three JSON examples with lowercase hex pubkeys, add an explicit callout that npub is NOT accepted in nostr.json, link an npub→hex converter, and make "wrong key format (npub instead of hex)" troubleshooting cause #1 at line 311.

### 7. [critical] NIP-05 guide invents a DNS TXT record step that does not exist in the protocol

**Area:** content-quality · **File:** `src/content/guides/en/nip05-identity.mdx` · **Effort:** S

**Evidence:** Lines 226-242 unchanged: "### Step 2: DNS Setup / Add a DNS record to point to your Nostr key: **Type:** TXT **Name:** `_@` (or just `@` for root) **Value:** `"nostr": "<your-npub>"`", followed by an alternative "**Type:** CNAME **Name:** `nostr` **Value:** `your-nostr-provider.com`". NIP-05 defines only an HTTPS GET to /.well-known/nostr.json and no DNS record of any kind; `_@` is not a valid DNS label. Step 3 (line 245 onward) then correctly describes the .well-known file, so Step 2 is pure invention sitting between two real steps.

**Impact:** Readers spend time editing DNS at their registrar for no effect, then conclude NIP-05 is broken. Combined with the npub/hex error above, two of the three setup steps are wrong.

**Suggested fix:** Delete lines 226-243 entirely and renumber. NIP-05 setup is: host JSON at https://yourdomain/.well-known/nostr.json with lowercase hex keys and CORS enabled.

### 8. [critical] Quickstart instructs beginners to paste their nsec to log in; NIP-07 / NIP-46 signers are absent from all 16 guides

**Area:** content-quality · **File:** `src/content/guides/en/quickstart.mdx` · **Effort:** M

**Evidence:** quickstart.mdx:191 still reads "Open your chosen client and paste your nsec to log in. That's it—you're on Nostr!" The same pattern survives at multi-client.mdx:291 ("Import your nsec"), faq.mdx:209-211 ("Export your nsec from your current client... Import/enter your nsec") and protocol-comparison.mdx:229 ("Switch clients instantly: just import your nsec"). Grepping all 16 EN guides for NIP-07, NIP-46, bunker and nsec.app returns ZERO hits. "Nos2x" appears exactly once (troubleshooting.mdx:267, "Use a signer app (Amber, Nos2x) to avoid typing nsec"); Amber appears in privacy-security.mdx:173-199 and nostr-tools.mdx:256-265, both filed under advanced/optional. Meanwhile quickstart.mdx:183 has the reader tick "lose my nsec = lose my account forever" eight lines before telling them to paste it.

**Impact:** The site's primary conversion path teaches the most common nsec-theft vector and never names the safe alternative every web client has supported for years. A beginner who follows quickstart and then reads keys-and-security receives contradictory instructions on the one thing that cannot be undone.

**Suggested fix:** Rewrite quickstart Step 3 to lead with a browser extension (Alby/nos2x, NIP-07) for web, Amber for Android, and nsec.app / bunker URL (NIP-46) cross-platform, with nsec paste as a last resort behind an explicit warning. Add a NIP-07/NIP-46 section to keys-and-security.mdx and a glossary entry for "signer".

### 9. [critical] NIP-17 guide tells privacy-seeking users relays cannot see who they message — the spec puts the recipient in a plaintext p tag

**Area:** content-quality · **File:** `src/content/guides/en/nip17-private-messages.mdx` · **Effort:** S

**Evidence:** All four claims are unchanged. Line 29: "**Even relay operators cannot see who is talking to whom**". Line 42, comparison table: "| **Recipient Metadata** | Visible to relays | Hidden from everyone except recipient |". Line 111: "**Metadata Privacy**: No one except the recipient can determine who sent the message or who it was sent to". Line 175: "The `p` tag should point to a random ephemeral key, not your friend's real key." The guide refutes itself seven lines later — the example event at line 182 is `"tags": [["p", "<recipient_pubkey>"]]`. The kind 1059 gift wrap must carry the receiver pubkey in the clear so relays can route it.

**Impact:** A security claim aimed at exactly the users who cannot afford it being wrong; /nostr-for-privacy points privacy advocates here. Someone threat-modelling off this guide will believe their contact graph is hidden from a relay operator when it is fully visible.

**Suggested fix:** State plainly that NIP-17 hides the sender and the content while the recipient pubkey is public on the gift wrap. Fix line 29, the line 42 table row, line 111 and line 175, and reconcile the matching claim in faq.mdx.

### 10. [critical] NIP-17 guide describes the seal and gift-wrap layers backwards and claims forward secrecy the spec disclaims

**Area:** content-quality · **File:** `src/content/guides/en/nip17-private-messages.mdx` · **Effort:** M

**Evidence:** Unchanged. Line 76: the gift wrap "is encrypted to a special 'gift wrap key' derived from the recipient's public key" — no such derived key exists; the wrapper keypair is generated randomly anew per message. Line 87: the seal "Is encrypted using a fresh ephemeral key pair" — wrong layer; the seal (kind 13) is signed by the sender's real key. Line 90: the seal "Has its own timestamp for replay protection" — created_at is randomized up to two days in the past to defeat timing analysis, not for replay protection. Line 45 (table row) "| **Forward Secrecy** | No | Better (per-message keys) |" and line 113 "**Better Forward Secrecy**: Each message uses unique ephemeral keys" — NIP-44 states there is no forward secrecy. Line 292: "**NIP-44**: An improved encryption scheme that may supersede NIP-17" — NIP-44 is the primitive NIP-17 is built on, not its successor.

**Impact:** Every technical claim in the guide's explainer section is wrong, and the forward-secrecy claim will lead a high-risk user to retain sensitive history they should have expired.

**Suggested fix:** Rewrite "How NIP-17 Works" against the spec: rumor (unsigned kind 14) → seal (kind 13, signed by sender, NIP-44 encrypted to recipient) → gift wrap (kind 1059, signed by a fresh random key, randomized created_at). Replace the forward-secrecy row with an explicit "No forward secrecy" warning plus the expiration/disappearing-messages option, and replace the line 292 bullet with MLS/NIP-EE as the actual direction.

### 11. [critical] /nostr-for-parents promises family posts "stay private" and are "yours alone" on a fully public, undeletable network

**Area:** content-quality · **File:** `src/pages/nostr-for-parents.astro` · **Effort:** S

**Evidence:** Unchanged. Line 14 (valueProps[0]): "Your parenting questions and family moments stay private. No algorithms analyzing your posts to sell you products." Line 24 (valueProps[2], titled 'No Data Mining'): "On Nostr, your family discussions are yours alone." Line 144, CTA section: "No phone number. No ID verification. Your privacy is respected." The site's own privacy-security.mdx says all posts are public unless encrypted DMs and that metadata leaks are possible, and faq.mdx says deletion requests are not guaranteed and content may persist on relays indefinitely. The 'No Data Mining' framing is also inverted: Nostr is an open unauthenticated firehose that anyone can scrape without an API key.

**Impact:** Targets a vulnerable audience posting about children with a false privacy guarantee on a network where nothing can be reliably deleted. It is the page's lead value proposition and the highest-harm claim on the site.

**Suggested fix:** Rewrite the three props to accurate benefits (no phone/email/ID required, no ad targeting, portable identity, chronological feed) and add an explicit "everything you post is public and permanent — think before posting about your kids" callout linking /guides/privacy-security.

### 12. [critical] /badges reads a field name that no writer ever produces — every user sees 0 of 8 badges earned forever

**Area:** gamification-state · **File:** `src/pages/badges.astro` · **Effort:** S

**Evidence:** Line 358 today: `const isUnlocked = unlockedBadges[badgeId]?.unlockedAt != null;` and line 445: `const unlockedAt = data?.badges?.[badgeId]?.unlockedAt;`. Both read from `localStorage.getItem(GAMIFICATION_KEY)` where GAMIFICATION_KEY = 'nostrich-gamification-v1' (badges.astro:287, 336). Both writers of that key use a different field name: src/utils/gamification.ts:593-596 writes `{ earned: true, earnedAt: Date.now() }` (and getDefaultData at :244 seeds `{ earned: false, earnedAt: 0 }`), and src/utils/gamificationEngine.ts:243-244 does `data.badges[badgeId].earned = true; data.badges[badgeId].earnedAt = Date.now()` against the same STORAGE_KEY (gamificationEngine.ts:18). `unlockedAt` therefore evaluates to undefined for every badge, always.

**Impact:** /badges is a permanently dead page: all 8-9 badge cards stay greyscale with the lock icon and the counter reads '0 of N badges earned' no matter how much the user completes. Badges the engine genuinely awarded in localStorage are invisible. The entire achievement layer is unobservable to the user.

**Suggested fix:** Change badges.astro:358 to `unlockedBadges[badgeId]?.earned === true` and :445 to `data?.badges?.[badgeId]?.earnedAt`. Longer term, badge metadata is declared 5 times (config/gamification.ts, utils/gamification.ts BADGE_DEFINITIONS, badges.astro:290-299, Layout.astro, components/gamification/types.ts) — collapse to one source.

### 13. [critical] 12 of 16 Hindi guide translation blocks are stored under kebab-case keys and are unreachable

**Area:** i18n-parity · **File:** `src/i18n/locales/hi.json` · **Effort:** S

**Evidence:** I parsed all 7 locale JSONs. en.guides keys are camelCase: faq, findingCommunity, keysAndSecurity, multiClient, nip05Identity, nip17PrivateMessages, nostrTools, outboxModel, privacySecurity, protocolComparison, quickstart, relayGuide, relaysDemystified, troubleshooting, whatIsNostr, zapsAndLightning. hi.guides has 12 kebab-case keys (finding-community, keys-and-security, multi-client, nip05-identity, nip17-private-messages, nostr-tools, outbox-model, privacy-security, protocol-comparison, relay-guide, relays-demystified, zaps-and-lightning) plus an orphan `community-hub`; only faq, quickstart, troubleshooting and whatIsNostr match. pl/es/de/zh/ar are all set-equal to en — hi is the only broken locale. Consumers query camelCase (e.g. src/components/interactive/SecurityQuiz.tsx `getValue('guides.keysAndSecurity...')`), and getValue (src/i18n/index.ts:46-68) falls through to English on the second path segment.

**Impact:** Hindi readers of 12 of 16 guides get English quiz titles, questions, options and explanations. The translation work is on disk and never rendered.

**Suggested fix:** Rename the 12 kebab-case keys in src/i18n/locales/hi.json to the camelCase ids used by en.json, drop `community-hub`, and add a CI assertion that Object.keys(locale.guides) is set-equal to Object.keys(en.guides) for every locale.

### 14. [critical] 92 translation keys referenced in code do not exist in en.json; 23 of them render the raw dotted key as visible UI text

**Area:** i18n-parity · **File:** `src/components/interactive/WhatIsNostrQuiz.tsx` · **Effort:** M

**Evidence:** en.json's ui.quiz has exactly 15 keys (answered, backButton, conceptsMastered, feedback, gradeTitle, loading, nextButton, nextSteps, perfectScore, questionCounter, retakeQuiz, reviewSections, scoreDisplay, seeResults, severity). src/ references 36 distinct ui.quiz.* keys, so exactly 23 are missing — advancedRelayGuide, backToSecurityBasics, badgeEarned, findWalletTools, fixConnectionIssues, fixZapIssues, getFreeNIP05, getStartedNostr, keySecurityGuide, learnMoreRelays, learnZaps, nostrBasics, perfectScoreTitle, privacyExpert, privacySecurity, relayBasics, reviewKeys, reviewOutboxModel, reviewPrivacyGuide, securityBestPractices, startUsingNostr, tryDifferentClients, tryQuickstart. They are spread across 12 quiz components (FindingCommunity, MultiClient, NIP05Identity, NIP17PrivateMessages, OutboxModel, PrivacySecurity, ProtocolComparison, RelayGuide, RelaysDemystified, Troubleshooting, WhatIsNostr, ZapsAndLightning) and I confirmed all 12 are mounted in the English MDX. The path is reachable: t() at src/i18n/index.ts:36-39 does `return typeof result === 'string' ? result : key`, and getValue returns undefined on a miss (line 61), so the raw key is rendered. WhatIsNostrQuiz.tsx:215 `{t("ui.quiz.reviewKeys")}` and :221 `{t("ui.quiz.tryQuickstart")}` sit inside the two result-screen CTA anchors with no `||` fallback.

**Impact:** After finishing any of 12 quizzes — the payoff moment of the learning flow — users in all 7 languages see buttons labelled `ui.quiz.reviewKeys`, `ui.quiz.fixZapIssues`, `ui.quiz.privacyExpert`. Invisible in static HTML because it only appears post-interaction. Related: WhatIsNostrQuiz.tsx:213/219 hardcode `/${locale}/guides/...`, which for English yields /en/guides/... — now a 301 hop rather than a 404, but still worth switching to guidePath().

**Suggested fix:** Add the 23 ui.quiz.* keys to en.json and the other 6 locales, and change t() in src/i18n/index.ts:36-39 to take an explicit fallback string so a miss degrades to English prose instead of a debug token. Add a CI check that every literal t()/getValue() key resolves in en.json.

### 15. [critical] All 7 locale JSON files ship to the browser on every page with a translated island (527 KB / 157 KB gzip)

**Area:** islands-hydration · **File:** `src/i18n/index.ts` · **Effort:** M

**Evidence:** Lines 7-13 still statically import en/pl/es/de/zh/ar/hi JSON; line 15 builds `const translations: Record<Locale, Translations> = { en, pl, es, de, zh, ar, hi }`; getValue() indexes it dynamically at line 47 (`translations[locale]`) and line 54 (`translations['en']`), so Rollup must retain all seven. Measured on today's fresh build: dist/_astro/useTranslation.Ck1Rc9K8.js = 527,403 B raw / 157,145 B gzip — the largest chunk, and the cause of the `(!) Some chunks are larger than 500 kB` warning in the build log. I computed the transitive module graph across dist and it is reached by 122 of the 154 emitted HTML pages, including every guide page in every locale.

**Impact:** Every guide page downloads and JSON-parses ~157 KB gzip / 527 KB raw of translations, roughly 6.5x more than the one locale the reader needs. On a mid-tier phone that is hundreds of ms of extra main-thread parse/eval, hitting TBT/INP on the highest-traffic content of a beginner-education site.

**Suggested fix:** Replace the seven static imports with `import.meta.glob('./locales/*.json')` so Vite code-splits per locale, or pass the already-scoped translation subtree from the Astro page (it knows the locale) as a prop to each island.

### 16. [critical] All 7 locale JSON files are bundled into a single 527KB client chunk

**Area:** performance · **File:** `src/i18n/index.ts` · **Effort:** M

**Evidence:** src/i18n/index.ts:7-13 still statically imports en/pl/es/de/zh/ar/hi JSON and line 15 assembles `const translations: Record<Locale, Translations> = { en, pl, es, de, zh, ar, hi }`. The rebuild's own Vite output line reads `dist/_astro/useTranslation.Ck1Rc9K8.js  527.40 kB │ gzip: 158.23 kB`, and Rollup emitted the >500 kB chunk-size warning. That chunk is in the module graph of every guide page I measured.

**Impact:** Every guide visitor downloads ~158 KB gzip / 527 KB raw of translation data, ~86% of it for languages they will never read, and the main thread must JSON.parse half a megabyte before any island becomes interactive — the dominant TBT/INP contributor.

**Suggested fix:** Have each Astro page pass its already-known locale subtree into the island as a prop so no locale JSON reaches the client, or use import.meta.glob('./locales/*.json') so Vite code-splits per locale. Expected saving ~135 KB gzip per guide page.

### 17. [critical] 438 client:load directives and 1 client:visible — every island hydrates eagerly

**Area:** performance · **File:** `src/pages/index.astro` · **Effort:** M

**Evidence:** Counted in src/ today: 438 `client:load` occurrences across 130 files, 1 `client:visible`, 0 `client:idle`. Measured module graphs on the fresh build: dist/index.html = 8 islands / 32 modules / 375 KB raw / 126 KB gzip; dist/guides/what-is-nostr = 14 islands / 54 modules / 932 KB raw; dist/guides/relays-demystified = 17 islands / 82 modules / 994 KB raw / 315 KB gzip; dist/tools = 11 islands / 62 modules / 1,373 KB raw / 446 KB gzip. Zero `client="visible"` in any of those built pages.

**Impact:** React plus framer-motion plus every quiz and simulator is parsed and mounted before the user scrolls, pushing TBT past 600 ms and INP past 200 ms on mid-tier Android for the site's highest-traffic content.

**Suggested fix:** Switch below-the-fold interactive components (quizzes, RelayExplorer, PostFlowSimulator, TroubleshootingWizard) to client:visible and chrome widgets to client:idle; reserve client:load for above-the-fold UI.

### 18. [critical] Gossip thread view crashes on every note click: .map() called on a number

**Area:** simulators · **File:** `src/simulators/gossip/screens/ThreadScreen.tsx` · **Effort:** S

**Evidence:** Line 96 today reads `{note.replies?.map((replyId) => { return null; })}`. src/data/mock/types.ts:70 declares `replies: number` (required, and generator.ts:325 defaults it to 0), so `?.` never short-circuits. Direct typecheck of the file reproduces it: `ThreadScreen.tsx(96,24): error TS2339: Property 'map' does not exist on type 'number'`. Path is reachable and live: FeedScreen.tsx:68 `onClick={() => onOpenThread(note)}` -> GossipSimulator.tsx:42 openThread sets currentView='thread' + selectedNote -> GossipSimulator.tsx:112 renders ThreadScreen. I grepped the SHIPPED chunk dist/_astro/gossip.B4lpnIqX.js and found the exact expression: `s.jsxs("div",{className:"gossip-thread-main gossip-content",children:[p(t,!0),t.replies?.map(i=>null)]})`. No ErrorBoundary wraps it — src/pages/simulators/gossip.astro:35 renders `<GossipSimulator client:load />` bare, and the only ErrorBoundary in the repo (src/components/ErrorBoundary.tsx) is not used here.

**Impact:** Clicking any note in the Gossip simulator throws a TypeError during render. With no error boundary, React 18 unmounts the whole root, so the simulator pane goes blank and the user must reload the page. This is 1 of 10 client simulators, which are the site's flagship interactive teaching feature.

**Suggested fix:** Line 96 is dead code (the callback returns null unconditionally). Delete the `{note.replies?.map(...)}` block. Separately fix line 29: `getUserByPubkey(n.author)` — MockNote has `pubkey`, not `author` (TS2339 confirmed today), so renderNote already returns null and the thread body renders empty even without the throw.

### 19. [critical] YakiHonne settings key panel references an unimported Copy component -> ReferenceError

**Area:** simulators · **File:** `src/simulators/yakihonne/screens/SettingsScreen.tsx` · **Effort:** S

**Evidence:** `<Copy className="w-4 h-4" />` at lines 276 and 290. The lucide-react import block at lines 3-18 pulls ArrowLeft, Moon, Sun, Globe, Shield, Key, Server, Bell, Lock, FileText, HelpCircle, LogOut, ChevronRight, Palette — no Copy. Direct typecheck: two `error TS2304: Cannot find name 'Copy'` at (276,22) and (290,22). Reachable: line 113 `onClick: () => setShowKeys(true)`, line 44 `const [showKeys, setShowKeys] = useState(false)`, line 241 `{showKeys && (`.

**Impact:** Opening YakiHonne simulator -> Settings -> the 'Your Keys' row throws ReferenceError: Copy is not defined during render. The modal never appears and the unhandled error unmounts the simulator root. This is the exact screen a beginner opens to see what an npub/nsec looks like — the pedagogical core of the simulator.

**Suggested fix:** Add `Copy` to the lucide-react import at lines 3-18.

### 20. [critical] Zero automated tests and zero CI for 84k LOC deploying straight to production

**Area:** testing-ci-ops · **File:** `package.json` · **Effort:** L

**Evidence:** Read package.json today: exactly 6 scripts — dev, build, preview, astro, fetch-accounts, verify-seo. No test, lint, typecheck or check script. Grepping package.json for typescript|@astrojs/check|vitest|playwright returns nothing. A repo-wide find for *.test.*, *.spec.* and __tests__/ outside node_modules returns zero files. `ls .github` → 'No such file or directory', so no Actions, no PR checks, no Dependabot.

**Impact:** Nothing verifies a change before it is live. A regression in the key generator, NIP-05 checker, 10 simulators, gamification engine or any of 7 locales reaches every visitor immediately and is only found if a human clicks that exact feature.

**Suggested fix:** Add .github/workflows/ci.yml running npm ci, astro check, npm run build and a link smoke check; add vitest with jsdom over the pure logic (gamification.ts, gamificationEngine.ts, i18n getValue fallback); add one Playwright smoke spec.

### 21. [critical] The /guides hub renders zero guide links server-side

**Area:** ux-funnel · **File:** `src/components/guides/GuidesContainer.tsx` · **Effort:** M

**Evidence:** Rebuilt dist/ at HEAD and parsed dist/guides/index.html (54,007 bytes): the only /guides/* hrefs in the whole document are `/guides/` and `/guides/faq` — the latter from the Footer, not the hub. 3 `animate-pulse` skeletons, 9 astro-islands, 8 client="load", 0 client="visible". GuideSection.tsx:157-172 returns pulse placeholders whenever `!isClient`, and GuidesContainer does the same.

**Impact:** The destination of every homepage CTA, landing-page CTA and 404 suggestion is three pulsing grey rectangles until React hydrates; Googlebot sees no guide links from the hub so no internal link equity reaches the 16 guides.

**Suggested fix:** Render the guide cards as plain Astro markup (data already computed at src/pages/[...lang]/guides/index.astro:32-55) and hydrate GuidesContainer over them with client:idle for filter/search only.

### 22. [high] Desktop user menu (Progress / Settings) is hover-only and unreachable by keyboard

**Area:** accessibility · **File:** `src/components/layout/Header.astro` · **Effort:** S

**Evidence:** Header.astro:86-96 is a `<button aria-label="User menu" aria-expanded="false" aria-haspopup="true">` with no click handler; the only <script> in the file (lines 243-276) binds solely to #mobile-menu-button. Panel at :97 is `opacity-0 invisible group-hover:opacity-100 group-hover:visible`. `grep -rn focus-within src/` still returns 0. Verified live on the built /guides page: `b.click()` leaves the panel at `visibility: hidden, opacity: 0` and aria-expanded still "false"; the panel's links are /progress and /settings.

**Impact:** Keyboard and switch users can never reach Progress or Settings from the header, and aria-expanded permanently lies to screen readers. WCAG 2.1.1 (A), 4.1.2 (A).

**Suggested fix:** Make it a real disclosure: JS click toggle that flips aria-expanded, Escape to close and restore focus, plus `group-focus-within:visible` as a CSS fallback.

### 23. [high] Mobile menu ships an inverted aria-expanded

**Area:** accessibility · **File:** `src/components/layout/Header.astro` · **Effort:** S

**Evidence:** Header.astro:249-255 still reads `const isHidden = mobileMenu?.classList.contains('hidden');` BEFORE `mobileMenu?.classList.toggle('hidden')`, then `setAttribute('aria-expanded', (!isHidden).toString())`. Verified live in the built page: initial {hidden:true, aria:"false"}; after one click {hidden:false, aria:"false"}; after a second click {hidden:true, aria:"true"}. Perfectly inverted in both directions.

**Impact:** Screen-reader users on mobile are told the nav is collapsed while it is open and expanded while it is closed. WCAG 4.1.2 (A).

**Suggested fix:** Read state after toggling: `const isOpen = !mobileMenu.classList.contains('hidden'); button.setAttribute('aria-expanded', String(isOpen));`

### 24. [high] Skip link is a dead anchor on 13 pages that have no #main-content target

**Area:** accessibility · **File:** `src/pages/simulators/damus.astro` · **Effort:** S

**Evidence:** Layout.astro:151 emits `<a href="#main-content" class="skip-to-content">` on every page. Scanned the fresh build for pages that have the skip link but no `id="main-content"`: exactly 13 — damus-demo, privacy, simulators/index, and the 10 simulator routes. Confirmed live on /simulators/gossip/: `document.getElementById('main-content')` is null; there is a `<main class="gossip-main">` but with no id, and the page has zero <h1>.

**Impact:** Activating the skip link on the site's most content-heavy routes does nothing; AT users get no main landmark and, on gossip/olas, no page heading. WCAG 2.4.1 (A), 1.3.1 (A).

**Suggested fix:** Give the existing <main> (or a new wrapper) `id="main-content" tabindex="-1"` on those 13 pages and add a real page-level <h1>.

### 25. [high] No modal in the codebase traps focus, moves initial focus, or restores focus on close

**Area:** accessibility · **File:** `src/components/gamification/BadgeEarnedModal.tsx` · **Effort:** M

**Evidence:** `grep -rniE 'trapFocus|FocusTrap|focus-trap' src/` returns 0. `.focus()` appears 7 times in src/components + src/simulators, all either simulator textarea autofocus or Header.astro:274. Six files have aria-modal (BadgeEarnedModal:158, GamificationExplainer:121, PrerequisiteModal:84, UnlockButton:85, TourOverlay:120). KeyGenerator.tsx:524-537 — the "copy your nsec anyway?" confirmation — is a bare `motion.div className="fixed inset-0 ..."` with no role, no aria-modal, no label and no Escape handler.

**Impact:** Keyboard/AT users are dumped into the page behind any modal after a few Tabs; the private-key warning dialog can be tabbed past and "Copy anyway" reached without the warning ever being announced. WCAG 2.4.3, 4.1.2, 2.1.2 (A).

**Suggested fix:** Extract one useFocusTrap(ref, isOpen) hook (store activeElement, focus on open, cycle Tab, restore on close) and apply it to all 8 modals; add role/aria-modal/label + Escape to KeyGenerator.tsx:524, ExportModal.tsx:498, AccountBrowser.tsx:106.

### 26. [high] Almost no live regions — dynamic results are silent to screen readers

**Area:** accessibility · **File:** `src/components/interactive/KeyGenerator.tsx` · **Effort:** M

**Evidence:** `grep -rn aria-live src/` returns exactly 2 hits today: PrerequisiteWarning.tsx:91 and TourTooltip.tsx:49. `grep -rn 'role="status"' src/` returns 0. The KeyGenerator toast (574-592), the quiz feedback panel, the NIP-05 result and all filter counts have no live region.

**Impact:** A blind user presses Verify, answers a quiz, or copies their nsec and hears nothing — the page appears frozen. WCAG 4.1.3 (AA).

**Suggested fix:** Add role="status" aria-live="polite" to the toast container, quiz feedback panel, NIP-05 result and search/filter counts; role="alert" for errors.

### 27. [high] RTL is broken for Arabic: 307 physical direction utilities, 0 logical ones

**Area:** accessibility · **File:** `src/components/layout/Header.astro` · **Effort:** L

**Evidence:** Counted today over src/components + src/pages + src/layouts: 307 hits for ml-/mr-/pl-/pr-/left-N/right-N/text-left/text-right; 0 hits for ms-/me-/ps-/pe-/start-/end-/text-start/text-end; 0 `rtl:` variants. tailwind.config.js:161 loads tailwindcss-rtl but nothing uses it. Header.astro:97 is still `class="absolute top-full right-0 mt-1 w-48"`. Loaded the built /ar/guides/what-is-nostr/ in Chrome at 1280px: dir="rtl", lang="ar", and `scrollWidth 1396 vs clientWidth 1280` — 116px of horizontal overflow, with the logo clipped off the right edge and the article card shifted out of the viewport.

**Impact:** The fully-translated Arabic locale (16 guides) renders with 116px horizontal overflow, clipped chrome, dropdowns anchored to the wrong edge and quiz answers force-aligned LTR.

**Suggested fix:** Swap directional utilities for the logical equivalents tailwindcss-rtl provides, starting with Header.astro:85/97, LanguageSwitcher.tsx:104, and the shared quiz/input components; then visually diff /ar/guides/* against /guides/*.

### 28. [high] Simulator settings toggles are <div onClick> — not focusable, no role, no state

**Area:** accessibility · **File:** `src/simulators/damus/screens/SettingsScreen.tsx` · **Effort:** M

**Evidence:** damus/screens/SettingsScreen.tsx:87-91 is verbatim `<div className={`damus-toggle ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(!darkMode)}><div className="damus-toggle-thumb" /></div>` — no role, tabIndex, onKeyDown or aria-checked. Repeated at :104, :122, :147 and gossip/screens/SettingsScreen.tsx:41-46. My scan of non-interactive elements carrying onClick with no role/tabIndex/key handler finds 42 across the repo (the audit said 26), including gossip FeedScreen.tsx:65/71, gossip PeopleScreen.tsx:31, damus NoteCard.tsx:131, gossip ThreadScreen.tsx:35.

**Impact:** These controls cannot be tabbed to or activated by keyboard and are announced as nothing; the flagship "try Nostr without installing" feature is unusable with AT. WCAG 2.1.1 (A), 4.1.2 (A).

**Suggested fix:** Convert toggles to `<button type="button" role="switch" aria-checked aria-label>` and clickable rows to <button>/<a>; PrivacyControls.tsx:109-116 already has the correct pattern.

### 29. [high] Icon-only buttons across the app have no accessible name

**Area:** accessibility · **File:** `src/components/interactive/PrivacySecurityQuiz.tsx` · **Effort:** M

**Evidence:** Re-parsed every <button> today: 89 have icon-only content with no aria-label/title (37 in src/components, 52 in src/simulators). The audit's 116 is higher than my stricter regex finds, but the named examples all check out: PrivacySecurityQuiz.tsx:497-508 is the quiz previous-question button containing only `<ChevronLeft className="h-5 w-5" />`; LanguageSwitcher.tsx:67-73 is the pre-hydration Globe button with no label; ScreenshotGallery.tsx:78/84; RelayFeedBrowser.tsx:195 (the stop-viewing X).

**Impact:** Screen readers announce these as bare "button" — the quiz back control, every lightbox control, modal close buttons and the language switcher require sighted guessing. WCAG 4.1.2 (A).

**Suggested fix:** Add aria-label to each icon-only button (translated via t() where available) and aria-hidden="true" to the decorative icon; add jsx-a11y/control-has-associated-label to CI.

### 30. [high] Brand primary #8B5CF6 fails AA contrast on white — skip link, primary buttons, 100+ text usages

**Area:** accessibility · **File:** `src/layouts/Layout.astro` · **Effort:** M

**Evidence:** Recomputed every ratio today and they match the audit exactly: #8B5CF6 on #FFFFFF = 4.23:1, on the cream #FFFDF8 = 4.17:1 (AA needs 4.5:1); #9B7BFF = 3.15:1; #B8A3FF = 2.16:1; #FFD700 (friendly-gold) = 1.40:1; success #22C55E = 2.28:1; warning #F59E0B = 2.15:1; the suggested #7C3AED = 5.70:1. Layout.astro:41-53 still defines `.skip-to-content { background: #8B5CF6; color: white; font-weight: 600 }` at default 16px — bold 16px is not WCAG large text. `bg-primary` appears 209 times in src/components + src/pages; text-friendly-gold is used as text at BadgeEarnedModal.tsx:254 and ProgressTracker.tsx:223.

**Impact:** The site's most common interactive colour — including its own accessibility skip link and every primary CTA — is unreadable for low-vision users; gold badge text at 1.40:1 is effectively invisible. WCAG 1.4.3 (AA).

**Suggested fix:** Use primary-600 (#7C3AED) for text and button backgrounds in light mode, keep #8B5CF6 for dark; replace text-friendly-gold with amber-600/700 on light surfaces; set the skip link to #7C3AED.

### 31. [high] Quiz answer buttons convey selection/correctness only through dead colour, with no ARIA state

**Area:** accessibility · **File:** `src/components/interactive/PrivacySecurityQuiz.tsx` · **Effort:** M

**Evidence:** PrivacySecurityQuiz.tsx:378-437 (file modified in the working tree, defect unchanged): each option is `<motion.button type="button">` with no aria-pressed, no role="radio"/radiogroup, no aria-describedby. State is className-only: `border-primary bg-primary/10`, `border-success-500 bg-success-500/10`, `border-error-500 bg-error-500/10` — and I confirmed in the browser that success-500/error-500 emit no CSS at all. `grep -rn aria-pressed src/` returns 0 repo-wide. One nuance: the CheckCircle2 (:416) and XCircle (:425) icons do render as shapes, so sighted users get a non-colour cue — but both SVGs are unlabeled.

**Impact:** A screen-reader user hears "button, <text>" before and after selecting, with no indication of what they picked or whether it was right, and the explanation panel is never announced. WCAG 4.1.2 (A), 4.1.3 (AA).

**Suggested fix:** Model each question as role="radiogroup" with role="radio" aria-checked options, append visually-hidden "correct answer"/"your answer, incorrect" text once revealed, and wrap the explanation in role="status".

### 32. [high] LanguageSwitcher: nameless trigger on mobile plus a fake listbox with no keyboard support

**Area:** accessibility · **File:** `src/components/LanguageSwitcher.tsx` · **Effort:** S

**Evidence:** The file was rewritten by e94df88 (now 131 lines, imports from ../i18n/paths) but every defect survived at new line numbers. Trigger at :83-96 has aria-expanded and aria-haspopup="listbox" but no aria-label; its only text is `<span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>` (:91-93), display:none below 640px, so the mobile accessible name is empty. Pre-hydration fallback at :66-74 has no label at any width. The popup at :104-127 is a plain <div> of <button>s — no role="listbox"/"option", no aria-activedescendant, no arrow keys, no Escape. It closes only via a mouse-only `<div className="fixed inset-0 z-40" onClick>` at :100-103. Option labels 中文/العربية/हिन्दी carry no lang attribute.

**Impact:** Mobile screen-reader users hear "button" with no hint it changes language; keyboard users cannot arrow through options or dismiss with Escape; synthesizers mispronounce the non-Latin option names. WCAG 4.1.2, 2.1.1 (A), 3.1.2 (AA).

**Suggested fix:** Add aria-label to both the hydrated and fallback buttons; either implement the listbox pattern or drop to aria-haspopup="true"; add Escape + focus return; add lang={lang.code} to each label span.

### 33. [high] All 7 locale JSON files statically imported into one module (architecture view)

**Area:** architecture · **File:** `src/i18n/index.ts` · **Effort:** M

**Evidence:** Same verified defect as the islands-hydration finding, framed as a module-boundary problem: src/i18n/index.ts lines 7-13 are seven unconditional static imports and line 15 collapses them into a single `Record<Locale, Translations>`, so no bundler can tree-shake per-route. 38 components re-export through this barrel via useTranslation.

**Impact:** There is no seam at which a locale can be dropped from a bundle — every consumer of useTranslation inherits all seven languages.

**Suggested fix:** Same as above; this is one fix, not two.

### 34. [high] 306KB curated-account database imported directly by a client island

**Area:** architecture · **File:** `src/components/community/FeaturedCreatorsFromPack.tsx` · **Effort:** M

**Evidence:** Line 3 today: `import { curatedAccounts } from '../../data/follow-pack/accounts';` — a static import of a 306 KB module from a component that is hydrated client:load on 10 pages (verified nostr-for-bitcoiners.astro:5/269 and nostr-for-artists.astro:5/126). There is no server/client boundary between the data layer and the island.

**Impact:** Architectural: any component that touches src/data/follow-pack drags the whole dataset into the client bundle, with nothing in the build that flags it.

**Suggested fix:** Introduce a build-time data access layer (Astro frontmatter or a content collection) so client components receive only the records they render.

### 35. [high] Two competing gamification engines plus a config plus an inline layout script — four writers on one localStorage key

**Area:** architecture · **File:** `src/utils/gamificationEngine.ts` · **Effort:** M

**Evidence:** Confirmed today. Both modules write 'nostrich-gamification-v1' (gamification.ts:142, gamificationEngine.ts:18). gamificationEngine.ts:21-40 redeclares the GamificationData interface locally with the comment that it MUST match gamification.ts. Both export the same three names with incompatible signatures: gamification.ts:665 `recordActivity(): void` vs gamificationEngine.ts:155 `recordActivity(activityId, metadata?)`; gamification.ts:606 `getEarnedBadges(): EarnedBadge[]` vs gamificationEngine.ts:298 `getEarnedBadges(): string[]`; getStreakInfo at :696 and :287. Consumers pick arbitrarily — 4 files import from utils/gamification, 3 from gamificationEngine, and PrivacySecurityQuiz.tsx:129 calls the no-arg `recordActivity()` while KeyGenerator.tsx:163 calls the activity-id one.

**Impact:** Indirect but load-bearing: this fork is the direct cause of the badges `unlockedAt` mismatch and the streak double-write bug reported above. Any contributor has a 50% chance of importing the wrong recordActivity.

**Suggested fix:** Delete the duplicate surface. Keep gamificationEngine.ts as the only public API (it already delegates mutations) and make gamification.ts internal, or vice versa — but stop exporting three same-named functions with different signatures.

### 36. [high] No typecheck, lint or test gate; tsconfig scope produces 1,296 errors and hides real bugs

**Area:** architecture · **File:** `package.json` · **Effort:** M

**Evidence:** package.json scripts today are exactly dev/build/preview/astro/fetch-accounts/verify-seo — no check, no lint, no test. devDependencies contains only @tailwindcss/typography and tailwindcss-rtl. tsconfig.json sets `"include": [".astro/types.d.ts", "**/*"]` with only dist excluded. I ran `npx tsc --noEmit`: 1,296 errors, 1,292 of them under scripts/, 4 under src/ (all TS1005/TS1161/TS1128 in useSimulator.ts). Crucially I proved the masking effect: because those 4 are SYNTACTIC errors, tsc skips semantic diagnostics for the entire program — repo-wide tsc reports zero TS2304/TS2339. Typechecking the four suspect simulator files directly surfaced all of them: `yakihonne/screens/SettingsScreen.tsx(276,22): Cannot find name 'Copy'`, `gossip/screens/ThreadScreen.tsx(96,24): Property 'map' does not exist on type 'number'`, `damus/screens/SettingsScreen.tsx(188,35): Property 'id' does not exist on type 'string'`, `snort/SnortSimulator.tsx(244,19): Property 'theme' does not exist`.

**Impact:** Every shipped runtime crash in this report (Copy, .map on a number, blank relay rows, dead theme toggle) was detectable by the typechecker and was hidden by two unparseable files in scripts/. The gate exists but is neutralised.

**Suggested fix:** Narrow tsconfig include to src/ (or fix/exclude scripts/pitiunited-accounts.ts and scripts/search-follows-accounts.ts), rename useSimulator.ts to .tsx, add `"check": "astro check && tsc --noEmit"` to package.json, and run it in CI.

### 37. [high] All 7 locale JSON files bundled into one 527 KB client chunk (build view)

**Area:** build-health · **File:** `src/i18n/index.ts` · **Effort:** M

**Evidence:** Third report of the same defect, verified from the build artifact. Today's build log line: `dist/_astro/useTranslation.Ck1Rc9K8.js 527.40 kB | gzip: 158.23 kB`, followed by the >500 kB chunk warning. Source JSON on disk totals 768 KB across 7 files. Reached by 122/154 HTML pages per my transitive-graph analysis of dist.

**Impact:** Same as above — counted once, not three times.

**Suggested fix:** Same as above.

### 38. [high] 306 KB of hardcoded account data compiled into a client bundle loaded by /tools/ and /follow-pack/

**Area:** build-health · **File:** `src/data/follow-pack/accounts.ts` · **Effort:** M

**Evidence:** Same defect as above, verified from the build side. `wc -c` gives 306,575 B for accounts.ts; today's build log shows `dist/_astro/categories.Dh5Bve5I.js 265.74 kB | gzip: 95.93 kB` as the second-largest chunk. /tools/ pulls both this and the 527 KB useTranslation chunk per my transitive graph.

**Impact:** Same as above — counted once.

**Suggested fix:** Same as above.

### 39. [high] Type checking is entirely non-functional: 1,296 tsc errors, two files that are not valid TypeScript, no CI gate

**Area:** build-health · **File:** `package.json` · **Effort:** M

**Evidence:** Duplicate of the architecture finding; same measurements taken today. `npx tsc --noEmit` -> 1,296 errors (1,292 scripts/, 4 src/). I did not re-run astro check, so I cannot confirm the 3,287 figure, but the substantive claim — no gate, and semantic checking suppressed program-wide — is confirmed as described above.

**Impact:** Same as above — counted once.

**Suggested fix:** Same as above.

### 40. [high] Stale hand-written public/privacy.html shadows the real /privacy route on Vercel

**Area:** build-health · **File:** `public/privacy.html` · **Effort:** S

**Evidence:** Both files exist after today's clean build: dist/privacy.html (3,377 B, copied verbatim from public/) and dist/privacy/index.html (19,284 B, generated from src/pages/privacy.astro). They are different documents — `<title>Privacy Policy - Nostrich.love</title>` vs `<title>Privacy Policy | Nostrich.love</title>`. I read public/privacy.html: standalone, inline <style> with hardcoded #333 and system-ui, no site chrome, no dark mode, no i18n. I counted 140 occurrences of `href="/privacy"` across the emitted HTML. Caveat on the impact: I could not exercise Vercel's router from here, so the `.html`-before-directory-index precedence is inferred from Vercel's documented static resolution order, not observed.

**Impact:** If the precedence holds, every one of the 140 footer/nav privacy links on the live site serves an unstyled, out-of-date policy page with no navigation and no dark mode, while the maintained page at src/pages/privacy.astro is unreachable.

**Suggested fix:** Delete public/privacy.html. Verify on a preview deployment that /privacy serves the Astro page.

### 41. [high] "Relays share posts with each other" is taught as fact in four guides and contradicted by the site's own protocol-comparison

**Area:** content-quality · **File:** `src/content/guides/en/relay-guide.mdx` · **Effort:** S

**Evidence:** relay-guide.mdx:43, inside "The Simple Explanation": "- **Relays** store it and share with other relays". outbox-model.mdx:184, under *Common Misconceptions*: "**Wrong:** Being on 20+ relays doesn't help. Your posts propagate through the network." faq.mdx:311 "Popular content spreads through the network naturally"; faq.mdx:557 "...or wait for propagation"; faq.mdx:570 "Wait 5-10 minutes for network propagation"; faq.mdx:607 "New relays can sync from existing ones". protocol-comparison.mdx:74 has it right: "**No Federation:** Relays don't talk to each other; clients aggregate from multiple sources."

**Impact:** The single most important mental model in Nostr is taught wrong in the beginner-facing guides and right only in the advanced one. It makes the outbox model incomprehensible and produces useless troubleshooting advice — "wait for propagation" when nothing will ever propagate.

**Suggested fix:** Fix relay-guide.mdx:43 to "your client sends it to every relay you've configured — relays never forward to each other", then sweep outbox-model.mdx:184 and faq.mdx:311/557/570/607. Add an explicit "most common misconception" callout in relays-demystified.mdx.

### 42. [high] Two flagship wallet recommendations shut down in Dec 2024 / Jan 2025 and are still the primary onboarding path

**Area:** content-quality · **File:** `src/content/guides/en/zaps-and-lightning.mdx` · **Effort:** M

**Evidence:** Unchanged in the file. Lines 121-125: "**Mutiny** (Web/Mobile) — Self-custodial in browser — No app store needed — [app.mutinywallet.com]"; repeated at nostr-tools.mdx:175-178. Lines 174-176 route users to "Alby Dashboard → API Keys" for the NWC connection string, and line 292 instructs "Paste: yourname@getalby.com" as the Lightning address to publish on their profile — Alby sunset its custodial shared wallet and @getalby.com Lightning addresses in favour of Alby Hub. Line 200 tells users to copy "`yourname@phoenix.wallet`" from Phoenix; that address format does not exist. Also still stale: line 24 "1000 sats = ~$0.30" and line 46 "Developer receives 100,000 sats ($30)" — both price BTC at roughly $30k.

**Impact:** The site's money page terminates its beginner path in a wound-down wallet and an address format that cannot receive payments. Users will publish a non-functional Lightning address on their profile and silently receive nothing.

**Suggested fix:** Drop Mutiny from zaps-and-lightning.mdx:121-125 and nostr-tools.mdx:175-178. Replace the Alby custodial flow with Alby Hub / Alby Go and add wallets with current beginner share (Primal's built-in wallet, Coinos, Blink, Zeus). Fix or remove the Phoenix address example at line 200 and refresh the sat/USD figures at lines 24 and 46.

### 43. [high] FAQ's "How do zaps work technically" reverses both halves of the NIP-57 flow and claims zaps are non-custodial

**Area:** content-quality · **File:** `src/content/guides/en/faq.mdx` · **Effort:** M

**Evidence:** Unchanged. Line 889: "Process: 1) Sender creates Lightning invoice, 2) Sender publishes zap receipt (kind 9735) with payment proof...". Line 893, under **Technical flow**: "1. **Invoice creation** - Sender's wallet creates Lightning invoice". In NIP-57 the sender sends an unpublished kind 9734 zap request to the recipient's LNURL callback; the recipient's LNURL server creates the description-hash invoice and, once paid, publishes the kind 9735 receipt. Lines 907-909, inside `<Callout type="info">`: "Zaps are non-custodial - money flows directly from sender to receiver. No platform holds funds." — false whenever the receiver uses a custodial wallet, which is exactly what this site recommends to beginners.

**Impact:** The answer explicitly labelled as the technical explanation is wrong at every step, so nobody can debug a failing zap from it, and the non-custodial line is a financial-safety misstatement given the site's own wallet recommendations.

**Suggested fix:** Rewrite the flow as 9734 request → recipient's LNURL server returns invoice → sender pays → LNURL server publishes the 9735 receipt. Replace the line 908 callout with "zaps settle to whatever wallet you configured — if it's custodial, that provider holds your sats." Add "recipient's LNURL provider doesn't advertise allowsNostr/nostrPubkey" as the top cause in both zap troubleshooting sections; it appears nowhere today.

### 44. [high] Fabricated client UI walkthroughs and invented product descriptions throughout the client-facing guides

**Area:** content-quality · **File:** `src/content/guides/en/nip17-private-messages.mdx` · **Effort:** L

**Evidence:** Unchanged, and the file contradicts itself three times, which is verifiable without leaving the repo. Damus: lines 135-140 "Settings → Privacy & Security → Message Encryption → Toggle 'Use NIP-17 for new messages' to ON" vs line 191 "NIP-17 is automatically enabled for new conversations". Amethyst: line 146 "Go to Settings → Messages" vs line 203 "Settings → Advanced → Protocol Settings". Primal: lines 152-154 "Settings → Privacy → Under 'Direct Messages,' select 'NIP-17 (Recommended)'" vs lines 213-215 "Settings → Security & Privacy → Under 'Messaging Protocol' select 'NIP-17 (Private)'". Elsewhere: multi-client.mdx:248-252 "**Coracle (Web):** - Matrix integration"; nostr-tools.mdx:186-188 "**Zap Stream** - **What it does:** Real-time zap notifications" (zap.stream is a NIP-53 live video client); finding-community.mdx:320-324 "**Nostrudel** - Specialized client for long-form" (general-purpose) and :332-336 "**YakiHonne** - Japanese-focused" and :398 offers Fountain (a podcast app) as a Twitter Spaces alternative; faq.mdx:167-169 recommends Nostrudel for long-form plus Plebstr and Current, both defunct.

**Impact:** Readers follow menu paths that do not exist and conclude their client is broken. Two different settings paths for the same client in the same document is the clearest AI-slop signal to both readers and Google's helpful-content system, and it undermines the guides that are accurate.

**Suggested fix:** Delete every unverified UI path and replace with "NIP-17 is the default in current Damus/Amethyst/Primal — update your app", optionally with one verified screenshot per client. Audit every product one-liner in multi-client.mdx, nostr-tools.mdx, finding-community.mdx and faq.mdx against the product's own homepage.

### 45. [high] NIP-17 guide omits the kind 10050 DM relay list, the spec-mandated top cause of undelivered DMs

**Area:** content-quality · **File:** `src/content/guides/en/nip17-private-messages.mdx` · **Effort:** M

**Evidence:** Grepping all 16 EN guides for "10050" returns zero hits. The Troubleshooting section at lines 258-286 lists exactly five failure modes and none is the real one: "Messages show as unreadable or gibberish" (recipient lacks NIP-17), "Can't see if someone read my NIP-17 message" (read receipts), "Messages appear out of order" (clock skew), "Relay rejects NIP-17 events" (old relay software), "Client shows both NIP-04 and NIP-17 options". NIP-17 requires clients to publish only to the relays in the recipient's kind 10050 list, and treats its absence as the user not being ready to receive messages.

**Impact:** The most common real-world NIP-17 failure — the recipient has no DM relay list, so messages are never delivered — is undiagnosable from this guide, and readers are sent down four wrong paths instead.

**Suggested fix:** Add a section explaining kind 10050, how to publish one in Amethyst/Damus/0xchat, and make "neither party has a DM relay list" troubleshooting cause #1 at line 260.

### 46. [high] All 8 audience landing pages are one template with 160-240 unique words; the only substantive block is client-rendered

**Area:** content-quality · **File:** `src/pages/nostr-for-parents.astro` · **Effort:** L

**Evidence:** Six of the eight are still the same 198-231 line template: diffing each against nostr-for-parents.astro (198 lines) gives 50 differing lines for artists, 70 for musicians, 70 for photographers, 79 for foodies, 125 for books — everything unique is the title, meta description, 3-4 valueProps and three step captions. bitcoiners (341 lines, 237 differing) and privacy (343 lines, 239 differing) are meaningfully more substantial, so "all 8 are one template" overstates those two. All 8 mount `<FeaturedCreatorsFromPack client:load />`, so the one content-bearing block renders nothing in the static HTML, and all 8 link only to the generic `/guides` with no topic-specific deep links. My dist link graph shows all 8 have zero internal inbound links.

**Impact:** Six near-identical URLs differentiated by a swapped noun, each below the thin-content threshold, competing for related queries with no internal links in or out — likely to be filtered or to drag sitewide quality signals rather than rank.

**Suggested fix:** Either consolidate the six thin pages into 2-3 with real substance (what these people actually post, which clients/hashtags/relays serve them, named accounts server-rendered), or give each 800+ words of distinct content plus deep links into the relevant guides. Server-render the featured-creator list either way.

### 47. [high] Guides are ~90% bullet fragments; median flowing prose is ~180 words per guide

**Area:** content-quality · **File:** `src/content/guides/en/nostr-tools.mdx` · **Effort:** L

**Evidence:** I re-measured, stripping frontmatter, code fences, JSX, headers, tables and bullet/numbered lines. Flowing-prose share of body words: troubleshooting 0.04 (34 prose words), protocol-comparison 0.05 (70), multi-client 0.06 (38), nostr-tools 0.06 (38), privacy-security 0.07 (62), finding-community 0.09 (77), zaps-and-lightning 0.09 (90), relay-guide 0.16 (157), keys-and-security 0.21 (104). Only quickstart (0.82) and what-is-nostr (0.38) are prose-led. My absolute counts differ from the audit's (different tokenizer) but the ratio confirms the claim. multi-client.mdx:47-65 is representative: three headers and nine two-word bullets.

**Impact:** Word count overstates depth roughly 10x. Beginners get assertions without the connective reasoning that makes a concept stick — which is precisely why the relay mental model doesn't land — and it reads as machine-generated to both readers and ranking systems.

**Suggested fix:** Pick the six highest-traffic guides and convert the bullet skeletons into written explanation with worked examples; keep bullets for genuine checklists and comparison tables only. Target ~60% prose.

### 48. [high] Streak counter is permanently pinned at 0 for anyone who reads a guide

**Area:** gamification-state · **File:** `src/components/progress/ProgressTracker.tsx` · **Effort:** S

**Evidence:** The write-ordering bug is real and present. ProgressTracker.tsx:19 calls `setLastViewedGuide(guideSlug, guideTitle)` and only then :22 `recordActivity('viewGuide')`. src/lib/progress.ts:229-231 ends setLastViewedGuide with `data.progress.lastActive = Date.now(); saveGamificationData(data);`. src/config/gamification.ts:129 gives viewGuide `streak: true`, so gamificationEngine.ts:172 delegates to gamification.ts:665 recordActivity(), which reloads from localStorage, reads lastActive (written ~1 ms earlier), computes `daysDiff = 0` at :673, and falls through both the `=== 1` and `> 1` branches at :675/:678 leaving streakDays untouched. For a first-time visitor lastActive is no longer null, so the `else { streakDays = 1 }` at :683 is skipped too. Every subsequent day repeats this, so the value never leaves 0. I corrected the severity because the audit's 'can never render for any user' is overstated: recordActivity is also called from FollowPackFinder.tsx:52 on /follow-pack and /tools, pages that do not mount ProgressTracker, so a user whose only activity is there can accrue a streak.

**Impact:** For the primary journey (read a guide), streakDays stays 0 forever, so StreakBannerWrapper.tsx sets isVisible=false and the streak banner in the global Layout never appears for any guide reader. A whole engagement feature is silently dead, and it is hydrated on all 38 routes to render nothing.

**Suggested fix:** Swap the order in ProgressTracker.tsx (call recordActivity before setLastViewedGuide), or better, stop setLastViewedGuide from writing lastActive at src/lib/progress.ts:229 and make recordActivity() the single owner of that field.

### 49. [high] BadgeEarnedModal is unreachable — listener and dispatcher use different event names

**Area:** gamification-state · **File:** `src/components/gamification/BadgeEarnedModalListener.tsx` · **Effort:** S

**Evidence:** Line 22 today: `window.addEventListener('badge-earned', handleBadgeEarned as EventListener)`. A repo-wide grep for dispatchEvent returns exactly one badge dispatcher: src/utils/gamificationEngine.ts:251 `window.dispatchEvent(new CustomEvent('badge-awarded', { detail: { badgeId, badgeName } }))`. The only other 'badge-earned' hits in src/ are the aria ids at BadgeEarnedModal.tsx:159/160/261/271. Separately, src/utils/gamification.ts:586-600 awardBadge() — the path PrivacySecurityQuiz.tsx:109 uses — dispatches no event at all. The listener is mounted on every guide page (src/pages/[...lang]/guides/[slug].astro:297-300). Downgraded from critical because nothing crashes or is lost; a celebration modal simply never opens.

**Impact:** Users never see the badge-earned celebration. Combined with the /badges page reading the wrong field, there is no surface anywhere in the product that tells a user they earned a badge.

**Suggested fix:** Rename one side so they match, and make gamification.ts:586-600 awardBadge() dispatch the same event with the full Badge object the modal expects (it currently would carry a BadgeId string, not a Badge).

### 50. [high] Level-unlock threshold is computed three different ways, so the UI promises a number the engine does not honour

**Area:** gamification-state · **File:** `src/utils/gamification.ts` · **Effort:** S

**Evidence:** All three values confirmed today. (1) gamification.ts:1247 `const threshold = Math.max(4, Math.ceil(totalInLevel * 0.7))`; with SKILL_LEVELS.intermediate.sequence of 6 guides that is max(4, 5) = 5. (2) src/data/learning-paths.ts:68 declares `unlockThreshold: 3` for advanced, and src/pages/[...lang]/guides/index.astro passes `unlockThreshold: levelConfig.unlockThreshold` into GuideSection, which renders it at GuideSection.tsx:197/200 via `.replace('{count}', String(unlockThreshold))` and at :233 as `unlockThreshold - completedCount`. (3) src/pages/progress.astro:521 hardcodes `const threshold = 4;`.

**Impact:** The guides index tells the user they need 3 intermediate guides to unlock Advanced, /progress tells them 4, and the engine requires 5. A user who completes exactly 3 sees the UI count down to 'nothing left to do' and Advanced still does not unlock — with no explanation.

**Suggested fix:** Delete the computed threshold at gamification.ts:1247 and read SKILL_LEVELS[nextLevel].unlockThreshold; replace the hardcoded 4 in progress.astro:521 with the same lookup.

### 51. [high] The privacy settings page cannot actually turn tracking off — two of three writers ignore it

**Area:** gamification-state · **File:** `src/lib/progressService.ts` · **Effort:** S

**Evidence:** The substantive defect holds, though the audit's grep evidence was slightly wrong. Confirmed today: progressService.ts respects the flags (saveProgressData at :134 and updateGuideProgress at :217 both call getPrivacySettings), and src/components/tour/tourStorage.ts:92 also checks it — which the audit claimed returned nothing. But the gamification writers do not: a repo-wide grep for getPrivacySettings/isTrackingEnabled returns zero hits in src/utils/gamification.ts and zero in src/lib/progress.ts, so saveGamificationData (gamification.ts:461-495), recordActivity (:665) and setLastViewedGuide (src/lib/progress.ts:229-231) write to localStorage unconditionally. Also confirmed the contradiction at progressService.ts:23-29: the comment reads 'all opt-in, disabled by default' directly above `trackingEnabled: true`.

**Impact:** A user who opens the privacy controls and switches tracking off still has their guide completions, streak timestamps, badges and last-viewed guide written to localStorage on every page view. For a site whose pitch is privacy-preserving self-sovereignty, the control is a placebo.

**Suggested fix:** Add an `isTrackingEnabled()` guard at the top of saveGamificationData and setLastViewedGuide, and fix the default at progressService.ts:24-29 to match the stated opt-in intent (or fix the comment).

### 52. [high] Export/Import Data Portability silently discards badges, streak, levels and per-level completion

**Area:** gamification-state · **File:** `src/lib/progressService.ts` · **Effort:** M

**Evidence:** Confirmed today. exportProgressData (line 272) returns `JSON.stringify(getProgressData())`, and ProgressData is declared at lines 48-54 as exactly `{ deviceId, schemaVersion, guides, preferences, lastUpdatedAt }` — no badges, no streakDays, no unlockedLevels, no completedByLevel, no stats. importProgressData (line 279) feeds it back through saveProgressData. The correct round-trip pair exportGamificationData/importGamificationData in src/utils/gamification.ts has zero references anywhere outside its own file. The UI wiring is real: PrivacyControls.tsx:7-8 imports both and calls them at :60 and :73.

**Impact:** A user who follows the 'export your data' flow before clearing their browser, then re-imports, silently loses every badge, their streak, their unlocked skill levels and per-level completion. Only the flat guides map survives — data loss presented as a data-portability feature.

**Suggested fix:** Point PrivacyControls at exportGamificationData/importGamificationData from src/utils/gamification.ts, or widen ProgressData to carry the full gamification payload.

### 53. [high] Arabic users earn the epic Privacy Expert badge after 2 questions; Hindi users get an English quiz

**Area:** gamification-state · **File:** `src/i18n/locales/ar.json` · **Effort:** M

**Evidence:** Parsed all seven locale files today at guides.privacySecurity.quiz.questions: en 6, pl 6, es 6, de 6, zh 6, ar 2, hi -> KeyError ('privacySecurity' is absent from hi.json entirely). The Arabic ids are ['public-nature','separate-identities'], which do not overlap the English set, so getValue's English fallback (src/i18n/index.ts:52-63) never triggers for ar. PrivacySecurityQuiz.tsx:107 awards on `showResults && score === total` where total is questions.length. Both pages exist in today's build: dist/ar/guides/privacy-security/index.html and dist/hi/guides/privacy-security/index.html.

**Impact:** Arabic readers get a 2-question quiz and the 'epic' Privacy Expert badge for a third of the work. Hindi readers open a Hindi guide and hit a fully English 6-question quiz — the worst possible i18n failure, since it looks like the translation was abandoned mid-page.

**Suggested fix:** Translate the 6 canonical questions into ar.json and add the missing guides.privacySecurity block to hi.json. Add a build-time parity check that asserts equal array lengths for quiz question arrays across locales.

### 54. [high] Two of the nine badges are mathematically unearnable; the config activities that would award them have no call sites

**Area:** gamification-state · **File:** `src/config/gamification.ts` · **Effort:** M

**Evidence:** Confirmed today. src/config/gamification.ts defines makeFirstPost (line 245), receiveFirstZap (line 266) and completeQuiz (line 286), all with `streak: true` and badge triggers. A repo-wide grep for `recordActivity('makeFirstPost'`, `recordActivity('receiveFirstZap'` and `recordActivity('completeQuiz'` returns zero hits — the only recordActivity call sites in src/ are ProgressTracker.tsx:22 ('viewGuide'), RelayExplorer.tsx:393 ('selectRelays'), KeyGenerator.tsx:163/228 ('generateKeys'/'backupKeys'), FollowPackFinder.tsx:52 ('followAccounts') and PrivacySecurityQuiz.tsx:129 (the no-arg variant). The gamification.ts recorders recordFirstPost (:741) and recordZapReceived (:751) appear only in their own definitions and two re-export lists (:1344-1345, :1405-1406), never at a call site.

**Impact:** The /badges page permanently displays two locked badges ('first-post', 'zap-receiver') that no sequence of actions can unlock, plus a completeQuiz activity that never fires. Users chase achievements that do not exist.

**Suggested fix:** Either wire the activities to real triggers (the simulators have compose and zap interactions that could fire them) or remove the two badges from the config and BADGE_DEFINITIONS so the grid only shows earnable ones.

### 55. [high] Only guides are localized: 33 of 152 built pages are English-only and the language switcher silently does nothing on them

**Area:** i18n-parity · **File:** `src/components/LanguageSwitcher.tsx` · **Effort:** L

**Evidence:** src/pages/[...lang]/ still contains exactly two routes (guides/[slug].astro, guides/index.astro). Everything else is flat and English-only: index.astro, about, tools, glossary, resources, badges, progress, settings, privacy, 404, follow-pack, twitter-bridge, relay-feed-browser, damus-demo, 8 nostr-for-*, and simulators/*. LanguageSwitcher.tsx:56-62 now states it outright — `const newPath = hasLocalizedVersions(currentPath) ? localePath(currentPath, langCode) : stripLocale(currentPath)` — so picking German on /tools writes preferredLanguage to localStorage and reloads the identical English page. The hreflang half of this finding is fixed (hasLocalizedVersions gates alternates to /guides), so search engines no longer advertise the missing translations.

**Impact:** The homepage and every audience acquisition landing page — the exact pages non-English organic traffic lands on — are English-only, and the switcher gives no feedback that the choice had no effect.

**Suggested fix:** Decide scope explicitly: either move the landing pages and /tools under [...lang]/ and extract copy into the locale JSON, or disable/annotate the switcher on non-guide routes (e.g. grey it out with a tooltip when hasLocalizedVersions(path) is false) so the no-op is visible rather than silent.

### 56. [high] RTL is cosmetic: dir="rtl" is set but zero logical utilities are used, so tailwindcss-rtl is inert

**Area:** i18n-parity · **File:** `tailwind.config.js` · **Effort:** L

**Evidence:** tailwind.config.js:161 still reads `plugins: [require("@tailwindcss/typography"), require("tailwindcss-rtl")]`. Across all .tsx/.astro/.css in src/ I counted 0 occurrences of any logical utility (ms-/me-/ps-/pe-/start-/end-/text-start/text-end), 0 `rtl:` variants, and 0 `[dir="rtl"]` rules — the plugin only adds logical utilities, it does not rewrite physical ones, so it currently emits nothing that is used. Against that: 728 direction-locked utility occurrences (ml-/mr-/pl-/pr-/left-/right-/border-l-/border-r-/rounded-l/rounded-r/text-left/text-right/space-x-). src/layouts/Layout.astro:20 is the only direction-aware line, `<html lang={htmlLang} dir={dir}>`, and the built dist/ar/guides/keys-and-security/index.html confirms `<html lang="ar" dir="rtl" class="scroll-smooth">`.

**Impact:** Arabic pages get RTL text flow inside LTR-built chrome — gutters, chevrons, progress bars, badge placement and the mobile menu all mirror the wrong way. It reads as broken rather than merely untranslated.

**Suggested fix:** Either commit to RTL (migrate the direction-locked utilities on components that render on /ar/ pages to logical equivalents and swap arrow glyphs for direction-aware icons), or drop the tailwindcss-rtl dependency and the dir="rtl" claim so the layout is at least internally consistent.

### 57. [high] Six Arabic guides are abridged summaries, not translations — 14% to 53% of the English content

**Area:** i18n-parity · **File:** `src/content/guides/ar/protocol-comparison.mdx` · **Effort:** L

**Evidence:** I re-measured prose characters (frontmatter, code fences and JSX stripped) and heading counts for all 16 guides x 7 locales. Arabic outliers, ratio vs en (headings ar/en): protocol-comparison 0.14 (5/14), zaps-and-lightning 0.25 (8/25), privacy-security 0.26 (9/19), relay-guide 0.31 (11/19), troubleshooting 0.33 (8/23), relays-demystified 0.53 (9/14). The other ten Arabic guides sit at 0.86-0.97 with heading counts identical to English, so this is not an Arabic-density artifact. zh/protocol-comparison is likewise 0.15 (7/14) against a zh baseline of 0.44-0.71. de/es/pl/hi are 1.01-1.18 across the board.

**Impact:** Arabic readers of six of sixteen guides — including troubleshooting and privacy-security, the two most safety-relevant — get a fraction of the guidance, while hreflang and the sitemap now correctly present these as equivalent alternates of the full English pages.

**Suggested fix:** Backfill the missing sections for the six Arabic guides and zh/protocol-comparison; add a build-time check that fails when a locale guide's heading count deviates more than ~20% from its English counterpart.

### 58. [high] Every React island server-renders in English regardless of route — static HTML for /ar/ and /zh/ pages is English

**Area:** i18n-parity · **File:** `src/i18n/index.ts` · **Effort:** M

**Evidence:** src/i18n/index.ts:21 is unchanged: `getCurrentLocale(path: string = typeof window !== 'undefined' ? window.location.pathname : '')`. During static generation `window` is undefined, so path is '', none of the startsWith checks at lines 22-27 match, and it returns 'en'. src/hooks/useTranslation.ts:6 seeds state with `useState<Locale>(getCurrentLocale())`, so every useTranslation island SSRs in English and only corrects itself after hydration. Confirmed in the fresh build: dist/ar/guides/keys-and-security/index.html contains the literal strings "Generate Your Nostr Keys", "Backup Your Keys" and "Which item can you safely share" inside `<html lang="ar" dir="rtl">`.

**Impact:** Crawlers, no-JS users and every visitor during the hydration window see English interactive content on Arabic/Chinese/Hindi pages, diluting the language signal of the indexed HTML and producing a visible flash of English on slow devices.

**Suggested fix:** Pass `locale` as a prop from the Astro page (already in scope at [slug].astro:102) and have useTranslation accept an initial locale. This also lets you delete the 100ms setInterval poll at useTranslation.ts:20-25 that currently runs per island for the life of the page.

### 59. [high] Global Layout hydrates React + framer-motion on all 38 routes to render nothing

**Area:** islands-hydration · **File:** `src/layouts/Layout.astro` · **Effort:** S

**Evidence:** Line 156 today: `<StreakBannerWrapper client:only="react" />`, imported at line 6, in the layout every page uses. StreakBannerWrapper.tsx imports StreakBanner, which imports motion/AnimatePresence from framer-motion plus lucide icons. Its useEffect calls getStreakInfo() and sets `shouldShow = streakDays > 0` (line ~36), so with the streak bug above it always resolves to false. client:only also means no SSR HTML, so the cost is pure JS.

**Impact:** Every visitor on every page pays react-dom + framer-motion download, parse and hydration for a banner that renders nothing. This is the site's global JS floor and it currently buys zero pixels.

**Suggested fix:** Gate it: read streakDays from localStorage in a tiny inline script and only mount the island when > 0, or switch to client:idle at minimum. Fixing the streak bug first is a prerequisite for this island being worth anything.

### 60. [high] 431 of 434 client directives are client:load; many islands hydrate at 94-100% page depth

**Area:** islands-hydration · **File:** `src/content/guides/en` · **Effort:** M

**Evidence:** Recounted today across src/**/*.astro and *.mdx: 431 `client:load`, 2 `client:only`, 1 `client:visible`, 0 `client:idle`, 0 `client:media`. (The audit said 438; the small drift is from the e94df88 edits.) Confirmed src/pages/[...lang]/guides/[slug].astro:209 hydrates ProgressTracker client:load and :297/:300 hydrate ContinueLearning and BadgeEarnedModalListener after </main>.

**Impact:** Everything below the fold — quizzes, accordions, the badge modal — competes for main thread time during initial load instead of hydrating when scrolled into view, inflating TBT on content pages that are mostly prose.

**Suggested fix:** Mechanical: change client:load to client:visible for any island not in the first viewport. The MDX quizzes and FAQ accordions are the highest-value targets.

### 61. [high] FAQ page mounts 29 separate React roots for accordions that need no JavaScript

**Area:** islands-hydration · **File:** `src/content/guides/en/faq.mdx` · **Effort:** M

**Evidence:** `grep -c client:load src/content/guides/en/faq.mdx` returns exactly 29 today, all FAQAccordion. The file is duplicated across all 7 locales, so 203 island instances repo-wide. FAQAccordion's whole interactive surface is one useState toggle plus a framer-motion height transition.

**Impact:** The FAQ page — a common entry point from search — creates 29 React roots and pulls framer-motion for behaviour that <details>/<summary> gives for free with zero JS.

**Suggested fix:** Replace FAQAccordion with a native <details>/<summary> Astro component (no client directive at all), or at minimum switch the 26 below-the-fold instances to client:visible.

### 62. [high] 299 KB follow-pack account dataset ships below the fold on 8 landing pages to render 6 items

**Area:** islands-hydration · **File:** `src/data/follow-pack/accounts.ts` · **Effort:** M

**Evidence:** src/data/follow-pack/accounts.ts is 306,575 B on disk. src/components/community/FeaturedCreatorsFromPack.tsx:3 imports `curatedAccounts` from it. Verified in today's build: it compiles to dist/_astro/categories.Dh5Bve5I.js = 265,738 B raw / 95,459 B gzip, and my transitive dist graph shows it reaching exactly 10 pages — the 8 nostr-for-* landing pages plus /tools/ and /follow-pack/. On nostr-for-bitcoiners.astro the component sits at line 269, far below the fold.

**Impact:** Eight audience landing pages each ship ~95 KB gzip of account records to render 6 avatars, and on the bitcoiners/privacy pages that JS is for content the visitor may never scroll to.

**Suggested fix:** Render the 6 featured creators at build time in the .astro page (Astro can read accounts.ts server-side and emit static HTML), or move the dataset to a fetched JSON asset behind client:visible.

### 63. [high] 264KB 500x500 PNG logo rendered at 40x40 in the header of all 152 pages

**Area:** performance · **File:** `src/components/layout/Header.astro` · **Effort:** S

**Evidence:** Header.astro:35 is still `<img class="scale-[1.5]" src="/logo.png" width={40} height={40} alt="" />`, duplicated at Footer.astro:58. `ls -la public/logo.png` = 263,998 bytes. Both header and footer render on essentially every one of the 154 built pages.

**Impact:** ~258 KB of wasted bytes on first paint of every page, competing with render-blocking CSS and fonts during the LCP window, for an image the browser downsamples to 60x60.

**Suggested fix:** Import through astro:assets and render `<Image src={logo} width={60} height={60} format="webp" />`, or hand-generate a 120x120 WebP and swap the src. Keep the explicit width/height.

### 64. [high] useTranslation mounts a 100ms polling setInterval per component instance

**Area:** performance · **File:** `src/hooks/useTranslation.ts` · **Effort:** S

**Evidence:** Read the file today — lines 19-25 are verbatim `const interval = setInterval(() => { const currentLocale = getCurrentLocale(); if (currentLocale !== locale) { setLocale(currentLocale); } }, 100);` inside a useEffect whose dependency array is `[locale]` (line 30), so the timer is torn down and recreated on every locale change. 38 .tsx files call useTranslation, and the useTranslation chunk is in the graph of every guide page.

**Impact:** ~70 main-thread wakeups per second on a completely idle guide page, each reading location.pathname and running prefix comparisons — harms INP, drains mobile battery, prevents low-power states. On a static site the locale cannot change without a full navigation.

**Suggested fix:** Delete the interval; read the locale once from the URL at module scope. Keep the popstate listener if SPA navigation is ever added.

### 65. [high] Astro's image pipeline is configured but never used — 73 raw <img> tags

**Area:** performance · **File:** `astro.config.mjs` · **Effort:** L

**Evidence:** astro.config.mjs:66-70 still configures `image.service.entrypoint: "astro/assets/services/sharp"`. Grepping all src/ files today: 0 matches for `astro:assets` and 0 for `<Image`. 73 raw `<img` tags remain and only 2 carry `loading="lazy"`. In the fresh build dist/follow-pack/index.html has 14 images, 12 of them remote third-party avatars with no dimensions.

**Impact:** No WebP/AVIF conversion, no srcset, no automatic dimensions, no lazy loading — every image loads eagerly at full resolution and every dimensionless image is a CLS source. The installed sharp dependency does nothing.

**Suggested fix:** Migrate local images to import + <Image> from astro:assets; for remote avatars add loading="lazy", decoding="async" and explicit width/height or a fixed-size CSS box.

### 66. [high] Render-blocking third-party Google Fonts with no preload, plus a dead no-op @font-face

**Area:** performance · **File:** `src/layouts/Layout.astro` · **Effort:** S

**Evidence:** Layout.astro:136-138 still emits preconnect to fonts.googleapis.com, preconnect to fonts.gstatic.com, and the render-blocking `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />`. `find public src -name '*.woff2' -o -name '*.woff' -o -name '*.ttf'` returns nothing, so nothing is self-hosted, and there is no `<link rel="preload" as="font">` anywhere. Layout.astro:35-38 still declares `@font-face { font-family: 'Inter'; font-display: swap; }` with no src descriptor — browsers discard it, so the block labelled 'Critical font display' does nothing.

**Impact:** A two-hop blocking chain (HTML → googleapis CSS → gstatic woff2) before text can render in Inter, typically 300-600 ms on mobile, directly delaying LCP on the homepage and every guide where the LCP element is text.

**Suggested fix:** Self-host Inter woff2 under public/fonts/, declare a real @font-face with src, preload the one or two above-the-fold weights, and delete the src-less @font-face block.

### 67. [high] framer-motion (118KB raw / 39KB gzip) loads on every page including the homepage

**Area:** performance · **File:** `src/layouts/Layout.astro` · **Effort:** M

**Evidence:** The fresh build emits dist/_astro/proxy.DZJmjMMK.js at 118,636 bytes raw / 38,740 bytes gzip. I walked the transitive module graph of dist/index.html and dist/glossary/index.html — that chunk is present in both. Layout.astro:156 still mounts `<StreakBannerWrapper client:only="react" />` globally, and StreakBanner.tsx imports { motion, AnimatePresence } from 'framer-motion'.

**Impact:** Every visitor pays 39 KB gzip / 118 KB raw of parse cost for an animation library that on the homepage animates a banner most first-time visitors never see (it renders only when streakDays > 0).

**Suggested fix:** Replace the streak banner's entrance animation with a CSS keyframe so framer-motion drops out of the shared chunk; audit the remaining motion elements, most of which are simple fades Tailwind transitions cover.

### 68. [high] Gossip simulator page ships 573KB of HTML, half of it duplicated inline SVGs

**Area:** performance · **File:** `src/simulators/gossip` · **Effort:** M

**Evidence:** In the fresh build dist/simulators/gossip/index.html is 573,305 bytes — 3.5x the next largest page (dist/hi/guides/relays-demystified at 169,221). I parsed it: 1,325 inline <svg> elements totalling 284,705 bytes with only 23 distinct shapes. Every other page in the build is under 170 KB.

**Impact:** The browser must parse 573 KB of markup and build ~1,300 extra SVG DOM subtrees before first paint, a direct FCP/LCP delay and a large mobile memory footprint (compression hides it on the wire but not on the main thread).

**Suggested fix:** Define the repeated icons once as <symbol> in a single inline sprite and reference them with <use href="#icon-zap"/>; also reconsider server-rendering 326 feed items.

### 69. [high] One 193KB stylesheet is loaded render-blocking by 152 pages

**Area:** performance · **File:** `tailwind.config.js` · **Effort:** M

**Evidence:** The fresh build emits dist/_astro/_slug_.B1SINYHZ.css at exactly 193,330 bytes — 8x the next largest sheet (primal.BjwTDiHT.css at 24,620). I scanned all built HTML: 152 of the 154 pages link it. Cause confirmed at tailwind.config.js:4, whose content glob `./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}` sweeps in all 10 simulators under src/simulators/. Note the finding names the file tailwind.config.mjs; the actual file is tailwind.config.js (there is no .mjs).

**Impact:** A single render-blocking request that must complete before first paint on every route, carrying roughly 5-6x more CSS than any one page uses — the critical-path bottleneck for FCP/LCP on slow connections.

**Suggested fix:** Scope simulator styles into the simulator routes so Astro emits per-route CSS, and inline the ~5-8 KB of genuinely critical above-the-fold CSS via build.inlineStylesheets.

### 70. [high] public/site.webmanifest is invalid JSON and is linked from every page

**Area:** repo-hygiene · **File:** `public/site.webmanifest` · **Effort:** S

**Evidence:** Read the file today. Line 7 is verbatim `"background_color":="#ffffff",` — a stray `=` after the colon. `python3 -c "import json;json.load(open('public/site.webmanifest'))"` fails with `JSONDecodeError: Expecting value: line 7 column 22 (char 240)`. SEO.astro:114 still emits `<link rel="manifest" href="/site.webmanifest" />` on every route.

**Impact:** Browsers silently discard the manifest on all routes: no Add-to-Home-Screen, no install prompt, no manifest name/icons/theme colour, and Lighthouse PWA/Best-Practices flags it.

**Suggested fix:** Change to `"background_color": "#ffffff"` and add a JSON-lint step to the build script so malformed static JSON fails loudly.

### 71. [high] AGENTS.md rule #2 tells every agent to generate URLs the site now 301-redirects away from

**Area:** repo-hygiene · **File:** `AGENTS.md` · **Effort:** M

**Evidence:** AGENTS.md:78-80 today still reads '### 2. Guide Links MUST Include Locale Prefix / ❌ WRONG: /guides/what-is-nostr / ✅ CORRECT: /en/guides/what-is-nostr'. Meanwhile astro.config.mjs sets prefixDefaultLocale:false, src/i18n/paths.ts is the tracked helper, and vercel.json permanently 301s /en/guides and /en/guides/:slug to the un-prefixed forms. RULES.md:82-84 repeats the inverted advice, and it also appears in I18N_PATTERNS.md and CONTENT_AUDIT_AND_KNOWLEDGE_MAP.md.

**Impact:** Any agent or contributor following the project's own top-priority rule file emits links that cost a 301 hop and contradict the canonical/hreflang model just landed in e94df88.

**Suggested fix:** Rewrite rule #2 to 'English is un-prefixed; build guide URLs via guidePath/localePath in src/i18n/paths.ts, never by string concatenation', and fix the same passages in RULES.md, I18N_PATTERNS.md and CONTENT_AUDIT_AND_KNOWLEDGE_MAP.md.

### 72. [high] AGENTS.md's mandatory new-locale checklist points at three files that no longer exist

**Area:** repo-hygiene · **File:** `AGENTS.md` · **Effort:** M

**Evidence:** AGENTS.md:62-64 rows 3-5 still name `src/pages/[lang]/guides/[slug].astro`, `src/pages/[lang]/guides/index.astro` and `src/pages/guides/index.astro`; line 222 draws the tree as `pages/[lang]/guides/`. On disk today `ls -d 'src/pages/[lang]' src/pages/guides` returns 'No such file or directory' for both — only `src/pages/[...lang]` exists. The same dead paths also live in the tracked .agents/skills/astro-i18n-translation/SKILL.md.

**Impact:** Three of the six steps in the document that self-describes as 'the #1 source of bugs when adding locales' are unfollowable; the next locale addition risks recreating src/pages/[lang]/ alongside [...lang]/ and producing colliding routes.

**Suggested fix:** Update AGENTS.md:62-64 and :222 to the [...lang] paths, drop the removed src/pages/guides/index.astro row, add src/i18n/paths.ts as the source of truth, and regenerate the tracked SKILL.md.

### 73. [high] RULES.md documents 4 locales when the project has 7, and is untracked

**Area:** repo-hygiene · **File:** `RULES.md` · **Effort:** M

**Evidence:** RULES.md:50 reads '**Supported Locales:** `en` (English), `pl` (Polish), `es` (Spanish), `de` (German)'; :66-69 say 'Copy the SAME keys to pl.json, es.json, de.json' and 'Verify all 4 files have identical key structure'. Reality: src/config/locales.ts:2 is `['en','pl','es','de','zh','ar','hi']`. `git ls-files --error-unmatch RULES.md` fails — still untracked. Recounted leaf values today: en 2032, zh 2032, de 2014, es 1969, pl 1831, ar 1046, hi 829 — ar at 51% and hi at 41% of English.

**Impact:** An agent following RULES.md updates 4 of 7 locale files and ships zh/ar/hi with missing keys — the drift is already measurable. On a fresh clone the file is absent entirely, so AGENTS.md's primary workflow pointer resolves to nothing.

**Suggested fix:** Update RULES.md to all 7 locales (or fold it into AGENTS.md) and `git add RULES.md`.

### 74. [high] 9 of the 14 documents AGENTS.md tells agents to load are unreachable from a fresh clone

**Area:** repo-hygiene · **File:** `AGENTS.md` · **Effort:** S

**Evidence:** Checked all 14 @-references in the AGENTS.md:229-244 table individually. Missing at the referenced path: SEO_LESSONS_LEARNED.md and DEPLOYMENT_CHECKLIST.md (both actually live under docs/). Present on disk but untracked, so absent after clone: RULES.md, CODEBASE_AUDIT.md, CONTENT_AUDIT_AND_KNOWLEDGE_MAP.md, LESSONS_ZH_LOCALE.md, LESSONS_AR_LOCALE.md, LESSONS_FEATURES.md, LESSONS_RETRO.md. Only TEACHING_METHODS.md, I18N_PATTERNS.md, I18N_REFERENCE.md, CONTENT_TRANSLATION.md and NOSTR_KNOWLEDGE.md resolve — exactly 9 of 14 broken.

**Impact:** On any new machine or CI runner the auto-loaded rule file dead-links 64% of its own knowledge base, including the SEO and refactoring guidance it marks in bold as critical.

**Suggested fix:** git add the seven untracked docs (or delete the superseded ones) and correct the two @-paths to docs/SEO_LESSONS_LEARNED.md and docs/DEPLOYMENT_CHECKLIST.md.

### 75. [high] scripts/verify-seo.js validates routes the routing refactor removed

**Area:** repo-hygiene · **File:** `scripts/verify-seo.js` · **Effort:** S

**Evidence:** Ran `node scripts/verify-seo.js` against the freshly rebuilt dist/ today. It printed '✗ en: Could not read dist/en/guides/what-is-nostr/index.html' and '✗ en/guides/: Could not read file'. `ls -d dist/en` confirms no such directory — e94df88 made English un-prefixed, so English builds to dist/guides/. The script's testUrls and indexLocales arrays still contain 'en' with /en/ paths.

**Impact:** The project's only quality gate reports false failures for English on every run, training whoever runs it to ignore its output — including the hreflang and x-default assertions that do matter.

**Suggested fix:** Map 'en' to the un-prefixed dist/guides/... paths in testUrls and indexLocales, keeping prefixes for the other six locales.

### 76. [high] A 65MB git worktree copy of the repo lives inside an un-gitignored .claude/ directory

**Area:** repo-hygiene · **File:** `.gitignore` · **Effort:** S

**Evidence:** `git worktree list` shows /Users/piotrczarnoleski/nostr-beginner-guide/.claude/worktrees/funny-noether-f07f82 on branch claude/funny-noether-f07f82 at c0e4922. `du -sh .claude` = 65M (grown from the audit's 52M). I read .gitignore in full today: it lists dist/, .astro/, node_modules/, logs, .env, .DS_Store, .idea/, .vercel, .ai, experiments, ai-docs, ai-scripts, learning — `.claude` is absent, and `git status --porcelain` reports `?? .claude/`.

**Impact:** `git add -A` would try to commit a nested repo; every repo-wide grep, IDE index and codemod sees two copies of every doc and config, so fixes to AGENTS.md silently leave the shadow copy stale.

**Suggested fix:** Add `.claude/` to .gitignore; remove the finished worktree with `git worktree remove .claude/worktrees/funny-noether-f07f82` or relocate worktrees outside the repo root.

### 77. [high] tsconfig.json overrides TypeScript's default excludes, pulling learning/ into the program

**Area:** repo-hygiene · **File:** `tsconfig.json` · **Effort:** S

**Evidence:** Read tsconfig.json today: `"include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"]` — specifying `exclude` replaces TypeScript's defaults. Proved it empirically with `tsc -p tsconfig.json --listFilesOnly`: the top directory by file count is `learning/astro-learning` with 161 files, ahead of src/components (147) and src/simulators (140), plus a full node_modules walk. The full `tsc --noEmit` run took minutes and returned 1,296 errors.

**Impact:** astro check, tsc and the editor language service walk hundreds of MB of unrelated TypeScript with duplicate React/Astro declarations — the usual cause of multi-minute checks and phantom duplicate-identifier errors.

**Suggested fix:** Set `"exclude": ["dist", "node_modules", ".claude", ".opencode", "learning", "ai-scripts", ".vercel"]` or narrow include to [".astro/types.d.ts", "src/**/*"].

### 78. [high] Six client simulators ask beginners to paste their real nsec into a password field

**Area:** security-privacy · **File:** `src/simulators/keychat/screens/LoginScreen.tsx` · **Effort:** M

**Evidence:** Opened all six. keychat LoginScreen.tsx:118-121 `type="password" ... placeholder="Paste your nsec private key"` with `disabled={nsec.trim().length < 10}` (line 127). Identical `type="password"` + `placeholder="nsec1..."` at damus/screens/LoginScreen.tsx:106-110, snort:114-117, amethyst:139-142, primal/web:114-117, yakihonne:126-129. None carries `autocomplete="off"`, `name`, or `data-1p-ignore`, so a password manager will offer to save the value. Only mitigation is grey 11px text at damus:119 "Demo: Click \"Sign In\" to use a mock account".

**Impact:** The site teaching key hygiene reproduces the exact phishing interaction verbatim, and browsers/password managers will offer to store a pasted real nsec under the nostrich.love origin.

**Suggested fix:** Replace with a non-input display, or keep `type="text" autocomplete="off" data-1p-ignore` prefilled with an obviously fake nsec and hard-block real `nsec1...` input behind an interstitial.

### 79. [high] Zero security headers in vercel.json (no CSP, frame-ancestors, Referrer-Policy)

**Area:** security-privacy · **File:** `vercel.json` · **Effort:** M

**Evidence:** Read the whole file today: it is `$schema` plus exactly three `redirects` entries (/en/guides, /en/guides/:slug, /en). No `headers` key, no `cleanUrls`, no `trailingSlash`. No public/_headers file exists. astro.config.mjs:15-16 is `output: "static", adapter: undefined`, so nothing injects headers at runtime.

**Impact:** /tools generates a secp256k1 private key in the browser with no CSP exfiltration barrier and no framing protection; full guide URLs leak as Referer to Google Fonts and ~12 image CDNs.

**Suggested fix:** Add a `headers` block to vercel.json for `/(.*)`: CSP with `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`. Layout.astro's `is:inline` scripts (lines 29, 161) need hashes or a nonce.

### 80. [high] Privacy policy claims "No third-party trackers" while every page loads Google Fonts

**Area:** security-privacy · **File:** `src/pages/privacy.astro` · **Effort:** M

**Evidence:** privacy.astro:35-37 still reads "**No third-party trackers** - No Facebook pixels, Google Analytics, or similar". Meanwhile Layout.astro:136-138 emits preconnect to fonts.googleapis.com/fonts.gstatic.com plus the Inter stylesheet. Scanned the fresh build: 608 fonts.googleapis.com and 304 fonts.gstatic.com references across dist/, plus 377 api.dicebear.com. src/data/follow-pack/accounts.ts hardcodes 15 pbs.twimg.com and 10 i.imgur.com avatar URLs; dist/follow-pack/index.html has 14 <img>, 12 remote.

**Impact:** The privacy claim is factually false on a site whose whole pitch is privacy; every pageview sends IP/UA/Referer to Google, and /follow-pack additionally discloses the visitor to Twitter's and Imgur's CDNs.

**Suggested fix:** Self-host Inter as woff2 and delete Layout.astro:136-138; lazy-load or proxy follow-pack avatars; rewrite privacy.astro:34-42 to enumerate what is actually contacted.

### 81. [high] Guides index is a client-only React island — guide pages and all 8 audience landing pages are orphans with zero internal inbound links

**Area:** seo-technical · **File:** `src/pages/[...lang]/guides/index.astro` · **Effort:** M

**Evidence:** index.astro:93-97 still renders the entire listing as `<GuidesContainer client:load skillLevels={skillLevelsData} locale={currentLocale} />`; the server-side data at lines 32-55 (including `href: guidePath(slug, currentLocale)`) is passed as props and never emitted as markup. Fresh build: `grep -o 'href="/guides/[^"]*"' dist/guides/index.html` yields only `/guides/` and `/guides/faq` — both from the header/footer, not one guide card. I rebuilt the dist link graph: 154 pages, 58 with zero internal inbound links, of which 45 are guide URLs (all of /pl/guides, /es/guides, /zh/guides, /ar/guides plus every locale's multi-client, nip17-private-messages, nostr-tools, outbox-model, privacy-security, protocol-comparison, and English /guides/outbox-model and /guides/protocol-comparison) and 8 are the /nostr-for-* landing pages. Header.astro:52 and Footer.astro:92 still wrap the Communities blocks in `TEMPORARILY HIDDEN` comments.

**Impact:** The hub that should distribute authority to 16 guides per locale distributes none, and 8 acquisition landing pages have no path into them from anywhere on the site. No-JS visitors and first-pass crawlers see an empty guides index.

**Suggested fix:** Server-render the guide cards as plain `<a href>` in [...lang]/guides/index.astro (skillLevelsData already carries title + href) and let GuidesContainer hydrate over them for filtering/progress. Separately un-hide the Communities blocks in Header.astro:52 and Footer.astro:92, or add the 8 landing pages to a footer link list.

### 82. [high] Zero JSON-LD structured data on all pages

**Area:** seo-technical · **File:** `src/components/SEO.astro` · **Effort:** M

**Evidence:** `grep -rn 'ld+json\|schema.org' src/` returns nothing. SEO.astro (129 lines, read in full) emits title/description/robots/canonical/hreflang/OG/Twitter/favicon/theme/sitemap and no structured-data block. Fresh build: 0 of 154 HTML files contain `application/ld+json`.

**Impact:** No rich-result eligibility anywhere: 112 guide pages have no Article/TechArticle, no BreadcrumbList; /guides/faq/ forfeits FAQPage; /guides/quickstart/ forfeits HowTo; /glossary/ forfeits DefinedTermSet; the homepage declares no Organization or WebSite entity, so Google has no brand node, logo or sameAs for nostrich.love.

**Suggested fix:** Add an optional `schema` prop to SEO.astro rendering `<script type="application/ld+json">`, and ship four generators: Organization + WebSite on index.astro, BreadcrumbList + Article on [...lang]/guides/[slug].astro (data already in frontmatter), FAQPage on the faq guide, HowTo on quickstart.

### 83. [high] og:type is 'website' on all pages and no guide carries a publish/modified date — the article branch in SEO.astro is dead code

**Area:** seo-technical · **File:** `src/pages/[...lang]/guides/[slug].astro` · **Effort:** M

**Evidence:** [slug].astro:205 is still `<Layout title={title} description={description} locale={locale as Locale}>` — no type/publishedTime/modifiedTime/author/tags. `grep -rn 'type="article"' src/pages src/layouts` returns nothing, so SEO.astro's default `type = 'website'` (line 15) applies everywhere and the article block at SEO.astro:87-98 never fires. Fresh build: og:type="website" on 152/152 pages, 0 pages with any `article:*` property. `grep -rl '^updated:' src/content/guides/` returns 0 of 112 MDX files, even though src/content/config.ts:12 declares `updated: z.string().optional()` and [slug].astro:263-265 renders `Last updated {guide.data.updated}` when present.

**Impact:** 112 long-form tutorials are typed as generic websites — no article-carousel or Top Stories eligibility, no freshness signal, and no date in the SERP snippet on 'how to' queries where recency drives CTR. The byline block renders nothing.

**Suggested fix:** Pass `type="article"` plus publishedTime/modifiedTime from frontmatter at [slug].astro:205, backfill `updated:` into the 112 MDX files (git-log dates are fine), and reuse the value for dateModified once Article JSON-LD lands.

### 84. [high] Damus and Amethyst settings render recommendedRelays (a string[]) as objects — blank relay rows

**Area:** simulators · **File:** `src/simulators/damus/screens/SettingsScreen.tsx` · **Effort:** S

**Evidence:** src/data/mock/relays.ts:686-692 declares `export const recommendedRelays = ['wss://relay.damus.io', 'wss://relay.snort.social', 'wss://nos.lol', 'wss://relay.primal.net', 'wss://relay.nostr.band']` — a plain string[]. damus/screens/SettingsScreen.tsx:187-192 does `recommendedRelays.slice(0,3).map((relay) => <div key={relay.id}>...{relay.name}...{relay.url}...` and amethyst/screens/SettingsScreen.tsx:165-179 adds `relay.isOnline` and `{relay.latency}ms`. Direct typecheck today: `damus/screens/SettingsScreen.tsx(188,35): Property 'id' does not exist on type 'string'` plus (190,69) 'name' and (191,81) 'url'. No throw — property access on a string primitive yields undefined — so it renders silently wrong.

**Impact:** In Damus and Amethyst settings, the 'Recommended relays' list renders 3-4 rows containing nothing but an 'Add' button: no relay name, no URL, and in Amethyst a red offline dot and 'undefinedms' latency. The relay concept is one of the harder ideas the site teaches and this screen is where it is demonstrated.

**Suggested fix:** Either render the strings directly (`recommendedRelays.map((url) => ...)`) or switch the import to the object-shaped relay list in src/data/mock/relays.ts.

### 85. [high] Five of seven login screens generate malformed npub/nsec while the correct generator sits unused

**Area:** simulators · **File:** `src/simulators/damus/screens/LoginScreen.tsx` · **Effort:** S

**Evidence:** Verified verbatim in all seven files today. damus:23-24, amethyst:23-24, yakihonne:25-26, snort:24-25, primal/web:24-25 all contain `'npub1' + Array(64).fill(0).map(() => '0123456789abcdef'[...]).join('')` — 69 characters using a hex alphabet that includes '1' and 'b', both excluded from bech32. coracle:21-22 uses Array(59) (right length, wrong charset); keychat:16 uses Array(58) over 'a-z0-9'. Meanwhile src/simulators/shared/utils/mockKeys.ts implements generateMockNpub/generateMockNsec against a proper BECH32_CHARS set, and a repo-wide grep for generateMockNpub/generateMockKeyPair outside shared/ returns zero hits.

**Impact:** The simulators exist to teach beginners what a real Nostr key looks like, and they display keys of the wrong length containing characters that can never appear in a real npub. A learner who copies the shape into their mental model learns it wrong, on 7 of 10 clients.

**Suggested fix:** Import generateMockNpub/generateMockNsec from shared/utils/mockKeys.ts in all seven login screens and delete the inline generators.

### 86. [high] The entire simulator layer is English-only on a seven-locale site

**Area:** simulators · **File:** `src/simulators` · **Effort:** L

**Evidence:** `grep -rl useTranslation src/simulators` returns 0 files today. The 10 simulator routes live at src/pages/simulators/*.astro with no [lang] variant (confirmed: src/pages/ has [...lang]/guides/ but simulators/ is flat), so there is no /pl/simulators/damus, /ar/simulators/damus, etc.

**Impact:** Non-English readers following a translated guide hit an entirely English simulator, and there is no localised URL for it at all. The site advertises 7 locales via hreflang on 119 guide pages, then dead-ends its most interactive feature in English.

**Suggested fix:** Large. Extract simulator strings into the i18n JSON and move src/pages/simulators/ under the [...lang] rest route. Interim mitigation: add a visible 'this demo is English-only' note on non-English guide pages that link to simulators.

### 87. [high] /damus-demo is an indexed, header-less duplicate of /simulators/damus

**Area:** simulators · **File:** `src/pages/damus-demo.astro` · **Effort:** S

**Evidence:** Read the whole file today: it imports the same `DamusSimulator` the real route uses and renders `<DamusSimulator client:load />`, with no <Header />, no SimulatorSidebar, no tour, and hardcoded `bg-gray-100`/`text-gray-900`/`bg-white` with no dark: variants. Its title is 'Damus Simulator - Interactive Nostr Client Demo' vs /simulators/damus's 'Try Damus - Nostr Client Simulator'. Confirmed live in today's build: dist/damus-demo/index.html exists and 'damus-demo' appears in dist/sitemap-0.xml.

**Impact:** Two indexed URLs compete for the same 'damus simulator' query, splitting link equity. Anyone who lands on /damus-demo from search gets a page with no site navigation (no way to reach any other content) that is unreadable in dark mode.

**Suggested fix:** Delete src/pages/damus-demo.astro and add a permanent redirect to /simulators/damus in vercel.json.

### 88. [high] Damus dark mode paints near-black text on a pure-black background

**Area:** simulators · **File:** `src/simulators/damus/components/NoteCard.tsx` · **Effort:** S

**Evidence:** Traced through to the built CSS today. NoteCard.tsx:96 `className="font-semibold text-gray-900 hover:underline truncate"` (author name) and :111 `className="text-gray-900 mb-3 whitespace-pre-wrap"` (note body), both with no dark: variant. The card root at :65 is `<article className="damus-card-flat py-4 px-4">`. In dist/_astro/damus.BmPjLFur.css: `.damus-card-flat{background:var(--damus-bg)...}` and `.damus-simulator.dark{--damus-bg: #000000;...}`. DamusSimulator.tsx:240 applies that class when parentTheme === 'dark'. dist/_astro/_slug_.B1SINYHZ.css defines `.text-gray-900{color:rgb(17 24 39...)}`. I grepped the damus stylesheet for any `.dark ...` selector overriding text colour — there is none. #111827 on #000000 is roughly 1.15:1 contrast. 57 occurrences of text-gray-900 without a dark: variant across src/simulators.

**Impact:** Every dark-mode visitor to the Damus simulator sees an effectively blank feed: author names and note bodies are invisible. This is the default/first simulator and the one linked most often from guides.

**Suggested fix:** Replace the hardcoded Tailwind greys in NoteCard.tsx and ProfileHeader.tsx with the theme variable `text-[var(--damus-text)]`, which is already defined correctly for both modes.

### 89. [high] ErrorBoundary component exists but is imported by zero files

**Area:** testing-ci-ops · **File:** `src/components/ErrorBoundary.tsx` · **Effort:** M

**Evidence:** Grepped for ErrorBoundary across src/ today: the only hits are inside src/components/ErrorBoundary.tsx itself (a complete class component with getDerivedStateFromError, componentDidCatch, a retry button) and a never-acted-on suggestion in src/simulators/amethyst/analysis/ui_issues.md:150. No file imports it. Meanwhile src/ has 438 client:load directives hydrating 250 .tsx components, including 27 in src/components/interactive/ that parse untrusted relay data.

**Impact:** A single uncaught render throw — a malformed relay event, a missing translation object, a nostr-tools decode error — blanks that island with no message and no recovery, and with no error reporting the failure is invisible to the operator.

**Suggested fix:** Wrap the interactive islands at their mount points with a small ErrorBoundaryWrapper used from the hosting .astro pages, plus StreakBannerWrapper at Layout.astro:156; add reporting inside componentDidCatch.

### 90. [high] `npm run verify-seo` always exits 0 and prints 'Ready for Google indexing!' even when checks fail

**Area:** testing-ci-ops · **File:** `scripts/verify-seo.js` · **Effort:** S

**Evidence:** Ran it today against the freshly rebuilt dist/. Output included '✗ en: Could not read dist/en/guides/what-is-nostr/index.html' and '✗ en/guides/: Could not read file', then printed '✅ SEO Verification Complete!', '• All 7 locales (en, pl, es, de, zh, ar, hi) are properly configured' and '🚀 Ready for Google indexing!'. `echo $?` = 0. Only the two sitemap checks call process.exit(1); every per-locale check just console.logs a ✗ and continues.

**Impact:** The only automated verification in the repo is a green-washer, and docs/DEPLOYMENT_CHECKLIST.md:288 gates release on it 'showing all green' — a condition it structurally cannot fail. Six locales could regress on hreflang and it would still report success.

**Suggested fix:** Track a failure counter across all checks and `process.exit(failures > 0 ? 1 : 0)`; drop 'en' from testUrls/indexLocales and test the un-prefixed /guides/what-is-nostr; replace the hardcoded summary with real counts.

### 91. [high] `npm run fetch-accounts` is silently broken — it filters on a kind-0 field that does not exist

**Area:** testing-ci-ops · **File:** `scripts/fetch-nostr-accounts.js` · **Effort:** M

**Evidence:** Read the script today. Line 80 is `const followerCount = metadata.followers || metadata.followerCount || 0;` on a parsed kind-0 content object — NIP-01 kind-0 carries name/about/picture/nip05/lud16, never a follower count. Line 82 gates on `if (followerCount >= MIN_FOLLOWERS)` with MIN_FOLLOWERS = 100 (line 18). The proof is committed: scripts/accounts-output.ts, written by line ~198, is 316 bytes and reads `export const curatedAccounts: CuratedAccount[] = [\n];` under the generated header 'Note: Accounts filtered for 100+ followers'. The catch at :203 only console.errors, so the script exits 0.

**Impact:** One of only two custom npm scripts does nothing useful while reporting success; anyone running it to refresh follow-pack data gets an empty file and, if they copy it over src/data, wipes the curated account list.

**Suggested fix:** Delete the script or drop the follower gate (or source counts from an indexer), batch kind-0 lookups into one querySync with an authors array, add a timeout, and exit non-zero on zero accounts.

### 92. [high] No error reporting, no uptime monitoring, no alerting anywhere in the stack

**Area:** testing-ci-ops · **File:** `src/layouts/Layout.astro` · **Effort:** M

**Evidence:** Grepped src/ and package.json today for sentry|posthog|datadog|logrocket|bugsnag|rollbar|window.onerror|unhandledrejection — zero real hits (the only matches are CSS ::-webkit-scrollbar selectors). Layout.astro:140-144 is the sole telemetry: a Cloudflare Web Analytics beacon (token in src/config/site.ts), pageviews only, no alerting. Line 145 is a commented-out Plausible tag. vercel.json declares no monitoring integration and there is no health-check route.

**Impact:** This codebase's actual failure modes — a blank island from an uncaught throw, a permanently spinning relay browser, a build that succeeded but produced a broken page — are all client-side and produce no server signal. Nobody is notified.

**Suggested fix:** Add a client error reporter wired into window.onerror/unhandledrejection in Layout.astro and into ErrorBoundary.componentDidCatch; add a free external uptime check on / and one guide URL with email alerting.

### 93. [high] docs/DEPLOYMENT_CHECKLIST.md is materially wrong about locale count, page count, URLs and domain

**Area:** testing-ci-ops · **File:** `docs/DEPLOYMENT_CHECKLIST.md` · **Effort:** S

**Evidence:** Read the file today. Lines 18-20 still claim '✅ 102 pages built successfully / ✅ 281 hreflang link elements / ✅ All 4 locales properly configured'; measured on the fresh build: 154 HTML files, 151 <loc> and 952 xhtml:link in dist/sitemap-0.xml, 7 locales. '4 locales' recurs at :216. Line 106 still tells the operator to request indexing for https://nostrich.love/en/guides/what-is-nostr/ — a URL vercel.json now 301-redirects. Line 142 still says `site:nostrich.de Nostr Anfänger`, the wrong domain. Line 288 gates release on verify-seo being green. zh, ar and hi appear nowhere.

**Impact:** The only deployment document walks an operator through indexing redirected URLs, checking a domain the project does not own, and signing off on a script that cannot fail; three of seven locales get no deployment guidance at all.

**Suggested fix:** Regenerate the numbers from a real build (154 pages / 952 hreflang / 7 locales), delete the /en/ indexing step, fix nostrich.de → nostrich.love on line 142, and add ar/zh/hi verification steps.

### 94. [high] The documented deploy command pushes to a home-lab host that is 51 commits behind

**Area:** testing-ci-ops · **File:** `docs/DEPLOYMENT_CHECKLIST.md` · **Effort:** S

**Evidence:** Verified today. docs/DEPLOYMENT_CHECKLIST.md:59 is still `git push origin main`. `git remote -v` shows origin = ssh://git@umbrel.local:2222/milli_vanilli/nostr-beginner-guide.git and github = git@github.com:piotr-e8/nostrich-love.git. `git rev-parse --abbrev-ref main@{upstream}` returns origin/main. `git rev-list --left-right --count main...origin/main` = `51 0`, while `main...github/main` = `0 0`. .vercel/project.json (prj_Yjw9EICd400EALTBtMqs5FhWrESN) builds from the GitHub side.

**Impact:** Following the documented deploy step pushes to a Gitea on an mDNS hostname that resolves only on the author's LAN and triggers no build; the operator sees no Vercel deployment and no explanation. The nominal 'origin' backup has been stale for 51 commits.

**Suggested fix:** Repoint main's upstream to github/main (or rename the remotes so origin is GitHub) and fix DEPLOYMENT_CHECKLIST.md:59; resync or remove the umbrel.local remote so it stops looking like a live backup.

### 95. [high] vercel.json ships redirects only — no security headers, no cache-control, no trailing-slash policy

**Area:** testing-ci-ops · **File:** `vercel.json` · **Effort:** S

**Evidence:** Duplicate of the security-privacy headers finding, same file. Read in full today: $schema plus three redirect rules only. No `headers`, no `cleanUrls`, no `trailingSlash`; astro.config.mjs sets neither (grep for trailingSlash returns nothing), so /guides and /guides/ both serve 200 with no canonical redirect. No cache-control policy for public/ assets — public/preview_image.png is 1,184,543 bytes and public/android-chrome-512x512.png is 275,238 bytes.

**Impact:** The key generator at /tools is served with no CSP and no framing protection so it can be iframed and clickjacked; default Referrer-Policy leaks full guide URLs to the target=_blank third-party links; duplicate trailing-slash URLs dilute the hreflang work just landed.

**Suggested fix:** Add a headers block with X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy, and CSP frame-ancestors; set trailingSlash to match Astro's directory format.

### 96. [high] 16 npm advisories including 10 high, with no automated dependency updates

**Area:** testing-ci-ops · **File:** `package.json` · **Effort:** M

**Evidence:** Ran `npm audit --json` today: {'info': 0, 'low': 3, 'moderate': 3, 'high': 10, 'critical': 0, 'total': 16} — exactly the audit's counts. The 10 high are astro <=7.0.9, defu <=6.1.4, h3 <=1.15.8, js-yaml 4.0.0-4.2.0, picomatch, postcss <=8.5.17, rollup 4.0.0-4.58.0, sharp <0.35.0, svgo 4.0.0-4.0.1, vite <=6.4.2. astro.config.mjs:66-69 explicitly enables the sharp image service. `ls .github` fails, so no Dependabot or Renovate config exists.

**Impact:** Most are build-time only on a static site, but sharp and postcss run during the build and the astro advisory is a runtime routing issue; with nothing surfacing the gap the project drifts further behind its framework major.

**Suggested fix:** Add .github/dependabot.yml with a weekly grouped npm schedule, run npm audit fix for the non-breaking set, and plan the Astro major upgrade as its own work behind a test suite.

### 97. [high] Simulators index and 12 simulator pages are structural dead ends

**Area:** ux-funnel · **File:** `src/pages/simulators/index.astro` · **Effort:** S

**Evidence:** Checked the fresh build. dist/simulators/index.html has NO <header>, NO <footer> and no id="main-content" — simulators/index.astro imports neither Header nor Footer. The 10 sidebar simulator pages and dist/damus-demo/index.html all have <header> but NO <footer>. Two audit specifics are wrong: nostr-kitten does render both header and footer, and damus-demo does have a header.

**Impact:** /simulators is linked from the footer, /tools and the quickstart guide, yet once there the visitor has no logo, no menu and no footer — the only exit is a single /guides button at the page bottom or the browser back button.

**Suggested fix:** Add <Header /> and <Footer /> to simulators/index.astro; add <Footer /> plus id="main-content" to the 10 sidebar simulator pages and damus-demo.astro.

### 98. [high] Quickstart's primary path button is a dead anchor

**Area:** ux-funnel · **File:** `src/content/guides/en/quickstart.mdx` · **Effort:** S

**Evidence:** quickstart.mdx:28 is still `href="#step-2"` — the only `href="#` in the file. Extracted every id from the freshly built dist/guides/quickstart/index.html: step-1-prerequisites-check, step-2-choose-your-client, step-3-launch-checklist, option-a-…, option-b-…, youre-ready, pro-tips-…, plus main-content and mobile-menu. There is no `step-2`.

**Impact:** The primary forward action of Step 1 on the guide closest to conversion does nothing when clicked; the adjacent 'Generate keys first' button works, biasing everyone onto the longer path.

**Suggested fix:** Change to href="#step-2-choose-your-client" (or add an explicit <div id="step-2" />) and audit the other step anchors in the file.

### 99. [high] Eight audience landing pages and /badges are orphans with zero inbound internal links

**Area:** ux-funnel · **File:** `src/components/layout/Header.astro` · **Effort:** S

**Evidence:** All 8 src/pages/nostr-for-*.astro exist and build. Scanning the fresh dist/ for `href="/nostr-for-` returns 0 files. The nav sources are still commented out: Header.astro:52 'Communities Dropdown - TEMPORARILY HIDDEN', Header.astro:175, Footer.astro:92. /badges looks linked (297 raw matches in dist) but after stripping HTML comments the count is 0 — Header.astro:109-121, Header.astro:216-226 and progress.astro:297-305 are all inside 'TEMPORARILY HIDDEN' comment blocks that Astro ships verbatim.

**Impact:** ~100 KB of segment-targeted acquisition content plus the 23 KB /badges page receive no internal link equity and cannot be reached by a browsing user at all.

**Suggested fix:** Restore the Communities nav (adding bitcoiners and privacy), un-comment the badges links, and cross-link the landing pages from finding-community.mdx.

### 100. [high] /nostr-for-bitcoiners and /nostr-for-privacy render a broken 'No accounts yet' empty state

**Area:** ux-funnel · **File:** `src/pages/nostr-for-bitcoiners.astro` · **Effort:** S

**Evidence:** nostr-for-bitcoiners.astro:44-45 sets categoryId='bitcoin' / followPackUrl='/follow-pack?category=bitcoin'; nostr-for-privacy.astro:44-45 the same with 'privacy'. The 16 ids in src/data/follow-pack/categories.ts are artists, books, christians, cool_people, doomscrolling, foodies, jumpstart, legit, merchants, musicians, mystics, niche, parents, permaculture, photography, sovereign — neither exists. In the fresh build, dist/nostr-for-bitcoiners/index.html and dist/nostr-for-privacy/index.html each contain the string 'No accounts yet' while dist/nostr-for-musicians/index.html contains 0 occurrences.

**Impact:** The two highest-intent landing pages show 'No accounts yet — Be among the first to join this community on Nostr!', reading as an abandoned site, and their hero CTA drops the segment filter silently.

**Suggested fix:** Add 'bitcoin' and 'privacy' categories to categories.ts (or repoint both pages at 'sovereign'), and add a build-time assertion that each landing page's categoryId resolves to a non-empty category.

### 101. [high] The site captures no visitor signal at all — no email, no RSS, no follow CTA outside /about

**Area:** ux-funnel · **File:** `src/pages/about.astro` · **Effort:** M

**Evidence:** Grepped src/ today for newsletter|subscribe|mailchimp|convertkit|type="email": the only code hits are two incidental strings inside follow-pack/ExportModal.tsx:770 and :800; the rest are guide prose. No RSS/feed route exists in src/pages and neither dist/rss.xml nor dist/feed.xml is produced. OfficialAccountWidget is imported and rendered exactly once, at about.astro:5 and :129.

**Impact:** There is no channel to bring a visitor back. All progress, streaks and badges live in localStorage only, so a private window or a device switch wipes everything, and a new guide can never be announced to a past visitor.

**Suggested fix:** Put the OfficialAccountWidget follow CTA at the end of every guide and at follow-pack export success; add an RSS feed for guides; add localStorage export/import.

### 102. [high] The only share widget always shares the homepage URL

**Area:** ux-funnel · **File:** `src/components/layout/Footer.astro` · **Effort:** S

**Evidence:** Footer.astro:71 renders `<SocialShare />` with no props. src/components/ui/SocialShare.astro:10-14 defaults title/description/url to siteConfig values and line 20 builds `https://njump.me/?url=${encodedUrl}`. Confirmed in the fresh build: dist/guides/keys-and-security/index.html contains `data-url="https://nostrich.love"` — the homepage, not the guide.

**Impact:** Any share from a guide page sends people to the homepage instead of the guide that impressed them, and the badge celebration's Share button only writes to the clipboard with no destination.

**Suggested fix:** Pass title/url from Astro.url into SocialShare in the Footer; replace the njump ?url= link with a real intent or Web Share API; add share prompts at guide completion and follow-pack export success.

### 103. [high] A single guide page ships ~295 KB gzip of JavaScript across 14 hydrated islands

**Area:** ux-funnel · **File:** `src/i18n/index.ts` · **Effort:** L

**Evidence:** Rebuilt and walked the transitive module graph of the emitted HTML. dist/guides/what-is-nostr/index.html: 54 modules, 932 KB raw, 295 KB gzip, 14 astro-islands, 12 client="load", 0 client="visible" — matching the audit's ~296 KB. relays-demystified: 82 modules / 994 KB raw / 315 KB gzip / 17 islands. dist/tools: 62 modules / 1373 KB raw / 446 KB gzip. src/i18n/index.ts:7-15 still statically imports all seven locale JSONs into one record; useTranslation.ts:19-25 still creates a 100 ms setInterval with deps [locale].

**Impact:** 295 KB gzip of JS to read a five-minute article, most of it locale data the visitor will never see, on the site's highest-traffic content type.

**Suggested fix:** Pass the page's already-known locale subtree into islands as props instead of importing the i18n barrel client-side; replace the setInterval with a popstate listener; downgrade below-the-fold islands to client:idle/visible.

### 104. [high] On 13 of 16 guides a 320px fixed panel covers the mobile screen after 80% scroll

**Area:** ux-funnel · **File:** `src/components/navigation/ContinueLearning.tsx` · **Effort:** S

**Evidence:** ContinueLearning.tsx:306-308 still selects `'fixed right-6 top-1/2 -translate-y-1/2 z-40 w-80'` when hasQuiz, with no responsive breakpoint. hasQuiz comes from src/pages/[...lang]/guides/[slug].astro:120 `guide.body?.includes('Quiz')`, which is true for exactly 13 of the 16 English MDX files. Measured live in Chrome at 375x812: that class set produces left=31, right=351, width=320 — 85% of the viewport, vertically centred over the article. The dismiss X is at :363-368, unlabeled, at the card bottom.

**Impact:** Exactly when a mobile reader reaches the quiz/summary payoff, a card covering 85% of the screen slams over the content — a bounce trigger on the majority of guide pages for the majority of traffic.

**Suggested fix:** Apply the side-panel variant only at md and above; use the bottom-sheet variant on mobile; set w-72 max-w-[calc(100vw-3rem)] and move the dismiss X to the card's top-right.

### 105. [medium] Simulator theme stylesheets remove focus outlines

**Area:** accessibility · **File:** `src/simulators/damus/damus.theme.css` · **Effort:** S

**Evidence:** The headline claim is FALSE. I loaded the built /simulators/damus/ page and keyboard-focused a real `button.damus-btn`: computed style is `outline: rgb(139,92,246) solid 2px; outline-offset: 2px`. Reason: Layout.astro:65-70 has `button:focus-visible, a:focus-visible { outline: 2px solid #8B5CF6 }` — specificity (0,1,1) — which beats `.damus-btn { outline: none }` (0,1,0) regardless of source order. Same for .md-button and .yakihonne-btn (buttons). What IS genuinely broken are the input/textarea rules with no :focus replacement: on the built pages, `.primal-search input` (primal-web.theme.css:365), `.primal-compose-input` (:499), `.primal-search-mobile input` (primal-mobile.theme.css:403) and `.gossip-compose-textarea` (gossip.theme.css:508) all compute `outline-style: none`, `box-shadow: none`, `border-style: none` while `:focus-visible` matches. Note damus/amethyst/yakihonne inputs are fine — they define their own :focus box-shadow (damus.theme.css:100-104).

**Impact:** 4 search/compose fields inside the Primal and Gossip simulators have no visible focus indicator at all; the buttons the finding named are unaffected. WCAG 2.4.7 (AA).

**Suggested fix:** Delete `outline: none` from those four base rules, or scope a `:focus-visible` ring to them (coracle.theme.css:80-83 does it correctly).

### 106. [medium] ~4,600 LOC of dead code across simulators and components

**Area:** architecture · **File:** `src/simulators/shared/hooks/useSimulator.ts` · **Effort:** M

**Evidence:** Spot-verified the reachability claims today. Zero importers found for src/components/Logos.tsx and src/components/NostrichAnimation.tsx (repo-wide grep excluding the files themselves). shared/hooks/useSimulator.ts, SimulatorShell.tsx, MockKeyDisplay.tsx and mockKeys.ts all have zero importers outside shared/. src/components/interactive/damus/ is reachable only from the dead QuickstartSimulator. None of it appears in dist/_astro after a clean build. Downgraded to medium for the same reason as the two simulator dead-code findings — no user-facing impact.

**Impact:** None directly; navigational cost for contributors and a source of misleading search hits.

**Suggested fix:** One deletion pass covering the files listed here and in the two simulator findings, guarded by a clean rebuild that still emits 152 pages.

### 107. [medium] 13 quiz components of ~510 lines each are ~95% identical copy-paste

**Area:** architecture · **File:** `src/components/interactive/SecurityQuiz.tsx` · **Effort:** L

**Evidence:** Confirmed the scale today: src/components/interactive/ holds exactly 13 *Quiz.tsx files (FindingCommunity, MultiClient, NIP05Identity, NIP17PrivateMessages, OutboxModel, PrivacySecurity, ProtocolComparison, RelayGuide, RelaysDemystified, Security, Troubleshooting, WhatIsNostr, ZapsAndLightning) totalling 6,669 lines, each 507-545 lines and 18.6-21.2 KB. Drift is already visible: all 13 repeat the same `href={'/' + locale + '/guides/...'}` pattern (25 occurrences repo-wide), so any URL-scheme change has to be made 25 times. Downgraded to medium: it is a maintenance multiplier, not a defect users hit.

**Impact:** Indirect: the ar/hi quiz-length bug and the /en/ link pattern both had to be fixed in 13 places, which is why they were not.

**Suggested fix:** Extract one <Quiz> component taking { questionsKey, icon, followUpLinks } and reduce each of the 13 to a ~20-line config.

### 108. [medium] public/test-progress.html — a developer localStorage debug harness — is published to production

**Area:** build-health · **File:** `public/test-progress.html` · **Effort:** S

**Evidence:** Confirmed present: public/test-progress.html (4,091 B) is copied to dist/test-progress.html by today's build. I read it — `<h1>Progress & Badge Test</h1>` with buttons wired to checkStorage/simulateCompletion/clearStorage operating on `STORAGE_KEY = 'nostrich-gamification-v1'`, the real production key. Verified it is absent from dist/sitemap-0.xml (grep count 0). Downgraded to medium: unlinked, unindexed, reachable only by guessing the URL, and it can only affect the visitor's own localStorage.

**Impact:** An unpolished internal debug page is publicly reachable at https://nostrich.love/test-progress.html and can wipe the visitor's own progress data. Low reach, but it is a credibility and hygiene problem if anyone finds it.

**Suggested fix:** Delete public/test-progress.html, or move it under a dev-only path excluded from the build.

### 109. [medium] A single 193 KB stylesheet is served on all 152 pages, including simulator-only rules

**Area:** build-health · **File:** `dist/_astro/_slug_.B1SINYHZ.css` · **Effort:** M

**Evidence:** Measurements confirmed today: the file is 193,330 B and referenced by 152 of the 154 emitted HTML pages. It does carry simulator rules on every page (34 occurrences of `--yh-`, 52 of `primal`, 22 of `damus-`). But I also gzipped it: 24,641 B. Severity corrected downward because the audit's headline uses the uncompressed number — 24.6 KB gzip is an ordinary stylesheet payload, not a page-weight emergency. The render-blocking parse cost of 193 KB uncompressed is real but second-order next to the 157 KB gzip JS chunk on the same pages.

**Impact:** Modest: ~25 KB gzip transfer plus CSSOM construction for ~190 KB of rules on every page, a slice of which only the simulator pages need.

**Suggested fix:** Move the simulator theme imports out of the shared component graph so Vite scopes them to the simulator routes (they already have their own per-client sheets). Lower priority than the JS chunk.

### 110. [medium] 12 of 18 recommended third-party domains no longer resolve, including a primary free NIP-05 provider

**Area:** content-quality · **File:** `src/content/guides/en/nostr-tools.mdx` · **Effort:** M

**Evidence:** I re-probed every domain with dig + curl today. The headline claim is WRONG: nostrcheck.me (nip05-identity.mdx:119 and :471, nostr-tools.mdx:90) returns HTTP 200 and has a live A record, as does nostrplebs.com. Of the 15 external domains in nostr-tools.mdx only two fail — nostrfiles.com (line 72, NXDOMAIN) and stats.otherstuff.org (line 114, no resolution). Genuinely dead across the guide set: NXDOMAIN — nostrfiles.com, nostr2twitter.com (protocol-comparison.mdx:402), wiki.nostr.com (troubleshooting.mdx:410), nostr.guru (faq.mdx:540, nip05-identity.mdx:434), relay.nostrdevs.com and relay.nostrich.art (relays-demystified.mdx:111-112); resolve but serve nothing over HTTPS (curl 000) — relay.current.fyi (faq.mdx:390), nostrname.com (nip05-identity.mdx:193, faq.mdx:138), nostrid.com (nip05-identity.mdx:194), stats.otherstuff.org; GitHub 404 — github.com/nostr-tools/nip05 (nip05-identity.mdx:472) and github.com/nostr-protocol/zaps (zaps-and-lightning.mdx:479). That is 12 dead targets, but spread across six guides, not 12 of 18 in one directory, and the free-NIP-05 onboarding path is intact.

**Impact:** A reader following faq.mdx:390 adds wss://relay.current.fyi and it never connects; explorer and wiki links dead-end. Real but narrower than reported — the NIP-05 free path (nostrcheck.me, nostrplebs.com) works.

**Suggested fix:** Remove the 12 dead entries and replace with live equivalents (njump.me for explorer, nostr.watch for relays, purplepag.es + relay.primal.net + relay.nostr.band for a starter set). Add a CI link-checker over src/content/guides/**/*.mdx so this cannot rot silently.

### 111. [medium] A single corrupt localStorage value silently disables all future writes, permanently

**Area:** gamification-state · **File:** `src/utils/gamification.ts` · **Effort:** S

**Evidence:** Confirmed today at lines 461-495. saveGamificationData opens with `const stored = localStorage.getItem(STORAGE_KEY); if (stored) { existing = JSON.parse(stored); }` inside the same try block that wraps `localStorage.setItem(STORAGE_KEY, ...)` at line 491; the catch at line 493 only console.warns. A parse failure therefore skips the setItem entirely. loadGamificationData (lines 396-455) has the identical structure — catch at :450 warns and returns getDefaultData() at :454 without clearing the bad value. Downgraded to medium: it requires the stored JSON to already be corrupt (interrupted write, quota truncation, third-party clobber), which is uncommon.

**Impact:** If it does happen, the user's progress is frozen forever with no visible error — every read returns defaults and every write is silently dropped, and nothing ever repairs the key.

**Suggested fix:** Move the read+parse above the try, wrap only the parse in its own try/catch, and on parse failure `localStorage.removeItem(STORAGE_KEY)` so the next write succeeds against a clean default.

### 112. [medium] Follow-pack export publishes a signed event to three public relays with no user confirmation

**Area:** security-privacy · **File:** `src/components/follow-pack/ExportModal.tsx` · **Effort:** S

**Evidence:** The auto-publish is real and unchanged: ExportModal.tsx:54-59 `useEffect(() => { if (isOpen && selectedAccounts.length > 0 && !hasPublishedRef.current) { hasPublishedRef.current = true; publishToNostr(); } }, [isOpen, selectedAccounts.length])`, RELAYS at :23-27, packName default 'My Nostr Starter Pack' at :37 used as the event title at :134, and the packName <input> is at :529 — i.e. after publication. BUT the severity is inflated: the trigger is a button labelled "Generate Follow Pack" (PackSidebar.tsx:126-132), not a passive "show options"; the key is a fresh burner, not the user's identity; and publication is the mechanism — the QR and copy tabs both encode `naddr` (:258-264, :399-411) which only exists once the event is on relays.

**Impact:** A user who clicks Generate gets an irreversible public broadcast with no preview and a default pack title they can only edit afterwards — a consent-copy gap, not a surprise data leak.

**Suggested fix:** Show the event JSON + relay list and let the user set packName before publishing; gate publishToNostr() behind an explicit button.

### 113. [medium] shared/hooks/useSimulator.ts contains JSX in a .ts file — both simulator barrels are unbuildable

**Area:** simulators · **File:** `src/simulators/shared/hooks/useSimulator.ts` · **Effort:** S

**Evidence:** The defect is real: lines 433-437 return `<SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>` from a .ts file. I ran esbuild on it today: `error: Expected ">" but found "value" — useSimulator.ts:434:31`. tsc agrees (TS1005 x2, TS1161, TS1128). BUT it cannot break anything today: I traced the importers and the chain is dead. shared/index.ts:25 re-exports it; the only importer of shared/index.ts is src/simulators/index.ts:31 (`export * from './shared'`); and a repo-wide grep shows nothing imports src/simulators/index.ts — the 10 simulator pages import concrete components directly (e.g. simulators/gossip.astro:9 imports from '../../simulators/shared/configs'). My clean rebuild today succeeded: 152 pages, exit 0.

**Impact:** Zero user impact today. It is a landmine: the first developer who imports the shared barrel gets an opaque esbuild parse error, and it is the sole reason `tsc` reports src/ errors at all.

**Suggested fix:** Rename to useSimulator.tsx (S). Or delete it — it is 633 LOC of unused framework.

### 114. [medium] The sidebar's Start Tour button is dead on /simulators/coracle and /simulators/gossip

**Area:** simulators · **File:** `src/components/navigation/SimulatorSidebar.tsx` · **Effort:** S

**Evidence:** Confirmed today. tourIdMap at lines 36-46 maps CORACLE -> 'coracle-tour' and GOSSIP -> 'gossip-tour'. The button at lines 253-268 is rendered unconditionally in the sidebar footer and fires `window.dispatchEvent(new CustomEvent('start-' + tourId))`. `ls src/data/tours/` returns only amethyst, damus, keychat, olas, primal, snort, yakihonne (+ index.ts) — no coracle-tour.ts, no gossip-tour.ts. `grep -rn TourWrapper src/simulators/coracle src/simulators/gossip src/pages/simulators/coracle.astro src/pages/simulators/gossip.astro` returns nothing, so no listener is ever registered. Downgraded to medium: it affects 2 of 10 simulator pages and fails silently rather than breaking the page.

**Impact:** On the Coracle and Gossip simulator pages a prominent purple 'Start Tour' button does nothing when clicked — no tour, no error, no feedback.

**Suggested fix:** Hide the button when tourIdMap has no matching tour file (guard on the tours index), or author coracle-tour.ts and gossip-tour.ts and mount TourWrapper in both simulators.

### 115. [medium] Snort's dark-mode toggle is wired to a state field that does not exist

**Area:** simulators · **File:** `src/simulators/snort/SnortSimulator.tsx` · **Effort:** S

**Evidence:** Confirmed the code, corrected the consequence. SnortSimulatorState (lines 23-31) declares currentUser, currentScreen, selectedProfile, selectedThread, selectedNote, isAuthenticated, isComposeOpen — no theme. Line 244 does `theme: prev.theme === 'dark' ? 'light' : 'dark'` and line 304 passes `theme={state.theme}` to SettingsScreen. Direct typecheck reproduces both: `SnortSimulator.tsx(244,19)` and `(304,26): Property 'theme' does not exist on type 'SnortSimulatorState'`. But at runtime JS simply adds the field, so nothing throws — and line 332 shows the simulator's actual appearance comes from `parentTheme`, not state.theme: `<div className={'snort-simulator ' + parentTheme} data-theme={parentTheme}>`. SettingsScreen.tsx:100 only uses theme for the toggle knob position.

**Impact:** Snort's settings dark-mode toggle is purely decorative: it starts in the 'off' position regardless of the site's actual theme (state.theme is undefined on first render) and clicking it moves the knob without changing a single pixel of the simulator.

**Suggested fix:** Either delete the toggle and the toggleTheme callback, or add `theme` to SnortSimulatorState, seed it from useParentTheme(), and use state.theme instead of parentTheme at line 332.

### 116. [medium] The shared simulator framework is ~45% dead code and shares little across ten clients

**Area:** simulators · **File:** `src/simulators/shared/index.ts` · **Effort:** M

**Evidence:** Re-measured today. Grepping all of src/ excluding src/simulators/shared/ returns zero importers for: SimulatorShell, MockKeyDisplay, SimulatorProvider, useSimulator, PREDEFINED_MOCK_KEYS, truncateNpub, filterBySearch, sortByEngagement. What is genuinely shared: useParentTheme (imported by 10 files) and MobilePhoneFrame. shared/components/NoteCard.tsx has exactly two consumers, both yakihonne (FeedScreen.tsx:4, ProfileScreen.tsx:5). None of the dead modules produce a chunk in dist. Downgraded to medium: it is pure maintenance weight with zero shipped bytes and zero user impact.

**Impact:** None directly. It costs contributor time (a 633-LOC context+reducer framework that looks authoritative but is wired to nothing) and it is where the JSX-in-.ts landmine lives.

**Suggested fix:** Delete shared/hooks/useSimulator.ts, shared/components/SimulatorShell.tsx, shared/components/MockKeyDisplay.tsx, shared/index.ts and src/simulators/index.ts. Keep mockKeys.ts but actually use it in the login screens (see the malformed-npub finding).

### 117. [medium] ~3,900 lines of never-built dead simulator code: primal/mobile and a second Damus implementation

**Area:** simulators · **File:** `src/simulators/primal/mobile/MobileSimulator.tsx` · **Effort:** S

**Evidence:** Verified today. The only references to primal/mobile are src/simulators/primal/index.ts lines 9/11/13, and nothing imports that barrel — src/pages/simulators/primal.astro:10 imports PrimalWebSimulatorWithTour directly. For the second Damus: src/components/interactive/damus/DamusInteractiveSimulator.tsx is referenced only by src/components/interactive/QuickstartSimulator.tsx and its own index.ts, and QuickstartSimulator is referenced only by the one-line re-export shim src/components/QuickstartSimulator.tsx — no .astro or .mdx renders it. Confirmed in today's build: `ls dist/_astro | grep -iE 'quickstart|mobilesim|PrimalMobile'` returns nothing. Downgraded to medium: zero bytes ship.

**Impact:** None directly. It doubles the surface a contributor must read to answer 'where is the Damus simulator?' and invites fixing the wrong copy.

**Suggested fix:** Delete src/simulators/primal/mobile/, src/components/interactive/damus/, src/components/interactive/QuickstartSimulator.tsx and src/components/QuickstartSimulator.tsx. Verify the build still emits 152 pages.

### 118. [medium] 18.4% verbatim duplication inside src/simulators; login screens are ~75% identical

**Area:** simulators · **File:** `src/simulators/snort/screens/LoginScreen.tsx` · **Effort:** L

**Evidence:** I did not recompute the 18.4% window-hash figure, so I am reporting on what I verified directly: the mock-key generator block is byte-identical across damus:23-24, amethyst:23-24, yakihonne:25-26, snort:24-25 and primal/web:24-25, and near-identical in coracle:21-22 and keychat:16. That is consistent with the claim but does not prove the aggregate number. Severity lowered to medium — pure maintenance cost, no shipped defect beyond the npub bug already reported separately.

**Impact:** None directly. It is why the same npub bug exists in 7 places instead of 1.

**Suggested fix:** Extract a shared <SimulatorLoginScreen> taking brand colours/copy as props; start by replacing the duplicated key generator with shared/utils/mockKeys.ts.

### 119. [medium] TypeScript is never typechecked; a file with JSX in a .ts extension sits in a public barrel

**Area:** testing-ci-ops · **File:** `src/simulators/shared/hooks/useSimulator.ts` · **Effort:** S

**Evidence:** Reproduced exactly. tsconfig.json extends astro/tsconfigs/strict but typescript and @astrojs/check are absent from package.json and no script runs tsc. Running the transitively available compiler produced 1,296 errors: 4 in src — useSimulator.ts(434,32) TS1005, (434,37) TS1005, (436,6) TS1161, (437,3) TS1128, caused by `return (<SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>)` at lines 433-437 in a .ts file — and 1,292 in scripts/pitiunited-accounts.ts. It is re-exported by src/simulators/shared/index.ts:25 and src/simulators/index.ts:31. BUT severity is inflated: `npm run build` completed successfully today (154 pages emitted), and grepping for imports of the src/simulators barrel returns zero consumers, so no user is affected and nothing is broken right now — it is a latent landmine, and the broader 'no typecheck' gap is already counted under the zero-tests/zero-CI finding.

**Impact:** None today. The first person who writes `import { useSimulator } from '@/simulators'` gets a confusing esbuild JSX error and a red Vercel deploy on main.

**Suggested fix:** Rename useSimulator.ts to .tsx and update src/simulators/shared/index.ts:25; delete or gitignore scripts/pitiunited-accounts.ts; add typescript + @astrojs/check and a `check: astro check` script.

### 120. [medium] RelayFeedBrowser has no timeout, no onclose handler and an unguarded JSON.parse

**Area:** testing-ci-ops · **File:** `src/components/interactive/RelayFeedBrowser.tsx` · **Effort:** M

**Evidence:** The code defects are all real and unchanged: handleViewFeed opens `new WebSocket(relay.url)` at :79 with isLoading(true); isLoading is cleared only in the EOSE branch (:94) or ws.onerror (:107); there is no setTimeout guard, no ws.onclose, and `const data = JSON.parse(event.data)` at :89 has no try/catch (contrast RelayPlayground.tsx:1107-1123 which wraps the same parse). handleLoadMore (:113) creates a second socket never assigned to wsRef, so stopViewing (:161) cannot close it, and there is no useEffect cleanup. BUT the stated impact is wrong: the stopViewing X button is rendered at line 195, inside the always-visible viewing header, ABOVE the `isLoading ?` conditional at :213 — so a user facing an endless spinner can cancel with one click, not a page reload. An exception in onmessage also aborts only that one frame handler, not all subsequent messages.

**Impact:** An unresponsive relay shows a spinner with no error and no timeout until the user clicks the (unlabeled) X; the load-more socket and the unmount case leak connections.

**Suggested fix:** Mirror RelayPlayground.tsx:220-276 — a resolved flag, a 5-10s timeout that closes and errors, an onclose handler clearing isLoading, try/catch around JSON.parse, store the load-more socket in wsRef, and a useEffect cleanup.

### 121. [medium] Guides are padlocked on a first visit and the explainer modal is unreachable

**Area:** ux-funnel · **File:** `src/components/gamification/GamificationExplainerWrapper.tsx` · **Effort:** M

**Evidence:** Two of the three claims hold, one does not. Confirmed: GamificationExplainerWrapper.tsx:19 defaults buttonId='how-does-this-work-btn' and attaches to `document.getElementById(buttonId)` (:27-37); grepping src/ and the fresh dist/ finds that id ONLY inside the JS chunk — no such element exists, so the modal is reachable only via a manually typed #how-it-works hash. GuideSection.tsx:89 defaults isLocked to true. WRONG in the finding: the count is 9 of 16, not 13 — src/data/learning-paths.ts has beginner 7 (threshold 0), intermediate 6 (threshold 5), advanced 3 (threshold 3). Also wrong: locked sections are NOT unexplained — GuideSection.tsx:196-210 renders the unlock requirement text plus a working `<UnlockButton>` whose modal (UnlockButton.tsx:120-166) offers an explicit "Unlock Now" early-unlock with "Unlocking early won't affect your progress tracking".

**Impact:** Real friction — locked cards hide guide titles/descriptions and the explainer is dead code — but the gate is stated and one click away, so this is not the critical bounce cause described.

**Suggested fix:** Render a 'How does this work?' button with that id on the guides hero (or delete the wrapper), and show guide titles/descriptions on locked cards.

### 122. [low] src/lib and src/utils have no distinguishing rule; cn() defined twice and @utils resolves differently in tsconfig vs Vite

**Area:** architecture · **File:** `astro.config.mjs` · **Effort:** S

**Evidence:** Both halves confirmed today. tsconfig.json paths map `"@utils/*": ["src/utils/*"]`; astro.config.mjs maps `"@utils": resolve(srcDir, "lib")`. `export function cn` appears at src/utils/cn.ts:4 and src/lib/utils.ts:4. src/lib holds guideLoader.ts, progress.ts, progressService.ts, useProgressTracking.ts, utils.ts; src/utils holds cn.ts, formatting.ts, gamification.ts, gamificationEngine.ts, index.ts, nostrDirectory.ts — no principle separates them. Downgraded to low: nothing imports `@utils` today, so the alias divergence is latent and has zero runtime effect.

**Impact:** None today. The first import of `@utils/...` would typecheck against src/utils while Vite resolves src/lib, producing a confusing module-not-found or a silently different implementation.

**Suggested fix:** Make the two aliases agree (or delete `@utils` from both configs), and delete src/utils/cn.ts in favour of src/lib/utils.ts, updating the 4 importers in src/simulators/shared/components/.

### 123. [low] Rendering bugs shipped to production: an unclosed markdown link and 12 undefined MDX components

**Area:** content-quality · **File:** `src/content/guides/en/faq.mdx` · **Effort:** S

**Evidence:** Half of this is not real. The "undefined MDX components" claim is wrong: src/pages/[...lang]/guides/[slug].astro:166-202 builds a `components` map that explicitly includes Callout, Note and TroubleshootingWizard (along with 30 others) and passes it at line 282 as `<Content components={components} />`, so MDX resolves those identifiers without per-file imports. Nothing throws and no callout content is dropped. What IS real: faq.mdx:142 `[Learn more: Get a NIP-05 →](/guides/nip05-identity` still has no closing paren and renders as literal bracket text. Placeholders confirmed still shipped: nip17-private-messages.mdx:161 `nostr:note1... # Migration message template`, :298-299 two `nostr:npub1... # ...` lines, faq.mdx:12 `{/* Search functionality coming soon */}`, protocol-comparison.mdx:531 `https://primal.net/p/npub1beginner` (not a valid npub).

**Impact:** One dead link on the site's largest page plus four visible placeholder artifacts. Cosmetic rather than structural — the nine FAQ callouts and the troubleshooting wizard render fine.

**Suggested fix:** Close the paren at faq.mdx:142, fill or delete the four placeholders. Do NOT add per-file imports for Callout/Note/TroubleshootingWizard — the shared components map already provides them, and duplicate imports would just add noise.

### 124. [low] 25 quiz next-step links and every guide link on /progress build /en/… URLs

**Area:** gamification-state · **File:** `src/components/interactive/PrivacySecurityQuiz.tsx` · **Effort:** S

**Evidence:** The code pattern is still present — PrivacySecurityQuiz.tsx:270 `href={'/' + locale + '/guides/privacy-security'}` and :276 `href={'/' + locale + '/guides/keys-and-security'}`, 25 such hrefs across the 13 quiz files, plus src/pages/progress.astro:546 `<a href="/${currentLocale}/guides/${guideId}"` fed from localStorage 'preferredLanguage' defaulting to 'en'. But the '404' consequence is now stale: e94df88 added `{ source: "/en/guides/:slug", destination: "/guides/:slug", permanent: true }` to vercel.json (I read the file today), so `/en/guides/privacy-security` 301s to the real page on production. Severity corrected from high to low.

**Impact:** English users following a quiz's 'Review the privacy guide' link take an extra 301 hop instead of landing directly. Nothing 404s on Vercel. Note the redirect is Vercel-only — `astro preview` locally still 404s these, which is a developer-experience trap.

**Suggested fix:** Replace the string concatenation with the centralised helper added in e94df88 (localePath / langParam from src/i18n/paths.ts) in all 13 quizzes and progress.astro:546, so the emitted href is /guides/<slug> for English.

### 125. [low] public/test-progress.html ships a live debug page that can wipe learning progress

**Area:** repo-hygiene · **File:** `public/test-progress.html` · **Effort:** S

**Evidence:** The file exists (4,091 bytes) and the fresh build copies it to dist/test-progress.html. It defines `const STORAGE_KEY = 'nostrich-gamification-v1'` (line 20) — the same key as src/utils/gamification.ts:142 and Layout.astro:165 — and exposes `checkStorage()`, `simulateCompletion()` and `clearStorage()` buttons (lines 15-17). But the reachability claim is overstated: `grep -c test-progress dist/sitemap-0.xml` returns 0 and no page in dist/ links to it, so a visitor must guess the URL; robots.txt permits crawling but crawlers need a link or sitemap entry to discover it.

**Impact:** Negligible in practice — an unlinked, unsitemapped debug artifact shipped to production. It is a hygiene defect, not a live data-loss risk.

**Suggested fix:** Delete public/test-progress.html, or move it under src/pages/ behind an import.meta.env.DEV guard.

### 126. [low] Page-level hreflang and sitemap hreflang give Google contradictory answers for the same URLs

**Area:** seo-technical · **File:** `astro.config.mjs` · **Effort:** S

**Evidence:** I parsed the freshly built dist/sitemap-0.xml: 151 <url> entries, 119 carry alternates, ZERO entries have a duplicated hreflang code (the claimed 8 double-`en-US` entries are gone), all 119 now carry x-default (added by the serialize() hook at astro.config.mjs:46-54), and the string `nostrich.love/en/` appears 0 times. The paths now match the page-level tags exactly — sitemap says en-US → https://nostrich.love/guides/faq/, and dist/ar/guides/faq/index.html says hreflang="en" → https://nostrich.love/guides/faq/. The only surviving inconsistency is code granularity: astro.config.mjs:33-41 maps locales to region-qualified codes (en-US, ar-SA, zh-CN) while SEO.astro:47 uses getLocaleConfig(l).htmlLang, i.e. bare codes (en, ar, zh) from src/config/locales.ts.

**Impact:** Minor. Google accepts both bare and region-qualified codes and merges signals across sources; mixed granularity for the same cluster is untidy and can produce a Search Console notice, but it no longer produces conflicting or unresolvable targets.

**Suggested fix:** Align the two: either set localeConfig.htmlLang to the region-qualified forms, or change the sitemap i18n map to bare codes. One-line change in either src/config/locales.ts or astro.config.mjs:33-41.

### 127. [low] A debug page with a 'Clear Storage' button is published to production

**Area:** testing-ci-ops · **File:** `public/test-progress.html` · **Effort:** S

**Evidence:** Duplicate of the repo-hygiene finding on the same file. Confirmed present: public/test-progress.html (4,091 bytes) and dist/test-progress.html in the fresh build, with STORAGE_KEY 'nostrich-gamification-v1' at line 20 matching src/utils/gamification.ts:142, and clearStorage()/simulateCompletion() buttons at lines 16-17. No noindex. But `grep -c test-progress dist/sitemap-0.xml` = 0 and nothing in dist/ links to it, so it is not discoverable by a crawler or a browsing user — only by typing the URL.

**Impact:** Negligible: an unlinked, unsitemapped debug artifact. Worth deleting on hygiene grounds, not a live risk to user data.

**Suggested fix:** Delete public/test-progress.html or move it under src/pages/ behind an import.meta.env.DEV guard.
