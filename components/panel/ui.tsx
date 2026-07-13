import type { ReactNode } from "react";

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--text-muted)", marginTop: 6 }}>{subtitle}</p>}
        <span style={{ display: "block", width: 56, height: 2, background: "var(--accent)", marginTop: 14 }} />
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="bw-surface" style={{ padding: 24 }}>
      <p style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
        {label}
      </p>
      <p style={{ fontSize: 40, fontWeight: 800, marginTop: 8, color: accent ? "var(--accent)" : "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="bw-surface" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
      {children}
    </div>
  );
}
