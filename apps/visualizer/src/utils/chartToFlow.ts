import type { Edge, Node } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import type { ExportedChart, ExportedStateNode, ExportedTransition } from "../types";

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

export function chartToNodes(
  chart: ExportedChart,
  activeStates: Set<string>
): StateNode[] {
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
      ...(hasChildren && {
        style: { width: 200, height: 150 },
      }),
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

  return applyDagreLayout(nodes);
}

export function chartToEdges(chart: ExportedChart): TransitionEdge[] {
  const edges: TransitionEdge[] = [];

  function processState(
    name: string,
    state: ExportedStateNode,
    path: string
  ): void {
    const fullPath = path;

    if (state.on) {
      for (const [event, transitions] of Object.entries(state.on)) {
        const transitionList = Array.isArray(transitions)
          ? transitions
          : [transitions];

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

function applyDagreLayout(nodes: StateNode[]): StateNode[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 80 });
  g.setDefaultEdgeLabel(() => ({}));

  const topLevelNodes = nodes.filter((n) => !n.parentId);
  for (const node of topLevelNodes) {
    const width = node.style?.width ?? 150;
    const height = node.style?.height ?? 50;
    g.setNode(node.id, { width: Number(width), height: Number(height) });
  }

  dagre.layout(g);

  return nodes.map((node) => {
    if (node.parentId) {
      const siblings = nodes.filter((n) => n.parentId === node.parentId);
      const index = siblings.indexOf(node);
      return {
        ...node,
        position: {
          x: 20 + (index % 2) * 80,
          y: 40 + Math.floor(index / 2) * 60,
        },
      };
    }

    const dagreNode = g.node(node.id);
    if (dagreNode) {
      const width = node.style?.width ?? 150;
      const height = node.style?.height ?? 50;
      return {
        ...node,
        position: {
          x: dagreNode.x - Number(width) / 2,
          y: dagreNode.y - Number(height) / 2,
        },
      };
    }
    return node;
  });
}
