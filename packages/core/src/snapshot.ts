import type { AnyContext, IStateSnapshot, StateValue } from './types.js';

export class StateSnapshot<TContext extends AnyContext> implements IStateSnapshot<TContext> {
  readonly value: StateValue;
  readonly context: Readonly<TContext>;
  readonly done: boolean;
  readonly path: readonly string[];
  readonly timestamp: number;

  constructor(
    value: StateValue,
    context: TContext,
    done: boolean,
    path: readonly string[],
    timestamp?: number
  ) {
    this.value = value;
    this.context = Object.freeze({ ...context }) as Readonly<TContext>;
    this.done = done;
    this.path = Object.freeze([...path]) as readonly string[];
    this.timestamp = timestamp ?? Date.now();
  }

  matches(stateValue: string): boolean {
    const parts = stateValue.split('.');

    // For flat states
    if (typeof this.value === 'string') {
      return parts.length === 1 && this.value === parts[0];
    }

    // For nested/parallel states - check if path includes all parts
    return this.matchesPath(parts, 0);
  }

  private matchesPath(parts: string[], index: number): boolean {
    if (index >= parts.length) return true;

    const part = parts[index];
    if (part === undefined) return true;

    // Check if this part exists in our path
    return this.path.includes(part) && this.matchesPath(parts, index + 1);
  }
}
