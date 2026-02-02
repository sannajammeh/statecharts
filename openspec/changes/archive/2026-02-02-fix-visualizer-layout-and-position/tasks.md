## 1. Fix Layout Spacing

- [x] 1.1 Update dagre layout parameters in `chartToFlow.ts` from `nodesep: 50, ranksep: 80` to `nodesep: 80, ranksep: 120`
- [x] 1.2 Remove hardcoded parent node dimensions (200x150) to allow React Flow auto-sizing
- [x] 1.3 Verify initial layout has adequate spacing for edge labels

## 2. Implement Position Preservation

- [x] 2.1 Create helper function to merge node data while preserving positions
- [x] 2.2 Modify `Visualizer.tsx` to use merge approach instead of full node regeneration
- [x] 2.3 Ensure active state highlighting still works after position preservation

## 3. Testing & Verification

- [x] 3.1 Test that nodes are adequately spaced on initial load
- [x] 3.2 Test that manual node positioning persists after triggering state transitions
- [x] 3.3 Test that active state highlighting updates correctly without resetting positions
- [x] 3.4 Run TypeScript checks to ensure no type errors
- [x] 3.5 Run linter to ensure code style compliance
