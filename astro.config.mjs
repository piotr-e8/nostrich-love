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
      // A sitemap is a request to index, so pages carrying `noindex` must not
      // appear in it. These three render the visitor's own localStorage state —
      // identical and near-empty for anyone not already using the site — and
      // were listed beside real content. Keep in step with the `noindex` prop
      // on the matching pages in src/pages/.
      filter: (page) =>
        !/\/(settings|progress|badges)\/$/.test(page),
      i18n: {
        defaultLocale: 'en',
        // Bare language codes, NOT region-qualified ones (en-US, pl-PL, ...).
        // src/components/SEO.astro emits hreflang from localeConfig.htmlLang,
        // which is bare, so region codes here made the sitemap and the HTML
        // annotate the same URL cluster with two different sets of values.
        // Bare codes are also the honest claim: the content is not written for
        // US English or Saudi Arabic specifically. Keep these in lockstep with
        // localeConfig.htmlLang in src/config/locales.ts —
        // scripts/verify-seo.js asserts the two agree.
        locales: {
          en: 'en',
          pl: 'pl',
          es: 'es',
          de: 'de',
          zh: 'zh',
          ar: 'ar',
          hi: 'hi',
        },
      },
      // The i18n option emits one <xhtml:link> per locale but no x-default,
      // which is what search engines fall back to for unmatched languages.
      // Point it at the English (un-prefixed) version.
      serialize(item) {
        if (item.links && item.links.length > 1) {
          const fallback = item.links.find((link) => link.lang === "en");
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
