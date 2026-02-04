## 1. Setup React Directory in Core

- [x] 1.1 Create `packages/core/src/react/` directory
- [x] 1.2 Copy `useStateChart.ts` from `packages/react/src/` to `packages/core/src/react/`
- [x] 1.3 Create `packages/core/src/react/index.ts` exporting useStateChart and types

## 2. Configure Build and Package Exports

- [x] 2.1 Update `packages/core/tsdown.config.ts` to add react entrypoint
- [x] 2.2 Add `./react` export path to `packages/core/package.json` exports field
- [x] 2.3 Add optional React peer dependency to `packages/core/package.json`
- [x] 2.4 Add React dev dependencies (react, @types/react) to core package

## 3. Migrate Tests

- [x] 3.1 Copy test files from `packages/react/src/__tests__/` to `packages/core/src/react/__tests__/`
- [x] 3.2 Update test imports to use new paths
- [x] 3.3 Add jsdom and @testing-library/react to core devDependencies
- [x] 3.4 Verify tests pass with `npm run test -- packages/core`

## 4. Cleanup

- [x] 4.1 Remove `packages/react` directory
- [x] 4.2 Remove `@statecharts/react` from workspace references if present
- [x] 4.3 Update root package.json or turbo.json if needed

## 5. Documentation Updates

- [x] 5.1 Update any import examples in docs from `@statecharts/react` to `statecharts.sh/react`
- [x] 5.2 Verify TypeScript types resolve correctly in a consuming project
