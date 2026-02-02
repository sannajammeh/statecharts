## ADDED Requirements

### Requirement: State nodes support invoke for async operations
State nodes MAY include an `invoke` property with a function returning a Promise or Subscription.

#### Scenario: Promise invocation
- **WHEN** state has `invoke: () => fetch('/api').then(r => r.json())`
- **THEN** promise is started when state is entered

### Requirement: onDone handles successful invocation
State nodes with `invoke` MAY include `onDone` to handle successful promise resolution.

#### Scenario: onDone as string target
- **WHEN** invoke resolves and `onDone: 'success'`
- **THEN** machine transitions to `success` state

#### Scenario: onDone as object with action
- **WHEN** invoke resolves with data and `onDone: { target: 'success', action: (ctx, ev) => ({ data: ev.data }) }`
- **THEN** machine transitions to `success` and context includes resolved data

### Requirement: onError handles failed invocation
State nodes with `invoke` MAY include `onError` to handle promise rejection.

#### Scenario: onError as string target
- **WHEN** invoke rejects and `onError: 'failure'`
- **THEN** machine transitions to `failure` state

#### Scenario: onError as object with action
- **WHEN** invoke rejects with error and `onError: { target: 'failure', action: (ctx, ev) => ({ error: ev.error }) }`
- **THEN** machine transitions to `failure` and context includes error

### Requirement: Invocations cancelled on state exit
When exiting a state with an active invocation, the invocation SHALL be cancelled.

#### Scenario: Exit cancels pending promise
- **WHEN** state with pending invoke is exited via another event
- **THEN** promise resolution/rejection is ignored

### Requirement: Subscription invocations
Invoke MAY return a Subscription object with `subscribe()` method for observable-like sources.

#### Scenario: Subscription receives values
- **WHEN** invoke returns subscription and subscription emits value
- **THEN** onDone action receives the value

#### Scenario: Subscription cleanup on exit
- **WHEN** state with active subscription is exited
- **THEN** `unsubscribe()` is called on the subscription
