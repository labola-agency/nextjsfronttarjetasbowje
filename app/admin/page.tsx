import { apiFetch } from "@/lib/server-api";
import { PageTitle, StatCard } from "@/components/panel/ui";

interface DashboardStats {
  total: number;
  leadsThisWeek: number;
  totalCards: number;
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let stats: DashboardStats | null = null;
  try {
    stats = await apiFetch<DashboardStats>("/api/stats/dashboard");
  } catch {
    stats = null;
  }

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Visión general del CRM." />

      {!stats ? (
        <p style={{ color: "var(--text-muted)" }}>No se pudieron cargar las métricas.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Leads totales" value={stats.total} accent />
          <StatCard label="Esta semana" value={stats.leadsThisWeek} />
          <StatCard label="Tarjetas" value={stats.totalCards} />
        </div>
      )}
    </div>
  );
}
