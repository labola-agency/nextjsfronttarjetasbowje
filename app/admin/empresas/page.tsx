import Link from "next/link";
import { apiFetch } from "@/lib/server-api";
import { PageTitle, EmptyState } from "@/components/panel/ui";
import { Button } from "@/components/ds";
import type { Empresa } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminEmpresasPage() {
  let empresas: Empresa[] = [];
  try {
    empresas = await apiFetch<Empresa[]>("/api/empresas");
  } catch {
    empresas = [];
  }

  return (
    <div>
      <PageTitle
        title="Empresas"
        subtitle="Marcas del grupo y su plantilla."
        action={
          <Button as="a" href="/admin/empresas/nueva" variant="primary" size="sm">
            Nueva empresa
          </Button>
        }
      />

      {empresas.length === 0 ? (
        <EmptyState>No hay empresas.</EmptyState>
      ) : (
        <div className="bw-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)" }}>
                <th style={cell}>Nombre</th>
                <th style={cell}>Activa</th>
                <th style={cell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id} style={{ borderTop: "0.5px solid var(--bw-hairline)" }}>
                  <td style={cell}>{e.name}</td>
                  <td style={cell}>{e.isActive ? "Sí" : "No"}</td>
                  <td style={cell}>
                    <Link href={`/admin/empresas/${e.id}`} style={{ color: "var(--accent)" }}>
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cell: React.CSSProperties = { padding: "14px 16px" };
