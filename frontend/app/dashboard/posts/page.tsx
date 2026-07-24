"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Plus,
  FileText,
  Calendar,
  Globe,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          throw new Error("Failed to load posts");
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError("Could not load your posts. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    // Optimistically remove from UI first
    const previousPosts = posts;
    setPosts(posts.filter((post) => post.id !== id));

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
    } catch (err) {
      // Roll back if the server call failed
      setPosts(previousPosts);
      alert("Failed to delete post. Please try again.");
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-light hover:text-text transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-text/5 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-text tracking-tight">
              Your Blog Posts
            </h1>
            <p className="text-sm text-text-light mt-1">
              Manage, edit, or write new articles for your web space.
            </p>
          </div>

          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-3 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Write New Post
          </Link>
        </div>

        <div className="relative mb-6 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-light/40">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search posts by title..."
            className="w-full bg-white border border-text/10 rounded-button py-2.5 pl-10 pr-4 text-sm text-text placeholder-text-light/40 focus:border-sage focus:outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="rounded-card border border-text/5 bg-white p-12 text-center shadow-sm text-text-light text-sm">
            Loading your posts...
          </div>
        ) : error ? (
          <div className="rounded-card border border-red-100 bg-red-50 p-12 text-center text-red-600 text-sm">
            {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-card border border-dashed border-text/10 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream text-text-light/60 mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-text">No posts found</h3>
            <p className="mt-1 text-sm text-text-light max-w-sm mx-auto">
              {searchTerm
                ? "No results match your search query."
                : "You haven't written any articles yet. Begin sharing your insights today!"}
            </p>
            {!searchTerm && (
              <Link
                href="/dashboard/posts/new"
                className="mt-5 inline-flex items-center gap-2 rounded-button bg-sage-soft/60 border border-sage/20 px-4 py-2 text-xs font-bold text-text hover:bg-sage-soft transition-colors"
              >
                Create your first draft
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream/50 border-b border-text/5 text-xs font-bold uppercase tracking-wider text-text-light">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/5 text-sm text-text">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-cream/20 transition-colors group"
                    >
                      <td className="px-6 py-4 max-w-md">
                        <div className="font-semibold text-text truncate group-hover:text-sage transition-colors">
                          {post.title}
                        </div>
                        <div className="text-xs text-text-light/60 truncate mt-0.5 flex items-center gap-1">
                          <Globe size={12} /> /{post.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            post.published
                              ? "bg-sage-soft/60 text-text"
                              : "bg-cream text-text-light/60 border border-text/5"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              post.published ? "bg-sage" : "bg-text-light/40"
                            }`}
                          />
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-light text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-text-light/40" />
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/posts/${post.id}/edit`}
                            className="rounded p-1.5 text-text-light hover:bg-cream hover:text-text transition-all"
                            title="Edit Post"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="rounded p-1.5 text-text-light hover:bg-red-50 hover:text-red-600 transition-all"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
