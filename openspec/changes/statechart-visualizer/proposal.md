## Why

No way to visualize statechart definitions. Developers can't see state hierarchy, transitions, or runtime flow. Visual debugging + documentation requires manual diagramming.

## What Changes

- New `apps/visualizer/` package: Vite + React app
- Renders `ExportedChart` JSON as interactive node graph via React Flow
- Interactive state traversal: step through states, trigger events, see active state highlighted
- Self-hostable static bundle
- npx-runnable via `@statecharts/visualizer` (starts local server)
- Embeddable component for integration into other apps
- Reads chart JSON from: file upload, URL param, or programmatic API

## Capabilities

### New Capabilities

- `visualizer-core`: Statechart rendering via React Flow (nodes, edges, hierarchical groups)
- `visualizer-simulation`: Interactive state traversal (trigger events, highlight active state, step forward/back)
- `visualizer-app`: Standalone Vite app with file loading, URL input, and npx bin entry
- `visualizer-embed`: `<Visualizer />` React component export for embedding

### Modified Capabilities

None. Uses existing `export-format` spec as input contract.

## Impact

- **New package**: `@statecharts/visualizer` in `apps/visualizer/`
- **Dependencies**: React, @xyflow/react (React Flow), Vite
- **Build**: Add to turbo pipeline
- **Publish**: npm package w/ bin entry for npx
- **No changes** to core statechart library
