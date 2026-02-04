import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string().default("Statecharts Team"),
  publishedDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
});

export type ArticleSchema = z.infer<typeof articleSchema>;

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: articleSchema,
});

export const collections = { docs, articles };
