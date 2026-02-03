## ADDED Requirements

### Requirement: Snapshot construction
The test suite SHALL verify StateSnapshot initializes with correct properties.

#### Scenario: All properties set
- **WHEN** `new StateSnapshot(value, context, done, path)` is created
- **THEN** snapshot has `value`, `context`, `done`, `path`, and `timestamp` properties

#### Scenario: Context is frozen
- **WHEN** snapshot is created
- **THEN** `snapshot.context` is immutable (Object.isFrozen)

#### Scenario: Path is frozen
- **WHEN** snapshot is created
- **THEN** `snapshot.path` is immutable (Object.isFrozen)

#### Scenario: Timestamp defaults to now
- **WHEN** snapshot is created without timestamp argument
- **THEN** `snapshot.timestamp` is approximately `Date.now()`

### Requirement: State matching
The test suite SHALL verify `matches()` correctly identifies state membership.

#### Scenario: Flat state matches
- **WHEN** `snapshot.matches("idle")` is called on snapshot with `value: "idle"`
- **THEN** result is `true`

#### Scenario: Flat state mismatch
- **WHEN** `snapshot.matches("active")` is called on snapshot with `value: "idle"`
- **THEN** result is `false`

#### Scenario: Nested state matches partial
- **WHEN** `snapshot.matches("parent.child")` is called with path `["parent", "child"]`
- **THEN** result is `true`

#### Scenario: Nested state matches parent
- **WHEN** `snapshot.matches("parent")` is called with path `["parent", "child"]`
- **THEN** result is `true`

#### Scenario: Nested state mismatch
- **WHEN** `snapshot.matches("other.child")` is called with path `["parent", "child"]`
- **THEN** result is `false`
