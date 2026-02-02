import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { ExportedChart, ExportedStateNode } from "../types";

interface StateNodeData {
  [key: string]: unknown;
  label: string;
  stateType: "atomic" | "compound" | "parallel" | "final";
  isInitial: boolean;
  isActive: boolean;
  entryActions: string[];
  exitActions: string[];
}

interface TransitionEdgeData {
  [key: string]: unknown;
  event: string;
  guard: string | null;
  actions: string[];
}

export type StateNode = Node<StateNodeData, "state" | "group">;
export type TransitionEdge = Edge<TransitionEdgeData>;

// Default node sizes for first layout pass
const DEFAULT_NODE_WIDTH = 150;
const DEFAULT_NODE_HEIGHT = 50;
const DEFAULT_GROUP_WIDTH = 200;
const DEFAULT_GROUP_HEIGHT = 150;

export interface LayoutOptions {
  nodes: StateNode[];
  edges: TransitionEdge[];
  direction?: "vertical" | "horizontal";
  spacing?: { x: number; y: number };
}

export interface LayoutResult {
  nodes: StateNode[];
  edges: TransitionEdge[];
}

/**
 * Apply dagre layout to nodes and edges
 * Uses measured node sizes if available, otherwise falls back to defaults
 */
export function applyAutoLayout(options: LayoutOptions): LayoutResult {
  const { nodes, edges, direction = "vertical", spacing = { x: 120, y: 120 } } = options;
  const isHorizontal = direction === "horizontal";

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: isHorizontal ? "LR" : "TB",
    nodesep: isHorizontal ? spacing.y * 2 : spacing.x * 2,
    ranksep: isHorizontal ? spacing.x : spacing.y,
    ranker: "tight-tree",
    edgesep: 80,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Build a map of all nodes for quick lookup
  const nodeMap = new Map<string, StateNode>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // Process nodes - use measured sizes if available
  for (const node of nodes) {
    // Get actual measured dimensions or use defaults
    const measuredWidth = node.measured?.width;
    const measuredHeight = node.measured?.height;

    let width: number;
    let height: number;

    if (measuredWidth && measuredHeight) {
      // Use actual measured dimensions
      width = measuredWidth;
      height = measuredHeight;
    } else if (node.type === "group") {
      // For groups without measurements, estimate based on children
      const children = nodes.filter((n) => n.parentId === node.id);
      if (children.length > 0) {
        // Rough estimate: 2 columns of children
        const cols = 2;
        const rows = Math.ceil(children.length / cols);
        width = Math.max(DEFAULT_GROUP_WIDTH, cols * 100 + 40);
        height = Math.max(DEFAULT_GROUP_HEIGHT, rows * 70 + 60);
      } else {
        width = DEFAULT_GROUP_WIDTH;
        height = DEFAULT_GROUP_HEIGHT;
      }
    } else {
      // Default size for state nodes
      width = DEFAULT_NODE_WIDTH;
      height = DEFAULT_NODE_HEIGHT;
    }

    g.setNode(node.id, { width, height });
  }

  // Add edges to the graph
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  // Run the layout algorithm
  dagre.layout(g);

  // Apply calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);

    if (dagreNode) {
      // dagre uses center coordinates, React Flow uses top-left
      // Get the actual width/height used for layout
      const layoutWidth = dagreNode.width;
      const layoutHeight = dagreNode.height;

      return {
        ...node,
        position: {
          x: dagreNode.x - layoutWidth / 2,
          y: dagreNode.y - layoutHeight / 2,
        },
      };
    }

    return node;
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

/**
 * Merge new node data while preserving positions
 * Used when updating active states without resetting layout
 */
export function mergeNodeData(existingNodes: StateNode[], newNodes: StateNode[]): StateNode[] {
  const positionMap = new Map<string, { x: number; y: number }>();

  for (const node of existingNodes) {
    positionMap.set(node.id, { ...node.position });
  }

  return newNodes.map((newNode) => {
    const savedPosition = positionMap.get(newNode.id);
    if (savedPosition) {
      return {
        ...newNode,
        position: savedPosition,
      };
    }
    return newNode;
  });
}

/**
 * Convert chart to nodes (without layout - positions will be 0,0)
 */
export function chartToNodes(chart: ExportedChart, activeStates: Set<string>): StateNode[] {
  const nodes: StateNode[] = [];

  function processState(
    name: string,
    state: ExportedStateNode,
    parentId: string | null,
    parentInitial: string | null,
    path: string
  ): void {
    const fullPath = parentId ? `${path}` : name;
    const hasChildren = state.states && Object.keys(state.states).length > 0;
    const stateType = state.type ?? (hasChildren ? "compound" : "atomic");
    const isInitial = parentInitial === name || (!parentId && chart.initial === name);

    const node: StateNode = {
      id: fullPath,
      type: hasChildren ? "group" : "state",
      position: { x: 0, y: 0 },
      data: {
        label: name,
        stateType,
        isInitial,
        isActive: activeStates.has(fullPath),
        entryActions: state.entry ?? [],
        exitActions: state.exit ?? [],
      },
      ...(parentId && { parentId, extent: "parent" as const }),
    };

    nodes.push(node);

    if (state.states) {
      for (const [childName, childState] of Object.entries(state.states)) {
        processState(
          childName,
          childState,
          fullPath,
          state.initial ?? null,
          `${fullPath}.${childName}`
        );
      }
    }
  }

  for (const [name, state] of Object.entries(chart.states)) {
    processState(name, state, null, chart.initial, name);
  }

  return nodes;
}

/**
 * Convert chart to edges
 */
export function chartToEdges(chart: ExportedChart): TransitionEdge[] {
  const edges: TransitionEdge[] = [];

  function processState(_name: string, state: ExportedStateNode, path: string): void {
    const fullPath = path;

    if (state.on) {
      for (const [event, transitions] of Object.entries(state.on)) {
        const transitionList = Array.isArray(transitions) ? transitions : [transitions];

        for (const transition of transitionList) {
          const targetPath = resolveTarget(transition.target, path);

          edges.push({
            id: `${fullPath}-${event}-${targetPath}`,
            source: fullPath,
            target: targetPath,
            type: "transition",
            animated: true,
            data: {
              event,
              guard: transition.guard,
              actions: transition.actions,
            },
          });
        }
      }
    }

    if (state.states) {
      for (const [childName, childState] of Object.entries(state.states)) {
        processState(childName, childState, `${fullPath}.${childName}`);
      }
    }
  }

  for (const [name, state] of Object.entries(chart.states)) {
    processState(name, state, name);
  }

  return edges;
}

function resolveTarget(target: string, currentPath: string): string {
  if (target.startsWith(".")) {
    const parentPath = currentPath.split(".").slice(0, -1).join(".");
    return parentPath ? `${parentPath}${target}` : target.slice(1);
  }
  return target;
}
