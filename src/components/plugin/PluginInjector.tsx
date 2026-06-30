"use client";

import {
  useSyncExternalStore,
  useCallback,
  createContext,
  useContext,
} from "react";
import { uiExtensionRegistry } from "@/lib/plugin/ui/UIExtensionRegistry";
import type { UIExtensionPoint } from "@/lib/plugin/ui/UIExtensionRegistry";

type PluginInjectorProps = {
  extensionPoint: UIExtensionPoint;
  context?: Record<string, unknown>;
};

const PluginInjectorContext = createContext<Record<string, unknown>>({});

export function usePluginInjectorContext() {
  return useContext(PluginInjectorContext);
}

export default function PluginInjector({
  extensionPoint,
  context = {},
}: PluginInjectorProps) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => uiExtensionRegistry.subscribe(onStoreChange),
    [],
  );
  const getSnapshot = useCallback(
    () => uiExtensionRegistry.getExtensions(extensionPoint),
    [extensionPoint],
  );
  const getServerSnapshot = useCallback(
    () => uiExtensionRegistry.getExtensions(extensionPoint),
    [extensionPoint],
  );

  const extensions = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (extensions.length === 0) return null;

  return (
    <PluginInjectorContext.Provider value={context}>
      {extensions.map((ext) => (
        <div key={ext.pluginName} data-plugin={ext.pluginName}>
          {ext.component()}
        </div>
      ))}
    </PluginInjectorContext.Provider>
  );
}
