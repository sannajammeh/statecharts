import { getAllPosts } from "../../lib/blog";

export const dynamic = "force-static";

const SITE_URL = "https://statecharts.dev";

function formatRFC822Date(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <pubDate>${formatRFC822Date(post.date)}</pubDate>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Statecharts Blog</title>
    <description>Technical posts about statecharts and state machines</description>
    <link>${SITE_URL}/blog</link>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
