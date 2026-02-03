## 1. Package Setup

- [x] 1.1 Create `packages/react/` directory structure with `src/`, `tests/`
- [x] 1.2 Create `package.json` with name `@statecharts/react`, peer deps `react@>=18.0.0` and `statecharts.sh`
- [x] 1.3 Create `tsconfig.json` extending shared TypeScript config
- [x] 1.4 Add package to root `turbo.json` pipeline
- [x] 1.5 Run `bun install` to link workspace package

## 2. Core Hook Implementation

- [x] 2.1 Create `src/useStateChart.ts` with function signature accepting `Chart | ChartInstance`
- [x] 2.2 Implement type guard `isChart()` to discriminate `Chart` from `ChartInstance` (check for `start` method)
- [x] 2.3 Implement `useSyncExternalStore` subscription logic for `ChartInstance`
- [x] 2.4 Implement `Chart` input path: create instance on mount via `chart.start(initialContext)`
- [x] 2.5 Implement cleanup: unsubscribe always, call `stop()` only for hook-owned instances
- [x] 2.6 Implement stable `send` reference using instance method directly (no wrapper needed)
- [x] 2.7 Implement `matches` convenience function delegating to `state.matches()`
- [x] 2.8 Implement `onTransition` callback with `useRef` to avoid stale closures
- [x] 2.9 Implement `getServerSnapshot` for SSR returning current/initial state

## 3. Type Definitions

- [x] 3.1 Define `UseStateChartOptions<TContext, TEvent>` interface
- [x] 3.2 Define `UseStateChartReturn<TContext, TEvent>` interface
- [x] 3.3 Ensure generic type inference flows from input `Chart`/`ChartInstance` to return type

## 4. Package Exports

- [x] 4.1 Create `src/index.ts` exporting `useStateChart` hook
- [x] 4.2 Export type definitions for consumers
- [x] 4.3 Configure `package.json` exports field for ESM

## 5. Tests

- [x] 5.1 Test: `useStateChart(chart)` creates instance on mount and stops on unmount
- [x] 5.2 Test: `useStateChart(instance)` subscribes without calling start/stop
- [x] 5.3 Test: component re-renders on state transition
- [x] 5.4 Test: component does NOT re-render when event causes no transition
- [x] 5.5 Test: `send` reference is stable across re-renders
- [x] 5.6 Test: `matches()` returns correct boolean for current state
- [x] 5.7 Test: `initialContext` option overrides chart default (Chart input only)
- [x] 5.8 Test: `onTransition` callback receives prev and next state
- [x] 5.9 Test: `onTransition` not called on initial mount
- [x] 5.10 Test: TypeScript types infer correctly (compile-time check)

## 6. Documentation

- [x] 6.1 Create README.md with installation and usage examples
- [x] 6.2 Document Chart vs ChartInstance input behavior
- [x] 6.3 Document shared instance pattern for cross-component state
