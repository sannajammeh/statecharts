## ADDED Requirements

### Requirement: Blog collection schema definition
The system SHALL define an Astro content collection for blog posts at `src/content/config.ts` with a Zod schema validating:
- `title` (string, required)
- `description` (string, required)
- `date` (date, required, coerced from string)
- `author` (string, optional, defaults to "Statecharts Team")
- `tags` (string array, optional)

#### Scenario: Valid frontmatter passes validation
- **WHEN** MDX file has title, description, and date in frontmatter
- **THEN** Astro compiles the file without errors and exposes typed data

#### Scenario: Missing required field fails build
- **WHEN** MDX file is missing `title`, `description`, or `date`
- **THEN** Astro build fails with Zod validation error indicating the missing field

### Requirement: Content directory structure
Blog content SHALL reside in `src/content/blog/` directory with MDX files.

#### Scenario: MDX files in correct location
- **WHEN** `hello-world.mdx` exists at `src/content/blog/hello-world.mdx`
- **THEN** Astro includes it in the blog collection with slug `hello-world`

### Requirement: Type-safe content queries
The system SHALL provide type-safe access to blog posts via Astro's `getCollection('blog')` and `getEntry('blog', slug)` APIs.

#### Scenario: Query all posts
- **WHEN** code calls `getCollection('blog')`
- **THEN** returns array of typed blog entries with `data` (frontmatter) and `slug` properties

#### Scenario: Query single post by slug
- **WHEN** code calls `getEntry('blog', 'hello-world')`
- **THEN** returns single typed entry or undefined if not found

### Requirement: MDX rendering via content collections
Blog post MDX content SHALL be rendered using Astro's `render()` method from content collection entries.

#### Scenario: Render post content
- **WHEN** page calls `entry.render()` on a blog entry
- **THEN** returns `{ Content }` component that renders the MDX body with syntax highlighting
