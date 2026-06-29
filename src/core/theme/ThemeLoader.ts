import type { ThemeComponentName, ThemeManifest } from "./ThemeTypes";
import { THEME_REQUIRED_COMPONENTS } from "./ThemeTypes";
import { registerThemeComponents } from "./ThemeRenderer";
import * as DefaultTheme from "@/themes/default";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const themeModuleRegistry = new Map<
  string,
  Record<string, React.ComponentType<any>>
>();

export function registerThemeModules(
  themeName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: Record<string, React.ComponentType<any>>,
): void {
  themeModuleRegistry.set(themeName, modules);
  registerThemeComponents(themeName, modules);
}

export class ThemeLoader {
  private componentCache = new Map<
    string,
    Map<ThemeComponentName, React.ComponentType<unknown>>
  >();

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultModules: Record<string, React.ComponentType<any>> = {
      Layout: DefaultTheme.Layout,
      PostPage: DefaultTheme.PostPage,
      HomePage: DefaultTheme.HomePage,
      Header: DefaultTheme.Header,
      Footer: DefaultTheme.Footer,
      AuthorCard: DefaultTheme.AuthorCard,
      RelatedPosts: DefaultTheme.RelatedPosts,
      Sidebar: DefaultTheme.Sidebar,
      NewsletterSignup: DefaultTheme.NewsletterSignup,
      PostCard: DefaultTheme.PostCard,
      CategoryBadge: DefaultTheme.CategoryBadge,
      TagBadge: DefaultTheme.TagBadge,
      ReadingTime: DefaultTheme.ReadingTime,
      SearchBar: DefaultTheme.SearchBar,
      Pagination: DefaultTheme.Pagination,
      CommentList: DefaultTheme.CommentList,
      CommentForm: DefaultTheme.CommentForm,
    };

    themeModuleRegistry.set("default", defaultModules);
    registerThemeComponents("default", defaultModules);
  }

  async loadThemeComponents(
    directory: string,
    manifest: ThemeManifest,
  ): Promise<
    {
      name: ThemeComponentName;
      type: "required" | "optional";
      component: () => React.ReactNode;
    }[]
  > {
    const components: {
      name: ThemeComponentName;
      type: "required" | "optional";
      component: () => React.ReactNode;
    }[] = [];
    const themeName = manifest.name;
    const modules = themeModuleRegistry.get(themeName);

    if (!modules) {
      if (THEME_REQUIRED_COMPONENTS.some((name) => !modules?.[name])) {
        throw new Error(
          `Theme "${themeName}" is not registered in the module registry`,
        );
      }
      return [];
    }

    for (const [name, Component] of Object.entries(modules)) {
      const componentName = name as ThemeComponentName;
      components.push({
        name: componentName,
        type: THEME_REQUIRED_COMPONENTS.includes(componentName)
          ? "required"
          : "optional",
        component: Component as unknown as () => React.ReactNode,
      });
    }

    return components;
  }

  async resolveComponent(
    directory: string,
    componentName: ThemeComponentName,
  ): Promise<React.ComponentType<unknown> | null> {
    const themeCacheKey = directory;
    if (!this.componentCache.has(themeCacheKey)) {
      this.componentCache.set(themeCacheKey, new Map());
    }

    const cache = this.componentCache.get(themeCacheKey)!;
    if (cache.has(componentName)) {
      return cache.get(componentName) ?? null;
    }

    // Find the theme name from the registry by directory
    for (const [, entry] of themeModuleRegistry.entries()) {
      const Component = entry[componentName];
      if (Component) {
        cache.set(componentName, Component);
        return Component;
      }
    }

    return null;
  }

  clearCache(directory?: string): void {
    if (directory) {
      this.componentCache.delete(directory);
    } else {
      this.componentCache.clear();
    }
  }
}

export const themeLoader = new ThemeLoader();
