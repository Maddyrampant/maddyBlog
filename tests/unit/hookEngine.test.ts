import { describe, it, expect, vi, beforeEach } from "vitest";
import { HookEngine } from "@/lib/plugin/runtime/HookEngine";

describe("HookEngine", () => {
  let engine: HookEngine;

  beforeEach(() => {
    engine = new HookEngine();
  });

  describe("register", () => {
    it("registers a handler for a hook", () => {
      const handler = vi.fn();
      engine.register("test:hook", "test-plugin", handler);
      expect(engine.hasHook("test:hook")).toBe(true);
      expect(engine.getHandlerCount("test:hook")).toBe(1);
    });

    it("sorts handlers by priority", () => {
      const order: number[] = [];
      engine.register("test:hook", "plugin-c", () => { order.push(3); }, { priority: 30 });
      engine.register("test:hook", "plugin-a", () => { order.push(1); }, { priority: 10 });
      engine.register("test:hook", "plugin-b", () => { order.push(2); }, { priority: 20 });

      return engine.execute("test:hook", null).then(() => {
        expect(order).toEqual([1, 2, 3]);
      });
    });
  });

  describe("execute", () => {
    it("passes context through the pipeline", async () => {
      engine.register("mutate", "p1", (ctx: number) => ctx + 1, { priority: 10 });
      engine.register("mutate", "p2", (ctx: number) => ctx * 2, { priority: 20 });

      const result = await engine.execute("mutate", 5);
      expect(result).toBe(12);
    });

    it("returns context unchanged when no handlers", async () => {
      const result = await engine.execute("unknown:hook", { foo: "bar" });
      expect(result).toEqual({ foo: "bar" });
    });

    it("isolates handler errors and continues pipeline", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

      engine.register("chain", "p1", () => { throw new Error("fail"); }, { priority: 10 });
      engine.register("chain", "p2", (ctx: number) => ctx + 1, { priority: 20 });

      const result = await engine.execute("chain", 0);
      expect(result).toBe(1);
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });
  });

  describe("executeFirst", () => {
    it("returns result from first matching handler", async () => {
      engine.register("first", "p1", () => "first", { priority: 10 });
      engine.register("first", "p2", () => "second", { priority: 20 });

      const result = await engine.executeFirst<string>("first", null);
      expect(result).toBe("first");
    });

    it("returns null when no handlers", async () => {
      const result = await engine.executeFirst("unknown", null);
      expect(result).toBeNull();
    });
  });

  describe("executeParallel", () => {
    it("executes all handlers in parallel", async () => {
      engine.register("parallel", "p1", () => "a", { priority: 10 });
      engine.register("parallel", "p2", () => "b", { priority: 20 });

      const results = await engine.executeParallel<string>("parallel", null);
      expect(results.sort()).toEqual(["a", "b"]);
    });

    it("isolates errors and returns successful results", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

      engine.register("parallel-err", "p1", () => { throw new Error("fail"); }, { priority: 10 });
      engine.register("parallel-err", "p2", () => "ok", { priority: 20 });

      const results = await engine.executeParallel<string>("parallel-err", null);
      expect(results).toEqual(["ok"]);
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });
  });

  describe("unregisterAll", () => {
    it("removes all handlers for a plugin", () => {
      engine.register("h1", "p1", () => {});
      engine.register("h1", "p2", () => {});
      engine.register("h2", "p1", () => {});

      engine.unregisterAll("p1");

      expect(engine.hasHook("h1")).toBe(true);
      expect(engine.getHandlerCount("h1")).toBe(1);
      expect(engine.hasHook("h2")).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all handlers", () => {
      engine.register("h1", "p1", () => {});
      engine.register("h2", "p2", () => {});
      engine.clear();

      expect(engine.getRegisteredHooks()).toEqual([]);
    });
  });

  describe("timeout", () => {
    it("throws when handler exceeds timeout", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

      engine.register("slow", "p1", async () => {
        await new Promise((r) => setTimeout(r, 500));
        return "done";
      }, { priority: 10 });

      const result = await engine.execute("slow", null, { timeout: 50 });
      expect(result).toBeNull();
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
