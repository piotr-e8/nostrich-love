/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B5CF6",
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
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
        // Friendly theme colors based on nostrich logo
        friendly: {
          purple: {
            DEFAULT: "#9B7BFF",
            50: "#FAF8FF",
            100: "#F3F0FF",
            200: "#E8E2FF",
            300: "#D4C9FF",
            400: "#B8A3FF",
            500: "#9B7BFF",
            600: "#8A6AE6",
            700: "#7A5CCC",
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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            h1: {
              color: theme("colors.gray.900"),
              fontWeight: "700",
              fontSize: "2.25rem",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h2: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              fontSize: "1.5rem",
              marginTop: "2rem",
              marginBottom: "0.75rem",
            },
            h3: {
              color: theme("colors.gray.900"),
              fontWeight: "600",
              fontSize: "1.25rem",
              marginTop: "1.5rem",
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
              paddingLeft: "1.5rem",
            },
            ol: {
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingLeft: "1.5rem",
            },
            li: {
              marginTop: "0.25rem",
              marginBottom: "0.25rem",
            },
            code: {
              color: theme("colors.pink.600"),
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
        invert: {
          css: {
            color: theme("colors.gray.300"),
            h1: {
              color: theme("colors.white"),
            },
            h2: {
              color: theme("colors.white"),
            },
            h3: {
              color: theme("colors.white"),
            },
            code: {
              color: theme("colors.pink.400"),
              backgroundColor: theme("colors.gray.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
