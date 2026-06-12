import Link from "next/link";
import type { ReactNode } from "react";

type Action = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
};

type ClinicalAppShellProps = {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: Action[];
  children: ReactNode;
};

export function ClinicalAppShell({
  eyebrow,
  title,
  lead,
  actions = [],
  children,
}: ClinicalAppShellProps) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>
        {actions.length > 0 && (
          <div className="app-header__actions">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={action.variant === "ghost" ? "btn-ghost" : "btn-primary"}
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      {children}
    </main>
  );
}

type Stat = {
  label: string;
  value: string;
  note?: string;
  tone?: "ok" | "warn" | "info" | "neutral";
};

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <section className="app-stat-grid" aria-label="Summary statistics">
      {stats.map((stat) => (
        <article key={stat.label} className="app-stat-card">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
          {stat.note && <p data-tone={stat.tone ?? "neutral"}>{stat.note}</p>}
        </article>
      ))}
    </section>
  );
}

type SectionCardProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  eyebrow,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={`app-card ${className}`}>
      {eyebrow && <p className="app-card__eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function StatusPill({
  tone = "neutral",
  children,
}: {
  tone?: "ok" | "warn" | "alert" | "info" | "neutral";
  children: ReactNode;
}) {
  return (
    <span className="status-pill" data-tone={tone}>
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: Action;
}) {
  return (
    <div className="empty-state">
      <div aria-hidden className="empty-state__mark" />
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
        {action && (
          <Link
            href={action.href}
            className={action.variant === "ghost" ? "btn-ghost" : "btn-primary"}
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="app-table-wrap">
      <table className="app-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

