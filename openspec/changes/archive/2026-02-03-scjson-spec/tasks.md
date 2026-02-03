## 1. TypeScript Types

- [x] 1.1 Create `packages/core/src/scjson-types.ts` with base `SCJSONElement` interface and `$type` discriminator
- [x] 1.2 Add SCXML root element type (`SCXMLElement`)
- [x] 1.3 Add state element types (`StateElement`, `ParallelElement`, `FinalElement`, `HistoryElement`, `InitialElement`)
- [x] 1.4 Add transition element type (`TransitionElement`)
- [x] 1.5 Add entry/exit types (`OnentryElement`, `OnexitElement`)
- [x] 1.6 Add datamodel types (`DatamodelElement`, `DataElement`, `AssignElement`, `ScriptElement`)
- [x] 1.7 Add action types (`RaiseElement`, `SendElement`, `CancelElement`, `LogElement`)
- [x] 1.8 Add conditional types (`IfElement`, `ElseifElement`, `ElseElement`, `ForeachElement`)
- [x] 1.9 Add invoke types (`InvokeElement`, `FinalizeElement`, `ContentElement`, `ParamElement`, `DonedataElement`)
- [x] 1.10 Create discriminated union type `SCJSONChild` for all element types
- [x] 1.11 Export types from `packages/core/src/index.ts`

## 2. JSON Schema

- [x] 2.1 Create `packages/core/scjson.schema.json` with base schema structure and `$type` discriminator
- [x] 2.2 Add SCXML root element definition with required fields (version, initial)
- [x] 2.3 Add state/parallel/final/history/initial element definitions
- [x] 2.4 Add transition element definition with event, cond, target, type
- [x] 2.5 Add datamodel/data/assign/script element definitions
- [x] 2.6 Add executable content element definitions (raise, send, cancel, log, if, foreach)
- [x] 2.7 Add invoke/finalize/content/param/donedata element definitions
- [x] 2.8 Add `children` array schemas with appropriate element type constraints

## 3. Export Implementation

- [x] 3.1 Create `packages/core/src/scjson-export.ts` with `exportSCJSON()` function
- [x] 3.2 Implement SCXML root element generation from ChartDefinition
- [x] 3.3 Implement datamodel generation from chart context
- [x] 3.4 Implement state element export (atomic and compound states)
- [x] 3.5 Implement parallel state export
- [x] 3.6 Implement final state export
- [x] 3.7 Implement transition export with event, cond, target mapping
- [x] 3.8 Implement onentry/onexit export from entry/exit actions
- [x] 3.9 Implement guard serialization as condition expressions
- [x] 3.10 Implement action serialization as executable content
- [x] 3.11 Implement delayed transition export (after → send + transition pattern)
- [x] 3.12 Implement invoke/onDone/onError export

## 4. API Changes

- [x] 4.1 Rename current `exportChart()` to `exportChartLegacy()` in `packages/core/src/export.ts`
- [x] 4.2 Update `Chart` interface to use new `export()` returning `SCJSONDocument`
- [x] 4.3 Add `exportLegacy()` method to Chart interface returning `ExportedChart`
- [x] 4.4 Update `chart.ts` to implement both export methods
- [x] 4.5 Rename `packages/core/schema.json` to `packages/core/schema-legacy.json`
- [x] 4.6 Update exports in `packages/core/src/index.ts`

## 5. Tests

- [x] 5.1 Create `packages/core/src/__tests__/scjson-export.test.ts`
- [x] 5.2 Add test for minimal chart export (id, initial, one state)
- [x] 5.3 Add test for compound state hierarchy export
- [x] 5.4 Add test for parallel state export
- [x] 5.5 Add test for final state export
- [x] 5.6 Add test for transitions with guards and actions
- [x] 5.7 Add test for delayed transitions
- [x] 5.8 Add test for invoke/onDone/onError export
- [x] 5.9 Add test for context → datamodel mapping
- [x] 5.10 Add JSON Schema validation test for exported documents
- [x] 5.11 Add test for `exportLegacy()` backwards compatibility
