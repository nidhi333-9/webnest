"use client";

import { UserPlus, FileEdit, ExternalLink } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus size={22} />,
      step: "01",
      title: "Claim your Subdomain",
      description:
        "Register your writer account in seconds and specify your custom WebNest username handle.",
    },
    {
      icon: <FileEdit size={22} />,
      step: "02",
      title: "Compose & Customize",
      description:
        "Write long-form blogs, list your favorite active projects, and link your custom social profiles from your dashboard.",
    },
    {
      icon: <ExternalLink size={22} />,
      step: "03",
      title: "Publish Globally",
      description:
        "Your site updates live on your subdomain instantly for an infinite audience across the web.",
    },
  ];

  return (
    <section className="bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-sage-light font-mono">
            Simplicity First
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-text sm:text-4xl">
            From setup to live in three steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center p-6 bg-white/40 rounded-card border border-text/5 backdrop-blur-sm"
            >
              {/* Step indicator tag */}
              <span className="absolute top-4 right-6 font-mono text-sm font-bold text-sage-light/30">
                {item.step}
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-cream shadow-md mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-light max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
