## ADDED Requirements

### Requirement: Documentation site accessible at /docs route
The Astro app SHALL serve documentation pages under the `/docs` URL path using Starlight integration.

#### Scenario: User navigates to docs
- **WHEN** user visits `/docs`
- **THEN** Starlight documentation homepage is displayed

#### Scenario: User navigates to docs subpage
- **WHEN** user visits `/docs/getting-started`
- **THEN** the getting started documentation page is displayed

### Requirement: Starlight integration configured in Astro
The `astro.config.ts` SHALL include Starlight integration with title "Statecharts.sh Docs" and configured sidebar.

#### Scenario: Build includes Starlight
- **WHEN** the Astro app is built
- **THEN** Starlight pages are generated under `/docs`

### Requirement: Starlight uses dark theme
The Starlight configuration SHALL use dark theme to align with main site aesthetics.

#### Scenario: User views docs in browser
- **WHEN** user views any docs page
- **THEN** dark theme is displayed by default

### Requirement: Sidebar navigation configured for docs structure
The Starlight sidebar SHALL include sections for "Getting Started", "API Reference", and "Examples".

#### Scenario: User views docs sidebar
- **WHEN** user views any docs page
- **THEN** sidebar displays "Getting Started", "API Reference", and "Examples" sections

### Requirement: Docs content collection configured
The Astro content configuration SHALL define a `docs` collection using Starlight's `docsLoader` and `docsSchema`.

#### Scenario: Docs content is validated
- **WHEN** docs markdown files are processed
- **THEN** they are validated against Starlight's docs schema
