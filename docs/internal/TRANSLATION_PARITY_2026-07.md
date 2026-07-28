# Translation parity measurement — 2026-07-28

Method: per-guide comparison against the English source of (a) `##`–`####`
heading count — language-independent structural parity — and (b) visible
character volume with frontmatter, code blocks, imports and markdown syntax
stripped. `wc -w` is meaningless for CJK and misleading for this comparison;
do not use it.

Interpretation baseline: a complete Chinese translation typically lands at
**40–60% of the English character count** (CJK density), Arabic at roughly
**85–100%**, European languages and Hindi at **95–130%**.

## Verdict per locale

| Locale | Status |
|---|---|
| pl, es, de, hi | Full parity — every guide 98–129% of EN volume, identical structure |
| ar | **10/16 full** (89–98%); **6 abridged**: privacy-security 23%, protocol-comparison 16%, relay-guide 27%, relays-demystified 36%, troubleshooting 32%, zaps-and-lightning 25% |
| zh | **14/16 full** (structure matches EN; 41–88% chars is within/near normal CJK density); **2 abridged**: protocol-comparison 13% (12/26 headings), relay-guide 27% (structure intact, prose cut) |

## Gap to full content parity: 8 files

- ar: privacy-security, protocol-comparison, relay-guide, relays-demystified,
  troubleshooting, zaps-and-lightning
- zh: protocol-comparison, relay-guide

This confirms audit finding #57 (six abridged Arabic guides) and **narrows**
the audit's zh concern: Chinese is not broadly abridged — the low `wc -w`
numbers were a measurement artifact.

## Grant-facing phrasing (honest version)

"All 112 guide files exist in all seven languages. Four locales (pl/es/de/hi)
are at full parity with the English source; Arabic is complete in 10 of 16
guides and Chinese in 14 of 16, with the remaining 8 files abridged.
Completing those 8 to full parity, followed by native-speaker review, is
milestone 1."

Do **not** claim "fully translated into 7 languages" until the 8 files are
done.

## Reproduce

The measurement script lives in the session notes; the approach is:
strip frontmatter/code/imports, count `^#{2,4} ` headings, count
non-whitespace non-syntax characters, compare per slug against `en`.
UI-string parity (a separate axis) is measured by key count in
`src/i18n/locales/*.json`: en 920, zh 920, de 902, es 893, pl 809, hi 624,
ar 583 (2026-07-28).
