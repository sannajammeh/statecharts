export interface ExportedTransition {
  target: string;
  guard: string | null;
  actions: string[];
}

export interface ExportedStateNode {
  type?: "atomic" | "compound" | "parallel" | "final";
  initial?: string;
  states?: Record<string, ExportedStateNode>;
  on?: Record<string, ExportedTransition | ExportedTransition[]>;
  entry?: string[];
  exit?: string[];
}

export interface ExportedChart {
  version: number;
  id: string;
  initial: string;
  context: unknown;
  states: Record<string, ExportedStateNode>;
}

export interface SimulationState {
  value: string | Record<string, unknown>;
  context: unknown;
  event: string | null;
}

export interface VisualizerProps {
  chart: ExportedChart;
  theme?: "light" | "dark";
  className?: string;
  onStateChange?: (state: SimulationState) => void;
}
