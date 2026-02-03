## 1. Setup Starlight Integration

- [x] 1.1 Install `@astrojs/starlight` package in apps/web
- [x] 1.2 Update `astro.config.ts` with Starlight integration and sidebar config
- [x] 1.3 Configure Starlight dark theme and title "Statecharts.sh Docs"
- [x] 1.4 Update content config to include docs collection with docsLoader/docsSchema

## 2. Create Documentation Content Structure

- [x] 2.1 Create `apps/web/src/content/docs/` directory
- [x] 2.2 Create docs index page (`index.mdx`) with overview and section links
- [x] 2.3 Create getting started guide (`getting-started.mdx`) with install and basic usage

## 3. API Reference Content

- [x] 3.1 Create `api/chart.mdx` documenting chart() function
- [x] 3.2 Create `api/instance.mdx` documenting createInstance() and runtime API

## 4. Examples Content

- [x] 4.1 Create `examples/traffic-light.mdx` with traffic light statechart
- [x] 4.2 Create `examples/form-validation.mdx` with form validation pattern
- [x] 4.3 Create `examples/async-data.mdx` with async data fetching pattern

## 5. Navigation Update

- [x] 5.1 Add "Docs" link to landing page header in `index.astro`

## 6. Verification

- [x] 6.1 Run build and verify docs pages generate at /docs
- [x] 6.2 Verify sidebar navigation shows all sections
- [x] 6.3 Verify dark theme is applied
