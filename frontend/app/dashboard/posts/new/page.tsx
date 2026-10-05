"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Globe, Eye, Sparkles, Check } from "lucide-react";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const formattedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(formattedSlug);
  }, [title]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);

  function handleAddTag() {
    const name = tagInput.trim();
    if (!name) return;
    setTags((prev) =>
      prev.some((t) => t.toLowerCase() === name.toLowerCase())
        ? prev
        : [...prev, name],
    );
    setTagInput("");
  }
  function handleRemoveTag(name: string) {
    setTags((prev) => prev.filter((t) => t !== name));
  }
  const createPost = async (published: boolean) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          published,
          excerpt: excerpt.trim() || null,
          coverImage: coverImage.trim() || null,
          categoryId: categoryId || null,
          tags,
        }),
      });

      if (res.status === 409) {
        setError(
          "A post with this slug already exists. Try a different title.",
        );
        return;
      }
      if (res.status === 400) {
        const data = await res.json();
        setError(data.error || "Please fill in all required fields.");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      return true;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createPost(true);
    if (success) {
      router.push("/dashboard/posts");
    }
  };

  const handleSaveDraft = async () => {
    const success = await createPost(false);
    if (success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/posts"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-light hover:text-text transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Posts
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-button border border-text/10 bg-white px-4 py-2.5 text-xs font-bold text-text transition-all hover:bg-cream/40 disabled:opacity-50"
            >
              {isSaved ? (
                <Check size={14} className="text-sage" />
              ) : (
                <Save size={14} />
              )}
              {isSaved ? "Saved!" : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-button bg-sage px-4 py-2.5 text-xs font-bold text-cream shadow-sm transition-all hover:bg-sage-light hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Eye size={14} />
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handlePublish}
          className="bg-white border border-text/5 rounded-card p-6 md:p-10 shadow-xl shadow-sage-soft/10 space-y-6"
        >
          <div className="flex items-center gap-2 rounded-lg bg-cream/50 px-4 py-2.5 text-xs font-mono text-text-light border border-text/5">
            <Globe size={14} className="text-sage-light" />
            <span className="opacity-60">webnest.com/yourname/blog/</span>
            <span className="font-bold text-sage truncate">
              {slug || "your-post-url"}
            </span>
          </div>

          <div>
            <input
              type="text"
              required
              placeholder="Title your masterpiece..."
              className="w-full text-3xl md:text-4xl font-extrabold tracking-tight text-text placeholder-text-light/30 focus:outline-none bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <input
              type="text"
              placeholder="Excerpt (optional)"
              className="w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <select
              className="w-full rounded-button border border-text/10 px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Cover image URL (optional)"
            className="w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full bg-sage-soft/40 px-3 py-1.5 text-xs font-semibold text-text"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-text-light/50 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag, press Enter"
              className="flex-1 rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
          </div>
          <div className="pt-2 border-t border-text/5">
            <div className="mb-4 flex items-center gap-1.5 text-[11px] font-medium text-text-light/50 tracking-wide uppercase">
              <Sparkles size={12} className="text-sage-light" />
              <span>Supports standard formatting styles</span>
            </div>

            <textarea
              required
              placeholder="Tell your story. Write your thoughts down directly..."
              className="w-full min-h-[400px] text-base leading-relaxed text-text placeholder-text-light/40 bg-transparent resize-none focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
