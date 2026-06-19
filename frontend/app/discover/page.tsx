"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Compass, Shield, Users, ArrowRight } from "lucide-react";

const MOCK_FEATURED_CREATORS = [
  {
    name: "Nidhi Sharma",
    handle: "techynidhi",
    bio: "Full-stack developer building behavioral modules and automated tooling engines.",
    tags: ["MERN Stack", "Python"],
    avatar: "👩‍💻",
  },
  {
    name: "Alex Miller",
    handle: "alexdev",
    bio: "Systems architecture specialist writing core relational database deep-dives.",
    tags: ["PostgreSQL", "Rust"],
    avatar: "☕",
  },
  {
    name: "Karan Verma",
    handle: "karanv",
    bio: "DevOps engineer focusing on automated container orchestration and cloud swarms.",
    tags: ["Docker", "AWS"],
    avatar: "🚀",
  },
];

export default function Discover() {
  const [search, setSearch] = useState("");
  const categories = [
    "All",
    "Engineering",
    "Design",
    "Systems",
    "Web Applications",
  ];

  const filteredCreators = MOCK_FEATURED_CREATORS.filter(
    (creator) =>
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-cream text-text selection:bg-sage-soft">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20 space-y-16">
        {/* Banner Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft/50 px-3 py-1 text-xs font-semibold text-text">
            <Compass size={14} className="text-sage" /> Explore the Nest
            Ecosystem
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text">
            Discover independent spaces.
          </h1>
          <p className="text-base text-text-light leading-relaxed">
            Explore personal websites, engineering portfolios, and deep-dive
            technical publications curated by creators globally.
          </p>
        </div>

        {/* Dynamic Search Interface */}
        <div className="max-w-xl mx-auto flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-light/40">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search creators by name or stack keyword..."
              className="w-full bg-white border border-text/10 rounded-button py-3 pl-11 pr-4 text-sm text-text placeholder-text-light/40 focus:border-sage focus:outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Creators Array Grid Workspace */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-text/5 pb-3">
            <Users size={18} className="text-sage-light" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-light">
              Featured Creators
            </h2>
          </div>

          {filteredCreators.length === 0 ? (
            <div className="bg-white border border-text/5 border-dashed rounded-card p-12 text-center text-text-light/60">
              No active creators matched your search parameter.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCreators.map((creator, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-text/5 rounded-card p-6 shadow-xl shadow-sage-soft/5 flex flex-col justify-between group hover:border-sage/30 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-cream border border-text/5 rounded-full flex items-center justify-center text-xl shadow-inner">
                        {creator.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-text text-sm group-hover:text-sage transition-colors">
                          {creator.name}
                        </h3>
                        <p className="text-xs text-text-light/50 font-mono">
                          {creator.handle}.webnest.com
                        </p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-text-light line-clamp-3">
                      {creator.bio}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-text/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {creator.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono font-bold bg-cream text-text-light px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/${creator.handle}`}
                      className="text-xs font-bold text-sage flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      Visit <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
