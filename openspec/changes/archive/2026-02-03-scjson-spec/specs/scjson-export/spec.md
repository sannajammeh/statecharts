## ADDED Requirements

### Requirement: Export Method Returns SCJSON
The `chart.export()` method SHALL return a SCJSON-compliant document.

#### Scenario: Export produces valid SCJSON
- **WHEN** calling `chart.export()` on any valid chart
- **THEN** the output SHALL be a valid SCJSON document with `$type: "scxml"` root

#### Scenario: Export is JSON serializable
- **WHEN** calling `JSON.stringify(chart.export())`
- **THEN** the output SHALL be valid JSON

### Requirement: Legacy Export Method
The system SHALL provide `chart.exportLegacy()` for backwards compatibility.

#### Scenario: Legacy export produces old format
- **WHEN** calling `chart.exportLegacy()`
- **THEN** the output SHALL match the current `ExportedChart` format with `version: 1`

### Requirement: Chart ID Mapping
The chart id SHALL map to the SCXML name attribute.

#### Scenario: Chart id to SCXML name
- **WHEN** exporting a chart with `id: "myChart"`
- **THEN** the root element SHALL include `"name": "myChart"`

### Requirement: Initial State Mapping
The chart initial state SHALL map to the SCXML initial attribute.

#### Scenario: Initial state
- **WHEN** exporting a chart with `initial: "idle"`
- **THEN** the root element SHALL include `"initial": "idle"`

### Requirement: Context to Datamodel Mapping
The chart context SHALL map to SCXML datamodel elements.

#### Scenario: Context values as data items
- **WHEN** exporting a chart with context `{ count: 0 }`
- **THEN** the root SHALL contain a datamodel child with data elements for each context property

### Requirement: State Hierarchy Preservation
The export SHALL preserve the full state hierarchy.

#### Scenario: Nested states
- **WHEN** exporting a chart with nested states
- **THEN** child states SHALL appear in parent state's children array

### Requirement: Transition Mapping
State transitions SHALL map to SCXML transition elements.

#### Scenario: Event transitions
- **WHEN** exporting a state with `on: { CLICK: "clicked" }`
- **THEN** the state SHALL contain `{ "$type": "transition", "event": "CLICK", "target": "clicked" }`

### Requirement: Guard Expression Serialization
Guard functions SHALL be serialized as condition expressions.

#### Scenario: Named guard function
- **WHEN** exporting a transition with guard function named `isValid`
- **THEN** the transition SHALL include `"cond": "isValid(context, event)"`

### Requirement: Action Expression Serialization
Action functions SHALL be serialized as executable content.

#### Scenario: Named action function
- **WHEN** exporting a transition with action function named `logEvent`
- **THEN** the transition children SHALL include executable content referencing `logEvent`

### Requirement: Delayed Transition Mapping
The `after` delays SHALL map to SCXML send/transition patterns.

#### Scenario: Delayed transition
- **WHEN** exporting a state with `after: { 1000: "timeout" }`
- **THEN** the state SHALL include onentry with delayed send and transition on the delayed event

### Requirement: Parallel State Mapping
Parallel regions SHALL map to SCXML parallel elements.

#### Scenario: Parallel state
- **WHEN** exporting a state with parallel regions
- **THEN** the state SHALL be `{ "$type": "parallel", ... }` with region states as children

### Requirement: Final State Mapping
States marked as final SHALL map to SCXML final elements.

#### Scenario: Final state
- **WHEN** exporting a state with `final: true`
- **THEN** the output SHALL be `{ "$type": "final", "id": "<stateName>" }`
