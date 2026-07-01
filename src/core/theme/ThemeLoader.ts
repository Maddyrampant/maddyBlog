import type { ThemeComponentName, ThemeManifest } from "./ThemeTypes";
import { THEME_REQUIRED_COMPONENTS } from "./ThemeTypes";
import { registerThemeComponents } from "./ThemeRenderer";
import * as DefaultTheme from "@/themes/default";
import * as MadelinTheme from "@/themes/madelin";
import * as ZoomjiTheme from "@/themes/zoomji";
import * as ZoomgTheme from "@/themes/zoomg";
import * as DigiTechTheme from "@/themes/digitech";
import * as GameVerseTheme from "@/themes/gameverse";
import * as PersonalBlogTheme from "@/themes/personalblog";
import * as NewsWireTheme from "@/themes/newswire";
import * as EduProTheme from "@/themes/edupro";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomgModules: Record<string, React.ComponentType<any>> = {
      Layout: ZoomgTheme.Layout,
      PostPage: ZoomgTheme.PostPage,
      HomePage: ZoomgTheme.HomePage,
      Header: ZoomgTheme.Header,
      Footer: ZoomgTheme.Footer,
      AuthorCard: ZoomgTheme.AuthorCard,
      RelatedPosts: ZoomgTheme.RelatedPosts,
      Sidebar: ZoomgTheme.Sidebar,
      NewsletterSignup: ZoomgTheme.NewsletterSignup,
      PostCard: ZoomgTheme.PostCard,
      CategoryBadge: ZoomgTheme.CategoryBadge,
      TagBadge: ZoomgTheme.TagBadge,
      ReadingTime: ZoomgTheme.ReadingTime,
      SearchBar: ZoomgTheme.SearchBar,
      Pagination: ZoomgTheme.Pagination,
      CommentList: ZoomgTheme.CommentList,
      CommentForm: ZoomgTheme.CommentForm,
    };

    themeModuleRegistry.set("zoomg", zoomgModules);
    registerThemeComponents("zoomg", zoomgModules);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const digitechModules: Record<string, React.ComponentType<any>> = {
      Layout: DigiTechTheme.Layout,
      PostPage: DigiTechTheme.PostPage,
      HomePage: DigiTechTheme.HomePage,
      Header: DigiTechTheme.Header,
      Footer: DigiTechTheme.Footer,
      AuthorCard: DigiTechTheme.AuthorCard,
      RelatedPosts: DigiTechTheme.RelatedPosts,
      Sidebar: DigiTechTheme.Sidebar,
      NewsletterSignup: DigiTechTheme.NewsletterSignup,
      PostCard: DigiTechTheme.PostCard,
      CategoryBadge: DigiTechTheme.CategoryBadge,
      TagBadge: DigiTechTheme.TagBadge,
      ReadingTime: DigiTechTheme.ReadingTime,
      SearchBar: DigiTechTheme.SearchBar,
      Pagination: DigiTechTheme.Pagination,
      CommentList: DigiTechTheme.CommentList,
      CommentForm: DigiTechTheme.CommentForm,
    };

    themeModuleRegistry.set("digitech", digitechModules);
    registerThemeComponents("digitech", digitechModules);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameverseModules: Record<string, React.ComponentType<any>> = {
      Layout: GameVerseTheme.Layout,
      PostPage: GameVerseTheme.PostPage,
      HomePage: GameVerseTheme.HomePage,
      Header: GameVerseTheme.Header,
      Footer: GameVerseTheme.Footer,
      AuthorCard: GameVerseTheme.AuthorCard,
      RelatedPosts: GameVerseTheme.RelatedPosts,
      Sidebar: GameVerseTheme.Sidebar,
      NewsletterSignup: GameVerseTheme.NewsletterSignup,
      PostCard: GameVerseTheme.PostCard,
      CategoryBadge: GameVerseTheme.CategoryBadge,
      TagBadge: GameVerseTheme.TagBadge,
      ReadingTime: GameVerseTheme.ReadingTime,
      SearchBar: GameVerseTheme.SearchBar,
      Pagination: GameVerseTheme.Pagination,
      CommentList: GameVerseTheme.CommentList,
      CommentForm: GameVerseTheme.CommentForm,
    };

    themeModuleRegistry.set("gameverse", gameverseModules);
    registerThemeComponents("gameverse", gameverseModules);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const personalblogModules: Record<string, React.ComponentType<any>> = {
      Layout: PersonalBlogTheme.Layout,
      PostPage: PersonalBlogTheme.PostPage,
      HomePage: PersonalBlogTheme.HomePage,
      Header: PersonalBlogTheme.Header,
      Footer: PersonalBlogTheme.Footer,
      AuthorCard: PersonalBlogTheme.AuthorCard,
      RelatedPosts: PersonalBlogTheme.RelatedPosts,
      Sidebar: PersonalBlogTheme.Sidebar,
      NewsletterSignup: PersonalBlogTheme.NewsletterSignup,
      PostCard: PersonalBlogTheme.PostCard,
      CategoryBadge: PersonalBlogTheme.CategoryBadge,
      TagBadge: PersonalBlogTheme.TagBadge,
      ReadingTime: PersonalBlogTheme.ReadingTime,
      SearchBar: PersonalBlogTheme.SearchBar,
      Pagination: PersonalBlogTheme.Pagination,
      CommentList: PersonalBlogTheme.CommentList,
      CommentForm: PersonalBlogTheme.CommentForm,
    };

    themeModuleRegistry.set("personalblog", personalblogModules);
    registerThemeComponents("personalblog", personalblogModules);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newswireModules: Record<string, React.ComponentType<any>> = {
      Layout: NewsWireTheme.Layout,
      PostPage: NewsWireTheme.PostPage,
      HomePage: NewsWireTheme.HomePage,
      Header: NewsWireTheme.Header,
      Footer: NewsWireTheme.Footer,
      AuthorCard: NewsWireTheme.AuthorCard,
      RelatedPosts: NewsWireTheme.RelatedPosts,
      Sidebar: NewsWireTheme.Sidebar,
      NewsletterSignup: NewsWireTheme.NewsletterSignup,
      PostCard: NewsWireTheme.PostCard,
      CategoryBadge: NewsWireTheme.CategoryBadge,
      TagBadge: NewsWireTheme.TagBadge,
      ReadingTime: NewsWireTheme.ReadingTime,
      SearchBar: NewsWireTheme.SearchBar,
      Pagination: NewsWireTheme.Pagination,
      CommentList: NewsWireTheme.CommentList,
      CommentForm: NewsWireTheme.CommentForm,
    };

    themeModuleRegistry.set("newswire", newswireModules);
    registerThemeComponents("newswire", newswireModules);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eduproModules: Record<string, React.ComponentType<any>> = {
      Layout: EduProTheme.Layout,
      PostPage: EduProTheme.PostPage,
      HomePage: EduProTheme.HomePage,
      Header: EduProTheme.Header,
      Footer: EduProTheme.Footer,
      AuthorCard: EduProTheme.AuthorCard,
      RelatedPosts: EduProTheme.RelatedPosts,
      Sidebar: EduProTheme.Sidebar,
      NewsletterSignup: EduProTheme.NewsletterSignup,
      PostCard: EduProTheme.PostCard,
      CategoryBadge: EduProTheme.CategoryBadge,
      TagBadge: EduProTheme.TagBadge,
      ReadingTime: EduProTheme.ReadingTime,
      SearchBar: EduProTheme.SearchBar,
      Pagination: EduProTheme.Pagination,
      CommentList: EduProTheme.CommentList,
      CommentForm: EduProTheme.CommentForm,
    };

    themeModuleRegistry.set("edupro", eduproModules);
    registerThemeComponents("edupro", eduproModules);
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
