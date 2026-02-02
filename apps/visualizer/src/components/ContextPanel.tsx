import type React from "react";

interface ContextPanelProps {
  context: unknown;
  currentState: string | Record<string, unknown>;
}

export function ContextPanel({
  context,
  currentState,
}: ContextPanelProps): React.JSX.Element {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
          Current State
        </div>
        <div className="font-mono bg-gray-100 p-2 rounded">
          {typeof currentState === "string"
            ? currentState
            : JSON.stringify(currentState, null, 2)}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
          Context
        </div>
        <pre className="font-mono bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(context, null, 2)}
        </pre>
      </div>
    </div>
  );
}
