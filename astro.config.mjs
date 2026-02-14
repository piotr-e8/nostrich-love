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
    locales: ["en", "pl"],
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
    sitemap(),
  ],
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
