import { themeRegistry } from "./ThemeRegistry";
import * as DefaultTheme from "@/themes/default";

export type ThemeComponentName =
  | "Layout"
  | "PostPage"
  | "HomePage"
  | "Header"
  | "Footer"
  | "AuthorCard"
  | "RelatedPosts"
  | "Sidebar"
  | "NewsletterSignup"
  | "PostCard"
  | "CategoryBadge"
  | "TagBadge"
  | "ReadingTime"
  | "SearchBar"
  | "Pagination"
  | "CommentList"
  | "CommentForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

const defaultComponents: Record<string, AnyComponent | undefined> = {
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

const componentRegistry = new Map<string, Record<string, AnyComponent>>();

componentRegistry.set(
  "default",
  defaultComponents as Record<string, AnyComponent>,
);

export function registerThemeComponents(
  themeName: string,
  components: Record<string, AnyComponent>,
): void {
  componentRegistry.set(themeName, components);
}

type ThemeRendererProps<T = Record<string, unknown>> = {
  name: ThemeComponentName;
  fallback?: React.ReactNode;
} & T;

export function ThemeRenderer<T extends Record<string, unknown>>({
  name,
  fallback,
  ...props
}: ThemeRendererProps<T>) {
  const activeName = themeRegistry.getActiveThemeName() || "default";
  const registry =
    componentRegistry.get(activeName) || componentRegistry.get("default")!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = registry[name] as React.ComponentType<any> | undefined;
  if (Component) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(props as any)} />;
  }

  return fallback ?? null;
}
