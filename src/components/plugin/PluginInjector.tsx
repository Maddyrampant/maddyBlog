"use client";

import { getUiHooks } from "@/lib/plugin/hookSystem";

type PluginInjectorProps = {
  hook: string;
};

export default function PluginInjector({ hook }: PluginInjectorProps) {
  const hooks = getUiHooks(hook);

  if (hooks.length === 0) return null;

  return (
    <>
      {hooks.map((h) => (
        <div key={h.pluginName} data-plugin={h.pluginName}>
          {h.component()}
        </div>
      ))}
    </>
  );
}
