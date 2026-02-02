## 1. Project Setup

- [x] 1.1 Move `apps/web` to `apps/web-old` as backup
- [x] 1.2 Create new `apps/web` directory with Astro scaffolding
- [x] 1.3 Configure `package.json` with Astro deps (@astrojs/react, @astrojs/tailwind, @astrojs/mdx, @astrojs/rss)
- [x] 1.4 Create `astro.config.ts` with static output, React, Tailwind, MDX integrations
- [x] 1.5 Create `tsconfig.json` extending shared config with Astro settings

## 2. Styles and Fonts

- [x] 2.1 Copy `public/` assets from old app (fonts, icons, favicon)
- [x] 2.2 Create `src/styles/globals.css` with Tailwind imports and CSS variables
- [x] 2.3 Add `@font-face` declarations for Geist Sans and Geist Mono
- [x] 2.4 Copy sugar-high syntax highlighting CSS variables

## 3. Content Collections

- [x] 3.1 Create `src/content/config.ts` with blog collection Zod schema
- [x] 3.2 Move `content/blog/` MDX files to `src/content/blog/`
- [x] 3.3 Verify content collection types generate correctly

## 4. Layouts

- [x] 4.1 Create `src/layouts/BaseLayout.astro` with html, head, body structure
- [x] 4.2 Add meta tags, font loading, global styles import
- [x] 4.3 Add dark mode support via CSS variables

## 5. React Island Components

- [x] 5.1 Create `src/components/CopyButton.tsx` with `client:load`
- [x] 5.2 Create `src/components/FAQItem.tsx` accordion component
- [x] 5.3 Create `src/components/InstallTabs.tsx` tab switcher
- [x] 5.4 Create `src/components/StateExampleTabs.tsx` tab switcher

## 6. Landing Page

- [x] 6.1 Create `src/pages/index.astro` with hero section
- [x] 6.2 Add feature badges (Deterministic, Framework Agnostic, TypeScript-first)
- [x] 6.3 Add install commands section with InstallTabs island
- [x] 6.4 Add "What are Statecharts?" section with code example
- [x] 6.5 Add Open Standard section with schema link
- [x] 6.6 Add Visualizer "Coming Soon" section
- [x] 6.7 Add FAQ section with FAQItem islands
- [x] 6.8 Add footer with branding and GitHub link

## 7. Blog Pages

- [x] 7.1 Create `src/pages/blog/index.astro` listing all posts
- [x] 7.2 Create `src/pages/blog/[slug].astro` for individual posts
- [x] 7.3 Implement `getStaticPaths()` for static generation
- [x] 7.4 Style blog post content with prose classes

## 8. API Endpoints

- [x] 8.1 Create `src/pages/feed.xml.ts` RSS endpoint using @astrojs/rss
- [x] 8.2 Create `src/pages/schema.json.ts` returning @statecharts/core schema

## 9. Monorepo Integration

- [x] 9.1 Update root `turbo.json` with Astro build pipeline
- [x] 9.2 Verify `@statecharts/core` workspace dep resolves
- [x] 9.3 Test `npm run dev` starts on port 3000
- [x] 9.4 Test `npm run build` produces static output

## 10. Verification

- [x] 10.1 Compare landing page visually with old app
- [x] 10.2 Compare blog index page visually
- [x] 10.3 Compare blog post page visually
- [x] 10.4 Verify RSS feed at `/feed.xml` returns valid XML
- [x] 10.5 Verify schema endpoint at `/schema.json` returns JSON
- [x] 10.6 Test all interactive components (copy, tabs, FAQ accordion)
- [x] 10.7 Remove `apps/web-old` backup directory
