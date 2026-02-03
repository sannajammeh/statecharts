## ADDED Requirements

### Requirement: Raise Element
A raise element SHALL be an object with `$type: "raise"` for generating internal events.

#### Scenario: Raise internal event
- **WHEN** raising an internal event "internal.done"
- **THEN** the output SHALL be `{ "$type": "raise", "event": "internal.done" }`

### Requirement: Send Element
A send element SHALL be an object with `$type: "send"` for delivering events to external entities.

#### Scenario: Send with target
- **WHEN** sending event "notify" to parent
- **THEN** the output SHALL be `{ "$type": "send", "event": "notify", "target": "#_parent" }`

#### Scenario: Send with delay
- **WHEN** sending a delayed event
- **THEN** the output SHALL include `"delay": "<duration>"` (e.g., "1s", "500ms")

#### Scenario: Send with id
- **WHEN** sending a cancellable event
- **THEN** the output SHALL include `"id": "<sendId>"` for later cancellation

#### Scenario: Send with parameters
- **WHEN** sending event with data
- **THEN** the output SHALL include param children `{ "$type": "param", "name": "key", "expr": "value" }`

### Requirement: Cancel Element
A cancel element SHALL be an object with `$type: "cancel"` for cancelling pending send events.

#### Scenario: Cancel by sendid
- **WHEN** cancelling a pending send with id "notify1"
- **THEN** the output SHALL be `{ "$type": "cancel", "sendid": "notify1" }`

### Requirement: Log Element
A log element SHALL be an object with `$type: "log"` for debug/logging output.

#### Scenario: Log with label and expression
- **WHEN** logging with label "debug" and expression "context.value"
- **THEN** the output SHALL be `{ "$type": "log", "label": "debug", "expr": "context.value" }`

### Requirement: If Element
An if element SHALL be an object with `$type: "if"` for conditional execution.

#### Scenario: Simple if condition
- **WHEN** conditionally executing code when `x > 0`
- **THEN** the output SHALL be `{ "$type": "if", "cond": "x > 0", "children": [...] }`

### Requirement: Elseif Element
An elseif element SHALL be an object with `$type: "elseif"` for additional conditions.

#### Scenario: Elseif condition
- **WHEN** adding an else-if branch for `x < 0`
- **THEN** the output SHALL be `{ "$type": "elseif", "cond": "x < 0", "children": [...] }`

### Requirement: Else Element
An else element SHALL be an object with `$type: "else"` for fallback execution.

#### Scenario: Else fallback
- **WHEN** adding a fallback branch
- **THEN** the output SHALL be `{ "$type": "else", "children": [...] }`

### Requirement: Foreach Element
A foreach element SHALL be an object with `$type: "foreach"` for iteration.

#### Scenario: Iterate over array
- **WHEN** iterating over items in `myArray`
- **THEN** the output SHALL be `{ "$type": "foreach", "array": "myArray", "item": "item", "index": "i", "children": [...] }`
