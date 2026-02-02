import type {
  AnyContext,
  BaseEvent,
  TransitionConfig,
  TransitionObject,
} from './types.js';

export interface ResolvedTransition<TContext extends AnyContext, TEvent extends BaseEvent> {
  target: string | undefined;
  actions: ((context: TContext, event: TEvent) => Partial<TContext> | void)[];
}

export function resolveTransition<TContext extends AnyContext, TEvent extends BaseEvent>(
  config: TransitionConfig<TContext, TEvent>,
  context: TContext,
  event: TEvent
): ResolvedTransition<TContext, TEvent> | null {
  // String shorthand
  if (typeof config === 'string') {
    return { target: config, actions: [] };
  }

  // Array - first match wins
  if (Array.isArray(config)) {
    for (const item of config) {
      const result = resolveTransitionObject(item, context, event);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }

  // Object form
  return resolveTransitionObject(config, context, event);
}

function resolveTransitionObject<TContext extends AnyContext, TEvent extends BaseEvent>(
  config: TransitionObject<TContext, TEvent>,
  context: TContext,
  event: TEvent
): ResolvedTransition<TContext, TEvent> | null {
  // Check guard
  if (config.guard && !config.guard(context, event)) {
    return null;
  }

  return {
    target: config.target,
    actions: config.action ? [config.action] : [],
  };
}
