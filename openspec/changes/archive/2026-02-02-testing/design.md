## Context

Turborepo monorepo with Next.js app + shared UI library. No existing test infrastructure. Need unit/integration tests before building React statechart library.

## Goals / Non-Goals

**Goals:**
- Vitest configured at monorepo root with per-package test execution
- Coverage reporting with sensible thresholds
- CI integration (GitHub Actions)
- Fast feedback loop in development

**Non-Goals:**
- E2E browser testing (deferred until React lib exists)
- Visual regression testing
- Snapshot testing (prefer explicit assertions)

## Decisions

### Test Runner: Vitest over Jest
- Native ESM/TS support (no transpilation config)
- Vite-compatible (future alignment)
- Faster execution via esbuild
- Jest API-compatible (easy migration path)

### Monorepo Strategy: Root config with package overrides
- Single `vitest.config.ts` at root
- Workspace pattern matches `apps/*` and `packages/*`
- Each package can extend/override via local `vitest.config.ts`
- Run all: `npm run test`, filter: `npm run test --filter=@statecharts/ui`

### Coverage: v8 over Istanbul
- Faster, native Node.js coverage
- `@vitest/coverage-v8` package
- Thresholds: 70% statements, 60% branches (starting point)

### Test Location: Colocated `__tests__` dirs
- Tests live in `__tests__/` alongside source
- Pattern: `**/__tests__/**/*.test.{ts,tsx}`
- Keeps tests close to implementation

## Risks / Trade-offs

- **[Vitest immaturity]** → Ecosystem smaller than Jest, but API-compatible allows fallback
- **[Coverage threshold too low]** → Start conservative, increase as codebase matures
- **[Monorepo complexity]** → Turbo handles caching; Vitest workspace handles execution
