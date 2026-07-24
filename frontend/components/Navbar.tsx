"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar({
  isLoggedIn = false,
  username,
}: {
  isLoggedIn?: boolean;
  username?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/#features", label: "Features" },
    ...(isLoggedIn ? [] : [{ href: "/login", label: "Login" }]),
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-text/5 bg-cream/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
            🌿
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-text transition-colors group-hover:text-sage">
              WebNest
            </h1>
            <p className="hidden text-[10px] font-medium uppercase tracking-wider text-sage-light sm:block">
              Own your space on the web
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-medium transition-colors duration-200 hover:text-sage ${
                isActive(link.href) ? "text-sage" : "text-text"
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-sage transition-all duration-300 ${
                  isActive(link.href) ? "w-full" : "w-0 hover:w-full"
                }`}
              />
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-text-light hover:text-text transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/register"
              className="rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="rounded-lg p-1.5 text-text hover:bg-text/5 focus:outline-none md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden border-t border-text/5 bg-cream/95 backdrop-blur-lg">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive(link.href) ? "text-sage font-semibold" : "text-text"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 rounded-button bg-sage py-3 text-center text-sm font-semibold text-cream shadow-sm active:bg-sage-light"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-sm font-medium text-text-light text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-button bg-sage py-3 text-center text-sm font-semibold text-cream shadow-sm active:bg-sage-light"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
