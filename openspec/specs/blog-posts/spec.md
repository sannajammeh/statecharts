## ADDED Requirements

### Requirement: Blog post frontmatter schema
Each MDX file in `content/blog/` SHALL have frontmatter with:
- `title` (string, required)
- `description` (string, required)
- `date` (YYYY-MM-DD, required)
- `author` (string, optional, defaults to "Statecharts Team")
- `tags` (string[], optional)

#### Scenario: Valid frontmatter parsed
- **WHEN** MDX file has all required frontmatter fields
- **THEN** post metadata is extracted and available for rendering

#### Scenario: Missing required field
- **WHEN** MDX file is missing `title`, `description`, or `date`
- **THEN** build fails with clear error message indicating missing field

### Requirement: Blog index page
The system SHALL render a blog index page at `/blog` listing all published posts sorted by date descending.

#### Scenario: Index displays posts
- **WHEN** user navigates to `/blog`
- **THEN** page displays list of all posts with title, date, and description

#### Scenario: Empty blog
- **WHEN** no MDX files exist in `content/blog/`
- **THEN** index page displays empty state message

### Requirement: Individual post pages
The system SHALL render individual post pages at `/blog/[slug]` where slug matches the MDX filename (without extension).

#### Scenario: Post renders correctly
- **WHEN** user navigates to `/blog/hello-world`
- **THEN** system renders `content/blog/hello-world.mdx` with full MDX content

#### Scenario: Post not found
- **WHEN** user navigates to `/blog/nonexistent`
- **THEN** system returns 404 page

### Requirement: Code syntax highlighting
Code blocks in blog posts SHALL be rendered with syntax highlighting using sugar-high.

#### Scenario: Fenced code block
- **WHEN** MDX contains triple-backtick code block with language identifier
- **THEN** code is rendered with syntax highlighting for that language

### Requirement: Static generation
All blog pages SHALL be statically generated at build time.

#### Scenario: Build generates static pages
- **WHEN** `npm run build` completes
- **THEN** all blog post pages exist as static HTML files
