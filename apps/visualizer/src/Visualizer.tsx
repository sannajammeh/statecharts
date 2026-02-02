"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { ContextPanel } from "./components/ContextPanel";
import { EventPanel } from "./components/EventPanel";
import { HistoryControls } from "./components/HistoryControls";
import { StateNode } from "./components/StateNode";
import { TransitionEdge } from "./components/TransitionEdge";
import { useSimulation } from "./hooks/useSimulation";
import type { VisualizerProps } from "./types";
import { chartToEdges, chartToNodes } from "./utils/chartToFlow";

const nodeTypes = {
  state: StateNode,
  group: StateNode,
};

const edgeTypes = {
  transition: TransitionEdge,
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

  const initialNodes = useMemo(
    () => chartToNodes(chart, activeStates),
    [chart, activeStates]
  );

  const initialEdges = useMemo(() => chartToEdges(chart), [chart]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(chartToNodes(chart, activeStates));
  }, [chart, activeStates, setNodes]);

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
      <div className="flex-1 relative">
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
      <div className="w-72 border-l border-gray-200 p-4 space-y-6 overflow-auto">
        <HistoryControls
          onBack={back}
          onForward={forward}
          onReset={reset}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
        <EventPanel events={availableEvents} onSend={send} />
        <ContextPanel
          context={currentState.context}
          currentState={currentState.value}
        />
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
