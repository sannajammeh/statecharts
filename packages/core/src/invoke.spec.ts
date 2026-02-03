import { describe, it, expect, vi } from "vitest";
import { startInvoke } from "./invoke.js";

describe("startInvoke", () => {
  const baseContext = { value: 42 };

  describe("promise-based invocations", () => {
    it("calls onDone when promise resolves", async () => {
      const onDone = vi.fn();
      const onError = vi.fn();

      startInvoke(() => Promise.resolve("data"), baseContext, onDone, onError);

      await vi.waitFor(() => {
        expect(onDone).toHaveBeenCalledWith("data");
      });
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError when promise rejects", async () => {
      const onDone = vi.fn();
      const onError = vi.fn();
      const error = new Error("fail");

      startInvoke(() => Promise.reject(error), baseContext, onDone, onError);

      await vi.waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
      expect(onDone).not.toHaveBeenCalled();
    });
  });

  describe("subscription-based invocations", () => {
    it("calls onDone when subscription emits via next()", async () => {
      const onDone = vi.fn();
      const onError = vi.fn();

      const subscriptionSource = {
        subscribe: ({ next }: { next: (v: unknown) => void }) => {
          setTimeout(() => next("emitted"), 0);
          return { unsubscribe: vi.fn() };
        },
      };

      startInvoke(() => subscriptionSource, baseContext, onDone, onError);

      await vi.waitFor(() => {
        expect(onDone).toHaveBeenCalledWith("emitted");
      });
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls onError when subscription calls error()", async () => {
      const onDone = vi.fn();
      const onError = vi.fn();
      const error = new Error("subscription error");

      const subscriptionSource = {
        subscribe: (observer: { next: (v: unknown) => void; error?: (e: unknown) => void }) => {
          setTimeout(() => observer.error?.(error), 0);
          return { unsubscribe: vi.fn() };
        },
      };

      startInvoke(() => subscriptionSource, baseContext, onDone, onError);

      await vi.waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
      expect(onDone).not.toHaveBeenCalled();
    });
  });

  describe("cancellation behavior", () => {
    it("prevents onDone call when cancelled before promise resolves", async () => {
      const onDone = vi.fn();
      const onError = vi.fn();

      let resolvePromise: (value: string) => void;
      const promise = new Promise<string>((resolve) => {
        resolvePromise = resolve;
      });

      const controller = startInvoke(() => promise, baseContext, onDone, onError);

      controller.cancel();
      resolvePromise!("data");

      // Give time for promise to settle
      await new Promise((r) => setTimeout(r, 10));

      expect(onDone).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it("calls unsubscribe when subscription invoke is cancelled", () => {
      const onDone = vi.fn();
      const onError = vi.fn();
      const unsubscribe = vi.fn();

      const subscriptionSource = {
        subscribe: () => ({ unsubscribe }),
      };

      const controller = startInvoke(() => subscriptionSource, baseContext, onDone, onError);

      controller.cancel();

      expect(unsubscribe).toHaveBeenCalled();
    });

    it("prevents onError call when cancelled before promise rejects", async () => {
      const onDone = vi.fn();
      const onError = vi.fn();

      let rejectPromise: (error: Error) => void;
      const promise = new Promise<string>((_, reject) => {
        rejectPromise = reject;
      });

      const controller = startInvoke(() => promise, baseContext, onDone, onError);

      controller.cancel();
      rejectPromise!(new Error("fail"));

      // Give time for promise to settle
      await new Promise((r) => setTimeout(r, 10));

      expect(onDone).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("synchronous error handling", () => {
    it("calls onError when invoke function throws synchronously", () => {
      const onDone = vi.fn();
      const onError = vi.fn();
      const error = new Error("sync throw");

      startInvoke(
        () => {
          throw error;
        },
        baseContext,
        onDone,
        onError
      );

      expect(onError).toHaveBeenCalledWith(error);
      expect(onDone).not.toHaveBeenCalled();
    });

    it("handles non-Error thrown values", () => {
      const onDone = vi.fn();
      const onError = vi.fn();

      startInvoke(
        () => {
          throw "string error";
        },
        baseContext,
        onDone,
        onError
      );

      expect(onError).toHaveBeenCalledWith("string error");
      expect(onDone).not.toHaveBeenCalled();
    });
  });
});
