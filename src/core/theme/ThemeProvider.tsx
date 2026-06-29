"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ThemeConfigValues, ThemeManifest } from "./ThemeTypes";
import { themeManager } from "./ThemeManager";

type ThemeContextValue = {
  activeTheme: string | null;
  config: ThemeConfigValues | null;
  manifest: ThemeManifest | null;
  setConfigValue: (key: string, value: string | number | boolean) => void;
  isLoaded: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  activeTheme: null,
  config: null,
  manifest: null,
  setConfigValue: () => {},
  isLoaded: false,
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [config, setConfig] = useState<ThemeConfigValues | null>(null);
  const [manifest, setManifest] = useState<ThemeManifest | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      await themeManager.initialize();
      const active = themeManager.getActiveEntry();
      if (active) {
        setActiveTheme(active.manifest.name);
        setConfig(active.config);
        setManifest(active.manifest);
      }
      setIsLoaded(true);
    }
    load();
  }, []);

  const setConfigValue = useCallback(
    (key: string, value: string | number | boolean) => {
      setConfig((prev) => {
        const next = { ...prev, [key]: value } as ThemeConfigValues;
        if (activeTheme) {
          themeManager.updateConfig(activeTheme, next);
        }
        return next;
      });
    },
    [activeTheme],
  );

  return (
    <ThemeContext.Provider
      value={{ activeTheme, config, manifest, setConfigValue, isLoaded }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
