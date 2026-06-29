import { themeManager } from "@/core/theme";
import type { ThemeComponentName } from "@/core/theme";

type ThemeRendererProps = {
  component: ThemeComponentName;
  fallback?: React.ComponentType<unknown>;
  props?: Record<string, unknown>;
};

export default async function ThemeRenderer({
  component: componentName,
  fallback: Fallback,
  props = {},
}: ThemeRendererProps) {
  await themeManager.initialize();

  const Component = (await themeManager.resolveComponent(
    componentName,
  )) as React.ComponentType<Record<string, unknown>> | null;

  if (!Component) {
    if (Fallback) {
      return <Fallback {...props} />;
    }
    return null;
  }

  return <Component {...props} />;
}

export async function resolveThemeComponent<T>(
  componentName: ThemeComponentName,
): Promise<React.ComponentType<T> | null> {
  await themeManager.initialize();
  const Component = await themeManager.resolveComponent(componentName);
  return Component as React.ComponentType<T> | null;
}
