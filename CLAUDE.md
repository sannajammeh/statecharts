# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Turborepo monorepo w/ Next.js 16 app + shared React 19 UI library. TypeScript-strict, zero-warning linting.

## Structure

```
apps/web/           # Next.js app (App Router)
packages/ui/        # React component library (@statecharts/ui)
packages/eslint-config/      # Shared ESLint configs
packages/typescript-config/  # Shared TS configs
```

## Commands

```bash
bun install              # Install deps
npm run dev              # Dev all packages
npm run build            # Build all (cached)
npm run lint             # ESLint (--max-warnings 0)
npm run check-types      # TS check all

# Filter to specific package
turbo build --filter=web
turbo dev --filter=@statecharts/ui

# Generate new component
cd packages/ui && npm run generate:component
```

## Patterns

### React Components
- `"use client"` directive for client components
- Functional components w/ destructured props
- Explicit prop interfaces

```typescript
"use client";

interface ButtonProps {
  children: ReactNode;
  appName: string;
}

export const Button = ({ children, appName }: ButtonProps) => {
  return <button onClick={() => alert(`Hello from ${appName}!`)}>{children}</button>;
};
```

### TypeScript
- Strict mode, no unchecked indexed access
- ES2022 target, NodeNext module resolution
- Declaration maps enabled

### Linting
- ESLint 9 flat config format
- Zero warnings policy enforced
- Plugins: React, React Hooks, Next.js, TypeScript ESLint, Turbo

## Conventions

- Internal packages use `@statecharts/` prefix
- ESM only (type: "module")
- CSS modules for styles (e.g., `page.module.css`)
- Bun as package manager (don't modify bun.lock manually)
