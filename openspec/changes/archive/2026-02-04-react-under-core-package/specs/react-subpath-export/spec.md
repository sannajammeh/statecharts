## ADDED Requirements

### Requirement: statecharts.sh/react subpath export available

The `statecharts.sh` package SHALL expose a `/react` subpath export that provides React bindings without requiring a separate package install.

#### Scenario: Import useStateChart from subpath

- **WHEN** a consumer imports `import { useStateChart } from "statecharts.sh/react"`
- **THEN** the import resolves successfully
- **AND** `useStateChart` is the same implementation as previously in `@statecharts/react`

#### Scenario: TypeScript types resolve correctly

- **WHEN** a TypeScript project imports from `statecharts.sh/react`
- **THEN** full type inference works for `useStateChart`, `UseStateChartOptions`, and `UseStateChartReturn`
- **AND** no `@types/` package is required

### Requirement: React subpath is tree-shakeable

The `/react` subpath SHALL be structured so bundlers can tree-shake unused code.

#### Scenario: Core-only usage excludes React code

- **WHEN** a consumer imports only from `statecharts.sh` (not `/react`)
- **AND** the project is bundled with a tree-shaking bundler
- **THEN** no React-related code is included in the final bundle

#### Scenario: React usage includes only React bindings

- **WHEN** a consumer imports from `statecharts.sh/react`
- **THEN** only the React hook code and its dependencies are included
- **AND** unused core features can still be tree-shaken

### Requirement: React is optional peer dependency

The `statecharts.sh` package SHALL declare React as an optional peer dependency.

#### Scenario: No warning without React installed

- **WHEN** a project installs `statecharts.sh` without React
- **AND** the project does not import from `/react`
- **THEN** no peer dependency warnings are shown

#### Scenario: Warning when using /react without React

- **WHEN** a project imports from `statecharts.sh/react`
- **AND** React is not installed
- **THEN** the import fails with a clear error about missing React
