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

  // Automatically convert the title into a clean, URL-safe slug format
  useEffect(() => {
    const formattedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove all special characters except spaces and hyphens
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with a single hyphen
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
    setSlug(formattedSlug);
  }, [title]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend mock action - will connect to your Spring Boot REST API
    console.log("Publishing Article:", { title, slug, content });
    router.push("/dashboard/posts");
  };

  const handleSaveDraft = () => {
    setIsSaved(true);
    console.log("Saving Draft:", { title, slug, content });
    setTimeout(() => setIsSaved(false), 2000); // Reset save state banner
  };

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Return Hook */}
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

          {/* Core Action Command Panel */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 rounded-button border border-text/10 bg-white px-4 py-2.5 text-xs font-bold text-text transition-all hover:bg-cream/40"
            >
              {isSaved ? (
                <Check size={14} className="text-sage" />
              ) : (
                <Save size={14} />
              )}
              {isSaved ? "Saved!" : "Save Draft"}
            </button>

            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-2 rounded-button bg-sage px-4 py-2.5 text-xs font-bold text-cream shadow-sm transition-all hover:bg-sage-light hover:-translate-y-0.5"
            >
              <Eye size={14} />
              Publish Post
            </button>
          </div>
        </div>

        {/* Studio Canvas Workspace Card */}
        <form
          onSubmit={handlePublish}
          className="bg-white border border-text/5 rounded-card p-6 md:p-10 shadow-xl shadow-sage-soft/10 space-y-6"
        >
          {/* Live Link Subdomain Routing Preview */}
          <div className="flex items-center gap-2 rounded-lg bg-cream/50 px-4 py-2.5 text-xs font-mono text-text-light border border-text/5">
            <Globe size={14} className="text-sage-light" />
            <span className="opacity-60">yourhub.webnest.com/blog/</span>
            <span className="font-bold text-sage truncate">
              {slug || "your-post-url"}
            </span>
          </div>

          {/* Article Title Input */}
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

          {/* Modular Composition Text Area */}
          <div className="pt-2 border-t border-text/5">
            {/* Formatting Help Note Flag */}
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
