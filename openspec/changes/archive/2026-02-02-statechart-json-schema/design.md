## Context

TypeScript types already define `ExportedChart`, `ExportedStateNode`, `ExportedTransition` in `packages/core/src/types.ts`. These need a corresponding JSON Schema for external validation/tooling.

Next.js 16 app router at `apps/web/` will serve the schema. Landing page already exists at `apps/web/app/page.tsx`.

## Goals / Non-Goals

**Goals:**
- JSON Schema matching existing `ExportedChart` TypeScript type exactly
- Schema accessible at `/schema.json` via Next.js route handler
- Landing page section highlighting the schema standard

**Non-Goals:**
- Runtime validation utilities in core package (future work)
- TypeScript type generation from schema (types are source of truth)
- Schema versioning beyond the existing `version: 1` field

## Decisions

### 1. Schema location: `packages/core/schema.json`
Schema lives with core package since it defines the export format.

**Alternatives:**
- `apps/web/public/schema.json` — couples schema to web app
- Separate `packages/schema/` — overkill for single file

### 2. Route handler at `app/schema.json/route.ts`
Next.js app router convention for serving JSON at exact path.

**Alternatives:**
- `pages/api/schema.ts` — pages router, not using
- Static file in `public/` — can't set proper content-type headers

### 3. Schema draft: JSON Schema 2020-12
Latest stable draft with good tooling support.

### 4. Schema structure mirrors TypeScript types
Direct 1:1 mapping from `ExportedChart` interface. Keep schema simple, no fancy JSON Schema features beyond what's needed.

## Risks / Trade-offs

- **Schema drift** → Mitigate by documenting that TS types are source of truth; schema must match
- **No runtime validation** → Acceptable for v1; users can use ajv or similar with the schema
