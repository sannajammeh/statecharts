## ADDED Requirements

### Requirement: chart.export() returns JSON-serializable object
`export()` SHALL return an ExportedChart object that can be passed to `JSON.stringify()`.

#### Scenario: Export is serializable
- **WHEN** `JSON.stringify(chart.export())`
- **THEN** no errors, produces valid JSON string

### Requirement: Export includes version
ExportedChart SHALL include `version: 1` for forward compatibility.

#### Scenario: Version present
- **WHEN** `chart.export()`
- **THEN** result includes `version: 1`

### Requirement: Export includes id
ExportedChart SHALL include `id` from chart definition (or generated if not provided).

#### Scenario: Id from definition
- **WHEN** chart has `id: 'myChart'`
- **THEN** export includes `id: 'myChart'`

### Requirement: Export includes initial state
ExportedChart SHALL include `initial` property with initial state name.

#### Scenario: Initial in export
- **WHEN** chart has `initial: 'idle'`
- **THEN** export includes `initial: 'idle'`

### Requirement: Export includes context snapshot
ExportedChart SHALL include `context` with the initial context value.

#### Scenario: Context in export
- **WHEN** chart has `context: { count: 0 }`
- **THEN** export includes `context: { count: 0 }`

### Requirement: Export includes states structure
ExportedChart SHALL include `states` object mirroring the state tree structure.

#### Scenario: States structure preserved
- **WHEN** chart has states `idle`, `active` with nested children
- **THEN** export includes full state hierarchy

### Requirement: Functions serialized as names or null
Guard, action, and invoke functions SHALL be serialized as function names or `null` for anonymous.

#### Scenario: Named function
- **WHEN** action is `function increment(ctx) { ... }`
- **THEN** export shows `actions: ['increment']`

#### Scenario: Anonymous function
- **WHEN** action is `(ctx) => ({ count: ctx.count + 1 })`
- **THEN** export shows `actions: ['anonymous']` or similar

### Requirement: Export includes transition details
Exported transitions SHALL include `target`, `guard` (name or null), and `actions` (array of names).

#### Scenario: Transition export
- **WHEN** transition is `{ target: 'active', guard: isValid, action: increment }`
- **THEN** export shows `{ target: 'active', guard: 'isValid', actions: ['increment'] }`
