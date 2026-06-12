"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/xai-gradcam", label: "Grad-CAM XAI" },
  { href: "/education", label: "Education" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex w-[min(1120px,92%)] items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "border-[var(--glass-border-strong)] bg-[rgba(18,23,29,0.75)] shadow-glass backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-[0.95rem] font-semibold tracking-tight text-[var(--text-primary)] no-underline"
        >
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-teal-glow to-teal-deep shadow-glow-teal"
          />
          Skin Lesion XAI
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-soft no-underline transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/analyze" className="btn-primary !px-4 !py-2 text-sm">
            Try the demo
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border-strong)] text-[var(--text-primary)] md:hidden"
        >
          <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <div className="glass-strong mx-auto mt-2 w-[min(1120px,92%)] p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-medium text-slate-soft no-underline hover:bg-white/5 hover:text-[var(--text-primary)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/analyze"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 justify-center"
            >
              Try the demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
