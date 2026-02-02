## Why

The visualizer has two usability issues that make it difficult to work with statecharts: nodes are rendered too close together initially, causing overlapping labels that are hard to read, and any manual repositioning of nodes is lost when triggering state transitions (e.g., clicking "toggle"), forcing users to rearrange the layout repeatedly during simulation.

## What Changes

- Improve initial node positioning algorithm to provide adequate spacing between states and transitions
- Preserve user-draggable node positions across state transitions instead of regenerating layout on every state change
- Maintain node highlighting for active states without resetting positions
- Fix edge label positioning to prevent overlap with state nodes

## Capabilities

### New Capabilities

*None - this is an implementation fix to existing behavior*

### Modified Capabilities

*None - the existing specs for visualizer-core and visualizer-simulation do not specify layout behavior details; this is an implementation improvement*

## Impact

- **apps/visualizer/src/Visualizer.tsx**: Modify node state management to preserve positions
- **apps/visualizer/src/utils/chartToFlow.ts**: Improve initial positioning algorithm
- **apps/visualizer/src/hooks/useSimulation.ts**: Potentially expose state change events without triggering full re-render
- No API changes or breaking changes
- Improves user experience for visualizer application only
