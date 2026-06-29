import type { ThemeConfigValues } from "@/core/theme/ThemeTypes";
import { themeManager } from "@/core/theme";

export type ThemeVariable =
  | { type: "color"; value: string }
  | { type: "spacing"; value: string }
  | { type: "fontSize"; value: string }
  | { type: "fontFamily"; value: string }
  | { type: "borderRadius"; value: string }
  | { type: "shadow"; value: string };

export type ThemeOverrides = Record<string, ThemeVariable>;

class ThemePluginBridge {
  private registeredComponentSlots = new Map<
    string,
    Array<{
      pluginName: string;
      slot: string;
      priority: number;
    }>
  >();

  registerComponentSlot(
    pluginName: string,
    slot: string,
    options?: { priority?: number },
  ): void {
    if (!this.registeredComponentSlots.has(slot)) {
      this.registeredComponentSlots.set(slot, []);
    }
    const list = this.registeredComponentSlots.get(slot)!;
    list.push({
      pluginName,
      slot,
      priority: options?.priority ?? 10,
    });
    list.sort((a, b) => a.priority - b.priority);
  }

  getSlotRegistrations(slot: string): Array<{ pluginName: string }> {
    return this.registeredComponentSlots.get(slot) ?? [];
  }

  getActiveThemeName(): string | null {
    return themeManager.getActiveEntry()?.manifest.name ?? null;
  }

  getActiveThemeConfig(): ThemeConfigValues {
    const active = themeManager.getActiveEntry();
    return active?.config ?? {};
  }

  isThemeActive(themeName: string): boolean {
    return themeManager.getActiveEntry()?.manifest.name === themeName;
  }

  getAvailableThemes(): Array<{ name: string; version: string }> {
    return Array.from(themeManager.getEntries().values()).map((entry) => ({
      name: entry.manifest.name,
      version: entry.manifest.version,
    }));
  }

  unregisterAll(pluginName: string): void {
    for (const [slot, list] of this.registeredComponentSlots.entries()) {
      const filtered = list.filter((e) => e.pluginName !== pluginName);
      if (filtered.length === 0) {
        this.registeredComponentSlots.delete(slot);
      } else {
        this.registeredComponentSlots.set(slot, filtered);
      }
    }
  }

  clear(): void {
    this.registeredComponentSlots.clear();
  }
}

export const themePluginBridge = new ThemePluginBridge();
