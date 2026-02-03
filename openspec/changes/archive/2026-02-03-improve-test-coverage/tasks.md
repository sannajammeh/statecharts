## 1. Infrastructure Migration

- [x] 1.1 Update root `vitest.config.ts` include pattern to `**/*.spec.{ts,tsx}`
- [x] 1.2 Update `openspec/specs/test-infrastructure/spec.md` with new discovery pattern
- [x] 1.3 Rename `packages/core/src/__tests__/scjson-export.test.ts` to `packages/core/src/scjson-export.spec.ts`
- [x] 1.4 Remove empty `__tests__` directory

## 2. Snapshot Tests

- [x] 2.1 Create `packages/core/src/snapshot.spec.ts`
- [x] 2.2 Test StateSnapshot constructor (value, context, done, path, timestamp)
- [x] 2.3 Test context and path freezing
- [x] 2.4 Test `matches()` for flat states
- [x] 2.5 Test `matches()` for nested states

## 3. Transition Tests

- [x] 3.1 Create `packages/core/src/transition.spec.ts`
- [x] 3.2 Test string shorthand resolution
- [x] 3.3 Test guard evaluation (pass, fail, arguments)
- [x] 3.4 Test action attachment
- [x] 3.5 Test array transitions (first match wins)
- [x] 3.6 Test targetless transitions

## 4. Invoke Tests

- [x] 4.1 Create `packages/core/src/invoke.spec.ts`
- [x] 4.2 Test promise resolution and rejection
- [x] 4.3 Test subscription source (next, error)
- [x] 4.4 Test cancellation (promise callback, subscription unsubscribe)
- [x] 4.5 Test synchronous error handling

## 5. Instance Tests

- [x] 5.1 Create `packages/core/src/instance.spec.ts`
- [x] 5.2 Test instance creation (initial state, nested initials, context override)
- [x] 5.3 Test event sending (simple transition, payload, unknown event)
- [x] 5.4 Test entry/exit actions
- [x] 5.5 Test subscription notifications (subscribe, unsubscribe)
- [x] 5.6 Test stop behavior (prevents transitions, clears timers)
- [x] 5.7 Test final state detection

## 6. Verification

- [x] 6.1 Run `npm run test:coverage` and verify thresholds pass
- [x] 6.2 Ensure no regressions in existing scjson-export tests
