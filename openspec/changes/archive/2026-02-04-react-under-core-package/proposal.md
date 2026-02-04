## Why

The React bindings (`@statecharts/react`) are currently a separate package requiring an additional install. Moving them under the core package as `statecharts.sh/react` simplifies the developer experience—one package provides both the core library and React integration, matching patterns from XState and other popular libraries.

## What Changes

- **BREAKING**: Package `@statecharts/react` will be deprecated
- Move React hook implementation (`useStateChart`) to `packages/core/src/react/`
- Add new export path `statecharts.sh/react` via package.json exports field
- React remains an optional peer dependency (only needed if using `/react` entrypoint)
- Remove `packages/react` directory after migration

## Capabilities

### New Capabilities

- `react-subpath-export`: Configures `statecharts.sh/react` as a subpath export with proper TypeScript types and tree-shaking support

### Modified Capabilities

- `react-hooks`: Import path changes from `@statecharts/react` to `statecharts.sh/react`

## Impact

- **API**: Import path changes: `@statecharts/react` → `statecharts.sh/react`
- **Dependencies**: `react` becomes optional peer dep on core package
- **Build**: Core package build needs to output separate React entrypoint
- **Docs**: All React usage examples need import path updates
- **Consumers**: Breaking change for existing users of `@statecharts/react`
