import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("docs", (entry) => entry.id.startsWith("articles/"));
  return rss({
    title: "Statecharts Articles",
    description: "Technical posts about statecharts and state machines",
    site: context.site ?? "https://statecharts.sh",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.lastUpdated ?? new Date(),
      link: `/articles/${post.id.replace("articles/", "")}/`,
    })),
  });
}
