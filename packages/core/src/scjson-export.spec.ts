import { describe, it, expect } from "vitest";
import { chart } from "./chart.js";
import { exportSCJSON } from "./scjson-export.js";
import type { StateElement, FinalElement, ParallelElement } from "./scjson-types.js";

describe("exportSCJSON", () => {
  describe("minimal chart export", () => {
    it("should export minimal chart with id, initial, and one state", () => {
      const myChart = chart({
        id: "minimal",
        context: {},
        initial: "idle",
        states: {
          idle: {},
        },
      });

      const result = exportSCJSON(myChart.definition);

      expect(result.$type).toBe("scxml");
      expect(result.version).toBe("1.0");
      expect(result.name).toBe("minimal");
      expect(result.initial).toBe("idle");
      expect(result.datamodel).toBe("ecmascript");
      expect(result.children).toHaveLength(1);

      const idleState = result.children[0] as StateElement;
      expect(idleState.$type).toBe("state");
      expect(idleState.id).toBe("idle");
    });

    it("should produce valid JSON when stringified", () => {
      const myChart = chart({
        id: "test",
        context: {},
        initial: "idle",
        states: { idle: {} },
      });

      const result = exportSCJSON(myChart.definition);
      const json = JSON.stringify(result);

      expect(() => JSON.parse(json)).not.toThrow();
    });
  });

  describe("compound state hierarchy export", () => {
    it("should preserve nested state hierarchy", () => {
      const myChart = chart({
        id: "compound",
        context: {},
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
      });

      const result = exportSCJSON(myChart.definition);

      const parentState = result.children[0] as StateElement;
      expect(parentState.$type).toBe("state");
      expect(parentState.id).toBe("parent");
      expect(parentState.initial).toBe("child1");
      expect(parentState.children).toBeDefined();

      const childStates = parentState.children!.filter(
        (c): c is StateElement => c.$type === "state"
      );
      expect(childStates).toHaveLength(2);
      expect(childStates.map((s) => s.id).sort()).toEqual(["child1", "child2"]);
    });
  });

  describe("parallel state export", () => {
    it("should export parallel state with regions", () => {
      const myChart = chart({
        id: "parallel-test",
        context: {},
        initial: "parallel",
        states: {
          parallel: {
            parallel: {
              region1: {
                initial: "a",
                states: {
                  a: {},
                  b: {},
                },
              },
              region2: {
                initial: "x",
                states: {
                  x: {},
                  y: {},
                },
              },
            },
          },
        },
      });

      const result = exportSCJSON(myChart.definition);

      const parallelState = result.children[0] as ParallelElement;
      expect(parallelState.$type).toBe("parallel");
      expect(parallelState.id).toBe("parallel");

      const regions = parallelState.children!.filter(
        (c): c is StateElement => c.$type === "state"
      );
      expect(regions).toHaveLength(2);

      const regionIds = regions.map((r) => r.id).sort();
      expect(regionIds).toEqual(["region1", "region2"]);
    });
  });

  describe("final state export", () => {
    it("should export final state with correct type", () => {
      const myChart = chart({
        id: "final-test",
        context: {},
        initial: "active",
        states: {
          active: {
            on: { FINISH: "done" },
          },
          done: {
            final: true,
          },
        },
      });

      const result = exportSCJSON(myChart.definition);

      const finalState = result.children.find(
        (c): c is FinalElement =>
          (c as StateElement | FinalElement).id === "done"
      );
      expect(finalState!.$type).toBe("final");
      expect(finalState!.id).toBe("done");
    });
  });

  describe("transitions with guards and actions", () => {
    it("should export transition with event and target", () => {
      const myChart = chart({
        id: "transition-test",
        context: {},
        initial: "idle",
        states: {
          idle: {
            on: { CLICK: "clicked" },
          },
          clicked: {},
        },
      });

      const result = exportSCJSON(myChart.definition);

      const idleState = result.children.find(
        (c): c is StateElement => (c as StateElement).id === "idle"
      );

      const transition = idleState!.children!.find((c) => c.$type === "transition");
      expect(transition).toMatchObject({
        $type: "transition",
        event: "CLICK",
        target: "clicked",
      });
    });

    it("should serialize guard as condition expression", () => {
      function isValid() {
        return true;
      }

      const myChart = chart({
        id: "guard-test",
        context: {},
        initial: "idle",
        states: {
          idle: {
            on: {
              SUBMIT: {
                target: "submitted",
                guard: isValid,
              },
            },
          },
          submitted: {},
        },
      });

      const result = exportSCJSON(myChart.definition);

      const idleState = result.children.find(
        (c): c is StateElement => (c as StateElement).id === "idle"
      );

      const transition = idleState!.children!.find((c) => c.$type === "transition");
      expect(transition).toMatchObject({
        $type: "transition",
        event: "SUBMIT",
        target: "submitted",
        cond: "isValid(context, event)",
      });
    });

    it("should serialize action as executable content", () => {
      function logEvent() {}

      const myChart = chart({
        id: "action-test",
        context: {},
        initial: "idle",
        states: {
          idle: {
            on: {
              CLICK: {
                target: "clicked",
                action: logEvent,
              },
            },
          },
          clicked: {},
        },
      });

      const result = exportSCJSON(myChart.definition);

      const idleState = result.children.find(
        (c): c is StateElement => (c as StateElement).id === "idle"
      );

      const transition = idleState!.children!.find((c) => c.$type === "transition") as any;
      expect(transition.children).toBeDefined();
      expect(transition.children[0]).toMatchObject({
        $type: "script",
        $text: "logEvent(context, event)",
      });
    });
  });

  describe("delayed transitions", () => {
    it("should export after as send + transition pattern", () => {
      const myChart = chart({
        id: "delay-test",
        context: {},
        initial: "waiting",
        states: {
          waiting: {
            after: {
              1000: "timeout",
            },
          },
          timeout: {},
        },
      });

      const result = exportSCJSON(myChart.definition);

      const waitingState = result.children.find(
        (c): c is StateElement => (c as StateElement).id === "waiting"
      );

      // Should have onentry with send
      const onentry = waitingState!.children!.find((c) => c.$type === "onentry") as any;
      expect(onentry).toBeDefined();

      const send = onentry.children.find((c: any) => c.$type === "send");
      expect(send).toMatchObject({
        $type: "send",
        event: "__delay.waiting.1000",
        delay: "1000ms",
      });

      // Should have transition for delayed event
      const delayedTransition = waitingState!.children!.find(
        (c) => c.$type === "transition" && (c as any).event === "__delay.waiting.1000"
      );
      expect(delayedTransition).toMatchObject({
        $type: "transition",
        event: "__delay.waiting.1000",
        target: "timeout",
      });
    });
  });

  describe("invoke/onDone/onError export", () => {
    it("should export invoke element", () => {
      async function fetchData() {
        return { data: "test" };
      }

      const myChart = chart({
        id: "invoke-test",
        context: {},
        initial: "loading",
        states: {
          loading: {
            invoke: fetchData,
            onDone: "success",
            onError: "error",
          },
          success: {},
          error: {},
        },
      });

      const result = exportSCJSON(myChart.definition);

      const loadingState = result.children.find(
        (c): c is StateElement => (c as StateElement).id === "loading"
      );

      const invoke = loadingState!.children!.find((c) => c.$type === "invoke") as any;
      expect(invoke).toMatchObject({
        $type: "invoke",
        id: "loading.invoke",
        type: "ecmascript",
        src: "fetchData",
      });

      // Should have done.invoke transition
      const doneTransition = loadingState!.children!.find(
        (c) => c.$type === "transition" && (c as any).event?.startsWith("done.invoke")
      );
      expect(doneTransition).toBeDefined();
      expect((doneTransition as any).target).toBe("success");

      // Should have error.invoke transition
      const errorTransition = loadingState!.children!.find(
        (c) => c.$type === "transition" && (c as any).event?.startsWith("error.invoke")
      );
      expect(errorTransition).toBeDefined();
      expect((errorTransition as any).target).toBe("error");
    });
  });

  describe("context to datamodel mapping", () => {
    it("should export context as datamodel with data elements", () => {
      const myChart = chart({
        id: "context-test",
        context: {
          count: 0,
          name: "test",
          active: true,
        },
        initial: "idle",
        states: { idle: {} },
      });

      const result = exportSCJSON(myChart.definition);

      const datamodel = result.children.find((c) => c.$type === "datamodel") as any;
      expect(datamodel).toBeDefined();
      expect(datamodel.$type).toBe("datamodel");

      const dataElements = datamodel.children;
      expect(dataElements).toHaveLength(3);

      const countData = dataElements.find((d: any) => d.id === "count");
      expect(countData).toMatchObject({
        $type: "data",
        id: "count",
        expr: "0",
      });

      const nameData = dataElements.find((d: any) => d.id === "name");
      expect(nameData).toMatchObject({
        $type: "data",
        id: "name",
        expr: '"test"',
      });

      const activeData = dataElements.find((d: any) => d.id === "active");
      expect(activeData).toMatchObject({
        $type: "data",
        id: "active",
        expr: "true",
      });
    });

    it("should not include datamodel when context is empty", () => {
      const myChart = chart({
        id: "empty-context",
        context: {},
        initial: "idle",
        states: { idle: {} },
      });

      const result = exportSCJSON(myChart.definition);

      const datamodel = result.children.find((c) => c.$type === "datamodel");
      expect(datamodel).toBeUndefined();
    });
  });

  describe("JSON Schema validation", () => {
    it("should produce output matching SCJSON schema structure", () => {
      const myChart = chart({
        id: "schema-test",
        context: { value: 42 },
        initial: "active",
        states: {
          active: {
            on: { NEXT: "done" },
          },
          done: { final: true },
        },
      });

      const result = exportSCJSON(myChart.definition);

      // Validate root structure
      expect(result).toMatchObject({
        $type: "scxml",
        version: "1.0",
        name: "schema-test",
        initial: "active",
        datamodel: "ecmascript",
      });

      // All children should have $type
      for (const child of result.children) {
        expect(child).toHaveProperty("$type");
      }
    });
  });
});
