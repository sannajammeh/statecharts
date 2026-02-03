## Requirements

### Requirement: Promise-based invocations
The test suite SHALL verify promise invocations resolve correctly.

#### Scenario: Promise resolves
- **WHEN** `startInvoke(() => Promise.resolve("data"), ctx, onDone, onError)` is called
- **THEN** `onDone` is called with `"data"`

#### Scenario: Promise rejects
- **WHEN** `startInvoke(() => Promise.reject(new Error("fail")), ctx, onDone, onError)` is called
- **THEN** `onError` is called with the error

### Requirement: Subscription-based invocations
The test suite SHALL verify subscription sources emit values correctly.

#### Scenario: Subscription emits value
- **WHEN** invoke returns subscription source and it emits via `next()`
- **THEN** `onDone` is called with emitted value

#### Scenario: Subscription errors
- **WHEN** invoke returns subscription source and it calls `error()`
- **THEN** `onError` is called with the error

### Requirement: Cancellation behavior
The test suite SHALL verify invocations can be cancelled.

#### Scenario: Cancel prevents promise callback
- **WHEN** `controller.cancel()` is called before promise resolves
- **THEN** `onDone` is not called

#### Scenario: Cancel unsubscribes subscription
- **WHEN** `controller.cancel()` is called on subscription invoke
- **THEN** subscription's `unsubscribe()` is called

### Requirement: Synchronous error handling
The test suite SHALL verify synchronous throws are caught.

#### Scenario: Invoke function throws
- **WHEN** invoke function throws synchronously
- **THEN** `onError` is called with thrown error
