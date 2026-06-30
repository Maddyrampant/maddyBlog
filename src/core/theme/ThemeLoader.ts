import type { ThemeComponentName, ThemeManifest } from "./ThemeTypes";
import { THEME_REQUIRED_COMPONENTS } from "./ThemeTypes";
import { registerThemeComponents } from "./ThemeRenderer";
import * as DefaultTheme from "@/themes/default";
import * as MadelinTheme from "@/themes/madelin";
import * as ZoomjiTheme from "@/themes/zoomji";

const themeModuleRegistry = new Map<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const madelinModules: Record<string, React.ComponentType<any>> = {
      Layout: MadelinTheme.Layout,
      PostPage: MadelinTheme.PostPage,
      HomePage: MadelinTheme.HomePage,
      Header: MadelinTheme.Header,
      Footer: MadelinTheme.Footer,
      AuthorCard: MadelinTheme.AuthorCard,
      RelatedPosts: MadelinTheme.RelatedPosts,
      Sidebar: MadelinTheme.Sidebar,
      NewsletterSignup: MadelinTheme.NewsletterSignup,
      PostCard: MadelinTheme.PostCard,
      CategoryBadge: MadelinTheme.CategoryBadge,
      TagBadge: MadelinTheme.TagBadge,
      ReadingTime: MadelinTheme.ReadingTime,
      SearchBar: MadelinTheme.SearchBar,
      Pagination: MadelinTheme.Pagination,
      CommentList: MadelinTheme.CommentList,
      CommentForm: MadelinTheme.CommentForm,
    };

    themeModuleRegistry.set("madelin", madelinModules);
    registerThemeComponents("madelin", madelinModules);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomjiModules: Record<string, React.ComponentType<any>> = {
      Layout: ZoomjiTheme.Layout,
      PostPage: ZoomjiTheme.PostPage,
      HomePage: ZoomjiTheme.HomePage,
      Header: ZoomjiTheme.Header,
      Footer: ZoomjiTheme.Footer,
      AuthorCard: ZoomjiTheme.AuthorCard,
      RelatedPosts: ZoomjiTheme.RelatedPosts,
      Sidebar: ZoomjiTheme.Sidebar,
      NewsletterSignup: ZoomjiTheme.NewsletterSignup,
      PostCard: ZoomjiTheme.PostCard,
      CategoryBadge: ZoomjiTheme.CategoryBadge,
      TagBadge: ZoomjiTheme.TagBadge,
      ReadingTime: ZoomjiTheme.ReadingTime,
      SearchBar: ZoomjiTheme.SearchBar,
      Pagination: ZoomjiTheme.Pagination,
      CommentList: ZoomjiTheme.CommentList,
      CommentForm: ZoomjiTheme.CommentForm,
    };

    themeModuleRegistry.set("zoomji", zoomjiModules);
    registerThemeComponents("zoomji", zoomjiModules);
  }

  async loadThemeComponents(
    _directory: string,
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
      throw new Error(
        `Theme "${themeName}" is not registered in the module registry`,
      );
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
    themeName: string,
    componentName: ThemeComponentName,
  ): Promise<React.ComponentType<unknown> | null> {
    if (!this.componentCache.has(themeName)) {
      this.componentCache.set(themeName, new Map());
    }

    const cache = this.componentCache.get(themeName)!;
    if (cache.has(componentName)) {
      return cache.get(componentName) ?? null;
    }

    const modules = themeModuleRegistry.get(themeName);
    if (!modules) return null;

    const Component = modules[componentName];
    if (Component) {
      cache.set(componentName, Component);
      return Component;
    }

    return null;
  }

  clearCache(themeName?: string): void {
    if (themeName) {
      this.componentCache.delete(themeName);
    } else {
      this.componentCache.clear();
    }
  }
}

export const themeLoader = new ThemeLoader();
