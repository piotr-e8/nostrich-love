# Session handoff — 2026-07-27/28

Audit-driven remediation session. Fourteen commits, `e94df88` → `7e273e7`, on
branch `fix/en-guide-urls-and-hreflang`.

Read this before changing anything in i18n, routing, hydration or the guides
hub — several decisions here look wrong out of context and will get "fixed"
back into bugs.

---

## 1. Where things stand

| | |
|---|---|
| Branch | `fix/en-guide-urls-and-hreflang` (fast-forward from `main`) |
| Typecheck | 0 errors (was 3289) |
| Tests | 30, `npm run test` |
| Build | 152 pages |
| Broken internal links | 0 (was ~98) |
| Unlabelled form controls | 0 (was 27) |
| CI | `.github/workflows/ci.yml` — never run on a real runner yet |

All 21 critical findings from the audit are closed. **127 findings remain open**
— 83 high, 17 medium, 6 low, plus the 21 criticals that are now fixed are
excluded. See `open-findings.md` in this directory: every entry has the file,
the evidence someone saw when they opened it, and a suggested fix.

---

## 2. Decisions that must not be silently reverted

### English URLs are un-prefixed

`prefixDefaultLocale: false` in `astro.config.mjs` means English guides live at
`/guides/<slug>`, **not** `/en/guides/<slug>`. Before this session the route
emitted only `/en/`, so `/guides/what-is-nostr/` 404'd in production while ~98
internal links pointed at it.

`src/pages/[lang]/` is now `src/pages/[...lang]/` — a rest param, because
`getStaticPaths` returns `lang: undefined` for English and only a rest param can
emit a route with the segment absent.

**Never hand-build a locale path.** `src/i18n/paths.ts` is the single source of
truth and is unit tested. `vercel.json` 301s the old `/en/guides/*` URLs.

### hreflang is emitted only for guides

`hasLocalizedVersions()` in `paths.ts` gates it. The guides are the only route
that exists in all seven locales; the other 32 pages are English-only. Emitting
hreflang for them advertised 404s as alternates, which makes search engines
discard the whole cluster.

If you localize another route, extend that function — do not remove the gate.

### The client loads one locale, the server loads all seven

`src/i18n/index.ts` splits on `import.meta.env.SSR`. The server needs every
locale (one build renders all of them); the client dynamically imports only the
locale it is showing, plus English as the `getValue()` fallback. That took the
client chunk from 564 KB to ~60–98 KB per locale.

The English fallback is load-bearing, not defensive: `ar` is missing ~1100 keys
against `en` and `hi` ~1600. Drop it and those readers see raw dotted keys.

Top-level await keeps `t()` synchronous for all 38 importing components. Do not
"fix" it into an async API.

### Islands hydrate on idle, not on load

429 `client:load` became `client:idle`. 66% of a FAQ page's JavaScript now
arrives after the load event.

`client:visible` would be better and was tried first — see §3, it is not a code
problem.

### There is no level gating

The lock layer is gone: `UnlockButton`, `PrerequisiteModal` (which never
rendered — its `isCritical` condition is in no content file and not in the
collection schema), the whole unlock API, and ~5400 lines. Badges, XP, streaks
and progress tracking stayed — those are rewards, not gates.

`unlockedLevels` and `manualUnlock` still exist in persisted localStorage for
current users. They are vestigial. Removing them needs a migration; the cost of
getting that wrong is someone's saved progress.

### FAQAccordion is an `.astro` component

It wraps `<details>/<summary>` and ships zero JavaScript, replacing 29 React
roots per FAQ page (203 across locales). It deliberately has **no open/close
animation** — see §3.

---

## 3. Lessons

### My measurement tooling was wrong five times

Every headline number produced by a first-pass script in this session was
wrong, always in the direction of over-reporting:

| Reported | Actual | Cause |
|---|---|---|
| 221 missing i18n keys | 92 | `getValue()` resolves array indices because `'0' in []` is true in JS; the checker only walked dicts |
| 43 unlabelled controls | 27 | 400-character lookback missed a wrapping `<label>` |
| 6 still-unlabelled after fixes | 0 | `>` inside `onChange={(e) => …}` truncated the attribute capture, hiding `aria-label` placed after it; `<select>` in a comment counted as a control |
| 41 → 5 islands | 41 → 12 | `grep -c` counts matching **lines**, not occurrences |
| 3 locales missing the blockchain fix | 0 | regex searched for the English phrasing in translated prose |

Two of these nearly caused real damage: one would have spent 35 agents writing
translations that already existed, another nearly reverted a correct hydration
change as broken.

**Treat any first-pass count as an estimate.** Confirm with a second method
before acting on it — and when a check says something is missing, verify the
check actually ran against what you think it did.

### The automated browser cannot verify anything visual

`document.hidden` stays `true` in the Browser pane even after resizing the
viewport and fronting the tab. Consequences:

- **IntersectionObserver is suspended**, so every `client:visible` island fails
  to hydrate. This looks exactly like a broken directive. It is not.
- **Style recalculation is suspended**, so `getComputedStyle` returns stale
  values — the FAQ chevron's `[open]` styling could not be confirmed despite the
  rule matching, having higher specificity, and sitting in a later stylesheet.
- Screenshots render, but scroll position does not reliably update.

What *is* reliable there: DOM structure and attributes, `details.open` state,
event listeners firing, `performance.getEntriesByType('resource')` for what
actually downloaded, and console errors.

Two decisions were made conservatively because of this and should be revisited
in a real browser:
1. `client:idle` instead of `client:visible` across 402 directives.
2. No `::details-content` height animation on FAQAccordion — if that transition
   misbehaves the panel stays at height 0 while `open`, silently hiding the
   answer.

### Agents caught things I did not

The typecheck fan-out found six real runtime defects I had classified as type
noise, including `components/ui/index.ts` re-exporting three components that
exist nowhere but `README.md` — an ESM link-time `SyntaxError` for any consumer
of that barrel. They also caught that `@astrojs/check` was never a declared
dependency, so `astro check` only worked because `npx` fetched it ad hoc; under
`npm ci` the CI step would have hung on an interactive install prompt.

### The audit itself was not fully reliable

Two of its claims were wrong on inspection: NIP-17's seal/gift-wrap layers were
described *correctly* in the guide, and `components/interactive/damus/` is not
dead code — `QuickstartSimulator.tsx:290` renders it. Findings in
`open-findings.md` were re-verified by opening the file; the medium and low ones
were not.

---

## 4. What is still open

Start from `open-findings.md`. The clusters worth knowing:

- **Content accuracy beyond the two guides fixed here.** Two wallets
  recommended in `zaps-and-lightning.mdx` shut down in Dec 2024 / Jan 2025. The
  FAQ reverses both halves of the NIP-57 zap flow. Client UI walkthroughs
  describe screens that do not exist.
- **Translation depth.** Six Arabic guides are abridged summaries at 14–53% of
  the English. This matters for grant positioning — see §5.
- **Accessibility past labels.** RTL is cosmetic: `dir="rtl"` is set but 307
  physical direction utilities and zero logical ones mean `tailwindcss-rtl` is
  inert. The brand purple `#8B5CF6` fails AA contrast on white in 100+ places.
- **Orphan pages.** The eight `/nostr-for-*` landing pages and `/badges` have
  zero inbound internal links, and six of the eight are the same template with
  160–240 unique words.
- **Repo hygiene.** ~30 markdown files at root, many stale or contradictory. A
  65 MB git worktree copy lives in an un-gitignored `.claude/`.

`market-research.md` in this directory holds the growth research: SERP maps,
competitor analysis, distribution channels. Its headline finding is that
`awesome-nostr`'s Tutorials section contains only developer content — there is
no end-user task tutorial in the ecosystem's canonical directory.

---

## 5. Notes for the grant work

- **`LICENSE` does not exist.** `README.md` displays an MIT badge and
  `package.json` has no `license` field. OpenSats requires the field and treats
  FOSS licensing as a hard requirement. This is a five-minute fix that nobody
  has made, and it blocks the application.
- **The public repo is behind.** `github` remote is
  `piotr-e8/nostrich-love`; everything in this session is local and unpushed.
- **The "seven languages" pitch is weaker than it looks.** Arabic guides are
  abridged, and Hindi had 12 of 16 translation blocks unreachable until this
  session (`hi.json` used kebab-case keys the code never looked up). The
  differentiator holds — no competitor has Arabic or Hindi at all — but "we have
  them" should not be claimed as "they are complete".
- **What genuinely improved this session, in grant-legible terms:** 3289 → 0
  type errors, a test suite with CI, WCAG form labelling across every tool,
  guide URLs that no longer 404, and content corrections that stopped the site
  teaching a broken NIP-05 setup and nsec-pasting as a login method.

---

## 6. Running the gates

```bash
npm run typecheck    # astro check, expect 0 errors
npm run test         # 30 tests
npm run build        # 152 pages
npm run check:links  # needs dist/, expect 0 broken
npm run check:labels # expect 0
```

`check:links` only sees links present in the emitted HTML. Links a React island
builds at runtime are invisible to it — that is how 14 quiz components kept
pointing at `/en/guides/` after the content was fixed. Route such paths through
`src/i18n/paths.ts`, which is unit tested.
