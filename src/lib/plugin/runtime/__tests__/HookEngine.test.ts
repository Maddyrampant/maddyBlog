import { describe, it, expect } from "vitest";
import { HookEngine, isTimeoutError } from "../HookEngine";
import { TimeoutError } from "../TimeoutError";

describe("HookEngine", () => {
  describe("priority ordering", () => {
    it("high priority handlers run before low priority handlers", async () => {
      const engine = new HookEngine();
      const order: number[] = [];

      engine.register("test", {
        id: "low",
        handler: async () => {
          order.push(3);
        },
        priority: 1,
      });
      engine.register("test", {
        id: "high",
        handler: async () => {
          order.push(1);
        },
        priority: 10,
      });
      engine.register("test", {
        id: "mid",
        handler: async () => {
          order.push(2);
        },
        priority: 5,
      });

      await engine.execute("test", {});
      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe("timeout enforcement", () => {
    it("reports timedOut for handlers exceeding timeoutMs", async () => {
      const engine = new HookEngine();

      engine.register("test", {
        id: "slow",
        handler: async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
        },
        timeoutMs: 100,
      });

      const result = await engine.execute("test", {});
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.id).toBe("slow");
      expect(result.errors[0]!.timedOut).toBe(true);
    });
  });

  describe("error isolation", () => {
    it("does not block subsequent handlers when one fails", async () => {
      const engine = new HookEngine();
      const order: number[] = [];

      engine.register("test", {
        id: "failing",
        handler: async () => {
          throw new Error("handler failure");
        },
        priority: 10,
      });
      engine.register("test", {
        id: "passing",
        handler: async () => {
          order.push(1);
        },
        priority: 5,
      });

      const result = await engine.execute("test", {});
      expect(order).toEqual([1]);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.id).toBe("failing");
      expect(result.errors[0]!.timedOut).toBe(false);
    });
  });

  describe("result structure correctness", () => {
    it("returns { results, errors } with correct types", async () => {
      const engine = new HookEngine();

      engine.register("test", {
        id: "a",
        handler: async () => "result-a",
        priority: 10,
      });
      engine.register("test", {
        id: "b",
        handler: async () => "result-b",
        priority: 5,
      });

      const result = await engine.execute<string, string>("test", "ctx");
      expect(result).toHaveProperty("results");
      expect(result).toHaveProperty("errors");
      expect(Array.isArray(result.results)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.results).toEqual(["result-a", "result-b"]);
      expect(result.errors).toHaveLength(0);
    });

    it("returns empty arrays for unknown hook", async () => {
      const engine = new HookEngine();
      const result = await engine.execute("nonexistent", {});
      expect(result).toEqual({ results: [], errors: [] });
    });
  });

  describe("register returns unsubscribe", () => {
    it("removes handler when unsubscribe is called", async () => {
      const engine = new HookEngine();

      const unsub = engine.register("test", {
        id: "removable",
        handler: async () => "should-not-appear",
        priority: 10,
      });

      unsub();

      const result = await engine.execute("test", {});
      expect(result.results).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("isTimeoutError", () => {
    it("returns true for TimeoutError instances", () => {
      expect(isTimeoutError(new TimeoutError("timeout"))).toBe(true);
    });

    it("returns false for regular errors", () => {
      expect(isTimeoutError(new Error("regular"))).toBe(false);
    });

    it("returns false for non-error values", () => {
      expect(isTimeoutError("string")).toBe(false);
      expect(isTimeoutError(null)).toBe(false);
      expect(isTimeoutError(undefined)).toBe(false);
    });
  });
});
