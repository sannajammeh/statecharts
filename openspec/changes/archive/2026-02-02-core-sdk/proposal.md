## Why

Need the actual statecharts SDK - the core library that implements the specification. Currently the landing page references `npm install statecharts` but no package exists.

## What Changes

- New `packages/core` package (`@statecharts/core`)
- Single entry point: `chart()` function returns a statechart definition
- Reducer-style context updates (return partial object, gets merged)
- Inline actions/guards/invokes (no string references)
- JSON export for visualizer tooling via `.export()`
- TypeScript-first with full type inference

## Capabilities

### New Capabilities

- `chart-definition`: Define statecharts with `chart()` - context, initial state, state nodes, transitions
- `state-nodes`: State node configuration - entry/exit actions, event handlers, final states
- `transitions`: Transition configs - target, guard, actions, shorthand string form, array (first-match)
- `async-invocations`: Async operations via `invoke` - promises and subscriptions, onDone/onError handlers
- `hierarchical-states`: Nested states with `initial` + `states`, absolute `#id` references
- `parallel-states`: Orthogonal regions via `parallel` key
- `delayed-transitions`: Time-based transitions via `after` with ms keys
- `runtime-instance`: `chart.start()` returns instance with `send()`, `subscribe()`, `stop()`
- `state-snapshot`: Immutable snapshot with `value`, `context`, `done`, `path`, `matches()`
- `export-format`: JSON-serializable export for visualizer tooling

### Modified Capabilities

<!-- None - new package -->

## Impact

- New package: `packages/core/`
- Zero runtime dependencies
- Exports: `chart` function + all type definitions
- No changes to existing packages
