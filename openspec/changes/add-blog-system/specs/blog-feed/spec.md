## ADDED Requirements

### Requirement: RSS feed endpoint
The system SHALL serve an RSS 2.0 feed at `/feed.xml`.

#### Scenario: Feed accessible
- **WHEN** client requests `/feed.xml`
- **THEN** response has `Content-Type: application/xml` and valid RSS 2.0 structure

### Requirement: Feed contains all posts
The RSS feed SHALL include all published blog posts sorted by date descending.

#### Scenario: Feed items match posts
- **WHEN** blog has 3 published posts
- **THEN** RSS feed contains 3 `<item>` elements with matching titles and dates

### Requirement: Feed item structure
Each RSS item SHALL include:
- `<title>` from post frontmatter
- `<description>` from post frontmatter
- `<link>` absolute URL to post page
- `<pubDate>` RFC 822 formatted date from frontmatter

#### Scenario: Item has required fields
- **WHEN** post has title "Hello World", description "First post", date 2024-01-15
- **THEN** RSS item contains all fields with correct values and properly formatted pubDate

### Requirement: Static feed generation
The RSS feed SHALL be generated at build time, not on-demand.

#### Scenario: Feed exists after build
- **WHEN** `npm run build` completes
- **THEN** `/feed.xml` is served from static output
