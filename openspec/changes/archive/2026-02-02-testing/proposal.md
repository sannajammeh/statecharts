## Why

No testing infrastructure exists. Need confidence when iterating on statechart runtime and specs.

## What Changes

- Add Vitest as test runner (fast, native ESM/TS support)
- Configure test setup for monorepo (apps/web, packages/ui)
- Add unit test patterns for core statechart logic
- Add integration test patterns for component interactions
- Skip E2E browser tests until React library is built

## Capabilities

### New Capabilities

- `test-infrastructure`: Vitest config, test scripts, coverage reporting, CI integration

### Modified Capabilities

None - no existing specs need requirement changes.

## Impact

- **Packages**: All packages get test capability
- **Dependencies**: vitest, @vitest/coverage-v8
- **CI**: Tests run on PR/push
- **Dev workflow**: `npm run test` available at root and per-package
