## ADDED Requirements

### Requirement: State nodes support delayed transitions
State nodes MAY include `after` property mapping millisecond delays to transitions.

#### Scenario: Delayed transition defined
- **WHEN** state has `after: { 3000: 'timeout' }`
- **THEN** after 3000ms in the state, machine transitions to `timeout`

### Requirement: Delayed transitions cancelled on exit
If the state is exited before the delay, the delayed transition SHALL be cancelled.

#### Scenario: Early exit cancels delay
- **WHEN** state with `after: { 5000: 'timeout' }` is exited after 2000ms
- **THEN** the timeout transition never fires

### Requirement: Multiple delays supported
`after` MAY contain multiple delay entries, each independently scheduled.

#### Scenario: Multiple delays
- **WHEN** state has `after: { 1000: 'warning', 5000: 'error' }`
- **THEN** warning fires at 1000ms, error at 5000ms (if still in state)

### Requirement: Delayed transitions support full transition config
`after` values MAY be string targets or full transition objects with guards and actions.

#### Scenario: Delayed transition with guard
- **WHEN** state has `after: { 3000: { target: 'timeout', guard: (ctx) => ctx.canTimeout } }`
- **THEN** transition only occurs if guard passes at delay time

### Requirement: Timers use setTimeout
Delayed transitions SHALL use `setTimeout` for scheduling.

#### Scenario: Timer precision
- **WHEN** state has `after: { 100: 'next' }`
- **THEN** transition occurs approximately 100ms after entering state
