## ADDED Requirements

### Requirement: Visualizer tracks current state
The `<Visualizer />` component SHALL maintain simulation state including current active state(s) and context.

#### Scenario: Initial state on mount
- **WHEN** Visualizer renders with chart JSON
- **THEN** simulation starts at chart's `initial` state
- **THEN** active state node is visually highlighted

#### Scenario: Parallel state tracking
- **WHEN** current state is a parallel state
- **THEN** all active region states are tracked and highlighted

### Requirement: Event panel shows available events
The Visualizer SHALL display a panel of events that can be triggered from current state.

#### Scenario: List available events
- **WHEN** current state is 'idle' with transitions `FETCH` and `RESET`
- **THEN** event panel shows clickable "FETCH" and "RESET" buttons

#### Scenario: No available events
- **WHEN** current state has no outgoing transitions (final state)
- **THEN** event panel shows "No available events"

### Requirement: Trigger event advances state
Clicking an event button SHALL trigger that event and transition to next state.

#### Scenario: Simple transition
- **WHEN** user clicks "FETCH" event in 'idle' state
- **THEN** simulation transitions to target state
- **THEN** new state is highlighted, old state unhighlighted

#### Scenario: Guarded transition display
- **WHEN** transition has guard
- **THEN** event button shows guard name: "FETCH [isValid]"
- **THEN** clicking always transitions (guards can't be evaluated)

### Requirement: History navigation
The Visualizer SHALL maintain state history for back/forward navigation.

#### Scenario: Step back
- **WHEN** user has transitioned idle → loading → success
- **WHEN** user clicks "Back" button
- **THEN** simulation returns to 'loading' state

#### Scenario: Step forward after back
- **WHEN** user stepped back to 'loading'
- **WHEN** user clicks "Forward" button
- **THEN** simulation returns to 'success' state

#### Scenario: New transition clears forward history
- **WHEN** user stepped back to 'loading'
- **WHEN** user triggers new event "CANCEL"
- **THEN** forward history is cleared

### Requirement: Reset to initial state
The Visualizer SHALL provide a reset button to return to initial state.

#### Scenario: Reset clears history
- **WHEN** user clicks "Reset" button
- **THEN** simulation returns to chart's initial state
- **THEN** history is cleared

### Requirement: Context display
The Visualizer SHALL display current context value.

#### Scenario: Show context
- **WHEN** chart has `context: { count: 0 }`
- **THEN** context panel displays `{ count: 0 }`

#### Scenario: Context after transition
- **WHEN** transition has action that would modify context
- **THEN** context panel shows action name but value unchanged (actions can't be evaluated)
