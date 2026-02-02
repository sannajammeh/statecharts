## ADDED Requirements

### Requirement: State nodes support entry actions
State nodes MAY include an `entry` property with actions executed when entering the state.

#### Scenario: Entry action fires on enter
- **WHEN** machine transitions to state with `entry: (ctx) => ({ entered: true })`
- **THEN** context is updated with `entered: true`

### Requirement: State nodes support exit actions
State nodes MAY include an `exit` property with actions executed when leaving the state.

#### Scenario: Exit action fires on leave
- **WHEN** machine transitions away from state with `exit: (ctx) => ({ exited: true })`
- **THEN** context is updated with `exited: true`

### Requirement: State nodes support event handlers
State nodes MAY include an `on` property mapping event types to transitions.

#### Scenario: Event triggers transition
- **WHEN** state has `on: { TOGGLE: 'other' }` and receives `TOGGLE` event
- **THEN** machine transitions to `other` state

### Requirement: State nodes support final flag
State nodes MAY include `final: true` to mark terminal states.

#### Scenario: Final state sets done flag
- **WHEN** machine enters state with `final: true`
- **THEN** `state.done` equals `true`

### Requirement: Actions return partial context updates
Actions SHALL return a partial context object that gets shallow-merged, or undefined for no update.

#### Scenario: Partial update merges
- **WHEN** action returns `{ count: 5 }` and context has `{ count: 0, name: 'test' }`
- **THEN** new context is `{ count: 5, name: 'test' }`

#### Scenario: Undefined return preserves context
- **WHEN** action returns `undefined` (e.g., side-effect only)
- **THEN** context remains unchanged

### Requirement: Multiple actions execute in order
When `entry` or `exit` is an array of actions, they SHALL execute sequentially and each partial update merges.

#### Scenario: Action array execution
- **WHEN** entry is `[(ctx) => ({ a: 1 }), (ctx) => ({ b: 2 })]`
- **THEN** context has both `a: 1` and `b: 2` after entry
