"use client";

import { Feather, Layout, Globe, Shield, Terminal, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Globe size={24} className="text-sage" />,
      title: "Your Personal Subdomain",
      description:
        "Instantly claim your unique home on the internet at username.webnest.com. Ready to share with the world right away.",
    },
    {
      icon: <Feather size={24} className="text-sage" />,
      title: "Distraction-Free Blogging",
      description:
        "An elegant, minimalist writing interface designed to help you focus entirely on your words and ideas.",
    },
    {
      icon: <Layout size={24} className="text-sage" />,
      title: "Project Portfolios",
      description:
        "Showcase your side projects, open-source contributions, or case studies alongside your written content.",
    },
    {
      icon: <Terminal size={24} className="text-sage" />,
      title: "Developer Friendly",
      description:
        "Clean syntax rendering and modular section structures built for developers, technical writers, and creators.",
    },
    {
      icon: <Shield size={24} className="text-sage" />,
      title: "No Reader Accounts Required",
      description:
        "Your readers don't need passwords or accounts. They just visit your link and enjoy your unhindered content.",
    },
    {
      icon: <Zap size={24} className="text-sage" />,
      title: "Lightning Fast Performance",
      description:
        "Statically optimized routing ensures your custom site loads dynamically in milliseconds globally.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-white px-6 py-20 md:py-28 border-b border-text/5"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sage-light">
            Core Platform
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Everything your digital footprint needs.
          </h2>
          <p className="mt-4 text-base text-text-light">
            WebNest goes beyond simple markdown rendering. It organizes your
            professional identity into a cohesive, beautiful single-tenant
            ecosystem.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-card border border-text/5 bg-cream/30 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-sage-soft/20 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-text/5 group-hover:bg-sage-soft/50 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-text group-hover:text-sage transition-colors">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
