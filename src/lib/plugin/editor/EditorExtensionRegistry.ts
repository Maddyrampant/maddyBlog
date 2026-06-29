import type { Extensions } from "@tiptap/react";

export type EditorExtensionEntry = {
  pluginName: string;
  extension: Extensions[number];
  priority: number;
};

class EditorExtensionRegistry {
  private entries: EditorExtensionEntry[] = [];

  register(
    pluginName: string,
    extension: Extensions[number],
    options?: { priority?: number },
  ): void {
    this.entries.push({
      pluginName,
      extension,
      priority: options?.priority ?? 10,
    });
    this.entries.sort((a, b) => a.priority - b.priority);
  }

  getExtensions(): Extensions[number][] {
    return this.entries.map((e) => e.extension);
  }

  unregisterAll(pluginName: string): void {
    this.entries = this.entries.filter((e) => e.pluginName !== pluginName);
  }

  getByPlugin(pluginName: string): EditorExtensionEntry[] {
    return this.entries.filter((e) => e.pluginName === pluginName);
  }

  getCount(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }
}

export const editorExtensionRegistry = new EditorExtensionRegistry();
