## 1. Create llms.txt file

- [x] 1.1 Create `apps/web/public/llms.txt` with the llms.txt convention header (title, URL, description)
- [x] 1.2 Write the core `chart()` API section — `ChartDefinition` shape, all fields with types
- [x] 1.3 Write the `StateNode` configuration section — all fields (`on`, `entry`, `exit`, `after`, `invoke`, `onDone`, `onError`, `initial`, `states`, `parallel`, `final`)
- [x] 1.4 Write the transitions section — string, object, and array forms with `TransitionObject` fields
- [x] 1.5 Write the actions and guards section — `Action` return-partial pattern, `Guard` predicate type
- [x] 1.6 Write the context section — immutable snapshots, updates via action returns
- [x] 1.7 Write the invoke section — `InvokeFn`, promise and subscription patterns, `onDone`/`onError` handlers
- [x] 1.8 Write the runtime section — `ChartInstance` methods (`state`, `send`, `subscribe`, `onTransition`, `stop`)
- [x] 1.9 Write the snapshot section — `IStateSnapshot` properties, `matches()` behavior for flat/nested states
- [x] 1.10 Write the delayed transitions section — `after` config with millisecond keys
- [x] 1.11 Write the parallel states section — `parallel` field structure
- [x] 1.12 Write the React hook section — `useStateChart` signature, options, return value, Chart vs ChartInstance lifecycle

## 2. Verify

- [x] 2.1 Verify file is under 10KB
- [x] 2.2 Verify file is served correctly by running dev server and fetching `/llms.txt`
