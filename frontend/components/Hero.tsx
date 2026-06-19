"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Feather, Layout } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-20 md:py-32">
      {/* Decorative background blobs for a modern, organic feel */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-sage-soft/30 blur-3xl" />
      <div className="absolute right-[-5%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-sage-light/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* Left Side: Copy and CTAs */}
          <div className="flex flex-col text-center lg:col-span-6 lg:text-left">
            {/* Tagline / Announcement Pill */}
            <div className="mx-auto flex items-center gap-2 rounded-full border border-sage/20 bg-sage-soft/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-text lg:mx-0 lg:w-fit">
              <Sparkles size={14} className="text-sage" />
              <span>Now open for early-access creators</span>
            </div>

            {/* Main Catchy Heading */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-text sm:text-5xl md:text-6xl lg:leading-[1.15]">
              Own your <span className="text-sage">space</span> on the web.
            </h1>

            {/* Explanatory Subtext */}
            <p className="mt-6 text-lg leading-relaxed text-text-light max-w-xl mx-auto lg:mx-0">
              The minimalist platform for writers and creators. Launch a
              stunning personal website, publish your thoughts, and showcase
              your best projects—all under your own custom home.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-button bg-sage px-8 py-4 font-semibold text-cream shadow-md transition-all duration-200 hover:bg-sage-light hover:shadow-lg hover:-translate-y-0.5 sm:w-auto"
              >
                Claim Your Nest
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/discover"
                className="flex w-full items-center justify-center gap-2 rounded-button border border-text/10 bg-white/50 px-8 py-4 font-semibold text-text backdrop-blur-sm transition-all duration-200 hover:bg-white hover:border-text/20 sm:w-auto"
              >
                Explore Creators
              </Link>
            </div>

            {/* Mini Feature Highlights */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-text/5 pt-8 text-left">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-sage font-semibold text-sm">
                  <Globe size={16} /> Website
                </div>
                <p className="text-xs text-text-light">Your central hub</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-sage font-semibold text-sm">
                  <Feather size={16} /> Blog
                </div>
                <p className="text-xs text-text-light">Elegant publishing</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-sage font-semibold text-sm">
                  <Layout size={16} /> Portfolio
                </div>
                <p className="text-xs text-text-light">Showcase work</p>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Mockup Showcase */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-[500px] rounded-card border border-text/10 bg-white p-2 shadow-2xl transition-transform duration-500 hover:scale-[1.02] lg:max-w-none">
              {/* Browser Header Bar Window Accent */}
              <div className="flex items-center gap-1.5 border-b border-text/5 px-4 py-3 bg-cream/50 rounded-t-[0.5rem]">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <div className="ml-4 flex items-center justify-center rounded bg-white px-3 py-1 text-[11px] font-medium text-text-light shadow-inner border border-text/5 w-56 md:w-64">
                  techynidhi.webnest.com
                </div>
              </div>

              {/* Mockup Profile Presentation Content */}
              <div className="bg-cream/30 p-6 md:p-8">
                {/* Simulated Profile Identity */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-2xl shadow-inner">
                    👩‍💻
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-lg">
                      Nidhi Sharma
                    </h3>
                    <p className="text-xs font-medium text-sage-light">
                      Software Engineer & Writer
                    </p>
                  </div>
                </div>

                {/* Simulated Bio Description */}
                <p className="mt-4 text-sm leading-relaxed text-text-light">
                  Building open-source ecosystems and sharing deep-dives into
                  systems engineering. Welcome to my little corner of the web!
                </p>

                {/* Mockup Inner Feature: "Latest Projects" Widget */}
                <div className="mt-6 rounded-xl border border-text/5 bg-white p-4 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sage">
                    Featured Project
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-text">
                    ⚡ GitFlow Core Engine
                  </h4>
                  <p className="mt-1 text-xs text-text-light line-clamp-1">
                    A highly scalable Git orchestration layer built entirely in
                    Rust.
                  </p>
                </div>

                {/* Mockup Inner Feature: "Recent Articles" list snippet */}
                <div className="mt-4 rounded-xl border border-text/5 bg-white p-4 shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sage">
                    Latest Publication
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-text">
                    Understanding Database Isolation Levels
                  </h4>
                  <p className="mt-1 text-xs text-text-light">
                    Demystifying Dirty Reads, Non-repeatable Reads, and Phantom
                    reads...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
