## ADDED Requirements

### Requirement: Snapshot includes value
StateSnapshot SHALL include `value` property representing current state.

#### Scenario: Flat state value
- **WHEN** machine is in `idle` state (no nesting)
- **THEN** `state.value` equals `'idle'`

#### Scenario: Nested state value
- **WHEN** machine is in nested `auth.signedOut`
- **THEN** `state.value` is `{ auth: 'signedOut' }` or deeper object

### Requirement: Snapshot includes context
StateSnapshot SHALL include `context` property with current context (readonly).

#### Scenario: Context accessible
- **WHEN** context is `{ count: 5 }`
- **THEN** `state.context.count` equals `5`

### Requirement: Snapshot includes done flag
StateSnapshot SHALL include `done` boolean indicating if current state is final.

#### Scenario: Done when final
- **WHEN** current state has `final: true`
- **THEN** `state.done` equals `true`

#### Scenario: Not done when not final
- **WHEN** current state does not have `final: true`
- **THEN** `state.done` equals `false`

### Requirement: Snapshot includes path array
StateSnapshot SHALL include `path` array with state names from root to leaf.

#### Scenario: Path for nested state
- **WHEN** machine is in `auth.signedOut.idle`
- **THEN** `state.path` equals `['auth', 'signedOut', 'idle']`

### Requirement: matches() checks state membership
StateSnapshot SHALL include `matches()` method that returns true if currently in given state.

#### Scenario: Matches exact state
- **WHEN** machine is in `idle`
- **THEN** `state.matches('idle')` equals `true`

#### Scenario: Matches dot-path for nested
- **WHEN** machine is in `auth.signedOut`
- **THEN** `state.matches('auth.signedOut')` equals `true`
- **THEN** `state.matches('auth')` equals `true` (partial match)

### Requirement: Snapshot includes timestamp
StateSnapshot SHALL include `timestamp` number indicating when last transition occurred.

#### Scenario: Timestamp updated on transition
- **WHEN** transition occurs
- **THEN** `state.timestamp` reflects approximate time of transition
