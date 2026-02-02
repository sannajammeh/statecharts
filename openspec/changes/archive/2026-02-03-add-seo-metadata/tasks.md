## 1. Configuration

- [x] 1.1 Add `site: "https://statecharts.sh"` to astro.config.ts

## 2. BaseLayout SEO Infrastructure

- [x] 2.1 Update BaseLayout Props interface with new SEO fields (canonicalUrl, ogImage, ogType, article)
- [x] 2.2 Update default title to "Statecharts.sh" and description to proper site description
- [x] 2.3 Add canonical URL `<link rel="canonical">` using Astro.url with optional override
- [x] 2.4 Add Open Graph meta tags (og:title, og:description, og:url, og:type, og:site_name)
- [x] 2.5 Add Twitter Card meta tags (twitter:card, twitter:title, twitter:description)
- [x] 2.6 Add JSON-LD Organization schema (renders on all pages)
- [x] 2.7 Add conditional JSON-LD WebSite schema (renders when ogType is "website")
- [x] 2.8 Add conditional JSON-LD Article schema (renders when article prop is provided)

## 3. Page Updates

- [x] 3.1 Update index.astro to pass ogType="website" to BaseLayout
- [x] 3.2 Update articles/index.astro with proper title and description
- [x] 3.3 Update articles/[slug].astro to pass article metadata (publishedTime, author) to BaseLayout
