import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default("Statecharts Team"),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
