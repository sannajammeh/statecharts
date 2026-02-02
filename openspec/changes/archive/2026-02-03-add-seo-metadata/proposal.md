## Why

The web app currently has placeholder SEO metadata ("Lorem Ipsum" as default title, generic description). Search engines and social media platforms cannot properly index or display the site. This impacts discoverability and link sharing.

## What Changes

- Replace placeholder title with "Statecharts.sh" as default, with proper page-specific titles
- Add comprehensive meta tags: Open Graph, Twitter Cards, canonical URLs
- Add JSON-LD structured data for the organization and software library
- Configure proper site metadata in Astro config (site URL, sitemap)
- Ensure all pages (index, articles list, individual articles) have appropriate metadata

## Capabilities

### New Capabilities

- `seo-metadata`: Core SEO infrastructure including meta tags, Open Graph, Twitter Cards, JSON-LD structured data, and canonical URLs across all page types

### Modified Capabilities

None - no existing specs.

## Impact

- `apps/web/src/layouts/BaseLayout.astro` - Enhanced with full SEO meta tags
- `apps/web/src/pages/index.astro` - Pass proper title/description to layout
- `apps/web/src/pages/articles/index.astro` - Add articles list SEO
- `apps/web/src/pages/articles/[slug].astro` - Add article-specific SEO (already passes some)
- `apps/web/astro.config.ts` - Add site URL configuration
- RSS feed already has good metadata, may need site URL consistency
