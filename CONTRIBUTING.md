# Contributing to Nostrich.love

Thanks for helping make nostr easier to learn. Contributions of every size are
welcome — fixing a typo in a translation is just as valuable as a new feature.

## Quick start

```bash
git clone https://github.com/piotr-e8/nostrich-love.git
cd nostrich-love
npm install
npm run dev        # http://localhost:4321
```

## Before you open a PR

Run the same gates CI runs:

```bash
npm run typecheck     # astro check — expect 0 errors
npm run test          # vitest — all tests must pass
npm run build         # must emit all pages without errors
npm run check:links   # needs a fresh dist/ — expect 0 broken links
npm run check:labels  # expect 0 unlabelled form controls
```

## Improving a translation

This is the contribution we need most — especially for **Arabic, Hindi and
Chinese**, where native-speaker review is ongoing.

- **Guide content** lives in `src/content/guides/<locale>/<slug>.mdx`
  (locales: `en`, `pl`, `es`, `de`, `zh`, `ar`, `hi`). The English file is the
  source of truth; translations should match its structure and depth.
- **UI strings** live in `src/i18n/locales/<locale>.json`. English (`en.json`)
  is the reference — a key missing from your locale falls back to English at
  runtime.
- Even partial fixes are welcome. If you only have time to review one guide,
  open the PR anyway and say so.

Conventions (placeholder syntax, RTL notes, per-locale lessons) are documented
in [docs/internal/I18N_PATTERNS.md](docs/internal/I18N_PATTERNS.md).

## Adding a new locale

Open an issue first so we can coordinate. The process is documented in
[docs/internal/I18N_PATTERNS.md](docs/internal/I18N_PATTERNS.md), and the
retrospectives in `docs/internal/LESSONS_*_LOCALE.md` cover the pitfalls we hit
adding Chinese, Arabic and Hindi.

## Code changes

- **Never hand-build a locale path.** `src/i18n/paths.ts` is the single source
  of truth for URL generation and is unit tested. English URLs are un-prefixed
  (`/guides/...`); the other six locales are prefixed (`/pl/guides/...`).
- Content accuracy matters more here than in most projects — this site teaches
  beginners security-sensitive habits. If a guide contradicts a NIP, the NIP
  wins. Cite the NIP in your PR description.
- Match the style of the file you are editing.

## Reporting content errors

If a guide teaches something that is wrong, outdated or dangerous (a dead
client, an incorrect NIP description, a bad security practice), please open an
issue even if you can't fix it yourself. Point at the guide and the correct
source (NIP, client changelog, etc.).

## Questions

Open an issue, or reach out via the contact listed on
[nostrich.love/about](https://nostrich.love/about).
