"use client";

import { useState } from "react";
import { FolderGit2, BookOpen, User, ArrowRight } from "lucide-react";

export default function WebsitePreview() {
  const [activeTab, setActiveTab] = useState<"about" | "blogs" | "projects">(
    "about",
  );

  return (
    <section className="bg-white px-6 py-20 md:py-28 border-y border-text/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-sage-light">
              Live Environment Render
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
              Fully loaded public profile views.
            </h2>
            <p className="mt-4 text-base text-text-light leading-relaxed">
              Toggle the preview interactive tabs to see how content cleanly
              populates onto a writer’s standalone landing hub without any
              bloatware overlays.
            </p>

            {/* Interactive Control Selectors */}
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              {[
                {
                  id: "about",
                  label: "Hero & About Profile",
                  icon: <User size={16} />,
                },
                {
                  id: "blogs",
                  label: "Latest Blogs Feed",
                  icon: <BookOpen size={16} />,
                },
                {
                  id: "projects",
                  label: "Project Showcases",
                  icon: <FolderGit2 size={16} />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 rounded-button px-4 py-3 text-sm font-semibold transition-all duration-200 text-left w-full ${
                    activeTab === tab.id
                      ? "bg-sage text-cream shadow-md translate-x-1"
                      : "bg-cream/50 text-text hover:bg-cream border border-text/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Live Standalone Interface Simulation */}
          <div className="lg:col-span-7">
            <div className="w-full rounded-card border border-text/10 bg-white shadow-2xl overflow-hidden min-h-[420px] flex flex-col">
              {/* Browser Window Navbar Mimicry */}
              <div className="flex items-center justify-between border-b border-text/5 bg-cream/70 px-6 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="rounded bg-white border border-text/5 px-4 py-0.5 text-xs font-mono tracking-tight text-text-light w-1/2 text-center shadow-inner">
                  alexdev.webnest.com
                </div>
                <div className="w-12" /> {/* Layout balancing spacer */}
              </div>

              {/* Dynamic Simulated Display Window Canvas */}
              <div className="p-6 md:p-8 flex-grow bg-cream/10">
                {activeTab === "about" && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="h-12 w-12 rounded-full bg-sage-soft flex items-center justify-center text-xl">
                      ☕
                    </div>
                    <h3 className="text-2xl font-bold text-text">
                      Hi, I'm Alex Miller
                    </h3>
                    <p className="text-sm text-text-light leading-relaxed">
                      I am a systems architecture specialist cataloging my
                      engineering insights. This nest is where I test structural
                      concepts out in public.
                    </p>
                    <div className="pt-2 flex gap-3 text-xs font-bold text-sage">
                      <span>🐦 Twitter</span> <span>💼 GitHub</span>{" "}
                      <span>✍️ Read CV</span>
                    </div>
                  </div>
                )}

                {activeTab === "blogs" && (
                  <div className="animate-fadeIn space-y-4">
                    <h4 className="text-xs font-bold text-sage uppercase tracking-wider">
                      Recent Publications
                    </h4>
                    {[
                      {
                        title:
                          "Building a Multi-Tenant Core Layer inside Postgres",
                        date: "June 14",
                      },
                      {
                        title:
                          "Why Docker Containers Fail Silently in Local Swarms",
                        date: "May 29",
                      },
                    ].map((post, idx) => (
                      <div
                        key={idx}
                        className="group cursor-pointer rounded-xl border border-text/5 bg-white p-4 shadow-sm hover:border-sage/40 transition-all"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h5 className="text-sm font-semibold text-text group-hover:text-sage transition-colors">
                            {post.title}
                          </h5>
                          <span className="text-xs text-text-light whitespace-nowrap">
                            {post.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="animate-fadeIn space-y-4">
                    <h4 className="text-xs font-bold text-sage uppercase tracking-wider">
                      Active Showcases
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          name: "🗄️ CacheDB-Lite",
                          desc: "In-memory atomic key-value caching algorithm.",
                        },
                        {
                          name: "🛡️ GuardRail JWT",
                          desc: "Extremely secure token abstraction micro-library.",
                        },
                      ].map((project, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-text/5 bg-white p-4 shadow-sm"
                        >
                          <h5 className="text-sm font-bold text-text">
                            {project.name}
                          </h5>
                          <p className="mt-1 text-xs text-text-light leading-normal">
                            {project.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
