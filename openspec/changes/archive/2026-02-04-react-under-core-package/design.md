## Context

Currently, React bindings live in a separate package (`packages/react` published as `@statecharts/react`). This requires users to install two packages and manage version compatibility. The core package (`statecharts.sh`) uses `tsdown` for bundling and already has a subpath export for `/schema`.

## Goals / Non-Goals

**Goals:**
- Provide React bindings via `statecharts.sh/react` subpath export
- Maintain tree-shaking (React code not bundled if unused)
- Keep React as optional peer dependency
- Preserve all existing `useStateChart` functionality

**Non-Goals:**
- Adding new React hooks or features
- Supporting React versions below 18 (already the case)
- Backward compatibility shim for `@statecharts/react` import

## Decisions

### Decision 1: File structure in core package

**Choice**: Place React code in `packages/core/src/react/` with its own index.ts

**Rationale**: Mirrors the existing `/schema` subpath structure. Keeps React-specific code isolated. tsdown can be configured to create a separate entrypoint.

**Alternative considered**: Single file at `packages/core/src/react.ts` — rejected because the hook has types that benefit from a dedicated directory, and future hooks would need expansion room.

### Decision 2: Build configuration

**Choice**: Add `./react` entry to tsdown config and package.json exports

```json
{
  "exports": {
    "./react": {
      "types": "./dist/react/index.d.mts",
      "import": "./dist/react/index.mjs"
    }
  }
}
```

**Rationale**: Matches existing pattern for `/schema` export. tsdown supports multiple entry points natively.

### Decision 3: Peer dependency declaration

**Choice**: Add `react` as optional peer dependency with `peerDependenciesMeta`

```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  }
}
```

**Rationale**: Users not using React won't see peer dependency warnings. Only consumers of `/react` entrypoint need React installed.

### Decision 4: Handle packages/react directory

**Choice**: Delete `packages/react` entirely after migration

**Rationale**: Clean removal avoids confusion. The package hasn't been published yet (version 0.0.1), so no deprecation notice needed on npm.

## Risks / Trade-offs

- **[Breaking change]** → Acceptable since package is pre-1.0 and not widely adopted
- **[Larger core package tarball]** → Minimal impact (~5KB additional), tree-shaking ensures no runtime cost for non-React users
- **[tsdown multi-entry complexity]** → Already proven with /schema export
