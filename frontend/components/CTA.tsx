"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-20 md:py-24 text-center">
      {/* Structural ambient styling anchors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-sage-soft/30 blur-3xl -z-0" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl md:text-5xl">
          Ready to establish your home base?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base md:text-lg text-text-light leading-relaxed">
          Create your custom layout profile, deploy your dashboard portal, and
          begin sharing architectural stories natively inside your domain.
        </p>

        <div className="mt-8 flex flex-col justify-center items-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-sage px-8 py-4 font-semibold text-cream shadow-md transition-all duration-200 hover:bg-sage-light hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/login"
            className="flex w-full sm:w-auto items-center justify-center rounded-button border border-text/10 bg-white/60 px-8 py-4 font-semibold text-text backdrop-blur-sm transition-all duration-200 hover:bg-white"
          >
            Writer Login
          </Link>
        </div>
      </div>
    </section>
  );
}
