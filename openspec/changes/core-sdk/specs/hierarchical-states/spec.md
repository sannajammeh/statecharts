## ADDED Requirements

### Requirement: State nodes support nested states
State nodes MAY include `states` property containing child state nodes.

#### Scenario: Nested states defined
- **WHEN** state has `states: { idle: {}, loading: {} }`
- **THEN** child states are accessible within parent

### Requirement: Nested states require initial
When a state node has `states`, it MUST also have `initial` specifying the default child state.

#### Scenario: Initial child entered
- **WHEN** parent state has `initial: 'idle'` and `states: { idle: {}, active: {} }`
- **THEN** entering parent also enters `idle` child

### Requirement: State value represents hierarchy
For nested states, `state.value` SHALL be an object representing the state hierarchy.

#### Scenario: Nested state value
- **WHEN** machine is in parent `auth` with child `signedOut` with grandchild `idle`
- **THEN** `state.value` is `{ auth: { signedOut: 'idle' } }`

### Requirement: Path array for nested states
`state.path` SHALL contain the full path from root to current leaf state.

#### Scenario: Path reflects hierarchy
- **WHEN** machine is in `auth.signedOut.idle`
- **THEN** `state.path` is `['auth', 'signedOut', 'idle']`

### Requirement: Child transitions bubble to parent
If a child state doesn't handle an event, the parent state's handlers SHALL be checked.

#### Scenario: Event bubbles up
- **WHEN** child has no handler for `LOGOUT` but parent does
- **THEN** parent's `LOGOUT` handler is invoked

### Requirement: Absolute references with hash notation
Transitions MAY target states absolutely using `#chartId.statePath` format.

#### Scenario: Jump across hierarchy
- **WHEN** deeply nested state transitions to `#auth.signedIn`
- **THEN** machine jumps directly to `signedIn` regardless of current depth
