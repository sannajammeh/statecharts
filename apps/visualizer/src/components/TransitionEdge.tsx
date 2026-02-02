import type React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { TransitionEdge as TransitionEdgeType } from "../utils/chartToFlow";

type TransitionEdgeProps = EdgeProps<TransitionEdgeType>;

export function TransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: TransitionEdgeProps): React.JSX.Element {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = formatLabel(data?.event ?? "", data?.guard, data?.actions);

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          className="absolute bg-white px-2 py-1 rounded border border-gray-300 text-xs font-mono pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

function formatLabel(
  event: string,
  guard: string | null | undefined,
  actions: string[] | undefined
): string {
  let label = event;

  if (guard) {
    label += ` [${guard}]`;
  }

  if (actions && actions.length > 0) {
    label += ` / ${actions.length === 1 ? actions[0] : `${actions.length} actions`}`;
  }

  return label;
}
