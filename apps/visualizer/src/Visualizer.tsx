"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContextPanel } from "./components/ContextPanel";
import { EventPanel } from "./components/EventPanel";
import { HistoryControls } from "./components/HistoryControls";
import { StateNode as StateNodeComponent } from "./components/StateNode";
import { TransitionEdge as TransitionEdgeComponent } from "./components/TransitionEdge";
import { useAutoLayout } from "./hooks/useAutoLayout";
import { useSimulation } from "./hooks/useSimulation";
import type { VisualizerProps } from "./types";
import {
  chartToEdges,
  chartToNodes,
  mergeNodeData,
  type StateNode,
  type TransitionEdge,
} from "./utils/chartToFlow";

const nodeTypes = {
  state: StateNodeComponent,
  group: StateNodeComponent,
};

const edgeTypes = {
  transition: TransitionEdgeComponent,
};

function VisualizerInner({
  chart,
  theme = "light",
  className = "",
  onStateChange,
}: VisualizerProps): React.JSX.Element {
  const {
    currentState,
    activeStates,
    availableEvents,
    send,
    back,
    forward,
    reset,
    canGoBack,
    canGoForward,
  } = useSimulation(chart, onStateChange);

  const { fitView } = useReactFlow();

  // Generate base nodes/edges from chart (no layout yet)
  const baseNodes = useMemo(() => chartToNodes(chart, activeStates), [chart, activeStates]);
  const baseEdges = useMemo(() => chartToEdges(chart), [chart]);

  const [nodes, setNodes, onNodesChange] = useNodesState<StateNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TransitionEdge>([]);
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);

  const { layout, isLayouting } = useAutoLayout({ setNodes, setEdges, fitView });

  // Initial layout when chart changes or on first mount
  useEffect(() => {
    // Only run initial layout when we have nodes but no positions yet
    if (baseNodes.length > 0 && !isLayoutComplete && !isLayouting) {
      const runLayout = async () => {
        await layout({
          nodes: baseNodes,
          edges: baseEdges,
          direction: "vertical",
          spacing: { x: 180, y: 150 },
        });
        setIsLayoutComplete(true);
      };
      void runLayout();
    }
  }, [chart, baseNodes, baseEdges, layout, isLayoutComplete, isLayouting]);

  // Update node data (active states) without resetting positions
  useEffect(() => {
    if (isLayoutComplete && !isLayouting) {
      setNodes((prevNodes) => mergeNodeData(prevNodes, chartToNodes(chart, activeStates)));
    }
  }, [activeStates, chart, isLayoutComplete, isLayouting, setNodes]);

  // Reset layout - force re-layout with current nodes
  const resetLayout = useCallback(() => {
    setIsLayoutComplete(false);
    void layout({
      nodes: baseNodes,
      edges: baseEdges,
      direction: "vertical",
      spacing: { x: 180, y: 150 },
    }).then(() => {
      setIsLayoutComplete(true);
    });
  }, [baseNodes, baseEdges, layout]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && canGoBack) {
        back();
      } else if (event.key === "ArrowRight" && canGoForward) {
        forward();
      } else if (event.key.toLowerCase() === "r") {
        reset();
      }
    },
    [back, forward, reset, canGoBack, canGoForward]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const themeClasses = theme === "dark" ? "bg-gray-900 text-white" : "bg-white";

  return (
    <div className={`flex h-full w-full ${themeClasses} ${className}`}>
      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          defaultEdgeOptions={{
            type: "transition",
            animated: true,
            markerEnd: { type: "arrowclosed" as const },
          }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="w-72 space-y-6 overflow-auto border-gray-200 border-l p-4">
        <HistoryControls
          onBack={back}
          onForward={forward}
          onReset={reset}
          onResetLayout={resetLayout}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
        <EventPanel events={availableEvents} onSend={send} />
        <ContextPanel context={currentState.context} currentState={currentState.value} />
      </div>
    </div>
  );
}

export function Visualizer(props: VisualizerProps): React.JSX.Element {
  return (
    <ReactFlowProvider>
      <VisualizerInner {...props} />
    </ReactFlowProvider>
  );
}
