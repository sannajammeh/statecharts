## 1. JSON Schema

- [x] 1.1 Create `packages/core/schema.json` w/ JSON Schema 2020-12 draft
- [x] 1.2 Define `ExportedTransition` schema (target, guard, actions)
- [x] 1.3 Define `ExportedStateNode` schema (entry, exit, on, after, invoke, onDone, onError, initial, states, parallel, final)
- [x] 1.4 Define root `ExportedChart` schema (version, id, initial, context, states)

## 2. API Route

- [x] 2.1 Create `apps/web/app/schema.json/route.ts` route handler
- [x] 2.2 Import schema from core package and return w/ `application/schema+json` content-type

## 3. Landing Page

- [x] 3.1 Add schema showcase section to `apps/web/app/page.tsx` after features
- [x] 3.2 Include link to `/schema.json`
