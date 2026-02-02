## 1. Dependencies

- [x] 1.1 Add vitest, @vitest/coverage-v8 to root devDependencies

## 2. Root Configuration

- [x] 2.1 Create `vitest.config.ts` at repo root with workspace pattern
- [x] 2.2 Add test scripts to root `package.json` (`test`, `test:coverage`)

## 3. Package Setup

- [x] 3.1 Create `packages/ui/vitest.config.ts` extending root config
- [x] 3.2 Create `apps/web/vitest.config.ts` extending root config
- [x] 3.3 Add test scripts to each package's `package.json`

## 4. Test Infrastructure

- [x] 4.1 Create `packages/ui/src/__tests__/` directory with sample test
- [x] 4.2 Create `apps/web/__tests__/` directory with sample test
- [x] 4.3 Verify test discovery works from root (manual: `npm run test`)

## 5. Coverage

- [x] 5.1 Configure coverage thresholds (70% statements, 60% branches)
- [x] 5.2 Verify coverage report generation (manual: `npm run test:coverage`)

## 6. CI Integration

- [x] 6.1 Create `.github/workflows/test.yml` for PR/push test execution
- [x] 6.2 Verify CI workflow runs tests and reports status (manual: push to GitHub)
