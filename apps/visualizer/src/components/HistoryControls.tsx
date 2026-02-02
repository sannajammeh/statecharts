import type React from "react";

interface HistoryControlsProps {
  onBack: () => void;
  onForward: () => void;
  onReset: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function HistoryControls({
  onBack,
  onForward,
  onReset,
  canGoBack,
  canGoForward,
}: HistoryControlsProps): React.JSX.Element {
  const buttonBase =
    "px-3 py-1.5 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className={`${buttonBase} bg-gray-200 hover:bg-gray-300`}
        title="Back (←)"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canGoForward}
        className={`${buttonBase} bg-gray-200 hover:bg-gray-300`}
        title="Forward (→)"
      >
        Forward →
      </button>
      <button
        type="button"
        onClick={onReset}
        className={`${buttonBase} bg-red-100 text-red-700 hover:bg-red-200`}
        title="Reset (R)"
      >
        Reset
      </button>
    </div>
  );
}
