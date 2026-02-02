## ADDED Requirements

### Requirement: String shorthand for target-only transitions
A transition MAY be specified as a string, interpreted as the target state name.

#### Scenario: String transition
- **WHEN** state has `on: { CLICK: 'active' }`
- **THEN** CLICK event transitions to `active` state

### Requirement: Object form with target
A transition MAY be an object with optional `target` property.

#### Scenario: Object with target
- **WHEN** state has `on: { CLICK: { target: 'active' } }`
- **THEN** CLICK event transitions to `active` state

### Requirement: Transitions support guards
Transition objects MAY include a `guard` function that must return true for the transition to occur.

#### Scenario: Guard allows transition
- **WHEN** transition has `guard: (ctx) => ctx.valid` and `ctx.valid` is `true`
- **THEN** transition proceeds

#### Scenario: Guard blocks transition
- **WHEN** transition has `guard: (ctx) => ctx.valid` and `ctx.valid` is `false`
- **THEN** transition does not occur, state unchanged

### Requirement: Transitions support actions
Transition objects MAY include an `action` property executed when the transition occurs.

#### Scenario: Transition action executes
- **WHEN** transition has `action: (ctx) => ({ clicked: true })` and transition occurs
- **THEN** context updated with `clicked: true`

### Requirement: Array transitions use first-match semantics
When a transition is an array, the first transition whose guard passes (or has no guard) SHALL be taken.

#### Scenario: First matching transition wins
- **WHEN** transition is `[{ target: 'a', guard: () => false }, { target: 'b' }]`
- **THEN** transition goes to `b` (first match without failing guard)

### Requirement: Absolute target references with hash
Transition targets MAY use `#id.state` format to reference states absolutely by chart id.

#### Scenario: Absolute reference
- **WHEN** chart has `id: 'auth'` and transition targets `#auth.signedIn`
- **THEN** transition goes to `signedIn` state regardless of nesting depth

### Requirement: Self-transitions without target
A transition object without `target` SHALL be a self-transition (re-enters current state).

#### Scenario: Self-transition
- **WHEN** transition is `{ action: (ctx) => ({ count: ctx.count + 1 }) }` with no target
- **THEN** state unchanged but action executes
