import type { JSX } from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "../../../lib/blog";
import { mdxComponents } from "../../../lib/mdx-components";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <article>
        <header className="mb-8">
          <time className="text-sm text-gray-500">{post.date}</time>
          <h1 className="mt-2 text-3xl font-bold">{post.title}</h1>
          <p className="mt-2 text-gray-600">{post.description}</p>
          <p className="mt-2 text-sm text-gray-500">By {post.author}</p>
        </header>
        <div className="prose prose-gray max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
