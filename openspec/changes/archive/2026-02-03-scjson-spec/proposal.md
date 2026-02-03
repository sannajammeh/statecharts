## Why

The current `schema.json` export format is custom and not aligned with any standard. Translating the W3C SCXML specification to a JSON-compatible format (SCJSON) enables interoperability with existing state machine tooling, visual editors, and provides a well-documented, complete feature set for statecharts.

## What Changes

- New SCJSON schema based on W3C SCXML spec translated to JSON
- **BREAKING**: `chart.export()` will output SCJSON format instead of current custom format
- Support for SCXML elements: `scxml`, `state`, `parallel`, `final`, `transition`, `history`, `initial`
- Support for data model elements: `datamodel`, `data`, `assign`
- Support for executable content: `raise`, `send`, `cancel`, `log`, `if`/`elseif`/`else`, `foreach`
- Support for invocation: `invoke`, `finalize`, `content`, `param`
- Support for entry/exit handlers: `onentry`, `onexit`, `donedata`
- System variables: `_event`, `_sessionid`, `_name`

## Capabilities

### New Capabilities

- `scjson-schema`: JSON Schema definition for SCJSON format - the complete type definitions and validation rules for the JSON translation of SCXML
- `scjson-elements`: Core state elements (scxml, state, parallel, final, transition, history, initial) translated to JSON structure
- `scjson-datamodel`: Data model support (datamodel, data, assign, script) in JSON format
- `scjson-actions`: Executable content (raise, send, cancel, log, conditionals, foreach) as JSON
- `scjson-invoke`: Service invocation (invoke, finalize, content, param, donedata) in JSON
- `scjson-export`: The `chart.export()` method producing SCJSON-compliant output

### Modified Capabilities

None - this is a new format alongside the existing schema.

## Impact

- `packages/core/schema.json` - New SCJSON schema file (keep existing as `schema-legacy.json`)
- `packages/core/src/chart.ts` - `export()` method updated to produce SCJSON
- `packages/core/src/types.ts` - New TypeScript types for SCJSON structures
- `packages/core/src/__tests__/` - New tests for SCJSON export validation
- Documentation updates for the new export format
