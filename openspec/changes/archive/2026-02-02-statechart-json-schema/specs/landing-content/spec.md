## ADDED Requirements

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
