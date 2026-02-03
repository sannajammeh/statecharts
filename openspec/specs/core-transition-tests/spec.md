## Requirements

### Requirement: String shorthand transitions
The test suite SHALL verify string shorthand resolves to target state.

#### Scenario: String target
- **WHEN** `resolveTransition("active", context, event)` is called
- **THEN** result has `target: "active"` and empty `actions` array

### Requirement: Guard evaluation
The test suite SHALL verify guards control transition execution.

#### Scenario: Guard passes
- **WHEN** `resolveTransition({ target: "next", guard: () => true }, ...)` is called
- **THEN** result has `target: "next"`

#### Scenario: Guard fails
- **WHEN** `resolveTransition({ target: "next", guard: () => false }, ...)` is called
- **THEN** result is `null`

#### Scenario: Guard receives context and event
- **WHEN** guard function is called
- **THEN** guard receives `(context, event)` arguments

### Requirement: Action attachment
The test suite SHALL verify actions are included in resolved transition.

#### Scenario: Single action
- **WHEN** `resolveTransition({ target: "next", action: fn }, ...)` is called
- **THEN** result has `actions` array containing `fn`

#### Scenario: No action
- **WHEN** transition config has no action
- **THEN** result has empty `actions` array

### Requirement: Array transitions (first match)
The test suite SHALL verify array configs use first matching transition.

#### Scenario: First guard passes
- **WHEN** `resolveTransition([{ target: "a", guard: () => true }, { target: "b" }], ...)` is called
- **THEN** result has `target: "a"`

#### Scenario: First guard fails
- **WHEN** `resolveTransition([{ target: "a", guard: () => false }, { target: "b" }], ...)` is called
- **THEN** result has `target: "b"`

#### Scenario: All guards fail
- **WHEN** all array items have guards that return false
- **THEN** result is `null`

### Requirement: Targetless transitions
The test suite SHALL verify transitions without target.

#### Scenario: Action-only transition
- **WHEN** `resolveTransition({ action: fn }, ...)` is called
- **THEN** result has `target: undefined` and action in `actions`
