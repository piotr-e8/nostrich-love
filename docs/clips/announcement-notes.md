# Announcement notes (kind 1)

Drafts to post with the teaser. Pick one, edit it into your own voice — it goes
out under your key, so it should sound like you and not like a changelog.

Attach `out/nostrich-teaser-vertical.mp4`. The 3.4s language loop works better as
a reply or quote than as the lead.

**Re-run `capture-shots.sh` before posting.** The site changed materially in
August 2026 — the home page, the level badges and the progress UI all moved — so
any `out/` from before that is a teaser of a site that no longer exists.

---

## What actually distinguishes this site

Get this right before writing anything, because the obvious claim is false and a
Nostr audience will check.

**Not "seven languages."** nostr.how ships 11 complete locales, nstart 12. Saying
you are the multilingual one tells a reviewer you have not looked at your own
field.

**Not "the only one with RTL."** nostr.how ships Persian. Verified on their own
language switcher, August 2026.

**Arabic and Hindi.** `nostr.how/ar` and `/hi` are 404. nstart, nostr-wot,
usenostr and learnnostr have neither. Independently corroborated by
github.com/tyiu/nostr-localization-tracker, which records Arabic as *partial* in
Amethyst/Damus/Nos/Snort and Hindi only in Amethyst. This is the real gap.

**It is a course, not a page.** 16 guides across three levels, 13 of them ending
in a quiz that records what you got right, in all seven languages. No competing
onboarding site has quizzes at all. Nothing is locked — the levels are a reading
order, not gates.

The strongest sentence available is the intersection: *a structured beginner
course, with practice, in Arabic and Hindi.* Each part alone has competition. The
three together do not.

---

## A — the gap (recommended)

> If you have ever wanted to hand someone a Nostr guide in their own language and
> found there wasn't one, this is for the two cases where that is still true.
>
> nostrich.love now teaches Nostr as an actual course — 16 guides, three levels,
> most ending in a quiz — and it reads properly in Arabic and Hindi. Not a
> translated landing page: the whole thing, layout mirrored, quizzes included.
>
> Free, open source, no account needed.
>
> https://nostrich.love

Why this one: it names a gap the reader can verify in ninety seconds, and it
hands them something to *do* — pass it on — while asking nothing of them.

---

## B — short, for the reply-heavy crowd

> nostrich.love is a course now: 16 guides, three levels, quizzes at the end of
> most of them. Seven languages, including Arabic and Hindi — which almost
> nothing else in Nostr covers.
>
> Free, no account, open source. A link for the next person who asks you what
> this is.
>
> https://nostrich.love

---

## C — the builder's angle

> Spent a while turning nostrich.love from a pile of guides into a course.
>
> There were thirteen quizzes on the site and twelve of them recorded nothing at
> all — you could answer every question correctly and it knew only that you had
> opened some pages. Meanwhile a daily streak counter rewarded you for coming
> back to an onboarding site you are supposed to leave. Both fixed: the quizzes
> count, the streak is gone, and finishing a level means having read it and
> passed it.
>
> Free, open source: https://nostrich.love

Why you might not lead with this: it is about the repair rather than the reader.
Good as a follow-up or a reply to "what changed?", weaker as the opening post.

---

---

## D — the method (goes with the walkthrough cut)

For the second video, the one that walks through `/guides/relays-demystified/`
end to end — see `walkthrough-cut.md`. This note argues method rather than
coverage, so it does not compete with A/B/C and can go out weeks later.

> Most Nostr explainers are one long page. You scroll to the bottom, nod, and by
> tomorrow you could not say what a relay is.
>
> The relay guide on nostrich.love is about 550 words. Inside it there is a
> simulator you press play on and watch a post travel out to two relays and reach
> your followers; a diagram of why you and a friend on different relays cannot
> see each other; a wizard for the empty feed everyone hits on day one. Then six
> questions, right there on the page, that tell you which part you actually got.
>
> Sixteen guides like that, thirteen of them ending in a quiz, in seven
> languages. Finish the seven beginner ones and the level closes.
>
> Free, open source, no account. https://nostrich.love

Every number in it is current as of 2026-08-12: 16 guides, 13 quizzes, 71
questions per language, ~550 prose words in that guide, 7 beginner guides of
which 5 have quizzes. The site's *median* guide is ~1,240 words and `faq` is
3,462 — so do not extend this into "nothing here is long".

Shorter, if the video carries the argument on its own:

> A relay guide you can press play on, with six questions at the end that tell
> you what stuck. Not a wall of text you forget by tomorrow.
>
> Sixteen guides, thirteen quizzes, seven languages, no account.
> https://nostrich.love

## Do not claim

Each of these is either false or unmeasured. They are listed because the first
two were in an earlier draft of this file.

- ❌ "the only multilingual Nostr guide" — nostr.how 11, nstart 12
- ❌ "the only one with full RTL" — nostr.how ships Persian
- ❌ "the first Polish Nostr resource" — nstart has Polish, nostr.com.pl exists.
  *First Polish course* is defensible; first resource is not.
- ❌ "translations reviewed by native speakers" — structure is verified, language
  quality is not, until a named person has checked ar/hi/zh
- ❌ any traffic or user number — there is no analytics readout behind one. The
  home page carried "Join thousands discovering…" for months on no evidence; it
  was removed for exactly this reason. Do not put it back in a post.
- ❌ anything about the key generator. It is a demonstration, deliberately kept
  out of the teaser: advertising "generate a Nostr identity here" contradicts
  what the site's own security guide tells people to do.
- ❌ **"no tracking"** — the site loads a third-party analytics beacon.
  `src/config/site.ts:32-35` enables it and `src/layouts/Layout.astro:149`
  injects `static.cloudflareinsights.com/beacon.min.js`; it is in the built
  pages. "No account" is true — progress is `localStorage` only — but this
  audience reads view-source. Draft A carried "no tracking" until 2026-08-12.
- ❌ "unlocks the next guide", "locked", "gated". Nothing on the site is gated
  and its own explainer says "Nothing is graded and nothing is locked"
  (`GamificationExplainer.tsx:362`). Levels are a reading order.
- ❌ "certificate". Finishing a level is real, but what a reader sees is a badge
  modal saying "Beginner Level Complete" — there is no document, page or
  download. "Certificate" is internal vocabulary only.

## Notes on posting

Lead with what the reader gets, not with the release. "Just shipped" is a
developer's frame; "here is a link in their language" is the reader's.

If someone asks what changed under the hood, the honest short answer is: the
quizzes were decorative and now count, three different files disagreed about what
order the course was in, and the front page was selling a five-minute signup for
a site that is a course.

A sandstr teaser built from the same scripts may be going out around the same
time. Two identically-shaped videos from two accounts in one week reads as a
content mill — space them, or cut them differently.
