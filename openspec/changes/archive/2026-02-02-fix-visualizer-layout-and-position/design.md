## Context

The visualizer uses React Flow to render statechart nodes and edges. Currently, two issues affect usability:

1. **Layout Issues**: The dagre layout algorithm in `chartToFlow.ts` uses insufficient spacing (`nodesep: 50, ranksep: 80`), causing nodes and edge labels to overlap. Parent group nodes have hardcoded dimensions (200x150) that don't scale with content.

2. **Position Loss on State Change**: In `Visualizer.tsx`, the `useEffect` hook regenerates all nodes from scratch whenever `activeStates` changes (during simulation transitions). This replaces node objects entirely, including their `position` property, discarding any manual positioning the user has done via drag-and-drop.

## Goals / Non-Goals

**Goals:**
- Provide adequate initial spacing between nodes and edge labels
- Preserve user-dragged node positions across state transitions
- Maintain proper highlighting of active states without layout reset
- Keep the solution simple without introducing complex state management

**Non-Goals:**
- Persist positions across page reloads (out of scope)
- Auto-layout on window resize or content changes
- Support for saving/loading custom layouts
- Changes to the simulation logic or statechart behavior

## Decisions

### Decision 1: Increase Layout Spacing
**Choice**: Increase dagre layout parameters from `nodesep: 50, ranksep: 80` to `nodesep: 80, ranksep: 120`

**Rationale**: Current spacing causes edge labels (showing event names like "TOGGLE") to overlap with node boundaries. Doubling the separation provides clear visual separation.

**Alternative considered**: Dynamically calculate spacing based on content - rejected as overkill for initial fix.

### Decision 2: Preserve Positions via Node Data Merge
**Choice**: Instead of replacing all nodes on state change, merge updated `data` (active state flags) into existing nodes while preserving `position` and `width`/`height` properties.

**Implementation approach**:
```typescript
// Instead of: setNodes(chartToNodes(chart, activeStates))
// Use: setNodes(prev => mergeNodeData(prev, chartToNodes(chart, activeStates)))
```

The merge function will:
1. Create a map of node IDs to their current positions
2. Generate new node data from `chartToNodes`
3. Apply saved positions to matching nodes
4. Only reset positions for truly new nodes (not yet in the map)

**Rationale**: This preserves user positioning while still allowing dynamic node updates for highlighting. React Flow's `onNodesChange` already handles position updates in its internal state.

**Alternative considered**: Store positions in a separate ref/state and merge at render time - rejected as it adds unnecessary complexity when React Flow already tracks positions.

### Decision 3: Use Node ID as Stable Key
**Choice**: Rely on node IDs (state paths like "idle", "active") as stable identifiers for position preservation.

**Rationale**: State paths are unique and persistent across chart transitions. As long as a state exists, its ID remains constant, making it a reliable key for position tracking.

## Risks / Trade-offs

**Risk**: Nodes added dynamically (if chart changes) will appear at default positions
→ **Mitigation**: Document that this fix preserves positions within a single chart session. Full persistence across different charts is out of scope.

**Risk**: Initial layout may look too spread out for very simple charts
→ **Mitigation**: The increased spacing (80/120) is still reasonable for simple 2-state charts and significantly improves readability for complex charts.

**Risk**: Parent group sizing doesn't account for child positions
→ **Mitigation**: For this fix, remove hardcoded parent dimensions and let React Flow auto-size groups based on children. The hardcoded 200x150 is clearly insufficient.

## Migration Plan

No migration needed - this is a UX improvement to an existing feature. Changes are backward compatible.

## Open Questions

None - implementation approach is clear.
