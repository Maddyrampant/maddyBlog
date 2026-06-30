import type { Metadata } from "next";
import { getLatestPosts, getAllCategories } from "@/services/blogService";
import { getTrendingPosts } from "@/services/trendingService";
import { getPopularTags } from "@/services/tagService";
import { generatePaginatedMetadata } from "@/lib/seo";
import { ThemePageShell } from "@/components/layout/ThemePageShell";
import ThemeRenderer from "@/components/theme/ThemeRenderer";

export const revalidate = 60;

export const metadata: Metadata = generatePaginatedMetadata(
  "maddyBlog",
  "Thoughts on code, design, and building things that matter.",
);

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getLatestPosts>>["posts"] = [];
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  let trending: Awaited<ReturnType<typeof getTrendingPosts>> = [];
  let popularTags: Awaited<ReturnType<typeof getPopularTags>> = [];

  try {
    const [result, catResult, trendingResult, tagsResult] = await Promise.all([
      getLatestPosts(1, 50),
      getAllCategories(),
      getTrendingPosts(5),
      getPopularTags(10),
    ]);
    posts = result.posts;
    categories = catResult;
    trending = trendingResult;
    popularTags = tagsResult;
  } catch {
    // Database not available — render empty state
  }

  const [featured, ...rest] = posts;

  return (
    <ThemePageShell>
      <ThemeRenderer
        component="HomePage"
        props={{
          posts: rest,
          featured: featured ?? null,
          categories,
          trending,
          popularTags,
        }}
      />
    </ThemePageShell>
  );
}
