## Why

Statechart exports from `.export()` need a formal JSON Schema definition. This enables validation, editor autocomplete, documentation, and establishes a standard interchange format.

## What Changes

- Add JSON Schema defining the `ExportedChart` structure at `packages/core/schema.json`
- Expose schema via Next.js API route at `/schema.json`
- Add landing page section showcasing the schema standard

## Capabilities

### New Capabilities
- `json-schema`: JSON Schema definition for statechart export format, validation utilities, and public exposure via API route

### Modified Capabilities
- `landing-content`: Add section showcasing the JSON Schema standard

## Impact

- `packages/core/`: New `schema.json` file, possibly validation utilities
- `apps/web/`: New API route `/schema.json`, landing page content update
- External: Establishes public schema standard for statechart interchange
