## 1. Project Setup

- [x] 1.1 Create `apps/visualizer/` directory structure
- [x] 1.2 Initialize Vite + React + TypeScript project
- [x] 1.3 Add dependencies: `@xyflow/react`, `dagre`
- [x] 1.4 Configure package.json with name `@statecharts/visualizer`
- [x] 1.5 Add to turbo.json pipeline
- [x] 1.6 Configure TypeScript with isolatedDeclarations

## 2. Core Rendering (visualizer-core)

- [x] 2.1 Create `ExportedChart` TypeScript types from export-format spec
- [x] 2.2 Create `chartToNodes()` function: ExportedChart → React Flow nodes
- [x] 2.3 Create `chartToEdges()` function: ExportedChart → React Flow edges
- [x] 2.4 Create custom `StateNode` component (atomic, compound, parallel, final styles)
- [x] 2.5 Create custom `TransitionEdge` component with event/guard/action labels
- [x] 2.6 Implement hierarchical layout using dagre for initial positioning
- [x] 2.7 Implement React Flow group nodes for compound states
- [x] 2.8 Add initial state entry arrow indicator

## 3. Simulation Engine (visualizer-simulation)

- [x] 3.1 Create `useSimulation` hook with state tracking
- [x] 3.2 Implement `getAvailableEvents()` from current state
- [x] 3.3 Implement `send(event)` to compute next state
- [x] 3.4 Implement history stack for back/forward navigation
- [x] 3.5 Implement reset to initial state
- [x] 3.6 Handle parallel state tracking (multiple active regions)

## 4. Visualizer Component (visualizer-embed)

- [x] 4.1 Create `<Visualizer />` component combining core + simulation
- [x] 4.2 Add `chart` prop with re-render on change
- [x] 4.3 Add `theme` prop (light/dark)
- [x] 4.4 Add `className` prop
- [x] 4.5 Add `onStateChange` callback prop
- [x] 4.6 Include MiniMap, Controls, Background from React Flow
- [x] 4.7 Create event panel UI showing available events
- [x] 4.8 Create history controls (back/forward/reset buttons)
- [x] 4.9 Create context display panel

## 5. Standalone App (visualizer-app)

- [x] 5.1 Create app shell with Visualizer component
- [x] 5.2 Implement file upload (drag-drop + file picker)
- [x] 5.3 Implement URL parameter loading (`?chart=`)
- [x] 5.4 Implement URL input field
- [x] 5.5 Add example charts dropdown with 2-3 built-in examples
- [x] 5.6 Add error handling UI for invalid JSON/CORS

## 6. Package & CLI

- [x] 6.1 Configure Vite build with library mode for component export
- [x] 6.2 Configure package.json exports for `@statecharts/visualizer`
- [x] 6.3 Create bin script that serves dist/ with static file server
- [x] 6.4 Add `--port` flag support
- [x] 6.5 Add chart file argument support (opens with `?chart=file://`)
- [x] 6.6 Test npx execution flow

## 7. Polish

- [x] 7.1 Add light/dark theme CSS variables
- [x] 7.2 Style state nodes (borders, colors for state types)
- [x] 7.3 Style transition edges (animated, labels)
- [x] 7.4 Add keyboard shortcuts (R=reset, ←/→=history)
- [x] 7.5 Write README with usage examples
