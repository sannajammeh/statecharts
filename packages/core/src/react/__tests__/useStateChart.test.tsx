import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { chart, type Chart, type ChartInstance, type BaseEvent } from "../../index.js";
import { useStateChart } from "../index.js";

// Context type for our test charts
type ToggleContext = { count: number };

// Simple toggle chart for testing
const createToggleChart = () =>
  chart({
    context: { count: 0 },
    initial: "inactive",
    states: {
      inactive: {
        on: { TOGGLE: "active" },
      },
      active: {
        on: { TOGGLE: "inactive" },
      },
    },
  });

// Test component that uses the hook with specific types
function TestComponent({
  chartOrInstance,
  options,
}: {
  chartOrInstance: Chart<ToggleContext, BaseEvent> | ChartInstance<ToggleContext, BaseEvent>;
  options?: Parameters<typeof useStateChart<ToggleContext, BaseEvent>>[1];
}) {
  const { state, send, matches } = useStateChart(chartOrInstance, options);
  return (
    <div>
      <span data-testid="state">{String(state.value)}</span>
      <span data-testid="count">{state.context.count}</span>
      <span data-testid="matches-inactive">{String(matches("inactive"))}</span>
      <span data-testid="matches-active">{String(matches("active"))}</span>
      <button onClick={() => send("TOGGLE")}>Toggle</button>
    </div>
  );
}

describe("useStateChart", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe("with Chart input", () => {
    it("creates instance on mount and stops on unmount", () => {
      const toggle = createToggleChart();
      const startSpy = vi.spyOn(toggle, "start");

      const { unmount } = render(<TestComponent chartOrInstance={toggle} />);

      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("state").textContent).toBe("inactive");

      // Get the instance that was created
      const instance = startSpy.mock.results[0]?.value;
      const stopSpy = vi.spyOn(instance, "stop");

      unmount();

      expect(stopSpy).toHaveBeenCalledTimes(1);
    });

    it("renders initial state correctly", () => {
      const toggle = createToggleChart();
      render(<TestComponent chartOrInstance={toggle} />);

      expect(screen.getByTestId("state").textContent).toBe("inactive");
      expect(screen.getByTestId("count").textContent).toBe("0");
    });
  });

  describe("with ChartInstance input", () => {
    it("subscribes without calling start/stop", () => {
      const toggle = createToggleChart();
      const instance = toggle.start();
      const stopSpy = vi.spyOn(instance, "stop");

      // Advance the instance state before rendering
      instance.send("TOGGLE");
      expect(instance.state.value).toBe("active");

      const { unmount } = render(<TestComponent chartOrInstance={instance} />);

      // Should show current state of instance, not initial
      expect(screen.getByTestId("state").textContent).toBe("active");

      unmount();

      // Should NOT call stop for externally-owned instance
      expect(stopSpy).not.toHaveBeenCalled();
    });
  });

  describe("re-rendering", () => {
    it("re-renders on state transition", () => {
      const toggle = createToggleChart();
      render(<TestComponent chartOrInstance={toggle} />);

      expect(screen.getByTestId("state").textContent).toBe("inactive");

      act(() => {
        screen.getByRole("button").click();
      });

      expect(screen.getByTestId("state").textContent).toBe("active");
    });

    it("does NOT re-render when event causes no transition", () => {
      const chartWithNoHandler = chart({
        context: { count: 0 },
        initial: "idle",
        states: {
          idle: {
            // No handler for UNKNOWN event
          },
        },
      });

      let renderCount = 0;
      function CountingComponent() {
        renderCount++;
        const { send } = useStateChart(chartWithNoHandler);
        return <button onClick={() => send("UNKNOWN")}>Send Unknown</button>;
      }

      render(<CountingComponent />);
      const initialRenderCount = renderCount;

      act(() => {
        screen.getByRole("button").click();
      });

      // Should not have re-rendered since state didn't change
      expect(renderCount).toBe(initialRenderCount);
    });
  });

  describe("send reference stability", () => {
    it("send reference is stable across re-renders", () => {
      const toggle = createToggleChart();
      const sendRefs: Array<(event: string | BaseEvent) => void> = [];

      function RefTrackingComponent() {
        const { send } = useStateChart(toggle);
        sendRefs.push(send);
        return <button onClick={() => send("TOGGLE")}>Toggle</button>;
      }

      render(<RefTrackingComponent />);

      act(() => {
        screen.getByRole("button").click();
      });

      act(() => {
        screen.getByRole("button").click();
      });

      // All send references should be the same
      expect(sendRefs.length).toBeGreaterThan(1);
      expect(sendRefs.every((ref) => ref === sendRefs[0])).toBe(true);
    });
  });

  describe("matches function", () => {
    it("returns correct boolean for current state", () => {
      const toggle = createToggleChart();
      render(<TestComponent chartOrInstance={toggle} />);

      expect(screen.getByTestId("matches-inactive").textContent).toBe("true");
      expect(screen.getByTestId("matches-active").textContent).toBe("false");

      act(() => {
        screen.getByRole("button").click();
      });

      expect(screen.getByTestId("matches-inactive").textContent).toBe("false");
      expect(screen.getByTestId("matches-active").textContent).toBe("true");
    });
  });

  describe("initialContext option", () => {
    it("overrides chart default for Chart input", () => {
      const toggle = createToggleChart();
      render(
        <TestComponent
          chartOrInstance={toggle}
          options={{ initialContext: { count: 42 } }}
        />
      );

      expect(screen.getByTestId("count").textContent).toBe("42");
    });

    it("is ignored for ChartInstance input", () => {
      const toggle = createToggleChart();
      const instance = toggle.start({ count: 100 });

      render(
        <TestComponent
          chartOrInstance={instance}
          options={{ initialContext: { count: 999 } }}
        />
      );

      // Should use instance's context, not the option
      expect(screen.getByTestId("count").textContent).toBe("100");
    });
  });

  describe("onTransition callback", () => {
    it("receives prev and next state on transition", () => {
      const toggle = createToggleChart();
      const onTransition = vi.fn();

      render(
        <TestComponent chartOrInstance={toggle} options={{ onTransition }} />
      );

      expect(onTransition).not.toHaveBeenCalled();

      act(() => {
        screen.getByRole("button").click();
      });

      expect(onTransition).toHaveBeenCalledTimes(1);
      const [prev, next] = onTransition.mock.calls[0] ?? [];
      expect(prev?.value).toBe("inactive");
      expect(next?.value).toBe("active");
    });

    it("is NOT called on initial mount", () => {
      const toggle = createToggleChart();
      const onTransition = vi.fn();

      render(
        <TestComponent chartOrInstance={toggle} options={{ onTransition }} />
      );

      expect(onTransition).not.toHaveBeenCalled();
    });
  });
});
