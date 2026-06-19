"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-text/5 bg-white px-6 py-12 text-sm text-text-light">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Core Identity Branding */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <div>
            <span className="font-bold text-text">WebNest</span>
            <p className="text-xs text-text-light/70 mt-0.5">
              Own your space on the web.
            </p>
          </div>
        </div>

        {/* Footer Navigation Tracks */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 font-medium">
          <Link href="/discover" className="hover:text-text transition-colors">
            Discover Hub
          </Link>
          <Link href="#features" className="hover:text-text transition-colors">
            Features
          </Link>
          <Link href="/login" className="hover:text-text transition-colors">
            Writer Portal
          </Link>
          <Link href="/register" className="hover:text-text transition-colors">
            Claim Nest
          </Link>
        </div>

        {/* Technical Legal Track */}
        <div className="text-xs text-text-light/60">
          &copy; {new Date().getFullYear()} WebNest. All rights reserved. Built
          for creators.
        </div>
      </div>
    </footer>
  );
}
