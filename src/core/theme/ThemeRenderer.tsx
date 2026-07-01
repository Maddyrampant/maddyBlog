import { themeRegistry } from "./ThemeRegistry";
import * as DefaultTheme from "@/themes/default";
import * as MadelinTheme from "@/themes/madelin";
import * as ZoomjiTheme from "@/themes/zoomji";
import * as ZoomgTheme from "@/themes/zoomg";
import * as DigiTechTheme from "@/themes/digitech";
import * as GameVerseTheme from "@/themes/gameverse";
import * as PersonalBlogTheme from "@/themes/personalblog";
import * as NewsWireTheme from "@/themes/newswire";
import * as EduProTheme from "@/themes/edupro";

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

const madelinComponents: Record<string, AnyComponent | undefined> = {
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

const zoomgComponents: Record<string, AnyComponent | undefined> = {
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

const zoomjiComponents: Record<string, AnyComponent | undefined> = {
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

const componentRegistry = new Map<string, Record<string, AnyComponent>>();

componentRegistry.set(
  "default",
  defaultComponents as Record<string, AnyComponent>,
);

componentRegistry.set(
  "madelin",
  madelinComponents as Record<string, AnyComponent>,
);

componentRegistry.set(
  "zoomji",
  zoomjiComponents as Record<string, AnyComponent>,
);

componentRegistry.set("zoomg", zoomgComponents as Record<string, AnyComponent>);

const digitechComponents: Record<string, AnyComponent | undefined> = {
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

const gameverseComponents: Record<string, AnyComponent | undefined> = {
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

const personalblogComponents: Record<string, AnyComponent | undefined> = {
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

const newswireComponents: Record<string, AnyComponent | undefined> = {
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

const eduproComponents: Record<string, AnyComponent | undefined> = {
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

componentRegistry.set(
  "digitech",
  digitechComponents as Record<string, AnyComponent>,
);

componentRegistry.set(
  "gameverse",
  gameverseComponents as Record<string, AnyComponent>,
);

componentRegistry.set(
  "personalblog",
  personalblogComponents as Record<string, AnyComponent>,
);

componentRegistry.set(
  "newswire",
  newswireComponents as Record<string, AnyComponent>,
);

componentRegistry.set(
  "edupro",
  eduproComponents as Record<string, AnyComponent>,
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
