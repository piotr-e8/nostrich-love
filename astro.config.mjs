// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");

export default defineConfig({
  site: "https://nostrich.love",
  output: "static",
  adapter: undefined,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl", "es", "de", "zh", "ar", "hi"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      // Simulators are moving to the standalone sandstr project. The routes stay
      // reachable for now but carry noindex, so keep them out of the sitemap too —
      // submitting a noindex URL is a contradictory signal.
      filter: (page) =>
        !/\/simulators(\/|$)/.test(page) && !/\/damus-demo\/?$/.test(page),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          pl: 'pl-PL',
          es: 'es-ES',
          de: 'de-DE',
          zh: 'zh-CN',
          ar: 'ar-SA',
          hi: 'hi-IN',
        },
      },
      // The i18n option emits one <xhtml:link> per locale but no x-default,
      // which is what search engines fall back to for unmatched languages.
      // Point it at the English (un-prefixed) version.
      serialize(item) {
        if (item.links && item.links.length > 1) {
          const fallback = item.links.find((link) => link.lang === "en-US");
          if (fallback && !item.links.some((link) => link.lang === "x-default")) {
            item.links.push({ lang: "x-default", url: fallback.url });
          }
        }
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": srcDir,
        "@components": resolve(srcDir, "components"),
        "@layouts": resolve(srcDir, "layouts"),
        "@utils": resolve(srcDir, "lib"),
        "@content": resolve(srcDir, "content"),
        "@styles": resolve(srcDir, "styles"),
      },
    },
    build: {
      sourcemap: false,
    },
  },
});
