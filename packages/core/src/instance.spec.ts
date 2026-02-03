import { describe, it, expect, vi } from "vitest";
import { createInstance } from "./instance.js";
import type { ChartDefinition, BaseEvent } from "./types.js";

interface TestContext {
  count: number;
  log: string[];
  [key: string]: unknown;
}

interface TestEvent extends BaseEvent {
  type: "START" | "STOP" | "INCREMENT" | "UPDATE";
  value?: number;
}

const simpleChart: ChartDefinition<TestContext, TestEvent> = {
  id: "simple",
  context: { count: 0, log: [] },
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "active",
      },
    },
    active: {
      on: {
        STOP: "idle",
      },
    },
  },
};

describe("createInstance", () => {
  describe("instance creation", () => {
    it("initializes with correct initial state", () => {
      const instance = createInstance(simpleChart);

      expect(instance.state.value).toBe("idle");
    });

    it("handles nested initial states", () => {
      const nestedChart: ChartDefinition<TestContext, TestEvent> = {
        id: "nested",
        context: { count: 0, log: [] },
        initial: "parent",
        states: {
          parent: {
            initial: "child1",
            states: {
              child1: {},
              child2: {},
            },
          },
        },
      };

      const instance = createInstance(nestedChart);

      expect(instance.state.path).toEqual(["parent", "child1"]);
    });

    it("applies context override", () => {
      const instance = createInstance(simpleChart, { count: 99 });

      expect(instance.state.context.count).toBe(99);
    });

    it("merges context override with definition context", () => {
      const instance = createInstance(simpleChart, { count: 42 });

      expect(instance.state.context.count).toBe(42);
      expect(instance.state.context.log).toEqual([]);
    });
  });

  describe("event sending", () => {
    it("transitions on valid event", () => {
      const instance = createInstance(simpleChart);

      instance.send("START");

      expect(instance.state.value).toBe("active");
    });

    it("accepts event objects with payload", () => {
      const chartWithPayload: ChartDefinition<TestContext, TestEvent> = {
        id: "payload",
        context: { count: 0, log: [] },
        initial: "idle",
        states: {
          idle: {
            on: {
              UPDATE: {
                target: "updated",
                action: (ctx, event) => ({ count: event.value ?? ctx.count }),
              },
            },
          },
          updated: {},
        },
      };

      const instance = createInstance(chartWithPayload);
      instance.send({ type: "UPDATE", value: 42 });

      expect(instance.state.context.count).toBe(42);
    });

    it("ignores unknown events", () => {
      const instance = createInstance(simpleChart);

      instance.send("UNKNOWN" as TestEvent["type"]);

      expect(instance.state.value).toBe("idle");
    });

    it("accepts string event shorthand", () => {
      const instance = createInstance(simpleChart);

      instance.send("START");

      expect(instance.state.value).toBe("active");
    });
  });

  describe("entry and exit actions", () => {
    it("executes entry action on initial state", () => {
      const entryFn = vi.fn();
      const chartWithEntry: ChartDefinition<TestContext, TestEvent> = {
        id: "entry",
        context: { count: 0, log: [] },
        initial: "idle",
        states: {
          idle: {
            entry: entryFn,
          },
        },
      };

      createInstance(chartWithEntry);

      expect(entryFn).toHaveBeenCalled();
    });

    it("executes exit action on transition", () => {
      const exitFn = vi.fn();
      const chartWithExit: ChartDefinition<TestContext, TestEvent> = {
        id: "exit",
        context: { count: 0, log: [] },
        initial: "idle",
        states: {
          idle: {
            exit: exitFn,
            on: { START: "active" },
          },
          active: {},
        },
      };

      const instance = createInstance(chartWithExit);
      instance.send("START");

      expect(exitFn).toHaveBeenCalled();
    });

    it("updates context from action return value", () => {
      const chartWithAction: ChartDefinition<TestContext, TestEvent> = {
        id: "action",
        context: { count: 0, log: [] },
        initial: "idle",
        states: {
          idle: {
            on: {
              INCREMENT: {
                target: "idle",
                action: (ctx) => ({ count: ctx.count + 1 }),
              },
            },
          },
        },
      };

      const instance = createInstance(chartWithAction);
      instance.send("INCREMENT");

      expect(instance.state.context.count).toBe(1);
    });
  });

  describe("subscription notifications", () => {
    it("notifies subscribers on state change", () => {
      const instance = createInstance(simpleChart);
      const listener = vi.fn();

      instance.subscribe(listener);
      instance.send("START");

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ value: "active" })
      );
    });

    it("unsubscribe stops notifications", () => {
      const instance = createInstance(simpleChart);
      const listener = vi.fn();

      const unsubscribe = instance.subscribe(listener);
      unsubscribe();
      instance.send("START");

      expect(listener).not.toHaveBeenCalled();
    });

    it("supports multiple subscribers", () => {
      const instance = createInstance(simpleChart);
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      instance.subscribe(listener1);
      instance.subscribe(listener2);
      instance.send("START");

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe("stop behavior", () => {
    it("prevents transitions after stop", () => {
      const instance = createInstance(simpleChart);

      instance.stop();
      instance.send("START");

      expect(instance.state.value).toBe("idle");
    });

    it("clears delayed transitions on stop", () => {
      vi.useFakeTimers();

      const chartWithDelay: ChartDefinition<TestContext, TestEvent> = {
        id: "delay",
        context: { count: 0, log: [] },
        initial: "idle",
        states: {
          idle: {
            after: {
              1000: "active",
            },
          },
          active: {},
        },
      };

      const instance = createInstance(chartWithDelay);
      instance.stop();

      vi.advanceTimersByTime(2000);

      expect(instance.state.value).toBe("idle");

      vi.useRealTimers();
    });
  });

  describe("final state detection", () => {
    it("sets done flag when reaching final state", () => {
      const chartWithFinal: ChartDefinition<TestContext, TestEvent> = {
        id: "final",
        context: { count: 0, log: [] },
        initial: "idle",
        states: {
          idle: {
            on: { START: "complete" },
          },
          complete: {
            final: true,
          },
        },
      };

      const instance = createInstance(chartWithFinal);
      expect(instance.state.done).toBe(false);

      instance.send("START");
      expect(instance.state.done).toBe(true);
    });
  });

  describe("onTransition listener", () => {
    it("notifies on transition events", () => {
      const instance = createInstance(simpleChart);
      const listener = vi.fn();

      instance.onTransition(listener);
      instance.send("START");

      expect(listener).toHaveBeenCalledWith({ type: "START" });
    });

    it("returns unsubscribe function", () => {
      const instance = createInstance(simpleChart);
      const listener = vi.fn();

      const unsubscribe = instance.onTransition(listener);
      unsubscribe();
      instance.send("START");

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
