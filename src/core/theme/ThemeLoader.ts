import type {
  ThemeComponent,
  ThemeComponentName,
  ThemeManifest,
} from "./ThemeTypes";
import { THEME_REQUIRED_COMPONENTS } from "./ThemeTypes";

export type ThemeComponentModules = Partial<
  Record<
    ThemeComponentName,
    () => Promise<{ default: React.ComponentType<unknown> }>
  >
>;

export class ThemeLoader {
  private componentCache = new Map<
    string,
    Map<ThemeComponentName, React.ComponentType<unknown>>
  >();

  async loadThemeComponents(
    directory: string,
    manifest: ThemeManifest,
  ): Promise<ThemeComponent[]> {
    const components: ThemeComponent[] = [];
    const modules = this.getComponentModules(directory);

    for (const [name, loader] of Object.entries(modules)) {
      try {
        const mod = await loader();
        components.push({
          name: name as ThemeComponentName,
          type: THEME_REQUIRED_COMPONENTS.includes(name as ThemeComponentName)
            ? "required"
            : "optional",
          component: mod.default as unknown as () => React.ReactNode,
        });
      } catch {
        const componentName = name as ThemeComponentName;
        if (THEME_REQUIRED_COMPONENTS.includes(componentName)) {
          throw new Error(
            `Theme "${manifest.name}" is missing required component: ${componentName}`,
          );
        }
      }
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

    try {
      const modules = this.getComponentModules(directory);
      const loader = modules[componentName];
      if (!loader) return null;

      const mod = await loader();
      cache.set(componentName, mod.default as React.ComponentType<unknown>);
      return mod.default as React.ComponentType<unknown>;
    } catch {
      return null;
    }
  }

  clearCache(directory?: string): void {
    if (directory) {
      this.componentCache.delete(directory);
    } else {
      this.componentCache.clear();
    }
  }

  private getComponentModules(directory: string): ThemeComponentModules {
    const basePath = directory.startsWith("/")
      ? directory
      : `../../${directory}`;

    return {
      Layout: () => import(/* @vite-ignore */ `${basePath}/layout`),
      PostPage: () => import(/* @vite-ignore */ `${basePath}/post`),
      HomePage: () => import(/* @vite-ignore */ `${basePath}/home`),
      Header: () => import(/* @vite-ignore */ `${basePath}/components/Header`),
      Footer: () => import(/* @vite-ignore */ `${basePath}/components/Footer`),
      AuthorCard: () =>
        import(/* @vite-ignore */ `${basePath}/components/AuthorCard`),
      RelatedPosts: () =>
        import(/* @vite-ignore */ `${basePath}/components/RelatedPosts`),
      Sidebar: () =>
        import(/* @vite-ignore */ `${basePath}/components/Sidebar`),
      NewsletterSignup: () =>
        import(/* @vite-ignore */ `${basePath}/components/NewsletterSignup`),
      PostCard: () =>
        import(/* @vite-ignore */ `${basePath}/components/PostCard`),
      CategoryBadge: () =>
        import(/* @vite-ignore */ `${basePath}/components/CategoryBadge`),
      TagBadge: () =>
        import(/* @vite-ignore */ `${basePath}/components/TagBadge`),
      ReadingTime: () =>
        import(/* @vite-ignore */ `${basePath}/components/ReadingTime`),
      SearchBar: () =>
        import(/* @vite-ignore */ `${basePath}/components/SearchBar`),
      Pagination: () =>
        import(/* @vite-ignore */ `${basePath}/components/Pagination`),
      CommentList: () =>
        import(/* @vite-ignore */ `${basePath}/components/CommentList`),
      CommentForm: () =>
        import(/* @vite-ignore */ `${basePath}/components/CommentForm`),
    };
  }
}

export const themeLoader = new ThemeLoader();
