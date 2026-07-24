import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Globe,
  FolderGit2,
  BookOpen,
  Mail,
  ArrowUpRight,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export default async function PublicWriterProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { username },
    include: {
      profile: true,
      socialLinks: true,
      skills: { orderBy: { name: "asc" } },
      posts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      },
      projects: {
        orderBy: { featured: "desc" },
        include: {
          technologies: {
            include: { technology: true },
          },
        },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  // Private profiles: only the owner can view. Anyone else gets a 404
  // rather than a "private" message, so we don't leak that the username exists.
  if (!tenant.isPublic) {
    const auth = await getAuthUser();
    if (!auth || auth.tenantId !== tenant.id) {
      notFound();
    }
  }

  const profile = tenant.profile;
  const socials = tenant.socialLinks;
  const projects = tenant.projects;

  return (
    <div className="min-h-screen bg-cream text-text selection:bg-sage-soft">
      {/* Dynamic Subdomain Header Banner */}
      <div className="bg-white border-b border-text/5 px-6 py-3 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="mx-auto max-w-4xl flex items-center justify-between text-xs font-mono text-text-light/60">
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

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-20">
        {/* Profile Hero Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-sage-soft flex items-center justify-center text-4xl shadow-inner border border-text/5 overflow-hidden">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={tenant.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                "🌿"
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-text">
                {profile?.heroTitle || tenant.displayName}
              </h1>
              <p className="text-sm font-semibold text-sage-light mt-0.5">
                @{username}
              </p>
            </div>
          </div>
          <p className="text-base text-text-light leading-relaxed max-w-2xl">
            {profile?.heroSubtitle ||
              profile?.bio ||
              "This writer hasn't added a bio yet."}
          </p>
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sage bg-white border border-text/5 rounded-button px-3 py-1.5 shadow-sm hover:border-sage transition-all"
                >
                  {social.platform}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          )}
        </section>

        {tenant.skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-text/5 pb-3">
              <Wrench size={20} className="text-sage" />
              <h2 className="text-xl font-bold tracking-tight text-text">
                Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tenant.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs font-bold bg-sage-soft/40 text-text px-3 py-1.5 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Project Showcases Section */}
        {projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-text/5 pb-3">
              <FolderGit2 size={20} className="text-sage" />
              <h2 className="text-xl font-bold tracking-tight text-text">
                Featured Projects
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-text/5 rounded-card overflow-hidden shadow-xl shadow-sage-soft/5 flex flex-col justify-between"
                >
                  {project.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-40 w-full object-cover border-b border-text/5"
                    />
                  )}

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-text text-base">
                        {project.title}
                      </h3>
                      <p className="text-sm text-text-light mt-2 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {project.technologies.map((pt) => (
                        <span
                          key={pt.technology?.id || pt.technologyId}
                          className="text-[10px] font-mono font-bold bg-cream px-2 py-0.5 rounded text-text-light"
                        >
                          {pt.technology.name}
                        </span>
                      ))}
                    </div>

                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex items-center gap-4 pt-4 mt-4 border-t border-text/5">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-text-light/70 hover:text-sage transition-colors"
                          >
                            <FaGithub size={14} /> Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-text-light/70 hover:text-sage transition-colors"
                          >
                            <ExternalLink size={14} /> Live
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications Feed Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-text/5 pb-3">
            <BookOpen size={20} className="text-sage" />
            <h2 className="text-xl font-bold tracking-tight text-text">
              Latest Publications
            </h2>
          </div>
          {tenant.posts.length > 0 ? (
            <div className="space-y-6">
              {tenant.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${username}/blog/${post.slug}`}
                  className="block bg-white border border-text/5 rounded-card p-6 shadow-xl shadow-sage-soft/5 group cursor-pointer hover:border-sage/30 transition-all"
                >
                  <h3 className="font-bold text-lg text-text group-hover:text-sage transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-light mt-2 leading-relaxed line-clamp-2">
                    {post.excerpt || post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-text-light/50 mt-4 pt-4 border-t border-text/5">
                    <span>
                      {new Date(
                        post.publishedAt || post.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-light">No posts published yet.</p>
          )}
        </section>

        {/* Public Connect / Footer Channel */}
        {profile?.emailPublic && (
          <section className="bg-white border border-text/5 rounded-card p-8 text-center shadow-xl shadow-sage-soft/5">
            <Mail size={28} className="text-sage mx-auto mb-3" />
            <h3 className="font-bold text-text text-lg">Let's collaborate</h3>
            <p className="text-sm text-text-light mt-1 max-w-sm mx-auto">
              Want to build something together or discuss an article? Drop a
              message through my channels above.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
