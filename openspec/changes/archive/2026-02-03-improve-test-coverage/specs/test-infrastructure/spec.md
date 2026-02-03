## MODIFIED Requirements

### Requirement: Test file discovery
The system SHALL discover test files matching the pattern `**/*.spec.{ts,tsx}`.

#### Scenario: Inline test discovery
- **WHEN** a test file exists at `packages/core/src/instance.spec.ts`
- **THEN** the test runner discovers and executes it

#### Scenario: Ignore non-spec files
- **WHEN** a file exists at `packages/core/src/helpers.ts` (no `.spec.` suffix)
- **THEN** the test runner does not execute it as a test

#### Scenario: Legacy test pattern excluded
- **WHEN** a test file exists at `packages/core/src/__tests__/old.test.ts`
- **THEN** the test runner does not discover it (migration required)
