## Context

Next.js 16 app with App Router, React 19, Tailwind v4. Already has sugar-high for syntax highlighting. No existing content system - just static pages.

## Goals / Non-Goals

**Goals:**
- Static MDX blog with build-time rendering
- Blog index + individual post pages
- RSS feed for subscribers
- Leverage existing sugar-high for code blocks

**Non-Goals:**
- CMS integration
- Comments/reactions
- Search functionality
- Draft/preview system
- Pagination (can add later if needed)

## Decisions

### 1. MDX Processing: `next-mdx-remote` over `@next/mdx`

**Choice**: `next-mdx-remote` for on-demand MDX compilation

**Rationale**:
- `@next/mdx` requires MDX files in the app directory, conflating content with code
- `next-mdx-remote` allows content in `apps/web/content/blog/` separate from routes
- Easier to pass custom components (code blocks with sugar-high)
- Better frontmatter handling with gray-matter

**Alternatives considered**:
- `@next/mdx`: Tighter Next.js integration but less flexible file structure
- `contentlayer`: More features but heavier, overkill for simple blog

### 2. Content Structure: Flat files with slug-based routing

**Choice**: `content/blog/<slug>.mdx` → `/blog/<slug>`

**Rationale**:
- Simple 1:1 mapping between file and URL
- No nested folders needed for small blog
- Slug derived from filename, not frontmatter

**Alternatives considered**:
- Date-prefixed files (`2024-01-15-post.mdx`): Unnecessary complexity
- Nested by year/month: Overkill, harder to manage

### 3. Frontmatter Schema

```yaml
---
title: string (required)
description: string (required)
date: YYYY-MM-DD (required)
author: string (optional, default: "Statecharts Team")
tags: string[] (optional)
---
```

### 4. RSS Generation: Route handler at build time

**Choice**: `app/feed.xml/route.ts` generating RSS 2.0

**Rationale**:
- Native Next.js approach, no extra dependencies
- Runs at build time with `export const dynamic = 'force-static'`
- RSS 2.0 has widest reader support

**Alternatives considered**:
- Atom: Slightly better spec but RSS more widely supported
- `feed` npm package: Adds dependency for simple XML generation

## Risks / Trade-offs

**No incremental builds** → Full rebuild on any content change. Acceptable for small blog; revisit if content grows large.

**No draft system** → All MDX files are published. Use branches for drafts or add `draft: true` frontmatter later.

**Manual date management** → Authors must set date in frontmatter. Could automate via git commit date if needed.
