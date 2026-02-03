# @statecharts/react

React bindings for [statecharts.sh](https://github.com/sannajammeh/statecharts).

## Installation

```bash
npm install @statecharts/react statecharts.sh react
```

## Usage

### Basic Usage (Component-local instance)

```tsx
import { chart } from "statecharts.sh";
import { useStateChart } from "@statecharts/react";

const toggleChart = chart({
  context: { count: 0 },
  initial: "inactive",
  states: {
    inactive: { on: { TOGGLE: "active" } },
    active: { on: { TOGGLE: "inactive" } },
  },
});

function Toggle() {
  const { state, send, matches } = useStateChart(toggleChart);

  return (
    <div>
      <p>State: {state.value}</p>
      <p>Is active: {matches("active") ? "Yes" : "No"}</p>
      <button onClick={() => send("TOGGLE")}>Toggle</button>
    </div>
  );
}
```

When you pass a `Chart` to `useStateChart`, the hook:
- Calls `chart.start()` on mount to create an instance
- Calls `instance.stop()` on unmount for cleanup
- Each component gets its own independent instance

### Shared Instance (Cross-component state)

For state shared across multiple components, create and manage the instance yourself:

```tsx
import { chart } from "statecharts.sh";
import { useStateChart } from "@statecharts/react";
import { createContext, useContext } from "react";

// Create the chart
const appChart = chart({
  context: { user: null },
  initial: "loggedOut",
  states: {
    loggedOut: { on: { LOGIN: "loggedIn" } },
    loggedIn: { on: { LOGOUT: "loggedOut" } },
  },
});

// Create instance outside React (module-level)
const appInstance = appChart.start();

// Optional: Create a context for cleaner access
const AppStateContext = createContext(appInstance);

function useAppState() {
  const instance = useContext(AppStateContext);
  return useStateChart(instance);
}

// Components share the same instance
function Header() {
  const { matches, send } = useAppState();
  return matches("loggedIn") ? (
    <button onClick={() => send("LOGOUT")}>Logout</button>
  ) : null;
}

function LoginPage() {
  const { matches, send } = useAppState();
  if (matches("loggedIn")) return <p>Already logged in</p>;
  return <button onClick={() => send("LOGIN")}>Login</button>;
}
```

When you pass a `ChartInstance` to `useStateChart`, the hook:
- Subscribes to state changes without calling `start()`
- Does NOT call `stop()` on unmount (you control the lifecycle)
- Multiple components share the same state

## API

### `useStateChart(chartOrInstance, options?)`

```typescript
function useStateChart<TContext, TEvent>(
  chartOrInstance: Chart<TContext, TEvent> | ChartInstance<TContext, TEvent>,
  options?: UseStateChartOptions<TContext, TEvent>
): UseStateChartReturn<TContext, TEvent>;
```

#### Parameters

- `chartOrInstance` — Either a `Chart` (creates instance) or `ChartInstance` (subscribes only)
- `options` — Optional configuration:
  - `initialContext?: Partial<TContext>` — Override initial context (only for `Chart` input)
  - `onTransition?: (prev, next) => void` — Callback after each state transition

#### Returns

- `state: IStateSnapshot<TContext>` — Current state snapshot with `value`, `context`, `done`, `path`
- `send: (event) => void` — Dispatch events to the machine (stable reference)
- `matches: (stateValue) => boolean` — Check if current state matches

### Options

#### `initialContext`

Override the chart's default context when starting:

```tsx
const { state } = useStateChart(myChart, {
  initialContext: { count: 10 }, // Override default
});
```

Ignored when passing a `ChartInstance` (use `chart.start(context)` instead).

#### `onTransition`

React to state changes for side effects (analytics, logging):

```tsx
const { state } = useStateChart(myChart, {
  onTransition: (prev, next) => {
    console.log(`Transitioned from ${prev.value} to ${next.value}`);
    analytics.track("state_change", { from: prev.value, to: next.value });
  },
});
```

Not called on initial mount — only on subsequent transitions.

## Requirements

- React 18+ (uses `useSyncExternalStore`)
- `statecharts.sh` as peer dependency

## License

MIT
