"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  Sparkles,
  Check,
  Trash2,
} from "lucide-react";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Load the existing post once on mount
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.status === 404) {
          setLoadError(
            "This post doesn't exist or you don't have access to it.",
          );
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load post");
        }
        const post = await res.json();
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setPublished(post.published);
        setExcerpt(post.excerpt ?? "");
        setCoverImage(post.coverImage ?? "");
        setCategoryId(post.categoryId ?? "");
        setTags(post.tags.map((pt: any) => pt.tag.name));
      } catch (err) {
        setLoadError("Could not load this post. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

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
  // NOTE: unlike the "new post" page, slug does NOT auto-regenerate from title here.
  // Once a post exists, changing the title shouldn't silently break its URL.
  // If you want to let people manually regenerate it, that'd be a separate button.

  const savePost = async (fields: { published?: boolean } = {}) => {
    setSaveError(null);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          published: fields.published ?? published,
          excerpt: excerpt.trim() || null,
          coverImage: coverImage.trim() || null,
          categoryId: categoryId || null,
          tags,
        }),
      });

      if (res.status === 409) {
        setSaveError(
          "A post with this slug already exists. Try a different one.",
        );
        return false;
      }
      if (res.status === 400) {
        const data = await res.json();
        setSaveError(data.error || "Please fill in all required fields.");
        return false;
      }
      if (res.status === 404) {
        setSaveError("This post no longer exists.");
        return false;
      }
      if (!res.ok) {
        throw new Error("Failed to save post");
      }

      return true;
    } catch (err) {
      setSaveError("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextPublished = !published;
    const success = await savePost({ published: nextPublished });
    if (success) {
      setPublished(nextPublished);
    }
  };

  const handleSave = async () => {
    const success = await savePost();
    if (success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This can't be undone.",
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      router.push("/dashboard/posts");
    } catch (err) {
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10">
        <div className="mx-auto max-w-4xl text-center text-text-light text-sm py-20">
          Loading post...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-card border border-red-100 bg-red-50 p-12 text-center text-red-600 text-sm">
            {loadError}
          </div>
          <Link
            href="/dashboard/posts"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-text-light hover:text-text transition-colors"
          >
            <ArrowLeft size={16} /> Back to Posts
          </Link>
        </div>
      </div>
    );
  }

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
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-button border border-red-100 bg-white px-4 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-button border border-text/10 bg-white px-4 py-2.5 text-xs font-bold text-text transition-all hover:bg-cream/40 disabled:opacity-50"
            >
              {isSaved ? (
                <Check size={14} className="text-sage" />
              ) : (
                <Save size={14} />
              )}
              {isSaved ? "Saved!" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handlePublishToggle}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-button bg-sage px-4 py-2.5 text-xs font-bold text-cream shadow-sm transition-all hover:bg-sage-light hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Eye size={14} />
              {published ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {saveError}
          </div>
        )}

        <div className="bg-white border border-text/5 rounded-card p-6 md:p-10 shadow-xl shadow-sage-soft/10 space-y-6">
          <div className="flex items-center gap-2 rounded-lg bg-cream/50 px-4 py-2.5 text-xs font-mono text-text-light border border-text/5">
            <Globe size={14} className="text-sage-light" />
            <span className="opacity-60">yourhub.webnest.com/blog/</span>
            <input
              type="text"
              className="font-bold text-sage bg-transparent focus:outline-none truncate"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
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
          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </div>
    </div>
  );
}
