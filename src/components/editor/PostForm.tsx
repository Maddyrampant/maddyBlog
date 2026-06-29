"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

type Category = { id: string; name: string; slug: string };
type Tag = { id: string; name: string; slug: string };
type Post = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  slug: string;
  status: string;
  categoryId: string | null;
  tags: Array<{ tag: { id: string } } | { id: string }>;
};

type PostFormProps = {
  categories: Category[];
  tags: Tag[];
  post?: Post | null;
};

export default function PostForm({ categories, tags, post }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (!post?.tags) return [];
    return post.tags
      .map((t) => {
        if ("tag" in t && t.tag) return t.tag.id;
        if ("id" in t) return t.id;
        return "";
      })
      .filter(Boolean);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [postId, setPostId] = useState(post?.id || "");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;

    setSaveStatus("saving");
    try {
      const res = await fetch("/api/posts/draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: postId || undefined,
          title,
          content,
          excerpt: excerpt || undefined,
          categoryId: categoryId || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.post && !postId) {
          setPostId(data.post.id);
        }
        setSaveStatus("saved");
      } else {
        setSaveStatus("idle");
      }
    } catch {
      setSaveStatus("idle");
    }
  }, [title, content, excerpt, categoryId, postId]);

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      autosave();
    }, 30000);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [autosave]);

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts${postId ? `/${postId}` : ""}`, {
        method: postId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || undefined,
          coverImage: coverImage || undefined,
          categoryId: categoryId || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          status,
        }),
      });

      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorChange = useCallback((html: string) => {
    setContent(html);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {post ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "saved"
                ? "Draft saved"
                : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full text-3xl font-bold tracking-tight border-0 border-b border-zinc-200 dark:border-zinc-800 pb-3 bg-transparent outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          />

          <Editor
            initialContent={post?.content || ""}
            onChange={handleEditorChange}
          />
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
              className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent outline-none focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description…"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent outline-none focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 outline-none focus:ring-1 focus:ring-zinc-400"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTags((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id],
                      );
                    }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      isSelected
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                        : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
