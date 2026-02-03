## Context

The `statecharts.sh` core library exposes a `chart()` function that returns a `Chart` object. Calling `chart.start()` creates a `ChartInstance` with:
- `state: IStateSnapshot` — current state with `value`, `context`, `matches()`, `done`, `path`
- `send(event)` — dispatches events to the machine
- `subscribe(listener)` — returns unsubscribe function, called on every state change
- `onTransition(listener)` — called when events are processed
- `stop()` — cleanup for async invocations

React integration must bridge this imperative API to React's declarative model while preserving type safety and minimizing bundle size.

## Goals / Non-Goals

**Goals:**
- Provide idiomatic React hooks that feel native to React developers
- Preserve full TypeScript inference from chart definition to hook return
- Handle all lifecycle concerns (mount, unmount, cleanup) automatically
- Support React 18+ concurrent features (useSyncExternalStore)
- Keep bundle size minimal — no external dependencies beyond React peer dep

**Non-Goals:**
- Server-side state persistence or hydration (future consideration)
- DevTools integration (separate package)
- React Native specific optimizations (should work, not optimized)
- Supporting React < 18 (useSyncExternalStore requires 18+)

## Decisions

### 1. Use `useSyncExternalStore` for subscription

**Decision:** Use React 18's `useSyncExternalStore` hook internally.

**Rationale:** This is React's official primitive for subscribing to external stores. It handles:
- Tearing prevention in concurrent rendering
- Proper subscription lifecycle
- Server rendering compatibility (with getServerSnapshot)

**Alternatives considered:**
- `useState` + `useEffect` subscription: Race conditions in concurrent mode, more code
- Third-party state library: Adds bundle size, unnecessary abstraction

### 2. Accept both Chart and ChartInstance

**Decision:** `useStateChart(chartOrInstance, options)` accepts either a `Chart` or a pre-started `ChartInstance`.

**Behavior:**
- `Chart` input: Calls `chart.start()` on mount, `instance.stop()` on unmount (hook owns lifecycle)
- `ChartInstance` input: Subscribes only, does NOT call `stop()` on unmount (caller owns lifecycle)

**Rationale:**
- `Chart` input: Simplest mental model for component-local state machines
- `ChartInstance` input: Enables shared instances across components without built-in Context
- Users can create their own Context providers or module-level instances as needed
- Keeps the library minimal — no opinionated state sharing patterns

**Type discrimination:** Check for `start` method to differentiate `Chart` from `ChartInstance`.

### 3. Return object shape: `{ state, send, matches }`

**Decision:** Return an object with:
```typescript
{
  state: IStateSnapshot<TContext>;  // Full snapshot for advanced use
  send: (event: TEvent) => void;    // Stable reference (useCallback)
  matches: (value: string) => boolean;  // Convenience, delegates to state.matches()
}
```

**Rationale:**
- `state` gives full access to `value`, `context`, `done`, `path`, `timestamp`
- `send` and `matches` as top-level for ergonomics (most common operations)
- Stable `send` reference prevents unnecessary re-renders when passed as prop

**Alternatives considered:**
- Return just the instance: Exposes imperative API, less React-idiomatic
- Spread all snapshot properties: Loses grouping, harder to destructure selectively

### 4. `onTransition` callback via options

**Decision:** Accept `onTransition: (prev, next) => void` in options object.

**Rationale:**
- Side effects (analytics, logging) shouldn't live in render
- Callback receives both previous and next state for diffing
- Called synchronously after state update, before re-render

**Implementation:** Wrap in `useRef` to avoid stale closures, call in subscription handler.

### 5. Initial context override

**Decision:** Accept `initialContext` in options to override chart's default context.

**Rationale:**
- Dynamic initialization (e.g., from props, URL params)
- Passed to `chart.start(initialContext)`

## Risks / Trade-offs

**React 18+ requirement** → Users on React 17 cannot use this package. Mitigation: Document clearly, React 18 has high adoption.

**Instance per mount with Chart** → Multiple components using same `Chart` get separate instances. Mitigation: Pass a shared `ChartInstance` instead; document the pattern.

**No SSR snapshot** → `getServerSnapshot` returns initial state, may cause hydration mismatch if client state differs. Mitigation: Document that statecharts should start in deterministic initial state; future work could add serialization.

## Open Questions

1. **Concurrent mode `startTransition` integration?** — Could wrap `send` calls in `startTransition` for low-priority updates. Needs user research on use cases.
