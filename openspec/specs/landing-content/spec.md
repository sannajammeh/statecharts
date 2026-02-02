## ADDED Requirements

### Requirement: Hero section displays statecharts branding
The hero section SHALL display "Statecharts.sh" as the main title with tagline "An open state chart specification and library".

#### Scenario: User views hero section
- **WHEN** user loads the landing page
- **THEN** header displays "Statecharts.sh" title
- **THEN** tagline reads "An open state chart specification and library"

### Requirement: Feature badges communicate key benefits
The hero section SHALL display badges highlighting statecharts benefits: "Deterministic", "Framework Agnostic", "TypeScript-first".

#### Scenario: User views feature badges
- **WHEN** user views the hero section
- **THEN** three badges are visible with labels "Deterministic", "Framework Agnostic", "TypeScript-first"

### Requirement: Install commands show package installation
The install section SHALL show the command `npm install statecharts` with copy functionality for npm, pnpm, and bun package managers.

#### Scenario: User copies install command
- **WHEN** user clicks copy button on npm command
- **THEN** `npm install statecharts` is copied to clipboard

#### Scenario: User views alternative package managers
- **WHEN** user views install section
- **THEN** commands for pnpm and bun are also displayed

### Requirement: GitHub link points to project repository
The header SHALL include a GitHub icon linking to the project repository.

#### Scenario: User clicks GitHub link
- **WHEN** user clicks the GitHub icon in the header
- **THEN** browser navigates to the statecharts GitHub repository

### Requirement: Features section explains statecharts with code example
The features section SHALL explain what statecharts are and include a traffic light state machine code example.

#### Scenario: User reads features section
- **WHEN** user scrolls to features section
- **THEN** explanation of statecharts concept is visible
- **THEN** traffic light state machine code example is displayed

### Requirement: Coming Soon section previews visualizer
The Coming Soon section SHALL preview the visualizer feature with "Coming Soon" badge.

#### Scenario: User views Coming Soon section
- **WHEN** user scrolls to Coming Soon section
- **THEN** visualizer preview/description is visible
- **THEN** "Coming Soon" badge indicates feature is not yet available

### Requirement: FAQ contains statecharts-specific questions
The FAQ section SHALL contain questions relevant to statecharts: what they are, comparison to Redux, comparison to XState.

#### Scenario: User expands FAQ item
- **WHEN** user clicks on an FAQ question
- **THEN** answer accordion expands with relevant content

### Requirement: Footer displays statecharts branding
The footer SHALL display appropriate statecharts branding and copyright.

#### Scenario: User views footer
- **WHEN** user scrolls to footer
- **THEN** statecharts branding is visible

### Requirement: Schema section showcases JSON Schema standard
The landing page SHALL include a section highlighting the JSON Schema standard for statechart exports, positioned after the features section.

#### Scenario: User views schema section
- **WHEN** user scrolls to schema section
- **THEN** section title indicates "Open Standard" or similar messaging
- **THEN** brief description explains the schema's purpose (validation, tooling, interchange)

### Requirement: Schema section links to schema endpoint
The schema section SHALL include a link or button to view the schema at `/schema.json`.

#### Scenario: User clicks schema link
- **WHEN** user clicks the schema link in the section
- **THEN** browser navigates to `/schema.json` displaying the JSON Schema
