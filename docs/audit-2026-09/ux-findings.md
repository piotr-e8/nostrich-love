# UX audit 2026-09-03 — raw findings

Six passes over the real user journeys on the built site. NOT yet through adversarial
verification when this file was written, so treat every row as a hypothesis until checked
against the code. This session has already produced two confidently wrong findings.

critical 7 · high 30 · medium 40 · low 15


## critical

**1. /badges (whole page) — every navigation link to it, in src/components/layout/Header.astro and src/pages/progress.astro**

- Problem: A reader earns a badge, gets a full-screen celebration modal, and then has nowhere to go: /badges is orphaned. Every entrance to it is commented out — the desktop user menu, the mobile "Your Progress" menu, and the "View Your Badges" CTA on /progress. The page is also `noindex` and excluded from the sitemap, so search cannot reach it either. Twelve badges exist and are awarded, three of them (the level certificates) are the course's own graduation markers, and the only moment any of them is ever visible is the few seconds the modal is on screen. Miss the modal and the reward layer leaves no trace.
- Evidence: src/components/layout/Header.astro:82 `<!-- Badges link - TEMPORARILY HIDDEN` (desktop menu) and :174 `<!-- View Badges link - TEMPORARILY HIDDEN` (mobile menu). src/pages/progress.astro:248 `<!-- View Badges button - TEMPORARILY HIDDEN`. Built HTML confirms: in dist/pl/guides/what-is-nostr/index.html the only two `href="/badges"` occurrences sit inside those HTML comments, while `href="/progress"` renders live twice. src/pages/badges.astro is rendered with `noindex`.
- Fix: Uncomment the badges link in both Header menus and the /progress CTA, or, if the page is deliberately parked, stop awarding badges and stop firing the celebration modal. A reward the user can never look at twice is worse than no reward.

**2. /guides (all locales) — "Filter by interest" chips (Bitcoin, Privacy, Security, Relays, Tools, Community)**

- Problem: A reader taps a filter chip expecting to see the guides on that topic. In the six non-English locales, five of the six chips return zero guides — all three level sections collapse to an empty "no results" box at once, so the course looks empty. In English the chips are nearly as useless: "Privacy" returns 1 guide of 16, "Bitcoin" 1, "Community" 1. Worse, the chosen filter is written to localStorage and restored on every later visit, so someone who tapped "Prywatność" once comes back days later to a guides page that server-renders all 16 guides and then, on hydration, wipes them.
- Evidence: src/components/guides/GuideSection.tsx:89 `if (guide.tags?.some(tag => tag.toLowerCase() === normalizedFilter)) return true;` — but src/pages/[...lang]/guides/index.astro:38-48 builds each guide object with only {id,title,description,estimatedTime,category,difficulty,href}; `tags` is never passed, so that branch is always false and matching falls through to line 93 `return searchText.includes(normalizedFilter)` against title+description. The filter values are English literals (src/components/guides/InterestFilter.tsx:22-27 `value: 'privacy'`, `'security'`, `'relays'`, `'tools'`, `'community'`) while the labels are translated (pl.json: "Prywatność", "Bezpieczeństwo", "Relaye", "Narzędzia", "Społeczność"). Simulating the match over the real frontmatter: en → bitcoin 1, privacy 1, security 2, relays 3, tools 2, community 1; pl → bitcoin 1, privacy 0, security 0, relays 0, tools 0, community 0. Persistence: GuidesContainer.tsx:60 `const savedFilter = getLastInterestFilterLocal(); setActiveFilter(savedFilter);`
- Fix: Give the filter real data instead of a substring match: add `tags` to the guide objects built in [...lang]/guides/index.astro (frontmatter `tags`, or derive from a hand-kept topic map keyed by slug, which is locale-independent) and drop the title/description fallback in GuideSection. Until then, at minimum stop restoring a saved filter on load, and show one empty state for the whole page with a "clear filter" button rather than three.

**3. /guides/outbox-model, /guides/relay-guide, /guides/protocol-comparison — end-of-article GuideNavigation block**

- Problem: A reader who lands on the last guide of a level (from Google, a link, or by browsing) is told they finished the whole level. Expected: a celebration only after actually completing the level. What happens: the banner is static HTML rendered for every visitor, so a first-time reader with zero progress sees "You've completed all Beginner guides".
- Evidence: Verified live with cleared storage on http://127.0.0.1:8899/guides/outbox-model: localStorage nostrich-gamification-v1 progress.completedGuides = [] while the page renders "🎉 / Beginner Complete! / You've completed all Beginner guides / Continue to Intermediate". Source: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/navigation/GuideNavigation.tsx:85 `const isLevelComplete = currentIndex === sequence.length - 1;` — position in the sequence, not progress. The component is rendered with no client directive (/Users/piotrczarnoleski/nostr-beginner-guide/src/pages/[...lang]/guides/[slug].astro:391), so it ships as static HTML. On the same page ContinueLearning uses real progress (getCompletedInLevel), so the two blocks contradict each other.
- Fix: Make the static block position-only ("Last guide of the Beginner level — next up: Intermediate") and leave the congratulation to the progress-aware ContinueLearning, or hydrate GuideNavigation's celebration branch behind the same getCompletedInLevel check.

**4. /guides/troubleshooting and /guides/relays-demystified — TroubleshootingWizard, "Helpful Resources" buttons, src/components/interactive/TroubleshootingWizard.tsx:69-72, 89-93, 123**

- Problem: After answering the wizard's questions a person reaches a solution screen with buttons labelled "Key Generator", "Security Guide" and "Relay Explorer" under a "Helpful Resources" heading. Clicking any of them does nothing — they are bare fragment anchors pointing at ids that exist on neither page that hosts the wizard. This is the wizard's only handoff to a fix, so the person who followed the diagnosis to the end hits a dead stop.
- Evidence: TroubleshootingWizard.tsx:69-72 `resources: [{ label: "Key Generator", url: "#key-generator" }, { label: "Security Guide", url: "#security" }]`; :92 `{ label: "Relay Explorer", url: "#relays" }`; :123 same. Grepping the built pages: `grep -c 'id="relays"' dist/guides/relays-demystified/index.html` → 0, and 0 for `id="key-generator"` and `id="security"` on both dist/guides/relays-demystified/index.html and dist/guides/troubleshooting/index.html. (The labels are also hardcoded English, so a Polish or Arabic reader gets English text on a link that does nothing.)
- Fix: Point them at real routes through the existing helpers — `/tools/key-generator`, `guidePath('keys-and-security', locale)`, `guidePath('relays-demystified', locale)` — and move the labels into i18n. "Empty Feed Fixer" (:91) also needs renaming: it goes to the quickstart guide, not to any fixer.

**5. /settings — "Opt-In Philosophy" block under "About Our Privacy Approach"**

- Problem: The privacy page tells the reader that nothing is being recorded until they switch it on. The opposite is true: tracking is on from the first page view. Someone who reads this page to decide whether to trust the site is told the exact reverse of what the site does.
- Evidence: src/pages/settings.astro:65 — "Progress tracking is disabled by default. We believe you should choose what features to enable. No dark patterns, no forced tracking." But src/lib/progressService.ts:43-49 ships `const defaultPrivacySettings: PrivacySettings = { trackingEnabled: true, dataRetention: 'forever', showProgressIndicators: true, toursEnabled: true }`, above a comment that says it outright: "Default privacy settings — tracking is ON by default (opt-out via the settings page)."
- Fix: Change the copy to match the code: tracking is on by default, stored only on this device, and here is the switch to turn it off. If the opt-in promise is the one you want to keep, flip `trackingEnabled` to `false` instead and add a first-visit prompt. Do not leave the two disagreeing.

**6. /settings — "Opt-In Philosophy" paragraph vs. the actual default**

- Problem: Someone who cares about being tracked reads the settings page and is told tracking is off unless they turn it on. It is on. Every page load writes a progress record to their browser, and guides get marked completed as they scroll, before they have ever visited this page.
- Evidence: src/pages/settings.astro:65 "Progress tracking is disabled by default. We believe you should choose what features to enable. No dark patterns, no forced tracking." — src/lib/progressService.ts:44-45 `const defaultPrivacySettings: PrivacySettings = { trackingEnabled: true, ...}` with the comment "tracking is ON by default (opt-out via the settings page)". The Layout bootstrap script (in every built page) writes `nostrich-gamification-v1` unless `trackingEnabled === false` is already stored, and src/components/progress/ProgressTracker.tsx marks a guide complete at 80% scroll with no prompt.
- Fix: Pick one and make the other match. Either flip `defaultPrivacySettings.trackingEnabled` to false (and have the guides/progress pages invite the reader to switch it on), or rewrite the settings copy to say tracking is on by default, stays on this device, and can be switched off here.

**7. /tools/nip05-checker and /tools (NIP-05 Checker) and /guides/nip05-identity — result panel, src/components/interactive/NIP05Checker.tsx:194-206**

- Problem: A person whose nostr.json maps their name to an `npub1…` string instead of the 64-char hex key expects the checker to catch it — the site's own page calls this "the classic hand-editing mistake" and says "The file can load perfectly and still fail verification in clients because of this." Instead the checker reports "Valid NIP-05! This identifier is correctly configured" and prints the npub1 string in the "Public Key (npub)" box. The person walks away believing a setup that is broken in every client is fine. A truncated or wrong-length hex value is also reported valid, silently encoded into a garbage npub.
- Evidence: NIP05Checker.tsx:196-201 — `try { npub = nip19.npubEncode(pubkey); } catch { npub = pubkey; // Fallback to raw pubkey if encoding fails }` followed by `setResult({ identifier, isValid: true, npub, ... })`. Verified in node against the repo's own nostr-tools: `npubEncode('npub180cvv07…')` throws "hex string expected, got unpadded hex of length 63"; `npubEncode('abcd')` returns "npub140xserft56". src/pages/tools/nip05-checker.astro:89-91 documents the failure the tool passes.
- Fix: Treat a non-hex or non-64-char value as an error, not a fallback: validate `/^[0-9a-f]{64}$/` on the value read from `names[name]` before encoding, and on failure return a dedicated errorType ("npub-instead-of-hex") with the fix text already written on the lander. Never set `isValid: true` from the catch branch.


## high

**8. /badges**

- Problem: A complete, styled page listing 12 badges ships to production with zero links pointing at it from anywhere on the site. Meanwhile badges are still being awarded on guide pages, on the key generator and on settings, and the pop-up that announces an earned badge has no link either. So a person earns "Key Master", sees a modal, and can never look at their collection unless they guess the URL.
- Evidence: Scanning all 141 built HTML files with comments stripped: 0 live `href="/badges"`. The only occurrences are inside HTML comments — src/components/layout/Header.astro:83 and :208, both marked "Badges link - TEMPORARILY HIDDEN". /progress/index.html links only to /guides and never mentions badges. src/components/gamification/BadgeEarnedModal.tsx contains no href at all. BadgeEarnedModalListener is still mounted at src/pages/[...lang]/guides/[slug].astro:434, src/pages/tools/key-generator.astro:276 and src/pages/settings.astro:96.
- Fix: Decide one way. Either restore the header/user-menu link and add "View all badges" to the earned-badge modal and to /progress, or stop awarding badges and remove the listeners. A reward system whose trophy case is unreachable is worse than none.

**9. /guides (all locales) — GamificationExplainerWrapper island; src/components/gamification/GamificationExplainerWrapper.tsx**

- Problem: The one modal that explains how badges, progress and quizzes work cannot be opened. It attaches its click handler to `document.getElementById('how-does-this-work-btn')`, and no page anywhere in the repo renders an element with that id. The only other opener is the URL hash `#how-it-works`, which nothing links to. So the island hydrates on every /guides page, finds no button, and renders nothing forever. Nothing else on the site explains the system either — badges simply appear as a full-screen modal mid-read, unannounced.
- Evidence: src/components/gamification/GamificationExplainerWrapper.tsx:21 `buttonId = 'how-does-this-work-btn'` and :61 `window.location.hash === '#how-it-works'`. `grep -rn "how-does-this-work\|how-it-works" src public` returns only those two lines in that same file — no page, component or MDX renders the trigger.
- Fix: Render a real "How does this work?" button with that id in the /guides hero next to the island, and localize the modal (it is currently hardcoded English throughout: "How It Works", "Gamification System", "Got it!").

**10. /guides level headers (GuideSection) and the ContinueLearning "Level Complete!" card, vs the level-certificate badges in src/utils/gamification.ts**

- Problem: The site tells a reader they finished a level on one rule and awards the certificate on a different, stricter one, and never shows the difference. /guides stamps "✓ Complete" on a level as soon as its guides are read, and ContinueLearning fires a "Level Complete! 🎉" card on the same test. But `checkLevelCertificates()` requires every guide read AND every quiz in the level passed — Beginner is 7 guides plus 5 quizzes. So a reader is congratulated on completing Beginner, gets no certificate, and there is no screen anywhere on the site that shows quiz-pass state, so nothing tells them what is missing or that quizzes counted at all.
- Evidence: src/components/guides/GuideSection.tsx:129 `{completedCount === totalCount && (... ✓ {t('guideSection.complete')})}` where completedCount comes from `getCompletedGuidesInLevel(level)`. src/components/navigation/ContinueLearning.tsx:170 `const isComplete = completedCount >= totalInLevel;`. src/utils/gamification.ts `getLevelCompletion()` returns `complete: guidesRead === sequence.length && quizzesPassed === quizzes.length`, and `getLevelQuizzes('beginner')` yields 5 slugs. /progress renders guide counts only and never mentions quizzes.
- Fix: Use `getLevelCompletion(level)` for both labels and show its two counters ("6/7 guides · 3/5 quizzes") wherever a level's state is displayed, so "complete" means one thing.

**11. /guides — the "how does this work" explainer modal (GamificationExplainerWrapper)**

- Problem: The only place on the site that explains levels, quizzes, progress and badges cannot be opened. The component mounts on the guides index and waits for a click on a button that is not rendered anywhere. So a reader who wonders what the 🌱/🚀/⚡ levels and the percentages mean has nowhere to find out.
- Evidence: src/components/gamification/GamificationExplainerWrapper.tsx:21 `buttonId = 'how-does-this-work-btn'` and :45-56 `const button = document.getElementById(buttonId); if (button) { ... }`. Scanning all 141 built HTML files plus public/ and src/ for that id returns exactly one hit: the component's own bundle, _astro/GamificationExplainerWrapper.B5c1gTFj.js. The `#how-it-works` hash fallback (:61) is never linked either — the two pages containing that string use it as an unrelated MDX heading anchor.
- Fix: Render a real trigger next to the "Progressive skill levels" subtitle on /guides — `<button id="how-does-this-work-btn">How does this work?</button>` — or drop the wrapper and its 400-line modal.

**12. /guides/keys-and-security, /guides/outbox-model, /guides/privacy-security — quiz results screen, first CTA**

- Problem: The primary button on the results screen links to the guide the reader is already on. Expected: it takes you somewhere. What happens: the page reloads, you are dumped at the top, and the results screen (with your score) is gone, since the quiz keeps its state only in React state.
- Evidence: Verified live on http://127.0.0.1:8899/pl/guides/keys-and-security: after finishing the quiz the results links were [{t:"Review Keys & Backups", href:"/pl/guides/keys-and-security"}, {t:"Revisit Privacy Guide", href:"/pl/guides/privacy-security"}] with location.pathname "/pl/guides/keys-and-security". Same pattern in /Users/piotrczarnoleski/nostr-beginner-guide/src/components/interactive/OutboxModelQuiz.tsx:170 `href={guidePath("outbox-model", locale)}` (used only by outbox-model.mdx) and /Users/piotrczarnoleski/nostr-beginner-guide/src/components/interactive/PrivacySecurityQuiz.tsx:224 `href={guidePath("privacy-security", locale)}` (used only by privacy-security.mdx).
- Fix: Point the first CTA at the next guide in SKILL_LEVELS.sequence (or an anchor back to the relevant section of the current page), never at the current slug. A build-time assertion that no quiz CTA equals its host guide's slug would keep it that way.

**13. /guides/relays-demystified (RelayExplorer) and /tools + /guides/relay-guide (RelayPlayground Connection Lab) — relay cards, src/components/interactive/RelayExplorer.tsx:597-607 and src/components/interactive/RelayPlayground.tsx:571-580**

- Problem: Selecting a relay is the one thing both tools exist for, and in both it is a bare clickable `<div>`: no role, no tabIndex, no key handler. A keyboard or screen-reader user can tab through the search box, the filters and the Copy/Download buttons but can never select a relay, so the Copy and Download buttons they can reach have nothing to act on. In the Playground it is worse: all five tabs read from `selectedRelay`, so Health, NIPs, Events and Query are all unreachable too.
- Evidence: RelayExplorer.tsx:597-607 `<div key={relay.id} className={cn("relative border rounded-xl p-4 transition-all cursor-pointer", …)} onClick={() => toggleRelaySelection(relay.url)}>` — the only handler on the element. RelayPlayground.tsx:572-574 `<div key={relay.id} onClick={() => onSelectRelay(relay)} className={cn("relative p-4 border rounded-xl cursor-pointer transition-all", …)}>`. A scan of every interactive component found these two are the only non-modal-backdrop cases.
- Fix: Make the card a `<button type="button">` (or add `role="checkbox"` / `role="radio"` with `aria-checked`, `tabIndex={0}` and Enter/Space handling). The Follow Pack AccountCard already does this correctly and can be copied.

**14. /progress — "Overall Progress" card, and the guide list in the Beginner section**

- Problem: Two hardcoded numbers on the page disagree with the course. (a) The denominator is 15 while the course has 16 guides (7+6+3), so a reader who finishes everything is shown "107%". (b) The `guideMetadata` lookup has 15 entries and is missing `outbox-model`, the seventh Beginner guide, so that row renders with the raw slug as its title and an empty description, and after it is completed "Recent Activity" lists an item called "outbox-model".
- Evidence: src/pages/progress.astro:7 `const totalGuides = 15; // Total number of guides across all levels` and :366 the same literal inside `updateSummaryCards()`; SKILL_LEVELS sequences total 16. The `guideMetadata` object in the same file lists 15 slugs; `outbox-model` is absent, and the render falls back to `guideMetadata[guideId] || { title: guideId, description: '' }`.
- Fix: Derive both the total and the titles from SKILL_LEVELS / the content collection instead of restating them. The page already imports SKILL_LEVELS.

**15. /progress — "Overall Progress" percentage and the three level cards**

- Problem: The course has 16 guides. This page counts against 15. A reader who finishes 15 of them is told they are at 100% with one guide still unread; someone who finishes all 16 sees 107%. Before the client script runs, the Beginner card also reads "0/6 guides" for a level that has 7, and calls the level "Foundation of Nostr" while /guides calls the same level "Getting Started".
- Evidence: src/pages/progress.astro:7 `const totalGuides = 15; // Total number of guides across all levels` and again inside the client script at :366, used at :399 `const percentage = Math.round((completedGuides.length / totalGuides) * 100)`. Actual course spine, src/data/learning-paths.ts: beginner.sequence has 7 entries, intermediate 6, advanced 3 = 16. Static markup at progress.astro:122 and :157 ships `0/6 guides`, :192 `0/3 guides`. dist/guides/index.html renders "0 of 7 guides completed" for the same beginner level.
- Fix: Replace both `totalGuides = 15` literals with a sum over `SKILL_LEVELS` (`getAllGuidesOrdered().length`), and render the three static `0/N` strings from `getLevelLength(level)` at build time so the pre-hydration numbers are right too.

**16. /relay-feed-browser — "How It Works" step 1 and the FAQ, src/pages/relay-feed-browser.astro:78 and 168-172, against src/data/topical-relays.ts:9-11**

- Problem: The page tells the reader to "Choose from Bitcoin, Art, Music, Tech, Development, Gaming, or Regional communities" and the FAQ explains that "Bitcoin-focused relays discuss ₿, art relays showcase creative work, regional relays connect locals." The tool below ships five relays in two categories, General and News. A creator who came here for the art or music community sees three chips (All / General / News) and no way to reach what the page just described. The FAQ also cites nostr.wine as an example of a paid relay in this list; it is not in the list.
- Evidence: src/data/topical-relays.ts:9-11 `export type RelayCategory = | 'general' | 'news';` and RELAY_SEEDS (:45-83) contains exactly five entries: spatia-arcana, christpill, chillstr, utxo-news, holoboard. relay-feed-browser.astro:78 "Choose from Bitcoin, Art, Music, Tech, Development, Gaming, or Regional communities."; :171 "Bitcoin-focused relays discuss ₿, art relays showcase creative work, regional relays connect locals."
- Fix: Rewrite the page copy to match the data — say plainly that this is a short, hand-checked list of general and news relays — or restore the topical relays the categories promise. Either way, derive the category names in the copy from `RelayCategory` so they cannot drift again.

**17. /relay-feed-browser — RelayFeedBrowser, "View feed" button on each relay row, src/components/interactive/RelayFeedBrowser.tsx:73-113**

- Problem: A person clicks a relay to preview its feed. If the relay never sends EOSE — auth-gated relays reply with AUTH and then CLOSED, and two of the five relays on offer are paid — the spinner runs forever. There is no timeout, `CLOSED` and `NOTICE` are ignored, and `onclose` is not handled at all, so a socket that shuts cleanly without EOSE leaves the loading state stuck. The only way out is the small X in the header, which does not read as "cancel".
- Evidence: RelayFeedBrowser.tsx:88-106 handles only `data[0] === "EVENT"` and `data[0] === "EOSE"`; the only exit from `setIsLoading(true)` (:76) is EOSE at :94 or `ws.onerror` at :109. No `ws.onclose`, no `setTimeout`. src/data/topical-relays.ts tags chillstr and holoboard `"paid"`.
- Fix: Add a timeout (the RelayExplorer already uses 5 s, the Playground query 10 s) that clears the spinner and shows the existing `connectFailed` message, handle `CLOSED` and `NOTICE` as failures with the relay's own reason, and wrap the `JSON.parse` at :89 so a malformed frame does not leave the state hanging.

**18. /relay-feed-browser — the "How It Works" section, step 1**

- Problem: The page tells the reader to pick from seven topic categories. The tool underneath offers three buttons (All, General, News) and five relays, none of them about Bitcoin, art, music, tech, development, gaming or a region. A creator who came looking for the music or art community scrolls, finds nothing, and concludes the feature is broken.
- Evidence: src/pages/relay-feed-browser.astro:78 — "Choose from Bitcoin, Art, Music, Tech, Development, Gaming, or Regional communities." (also in the meta description, line 8). Built /relay-feed-browser/index.html contains exactly three category buttons: 'All', 'General', 'News', and five relay cards (Spatia Arcana, Christpill, Chillstr, NewsBot Relay, Holoboard).
- Fix: Rewrite step 1 to name the categories that actually exist, or add relays for the promised ones. The safest quick fix is to describe what the tool does ("browse a handful of hand-picked relays and read what they carry") rather than list categories that will drift again.

**19. /settings — "Opt-In Philosophy" paragraph, and the "Data Retention" select in PrivacyControls**

- Problem: The settings page makes two statements about data handling that the code contradicts. (a) It says progress tracking is off by default; it is on by default. (b) The retention options are inert. Choosing "Session only (no storage)" or "Delete after 30/90 days" changes nothing for the store that actually holds progress: `saveGamificationData()` — the single writer for guide completions, badges, quiz results and streak — checks only the tracking toggle and never reads `dataRetention`. Reading a guide still writes `nostrich-gamification-v1` to localStorage after the reader picked "no storage".
- Evidence: src/pages/settings.astro:65 "Progress tracking is disabled by default." vs src/lib/progressService.ts `const defaultPrivacySettings = { trackingEnabled: true, ... }`. src/components/progress/PrivacyControls.tsx:169 `<option value="session">Session only (no storage)</option>`; `grep -rn dataRetention src` finds it only in progressService.ts and in the select itself — src/utils/gamification.ts `saveGamificationData()` gates on `isTrackingEnabled()` alone.
- Fix: Correct the sentence to say tracking is on by default and points at the toggle, and either enforce retention inside saveGamificationData() or remove the select until it does something.

**20. /tools and /guides/relay-guide — Relay Playground, Events tab and Query tab, src/components/interactive/RelayPlayground.tsx:1067 and 1316**

- Problem: A person picks a relay, picks event kinds and presses the green start button. If the relay refuses the connection, requires NIP-42 auth or simply drops, the button flips straight back to its idle state and nothing else changes: no message, no red state, no hint. On the Query tab the outcome is the same and the panel keeps showing "Results: 0" with the empty-state text, which is exactly what a successful query returning nothing looks like. The person cannot tell "this relay has no posts of that kind" from "we never got through", and the obvious next move — pressing the button again — produces the same nothing.
- Evidence: RelayPlayground.tsx:1066-1067 `ws.onclose = () => setIsStreaming(false); ws.onerror = () => setIsStreaming(false);` — no error state is set and none is rendered. :1315-1316 `ws.onclose = () => setIsQuerying(false); ws.onerror = () => setIsQuerying(false);` with results rendered as `results.length === 0 ? <p>{t('relayPlayground.queryTab.noResults')}</p>` (:1442-1444). The Connection tab, by contrast, does carry a `connectionState: "error"` path (:363-377, :696-699), so the machinery exists and is simply not used here.
- Fix: Reuse the Connection tab's error state in both tabs: set an error on `onerror` and on a close that arrived before EOSE, and render it above the results, distinct from the empty state. Add a timeout for the Events tab, which currently has none.

**21. /tools and /tools/key-generator — Key Generator, "Copy" button under the Public Key (npub) card**

- Problem: The card says the npub is safe to share and tells the reader to share it. Clicking Copy under it throws a red-flag modal titled "Security Warning" saying they risk "permanent loss of access", with the only way forward labelled "Copy Anyway". The site teaches npub-is-safe and then punishes the reader for believing it — on the one screen where that distinction has to be crisp.
- Evidence: src/components/interactive/KeyGenerator.tsx:456 `onClick={() => handleCopy(keys.npub, t('keyGenerator.keys.public.title'))}` and :230-236 `handleCopy` → `if (!allChecksPassed) { ...openWarningModal(); return; }`. The same card renders en.json `keyGenerator.keys.public.badge` = "Safe to share" and `.description` = "This is your public identifier. Share it with others so they can find and follow you." The modal text is `keyGenerator.modal.description` = "You haven't completed all security acknowledgments. Copying your keys without understanding the risks could result in permanent loss of access."
- Fix: Let the npub copy without a gate. Keep `handleCopy`'s checklist gate for `keys.nsec` only — e.g. `handleCopy(text, label, {gated: true})` on the private-key button, plain `performCopy` on the public one.

**22. /tools and /tools/key-generator — Key Generator, "Download Backup" and the nsec "QR Code" buttons**

- Problem: The generator's own warning says to complete the checklist "before copying or downloading your keys". Copying is gated. Downloading is not. A reader who ticks nothing can still put a plaintext file containing their nsec, and a PNG QR code that encodes the nsec, into their Downloads folder in two clicks — the two actions most likely to leak the key later (cloud-synced Downloads, a screenshot-sharing habit) are the two that ask nothing.
- Evidence: src/components/interactive/KeyGenerator.tsx:518 `onClick={handleDownload}` — `handleDownload` (:249-280) has no `allChecksPassed` check and writes `nostr-keys-<ts>.txt` containing `keys.nsec` and `keys.hexPrivate` in the clear. :525-527 `<a href={qrCodeData.nsec} download="nsec-qr.png">` is a plain anchor with no handler at all. Meanwhile en.json `keyGenerator.securityWarning.description` promises: "Complete the security checklist below before copying or downloading your keys."
- Fix: Route both through the same gate: make the nsec QR a `<button>` that calls `handleCopy`-style gated logic before triggering the download, and add the `allChecksPassed` check to `handleDownload`.

**23. /tools — hero paragraph above the tool grid, src/pages/tools.astro:91-93**

- Problem: The page states, as a blanket claim over all four tools, that nothing is sent anywhere. Three of the four contradict it on the same page: the NIP-05 Checker sends the identifier the person types to a third-party domain over HTTPS, the Relay Playground opens WebSockets to a dozen relays (its own card two paragraphs below says "connect live"), and the Follow Pack Finder can sign and publish a NIP-51 list to public relays. A privacy-minded reader — the audience this site cultivates — acts on a promise the page does not keep.
- Evidence: dist/tools/index.html: "Free browser-based tools to help you get started with Nostr. All tools run locally in your browser - no data is sent to any server." Same page, relay-playground card: "Interactive relay testing: connect live…". src/components/interactive/NIP05Checker.tsx:129-141 `fetch(\`https://${domain}/.well-known/nostr.json?name=…\`)`; RelayPlayground.tsx:1035 `new WebSocket(selectedRelay.url)`; follow-pack/ExportModal.tsx:245-268 `ws.send(JSON.stringify(['EVENT', signedEvent]))`.
- Fix: Narrow the claim to what is true of every tool ("your keys are made and stay on your device") and put the per-tool network behaviour on each card: which tool talks to relays, which sends the value you type to a third-party domain.

**24. /tools/key-generator, /tools and /guides/keys-and-security — KeyGenerator, "Copy" button in the green Public Key card, src/components/interactive/KeyGenerator.tsx:455-461**

- Problem: The npub card is badged "Safe to share" and its description says "Share it with others so they can find and follow you." Clicking Copy on it throws up a full-screen modal headed "Security Warning — You haven't completed all security acknowledgments. Copying your keys without understanding the risks could result in permanent loss of access," with buttons "Go Back" and "Copy Anyway." A beginner is told in the same view that this value is safe and that copying it may cost them their account. The lesson the site is trying to teach — npub safe, nsec never — is undone by its own interaction.
- Evidence: KeyGenerator.tsx:456 `onClick={() => handleCopy(keys.npub, t('keyGenerator.keys.public.title'))}` and :232 `if (!allChecksPassed) { … openWarningModal(); }` — the same gate for both keys. en.json: `keys.public.badge` = "Safe to share"; `modal.description` = "You haven't completed all security acknowledgments…".
- Fix: Gate only the nsec paths. Copying the npub should copy the npub.

**25. /tools/key-generator, /tools and /guides/keys-and-security — KeyGenerator, "Download Backup" button and nsec "QR Code" link, src/components/interactive/KeyGenerator.tsx:249-281, 517-533**

- Problem: The panel tells the person "Complete the security checklist below before copying or downloading your keys." Copying is in fact gated behind the checklist. Downloading is not: "Download Backup" writes a plaintext .txt containing the nsec and both hex keys straight to disk with zero checks ticked, and the nsec "QR Code" link saves a scannable PNG of the private key the same way. The person is told a guard exists on the riskiest action, and it does not.
- Evidence: KeyGenerator.tsx:231-238 `const handleCopy = async (...) => { if (!allChecksPassed) { … openWarningModal(); return; } … }` versus :249 `const handleDownload = () => { if (!keys) return; … downloadFile(\`nostr-keys-${Date.now()}.txt\`, content); }` — no `allChecksPassed` check — wired at :517-518 `<button onClick={handleDownload}>`. The nsec QR is a plain anchor at :524-532 `<a href={qrCodeData.nsec} download="nsec-qr.png">`. en.json keyGenerator.securityWarning.description: "Complete the security checklist below before copying or downloading your keys."
- Fix: Route `handleDownload` and both QR downloads through the same `allChecksPassed` gate as `handleCopy`, or drop the promise from the warning text. Given the audience, gate the nsec download and leave the npub paths ungated.

**26. /tools/key-generator, /tools and /guides/keys-and-security — KeyGenerator, "Generate new key pair" link under the key cards, src/components/interactive/KeyGenerator.tsx:538-550**

- Problem: A person who has generated keys and is still reading the page clicks the small "Generate new key pair" link — to see the animation again, or by mistake — and the nsec on screen is discarded instantly, with no confirmation and no way back. If they had not yet saved it, the account is gone, which is precisely the irreversible loss the whole component warns about. The unguarded control is the destructive one; the guarded control is copying the public key.
- Evidence: KeyGenerator.tsx:539-544 `onClick={() => { setKeys(null); setSecurityChecks(getSecurityChecks(t)); setQrCodeData(null); }}` — no modal, no `allChecksPassed` check, no check for whether anything was copied or downloaded. Compare :231-238 where copying opens a confirmation modal.
- Fix: Put the existing warning modal in front of regeneration instead of in front of copying, worded as "the key on screen will be discarded and cannot be recovered", and skip it once the person has downloaded or copied the nsec in this session.

**27. /tools/nip05-checker and /tools — NIP-05 Checker, error result panel, src/components/interactive/NIP05Checker.tsx:145-162 and 470-501**

- Problem: A person checks their own working NIP-05 on a domain that does not send `Access-Control-Allow-Origin` — a very common case, and one the site's own FAQ lists as a client-side-only problem. The browser blocks the fetch, and the tool renders a red cross with "Invalid NIP-05 / This identifier could not be verified", then "Network Error / Could not connect to verify the identifier / Fix: Check your internet connection and try again", then, third, the accurate line "This domain refuses checks made straight from a browser." Three messages, the first two wrong, headed by a verdict that is flatly false. The person concludes their setup is broken and starts changing a file that was fine.
- Evidence: NIP05Checker.tsx:150-161 sets `errorType: "network"` for the CORS case; :470-501 renders `results.invalid.title` ("Invalid NIP-05") plus `errorMessages['network']` (title "Network Error", fix "Check your internet connection and try again") plus `result.error` ("This domain refuses checks made straight from a browser…") stacked in one panel. The CORS branch also returns on the first URL attempt, so the `/nostr.json` fallback at :131 is never tried.
- Fix: Give CORS its own errorType and its own headline — something like "Can't check from a browser" with a neutral icon, not the red "Invalid" — and suppress the generic network error text and "check your internet connection" fix in that branch. Try both URLs before deciding.

**28. Every localized page (/pl/*, /es/*, /de/*, /zh/*, /ar/*, /hi/*) — header nav and footer link lists**

- Problem: A Polish reader working through /pl/guides/ clicks the footer link labelled in Polish "Słownik pojęć" and lands on the English glossary — even though /pl/glossary exists and is fully translated. The header above it is worse: the nav is untranslated English ("Tools Glossary Resources About") and every item points at the English route. There is no link anywhere on a Polish page to the Polish glossary.
- Evidence: dist/pl/guides/index.html: `<a href="/glossary" class="text-sm text-gray-600 ..."> Słownik pojęć </a>` and `<a href="/tools" ...>`, `<a href="/glossary" ...>`, `<a href="/resources" ...>`, `<a href="/about" ...>` in the desktop nav. Source: src/components/layout/Header.astro:6-11 `const navItems = [{label:'Tools',href:'/tools'}, {label:'Glossary',href:'/glossary'}, ...]` (literal labels, literal hrefs); src/components/layout/Footer.astro:19-24 `{ id: 'glossary', href: '/glossary' }` — labels resolve through `t('footer.links.<id>')` but hrefs never go through `localePath()`. dist/pl/glossary/index.html exists.
- Fix: Run every internal href in Header.astro and Footer.astro through `localePath(href, currentLocale)` where the route ships that locale (`localizedLocales()` already knows which do), and translate the four header labels through `t()` the way the footer already does. For routes with no locale variant, keep the English URL but say so.

**29. Every quiz guide (verified on /guides/what-is-nostr) — desktop "Continue learning" side panel**

- Problem: On guides that have a quiz the panel is positioned as a right-hand side rail instead of a bottom bar, and on ordinary laptop widths it sits on top of the article text, vertically centred over the passage the reader is on. Expected: a prompt that does not cover what you are reading.
- Evidence: Measured in the browser on the built page. At 1280x800 the panel rect is left 936 / right 1256 while the <article> rect is left 257 / right 1023 → 87px of the reading column covered. At 900x800 the panel is left 556 / right 876 against an article of left 91 / right 809 → 253px covered, 35% of the column. Source: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/navigation/ContinueLearning.tsx:470-472 `hasQuiz ? 'fixed end-6 top-1/2 -translate-y-1/2 z-40 w-80' : 'fixed bottom-6 left-1/2 ...'`, inside a wrapper that is `hidden md:block` (line 466), i.e. active from 768px up.
- Fix: Use the bottom-centred variant at every width, or gate the side rail behind a width where it clears the max-w-3xl column (roughly >=1440px) with a media query rather than `md:`.

**30. Every quiz guide (verified on /guides/what-is-nostr) — the floating "Continue learning" panel**

- Problem: After answering all six questions and reaching the results screen, the panel still says "Test your knowledge?" with "Take the Quiz" as its primary button and "Continue Learning" demoted to a grey secondary. The reader has just done the thing the site is telling them to do; pressing the primary button scrolls them back to the results card they are already looking at.
- Evidence: Verified live: after clicking through all 6 questions on /guides/what-is-nostr, the panel innerText read "GUIDE COMPLETE! / Test your knowledge? / Take the quiz to reinforce what you've learned. / Take the Quiz / Continue Learning", and localStorage showed the result was recorded (quizResults['what-is-nostr'] = {score:2,total:6,attempts:1}). Cause: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/navigation/ContinueLearning.tsx:254 `const completionIndicator = quizElement.querySelector('[data-quiz-completed], .quiz-completed');` — grep across /Users/piotrczarnoleski/nostr-beginner-guide/src shows no component ever emits either attribute or class, so `setQuizCompleted(true)` is unreachable and `showQuizCta` (line 441) is always true.
- Fix: Drop the DOM sniffing and use the state the site already keeps: `hasPassedQuiz(slug)` / `getQuizResult(slug)` from utils/gamification, plus the QUIZ_COMPLETED_EVENT that recordQuizResult already dispatches (gamification.ts:1035) so the panel flips to "Continue Learning" the moment the results screen appears.

**31. Footer, every non-English page (e.g. /pl/guides/, /ar/guides/, /de/guides/)**

- Problem: The footer is fully translated but every link goes to the English page. A Polish reader clicks "Pierwsze kroki" or "Słownik pojęć" and is thrown out of Polish into English, even though a Polish version of both exists. There is no way back except the language row at the very bottom.
- Evidence: Built /pl/guides/index.html footer: `href="/guides"` labelled "Pierwsze kroki", `href="/glossary"` labelled "Słownik pojęć", `href="/guides/faq"` labelled "FAQ". /pl/glossary/index.html, /pl/guides/index.html and /pl/guides/faq/index.html all exist in dist. Source: src/components/layout/Footer.astro, `footerLinks` and `toolLinks` hold literal hrefs ('/guides', '/glossary', '/guides/faq') while labels resolve through `t('footer.links.<id>', currentLocale)`.
- Fix: Run every footer href through `localePath()` / `guidesIndexPath()` when a localized variant exists for that route (the module already knows: `localizedLocales(path)`), and fall back to the English path only for the English-only routes (/tools, /resources, /about, /support, /settings, /privacy, /follow-pack).

**32. Guide pages with a quiz — the ContinueLearning panel (src/components/navigation/ContinueLearning.tsx)**

- Problem: After finishing a guide's quiz the panel still says "Test your knowledge / Take the Quiz", and its primary button scrolls the reader back up to the quiz they just completed. The panel decides the quiz is done by looking for `[data-quiz-completed]` or `.quiz-completed` inside the quiz element, and no quiz component on the site ever renders either marker, so `quizCompleted` is false for the life of the page. The "continue to the next guide" link is demoted to the grey secondary button on every quiz guide, forever.
- Evidence: src/components/navigation/ContinueLearning.tsx:254 `const completionIndicator = quizElement.querySelector('[data-quiz-completed], .quiz-completed');`. `grep -rn "data-quiz-completed\|quiz-completed" src/components/interactive/*.tsx` returns nothing — the thirteen quizzes render only `data-quiz` on the results screen (e.g. WhatIsNostrQuiz.tsx:116).
- Fix: Listen for the existing `QUIZ_COMPLETED_EVENT` (already dispatched by recordQuizResult) or call `hasPassedQuiz(currentSlug)` on mount, instead of sniffing for a DOM marker nothing emits.

**33. Header, main and mobile navigation, all seven locales**

- Problem: The header ships hardcoded English labels and hardcoded English destinations on every localized page. On the Arabic RTL page the whole nav bar reads "Tools / Glossary / Resources / About / Progress / Settings" in Latin script next to a fully Arabic footer. Clicking "Glossary" from /pl/ or /es/ or /de/ lands on the English glossary even though a translated one is built.
- Evidence: src/components/layout/Header.astro:7-12 — `const navItems = [{ label: 'Tools', href: '/tools' }, { label: 'Glossary', href: '/glossary' }, { label: 'Resources', href: '/resources' }, { label: 'About', href: '/about' }]`, plus literal "Progress", "View Progress", "Settings", "Tools" section header. Confirmed in built /ar/guides/index.html: `<html lang="ar" dir="rtl">` with `<a href="/glossary"> Glossary </a>`. No `nav` namespace exists in src/i18n/locales/pl.json at all, so the strings were never even authored.
- Fix: Add a `nav.*` namespace to the locale files and render the header labels through `t()`; route the hrefs through `localePath()` so Glossary lands on /pl/glossary from a Polish page. The Guides link already does this correctly via GuidesLink.tsx — copy that pattern for the rest.

**34. Home page (/) — "Quick Start Guides" section, third card: "📱 Choose Your App / Compare the apps and see which one suits the way you post / Compare apps"**

- Problem: One of the four entry points the home page offers a beginner promises an app comparison and delivers an intermediate power-user guide about running several clients at once. The reader wanted "which app do I install"; they land on "Syncing Strategy", "Desktop + Mobile", "Backup & Migration", "Advanced Workflows". The guide that actually answers the question is one card to the left.
- Evidence: src/pages/index.astro:311 `<a href="/guides/multi-client" ...>` under the heading "Choose Your App". src/content/guides/en/multi-client.mdx frontmatter: description "Maximize your Nostr experience with multiple clients. Desktop + mobile workflows, syncing strategies, and best practices for power users.", category "advanced"; it sits in SKILL_LEVELS.intermediate. The real chooser is src/content/guides/en/quickstart.mdx:58 "## Step 2: Choose Your Client" with the per-platform table (iPhone → Damus, Android → Amethyst, Web → Primal).
- Fix: Point the card at `/guides/quickstart#step-2`, or retitle it to what multi-client actually is ("Use more than one app") and move it out of the four beginner entry points.

**35. Home page — ResumeBanner (src/components/navigation/ResumeBanner.tsx)**

- Problem: The banner's level label and progress bar are frozen on Beginner for everyone, forever. It reads `getCurrentLevel()`, which returns the stored `progress.currentLevel`; the only code that ever writes that field is the Layout bootstrap, which sets it to 'beginner' when absent. `setCurrentLevel()` has no callers anywhere in the UI. So a reader halfway through Advanced comes back to "Continue your Beginner journey" and a bar reading "7/7 Beginner guides completed — 100%", a number that can never change again.
- Evidence: src/components/navigation/ResumeBanner.tsx:29-32 `const level = getCurrentLevel(); const progress = getLevelProgress(level);`. `grep -rn "setCurrentLevel\|setActivePath" src --include=*.tsx --include=*.astro` finds only local React setState calls; src/layouts/Layout.astro:250 `if (!data.progress.currentLevel) data.progress.currentLevel = 'beginner';` is the sole writer. gamification.ts's own comment on `getActiveLevel()` says a stored currentLevel "is what let the old data drift away from what was actually read".
- Fix: Use the derived `getActiveLevel()` (first unfinished level) that already exists in utils/gamification.ts, and drop the stored `currentLevel` from the banner's read path.

**36. Homepage, ResumeBanner (returning visitor banner above the hero)**

- Problem: The banner's "View Progress" button does not go to the progress page — it goes to the guides index. "Switch Level", sitting right next to it, goes to the same place. A returning reader who wants to see how far they have got is silently redirected to a list they already know, and two buttons with different labels do the identical thing.
- Evidence: src/components/navigation/ResumeBanner.tsx:53-58 — `const handleViewProgress = () => { window.location.href = '/guides'; };` and `const handleSwitchPath = () => { window.location.href = '/guides'; };`. Mounted at src/pages/index.astro:133 as `<ResumeBanner client:idle />`.
- Fix: Point `handleViewProgress` at /progress. Either give "Switch Level" a real destination (a level anchor on /guides, e.g. /guides#intermediate) or drop the third button — three buttons where two are the same reads as broken.

**37. Quiz results screen in every non-English locale (verified on /pl/guides/keys-and-security and /pl quiz score row)**

- Problem: A Polish, Spanish, German, Chinese, Arabic or Hindi reader finishes the quiz and the results screen switches to English mid-sentence. Expected: the whole screen in their language.
- Evidence: Rendered on /pl/guides/keys-and-security: "Quiz: bezpieczeństwo: 17% / 1 / 6 poprawnych odpowiedzi / Opanowane kluczowe zagadnienia  1 of 6 / Następne kroki ... / Review Keys & Backups / Revisit Privacy Guide / Powtórz quiz". Two causes: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/interactive/SecurityQuiz.tsx:170 and :176 hardcode "Review Keys & Backups" and "Revisit Privacy Guide" with no t() (both strings confirmed in the shipped bundle /Users/piotrczarnoleski/nostr-beginner-guide/dist/_astro/SecurityQuiz.B-bl71uK.js, which is the single bundle served to all seven locales), even though ui.quiz.reviewKeys and ui.quiz.privacySecurity already exist in en.json. And all thirteen quizzes hardcode the connector in `value={`${score} of ${total}`}` (e.g. /Users/piotrczarnoleski/nostr-beginner-guide/src/components/interactive/WhatIsNostrQuiz.tsx:150).
- Fix: Replace the two SecurityQuiz literals with t('ui.quiz.reviewKeys') and t('ui.quiz.privacySecurity'), and replace `${score} of ${total}` with a translated pattern (ui.quiz.scoreDisplay already has "{{score}} / {{total}} ..." — reuse that shape) in all 13 quizzes.


## medium

**38. /follow-pack and /tools#follow-pack-finder — the Export dialog**

- Problem: The reader has just picked accounts and clicks Export to get them into their app. The dialog opens on the "QR Code" tab, which cannot do anything yet: it shows a grey box saying the QR needs the list published first and a button pointing at another tab. The two tabs that work right now sit behind labels a non-developer cannot read — "NIP-02" and "Publish (optional)".
- Evidence: src/components/follow-pack/ExportModal.tsx:498-503 `const tabs = [{id:'qr',label:'QR Code'},{id:'copy',label:'Copy List'},{id:'nip02',label:'NIP-02'},{id:'nip51',label:'Publish (optional)'}]` with 'qr' as the initial tab; :670-686 the empty state "A scannable QR needs the list published first" / "Review & publish to get a QR"; :727 the NIP-02 tab body opens "NIP-02 formatted follow list (kind 3), for clients that import a file:".
- Fix: Open on "Copy List", which works with zero setup, and relabel the tabs in reader language: "Copy the list", "Download a file", "Publish it to Nostr", "QR code" — with the NIP numbers as a subtitle for anyone who wants them.

**39. /glossary — the "Read the {term} guide →" link under each term (all four locales)**

- Problem: The link text is generated from the glossary term, not from the guide it opens, so it promises guides that do not exist. "Read the Censorship Resistance guide" and "Read the Event guide" both open "Nostr Explained Simply"; "Read the npub guide" opens "Your Keys, Your Identity"; "Read the Feed guide" opens "Understanding the Outbox Model". A beginner following these expects a page on that one word and gets a general guide instead.
- Evidence: src/pages/[...lang]/glossary.astro:118 — `{t('glossary.readGuide', locale).replace('{term}', item.term)}`; src/i18n/locales/en.json:3527 — `"readGuide": "Read the {term} guide"`. Built /glossary/index.html: `<a href="/guides/what-is-nostr">Read the Censorship Resistance guide →</a>` and `<a href="/guides/keys-and-security">Read the npub guide →</a>`.
- Fix: Interpolate the guide's real title instead of the term: "Explained in: Your Keys, Your Identity →". The guide titles are already available to that page.

**40. /guides hub section heading vs. guide card badge vs. guide page chip vs. end-of-level banner**

- Problem: The first level has three different names, so a reader who is told to "finish the Beginner guides" cannot find a section called Beginner on the hub.
- Evidence: Verified live on /guides: the section <h2> is "Getting Started" (aria-label "Getting Started section"), while every card inside it carries the badge "Beginner" and the level bar reads "2 of 7 guides completed". On /guides/what-is-nostr the chip reads "Beginner" and on /guides/outbox-model the banner reads "Beginner Complete!". The guide page label comes from t('skillLevels.beginner.label') (/Users/piotrczarnoleski/nostr-beginner-guide/src/pages/[...lang]/guides/[slug].astro:133) while the hub heading comes from a separate GuideSection config.
- Fix: Pick one label per level and source it from a single key (skillLevels.<level>.label) in GuideSection, GuideCard, the guide page chip and GuideNavigation.

**41. /guides — level sections, card order**

- Problem: The reading order on the hub changes as you make progress: completed guides jump to the end of their section. Since the cards carry no number, a returning reader cannot tell which guide is first, and the layout they learned last visit is different this visit.
- Evidence: Verified live on /guides. With no progress the Getting Started section renders [Nostr Explained Simply, Your Keys Your Identity, Quickstart, Finding Your Community, FAQ, How Posts Travel, Outbox Model]. After setting completedGuides to ['what-is-nostr','keys-and-security'] and reloading it renders [Quickstart, Finding Your Community, FAQ, How Posts Travel, Outbox Model, Nostr Explained Simply, Your Keys Your Identity]. Source: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/guides/GuideSection.tsx:98-105 sorts completed last; /Users/piotrczarnoleski/nostr-beginner-guide/src/components/guides/GuideCard.tsx renders no ordinal (the `index` prop is passed at GuideSection.tsx:158 but never displayed).
- Fix: Keep the sequence order and mark completion visually (the green check and left border already exist), or, if resurfacing incomplete guides is the goal, add a separate "Pick up where you left off" row above a sequence-ordered list. Either way put the reading number on the card.

**42. /guides/quickstart — PrerequisiteWarning banner**

- Problem: On the site's own "launch in 5 minutes" page, the first thing a new arrival sees is a 487px amber alert telling them they are doing it wrong, whose primary button navigates away from the page they came for. The action that matches their intent ("Continue anyway") is a ghost button. Step 1 of the quickstart is pushed below the fold.
- Evidence: Verified live at 1280x800 on http://127.0.0.1:8899/guides/quickstart with cleared storage: the [role=alert] rect is 670x487 starting at y=528, text "You're skipping ahead / This guide builds on 2 prerequisites you haven't completed yet. ... / 1 Nostr Explained Simply / 2 Your Keys, Your Identity / Continue anyway / Start with first prerequisite". Source: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/navigation/PrerequisiteWarning.tsx:191-209 — `variant="ghost"` on continueAnyway, `variant="primary"` on the button that does `window.location.href = guidePath(incompletePrereqs[0].slug)`.
- Fix: Make it a one-line collapsed note with the prerequisite links inline, and let the primary action stay on the page ("Continue"), with "Start with the basics" as the secondary.

**43. /guides/relays-demystified — RelayExplorer, "Copy" and "Download" in the selected-relays bar, src/components/interactive/RelayExplorer.tsx:400-419**

- Problem: The person ticks four relays, presses Copy, and gets a toast saying "4 relay(s) copied to clipboard!" — a newline-separated blob of wss:// addresses and nothing else. Neither the tool nor the paragraph that introduces it says where that blob goes. The instruction they need ("Settings → Relays → Add") sits 70 lines further down the guide, in a different section about a different problem, and Download hands them a nostr-relays.txt with the same problem plus a file to find later.
- Evidence: RelayExplorer.tsx:400-403 `const urls = Array.from(selectedRelays).join("\n");` then `copyToClipboard(urls)`; :414-417 `downloadFile("nostr-relays.txt", urls)`. Both success paths end at a toast. The relays-demystified guide introduces the tool at :124 with "you only copy addresses that are actually answering right now" and never says what to do with them; the only "Settings → Relays → Add" line is at :199, inside the troubleshooting section.
- Fix: After a successful copy, show a short panel in the tool itself: paste these into your client under Settings → Relays → Add, one per line, then a link to the client-specific steps. That is the whole payoff of the selection and it is currently left to the reader.

**44. /guides/relays-demystified — RelayExplorer, missing starter-pack control, src/components/interactive/RelayExplorer.tsx:166 and 342-349**

- Problem: A beginner reading "Relays are the post offices of Nostr" reaches a grid of thirteen relays with latency numbers and NIP badges and no recommended starting point. The component was built with exactly that affordance — a one-click starter pack — and the function plus its relay list plus its confirmation toast all still exist, but no button anywhere calls it. So the reader has to guess which relays to pick, which is the decision the guide sent them here to avoid making alone.
- Evidence: RelayExplorer.tsx:166 `const STARTER_PACK_RELAYS = [` and :342-349 `const selectStarterPack = () => { … showToast(t('relayExplorer.toast.starterPackAdded'), "success"); };`. `grep -n 'selectStarterPack' RelayExplorer.tsx` returns only the definition — it is never referenced in the JSX. en.json still carries the orphaned string `relayExplorer.toast.starterPackAdded`: "Starter pack relays added!".
- Fix: Render the button next to the search field, labelled from a new i18n key ("Pick a starter set for me"), or delete the dead function, list and translation string. The guide's own table above (damus.io, nos.lol, relay.primal.net) is the set it should select.

**45. /guides/troubleshooting and /guides/relays-demystified — TroubleshootingWizard footer, "Still need help?", src/components/interactive/TroubleshootingWizard.tsx:664-690**

- Problem: This is the last exit for a person whose problem the wizard did not solve. "Ask on Nostr" opens snort.social's home page — a Nostr client, not a help channel, and one that asks for a key from someone who very likely arrived here because they cannot get into their account. "Documentation" opens github.com/nostr-protocol/nostr, the protocol specification repository: NIP markdown files written for implementers. A writer or musician who clicks it lands on a wall of protocol documents.
- Evidence: TroubleshootingWizard.tsx:668-671 `<a href="https://snort.social" target="_blank" …>{t('troubleshootingWizard.askOnNostr')}</a>`; :678-681 `<a href="https://github.com/nostr-protocol/nostr" …>{t('troubleshootingWizard.documentation')}</a>`. en.json: `askOnNostr` = "Ask on Nostr", `documentation` = "Documentation".
- Fix: Point "Documentation" at this site's own guides index or FAQ guide via `guidesIndexPath(locale)`, so the reader stays in material written for them, and point the help link at /support or a named Nostr help account rather than a client's front door.

**46. /guides/troubleshooting and /guides/relays-demystified — TroubleshootingWizard, "Save Diagnostic Info" button and its modal, src/components/interactive/TroubleshootingWizard.tsx:451-463, 613-618, 736-744**

- Problem: The person reaches a solution, sees a second button next to "Start Over" labelled "Save Diagnostic Info", and presses it. The modal shows a date, their operating system, a truncated browser user-agent and the title of the problem they clicked — nothing about which relays or client are involved, so nothing that would actually diagnose a Nostr problem. Pressing the button inside copies that text to the clipboard (it does not save anything) and fires a browser alert reading "Copy!". The help text says the information "helps developers understand your setup", but the page never names a developer, an address or a channel to send it to. It is output the reader cannot act on.
- Evidence: TroubleshootingWizard.tsx:452-462 builds a string of `timestamp`, `platform`, `userAgent`, `Current Step` and ends `await copyToClipboard(info); alert(t('troubleshootingWizard.diagnosticInfo.copy') + "!");` — with `diagnosticInfo.copy` = "Copy", the alert reads "Copy!". en.json `diagnosticInfo.description`: "Copy this information when asking for help. It helps developers understand your setup."
- Fix: Either drop the button, or make it worth pressing: include the answers the person gave, the relays the page tested and their results, and follow the copy with a concrete destination — the support page, or a prefilled note the reader can post. Replace the `alert()` with the toast pattern the sibling components already use, and label the button "Copy" since that is what it does.

**47. /guides/what-is-nostr — quiz results screen, first CTA**

- Problem: On the very first guide of the course, the results screen offers "Review keys and security" — a guide the reader has not opened yet. "Review" tells them they have already seen it, so they either skip it or go looking for something they never read.
- Evidence: Rendered results on /guides/what-is-nostr: buttons "Review keys and security" (href /guides/keys-and-security) and "Try the quickstart". keys-and-security is position 2 in SKILL_LEVELS.beginner.sequence (/Users/piotrczarnoleski/nostr-beginner-guide/src/data/learning-paths.ts:37-44), i.e. the next guide, not a revision. Label from ui.quiz.reviewKeys in /Users/piotrczarnoleski/nostr-beginner-guide/src/i18n/locales/en.json.
- Fix: Label the forward link as the next step ("Next: Your keys, your identity") and reserve "Review …" wording for links that point backwards in the sequence.

**48. /relay-feed-browser — discoverability**

- Problem: A whole interactive page is reachable from exactly one guide. It is not in the header, not in the footer, not on /tools, not on the homepage. Most readers will never know it exists.
- Evidence: Scanning all 141 built pages for `href="/relay-feed-browser` inside <main>: 7 hits, all of them the seven language versions of guides/finding-community. The /tools page (which hosts the other four interactive widgets) has no link to it.
- Fix: Add it as a fifth card on /tools, and to the footer Tools column next to Relay Playground.

**49. /relay-feed-browser — the whole page, linked from the finding-community guide in all seven languages, src/content/guides/*/finding-community.mdx:~116**

- Problem: Each localized finding-community guide sends the reader to /relay-feed-browser as the next step for discovering communities. The destination is English-only and not routed per locale, so an Arabic reader is dropped from a right-to-left Arabic guide into a left-to-right English page mid-task, with no notice on the link and no localized equivalent to switch to.
- Evidence: src/content/guides/ar/finding-community.mdx:114 `href="/relay-feed-browser"` (same in pl:116, zh:114, de:116, es:116, hi:113, en:116). src/pages/relay-feed-browser.astro has no `[...lang]` route and hardcodes its copy: "Read Nostr Like a Newspaper", "Pick a Category", "Browse Relays", "Add to Client".
- Fix: Short term, mark the link as leading to an English page in each localized guide. Better, move the page under `[...lang]` and push its copy through i18n, as the guides and the RelayFeedBrowser component itself already do.

**50. /resources and /support (and /relay-feed-browser)**

- Problem: These pages are dead ends. Neither has a single internal link in its body. /resources is a top-nav item that hands the reader a wall of outbound links and no way onward into the course; /support asks for money and then offers nothing to do next.
- Evidence: Scanning <main>…</main> of the built pages for `href="/…"`: /resources/index.html 0 internal links, /support/index.html 0, /relay-feed-browser/index.html 0. For contrast /progress has one ("Continue Learning").
- Fix: End each with the obvious next step: /resources → "Back to the course" plus the guide the list supports; /support → "Keep learning" to /guides; /relay-feed-browser → back to the Finding Your Community guide it is launched from.

**51. /settings — "Data Portability": Export Progress Data / Import Progress Data**

- Problem: Export hands the user a downloaded file (`nostrich-progress.json`); import demands pasted text into a textarea and offers no file picker. To move progress to another device the reader has to find the downloaded file, open it in a text editor, select all, copy, and paste. For a non-technical creator that is where the flow ends. If they paste anything malformed the only feedback is "Failed to import data. Please check the format."
- Evidence: src/components/progress/PrivacyControls.tsx: `handleExport` builds a Blob and triggers `a.download = 'nostrich-progress.json'`; the import UI is `<textarea ... placeholder="Paste your exported progress data here..." />` with `handleImport` reading `importText`.
- Fix: Add an `<input type="file" accept="application/json">` next to the textarea and read it with FileReader; keep paste as the fallback.

**52. /settings — "Show Progress Indicators" toggle**

- Problem: The toggle's description promises two things and delivers one. `Display "Guide X of Y" and reading progress bar` — but the "Guide X of Y" indicator is commented out on the guide template, so switching the toggle on produces only the 2px scroll bar. A reader who wants the position counter turns the switch on, sees nothing appear, and has no way to tell whether the setting is broken or the feature is missing.
- Evidence: src/components/progress/PrivacyControls.tsx: `Display "Guide X of Y" and reading progress bar`. src/pages/[...lang]/guides/[slug].astro:330 `<!-- <GuidePositionIndicator client:idle currentGuide={currentGuideNumGlobal} totalGuides={totalGuidesGlobal} /> -->` — the component is imported at :49 but never mounted.
- Fix: Either re-enable GuidePositionIndicator (it already respects the same toggle and is translated nowhere — needs t() first) or cut the phrase from the toggle description.

**53. /tools (Find People to Follow section) and /follow-pack**

- Problem: The same 527-account finder lives at two URLs under two different names, and the two do not know about each other. The footer's "Follow Pack Finder" goes to /follow-pack; the header's "Tools" goes to /tools where the same widget is embedded. Key Generator and NIP-05 Checker on that page both carry a "Dedicated page →" link; the follow pack does not, so from /tools the standalone page is invisible.
- Evidence: Built /tools/index.html hydrates `component-export="FollowPackFinder"` under `id="follow-pack-finder"`, and its only internal links are /tools/key-generator and /tools/nip05-checker. Built /follow-pack/index.html hydrates the same FollowPackFinder. Footer `toolLinks` (src/components/layout/Footer.astro) points "followPackFinder" at /follow-pack.
- Fix: Pick one canonical home. Easiest: replace the embedded widget on /tools with a card and a "Dedicated page →" link matching its two neighbours, leaving /follow-pack as the single place the finder runs.

**54. /tools and /guides/relay-guide — Relay Playground, Query tab relay dropdown and the "Check All" button in the toolbar, src/components/interactive/RelayPlayground.tsx:1360-1364 and 473-478**

- Problem: In light mode — the default for a visitor whose system is set to light — the Query tab's relay dropdown paints dark grey text on a near-black background, so the person cannot read which relay is selected while choosing one. The "Check All" button, the primary action of the whole playground toolbar, paints white text on a light grey fill and reads as an empty button. Both are functional controls whose labels are unreadable, not a matter of palette preference.
- Evidence: RelayPlayground.tsx:1362 `className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-900 dark:text-white"` — in light mode that is `#111827` text on `#111827`. :476 `className="ms-auto flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-medium transition-all"` — white on `#e5e7eb`, about 1.2:1. Both ship verbatim: the button class string is in dist/guides/relay-guide/index.html, the select class string in dist/_astro/RelayPlayground.*.js.
- Fix: Give both light-mode colours: `bg-white text-gray-900 dark:bg-gray-900 dark:text-white` on the select, and `text-gray-900 dark:text-white` on the Check All button. The same `text-white`-without-a-light-variant pattern appears on the Events tab Clear button (:1208-1212) and is worth sweeping.

**55. /tools/key-generator hero and FAQ versus /guides/keys-and-security "Generate Your Keys" — src/pages/tools/key-generator.astro:113-119 and src/content/guides/en/keys-and-security.mdx:94**

- Problem: The same KeyGenerator component gives opposite instructions depending on which page the reader landed on. The tool lander says don't keep these keys — let a client or signer make the one you intend to use. The guide, which is the numbered learning path, says you may keep them. The component's own heading, which is what a reader on /tools sees with no framing at all, is "Generate Your Nostr Keys — Create a secure key pair to access Nostr." A person who reads two of the three pages cannot tell whether the identity they just made is theirs to keep, and this is the one decision on the site that cannot be undone later.
- Evidence: key-generator.astro:117-119: "Making an identity you intend to keep? Let a client or a signer extension generate it instead." keys-and-security.mdx:94: "You can keep it as your actual Nostr identity, or treat it as practice and let your app create a fresh one later." en.json keyGenerator.title/description: "Generate Your Nostr Keys" / "Create a secure key pair to access Nostr." — no demo framing, and this is all a /tools visitor sees.
- Fix: Pick one answer and put it inside the component, where every embedding inherits it. If the answer is "this is a demonstration", the component's own title and description should say so and the guide should follow.

**56. All 13 guide quizzes, answer options — e.g. src/components/interactive/WhatIsNostrQuiz.tsx:274-281**

- Problem: The moment a person clicks any option, every option in that question is disabled for good. There is no warning that the choice is final, and misclicking on a phone is easy. Their only remedy is "Retake Quiz" on the results screen, which resets all questions. The Back button still works, so they can navigate to a question they answered wrongly, see it locked, and have no way to change it.
- Evidence: WhatIsNostrQuiz.tsx:273-281 `const showState = Boolean(selectedOption); … onClick={() => !showState && handleSelect(option.id)} … disabled={showState}`. `handleRestart` (:102-106) clears the whole quiz; there is no per-question retry.
- Fix: Either say so before the click ("answers are final — the explanation appears once you choose") or add a "Try this one again" control in the explanation panel that clears just `answers[currentQuestion.id]`.

**57. All 13 guide quizzes, results screen, "Concepts Mastered" row — e.g. src/components/interactive/WhatIsNostrQuiz.tsx:148-151**

- Problem: A Polish, Spanish, German, Chinese, Arabic or Hindi reader finishes a quiz and the results panel is in their language except for the score, which reads "3 of 5" in English — inside an Arabic right-to-left layout it is a stray Latin fragment. The line directly above it, the same number rendered through i18n, reads correctly ("3 / 5 poprawnych odpowiedzi"), so the same fact appears twice in two languages.
- Evidence: WhatIsNostrQuiz.tsx:148-151 `<ResultRow label={t("ui.quiz.conceptsMastered")} value={`${score} of ${total}`} />`. The identical literal is in all 13 quiz components (FindingCommunityQuiz, MultiClientQuiz, NIP05IdentityQuiz, OutboxModelQuiz, PrivacySecurityQuiz, ProtocolComparisonQuiz, WhatIsNostrQuiz, NIP17PrivateMessagesQuiz, SecurityQuiz, TroubleshootingQuiz, RelayGuideQuiz, RelaysDemystifiedQuiz, ZapsAndLightningQuiz). Compare pl.json `ui.quiz.scoreDisplay` = "{{score}} / {{total}} poprawnych odpowiedzi", which is used correctly two lines earlier.
- Fix: Add a `ui.quiz.scoreFraction` key ("{{score}} / {{total}}") and use it in all 13, or drop the row entirely since `scoreDisplay` above already states the score.

**58. All 13 quizzes — answer buttons**

- Problem: The first click on an option is final. A reader who mis-taps, or who clicks to read an option's description, is scored wrong with no way to change it: every option for that question becomes disabled immediately, and "Back" returns to a question whose buttons are still dead. The only reset is finishing the quiz and pressing "Retake quiz", which wipes all six answers.
- Evidence: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/interactive/WhatIsNostrQuiz.tsx:268 `const showState = Boolean(selectedOption);` then :274 `onClick={() => !showState && handleSelect(option.id)}` and :275 `disabled={showState}`. handlePrev (:101) only moves the index; nothing clears `answers`. Same code in all 13 quiz components.
- Fix: Either confirm the answer with the existing "Next question" button (reveal the explanation only then, and allow re-selection until it is pressed), or keep instant feedback but add a per-question "try again" that clears that one entry from `answers`.

**59. All non-English guide pages — BadgeEarnedModal; /guides level bars — LevelProgressBar; /progress and /badges pages**

- Problem: The progress and reward layer ships in English on a site that is otherwise translated into seven languages. The badge celebration modal — the single most prominent moment in this layer, and the only place a level certificate is ever seen — is entirely hardcoded English, and it fires on Polish, Arabic, Chinese and Hindi guide pages. The level progress bar under every heading on a localized /guides reads "3 of 7 guides completed" in English inside an otherwise translated page. /progress, /badges and /settings have no locale variants at all, so the header's "Progress" link drops a Polish reader onto an English page.
- Evidence: src/components/gamification/BadgeEarnedModal.tsx: literal strings "Category", "Rarity", "Share", "Copied!", "Maybe Later", and the share text `I just earned the "${badge.name}" badge on Nostrich.love!`; badge names and descriptions come from BADGE_DEFINITIONS, which is English-only. src/components/guides/LevelProgressBar.tsx:71 `{' '}guides completed` and :58 the English aria-label. Built output: dist/pl contains only `glossary` and `guides` — no `progress`, `badges` or `settings`.
- Fix: Route the modal and the progress bar through `t()`, move badge names/descriptions/requirements into the locale files, and either localize /progress and /badges or make the header links locale-aware.

**60. All six localized locales — "0 of 7 guides completed" on /pl|es|de|zh|ar|hi/guides, plus ResumeBanner and the guide-page "Last updated" line**

- Problem: Pages that are otherwise fully translated drop into English at exactly the places that carry numbers and state. On the Polish guides hub, every card, heading and filter label is Polish and the three progress bars read "0 of 7 guides completed". A returning reader gets an entirely English banner ("Welcome back!", "Resume Guide", "Switch Level") on top of a Polish page.
- Evidence: dist/pl/guides/index.html: "🌱 Pierwsze kroki Zacznij tutaj … 0 of 7 guides completed 0 %". Source: src/components/guides/LevelProgressBar.tsx:71 `{' '}guides completed` and :58 `aria-label={`${levelNames[level]} progress: ${completed} of ${total} guides completed`}` (English level names too). src/components/navigation/ResumeBanner.tsx:107 "Welcome back!", :110 "Continue your {levelLabel} journey", :117 "You were reading:", :156 "Resume Guide", :162 "View Progress", :170 "Switch Level", :141 "{levelLabel} guides completed". src/pages/[...lang]/guides/[slug].astro:364 `Last updated <time …>` renders untranslated on the six localized nip17 pages.
- Fix: Give LevelProgressBar and ResumeBanner an explicit `locale` prop the way GuidesContainer already gets one (the comment at GuidesContainer.tsx:44-47 documents why `useTranslation()` alone is not enough here) and move the strings into the locale JSON. Add a `guidePage.lastUpdated` key for the guide byline.

**61. Badge celebration modal — the dismiss button (src/components/gamification/BadgeEarnedModal.tsx)**

- Problem: The button that closes the celebration is labelled "Maybe Later", which reads as deferring an offer. Nothing is being offered: the badge is already earned and saved, and the only other button copies a share message to the clipboard. A reader who wants to get back to the guide has to guess that "Maybe Later" means "close", and one who reads it literally may believe they have postponed claiming something. (The "Claim on Nostr" button that this wording presumably belonged to never renders — the listener passes no `onClaim`.)
- Evidence: src/components/gamification/BadgeEarnedModal.tsx:402 `Maybe Later` on the `onClick={handleClose}` button; :344 `{onClaim && (<button ...>Claim on Nostr</button>)}`, and src/components/gamification/BadgeEarnedModalListener.tsx renders `<BadgeEarnedModal isOpen badge onClose />` with no `onClaim` prop.
- Fix: Label it "Close" (translated), and drop the dead `onClaim` branch.

**62. ContinueLearning "Level Complete" card, all non-English locales**

- Problem: The level name is injected untranslated into a translated sentence: a Polish reader sees "Kontynuuj do Intermediate" and "Ukończyłeś wszystkie przewodniki z poziomu Beginner!". The translated level names already exist in the locale files and are used elsewhere on /guides, so the mixed-language string is avoidable.
- Evidence: src/components/navigation/ContinueLearning.tsx: `t('continueLearning.continueToLevel').replace('{level}', nextLevelLabel)` where `nextLevelLabel = SKILL_LEVELS[nextLevelInfo.level].label`, and src/data/learning-paths.ts hardcodes `label: 'Beginner' | 'Intermediate' | 'Advanced'`. Meanwhile src/components/guides/GuideSection.tsx:62 already uses `t('skillLevels.${levelId}.title')`, which is translated in every locale file.
- Fix: Substitute `t('skillLevels.<level>.title')` instead of `SKILL_LEVELS[level].label` everywhere a level name reaches the reader.

**63. Every guide page — article header**

- Problem: Nothing tells the reader where they are in the course or how long it is. Expected on a page that calls itself a course: "Guide 1 of 16" or "1 of 7 in Beginner". What they get is a level chip ("Beginner") and, at the very bottom, the title of the previous and next guide. There is no way to judge how much is left without going back to the hub.
- Evidence: Full text extraction of /Users/piotrczarnoleski/nostr-beginner-guide/dist/guides/what-is-nostr/index.html contains no ordinal at all: the header reads "Nostr Explained Simply / 5 minutes / Beginner" and the footer reads "Start of Beginner Level / Next / Your Keys, Your Identity". The component that would say it is commented out: /Users/piotrczarnoleski/nostr-beginner-guide/src/pages/[...lang]/guides/[slug].astro:330 `<!-- <GuidePositionIndicator client:idle currentGuide={currentGuideNumGlobal} totalGuides={totalGuidesGlobal} /> -->`, and lines 333-339 comment out EnhancedGuideCompletionIndicator too. currentGuideNumGlobal/totalGuidesGlobal are still computed at line 136-137 and go unused.
- Fix: Re-enable GuidePositionIndicator (or render the position statically — it is a pure function of the slug) next to the level chip, phrased against the level the reader is in, e.g. "Beginner · 1 of 7".

**64. Every guide page — the end-of-guide "Continue" / "Next guide" prompt (ContinueLearning)**

- Problem: The prompt that carries a reader from one guide to the next reads the current guide slug off the last path segment. The site's own canonical URL and sitemap use the trailing-slash form, so for anyone arriving on `/guides/what-is-nostr/` the last segment is the empty string, no level is found, `nextGuide` is cleared and the prompt never appears at all. Whether a given reader sees it depends on which URL form their entry point used — an internal click from /guides works, a click from a search result may not.
- Evidence: src/components/navigation/ContinueLearning.tsx:153-163 `const pathParts = window.location.pathname.split('/'); const currentSlug = pathParts[pathParts.length - 1]; const guideLevel = getGuideLevel(currentSlug); if (!guideLevel) { setNextGuide(undefined); setIsLevelComplete(false); return; }` — then :258 `if (!nextGuide && !isLevelComplete) return;` never registers the scroll listener. dist/guides/what-is-nostr/index.html: `<link rel="canonical" href="https://nostrich.love/guides/what-is-nostr/">`; dist/sitemap-0.xml lists every guide with a trailing slash.
- Fix: Strip the trailing slash before splitting — `const currentSlug = window.location.pathname.replace(/\/+$/,'').split('/').pop()` — or better, pass `guideSlug` down as a prop from [slug].astro, which already knows it at build time (the same fix already applied to GuideNavigation).

**65. Every localized page (e.g. /pl/guides/what-is-nostr) — header navigation, src/components/layout/Header.astro:6-11**

- Problem: A Polish reader deep in a Polish guide sees a header reading "Guides / Tools / Glossary / Resources / About" in English, and clicking Glossary takes them to the English glossary — even though a Polish glossary is built and shipped at /pl/glossary. The one nav item that does adapt (Guides) only does so after hydration, so its server-rendered href points at the English index too.
- Evidence: Header.astro:6-11 `const navItems = [{ label: 'Tools', href: '/tools' }, { label: 'Glossary', href: '/glossary' }, …]` — literal labels and unprefixed hrefs, no `t()` and no `localePath()`. In dist/pl/guides/what-is-nostr/index.html: `<a href="/glossary" …> Glossary </a>`. src/pages/[...lang]/glossary.astro:20-24 generates a page for each of GLOSSARY_LOCALES (en, pl, es, de), and dist/pl/glossary exists.
- Fix: Run the labels through `getTranslations()` and the Glossary href through `localePath('/glossary', locale)`, falling back to the English page only for locales the glossary does not cover. Tools, Resources and About are English-only pages, so those can stay, but the label should still be the reader's language.

**66. Footer, "About" column — the "Support ⚡" link, and the page it opens**

- Problem: "Support" in an About column reads as help or contact. The page it opens is a donation page whose h1 is "Value for value" — the word support appears nowhere as a heading. A reader with a problem clicks it looking for help and is asked for money; a reader who wanted to donate has no obvious label to look for.
- Evidence: src/components/layout/Footer.astro `footerLinks.about` contains `{ id: 'support', href: '/support' }`, rendered as "Support ⚡". Built /support/index.html: `<title>Support Nostrich.love</title>`, `<h1>Value for value</h1>`.
- Fix: Rename the link to what it is — "Donate ⚡" or "Support the site ⚡" — and add a matching h1 or eyebrow line on the page so arriving confirms the click.

**67. Glossary discoverability — links from the course into /glossary**

- Problem: The glossary is a top-level nav item and exists in four languages, but the course itself almost never sends anyone to it. Exactly one guide of sixteen links to it, in a closing italic aside. The moment a reader hits "kind 10050" or "outbox" mid-guide is the moment the glossary is worth something, and nothing points there.
- Evidence: Scanning <main> of all built pages for `href="/glossary"`: 3 hits total — the homepage footer-of-content link, /404.html, and guides/what-is-nostr (src/content/guides/en/what-is-nostr.mdx:201, "look up any unfamiliar word in the [Nostr glossary](/glossary)"). The other 15 guides link to it zero times.
- Fix: Add the same one-line pointer to the end of every guide (it is one MDX snippet), or wire the existing HoverCard component to glossary terms so the definition arrives where the confusion happens.

**68. Header nav: "Tools" (/tools) and "Resources" (/resources), plus the guide "Essential Nostr Tools" (/guides/nostr-tools)**

- Problem: Three destinations with near-identical names and overlapping content sit in the information architecture with no cross-links. /tools is browser widgets, /resources is outbound links to docs and clients, /guides/nostr-tools is another outbound directory of tools. A creator cannot predict which one holds what, and having picked wrong there is no link to the other two.
- Evidence: h1s: /tools "Nostr Tools", /resources "Nostr Resources", /guides/nostr-tools "Essential Nostr Tools — A curated directory of the most useful Nostr tools and services". Internal links inside <main> of /resources: none at all. Inside /tools: only /tools/key-generator and /tools/nip05-checker. Inside /guides/nostr-tools: only /guides/quickstart plus prev/next.
- Fix: Merge or rename so the split is legible — e.g. "Try it here" (/tools, things that run in the browser) and "Where to go next" (/resources, off-site) — and put a one-line cross-link at the bottom of each. Fold the nostr-tools guide's directory into /resources so there is one list to keep current.

**69. Header — mobile menu "Tools" section vs desktop nav vs /tools page**

- Problem: Three different answers to "what tools are there". The mobile menu lists Key Generator, NIP-05 Checker and Twitter Bridge. The desktop header has no tools submenu at all. The footer lists Relay Playground, Key Generator, Follow Pack Finder. The /tools page has Key Generator, Follow Pack Finder, NIP-05 Checker, Relay Playground — and never mentions Twitter Bridge. A desktop reader effectively cannot find the Twitter Bridge except by reading the protocol-comparison guide.
- Evidence: src/components/layout/Header.astro:19-23 `toolItems` = Key Generator, NIP-05 Checker, Twitter Bridge, rendered only inside the `md:hidden` mobile nav. Footer `toolLinks` = Relay Playground, Key Generator, Follow Pack Finder. Built /tools/index.html islands: KeyGenerator, FollowPackFinder, NIP05Checker, RelayPlayground. Links to /twitter-bridge outside the mobile-menu block exist on 8 pages only (the seven locales of guides/protocol-comparison plus /nostr-vs-twitter).
- Fix: Make /tools the single inventory: add Twitter Bridge to it, and have the mobile and footer lists mirror that page rather than each carrying their own subset.

**70. Header, top right — the person-glyph button (`aria-label="User menu"`) and its dropdown**

- Problem: The only route to /progress and /settings is behind an icon that means "account" on every other site. On a site with no accounts, no login and no server-side data, a person-shaped icon invites a click looking for sign-in and gives progress tracking instead — and the reader who wants their progress will not think to look under an account icon.
- Evidence: src/components/layout/Header.astro:60-70 — `aria-label="User menu"`, `id="user-menu-button"`, with an SVG of a head-and-shoulders; the dropdown contains only /progress and /settings. Scanning <main> of all built pages: 0 in-content links to /settings and 1 to /progress (from the orphaned /badges page).
- Fix: Swap the glyph and the label for what the menu holds — a chart or a mortarboard labelled "Your progress" — or promote "Progress" to a plain nav item next to Guides. Keep Settings inside it.

**71. Home page (/) and every page a returning reader loads — ResumeBanner, the "View Progress" and "Switch Level" buttons**

- Problem: The banner offers three buttons. Two of them do the same thing. "Switch Level" carries a rotate icon and promises a level chooser; it navigates to /guides. "View Progress" also navigates to /guides — while the header's own "View Progress" item, visible at the same moment, goes to /progress. Both destinations are hardcoded English, so a reader who was mid-course in Polish is dropped onto the English hub.
- Evidence: src/components/navigation/ResumeBanner.tsx:54-60 `const handleViewProgress = () => { window.location.href = '/guides'; }; const handleSwitchPath = () => { window.location.href = '/guides'; };` — wired at :159 and :167. Compare src/components/layout/Header.astro:72 `<a href="/progress">…Progress</a>`. The Resume button next to them correctly uses `guidePathFromLocation(lastViewed.slug)` (:49), so the locale handling is inconsistent within one component.
- Fix: Send "View Progress" to `/progress` and drop "Switch Level" (nothing is gated any more, so there is no level to switch), or make it open the level sections on the guides hub. Route the remaining destination through `guidesIndexPath(splitLocale(location.pathname).locale)`.

**72. Home page (/) — hero CTA "Start the course" vs. the closing CTA "Start Learning" vs. the "Quick Start Guides" section**

- Problem: The page makes the same offer three times and sends the reader to three different places. "Start the course" opens guide 1. The identical-sounding "Start Learning" at the bottom opens the index. In between, a section headed "Four places people usually start" re-offers guide 1 as "Start here" alongside three other starting points. A reader who scrolls has to work out which of the starts is the start.
- Evidence: src/pages/index.astro:206 `<a href="/guides/what-is-nostr" ...>Start the course</a>`; :227 secondary link `see the whole course first` → /guides; :296-300 `<h2>Quick Start Guides</h2><p>Four places people usually start</p>` with a card linking `/guides/what-is-nostr` labelled "Start here"; :406 `<a href="/guides" ...>Start Learning</a>`. Counting distinct destinations offered on the page: 14.
- Fix: Keep one primary verb. Make the closing CTA repeat the hero exactly (same words, same href), and relabel the Quick Start section to what it is — "Or jump straight to a topic" — so it reads as an alternative rather than a second beginning.

**73. Home page (/) — hero copy**

- Problem: The site is built for writers, artists and musicians, and the landing page never says so. The problem statement addresses anyone with a social account; the headline's second line, "from your first key to the protocol itself", reads as a developer track. A musician cannot tell this was written for them, and a developer cannot tell it wasn't.
- Evidence: src/pages/index.astro:172-176 "Everything you have posted, and everyone who follows you, sits on a server that belongs to somebody else. / The rules there can change on a Tuesday…"; :193-196 `<span class="block">Learn Nostr, Step by Step</span><span …>from your first key to the protocol itself</span>`. The words creator, writer, artist, musician, audience and following-as-a-living appear nowhere in the hero, the "How the course works" section, or the "What changes on Nostr" section.
- Fix: Name the reader in the hero — one clause is enough ("for writers, artists and musicians who want their audience to be theirs") — and let the "Tips land with you" value prop rise into it, since that is the one benefit only this audience is buying.

**74. Home page — ResumeBanner "View Progress" and "Switch Level" buttons**

- Problem: Two of the banner's three buttons lie about where they go. "View Progress" navigates to /guides, not /progress, which is a live page reachable from the header. "Switch Level" also navigates to /guides, and nothing on /guides switches level — level gating was removed, so there is no such control to land on. A reader who clicks either one ends up on the guide list wondering what happened.
- Evidence: src/components/navigation/ResumeBanner.tsx:54-60 `const handleViewProgress = () => { window.location.href = '/guides'; };` and `const handleSwitchPath = () => { window.location.href = '/guides'; };`, wired at :159 and the button below it.
- Fix: Point "View Progress" at /progress and delete "Switch Level" — it is a leftover from the gating layer.

**75. Language switcher (globe icon in the header) on any English-only page: /, /tools, /about, /resources, /support, /follow-pack, /nostr-vs-***

- Problem: Picking a language from the homepage or the tools page does not translate the page — it navigates you somewhere else entirely, to that language's guides index, with no warning. A reader who was halfway through the follow-pack finder and switched to Polish loses the page they were on.
- Evidence: src/i18n/paths.ts:112-116 — `localeEntryPath()`: "Otherwise (the homepage, /about, /tools, /nostr-vs-*, which are English only) → that locale's guides hub", implemented as `return guidesIndexPath(locale);`. The switcher's options use this directly (src/components/LanguageSwitcher.tsx, `hrefFor`).
- Fix: Keep the redirect (a no-op is worse) but say what is happening: mark the untranslated options in the dropdown, e.g. "Polski — przewodniki" or a small "guides only" note, so the jump is a choice rather than a surprise.

**76. Quiz results screen — "Next steps" row**

- Problem: A reader who scores badly is told "Review the sections you missed below." Nothing is below — the quiz sits at the end of the guide and the material is above it — and the screen never says which questions were missed. The per-question explanations were shown during the quiz and are gone once the results appear, so the advice is unactionable.
- Evidence: Rendered results on /guides/what-is-nostr: "Nostr Fundamentals Quiz: 33% / 2 / 6 correct answers / Critical concepts mastered  2 of 6 / Next steps  Review the sections you missed below. / Review keys and security / Try the quickstart / Retake quiz". String from /Users/piotrczarnoleski/nostr-beginner-guide/src/i18n/locales/en.json ui.quiz.reviewSections: "Review the sections you missed below." The results branch (WhatIsNostrQuiz.tsx:111-191) renders only the score, two links and a retake button — no per-question recap.
- Fix: List the missed questions on the results screen with their explanations (the data is already in `questions` and `answers`), and drop "below" or link each miss to the anchor of the section it came from.

**77. ResumeBanner — the dismiss (X) button, on screens narrower than 640px**

- Problem: On a phone the returning reader cannot get rid of the banner. The X is absolutely positioned with no positioned ancestor, so it resolves against the page origin — 16px from the top of the document, which is inside the sticky header's band. The header is z-50 and the button has no z-index, so it renders underneath the header: invisible, and the tap hits the header instead.
- Evidence: src/components/navigation/ResumeBanner.tsx:178 `className="absolute top-4 end-4 sm:static p-2 ..."`. No ancestor is positioned: the banner root (:88) is `w-full bg-gradient-to-r ...`, the container (:95) `container mx-auto px-4 ... py-4`, the row (:96) `flex flex-col sm:flex-row ...` — none carry `relative`, and src/layouts/Layout.astro:156 `<body class="min-h-screen bg-background-light ...">` is not positioned either. src/components/layout/Header.astro:24 `class="sticky top-0 z-50 ..."`.
- Fix: Add `relative` to the banner's root div (it already has `sm:static` on the button, so the desktop layout is unaffected), or drop the absolute positioning and let the button sit in the flex row on mobile too.


## low

**78. /404 page**

- Problem: The 404 is English-only and all four recovery links go to English pages. A reader who mistypes or follows a stale /pl/guides/… URL is dropped into English with no way back to their language except the footer's language row at the bottom of the page.
- Evidence: Built 404.html: h1 "404", links `/`, `/guides`, `/tools`, `/glossary`, all un-prefixed; the "Go Back" button is `onclick="history.back()"`. src/pages/404.astro carries no locale handling.
- Fix: Read the locale prefix off `window.location.pathname` in a small inline script and rewrite the four recovery links (and ideally the copy) to that locale — the same trick progress.astro:428-431 already uses.

**79. /badges — "Collection Progress" summary, server-rendered text**

- Problem: The page paints "0 of 9 badges earned" before its script runs, then swaps to "N of 12". There are twelve badges (nine achievements plus three level certificates). On a slow load, or if the module script fails, 9 is the number the reader is left with — and it is the wrong denominator for a collection they are being invited to complete.
- Evidence: src/pages/badges.astro:69 `0 of 9 badges earned` in static markup; the inline script's `updateSummary()` computes `Object.keys(badgeMetadata).length`, which is BADGE_DEFINITIONS.length = 12. Confirmed in built output: `dist/badges/index.html` contains the literal "0 of 9 badges earned".
- Fix: Render the count from `BADGE_DEFINITIONS.length` in the frontmatter, the way the badge grid above it already does.

**80. /guides — the search box and the interest filter chips together**

- Problem: Typing in the search box while a filter chip is active silently overrides the chip, which stays highlighted as if it were still applied. Clearing the search box then snaps the list back to the filter with no explanation. The reader sees results change twice without touching the control they think is in charge.
- Evidence: src/components/guides/GuidesContainer.tsx:83-86 `const getActiveSearch = () => { if (searchQuery.trim()) return searchQuery.toLowerCase(); return activeFilter; }` — a single value is passed to every GuideSection as `activeFilter`. The reverse direction is handled (`handleFilterChange` at :73 does `setSearchQuery('')`), but typing never clears `activeFilter`.
- Fix: Clear the active chip when the reader starts typing (mirroring what handleFilterChange already does), or combine the two as an AND and show a single "showing N of 16" line with a reset control.

**81. /progress — Beginner level progress bar, before hydration**

- Problem: The static HTML says the Beginner level has 6 guides. It has 7. JavaScript corrects it a moment later, so the reader sees the wrong denominator flash on every load, and anyone with JS blocked sees three empty level cards with wrong counts and no guide list at all.
- Evidence: src/pages/progress.astro:120 ships `<span class="progress-text …">0/6 guides</span>` and `<div class="guide-list …"><!-- Guides populated by JavaScript --></div>`. src/data/learning-paths.ts:37-45 lists 7 slugs in `beginner.sequence`. /guides/index.html says "0 of 7 guides completed" and /badges/index.html says "Finish all 7 beginner guides".
- Fix: Render the counts and the guide list server-side from SKILL_LEVELS (the page already imports it at line 5) and let the script only fill in what is completed.

**82. /progress — the three static "Progress" rows before hydration**

- Problem: The server-rendered fallback under each level says "0/6 guides" for Beginner and "0/6" for Intermediate, then the script corrects Beginner to 0/7. Beginner has seven guides. Same class of stale hardcoded number as the 15 above, from the same page.
- Evidence: src/pages/progress.astro static markup: `<span class="progress-text ...">0/6 guides</span>` under both the Beginner and Intermediate sections; SKILL_LEVELS.beginner.sequence has 7 entries. Confirmed in built output: `dist/progress/index.html` contained two occurrences of "0/6 guides".
- Fix: Emit the counts from `getLevelLength(level)` in the frontmatter rather than typing them into the markup.

**83. /settings — closing line under "About Our Privacy Approach"**

- Problem: The reader is told to "reach out on Nostr" and given nothing to reach out to: no npub, no link, no client button. It is an instruction with no target.
- Evidence: Built /settings/index.html: "Have questions about privacy? Check our <a href=\"/privacy\">Privacy Policy</a> or reach out on Nostr." — the only anchor in the sentence is the privacy policy. The site's npub (npub1p6t6gjhy3q4rfmcxuff7hu3xh5u09cvzem98d48arfzsrzd9kxws3cpeyl) exists but only on /support.
- Fix: Link "reach out on Nostr" to the njump profile the /support page already uses, or drop the clause.

**84. /tools and /guides/relay-guide — Relay Playground, Query tab, "Show JSON" toggle, src/components/interactive/RelayPlayground.tsx:1429-1445**

- Problem: The toggle sits directly beside "Results: 12", so a person presses it expecting to see the raw JSON of the posts they just fetched — the thing a "see the real data" tool exists to show. What appears is the outgoing request filter instead, the same three lines regardless of what came back. And with zero results the button does nothing visible at all, because the panel is gated on `results.length > 0`, which is exactly when a curious person is most likely to press it.
- Evidence: RelayPlayground.tsx:1437-1443 `{showRaw && results.length > 0 && ( … <pre>{JSON.stringify(["REQ", "sub", { kinds: queryKinds, limit }], null, 2)}</pre> … )}` — `results` is never serialized. en.json `buttons.showJson` = "Show JSON".
- Fix: Show the events themselves, or relabel it "Show the request" and move it next to the query builder where the request is composed. Drop the `results.length > 0` gate so the button is not silently inert.

**85. /tools — Key Generator, "Generate new key pair" (the regenerate link under the key display)**

- Problem: The screen has just told the reader, in three checkboxes, that this key cannot be recovered if lost. The one button that destroys it takes a single click with no confirmation and no undo. Anyone clicking it to see what it does — or to get a nicer-looking npub — loses the key they may already have pasted into a client.
- Evidence: src/components/interactive/KeyGenerator.tsx:536-540 `onClick={() => { setKeys(null); setSecurityChecks(getSecurityChecks(t)); setQrCodeData(null); }}` with label en.json `keyGenerator.buttons.regenerate` = "Generate new key pair". The checklist directly above reads "I understand this is my only password - if lost, it cannot be recovered". The component holds keys in React state only, so nothing survives the click.
- Fix: Reuse the existing warning modal for this action: "Discard these keys and generate new ones? If you have not saved the nsec, it is gone." with "Discard" / "Go back".

**86. /tools — page metadata and the missing client recommender**

- Problem: Someone arriving from a search result that promises a "client recommender" finds four tools, none of which is one. The component exists in the codebase and is wired into the guide component map, but it is rendered on no page and in no guide.
- Evidence: src/pages/tools.astro:9 `const description = 'Free browser-based tools for Nostr: key generator, client recommender, NIP-05 checker, follow pack finder, and relay explorer…'` — the `tools` array at :34-66 contains key-generator, follow-pack-finder, nip05-checker, relay-playground only. Header.astro:13-16 already carries a note that the "Client Recommender" nav item was removed because its anchor never existed. `grep -l ClientRecommender src/content/guides/en/*.mdx` returns nothing; the same is true of ClientComparisonTable, which is also imported into the [slug].astro component map.
- Fix: Drop "client recommender" from the meta description, and either give ClientRecommender a home (the obvious one is quickstart Step 2, next to the platform table) or delete it and ClientComparisonTable from the component map.

**87. Every guide page — browser console**

- Problem: Debug logging ships to production and fires continuously while a reader scrolls the second half of any guide.
- Evidence: /Users/piotrczarnoleski/nostr-beginner-guide/src/components/progress/ProgressTracker.tsx:34-41 logs '[ProgressTracker] Scroll progress: N%' on every rAF past 50% and '[ProgressTracker] Guide completed: <slug>'. Present in the built bundle /Users/piotrczarnoleski/nostr-beginner-guide/dist/_astro/ProgressTracker.CYGR4Jwc.js: `o>.5&&console.log("[ProgressTracker] Scroll progress:",...)`.
- Fix: Remove both console.log calls, or gate them behind import.meta.env.DEV.

**88. Every quiz guide — quiz component on a return visit**

- Problem: Quiz results are recorded but never shown back to the reader. Reload the guide, or come back tomorrow, and the quiz starts at question 1 with no sign you already took it or what you scored. Nothing on the guide page reacts to finishing a quiz either.
- Evidence: WhatIsNostrQuiz keeps everything in useState (WhatIsNostrQuiz.tsx:50-52) and never reads stored results — grep for getQuizResult/hasPassedQuiz across /Users/piotrczarnoleski/nostr-beginner-guide/src/components returns nothing. recordQuizResult does persist and dispatch (/Users/piotrczarnoleski/nostr-beginner-guide/src/utils/gamification.ts:1016,1035); the only listener for QUIZ_COMPLETED_EVENT is GamificationExplainerWrapper.tsx:41, which lives on the /guides hub, not on the guide page. Verified live: after finishing the quiz, localStorage held quizResults['what-is-nostr'] = {score:2,total:6,attempts:1,passedAt:0} while the page showed no acknowledgement outside the results card.
- Fix: On mount, read getQuizResult(slug) and show a "You scored 4/6 last time — retake?" state above the first question instead of a cold start.

**89. Nav label "Tools" → /tools**

- Problem: One page, three names. The nav calls it Tools, the browser tab says Interactive Tools, the h1 says Nostr Tools. Small, but it costs the reader a beat every time they check whether they landed where they clicked.
- Evidence: src/components/layout/Header.astro:8 `{ label: 'Tools', href: '/tools' }`; built /tools/index.html `<title>Interactive Tools | Nostrich.love</title>` and `<h1>Nostr Tools</h1>`. The footer adds a fourth variant, "Interactive Tools".
- Fix: Pick one name and use it in the nav label, the title and the h1.

**90. PrerequisiteWarning banner (all guides with prerequisites)**

- Problem: The banner's time information never appears. The per-prerequisite clock chip and the "this will take about N minutes" footer are coded but always empty, so the reader is asked to do prerequisite work with no idea what it costs.
- Evidence: /Users/piotrczarnoleski/nostr-beginner-guide/src/pages/[...lang]/guides/[slug].astro:231-237 builds prerequisiteData as `{ slug, title }` only, while PrerequisiteWarning renders the chip behind `{prereq.estimatedTime && ...}` (PrerequisiteWarning.tsx:157) and the footer behind `totalTime > 0` (:183), where calculateTotalTime (:71-82) sums the same missing field. Confirmed in the rendered banner on /guides/quickstart, which lists "1 Nostr Explained Simply / 2 Your Keys, Your Identity" with no times.
- Fix: Add `estimatedTime: prereqGuide?.data.estimatedTime` to the prerequisiteData map in [slug].astro.

**91. Site-wide — ClientRecommender and ClientComparisonTable, src/components/interactive/ClientRecommender.tsx, ClientComparisonTable.tsx, referenced in src/pages/[...lang]/guides/[slug].astro:290-295**

- Problem: Two finished tools aimed squarely at the audience's hardest early question — which app should I install — are registered in the MDX component map but used by no guide in any of the seven languages and hosted on no page, so nobody can reach them. The nav entry that used to point at one was removed rather than the tool being given a home. Meanwhile /guides/multi-client discusses choosing between clients with no interactive help at all.
- Evidence: `grep -rn 'ClientRecommender\|ClientComparisonTable' src/content/` returns nothing across all 112 MDX files, and the same grep over the built site returns nothing. Header.astro:13-16 carries the note: "'Client Recommender' was removed here — it pointed at /tools#client-recommender, an anchor that has never existed on /tools (the ClientRecommender component is not rendered anywhere…)".
- Fix: Either place the recommender in /guides/multi-client and the comparison table alongside it and restore the nav entry, or delete both components so the map stops implying they are available. The same applies to NostrSimulator, QuickstartSimulator, KeyVisualizer, InteractiveChecklist and ScreenshotGallery, all registered and all used by zero guides.

**92. Skip-to-content link, every page in all seven locales**

- Problem: The first thing a keyboard or screen-reader user meets on an Arabic or Chinese page is an English phrase.
- Evidence: src/layouts/Layout.astro:158 — `<a href="#main-content" class="skip-to-content">Skip to content</a>`, literal, no `t()`. Confirmed in built /ar/guides/index.html.
- Fix: Route it through `t()` with the locale the layout already knows.

