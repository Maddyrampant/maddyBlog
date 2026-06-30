import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  HookEngine,
  isTimeoutError,
  runWithTimeout,
} from "@/lib/plugin/runtime/HookEngine";
import { TimeoutError } from "@/lib/plugin/runtime/TimeoutError";

describe("HookEngine", () => {
  let engine: HookEngine;

  beforeEach(() => {
    engine = new HookEngine();
  });

  describe("register", () => {
    it("registers a handler and returns an unsubscribe function", () => {
      const unsub = engine.register("test:hook", {
        id: "test-plugin",
        handler: vi.fn(),
      });
      expect(typeof unsub).toBe("function");
    });

    it("unsubscribe removes the handler", async () => {
      const unsub = engine.register("test:hook", {
        id: "test-plugin",
        handler: () => "removed",
      });
      unsub();

      const result = await engine.execute("test:hook", null);
      expect(result.results).toHaveLength(0);
    });

    it("sorts handlers by priority descending", async () => {
      const order: number[] = [];
      engine.register("test:hook", {
        id: "plugin-c",
        handler: () => {
          order.push(3);
        },
        priority: 30,
      });
      engine.register("test:hook", {
        id: "plugin-a",
        handler: () => {
          order.push(1);
        },
        priority: 10,
      });
      engine.register("test:hook", {
        id: "plugin-b",
        handler: () => {
          order.push(2);
        },
        priority: 20,
      });

      await engine.execute("test:hook", null);
      expect(order).toEqual([3, 2, 1]);
    });
  });

  describe("execute", () => {
    it("passes context to each handler independently", async () => {
      engine.register("mutate", {
        id: "p1",
        handler: (ctx: number) => ctx + 1,
        priority: 10,
      });
      engine.register("mutate", {
        id: "p2",
        handler: (ctx: number) => ctx * 2,
        priority: 20,
      });

      const result = await engine.execute<number, number>("mutate", 5);
      expect(result.results).toEqual([10, 6]);
    });

    it("returns empty arrays when no handlers", async () => {
      const result = await engine.execute("unknown:hook", { foo: "bar" });
      expect(result).toEqual({ results: [], errors: [] });
    });

    it("isolates handler errors and collects other results", async () => {
      engine.register("chain", {
        id: "p1",
        handler: () => {
          throw new Error("fail");
        },
        priority: 10,
      });
      engine.register("chain", {
        id: "p2",
        handler: (ctx: number) => ctx + 1,
        priority: 20,
      });

      const result = await engine.execute<number, number>("chain", 0);
      expect(result.results).toEqual([1]);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.id).toBe("p1");
    });

    it("returns results in priority order", async () => {
      engine.register("order", {
        id: "a",
        handler: () => "A",
        priority: 30,
      });
      engine.register("order", {
        id: "b",
        handler: () => "B",
        priority: 10,
      });

      const result = await engine.execute("order", null);
      expect(result.results).toEqual(["A", "B"]);
    });
  });

  describe("clear", () => {
    it("removes all handlers", async () => {
      engine.register("h1", { id: "p1", handler: () => {} });
      engine.register("h2", { id: "p2", handler: () => {} });
      engine.clear();

      const r1 = await engine.execute("h1", null);
      const r2 = await engine.execute("h2", null);
      expect(r1.results).toHaveLength(0);
      expect(r2.results).toHaveLength(0);
    });
  });

  describe("timeout", () => {
    it("reports timeout error when handler exceeds timeoutMs", async () => {
      engine.register("slow", {
        id: "p1",
        handler: async () => {
          await new Promise((r) => setTimeout(r, 500));
          return "done";
        },
        priority: 10,
        timeoutMs: 50,
      });

      const result = await engine.execute("slow", null);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.timedOut).toBe(true);
      expect(result.errors[0]!.id).toBe("p1");
    });
  });

  describe("isTimeoutError", () => {
    it("returns true for TimeoutError", () => {
      expect(isTimeoutError(new TimeoutError("timeout"))).toBe(true);
    });

    it("returns false for regular Error", () => {
      expect(isTimeoutError(new Error("regular"))).toBe(false);
    });
  });

  describe("runWithTimeout", () => {
    it("resolves with value when promise completes in time", async () => {
      const result = await runWithTimeout(
        Promise.resolve("ok"),
        1000,
      );
      expect(result).toBe("ok");
    });
  });
});
