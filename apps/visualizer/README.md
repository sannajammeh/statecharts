# @statecharts/visualizer

Interactive visualizer for statechart definitions. Renders `ExportedChart` JSON as a React Flow graph with simulation controls.

## Usage

### As React component

```tsx
import { Visualizer } from '@statecharts/visualizer'

const chart = {
  version: 1,
  id: 'toggle',
  initial: 'inactive',
  context: { count: 0 },
  states: {
    inactive: {
      on: { TOGGLE: { target: 'active', guard: null, actions: [] } }
    },
    active: {
      on: { TOGGLE: { target: 'inactive', guard: null, actions: [] } }
    }
  }
}

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Visualizer
        chart={chart}
        theme="light"
        onStateChange={(state) => console.log(state)}
      />
    </div>
  )
}
```

### Via npx

```bash
# Start visualizer server
npx @statecharts/visualizer

# With custom port
npx @statecharts/visualizer --port 8080

# Load specific chart file
npx @statecharts/visualizer ./my-chart.json
```

### Via URL parameter

```
http://localhost:3000/?chart=https://example.com/chart.json
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `chart` | `ExportedChart` | Required. The statechart JSON to visualize |
| `theme` | `'light' \| 'dark'` | Optional. Color theme (default: 'light') |
| `className` | `string` | Optional. CSS class for root element |
| `onStateChange` | `(state) => void` | Optional. Callback when simulation state changes |

## Features

- Renders state hierarchy with nested groups
- Interactive simulation: trigger events, step through states
- History navigation: back/forward/reset
- Keyboard shortcuts: ←/→ for history, R for reset
- MiniMap and zoom controls
- Drag-drop or paste URL to load charts

## Development

```bash
cd apps/visualizer
bun install
bun run dev
```
