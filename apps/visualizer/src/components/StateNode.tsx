import type React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { StateNode as StateNodeType } from "../utils/chartToFlow";

type StateNodeProps = NodeProps<StateNodeType>;

export function StateNode({ data }: StateNodeProps): React.JSX.Element {
  const { label, stateType, isInitial, isActive } = data;

  const baseClasses =
    "px-4 py-2 rounded border-2 min-w-[100px] text-center transition-all";

  const typeClasses: Record<string, string> = {
    atomic: "bg-white border-gray-400",
    compound: "bg-gray-50 border-gray-500",
    parallel: "bg-gray-50 border-dashed border-gray-500",
    final: "bg-white border-double border-gray-600 border-4",
  };

  const activeClass = isActive
    ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50"
    : "";

  const initialIndicator = isInitial ? (
    <div className="absolute -left-6 top-1/2 -translate-y-1/2">
      <div className="w-3 h-3 rounded-full bg-black" />
      <div className="absolute left-3 top-1/2 w-3 h-0.5 bg-black -translate-y-1/2" />
    </div>
  ) : null;

  return (
    <div className={`${baseClasses} ${typeClasses[stateType]} ${activeClass}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      {initialIndicator}
      <div className="font-medium text-sm">{label}</div>
      {stateType !== "atomic" && (
        <div className="text-xs text-gray-500 mt-1">{stateType}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  );
}
