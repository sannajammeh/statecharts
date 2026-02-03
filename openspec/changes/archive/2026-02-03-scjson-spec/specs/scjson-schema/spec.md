## ADDED Requirements

### Requirement: SCJSON Schema Definition
The system SHALL provide a JSON Schema file at `packages/core/scjson.schema.json` that validates SCJSON documents.

#### Scenario: Valid SCJSON document passes validation
- **WHEN** a SCJSON document conforms to the specification
- **THEN** the document SHALL pass JSON Schema validation against `scjson.schema.json`

#### Scenario: Invalid SCJSON document fails validation
- **WHEN** a document is missing required fields or has invalid types
- **THEN** the document SHALL fail JSON Schema validation with descriptive errors

### Requirement: Type Discriminator Pattern
All SCJSON elements SHALL use a `$type` field as a discriminator to identify the element type.

#### Scenario: Element type identification
- **WHEN** parsing a SCJSON element
- **THEN** the `$type` field SHALL contain the SCXML element name (e.g., "scxml", "state", "transition")

### Requirement: Schema Versioning
The SCJSON schema SHALL include version information for compatibility detection.

#### Scenario: Schema version in document
- **WHEN** exporting a SCJSON document
- **THEN** the root element SHALL include `"version": "1.0"` matching SCXML version

#### Scenario: Optional schema reference
- **WHEN** exporting a SCJSON document
- **THEN** the root element MAY include `"$schema": "https://statecharts.sh/scjson/1.0.json"` for inline validation

### Requirement: TypeScript Type Definitions
The system SHALL provide TypeScript type definitions for all SCJSON structures in `packages/core/src/scjson-types.ts`.

#### Scenario: Type safety for SCJSON documents
- **WHEN** working with SCJSON documents in TypeScript
- **THEN** the types SHALL provide compile-time validation of structure

#### Scenario: Discriminated union for elements
- **WHEN** defining SCJSON element types
- **THEN** TypeScript types SHALL use discriminated unions based on `$type` field
