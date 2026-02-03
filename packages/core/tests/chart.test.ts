import { describe, it, expect, vi } from 'vitest';
import { chart } from '../src/index.js';

describe('chart', () => {
  describe('basic toggle', () => {
    it('should create and start a basic toggle chart', () => {
      const toggle = chart({
        context: { count: 0 },
        initial: 'inactive',
        states: {
          inactive: {
            on: { TOGGLE: 'active' },
          },
          active: {
            on: { TOGGLE: 'inactive' },
          },
        },
      });

      const instance = toggle.start();

      expect(instance.state.value).toBe('inactive');
      expect(instance.state.context.count).toBe(0);

      instance.send('TOGGLE');
      expect(instance.state.value).toBe('active');

      instance.send({ type: 'TOGGLE' });
      expect(instance.state.value).toBe('inactive');
    });

    it('should support context override on start', () => {
      const toggle = chart({
        context: { count: 0 },
        initial: 'idle',
        states: { idle: {} },
      });

      const instance = toggle.start({ count: 10 });
      expect(instance.state.context.count).toBe(10);
    });
  });

  describe('async fetcher', () => {
    it('should handle promise invoke with onDone', async () => {
      const fetcher = chart({
        context: { data: null as string | null, error: null as string | null },
        initial: 'loading',
        states: {
          loading: {
            invoke: () => Promise.resolve('fetched data'),
            onDone: {
              target: 'success',
              action: (ctx, ev) => ({ data: ev.data as string }),
            },
            onError: {
              target: 'failure',
              action: (ctx, ev) => ({ error: String(ev.error) }),
            },
          },
          success: { final: true },
          failure: { final: true },
        },
      });

      const instance = fetcher.start();
      expect(instance.state.value).toBe('loading');

      // Wait for promise to resolve
      await new Promise((r) => setTimeout(r, 10));

      expect(instance.state.value).toBe('success');
      expect(instance.state.context.data).toBe('fetched data');
      expect(instance.state.done).toBe(true);
    });

    it('should handle promise invoke with onError', async () => {
      const fetcher = chart({
        context: { data: null as string | null, error: null as string | null },
        initial: 'loading',
        states: {
          loading: {
            invoke: () => Promise.reject(new Error('failed')),
            onDone: {
              target: 'success',
              action: (ctx, ev) => ({ data: ev.data as string }),
            },
            onError: {
              target: 'failure',
              action: (ctx, ev) => ({ error: String(ev.error) }),
            },
          },
          success: { final: true },
          failure: { final: true },
        },
      });

      const instance = fetcher.start();

      await new Promise((r) => setTimeout(r, 10));

      expect(instance.state.value).toBe('failure');
      expect(instance.state.context.error).toBe('Error: failed');
    });
  });

  describe('guarded transitions', () => {
    it('should allow transition when guard passes', () => {
      const m = chart({
        context: { valid: true },
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT: { target: 'submitted', guard: (ctx) => ctx.valid },
            },
          },
          submitted: {},
        },
      });

      const instance = m.start();
      instance.send('SUBMIT');
      expect(instance.state.value).toBe('submitted');
    });

    it('should block transition when guard fails', () => {
      const m = chart({
        context: { valid: false },
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT: { target: 'submitted', guard: (ctx) => ctx.valid },
            },
          },
          submitted: {},
        },
      });

      const instance = m.start();
      instance.send('SUBMIT');
      expect(instance.state.value).toBe('idle');
    });

    it('should use first-match semantics for array transitions', () => {
      const m = chart({
        context: { value: 5 },
        initial: 'idle',
        states: {
          idle: {
            on: {
              CHECK: [
                { target: 'high', guard: (ctx) => ctx.value > 10 },
                { target: 'medium', guard: (ctx) => ctx.value > 3 },
                { target: 'low' },
              ],
            },
          },
          high: {},
          medium: {},
          low: {},
        },
      });

      const instance = m.start();
      instance.send('CHECK');
      expect(instance.state.value).toBe('medium');
    });
  });

  describe('nested/hierarchical states', () => {
    it('should enter nested initial state', () => {
      const m = chart({
        context: {},
        initial: 'auth',
        states: {
          auth: {
            initial: 'signedOut',
            states: {
              signedOut: {
                on: { LOGIN: 'signedIn' },
              },
              signedIn: {
                on: { LOGOUT: 'signedOut' },
              },
            },
          },
        },
      });

      const instance = m.start();
      expect(instance.state.path).toEqual(['auth', 'signedOut']);
      expect(instance.state.matches('auth')).toBe(true);
      expect(instance.state.matches('auth.signedOut')).toBe(true);
    });

    it('should transition within nested states', () => {
      const m = chart({
        context: {},
        initial: 'auth',
        states: {
          auth: {
            initial: 'signedOut',
            states: {
              signedOut: {
                on: { LOGIN: 'signedIn' },
              },
              signedIn: {
                on: { LOGOUT: 'signedOut' },
              },
            },
          },
        },
      });

      const instance = m.start();
      instance.send('LOGIN');
      expect(instance.state.path).toEqual(['auth', 'signedIn']);
      expect(instance.state.matches('auth.signedIn')).toBe(true);
    });
  });

  describe('delayed transitions', () => {
    it('should transition after delay', async () => {
      const m = chart({
        context: {},
        initial: 'waiting',
        states: {
          waiting: {
            after: { 50: 'done' },
          },
          done: { final: true },
        },
      });

      const instance = m.start();
      expect(instance.state.value).toBe('waiting');

      await new Promise((r) => setTimeout(r, 100));
      expect(instance.state.value).toBe('done');
    });

    it('should cancel delay on early exit', async () => {
      const m = chart({
        context: {},
        initial: 'waiting',
        states: {
          waiting: {
            on: { SKIP: 'skipped' },
            after: { 100: 'timeout' },
          },
          skipped: { final: true },
          timeout: { final: true },
        },
      });

      const instance = m.start();
      instance.send('SKIP');

      await new Promise((r) => setTimeout(r, 150));
      expect(instance.state.value).toBe('skipped');
    });
  });

  describe('parallel states', () => {
    it('should support parallel region definition in types', () => {
      // Test that the type system allows parallel definitions
      const m = chart({
        context: {},
        initial: 'player',
        states: {
          player: {
            parallel: {
              playback: {
                initial: 'paused',
                states: {
                  paused: { on: { PLAY: 'playing' } },
                  playing: { on: { PAUSE: 'paused' } },
                },
              },
              volume: {
                initial: 'normal',
                states: {
                  normal: { on: { MUTE: 'muted' } },
                  muted: { on: { UNMUTE: 'normal' } },
                },
              },
            },
          },
        },
      });

      expect(m.definition.states.player?.parallel).toBeDefined();
    });
  });

  describe('entry/exit actions', () => {
    it('should execute entry actions on enter', () => {
      const m = chart({
        context: { entered: false },
        initial: 'idle',
        states: {
          idle: {
            on: { GO: 'active' },
          },
          active: {
            entry: () => ({ entered: true }),
          },
        },
      });

      const instance = m.start();
      expect(instance.state.context.entered).toBe(false);

      instance.send('GO');
      expect(instance.state.context.entered).toBe(true);
    });

    it('should execute exit actions on leave', () => {
      const m = chart({
        context: { exited: false },
        initial: 'idle',
        states: {
          idle: {
            on: { GO: 'active' },
            exit: () => ({ exited: true }),
          },
          active: {},
        },
      });

      const instance = m.start();
      instance.send('GO');
      expect(instance.state.context.exited).toBe(true);
    });

    it('should execute multiple actions in order', () => {
      const order: number[] = [];
      const m = chart({
        context: { a: 0, b: 0 },
        initial: 'idle',
        states: {
          idle: {
            on: { GO: 'active' },
          },
          active: {
            entry: [
              () => {
                order.push(1);
                return { a: 1 };
              },
              () => {
                order.push(2);
                return { b: 2 };
              },
            ],
          },
        },
      });

      const instance = m.start();
      instance.send('GO');

      expect(order).toEqual([1, 2]);
      expect(instance.state.context.a).toBe(1);
      expect(instance.state.context.b).toBe(2);
    });
  });

  describe('subscribe and onTransition', () => {
    it('should notify subscribers on state change', () => {
      const m = chart({
        context: {},
        initial: 'idle',
        states: {
          idle: { on: { GO: 'active' } },
          active: {},
        },
      });

      const instance = m.start();
      const states: string[] = [];

      instance.subscribe((state) => {
        states.push(state.value as string);
      });

      instance.send('GO');
      expect(states).toEqual(['active']);
    });

    it('should allow unsubscribe', () => {
      const m = chart({
        context: {},
        initial: 'a',
        states: {
          a: { on: { NEXT: 'b' } },
          b: { on: { NEXT: 'c' } },
          c: {},
        },
      });

      const instance = m.start();
      const states: string[] = [];

      const unsub = instance.subscribe((state) => {
        states.push(state.value as string);
      });

      instance.send('NEXT');
      unsub();
      instance.send('NEXT');

      expect(states).toEqual(['b']);
    });

    it('should call onTransition with event', () => {
      const m = chart({
        context: {},
        initial: 'idle',
        states: {
          idle: { on: { GO: 'active' } },
          active: {},
        },
      });

      const instance = m.start();
      const events: string[] = [];

      instance.onTransition((ev) => {
        events.push(ev.type);
      });

      instance.send('GO');
      expect(events).toEqual(['GO']);
    });
  });

  describe('stop', () => {
    it('should stop processing events after stop', () => {
      const m = chart({
        context: {},
        initial: 'idle',
        states: {
          idle: { on: { GO: 'active' } },
          active: {},
        },
      });

      const instance = m.start();
      instance.stop();
      instance.send('GO');

      expect(instance.state.value).toBe('idle');
    });
  });

  describe('self-transitions', () => {
    it('should execute action on self-transition without target', () => {
      const m = chart({
        context: { count: 0 },
        initial: 'idle',
        states: {
          idle: {
            on: {
              INC: { action: (ctx) => ({ count: ctx.count + 1 }) },
            },
          },
        },
      });

      const instance = m.start();
      instance.send('INC');
      expect(instance.state.value).toBe('idle');
      expect(instance.state.context.count).toBe(1);
    });
  });
});
