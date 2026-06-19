"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  FileText,
  Calendar,
  Globe,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";

// Mock data structure to simulate actual blog entries from your future database
const INITIAL_POSTS = [
  {
    id: "1",
    title: "Understanding Database Isolation Levels",
    slug: "understanding-database-isolation-levels",
    status: "Published",
    date: "June 14, 2026",
  },
  {
    id: "2",
    title: "Building a Multi-Tenant Core Layer inside Postgres",
    slug: "building-multi-tenant-postgres",
    status: "Published",
    date: "May 29, 2026",
  },
  {
    id: "3",
    title: "Why Docker Containers Fail Silently in Local Swarms",
    slug: "docker-containers-silently-failing",
    status: "Draft",
    date: "In Progress",
  },
];

export default function Posts() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on search input
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Header Control Panel Bar */}
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

        {/* Search Utility Bar */}
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

        {/* Content Section: Data Table or Empty State Card */}
        {filteredPosts.length === 0 ? (
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
          /* Structured Table Data Sheet */
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
                      {/* Post Title & Dynamic URL Handle Preview */}
                      <td className="px-6 py-4 max-w-md">
                        <div className="font-semibold text-text truncate group-hover:text-sage transition-colors">
                          {post.title}
                        </div>
                        <div className="text-xs text-text-light/60 truncate mt-0.5 flex items-center gap-1">
                          <Globe size={12} /> /{post.slug}
                        </div>
                      </td>
                      {/* Dynamic Badge Status Anchor */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            post.status === "Published"
                              ? "bg-sage-soft/60 text-text"
                              : "bg-cream text-text-light/60 border border-text/5"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              post.status === "Published"
                                ? "bg-sage"
                                : "bg-text-light/40"
                            }`}
                          />
                          {post.status}
                        </span>
                      </td>
                      {/* Creation Timestamp Panel */}
                      <td className="px-6 py-4 whitespace-nowrap text-text-light text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-text-light/40" />
                          {post.date}
                        </div>
                      </td>
                      {/* Modifier Control Accessors */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="rounded p-1.5 text-text-light hover:bg-cream hover:text-text transition-all"
                            title="Edit Post"
                          >
                            <Edit2 size={16} />
                          </button>
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
