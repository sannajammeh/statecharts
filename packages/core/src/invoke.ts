import type { AnyContext, InvokeFn, Subscription, SubscriptionSource } from './types.js';

export interface InvokeController {
  cancel(): void;
}

function isSubscriptionSource(value: unknown): value is SubscriptionSource<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'subscribe' in value &&
    typeof (value as SubscriptionSource<unknown>).subscribe === 'function'
  );
}

export function startInvoke<TContext extends AnyContext>(
  invokeFn: InvokeFn<TContext>,
  context: TContext,
  onDone: (data: unknown) => void,
  onError: (error: unknown) => void
): InvokeController {
  let cancelled = false;
  let subscription: Subscription | null = null;

  try {
    const result = invokeFn(context);

    if (isSubscriptionSource(result)) {
      // Subscription-based invoke
      subscription = result.subscribe({
        next: (value) => {
          if (!cancelled) {
            onDone(value);
          }
        },
        error: (err) => {
          if (!cancelled) {
            onError(err);
          }
        },
      });
    } else {
      // Promise-based invoke
      result
        .then((data) => {
          if (!cancelled) {
            onDone(data);
          }
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            onError(error);
          }
        });
    }
  } catch (error) {
    if (!cancelled) {
      onError(error);
    }
  }

  return {
    cancel() {
      cancelled = true;
      if (subscription) {
        subscription.unsubscribe();
      }
    },
  };
}
