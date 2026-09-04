# Visual system

Two readers told us the site looks machine-generated. They were right, and it
was countable: 130 gradients, 19 headings with a gradient poured through
`bg-clip-text`, 220 `rounded-2xl`/`3xl`, 155 large shadows, 43 `hover:scale`,
19 `backdrop-blur`, 29 pastel tinted cards, 203 emoji in guide headings. Each
one is harmless. Together they are the house style of every landing-page
generator on the internet, and people recognise it.

So: strip the ornament, and give the type something to say instead. This is
not a redesign. Layout, structure, component boundaries and information
architecture do not change. Only the surface does.

The guide pages are already right — one column, white card, no gradient,
readable. They are the target, not a thing to fix.

---

## 1. The display face: Fraunces

Fraunces Variable, weight axis 100–900, SIL OFL 1.1, by Undercase Type.
Self-hosted at `public/fonts/`, because the site's own CSP is `font-src 'self'`
and Google Fonts is therefore blocked by policy, not by preference.

**Why this one.** It is a display serif built out of mid-century advertising
type, and it was drawn with an argument: that a screen face is allowed to have
warmth and a little wobble instead of the ironed-out neutrality everything else
has settled on. That fits a patient teaching site for writers and artists
better than another grotesque would. It also does the practical job — at 700
weight it has real presence at heading sizes, and next to a plain system sans
it makes the page look composed rather than decorated. Inter and Space Grotesk
were excluded on purpose: they are what a page picks when nobody chose.

**Where it is used.** Headings only. `h1`–`h4` globally (`src/styles/globals.css`),
`.prose` headings, and anything an applier tags `font-display`. Never body
text, never labels, never buttons, never code.

**How it is gated.** Two independent gates, both already wired:

1. `Layout.astro` sets `data-display-face="fraunces"` on `<html>` only when
   `usesDisplayFace(locale)` is true — that is, `script === 'latin'` in
   `src/config/locales.ts`. That attribute is what repoints `--font-display`.
   On zh, ar and hi the variable stays at the system stack, the `@font-face`
   rule is never referenced, and an unreferenced `@font-face` downloads
   nothing. Those scripts render better in the reader's own system font than
   in anything we would ship anyway.
2. `unicode-range` on each `@font-face`, so even a stray Latin string on a
   Chinese page can only ever pull the Latin subset, never Han.

**The two files.**

| file | bytes | covers |
| --- | --- | --- |
| `fraunces-latin-wght-normal.woff2` | 36.6 KB | ASCII + Latin-1: Spanish `ñ á é í ó ú ü`, German `ä ö ü ß`, curly quotes, dashes |
| `fraunces-latin-ext-wght-normal.woff2` | 33.6 KB | Latin Extended-A: Polish `ą ć ę ł ń ś ź ż` |

Glyph coverage was verified against the actual font tables with fontTools, not
against the declared `unicode-range`. Spanish and German need only the first
file — every accent they use sits inside U+00C0–U+00FF. Polish is the only
locale that needs the second, which is why `localeConfig.latinExtended` is
`true` for `pl` alone and only `pl` preloads it.

**Loading.** `font-display: swap`, preload with `crossorigin` (required even
same-origin, or the browser fetches twice), and the `@font-face` rules live in
the inline critical CSS in `Layout.astro` rather than in the bundled stylesheet
so the request starts on the first bytes of the head. Nothing here blocks
rendering. The July 2026 audit removed render-blocking Google Fonts; do not put
them back.

**If you replace the face**, the OFL requires the licence file to travel with
it. `public/fonts/Fraunces-LICENSE.txt` ships alongside.

## 2. Body text: the system stack, deliberately

No webfont for body copy. `tailwind.config.js` `fontFamily.sans` is a real
system stack ending in `sans-serif` plus the emoji faces.

This is a decision, not an omission. It costs zero bytes, it renders all seven
scripts correctly on every platform without a per-script font programme, and it
is the only stack that will look native to an Arabic or Devanagari reader.
Inter — which the config used to name and which `Layout.astro` really did load,
four weights of it via `@fontsource` — was the most-defaulted UI face on the
web. Dropping it is what pays for the display face. `@fontsource/inter` has
been removed from `package.json`; do not reintroduce it.

## 3. The type scale

Named steps in `tailwind.config.js` `fontSize`. **Each step carries its own
line height and letter spacing.** Use the name; do not bolt a `leading-*` or
`tracking-*` on top, and never write an arbitrary size.

| class | size | line height | tracking | use |
| --- | --- | --- | --- | --- |
| `text-display` | `clamp(2.5rem, 6vw, 3.75rem)` | 1.05 | −0.022em | hero h1, one per page at most |
| `text-h1` | 2.25rem | 1.12 | −0.02em | page title |
| `text-h2` | 1.75rem | 1.22 | −0.015em | section |
| `text-h3` | 1.3125rem | 1.32 | −0.01em | subsection, card title |
| `text-h4` | 1.0625rem | 1.45 | −0.005em | small heading |
| `text-lead` | 1.1875rem | 1.6 | 0 | standfirst under a heading. Sans, not display |
| `text-body` | 1.0625rem | 1.7 | 0 | running text |
| `text-body-sm` | 0.9375rem | 1.6 | 0 | secondary text, helper copy |
| `text-caption` | 0.8125rem | 1.5 | 0.005em | metadata, timestamps |
| `text-micro` | 0.6875rem | 1.4 | 0.07em | eyebrows and labels; always with `uppercase` |

`text-display` is a `clamp()`, so it needs no responsive prefixes. Do not write
`text-4xl md:text-6xl` alongside it.

Body is 17px, not 16. System UI faces run small next to a display serif and the
page reads thin at 16.

**Measure.** Running text gets `max-w-measure` (65ch). `max-w-measure-narrow`
(52ch) for a pull quote or a narrow aside, `max-w-measure-wide` (74ch) when a
block genuinely needs the room. Nothing sets a measure in `px`.

The old numeric utilities (`text-sm` … `text-4xl`) still exist and still
compile — the existing components are full of them. Anything you rewrite moves
to the names above.

## 4. Ornament rules

Mechanical. Apply them without asking.

### Gradients — all 130 go

| you find | you write |
| --- | --- |
| gradient section background | nothing, or a flat band: `bg-gray-50 dark:bg-gray-900` |
| gradient hero | page ground, no class. Separate it with `border-b border-gray-200 dark:border-gray-800` if it needs an edge |
| gradient card | see the card recipe below |
| gradient button | `bg-primary-600 hover:bg-primary-700 text-white` |
| gradient progress bar | `bg-primary-600` |
| gradient border / ring | `border border-gray-200 dark:border-gray-800` |

A page may use **at most one** flat band. Two bands in a row is stripes, which
is the same disease with the saturation turned down.

### Gradient text — all 19 go

`bg-gradient-to-r … bg-clip-text text-transparent` becomes
`text-gray-900 dark:text-white`. That is the whole rule.

If a heading truly needs emphasis, set **one word** in
`text-primary-text dark:text-primary-400`. Not a phrase, not the verb and the
noun. One word, and most headings do not need even that.

### Cards

```
rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900
```

Interactive card, add:

```
transition-colors hover:border-gray-300 hover:bg-gray-50
dark:hover:border-gray-700 dark:hover:bg-gray-800
```

Muted / secondary card: swap the ground to `bg-gray-50 dark:bg-gray-900`.

Pastel tinted card (the 29): the tint goes. A card is a border and a ground.
The only exception is a card whose tint is **semantic** — a warning callout, an
error state — and those follow §5's semantic rule, not this one.

A card does not float, so it gets no shadow. `shadow-card` exists
(`0 1px 2px rgb(15 23 42 / 0.04)`) for the rare place a hairline of separation
genuinely helps on white; it is invisible on the dark ground, which is why
every recipe above carries a `dark:` border.

### Radius

| was | is |
| --- | --- |
| `rounded-3xl`, `rounded-2xl`, `rounded-xl` on cards, panels, modals, sections | `rounded-lg` |
| buttons, inputs, selects, small chips | `rounded-md` |
| avatars, status dots, true pills, icon-only round buttons | `rounded-full` — unchanged |

Nothing above `rounded-lg` survives on a rectangle.

### Shadows — 155 of them

`shadow-lg`, `shadow-xl`, `shadow-2xl`, `hover:shadow-*` on anything sitting in
the flow of a page: delete, and make sure the element has the border from the
card recipe.

`shadow-raised` (`0 8px 24px -8px rgb(15 23 42 / 0.18)`) is for things that
genuinely sit above the page and would be ambiguous flat: modals, dropdowns,
popovers, the mobile nav sheet. That is the complete list.

### hover:scale — all 43 go

Replace with a colour change: `transition-colors` plus the hover border/ground
from the card recipe, or `hover:bg-primary-700` on a button. Links get
`underline underline-offset-2`.

No `transition-transform`, no `hover:-translate-y-*`, no `active:scale-*`. If
some motion survives elsewhere it must carry `motion-reduce:transform-none`,
but the point is that after this pass there is nothing left to guard.

### backdrop-blur — all 19 go

Including the sticky header, which becomes opaque:

```
bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800
```

No `bg-white/70`, no `dark:bg-gray-900/50` (that one is a standing house rule
— it renders a muddy brown).

### Accent versus semantic colour

Colour discipline on this site is already good. Keep it that way.

**Purple (`primary`)** means *you can act on this*: links, primary buttons,
focus rings, the active nav item, a selected filter, a progress fill, at most
one emphasised word in a heading. It is never a decorative fill for a section
and never a mood.

Text purple on a light ground is `text-primary-text` (`#7C3AED`, AA at 5.70:1),
`text-primary-400` on dark. `text-primary-500` fails AA as body text on white
— do not use it for text.

**Green / amber / red** stay strictly semantic: success, warning, error/danger.
A green card means something succeeded. If nothing succeeded, the card is not
green.

`friendly-gold`, `friendly-warm-*` and `friendly-cream` are ornament colours.
Do not reach for them in new work.

### Focus

`Layout.astro` carries a global `:focus-visible` outline — purple-600 on light,
purple-300 on dark. It is the safety net under this whole pass: when you strip
a decorative `ring-*` class the focus ring must not go with it. If you remove a
focus affordance from a component and the global outline does not obviously
replace it, put a better one back before you move on.

## 5. Icons

`lucide-react` is already in 71 components. It is the icon system; there is no
second one.

**Defaults.** `strokeWidth={1.5}` always. Size by role:

| role | class |
| --- | --- |
| inline with a line of text | `h-4 w-4` |
| beside a heading, in a button, in a list row | `h-5 w-5` |
| feature block, empty state | `h-6 w-6` |

Never larger than `h-6 w-6`. A big icon is ornament wearing a uniform.

**Colour.** Decorative: `text-gray-400 dark:text-gray-500`. Marking something
interactive or branded: `text-primary-text dark:text-primary-400`. Marking a
state: the semantic colour, e.g. `text-warning-600 dark:text-warning-400`.
Never a gradient, never a coloured circular badge behind it.

### Emoji

Sort every emoji into one of two piles.

**Decorative** — it repeats what the words already say, or it is there for
warmth. The 13 on the homepage, the 203 in guide headings. **Delete it.** Do
not swap in an icon. A heading that reads `🔑 Your keys` becomes `Your keys`;
the word "keys" was already doing the work, and one heading in Fraunces is
worth more than an emoji in front of it.

**Meaningful** — remove it and the reader loses information. A ⚠️ that marks a
step where you can lose your account. A ✅ / ❌ that is the answer to a quiz. A
🔒 that means encrypted, a 🔑 that means this is the key material. **Becomes a
lucide icon plus a translated text label**, never a bare icon:

```tsx
<span className="inline-flex items-center gap-1.5 text-warning-700 dark:text-warning-400">
  <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
  <span>{t('common.warning')}</span>
</span>
```

`aria-hidden="true"` on every icon, decorative or not — the text next to it is
what a screen reader should read. An icon that is the whole control (an
icon-only button) needs `aria-label={t(...)}` on the button instead.

The label is a `t()` key. If the key does not exist, add it to all seven
locales; parity is test-enforced.

**RTL.** Any icon that points (arrows, chevrons, `ArrowRight`) is directional.
Use `rtl:rotate-180` or pick the icon from `dir`. Icons that do not point
(check, lock, key, alert) stay as they are. Spacing around icons uses `ms-*` /
`me-*`, never `ml-*` / `mr-*`.

**Language switcher:** the language name in its own script (`localeConfig.name`),
never a flag. A flag is a country and a language is not.

## 6. Prose stops at a component boundary

`.prose` is for article text written in MDX. It has no business inside an
embedded component, and until this pass it was inside all of them.

**The boundary is one of two things:**

| the component | what marks it |
| --- | --- |
| hydrated (`client:idle`) | `<astro-island>` — automatic, nothing to remember |
| rendered without a client directive | `class="not-prose"` on its outermost element |

The second row is not optional. A React component used from MDX without a
client directive renders to plain HTML with no island tag around it, so
`Callout` in `faq.mdx` sat in raw article prose. If you write or rewrite a
component that MDX can embed, put `not-prose` on its root. It costs nothing
when the component is also hydrated.

**Why two mechanisms and not just `not-prose`.** Because the leak had two
sources and they need different fixes.

1. The hand-written `.prose h1…h4 / p / ul / ol / li` rules in
   `src/styles/globals.css` are plain descendant selectors, specificity
   (0,1,1), emitted *after* `@tailwind utilities`. They beat every utility
   class, and they never honoured `not-prose` at all. Measured: `text-micro`
   (11px), `text-caption` (13px), `text-body-sm` (15px) and `text-h3` (21px)
   all rendered at 17px in all 13 islands on `/guides/what-is-nostr`. Each of
   those rules now carries the boundary guard:

   ```css
   :not(:where(astro-island *, [class~="not-prose"], [class~="not-prose"] *))
   ```

   Write it out at every new `.prose` rule. CSS has no selector variables; the
   same string lives as `NOT_IN_COMPONENT` in `tailwind.config.js`.

2. `@tailwindcss/typography`'s own rules are `:where()`-wrapped at (0,1,0), so
   a utility class already beats them — but only where a utility exists.
   Margins, list markers, `dd` padding, blockquote rules and `hr` have no
   utility on them in most components, so those leaked. Those rules *do*
   honour `not-prose`, and that guard survives an `<astro-island>` in between
   (it is `[class~="not-prose"] *`, a descendant combinator, not a child one).
   What it cannot do is know about a tag it has never heard of. So
   `globals.css` carries a **boundary reset** in `@layer components` that puts
   the Tailwind preflight baseline back inside islands.

**The reset's specificity is the whole trick.** It is `(0,1,0)`, the same as
the plugin's rules, but later in the components layer — so it wins over the
plugin, and a utility class in the utilities layer still wins over it. In
between, exactly. It also resets the boundary root to `1rem / 1.5 /
hsl(var(--foreground))`, because `.prose-lg` sets 18px on the `<article>` and
`<astro-island>` is `display: contents`, so the size inherits straight through.
A component now renders inside an article exactly as it renders anywhere else.

Dark mode needs a second pass at (0,2,0): the `invert` block compiles through
the `dark:` variant to `.dark\:prose-invert:is(.dark *) …`, which outranks a
plain utility. Every element-level key in that block carries the guard in its
own selector, which is why `invert` in `tailwind.config.js` is written with
computed keys.

**Code.** Inline code is `gray-800` on `gray-100`, inverted in dark. It used to
be `pink-600` / `pink-400`, and pink is not in the palette. Highlighted blocks
(`.astro-code`) get a `gray-50` ground and a `gray-200` border in light — they
were `#fff` on a white card, which is no block at all — and the `<code>` inside
them is explicitly stripped of the inline-code chip, or `prose-invert` gives
every line its own slab in dark mode.

## 7. Links, tables and code inside an article

Three rules that only bite inside `.prose`, all of them in `globals.css`.

**One link treatment.** A link in running text is `primary-text` (#7C3AED,
5.70:1 on white), `primary-400` in dark, underlined at 1px with a 2px offset,
thickening to 2px on hover. Nothing else. Before this there was no `a` rule at
all, so a markdown link fell through to the typography plugin's default and
rendered #111827 — near-black, which on gray-700 body ink reads as bold text
rather than a link — while the inline JSX links in the MDX each brought their
own colour. `/guides/quickstart` served seven treatments in one article.

The rule is `.prose a:not([class*="bg-"]):not($BOUNDARY)`. The attribute
selector is what lifts it to (0,2,1), high enough to beat a `text-blue-600`
written in a content file; it is also the exemption, because a link that
carries its own ground is a button and keeps its own colours.

**Tables scroll in their own box.** `src/components/guides/GuideTable.astro` is
registered as the lowercase `table` key in the `components` map that
`[slug].astro` hands to `<Content />`, so every markdown pipe table renders
inside a `.guide-table` wrapper. Do not "fix" this with `display: block;
overflow-x: auto` on the `<table>` — that drops the table role in assistive
technology. The wrapper is `tabindex="0"` because a region you can only scroll
with a mouse fails WCAG 2.1 SC 2.1.1; the global `*:focus-visible` outline
covers it.

The affordance is the local/scroll scroll-shadow pair: two cover gradients at
`background-attachment: local` that travel with the content, two shadows at
`attachment: scroll` pinned to the box underneath. A shadow shows on exactly
the edges that still have table behind them, in either direction, with no
JavaScript. The margins live on the wrapper, not the table — inside the
overflow box they would put 32px of shadow past each end of the table.

A table written as literal JSX in an MDX file does **not** go through the map
(MDX only substitutes markdown-generated elements). The one in `quickstart.mdx`
carries `className="guide-table" tabIndex={0}` by hand. Any new one should too.

**Code is LTR, everywhere.** `pre, code, kbd, samp` carry
`direction: ltr; unicode-bidi: isolate`. On `/ar/` the `dir="rtl"` on `<html>`
put ASCII source in an RTL paragraph and the bidi algorithm tore the
punctuation off the ends: `  "names": {` laid out with the opening quote to the
right of the word and the colon and brace dropped on the left, `"alice":
"b0635…"` came out as `alice":"`, and inline `.well-known` rendered
`well-known.`. Isolation is what keeps an inline snippet in its right place
inside the Arabic line around it.

`.astro-code .line` then carries `unicode-bidi: plaintext`, which resolves each
line's direction from its own first strong character. That one is not
cosmetic: several Arabic guides use ` ```text ` blocks for short translated
dialogue, and the LTR paragraph direction above would otherwise strand the
trailing colon of `في حفلة:` on the wrong side.

---

## Files this system lives in

- `tailwind.config.js` — type scale, `fontFamily`, `boxShadow`, `maxWidth` measures
- `src/layouts/Layout.astro` — `@font-face`, `--font-display`, preloads, focus ring
- `src/styles/globals.css` — body and heading families, `.prose` heading type, link treatment, `.guide-table`, code direction
- `src/components/guides/GuideTable.astro` — the table scroll container
- `src/config/locales.ts` — `script` and `latinExtended` per locale, `usesDisplayFace()`
- `public/fonts/` — the two woff2 files and the OFL licence
