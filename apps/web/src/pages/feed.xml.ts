import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = await getCollection("articles", ({ data }) => !data.draft);

  const sortedArticles = articles.sort(
    (a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf()
  );

  return rss({
    title: "Statecharts Articles",
    description: "Technical posts about statecharts and state machines",
    site: context.site ?? "https://statecharts.sh",
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedDate,
      link: `/articles/${article.id}/`,
    })),
  });
}
