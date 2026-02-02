## ADDED Requirements

### Requirement: Render ExportedChart as React Flow graph
The visualizer SHALL accept an `ExportedChart` JSON object and render it as a React Flow node graph.

#### Scenario: Basic chart rendering
- **WHEN** visualizer receives valid ExportedChart JSON
- **THEN** each state in `states` is rendered as a React Flow node
- **THEN** each transition is rendered as a React Flow edge

#### Scenario: Invalid JSON handling
- **WHEN** visualizer receives malformed or invalid JSON
- **THEN** an error message is displayed instead of the graph

### Requirement: State nodes display state information
Each state node SHALL display the state name and indicate its type (atomic, compound, parallel, final).

#### Scenario: Atomic state display
- **WHEN** rendering a state with no children
- **THEN** node displays state name with atomic state styling

#### Scenario: Compound state display
- **WHEN** rendering a state with `states` children
- **THEN** node displays as a React Flow group containing child nodes

#### Scenario: Parallel state display
- **WHEN** rendering a state with `type: 'parallel'`
- **THEN** node displays with parallel region visual indicator (dashed borders between regions)

#### Scenario: Final state display
- **WHEN** rendering a state with `type: 'final'`
- **THEN** node displays with final state styling (double border)

### Requirement: Edges represent transitions
Transitions SHALL be rendered as directed edges between state nodes.

#### Scenario: Simple transition edge
- **WHEN** state A has transition `on: { NEXT: 'B' }`
- **THEN** edge connects node A to node B with label "NEXT"

#### Scenario: Guarded transition display
- **WHEN** transition has guard (displayed as function name)
- **THEN** edge label shows event name and guard: "EVENT [guardName]"

#### Scenario: Transition with actions
- **WHEN** transition has actions
- **THEN** edge label shows event name and action count: "EVENT / 2 actions"

### Requirement: Hierarchical layout with React Flow groups
Nested states SHALL use React Flow's native group node feature with `parentId` relationships.

#### Scenario: Nested state positioning
- **WHEN** state B is child of state A
- **THEN** node B has `parentId` set to node A's id
- **THEN** node B is positioned within node A's bounds

#### Scenario: Deep nesting support
- **WHEN** states are nested 3+ levels deep
- **THEN** all levels render correctly with proper containment

### Requirement: Initial state indicator
The initial state SHALL have a visual indicator (entry arrow or distinct styling).

#### Scenario: Root initial state
- **WHEN** chart has `initial: 'idle'`
- **THEN** 'idle' node has incoming arrow from entry point marker

#### Scenario: Compound state initial
- **WHEN** compound state has `initial: 'childA'`
- **THEN** 'childA' has entry indicator within parent bounds

### Requirement: Built-in React Flow controls
The visualizer SHALL include React Flow's MiniMap, Controls, and Background components.

#### Scenario: Pan and zoom
- **WHEN** user drags on canvas or uses scroll wheel
- **THEN** view pans and zooms accordingly

#### Scenario: Minimap navigation
- **WHEN** user clicks on minimap
- **THEN** main view navigates to that area

#### Scenario: Fit view control
- **WHEN** user clicks fit-view button
- **THEN** graph fits within viewport
