## Context

The `packages/core` library implements the statechart runtime with 0% coverage on critical modules:
- `instance.ts` (390 lines) - state machine runtime, event handling, subscriptions
- `transition.ts` - transition resolution and execution
- `invoke.ts` - service invocations
- `snapshot.ts` - state snapshots

Current test infrastructure uses `__tests__/` folders with `*.test.ts` pattern. Only `scjson-export.test.ts` exists with 14 tests.

## Goals / Non-Goals

**Goals:**
- Achieve 70% statement / 60% branch coverage thresholds
- Migrate to inline `*.spec.ts` test file pattern
- Test core runtime behaviors: instance lifecycle, transitions, invokes, snapshots
- Maintain fast test execution (<5s for core package)

**Non-Goals:**
- 100% coverage (diminishing returns)
- E2E/integration tests (unit tests only)
- Testing internal helper functions (test via public API)
- UI package tests (separate effort)

## Decisions

### 1. Test file location: Inline `*.spec.ts`

**Decision**: Place tests next to source files as `<module>.spec.ts`

**Rationale**:
- Easier to find related tests
- Encourages test writing (visible gap when missing)
- Better IDE navigation

**Alternatives considered**:
- `__tests__/` folder (current) - hides tests, harder to see coverage gaps
- `tests/` at package root - disconnected from source

### 2. Test pattern configuration

**Decision**: Update root `vitest.config.ts` include pattern to `**/*.spec.{ts,tsx}`

**Rationale**:
- Single pattern works for all packages
- `.spec.ts` is widely recognized convention
- Excludes `*.test.ts` to force migration (no mixed patterns)

### 3. Test isolation approach

**Decision**: Each module gets isolated unit tests via public exports only

**Rationale**:
- Tests remain stable through internal refactors
- Focuses on behavior not implementation
- `instance.ts` tests via `createInstance()`, `transition.ts` via `resolveTransition()`, etc.

### 4. Mocking strategy

**Decision**: Minimal mocking - use real implementations where possible

**Rationale**:
- Statechart logic is deterministic and fast
- Real instances catch integration issues
- Mock only timers (`vi.useFakeTimers()`) for delayed transitions

## Risks / Trade-offs

**[Migration disruption]** → Rename existing test file in same PR; run tests before/after to verify

**[Coverage gaming]** → Focus on behavioral tests, not line coverage; review tests for quality

**[Timer flakiness]** → Use `vi.useFakeTimers()` consistently; advance time explicitly

**[Large test files]** → Split by feature area within each spec file using nested `describe` blocks
