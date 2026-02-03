## ADDED Requirements

### Requirement: Invoke Element
An invoke element SHALL be an object with `$type: "invoke"` for invoking external services.

#### Scenario: Invoke with type and src
- **WHEN** invoking an external service
- **THEN** the output SHALL be `{ "$type": "invoke", "type": "http://www.w3.org/TR/scxml/", "src": "<uri>", "id": "<invokeid>" }`

#### Scenario: Invoke with autoforward
- **WHEN** invoking with event forwarding enabled
- **THEN** the output SHALL include `"autoforward": true`

### Requirement: Finalize Element
A finalize element SHALL be an object with `$type: "finalize"` for cleanup after invocation events.

#### Scenario: Finalize with actions
- **WHEN** processing events from an invoked service
- **THEN** the invoke SHALL include `{ "$type": "finalize", "children": [...] }` with executable content

### Requirement: Content Element
A content element SHALL be an object with `$type: "content"` for communication data.

#### Scenario: Content with expression
- **WHEN** sending dynamic content
- **THEN** the output SHALL be `{ "$type": "content", "expr": "<expression>" }`

#### Scenario: Content with inline data
- **WHEN** sending static content
- **THEN** the output SHALL be `{ "$type": "content", "$text": "<data>" }`

### Requirement: Param Element
A param element SHALL be an object with `$type: "param"` for key-value data passing.

#### Scenario: Param with expression
- **WHEN** passing a parameter with dynamic value
- **THEN** the output SHALL be `{ "$type": "param", "name": "key", "expr": "<expression>" }`

#### Scenario: Param with location
- **WHEN** passing a parameter by reference
- **THEN** the output SHALL be `{ "$type": "param", "name": "key", "location": "<dataLocation>" }`

### Requirement: Donedata Element
A donedata element SHALL be an object with `$type: "donedata"` for data returned from final states.

#### Scenario: Donedata with content
- **WHEN** a final state returns structured data
- **THEN** the output SHALL be `{ "$type": "donedata", "children": [{ "$type": "content", ... }] }`

#### Scenario: Donedata with params
- **WHEN** a final state returns named parameters
- **THEN** the output SHALL be `{ "$type": "donedata", "children": [{ "$type": "param", ... }, ...] }`

### Requirement: OnDone Transition
The system SHALL translate `onDone` handlers to transitions on `done.invoke.<id>` events.

#### Scenario: Invoke completion handler
- **WHEN** exporting a state with invoke.onDone
- **THEN** the state SHALL include `{ "$type": "transition", "event": "done.invoke.<id>", "target": "<targetState>" }`

### Requirement: OnError Transition
The system SHALL translate `onError` handlers to transitions on `error.execution` events.

#### Scenario: Invoke error handler
- **WHEN** exporting a state with invoke.onError
- **THEN** the state SHALL include `{ "$type": "transition", "event": "error.execution", "target": "<errorState>" }`
