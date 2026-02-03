## Context

The `apps/web` Astro site currently serves the landing page and articles. It uses React, MDX, and Tailwind CSS v4. The site has a simple header with logo and "Articles" link. There's no dedicated documentation for the statecharts.sh library.

Astro Starlight is the official Astro documentation framework. It provides built-in search, sidebar navigation, dark mode, and i18n support out of the box.

## Goals / Non-Goals

**Goals:**
- Add documentation site accessible at `/docs` route
- Integrate Starlight without disrupting existing landing page and articles
- Provide structured docs: getting started, API reference, examples
- Match existing site aesthetics (dark theme, monospace feel)

**Non-Goals:**
- Full i18n/multilingual support (can be added later)
- Custom search integration (use Starlight's built-in Pagefind)
- Replacing existing articles section with Starlight

## Decisions

### 1. Starlight as Subpath vs Separate App

**Decision**: Integrate Starlight into existing `apps/web` at `/docs` subpath

**Alternatives considered**:
- Separate `apps/docs` Astro app → More complex deployment, duplicate config
- Manual docs pages without Starlight → Reinventing sidebar, search, etc.

**Rationale**: Starlight supports subpath mounting. Single deployment keeps things simple.

### 2. Content Location

**Decision**: Use `apps/web/src/content/docs/` for documentation content

**Rationale**: Follows Starlight conventions. Content collections already configured for articles, docs collection will be added alongside.

### 3. Styling Integration

**Decision**: Use Starlight's default dark theme with minimal custom CSS overrides

**Alternatives considered**:
- Full custom theme matching landing page exactly → High effort, maintenance burden
- Embed landing page styles into Starlight → Could break Starlight's built-in features

**Rationale**: Starlight's dark theme is already professional. Minor tweaks via `customCss` can align fonts/colors without breaking functionality.

### 4. Navigation Between Landing and Docs

**Decision**: Add "Docs" link to landing page header; Starlight handles its own header for docs pages

**Rationale**: Starlight has its own navigation chrome. Trying to share headers would require significant customization.

## Risks / Trade-offs

**[Visual discontinuity between landing and docs]** → Accept minor styling differences. Can iterate on custom CSS later.

**[Bundle size increase from Starlight]** → Starlight is well-optimized. Documentation is static, so no runtime cost on landing page.

**[Content duplication with landing page examples]** → Docs will expand on landing page snippets. Landing stays as marketing, docs for depth.
