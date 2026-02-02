## Why

Statecharts needs a technical blog for publishing tutorials, changelog updates, and engineering posts. MDX in the repo keeps content version-controlled alongside code.

## What Changes

- Add blog index page at `/blog` listing all posts
- Add individual post pages at `/blog/[slug]`
- MDX files in `apps/web/content/blog/` with frontmatter metadata
- RSS feed at `/feed.xml` for syndication
- Syntax highlighting for code blocks (already have sugar-high)

## Capabilities

### New Capabilities

- `blog-posts`: MDX-based blog post rendering, frontmatter schema, slug routing
- `blog-feed`: RSS/Atom feed generation from blog posts

### Modified Capabilities

None - this is additive functionality.

## Impact

- **Code**: New routes in `apps/web/app/blog/`, content utils for MDX parsing
- **Dependencies**: May need `@next/mdx` or `next-mdx-remote` for MDX support
- **Build**: Content files processed at build time for static generation
