## 1. Setup

- [x] 1.1 Install `next-mdx-remote` and `gray-matter` dependencies
- [x] 1.2 Create `apps/web/content/blog/` directory for MDX files
- [x] 1.3 Define TypeScript types for blog post frontmatter

## 2. Content Utilities

- [x] 2.1 Create `lib/blog.ts` with functions to read/parse MDX files
- [x] 2.2 Implement `getAllPosts()` returning sorted post metadata
- [x] 2.3 Implement `getPostBySlug(slug)` returning full post content
- [x] 2.4 Add frontmatter validation with clear error messages

## 3. Blog Pages

- [x] 3.1 Create `app/blog/page.tsx` index listing all posts
- [x] 3.2 Create `app/blog/[slug]/page.tsx` for individual posts
- [x] 3.3 Add `generateStaticParams` for static generation
- [x] 3.4 Implement 404 handling for missing posts

## 4. MDX Rendering

- [x] 4.1 Create MDX components with sugar-high code highlighting
- [x] 4.2 Wire up `MDXRemote` with custom components

## 5. RSS Feed

- [x] 5.1 Create `app/feed.xml/route.ts` with static generation
- [x] 5.2 Generate RSS 2.0 XML with all posts
- [x] 5.3 Format dates to RFC 822 for pubDate

## 6. Testing

- [x] 6.1 Add sample blog post to verify end-to-end
- [x] 6.2 Verify build succeeds with static output
- [x] 6.3 Test RSS feed validates as RSS 2.0
