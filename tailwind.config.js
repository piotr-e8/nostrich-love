import colors from "tailwindcss/colors";

// The component boundary. `.prose` styles article text written in MDX and must
// stop at an embedded component: every hydrated island (<astro-island>), and
// the root of a component that renders without a client directive, which
// carries `not-prose`. The same string is written out longhand in
// src/styles/globals.css — CSS has no selector variables — and the rule is
// recorded in docs/internal/VISUAL_SYSTEM.md §6.
const NOT_IN_COMPONENT =
  ':where(astro-island *, [class~="not-prose"], [class~="not-prose"] *)';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B5CF6",
          // Semantic alias: darkest shade that still reads as brand purple and
          // passes WCAG AA (4.5:1) as normal-size TEXT on white/cream (5.70:1).
          // Same value as primary-600; use for text on light backgrounds.
          text: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        secondary: {
          DEFAULT: "#6366F1",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        background: {
          light: "#FFFFFF",
          dark: "#0F0A1A",
        },
        // Full scales, not flat values. 235 usages across 25 components ask for
        // shades (text-success-500, bg-warning-500, text-success-900, ...) and a
        // flat colour generates none of them — those classes compiled to nothing,
        // leaving e.g. the KeyGenerator's copy confirmation white-on-white.
        // The DEFAULTs below are the previous flat values, so nothing shifts.
        success: { ...colors.green, DEFAULT: colors.green[500] },
        danger: { ...colors.red, DEFAULT: colors.red[500] },
        // `error` was missed when the flat colours above became full scales, and
        // it was never flat either — it simply did not exist. 153 usages of
        // error-* across the components (every quiz's wrong answer, the error
        // toasts, NIP05Checker's failure card, RelayExplorer's offline dot)
        // compiled to nothing, so a wrong quiz pick rendered as a white card
        // with a gray icon — indistinguishable at a glance from the correct
        // one. Same colour as danger on purpose: two names, one red.
        error: { ...colors.red, DEFAULT: colors.red[500] },
        warning: { ...colors.amber, DEFAULT: colors.amber[500] },
        // Friendly theme colors based on nostrich logo
        friendly: {
          purple: {
            DEFAULT: "#9B7BFF",
            // Semantic alias = friendly-purple-700: AA-passing text on light (4.96:1).
            text: "#7A5CCC",
            50: "#FAF8FF",
            100: "#F3F0FF",
            200: "#E8E2FF",
            300: "#D4C9FF",
            400: "#B8A3FF",
            500: "#9B7BFF",
            600: "#8A6AE6",
            700: "#7A5CCC",
            800: "#5C3D99",
            900: "#3D2673",
          },
          gold: {
            DEFAULT: "#FFD700",
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#FFD700",
            600: "#D97706",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
          },
          cream: "#FFFDF8",
          warm: {
            50: "#FFFBF5",
            100: "#FFF7EB",
            200: "#FFEFD6",
            300: "#FFE4C2",
          },
        },
      },
      // --- TYPE ------------------------------------------------------------
      // Body is a system stack, on purpose. It costs zero bytes, and it is the
      // only choice that renders Han, Arabic and Devanagari correctly on every
      // platform. Inter (the previous declaration, loaded via @fontsource) was
      // four extra weights of the most-defaulted UI face on the web; dropping
      // it is what buys the display face its budget.
      // `display` resolves through --font-display, which Layout.astro only
      // points at Fraunces for Latin-script locales. See VISUAL_SYSTEM.md.
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
        display: ["var(--font-display)"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      // Named steps. Appliers use these names, never an arbitrary px/rem value
      // and never a `leading-*`/`tracking-*` bolted on top — the line height and
      // letter spacing come with the step. The old numeric utilities
      // (text-sm ... text-4xl) still exist and still work; they are what the
      // existing components use. New and rewritten type uses the names below.
      fontSize: {
        // Hero only. One per page, at most.
        display: [
          "clamp(2.5rem, 6vw, 3.75rem)",
          { lineHeight: "1.05", letterSpacing: "-0.022em" },
        ],
        h1: ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        h2: ["1.75rem", { lineHeight: "1.22", letterSpacing: "-0.015em" }],
        h3: ["1.3125rem", { lineHeight: "1.32", letterSpacing: "-0.01em" }],
        h4: ["1.0625rem", { lineHeight: "1.45", letterSpacing: "-0.005em" }],
        // Standfirst under a heading. Sans, not display.
        lead: ["1.1875rem", { lineHeight: "1.6", letterSpacing: "0" }],
        // Running text. 17px, because 16px system-ui reads small next to a
        // display serif.
        body: ["1.0625rem", { lineHeight: "1.7", letterSpacing: "0" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6", letterSpacing: "0" }],
        caption: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.005em" }],
        // Uppercase eyebrows and labels. Always paired with `uppercase`.
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.07em" }],
      },
      maxWidth: {
        // Running text. ~65 characters at text-body.
        measure: "65ch",
        "measure-narrow": "52ch",
        "measure-wide": "74ch",
      },
      // --- ELEVATION -------------------------------------------------------
      // Two shadows, and one of them is nearly invisible. A card is a border
      // and a ground; it does not float. `shadow-raised` is only for things
      // that genuinely sit above the page and would be ambiguous otherwise:
      // modals, dropdowns, popovers, the mobile nav sheet. Nothing that sits
      // in the flow of a page gets it. Neither reads on the dark ground —
      // there the border does all the work, which is why every card spec in
      // VISUAL_SYSTEM.md carries a dark: border.
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
        raised: "0 8px 24px -8px rgb(15 23 42 / 0.18)",
        none: "none",
      },
      // CSS replacements for the framer-motion loops in StreakBanner (#59/#67):
      // the banner mounts site-wide from Layout.astro, and framer-motion was
      // ~305 KB of JS loaded on every page just for these two idle wiggles.
      keyframes: {
        // Shared enter-animation vocabulary for the framer-motion removal (#28).
        // Enter-only: exiting elements just unmount (except modals, which use
        // the StreakBanner timed-exit transition pattern). Every animation
        // below runs with fill-mode "both" so a per-item inline
        // `animationDelay` (staggered lists) keeps the element hidden until
        // its delay elapses. Pair each usage with motion-reduce:animate-none.
        "fade-in": {
          from: { opacity: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(1rem)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-0.625rem)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-1.5rem)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(1.5rem)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
        },
        "scale-pop": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "70%": { opacity: "1", transform: "scale(1.12)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "spin-in": {
          from: { opacity: "0", transform: "scale(0) rotate(-180deg)" },
          to: { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        // Infinite attention loop (replaces repeat: Infinity scale pulses).
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "streak-wiggle": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "35%": { transform: "scale(1.1) rotate(5deg)" },
          "70%": { transform: "scale(1.05) rotate(-5deg)" },
        },
        "streak-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        // The "no" signal on a wrong quiz pick. Without it the wrong option was
        // a red-bordered card next to a green-bordered card — at a glance, two
        // highlighted answers. Color alone does not read as failure; motion does.
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-0.3rem)" },
          "40%, 80%": { transform: "translateX(0.3rem)" },
        },
      },
      animation: {
        // "both" fill-mode is load-bearing: staggered items set an inline
        // animationDelay and must stay in their `from` state until it elapses.
        "fade-in": "fade-in 0.3s ease-out both",
        "slide-up": "slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down": "slide-down 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-left":
          "slide-in-left 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right":
          "slide-in-right 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-pop": "scale-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "spin-in": "spin-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-scale": "pulse-scale 1.5s ease-in-out infinite",
        "streak-wiggle": "streak-wiggle 2s ease-in-out infinite",
        "streak-beat": "streak-beat 1s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out both",
      },
      transitionTimingFunction: {
        // The easing framer-motion usages passed as [0.22, 1, 0.36, 1].
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            // Headings in the display face. On zh/ar/hi --font-display falls
            // back to the system sans stack, so this line is inert there.
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-display)",
            },
            h1: {
              color: theme("colors.gray.900"),
              fontWeight: "700",
              fontSize: "2.25rem",
              lineHeight: "1.12",
              letterSpacing: "-0.02em",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h2: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              fontSize: "1.75rem",
              lineHeight: "1.22",
              letterSpacing: "-0.015em",
              marginTop: "2.25rem",
              marginBottom: "0.75rem",
            },
            h3: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              fontSize: "1.3125rem",
              lineHeight: "1.32",
              letterSpacing: "-0.01em",
              marginTop: "1.75rem",
              marginBottom: "0.5rem",
            },
            p: {
              marginTop: "1rem",
              marginBottom: "1rem",
              lineHeight: "1.75",
            },
            ul: {
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingInlineStart: "1.5rem",
            },
            ol: {
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingInlineStart: "1.5rem",
            },
            li: {
              marginTop: "0.25rem",
              marginBottom: "0.25rem",
            },
            // Inline code was pink-600 / pink-400. Pink is not in the palette
            // (VISUAL_SYSTEM.md §4: purple means actionable, green/amber/red
            // are semantic, nothing else is a text colour), and inline code is
            // not a control. The chip's ground is what marks it as code, so
            // the text is plain ink: gray-800 on gray-100 is 12.6:1.
            code: {
              color: theme("colors.gray.800"),
              backgroundColor: theme("colors.gray.100"),
              padding: "0.2rem 0.4rem",
              borderRadius: "0.25rem",
              fontSize: "0.875em",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
          },
        },
        // Every element-level key here carries the component boundary from
        // globals.css. It has to: the `dark:` variant compiles these to
        // `.dark\:prose-invert:is(.dark *) …`, specificity (0,2,0), which
        // outranks a component's own utility class. The plugin wraps each key
        // in :where(), so the :not() filters without adding specificity.
        invert: {
          css: {
            color: theme("colors.gray.300"),
            [`h1:not(${NOT_IN_COMPONENT})`]: {
              color: theme("colors.white"),
            },
            [`h2:not(${NOT_IN_COMPONENT})`]: {
              color: theme("colors.white"),
            },
            [`h3:not(${NOT_IN_COMPONENT})`]: {
              color: theme("colors.white"),
            },
            [`code:not(${NOT_IN_COMPONENT})`]: {
              color: theme("colors.gray.100"),
              backgroundColor: theme("colors.gray.800"),
            },
            // Without this, the rule above lands on the <code> inside every
            // highlighted block and gives each line its own lighter slab.
            "pre code": {
              color: "inherit",
              backgroundColor: "transparent",
            },
          },
        },
      }),
    },
  },
  // tailwindcss-rtl was removed here (#29). It targets Tailwind 1.x and its
  // ms-/me-/ps-/pe-/start-/end-/text-start/text-end/rounded-s/border-s classes
  // now duplicate Tailwind 3.3+ core. Worse, its inset/text-align/float/clear/
  // rounded generators emit `[dir="rtl"] .start-0 { right: 0 }` — specificity
  // (0,2,0) versus core's (0,1,0) — so a plugin rule carrying a PHYSICAL
  // property shadowed every native logical one on any page with a dir
  // attribute, which Layout.astro always sets. It emitted 30 such overrides.
  // Nothing in src/ uses a plugin-only class (space-s-*, divide-s-*,
  // origin-*-start, rounded-ts/te/bs/be, clear-start/end), so dropping it is
  // pure subtraction: RTL now rests on real logical properties.
  plugins: [require("@tailwindcss/typography")],
};
