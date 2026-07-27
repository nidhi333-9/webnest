import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Tag as TagIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
}

export default async function PublicPostPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { username },
  });

  if (!tenant) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { tenantId_slug: { tenantId: tenant.id, slug } },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    notFound();
  }

  const auth = await getAuthUser();
  const isOwner = Boolean(auth && auth.tenantId === tenant.id);

  // Unpublished posts are only visible to their owner.
  // Private tenants are only visible to their owner, same rule as the profile page.
  if (!post.published && !isOwner) {
    notFound();
  }
  if (!tenant.isPublic && !isOwner) {
    notFound();
  }

  // Fire-and-forget view increment; don't block rendering on it,
  // and don't count the owner's own views.
  if (!isOwner) {
    prisma.post
      .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
      .catch(() => {});
  }

  const readingTime = post.readingTime ?? estimateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-cream text-text selection:bg-sage-soft">
      <div className="bg-white border-b border-text/5 px-6 py-3 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="mx-auto max-w-3xl flex items-center justify-between text-xs font-mono text-text-light/60">
          <div className="flex items-center gap-1.5 font-semibold text-sage">
            <Globe size={14} />
            <span>{username}.webnest.com</span>
          </div>
          <Link
            href="/"
            className="hover:text-text transition-colors flex items-center gap-1"
          >
            Powered by WebNest 🌿
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href={`/${username}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-light hover:text-text transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        {!post.published && (
          <div className="mb-6 rounded-button bg-cream border border-text/10 px-4 py-2 text-xs font-bold text-text-light/70 inline-block">
            Draft — only visible to you
          </div>
        )}

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-card border border-text/5 shadow-xl shadow-sage-soft/5 mb-8"
          />
        )}

        <header className="space-y-4 mb-10">
          {post.category && (
            <span className="inline-block text-xs font-bold uppercase tracking-wide text-sage bg-sage-soft/40 px-3 py-1 rounded-full">
              {post.category.name}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-light/60">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readingTime} min read
            </span>
          </div>
        </header>

        <article className="prose prose-sm md:prose-base max-w-none text-text leading-relaxed whitespace-pre-wrap">
          {post.content}
        </article>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-12 pt-6 border-t border-text/5">
            <TagIcon size={14} className="text-text-light/40" />
            {post.tags.map((pt) => (
              <span
                key={pt.tag.id}
                className="text-[11px] font-mono font-bold bg-cream border border-text/5 px-2 py-1 rounded text-text-light"
              >
                #{pt.tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
