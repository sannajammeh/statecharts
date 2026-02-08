## ADDED Requirements

### Requirement: llms.txt file served at site root

The web app SHALL serve a plain-text `llms.txt` file at `https://statecharts.sh/llms.txt`.

#### Scenario: File is accessible at /llms.txt

- **WHEN** an HTTP GET request is made to `https://statecharts.sh/llms.txt`
- **THEN** the server SHALL respond with a 200 status and plain-text content

### Requirement: llms.txt documents core chart API

The file SHALL document the `chart()` function signature, `ChartDefinition` shape, and all `StateNode` configuration fields (`on`, `entry`, `exit`, `after`, `invoke`, `onDone`, `onError`, `initial`, `states`, `parallel`, `final`).

#### Scenario: Agent reads chart definition structure

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL include the `chart()` function signature and all `ChartDefinition` fields with their types

#### Scenario: Agent reads state node configuration

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL include all `StateNode` fields with type annotations and brief behavioral descriptions

### Requirement: llms.txt documents transitions

The file SHALL document all three `TransitionConfig` forms (string shorthand, object, array) including `TransitionObject` fields (`target`, `guard`, `action`).

#### Scenario: Agent reads transition configuration

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL show string, object, and array transition forms with examples

### Requirement: llms.txt documents actions and guards

The file SHALL document the `Action` type (function returning `Partial<TContext> | void`), the `Actions` type (single or array), and the `Guard` type (predicate function).

#### Scenario: Agent reads action pattern

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL explain that actions return partial context for updates or void for side-effects

### Requirement: llms.txt documents runtime instance

The file SHALL document `ChartInstance` properties and methods (`state`, `send`, `subscribe`, `onTransition`, `stop`).

#### Scenario: Agent reads instance API

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL include the `ChartInstance` interface with method signatures

### Requirement: llms.txt documents state snapshot

The file SHALL document `IStateSnapshot` properties (`value`, `context`, `done`, `path`, `timestamp`) and the `matches()` method behavior.

#### Scenario: Agent reads snapshot API

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL include `IStateSnapshot` fields and `matches()` behavior for flat and nested states

### Requirement: llms.txt documents invoke system

The file SHALL document the `InvokeFn` type, promise-based and subscription-based invocations, and `onDone`/`onError` handlers.

#### Scenario: Agent reads invoke API

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL include `InvokeFn` signature and both promise and subscription patterns

### Requirement: llms.txt documents React hook

The file SHALL document `useStateChart` from `statecharts.sh/react` including its signature, `UseStateChartOptions`, `UseStateChartReturn`, and the behavioral difference between passing a `Chart` vs a `ChartInstance`.

#### Scenario: Agent reads React hook API

- **WHEN** an agent fetches `/llms.txt`
- **THEN** the content SHALL include the `useStateChart` signature, options, return type, and lifecycle ownership semantics

### Requirement: llms.txt uses agent-optimized format

The file SHALL use terse, structured prose optimized for LLM consumption. No marketing language. Type signatures in TypeScript. Minimal but complete code examples.

#### Scenario: Content is concise and structured

- **WHEN** an agent parses `/llms.txt`
- **THEN** each API section SHALL contain a type signature, behavioral notes, and at most one code example

### Requirement: llms.txt is a static file

The file SHALL be a static file in `apps/web/public/llms.txt`, not a dynamically generated endpoint.

#### Scenario: File exists in public directory

- **WHEN** the web app is built
- **THEN** `apps/web/public/llms.txt` SHALL exist and be copied to the build output as-is
