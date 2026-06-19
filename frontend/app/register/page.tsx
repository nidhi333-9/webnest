"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  User,
  Mail,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend logic placeholder - will be connected to your Spring Boot API later
    console.log("Registering writer:", formData);
  };

  return (
    <div className="relative min-h-screen bg-cream flex flex-col justify-center items-center px-6 py-12 overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-sage-soft/40 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-sage-light/10 blur-3xl" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-text/5 rounded-card p-8 shadow-xl shadow-sage-soft/10">
        {/* Brand Logo Anchor */}
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
            Claim your digital nest
          </h2>
          <p className="text-sm text-text-light mt-2">
            Build your profile, publish your blogs, and share your workspace.
          </p>
        </div>

        {/* Form Element */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-light/50">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                placeholder="Nidhi Sharma"
                className="w-full bg-cream/30 border border-text/10 rounded-button py-3 pl-11 pr-4 text-sm text-text placeholder-text-light/40 focus:border-sage focus:bg-white focus:outline-none transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

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

          {/* Unique Username Subdomain Handle Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2 flex justify-between">
              <span>Desired Username</span>
              <span className="text-[10px] text-sage-light lowercase font-medium flex items-center gap-1">
                <Sparkles size={10} /> your live URL handle
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-light/50">
                <Globe size={18} />
              </span>
              <input
                type="text"
                required
                placeholder="techynidhi"
                className="w-full bg-cream/30 border border-text/10 rounded-button py-3 pl-11 pr-28 text-sm text-text placeholder-text-light/40 focus:border-sage focus:bg-white focus:outline-none transition-all"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-sage-light pointer-events-none bg-gradient-to-l from-cream/30 pl-2">
                .webnest.com
              </span>
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">
              Password
            </label>
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
            Create Writer Account
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>

        {/* Redirection Link to Login Anchor */}
        <div className="mt-6 pt-5 border-t border-text/5 text-center text-xs text-text-light">
          Already have a nest?{" "}
          <Link
            href="/login"
            className="font-semibold text-sage hover:underline decoration-sage-light"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
