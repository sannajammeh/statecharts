## ADDED Requirements

### Requirement: Getting started guide exists
The docs SHALL include a getting started guide at `/docs/getting-started` covering installation and basic usage.

#### Scenario: User reads getting started
- **WHEN** user navigates to `/docs/getting-started`
- **THEN** page contains installation instructions
- **THEN** page contains basic chart creation example

### Requirement: API reference documents core functions
The docs SHALL include API reference pages documenting `chart()`, `createInstance()`, and key types.

#### Scenario: User reads chart API
- **WHEN** user navigates to `/docs/api/chart`
- **THEN** page documents `chart()` function signature and options

### Requirement: Examples section with practical patterns
The docs SHALL include examples section with common statechart patterns: traffic light, form validation, async data fetching.

#### Scenario: User reads traffic light example
- **WHEN** user navigates to `/docs/examples/traffic-light`
- **THEN** page shows complete traffic light statechart implementation

### Requirement: Index page provides docs overview
The docs index at `/docs` SHALL provide an overview and quick links to main sections.

#### Scenario: User visits docs index
- **WHEN** user navigates to `/docs`
- **THEN** page displays welcome message and links to getting started, API, examples
