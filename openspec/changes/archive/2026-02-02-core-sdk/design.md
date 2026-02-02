## Context

Building `@statecharts/core` - a minimal, typesafe statechart library. Key differentiator vs XState: simpler API surface with reducer-style partial updates, inline everything, and built-in JSON export. Zero runtime dependencies.

User provided full TypeScript API specification including types and examples.

## Goals / Non-Goals

**Goals:**
- Implement the full API spec provided by user
- Zero-config TypeScript inference from definition
- Reducer-style partial context updates (no mutations)
- JSON-serializable export for visualizer tooling
- Zero runtime dependencies, tiny bundle

**Non-Goals:**
- XState compatibility/migration path
- React/Vue/framework bindings (separate packages later)
- Visual editor (separate tool, consumes export format)
- Persistence/hydration of running instances

## Decisions

### Package structure
Single package `packages/core` with flat exports. No subpath exports needed initially.

```
packages/core/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # public API exports
│   ├── chart.ts          # chart() factory
│   ├── instance.ts       # ChartInstance runtime
│   ├── snapshot.ts       # StateSnapshot implementation
│   ├── transition.ts     # transition resolution logic
│   ├── invoke.ts         # async invocation handling
│   ├── export.ts         # JSON export logic
│   └── types.ts          # all type definitions
└── tests/
```

**Why**: Keeps internals separate from public API. Easy to refactor without breaking exports.

### Context updates via partial returns
Actions return a partial context object that gets shallow-merged into current context.

```ts
action: (ctx) => ({ count: ctx.count + 1 })  // updates count, preserves other fields
action: (ctx) => ({ newField: 'value' })     // adds newField, preserves existing
action: (ctx) => ({})                        // no-op, context unchanged
action: (ctx) => { console.log(ctx) }        // returns undefined, context unchanged
```

Merge semantics: `newContext = returned ? { ...oldContext, ...returned } : oldContext`

Returning `undefined` (or nothing) leaves context unchanged - useful for side-effect-only actions.

**Why**: Zero dependencies. Familiar Redux reducer pattern. Immutable by default. Type-safe partial updates.

**Alternative considered**: Immer-style mutations → Adds ~5KB dependency, overkill for shallow merges.

### Transition resolution
Array transitions use first-match-wins semantics. Guards evaluated in order.

```ts
on: {
  SUBMIT: [
    { target: 'success', guard: (ctx) => ctx.valid },
    { target: 'error' }  // fallback
  ]
}
```

**Why**: Matches XState behavior. Predictable, easy to reason about.

### State value representation
- Flat states: string (`'idle'`)
- Nested states: object (`{ auth: 'signedIn' }`)
- Parallel states: object with multiple keys (`{ playback: 'running', volume: 'muted' }`)

**Why**: Matches XState convention. Enables `matches()` to work with dot-paths.

### Export format
Functions serialized as names or `null`. Context serialized as-is (must be JSON-compatible for export to work).

```ts
chart.export() → {
  version: 1,
  id: 'toggle',
  initial: 'inactive',
  context: { count: 0 },
  states: { ... }
}
```

**Why**: Enables visualizer tooling without runtime access. Version field for forward compat.

### Timer/delay implementation
Use `setTimeout` for `after` transitions. Store timer IDs for cleanup on exit.

**Why**: Simple, works everywhere. No need for external scheduler.

**Alternative considered**: Pluggable scheduler → Overkill for v1.

### TypeScript isolated declarations
Use `isolatedDeclarations: true` in tsconfig. All exported types must have explicit annotations.

**Why**: Enables fast .d.ts generation via rolldown's `isolatedDeclarationPlugin` without full type-checking. Better for monorepo build performance.

## Risks / Trade-offs

- **Shallow merge only** → Deep nested context updates require spreading manually. Acceptable trade-off for simplicity.
- **No actor model** → Keeps it simple but limits some advanced patterns. Can add later.
- **History states** → Spec includes but complex to implement correctly. May defer to v1.1.
- **Parallel state complexity** → Need careful handling of orthogonal regions. Test thoroughly.
