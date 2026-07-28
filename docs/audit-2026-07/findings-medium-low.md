# Medium and low findings — audit of 2026-07-27

164 findings the audit reported at medium or low severity.

**These were NOT re-verified.** Unlike `open-findings.md`, nobody re-opened the
file to confirm them, and the audit was wrong at least twice on findings that
were checked. Treat each as a lead, not a fact — confirm before acting.

Some may also have been fixed incidentally by the 14 commits in this session.

| # | Sev | Area | Finding | File | Effort |
|---|---|---|---|---|---|
| 1 | medium | accessibility | framer-motion animations ignore prefers-reduced-motion — including 23 infinite loops, one on every page | `src/components/gamification/StreakBanner.tsx` | M |
| 2 | medium | accessibility | Duplicate role="banner" landmark — the streak notification claims the same role as the site header | `src/components/gamification/StreakBanner.tsx` | S |
| 3 | medium | accessibility | Heading order breaks on 34 built pages; quickstart ships two <h1>s with invalid <p>-inside-<h1> nesting in all 7 locales | `src/content/guides/en/quickstart.mdx` | M |
| 4 | medium | accessibility | Arabic, Chinese and Hindi pages wrap English UI chrome without lang markup | `src/components/layout/Header.astro` | M |
| 5 | medium | accessibility | Tour hijacks Enter and arrow keys globally, breaking activation of its own controls | `src/components/tour/TourOverlay.tsx` | M |
| 6 | medium | accessibility | role="switch" toggles on the Settings page have no accessible name | `src/components/progress/PrivacyControls.tsx` | S |
| 7 | medium | accessibility | Tab interfaces have either no ARIA or an incomplete/incorrect ARIA pattern | `src/components/interactive/RelayPlayground.tsx` | M |
| 8 | medium | accessibility | KeyGenerator security checklist uses sr-only checkboxes with no visible focus indicator | `src/components/interactive/KeyGenerator.tsx` | S |
| 9 | medium | accessibility | Sticky header obscures anchor targets and the skip-link destination; <main> is not focusable | `src/layouts/Layout.astro` | S |
| 10 | medium | accessibility | text-gray-400 used as body text on light backgrounds (2.54:1) | `src/components/ReadingTimeHeading.tsx` | S |
| 11 | medium | accessibility | White text on light-grey surfaces in RelayPlayground — invisible in light mode | `src/components/interactive/RelayPlayground.tsx` | S |
| 12 | medium | architecture | No layout composition: 36 pages import Header and Footer by hand and 5 silently omit them | `src/layouts/Layout.astro` | M |
| 13 | medium | architecture | Duplicate component names across directories with different APIs, both live in production | `src/components/progress/ProgressTracker.tsx` | M |
| 14 | medium | architecture | /progress and /badges reimplement React components as 580 lines of inline vanilla JS, English-only | `src/pages/progress.astro` | M |
| 15 | medium | architecture | Two parallel progress-tracking modules with separate storage keys and overlapping responsibilities | `src/lib/progress.ts` | L |
| 16 | medium | architecture | Only guides are localised; 23 of 36 routes are English-only despite 7 configured locales | `src/pages` | L |
| 17 | medium | architecture | Locale list hardcoded in six places outside src/config/locales.ts | `src/config/locales.ts` | S |
| 18 | medium | architecture | 15 import cycles between simulator roots and their screens/components | `src/simulators/damus/screens/HomeScreen.tsx` | S |
| 19 | medium | architecture | Hooks scattered across four locations; src/types is nearly dead while types live in six other places | `src/hooks` | S |
| 20 | medium | architecture | ui/ barrel reaches upward out of its own directory, so there is no component-layer boundary | `src/components/ui/index.ts` | S |
| 21 | medium | architecture | Site navigation points at three routes that do not exist and orphans two landing pages | `src/components/layout/Footer.astro` | S |
| 22 | medium | architecture | useTranslation polls the URL on a 100ms setInterval in all 38 consuming components | `src/hooks/useTranslation.ts` | S |
| 23 | medium | build-health | 172 console.log calls ship in production JS, and one fires during static generation, corrupting the build log | `src/simulators/keychat/KeychatSimulator.tsx` | S |
| 24 | medium | build-health | Two dead-code modules with unresolvable references sit in the type-check path | `src/components/interactive/damus/DamusInteractiveSimulator.tsx` | S |
| 25 | medium | build-health | Content collections use the deprecated auto-generated path and two collection folders are empty | `src/content/config.ts` | S |
| 26 | medium | build-health | Sitemap lists a 479-byte meta-refresh stub as an indexable URL and emits duplicate en-US hreflang | `dist/guides/index.html` | S |
| 27 | medium | build-health | 16 npm advisories (10 high) including 9 unpatched Astro CVEs in the pinned toolchain | `package.json` | M |
| 28 | medium | build-health | og:image is a 1.18 MB PNG and a second og-image.png is a 194-byte text placeholder | `public/preview_image.png` | S |
| 29 | medium | content-quality | Guides contradict each other on relay counts, NIP-05 pricing, relay software language, feed ordering, and DM metadata | `src/content/guides/en/outbox-model.mdx` | M |
| 30 | medium | content-quality | Fabricated testimonials and case studies presented as real user accounts | `src/content/guides/en/keys-and-security.mdx` | S |
| 31 | medium | content-quality | Unearned freshness dates on demonstrably stale content, and stale Bluesky/Mastodon facts in the comparison guide | `src/content/guides/en/protocol-comparison.mdx` | S |
| 32 | medium | content-quality | Repeated bad diagnostic advice: opening wss:// URLs in a browser, and "you can't re-broadcast old posts" | `src/content/guides/en/troubleshooting.mdx` | S |
| 33 | medium | content-quality | Glossary is incomplete for a page that markets itself as complete, with two malformed duplicate entries and no deep links | `src/pages/glossary.astro` | M |
| 34 | medium | content-quality | Missing topics with real newcomer search demand: communities/groups, long-form publishing, media hosting, NWC, and basic "is Nostr safe/free" questions | `src/content/guides/en/faq.mdx` | L |
| 35 | medium | content-quality | Recommended client roster is dominated by two effectively unmaintained web clients | `src/content/guides/en/multi-client.mdx` | M |
| 36 | medium | content-quality | Key-rotation advice is wrong about NIP-05 migrating followers, and self-contradicts on rotation frequency | `src/content/guides/en/privacy-security.mdx` | S |
| 37 | medium | gamification-state | Badge requirements shown to users contradict the code in three of nine cases | `src/pages/badges.astro` | S |
| 38 | medium | gamification-state | "Nostr Graduate" requires 9 guide completions but the beginner level only contains 7 guides | `src/utils/gamification.ts` | S |
| 39 | medium | gamification-state | The `stats` object in storage is written by nothing — six recorder functions are dead | `src/utils/gamification.ts` | M |
| 40 | medium | gamification-state | /progress computes percentages against 15 guides when 16 exist, and renders one guide with a raw slug | `src/pages/progress.astro` | S |
| 41 | medium | gamification-state | useProgressTracking rewrites the whole storage blob every 10 seconds and every scroll frame, for data it can never persist | `src/lib/useProgressTracking.ts` | M |
| 42 | medium | gamification-state | progressService writes to localStorage with no try/catch, and the throw surfaces during React render | `src/lib/progressService.ts` | S |
| 43 | medium | gamification-state | A `version` field is written but never read — there is no version-gated migration path | `src/utils/gamification.ts` | M |
| 44 | medium | gamification-state | A guide auto-marks itself complete on load whenever its rendered height is under ~1.25 viewports | `src/components/progress/ProgressTracker.tsx` | S |
| 45 | medium | gamification-state | PrivacySecurityQuiz calls useMemo and useEffect after a conditional early return | `src/components/interactive/PrivacySecurityQuiz.tsx` | S |
| 46 | medium | gamification-state | "Delete All Progress Data" leaves the resume state behind, so the site still greets the user with their last guide | `src/lib/progressService.ts` | S |
| 47 | medium | gamification-state | GuideSection reads localStorage during render, and that read can write to localStorage as a side effect | `src/components/guides/GuideSection.tsx` | S |
| 48 | medium | gamification-state | /progress, /badges and /settings are English-only pages linked from every locale's header | `src/components/layout/Header.astro` | L |
| 49 | medium | i18n-parity | Arabic is missing 1,123 of 2,047 keys and Polish 390 — entire interactive components fall back to English | `src/i18n/locales/ar.json` | L |
| 50 | medium | i18n-parity | Quiz question parity is broken across locales — Hindi has 7 empty quizzes, Arabic every quiz truncated to 2-3 of 5-6 questions | `src/i18n/locales/ar.json` | M |
| 51 | medium | i18n-parity | Header and Footer hardcode 48 English nav labels and render on every localized page | `src/components/layout/Header.astro` | M |
| 52 | medium | i18n-parity | 639 hardcoded English UI literals across 83 component/page files bypass the i18n layer entirely | `src/pages/index.astro` | L |
| 53 | medium | i18n-parity | No type safety and no CI parity check — `declare module '*.json' { any }` disables every guardrail | `src/i18n/json.d.ts` | M |
| 54 | medium | i18n-parity | GuidesLink has no Hindi branch — Hindi readers clicking "Guides" are sent to /en/guides | `src/components/navigation/GuidesLink.tsx` | S |
| 55 | medium | i18n-parity | /guides/ is a client-side meta-refresh redirect that is nonetheless listed in the sitemap | `src/pages/guides/index.astro` | S |
| 56 | medium | islands-hydration | framer-motion imported as full `motion` in 104 files; LazyMotion is used nowhere | `package.json` | L |
| 57 | medium | islands-hydration | Four components with zero hooks or event handlers are hydrated as React islands | `src/components/ui/LogoText.tsx` | S |
| 58 | medium | islands-hydration | useTranslation runs a 100 ms setInterval per island instance that never stops | `src/hooks/useTranslation.ts` | S |
| 59 | medium | islands-hydration | GuidesLink is a React island wrapping a single <a>, and silently drops Hindi visitors to English | `src/components/navigation/GuidesLink.tsx` | S |
| 60 | medium | performance | 260KB chunk containing all 542 follow-pack accounts loads on 8 landing pages that render ~5 creator cards | `src/data/follow-pack/accounts.ts` | S |
| 61 | medium | performance | gamification.ts imports nostr-tools crypto at module top level for a function used twice, dragging secp256k1 onto every page | `src/utils/gamification.ts` | S |
| 62 | medium | performance | Pagefind is a declared dependency but is never built and never referenced — search does not exist in production | `package.json` | S |
| 63 | medium | performance | Two banners inject above page content after hydration with no reserved space, causing layout shift for returning visitors | `src/layouts/Layout.astro` | S |
| 64 | medium | performance | Remote avatars hotlinked from 15+ third-party hosts, 46 of them animated GIFs, with no lazy loading or dimensions | `src/data/follow-pack/accounts.ts` | M |
| 65 | medium | performance | OG image is a 1.18MB 2880x1368 PNG, and og-image.png is a 194-byte HTML comment placeholder | `src/config/site.ts` | S |
| 66 | medium | performance | Client logo PNGs are 4-16x their rendered size; /simulators loads 409KB of icons for six 64x64 tiles | `public/icons` | S |
| 67 | medium | repo-hygiene | Three production dependencies are never imported anywhere, including the advertised Pagefind search | `package.json` | S |
| 68 | medium | repo-hygiene | /privacy is served twice — an un-styled orphan copy sits at /privacy.html | `public/privacy.html` | S |
| 69 | medium | repo-hygiene | 470KB of one-off temp and cache JSON is committed under scripts/ | `scripts/metadata-cache.json` | S |
| 70 | medium | repo-hygiene | scripts/README.md documents four scripts that do not exist and omits 35 that do | `scripts/README.md` | M |
| 71 | medium | repo-hygiene | Orphan root-level data/follow-pack/accounts.ts shadows the real one in src/ | `data/follow-pack/accounts.ts` | S |
| 72 | medium | repo-hygiene | README.md describes a version of the project that no longer exists | `README.md` | M |
| 73 | medium | repo-hygiene | Two documentation-cleanup plans were written 5 months ago and never executed | `docs/REORGANIZATION_PLAN.md` | M |
| 74 | medium | repo-hygiene | CODEBASE_AUDIT.md is untracked, arithmetically stale, and its roadmap was never acted on | `CODEBASE_AUDIT.md` | M |
| 75 | medium | repo-hygiene | AGENTS.md points the skill system at .opencode/skills/, which does not exist | `AGENTS.md` | S |
| 76 | medium | repo-hygiene | Junk assets with spaces in their filenames are deployed to production | `public/favicon copy.ico` | S |
| 77 | medium | repo-hygiene | Dead one-off files left at the repo root and in src/pages | `src/pages/nostr-for-photographers.astro.backup.mock` | S |
| 78 | medium | security-privacy | No signature verification on any relay-sourced event, including the site's own "official account" widget | `src/components/interactive/OfficialAccountWidget.tsx` | S |
| 79 | medium | security-privacy | Twitter bridge uploads the user's entire following list to nostr.directory and caches every handle in localStorage | `src/utils/nostrDirectory.ts` | M |
| 80 | medium | security-privacy | Persistent device UUID in localStorage, and tracking defaults to on despite a comment claiming otherwise | `src/lib/progressService.ts` | S |
| 81 | medium | security-privacy | Relay guide opens 19 WebSockets to third-party relay operators on page load with no disclosure | `src/components/interactive/RelayExplorer.tsx` | S |
| 82 | medium | security-privacy | dangerouslySetInnerHTML with no HTML escaping in the Amethyst simulator post renderer | `src/simulators/amethyst/components/MaterialCard.tsx` | S |
| 83 | medium | security-privacy | Fake "Collecting entropy" progress bar teaches beginners a false model of key generation | `src/components/interactive/KeyGenerator.tsx` | S |
| 84 | medium | seo-technical | 57 of 155 titles exceed 65 characters because guide titles get two suffixes stacked | `src/pages/[lang]/guides/[slug].astro` | S |
| 85 | medium | seo-technical | Every page shares one 1.18 MB Open Graph image and there are no og:image dimensions or alt tags | `src/config/site.ts` | M |
| 86 | medium | seo-technical | Duplicate privacy policy at two live URLs, one of which has no canonical, no description and no navigation | `public/privacy.html` | S |
| 87 | medium | seo-technical | Development test page test-progress.html is deployed to production and publicly reachable | `public/test-progress.html` | S |
| 88 | medium | seo-technical | Pagefind is a declared dependency but is never built or referenced — the site has no search and /pagefind/ 404s | `package.json` | M |
| 89 | medium | seo-technical | Ten simulator pages carry 38-123 words of indexable text and two of them have no H1 at all | `src/pages/simulators/gossip.astro` | M |
| 90 | medium | seo-technical | German privacy-security guide ships an untranslated English title, producing the only duplicate title pair on the site | `src/content/guides/de/privacy-security.mdx` | S |
| 91 | medium | seo-technical | Language switcher renders buttons, not links — no crawlable path exists between any two locales | `src/components/LanguageSwitcher.tsx` | S |
| 92 | medium | seo-technical | Render-blocking third-party font stylesheet plus duplicated preconnect hints in every page head | `src/layouts/Layout.astro` | S |
| 93 | medium | simulators | Olas profile reads MockUser fields that do not exist, so the logged-in user never sees their own data | `src/simulators/olas/screens/ProfileScreen.tsx` | S |
| 94 | medium | simulators | nostr-kitten is an orphan route shipping unscoped global CSS with viewport-fixed overlays | `src/simulators/nostr-kitten/nostr-kitten.theme.css` | S |
| 95 | medium | simulators | 128 console.log calls and a file labelled "Debug Version" ship to production | `src/simulators/keychat/KeychatSimulator.tsx` | S |
| 96 | medium | simulators | MobilePhoneFrame is hydrated with client:load despite having zero interactivity, and Damus uses min-h-screen inside it | `src/pages/simulators/damus.astro` | S |
| 97 | medium | simulators | Every simulator page ships 636-777 KB of uncompressed JS+CSS | `src/pages/simulators/amethyst.astro` | M |
| 98 | medium | simulators | 4,270 lines of AI agent scratch reports are checked into src/simulators/ | `src/simulators/amethyst/analysis/discrepancy_report.md` | S |
| 99 | medium | simulators | Accessibility: 51 images without alt text, 2 aria-labels across 380 buttons | `src/simulators` | M |
| 100 | medium | testing-ci-ops | 404 page is English-only and dumps six of seven locales out of their language | `src/pages/404.astro` | M |
| 101 | medium | testing-ci-ops | useTranslation runs a 100ms polling interval per mounted component across 47 call sites | `src/hooks/useTranslation.ts` | S |
| 102 | medium | testing-ci-ops | All seven locale bundles ship to every visitor in one 516 KB eager chunk | `src/hooks/useTranslation.ts` | M |
| 103 | medium | testing-ci-ops | No WebSocket readyState guard on any of the 9 send() call sites; stopStreaming can throw InvalidStateError | `src/components/interactive/RelayPlayground.tsx` | S |
| 104 | medium | testing-ci-ops | No linter, formatter, or pre-commit hook — and the code already contains eslint-disable comments for a linter that is not installed | `src/components/follow-pack/ExportModal.tsx` | M |
| 105 | medium | testing-ci-ops | NIP-05 checker fetch has no timeout, so a black-holing domain spins the UI indefinitely | `src/components/interactive/NIP05Checker.tsx` | S |
| 106 | medium | testing-ci-ops | Build artifacts leak into production: .DS_Store, duplicate privacy policies, and 'copy'-suffixed files | `public/.DS_Store` | S |
| 107 | medium | testing-ci-ops | README documents an environment variable nothing reads and a placeholder issue URL | `README.md` | S |
| 108 | medium | testing-ci-ops | Locale key coverage varies 41%-100% with no parity check anywhere in the pipeline | `src/i18n/locales/hi.json` | S |
| 109 | medium | ux-funnel | Guide pages contain no prev/next links in HTML — the only in-page forward link is the footer FAQ | `src/pages/[...lang]/guides/[slug].astro` | M |
| 110 | medium | ux-funnel | Non-English visitors have no localized entry point and the language switcher silently does nothing on most pages | `src/components/LanguageSwitcher.tsx` | M |
| 111 | medium | ux-funnel | The interest filter on /guides returns 0–3 results, most of them locked | `src/pages/[...lang]/guides/index.astro` | S |
| 112 | medium | ux-funnel | Progress and Settings are unreachable from the header by keyboard or touch | `src/components/layout/Header.astro` | S |
| 113 | medium | ux-funnel | No site search despite pagefind being a declared dependency | `package.json` | S |
| 114 | medium | ux-funnel | /glossary and /resources are terminal pages that leak traffic off-site | `src/pages/glossary.astro` | S |
| 115 | medium | ux-funnel | The 'Start Tour' button does nothing on the Gossip and Coracle simulators | `src/components/navigation/SimulatorSidebar.tsx` | M |
| 116 | medium | ux-funnel | Follow-pack's closing CTA scrolls the user back to the top of the page instead of to the tool | `src/pages/follow-pack.astro` | S |
| 117 | medium | ux-funnel | Resume banner's dismiss button is absolutely positioned with no positioned ancestor | `src/components/navigation/ResumeBanner.tsx` | S |
| 118 | medium | ux-funnel | There is no way to get a Nostr identity in the '2 minutes' the homepage promises | `src/pages/index.astro` | M |
| 119 | low | accessibility | role="alert" on static guide callouts fires on page load | `src/components/ui/Callout.tsx` | S |
| 120 | low | accessibility | Progress bars render as bare divs with no progressbar semantics | `src/components/ui/ProgressBar.tsx` | S |
| 121 | low | accessibility | Masked private key renders 63 bullet characters that screen readers spell out | `src/components/interactive/KeyGenerator.tsx` | S |
| 122 | low | architecture | 21 stale README/IMPLEMENTATION markdown files inside src/ describing code that has moved or died | `src/components/interactive/README.md` | S |
| 123 | low | architecture | Content collection schema uses .passthrough(), so frontmatter fields the code depends on are unvalidated | `src/content/config.ts` | S |
| 124 | low | architecture | 7,900 LOC of hand-written per-simulator CSS running parallel to Tailwind | `src/simulators/snort/snort.theme.css` | M |
| 125 | low | architecture | Duplicate route for the Damus simulator, one of which renders without site chrome | `src/pages/damus-demo.astro` | S |
| 126 | low | build-health | Junk files from public/ are published: .DS_Store, "favicon copy.ico", "site copy.webmanifest" | `public/.DS_Store` | S |
| 127 | low | build-health | pagefind is a declared dependency but never runs and is referenced by nothing — the site has no search | `package.json` | S |
| 128 | low | build-health | nostr-for-photographers.astro.backup.mock is dead weight but does NOT become a route | `src/pages/nostr-for-photographers.astro.backup.mock` | S |
| 129 | low | build-health | Build environment drift: stale browserslist data, unused import warning, no engines pin | `package.json` | S |
| 130 | low | content-quality | Two content collections are declared but empty, and priority/prerequisite metadata is inconsistent | `src/content/config.ts` | S |
| 131 | low | content-quality | "More combinations than atoms in the observable universe" is false by roughly three orders of magnitude | `src/content/guides/en/faq.mdx` | S |
| 132 | low | gamification-state | gamificationEngine.ts's own storage layer (getDefaultData/loadData/saveData) is dead duplicate code that would clobber state if used | `src/utils/gamificationEngine.ts` | S |
| 133 | low | gamification-state | Selecting a relay or an account triggers four full JSON parse/stringify cycles, including one on mount with count 0 | `src/components/interactive/RelayExplorer.tsx` | S |
| 134 | low | gamification-state | badges.astro re-attaches click handlers on every refresh, producing duplicate modal opens | `src/pages/badges.astro` | S |
| 135 | low | gamification-state | 14 console.log statements ship to production from the gamification hot path | `src/utils/gamification.ts` | S |
| 136 | low | gamification-state | Locked-guide cards always say "complete N more" with N = the full threshold, no matter how much the user has done | `src/components/guides/GuideSection.tsx` | S |
| 137 | low | gamification-state | Zero automated tests cover the gamification and progress layer | `-` | M |
| 138 | low | i18n-parity | 723 keys exist in locale files that no code path reads | `src/i18n/locales/hi.json` | M |
| 139 | low | i18n-parity | German has 46 untranslated prose values including 8 of 16 quiz titles | `src/i18n/locales/de.json` | S |
| 140 | low | i18n-parity | Hindi estimatedTime frontmatter mixes English, Devanagari numerals and Arabic numerals, breaking the reading-time parser | `src/content/guides/hi/nostr-tools.mdx` | S |
| 141 | low | islands-hydration | Simulator pages nest a client:load island inside another client:load island | `src/pages/simulators/damus.astro` | S |
| 142 | low | performance | Astro's built-in link prefetch is not enabled, so every internal navigation is a cold request | `astro.config.mjs` | S |
| 143 | low | performance | Trivial static components are shipped as client:load React islands, booting React on otherwise static pages | `src/components/layout/Header.astro` | S |
| 144 | low | performance | 83 infinite CSS animations plus site-wide compositing effects keep the main thread and compositor permanently busy | `src/styles/globals.css` | S |
| 145 | low | performance | Development artifacts and duplicate files are deployed to production | `public/simulators` | S |
| 146 | low | performance | Duplicate font preconnect hints emitted by both Layout and SEO components | `src/components/SEO.astro` | S |
| 147 | low | repo-hygiene | CHANGELOG.md's most recent entry is 5 months old and predates three locales and the routing refactor | `CHANGELOG.md` | S |
| 148 | low | repo-hygiene | @tailwindcss/typography and tailwindcss-rtl are build-time requirements sitting in devDependencies | `package.json` | S |
| 149 | low | repo-hygiene | No lint, format, test or CI configuration exists, while docs/qa/ describes a QA process | `package.json` | M |
| 150 | low | repo-hygiene | 149MB nested Astro tutorial project and 38MB of reference screenshots inflate the working tree | `learning/astro-learning/package.json` | S |
| 151 | low | security-privacy | Stale duplicate privacy policy and a debug harness are deployed to production | `public/privacy.html` | S |
| 152 | low | security-privacy | NIP-05 checker builds fetch URLs from unsanitized user input and renders a remote picture URL | `src/components/interactive/NIP05Checker.tsx` | S |
| 153 | low | security-privacy | Six raw innerHTML assignments on the progress page interpolate values read from localStorage | `src/pages/progress.astro` | S |
| 154 | low | security-privacy | Ten high-severity npm advisories in the dependency tree, including XSS CVEs in Astro itself | `package-lock.json` | S |
| 155 | low | security-privacy | Live Cashu bearer tokens sit in plaintext in the project root with no .vercelignore | `ai-scripts/redeem-coinos.mjs` | S |
| 156 | low | seo-technical | Sitemap carries no lastmod, no changefreq and includes low-value user-state pages | `astro.config.mjs` | S |
| 157 | low | seo-technical | Heading hierarchy skips H2 on 24 pages, and 477 of 764 images lack explicit dimensions | `src/content/guides/en/what-is-nostr.mdx` | M |
| 158 | low | seo-technical | robots.txt sets Crawl-delay: 1 and has no Disallow rules for the stray public files | `public/robots.txt` | S |
| 159 | low | simulators | shared/configs.ts exports keychatConfig and olasConfig but shared/index.ts does not re-export them | `src/simulators/shared/index.ts` | S |
| 160 | low | testing-ci-ops | No Node version pin, so the build toolchain can drift silently on Vercel | `package.json` | S |
| 161 | low | testing-ci-ops | QA and testing documentation is a set of frozen point-in-time snapshots that no longer describe the site | `PHASE2_TESTING_REPORT.md` | S |
| 162 | low | testing-ci-ops | 53 uncommitted files with 4,479 deletions in the working tree — local state diverges from what is deployed | `-` | S |
| 163 | low | ux-funnel | Hardcoded counts and copy drift across the progress, tools and simulator pages | `src/pages/progress.astro` | S |
| 164 | low | ux-funnel | Level-unlock modal is hardcoded English for all seven locales | `src/components/guides/UnlockButton.tsx` | S |

---

## Detail

### 1. [medium] framer-motion animations ignore prefers-reduced-motion — including 23 infinite loops, one on every page

**Area:** accessibility · **File:** `src/components/gamification/StreakBanner.tsx`:131-141 · **Effort:** M

**Evidence (unverified):** globals.css:189-197 forces `animation-duration`/`transition-duration` to 0.01ms under reduced motion, but framer-motion 12.34.0 (package.json:24) drives `animate` props via rAF-applied inline styles, which CSS duration overrides cannot touch. Its own opt-in is `<MotionConfig reducedMotion="user">` or `useReducedMotion()` — `grep -rn "MotionConfig|useReducedMotion" src/` returns **0 results**. 104 files import framer-motion and 23 use `repeat: Infinity`. StreakBanner renders on **every page** via Layout.astro:156 and animates continuously at :138 and :158. BadgeEarnedModal.tsx:182 (4s background gradient loop) and :234 (perpetual badge scale/rotate wiggle) run for as long as the modal is open, with no pause/stop control. NostrichAnimation.tsx:106/133/337/372 has no reduced-motion guard at all. The globals.css block also omits `scroll-behavior: auto`, so the `scroll-smooth` class on Layout.astro:20 and `html { scroll-behavior: smooth }` at globals.css:56-58 keep animating scroll.

**Impact:** Users with vestibular disorders who have set the OS reduced-motion preference still get a perpetually pulsing streak banner at the top of every page, spring-scaling modals, sliding quiz transitions and smooth scroll. Note CyberpunkAnimation.tsx:38-93 shows the team knows how to do this — it just wasn't applied anywhere else. WCAG 2.3.3 (AAA) and 2.2.2 (A) for the >5s infinite loops with no pause mechanism.

**Suggested fix:** Wrap React islands in `<MotionConfig reducedMotion="user">`, or add `const reduce = useReducedMotion()` to the ~12 components with `repeat: Infinity` and skip the loop. Add `html { scroll-behavior: auto !important }` inside the globals.css:189 reduced-motion block.

### 2. [medium] Duplicate role="banner" landmark — the streak notification claims the same role as the site header

**Area:** accessibility · **File:** `src/components/gamification/StreakBanner.tsx`:105-106 · **Effort:** S

**Evidence (unverified):** StreakBanner.tsx:105 sets `role="banner" aria-label="Learning streak notification"` on a dismissible notification card. Header.astro:29 already sets `role="banner"` on the real `<header>`. StreakBannerWrapper is mounted at Layout.astro:156, *before* `<slot />`, so when the streak is active every page has two `banner` landmarks and the notification is the first one in the landmark list — sitting outside any `<main>`/`<header>`.

**Impact:** Screen-reader landmark navigation (rotor / D key) lands on a transient gamification toast labelled as the page banner before reaching the actual site header, and the duplicate role breaks the one-banner-per-page expectation. WCAG 1.3.1 (A).

**Suggested fix:** Change StreakBanner.tsx:105 to `role="status" aria-live="polite"` (which also fixes the fact that its appearance is currently unannounced), and drop the `banner` role.

### 3. [medium] Heading order breaks on 34 built pages; quickstart ships two <h1>s with invalid <p>-inside-<h1> nesting in all 7 locales

**Area:** accessibility · **File:** `src/content/guides/en/quickstart.mdx`:10-17 · **Effort:** M

**Evidence (unverified):** A parse of all 153 built HTML pages finds 34 with heading-level skips. quickstart.mdx:11 opens `<h1 className="text-4xl md:text-5xl font-bold mb-4">Ready to Launch?</h1>` on a page where [slug].astro:241 already emits the guide-title `<h1>`. MDX also wraps the child text in a paragraph, producing literally `<h1 class="..."><p>جاهز للانطلاق؟</p></h1>` and `<p ...><p>...</p></p>` in `dist/ar/guides/quickstart/index.html` — invalid nesting that HTML parsers will unwrap, leaving an empty `<h1>`. This ships in all 7 locales (`dist/{ar,de,en,es,hi,pl,zh}/guides/quickstart/index.html` all report h1=2). Skips elsewhere: h1→h3 on every `*/guides/faq` page (FAQAccordion.tsx:82 renders `<h3>` — and does so *inside* a `<button>`, which is not valid button content and drops it from the heading list in some AT), h1→h3 on `*/guides/index`, `dist/glossary/index.html` (glossary.astro:159 `<h3>` cards under the `<h1>`), `dist/settings/index.html` (h1→h3→h4), `dist/twitter-bridge/index.html`, `dist/simulators/index.html`; h2→h4 on every `*/guides/keys-and-security` page and `dist/simulators/gossip/index.html`.

**Impact:** Screen-reader users navigating by heading level get an inconsistent outline: two competing page titles on quickstart, and sections that appear nested two levels deeper than they are. The empty `<h1>` produced by the invalid nesting is announced as "heading level 1, blank". WCAG 1.3.1 (A), 2.4.6 (AA).

**Suggested fix:** Demote quickstart.mdx:11 (and its 6 translations) to `<h2>` or fold the text into the frontmatter title; use `<h1>{'Ready to Launch?'}</h1>` form or a plain heading to avoid the MDX paragraph wrap. Change FAQAccordion.tsx:82 to a `<span>` inside the button and wrap the whole accordion in an `<h3>` containing the button (the standard disclosure pattern). Fix glossary.astro:159 and settings.astro to start at `<h2>`.

### 4. [medium] Arabic, Chinese and Hindi pages wrap English UI chrome without lang markup

**Area:** accessibility · **File:** `src/components/layout/Header.astro`:7-26 · **Effort:** M

**Evidence (unverified):** Header.astro:7-12 hard-codes `Tools / Glossary / Resources / About`, :22-26 hard-codes the tool menu, and Footer.astro:6-46 hard-codes every footer link label. Layout.astro:151-153 hard-codes the skip link text `Skip to content`. `[slug].astro:264` hard-codes `Last updated `. None are wrapped in `lang="en"`. Extracting the header text from `dist/ar/guides/what-is-nostr/index.html` (whose `<html lang="ar" dir="rtl">`) yields: `nostrich love Guides Tools Glossary Resources About ... Progress ... Settings`.

**Impact:** A screen reader set to Arabic pronounces "Glossary", "Resources" and "Skip to content" using Arabic phoneme rules — typically unintelligible. Arabic-, Chinese- and Hindi-speaking users also cannot use the site's own skip link because they cannot read it. WCAG 3.1.2 (AA), and the skip link additionally undermines 2.4.1.

**Suggested fix:** Move the nav/footer/skip-link strings into the existing `src/i18n/locales/*.json` files and render via `getTranslations(locale)` (the guides pages already do this). Until then, add `lang="en"` to the untranslated header/footer regions so AT switches voices.

### 5. [medium] Tour hijacks Enter and arrow keys globally, breaking activation of its own controls

**Area:** accessibility · **File:** `src/components/tour/TourOverlay.tsx`:45-70 · **Effort:** M

**Evidence (unverified):** A `window`-level `keydown` listener calls `e.preventDefault()` and advances the tour on `Enter` and `ArrowRight` (:47-56) and goes back on `ArrowLeft` (:57-60), for as long as `state.isActive`. TourControls.tsx renders real `<button>`s for Prev (:27), Next (:49), Skip (:66) and Restart (:77) — pressing Enter on any of them fires the global handler *and* is prevented from doing its own default, so focusing "Skip" and pressing Enter advances the tour instead of skipping it. The same listener swallows arrow keys inside any focused input/select on the underlying simulator. The overlay also has `role="dialog" aria-modal="true"` (:119-121) but never moves focus into itself, never traps Tab and never restores focus — and because `aria-modal` hides the rest of the page from AT, the spotlighted target element the tour is describing becomes unreadable to screen-reader users.

**Impact:** Keyboard users cannot reliably operate the tour's own buttons, and screen-reader users are shown a dialog that describes an element they can no longer read. WCAG 2.1.1 (A), 2.4.3 (A).

**Suggested fix:** Scope the keydown listener to the overlay element and skip it when `document.activeElement` is a button/input; drop `preventDefault()` on Enter. Add focus trap + initial focus + focus restore. Mirror the spotlighted element's text into the tooltip (`aria-describedby`) so it survives `aria-modal`.

### 6. [medium] role="switch" toggles on the Settings page have no accessible name

**Area:** accessibility · **File:** `src/components/progress/PrivacyControls.tsx`:109-122 · **Effort:** S

**Evidence (unverified):** Three switches at PrivacyControls.tsx:109-122, :135-149 and :166-180 use `role="switch" aria-checked={...}` on a `<button>` whose only child is a decorative `<span>` thumb — no `aria-label`, no `aria-labelledby` pointing at the adjacent `<h4>` ("Progress Tracking" at :104, "Show Progress Indicators" at :131). ManualUnlockToggle.tsx:55-70 is the same (`<h4>Unlock All Levels</h4>` at :50 is unassociated). All four render on /settings.

**Impact:** A screen reader announces "switch, not checked" four times in a row with no way to tell which setting is which. Users cannot manage their own privacy/tracking preferences. WCAG 4.1.2 (A).

**Suggested fix:** Give each `<h4>` an `id` and add `aria-labelledby` to the corresponding switch button (or add `aria-label` with the same string).

### 7. [medium] Tab interfaces have either no ARIA or an incomplete/incorrect ARIA pattern

**Area:** accessibility · **File:** `src/components/interactive/RelayPlayground.tsx`:495-516 · **Effort:** M

**Evidence (unverified):** RelayPlayground.tsx:495-516 renders five tabs (Connection / Health / NIPs / Events / Query) as bare `<button onClick={() => setActiveTab(tab.id)}>` with no `role`, no `aria-selected`, no `aria-controls`, and panels at :540-570 with no `role="tabpanel"`. InterestFilter.tsx goes the other way and gets it half right: `role="tablist"` (:137), `role="tab" aria-selected` (:151-152) — but no `aria-controls`, no matching `role="tabpanel"`, and no roving tabindex/arrow-key navigation, so it advertises the tabs pattern while behaving like buttons. Its mobile branch (:102-125) applies `role="listbox"`/`role="option"` to `<button>` elements, which strips their button semantics and provides no `aria-activedescendant` or keyboard model. Repo totals: `role="tab"` = 1 file, `aria-selected` = 2, `aria-controls` = 1 (Header.astro:144), `aria-pressed` = 0.

**Impact:** Screen-reader users cannot tell which relay-playground tab is active or that the content below changed when they press one; on the guides filter they are promised tab semantics ("tab, 2 of 6, selected") but arrow keys do nothing. WCAG 4.1.2 (A), 4.1.3 (AA).

**Suggested fix:** Pick one: either drop the tab roles and use `aria-pressed` buttons + a `role="status"` announcement of the new panel, or implement the full APG tabs pattern (tablist/tab/tabpanel, aria-controls, roving tabindex, Left/Right/Home/End).

### 8. [medium] KeyGenerator security checklist uses sr-only checkboxes with no visible focus indicator

**Area:** accessibility · **File:** `src/components/interactive/KeyGenerator.tsx`:333-368 · **Effort:** S

**Evidence (unverified):** Each of the three acknowledgement items wraps a real `<input type="checkbox" className="sr-only">` (:354-359) next to a purely visual `<div>` box (:342-353). Tailwind's `sr-only` uses `clip`/1px sizing rather than `display:none`, so the input stays in the tab order — but the global `*:focus-visible { outline: 2px solid #8B5CF6 }` (Layout.astro:61) paints that outline on a 1px clipped element, i.e. invisibly. There is no `peer`/`peer-focus-visible:` styling on the visual box (`grep -rn 'peer-focus' src/` → 0 results). The checkbox is also the *third* child of the `<label>`, after the visual box.

**Impact:** A sighted keyboard user tabbing through the key generator sees the focus ring vanish for three stops, has no idea a control is focused, and cannot confirm the three security acknowledgements that gate copying their private key. WCAG 2.4.7 (AA).

**Suggested fix:** Add `peer` to the input and `peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 peer-focus-visible:ring-offset-2` to the visual box (and `peer-checked:` for the checked style), or switch to a styled native checkbox with `accent-color`.

### 9. [medium] Sticky header obscures anchor targets and the skip-link destination; <main> is not focusable

**Area:** accessibility · **File:** `src/layouts/Layout.astro`:20 · **Effort:** S

**Evidence (unverified):** Header.astro:29 is `sticky top-0 z-50` with `h-16` (64px). `grep -rn "scroll-mt|scroll-padding|scroll-margin" src/` returns **0 results**, and `html` has `scroll-behavior: smooth` (globals.css:56-58 and the `scroll-smooth` class on Layout.astro:20). None of the 25 `<main id="main-content">` declarations carry `tabindex="-1"`. The site links to in-page anchors from the header and footer (Header.astro:23-24 `/tools#client-recommender`, `/tools#key-generator`; Footer.astro:16-17 `/tools#relay-playground`, `#key-generator`).

**Impact:** Following any in-page anchor — including the skip link — scrolls the target under the 64px sticky header, so the first heading/control is hidden. Without `tabindex="-1"` on `<main>`, Safari and older browsers do not move keyboard focus at all when the skip link is activated, silently defeating it. WCAG 2.4.11 Focus Not Obscured (Minimum) (AA, new in 2.2), 2.4.1 (A).

**Suggested fix:** Add `scroll-padding-top: 5rem` to `html` in globals.css, add `tabindex="-1"` to every `<main id="main-content">`, and add `scroll-mt-20` to headings that serve as anchor targets on /tools.

### 10. [medium] text-gray-400 used as body text on light backgrounds (2.54:1)

**Area:** accessibility · **File:** `src/components/ReadingTimeHeading.tsx`:40 · **Effort:** S

**Evidence (unverified):** `#9CA3AF` on `#FFFFFF` = **2.54:1** (needs 4.5:1). ReadingTimeHeading.tsx:40 renders the reading-time annotation as `text-sm font-normal text-gray-400 dark:text-gray-500` — and the dark variant is no better: `#6B7280` on the dark background `#0F0A1A` = **4.03:1**, also failing. This component is exported as the `H2`/`H3` MDX overrides used across guide content ([slug].astro:200-201). Other light-mode instances with no dark-mode-only guard: RelayWorldMap.tsx:121, :126, :131, :136 (all four region labels) and :57; ValueCard.tsx:42 (card body copy); CTA.tsx:38 (CTA description); InteractiveChecklist.tsx:261 ("Loading..."); ErrorBoundary.tsx:54.

**Impact:** Reading-time hints, world-map region labels and CTA descriptions are illegible for low-vision users in both themes. WCAG 1.4.3 (AA).

**Suggested fix:** Use `text-gray-500 dark:text-gray-400` (4.83:1 light / 7.67:1 dark) as the minimum muted-text pair and codify it as a design token so `text-gray-400` is never used on light surfaces.

### 11. [medium] White text on light-grey surfaces in RelayPlayground — invisible in light mode

**Area:** accessibility · **File:** `src/components/interactive/RelayPlayground.tsx`:484 · **Effort:** S

**Evidence (unverified):** Line 484: `<div className="text-3xl font-bold text-white">{relays.length}</div>` inside a `bg-gray-100/50 dark:bg-gray-800/50` stat card (:483) — white on `#F3F4F6` at 50% over white is roughly 1.05:1. Line 519: the "Check all" button is `bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 ... disabled:bg-gray-800 text-white` — white text on `#E5E7EB` ≈ 1.3:1 in its light-mode resting state. The neighbouring stat values at :476 and :482 use the dead `text-success-500`/`text-error-500` classes, so those inherit instead. Related class typo at RelayExplorer.tsx:649: `disabled:bg-gray-100 dark:bg-gray-800 \text-gray-900 dark:text-white` — a literal tab and `ext-gray-900` make the light-mode text colour a no-op.

**Impact:** The relay count and the primary "Check all relays" action label are unreadable in the default light theme for everyone, not just low-vision users. WCAG 1.4.3 (AA).

**Suggested fix:** Change :484 to `text-gray-900 dark:text-white` and :519 to `text-gray-900 dark:text-white`; fix the malformed class string at RelayExplorer.tsx:649.

### 12. [medium] No layout composition: 36 pages import Header and Footer by hand and 5 silently omit them

**Area:** architecture · **File:** `src/layouts/Layout.astro`:18-19 · **Effort:** M

**Evidence (unverified):** Layout.astro renders `<slot />` with no Header or Footer; every page repeats `import Header from '../components/layout/Header.astro'` + `import Footer ...` and places them manually. Header.astro has fan-in 32 and Footer.astro 23 from a 36-page site. The gaps: src/pages/privacy.astro and src/pages/damus-demo.astro have neither; src/pages/guides/index.astro and src/pages/simulators/nostr-kitten.astro have neither; all 10 simulator pages have a Header but no Footer. src/pages/guides/index.astro bypasses Layout entirely — it is a raw `<!DOCTYPE html>` meta-refresh stub with no SEO component, no canonical handled by SEO.astro, and its own hardcoded locale array (line 11).

**Impact:** Chrome/footer changes have to be applied 36 times, and /privacy and /damus-demo currently render with no site navigation at all — a user landing there from search has no way back into the site. The Layout also only accepts a `locale` prop from the two [lang]/guides routes, so the other 34 pages always emit lang="en" and dir="ltr".

**Suggested fix:** Move Header and Footer into Layout.astro behind `chrome={'full'|'minimal'|'none'}` props, delete the 36 duplicated import pairs, and make guides/index.astro a real Astro page (or a Vercel redirect rule) rather than a hand-written HTML document.

### 13. [medium] Duplicate component names across directories with different APIs, both live in production

**Area:** architecture · **File:** `src/components/progress/ProgressTracker.tsx`:1 · **Effort:** M

**Evidence (unverified):** Two live ProgressTracker components: src/components/gamification/ProgressTracker.tsx (256 LOC, takes a `progress` object, used by src/pages/index.astro:6) and src/components/progress/ProgressTracker.tsx (68 LOC, takes guideSlug/guideTitle and writes to storage, used by src/pages/[lang]/guides/[slug].astro:41). Two PrerequisiteWarning components: src/components/navigation/PrerequisiteWarning.tsx (212 LOC, live, used at [slug].astro:46) and src/components/ui/PrerequisiteWarning.tsx (93 LOC, dead, different props, still exported). Two CommunityLanding.astro (src/components/ and src/components/community/), both dead. A basename scan across src/ finds 38 duplicated filenames. Compounding this, src/components/ root mixes 13 one-line re-export shims (e.g. KeyGenerator.tsx = `export { KeyGenerator } from "./interactive/KeyGenerator";`), 13 real components, a README, SEO.astro and a page-level CommunityLanding.astro, and [slug].astro imports inconsistently through both — `'../../../components/KeyGenerator'` (shim) on line 31 next to `'../../../components/interactive/NIP05Checker'` (direct) on line 36.

**Impact:** Autocomplete on 'ProgressTracker' or 'PrerequisiteWarning' offers two answers and the wrong one silently no-ops or crashes on missing props. The shim layer means the same component has two import paths, so grep-based refactors miss half the call sites.

**Suggested fix:** Delete the dead twins (ui/PrerequisiteWarning.tsx, both CommunityLanding.astro). Rename the survivors to distinct intents (GuideProgressBeacon vs ProgressSummary). Remove the 13 root shims and update the ~20 import sites to the real paths.

### 14. [medium] /progress and /badges reimplement React components as 580 lines of inline vanilla JS, English-only

**Area:** architecture · **File:** `src/pages/progress.astro`:351-666 · **Effort:** M

**Evidence (unverified):** progress.astro is 666 lines of which 316 are one inline `<script>` (line 351 onwards) that re-implements progress rendering in DOM-manipulation style, including its own formatDate (line 377), its own getProgressData wrapper (line 393), a hardcoded 15-entry English guideMetadata map (lines 357-372) and `const totalGuides = 15` at both line 7 and line 420. badges.astro is 549 lines with a 264-line inline script (line 286 onwards) containing its own badgeMetadata, rarityStyles and categoryColors maps. Meanwhile src/components/gamification/ already provides BadgeDisplay.tsx (256), ProgressTracker.tsx (256) and types.ts doing the same job as React islands.

**Impact:** Two of the site's three account-style pages are stuck in English regardless of locale, and their guide/badge copy has already drifted from every other source (guideMetadata omits outbox-model; badgeMetadata says 'Complete 5 guides' where the engine awards at 3). Fixing a label means editing a string inside a template literal inside an inline script rather than a translation file.

**Suggested fix:** Replace both inline scripts with the existing gamification React islands, feeding them from src/config/gamification.ts and the i18n layer. That removes ~580 LOC and brings both pages into the 7-locale system.

### 15. [medium] Two parallel progress-tracking modules with separate storage keys and overlapping responsibilities

**Area:** architecture · **File:** `src/lib/progress.ts`:1-42 · **Effort:** L

**Evidence (unverified):** src/lib/progress.ts (451 LOC) opens with 'This file now acts as a bridge/wrapper layer around gamification.ts' and re-exports deprecated aliases (`/** @deprecated */ export type LearningPathId = SkillLevel` line 55, `PathProgress` line 58). src/lib/progressService.ts (350 LOC) is an independent implementation with its own keys — 'nostrich-device-id' and 'nostrich-privacy-settings' (lines 6-7) — and its own ProgressData/GuideProgress schema (lines 38-53) that does not overlap the gamification schema at all. Seven components import progress.ts, eight import progressService.ts, and several import both concepts in one file (src/components/tour/tourStorage.ts:6 reads getPrivacySettings from progressService while writing tour state elsewhere). src/lib/useProgressTracking.ts (169 LOC) wraps only progressService and has exactly one consumer.

**Impact:** 'Has the user completed guide X?' has two answers depending on which module you ask — progressService.isGuideCompleted (used by ui/PrerequisiteWarning) and gamification.isGuideCompleted (used everywhere else) read different stores. Privacy settings live in a third key that the gamification writers ignore, so trackingEnabled=false does not stop gamification writes.

**Suggested fix:** Pick one store. Fold progressService's privacy settings into the gamification blob (or keep them as an explicitly-scoped preferences module) and delete the bridge layer in progress.ts along with its deprecated aliases.

### 16. [medium] Only guides are localised; 23 of 36 routes are English-only despite 7 configured locales

**Area:** architecture · **File:** `src/pages`:- · **Effort:** L

**Evidence (unverified):** src/pages has exactly two localised routes — [lang]/guides/index.astro and [lang]/guides/[slug].astro — and they are the only two that pass `locale` to Layout. The build confirms: 17 HTML pages under each of dist/en, /pl, /es, /de, /zh, /ar, /hi (119 total) plus 23 English-only pages at the root, covering /tools, /glossary, /resources, /about, /progress, /badges, /settings, /follow-pack, /twitter-bridge, /relay-feed-browser, all 8 /nostr-for-* landing pages and all 10 /simulators/*. Layout.astro defaults `locale = 'en'` (line 13), so all 23 emit lang="en" dir="ltr" — including for Arabic readers who arrive from a translated guide.

**Impact:** An Arabic or Chinese reader who finishes a translated guide and clicks Tools, Glossary or Progress in the header lands on an English page rendered left-to-right. The 7-locale investment covers guide content but not the surrounding product, so the localised experience dead-ends at every navigation click.

**Suggested fix:** Move the shared pages under src/pages/[lang]/ with a getStaticPaths over `locales`, keeping unprefixed English via prefixDefaultLocale:false. Start with the header-linked four (/tools, /glossary, /resources, /about) since those are the immediate dead ends.

### 17. [medium] Locale list hardcoded in six places outside src/config/locales.ts

**Area:** architecture · **File:** `src/config/locales.ts`:2 · **Effort:** S

**Evidence (unverified):** `export const locales = ['en', 'pl', 'es', 'de', 'zh', 'ar', 'hi']` at locales.ts:2 is the intended source, but the identical literal is re-typed at astro.config.mjs:19, src/pages/[lang]/guides/[slug].astro:83 (inside getStaticPaths — the file already imports from config/locales on line 51, for the type only), src/pages/guides/index.astro:11, src/pages/progress.astro:534 and src/components/LanguageSwitcher.tsx:77. A seventh partial copy is the `/^\/(en|pl|es|de)/` regex at SEO.astro:39 and :49. src/i18n/index.ts:23-28 encodes the same list a third way as a prefix if-chain.

**Impact:** Adding locale #8 requires finding and editing seven places. The SEO.astro copy already proves the failure mode — it was never updated for zh/ar/hi and produces 51 pages of broken hreflang. LESSONS_ZH_LOCALE.md, LESSONS_AR_LOCALE.md and LESSONS_HI_LOCALE.md exist at the repo root, which suggests each locale addition has been a painful manual hunt.

**Suggested fix:** Import `locales` from src/config/locales.ts everywhere (astro.config.mjs can import it too), rewrite getCurrentLocale in src/i18n/index.ts to derive from the array, and derive the SEO strip regex from it. Add a test that asserts astro.config.mjs and config/locales.ts agree.

### 18. [medium] 15 import cycles between simulator roots and their screens/components

**Area:** architecture · **File:** `src/simulators/damus/screens/HomeScreen.tsx`:3 · **Effort:** S

**Evidence (unverified):** A module-graph scan finds 15 cycles, all of the form parent ↔ child: DamusSimulator.tsx ↔ {screens/HomeScreen, screens/ProfileScreen, screens/SettingsScreen, components/TabBar}, CoracleSimulator.tsx ↔ 6 modules, plus gossip/Sidebar, keychat/BottomNav, primal web/LeftSidebar, primal mobile/BottomNav and snort/TimelineScreen. The cause is uniform: children import the screen-union type from the parent, e.g. HomeScreen.tsx:3 `import type { DamusScreen } from '../DamusSimulator';` and coracle/components/GuidedTour.tsx:2 `import type { CoracleScreen } from '../CoracleSimulator';`.

**Impact:** These are type-only today so they erase at compile time and are harmless at runtime — but they encode the wrong dependency direction. The moment anyone imports a value (a constant, a helper) along one of these edges, the simulator gets a runtime TDZ error that is hard to diagnose. It also blocks tree-shaking of the parent from a child-only entry point.

**Suggested fix:** Move each simulator's screen-union type into its existing local types file (or a new `types.ts` next to index.ts) so children depend on types, not on the parent component module. Nine of the ten simulators already have a components/ dir where this fits naturally.

### 19. [medium] Hooks scattered across four locations; src/types is nearly dead while types live in six other places

**Area:** architecture · **File:** `src/hooks`:- · **Effort:** S

**Evidence (unverified):** Hooks live in src/hooks/ (2 files, 76 LOC), src/lib/useProgressTracking.ts, src/components/tour/useTourElement.ts, src/simulators/shared/hooks/ (2) and src/simulators/snort/hooks/ (1). src/types/ holds 4 files / 309 LOC of which two are effectively dead — types/prerequisites.ts has a single importer (components/navigation/index.ts:9, re-exporting types the components themselves declare locally) and types/nostrDirectory.ts is imported only by utils/nostrDirectory.ts. Meanwhile type definitions also live in src/i18n/types.ts (163), src/components/gamification/types.ts (84), src/components/tour/types.ts (98), src/data/mock/types.ts (190), src/simulators/shared/types/index.ts (336) and src/config/seo-types.ts (24). So `src/types` holds neither the most nor the most-used types.

**Impact:** There is no answer to 'where does a shared type go?', so each feature invents its own and cross-feature types get duplicated (Badge exists in both utils/gamification.ts:39 and components/gamification/types.ts:7 with incompatible fields — the latter's `unlockedAt?: Date` is the origin of the /badges bug). Feature-local hooks are fine; the two-file src/hooks/ alongside src/lib/useProgressTracking.ts is not.

**Suggested fix:** Adopt one rule and write it in the README: types and hooks live next to the feature that owns them, and src/types / src/hooks hold only genuinely cross-feature ones. Then move useProgressTracking into src/components/progress/ (its only consumer), delete types/prerequisites.ts, and reconcile the two Badge types.

### 20. [medium] ui/ barrel reaches upward out of its own directory, so there is no component-layer boundary

**Area:** architecture · **File:** `src/components/ui/index.ts`:14, 31, 34, 37, 65 · **Effort:** S

**Evidence (unverified):** src/components/ui/index.ts re-exports five modules from outside ui/: line 14 `export { ChecklistItem } from "../ChecklistItem"`, line 31 `../HoverCard`, line 34 `../ProtocolComparison`, line 37 `../KeyVisualizer`, and lines 65-71 `export { Sidebar, Breadcrumbs, TableOfContents, MobileNav, TopNav } from "../layout/Navigation"`. Meanwhile src/components/ProtocolComparison.tsx and KeyVisualizer.tsx are themselves one-line shims pointing back into ui/ — so `ui/index.ts` → `../ProtocolComparison` → `./ui/ProtocolComparison`. src/components/interactive/index.ts:16 similarly reaches sideways: `export { FollowPackFinder } from "../follow-pack"`.

**Impact:** Importing anything from `@components/ui` transitively drags in the layout Navigation tree and the follow-pack feature, defeating the point of a UI-primitives barrel and widening island bundles. It also means 'ui' does not actually describe a layer, so nobody knows whether a new primitive belongs there.

**Suggested fix:** Make ui/ export only files physically inside ui/. Move ChecklistItem, HoverCard, ProtocolComparison and KeyVisualizer into ui/ (deleting the round-trip shims) and drop the layout/Navigation and follow-pack re-exports from the barrels.

### 21. [medium] Site navigation points at three routes that do not exist and orphans two landing pages

**Area:** architecture · **File:** `src/components/layout/Footer.astro`:11 · **Effort:** S

**Evidence (unverified):** Footer.astro:11 links `{ label: 'FAQ', href: '/guides/faq' }` — dist/guides/ contains only index.html (the meta-refresh stub); the real route is /en/guides/faq. src/config/site.ts:40-44 declares a `navigation.main` array pointing at /guides/getting-started, /tools/key-generator and /faq — none of which exist as routes — and nothing imports it (grep for siteConfig shows only seo, url, name, social and analytics are read). Header.astro:14-19 and Footer.astro:31-38 each hardcode their own communityLinks array; Header lists 5 landing pages, Footer 6, and neither includes /nostr-for-bitcoiners or /nostr-for-privacy — a repo-wide grep finds zero internal links to either.

**Impact:** A footer FAQ click 404s. Two of the eight audience landing pages (342 and 343 LOC of content, the two largest) have no inbound internal links at all, so they get minimal crawl priority and no user discovery. site.ts's dead navigation block will mislead the next contributor into thinking it drives the header.

**Suggested fix:** Fix the Footer FAQ href to the localised route, delete the unused navigation.main block from site.ts, and hoist the community links into one shared array consumed by both Header and Footer with all 8 landing pages listed.

### 22. [medium] useTranslation polls the URL on a 100ms setInterval in all 38 consuming components

**Area:** architecture · **File:** `src/hooks/useTranslation.ts`:20-26 · **Effort:** S

**Evidence (unverified):** Lines 20-26 run `setInterval(() => { const currentLocale = getCurrentLocale(); if (currentLocale !== locale) setLocale(currentLocale); }, 100)` alongside a popstate listener, and the effect's dependency array is `[locale]` so the interval is torn down and rebuilt on every locale change. 38 files import this hook; a guide page mounts roughly 10 islands using it.

**Impact:** On a static site the locale is fixed at page load — it can only change via full navigation, which remounts everything. So this is ~10 timers firing 10 times a second forever, doing string comparisons for a value that cannot change. It keeps the main thread and the JS engine's timer queue busy on low-end mobile for no benefit.

**Suggested fix:** Drop the interval. Read the locale once from the URL at module scope and keep the popstate listener if client-side navigation is ever added — or better, pass the locale down from the .astro frontmatter as a prop, since the server already knows it.

### 23. [medium] 172 console.log calls ship in production JS, and one fires during static generation, corrupting the build log

**Area:** build-health · **File:** `src/simulators/keychat/KeychatSimulator.tsx`:49, 160 · **Effort:** S

**Evidence (unverified):** Line 49: `console.log('KeychatSimulator render - selectedChat:', selectedChat, 'activeTab:', activeTab);` fires on every render, including the SSG render — the build log shows it splicing into Astro's route output: `└─ /simulators/keychat/index.htmlKeychatSimulator render - selectedChat: null activeTab: chats` followed by `=== RENDERING LOGIN SCREEN ===` (line 160) on its own line, mangling the build report. Across dist/_astro/*.js there are 172 `console.log` occurrences; worst offenders: SnortSimulatorWithTour 33, damus 30, KeychatSimulatorWithTour 15, gamification 14, coracle 13, twitter-bridge 12, OfficialAccountWidget 11. Inline `<script>` blocks in dist HTML also carry them (dist/about/index.html, dist/badges/index.html, dist/glossary/index.html, all the nostr-for-* landing pages, …).

**Impact:** Console noise on every simulator interaction makes real errors — like the `Copy` ReferenceError above — hard to spot in a user's or contributor's devtools. The per-render log in KeychatSimulator also costs a string serialization on every React render. And it actively degrades the build log's usefulness by interleaving with route output.

**Suggested fix:** Remove the two unconditional logs at KeychatSimulator.tsx:49 and :160 first (they run during SSG). Then add `esbuild: { drop: ['console', 'debugger'] }` to the vite config in astro.config.mjs so production builds strip the rest, keeping them in dev.

### 24. [medium] Two dead-code modules with unresolvable references sit in the type-check path

**Area:** build-health · **File:** `src/components/interactive/damus/DamusInteractiveSimulator.tsx`:518, 541, 542 · **Effort:** S

**Evidence (unverified):** Uses `MoreHorizontal` (518), `MessageCircle` (541) and `Heart` (542) with none present in the lucide-react import block at lines 3-16 → three `ts(2304): Cannot find name` errors. Its only consumer chain is `src/components/interactive/damus/index.ts:1` → `src/components/interactive/QuickstartSimulator.tsx:290` → `src/components/QuickstartSimulator.tsx:1`, and grep across src/pages and src/content finds zero references to QuickstartSimulator, so none of it is reachable. Confirmed in dist: the file's distinctive string "Nostr enthusiast" appears in a chunk but no unbound `Heart`/`MessageCircle` survives the site-wide `jsx(<CapitalizedName>,` scan. Separately `src/simulators/shared/hooks/useSimulator.ts` is a `.ts` file containing JSX at line 434 (`<SimulatorContext.Provider>`), producing 4 parse errors including TS1161 "Unterminated regular expression literal"; it is re-exported by `src/simulators/shared/index.ts:25` and `SimulatorContext` appears in no dist chunk.

**Impact:** Neither breaks production today, but both add 17 errors to a check that already cannot be read, and DamusInteractiveSimulator is a ~700-line landmine: the moment anyone wires QuickstartSimulator into a page it will crash exactly like the YakiHonne Copy bug. The `.ts`-containing-JSX file will also confuse any editor or tool that respects file extensions.

**Suggested fix:** Delete the unreferenced DamusInteractiveSimulator/QuickstartSimulator chain, or fix its three imports if it is intended for future use. Rename useSimulator.ts to useSimulator.tsx and update the re-export at src/simulators/shared/index.ts:25.

### 25. [medium] Content collections use the deprecated auto-generated path and two collection folders are empty

**Area:** build-health · **File:** `src/content/config.ts`:1 · **Effort:** S

**Evidence (unverified):** Build log lines 6-12: "Auto-generating collections for folders in \"src/content/\" that are not defined as collections. This is deprecated, so you should define these collections yourself in \"src/content.config.ts\". The following collections have been auto-generated: faq, tools" followed by two warnings: `[WARN] [glob-loader] No files found matching "**/*{.md,.mdx},…" in directory "src/content/faq"` and the same for `src/content/tools`. Both directories exist and are empty (`ls src/content/faq` → nothing). The config lives at the legacy `src/content/config.ts` (531 B), not the Astro 5 location `src/content.config.ts`, which does not exist.

**Impact:** Astro 5 has already deprecated this; a future minor will drop the auto-generation fallback and the build will start failing or silently lose collections. The two empty phantom collections add per-build warning noise that trains everyone to ignore the warning section — which is where the `Terminal` unused-import warning and the 500 kB chunk warning also live.

**Suggested fix:** Move `src/content/config.ts` to `src/content.config.ts` and explicitly declare the `guides` collection there. Delete the empty `src/content/faq/` and `src/content/tools/` directories, or define them with real loaders if content is planned.

### 26. [medium] Sitemap lists a 479-byte meta-refresh stub as an indexable URL and emits duplicate en-US hreflang

**Area:** build-health · **File:** `dist/guides/index.html`:1 · **Effort:** S

**Evidence (unverified):** The `[...lang]` rest parameter in `src/pages/[...lang]/guides/index.astro` emits an eighth output for the undefined-lang case: dist/guides/index.html, 479 B, the only page in dist under 2 KB and the only one with no `<meta name="description">`. Its entire body is `<meta http-equiv="refresh" content="0; url=/en/guides/">` plus a *relative* `<link rel="canonical" href="/en/guides/">` and a localStorage-reading redirect script. @astrojs/sitemap lists it as a first-class URL and, worse, the /guides/ cluster declares `hreflang="en-US"` twice pointing at two different URLs (`https://nostrich.love/en/guides/` and `https://nostrich.love/guides/`). I parsed all 152 sitemap url blocks: 8 contain a duplicated hreflang code. The sitemap also emits 0 `x-default` entries despite the in-page tags using one.

**Impact:** Google is told two different URLs are the canonical en-US version of the same page, which is precisely the ambiguity hreflang exists to resolve — it will pick one arbitrarily or drop the cluster. Meta-refresh redirects are also treated as soft redirects and are slower than a real 301. And a sitemap-listed URL with no description and 479 bytes of content is a thin-content signal.

**Suggested fix:** Replace the stub with a real redirect: add a `vercel.json` with a 308 from `/guides` to `/en/guides`, and exclude the stub from the sitemap via the integration's `filter` option. If the localStorage language preference must be honoured, do it with a client-side redirect on the destination page rather than by publishing an indexable interstitial.

### 27. [medium] 16 npm advisories (10 high) including 9 unpatched Astro CVEs in the pinned toolchain

**Area:** build-health · **File:** `package.json`:14-40 · **Effort:** M

**Evidence (unverified):** `npm audit` → `{"info":0,"low":3,"moderate":3,"high":10,"critical":0,"total":16}`. High-severity packages: astro (<=7.0.9, nine advisories: XSS in define:vars, reflected XSS via unescaped slot name, XSS via unescaped attribute names in spread props, XSS via transition:* directive values on hydrated islands, remote allowlist bypass, host-header SSRF, …), vite (<=6.4.2, path traversal in optimized deps .map handling, arbitrary file read via dev-server WebSocket), rollup (arbitrary file write via path traversal), postcss (XSS via unescaped </style>, arbitrary file read via sourceMappingURL), sharp (libvips CVE-2026-33327/33328/35590/35591), plus defu prototype pollution, js-yaml quadratic DoS, picomatch ReDoS, svgo billion-laughs. `npm audit fix` is reported as available for most.

**Impact:** Reduced by the fact that this is a `output: "static"` site with no server runtime, so the SSR/dev-server vectors (vite dev WebSocket read, h3 path traversal, host-header SSRF) are not reachable in production. But the Astro template-escaping XSS advisories affect the *rendering* code that generates the HTML, and vite/rollup/postcss path-traversal bugs are build-time risks that matter on Vercel's shared build infrastructure.

**Suggested fix:** Run `npm audit fix` and re-run the build to confirm 153 pages still emit; the current lockfile churn (`package-lock.json` is already modified in git status) suggests this is mid-flight. Then pin a Node version — package.json has no `engines` field, so Vercel picks its own default while local is v24.1.0.

### 28. [medium] og:image is a 1.18 MB PNG and a second og-image.png is a 194-byte text placeholder

**Area:** build-health · **File:** `public/preview_image.png`:- · **Effort:** S

**Evidence (unverified):** All 152 emitted pages carry `<meta property="og:image" content="https://nostrich.love/preview_image.png">`. That file is 1,184,543 B — the single largest asset in the build, 2.1 MB of the 20 MB dist by block size and 6.8% of total bytes. Separately, `public/og-image.png` is 194 B and `file` identifies it as "exported SGML document text, ASCII text"; its first bytes are `<!-- This is a placeholder OG image (1200x630) -`. It is not a PNG at all.

**Impact:** Twitter/X caps OG images around 5 MB but degrades well before that, and Facebook's scraper times out on slow fetches — a 1.18 MB card image means link previews on Nostr clients, X and Telegram render slowly or fall back to no image, which directly costs click-through on a site whose growth channel is social sharing. The fake og-image.png is a trap for the next person who wires it up.

**Suggested fix:** Re-encode preview_image.png to 1200x630 WebP or optimized PNG (should land under 150 KB) and delete the 194-byte public/og-image.png. `siteConfig.seo.defaultImage` in src/config/site.ts is the single place to point at the new asset.

### 29. [medium] Guides contradict each other on relay counts, NIP-05 pricing, relay software language, feed ordering, and DM metadata

**Area:** content-quality · **File:** `src/content/guides/en/outbox-model.mdx`:152 · **Effort:** M

**Evidence (unverified):** Relay count: outbox-model.mdx:152 "Recommended: 2-4 relays total"; relays-demystified.mdx:193 "Connect to 4-8 relays"; relay-guide.mdx:245 "Beginner 3-5, Maximum 10"; faq.mdx:279-280 "Minimum 3-5, Sweet spot 5-10." NIP-05 price: nip05-identity.mdx:157-161 (12,500-65,000 sats/yr) vs faq.mdx:138 "$5-15/year" vs nostr-tools.mdx:85 "Paid only... No free tier" vs its own L315 table "Free/Paid." strfry: faq.mdx:716 and :720 say Rust; relay-guide.mdx:415 correctly says C++. Feed: what-is-nostr.mdx:150 "Most clients show chronological feeds" and glossary.astro:63-64 "A chronological stream" vs faq.mdx:869-880 "Nostr has no chronological 'feed'." DMs: nip17:29 "relay operators cannot see who is talking to whom" vs finding-community.mdx:411-414 "metadata visible (who talks to whom)."

**Impact:** A reader working through the guide sequence in order gets four different answers to "how many relays." Undermines authority on exactly the operational questions the site exists to answer.

**Suggested fix:** Pick one canonical answer per question, put it in a shared snippet or the i18n JSON, and reference it. Reconcile the strfry language and the feed-ordering claim.

### 30. [medium] Fabricated testimonials and case studies presented as real user accounts

**Area:** content-quality · **File:** `src/content/guides/en/keys-and-security.mdx`:252-266, 300-316 · **Effort:** S

**Evidence (unverified):** L252 "### Horror Stories (Optional Reading) — These are real. Learn from them:" followed by quotes attributed to "@nostruser123", "Anonymous", and "@learnedthehardway" (L258, 262, 266). L300-316 presents three "Case Studies" with specific unsourced figures: "A content creator received $50,000 worth of Bitcoin tips (zaps) over 6 months", "A Nostr personality with 10,000 followers dropped their phone in a pool."

**Impact:** Invented evidence asserted as fact on the page users are most likely to trust with an irreversible decision. If noticed, it discredits the security guide specifically; it is also a strong E-E-A-T negative and the kind of signal the helpful-content system targets.

**Suggested fix:** Either source these to real, linkable Nostr posts, or relabel them as illustrative scenarios and drop the "These are real" framing and the fabricated handles and dollar figures.

### 31. [medium] Unearned freshness dates on demonstrably stale content, and stale Bluesky/Mastodon facts in the comparison guide

**Area:** content-quality · **File:** `src/content/guides/en/protocol-comparison.mdx`:529, 469-470, 24 · **Effort:** S

**Evidence (unverified):** L529 "_Last updated: February 2026 | Protocol versions: Nostr (NIPs current)_" sits above a Bluesky roadmap that lists as *future* work two things shipped in Feb 2024: "**Self-Hosting:** Personal Data Store (PDS) self-hosting launch" and "**Federation:** Opening relay network to third parties" (L469-470). L24 gives "Current Scale: Nostr ~5M / ActivityPub ~15M / Bluesky ~25M users" with no date or source, conflating cumulative Nostr pubkeys with users (active Nostr users are orders of magnitude lower). faq.mdx:933 also asserts "_Last updated: February 2026_" over content recommending relay.current.fyi and Plebstr. nip17-private-messages.mdx:4-5 and :326 self-date to Feb 2025.

**Impact:** A false freshness stamp is worse than none: it tells readers and crawlers that visibly obsolete claims were reviewed this year. The user-count table is the page's most-quoted asset and is unsourced and misleading.

**Suggested fix:** Drive the date from git mtime rather than hardcoding it, move the Bluesky items to "shipped," and either source the scale table with dated citations plus a monthly-active caveat or remove it.

### 32. [medium] Repeated bad diagnostic advice: opening wss:// URLs in a browser, and "you can't re-broadcast old posts"

**Area:** content-quality · **File:** `src/content/guides/en/troubleshooting.mdx`:284, 76 · **Effort:** S

**Evidence (unverified):** troubleshooting.mdx:284 "**Test**: Open relay URL in browser (should show error or ws page)"; repeated at relays-demystified.mdx:217. A browser cannot open a wss:// URL at all. The correct check is an HTTPS GET with `Accept: application/nostr+json` (NIP-11) or nostr.watch — NIP-11 is never mentioned anywhere on the site. troubleshooting.mdx:76: "**Note**: Once posted, can't re-broadcast to new relays retroactively" — false; events are self-contained signed objects and can be rebroadcast at any time (nak, most clients' broadcast feature, relay-syncing tools). troubleshooting.mdx:118 also asserts "Most relays limit to 1-5 posts per second," an invented figure far looser than real strfry defaults.

**Impact:** The rebroadcast claim actively discourages the correct fix for the guide's own "I can't see my old posts" problem. The browser test wastes time and produces a confusing result that tells the user nothing.

**Suggested fix:** Replace with a NIP-11 curl one-liner and a nostr.watch link; add a short "how to rebroadcast old events to a new relay" section and delete the false note and the invented rate limit.

### 33. [medium] Glossary is incomplete for a page that markets itself as complete, with two malformed duplicate entries and no deep links

**Area:** content-quality · **File:** `src/pages/glossary.astro`:55-61, 9-114 · **Effort:** M

**Evidence (unverified):** 26 entries, of which `_nsec` (L55) and `_npub` (L59) are duplicates of `nsec` (L19) and `npub` (L15) and render literally with the leading underscore as the term heading. The meta description (L7) says "Complete glossary of Nostr terms." Missing: sats/satoshi (used constantly across every guide, defined nowhere), signer, NIP-07, NIP-46/bunker, nprofile, nevent, naddr, note1, bech32, gift wrap, seal, outbox/gossip model, web of trust, NWC, zap request/zap receipt, replaceable/addressable event, Blossom, follow pack, AUTH, njump. No term links to the guide that explains it, and there are no per-term anchors, so /glossary#npub is not addressable.

**Impact:** Definition pages are the classic long-tail entry point ("what is an npub", "what are sats"). Without anchors or outbound links, arrivals bounce, and the two underscore entries look broken.

**Suggested fix:** Delete the two underscore duplicates, add the ~20 missing terms (sats first), give each an `id` anchor, and link each definition to the guide section that explains it.

### 34. [medium] Missing topics with real newcomer search demand: communities/groups, long-form publishing, media hosting, NWC, and basic "is Nostr safe/free" questions

**Area:** content-quality · **File:** `src/content/guides/en/faq.mdx`:- · **Effort:** L

**Evidence (unverified):** Zero hits across all 16 EN guides for: NIP-29 / relay-based groups, NIP-72 communities, Flotilla, Chachi, 0xchat, MLS/NIP-EE, NIP-23 (long-form is named at faq/multi-client/finding-community but the spec and how to publish are never explained), Blossom (one passing mention at troubleshooting.mdx:356 with no explanation), NIP-96, NIP-49/ncryptsec, NIP-42 AUTH, NIP-13 PoW, Zapstore, Olas, Highlighter. NWC/NIP-47 is never named despite being how wallets connect. finding-community.mdx is titled for community discovery yet contains nothing about actual Nostr communities/groups. The FAQ's 25 questions omit "Is Nostr free?", "Is Nostr safe/legal?", "Do I need Bitcoin to use Nostr?", "How do I change my display name?", "How do I delete my account?", "What's the difference between npub, nprofile, note and nevent?", "How many people actually use Nostr?"

**Impact:** The site is missing both the highest-volume beginner queries and the 2025-26 ecosystem developments competitors now cover. finding-community.mdx in particular can't deliver on its own title.

**Suggested fix:** Add 6-8 FAQ entries for the basic questions (cheap, high yield), a groups/communities section to finding-community.mdx, a short long-form-publishing guide (NIP-23 + Habla/Highlighter/YakiHonne), and NWC to the zaps guide.

### 35. [medium] Recommended client roster is dominated by two effectively unmaintained web clients

**Area:** content-quality · **File:** `src/content/guides/en/multi-client.mdx`:28, 156, 161, 174, 227-232, 427-428 · **Effort:** M

**Evidence (unverified):** Iris appears 13 times across 11 files and Snort 16 times across 9. faq.mdx:155 lists Iris first under "For Beginners" and L178 says "**Pro tip:** Start with Iris or Primal." multi-client.mdx builds three of its four recommended desktop+mobile pairings on Iris or Snort (L156, L161, L427-428) and devotes description blocks to both (L227-246). Neither has seen meaningful development in the current cycle, and iris.to now serves an empty <title> shell. Meanwhile the repo ships simulators for olas, yakihonne, keychat, gossip, and nostr-kitten (src/simulators/) that the guides never mention. troubleshooting.mdx:222-223 also offers Nos (discontinued) and Nostros (abandoned since 2023) as alternatives.

**Impact:** Beginners are steered to abandoned software as the recommended starting point, which is the worst possible first impression, and the site's own simulator work goes unlinked from the prose.

**Suggested fix:** Rebuild the client roster around what is actively maintained (Damus, Amethyst, Primal, Coracle, noStrudel, YakiHonne, Olas, 0xchat, Nostur), demote or drop Iris/Snort/Nos/Nostros, and cross-link the existing simulators from the client sections.

### 36. [medium] Key-rotation advice is wrong about NIP-05 migrating followers, and self-contradicts on rotation frequency

**Area:** content-quality · **File:** `src/content/guides/en/privacy-security.mdx`:272-275, 391 · **Effort:** S

**Evidence (unverified):** L272-275: "**Pro tip:** If you have a NIP-05, you can update it to point to your new npub. People using your NIP-05 will automatically follow your new account." Follows live in kind:3 contact lists as raw pubkeys; no client re-resolves NIP-05 to swap a follow, so nothing migrates. faq.mdx:75 repeats it ("**NIP-05:** ... you can redirect it to your new npub"). Separately, L391 lists "Regular key rotation (yearly)" under Enhanced Security while L237-240 of the same file warns rotation makes you "Lose all history, Confuse followers, Break NIP-05 connections."

**Impact:** A compromised user follows this, believes their audience transferred, and abandons the old account — losing the followers instead. The yearly-rotation checkbox is bad advice for Nostr specifically and contradicts the page's own warning three sections earlier.

**Suggested fix:** Correct the NIP-05 claim (it re-points the *identifier*, not anyone's follows) in both files, drop "regular yearly rotation," and mention NIP-41 key migration as the in-progress protocol answer.

### 37. [medium] Badge requirements shown to users contradict the code in three of nine cases

**Area:** gamification-state · **File:** `src/pages/badges.astro`:47-53, 74-81 · **Effort:** S

**Evidence (unverified):** badges.astro declares `knowledge-seeker` as "Completed 5 learning guides" / "Complete 5 guides" and `relay-explorer` as "Connected to 5+ different relays" / "Connect to 5 relays". The engine thresholds are 3 and 3: src/utils/gamification.ts:862 `completedGuides.length >= 3` and :871 `relaysConnected >= 3`; src/config/gamification.ts:149 `threshold: 3` and :213 `threshold: 3`. badges.astro also omits `privacy-expert` entirely — 8 badges listed vs 9 in BADGE_DEFINITIONS — and hardcodes "0 of 8 badges earned" at line 121.

**Impact:** Users are told to complete 5 guides for a badge that fires at 3, and to connect to 5 relays for one that fires at 3, so the badge appears "early" relative to its own stated rule — and once the `unlockedAt` bug above is fixed the page will still be wrong. The 9th badge is undiscoverable.

**Suggested fix:** Delete the inline arrays at badges.astro:9-82 and :290-299 and render from `getAllBadges()`.

### 38. [medium] "Nostr Graduate" requires 9 guide completions but the beginner level only contains 7 guides

**Area:** gamification-state · **File:** `src/utils/gamification.ts`:223, 865 · **Effort:** S

**Evidence (unverified):** `const TOTAL_BEGINNER_GUIDES = 9; // Based on the sequence in guides/index.astro` and `case 'nostr-graduate': return data.progress.completedGuides.length >= TOTAL_BEGINNER_GUIDES;`. `SKILL_LEVELS.beginner.sequence` (src/data/learning-paths.ts:28-36) has 7 entries. The badge description is "Completed all beginner guides" / "Complete every beginner guide" (lines 192-194).

**Impact:** Finishing all 7 beginner guides does not award the epic 'Nostr Graduate' badge — the user must also complete 2 intermediate guides, contradicting the badge text. The constant is stale relative to the current 16-guide catalogue and is duplicated as a literal `9` in src/config/gamification.ts:153 and src/utils/gamificationEngine.ts:326.

**Suggested fix:** Replace the constant with `SKILL_LEVELS.beginner.sequence.length` and check `completedByLevel.beginner.length` rather than the flat `completedGuides` array.

### 39. [medium] The `stats` object in storage is written by nothing — six recorder functions are dead

**Area:** gamification-state · **File:** `src/utils/gamification.ts`:731-794 · **Effort:** M

**Evidence (unverified):** External-reference counts (grep across src/ excluding the two gamification modules): recordKeysGenerated 0, recordFirstPost 0, recordZapReceived 0, updateFollowedAccounts 0, recordKeysBackedUp 0, updateConnectedRelays 0. Only `recordPrivacyQuizPerfectScore` (line 790, added in the uncommitted diff) is called. The live path is `recordActivity()` in gamificationEngine.ts:155, which awards badges via its private `awardBadge(data, badgeId)` (line 237) and never touches `data.stats`.

**Impact:** `stats.keysGenerated`, `relaysConnected`, `accountsFollowed` etc. stay at their defaults forever even for a fully-badged user. `getNextBadgeToEarn()` (line 1040) reads `data.stats.accountsFollowed` and `data.stats.relaysConnected` to rank progress, so it would report 0/10 and 0/3 for a user who already earned both badges. `checkAndAwardBadges()` can never re-derive an award from stats, so the two award paths can permanently disagree.

**Suggested fix:** Have gamificationEngine's `checkAndAwardBadgesForActivity` write the corresponding stat before awarding, or drop the private award path entirely and route all activities through the gamification.ts recorders + `checkAndAwardBadges()`.

### 40. [medium] /progress computes percentages against 15 guides when 16 exist, and renders one guide with a raw slug

**Area:** gamification-state · **File:** `src/pages/progress.astro`:7, 358-374, 420, 450 · **Effort:** S

**Evidence (unverified):** `const totalGuides = 15;` in frontmatter (line 7) and again inside the client script (line 420); `percentage = Math.round((completedGuides.length / totalGuides) * 100)` at line 450. `SKILL_LEVELS` totals 7 + 6 + 3 = 16, and `ls src/content/guides/en/` returns 16 .mdx files. The `guideMetadata` map at lines 358-374 has 15 entries — `outbox-model` is missing — so the Beginner list renders `${meta.title}` as the literal string "outbox-model" with an empty description (fallback at line 541). The static HTML also hardcodes "0/6 guides" for Beginner (line 123) which has 7.

**Impact:** A user who completes all 16 guides sees "107%" on the Overall Progress card. The Beginner section lists an item labelled "outbox-model" with no description next to six properly-titled guides. `outbox-model` is likewise absent from `GUIDE_ORDER` in src/pages/[...lang]/guides/[slug].astro:55-71 (15 entries), so prev/next navigation skips over it entirely.

**Suggested fix:** Derive `totalGuides` from `getAllGuidesOrdered().length` and the titles from the content collection / i18n `guides.*.title` instead of a hand-maintained map. Add `outbox-model` to GUIDE_ORDER or derive that from SKILL_LEVELS too.

### 41. [medium] useProgressTracking rewrites the whole storage blob every 10 seconds and every scroll frame, for data it can never persist

**Area:** gamification-state · **File:** `src/lib/useProgressTracking.ts`:62-84, 87-121 · **Effort:** M

**Evidence (unverified):** A 1-second `setInterval` calls `updateGuideProgress(guideId, { timeSpentSeconds, status })` whenever `elapsed % 10 === 0`, and the scroll handler calls it again from a requestAnimationFrame on every new max scroll depth. Each `updateGuideProgress` runs `getProgressData()` (getItem + JSON.parse of the full blob) then `saveProgressData()` (another getItem + JSON.parse + JSON.stringify + setItem). But `getProgressData` (src/lib/progressService.ts:95-107) reconstructs `guides` *only* from `parsed.progress.completedGuides`, hardcoding `timeSpentSeconds: 0` and `maxScrollDepth: 100` — and `saveProgressData` (line 157) writes back only the guide ids whose status is `'completed'`.

**Impact:** `timeSpentSeconds` and `maxScrollDepth` are thrown away on every round trip, so `calculateCompletionStatus`'s time criterion (line 249) always evaluates against 0 and its whole 2-of-3 completion rule is dead — this code path can never mark a guide complete. Meanwhile MinimalProgressBar is mounted `client:load` on every guide page (src/pages/[...lang]/guides/[slug].astro:208), so every reader pays 4 full JSON parse/stringify cycles of the gamification blob every 10 seconds of reading, plus one per scroll frame, for zero effect.

**Suggested fix:** Either persist a real per-guide progress record (a separate key, or add a `guideDetail` sub-object to the gamification schema) or delete `useProgressTracking`'s write path and keep only the in-memory `scrollProgress` the progress bar actually renders.

### 42. [medium] progressService writes to localStorage with no try/catch, and the throw surfaces during React render

**Area:** gamification-state · **File:** `src/lib/progressService.ts`:18, 75, 173 · **Effort:** S

**Evidence (unverified):** `getDeviceId()` line 17-18 does a bare `localStorage.setItem(DEVICE_ID_KEY, deviceId)`; `updatePrivacySettings` line 75 and `saveProgressData` line 173 do the same with no error handling. `getProgressData()` calls `getDeviceId()` on line 110 and 122. `useProgressTracking` calls `getGuideProgress(guideId)` inside a `useState` initializer at line 27 — i.e. during render, not in an effect.

**Impact:** Failure inputs: Safari private browsing on older iOS, or a user whose origin has hit the ~5 MB quota (a plausible outcome given the write amplification above). `setItem` throws `QuotaExceededError`, the exception propagates out of the `useState` initializer, and the whole MinimalProgressBar island fails to hydrate — taking the reading-progress bar with it and logging an uncaught error. The equivalent code in src/utils/gamification.ts:464-495 is at least wrapped.

**Suggested fix:** Wrap every `localStorage.setItem` in progressService.ts in try/catch, and move the `getGuideProgress` call in useProgressTracking out of the useState initializer into a mount effect.

### 43. [medium] A `version` field is written but never read — there is no version-gated migration path

**Area:** gamification-state · **File:** `src/utils/gamification.ts`:144, 283, 395-455 · **Effort:** M

**Evidence (unverified):** `const CURRENT_VERSION = 1` and `version: CURRENT_VERSION` in `getDefaultData()`. `loadGamificationData()` never references `parsed.version`; all migration is ad-hoc field-presence sniffing (`if (!parsed.progress?.currentLevel)`, `if (parsed.progress?.manualUnlock === undefined)`, plus the legacy-path branch at line 416). `saveGamificationData`'s merge (`{ ...existing, ...data }`, line 475) preserves whatever `version` was already stored, so a stale version number survives indefinitely. gamificationEngine.ts:19 declares its own independent `CURRENT_VERSION = 1`.

**Impact:** When the schema next changes (as it already has once, from `activePath`/`pathProgress` to `completedByLevel`), there is no hook to run a migration — a v1 payload and a hypothetical v2 payload are indistinguishable to the loader. The existing legacy migration at line 313 also only fires while `activePath`/`pathProgress` keys survive; it is not idempotent-by-version and depends on `delete` succeeding at lines 376-377.

**Suggested fix:** Read `parsed.version` and dispatch through an ordered migration table, writing `CURRENT_VERSION` at the end. Delete the duplicate constant in gamificationEngine.ts.

### 44. [medium] A guide auto-marks itself complete on load whenever its rendered height is under ~1.25 viewports

**Area:** gamification-state · **File:** `src/components/progress/ProgressTracker.tsx`:31, 60 · **Effort:** S

**Evidence (unverified):** `const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;` with `COMPLETION_THRESHOLD = 0.8`, and `checkCompletion()` is invoked unconditionally on mount at line 60 with the comment "Check on mount in case already scrolled". At scrollY = 0 this reduces to `innerHeight / scrollHeight >= 0.8`, i.e. it fires whenever `scrollHeight <= 1.25 * innerHeight`.

**Impact:** On a tall desktop viewport, or during the hydration frame before below-the-fold `client:load` islands and unsized MDX images have laid out, the document is short enough for this to be true — and `markGuideComplete()` fires with zero reading. Because `completeGuideInLevel` also runs `checkAndUnlockNextLevel`, a handful of such false completions can unlock Intermediate for a user who has read nothing. `hasCompleted` is a local closure variable, so it resets on every mount.

**Suggested fix:** Skip the mount-time check when `window.scrollY === 0`, require a minimum absolute scroll distance (e.g. `scrollY > 400`), and/or defer the first check behind a `requestAnimationFrame` + `load` event so layout has settled.

### 45. [medium] PrivacySecurityQuiz calls useMemo and useEffect after a conditional early return

**Area:** gamification-state · **File:** `src/components/interactive/PrivacySecurityQuiz.tsx`:78-90, 96, 106 · **Effort:** S

**Evidence (unverified):** Five `useState` calls (lines 71-75), then `if (!questions || questions.length === 0) { return <loading/> }` at line 78, then `useMemo` at line 96 and `useEffect` at line 106. `questions` derives from `getValue("guides.privacySecurity.quiz.questions")` which depends on `locale`, and `useTranslation` (src/hooks/useTranslation.ts:10, 20-25) calls `setLocale` on mount and re-polls every 100 ms — so the same mounted component can flip between the two branches.

**Impact:** Any render where `questions` transitions from empty to populated (or back) changes the hook count from 5 to 7, producing React's "Rendered more hooks than during the previous render" invariant error and unmounting the quiz island. Today this is latent because every locale resolves to a non-empty array via the English fallback, but the 100 ms locale poll plus a future locale whose array is `[]` makes it reachable.

**Suggested fix:** Move the `useMemo`/`useEffect` above the early return, or extract the loading branch into a parent component.

### 46. [medium] "Delete All Progress Data" leaves the resume state behind, so the site still greets the user with their last guide

**Area:** gamification-state · **File:** `src/lib/progressService.ts`:292-297 · **Effort:** S

**Evidence (unverified):** `deleteAllProgress()` removes only `nostrich-gamification-v1` and `nostrich-device-id`, with the comment "Keep privacy settings so user preferences are remembered". It does not touch `nostrich-last-viewed` (written by src/lib/progress.ts:226) or `nostrich-streak-banner-dismissed` (src/components/gamification/StreakBannerWrapper.tsx:11) or `nostr-relay-selections` (src/components/interactive/RelayExplorer.tsx:386).

**Impact:** After clicking "Yes, Delete Everything" on /settings, the homepage `ResumeBanner` (src/pages/index.astro:79) still renders "Welcome back! You were reading: <guide title>" because `hasRecentProgress()` reads `nostrich-last-viewed`, and the relay explorer still shows the user's previous relay picks. For a page whose copy promises "complete control over your information", leaving reading history behind after an explicit delete is a real trust problem.

**Suggested fix:** Enumerate and remove every `nostrich-*` / `nostr-*` progress key in `deleteAllProgress()`, keeping only `nostrich-privacy-settings` as documented.

### 47. [medium] GuideSection reads localStorage during render, and that read can write to localStorage as a side effect

**Area:** gamification-state · **File:** `src/components/guides/GuideSection.tsx`:150-152 · **Effort:** S

**Evidence (unverified):** `const previousLevelCompleted = prevLevel ? getCompletedGuidesInLevel(prevLevel).length : completedCount;` sits in the component body, above the `if (!isClient)` early return on line 159. It resolves to `loadGamificationData()` (src/utils/gamification.ts:395), which does a getItem + full JSON.parse — and, on the legacy-migration branch (line 423), calls `saveGamificationData(migrated)`, i.e. a localStorage *write* executed during React's render phase.

**Impact:** Three GuideSection instances mount on /guides, so every re-render (including the ones the 100 ms `useTranslation` poll can trigger) re-parses the whole gamification blob up to three times. A returning user with legacy `activePath`/`pathProgress` data triggers a render-phase write, which is exactly the kind of side effect React StrictMode/concurrent rendering can double-invoke or discard.

**Suggested fix:** Move the `previousLevelCompleted`/`previousLevelTotal` computation into the existing mount effect (line 95) and hold it in state.

### 48. [medium] /progress, /badges and /settings are English-only pages linked from every locale's header

**Area:** gamification-state · **File:** `src/components/layout/Header.astro`:99, 111, 124, 208, 218, 228 · **Effort:** L

**Evidence (unverified):** All six links are absolute and unprefixed (`href="/progress"`, `href="/badges"`, `href="/settings"`). Only `src/pages/[...lang]/guides/**` is locale-aware; `src/pages/progress.astro`, `badges.astro` and `settings.astro` sit at the root with hardcoded English copy ("Your Progress", "Skill Progression", "Guides Completed", "No activity yet…") and no `getTranslations` call.

**Impact:** A Polish, Arabic or Hindi reader clicking the header's progress or badges link is dropped onto an untranslated English page and loses the locale prefix for the rest of their session. On /progress the guide links are then rebuilt from `localStorage['preferredLanguage']` (line 533) rather than the URL, so the locale can silently diverge from where the user actually was.

**Suggested fix:** Move these three pages under `src/pages/[...lang]/` with `getStaticPaths` over `locales`, translate their strings, and build the header links with `localePath()` from src/i18n/paths.ts.

### 49. [medium] Arabic is missing 1,123 of 2,047 keys and Polish 390 — entire interactive components fall back to English

**Area:** i18n-parity · **File:** `src/i18n/locales/ar.json`:- · **Effort:** L

**Evidence (unverified):** Deep key diff against en.json (2,047 leaf keys): hi missing 1,787, ar 1,123, pl 390, es 252, de 18, zh 0. Largest ar gaps by section: `troubleshootingWizard.solutions` 169, `clientComparisonTable.clients` 94, `guides.faq` 48, `guides.troubleshooting` 48, `guides.privacySecurity` 48, `relayPlayground.*` ~60, `relayExplorer.*` ~40, `backupChecklist.*` ~30, `emptyFeedFixer.*` ~35. Polish is missing the entire `clientComparisonTable` section (117 keys) plus `guides.quickstart` 73, `guides.faq` 73, `guides.nostrTools` 61. `getValue()` falls back to English per key, so these render but in the wrong language. src/components/interactive/ClientComparisonTable.tsx:100-220 pulls ~120 keys, all of which resolve to English for pl and ar.

**Impact:** Polish and Arabic readers get the full client comparison table, troubleshooting wizard, relay playground and backup checklist in English embedded inside otherwise translated guides. Each miss also fires a `console.warn` (src/i18n/index.ts:60), so the Arabic build/runtime console is flooded.

**Suggested fix:** Prioritise the top sections by user reach: `clientComparisonTable` for pl, then `troubleshootingWizard.solutions` and `clientComparisonTable` for ar. Add a parity script to package.json that fails on any locale missing more than N keys.

### 50. [medium] Quiz question parity is broken across locales — Hindi has 7 empty quizzes, Arabic every quiz truncated to 2-3 of 5-6 questions

**Area:** i18n-parity · **File:** `src/i18n/locales/ar.json`:- · **Effort:** M

**Evidence (unverified):** Question counts per guide (en/pl/es/de/zh/ar/hi), resolving Hindi via both key forms: whatIsNostr 6/6/6/6/6/6/4; keysAndSecurity 6/6/6/6/6/6/2; quickstart 6/{}/{}/6/6/5/3; faq 6/{}/{}/6/6/2/{}; findingCommunity 6/5/5/6/6/3/1; relaysDemystified 6/5/5/6/6/3/{}; nostrTools 5/{}/{}/5/5/2/{}; troubleshooting 6/6/6/6/6/2/{}; zapsAndLightning 5/5/5/5/5/3/{}; relayGuide 5/5/5/5/5/2/{}; protocolComparison 5/5/5/5/5/2/{}. `{}` = empty quiz object. Arabic averages 2.6 questions where English has 5.4.

**Impact:** The quizzes are the completion gate for the gamification/badge system. Arabic users answer half as many questions for the same badge; Polish and Spanish users hit the English quiz on quickstart/faq/nostr-tools because the empty `{}` triggers the English fallback mid-quiz, switching language inside a single guide page.

**Suggested fix:** Fill `guides.quickstart.quiz`, `guides.faq.quiz` and `guides.nostrTools.quiz` for pl/es (currently `{}`), and bring the Arabic and Hindi question arrays to full length.

### 51. [medium] Header and Footer hardcode 48 English nav labels and render on every localized page

**Area:** i18n-parity · **File:** `src/components/layout/Header.astro`:7-25 · **Effort:** M

**Evidence (unverified):** `const navItems = [{ label: 'Tools', ... }, { label: 'Glossary' }, { label: 'Resources' }, { label: 'About' }]`, plus `communityItems` and `toolItems` (lines 14-25) and inline strings `Guides`, `Progress`, `Settings`, `View Progress`, `Your Progress`, `Communities` — 20 distinct literals, none routed through i18n. src/components/layout/Footer.astro:8-45 adds 28 more (`Getting Started`, `Interactive Tools`, `Nostr Resources`, `Client Simulators`, `Relay Playground`, `Follow Pack Finder`, `Privacy Policy`, section headings `Learn`/`Tools`/`Community`/`About`, and `Keys generated in your browser. Nothing is stored on our servers.`). Both are imported unconditionally by src/pages/[lang]/guides/[slug].astro:3-4. Layout.astro:153 hardcodes `Skip to content`; [slug].astro:104 appends the English suffix `- Nostr Beginner Guide` to every localized page title and :267 renders `Last updated {guide.data.updated}`.

**Impact:** Every one of the 119 localized pages is framed by English chrome. On Arabic pages the English header sits inside a dir="rtl" document. The page <title> of every non-English guide carries an English suffix, which also weakens the localized title in SERPs.

**Suggested fix:** Move nav/footer labels into a `nav`/`footer` section of the locale JSON and pass `locale` into Header/Footer from the page, and localize the title template plus the `Last updated` and `Skip to content` strings.

### 52. [medium] 639 hardcoded English UI literals across 83 component/page files bypass the i18n layer entirely

**Area:** i18n-parity · **File:** `src/pages/index.astro`:- · **Effort:** L

**Evidence (unverified):** Scan for JSX/Astro text nodes matching a capitalized multi-word literal: 639 distinct strings in 83 files. Worst offenders: follow-pack.astro 38, relay-feed-browser.astro 32, privacy.astro 29, index.astro 29, progress.astro 25, nostr-for-privacy.astro 25, nostr-for-bitcoiners.astro 25, about.astro 22, PrivacyControls.tsx 20, ExportModal.tsx 19. Components that DO render on localized guide pages are among them: GamificationExplainer.tsx (12, e.g. `Collect all 8 badges to become a Nostr Expert!`), BadgeEarnedModal.tsx (7, `Badge Earned!`, `Claim on Nostr`, `Maybe Later`), PrerequisiteModal.tsx (5, `Continue anyway`, `We recommend:`), UnlockButton.tsx (6). Only 39 of 176 files under src/components + src/pages + src/layouts touch the i18n layer at all.

**Impact:** Even the localized guide flow leaks English at its most emotionally significant moments — the badge-earned modal, the prerequisite warning modal and the gamification explainer are all English for all 7 locales.

**Suggested fix:** Localize the ~30 literals in the five components that render inside /[lang]/guides/* first (GamificationExplainer, BadgeEarnedModal, PrerequisiteModal, UnlockButton, Header/Footer); treat the standalone-page literals as part of the larger 'localize the rest of the site' decision.

### 53. [medium] No type safety and no CI parity check — `declare module '*.json' { any }` disables every guardrail

**Area:** i18n-parity · **File:** `src/i18n/json.d.ts`:1-4 · **Effort:** M

**Evidence (unverified):** `declare module '*.json' { const value: any; export default value; }` types all seven locale bundles as `any`, so `const translations: Record<Locale, Translations>` (src/i18n/index.ts:15) type-checks vacuously despite src/i18n/types.ts declaring only a small subset of the 30 top-level sections that actually exist in en.json. `t(key: string)` and `getValue(key: string)` take free-form strings, so no call site is checked. package.json scripts are `dev/build/preview/astro/fetch-accounts/verify-seo` — no i18n validation. There is no .github/workflows directory and no script in scripts/ referencing locales/en.json.

**Impact:** This is the root cause of the Hindi kebab-case bug, the 92 keys missing from en.json, and the 1,787/1,123/390 key gaps — every one of them would have been a compile error or a red CI run under a typed key union.

**Suggested fix:** Generate a `TranslationKey` union from en.json (or use `satisfies typeof en` on each locale import), narrow `t()`/`getValue()` to that union, and add an `npm run verify-i18n` script that diffs key sets and fails the build.

### 54. [medium] GuidesLink has no Hindi branch — Hindi readers clicking "Guides" are sent to /en/guides

**Area:** i18n-parity · **File:** `src/components/navigation/GuidesLink.tsx`:15-45 · **Effort:** S

**Evidence (unverified):** The if/else chain checks `/de/`, `/pl/`, `/es/`, `/zh/`, `/ar/`, `/en/` and then the localStorage fallbacks `'de' 'pl' 'es' 'zh' 'ar'` — `hi` appears nowhere in the file (grep for `'hi'`/`"hi"` returns 0 matches, versus 3 in LanguageSwitcher.tsx and 2 in src/i18n/index.ts). Both the URL branch and the localStorage branch fall through to `setGuidesHref("/en/guides")`. The component is the main nav's Guides link (src/components/layout/Header.astro:41 and :168).

**Impact:** A Hindi reader on /hi/guides/faq who clicks Guides in the header is dropped into the English guide index, losing their locale on the single most-used navigation link.

**Suggested fix:** Add the `hi` branch, or better, replace the whole chain with the shared `getCurrentLocale()` from src/i18n/index.ts (which already handles hi) so this class of omission can't recur.

### 55. [medium] /guides/ is a client-side meta-refresh redirect that is nonetheless listed in the sitemap

**Area:** i18n-parity · **File:** `src/pages/guides/index.astro`:1-20 · **Effort:** S

**Evidence (unverified):** The file is a bare HTML document with `<meta http-equiv="refresh" content="0; url=/en/guides/">` plus a localStorage-driven `window.location.href` override. It has no <Layout>, no SEO component and no canonical beyond a relative `<link rel="canonical" href="/en/guides/">`. dist/sitemap-0.xml nevertheless contains `<loc>https://nostrich.love/guides/</loc>` with `hreflang="en-US"`, listed as an alternate of /ar/guides/ and friends. Also note astro.config.mjs sets `prefixDefaultLocale: false`, but the manual `[lang]` route generates `/en/guides/*` anyway, so the config flag is misleading — English is prefixed in practice.

**Impact:** A JS/meta-refresh hop is a weak redirect signal; Google may index the empty redirect shell, and it is advertised in the sitemap as the canonical English alternate for every localized guide index.

**Suggested fix:** Replace with a real 301 (a `vercel.json` redirect, since there is no vercel.json today), exclude /guides/ from the sitemap via the integration's `filter`, and either remove `prefixDefaultLocale` from astro.config.mjs or stop generating /en/ paths so config and reality agree.

### 56. [medium] framer-motion imported as full `motion` in 104 files; LazyMotion is used nowhere

**Area:** islands-hydration · **File:** `package.json`:- · **Effort:** L

**Evidence (unverified):** 104 files import framer-motion — 43 outside src/simulators, including the globally-mounted StreakBanner. Every one imports the eager `motion` / `AnimatePresence` API. Measured: `motion + AnimatePresence` = 130.0 KB min / 43.5 KB gzip; `LazyMotion + m + AnimatePresence` = 30.3 KB min / 11.5 KB gzip. Grepping for `LazyMotion` across src/ returns zero hits. Sampled usage is uniformly trivial: FAQAccordion.tsx:102-103 animates height/opacity, ProgressTracker.tsx:90-91 and :159-160 animate strokeDasharray and width, StreakBanner.tsx:157 animates `scale: [1, 1.2, 1]`.

**Impact:** 32 KB gzip of avoidable payload on essentially every route, since StreakBanner puts framer-motion in the global chunk. None of the sampled animations need the full feature set — they are height, width, opacity and scale transitions that CSS handles natively.

**Suggested fix:** Wrap island trees in `<LazyMotion features={domAnimation}>` and swap `motion.*` for `m.*` — a mechanical rename that saves 32 KB gzip. For the simplest cases (FAQAccordion, ProgressTracker bars) drop framer-motion entirely in favour of CSS transitions, which also removes it from the global chunk once StreakBanner is fixed.

### 57. [medium] Four components with zero hooks or event handlers are hydrated as React islands

**Area:** islands-hydration · **File:** `src/components/ui/LogoText.tsx`:- · **Effort:** S

**Evidence (unverified):** Scanning every island-mounted component for useState/useEffect/useReducer/useRef/useCallback/onClick/onChange/onSubmit/addEventListener yields zero matches for: LogoText.tsx (85 lines, pure JSX + Tailwind classes, hydrated twice per page at Header.astro:37 and Footer.astro:60); MobilePhoneFrame.tsx (115 lines, a decorative bezel, `client:load` on damus/amethyst/keychat/olas/yakihonne simulator pages, e.g. damus.astro:35 where it also wraps a second island); RelayWorldMap.tsx (168 lines, renders a static DEFAULT_RELAYS array, `client:load` in 3 guides x 7 locales = 21 routes); ui/ProtocolComparison.tsx (77 lines, a static comparison table, `client:load` on 7 guide routes). RelayWorldMap and ProtocolComparison both call useTranslation, so hydrating them is what drags the 160 KB i18n barrel onto those routes.

**Impact:** LogoText alone costs two wasted React roots on all 38 routes. RelayWorldMap and ProtocolComparison are worse than wasted — they are the reason 21 and 7 guide routes respectively pay the full seven-locale translation bundle, for components that render fixed markup.

**Suggested fix:** Convert all four to .astro components (or render them with no `client:*` directive so Astro emits static HTML). For RelayWorldMap and ProtocolComparison, resolve translations in Astro frontmatter and pass strings as props — this removes both the React root and the i18n barrel from those routes in one change.

### 58. [medium] useTranslation runs a 100 ms setInterval per island instance that never stops

**Area:** islands-hydration · **File:** `src/hooks/useTranslation.ts`:20-30 · **Effort:** S

**Evidence (unverified):** The hook's effect installs `setInterval(() => { const currentLocale = getCurrentLocale(); if (currentLocale !== locale) setLocale(currentLocale); }, 100)`. The effect's dependency array is `[locale]`, so the interval is torn down and recreated on every locale change. 38 components use this hook. On /en/guides/relay-guide at least six island instances mount it concurrently — ContinueLearning, GuideNavigation, RelayVisualizer, RelayGuideQuiz, RelayPlayground, RelayWorldMap — giving ~60 timer wakeups per second.

**Impact:** A permanent 10 Hz-per-island polling loop prevents the main thread from ever going idle, blocks browser power-saving on mobile, and adds continuous INP jitter. It exists to detect a URL change that, on a fully static site with no client-side router, can only happen via a full page navigation — so the poll can never observe a change.

**Suggested fix:** Delete the setInterval entirely. The locale is fixed for the lifetime of a static page; resolve it once from `window.location.pathname` on mount, or better, pass it down as a prop from the Astro page which already knows it.

### 59. [medium] GuidesLink is a React island wrapping a single <a>, and silently drops Hindi visitors to English

**Area:** islands-hydration · **File:** `src/components/navigation/GuidesLink.tsx`:14-46 · **Effort:** S

**Evidence (unverified):** The component's entire output is one `<a href={guidesHref}>` (lines 51-61). It is hydrated twice per page at Header.astro:42 (desktop nav) and Header.astro:165 (mobile nav), so twice on all 38 routes. The useEffect resolves the locale by testing `path.startsWith` for /de/, /pl/, /es/, /zh/, /ar/, /en/ — there is no `/hi/` branch, and the localStorage fallback likewise has branches for de/pl/es/zh/ar but not hi. A visitor on any /hi/ page therefore falls through both chains to the final `else` and gets `/en/guides`.

**Impact:** Two React roots per page for a value Astro already knows at build time. The missing branch is a live user-facing defect: the Hindi locale — the most recently added, per commit c0e4922 — has a Guides nav link that dumps readers into English from every page.

**Suggested fix:** Delete the component. In Header.astro, compute the href in frontmatter from `Astro.currentLocale` and emit a plain `<a>`. This removes two islands per route site-wide and fixes the Hindi bug by construction, since the locale comes from Astro's own i18n config rather than a hand-maintained if-chain.

### 60. [medium] 260KB chunk containing all 542 follow-pack accounts loads on 8 landing pages that render ~5 creator cards

**Area:** performance · **File:** `src/data/follow-pack/accounts.ts`:- · **Effort:** S

**Evidence (unverified):** src/data/follow-pack/accounts.ts is 306,575 bytes and contains 542 `npub:` entries with names, bios, nip05, lud16 and picture URLs. It compiles to dist/_astro/categories.Dh5Bve5I.js = 265,738 bytes raw / 95,482 gzip. Verified present in the module graph of dist/nostr-for-foodies/index.html and dist/nostr-for-artists/index.html (632KB raw JS each) and dist/follow-pack/index.html (781KB raw JS). The importer is src/components/community/FeaturedCreatorsFromPack.tsx, used on all 8 audience landing pages (nostr-for-parents.astro:126, -books.astro:136, -foodies.astro:131, -privacy.astro:271, -artists.astro:126, and three more).

**Impact:** ~95KB gzip / 260KB raw of directory data downloaded and parsed on each audience landing page to display roughly five creator cards. These landing pages are SEO entry points where bounce-sensitive first impressions matter most.

**Suggested fix:** These are static Astro pages — resolve the featured creators at build time in the .astro frontmatter and pass only the 5 selected records as island props. The full directory should only reach the client on /follow-pack, and even there it should be fetched lazily or paginated.

### 61. [medium] gamification.ts imports nostr-tools crypto at module top level for a function used twice, dragging secp256k1 onto every page

**Area:** performance · **File:** `src/utils/gamification.ts`:16 · **Effort:** S

**Evidence (unverified):** Line 16: `import { generateSecretKey, getPublicKey, finalizeEvent, nip19 } from 'nostr-tools';`. Those imports are used only at line 933 (`nip19.decode`) and line 959 (`finalizeEvent`), inside the optional NIP-58 badge-publishing path. nostr-tools pulls @noble/curves, @noble/hashes, @noble/ciphers, @scure/base, @scure/bip32 and @scure/bip39. gamification.ts is reached from ResumeBanner (src/pages/index.astro:79), progress.astro, PrivacySecurityQuiz and ManualUnlockToggle, so dist/_astro/gamification.*.js and the shared crypto chunks appear in the homepage module graph.

**Impact:** Elliptic-curve cryptography code is downloaded and parsed on the homepage so a banner can read a streak count from localStorage. Nobody generates a Nostr key on the homepage.

**Suggested fix:** Move the four nostr-tools imports inside the NIP-58 publish function as a dynamic `await import('nostr-tools')`. The badge-publishing path is user-initiated and can afford a lazy chunk. This removes the entire crypto tree from the default page graph.

### 62. [medium] Pagefind is a declared dependency but is never built and never referenced — search does not exist in production

**Area:** performance · **File:** `package.json`:31 · **Effort:** S

**Evidence (unverified):** package.json:31 declares `"pagefind": "^1.4.0"`. The scripts block contains only dev/build/preview/astro/fetch-accounts/verify-seo — there is no postbuild step invoking pagefind, and astro.config.mjs has no pagefind integration. `dist/pagefind` does not exist after a full build. grep for 'pagefind' across all of src/ returns zero matches, and it appears in zero built HTML files. No search UI component exists (the only files matching *search* are simulator screens and a follow-pack SearchBar unrelated to Pagefind).

**Impact:** The stated search feature is entirely absent — users have no site search. Secondarily, an unused build-tool dependency inflates install time and CI duration. Because nothing loads it, there is no runtime cost, which is the only reason this is not higher severity.

**Suggested fix:** Either wire it up (`"postbuild": "pagefind --site dist"` plus a search island loaded with `client:visible` or on user intent, so the index is fetched lazily rather than on page load), or remove the dependency. If wired up, note the index for 155 pages across 7 locales will be substantial — load it on interaction, never eagerly.

### 63. [medium] Two banners inject above page content after hydration with no reserved space, causing layout shift for returning visitors

**Area:** performance · **File:** `src/layouts/Layout.astro`:156 · **Effort:** S

**Evidence (unverified):** Layout.astro:156 renders `<StreakBannerWrapper client:only="react" />` as the first element in `<body>`, before `<slot />`. `client:only` means Astro server-renders nothing at all — no placeholder, no reserved height. StreakBanner.tsx renders a `p-4` container with a `w-14 h-14` icon (roughly 88px tall) and only becomes visible once `getStreakInfo()` reports streakDays > 0. The same pattern repeats at src/pages/index.astro:79 with `<ResumeBanner client:load />`.

**Impact:** For any returning visitor with an active streak — precisely the repeat-visitor cohort that dominates Chrome UX Report field data — the entire page contents jump down by ~88px shortly after load. This is a textbook Cumulative Layout Shift failure and it is invisible in lab tests run with a clean localStorage profile.

**Suggested fix:** Reserve the space server-side: wrap the banner slot in a container with a fixed `min-height` matching the rendered banner, or render the banner as an overlay/fixed element that does not participate in document flow. If neither is acceptable, gate visibility on a class toggled by the existing inline head script (which already reads localStorage before paint) so the reservation decision happens pre-render.

### 64. [medium] Remote avatars hotlinked from 15+ third-party hosts, 46 of them animated GIFs, with no lazy loading or dimensions

**Area:** performance · **File:** `src/data/follow-pack/accounts.ts`:- · **Effort:** M

**Evidence (unverified):** 530 profile pictures in the account data point at third-party origins: image.nostr.build (139), blossom.primal.net (93), m.primal.net (89), nostr.build (42), i.nostr.build (37), pbs.twimg.com (15), cdn.nostr.build (14), pfp.nostr.build (11), i.imgur.com (10), plus cdn.nostrcheck.me, void.cat, profilepics.nostur.com, i.postimg.cc, cdn.satlantis.io, nostrcheck.me. 46 of these URLs end in .gif. Measured on the built pages: dist/follow-pack/index.html has 12 remote images, 0 with `loading="lazy"`, 0 with width/height; dist/nostr-for-foodies/index.html has 6 remote, 0 lazy.

**Impact:** Each distinct host costs a fresh DNS lookup plus TLS handshake. Unsized images shift layout as they arrive (CLS). Animated GIFs are uncompressed frame sequences that can be megabytes each and animate continuously, consuming main-thread and compositor time indefinitely. None of these hosts are under the site's control, so any of them going slow or dark degrades or breaks the page.

**Suggested fix:** Add `loading="lazy"`, `decoding="async"` and explicit width/height (or a fixed-aspect CSS box) to every avatar. Better: fetch and self-host the ~540 avatars as small WebP thumbnails at build time via the existing scripts/fetch-nostr-accounts.js, which removes all third-party dependencies and lets the sharp pipeline resize them.

### 65. [medium] OG image is a 1.18MB 2880x1368 PNG, and og-image.png is a 194-byte HTML comment placeholder

**Area:** performance · **File:** `src/config/site.ts`:12 · **Effort:** S

**Evidence (unverified):** site.ts:12 sets `ogImage: "/preview_image.png"` and line 20 `defaultImage: "/preview_image.png"`. public/preview_image.png is 2880x1368 pixels and 1,184,543 bytes. Separately, public/og-image.png is 194 bytes and `file` reports it as ASCII text — its contents are three HTML comments beginning 'This is a placeholder OG image (1200x630)'. Both ship to dist/.

**Impact:** 1.18MB served to every social crawler and link-preview fetch; some scrapers time out or refuse images that large, degrading share previews. The recommended OG dimension is 1200x630, so 2880x1368 is over 5x the needed pixel area. The 194-byte og-image.png is a broken image that will render as a broken preview anywhere it is referenced.

**Suggested fix:** Resize preview_image.png to 1200x630 and export as optimized PNG or WebP (should land under 100KB, a ~92% reduction). Delete public/og-image.png or replace it with a real image. Neither file affects on-page load, which is why this is medium rather than high.

### 66. [medium] Client logo PNGs are 4-16x their rendered size; /simulators loads 409KB of icons for six 64x64 tiles

**Area:** performance · **File:** `public/icons`:- · **Effort:** S

**Evidence (unverified):** public/icons/damus.png is 1024x1024 and 146,861 bytes; primal.png 300x300 / 100,724; coracle.png 588x588 / 91,433; snort.png 128x128 / 44,820; amethyst.png 500x500 / 21,520; gossip.png 128x128 / 4,496. In dist/simulators/index.html these render as `<img src="/icons/damus.png" class="w-full h-full object-cover rounded-2xl">` inside a `w-16 h-16` (64x64 CSS px) box, with no width/height and no loading attribute. Each file is duplicated byte-for-byte under public/simulators/logos/official/, so the same 146KB damus.png ships twice.

**Impact:** ~409KB of PNG for six 64x64 icons on the /simulators index, which should total roughly 15KB as WebP at 128x128. damus.png alone is downloading a 1024x1024 image to fill a 64px box — a 16x linear oversample. The public/icons and public/simulators/logos/official duplication doubles the deployed asset footprint for no benefit.

**Suggested fix:** Resize all client icons to 128x128 (2x the 64px render) and convert to WebP; add width/height and `loading="lazy"` to the grid images. De-duplicate public/icons vs public/simulators/logos/official — keep one canonical directory.

### 67. [medium] Three production dependencies are never imported anywhere, including the advertised Pagefind search

**Area:** repo-hygiene · **File:** `package.json`:22-31 · **Effort:** S

**Evidence (unverified):** Grepping src/, scripts/ and every config for each dependency name: `pagefind` => 0 hits outside package.json (no `data-pagefind` attributes in src/, no `npx pagefind` in the build script which is a bare `astro build`, and no dist/pagefind/ directory in the current build); `@noble/secp256k1` => 0 hits (key generation does not use it); `@radix-ui/react-slot` => 0 hits. README.md:129 nonetheless advertises 'Search: Built-in Pagefind integration' and README.md:126 credits @noble/secp256k1 for 'Secure key generation'.

**Impact:** Site-wide search does not exist despite being a headline README feature — no index is ever generated, so nothing could consume it. Three packages are installed and version-resolved on every CI install for nothing. Anyone reading README.md will look for a search UI that was never wired up.

**Suggested fix:** Either wire Pagefind in (`"build": "astro build && pagefind --site dist"` plus a search island) or drop the dependency and the README claim. Remove @noble/secp256k1 and @radix-ui/react-slot from dependencies, and correct README.md:126,129.

### 68. [medium] /privacy is served twice — an un-styled orphan copy sits at /privacy.html

**Area:** repo-hygiene · **File:** `public/privacy.html`:1 · **Effort:** S

**Evidence (unverified):** Both `dist/privacy/index.html` (19284 bytes, generated from src/pages/privacy.astro, full site chrome) and `dist/privacy.html` (3377 bytes, copied verbatim from public/) exist in the current build. public/privacy.html is a standalone document with inline <style>, no header, no footer, no language switcher, and a hardcoded `<html lang="en">`; its mtime is 2026-02-10, predating the Astro route.

**Impact:** Two publicly reachable URLs serve the same policy with different content and different last-updated dates. Whichever Google picks, one is a dead-end page with no navigation off it, and the pair is a near-duplicate-content signal on a small site. If the Astro route's policy text is ever updated, the .html copy silently diverges.

**Suggested fix:** Delete public/privacy.html; src/pages/privacy.astro already covers the route.

### 69. [medium] 470KB of one-off temp and cache JSON is committed under scripts/

**Area:** repo-hygiene · **File:** `scripts/metadata-cache.json`:1 · **Effort:** S

**Evidence (unverified):** `git ls-files scripts` = 43 files, of which 9 are scratch data: metadata-cache.json (177KB), temp-three-naddrs-results.json (163KB), temp-naddr-results.json (34KB), temp-search-results.json (34KB), pitiunited-results.json (28KB), search-follows-results.json (27KB), temp-foodie-pictures.json (3.4KB), temp-parent-pictures.json (2.7KB), temp-npub-result.json (681B). All dated 2026-02-12/13. scripts/ totals 732KB on disk.

**Impact:** Two thirds of the scripts/ directory by weight is dead scratch output from a three-day account-curation session in February, permanently in git history. It obscures the two scripts that are actually live (fetch-nostr-accounts.js and verify-seo.js, the only ones referenced from package.json).

**Suggested fix:** `git rm --cached` the nine temp/cache JSON files and add `scripts/temp-*.json`, `scripts/*-results.json`, `scripts/metadata-cache.json` to .gitignore.

### 70. [medium] scripts/README.md documents four scripts that do not exist and omits 35 that do

**Area:** repo-hygiene · **File:** `scripts/README.md`:13-27 · **Effort:** M

**Evidence (unverified):** The README lists track-progress.sh, validate-workflow.sh, create-agent-task.sh and extract-brand-colors.sh — none of the four are present in scripts/. It documents 8 scripts total while `ls scripts` shows 44 entries, and it does not mention verify-seo.js or fetch-nostr-accounts.js, the only two wired into package.json. Its usage example `./scripts/init-workflow.sh add-simulator "client_name=Iris"` refers to a workflow system whose docs (docs/workflow-system/) were last touched 2026-02-15.

**Impact:** The directory's index is wrong in both directions, so nobody can tell which of the 44 entries is live. That is why near-duplicate families accumulated unnoticed: fetch-metadata.cjs / fetch-metadata-v2.cjs, fetch-and-apply.cjs / fetch-and-apply-fixed.cjs, and search-follows.cjs / .js / -v2.cjs / -accounts.ts — four implementations of the same follow-list search.

**Suggested fix:** Rewrite scripts/README.md to list only what exists, marking each as live or archival. Delete the superseded -v2/-fixed variants and consolidate the four search-follows implementations into one.

### 71. [medium] Orphan root-level data/follow-pack/accounts.ts shadows the real one in src/

**Area:** repo-hygiene · **File:** `data/follow-pack/accounts.ts`:1 · **Effort:** S

**Evidence (unverified):** `wc -l` gives 436 lines for data/follow-pack/accounts.ts versus 7527 for src/data/follow-pack/accounts.ts; `diff -q` reports they differ. Every consumer resolves to the src/ copy: src/components/follow-pack/FollowPackFinder.tsx:3 imports '../../data/follow-pack', src/components/community/FeaturedCreatorsFromPack.tsx:3 imports '../../data/follow-pack/accounts' — both relative to src/components/, i.e. src/data/. Nothing imports the root data/ directory. It is the sole tracked file under data/.

**Impact:** A 436-line stale snapshot of the curated-accounts list sits at the repo root looking authoritative. Because tsconfig includes `**/*`, it is type-checked, and its exported symbol names collide with the real module in autocomplete — an easy source of an edit applied to the wrong file.

**Suggested fix:** Delete the root data/ directory; src/data/follow-pack/ is the live source.

### 72. [medium] README.md describes a version of the project that no longer exists

**Area:** repo-hygiene · **File:** `README.md`:1 · **Effort:** M

**Evidence (unverified):** The Features list, Project Structure tree and Tech Stack make no mention of i18n (7 locales), the 10 client simulators, gamification/badges, follow-pack, or the audience landing pages. README.md:81 diagrams `src/pages/guides/` — deleted. README.md:126 credits @noble/secp256k1 and :129 claims Pagefind search; neither is imported. README.md:240 links a LICENSE file: `ls LICENSE*` finds nothing, while the header carries an MIT badge. README.md:32 gives the clone URL as `github.com/yourusername/nostrich-love.git` and :232 the issues URL as `github.com/yourusername/...`, while :294 says the repo is `github.com/piotr-e8/nostrich-love`. The scripts table omits `fetch-accounts` and `verify-seo`.

**Impact:** The public front door of the project is wrong about its own feature set, its license (an MIT badge with no license text is legally meaningless — the work is all-rights-reserved by default), and its clone URL. Any would-be contributor bounces on step 1 of Quick Start.

**Suggested fix:** Rewrite the Features/Structure/Tech Stack sections against the current tree, add an actual LICENSE file (or drop the badge), and replace the three placeholder GitHub URLs with the real one.

### 73. [medium] Two documentation-cleanup plans were written 5 months ago and never executed

**Area:** repo-hygiene · **File:** `docs/REORGANIZATION_PLAN.md`:1 · **Effort:** M

**Evidence (unverified):** docs/REORGANIZATION_PLAN.md (2026-02-15) and docs/TODO_CLEANUP.md both prescribe creating docs/migration/ and moving seven phase docs there, creating a docs/README.md index, and deleting docs/session-best-practices.md. None happened: docs/migration/ does not exist, docs/README.md does not exist, docs/session-best-practices.md is still there. Both plans also operate on a `.ai/` directory that no longer exists on disk (it is gitignored and absent from the root listing), so their instructions are unexecutable as written. Status field reads '⏳ Waiting for development to complete'.

**Impact:** Two meta-documents about cleaning up documents are themselves part of the clutter they describe, and reading them costs a reader time before they discover nothing was done. docs/ still contains the 'CHAOTIC' state they diagnosed: 48 tracked files mixing phase plans, QA checklists, simulator specs and completed-work summaries.

**Suggested fix:** Execute the reorganisation or delete both plans. Given the phase docs (IMPLEMENTATION_PLAN.md, PHASE3_SUMMARY.md, phase-4-*.md, phase-10-bugfixes.md, docs/follow-pack/PHASE*_COMPLETE.md) describe finished work, moving them to docs/archive/ and deleting the two plans is the cheaper path.

### 74. [medium] CODEBASE_AUDIT.md is untracked, arithmetically stale, and its roadmap was never acted on

**Area:** repo-hygiene · **File:** `CODEBASE_AUDIT.md`:11-16 · **Effort:** M

**Evidence (unverified):** Dated 2026-04-07, it reports '76,768 lines across 250 files', '14,917 translation keys per locale (5 locales)' and '119 pages (16 guides × 5 locales)'. Actual today: 84,411 lines across .ts/.tsx/.astro alone, 511 source files, 7 locales, and dist/ contains ar/, de/, es/, hi/, pl/, zh/ locale trees. Its headline finding, '5 competing progress systems', is still fully present: src/lib/progress.ts, src/lib/progressService.ts, src/lib/useProgressTracking.ts, src/utils/gamification.ts, src/utils/gamificationEngine.ts. AGENTS.md:244 routes all 'Refactoring & technical debt' work to this file, which is untracked.

**Impact:** The document AGENTS.md designates as the technical-debt roadmap is off by two locales and ~8k lines, and none of its Priority-1 items were done in the 3.5 months since. Agents sent to it will act on stale counts, and on a fresh clone it is not there at all.

**Suggested fix:** Either re-run the audit and commit the refreshed version, or delete it and remove the AGENTS.md:244 pointer. Do not leave an untracked, unmaintained roadmap as the designated source of truth.

### 75. [medium] AGENTS.md points the skill system at .opencode/skills/, which does not exist

**Area:** repo-hygiene · **File:** `AGENTS.md`:324 · **Effort:** S

**Evidence (unverified):** AGENTS.md's 'Location differences' section states 'SKILL: .opencode/skills/{name}/SKILL.md (invoked via skill tool)'. `ls .opencode/` returns only bun.lock, node_modules, package-lock.json, package.json — a lone @opencode-ai/plugin@1.3.17 install, 6.5MB, no skills directory. The same file's 'Skill Usage Policy' section correctly says skills are in `.agents/skills/` and lists 9; `ls .agents/skills` shows 10 (astro-i18n-translation is the extra), while skills-lock.json records 9. Only 1 of the 10 skill dirs is tracked (`git ls-files .agents` = .agents/skills/astro-i18n-translation/SKILL.md).

**Impact:** One document gives two different, mutually exclusive locations for skills, one of which is empty. The AGENTS.md 'Skill Tool Bug - Workaround Required' section then instructs agents to `Read .agents/skills/{skill-name}/SKILL.md` directly — which fails on a fresh clone because 9 of the 10 skill directories are untracked.

**Suggested fix:** Delete the stale .opencode/skills/ reference from AGENTS.md, decide whether .agents/skills/ is vendored (then `git add` all 10 and rely on skills-lock.json) or fetched (then gitignore it and document the fetch command), and reconcile the '9 skills' count with the 10 on disk.

### 76. [medium] Junk assets with spaces in their filenames are deployed to production

**Area:** repo-hygiene · **File:** `public/favicon copy.ico`:1 · **Effort:** S

**Evidence (unverified):** public/ contains `favicon copy.ico` (15406 bytes) and `site copy.webmanifest` (263 bytes, with empty `"name":""` and `"short_name":""`), both dated 2026-02-10. Both are copied verbatim into the build: `dist/favicon copy.ico` and `dist/site copy.webmanifest` exist. Neither is referenced from src/ — src/components/SEO.astro:109-114 links favicon.ico, favicon.svg, apple-touch-icon.png, favicon-32x32.png, favicon-16x16.png and site.webmanifest only. public/.DS_Store (6148 bytes) is also present, though .gitignore keeps it out of the index.

**Impact:** Two orphaned files are published at URL-encoded paths (/favicon%20copy.ico, /site%20copy.webmanifest) that appear in crawls and CDN logs for no reason, plus 15KB of wasted deploy payload. Their existence is also what disguises the fact that the real site.webmanifest is malformed — the 'copy' is valid JSON, the original is not.

**Suggested fix:** Delete public/favicon copy.ico, public/site copy.webmanifest and public/.DS_Store.

### 77. [medium] Dead one-off files left at the repo root and in src/pages

**Area:** repo-hygiene · **File:** `src/pages/nostr-for-photographers.astro.backup.mock`:1 · **Effort:** S

**Evidence (unverified):** src/pages/nostr-for-photographers.astro.backup.mock sits directly in the routes directory (Astro ignores the extension, so it does not route, but it is inside src/pages/ and inside the tsconfig glob). fix_json.py at the repo root is a 403-byte throwaway that rewrites `"客服"` in src/i18n/locales/zh.json — a one-time escape fix from 2026-04-03, still untracked at root. feature_list.json at the repo root (7776 bytes) is Amethyst-client research data, unrelated to any build step.

**Impact:** Three files at the two most-read locations in the repo (root and src/pages/) that a reader must individually investigate to discover are dead. The .backup.mock in particular invites a future editor to diff against it as if it were a meaningful variant.

**Suggested fix:** Delete src/pages/nostr-for-photographers.astro.backup.mock and fix_json.py. Move feature_list.json to docs/simulators/amethyst/ next to the other Amethyst research.

### 78. [medium] No signature verification on any relay-sourced event, including the site's own "official account" widget

**Area:** security-privacy · **File:** `src/components/interactive/OfficialAccountWidget.tsx`:103-116 · **Effort:** S

**Evidence (unverified):** `ws.onmessage` parses relay frames and does `events.push(data[2])` with no validation. `verifyEvent` from nostr-tools has zero call sites anywhere in src/ (grepped). The widget then renders `profile.picture` into `<img src>` at :366, `displayName` at :387, and note bodies through `linkifyText(note.content)` at :470 — and caches all of it into `localStorage['nostrich-official-account']` at :291-297 for 5 minutes. The same pattern exists in RelayFeedBrowser.tsx:86-89 and ExportModal.tsx:339. The widget is mounted `client:load` on src/pages/about.astro:129.

**Impact:** Any one of the bootstrap relays (relay.damus.io, nos.lol, relay.snort.social) or of the outbox relays it later discovers can serve a fabricated kind:0 and kind:1 attributed to nostrich.love's own pubkey, and the /about page will present it as the project's official profile and posts. A relay operator (or anyone who can MITM a relay that isn't strictly TLS-pinned) could publish "we've migrated, import your nsec at <lookalike>" under the site's own branding — to an audience of Nostr beginners specifically primed to trust this site. The forged profile picture URL also becomes an arbitrary third-party beacon.

**Suggested fix:** Import `verifyEvent` from nostr-tools and drop any event failing it, in OfficialAccountWidget.queryRelay, RelayFeedBrowser.handleViewFeed/handleLoadMore, and ExportModal.verifyEventOnRelays. Additionally assert `event.pubkey === resolvedPubkey` and `event.kind` is the requested kind before rendering, and validate the cached localStorage blob on read rather than trusting it.

### 79. [medium] Twitter bridge uploads the user's entire following list to nostr.directory and caches every handle in localStorage

**Area:** security-privacy · **File:** `src/utils/nostrDirectory.ts`:122-139 · **Effort:** M

**Evidence (unverified):** `const url = `${API_CONFIG.baseUrl}?name=${encodeURIComponent(handle)}`` where baseUrl is `https://nostr.directory/.well-known/nostr.json` (src/types/nostrDirectory.ts:47). `findMultipleTwitterOnNostr` (line 192) is fed the output of `parseTwitterFollowingCSV` (line 249), which reads the user's uploaded Twitter export file, and issues one request per handle in batches of 5. Every resolved handle is then persisted as a separate localStorage key `nostr-dir-<handle>` at line 92 with a 24h TTL that is only enforced lazily on read. Wired up at src/components/twitter-bridge/TwitterBridge.tsx:74-83.

**Impact:** A user's complete Twitter social graph — often hundreds of handles — is transmitted one-by-one to a third party that is never named in the privacy policy, from an IP address that identifies the user. nostr.directory's server logs plus timing trivially reconstruct "this IP follows exactly these N accounts," which is a strong deanonymizer. The localStorage residue leaves the same graph readable on the device by any future script on the origin. privacy.astro:30-33 claims "No personal data collection — We don't ask for or store personal information" and :57-63 lists localStorage contents as only progress, quiz answers, and theme.

**Suggested fix:** Show an explicit, dismissible consent panel before the first lookup naming nostr.directory, the number of handles that will be sent, and what is retained. Disclose nostr.directory in privacy.astro. Drop the per-handle localStorage cache in favour of an in-memory Map for the session, or at minimum add a visible "clear cached lookups" control wired to the existing `clearNostrDirectoryCache()` (line 341).

### 80. [medium] Persistent device UUID in localStorage, and tracking defaults to on despite a comment claiming otherwise

**Area:** security-privacy · **File:** `src/lib/progressService.ts`:13-29 · **Effort:** S

**Evidence (unverified):** `getDeviceId()` writes `crypto.randomUUID()` to `localStorage['nostrich-device-id']` and reuses it forever. Immediately below, the comment reads `// Default privacy settings - all opt-in, disabled by default` and the object that follows is `{ trackingEnabled: true, dataRetention: 'forever', showProgressIndicators: true, toursEnabled: true }` — with inline `// ← Enable tracking` annotations contradicting the comment above them. `deleteAllProgress()` at :292-297 removes the device id, but nothing in the UI is wired to call it on the privacy page.

**Impact:** A stable, forever-retained unique identifier is exactly what the ePrivacy Directive and GDPR treat as equivalent to a tracking cookie, on a site that advertises "No cookies" (privacy.astro:29) and "no data collection" (README.md:16). The identifier isn't currently transmitted anywhere, which limits real-world harm — but its existence contradicts the policy, the `dataRetention: 'forever'` default means nothing ages out, and the code comment tells the next maintainer the opposite of what the code does, so someone will eventually wire it to a sync endpoint believing it is opt-in.

**Suggested fix:** Delete `getDeviceId()` and `DEVICE_ID_KEY` entirely — nothing consumes the id except `getProgressData()`'s own return value, which no caller reads for the id. Fix the misleading comment. Disclose `nostrich-device-id`, `nostrich-gamification-v1`, `nostrich-privacy-settings`, `nostr-relay-selections`, `nostr-dir-*` and the tour keys in the privacy policy's Local Storage section, and expose a working "delete all my local data" button.

### 81. [medium] Relay guide opens 19 WebSockets to third-party relay operators on page load with no disclosure

**Area:** security-privacy · **File:** `src/components/interactive/RelayExplorer.tsx`:469-472 · **Effort:** S

**Evidence (unverified):** `useEffect(() => { checkAllRelays(); }, [])` fires on mount. `checkAllRelays` (line 441) maps `checkRelayLatency` over all 19 hardcoded relay entries plus any custom ones, each doing `new WebSocket(relay.url)` (line 415). The component is registered in the MDX component map at src/pages/[...lang]/guides/[slug].astro:196 and embedded in `relays-demystified.mdx` in all 7 locales. OfficialAccountWidget does the same on /about (about.astro:129, `client:load`), connecting to 3 bootstrap relays plus discovered outbox relays, preceded by a `fetch` to nostrich.love/.well-known/nostr.json.

**Impact:** Merely reading a guide page discloses the visitor's IP address, TLS fingerprint and connection timing to 19 independent relay operators — several of which log connections — before the user clicks anything. Nostr users choose relays deliberately because relay operators can correlate reading behaviour; connecting on their behalf silently is precisely the harm the guide is teaching them about. This is also undisclosed in the privacy policy's "External Links" section (privacy.astro:80-85), which only covers links the user chooses to follow.

**Suggested fix:** Replace the mount-effect auto-check with a "Check relay status" button, or gate it behind an IntersectionObserver plus a one-line notice ("this connects your browser directly to N relays; they will see your IP"). Same for OfficialAccountWidget — render the cached/last-known state and let the user press refresh.

### 82. [medium] dangerouslySetInnerHTML with no HTML escaping in the Amethyst simulator post renderer

**Area:** security-privacy · **File:** `src/simulators/amethyst/components/MaterialCard.tsx`:75-95 · **Effort:** S

**Evidence (unverified):** `renderContent` takes `post.content` and applies three `.replace()` calls for hashtags, `nostr:` mentions and URLs, then returns `{ __html: processedContent }` — the raw input is never escaped. Consumed at line 176 via `dangerouslySetInnerHTML={renderContent(post.content)}`, rendered from HomeScreen.tsx:294, ProfileScreen.tsx:258 and SearchScreen.tsx:227. Contrast with the neighbouring snort/components/CodeBlock.tsx, which correctly calls `escapeHtml()` (line 224-229) before its own highlighting passes.

**Impact:** Today the posts are hardcoded mock data, so this is latent rather than live. But it is one prop away from exploitable: the codebase already has RelayFeedBrowser pulling live kind:1 notes off public relays, and the obvious next feature is "show real notes in the simulator." The moment any relay-sourced or user-typed string reaches `post.content`, an attacker who can post to a public relay gets stored XSS on nostrich.love — on the same origin as the key generator, with no CSP to contain it.

**Suggested fix:** Escape `&`, `<`, `>` at the top of `renderContent` before the highlighting replaces (reuse the `escapeHtml` helper from snort/components/CodeBlock.tsx:224), or better, return React elements from a split/map rather than an HTML string — OfficialAccountWidget.tsx:328-348 already demonstrates the safe pattern in this repo.

### 83. [medium] Fake "Collecting entropy" progress bar teaches beginners a false model of key generation

**Area:** security-privacy · **File:** `src/components/interactive/KeyGenerator.tsx`:133-147 · **Effort:** S

**Evidence (unverified):** `const entropyInterval = setInterval(() => { setEntropyProgress(prev => prev + Math.random() * 15) }, 100)` followed by `await new Promise(resolve => setTimeout(resolve, 1500))`, and only *then* line 150 calls the real `generateSecretKey()`. The UI labels this bar "Collecting entropy" (line 284) with a lock icon. The progress value is pure `Math.random()` theatre unrelated to any entropy source. A dead helper `generateEntropyAnimation()` doing the same thing sits at src/lib/utils.ts:37-41. Separately, six simulators mint fake keys with `Array(64).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random()*16)])` (e.g. snort/screens/LoginScreen.tsx:25) and label them "Private Key (nsec) - Save This!" (snort:212, primal:212).

**Impact:** The single most important thing this page teaches is where key security comes from. A beginner watching a 1.5-second "collecting entropy" bar learns that entropy is something slow and observable that the page gathers, rather than a single instantaneous `crypto.getRandomValues` call — which makes them unable to distinguish this tool from a backdoored generator that does the same animation over a seeded PRNG. The simulators compound it: "Save This!" over a Math.random hex string trains a beginner to treat an unverifiable blob as a key. (The fake nsecs use hex characters in a bech32 position, so they'd at least fail checksum validation in a real client.)

**Suggested fix:** Either drop the fake bar and show "Generated using your browser's cryptographic random number generator (crypto.getRandomValues)" with a link to the line of code, or make the animation honest by feeding it real state. Change the simulator labels from "Save This!" to "Simulated key — not real, do not save" and render them visibly struck-through or watermarked.

### 84. [medium] 57 of 155 titles exceed 65 characters because guide titles get two suffixes stacked

**Area:** seo-technical · **File:** `src/pages/[lang]/guides/[slug].astro`:104 · **Effort:** S

**Evidence (unverified):** `const title = `${guide.data.title} - Nostr Beginner Guide`;` is then fed through siteConfig.seo.titleTemplate `'%s | Nostrich.love'` (src/config/site.ts:17), producing e.g. `Nostr vs ActivityPub vs Bluesky: Complete Protocol Comparison - Nostr Beginner Guide | Nostrich.love` (100 chars), `NIP-17: Private Direct Messages - A Complete Guide - Nostr Beginner Guide | Nostrich.love` (89), and the Arabic protocol-comparison at 105. The homepage compounds it differently: src/pages/index.astro:10 sets `'Nostrich.love - Take Control of Your Social Media'`, which the template turns into `Nostrich.love - Take Control of Your Social Media | Nostrich.love` — the brand appears twice in 65 chars.

**Impact:** Google truncates around 580px (~60 chars); on the 26 worst offenders the actual differentiating keywords survive but 30-45 characters of ' - Nostr Beginner Guide | Nostrich.love' are wasted or rewritten by Google, and the duplicated brand on the homepage looks like spam in the SERP.

**Suggested fix:** Drop the ' - Nostr Beginner Guide' interstitial at [slug].astro:104 and let the template supply the single brand suffix; strip 'Nostrich.love - ' from index.astro:10. Add a build-time assertion that no rendered title exceeds ~60 characters.

### 85. [medium] Every page shares one 1.18 MB Open Graph image and there are no og:image dimensions or alt tags

**Area:** seo-technical · **File:** `src/config/site.ts`:20 · **Effort:** M

**Evidence (unverified):** `defaultImage: "/preview_image.png"` is the og:image on 152/152 pages — no page overrides it. `file public/preview_image.png` → PNG 2880 x 1368; live `content-length: 1184543`. No `og:image:width`, `og:image:height`, `og:image:alt` or `twitter:image:alt` is emitted anywhere in SEO.astro:76/100. Also `public/og-image.png` is a 194-byte file that `file` reports as 'exported SGML document text, ASCII text' — a broken placeholder still shipped in dist.

**Impact:** WhatsApp silently drops OG images over ~300 KB and several scrapers time out on multi-megabyte assets, so link previews fail on the platforms where a beginner guide actually spreads. A single generic image across 152 pages means every shared guide looks identical in a feed, killing share CTR. Missing width/height forces scrapers to download the full image before laying out the card.

**Suggested fix:** Resize preview_image.png to 1200×630 and re-encode under 200 KB; add og:image:width/height/alt and twitter:image:alt to SEO.astro. Generate per-guide OG images (Astro's satori/sharp endpoint) keyed on guide title so each of the 112 guides shares distinctly. Delete the broken public/og-image.png.

### 86. [medium] Duplicate privacy policy at two live URLs, one of which has no canonical, no description and no navigation

**Area:** seo-technical · **File:** `public/privacy.html`:1-25 · **Effort:** S

**Evidence (unverified):** public/privacy.html is copied verbatim to dist/privacy.html, while src/pages/privacy.astro builds dist/privacy/index.html. Both are live 200 (`curl -I https://nostrich.love/privacy` → 200, `.../privacy.html` → 200, `.../privacy/` → 200). dist/privacy.html has `<title>Privacy Policy - Nostrich.love</title>` with no meta description, no canonical, no robots meta, no header/footer — 279 body words vs 286 on the Astro version. Footer.astro:26 links to `/privacy`, which on Vercel resolves to the raw static file, not the Astro page.

**Impact:** Two indexable URLs with substantially identical content and no canonical between them — a textbook duplicate-content split. The version users actually reach from the footer is the orphaned static file with no navigation out and no analytics, so it is a dead end for both users and crawlers.

**Suggested fix:** Delete public/privacy.html, or add `<link rel="canonical" href="https://nostrich.love/privacy/">` plus a noindex to it. Point Footer.astro:26 at `/privacy/`.

### 87. [medium] Development test page test-progress.html is deployed to production and publicly reachable

**Area:** seo-technical · **File:** `public/test-progress.html`:1 · **Effort:** S

**Evidence (unverified):** `curl -I https://nostrich.love/test-progress.html` → 200. The built page has `<title>Progress Test</title>`, H1 'Progress & Badge Test', 11 body words, no meta description, no canonical, no robots meta (so it is index,follow by default). It is not in the sitemap and has no inbound links, but nothing prevents indexing. public/robots.txt has no Disallow rules at all (all rules are commented out at lines 8-10).

**Impact:** A branded 404-quality page can be indexed via external links or Chrome telemetry and surfaced for site: queries, and it exposes internal gamification state keys. Combined with public/'site copy.webmanifest' and 'favicon copy.ico', it signals an uncurated public/ directory.

**Suggested fix:** Delete public/test-progress.html (and the stray 'site copy.webmanifest' / 'favicon copy.ico'). If it must stay for manual QA, add `Disallow: /test-progress.html` to public/robots.txt and a noindex meta tag.

### 88. [medium] Pagefind is a declared dependency but is never built or referenced — the site has no search and /pagefind/ 404s

**Area:** seo-technical · **File:** `package.json`:6 · **Effort:** M

**Evidence (unverified):** `"build": "astro build"` with no `pagefind --site dist` post-step, while `"pagefind": "^1.4.0"` is listed at dependencies. `grep -rn "pagefind" src/ scripts/` returns zero matches. `ls dist/pagefind` → does not exist. Live: `curl -I https://nostrich.love/pagefind/pagefind.js` → 404.

**Impact:** No on-site search across 112 guides and a 40-term glossary — users who cannot find a topic bounce back to Google. It also forfeits the WebSite + SearchAction / sitelinks-searchbox structured-data opportunity on the homepage. A 5 MB dependency ships in the lockfile for nothing.

**Suggested fix:** Either wire it up (`"build": "astro build && pagefind --site dist"` plus a search UI island and a WebSite/SearchAction JSON-LD node), or remove the dependency. Do not leave it half-installed.

### 89. [medium] Ten simulator pages carry 38-123 words of indexable text and two of them have no H1 at all

**Area:** seo-technical · **File:** `src/pages/simulators/gossip.astro`:17-38 · **Effort:** M

**Evidence (unverified):** gossip.astro renders `<GossipSimulator client:load />` inside a bare `<div>` — no `<main>`, no `<h1>`, no `<Footer />`. Same shape in olas.astro:19-42. My dist scan: /simulators/olas/ = 38 body words, /simulators/keychat/ 53, /simulators/damus/ 66, /simulators/yakihonne/ 68, /simulators/amethyst/ 72, /simulators/primal/ 75, /simulators/coracle/ 84, /simulators/snort/ 123 (with 'Snort' duplicated as H1 twice), /simulators/gossip/ no H1 and 573,827 bytes of HTML containing 337 `<img>` tags of SSR'd mock feed data. /simulators/nostr-kitten/ falls back to siteConfig.seo.defaultDescription (203 chars, identical to the site default). The /simulators/ hub description claims '7 different Nostr clients' while 10 exist.

**Impact:** Eleven URLs in the sitemap that Google will classify as thin/soft-404 candidates. 'try damus in browser' is a high-intent query these pages could own, but there is no crawlable prose to rank on. The 560 KB gossip HTML is pure crawl-budget waste with zero indexable value, and its missing H1 removes the primary on-page topic signal.

**Suggested fix:** Add an H1, a 150-300 word intro ('What Damus is, who it is for, what this simulator shows'), and a `<Footer />` to each simulator page; keep the island below the fold. Fix the duplicate H1 in snort.astro, give nostr-kitten a real description, and correct the client count in src/pages/simulators/index.astro.

### 90. [medium] German privacy-security guide ships an untranslated English title, producing the only duplicate title pair on the site

**Area:** seo-technical · **File:** `src/content/guides/de/privacy-security.mdx`:2 · **Effort:** S

**Evidence (unverified):** `title: "Privacy & Security Deep Dive"` — identical to src/content/guides/en/privacy-security.mdx:2. The description below it is correctly translated to German. Result: dist/de/guides/privacy-security/index.html and dist/en/guides/privacy-security/index.html both render `<title>Privacy &amp; Security Deep Dive - Nostr Beginner Guide | Nostrich.love</title>`. This is the only duplicate title across all 155 pages.

**Impact:** German searchers see an English title in the SERP for a page whose body is German — lower CTR and a relevance mismatch. With hreflang broken (finding 1), Google has no signal that these are translations, so two identically-titled pages compete directly.

**Suggested fix:** Translate to something like 'Datenschutz & Sicherheit im Detail'. Add a build-time check that no two rendered titles are identical.

### 91. [medium] Language switcher renders buttons, not links — no crawlable path exists between any two locales

**Area:** seo-technical · **File:** `src/components/LanguageSwitcher.tsx`:133-160 · **Effort:** S

**Evidence (unverified):** `switchLanguage` sets `window.location.href` from an `onClick` handler on `<button>` elements; there is not a single `<a href>` to another locale in the rendered dropdown. The component is mounted `client:load` at Header.astro:81. It also auto-redirects on mount (lines 27-88): a visitor whose localStorage has preferredLanguage='de' who lands on /en/guides/what-is-nostr is bounced without interaction, and conversely anyone on /pl/about is force-redirected to /about. Related: GuidesLink.tsx omits 'hi' from both its URL and localStorage branches, so Hindi users always get /en/guides.

**Impact:** Combined with the broken hreflang, Googlebot has literally no way to discover translated pages by crawling — the sitemap is the sole discovery channel, which is fragile and slow. The localStorage auto-redirect also means a user arriving from a Google result for an English page can be silently moved to a different URL, which corrupts the engagement signals Google measures for that result.

**Suggested fix:** Render the switcher options as real `<a href>` elements pointing at the computed locale URL (keep the onClick only to persist the preference). Remove the automatic on-mount redirect. Add 'hi' to GuidesLink.tsx.

### 92. [medium] Render-blocking third-party font stylesheet plus duplicated preconnect hints in every page head

**Area:** seo-technical · **File:** `src/layouts/Layout.astro`:136-138 · **Effort:** S

**Evidence (unverified):** `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />` is a synchronous, cross-origin stylesheet on the critical path of all 155 pages (confirmed present in dist/index.html). SEO.astro:118-120 already emits `preconnect` to fonts.googleapis.com, fonts.gstatic.com and a dns-prefetch, and Layout.astro:136-137 emits the same two preconnects again — dist/index.html contains `preconnect href="https://fonts.googleapis.com"` twice. The Cloudflare beacon (Layout.astro:141-143) is correctly `defer` and does not block; the Plausible tag at line 146 is a genuine HTML comment and issues no request.

**Impact:** An extra DNS + TLS + round-trip to a third-party origin before first paint on every page, plus a second sequential request for the woff2 files. On mobile this is typically 300-600 ms of blocked render, which feeds directly into LCP and the page-experience signal. The duplicate preconnect is harmless but shows the two files are not coordinated.

**Suggested fix:** Self-host Inter (via @fontsource/inter or local woff2 subsets) and drop the Google Fonts request entirely, or at minimum load it with `media="print" onload="this.media='all'"`. Remove the duplicated preconnect block from either SEO.astro:118-120 or Layout.astro:136-137.

### 93. [medium] Olas profile reads MockUser fields that do not exist, so the logged-in user never sees their own data

**Area:** simulators · **File:** `src/simulators/olas/screens/ProfileScreen.tsx`:32 · **Effort:** S

**Evidence (unverified):** Line 32: `src={currentUser?.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}` and line 47: `{currentUser?.about || 'Capturing moments on Nostr 📸'}`. MockUser (src/data/mock/types.ts) declares `avatar` and `bio`, not `picture`/`about`. tsc: two TS2339. Same category of error at damus/screens/ComposeScreen.tsx:87 (`note.author` on MockNote) and yakihonne/YakiHonneSimulator.tsx:205 (`MockUser | undefined` passed where `SimulatorUser` is required).

**Impact:** After logging in to the Olas simulator, the profile tab always falls through to the generic bot avatar and the placeholder bio, so the 'this is your account' moment the tour is building toward never lands. Silent — nothing errors, it just always shows the fallback.

**Suggested fix:** Change `.picture` → `.avatar` and `.about` → `.bio`. These three files are the tail of the same underlying problem: each simulator invented its own view-model instead of using the shared SimulatorUser type, and nothing typechecks them.

### 94. [medium] nostr-kitten is an orphan route shipping unscoped global CSS with viewport-fixed overlays

**Area:** simulators · **File:** `src/simulators/nostr-kitten/nostr-kitten.theme.css`:8-45 · **Effort:** S

**Evidence (unverified):** `.starfield { position: fixed; top:0; left:0; width:100%; height:100%; z-index:-1 }` (lines 8-18) and `.midi-player { position: fixed; top:10px; right:10px; z-index:1000 }` (lines 44-56) are page-global fixed overlays with extremely generic class names (`.starfield`, `.blink`, `.rainbow-text`, `.midi-btn`) in a stylesheet Vite emits as a normal page-level CSS chunk (dist/_astro/nostr-kitten.BH3zBmVT.css, 9.1 KB). The simulator itself (274 lines, no screens/ or components/ subdirectory) is absent from src/simulators/index.ts, from shared/configs.ts (there is no SimulatorClient.NOSTR_KITTEN), from SimulatorSidebar's simulatorGroups (lines 50-80), and from the /simulators index grid — yet src/pages/simulators/nostr-kitten.astro is a live indexed route. That page also omits `<Header />` and SimulatorSidebar entirely.

**Impact:** A user can only reach /simulators/nostr-kitten from a search engine, and once there has no navigation back. The generic global class names are a collision waiting to happen the moment anyone adds a `.blink` or `.starfield` elsewhere. src/pages/simulators/index.astro:15 and :59 also both claim '7 different Nostr clients' while the grid renders 9 configs and 10 routes exist.

**Suggested fix:** Either promote nostr-kitten properly (add a config, a sidebar entry, a Header) or noindex it. Prefix all its class names with `nk-`. Fix the '7 clients' copy in index.astro.

### 95. [medium] 128 console.log calls and a file labelled "Debug Version" ship to production

**Area:** simulators · **File:** `src/simulators/keychat/KeychatSimulator.tsx`:1-4 · **Effort:** S

**Evidence (unverified):** The file header reads `/** Keychat Simulator - Debug Version / Testing without TourWrapper to isolate blank screen issue */`, and line 47 executes `console.log('KeychatSimulator render - selectedChat:', selectedChat, 'activeTab:', activeTab)` on every render, unguarded. Across src/simulators there are 128 `console.log` statements — e.g. DamusSimulator.tsx:60,73,81,87,97,107,133,144,152,162,167,169,185 and CoracleSimulator.tsx:58,76,86,95,100,106,117,133,149,166,182,196. damus/screens/LoginScreen.tsx:31 and damus/screens/SettingsScreen.tsx:25 also call native `alert()` on copy.

**Impact:** Noisy console on ten public pages, a per-render log in Keychat that costs measurable time during scroll, and a file header that tells any reader the code is unfinished. The `alert()` blocks the main thread and looks broken next to the toast pattern every other simulator uses.

**Suggested fix:** Strip console.log via esbuild `drop: ['console']` in the Vite build config (astro.config.mjs already has a `vite.build` block), rewrite the Keychat header comment, and replace the two `alert()` calls with the copy-confirmation state the other simulators already implement.

### 96. [medium] MobilePhoneFrame is hydrated with client:load despite having zero interactivity, and Damus uses min-h-screen inside it

**Area:** simulators · **File:** `src/pages/simulators/damus.astro`:35 · **Effort:** S

**Evidence (unverified):** `<MobilePhoneFrame client:load platform="ios">` — identical in amethyst.astro:35, olas.astro:35, keychat.astro:35, yakihonne.astro:35. MobilePhoneFrame.tsx (115 lines) has no useState, no useEffect and no event handlers; it is pure markup. The directive creates a second React root plus a 2.4 KB chunk (dist/_astro/MobilePhoneFrame.DyqyehZF.js) and nests one island inside another. Separately, the frame is constrained to `aspect-[9/19.5] max-h-[80vh]` (lines 47-48) while damus screens set `min-h-screen`: LoginScreen.tsx:53, HomeScreen.tsx:51, ProfileScreen.tsx:28,49, ComposeScreen.tsx:52, SettingsScreen — six occurrences. The other four phone-framed simulators have zero.

**Impact:** Unnecessary hydration on five pages. More visibly, Damus's screens demand 100vh of height inside a ~720px frame, so login/profile content is taller than the phone and must be scrolled, and HomeScreen.tsx:109's `style={{ height: 'calc(100% - 140px)' }}` creates a second nested scroll container inside the first.

**Suggested fix:** Drop `client:load` from MobilePhoneFrame — an Astro-rendered framework component without a directive is static HTML, which is exactly what is wanted. Replace `min-h-screen` with `min-h-full`/`h-full` in the six damus screens.

### 97. [medium] Every simulator page ships 636-777 KB of uncompressed JS+CSS

**Area:** simulators · **File:** `src/pages/simulators/amethyst.astro`:- · **Effort:** M

**Evidence (unverified):** Walking the full import graph of the (stale) dist build: amethyst 777.0 KB (560.0 JS + 217.1 CSS, 71 chunks), snort 770.7 KB, yakihonne 767.3 KB, primal 748.0 KB, damus 718.9 KB, coracle 709.9 KB, gossip 678.2 KB, olas 636.5 KB, keychat 635.7 KB, nostr-kitten 564.7 KB. Baseline (homepage) is 564.7 KB, so the simulator itself adds 70-212 KB. Simulator-specific chunks total 621.5 KB across the suite (503.5 KB JS + 118.0 KB CSS). The dominant fixed cost is the shared 193 KB _slug_.B1SINYHZ.css and the 182.7 KB React client runtime, both site-wide. Mock data is correctly deduplicated into one 70.6 KB chunk (index.D3oRKeJO.js) shared by all simulators.

**Impact:** Snort and Amethyst are the two heaviest routes on the site. On a slow mobile connection the phone-frame simulators — the ones most likely to be opened on a phone — are the worst experience. The 7,217 lines of hand-written theme CSS across 11 files is a large share of that and is almost entirely re-expressible in Tailwind tokens.

**Suggested fix:** Nothing here is on fire — the chunking is correct and mock data is shared. The win is structural: consolidating the duplicated LoginScreen/NoteCard/wrapper code (see the duplication finding) shrinks both the JS and the per-simulator CSS. Also verify the 193 KB global CSS is actually needed on simulator pages, which render almost no prose.

### 98. [medium] 4,270 lines of AI agent scratch reports are checked into src/simulators/

**Area:** simulators · **File:** `src/simulators/amethyst/analysis/discrepancy_report.md`:1 · **Effort:** S

**Evidence (unverified):** Inside the source tree: amethyst/analysis/ holds improvement_priorities.md (542), missing_features.json (541), RESEARCH_REPORT.md (452), discrepancy_report.md (511), ui_issues.md (317), current_state.json (401); plus amethyst/VALIDATION_REPORT.md (375), IMPLEMENTATION_SUMMARY.md (222), IMPLEMENTATION.md (128), olas/DESIGN_SPEC.md (378), olas/RESEARCH_REPORT.md (83), gossip/IMPLEMENTATION.md (81), damus/README.md (94), simulators/README.md (145). Total 4,270 lines. VALIDATION_REPORT.md claims '✅ ALL CHECKS PASSED / No TypeScript errors' — the same directory has five TS errors in SettingsScreen.tsx alone. simulators/README.md:31-45 documents a SimulatorProvider/SimulatorShell API that no simulator uses and that esbuild cannot parse.

**Impact:** Documentation that actively lies about the state of the code. A maintainer reading VALIDATION_REPORT.md or README.md will build the wrong mental model and waste time. These are also indexed by any repo-wide search, drowning real code hits.

**Suggested fix:** Move everything under docs/ (the repo already has docs/plans/) or delete it. Source directories should contain source. If simulators/README.md is kept, rewrite it to describe what actually exists: ten independent simulators sharing useParentTheme and MobilePhoneFrame.

### 99. [medium] Accessibility: 51 images without alt text, 2 aria-labels across 380 buttons

**Area:** simulators · **File:** `src/simulators`:- · **Effort:** M

**Evidence (unverified):** `grep -rn '<img' src/simulators --include='*.tsx' | grep -v 'alt='` returns 51 matches. Across the same files there are 380 `<button` occurrences and exactly 2 `aria-label` attributes. Most simulator action buttons are icon-only — e.g. damus/components/NoteCard.tsx:146-193 renders five bare `<button className="damus-action-btn">` elements containing only an inline `<svg>`, with no accessible name for reply, repost, like, zap or share.

**Impact:** A screen-reader user hears five unlabelled buttons per post and cannot tell reply from zap. Images announce as filenames or nothing. On a site whose stated mission is onboarding newcomers to Nostr, the interactive centrepiece is unusable without sight.

**Suggested fix:** Add `aria-label` to every icon-only button and `alt=""` (decorative) or a real description to every img. This is mechanical but touches ~430 sites, which is another argument for consolidating NoteCard into one shared component first — fixing it once there covers most of the buttons.

### 100. [medium] 404 page is English-only and dumps six of seven locales out of their language

**Area:** testing-ci-ops · **File:** `src/pages/404.astro`:5-90 · **Effort:** M

**Evidence (unverified):** There is exactly one 404 route (find src/pages -name '404*' returns only 404.astro; dist has only 404.html). Every string is hardcoded English — `const title = 'Page Not Found'`, "The page you're looking for doesn't exist or has been moved", and the four card labels Home/Guides/Tools/Glossary. It imports no useTranslation and calls no t(). All four suggestion links are unprefixed English routes: href="/", "/guides", "/tools", "/glossary". The site serves six prefixed locales (/pl, /es, /de, /zh, /ar, /hi) and Vercel serves this single 404.html for all of them.

**Impact:** A German, Chinese, Arabic or Hindi reader who mistypes a URL gets an English error page whose only escape routes land them on English content, silently ending their localized session. For Arabic the page also renders LTR with no dir=rtl. That is 6 of 7 locales — and the project has invested in 7 full guide translations and hreflang.

**Suggested fix:** Detect the locale from Astro.url.pathname in the frontmatter, run the copy through the existing i18n helpers (src/i18n/index.ts getValue already falls back to English per key), and prefix the four suggestion hrefs with the detected locale. Add a Pagefind search box — Pagefind is already a dependency and a 404 is where site search is most valuable.

### 101. [medium] useTranslation runs a 100ms polling interval per mounted component across 47 call sites

**Area:** testing-ci-ops · **File:** `src/hooks/useTranslation.ts`:22-27 · **Effort:** S

**Evidence (unverified):** The hook's useEffect installs `setInterval(() => { const currentLocale = getCurrentLocale(); if (currentLocale !== locale) setLocale(currentLocale); }, 100)` with the comment "Also check for changes periodically (for programmatic navigation)". getCurrentLocale (src/i18n/index.ts:21-29) reads window.location.pathname and runs six startsWith comparisons. 39 distinct components call useTranslation() across 47 call sites, and the site uses 431 client:load directives, so every hydrated component instance carries its own timer for the page's lifetime. The effect's dependency array is [locale], so it also tears down and reinstalls on every locale change.

**Impact:** A guide page with 15 hydrated islands runs 150 timer callbacks per second, forever, on a page whose locale can only change via a full navigation on a statically-generated site. This is pure battery and CPU drain on mobile, and it is precisely the class of defect that no build step, no manual QA checklist, and no pageview analytics will ever surface.

**Suggested fix:** Delete the interval. On a static site the pathname cannot change without a document load; the existing popstate listener already covers the only in-page case. If a belt-and-braces signal is wanted, lift locale to a single module-level store subscribed by all consumers rather than one timer per component.

### 102. [medium] All seven locale bundles ship to every visitor in one 516 KB eager chunk

**Area:** testing-ci-ops · **File:** `src/hooks/useTranslation.ts`:3 · **Effort:** M

**Evidence (unverified):** The hook statically imports from '../i18n', whose index eagerly builds a `translations` map over every locale JSON. dist/_astro/useTranslation.Ck1Rc9K8.js is 516 KB — the largest chunk in a 3.1 MB _astro directory — and I confirmed it contains German ("Willkommen"), Spanish ("Bienvenido"), Chinese ("欢迎"), Arabic ("مرحب") and Polish ("Witaj") strings simultaneously. The source JSONs total ~773 KB: de 140 KB, en 127 KB, pl 126 KB, es 125 KB, zh 112 KB, hi 74 KB, ar 68 KB. Because 431 islands use client:load, this chunk is fetched and parsed eagerly on essentially every page.

**Impact:** An English reader downloads and parses Chinese, Arabic, Hindi, German, Spanish and Polish translation data they will never use, on every page, before the page becomes interactive. There is no bundle-size budget anywhere in the pipeline to catch this or stop it growing as locale eight is added.

**Suggested fix:** Split translations per locale and select at build time — the locale is known statically for every route since it is in the path — or use dynamic import() keyed on locale. Add a size assertion to CI (e.g. fail if any single _astro chunk exceeds 200 KB).

### 103. [medium] No WebSocket readyState guard on any of the 9 send() call sites; stopStreaming can throw InvalidStateError

**Area:** testing-ci-ops · **File:** `src/components/interactive/RelayPlayground.tsx`:1136 · **Effort:** S

**Evidence (unverified):** Grepping src/ (excluding simulators) for `readyState` returns zero results, against 9 `.send(` call sites in RelayFeedBrowser.tsx:85,125, RelayPlayground.tsx:1103,1136,1157,1365, OfficialAccountWidget.tsx:94, and ExportModal.tsx:184,332. The riskiest is stopStreaming at RelayPlayground.tsx:1133-1143, which does `wsRef.current.send(JSON.stringify(['CLOSE', subscriptionRef.current]))` outside any try/catch. wsRef.current is assigned at line 1098 immediately after `new WebSocket(...)`, i.e. while readyState is CONNECTING, and stopStreaming is bound to a user-facing button.

**Impact:** Clicking Start then Stop before the relay handshake completes calls send() on a CONNECTING socket, which throws InvalidStateError synchronously in a React event handler. With no ErrorBoundary mounted anywhere, that unmounts the island and leaves a blank area. The same pattern at line 1157 is in a cleanup path.

**Suggested fix:** Guard every send with `if (ws.readyState === WebSocket.OPEN)` and wrap the stop paths in try/catch. This is a two-line fix per site and is a good first candidate for a lint rule once ESLint exists.

### 104. [medium] No linter, formatter, or pre-commit hook — and the code already contains eslint-disable comments for a linter that is not installed

**Area:** testing-ci-ops · **File:** `src/components/follow-pack/ExportModal.tsx`:61 · **Effort:** M

**Evidence (unverified):** There is no .eslintrc*, no eslint.config.*, no .prettierrc*, no .husky/ and no lint-staged config in the repo, and neither eslint nor prettier is a declared dependency (prettier resolves only transitively through astro). Yet ExportModal.tsx:61 carries `// eslint-disable-line react-hooks/exhaustive-deps`, suppressing a rule that nothing enforces. Related unenforced conventions: 172 occurrences of console.log survive into the shipped dist/_astro/*.js bundles, including src/utils/gamification.ts:492 (`console.log('[saveGamificationData] Saved data with unlockedLevels:', ...)` on every write) and src/utils/nostrDirectory.ts:123, which logs the user-supplied Twitter handle being looked up.

**Impact:** React Hooks rules — exactly the rules that would have flagged the RelayFeedBrowser missing-cleanup and the useTranslation polling interval — are unenforced. Production consoles are noisy enough that a genuine error is hard to spot when debugging a user report, and handle lookups are logged verbatim.

**Suggested fix:** Add eslint with eslint-plugin-react-hooks and eslint-plugin-astro, plus prettier, and run both in CI. Configure esbuild to drop console.* in production builds via vite.esbuild.drop, or replace the debug logs with a DEV-gated logger.

### 105. [medium] NIP-05 checker fetch has no timeout, so a black-holing domain spins the UI indefinitely

**Area:** testing-ci-ops · **File:** `src/components/interactive/NIP05Checker.tsx`:151-154 · **Effort:** S

**Evidence (unverified):** checkNIP05 loops over two candidate URLs and calls `await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })` with no signal and no AbortController; isChecking is only cleared in the finally at line 241, which cannot run until fetch settles. The project already knows the right pattern in two other places: src/utils/nostrDirectory.ts:126-139 uses an AbortController with a 30s timeout, and RelayPlayground.tsx:284 uses `AbortSignal.timeout(5000)`. NIP05Checker got neither. src/components/interactive/OfficialAccountWidget.tsx:67 has the same untimed fetch.

**Impact:** The user types any domain whose server accepts the TCP connection and never responds — a common state for an abandoned NIP-05 host, which is precisely what this tool is for diagnosing — and the Verify button stays in its spinner for the browser's default timeout, up to ~300s in Chrome, with no cancel affordance and no error. The tool appears broken.

**Suggested fix:** Pass `signal: AbortSignal.timeout(8000)` to both fetches and map AbortError to the existing errorType: 'network' branch, which already has localized copy at NIP05Checker.tsx:66-70.

### 106. [medium] Build artifacts leak into production: .DS_Store, duplicate privacy policies, and 'copy'-suffixed files

**Area:** testing-ci-ops · **File:** `public/.DS_Store`:- · **Effort:** S

**Evidence (unverified):** public/.DS_Store (6,148 bytes) is copied to dist/.DS_Store and served — .gitignore excludes .DS_Store from git but Astro copies everything in public/ regardless. public/ also contains 'favicon copy.ico' (15 KB) and 'site copy.webmanifest', both present in dist with the literal space in the filename. Most consequentially, public/privacy.html is a standalone hand-written privacy policy that ships to /privacy.html, while src/pages produces a second one at /privacy (dist/privacy/index.html). Both read "Last updated: February 2025" — 17 months stale relative to today — and they are maintained in two entirely different places with no link between them.

**Impact:** The .DS_Store leaks the maintainer's local directory listing. Two privacy policies at two URLs is a genuine compliance hazard: update one and the other silently contradicts it, and there is nothing in the repo tying them together. The 'copy' files are dead weight served on a domain that cares about polish.

**Suggested fix:** Delete public/.DS_Store, 'public/favicon copy.ico', 'public/site copy.webmanifest' and public/privacy.html (keeping the Astro-rendered /privacy), add `public/**/.DS_Store` to .gitignore, and refresh the policy date.

### 107. [medium] README documents an environment variable nothing reads and a placeholder issue URL

**Area:** testing-ci-ops · **File:** `README.md`:214-221 · **Effort:** S

**Evidence (unverified):** The README's Environment Variables section instructs contributors to create a .env with `PUBLIC_SITE_URL=http://localhost:4321`. Grepping src/ and astro.config.mjs for PUBLIC_SITE_URL returns nothing, and grepping all of src/ for `import.meta.env` or `process.env` returns zero hits outside simulators — astro.config.mjs:13 hardcodes `site: "https://nostrich.love"`. No .env or .env.example exists. Separately, line 243 tells contributors to file bugs at https://github.com/yourusername/nostrich-love/issues, an unfilled placeholder; the real repo is piotr-e8/nostrich-love. Line 237 states the entire contribution test requirement as "Test your changes locally with npm run build" — which, per the typecheck finding, validates nothing about types.

**Impact:** A contributor follows the setup instructions, creates a .env that has no effect, and then cannot file the issue they were told to file. The absence of any env plumbing also means there is no dev/prod separation at all: ExportModal.tsx:23-27 publishes signed kind-39089 events to wss://relay.damus.io, wss://nos.lol and wss://nostr.mom identically from localhost and production, so local testing writes permanent public records to the real Nostr network.

**Suggested fix:** Delete the PUBLIC_SITE_URL section or actually wire it into astro.config.mjs's `site`. Fix the issues URL. Introduce an import.meta.env.DEV check in ExportModal so local runs target a throwaway relay or a dry-run mode.

### 108. [medium] Locale key coverage varies 41%-100% with no parity check anywhere in the pipeline

**Area:** testing-ci-ops · **File:** `src/i18n/locales/hi.json`:- · **Effort:** S

**Evidence (unverified):** Counting leaf values per locale JSON: en 2032, zh 2032, de 2014, es 1969, pl 1831, ar 1046, hi 829. Hindi is at 41% of English and Arabic at 51%. src/i18n/index.ts:45-67 does fall back to English per missing key (so users see English rather than raw keys), but t() at line 38 returns the raw dot-path when a key is missing in both — meaning a typo renders as literal text like `nip05Checker.errors.invalidFormat.title` on the page. 24 call sites use the `t('key') || 'fallback'` idiom (e.g. RelayFeedBrowser.tsx:176), which can never fire because t() returns a truthy key string on miss. Nothing checks any of this; there is no locale-parity script and no CI. The repo also contains fix_json.py at its root — an untracked one-off Python script that hand-patches an unescaped quote in zh.json — evidence that a syntactically broken locale file previously reached the tree.

**Impact:** Hindi and Arabic readers get roughly half an English page under a Hindi/Arabic URL and hreflang tag, which is a worse experience than a clean English page and is what Google penalizes as a mismatched localized version. A deleted or renamed key surfaces as raw developer text in production with nothing to catch it.

**Suggested fix:** Add a CI script that diffs key sets across all seven locale JSONs against en.json and fails (or warns with a threshold) on drift, plus a JSON.parse validity check. Delete the dead `|| 'fallback'` idiom or make t() return undefined on a total miss so the fallback actually works.

### 109. [medium] Guide pages contain no prev/next links in HTML — the only in-page forward link is the footer FAQ

**Area:** ux-funnel · **File:** `src/pages/[...lang]/guides/[slug].astro`:284-295 · **Effort:** M

**Evidence (unverified):** GuideNavigation and ContinueLearning are both `client:load` React islands that compute prev/next from `window.location.pathname` at runtime. Parsing dist/guides/what-is-nostr/index.html and dist/guides/keys-and-security/index.html, the complete set of /guides/* links in each is `['/guides/', '/guides/faq']` — both from the Footer. The MDX bodies confirm it: what-is-nostr.mdx ends with a quiz and one FAQ link; keys-and-security.mdx ends with cautionary tales and one FAQ link. Neither contains a single link to the next guide.

**Impact:** Crawlers see the 16 guides as near-isolated nodes linked only from a hub that itself renders no links (see finding 1). For users, the forward path appears only after hydration, and only a fraction of it: GuideNavigation renders a pulsing placeholder first. Someone who finishes the keys guide — with a freshly generated nsec in hand, the highest-intent state on the site — is offered a link to the FAQ.

**Suggested fix:** Render prev/next as static Astro anchors from the server-computed GUIDE_ORDER (already available at [slug].astro:149-162) and let the island enhance them. Hand-write an explicit 'Next: …' CTA at the end of each MDX body, especially keys-and-security → quickstart.

### 110. [medium] Non-English visitors have no localized entry point and the language switcher silently does nothing on most pages

**Area:** ux-funnel · **File:** `src/components/LanguageSwitcher.tsx`:58-62 · **Effort:** M

**Evidence (unverified):** `switchLanguage` does `hasLocalizedVersions(currentPath) ? localePath(...) : stripLocale(currentPath)`. i18n/paths.ts:87-90 restricts hasLocalizedVersions to `/guides*` only. On `/`, `/tools`, `/follow-pack`, `/simulators`, `/glossary` or any /nostr-for-* page, picking 'Polski' resolves to the identical path and reloads the same English page. The build confirms there is no localized homepage: dist/pl and dist/zh contain only a `guides` directory; dist/pl/index.html does not exist.

**Impact:** Six of seven supported locales have zero translated landing surface. A Spanish or Hindi speaker who reaches nostrich.love sees an English homepage, uses the visible language switcher, and the page reloads unchanged — indistinguishable from a broken button. Roughly 640 KB of translated content exists but is only reachable by someone who first navigates to /guides in English.

**Suggested fix:** Short term: disable or grey out the switcher on untranslated routes with a tooltip ('Guides are available in Polski'), or make it deep-link straight to /pl/guides. Medium term: translate the homepage — it is the single highest-value page and the only one every visitor sees.

### 111. [medium] The interest filter on /guides returns 0–3 results, most of them locked

**Area:** ux-funnel · **File:** `src/pages/[...lang]/guides/index.astro`:38-46 · **Effort:** S

**Evidence (unverified):** The guide objects built server-side contain id/title/description/estimatedTime/category/difficulty/href — no `tags` field. GuideSection.tsx:128-135 therefore always falls back to substring matching on title+description. Testing the six filter values from InterestFilter.tsx:22-28 against the English frontmatter: bitcoin→1 (zaps-and-lightning, Intermediate/locked), privacy→1 (privacy-security, Advanced/locked), security→2, relays→3, tools→2, community→1. Only 1 of 16 English guides has a `tags:` field at all.

**Impact:** 'Filter by interest' is the most prominent interactive control on the guides hub. A first-time visitor who picks 'Bitcoin' — the most likely self-identification for this audience — gets an empty-state Sparkles icon under Beginner and two padlocked sections. The personalization affordance actively produces a dead end.

**Suggested fix:** Add `tags` to every guide's frontmatter, pass them through the guides/index.astro mapping, and hide filter chips that would return zero unlocked results for the current user.

### 112. [medium] Progress and Settings are unreachable from the header by keyboard or touch

**Area:** ux-funnel · **File:** `src/components/layout/Header.astro`:85-97 · **Effort:** S

**Evidence (unverified):** The user menu is `<div class="relative group">` containing a `<button>` with no click handler, and a panel revealed purely by `opacity-0 invisible group-hover:opacity-100 group-hover:visible`. There is no `focus-within` rule and `aria-expanded="false"` is hardcoded and never updated — confirmed unchanged in the built dist/index.html. On mobile the links exist in the separate mobile menu, so the gap is desktop keyboard users and touch devices at desktop widths (iPad).

**Impact:** The progress dashboard — the payoff surface for the entire gamification system — cannot be opened without a mouse. The static `aria-expanded="false"` also misreports state to screen readers. Combined with the commented-out /badges links, the whole reward layer is close to undiscoverable.

**Suggested fix:** Convert to a real disclosure button with a click handler and `aria-expanded` state, or at minimum add `group-focus-within:` variants. Better for growth: surface a small progress ring directly in the header that links to /progress in one click.

### 113. [medium] No site search despite pagefind being a declared dependency

**Area:** ux-funnel · **File:** `package.json`:31 · **Effort:** S

**Evidence (unverified):** `"pagefind": "^1.4.0"` is listed in dependencies, but the build script is a bare `astro build` with no pagefind step, `dist/pagefind` does not exist, and grepping src/ for 'pagefind' returns only the package.json line. The only search affordances are the guides-hub input (title/description of 16 guides, GuidesContainer.tsx:140-147) and the glossary input (glossary.astro:205-225, client-side show/hide of 26 hardcoded terms).

**Impact:** Across 151 built routes — 16 guides x 7 locales, 10 simulators, 8 landing pages, a glossary and five tools — a beginner asking 'how do I back up my key' has no way to find the answer. Search is the primary navigation mode for reference content, and its absence pushes people back to Google, where they may not return.

**Suggested fix:** Wire pagefind into the build (`astro build && pagefind --site dist`) and add a search input to the header. It is already paid for as a dependency.

### 114. [medium] /glossary and /resources are terminal pages that leak traffic off-site

**Area:** ux-funnel · **File:** `src/pages/glossary.astro`:9-114 · **Effort:** S

**Evidence (unverified):** All 26 glossary entries are plain text — the file contains no `href` to any guide, tool or landing page, and there is no CTA section after the Quick Reference block. /resources is worse: every entry in resourceCategories (resources.astro:9-106) is rendered with `target="_blank"` (line 143-146) pointing to damus.io, iris.to, coracle.social, stacker.news, and the single page CTA (line 180-190) sends users to GitHub.

**Impact:** /glossary is a natural SEO landing page for term searches ('what is an npub', 'what is a nostr relay') and it gives arriving users nothing to click. /resources is a pure outbound leak — the site does the work of ranking for 'nostr resources' and then hands every visitor to a third party with no path back into the funnel.

**Suggested fix:** Link each glossary term to the guide that teaches it (npub/nsec → keys-and-security, Relay → relays-demystified, Zap → zaps-and-lightning) and add a 'Still confused? Start here' CTA. On /resources, precede each external group with the internal guide that explains it, and change the page CTA from GitHub to /guides or /follow-pack.

### 115. [medium] The 'Start Tour' button does nothing on the Gossip and Coracle simulators

**Area:** ux-funnel · **File:** `src/components/navigation/SimulatorSidebar.tsx`:37-47 · **Effort:** M

**Evidence (unverified):** tourIdMap includes `gossip-tour` and `coracle-tour`, and the sidebar always renders the purple Start Tour button (lines 253-281), which calls `resetTourProgress(tourId)` then dispatches `start-${tourId}`. But src/data/tours/ contains only amethyst, damus, keychat, olas, primal, snort and yakihonne configs, and gossip.astro:23-38 / coracle.astro:23-38 mount the bare GossipSimulator/CoracleSimulator rather than a *WithTour wrapper — so nothing listens for those events.

**Impact:** Two of the nine simulators present a prominent primary-coloured 'Start Tour' CTA that silently no-ops. The guided tour is the only thing that turns a static mock UI into an actual learning experience; without it a user clicking into Gossip sees an unexplained desktop client and leaves.

**Suggested fix:** Either author gossip-tour.ts and coracle-tour.ts and wrap those two simulators, or hide the tour button when `tourIdMap[currentClient]` has no matching config.

### 116. [medium] Follow-pack's closing CTA scrolls the user back to the top of the page instead of to the tool

**Area:** ux-funnel · **File:** `src/pages/follow-pack.astro`:240-248 · **Effort:** S

**Evidence (unverified):** The final 'Ready to Build Your Network? … Get Started' button is `href="#main-content"`. `id="main-content"` is on the `<main>` element at line 14, which begins with the hero section — the tool itself (`<FollowPackFinder client:load />`) is in the next section at line 59 and has no id.

**Impact:** A user who has read the full page — the How It Works steps, the ten categories, the five FAQs — and is finally convinced, clicks 'Get Started' and is thrown back to the hero they already read. The follow-pack builder is the site's closest thing to a conversion event ('I now have a feed'), and its bottom-of-funnel CTA misfires.

**Suggested fix:** Give the tool section an id (`id="finder"`) and point the CTA at it. Same class of bug worth checking on the other long-scroll pages.

### 117. [medium] Resume banner's dismiss button is absolutely positioned with no positioned ancestor

**Area:** ux-funnel · **File:** `src/components/navigation/ResumeBanner.tsx`:178 · **Effort:** S

**Evidence (unverified):** The dismiss control uses `className="absolute top-4 right-4 sm:static …"`. Neither the outer wrapper (line 90-95, `w-full bg-gradient-to-r …`), the container (line 96), nor the flex row (line 97) carries `relative` — the string 'relative' does not appear in the file. Below the `sm` breakpoint the X therefore positions against the initial containing block, landing at the top-right of the document with no z-index, under the `sticky top-0 z-50` header.

**Impact:** On mobile, the returning-visitor banner — the site's main re-engagement surface on the homepage — has an X that floats over or behind the header instead of sitting on the banner. Users who can't dismiss it see it push the hero down on every visit.

**Suggested fix:** Add `relative` to the outer wrapper div, or drop the `absolute` variant entirely and let the button sit in flow on mobile.

### 118. [medium] There is no way to get a Nostr identity in the '2 minutes' the homepage promises

**Area:** ux-funnel · **File:** `src/pages/index.astro`:142-144 · **Effort:** M

**Evidence (unverified):** The hero subtext reads 'Free • No account required • 2 minutes to get started' and the CTA goes to /guides/what-is-nostr, a 5-minute conceptual read ending in a quiz with no next-step link (what-is-nostr.mdx tail links only to /guides/faq). The KeyGenerator component lives at keys-and-security.mdx:104 and on /tools (tools.astro:85) — nowhere on the homepage. Taking the 'First Steps' card to /guides/quickstart instead surfaces a PrerequisiteWarning (quickstart.mdx frontmatter declares prerequisites what-is-nostr + keys-and-security), then routes to keys-and-security, which offers no link back to quickstart.

**Impact:** Shortest honest path from homepage to a working keypair is roughly four clicks plus two article reads, and the return leg from the keys guide to quickstart does not exist — the user has to navigate back manually. The headline promise and the actual experience diverge at the very first click, which is where trust in a beginner guide is won or lost.

**Suggested fix:** Put the KeyGenerator on the homepage, below the fold, behind a 'Get your Nostr identity now (10 seconds)' expander. It runs entirely in-browser, needs no signup, and is the single most convincing artifact the site owns. Add an explicit 'Next: Quickstart' CTA at the end of keys-and-security.mdx.

### 119. [low] role="alert" on static guide callouts fires on page load

**Area:** accessibility · **File:** `src/components/ui/Callout.tsx`:80 · **Effort:** S

**Evidence (unverified):** `Callout` hard-codes `role="alert"` on its container regardless of whether the content is dynamic. It is a static MDX component used in 8 English guide files (and their translations), so several assertive alerts are present in the DOM at load time.

**Impact:** `role="alert"` is an assertive live region: on page load screen readers interrupt whatever they are reading to announce each callout body, before the user reaches the guide's own heading. Misuse of 4.1.3 rather than a strict failure, but genuinely disruptive.

**Suggested fix:** Drop `role="alert"` for the static variants; keep it only when `variant === 'danger'` *and* the callout is rendered in response to a user action. Use `<aside aria-labelledby>` with the callout title for the static case.

### 120. [low] Progress bars render as bare divs with no progressbar semantics

**Area:** accessibility · **File:** `src/components/ui/ProgressBar.tsx`:47-59 · **Effort:** S

**Evidence (unverified):** ProgressBar.tsx:47-59 draws the track and fill as plain `<div>`s with an inline `width` percentage and no `role="progressbar"`/`aria-valuenow`/`aria-valuemin`/`aria-valuemax`. (The percentage *is* rendered as text at :38-43, which mitigates it.) The same omission appears in KeyGenerator.tsx:288-296 (entropy collection) and :388-397 (security acknowledgement), and PrivacySecurityQuiz.tsx:340-349 (answered count). Four other components do it correctly — LevelProgressBar.tsx:75, TourProgress.tsx:25, ProgressTracker.tsx:162 and :236 — so the pattern exists and just wasn't applied.

**Impact:** Screen readers announce a meaningless empty element instead of "progress bar, 60%"; the KeyGenerator entropy bar in particular gives no feedback that key generation is under way. WCAG 1.3.1 (A), 4.1.2 (A).

**Suggested fix:** Add `role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={label}` to the four bars, copying LevelProgressBar.tsx:75-79.

### 121. [low] Masked private key renders 63 bullet characters that screen readers spell out

**Area:** accessibility · **File:** `src/components/interactive/KeyGenerator.tsx`:458-460 · **Effort:** S

**Evidence (unverified):** `<span className={showPrivateKey ? "" : "blur-sm select-none"}>{showPrivateKey ? keys.nsec : "•".repeat(keys.nsec.length)}</span>` — an nsec is 63 characters, so when hidden the element contains 63 U+2022 bullets with no `aria-hidden` and no alternative text.

**Impact:** A screen reader reads "bullet bullet bullet…" 63 times, or 63 blank pauses depending on punctuation settings, where the useful information would be "private key hidden". The reveal toggle at :461-473 is correctly labelled, so this is the only gap. WCAG 1.3.1 (A).

**Suggested fix:** Wrap the mask in `aria-hidden="true"` and add a visually-hidden sibling reading `t('keyGenerator.keys.private.hidden')` when `!showPrivateKey`.

### 122. [low] 21 stale README/IMPLEMENTATION markdown files inside src/ describing code that has moved or died

**Area:** architecture · **File:** `src/components/interactive/README.md`:1 · **Effort:** S

**Evidence (unverified):** src/ contains 21 non-content .md files plus src/components/tour/IMPLEMENTATION_SUMMARY.ts (264 lines that are entirely comments in a .ts file). Several are wrong: components/interactive/README.md documents only 4 of the 30 files now in that directory and never mentions the 13 quiz components; components/navigation/README.md:96 documents `import { getGuidePrerequisites } from '../../lib/guideLoader'` — guideLoader.ts has zero real importers; components/interactive/damus/IMPLEMENTATION.md documents the dead second Damus simulator; src/simulators/amethyst/ alone carries IMPLEMENTATION.md, IMPLEMENTATION_SUMMARY.md, VALIDATION_REPORT.md and an analysis/ folder with 3 more reports. The repo root adds 18 more .md files (CODEBASE_AUDIT.md, LESSONS_*_LOCALE.md ×4, PHASE2_TESTING_REPORT.md, RULES.md, RULES_TEMPLATE.md …).

**Impact:** A new contributor's first move is to read the nearest README, and in this repo that README will point them at dead modules and describe a directory as having 4 components when it has 30. The docs actively slow onboarding rather than helping it, and the sheer volume (39 markdown files) makes it impossible to tell which are current.

**Suggested fix:** Keep one README per feature directory, delete the point-in-time reports (IMPLEMENTATION_SUMMARY, VALIDATION_REPORT, analysis/) or move them to docs/archive/, and convert tour/IMPLEMENTATION_SUMMARY.ts into a .md. Add a short 'where things live' section to the root README covering the pages/layouts/components/lib/data layering.

### 123. [low] Content collection schema uses .passthrough(), so frontmatter fields the code depends on are unvalidated

**Area:** architecture · **File:** `src/content/config.ts`:16 · **Effort:** S

**Evidence (unverified):** config.ts declares 8 optional fields then calls `.passthrough()` (line 16). src/pages/[lang]/guides/[slug].astro:216 branches on `guide.data.isCritical`, which is not in the schema and therefore typed as unknown-but-allowed. Frontmatter across the 16 English guides also includes `published`, `lastUpdated`, `difficulty` and `author` (1 file each) that no code reads and no schema documents. Only 13 of 16 guides declare `prerequisites` and 15 of 16 declare `priority`/`estimatedTime`, so the fields code treats as present are missing on some guides. Two collection directories are declared nowhere and empty: src/content/faq/ and src/content/tools/.

**Impact:** A typo like `isCritcal` in a new guide's frontmatter silently disables the prerequisite modal with no build error — .passthrough() guarantees it validates. Across 7 locales × 16 guides = 112 files, this is the kind of drift that goes unnoticed for months.

**Suggested fix:** Add `isCritical: z.boolean().optional()` and the other four observed fields to the schema and remove `.passthrough()` so unknown keys fail the build. Delete the empty faq/ and tools/ directories or define collections for them.

### 124. [low] 7,900 LOC of hand-written per-simulator CSS running parallel to Tailwind

**Area:** architecture · **File:** `src/simulators/snort/snort.theme.css`:1 · **Effort:** M

**Evidence (unverified):** 12 theme CSS files total 7,903 lines — snort 1,095, amethyst 1,084, gossip 923, yakihonne 809, nostr-kitten 698, primal-web 661, primal-mobile 645, damus 530, olas 356, coracle 288, keychat 128 — plus components/tour/tour.css at 686. src/styles/globals.css, the only Tailwind-layer stylesheet, is 387 lines. tailwind.config.js:4 scans `./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}` — note .css is not and cannot be in that list, so none of these 7,903 lines participate in Tailwind's purge or design tokens.

**Impact:** 95% of the project's CSS bypasses the design system: the theme tokens defined in tailwind.config.js and the CSS variables in Layout.astro:73-119 have no effect inside simulators. A brand colour change requires editing 12 CSS files by hand. It is defensible for the simulators (each deliberately mimics a different real client's look), but the volume means most CSS work in this repo happens outside the system.

**Suggested fix:** Leave the per-client theme files alone — the visual-fidelity goal justifies them — but extract the values each one shares (spacing scale, phone-frame chrome, base typography) into CSS custom properties in globals.css so cross-cutting changes are one edit. Document in src/simulators/README.md that theme CSS is intentionally outside Tailwind.

### 125. [low] Duplicate route for the Damus simulator, one of which renders without site chrome

**Area:** architecture · **File:** `src/pages/damus-demo.astro`:1 · **Effort:** S

**Evidence (unverified):** src/pages/damus-demo.astro (32 LOC) renders `<DamusSimulator client:load />` from src/simulators/damus with no Header and no Footer, while src/pages/simulators/damus.astro (44 LOC) renders `<DamusSimulatorWithTour />` from the same directory inside MobilePhoneFrame with a Header and SimulatorSidebar. Both are built and indexable. src/pages/nostr-for-photographers.astro.backup.mock is also sitting in the pages directory (Astro ignores it only because of the extension).

**Impact:** Two URLs serve the same simulator with different fidelity, splitting any link equity and giving Google a near-duplicate to choose between. /damus-demo is a dead end with no navigation. The stray .backup.mock file in a routes directory is one rename away from publishing itself.

**Suggested fix:** Delete damus-demo.astro (or make it a redirect to /simulators/damus) and move the .backup.mock file out of src/pages/ entirely.

### 126. [low] Junk files from public/ are published: .DS_Store, "favicon copy.ico", "site copy.webmanifest"

**Area:** build-health · **File:** `public/.DS_Store`:- · **Effort:** S

**Evidence (unverified):** After a build, dist contains `dist/.DS_Store` (6148 B, copied from public/.DS_Store), `dist/favicon copy.ico` (15,406 B) and `dist/site copy.webmanifest` (263 B). The .gitignore does list `.DS_Store` at the repo level, but public/.DS_Store is already committed and therefore copied. The two "copy" files are duplicates of favicon.ico (655 B) and site.webmanifest (634 B) — note the duplicate favicon is 23x larger than the real one.

**Impact:** ~22 KB of dead weight served from the CDN, and .DS_Store discloses the directory listing of public/ to anyone who requests it. Filenames containing spaces are also a minor hazard for any tooling that walks dist.

**Suggested fix:** Delete `public/.DS_Store`, `public/favicon copy.ico` and `public/site copy.webmanifest`, and add `**/.DS_Store` to .gitignore so it stops recurring.

### 127. [low] pagefind is a declared dependency but never runs and is referenced by nothing — the site has no search

**Area:** build-health · **File:** `package.json`:37 · **Effort:** S

**Evidence (unverified):** `"pagefind": "^1.4.0"` is a production dependency. The build script is `"build": "astro build"` with no `pagefind --site dist` postbuild step. After a full build, `dist/pagefind/` does not exist. Grep for `pagefind|Pagefind` across src/, scripts/ and astro.config.mjs returns zero hits, and there is no search component in src/components/.

**Impact:** No functional impact today because no UI expects it — but the dependency misrepresents the stack to anyone reading package.json (the project is described as using Pagefind search), and it is installed on every CI/Vercel build for nothing.

**Suggested fix:** Either remove the dependency, or wire it up properly: `"build": "astro build && pagefind --site dist"` plus a search island. Do not leave it half-declared.

### 128. [low] nostr-for-photographers.astro.backup.mock is dead weight but does NOT become a route

**Area:** build-health · **File:** `src/pages/nostr-for-photographers.astro.backup.mock`:1 · **Effort:** S

**Evidence (unverified):** Explicitly checked as requested. The file is 10,039 B in src/pages/. It does not produce a route: the build log lists `src/pages/nostr-for-photographers.astro` exactly once, `ls dist/nostr-for-photographers*` returns only the directory's index.html, and `find dist -iname "*backup*" -o -iname "*mock*"` matches only the unrelated `dist/_astro/BackupChecklist.BAF9WsEW.js` chunk. Astro only treats .astro/.md/.mdx/.html/.js/.ts under src/pages as pages, and the `.mock` suffix falls outside that set. It is also invisible to tsc and astro check. `diff` against the live nostr-for-photographers.astro shows exactly 4 diff lines — one changed import: `import FeaturedCreatorsFromPack from '../components/community/FeaturedCreatorsFromPack';` (backup, default import) vs `import { FeaturedCreatorsFromPack } from '...'` (live, named import).

**Impact:** Zero build or runtime impact — it breaks nothing and emits nothing. The only cost is confusion: it is a near-identical copy of a live page sitting in the routes directory, so a future contributor may edit the wrong file, and any future Astro change to page-extension handling would silently publish it.

**Suggested fix:** Delete it. The one-line difference it preserves (default vs named import of FeaturedCreatorsFromPack) is already resolved in the live file and recoverable from git history.

### 129. [low] Build environment drift: stale browserslist data, unused import warning, no engines pin

**Area:** build-health · **File:** `package.json`:5-11 · **Effort:** S

**Evidence (unverified):** Build log line 21: "Browserslist: browsers data (caniuse-lite) is 6 months old. Please run: npx update-browserslist-db@latest". Line 24: `[WARN] [vite] "Terminal" is imported from external module "lucide-react" but never used in "src/components/interactive/RelayPlayground.tsx"`. package.json has no `engines` field (local Node is v24.1.0; Vercel will choose its own default). No vercel.json exists, so the build command comes entirely from Vercel's Astro framework preset.

**Impact:** Stale caniuse data means autoprefixer emits prefixes for browsers no longer in the target set and may miss newly relevant ones — small CSS bloat plus a correctness risk. No engines pin means a Vercel Node default bump could change build behaviour with no local reproduction. Both are the kind of drift that turns a green build red without a code change.

**Suggested fix:** Run `npx update-browserslist-db@latest`, drop the unused `Terminal` import in RelayPlayground.tsx, and add `"engines": { "node": ">=20 <25" }` (matching whatever Vercel is actually running) to package.json.

### 130. [low] Two content collections are declared but empty, and priority/prerequisite metadata is inconsistent

**Area:** content-quality · **File:** `src/content/config.ts`:1-21 · **Effort:** S

**Evidence (unverified):** src/content/faq/ and src/content/tools/ exist as empty directories but config.ts declares only a `guides` collection, so both are dead scaffolding (FAQ and tools content live as guides instead). Within guides, `priority` is not unique or ordered — five guides share priority 2 (relays-demystified, nip05-identity, zaps-and-lightning, outbox-model, troubleshooting) while quickstart is 4 and multi-client is 11. estimatedTime is inconsistently formatted ("5 minutes", "10-15 minutes", "Reference guide"), and nip17-private-messages.mdx uses a different frontmatter shape entirely (published/lastUpdated/author/difficulty) that no other guide has and the schema only tolerates via `.passthrough()`.

**Impact:** Ordering in any priority-sorted UI is arbitrary among the five ties; the extra nip17 fields are silently unvalidated, so typos there would never be caught.

**Suggested fix:** Delete the empty directories, make priority unique, normalise estimatedTime, and either add the nip17 fields to the schema or align that file with the others.

### 131. [low] "More combinations than atoms in the observable universe" is false by roughly three orders of magnitude

**Area:** content-quality · **File:** `src/content/guides/en/faq.mdx`:90 · **Effort:** S

**Evidence (unverified):** faq.mdx:90: "**256-bit security:** Each key has more possible combinations than atoms in the observable universe." 2^256 ≈ 1.16×10^77; the standard estimate for atoms in the observable universe is ~10^80, so there are roughly 1,000x more atoms than keys. keys-and-security.mdx:96 uses the correct version of this analogy ("more possible private keys than grains of sand on Earth", ~10^19-10^24).

**Impact:** Minor on its own, but it is a checkable factual error in the site's most-read explainer and the kind of thing a technical reader will screenshot.

**Suggested fix:** Reuse the grains-of-sand phrasing from keys-and-security.mdx, or say "more than the number of stars in the observable universe" (~10^24), which is safely true.

### 132. [low] gamificationEngine.ts's own storage layer (getDefaultData/loadData/saveData) is dead duplicate code that would clobber state if used

**Area:** gamification-state · **File:** `src/utils/gamificationEngine.ts`:50-145 · **Effort:** S

**Evidence (unverified):** `getDefaultData()`, `loadData()` and `saveData()` are defined but never called — the uncommitted diff rewired `recordActivity` to `loadGamificationData`/`saveGamificationData` from gamification.ts and left these behind. `saveData` (line 141) does a raw `localStorage.setItem(STORAGE_KEY, JSON.stringify(data))` with no merge, unlike gamification.ts's `saveGamificationData` which merges against the stored value.

**Impact:** ~95 lines of duplicated schema definition and migration logic that must be kept in sync by hand and is silently divergent already (its `GamificationData.stats` is `Record<string, number | boolean>` versus the typed `GamificationStats` in gamification.ts, and it seeds badges from `GAMIFICATION_CONFIG.badges` rather than `BADGE_DEFINITIONS`). Any future call to `saveData` would blow away whatever another writer had just committed.

**Suggested fix:** Delete `getDefaultData`, `loadData`, `saveData`, the local `GamificationData` interface and the duplicate `STORAGE_KEY`/`CURRENT_VERSION` constants from gamificationEngine.ts.

### 133. [low] Selecting a relay or an account triggers four full JSON parse/stringify cycles, including one on mount with count 0

**Area:** gamification-state · **File:** `src/components/interactive/RelayExplorer.tsx`:385-393 · **Effort:** S

**Evidence (unverified):** The effect body runs `saveToLocalStorage(...)` then `recordActivity('selectRelays', { count: selectedRelays.size })` with deps `[selectedRelays, customRelays]`, so it fires once on mount with `size === 0`. `recordActivity` (src/utils/gamificationEngine.ts:170-179) then does `recordGamificationActivity()` (load+save) followed by `loadGamificationData()` + `saveGamificationData()` — four full parse/stringify passes over the whole blob per invocation. src/components/follow-pack/FollowPackFinder.tsx:51-54 has the identical mount-fire pattern.

**Impact:** Every checkbox toggle in the relay explorer and follow-pack finder costs four serialisations of the entire gamification object, and both components fire a no-op activity on mount that also stamps `lastActive`, feeding the streak bug above.

**Suggested fix:** Guard on `count > 0` (or on a ref that skips the first effect run) and collapse the double load/save inside `recordActivity` into one read-modify-write.

### 134. [low] badges.astro re-attaches click handlers on every refresh, producing duplicate modal opens

**Area:** gamification-state · **File:** `src/pages/badges.astro`:403, 406, 538-542 · **Effort:** S

**Evidence (unverified):** `updateBadgeGrid()` calls `card.addEventListener('click', ...)` inside its `forEach` with no removal, and `init()` registers a `storage` listener that calls `updateBadgeGrid()` again on every cross-tab write to the key.

**Impact:** After a second tab records any activity, each badge card carries two (then three, …) click handlers; the modal open/close animation is driven by shared `setTimeout`s so it visibly stutters or reopens.

**Suggested fix:** Attach the handlers once in `init()` using event delegation on `#badge-grid`, and have `updateBadgeGrid` only update classes/text.

### 135. [low] 14 console.log statements ship to production from the gamification hot path

**Area:** gamification-state · **File:** `src/utils/gamification.ts`:417, 419, 492, 1131, 1137, 1138, 1146-1151, 1249, 1257, 1267, 1270 · **Effort:** S

**Evidence (unverified):** `console.log` count: gamification.ts 14, gamificationEngine.ts 3, src/components/progress/ProgressTracker.tsx 2, src/lib/progress.ts 2. `saveGamificationData` logs `'[saveGamificationData] Saved data with unlockedLevels:'` on *every* write (line 492) and `ProgressTracker.tsx:35` logs the scroll percentage on every rAF above 50%.

**Impact:** A reader scrolling a guide floods their console with `[ProgressTracker] Scroll progress: NN%` and `[saveGamificationData] Saved data…`, and the internal storage shape is exposed to anyone opening devtools. Astro's static build does not strip these.

**Suggested fix:** Replace with a `DEBUG`-gated logger, or add a vite `esbuild.drop: ['console']` for production builds.

### 136. [low] Locked-guide cards always say "complete N more" with N = the full threshold, no matter how much the user has done

**Area:** gamification-state · **File:** `src/components/guides/GuideSection.tsx`:232-234 · **Effort:** S

**Evidence (unverified):** `.replace('{count}', String(unlockThreshold - completedCount))` where `completedCount` is state for the *current* (locked) level, populated from `getCompletedGuidesInLevel(level)` at line 103-104 — for a locked level that is always 0. The correct value, `previousLevelCompleted`, is computed two lines earlier at 150 and used correctly by `UnlockButton` (line 207) and `LevelProgressBar` (line 216).

**Impact:** A user who has completed 4 of the 5 required Beginner guides still sees "Complete 5 more beginner guides" on every locked Intermediate card, while the progress bar directly above it correctly shows 4/7. The contradiction reads as a bug and removes the near-completion motivation the copy is meant to create.

**Suggested fix:** Use `unlockThreshold - previousLevelCompleted` (clamped at 0).

### 137. [low] Zero automated tests cover the gamification and progress layer

**Area:** gamification-state · **File:** `-`:- · **Effort:** M

**Evidence (unverified):** `find src tests __tests__ -name '*.test.*' -o -name '*.spec.*'` returns nothing; package.json scripts are `dev`, `build`, `preview`, `astro`, `fetch-accounts`, `verify-seo` — no test runner is installed or configured.

**Impact:** Every finding above — the `unlockedAt`/`earnedAt` mismatch, the streak ordering bug, the `badge-earned`/`badge-awarded` mismatch, the three disagreeing unlock thresholds — is the kind of defect a dozen pure-function unit tests would have caught immediately. The storage layer is pure logic over a serialisable object and is unusually cheap to test.

**Suggested fix:** Add vitest with a jsdom/localStorage mock and cover: fresh-visitor load, streak day-0/day-1/day-2/day-3 transitions, corrupt-JSON recovery, quota-exceeded save, legacy `activePath` migration, and each badge's threshold.

### 138. [low] 723 keys exist in locale files that no code path reads

**Area:** i18n-parity · **File:** `src/i18n/locales/hi.json`:- · **Effort:** M

**Evidence (unverified):** Keys present in a locale but absent from en.json: hi 586, pl 192, es 192, ar 137, de 0, zh 0. Spot-checked eight of them for code references — `ui.buttons.copy`, `ui.common.readTime`, `ui.navigation`, `relayFeedBrowser.labels`, `troubleshootingWizard.problems`, `backupChecklist.items`, `clientRecommender.clients`, `protocolComparison.features` — all return 0 references outside the locale JSON. ar.json and hi.json invent whole parallel sections (`ui.buttons` with 16 extra entries, `ui.common` with 16, `clientRecommender.clients` with 59 in hi, a top-level `protocolComparison` section in hi that duplicates `protocolComparisonUI`). ar.json also carries a `_meta` block (`{"locale":"ar","name":"العربية","direction":"rtl"}`) that only exists in that one file and duplicates src/config/locales.ts. The pl/es extras are benign: 192 `options[].description` entries that en.json omits (the type allows it as optional).

**Impact:** Dead weight shipped to the client (all 7 bundles are statically imported in src/i18n/index.ts:7-13, so every visitor downloads all locales) and a misleading signal to translators that these strings are in use.

**Suggested fix:** Delete the orphan sections, drop `_meta` in favour of src/config/locales.ts, and switch src/i18n/index.ts to dynamic per-locale imports so a visitor doesn't download 773 KB of JSON to read one language.

### 139. [low] German has 46 untranslated prose values including 8 of 16 quiz titles

**Area:** i18n-parity · **File:** `src/i18n/locales/de.json`:- · **Effort:** S

**Evidence (unverified):** Comparing string values that are 3+ words and not structural (id/severity/correctId/url): de 46 of 952 byte-identical to English (4.8%), vs pl 2/817, es 2/854, zh 1/959, ar 0/414, hi 3/112. The German misses are systematic: every quiz title (`Relay Deep Dive Quiz`, `Lightning & Zaps Quiz`, `Tools & Utilities Quiz`, `Problem Solving Quiz`, `Multi-Client Usage Quiz`, `Advanced Privacy & Security Quiz`, `NIP-17 Private Messages Quiz`, `Nostr vs Fediverse`), all three whatIsNostr Q1 option labels, and roughly 30 `clientComparisonTable.clients.*.description/pros/cons` strings (`The most popular iOS client with a polished UI`, `Easy to use`, `Steeper learning curve`). Also `de/privacy-security.mdx` has a frontmatter `title` byte-identical to English. Two shared misses across pl/es: `guides.outboxModel.quiz.questions[4].explanation` and `clientRecommender.deviceOptions.ios.label`.

**Impact:** German is otherwise the most complete locale (only 18 missing keys), which makes the English quiz headings and client descriptions stand out as an obvious quality gap rather than a gradual one.

**Suggested fix:** Translate the 46 German strings — they are enumerable and the quiz titles alone are 8 of them.

### 140. [low] Hindi estimatedTime frontmatter mixes English, Devanagari numerals and Arabic numerals, breaking the reading-time parser

**Area:** i18n-parity · **File:** `src/content/guides/hi/nostr-tools.mdx`:4 · **Effort:** S

**Evidence (unverified):** Four Hindi guides still carry English values: nostr-tools.mdx:4 `"10 minutes"`, protocol-comparison.mdx:4 `"15 minutes"`, privacy-security.mdx:4 `"15 minutes"`, outbox-model.mdx:4 `"10-15 minutes"`. Two use Devanagari digits: multi-client.mdx:4 `"८ मिनट"` and nip05-identity.mdx:4 `"१०-१५ मिनट"`. src/pages/[lang]/guides/[slug].astro:119 parses this with `guide.data.estimatedTime?.match(/\d+/)?.[0] || '10'` — JS `\d` is ASCII-only, so both Devanagari values silently fall through to the hardcoded default of 10 and are then fed to `<MinimalProgressBar estimatedTimeMinutes={...}>` (:210). The other six locales are internally consistent.

**Impact:** Two Hindi guides display a reading-progress estimate derived from a fallback rather than their real length, and four show the duration in English on an otherwise Hindi page.

**Suggested fix:** Normalise the six values to Hindi text with ASCII digits (matching how ar.json/zh use ASCII digits), or make the parser Unicode-digit aware.

### 141. [low] Simulator pages nest a client:load island inside another client:load island

**Area:** islands-hydration · **File:** `src/pages/simulators/damus.astro`:35-36 · **Effort:** S

**Evidence (unverified):** `<MobilePhoneFrame client:load platform="ios"><DamusSimulatorWithTour client:load /></MobilePhoneFrame>` — the same nesting appears in amethyst.astro:35-36, keychat.astro:35-36, olas.astro:35-36 and yakihonne.astro:35-36. The outer component has no hooks or handlers at all. Each of these pages also hydrates SimulatorSidebar (line ~25), giving three islands plus the seven global ones. Measured damus page bundle: 353.0 KB min / 106.3 KB gzip. src/simulators totals 22,032 lines of TSX across 10 clients.

**Impact:** Astro must render the inner island's HTML into the outer island's slot and then hydrate both trees independently, doubling the hydration work for the frame. Because the simulator is the entire point of these routes it must be eager, but the bezel around it need not be.

**Suggested fix:** Drop `client:load` from MobilePhoneFrame so it renders as static HTML and the simulator hydrates as a single root inside it. Ideally convert MobilePhoneFrame to .astro (see the zero-interactivity finding).

### 142. [low] Astro's built-in link prefetch is not enabled, so every internal navigation is a cold request

**Area:** performance · **File:** `astro.config.mjs`:- · **Effort:** S

**Evidence (unverified):** grep for 'prefetch' in astro.config.mjs returns nothing — the `prefetch` option is absent, and Astro 5 does not enable it by default. There is no `data-astro-prefetch` usage in src/ either. The site is a multi-page guide with heavy internal cross-linking (16 guides per locale, guide navigation, prerequisite links, continue-learning widgets).

**Impact:** Every click on a guide link starts from zero: fresh HTML fetch plus, on a cold cache, the shared CSS and JS. Given a guide page's 1.34MB raw payload, perceived navigation latency is high on a content site whose entire model is reading several guides in sequence.

**Suggested fix:** Add `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }` (or 'hover' to be more conservative on data) to astro.config.mjs. One-line change with a large perceived-speed improvement for multi-page reading sessions.

### 143. [low] Trivial static components are shipped as client:load React islands, booting React on otherwise static pages

**Area:** performance · **File:** `src/components/layout/Header.astro`:37 · **Effort:** S

**Evidence (unverified):** Header.astro:37 renders `<LogoText client:load size="sm" />`. src/components/ui/LogoText.tsx has no useState, no useEffect, no event handlers — it is pure static JSX with Tailwind classes (the comment at line 19 confirms scramble/glitch were removed and the props are kept only for backward compatibility). Header.astro:42 renders `<GuidesLink client:load>`; src/components/navigation/GuidesLink.tsx renders a single `<a>` whose href it recomputes in useEffect from window.location.pathname — information Astro already has at build time. Both appear twice per page (header and footer).

**Impact:** These two components alone are enough to require React's 182KB raw / 57KB gzip runtime on pages that would otherwise need no JavaScript at all — for example a purely static glossary or about page. The GuidesLink pattern also produces a brief hydration correction of the href.

**Suggested fix:** Convert LogoText to a plain .astro component (a mechanical translation — it has no interactivity). Replace GuidesLink with a build-time computed href passed from the page's known locale. Together with similar treatment for DarkModeToggle (which can be ~15 lines of inline vanilla JS), several routes could drop React entirely.

### 144. [low] 83 infinite CSS animations plus site-wide compositing effects keep the main thread and compositor permanently busy

**Area:** performance · **File:** `src/styles/globals.css`:221-231 · **Effort:** S

**Evidence (unverified):** globals.css:221-231 defines `@keyframes flame-pulse` applied with `animation: flame-pulse 2s ease-in-out infinite`, and lines 334-344 do the same for `completion-pulse 2s ease-in-out infinite`. Across src/ there are 61 uses of `animate-pulse` and 22 of `animate-spin` (both infinite in Tailwind). Layout.astro:149 puts `transition-colors duration-200` on `<body>`, and Header.astro:29 combines `sticky top-0` with `backdrop-blur-md` (31 backdrop-blur usages total across the codebase).

**Impact:** Infinite animations prevent the page from ever reaching a genuinely idle state, which sustains CPU wakeups and battery drain. A full-width `backdrop-filter` on a sticky header forces the compositor to re-blur the region behind it on every scroll frame — a well-known source of scroll jank on low-end Android.

**Suggested fix:** Audit the animate-pulse usages: most are loading skeletons that should stop once content arrives. Gate the decorative infinite animations (flame-pulse, completion-pulse) behind an intersection observer so they only run while visible. Consider dropping backdrop-blur on the sticky header in favour of a solid or high-opacity background on mobile breakpoints.

### 145. [low] Development artifacts and duplicate files are deployed to production

**Area:** performance · **File:** `public/simulators`:- · **Effort:** S

**Evidence (unverified):** The build emits 12 .md files into dist/, including dist/simulators/ASSETS_AGENT_REPORT.md (7,380 bytes), dist/simulators/ICON_MAPPING.md, dist/simulators/references/REFERENCE_GUIDE.md (8,930 bytes) and six per-client README.md files. Also shipped: dist/test-progress.html (4,091 bytes), 'dist/favicon copy.ico' (15,406 bytes) and 'dist/site copy.webmanifest' (263 bytes). These originate from public/, which Astro copies verbatim.

**Impact:** Minor deploy-size cost, but these are publicly reachable URLs exposing internal agent reports and asset-mapping notes, and the 'copy' files are dead weight that will confuse future maintenance. dist/ is 20MB total, of which 2.52MB is images.

**Suggested fix:** Move the .md documentation out of public/ into a non-served docs directory (docs/ already exists), and delete test-progress.html, 'favicon copy.ico' and 'site copy.webmanifest'.

### 146. [low] Duplicate font preconnect hints emitted by both Layout and SEO components

**Area:** performance · **File:** `src/components/SEO.astro`:124-125 · **Effort:** S

**Evidence (unverified):** SEO.astro:124-125 emits preconnect for fonts.googleapis.com and fonts.gstatic.com, and SEO.astro:126 adds a dns-prefetch. Layout.astro:136-137 emits the identical two preconnects. Since Layout renders SEO, the built HTML contains both sets — verified in dist/index.html, which shows fonts.googleapis.com preconnect twice and fonts.gstatic.com preconnect twice.

**Impact:** Browsers deduplicate preconnects so there is no extra connection, but it wastes head bytes on every one of 155 pages and signals that resource hints are managed in two places, which invites drift. The dns-prefetch is also redundant alongside a preconnect to the same origin.

**Suggested fix:** Keep the hints in exactly one place — SEO.astro is the natural home — and remove Layout.astro:136-137. Drop the redundant dns-prefetch on line 126. This becomes moot entirely if fonts are self-hosted per the font finding above.

### 147. [low] CHANGELOG.md's most recent entry is 5 months old and predates three locales and the routing refactor

**Area:** repo-hygiene · **File:** `CHANGELOG.md`:7 · **Effort:** S

**Evidence (unverified):** The file has a single `## [Unreleased]` section whose newest dated entries are '(2026-02-14)'. `git log -1 -- CHANGELOG.md` = 2026-02-14, commit d505771. Since then the repo gained Chinese (35b81f8), Arabic (291a8b5) and Hindi (c0e4922) locales, the nostrich.love feed integration (e6bc99b), SEO lessons (33ed03b), and the entire uncommitted [...lang] routing refactor. Nothing is recorded.

**Impact:** There is no release history for the last five months of work, and no version has ever been cut (package.json is still 0.0.1). Debugging a regression means reading 5 commits' worth of diffs rather than a changelog.

**Suggested fix:** Either backfill entries for the locale additions and the routing change and start cutting versions, or delete CHANGELOG.md rather than leave a misleadingly stale one.

### 148. [low] @tailwindcss/typography and tailwindcss-rtl are build-time requirements sitting in devDependencies

**Area:** repo-hygiene · **File:** `package.json`:34-36 · **Effort:** S

**Evidence (unverified):** tailwind.config.js:181 is `plugins: [require("@tailwindcss/typography"), require("tailwindcss-rtl")]`, evaluated by @astrojs/tailwind during `astro build`. Both are listed under devDependencies. Conversely, tailwindcss, postcss, autoprefixer, @types/react, @types/react-dom and @types/qrcode are in dependencies despite being build-time-only.

**Impact:** Vercel installs devDependencies by default, so this builds today — but any move to `npm ci --omit=dev`, an `NPM_FLAGS=--production` env var, or a Docker/self-host build would fail with 'Cannot find module @tailwindcss/typography', taking down all prose styling and all RTL support for the Arabic locale. The classification is also simply backwards from the six type/build packages sitting in the wrong bucket.

**Suggested fix:** Move @tailwindcss/typography and tailwindcss-rtl into dependencies (safest for a config that requires them at build time), and move @types/* into devDependencies.

### 149. [low] No lint, format, test or CI configuration exists, while docs/qa/ describes a QA process

**Area:** repo-hygiene · **File:** `package.json`:5-12 · **Effort:** M

**Evidence (unverified):** No .eslintrc*, eslint.config.*, .prettierrc*, vitest.config.*, jest.config.* or playwright.config.* anywhere in the repo; no .github/ directory. package.json scripts are dev, build, preview, astro, fetch-accounts, verify-seo. Meanwhile docs/qa/ tracks five files (testing-checklist.md, test-scenarios.md, accessibility-audit.md, performance-benchmarks.md, bug-tracking.md) last touched 2026-02-12, and src/ contains 180 `console.log` calls that ship to production bundles.

**Impact:** Nothing mechanically prevents the regressions this repo has already accumulated — the malformed webmanifest, the broken verify-seo paths, the 180 stray console.logs. The QA docs describe a manual process nobody can enforce, and every check is opt-in on one developer's laptop.

**Suggested fix:** Add a minimal GitHub Actions workflow running `npm ci && npm run build && npm run verify-seo` on PRs, and an eslint config with `no-console: warn`. That alone would have caught two of the three production defects in this report.

### 150. [low] 149MB nested Astro tutorial project and 38MB of reference screenshots inflate the working tree

**Area:** repo-hygiene · **File:** `learning/astro-learning/package.json`:1 · **Effort:** S

**Evidence (unverified):** `du -sh` per directory: learning/ 149M (learning/astro-learning/ is a complete separate Astro project with its own node_modules/, dist/, package-lock.json, astro.config.mjs and src/), reference/ 38M (27 tracked client screenshots), .opencode/ 6.5M, dist/ 20M, .git 50M. Total working tree excluding node_modules: 681M. learning/, ai-docs/, ai-scripts/ and experiments are gitignored; reference/ and progress/ (30 files of Feb-2026 session logs) are tracked.

**Impact:** A 681MB working directory for an 84k-line static site. The nested project is caught by the tsconfig `**/*` glob (see the tsconfig finding), and IDE/ripgrep indexing crawls all of it. ai-scripts/ additionally holds a mode-600 export.txt.save (173KB) and 29 relay/NIP-17 debug scripts abandoned since 2026-02-15.

**Suggested fix:** Move learning/astro-learning/ out of the repo entirely (it is an unrelated tutorial). Archive ai-scripts/ and progress/ elsewhere. Add .claude/ and .opencode/ to .gitignore as noted above.

### 151. [low] Stale duplicate privacy policy and a debug harness are deployed to production

**Area:** security-privacy · **File:** `public/privacy.html`:35-100 · **Effort:** S

**Evidence (unverified):** public/privacy.html is a standalone 3.4KB page duplicating the same four privacy claims as src/pages/privacy.astro, dated "February 2025", and it is present in the build at dist/privacy.html — so https://nostrich.love/privacy.html and /privacy are two separately-maintained policies. public/test-progress.html (4KB, dated Feb 14) is a debug harness with `checkStorage()` / `simulateCompletion()` / `clearStorage()` buttons operating on `nostrich-gamification-v1`; it also ships as dist/test-progress.html. robots.txt has no Disallow entries, so both are crawlable.

**Impact:** Two divergent privacy policies at two URLs is a compliance and trust problem — whichever one a user finds first, the other will eventually contradict it, and only the .astro one gets updated when the code changes. The test page is a public, indexable debug surface that lets anyone wipe a visitor's progress with one click and reveals the internal storage schema.

**Suggested fix:** Delete public/privacy.html and public/test-progress.html. If /privacy.html must keep working for old links, add a redirect to /privacy in vercel.json alongside the existing three.

### 152. [low] NIP-05 checker builds fetch URLs from unsanitized user input and renders a remote picture URL

**Area:** security-privacy · **File:** `src/components/interactive/NIP05Checker.tsx`:141-144 · **Effort:** S

**Evidence (unverified):** `https://${domain}/.well-known/nostr.json?name=${encodeURIComponent(name)}` — `name` is encoded but `domain` is interpolated raw. `isValidFormat` (line 105-115) only requires exactly one `@`, a non-empty local part, and a domain containing a `.` of length ≥ 3. So `a@evil.com/x?y=` or `a@evil.com:8443` produce attacker-shaped URLs. The parsed result's `picture` field is then rendered at line 415-416 as `<img src={result.picture}>` with no scheme or host restriction.

**Impact:** There is no server here (`output: "static"`), so this is not SSRF — the requests come from the user's own browser to a host the user typed, which bounds the severity. The residual issues are that a crafted identifier can drive a request to an arbitrary path on an arbitrary host (useful for CSRF-by-GET against a LAN device if the user is tricked into pasting a prepared string), and that a hostile nostr.json can point `picture` at any URL to fingerprint whoever checked that identifier.

**Suggested fix:** Validate `domain` against `/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i` before interpolating, and construct the URL with `new URL()` rather than string concatenation. Restrict the rendered `picture` to `https:` origins and add `referrerPolicy="no-referrer"`.

### 153. [low] Six raw innerHTML assignments on the progress page interpolate values read from localStorage

**Area:** security-privacy · **File:** `src/pages/progress.astro`:606-612 · **Effort:** S

**Evidence (unverified):** `container.innerHTML = completedGuides.map((guide: any) => `...${guide.metadata.title}...`)` where `metadata` is `guideMetadata[guide.id] || { title: guide.id, description: '' }` — so an unrecognised `guide.id` read from `localStorage['nostrich-gamification-v1'].progress.completedGuidesWithTimestamps` is injected into HTML verbatim. Same shape at line 540 (`meta.title`/`meta.description`), and four more innerHTML writes at 482, 494, 596. Layout.astro:242 rewrites this same key on every page load without validating the array contents.

**Impact:** Self-XSS only — an attacker needs script execution on the origin (or physical access to devtools) to poison localStorage in the first place, at which point they have already won. The real cost is that it establishes localStorage as a trusted HTML source, so any future feature that lets a third party influence that blob (an import/restore button, a shared progress link) silently becomes a stored-XSS vector on the same origin as the key generator.

**Suggested fix:** Build these lists with `document.createElement` + `textContent` for the title/description fields, or run every interpolated value through an escape helper. Validate `completedGuidesWithTimestamps` entries against the known guide-id list on read in Layout.astro:220-232.

### 154. [low] Ten high-severity npm advisories in the dependency tree, including XSS CVEs in Astro itself

**Area:** security-privacy · **File:** `package-lock.json`:- · **Effort:** S

**Evidence (unverified):** `npm audit`: 16 vulnerabilities (0 critical, 10 high, 3 moderate, 3 low) across 575 packages. High: astro <=7.0.9 (nine advisories incl. "XSS in define:vars via incomplete </script> sanitization", "Reflected XSS via unescaped slot name", "XSS via Unescaped Attribute Names in Spread Props"), vite <=6.4.2, rollup, postcss, sharp <0.35.0 (libvips CVEs), h3, js-yaml, picomatch, svgo, defu. Installed astro is 5.17.1.

**Impact:** Most of these are build-time only and cannot be reached by a visitor of a static site — vite/rollup/postcss/svgo/sharp/h3 all run on the build machine. The Astro XSS advisories are the ones worth checking, and I verified the vulnerable patterns are not used: `grep` for `define:vars`, `transition:name`, `transition:animate` returns 0 matches in src/, and the only spread is `<SEO {...props} locale={locale} />` (Layout.astro:26) with developer-controlled props. So current exposure is low, but the build toolchain itself processes untrusted-ish content (MDX from 7 locales, SVGs in public/).

**Suggested fix:** Run `npm audit fix` for the non-breaking upgrades and bump astro to the latest 5.x patch. Re-audit after; treat this as routine hygiene rather than an incident, but do it before adding any Astro feature that uses `define:vars`, dynamic slot names, or spread attributes.

### 155. [low] Live Cashu bearer tokens sit in plaintext in the project root with no .vercelignore

**Area:** security-privacy · **File:** `ai-scripts/redeem-coinos.mjs`:4 · **Effort:** S

**Evidence (unverified):** `const fullToken = 'cashuBo2Ftdmh0dHBzOi8vbWludC5jb2lub3MuaW8...'` — a ~7KB Cashu token literal. The same or similar literals appear in ai-scripts/redeem-0xchat.mjs:4 and ai-scripts/debug-redeem.mjs:3. Cashu tokens are bearer instruments: whoever holds the string can redeem the value. `.gitignore` does list `ai-scripts`, and `git ls-files ai-scripts` confirms 0 tracked files, so nothing is in git history. However there is no `.vercelignore` in the repo root.

**Impact:** Not a repository leak — git history is clean, which is the thing that usually goes wrong here. The residual risk is local and deployment-shaped: bearer tokens in plaintext in a working tree get picked up by backups, editor cloud sync, and any tooling that walks the project directory. Vercel CLI falls back to .gitignore when .vercelignore is absent, so a `vercel` deploy from this machine should exclude them, but that behaviour is an implicit dependency rather than a stated one.

**Suggested fix:** Move ai-scripts/ and ai-docs/ outside the project root entirely, or at minimum add an explicit `.vercelignore` listing `ai-scripts`, `ai-docs`, `learning`, `progress`, `screenshots` and `context` so exclusion does not depend on .gitignore fallback. Redeem or invalidate the tokens if they still hold value.

### 156. [low] Sitemap carries no lastmod, no changefreq and includes low-value user-state pages

**Area:** seo-technical · **File:** `astro.config.mjs`:26-40 · **Effort:** S

**Evidence (unverified):** `grep -c lastmod dist/sitemap-0.xml` → 0; every entry is a bare `<loc>` (plus xhtml:link where i18n applies). 32 of the 152 entries have no alternates at all. The sitemap includes /settings/ (326 words, pure localStorage UI), /progress/ (213 words), /badges/ (301 words) and /guides/ (the 4-word redirect stub).

**Impact:** Without lastmod Google has no cheap recrawl signal and must fetch pages to detect change, which matters across 112 translated guides. The personal-state pages render nothing meaningful server-side and dilute the sitemap's quality signal.

**Suggested fix:** Add a `serialize` function to the sitemap integration that sets lastmod from git mtime or guide frontmatter, and a `filter` that excludes /settings/, /progress/, /badges/, /guides/ and /404.

### 157. [low] Heading hierarchy skips H2 on 24 pages, and 477 of 764 images lack explicit dimensions

**Area:** seo-technical · **File:** `src/content/guides/en/what-is-nostr.mdx`:20 · **Effort:** M

**Evidence (unverified):** The first heading in the body is `### The Problem (1 minute read)` — an H3 directly after the page H1, with no H2 between. Same pattern in the faq guide across all 7 locales. My dist scan (footer excluded) found 24 pages with heading-order breaks: h1→h3 on the what-is-nostr and faq guides in every locale, h2→h4 on keys-and-security, h1→h3 on /glossary/, /settings/, /simulators/ and h3→h5 on /relay-feed-browser/. /simulators/gossip/ and /simulators/olas/ have no H1 at all. Nine pages have two H1s: the quickstart guide in all 7 locales (the second is a CTA 'Ready to Launch?'), plus /damus-demo/ and /simulators/snort/. Separately, 477 of 764 `<img>` tags across dist lack both width and height attributes.

**Impact:** Skipped levels degrade the document outline that both screen readers and Google's passage-ranking use to segment long guides; two H1s dilutes the primary topic signal on the quickstart page in all 7 locales. Missing image dimensions cause layout shift, feeding CLS.

**Suggested fix:** Promote the top-level `###` sections in the guide MDX to `##`, demote the CTA H1 in quickstart to an H2 (it is a call to action, not a page topic), and add H1s to gossip.astro and olas.astro. Set explicit width/height on the simulator avatar images.

### 158. [low] robots.txt sets Crawl-delay: 1 and has no Disallow rules for the stray public files

**Area:** seo-technical · **File:** `public/robots.txt`:1-11 · **Effort:** S

**Evidence (unverified):** The file contains `Crawl-delay: 1` and only commented-out Disallow examples (lines 8-10: `# Disallow: /private/`, `# Disallow: /admin/`). Sitemap reference on line 5 correctly points at https://nostrich.love/sitemap-index.xml, which is live 200.

**Impact:** Google ignores Crawl-delay, but Bing and Yandex honour it, capping them at ~1 request/second — for a 155-page site that is a full recrawl every ~3 minutes, so the practical impact is small, but there is no reason to throttle. The absent Disallow rules let /test-progress.html, /privacy.html and the duplicate 'site copy.webmanifest' be crawled.

**Suggested fix:** Drop the Crawl-delay line and add Disallow entries for /test-progress.html and /privacy.html (or delete those files, per the earlier findings).

### 159. [low] shared/configs.ts exports keychatConfig and olasConfig but shared/index.ts does not re-export them

**Area:** simulators · **File:** `src/simulators/shared/index.ts`:40-53 · **Effort:** S

**Evidence (unverified):** The named export block lists damusConfig, amethystConfig, primalConfig, snortConfig, yakihonneConfig, coracleConfig, gossipConfig, allSimulatorConfigs and the four getters — but omits keychatConfig (defined at configs.ts:196) and olasConfig (configs.ts:219), even though both are present in `allSimulatorConfigs` (configs.ts:248-249). Every consumer works around this by importing from '../../simulators/shared/configs' directly (SimulatorSidebar.tsx:20, all nine simulator .astro pages).

**Impact:** Contained — the barrel is unimportable anyway (see the JSX-in-.ts finding), so nothing breaks today. It is a marker that the barrel was written once and never maintained as simulators were added.

**Suggested fix:** If the barrels are kept, add the two missing exports. If the recommendation to delete both barrels is taken, this resolves itself.

### 160. [low] No Node version pin, so the build toolchain can drift silently on Vercel

**Area:** testing-ci-ops · **File:** `package.json`:1-12 · **Effort:** S

**Evidence (unverified):** package.json has no `engines` field, and there is no .nvmrc or .node-version in the repo. The local environment is Node v24.1.0. vercel.json specifies no build settings at all, so Vercel's auto-detected Astro preset picks whatever its current default Node major is.

**Impact:** Vercel bumping its default Node major changes the build environment with zero local signal and no CI to catch a difference. With sharp in the dependency tree (astro.config.mjs:63 enables the sharp image service) and native bindings involved, a Node major bump is a realistic source of a build failure that first appears as a red deploy on main.

**Suggested fix:** Add `"engines": { "node": ">=20 <25" }` to package.json and a matching .nvmrc, and use the same version in the CI workflow.

### 161. [low] QA and testing documentation is a set of frozen point-in-time snapshots that no longer describe the site

**Area:** testing-ci-ops · **File:** `PHASE2_TESTING_REPORT.md`:1-40 · **Effort:** S

**Evidence (unverified):** PHASE2_TESTING_REPORT.md is dated February 13 2026 and reports "Total Pages: 41 HTML pages" and "0 errors, 0 warnings" — the current build produces 154. docs/PHASE3_TESTING_CHECKLIST.md contains 104 checked boxes and zero unchecked ones: it was completed once and never reopened. docs/qa/testing-checklist.md is dated 2026-02-11, is titled "Comprehensive testing checklist for all 7 Nostr client simulators" and tabulates 7 — the repo now has 10 under src/simulators/. docs/qa/bug-tracking.md is a markdown file explicitly styled as "GitHub-style issues" standing in for an actual issue tracker, last updated 2026-02-11.

**Impact:** These read as evidence of testing rigor while describing a site roughly a third of its current size with three fewer simulators. A reviewer or new contributor reasonably concludes the project is tested when nothing is, and the frozen all-checked checklist actively discourages re-verification.

**Suggested fix:** Move these to docs/archive/ with a dated header, or replace them with the real thing — an executable smoke suite plus GitHub Issues. A checklist that is 104/104 forever is worse than no checklist.

### 162. [low] 53 uncommitted files with 4,479 deletions in the working tree — local state diverges from what is deployed

**Area:** testing-ci-ops · **File:** `-`:- · **Effort:** S

**Evidence (unverified):** `git diff --stat` reports 53 changed files, 386 insertions and 4,479 deletions, including src/utils/gamification.ts, src/utils/gamificationEngine.ts, src/components/interactive/PrivacySecurityQuiz.tsx, src/pages/index.astro, src/pages/[...lang]/guides/[slug].astro and 13 guide MDX files across es/pl/zh, plus 11 deleted root-level docs and sitemap.xml. The current dist/ was built at 14:00 today from this dirty tree (zero src files are newer than dist/index.html), while production runs github/main at c0e4922.

**Impact:** The local dist/ does not represent production, so any manual verification done against it is verifying code that was never shipped. With no CI and no preview-deploy discipline, there is no other artifact that does represent production, and unreviewed changes to the gamification engine are sitting uncommitted where a stray `git add -A` would ship them all at once.

**Suggested fix:** Commit or stash the tree, and adopt a branch-plus-Vercel-preview workflow so there is always a deployed artifact matching a specific commit to verify against.

### 163. [low] Hardcoded counts and copy drift across the progress, tools and simulator pages

**Area:** ux-funnel · **File:** `src/pages/progress.astro`:7 · **Effort:** S

**Evidence (unverified):** progress.astro:7 and :420 set `totalGuides = 15` while SKILL_LEVELS totals 16 (7+6+3). Line 123 hardcodes '0/6 guides' for Beginner (actual sequence length is 7); lines 138 and 191 say 'Complete 4 Beginner guides to unlock Intermediate' while learning-paths.ts:54 sets the threshold to 5; line 244 says 'Complete 4 Intermediate guides' while the Advanced threshold is 3. tools.astro:42, simulators/index.astro:15 and :59 all say '7 different Nostr clients' while allSimulatorConfigs holds 9 (plus nostr-kitten as a tenth page). glossary.astro:54-61 ships duplicate `_nsec` and `_npub` entries that render as literal terms alongside the real nsec/npub entries. settings.astro:61 states 'Progress tracking is disabled by default' while progressService.ts:24-29 defaults trackingEnabled and showProgressIndicators to true.

**Impact:** Progress percentages are computed against the wrong denominator, so a user who completes every guide never reaches 100%. Unlock messaging tells users a threshold that the code does not enforce. The settings/privacy mismatch is the most damaging: this audience self-selects for privacy scepticism, and a page that claims tracking is off while the code turns it on is exactly the kind of thing that gets screenshotted.

**Suggested fix:** Derive every count from SKILL_LEVELS and allSimulatorConfigs at build time rather than hardcoding. Delete the `_nsec`/`_npub` glossary duplicates. Fix the settings copy to match the actual default (or flip the default to match the copy).

### 164. [low] Level-unlock modal is hardcoded English for all seven locales

**Area:** ux-funnel · **File:** `src/components/guides/UnlockButton.tsx`:15-19 · **Effort:** S

**Evidence (unverified):** `levelNames` is a hardcoded English map, and every string in the component is a literal: 'Unlock Intermediate', 'Unlock Intermediate Guides?', "You've completed X of Y guides in the previous level.", 'Early Unlock', 'Keep Locked', 'Unlock Now'. Every sibling in the same directory (GuideCard, GuideSection, InterestFilter) uses `useTranslation`.

**Impact:** A Polish, Spanish, German, Chinese, Arabic or Hindi reader working through the translated guides hits an all-English modal at exactly the moment the site asks them to make a decision about unlocking content. For the RTL Arabic locale the untranslated block also breaks the reading direction of the page.

**Suggested fix:** Route these strings through the existing `useTranslation` hook and add the keys to the seven locale JSONs.
