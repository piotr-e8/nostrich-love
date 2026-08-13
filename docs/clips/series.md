# Keeping the account alive

The teaser is one post. An account needs a format that costs minutes, not
evenings, or it goes quiet after the launch and the launch was the point.

Everything below draws on material that already exists in this repo. Nothing here
asks you to write a new guide.

## What you have to draw on

Counted from the repo on 2026-08-09, and worth re-counting before you lean on a
number in public:

| stock | amount | note |
|---|---|---|
| guides | 16, in 7 languages | 7 beginner / 6 intermediate / 3 advanced |
| quizzes | 13, in 7 languages | no competing onboarding site has any |
| glossary terms | 26 | **en, pl, es, de only — not ar/hi/zh** |
| follow-pack accounts | 527, in 16 categories | page and its own filters agree (3 + 524) |
| long-form articles | 3, in `content/nostr/` | publishable as NIP-23 today |
| diagrams | 10 uses across the English guides | translated and mirrored, not ASCII |

## Formats, cheapest first

**One glossary term per post.** 26 terms is roughly three months at two a week.
Term, one-sentence definition in your own words, link to the guide it belongs to.
The glossary already stores that guide mapping (`TERM_GUIDES`), so the link is
never a judgement call.

**One diagram per post.** Ten of them, already drawn, already translated. Screen
capture the diagram alone, caption it with the question it answers. These are the
posts most likely to be re-shared, because a picture of how relays actually work
is useful to somebody who will never click your link.

**"How do you say this in…"** Screenshot the same paragraph in Arabic and in
English side by side. This is the differentiator, and it is one screenshot. Do it
for a passage where the mirroring is obvious — a diagram or a numbered list reads
more clearly than prose.

**One myth per post.** The FAQ and troubleshooting guides are full of
misconceptions already written down and already corrected. Quote the
misconception, correct it in two sentences, link.

**Long-form as NIP-23.** `scripts/publish-nostr-articles.mjs` publishes
`content/nostr/*.md` as kind 30023. Three are ready. Native long-form on Nostr is
a much stronger signal that an account contributes something than another teaser
is — and because kind 30023 is addressable, a re-publish with the same `d` tag
replaces the article rather than forking it, so you can fix and re-post.

## Cadence

Two posts a week is enough to look alive and is sustainable from stock. One of
them should be something a reader can use without clicking (a diagram, a
definition, a correction); the other can carry a link.

Do not post the same shape twice in a row, and do not run a nostrich.love teaser
in the same week as a sandstr one.

## What to fix before leaning on it

**The glossary is English-only for Arabic, Hindi and Chinese readers.** It ships
in 4 of 7 locales (`GLOSSARY_LOCALES` in `src/data/glossary/index.ts`). The
teaser lists /glossary as a beat and the account's whole pitch is language
coverage — so a reader arriving from an Arabic post and clicking through to the
glossary lands in English. Either add the three locales or leave the glossary out
of posts aimed at those readers.

## Distribution beats content

The July audit's blunt version: *stop producing content, start distributing.*
Posting is one channel and the weakest of the three available.

- ~~A PR to nostr.how with ar/hi translations.~~ **Decided against, 2026-08-13.**
  It was the strongest item here — distribution plus the relationship a reference
  letter comes from — but it is off the table. Do not re-propose it.
- **awesome-nostr** (2.9k★) — an entry is a quarter of a day.
- **nostr-resources** — the existing entry links to `uselessshit.co/nostr/nip-05/`
  rather than to the guides, and sits in the paid-services category. That is a
  correction, not a submission.

Neither of the remaining two needs a video.

Note on the videos themselves: a note and its clip are **one post**, not two. The
text does not stand on its own — the argument it makes is visual — so do not
plan them on separate dates.
