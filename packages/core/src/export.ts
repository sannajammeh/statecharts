import type {
  AnyContext,
  BaseEvent,
  ChartDefinition,
  ExportedChart,
  ExportedStateNode,
  ExportedTransition,
  StateNode,
  TransitionConfig,
  Actions,
} from './types.js';

function getFunctionName(fn: Function): string {
  return fn.name || 'anonymous';
}

function exportActions<TContext extends AnyContext, TEvent extends BaseEvent>(
  actions: Actions<TContext, TEvent> | undefined
): string[] {
  if (!actions) return [];
  const list = Array.isArray(actions) ? actions : [actions];
  return list.map(getFunctionName);
}

function exportTransition<TContext extends AnyContext, TEvent extends BaseEvent>(
  config: TransitionConfig<TContext, TEvent>
): ExportedTransition | ExportedTransition[] {
  if (typeof config === 'string') {
    return { target: config, guard: null, actions: [] };
  }

  if (Array.isArray(config)) {
    return config.map((item) => ({
      target: item.target,
      guard: item.guard ? getFunctionName(item.guard) : null,
      actions: item.action ? [getFunctionName(item.action)] : [],
    }));
  }

  return {
    target: config.target,
    guard: config.guard ? getFunctionName(config.guard) : null,
    actions: config.action ? [getFunctionName(config.action)] : [],
  };
}

function exportStateNode<TContext extends AnyContext, TEvent extends BaseEvent>(
  node: StateNode<TContext, TEvent>
): ExportedStateNode {
  const exported: ExportedStateNode = {
    entry: exportActions(node.entry),
    exit: exportActions(node.exit),
    on: {},
  };

  if (node.on) {
    for (const [eventType, transition] of Object.entries(node.on)) {
      exported.on[eventType] = exportTransition(transition as TransitionConfig<TContext, TEvent>);
    }
  }

  if (node.after) {
    exported.after = {};
    for (const [delay, transition] of Object.entries(node.after)) {
      exported.after[Number(delay)] = exportTransition(transition as TransitionConfig<TContext, TEvent>);
    }
  }

  if (node.invoke) {
    exported.invoke = getFunctionName(node.invoke);
  }

  if (node.onDone) {
    exported.onDone = exportTransition(node.onDone as TransitionConfig<TContext, TEvent>);
  }

  if (node.onError) {
    exported.onError = exportTransition(node.onError as TransitionConfig<TContext, TEvent>);
  }

  if (node.initial) {
    exported.initial = node.initial;
  }

  if (node.states) {
    exported.states = {};
    for (const [name, childNode] of Object.entries(node.states)) {
      exported.states[name] = exportStateNode(childNode);
    }
  }

  if (node.parallel) {
    exported.parallel = {};
    for (const [regionName, region] of Object.entries(node.parallel)) {
      exported.parallel[regionName] = {
        initial: region.initial,
        states: {},
      };
      for (const [stateName, stateNode] of Object.entries(region.states)) {
        exported.parallel[regionName]!.states[stateName] = exportStateNode(stateNode);
      }
    }
  }

  if (node.final) {
    exported.final = true;
  }

  return exported;
}

export function exportChartLegacy<TContext extends AnyContext, TEvent extends BaseEvent>(
  definition: ChartDefinition<TContext, TEvent>
): ExportedChart {
  const states: Record<string, ExportedStateNode> = {};

  for (const [name, node] of Object.entries(definition.states)) {
    states[name] = exportStateNode(node);
  }

  return {
    version: 1,
    id: definition.id ?? 'chart',
    initial: definition.initial,
    context: definition.context,
    states,
  };
}
