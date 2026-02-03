## Why

The statecharts.sh library lacks dedicated documentation. Users have no place to learn API usage, understand core concepts, or find examples beyond the landing page snippets. A docs site will improve adoption and reduce onboarding friction.

## What Changes

- Add Astro Starlight integration to `apps/web` for documentation at `/docs`
- Create documentation structure with getting started guide, API reference, and usage examples
- Add "Docs" link to the site header/navbar alongside existing "Articles" link
- Configure Starlight sidebar navigation for docs content

## Capabilities

### New Capabilities

- `docs-site`: Starlight-based documentation site integrated into existing Astro app at `/docs` route
- `docs-content`: Documentation content structure including getting started, API reference, and examples

### Modified Capabilities

- `landing-content`: Add navigation link to docs in the site header

## Impact

- **Dependencies**: `@astrojs/starlight` package addition
- **Code**: `apps/web/astro.config.mjs` configuration changes
- **Content**: New `apps/web/src/content/docs/` directory with markdown files
- **Navigation**: Header component modification to include docs link
