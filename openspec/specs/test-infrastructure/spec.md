## Requirements

### Requirement: Test runner configuration
The system SHALL provide Vitest configuration at the monorepo root that discovers and executes tests across all workspaces.

#### Scenario: Run all tests from root
- **WHEN** user executes `npm run test` at repository root
- **THEN** Vitest runs all tests in `apps/*` and `packages/*` workspaces

#### Scenario: Filter tests by package
- **WHEN** user executes `npm run test -- --filter=@statecharts/ui`
- **THEN** only tests in `packages/ui` workspace execute

### Requirement: Test file discovery
The system SHALL discover test files matching the pattern `**/__tests__/**/*.test.{ts,tsx}`.

#### Scenario: Colocated test discovery
- **WHEN** a test file exists at `packages/ui/src/__tests__/Button.test.tsx`
- **THEN** the test runner discovers and executes it

#### Scenario: Ignore non-test files
- **WHEN** a file exists at `packages/ui/src/__tests__/helpers.ts` (no `.test.` suffix)
- **THEN** the test runner does not execute it as a test

### Requirement: Coverage reporting
The system SHALL generate code coverage reports using v8 coverage.

#### Scenario: Coverage output
- **WHEN** user executes `npm run test -- --coverage`
- **THEN** coverage report displays statement, branch, function, and line coverage

#### Scenario: Coverage thresholds
- **WHEN** statement coverage falls below 70% or branch coverage below 60%
- **THEN** the test run fails with threshold violation error

### Requirement: Per-package configuration
Each workspace SHALL be able to extend or override root Vitest configuration via local `vitest.config.ts`.

#### Scenario: Package-specific setup
- **WHEN** `packages/ui/vitest.config.ts` defines custom `setupFiles`
- **THEN** those setup files run before tests in that workspace only

### Requirement: CI integration
The test suite SHALL integrate with GitHub Actions for automated execution.

#### Scenario: PR test execution
- **WHEN** a pull request is opened or updated
- **THEN** GitHub Actions runs the full test suite

#### Scenario: CI failure blocking
- **WHEN** any test fails in CI
- **THEN** the PR check reports failure status
