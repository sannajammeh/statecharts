## ADDED Requirements

### Requirement: Export Visualizer React component
The package SHALL export `<Visualizer />` as a named export for embedding in React apps.

#### Scenario: Import and render
- **WHEN** consumer imports `import { Visualizer } from '@statecharts/visualizer'`
- **THEN** component renders chart when provided via `chart` prop

### Requirement: Visualizer accepts chart prop
The `<Visualizer />` component SHALL accept `chart` prop with ExportedChart JSON.

#### Scenario: Chart prop rendering
- **WHEN** `<Visualizer chart={exportedChartJson} />`
- **THEN** statechart renders with full interactivity

#### Scenario: Chart prop update
- **WHEN** `chart` prop changes
- **THEN** Visualizer re-renders with new chart, simulation resets

### Requirement: Visualizer accepts theme prop
The component SHALL accept optional `theme` prop for light/dark mode.

#### Scenario: Dark theme
- **WHEN** `<Visualizer chart={json} theme="dark" />`
- **THEN** dark color scheme applied

#### Scenario: Default theme
- **WHEN** `theme` prop omitted
- **THEN** light theme used by default

### Requirement: Visualizer accepts className prop
The component SHALL accept `className` for custom styling.

#### Scenario: Custom class
- **WHEN** `<Visualizer chart={json} className="my-viz" />`
- **THEN** root element has "my-viz" class

### Requirement: Visualizer accepts onStateChange callback
The component SHALL accept optional `onStateChange` callback.

#### Scenario: State change callback
- **WHEN** simulation state changes
- **THEN** `onStateChange` called with `{ value: string, context: object, event: string }`

### Requirement: Visualizer fills container
The component SHALL fill its container's dimensions.

#### Scenario: Container sizing
- **WHEN** Visualizer placed in 800x600 container
- **THEN** React Flow canvas fills 800x600
