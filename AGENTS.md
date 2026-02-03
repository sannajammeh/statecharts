# AGENTS.md

Guidelines for agentic coding agents working in this repository.

## Stack Overview

Turborepo monorepo with Astro + React 19, TypeScript (strict), Tailwind CSS v4, Biome + ESLint, Bun package manager.

## Project Structure

```
apps/
  web/                # Astro app (port 3000, docs site)
  visualizer/         # Vite-based visualizer app
packages/
  core/               # Statechart library (statecharts.sh)
  ui/                 # React component library (@statecharts/ui)
  eslint-config/      # Shared ESLint configs
  typescript-config/  # Shared TS configs
```

## Commands

```bash
# Root commands (run from /Users/personal/code/skala-org/statecharts)
bun install              # Install dependencies
npm run dev              # Dev all packages
npm run build            # Build all (cached with Turbo)
npm run lint             # ESLint (--max-warnings 0)
npm run format           # Biome format only
npm run check            # Biome format + lint
npm run check-types      # TypeScript check all
npm run test             # Run all tests (vitest)
npm run test:coverage    # Run tests with coverage

# Package-specific commands
turbo build --filter=web                    # Build specific package
turbo dev --filter=@statecharts/ui          # Dev specific package
turbo lint --filter=statecharts.sh          # Lint specific package

# Test commands (single test)
npm run test -- packages/core/src/__tests__/chart.test.ts
npm run test -- --testNamePattern="should create chart"
cd packages/core && npm run test -- chart.test.ts

# Generate new component
cd packages/ui && npm run generate:component
```

## Code Style Guidelines

### TypeScript
- **Strict mode**: Enabled with `noUncheckedIndexedAccess: true`
- **Target**: ES2022, NodeNext module resolution
- **Declaration maps**: Enabled for better IDE support
- **ESM only**: All packages use `"type": "module"`

### Formatting (Biome)
- **Indent**: 2 spaces
- **Line width**: 100 characters
- **Quotes**: Double quotes
- **Trailing commas**: ES5 style
- **Semicolons**: Always

### Linting
- **ESLint 9**: Flat config format
- **Zero warnings**: `--max-warnings 0` enforced
- **Plugins**: React, React Hooks, TypeScript
- **Tailwind**: `useSortedClasses` rule for class ordering

### React Components
- **Pattern**: Functional components with destructured props
- **Props**: Explicit interfaces, no inline types
- **Imports**: React hooks from `react`, types with `import type`

```typescript
import { useState, ReactNode } from "react";
import type { Metadata } from "next";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export function Button({ children, className = "", appName }: ButtonProps) {
  return <button className={className}>{children}</button>;
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Button`, `UserCard`)
- **Functions**: camelCase (e.g., `handleClick`, `fetchData`)
- **Types/Interfaces**: PascalCase with descriptive names
- **Constants**: SCREAMING_SNAKE_CASE for true constants
- **Files**: camelCase for utilities, PascalCase for components

### Imports
- **Order**: React → External libs → Internal packages → Local
- **Type imports**: Use `import type { Foo } from "bar"`
- **Internal packages**: Use `@statecharts/` prefix (e.g., `@statecharts/ui`), except `statecharts.sh` (core)
- **File extensions**: Include `.js` for imports in core package

### Error Handling
- **Types**: Use `unknown` for caught errors, narrow with type guards
- **Guards**: Prefer explicit checks over `any`
- **Logging**: Use `console.error` for unexpected errors in dev only

### Styling
- **Tailwind CSS v4**: CSS-first configuration via `@theme`
- **Dark mode**: Via `prefers-color-scheme`
- **Class sorting**: Biome enforces consistent ordering
- **Custom classes**: Use arbitrary values sparingly

### Testing
- **Framework**: Vitest with `@testing-library/react`
- **Pattern**: `describe` → `it` blocks
- **Location**: `**/__tests__/**/*.test.{ts,tsx}`
- **Coverage**: 70% statements, 60% branches threshold

### Package Management
- **Manager**: Bun (`bun@1.3.6`)
- **Lockfile**: `bun.lock` (do not modify manually)
- **Workspaces**: `apps/*` and `packages/*`
- **Internal deps**: Use `*` for workspace packages

## Package Installation

- Always run `npm view <package-name> version` to get the latest version of the package you're installing.
- Always assume that you're running in a sandbox. If install step fails, do not try again. Prompt user to run install script.

## Testing

For browser-related features, verify with `agent-browser` skill.
