## Context

Current `apps/web` is a Next.js 16 App Router application serving:
- Marketing landing page at `/`
- Blog with MDX posts at `/blog` and `/blog/[slug]`
- RSS feed at `/feed.xml`
- JSON schema endpoint at `/schema.json`

Interactive elements use client-side React: CopyButton, FAQItem accordions, InstallTabs, StateExampleTabs.

Styling: Tailwind CSS v4 with custom CSS variables, Geist fonts (local WOFF), sugar-high syntax highlighting.

## Goals / Non-Goals

**Goals:**
- Replace Next.js with Astro while maintaining identical visual output and URLs
- Use Astro content collections for type-safe blog management
- Preserve all interactivity via Astro islands (React components)
- Maintain Turbo monorepo integration

**Non-Goals:**
- Redesigning the site or changing any visual elements
- Adding new features or content
- Migrating to a different CSS framework
- Changing the blog content format (MDX frontmatter schema stays the same)

## Decisions

### D1: Astro 5 with hybrid rendering

**Choice**: Use Astro 5 in static output mode (`output: 'static'`)

**Rationale**: Site is fully static, no SSR needed. Static output enables CDN caching and simpler deployment.

**Alternatives considered**:
- `output: 'server'` — unnecessary complexity, no dynamic routes needed
- `output: 'hybrid'` — overkill for this use case

### D2: Content collections for blog

**Choice**: Define `content/blog` collection with Zod schema matching existing frontmatter

**Rationale**: Astro's built-in content collections provide type-safe access, automatic slug generation, and MDX compilation without external deps (`gray-matter`, `next-mdx-remote` removed).

**Schema**:
```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default("Statecharts Team"),
    tags: z.array(z.string()).optional(),
  }),
});
```

### D3: React islands for interactivity

**Choice**: Use `@astrojs/react` integration with `client:load` directive for interactive components

**Rationale**: Existing components (CopyButton, FAQItem, tabs) are React. Converting to vanilla JS adds risk and effort with no benefit.

**Components requiring hydration**:
- `CopyButton` — clipboard API + state
- `FAQItem` — accordion expand/collapse
- `InstallTabs` — tab switching
- `StateExampleTabs` — tab switching

### D4: Tailwind CSS v4 integration

**Choice**: Use `@astrojs/tailwind` integration with existing `globals.css`

**Rationale**: Direct compatibility. Astro's Tailwind integration supports v4 and CSS-first config.

**Font handling**: Move from `next/font/local` to manual `@font-face` declarations in CSS.

### D5: RSS via @astrojs/rss

**Choice**: Use official RSS integration with endpoint at `src/pages/feed.xml.ts`

**Rationale**: Purpose-built, handles RFC 822 dates, integrates with content collections.

### D6: JSON schema endpoint

**Choice**: Astro endpoint at `src/pages/schema.json.ts` returning `@statecharts/core` schema

**Rationale**: Direct port of existing route handler logic.

### D7: Directory structure

```
apps/web/
├── astro.config.ts
├── src/
│   ├── content/
│   │   ├── config.ts          # Collection definitions
│   │   └── blog/              # MDX posts (moved from content/blog)
│   │       └── hello-world.mdx
│   ├── layouts/
│   │   └── BaseLayout.astro   # Root layout (html, head, body)
│   ├── pages/
│   │   ├── index.astro        # Landing page
│   │   ├── blog/
│   │   │   ├── index.astro    # Blog list
│   │   │   └── [slug].astro   # Blog post
│   │   ├── feed.xml.ts        # RSS endpoint
│   │   └── schema.json.ts     # JSON schema endpoint
│   ├── components/
│   │   ├── CopyButton.tsx     # React island
│   │   ├── FAQItem.tsx        # React island
│   │   ├── InstallTabs.tsx    # React island
│   │   └── StateExampleTabs.tsx
│   └── styles/
│       └── globals.css
├── public/                    # Static assets (unchanged)
└── package.json
```

### D8: Monorepo integration

**Choice**: Update Turbo pipeline, keep workspace dependency on `@statecharts/core`

**Rationale**: Astro uses Vite which handles workspace deps. Add `@statecharts/core` to `vite.optimizeDeps.include` if needed.

## Risks / Trade-offs

**[R1] Visual regression** → Compare screenshots before/after for each page. Pixel-diff critical sections.

**[R2] Font rendering differences** → Test Geist font loading across browsers. Astro doesn't have `next/font` optimization, may see FOUT.

**[R3] Build integration** → Verify Turbo caching works with Astro. Test `turbo build --filter=web`.

**[R4] Sugar-high compatibility** → Confirm syntax highlighting CSS variables work in Astro MDX context.

**[R5] Content path change** → MDX files move from `content/blog/` to `src/content/blog/`. Update any references.
