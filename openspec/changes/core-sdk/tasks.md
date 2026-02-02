## 1. Package Setup

- [ ] 1.1 Create `packages/core/` directory structure
- [ ] 1.2 Create `package.json` with name `@statecharts/core`, type module, exports
- [ ] 1.3 Create `tsconfig.json` extending shared config with `isolatedDeclarations: true`
- [ ] 1.4 Add package to workspace in root `package.json`

## 2. Type Definitions

- [ ] 2.1 Create `src/types.ts` with utility types (StringKeys, AtLeastOne)
- [ ] 2.2 Add context and event types (AnyContext, BaseEvent, EventPayload)
- [ ] 2.3 Add action and guard types (Action, Actions, Guard) with partial return
- [ ] 2.4 Add transition types (TransitionConfig with string/object/array forms)
- [ ] 2.5 Add invoke types (InvokeFn, Subscription, InvokeHandlers)
- [ ] 2.6 Add state node type (StateNode with all optional properties)
- [ ] 2.7 Add chart definition type (ChartDefinition)
- [ ] 2.8 Add runtime types (StateSnapshot, ChartInstance, Chart)
- [ ] 2.9 Add export types (ExportedChart, ExportedStateNode, ExportedTransition)

## 3. Core Implementation

- [ ] 3.1 Create `src/snapshot.ts` - StateSnapshot class with value, context, done, path, matches(), timestamp
- [ ] 3.2 Create `src/transition.ts` - resolve transition from config (string/object/array), evaluate guards
- [ ] 3.3 Create `src/invoke.ts` - handle promise/subscription invocations, cancellation
- [ ] 3.4 Create `src/instance.ts` - ChartInstance with send(), subscribe(), onTransition(), stop()
- [ ] 3.5 Implement context merging logic (partial return → shallow merge, undefined → no change)
- [ ] 3.6 Implement entry/exit action execution with context updates
- [ ] 3.7 Implement event handling and transition execution

## 4. Advanced Features

- [ ] 4.1 Implement delayed transitions (`after`) with setTimeout, cleanup on exit
- [ ] 4.2 Implement hierarchical states (nested `states` + `initial`)
- [ ] 4.3 Implement state value as object for nested states
- [ ] 4.4 Implement event bubbling from child to parent states
- [ ] 4.5 Implement absolute `#id` references for transitions
- [ ] 4.6 Implement parallel states (`parallel` regions)
- [ ] 4.7 Implement final states (`final: true`, sets `done` flag)

## 5. Export

- [ ] 5.1 Create `src/export.ts` - serialize chart definition to ExportedChart
- [ ] 5.2 Implement function name extraction (or 'anonymous' for arrow functions)
- [ ] 5.3 Ensure output is JSON.stringify-safe (no functions, no circular refs)

## 6. Public API

- [ ] 6.1 Create `src/chart.ts` - chart() factory returning Chart object
- [ ] 6.2 Implement Chart.definition, Chart.start(), Chart.export()
- [ ] 6.3 Create `src/index.ts` - export chart function and all types

## 7. Testing

- [ ] 7.1 Add test setup (vitest or similar)
- [ ] 7.2 Test basic toggle example from spec
- [ ] 7.3 Test async fetcher example
- [ ] 7.4 Test guarded transitions
- [ ] 7.5 Test nested/hierarchical states
- [ ] 7.6 Test delayed transitions
- [ ] 7.7 Test parallel states
- [ ] 7.8 Test export serialization

## 8. Build & Publish

- [ ] 8.1 Add build script using rolldown (`rolldown.config.ts`, `isolatedDeclarationPlugin` for .d.ts)
- [ ] 8.2 Verify TypeScript inference works with examples
- [ ] 8.3 Test package can be imported from web app
