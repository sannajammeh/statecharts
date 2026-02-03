## ADDED Requirements

### Requirement: Datamodel Element
A datamodel element SHALL be an object with `$type: "datamodel"` containing data declarations.

#### Scenario: Datamodel with data items
- **WHEN** exporting a chart with context `{ count: 0, name: "test" }`
- **THEN** the root SHALL include `{ "$type": "datamodel", "children": [{ "$type": "data", "id": "count", "expr": "0" }, { "$type": "data", "id": "name", "expr": "\"test\"" }] }`

### Requirement: Data Element
A data element SHALL be an object with `$type: "data"` representing a data item declaration.

#### Scenario: Data with expression value
- **WHEN** exporting a data item with initial value
- **THEN** the output SHALL be `{ "$type": "data", "id": "varName", "expr": "<expression>" }`

#### Scenario: Data with inline content
- **WHEN** exporting a data item with complex object value
- **THEN** the output MAY use `{ "$type": "data", "id": "varName", "children": [{ "$type": "content", ... }] }`

### Requirement: Assign Element
An assign element SHALL be an object with `$type: "assign"` for modifying data model values.

#### Scenario: Assign with expression
- **WHEN** assigning a new value to a data item
- **THEN** the output SHALL be `{ "$type": "assign", "location": "varName", "expr": "<expression>" }`

#### Scenario: Assign with inline content
- **WHEN** assigning a complex object value
- **THEN** the output MAY use `{ "$type": "assign", "location": "varName", "children": [{ "$type": "content", ... }] }`

### Requirement: Script Element
A script element SHALL be an object with `$type: "script"` for inline ECMAScript code.

#### Scenario: Inline script
- **WHEN** exporting inline script code
- **THEN** the output SHALL be `{ "$type": "script", "$text": "<code>" }`

### Requirement: ECMAScript Data Model
The SCJSON export SHALL use the ECMAScript data model semantics.

#### Scenario: Expression syntax
- **WHEN** serializing expressions for guards and assignments
- **THEN** expressions SHALL use ECMAScript/JavaScript syntax

#### Scenario: Context access
- **WHEN** referencing context data in expressions
- **THEN** expressions SHALL reference data items by their id (e.g., `count + 1`)
