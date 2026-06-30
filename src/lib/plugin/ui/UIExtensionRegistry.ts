import type { ReactNode } from "react";

export type UIExtensionPoint =
  | "admin:sidebar"
  | "admin:dashboard:widget"
  | "admin:post:sidebar"
  | "admin:settings:tab"
  | "admin:analytics:chart"
  | "editor:toolbar"
  | "editor:slash:command"
  | "editor:bubble:menu"
  | "post:before:content"
  | "post:after:content"
  | "post:sidebar"
  | "header:right"
  | "footer:section";

export type UIExtensionEntry = {
  pluginName: string;
  point: UIExtensionPoint;
  component: () => ReactNode;
  priority: number;
  icon?: string;
};

const EMPTY_EXTENSIONS: UIExtensionEntry[] = [];

class UIExtensionRegistry {
  private extensions = new Map<UIExtensionPoint, UIExtensionEntry[]>();
  private listeners = new Set<() => void>();

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  register(
    point: UIExtensionPoint,
    pluginName: string,
    component: () => ReactNode,
    options?: { priority?: number; icon?: string },
  ): void {
    if (!this.extensions.has(point)) {
      this.extensions.set(point, []);
    }
    const list = this.extensions.get(point)!;
    list.push({
      pluginName,
      point,
      component,
      priority: options?.priority ?? 10,
      icon: options?.icon,
    });
    list.sort((a, b) => a.priority - b.priority);
    this.notify();
  }

  getExtensions(point: UIExtensionPoint): UIExtensionEntry[] {
    return this.extensions.get(point) ?? EMPTY_EXTENSIONS;
  }

  hasExtensions(point: UIExtensionPoint): boolean {
    return (this.extensions.get(point)?.length ?? 0) > 0;
  }

  unregisterAll(pluginName: string): void {
    let changed = false;
    for (const [point, list] of this.extensions.entries()) {
      const filtered = list.filter((e) => e.pluginName !== pluginName);
      if (filtered.length !== list.length) {
        changed = true;
      }
      if (filtered.length === 0) {
        this.extensions.delete(point);
      } else {
        this.extensions.set(point, filtered);
      }
    }
    if (changed) {
      this.notify();
    }
  }

  getAllPoints(): UIExtensionPoint[] {
    return Array.from(this.extensions.keys());
  }

  getByPlugin(pluginName: string): UIExtensionEntry[] {
    const result: UIExtensionEntry[] = [];
    for (const list of this.extensions.values()) {
      for (const entry of list) {
        if (entry.pluginName === pluginName) {
          result.push(entry);
        }
      }
    }
    return result;
  }

  clear(): void {
    this.extensions.clear();
    this.notify();
  }
}

export const uiExtensionRegistry = new UIExtensionRegistry();
