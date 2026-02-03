## Why

The `statecharts.sh` core library provides powerful state machine primitives, but React developers need ergonomic hooks to integrate statecharts into their components. Without a dedicated React package, users must manually manage subscriptions, cleanup, and re-renders—error-prone boilerplate that discourages adoption.

## What Changes

- **New `@statecharts/react` package** in `packages/react/`
- **`useStateChart` hook** — Primary API for using a statechart in React components
  - Accepts a `Chart` (creates instance on mount) or pre-started `ChartInstance` (subscribes only)
  - Returns reactive state with `send()`, `matches()`, `context`, and `value`
  - Handles instance lifecycle appropriately based on input type
  - Supports `onTransition` callback for side effects
- **Full TypeScript support** — Preserves type inference from chart definition through to hook return values

## Capabilities

### New Capabilities

- `react-hooks`: Core React hook (`useStateChart`) for binding statecharts to React component lifecycle with automatic subscription management and cleanup

### Modified Capabilities

_None — this is a new package with no changes to existing specs._

## Impact

- **New package**: `packages/react/` with `@statecharts/react` package name
- **Peer dependency**: Requires `react@>=18.0.0` and `statecharts.sh` (core)
- **No external runtime deps**: Only React as peer dependency, zero bundle size overhead beyond hook code
- **Build config**: New Turborepo package entry, TypeScript config, Vitest setup
- **Documentation**: README with usage examples, exported types for consumers
