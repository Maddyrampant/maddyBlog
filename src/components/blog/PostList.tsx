import type { PostCardData } from "@/services/blogService";
import PostCard from "./PostCard";

export default function PostList({ posts }: { posts: PostCardData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
