"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Globe,
  FolderGit2,
  BookOpen,
  User,
  Mail,
  ArrowUpRight,
  MessageSquare,
  Flame,
} from "lucide-react";

// Mock database extraction based on the dynamic username parameter
const MOCK_WRITER_DATA = {
  name: "Nidhi Sharma",
  bio: "Software Engineer & Designer. Building open-source developer toolings, mastering the MERN stack, and exploring full-stack multi-tenant architecture pipelines.",
  avatar: "👩‍💻",
  socials: [
    { platform: "GitHub", url: "https://github.com" },
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
  ],
  projects: [
    {
      title: "⚡ Aura Analytics Suite",
      description:
        "A behavioral analytics ecosystem tracking real-time layout structures using local logging utilities and custom dashboard visualizations.",
      tags: ["Python", "FastAPI", "React", "MongoDB"],
    },
    {
      title: "🧠 InterviewIQ Matrix",
      description:
        "An automated virtual staging engine utilizing language processing models to parse career documentation templates dynamically.",
      tags: ["Next.js", "spaCy", "Gemini API", "Tailwind"],
    },
  ],
  blogs: [
    {
      title: "Understanding Database Isolation Levels",
      slug: "database-isolation-levels",
      excerpt:
        "Demystifying Dirty Reads, Non-repeatable Reads, and Phantom reads down to the hardware storage allocation engines...",
      date: "June 14, 2026",
      readTime: "5 min read",
    },
    {
      title: "Building a Multi-Tenant Core Layer inside Postgres",
      slug: "multi-tenant-postgres",
      excerpt:
        "Architecting logical isolation patterns for modular SaaS applications using schema pooling methods...",
      date: "May 29, 2026",
      readTime: "8 min read",
    },
  ],
};

export default function PublicWriterProfile() {
  const params = useParams();
  const username = params.username as string;
  const writer = MOCK_WRITER_DATA; // In production, fetch this via Spring Boot using the username string

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
            <div className="h-20 w-20 rounded-full bg-sage-soft flex items-center justify-center text-4xl shadow-inner border border-text/5">
              {writer.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-text">
                {writer.name}
              </h1>
              <p className="text-sm font-semibold text-sage-light mt-0.5">
                @{username}
              </p>
            </div>
          </div>
          <p className="text-base text-text-light leading-relaxed max-w-2xl">
            {writer.bio}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {writer.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-sage bg-white border border-text/5 rounded-button px-3 py-1.5 shadow-sm hover:border-sage transition-all"
              >
                {social.platform} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </section>

        {/* Dynamic Project Showcases Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-text/5 pb-3">
            <FolderGit2 size={20} className="text-sage" />
            <h2 className="text-xl font-bold tracking-tight text-text">
              Featured Projects
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {writer.projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-white border border-text/5 rounded-card p-6 shadow-xl shadow-sage-soft/5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-text text-base">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-light mt-2 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-4">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono font-bold bg-cream px-2 py-0.5 rounded text-text-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications Feed Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-text/5 pb-3">
            <BookOpen size={20} className="text-sage" />
            <h2 className="text-xl font-bold tracking-tight text-text">
              Latest Publications
            </h2>
          </div>
          <div className="space-y-6">
            {writer.blogs.map((blog, idx) => (
              <article
                key={idx}
                className="bg-white border border-text/5 rounded-card p-6 shadow-xl shadow-sage-soft/5 group cursor-pointer hover:border-sage/30 transition-all"
              >
                <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                  <div>
                    <h3 className="font-bold text-lg text-text group-hover:text-sage transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-text-light mt-2 leading-relaxed line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-text-light/50 mt-4 pt-4 border-t border-text/5">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Public Connect / Footer Channel */}
        <section className="bg-white border border-text/5 rounded-card p-8 text-center shadow-xl shadow-sage-soft/5">
          <Mail size={28} className="text-sage mx-auto mb-3" />
          <h3 className="font-bold text-text text-lg">Let's collaborate</h3>
          <p className="text-sm text-text-light mt-1 max-w-sm mx-auto">
            Want to build something together or discuss an article? Drop a
            message through my channels above.
          </p>
        </section>
      </div>
    </div>
  );
}
