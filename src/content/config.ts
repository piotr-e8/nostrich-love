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
      updated: z.string().optional(),
      tags: z.array(z.string()).optional(),
      prerequisites: z.array(z.string()).optional(),
    })
    .passthrough(),
});

export const collections = {
  guides,
};
