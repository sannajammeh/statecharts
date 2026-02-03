## ADDED Requirements

### Requirement: useStateChart accepts Chart or ChartInstance

The `useStateChart` hook SHALL accept either a `Chart` object or a pre-started `ChartInstance`, and return reactive state bound to React's render cycle.

```typescript
function useStateChart<TContext, TEvent>(
  chartOrInstance: Chart<TContext, TEvent> | ChartInstance<TContext, TEvent>,
  options?: UseStateChartOptions<TContext, TEvent>
): UseStateChartReturn<TContext, TEvent>;
```

#### Scenario: Basic usage with Chart

- **WHEN** a component calls `useStateChart(chart)` with a `Chart` object
- **THEN** hook returns an object with `state`, `send`, and `matches` properties
- **AND** `state` contains the current `IStateSnapshot`
- **AND** `send` is a function to dispatch events
- **AND** `matches` is a function to check current state

#### Scenario: Basic usage with ChartInstance

- **WHEN** a component calls `useStateChart(instance)` with a pre-started `ChartInstance`
- **THEN** hook returns an object with `state`, `send`, and `matches` properties
- **AND** the state reflects the instance's current state (not initial state)

### Requirement: Lifecycle differs based on input type

The hook SHALL manage lifecycle differently depending on whether a `Chart` or `ChartInstance` is passed.

#### Scenario: Chart input creates and owns instance

- **WHEN** a component mounts with `useStateChart(chart)` passing a `Chart`
- **THEN** hook calls `chart.start()` to create a new instance
- **AND** the instance is created exactly once per mount
- **AND** when component unmounts, hook calls `instance.stop()`

#### Scenario: ChartInstance input subscribes only

- **WHEN** a component mounts with `useStateChart(instance)` passing a `ChartInstance`
- **THEN** hook subscribes to the instance without calling `start()`
- **AND** when component unmounts, hook unsubscribes but does NOT call `instance.stop()`
- **AND** the instance lifecycle remains controlled by the caller

### Requirement: useStateChart triggers re-render on state changes

The hook SHALL subscribe to the chart instance and trigger a React re-render whenever the state changes.

#### Scenario: Re-render after send

- **WHEN** `send("EVENT")` is called
- **AND** the event causes a state transition
- **THEN** the component re-renders with the new state

#### Scenario: No re-render when state unchanged

- **WHEN** `send("EVENT")` is called
- **AND** the event does not cause a state transition (e.g., no matching handler)
- **THEN** the component does NOT re-render

### Requirement: send function has stable reference

The `send` function returned by `useStateChart` SHALL maintain a stable reference across re-renders to prevent unnecessary child re-renders when passed as a prop.

#### Scenario: send reference unchanged across renders

- **WHEN** the component re-renders due to state change
- **THEN** the `send` function reference is the same as previous render
- **AND** child components receiving `send` as prop do not re-render due to reference change

### Requirement: useStateChart supports initial context override for Chart input

The hook SHALL accept `initialContext` in options to override the chart's default context when starting the instance. This option is ignored when passing a `ChartInstance`.

```typescript
interface UseStateChartOptions<TContext, TEvent> {
  initialContext?: Partial<TContext>;
  onTransition?: (prev: IStateSnapshot<TContext>, next: IStateSnapshot<TContext>) => void;
}
```

#### Scenario: Custom initial context with Chart

- **WHEN** `useStateChart(chart, { initialContext: { count: 10 } })` is called with a `Chart`
- **THEN** the instance starts with `context.count` equal to `10` instead of the chart's default

#### Scenario: initialContext ignored with ChartInstance

- **WHEN** `useStateChart(instance, { initialContext: { count: 10 } })` is called with a `ChartInstance`
- **THEN** the `initialContext` option is ignored
- **AND** the instance's existing state is used

### Requirement: useStateChart supports onTransition callback

The hook SHALL accept an `onTransition` callback that is invoked after each state transition with the previous and next state snapshots.

#### Scenario: onTransition called on state change

- **WHEN** a state transition occurs
- **THEN** `onTransition(prevState, nextState)` is called
- **AND** `prevState` contains the state before transition
- **AND** `nextState` contains the state after transition

#### Scenario: onTransition not called on initial subscription

- **WHEN** the component mounts and subscribes
- **THEN** `onTransition` is NOT called for the initial state

#### Scenario: onTransition uses latest callback reference

- **WHEN** the `onTransition` callback prop changes between renders
- **THEN** the new callback is used for subsequent transitions
- **AND** no stale closure issues occur

### Requirement: Hook preserves TypeScript type inference

The `useStateChart` hook SHALL preserve full TypeScript type inference from the chart or instance through to the return values.

#### Scenario: Context type inferred from Chart

- **WHEN** a chart is defined with `context: { count: number }`
- **AND** `useStateChart(chart)` is called
- **THEN** `state.context.count` is typed as `number`

#### Scenario: Context type inferred from ChartInstance

- **WHEN** `useStateChart(instance)` is called with a typed `ChartInstance`
- **THEN** `state.context` and `send` are properly typed based on the instance's types

#### Scenario: Event type inferred

- **WHEN** a chart is defined with typed events
- **AND** `useStateChart(chart)` is called
- **THEN** `send()` only accepts valid event types

### Requirement: Hook uses useSyncExternalStore internally

The `useStateChart` hook SHALL use React 18's `useSyncExternalStore` for subscription to ensure compatibility with concurrent rendering features.

#### Scenario: No tearing in concurrent mode

- **WHEN** React renders in concurrent mode
- **AND** the chart state changes mid-render
- **THEN** the component does not exhibit tearing (inconsistent state reads)

#### Scenario: Server snapshot for SSR

- **WHEN** rendering on the server
- **THEN** `useSyncExternalStore` receives a `getServerSnapshot` that returns the current state
