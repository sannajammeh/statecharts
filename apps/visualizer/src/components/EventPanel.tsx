import type React from "react";

interface AvailableEvent {
  event: string;
  guard: string | null;
  target: string;
}

interface EventPanelProps {
  events: AvailableEvent[];
  onSend: (event: string) => void;
}

export function EventPanel({ events, onSend }: EventPanelProps): React.JSX.Element {
  if (events.length === 0) {
    return (
      <div className="p-3 bg-gray-100 rounded text-sm text-gray-500">
        No available events
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-600 uppercase">
        Available Events
      </div>
      <div className="flex flex-wrap gap-2">
        {events.map((e) => (
          <button
            key={`${e.event}-${e.target}`}
            type="button"
            onClick={() => onSend(e.event)}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors font-mono"
          >
            {e.event}
            {e.guard && (
              <span className="text-blue-200 ml-1">[{e.guard}]</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
