import type React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HistoryControlsProps {
  onBack: () => void;
  onForward: () => void;
  onReset: () => void;
  onResetLayout: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function HistoryControls({
  onBack,
  onForward,
  onReset,
  onResetLayout,
  canGoBack,
  canGoForward,
}: HistoryControlsProps): React.JSX.Element {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              disabled={!canGoBack}
              title="Back (←)"
            >
              ← Back
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back (←)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={onForward}
              disabled={!canGoForward}
              title="Forward (→)"
            >
              Forward →
            </Button>
          </TooltipTrigger>
          <TooltipContent>Forward (→)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="destructive" onClick={onReset} title="Reset (R)">
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset (R)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="outline" onClick={onResetLayout} title="Reset Layout">
              Layout
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Layout</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
