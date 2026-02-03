## ADDED Requirements

### Requirement: Instance creation with initial state
The test suite SHALL verify that `createInstance()` initializes the state machine with the correct initial state.

#### Scenario: Simple initial state
- **WHEN** `createInstance()` is called with a chart having `initial: "idle"`
- **THEN** `instance.state.value` equals `"idle"`

#### Scenario: Nested initial state
- **WHEN** `createInstance()` is called with a chart having nested states with initial
- **THEN** `instance.state.path` includes all nested initial states

#### Scenario: Initial context override
- **WHEN** `createInstance()` is called with `initialContextOverride`
- **THEN** `instance.state.context` contains merged override values

### Requirement: Event sending and transitions
The test suite SHALL verify that `send()` triggers transitions and updates state.

#### Scenario: Simple transition
- **WHEN** `instance.send("START")` is called on a machine in "idle" state
- **THEN** `instance.state.value` changes to the target state

#### Scenario: Event with payload
- **WHEN** `instance.send({ type: "UPDATE", value: 42 })` is called
- **THEN** transition actions receive the full event object

#### Scenario: Unknown event ignored
- **WHEN** `instance.send("UNKNOWN")` is called with no matching handler
- **THEN** state remains unchanged

### Requirement: Entry and exit actions
The test suite SHALL verify entry/exit actions execute during transitions.

#### Scenario: Entry action on initial
- **WHEN** `createInstance()` is called
- **THEN** entry action of initial state executes

#### Scenario: Exit action on transition
- **WHEN** a transition leaves a state with exit action
- **THEN** exit action executes before entering new state

#### Scenario: Action context updates
- **WHEN** an action returns a partial context
- **THEN** context is updated with returned values

### Requirement: Subscription notifications
The test suite SHALL verify subscribers are notified of state changes.

#### Scenario: Subscribe receives updates
- **WHEN** `instance.subscribe(listener)` is called and state changes
- **THEN** listener is called with new snapshot

#### Scenario: Unsubscribe stops notifications
- **WHEN** the unsubscribe function is called
- **THEN** listener is no longer called on state changes

### Requirement: Instance stop behavior
The test suite SHALL verify `stop()` halts the instance.

#### Scenario: Stop prevents further transitions
- **WHEN** `instance.stop()` is called then `instance.send("EVENT")` is called
- **THEN** state does not change

#### Scenario: Stop clears timers
- **WHEN** `instance.stop()` is called during a delayed transition
- **THEN** the delayed transition does not execute

### Requirement: Final state detection
The test suite SHALL verify final states are correctly identified.

#### Scenario: Done flag on final state
- **WHEN** machine transitions to a state with `final: true`
- **THEN** `instance.state.done` equals `true`
