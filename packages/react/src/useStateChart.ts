import { useSyncExternalStore, useRef, useCallback } from "react";
import type {
  Chart,
  ChartInstance,
  IStateSnapshot,
  BaseEvent,
  AnyContext,
} from "statecharts.sh";

/**
 * Options for useStateChart hook
 */
export interface UseStateChartOptions<
  TContext extends AnyContext,
  _TEvent extends BaseEvent = BaseEvent,
> {
  /** Override initial context when starting from a Chart (ignored for ChartInstance) */
  initialContext?: Partial<TContext>;
  /** Callback invoked after each state transition */
  onTransition?: (
    prev: IStateSnapshot<TContext>,
    next: IStateSnapshot<TContext>
  ) => void;
}

/**
 * Return type of useStateChart hook
 */
export interface UseStateChartReturn<
  TContext extends AnyContext,
  TEvent extends BaseEvent = BaseEvent,
> {
  /** Current state snapshot */
  state: IStateSnapshot<TContext>;
  /** Send an event to the state machine */
  send: (event: TEvent | TEvent["type"]) => void;
  /** Check if current state matches the given state value */
  matches: (stateValue: string) => boolean;
}

/**
 * Type guard to check if input is a Chart (has start method) vs ChartInstance
 */
function isChart<TContext extends AnyContext, TEvent extends BaseEvent>(
  chartOrInstance: Chart<TContext, TEvent> | ChartInstance<TContext, TEvent>
): chartOrInstance is Chart<TContext, TEvent> {
  return "start" in chartOrInstance && typeof chartOrInstance.start === "function";
}

/**
 * React hook for using a statechart in a component.
 *
 * Accepts either a Chart (creates instance on mount, stops on unmount)
 * or a ChartInstance (subscribes only, caller owns lifecycle).
 *
 * @example
 * ```tsx
 * // Component-local instance
 * const { state, send, matches } = useStateChart(myChart);
 *
 * // Shared instance (caller manages lifecycle)
 * const instance = myChart.start();
 * const { state, send, matches } = useStateChart(instance);
 * ```
 */
export function useStateChart<
  TContext extends AnyContext,
  TEvent extends BaseEvent = BaseEvent,
>(
  chartOrInstance: Chart<TContext, TEvent> | ChartInstance<TContext, TEvent>,
  options?: UseStateChartOptions<TContext, TEvent>
): UseStateChartReturn<TContext, TEvent> {
  const onTransitionRef = useRef(options?.onTransition);
  onTransitionRef.current = options?.onTransition;

  // Track whether we own the instance (created it ourselves)
  const instanceRef = useRef<{
    instance: ChartInstance<TContext, TEvent>;
    owned: boolean;
  } | null>(null);

  // Lazily initialize instance
  if (instanceRef.current === null) {
    if (isChart(chartOrInstance)) {
      instanceRef.current = {
        instance: chartOrInstance.start(options?.initialContext),
        owned: true,
      };
    } else {
      instanceRef.current = {
        instance: chartOrInstance,
        owned: false,
      };
    }
  }

  const { instance, owned } = instanceRef.current;

  // Store previous state for onTransition callback
  const prevStateRef = useRef<IStateSnapshot<TContext>>(instance.state);

  // Subscribe function for useSyncExternalStore
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubscribe = instance.subscribe((newState: IStateSnapshot<TContext>) => {
        const prevState = prevStateRef.current;
        prevStateRef.current = newState;

        // Call onTransition if state actually changed
        if (prevState !== newState && onTransitionRef.current) {
          onTransitionRef.current(prevState, newState);
        }

        onStoreChange();
      });

      // Cleanup: unsubscribe always, stop only if we own the instance
      return () => {
        unsubscribe();
        if (owned) {
          instance.stop();
        }
      };
    },
    [instance, owned]
  );

  // Get current snapshot
  const getSnapshot = useCallback(() => instance.state, [instance]);

  // Server snapshot for SSR
  const getServerSnapshot = useCallback(() => instance.state, [instance]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Stable send reference - instance.send is already bound
  const send = useCallback(
    (event: TEvent | TEvent["type"]) => instance.send(event),
    [instance]
  );

  // Convenience matches function
  const matches = useCallback(
    (stateValue: string) => state.matches(stateValue),
    [state]
  );

  return { state, send, matches };
}
