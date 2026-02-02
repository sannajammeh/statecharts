## 1. Package Setup

- [x] 1.1 Create `packages/core/` directory structure
- [x] 1.2 Create `package.json` with name `@statecharts/core`, type module, exports
- [x] 1.3 Create `tsconfig.json` extending shared config with `isolatedDeclarations: true`
- [x] 1.4 Add package to workspace in root `package.json`

## 2. Type Definitions

- [x] 2.1 Create `src/types.ts` with utility types (StringKeys, AtLeastOne)
- [x] 2.2 Add context and event types (AnyContext, BaseEvent, EventPayload)
- [x] 2.3 Add action and guard types (Action, Actions, Guard) with partial return
- [x] 2.4 Add transition types (TransitionConfig with string/object/array forms)
- [x] 2.5 Add invoke types (InvokeFn, Subscription, InvokeHandlers)
- [x] 2.6 Add state node type (StateNode with all optional properties)
- [x] 2.7 Add chart definition type (ChartDefinition)
- [x] 2.8 Add runtime types (StateSnapshot, ChartInstance, Chart)
- [x] 2.9 Add export types (ExportedChart, ExportedStateNode, ExportedTransition)

## 3. Core Implementation

- [x] 3.1 Create `src/snapshot.ts` - StateSnapshot class with value, context, done, path, matches(), timestamp
- [x] 3.2 Create `src/transition.ts` - resolve transition from config (string/object/array), evaluate guards
- [x] 3.3 Create `src/invoke.ts` - handle promise/subscription invocations, cancellation
- [x] 3.4 Create `src/instance.ts` - ChartInstance with send(), subscribe(), onTransition(), stop()
- [x] 3.5 Implement context merging logic (partial return → shallow merge, undefined → no change)
- [x] 3.6 Implement entry/exit action execution with context updates
- [x] 3.7 Implement event handling and transition execution

## 4. Advanced Features

- [x] 4.1 Implement delayed transitions (`after`) with setTimeout, cleanup on exit
- [x] 4.2 Implement hierarchical states (nested `states` + `initial`)
- [x] 4.3 Implement state value as object for nested states
- [x] 4.4 Implement event bubbling from child to parent states
- [x] 4.5 Implement absolute `#id` references for transitions
- [x] 4.6 Implement parallel states (`parallel` regions)
- [x] 4.7 Implement final states (`final: true`, sets `done` flag)

## 5. Export

- [x] 5.1 Create `src/export.ts` - serialize chart definition to ExportedChart
- [x] 5.2 Implement function name extraction (or 'anonymous' for arrow functions)
- [x] 5.3 Ensure output is JSON.stringify-safe (no functions, no circular refs)

## 6. Public API

- [x] 6.1 Create `src/chart.ts` - chart() factory returning Chart object
- [x] 6.2 Implement Chart.definition, Chart.start(), Chart.export()
- [x] 6.3 Create `src/index.ts` - export chart function and all types

## 7. Testing

- [x] 7.1 Add test setup (vitest or similar)
- [x] 7.2 Test basic toggle example from spec
- [x] 7.3 Test async fetcher example
- [x] 7.4 Test guarded transitions
- [x] 7.5 Test nested/hierarchical states
- [x] 7.6 Test delayed transitions
- [x] 7.7 Test parallel states
- [x] 7.8 Test export serialization

## 8. Build & Publish

- [x] 8.1 Add build script using rolldown (`rolldown.config.ts`, `isolatedDeclarationPlugin` for .d.ts)
- [x] 8.2 Verify TypeScript inference works with examples
- [x] 8.3 Test package can be imported from web app
