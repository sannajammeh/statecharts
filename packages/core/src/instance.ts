import type {
  Actions,
  AnyContext,
  BaseEvent,
  ChartDefinition,
  ChartInstance,
  IStateSnapshot,
  StateNode,
  StateValue,
  TransitionConfig,
} from './types.js';
import { StateSnapshot } from './snapshot.js';
import { resolveTransition } from './transition.js';
import { startInvoke, type InvokeController } from './invoke.js';

interface ActiveState {
  path: string[];
  timers: ReturnType<typeof setTimeout>[];
  invokes: InvokeController[];
}

export function createInstance<TContext extends AnyContext, TEvent extends BaseEvent>(
  definition: ChartDefinition<TContext, TEvent>,
  initialContextOverride?: Partial<TContext>
): ChartInstance<TContext, TEvent> {
  let context: TContext = initialContextOverride
    ? { ...definition.context, ...initialContextOverride }
    : { ...definition.context };

  let stopped = false;
  const subscribers: Set<(state: IStateSnapshot<TContext>) => void> = new Set();
  const transitionListeners: Set<(event: TEvent) => void> = new Set();
  const activeStates: ActiveState[] = [];

  // Build initial state
  const initialPath = buildInitialPath(definition.states, definition.initial);
  let currentSnapshot = createSnapshot(initialPath);

  // Enter initial states
  enterStates(initialPath);

  function createSnapshot(path: string[]): StateSnapshot<TContext> {
    const value = pathToValue(path);
    const done = isPathFinal(path);
    return new StateSnapshot(value, context, done, path);
  }

  function pathToValue(path: string[]): StateValue {
    if (path.length === 0) return '';
    if (path.length === 1) return path[0]!;

    // Build nested object
    let result: StateValue = path[path.length - 1]!;
    for (let i = path.length - 2; i >= 0; i--) {
      result = { [path[i]!]: result };
    }
    return result;
  }

  function buildInitialPath(
    states: Record<string, StateNode<TContext, TEvent>>,
    initial: string
  ): string[] {
    const path: string[] = [initial];
    let current = states[initial];

    while (current) {
      if (current.initial && current.states) {
        path.push(current.initial);
        current = current.states[current.initial];
      } else if (current.parallel) {
        // For parallel states, we handle differently
        break;
      } else {
        break;
      }
    }

    return path;
  }

  function getStateNodeAtPath(path: string[]): StateNode<TContext, TEvent> | undefined {
    if (path.length === 0) return undefined;

    let current: StateNode<TContext, TEvent> | undefined = definition.states[path[0]!];
    for (let i = 1; i < path.length && current; i++) {
      current = current.states?.[path[i]!];
    }
    return current;
  }

  function isPathFinal(path: string[]): boolean {
    const node = getStateNodeAtPath(path);
    return node?.final === true;
  }

  function executeActions(
    actions: Actions<TContext, TEvent> | undefined,
    event: TEvent
  ): void {
    if (!actions) return;

    const actionList = Array.isArray(actions) ? actions : [actions];
    for (const action of actionList) {
      const result = action(context, event);
      if (result) {
        context = { ...context, ...result };
      }
    }
  }

  function enterStates(path: string[]): void {
    const activeState: ActiveState = {
      path: [...path],
      timers: [],
      invokes: [],
    };
    activeStates.push(activeState);

    // Enter each state in path
    for (let i = 0; i < path.length; i++) {
      const currentPath = path.slice(0, i + 1);
      const node = getStateNodeAtPath(currentPath);
      if (!node) continue;

      // Execute entry actions
      executeActions(node.entry, { type: '__entry__' } as TEvent);

      // Setup delayed transitions
      if (node.after) {
        for (const [delayStr, transitionConfig] of Object.entries(node.after)) {
          const delay = Number(delayStr);
          const timer = setTimeout(() => {
            if (stopped) return;
            handleDelayedTransition(currentPath, transitionConfig as TransitionConfig<TContext, TEvent>);
          }, delay);
          activeState.timers.push(timer);
        }
      }

      // Start invocations
      if (node.invoke) {
        const controller = startInvoke(
          node.invoke,
          context,
          (data) => {
            if (stopped) return;
            if (node.onDone) {
              const doneEvent = { type: '__invoke_done__', data } as TEvent & { data: unknown };
              handleInvokeResult(currentPath, node.onDone as TransitionConfig<TContext, TEvent>, doneEvent);
            }
          },
          (error) => {
            if (stopped) return;
            if (node.onError) {
              const errorEvent = { type: '__invoke_error__', error } as TEvent & { error: unknown };
              handleInvokeResult(currentPath, node.onError as TransitionConfig<TContext, TEvent>, errorEvent);
            }
          }
        );
        activeState.invokes.push(controller);
      }
    }
  }

  function exitStates(path: string[]): void {
    const activeIndex = activeStates.findIndex(
      (a) => a.path.join('.') === path.join('.')
    );
    if (activeIndex === -1) return;

    const activeState = activeStates[activeIndex]!;

    // Clear timers
    for (const timer of activeState.timers) {
      clearTimeout(timer);
    }

    // Cancel invokes
    for (const invoke of activeState.invokes) {
      invoke.cancel();
    }

    // Execute exit actions (in reverse order)
    for (let i = path.length - 1; i >= 0; i--) {
      const currentPath = path.slice(0, i + 1);
      const node = getStateNodeAtPath(currentPath);
      if (node?.exit) {
        executeActions(node.exit, { type: '__exit__' } as TEvent);
      }
    }

    activeStates.splice(activeIndex, 1);
  }

  function handleDelayedTransition(
    fromPath: string[],
    config: TransitionConfig<TContext, TEvent>
  ): void {
    const syntheticEvent = { type: '__after__' } as TEvent;
    const resolved = resolveTransition(config, context, syntheticEvent);

    if (resolved) {
      performTransition(fromPath, resolved.target, resolved.actions, syntheticEvent);
    }
  }

  function handleInvokeResult(
    fromPath: string[],
    config: TransitionConfig<TContext, TEvent>,
    event: TEvent
  ): void {
    const resolved = resolveTransition(config, context, event);

    if (resolved) {
      performTransition(fromPath, resolved.target, resolved.actions, event);
    }
  }

  function performTransition(
    fromPath: string[],
    target: string | undefined,
    actions: ((ctx: TContext, ev: TEvent) => Partial<TContext> | void)[],
    event: TEvent
  ): void {
    if (stopped) return;

    // Calculate the paths to exit and enter
    const targetPath = resolveTargetPath(fromPath, target);

    // Find common ancestor
    const commonLength = findCommonAncestorLength(fromPath, targetPath);
    const exitPath = fromPath;
    const enterPath = targetPath;

    // Exit current states (from leaf to common ancestor)
    exitStates(exitPath);

    // Execute transition actions
    for (const action of actions) {
      const result = action(context, event);
      if (result) {
        context = { ...context, ...result };
      }
    }

    // Enter new states
    enterStates(enterPath);

    // Update snapshot and notify
    currentSnapshot = createSnapshot(enterPath);
    notifySubscribers();
  }

  function resolveTargetPath(fromPath: string[], target: string | undefined): string[] {
    if (!target) {
      // Self-transition - re-enter current state
      return [...fromPath];
    }

    // Handle absolute reference (#id.state)
    if (target.startsWith('#')) {
      const parts = target.slice(1).split('.');
      // First part should be chart id, rest is path
      if (parts[0] === definition.id) {
        return parts.slice(1);
      }
      // Just use the path after #
      return parts;
    }

    // Handle relative target - find sibling state
    // The target should be a sibling of the deepest state that has that transition
    const parentPath = fromPath.slice(0, -1);
    const targetPath = [...parentPath, target];

    // Build full path including nested initial states
    return buildFullPath(targetPath);
  }

  function buildFullPath(basePath: string[]): string[] {
    const path = [...basePath];
    let node = getStateNodeAtPath(path);

    while (node) {
      if (node.initial && node.states) {
        path.push(node.initial);
        node = node.states[node.initial];
      } else {
        break;
      }
    }

    return path;
  }

  function findCommonAncestorLength(path1: string[], path2: string[]): number {
    let i = 0;
    while (i < path1.length && i < path2.length && path1[i] === path2[i]) {
      i++;
    }
    return i;
  }

  function findTransitionHandler(
    path: string[],
    eventType: string
  ): { path: string[]; config: TransitionConfig<TContext, TEvent> } | null {
    // Search from leaf to root (event bubbling)
    for (let i = path.length; i > 0; i--) {
      const currentPath = path.slice(0, i);
      const node = getStateNodeAtPath(currentPath);

      if (node?.on?.[eventType]) {
        return { path: currentPath, config: node.on[eventType] as TransitionConfig<TContext, TEvent> };
      }
    }

    return null;
  }

  function notifySubscribers(): void {
    for (const subscriber of subscribers) {
      subscriber(currentSnapshot);
    }
  }

  function send(event: TEvent | TEvent['type']): void {
    if (stopped) return;

    const normalizedEvent: TEvent =
      typeof event === 'string' ? ({ type: event } as TEvent) : event;

    // Notify transition listeners
    for (const listener of transitionListeners) {
      listener(normalizedEvent);
    }

    // Find handler
    const handler = findTransitionHandler(currentSnapshot.path as string[], normalizedEvent.type);
    if (!handler) return;

    const resolved = resolveTransition(handler.config, context, normalizedEvent);
    if (!resolved) return;

    performTransition(
      handler.path,
      resolved.target,
      resolved.actions,
      normalizedEvent
    );
  }

  function subscribe(
    listener: (state: IStateSnapshot<TContext>) => void
  ): () => void {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  }

  function onTransition(listener: (event: TEvent) => void): () => void {
    transitionListeners.add(listener);
    return () => {
      transitionListeners.delete(listener);
    };
  }

  function stop(): void {
    stopped = true;

    // Clean up all active states
    for (const activeState of [...activeStates]) {
      for (const timer of activeState.timers) {
        clearTimeout(timer);
      }
      for (const invoke of activeState.invokes) {
        invoke.cancel();
      }
    }
    activeStates.length = 0;

    // Notify subscribers one final time
    notifySubscribers();
  }

  return {
    get state() {
      return currentSnapshot;
    },
    send,
    subscribe,
    onTransition,
    stop,
  };
}
