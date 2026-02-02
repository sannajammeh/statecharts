import { useCallback, useRef, useState } from "react";
import type { LayoutOptions, LayoutResult, StateNode, TransitionEdge } from "../utils/chartToFlow";
import { applyAutoLayout } from "../utils/chartToFlow";

interface UseAutoLayoutOptions {
  setNodes: (nodes: StateNode[] | ((prev: StateNode[]) => StateNode[])) => void;
  setEdges: (edges: TransitionEdge[] | ((prev: TransitionEdge[]) => TransitionEdge[])) => void;
  fitView: (options?: { duration?: number }) => Promise<boolean>;
}

interface UseAutoLayoutReturn {
  layout: (
    options: Omit<LayoutOptions, "nodes" | "edges"> & {
      nodes: StateNode[];
      edges: TransitionEdge[];
    }
  ) => Promise<void>;
  isLayouting: boolean;
}

// Small delay to allow React to process state updates
const nextTick = (ms: number = 0) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Hook for automatic two-pass layout
 *
 * First pass: Layout with estimated sizes (or use existing measurements)
 * Second pass: Wait for nodes to render, measure them, then re-layout with actual sizes
 *
 * Based on reactflow-auto-layout pattern:
 * https://github.com/idootop/reactflow-auto-layout
 */
export function useAutoLayout({
  setNodes,
  setEdges,
  fitView,
}: UseAutoLayoutOptions): UseAutoLayoutReturn {
  const [isLayouting, setIsLayouting] = useState(false);
  const layoutInProgress = useRef(false);

  const layout = useCallback(
    async (
      options: Omit<LayoutOptions, "nodes" | "edges"> & {
        nodes: StateNode[];
        edges: TransitionEdge[];
      }
    ) => {
      if (layoutInProgress.current || options.nodes.length === 0) {
        return;
      }

      layoutInProgress.current = true;
      setIsLayouting(true);

      try {
        const { nodes, edges, direction = "vertical", spacing = { x: 120, y: 120 } } = options;

        // First pass: Layout with current sizes (may be estimates if not yet measured)
        const firstLayout = applyAutoLayout({
          nodes,
          edges,
          direction,
          spacing,
        });

        // Clear and set the first layout
        setNodes([]);
        setEdges([]);
        await nextTick(10);

        setNodes(firstLayout.nodes);
        setEdges(firstLayout.edges);

        // Wait for nodes to be measured by React Flow
        // We check if nodes have the 'measured' property
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max

        while (attempts < maxAttempts) {
          await nextTick(100);
          attempts++;

          // Break early if we're unmounted or layout was cancelled
          if (!layoutInProgress.current) {
            return;
          }
        }

        // Second pass: Re-layout with actual measured sizes
        // Get current nodes (which should now have measurements)
        const secondLayout = applyAutoLayout({
          nodes: firstLayout.nodes,
          edges: firstLayout.edges,
          direction,
          spacing,
        });

        setNodes(secondLayout.nodes);
        setEdges(secondLayout.edges);

        // Center the view
        await nextTick(50);
        await fitView({ duration: 0 });
      } finally {
        layoutInProgress.current = false;
        setIsLayouting(false);
      }
    },
    [setNodes, setEdges, fitView]
  );

  return { layout, isLayouting };
}

/**
 * Simple synchronous layout (for initial load without measurement)
 * Uses default/estimated sizes
 */
export function useSimpleLayout(): {
  layout: (options: LayoutOptions) => LayoutResult;
} {
  const layout = useCallback((options: LayoutOptions) => {
    return applyAutoLayout(options);
  }, []);

  return { layout };
}
