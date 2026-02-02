## ADDED Requirements

### Requirement: Default page metadata
The system SHALL render a `<title>` tag with value "Statecharts.sh" when no title prop is provided. The system SHALL render a `<meta name="description">` tag with value "An open state chart specification and TypeScript library for building deterministic, framework-agnostic state machines." when no description prop is provided.

#### Scenario: Homepage without explicit title
- **WHEN** homepage renders without passing title prop
- **THEN** the page title SHALL be "Statecharts.sh"

#### Scenario: Page with custom title
- **WHEN** a page passes title="Articles - Statecharts.sh"
- **THEN** the page title SHALL be "Articles - Statecharts.sh"

### Requirement: Open Graph meta tags
The system SHALL render Open Graph meta tags including `og:title`, `og:description`, `og:url`, `og:type`, and `og:site_name` on all pages.

#### Scenario: Homepage Open Graph tags
- **WHEN** homepage renders
- **THEN** the page SHALL include `og:type` with value "website"
- **THEN** the page SHALL include `og:site_name` with value "Statecharts.sh"
- **THEN** the page SHALL include `og:url` matching the canonical URL

#### Scenario: Article page Open Graph tags
- **WHEN** an article page renders with article metadata
- **THEN** the page SHALL include `og:type` with value "article"
- **THEN** the page SHALL include `article:published_time` with the article's publication date
- **THEN** the page SHALL include `article:author` with the article's author name

### Requirement: Twitter Card meta tags
The system SHALL render Twitter Card meta tags including `twitter:card`, `twitter:title`, and `twitter:description` on all pages.

#### Scenario: Twitter card rendering
- **WHEN** any page renders
- **THEN** the page SHALL include `twitter:card` with value "summary"
- **THEN** the page SHALL include `twitter:title` matching the page title
- **THEN** the page SHALL include `twitter:description` matching the page description

### Requirement: Canonical URL
The system SHALL render a `<link rel="canonical">` tag with the full URL of the current page.

#### Scenario: Canonical URL from Astro.url
- **WHEN** a page renders at path "/articles"
- **THEN** the canonical URL SHALL be the site URL plus "/articles"

#### Scenario: Custom canonical URL override
- **WHEN** a page passes canonicalUrl prop
- **THEN** the canonical URL SHALL use the provided value instead of auto-generated

### Requirement: JSON-LD Organization schema
The system SHALL render a JSON-LD script with Organization schema on all pages.

#### Scenario: Organization schema content
- **WHEN** any page renders
- **THEN** the page SHALL include a `<script type="application/ld+json">` tag
- **THEN** the JSON-LD SHALL contain `@type: "Organization"`
- **THEN** the JSON-LD SHALL contain `name: "Statecharts.sh"`
- **THEN** the JSON-LD SHALL contain `url` matching the site URL

### Requirement: JSON-LD WebSite schema
The system SHALL render a JSON-LD script with WebSite schema on the homepage.

#### Scenario: WebSite schema on homepage
- **WHEN** homepage renders
- **THEN** the JSON-LD SHALL contain `@type: "WebSite"`
- **THEN** the JSON-LD SHALL contain `name: "Statecharts.sh"`
- **THEN** the JSON-LD SHALL contain `description` matching the site description

### Requirement: JSON-LD Article schema
The system SHALL render a JSON-LD script with Article schema on article pages when article metadata is provided.

#### Scenario: Article schema content
- **WHEN** an article page renders with article prop containing publishedTime and author
- **THEN** the JSON-LD SHALL contain `@type: "Article"`
- **THEN** the JSON-LD SHALL contain `headline` matching the article title
- **THEN** the JSON-LD SHALL contain `datePublished` matching the publishedTime
- **THEN** the JSON-LD SHALL contain `author` with the author name

### Requirement: Site URL configuration
The system SHALL configure the site URL in astro.config.ts to enable Astro.site and Astro.url globals.

#### Scenario: Site URL available
- **WHEN** any page accesses Astro.site
- **THEN** the value SHALL be "https://statecharts.sh"
