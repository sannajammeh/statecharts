import { useCallback, useMemo, useState } from "react";
import type { ExportedChart, ExportedStateNode, ExportedTransition, SimulationState } from "../types";

interface HistoryEntry {
  value: string;
  context: unknown;
  event: string | null;
}

interface AvailableEvent {
  event: string;
  guard: string | null;
  target: string;
}

interface UseSimulationResult {
  currentState: SimulationState;
  activeStates: Set<string>;
  availableEvents: AvailableEvent[];
  send: (event: string) => void;
  back: () => void;
  forward: () => void;
  reset: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function useSimulation(
  chart: ExportedChart,
  onStateChange?: (state: SimulationState) => void
): UseSimulationResult {
  const initialState: HistoryEntry = useMemo(
    () => ({
      value: chart.initial,
      context: chart.context,
      event: null,
    }),
    [chart]
  );

  const [history, setHistory] = useState<HistoryEntry[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentEntry = history[historyIndex] ?? initialState;

  const currentState: SimulationState = {
    value: currentEntry.value,
    context: currentEntry.context,
    event: currentEntry.event,
  };

  const activeStates = useMemo(() => {
    const states = new Set<string>();
    const value = currentEntry.value;

    if (typeof value === "string") {
      states.add(value);
      const parts = value.split(".");
      let path = "";
      for (const part of parts) {
        path = path ? `${path}.${part}` : part;
        states.add(path);
      }
    }

    return states;
  }, [currentEntry.value]);

  const availableEvents = useMemo(() => {
    const events: AvailableEvent[] = [];
    const statePath = typeof currentEntry.value === "string" ? currentEntry.value : "";

    function getStateAtPath(path: string): ExportedStateNode | null {
      const parts = path.split(".");
      let current: ExportedStateNode | undefined = chart.states[parts[0] ?? ""];

      for (let i = 1; i < parts.length; i++) {
        if (!current?.states) return null;
        current = current.states[parts[i] ?? ""];
      }

      return current ?? null;
    }

    const state = getStateAtPath(statePath);
    if (state?.on) {
      for (const [event, transitions] of Object.entries(state.on)) {
        const transitionList = Array.isArray(transitions)
          ? transitions
          : [transitions];

        for (const transition of transitionList) {
          events.push({
            event,
            guard: transition.guard,
            target: transition.target,
          });
        }
      }
    }

    return events;
  }, [currentEntry.value, chart]);

  const send = useCallback(
    (event: string) => {
      const eventInfo = availableEvents.find((e) => e.event === event);
      if (!eventInfo) return;

      const newState: HistoryEntry = {
        value: eventInfo.target,
        context: currentEntry.context,
        event,
      };

      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState]);
      setHistoryIndex((i) => i + 1);
      onStateChange?.(newState);
    },
    [availableEvents, currentEntry.context, historyIndex, onStateChange]
  );

  const back = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      const prevState = history[historyIndex - 1];
      if (prevState) {
        onStateChange?.(prevState);
      }
    }
  }, [historyIndex, history, onStateChange]);

  const forward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      const nextState = history[historyIndex + 1];
      if (nextState) {
        onStateChange?.(nextState);
      }
    }
  }, [historyIndex, history, onStateChange]);

  const reset = useCallback(() => {
    setHistory([initialState]);
    setHistoryIndex(0);
    onStateChange?.(initialState);
  }, [initialState, onStateChange]);

  return {
    currentState,
    activeStates,
    availableEvents,
    send,
    back,
    forward,
    reset,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < history.length - 1,
  };
}
