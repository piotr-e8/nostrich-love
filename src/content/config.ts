import { defineCollection, z } from "astro:content";

const guides = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      // Query-matched <title>/og:title override (docs/audit-2026-07/market-research.md §6).
      // Consumed by [...lang]/guides/[slug].astro; the on-page H1 always stays `title`.
      // When absent, the <title> falls back to "<title> - Nostr Beginner Guide".
      seoTitle: z.string().optional(),
      description: z.string().optional(),
      estimatedTime: z.string().optional(),
      priority: z.number().optional(),
      category: z.string().optional(),
      // Machine-readable dates. `published` seeds datePublished + RSS pubDate,
      // `lastUpdated` seeds dateModified + article:modified_time + the visible
      // "Last updated" line. Both stay optional: a guide with no real date must
      // ship with none rather than a build-time or git-derived stand-in, which
      // would mark every guide "fresh" at once.
      // `updated` is the pre-existing spelling, kept so nothing regresses.
      //
      // coerce.date, not string: YAML parses an unquoted `2026-07-28` into a
      // Date, so a plain z.string() rejects the existing frontmatter. Coercing
      // accepts both spellings and hands the pages one normalized type.
      published: z.coerce.date().optional(),
      lastUpdated: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      prerequisites: z.array(z.string()).optional(),
    })
    .passthrough(),
});

export const collections = {
  guides,
};
