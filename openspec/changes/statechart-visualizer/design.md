## Context

Statechart library exports JSON via `chart.export()`. No visualization tooling exists. Developers need to manually diagram state machines or rely on mental models. Goal: visual representation of any exported chart.

Current monorepo has `apps/web` (Next.js) and `packages/ui` (React). Visualizer is new standalone app.

## Goals / Non-Goals

**Goals:**
- Render `ExportedChart` JSON as interactive graph via React Flow
- Support hierarchical states (nested, parallel) using React Flow group nodes
- Interactive state traversal: trigger events, highlight active state, step through transitions
- Zero-config npx experience
- Embeddable React component
- Static build, no server required

**Non-Goals:**
- Live runtime connection (visualizer runs its own simulation)
- Chart editing / visual authoring
- Code generation from diagrams

## Decisions

### D1: React + React Flow

**Choice**: React with @xyflow/react (React Flow)

**Why**:
- React Flow provides complete node-based UI out of the box
- Native support for hierarchical groups via `parentId` + `extent: 'parent'`
- Built-in pan/zoom, minimap, controls
- Custom node types for state visualization
- Animated edges for transitions
- Active ecosystem, well-maintained

**Alternatives**:
- Solid.js + custom SVG: Smaller bundle but significant custom code for interactivity
- Reaflow: Less mature, fewer features
- Custom canvas: Too much effort, loses a11y

### D2: Layout strategy

**Choice**: React Flow auto-layout with dagre integration

**Why**:
- React Flow handles node positioning
- Dagre can compute initial hierarchical layout
- User can drag nodes to customize view
- State groups use React Flow's native `type: 'group'` nodes

**Alternatives**:
- elkjs: More powerful but heavier
- Manual positioning only: Poor UX for large charts

### D3: State simulation engine

**Choice**: In-visualizer simulation (no runtime connection)

**Why**:
- Visualizer interprets `ExportedChart` JSON directly
- Tracks current state, available events, context
- Step forward: user selects event → compute next state
- Step back: maintain history stack
- No dependency on core library at runtime

**Alternatives**:
- Connect to live runtime: Adds complexity, requires running instance
- No simulation: Loses interactive value

### D4: Package structure

**Choice**: Single package, multiple entry points

```
@statecharts/visualizer
├── /core     → rendering engine
├── /app      → standalone app build
├── /embed    → framework-agnostic component
└── /cli      → bin entry for npx
```

**Why**:
- Single npm install
- Tree-shakeable imports
- Simpler versioning

**Alternatives**:
- Separate packages: More npm overhead, version sync pain

### D5: Embed API design

**Choice**: React component with render helper

```tsx
// React usage
import { StatechartVisualizer } from '@statecharts/visualizer'

<StatechartVisualizer
  chart={chartJson}
  theme="dark"
  onStateChange={(state) => console.log(state)}
/>

// Non-React usage (renders React internally)
import { renderVisualizer } from '@statecharts/visualizer'

const cleanup = renderVisualizer(containerEl, {
  chart: chartJson,
  theme: 'dark'
})
// later: cleanup()
```

**Why**:
- Native React component for React apps
- `renderVisualizer` helper for non-React contexts (uses createRoot internally)
- Props for chart data, theme, callbacks

**Alternatives**:
- Web Component wrapper: Extra complexity, shadow DOM issues with React Flow
- Preact compat layer: Adds bundle size, potential bugs

### D6: CLI implementation

**Choice**: Bun-based static file server

```bash
npx @statecharts/visualizer [--port 3000] [chart.json]
```

**Why**:
- Bun ships with fast static server
- No extra deps
- Can open browser automatically

**Alternatives**:
- Node http: More code
- Express: Overkill for static files

## Risks / Trade-offs

**[Larger bundle size]** → React + React Flow ~100kb gzipped. Trade-off for powerful interactivity. Acceptable for visualization tool.

**[Large charts may be slow]** → React Flow handles virtualization. Collapse nested groups by default for deep hierarchies.

**[Simulation may diverge from runtime]** → Simulation interprets exported JSON, not actual runtime. Document limitations. Guards/actions shown as names only (can't execute).

**[React dependency for embed]** → Non-React apps must load React. Provide `renderVisualizer` helper to abstract this.

**[Deep nesting layout]** → Dagre + React Flow groups. May need manual adjustment for complex charts. Allow user drag repositioning.
