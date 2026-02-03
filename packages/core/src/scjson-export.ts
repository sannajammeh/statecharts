// SCJSON Export Implementation
// Converts ChartDefinition to SCJSON (JSON translation of SCXML)

import type {
  DataElement,
  DatamodelElement,
  ExecutableContent,
  FinalElement,
  InvokeElement,
  OnentryElement,
  OnexitElement,
  ParallelElement,
  SCJSONDocument,
  SCXMLChild,
  ScriptElement,
  SendElement,
  StateChild,
  StateElement,
  TransitionElement,
} from "./scjson-types.js";
import type {
  Action,
  AnyContext,
  BaseEvent,
  ChartDefinition,
  StateNode,
  TransitionConfig,
  TransitionObject,
} from "./types.js";

// biome-ignore lint/complexity/noBannedTypes: need generic function type for name extraction
type AnyFunction = Function;

/**
 * Gets the name of a function for serialization.
 */
function getFunctionName(fn: AnyFunction): string {
  return fn.name || "anonymous";
}

/**
 * Serializes an action function as executable content.
 * Actions are serialized as script elements calling the function.
 */
function serializeAction<TContext extends AnyContext, TEvent extends BaseEvent>(
  action: Action<TContext, TEvent>
): ScriptElement {
  const name = getFunctionName(action);
  return {
    $type: "script",
    $text: `${name}(context, event)`,
  };
}

/**
 * Serializes actions into executable content array.
 */
function serializeActions<TContext extends AnyContext, TEvent extends BaseEvent>(
  actions: Action<TContext, TEvent> | Action<TContext, TEvent>[] | undefined
): ExecutableContent[] {
  if (!actions) return [];
  const list = Array.isArray(actions) ? actions : [actions];
  return list.map(serializeAction);
}

/**
 * Serializes a guard function as a condition expression.
 */
function serializeGuard<TContext extends AnyContext, TEvent extends BaseEvent>(
  guard: ((context: TContext, event: TEvent) => boolean) | undefined
): string | undefined {
  if (!guard) return undefined;
  const name = getFunctionName(guard);
  return `${name}(context, event)`;
}

/**
 * Exports a single transition configuration to SCJSON transition element(s).
 */
function exportTransitionConfig<TContext extends AnyContext, TEvent extends BaseEvent>(
  event: string | undefined,
  config: TransitionConfig<TContext, TEvent>
): TransitionElement[] {
  // String shorthand: { on: { EVENT: "target" } }
  if (typeof config === "string") {
    return [
      {
        $type: "transition",
        event,
        target: config,
      },
    ];
  }

  // Array of transition objects (guarded transitions)
  if (Array.isArray(config)) {
    return config.map((item) => ({
      $type: "transition" as const,
      event,
      target: item.target,
      cond: serializeGuard(item.guard),
      children: item.action ? [serializeAction(item.action)] : undefined,
    }));
  }

  // Single transition object
  const obj = config as TransitionObject<TContext, TEvent>;
  return [
    {
      $type: "transition",
      event,
      target: obj.target,
      cond: serializeGuard(obj.guard),
      children: obj.action ? [serializeAction(obj.action)] : undefined,
    },
  ];
}

/**
 * Creates onentry element from entry actions.
 */
function exportOnentry<TContext extends AnyContext, TEvent extends BaseEvent>(
  entry: Action<TContext, TEvent> | Action<TContext, TEvent>[] | undefined
): OnentryElement | undefined {
  const actions = serializeActions(entry);
  if (actions.length === 0) return undefined;
  return {
    $type: "onentry",
    children: actions,
  };
}

/**
 * Creates onexit element from exit actions.
 */
function exportOnexit<TContext extends AnyContext, TEvent extends BaseEvent>(
  exit: Action<TContext, TEvent> | Action<TContext, TEvent>[] | undefined
): OnexitElement | undefined {
  const actions = serializeActions(exit);
  if (actions.length === 0) return undefined;
  return {
    $type: "onexit",
    children: actions,
  };
}

/**
 * Generates a unique delayed event name for a state.
 */
function delayedEventName(stateId: string, delay: number): string {
  return `__delay.${stateId}.${delay}`;
}

/**
 * Exports delayed transitions (after) to SCXML send + transition pattern.
 * Delayed transitions in SCXML use:
 * - onentry: <send> with delay to fire an internal event
 * - transition: listens for the delayed event
 */
function exportDelayedTransitions<TContext extends AnyContext, TEvent extends BaseEvent>(
  stateId: string,
  after: Record<number, TransitionConfig<TContext, TEvent>> | undefined
): { sends: SendElement[]; transitions: TransitionElement[] } {
  const sends: SendElement[] = [];
  const transitions: TransitionElement[] = [];

  if (!after) return { sends, transitions };

  for (const [delayStr, config] of Object.entries(after)) {
    const delay = Number(delayStr);
    const eventName = delayedEventName(stateId, delay);

    // Create send element for onentry
    sends.push({
      $type: "send",
      event: eventName,
      delay: `${delay}ms`,
      id: `__delay_send_${stateId}_${delay}`,
    });

    // Create transitions for the delayed event
    const delayedTransitions = exportTransitionConfig(eventName, config);
    transitions.push(...delayedTransitions);
  }

  return { sends, transitions };
}

/**
 * Exports an invoke configuration to SCJSON.
 */
function exportInvoke<TContext extends AnyContext>(
  stateId: string,
  invoke: ((context: TContext) => Promise<unknown> | { subscribe: AnyFunction }) | undefined
): InvokeElement | undefined {
  if (!invoke) return undefined;

  const name = getFunctionName(invoke);
  const invokeElement: InvokeElement = {
    $type: "invoke",
    id: `${stateId}.invoke`,
    type: "ecmascript",
    src: name,
  };

  // Note: onDone/onError are handled as transitions on the state, not in invoke children
  // This matches SCXML behavior where done.invoke.* events trigger state transitions

  return invokeElement;
}

/**
 * Exports a state node to SCJSON.
 */
function exportStateNode<TContext extends AnyContext, TEvent extends BaseEvent>(
  id: string,
  node: StateNode<TContext, TEvent>,
  parentPath: string[] = []
): StateElement | ParallelElement | FinalElement {
  const currentPath = [...parentPath, id];
  const fullId = currentPath.join(".");

  // Final state
  if (node.final) {
    const finalElement: FinalElement = {
      $type: "final",
      id,
    };

    const children: (OnentryElement | OnexitElement)[] = [];
    const onentry = exportOnentry(node.entry);
    const onexit = exportOnexit(node.exit);
    if (onentry) children.push(onentry);
    if (onexit) children.push(onexit);
    if (children.length > 0) {
      finalElement.children = children;
    }

    return finalElement;
  }

  // Parallel state
  if (node.parallel) {
    const parallelElement: ParallelElement = {
      $type: "parallel",
      id,
    };

    const children: StateChild[] = [];

    // Entry/exit
    const onentry = exportOnentry(node.entry);
    const onexit = exportOnexit(node.exit);
    if (onentry) children.push(onentry);
    if (onexit) children.push(onexit);

    // Transitions
    if (node.on) {
      for (const [eventType, config] of Object.entries(node.on)) {
        const transitions = exportTransitionConfig(eventType, config);
        children.push(...transitions);
      }
    }

    // Regions as child states
    for (const [regionName, region] of Object.entries(node.parallel)) {
      const regionChildren: StateChild[] = [];

      for (const [stateName, stateNode] of Object.entries(region.states)) {
        const childState = exportStateNode(stateName, stateNode, [...currentPath, regionName]);
        regionChildren.push(childState);
      }

      const regionState: StateElement = {
        $type: "state",
        id: regionName,
        initial: region.initial,
        children: regionChildren,
      };

      children.push(regionState);
    }

    if (children.length > 0) {
      parallelElement.children = children;
    }

    return parallelElement;
  }

  // Regular state (atomic or compound)
  const stateElement: StateElement = {
    $type: "state",
    id,
  };

  // Compound state with children
  if (node.initial) {
    stateElement.initial = node.initial;
  }

  const children: StateChild[] = [];

  // Delayed transitions setup
  const { sends: delaySends, transitions: delayTransitions } = exportDelayedTransitions(
    fullId,
    node.after
  );

  // Entry actions (including delayed sends)
  const entryActions = serializeActions(node.entry);
  if (entryActions.length > 0 || delaySends.length > 0) {
    const onentryElement: OnentryElement = {
      $type: "onentry",
      children: [...entryActions, ...delaySends],
    };
    children.push(onentryElement);
  }

  // Exit actions
  const onexit = exportOnexit(node.exit);
  if (onexit) children.push(onexit);

  // Regular transitions
  if (node.on) {
    for (const [eventType, config] of Object.entries(node.on)) {
      const transitions = exportTransitionConfig(eventType, config);
      children.push(...transitions);
    }
  }

  // Delayed transitions
  children.push(...delayTransitions);

  // Invoke
  const invokeElement = exportInvoke(fullId, node.invoke);
  if (invokeElement) {
    children.push(invokeElement);
  }

  // onDone transition (for invoke completion)
  if (node.onDone) {
    const doneEvent = `done.invoke.${fullId}.invoke`;
    const doneTransitions = exportTransitionConfig(
      doneEvent,
      node.onDone as TransitionConfig<TContext, TEvent>
    );
    children.push(...doneTransitions);
  }

  // onError transition (for invoke errors)
  if (node.onError) {
    const errorEvent = `error.invoke.${fullId}.invoke`;
    const errorTransitions = exportTransitionConfig(
      errorEvent,
      node.onError as TransitionConfig<TContext, TEvent>
    );
    children.push(...errorTransitions);
  }

  // Child states
  if (node.states) {
    for (const [stateName, childNode] of Object.entries(node.states)) {
      const childState = exportStateNode(stateName, childNode, currentPath);
      children.push(childState);
    }
  }

  if (children.length > 0) {
    stateElement.children = children;
  }

  return stateElement;
}

/**
 * Exports chart context to SCJSON datamodel.
 */
function exportDatamodel<TContext extends AnyContext>(
  context: TContext
): DatamodelElement | undefined {
  const entries = Object.entries(context);
  if (entries.length === 0) return undefined;

  const dataElements: DataElement[] = entries.map(([key, value]) => ({
    $type: "data",
    id: key,
    expr: JSON.stringify(value),
  }));

  return {
    $type: "datamodel",
    children: dataElements,
  };
}

/**
 * Exports a ChartDefinition to SCJSON format.
 *
 * @param definition - The chart definition to export
 * @returns SCJSON document (JSON translation of SCXML)
 */
export function exportSCJSON<TContext extends AnyContext, TEvent extends BaseEvent>(
  definition: ChartDefinition<TContext, TEvent>
): SCJSONDocument {
  const children: SCXMLChild[] = [];

  // Datamodel from context
  const datamodel = exportDatamodel(definition.context);
  if (datamodel) {
    children.push(datamodel);
  }

  // States
  for (const [stateName, stateNode] of Object.entries(definition.states)) {
    const state = exportStateNode(stateName, stateNode);
    children.push(state);
  }

  return {
    $type: "scxml",
    version: "1.0",
    name: definition.id,
    initial: definition.initial,
    datamodel: "ecmascript",
    children,
  };
}
