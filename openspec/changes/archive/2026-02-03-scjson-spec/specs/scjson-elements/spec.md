## ADDED Requirements

### Requirement: SCXML Root Element
The SCJSON document root SHALL be an object with `$type: "scxml"` containing required and optional attributes.

#### Scenario: Minimal SCXML root
- **WHEN** exporting a chart with id "myChart" and initial state "idle"
- **THEN** the output SHALL be `{ "$type": "scxml", "version": "1.0", "name": "myChart", "initial": "idle", "children": [...] }`

#### Scenario: SCXML with datamodel
- **WHEN** exporting a chart with context data
- **THEN** the root SHALL include `"datamodel": "ecmascript"`

### Requirement: State Element
A state element SHALL be an object with `$type: "state"` containing id and optional initial, children.

#### Scenario: Atomic state
- **WHEN** exporting an atomic state "loading"
- **THEN** the output SHALL be `{ "$type": "state", "id": "loading", "children": [...] }`

#### Scenario: Compound state with initial
- **WHEN** exporting a compound state "form" with initial child "editing"
- **THEN** the output SHALL include `"initial": "editing"` and child states in `children`

### Requirement: Parallel Element
A parallel element SHALL be an object with `$type: "parallel"` representing orthogonal regions.

#### Scenario: Parallel state
- **WHEN** exporting a parallel state with regions "timer" and "mode"
- **THEN** the output SHALL be `{ "$type": "parallel", "id": "running", "children": [{ "$type": "state", "id": "timer", ... }, { "$type": "state", "id": "mode", ... }] }`

### Requirement: Final Element
A final element SHALL be an object with `$type: "final"` representing a terminal state.

#### Scenario: Final state
- **WHEN** exporting a final state "completed"
- **THEN** the output SHALL be `{ "$type": "final", "id": "completed" }`

#### Scenario: Final state with donedata
- **WHEN** exporting a final state that returns data
- **THEN** the output SHALL include a `donedata` child element

### Requirement: Transition Element
A transition element SHALL be an object with `$type: "transition"` containing event, target, and optional cond.

#### Scenario: Simple transition
- **WHEN** exporting a transition on event "SUBMIT" to target "submitted"
- **THEN** the output SHALL be `{ "$type": "transition", "event": "SUBMIT", "target": "submitted" }`

#### Scenario: Guarded transition
- **WHEN** exporting a transition with a guard condition
- **THEN** the output SHALL include `"cond": "<expression>"`

#### Scenario: Internal transition
- **WHEN** exporting an internal transition (no state exit/entry)
- **THEN** the output SHALL include `"type": "internal"`

### Requirement: History Element
A history element SHALL be an object with `$type: "history"` for state history tracking.

#### Scenario: Shallow history
- **WHEN** exporting a shallow history pseudo-state
- **THEN** the output SHALL be `{ "$type": "history", "id": "hist", "type": "shallow" }`

#### Scenario: Deep history
- **WHEN** exporting a deep history pseudo-state
- **THEN** the output SHALL include `"type": "deep"`

### Requirement: Initial Element
An initial element SHALL be an object with `$type: "initial"` for explicit initial transition.

#### Scenario: Initial with transition
- **WHEN** a compound state has an explicit initial element
- **THEN** the output SHALL be `{ "$type": "initial", "children": [{ "$type": "transition", "target": "childState" }] }`

### Requirement: Onentry Element
An onentry element SHALL be an object with `$type: "onentry"` containing executable content.

#### Scenario: State with entry actions
- **WHEN** exporting a state with entry actions
- **THEN** the state's children SHALL include `{ "$type": "onentry", "children": [...] }`

### Requirement: Onexit Element
An onexit element SHALL be an object with `$type: "onexit"` containing executable content.

#### Scenario: State with exit actions
- **WHEN** exporting a state with exit actions
- **THEN** the state's children SHALL include `{ "$type": "onexit", "children": [...] }`
