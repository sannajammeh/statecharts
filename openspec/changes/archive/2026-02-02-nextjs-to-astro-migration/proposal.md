## Why

The `apps/web` Next.js app is primarily a static marketing site with a blog. Astro is purpose-built for content-driven static sites, offering simpler architecture, faster builds, and better DX for this use case. Content collections provide type-safe MDX handling without manual file system utilities.

## What Changes

- **BREAKING**: Replace Next.js 16 with Astro 5 in `apps/web`
- Migrate App Router pages to Astro pages/layouts
- Convert blog MDX processing from manual `gray-matter` + `next-mdx-remote` to Astro content collections
- Migrate RSS feed from Next.js route handler to Astro RSS integration
- Migrate JSON schema endpoint to Astro endpoint
- Convert client-side interactive components (CopyButton, FAQItem, tabs) to Astro islands with React
- Preserve identical visual appearance (Tailwind CSS v4, Geist fonts, dark mode, syntax highlighting)
- Maintain existing URLs: `/`, `/blog`, `/blog/[slug]`, `/feed.xml`, `/schema.json`

## Capabilities

### New Capabilities

- `astro-content-collections`: Type-safe blog content management using Astro's built-in content collections with Zod schema validation

### Modified Capabilities

_None - existing specs (`blog-posts`, `blog-feed`, `landing-content`) define WHAT the site does, not HOW it's built. The framework change doesn't alter requirements._

## Impact

- **Code**: Complete rewrite of `apps/web` - all files except `content/blog/*.mdx` and `public/` assets
- **Dependencies**: Remove Next.js, add Astro + integrations (@astrojs/react, @astrojs/tailwind, @astrojs/mdx, @astrojs/rss)
- **Build**: Turbo pipeline changes for Astro build commands
- **Dev workflow**: Port 3000 preserved, same `npm run dev` interface
- **Monorepo**: May need to update `next.config.ts` transpile settings → Astro Vite config for `@statecharts/core`
