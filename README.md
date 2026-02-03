# Statecharts.sh

An open state chart specification and library.

**Deterministic** · **Framework Agnostic** · **TypeScript-first**

## Installation

```bash
# npm
npm install statecharts.sh

# pnpm
pnpm add statecharts.sh

# bun
bun add statecharts.sh
```

## What are Statecharts?

Statecharts are a formal way to describe the behavior of reactive systems. They extend finite state machines with hierarchy, concurrency, and communication—making complex UI logic predictable and visualizable.

Define your states, transitions, and actions declaratively. The statechart handles the rest: which transitions are valid, what state you're in, and what happens next.

## Quick Start

```typescript
import { chart } from "statecharts.sh"

const trafficLight = chart({
  context: {},
  initial: "red",
  states: {
    red: { on: { TIMER: "green" } },
    green: { on: { TIMER: "yellow" } },
    yellow: { on: { TIMER: "red" } },
  }
})

const instance = trafficLight.start()
instance.send("TIMER")  // → green
```

## Open Standard

Statecharts.sh defines a JSON Schema for statechart exports, enabling validation, editor autocomplete, and interoperability between tools.

Use the schema to validate your statechart definitions, generate documentation, or build custom tooling around the standard format.

**JSON Schema:** [https://statecharts.sh/schema.json](https://statecharts.sh/schema.json)

## FAQ

### What are statecharts?

Statecharts are an extension of finite state machines that add hierarchy (nested states), concurrency (parallel states), and history (remembering previous states). They were invented by David Harel in 1987 to model complex reactive systems in a visual and formal way.

### How is this different from Redux?

Redux is a general-purpose state container that doesn't enforce any structure on state transitions. Statecharts explicitly model which transitions are possible from each state, making impossible states impossible. This prevents bugs like triggering actions that don't make sense in the current state.

### How is this different from XState?

XState is a great statechart library. Statecharts.sh aims to provide a simpler, lighter-weight alternative focused on the core statechart specification. It's designed to be framework-agnostic and TypeScript-first with minimal dependencies.

## Links

- [Website](https://statecharts.sh)
- [GitHub](https://github.com/sannajammeh/statecharts)

---

© 2026 [Skala Org](https://skala.sh) · UI = fn(state) <3
