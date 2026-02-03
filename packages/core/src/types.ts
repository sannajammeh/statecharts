// Utility types
export type StringKeys<T> = Extract<keyof T, string>;
export type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

// Context and event types
export type AnyContext = Record<string, unknown>;

export interface BaseEvent {
  type: string;
}

export type EventPayload<E extends BaseEvent, T extends E['type']> = Extract<E, { type: T }>;

// Action and guard types
export type Action<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> = (
  context: TContext,
  event: TEvent
) => Partial<TContext> | void;

export type Actions<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> =
  | Action<TContext, TEvent>
  | Action<TContext, TEvent>[];

export type Guard<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> = (
  context: TContext,
  event: TEvent
) => boolean;

// Transition types
export interface TransitionObject<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> {
  target?: string;
  guard?: Guard<TContext, TEvent>;
  action?: Action<TContext, TEvent>;
}

export type TransitionConfig<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> =
  | string
  | TransitionObject<TContext, TEvent>
  | TransitionObject<TContext, TEvent>[];

// Invoke types
export interface Subscription {
  unsubscribe: () => void;
}

export interface SubscriptionSource<T> {
  subscribe: (observer: { next: (value: T) => void; error?: (err: unknown) => void }) => Subscription;
}

export type InvokeFn<TContext extends AnyContext> = (
  context: TContext
) => Promise<unknown> | SubscriptionSource<unknown>;

export interface InvokeHandlers<TContext extends AnyContext> {
  onDone?: TransitionConfig<TContext, BaseEvent & { data: unknown }>;
  onError?: TransitionConfig<TContext, BaseEvent & { error: unknown }>;
}

// State node type
export interface StateNode<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> {
  entry?: Actions<TContext, TEvent>;
  exit?: Actions<TContext, TEvent>;
  on?: Record<string, TransitionConfig<TContext, TEvent>>;
  after?: Record<number, TransitionConfig<TContext, TEvent>>;
  invoke?: InvokeFn<TContext>;
  onDone?: TransitionConfig<TContext, BaseEvent & { data: unknown }>;
  onError?: TransitionConfig<TContext, BaseEvent & { error: unknown }>;
  initial?: string;
  states?: Record<string, StateNode<TContext, TEvent>>;
  parallel?: Record<string, { initial: string; states: Record<string, StateNode<TContext, TEvent>> }>;
  final?: boolean;
}

// Chart definition type
export interface ChartDefinition<
  TContext extends AnyContext,
  TEvent extends BaseEvent = BaseEvent
> {
  id?: string;
  context: TContext;
  initial: string;
  states: Record<string, StateNode<TContext, TEvent>>;
  events?: TEvent;
}

// State value types
export type StateValue = string | { [key: string]: StateValue };

// State snapshot type (interface for class)
export interface IStateSnapshot<TContext extends AnyContext> {
  readonly value: StateValue;
  readonly context: Readonly<TContext>;
  readonly done: boolean;
  readonly path: readonly string[];
  readonly timestamp: number;
  matches(stateValue: string): boolean;
}

// Chart instance type
export interface ChartInstance<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> {
  readonly state: IStateSnapshot<TContext>;
  send(event: TEvent | TEvent['type']): void;
  subscribe(listener: (state: IStateSnapshot<TContext>) => void): () => void;
  onTransition(listener: (event: TEvent) => void): () => void;
  stop(): void;
}

// Chart type
export interface Chart<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent> {
  readonly definition: ChartDefinition<TContext, TEvent>;
  start(initialContext?: Partial<TContext>): ChartInstance<TContext, TEvent>;
}
