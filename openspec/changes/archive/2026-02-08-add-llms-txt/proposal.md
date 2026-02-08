## Why

AI agents and LLMs need a machine-readable reference for `statecharts.sh` to generate correct code. The emerging `llms.txt` convention provides a concise, plain-text document at a well-known URL that agents can fetch for library usage context. Without it, agents hallucinate APIs or mix up `statecharts.sh` with XState.

## What Changes

- Add a static `llms.txt` file to `apps/web/public/` so it's served at `https://statecharts.sh/llms.txt`
- Content covers: core `chart()` API, state node configuration, transitions, actions, guards, context, invocations, the `ChartInstance` runtime, the `useStateChart` React hook, and common patterns
- Written in terse, agent-optimized prose — no marketing, no fluff, just API shapes and usage examples

## Capabilities

### New Capabilities

- `llms-txt`: Static `llms.txt` file documenting the core library and React hook APIs for LLM consumption

### Modified Capabilities

_(none)_

## Impact

- **Files added**: `apps/web/public/llms.txt`
- **No code changes**: purely additive static asset
- **No dependencies**: plain text file, no build step
- **Served automatically**: Astro's `public/` directory serves files at the site root
