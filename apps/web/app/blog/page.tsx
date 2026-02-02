import type { JSX } from "react";
import Link from "next/link";
import { getAllPosts } from "../../lib/blog";

export default function BlogIndex(): JSX.Element {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold">Blog</h1>
        <p className="text-gray-600">No posts yet. Check back soon!</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <time className="text-sm text-gray-500">{post.date}</time>
              <h2 className="text-xl font-semibold group-hover:underline">
                {post.title}
              </h2>
              <p className="mt-1 text-gray-600">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
