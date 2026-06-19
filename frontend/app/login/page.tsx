"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend logic placeholder - will be connected to your Spring Boot API later
    console.log("Logging in writer:", formData);
  };

  return (
    <div className="relative min-h-screen bg-cream flex flex-col justify-center items-center px-6 py-12 overflow-hidden">
      {/* Background ambient accents matching the registration layout */}
      <div className="absolute top-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-sage-soft/40 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-sage-light/10 blur-3xl" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-text/5 rounded-card p-8 shadow-xl shadow-sage-soft/10">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-3">
            <span className="text-2xl transition-transform group-hover:scale-110 duration-200">
              🌿
            </span>
            <span className="text-xl font-bold text-text tracking-tight group-hover:text-sage transition-colors">
              WebNest
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-text">
            Welcome back
          </h2>
          <p className="text-sm text-text-light mt-2">
            Log in to manage your dashboard, post updates, and check your
            workspace.
          </p>
        </div>

        {/* Form Element */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-light/50">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-cream/30 border border-text/10 rounded-button py-3 pl-11 pr-4 text-sm text-text placeholder-text-light/40 focus:border-sage focus:bg-white focus:outline-none transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-text">
                Password
              </label>
              {/* Optional link placeholder for future iteration */}
              <span className="text-xs text-text-light/40 cursor-not-allowed hover:none">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-light/50">
                <ShieldCheck size={18} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-cream/30 border border-text/10 rounded-button py-3 pl-11 pr-4 text-sm text-text placeholder-text-light/40 focus:border-sage focus:bg-white focus:outline-none transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Form Submit Action Handle */}
          <button
            type="submit"
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-button bg-sage py-3.5 font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In to Dashboard
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>

        {/* Redirection Link to Register Anchor */}
        <div className="mt-6 pt-5 border-t border-text/5 text-center text-xs text-text-light">
          New to the platform?{" "}
          <Link
            href="/register"
            className="font-semibold text-sage hover:underline decoration-sage-light"
          >
            Claim your space instead
          </Link>
        </div>
      </div>
    </div>
  );
}
