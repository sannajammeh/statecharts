## Why

Current test coverage is 35% statements / 29% branches, failing the 70%/60% thresholds. The `packages/core` library has critical untested modules: `instance.ts`, `invoke.ts`, `snapshot.ts`, and `transition.ts` all have 0% coverage.

## What Changes

- Add comprehensive tests for `instance.ts` (state machine runtime)
- Add tests for `invoke.ts` (invocation handling)
- Add tests for `snapshot.ts` (state snapshots)
- Add tests for `transition.ts` (state transitions)
- Improve coverage for `chart.ts` and `export.ts`
- **BREAKING**: Migrate from `__tests__/` folder pattern to inline `*.spec.ts` files

## Capabilities

### New Capabilities
- `core-instance-tests`: Tests for runtime instance creation, event handling, and state management
- `core-transition-tests`: Tests for transition execution, guards, and actions
- `core-invoke-tests`: Tests for service invocations and communication
- `core-snapshot-tests`: Tests for state snapshot creation and restoration

### Modified Capabilities
- `test-infrastructure`: Update test file discovery pattern from `__tests__/**/*.test.ts` to `**/*.spec.ts`

## Impact

- `packages/core/src/` - new `*.spec.ts` files alongside each module
- `vitest.config.ts` - update test file pattern
- `openspec/specs/test-infrastructure/spec.md` - update discovery pattern requirement
- CI passes once coverage thresholds met
