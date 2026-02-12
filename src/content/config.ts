import { defineCollection, z } from "astro:content";

const guides = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
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
