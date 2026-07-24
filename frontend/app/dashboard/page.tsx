// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Settings,
  Plus,
  Layout,
  ArrowUpRight,
  Globe,
  Loader2,
} from "lucide-react";

type Post = {
  id: string;
  title: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Profile = {
  id?: string;
  heroTitle: string | null;
  bio: string | null;
} | null;

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, profileRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/profile"),
        ]);

        if (!postsRes.ok || !profileRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        setPosts(await postsRes.json());
        setProfile(await profileRes.json());
      } catch (err) {
        setError("Couldn't load your dashboard. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const publishedCount = posts.filter((p) => p.published).length;

  const profileStatus =
    profile && (profile.heroTitle?.trim() || profile.bio?.trim())
      ? "Active"
      : "Not Started";

  const recentActivity = posts.slice(0, 3).map((post) => ({
    title: post.title,
    status: post.published ? "Published" : "Draft",
    date: formatDate(post.createdAt),
  }));

  const stats = [
    {
      label: "Total Published Posts",
      value: String(publishedCount),
      icon: <FileText size={20} className="text-text" />,
      bgColor: "bg-sage-soft/40",
    },
    {
      label: "Profile Status",
      value: profileStatus,
      icon: <Globe size={20} className="text-sage" />,
      bgColor: "bg-sage-soft/60",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10 flex items-center justify-center">
        <Loader2 className="animate-spin text-sage" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10 flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-text/5 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-text tracking-tight">
              Welcome to your Nest
            </h1>
            <p className="text-sm text-text-light mt-1">
              Manage your personal corner of the web, write articles, and update
              your profile layout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/posts/new"
              className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-3 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus size={16} />
              New Post
            </Link>
          </div>
        </div>

        {/* Quick Analytics / Status Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-card border border-text/5 bg-white p-6 shadow-xl shadow-sage-soft/5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-extrabold text-text mt-2 tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
              >
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Workspace Segmentation */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Columns: Recent Posts Quick Feed */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 overflow-hidden">
              <div className="px-6 py-5 border-b border-text/5 flex items-center justify-between">
                <h3 className="font-bold text-text">Recent Content Activity</h3>
                <Link
                  href="/dashboard/posts"
                  className="text-xs font-semibold text-sage hover:underline flex items-center gap-0.5"
                >
                  View all <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="divide-y divide-text/5">
                {recentActivity.length === 0 && (
                  <p className="px-6 py-6 text-sm text-text-light/60">
                    No posts yet.{" "}
                    <Link
                      href="/dashboard/posts/new"
                      className="text-sage hover:underline"
                    >
                      Write your first one.
                    </Link>
                  </p>
                )}

                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="p-6 flex items-center justify-between hover:bg-cream/10 transition-colors"
                  >
                    <div className="max-w-[70%]">
                      <h4 className="text-sm font-semibold text-text truncate">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-text-light/50 mt-1">
                        {activity.date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        activity.status === "Published"
                          ? "bg-sage-soft/50 text-text"
                          : "bg-cream text-text-light/60 border border-text/5"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Shortcut Control Links */}
          <div className="space-y-6">
            <div className="rounded-card border border-text/5 bg-white p-6 shadow-xl shadow-sage-soft/5">
              <h3 className="font-bold text-text mb-4">Quick Management</h3>

              <div className="space-y-3">
                <Link
                  href="/dashboard/posts"
                  className="flex items-center gap-3 w-full text-left rounded-button border border-text/5 bg-cream/20 hover:bg-cream/60 px-4 py-3 text-sm font-semibold text-text transition-all"
                >
                  <FileText size={16} className="text-text-light" />
                  <span>Manage Blog Posts</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 w-full text-left rounded-button border border-text/5 bg-cream/20 hover:bg-cream/60 px-4 py-3 text-sm font-semibold text-text transition-all"
                >
                  <Layout size={16} className="text-text-light" />
                  <span>Edit Profile Sections</span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 w-full text-left rounded-button border border-text/5 bg-cream/20 hover:bg-cream/60 px-4 py-3 text-sm font-semibold text-text transition-all"
                >
                  <Settings size={16} className="text-text-light" />
                  <span>Account Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
