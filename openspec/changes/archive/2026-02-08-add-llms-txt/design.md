## Context

AI agents using `statecharts.sh` hallucinate APIs without a structured reference. The `llms.txt` convention (a plain-text file at `/llms.txt`) gives agents a concise, fetchable reference. The Astro web app serves static files from `public/` at the site root — no build step needed.

## Goals / Non-Goals

**Goals:**
- Provide a single `llms.txt` covering the full public API surface of `statecharts.sh` and `statecharts.sh/react`
- Optimize for agent consumption: terse prose, code-heavy, no marketing language
- Follow the `llms.txt` community convention structure (title, description, sections)

**Non-Goals:**
- Covering the SCJSON export/schema API (`statecharts.sh/schema`) — secondary concern
- Dynamic generation from source — static file is simpler and version-controlled
- Covering internal/private APIs

## Decisions

### 1. Static file in `public/` vs Astro endpoint

**Decision**: Static `public/llms.txt` file.

**Rationale**: Zero build complexity. Astro serves `public/` files as-is. An endpoint (`src/pages/llms.txt.ts`) adds unnecessary runtime code for content that changes only on library releases. The `scjson/1.0.json.ts` endpoint pattern exists but is justified there because it generates JSON from code — our content is hand-authored text.

**Alternative considered**: Astro API route generating from JSDoc/types. Rejected — fragile, harder to review, and the content needs editorial judgment (what to emphasize, what examples to show).

### 2. Content structure

**Decision**: Follow `llms.txt` convention — title line, URL, description, then `##` sections for each API area. Use markdown-style headers within plain text.

**Sections in order:**
1. Package overview (name, install, entry points)
2. `chart()` — definition shape, all StateNode fields
3. Transitions — all three forms, guards
4. Actions — the return-partial-context pattern
5. Context — immutable snapshots, updates
6. Invoke — promises, subscriptions, handlers
7. Runtime — `ChartInstance` methods
8. Snapshot — `IStateSnapshot` properties, `matches()`
9. Delayed transitions — `after` config
10. Parallel states — `parallel` field
11. React hook — `useStateChart` signature, options, return value, Chart vs ChartInstance behavior

Each section: type signature + 1-2 behavioral notes + minimal example.

### 3. Versioning approach

**Decision**: Pin content to current API (v0.0.2). Update the file manually when API changes.

**Rationale**: The library is pre-1.0. API surface is small. Manual updates are trivial and ensure accuracy. Automated generation can be added later if the API grows significantly.

## Risks / Trade-offs

- **[Stale content]** → File must be manually updated when API changes. Mitigated by small API surface and pre-1.0 velocity.
- **[File size]** → Must stay under ~10KB for fast agent fetching. Current API surface fits comfortably.
- **[No schema API coverage]** → Agents won't know about SCJSON export. Acceptable — core + React is the primary use case. Can be added in a follow-up.
