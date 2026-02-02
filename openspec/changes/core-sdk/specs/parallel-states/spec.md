## ADDED Requirements

### Requirement: State nodes support parallel regions
State nodes MAY include `parallel` property defining orthogonal regions that run concurrently.

#### Scenario: Parallel regions defined
- **WHEN** state has `parallel: { regionA: { initial, states }, regionB: { initial, states } }`
- **THEN** both regions are active simultaneously

### Requirement: Parallel regions each have initial and states
Each region in `parallel` SHALL have `initial` and `states` properties.

#### Scenario: Region structure
- **WHEN** parallel region is `{ initial: 'on', states: { on: {}, off: {} } }`
- **THEN** region starts in `on` state

### Requirement: State value includes all parallel regions
For parallel states, `state.value` SHALL be an object with keys for each active region.

#### Scenario: Parallel state value
- **WHEN** machine is in parallel state with `playback: 'running'` and `volume: 'muted'`
- **THEN** `state.value` includes both `{ playback: 'running', volume: 'muted' }`

### Requirement: Events sent to all parallel regions
When an event is received, it SHALL be processed by all active parallel regions.

#### Scenario: Event to multiple regions
- **WHEN** event `TOGGLE` is sent and both regions have handlers for it
- **THEN** both regions process the event independently

### Requirement: Exiting parallel state exits all regions
When transitioning out of a parallel state, all regions SHALL execute their exit actions.

#### Scenario: Parallel exit
- **WHEN** machine transitions from parallel state to sibling state
- **THEN** exit actions of all active region states are executed
