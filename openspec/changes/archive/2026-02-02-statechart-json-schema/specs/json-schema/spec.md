## ADDED Requirements

### Requirement: JSON Schema defines ExportedChart structure
The schema SHALL define the complete structure of `ExportedChart` matching the TypeScript interface in `packages/core/src/types.ts`.

#### Scenario: Schema validates exported chart
- **WHEN** `chart.export()` output is validated against the schema
- **THEN** validation passes for all valid exports

### Requirement: Schema uses JSON Schema 2020-12
The schema SHALL use JSON Schema draft 2020-12 (`$schema: "https://json-schema.org/draft/2020-12/schema"`).

#### Scenario: Schema declares draft version
- **WHEN** schema is loaded
- **THEN** `$schema` property equals `"https://json-schema.org/draft/2020-12/schema"`

### Requirement: Schema defines ExportedTransition
The schema SHALL define `ExportedTransition` with properties: `target` (optional string), `guard` (string or null), `actions` (array of strings).

#### Scenario: Transition with guard validates
- **WHEN** validating `{ "target": "active", "guard": "isValid", "actions": ["log"] }`
- **THEN** validation passes

#### Scenario: Transition without target validates
- **WHEN** validating `{ "guard": null, "actions": [] }`
- **THEN** validation passes (targetless transition)

### Requirement: Schema defines ExportedStateNode
The schema SHALL define `ExportedStateNode` with properties: `entry`, `exit`, `on`, `after`, `invoke`, `onDone`, `onError`, `initial`, `states`, `parallel`, `final`.

#### Scenario: Minimal state node validates
- **WHEN** validating `{ "entry": [], "exit": [], "on": {} }`
- **THEN** validation passes

#### Scenario: State with nested states validates
- **WHEN** validating state node with `states` containing child state nodes
- **THEN** validation passes for nested hierarchy

### Requirement: Schema defines root ExportedChart
The schema SHALL define root `ExportedChart` with required properties: `version` (literal 1), `id` (string), `initial` (string), `context` (any), `states` (object of ExportedStateNode).

#### Scenario: Complete chart validates
- **WHEN** validating `{ "version": 1, "id": "test", "initial": "idle", "context": {}, "states": { "idle": { "entry": [], "exit": [], "on": {} } } }`
- **THEN** validation passes

#### Scenario: Missing version fails
- **WHEN** validating chart without `version` property
- **THEN** validation fails with required property error

### Requirement: Schema is accessible at /schema.json
The schema SHALL be served via Next.js route handler at `/schema.json` with `Content-Type: application/schema+json`.

#### Scenario: Fetch schema via HTTP
- **WHEN** GET request to `/schema.json`
- **THEN** response status is 200
- **THEN** response Content-Type is `application/schema+json`
- **THEN** response body is valid JSON Schema

### Requirement: Schema file lives in core package
The schema SHALL be stored at `packages/core/schema.json` as the canonical source.

#### Scenario: Schema exists in package
- **WHEN** inspecting `packages/core/`
- **THEN** `schema.json` file exists
