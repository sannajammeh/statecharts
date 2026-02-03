## Context

The current export format (`ExportedChart`) is a custom schema not aligned with any standard. The W3C SCXML specification defines a comprehensive XML-based state machine format used by many tools. Translating SCXML to JSON (SCJSON) enables:

- Interoperability with SCXML-compatible tooling
- Standard vocabulary for state machine concepts
- Visual editor compatibility (many editors support SCXML)

Current implementation in `packages/core/src/export.ts` produces a flat state structure with function names serialized as strings. SCJSON will introduce a more structured approach following SCXML semantics.

## Goals / Non-Goals

**Goals:**
- Define SCJSON as a 1:1 JSON translation of SCXML elements and attributes
- Maintain backwards compatibility via `exportLegacy()` method
- Support core SCXML elements: `scxml`, `state`, `parallel`, `final`, `transition`, `history`, `initial`
- Support data model basics: `datamodel`, `data`, `assign`
- Support executable content: `raise`, `send`, `log`, `if`/`elseif`/`else`, `foreach`
- Support invocation: `invoke`, `finalize`, `content`, `param`
- Provide JSON Schema validation for SCJSON output

**Non-Goals:**
- Full SCXML processor compliance (we're a library, not a processor)
- XPath data model support (ECMAScript-style only)
- External script loading (`<script src="...">`)
- Platform-specific extensions (`_x` system variables)
- SCXML import/parsing (export only for now)

## Decisions

### 1. JSON Structure Mapping

SCXML uses XML elements and attributes. For JSON translation:

| SCXML | SCJSON |
|-------|--------|
| Element name | Object with `$type` field |
| Attributes | Object properties |
| Child elements | Arrays under parent |
| Text content | `$text` field |

**Rationale**: The `$type` discriminator pattern is widely used (JSON-LD, JSON Schema) and allows unambiguous element identification. Alternatives considered:
- Wrapper objects (`{ "state": {...} }`) - more verbose, harder to iterate
- Type unions without discriminator - loses element type info

### 2. Root Element Structure

```json
{
  "$type": "scxml",
  "version": "1.0",
  "name": "myChart",
  "initial": "idle",
  "datamodel": "ecmascript",
  "children": [...]
}
```

**Rationale**: Mirrors SCXML `<scxml>` root element. The `children` array contains states, datamodel, and script elements.

### 3. State Elements

```json
{
  "$type": "state",
  "id": "loading",
  "initial": "fetching",
  "children": [
    { "$type": "onentry", "children": [...] },
    { "$type": "onexit", "children": [...] },
    { "$type": "transition", "event": "DONE", "target": "success" },
    { "$type": "state", "id": "fetching", ... }
  ]
}
```

**Rationale**: Flat children array matches SCXML structure. Keeps entry/exit/transitions at same level as child states. Alternative considered:
- Separate `transitions`, `states`, `onentry` fields - deviates from SCXML structure

### 4. Transition Structure

```json
{
  "$type": "transition",
  "event": "SUBMIT",
  "cond": "isValid()",
  "target": "submitted",
  "type": "external",
  "children": [
    { "$type": "assign", "location": "count", "expr": "count + 1" }
  ]
}
```

**Rationale**: Direct attribute mapping. Executable content in `children`. Condition stored as string expression (matches SCXML behavior).

### 5. Executable Content

Actions/executable content use the same `$type` pattern:

```json
{ "$type": "raise", "event": "internal.done" }
{ "$type": "send", "event": "notify", "target": "#_parent", "delay": "1s" }
{ "$type": "log", "label": "debug", "expr": "context.value" }
{ "$type": "assign", "location": "x", "expr": "x + 1" }
{ "$type": "if", "cond": "x > 0", "children": [...] }
```

### 6. Function Serialization

Current export serializes functions as names. SCJSON will serialize as expression strings:

```json
// Current: { "guard": "isValid" }
// SCJSON:  { "cond": "isValid(context, event)" }
```

**Rationale**: SCXML uses expression strings, not function references. This enables portability.

### 7. Schema Versioning

```json
{
  "$type": "scxml",
  "$schema": "https://statecharts.sh/scjson/1.0.json",
  "version": "1.0",
  ...
}
```

**Rationale**: Allows validation and version detection. `$schema` is optional for inline validation.

### 8. Export API Changes

```typescript
// New method for SCJSON
chart.export(): SCJSONDocument

// Legacy method preserved
chart.exportLegacy(): ExportedChart
```

**Rationale**: Breaking change, but `exportLegacy()` provides migration path.

## Risks / Trade-offs

**Expression portability** → Expressions are strings that may reference runtime context. Document that expressions assume ECMAScript data model.

**Function name loss** → Current export preserves function names; SCJSON uses expressions. Mitigation: document convention for naming functions that will be serialized.

**Larger output size** → SCJSON is more verbose than current format. Trade-off for standards compliance.

**No round-trip guarantee** → Export is one-way; no import. Future enhancement if needed.

**Partial SCXML support** → We implement a subset. Document what's supported vs full spec.
