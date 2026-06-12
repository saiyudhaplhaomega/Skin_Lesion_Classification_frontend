import Link from "next/link";

const groups = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/features", label: "Features" },
      { href: "/xai-gradcam", label: "Grad-CAM XAI" },
      { href: "/body-map", label: "Body map" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/analyze", label: "Analyze" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/doctor", label: "Doctor review" },
      { href: "/research", label: "Research" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/education", label: "Education" },
      { href: "/about", label: "About" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-[2] mt-24 border-t border-[var(--glass-border)]">
      <div className="mx-auto grid w-[min(1120px,92%)] gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-teal-glow to-teal-deep"
            />
            Skin Lesion XAI
          </p>
          <p className="mt-3 max-w-xs text-sm">
            Educational AI-assisted skin lesion monitoring with Grad-CAM
            explainability. Not a medical diagnosis tool.
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-teal-glow">
              {g.title}
            </p>
            <ul className="mt-4 list-none space-y-2.5 p-0">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-soft no-underline transition-colors hover:text-[var(--text-primary)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-[var(--glass-border)]">
        <div className="mx-auto flex w-[min(1120px,92%)] flex-wrap items-center justify-between gap-3 py-5">
          <p className="text-xs">
            © {new Date().getFullYear()} Saiyudh Mannan · Educational use only
          </p>
          <p className="font-mono text-xs text-slate-mid">
            Always consult a qualified dermatologist.
          </p>
        </div>
      </div>
    </footer>
  );
}
