## Context

Astro web app with 4 page types: homepage, articles list, individual articles, and utility pages (feed.xml, schema.json). BaseLayout.astro handles `<head>` with basic title/description props. Currently uses placeholder values ("Lorem Ipsum"). Site URL is hardcoded inconsistently.

## Goals / Non-Goals

**Goals:**
- Proper default and page-specific titles/descriptions
- Open Graph and Twitter Card meta tags for social sharing
- JSON-LD structured data for search engines
- Canonical URLs and consistent site URL configuration
- Type-safe SEO props interface

**Non-Goals:**
- Sitemap generation (separate change)
- robots.txt configuration
- Analytics or tracking scripts
- Image optimization or OG image generation

## Decisions

### 1. SEO Component vs Layout Props

**Decision**: Extend BaseLayout props rather than creating separate SEO component.

**Rationale**: BaseLayout already owns `<head>`. Adding props keeps SEO centralized. A separate component would require coordination and could lead to duplicate tags.

**Alternatives considered**:
- Astro SEO integration package - adds dependency, less control over output
- Separate `<SEO>` component - requires slotting into head, more complex

### 2. JSON-LD Implementation

**Decision**: Inline `<script type="application/ld+json">` in BaseLayout with conditional schemas based on page type.

**Rationale**: No build-time processing needed. Astro can output JSON directly. Page-specific data passed via props.

**Schemas to implement**:
- `Organization` - on all pages (publisher info)
- `WebSite` - on homepage
- `Article` - on individual article pages

### 3. Site URL Configuration

**Decision**: Configure `site` in `astro.config.ts` and use `Astro.site` / `Astro.url` for canonical URLs.

**Rationale**: Single source of truth. Astro provides these globals automatically when `site` is configured.

### 4. Props Interface

**Decision**: Extend existing BaseLayout props with optional SEO fields:

```typescript
interface Props {
  title?: string;
  description?: string;
  // New optional fields
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime: string;
    author: string;
  };
}
```

**Rationale**: Backwards compatible. Pages only pass what they need.

## Risks / Trade-offs

**[Missing OG images]** → Accept text-only cards initially. OG image generation is out of scope.

**[Hardcoded site URL in config]** → Use environment variable for production vs dev flexibility if needed later.

**[JSON-LD complexity]** → Start with minimal schemas (Organization, WebSite, Article). Can extend later.
