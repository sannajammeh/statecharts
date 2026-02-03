import { describe, it, expect } from "vitest";
import { StateSnapshot } from "./snapshot.js";

describe("StateSnapshot", () => {
  describe("constructor", () => {
    it("sets all properties correctly", () => {
      const context = { count: 0 };
      const snapshot = new StateSnapshot("idle", context, false, ["idle"]);

      expect(snapshot.value).toBe("idle");
      expect(snapshot.context).toEqual({ count: 0 });
      expect(snapshot.done).toBe(false);
      expect(snapshot.path).toEqual(["idle"]);
      expect(typeof snapshot.timestamp).toBe("number");
    });

    it("uses provided timestamp when given", () => {
      const timestamp = 1234567890;
      const snapshot = new StateSnapshot("idle", {}, false, ["idle"], timestamp);

      expect(snapshot.timestamp).toBe(timestamp);
    });

    it("defaults timestamp to Date.now()", () => {
      const before = Date.now();
      const snapshot = new StateSnapshot("idle", {}, false, ["idle"]);
      const after = Date.now();

      expect(snapshot.timestamp).toBeGreaterThanOrEqual(before);
      expect(snapshot.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe("context freezing", () => {
    it("freezes the context object", () => {
      const context = { count: 0, nested: { value: 1 } };
      const snapshot = new StateSnapshot("idle", context, false, ["idle"]);

      expect(Object.isFrozen(snapshot.context)).toBe(true);
    });

    it("creates a copy of context (does not mutate original)", () => {
      const context = { count: 0 };
      const snapshot = new StateSnapshot("idle", context, false, ["idle"]);

      context.count = 99;
      expect(snapshot.context.count).toBe(0);
    });
  });

  describe("path freezing", () => {
    it("freezes the path array", () => {
      const path = ["parent", "child"];
      const snapshot = new StateSnapshot("idle", {}, false, path);

      expect(Object.isFrozen(snapshot.path)).toBe(true);
    });

    it("creates a copy of path (does not mutate original)", () => {
      const path = ["parent", "child"];
      const snapshot = new StateSnapshot("idle", {}, false, path);

      path.push("extra");
      expect(snapshot.path).toEqual(["parent", "child"]);
    });
  });

  describe("matches() for flat states", () => {
    it("returns true when state matches exactly", () => {
      const snapshot = new StateSnapshot("idle", {}, false, ["idle"]);

      expect(snapshot.matches("idle")).toBe(true);
    });

    it("returns false when state does not match", () => {
      const snapshot = new StateSnapshot("idle", {}, false, ["idle"]);

      expect(snapshot.matches("active")).toBe(false);
    });

    it("returns false for partial mismatch with dot notation on flat state", () => {
      const snapshot = new StateSnapshot("idle", {}, false, ["idle"]);

      expect(snapshot.matches("idle.nested")).toBe(false);
    });
  });

  describe("matches() for nested states", () => {
    it("returns true for exact nested path match", () => {
      const snapshot = new StateSnapshot(
        { parent: "child" },
        {},
        false,
        ["parent", "child"]
      );

      expect(snapshot.matches("parent.child")).toBe(true);
    });

    it("returns true for parent-only match", () => {
      const snapshot = new StateSnapshot(
        { parent: "child" },
        {},
        false,
        ["parent", "child"]
      );

      expect(snapshot.matches("parent")).toBe(true);
    });

    it("returns true for child-only match", () => {
      const snapshot = new StateSnapshot(
        { parent: "child" },
        {},
        false,
        ["parent", "child"]
      );

      expect(snapshot.matches("child")).toBe(true);
    });

    it("returns false for non-existent state in path", () => {
      const snapshot = new StateSnapshot(
        { parent: "child" },
        {},
        false,
        ["parent", "child"]
      );

      expect(snapshot.matches("other")).toBe(false);
    });

    it("returns false when only partial path matches", () => {
      const snapshot = new StateSnapshot(
        { parent: "child" },
        {},
        false,
        ["parent", "child"]
      );

      expect(snapshot.matches("parent.other")).toBe(false);
    });
  });
});
