import { describe, it, expect, vi } from "vitest";
import { resolveTransition } from "./transition.js";

describe("resolveTransition", () => {
  const baseContext = { count: 0 };
  const baseEvent = { type: "TEST" };

  describe("string shorthand", () => {
    it("resolves string to target with empty actions", () => {
      const result = resolveTransition("active", baseContext, baseEvent);

      expect(result).toEqual({
        target: "active",
        actions: [],
      });
    });
  });

  describe("guard evaluation", () => {
    it("returns transition when guard passes", () => {
      const result = resolveTransition(
        { target: "next", guard: () => true },
        baseContext,
        baseEvent
      );

      expect(result).toEqual({
        target: "next",
        actions: [],
      });
    });

    it("returns null when guard fails", () => {
      const result = resolveTransition(
        { target: "next", guard: () => false },
        baseContext,
        baseEvent
      );

      expect(result).toBeNull();
    });

    it("passes context and event to guard", () => {
      const guard = vi.fn().mockReturnValue(true);
      const context = { value: 42 };
      const event = { type: "CLICK", payload: "data" };

      resolveTransition({ target: "next", guard }, context, event);

      expect(guard).toHaveBeenCalledWith(context, event);
    });
  });

  describe("action attachment", () => {
    it("includes single action in actions array", () => {
      const action = vi.fn();
      const result = resolveTransition(
        { target: "next", action },
        baseContext,
        baseEvent
      );

      expect(result?.actions).toEqual([action]);
    });

    it("returns empty actions array when no action provided", () => {
      const result = resolveTransition(
        { target: "next" },
        baseContext,
        baseEvent
      );

      expect(result?.actions).toEqual([]);
    });
  });

  describe("array transitions (first match wins)", () => {
    it("returns first matching transition when guard passes", () => {
      const result = resolveTransition(
        [
          { target: "a", guard: () => true },
          { target: "b" },
        ],
        baseContext,
        baseEvent
      );

      expect(result?.target).toBe("a");
    });

    it("skips to next when first guard fails", () => {
      const result = resolveTransition(
        [
          { target: "a", guard: () => false },
          { target: "b" },
        ],
        baseContext,
        baseEvent
      );

      expect(result?.target).toBe("b");
    });

    it("returns null when all guards fail", () => {
      const result = resolveTransition(
        [
          { target: "a", guard: () => false },
          { target: "b", guard: () => false },
        ],
        baseContext,
        baseEvent
      );

      expect(result).toBeNull();
    });

    it("uses first match even if multiple could match", () => {
      const result = resolveTransition(
        [
          { target: "first", guard: () => true },
          { target: "second", guard: () => true },
        ],
        baseContext,
        baseEvent
      );

      expect(result?.target).toBe("first");
    });
  });

  describe("targetless transitions", () => {
    it("allows action-only transition with undefined target", () => {
      const action = vi.fn();
      const result = resolveTransition(
        { action },
        baseContext,
        baseEvent
      );

      expect(result).toEqual({
        target: undefined,
        actions: [action],
      });
    });

    it("allows guard-only transition with no target or action", () => {
      const result = resolveTransition(
        { guard: () => true },
        baseContext,
        baseEvent
      );

      expect(result).toEqual({
        target: undefined,
        actions: [],
      });
    });
  });
});
