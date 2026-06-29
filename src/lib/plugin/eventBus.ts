import type { PluginEvent, EventHandler } from "./types";

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  off(eventType: string, handler: EventHandler): void {
    this.handlers.get(eventType)?.delete(handler);
  }

  async emit(event: PluginEvent): Promise<void> {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    const promises: Promise<void>[] = [];
    for (const handler of handlers) {
      promises.push(Promise.resolve(handler(event)));
    }
    await Promise.allSettled(promises);
  }

  removeAll(): void {
    this.handlers.clear();
  }
}

export const globalEventBus = new EventBus();
