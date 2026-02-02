## ADDED Requirements

### Requirement: chart() creates a statechart definition
The `chart()` function SHALL accept a definition object and return a `Chart` instance.

#### Scenario: Create basic chart
- **WHEN** user calls `chart({ context, initial, states })`
- **THEN** a Chart object is returned with `definition`, `start()`, and `export()` methods

### Requirement: Definition requires context
The chart definition SHALL include a `context` property defining the initial context value and type.

#### Scenario: Context provides initial state
- **WHEN** chart is defined with `context: { count: 0 }`
- **THEN** started instances have `state.context.count` equal to `0`

### Requirement: Definition requires initial state
The chart definition SHALL include an `initial` property specifying which state to enter on start.

#### Scenario: Initial state is entered
- **WHEN** chart is defined with `initial: 'idle'`
- **THEN** started instance's `state.value` equals `'idle'`

### Requirement: Definition requires states map
The chart definition SHALL include a `states` object mapping state names to state node configurations.

#### Scenario: States are accessible
- **WHEN** chart is defined with `states: { idle: {}, active: {} }`
- **THEN** chart can transition between `idle` and `active`

### Requirement: Optional id for chart
The chart definition MAY include an `id` property for identification in exports and `#id` references.

#### Scenario: Chart with id
- **WHEN** chart is defined with `id: 'myChart'`
- **THEN** export includes `id: 'myChart'`

### Requirement: Optional events type hint
The chart definition MAY include an `events` property to provide explicit event type definitions.

#### Scenario: Events type hint
- **WHEN** chart includes `events: {} as { type: 'TOGGLE' } | { type: 'SET'; value: number }`
- **THEN** TypeScript infers correct event payload types

### Requirement: Package uses isolated declarations
The package SHALL use `isolatedDeclarations: true` in tsconfig, requiring explicit type annotations on all exports.

#### Scenario: Explicit type annotations
- **WHEN** building the package
- **THEN** all exported functions and types have explicit return type annotations
- **THEN** .d.ts files can be generated without full type-checking
