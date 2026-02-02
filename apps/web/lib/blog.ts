import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Post, PostFrontmatter, PostMeta } from "./blog.types";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function formatDate(date: unknown): string {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0] ?? "";
  }
  return String(date);
}

function validateFrontmatter(
  data: Record<string, unknown>,
  slug: string
): PostFrontmatter {
  const missing: string[] = [];

  if (typeof data.title !== "string") missing.push("title");
  if (typeof data.description !== "string") missing.push("description");
  if (data.date === undefined || data.date === null) missing.push("date");

  if (missing.length > 0) {
    throw new Error(
      `Missing required frontmatter in ${slug}.mdx: ${missing.join(", ")}`
    );
  }

  return {
    title: data.title as string,
    description: data.description as string,
    date: formatDate(data.date),
    author: (data.author as string) ?? "Statecharts Team",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const frontmatter = validateFrontmatter(data, slug);

    return { ...frontmatter, slug };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = validateFrontmatter(data, slug);

  return { ...frontmatter, slug, content };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
