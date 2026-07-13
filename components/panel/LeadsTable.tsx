import Link from "next/link";
import type { Lead } from "@/lib/types";
import { EmptyState } from "./ui";

function userName(u: Lead["assignedUser"]): string {
  if (u && typeof u === "object") return u.name;
  return "—";
}

function empresaName(e: Lead["empresa"]): string {
  if (e && typeof e === "object") return e.name;
  return "—";
}

export function LeadsTable({ leads, basePath, showOwner = true }: { leads: Lead[]; basePath: string; showOwner?: boolean }) {
  if (leads.length === 0) {
    return <EmptyState>No hay leads que mostrar.</EmptyState>;
  }

  return (
    <div className="bw-surface" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--text-muted)" }}>
            <th style={th}>Nombre</th>
            <th style={th}>Empresa contacto</th>
            <th style={th}>Contacto</th>
            {showOwner && <th style={th}>Usuario</th>}
            <th style={th}>Empresa</th>
            <th style={th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderTop: "0.5px solid var(--bw-hairline)" }}>
              <td style={td}>
                <Link href={`${basePath}/${lead.id}`} style={{ fontWeight: 600, color: "var(--accent)" }}>
                  {lead.name}
                </Link>
              </td>
              <td style={td}>{lead.company || "—"}</td>
              <td style={{ ...td, color: "var(--text-muted)" }}>
                {lead.email || lead.phone || "—"}
              </td>
              {showOwner && <td style={td}>{userName(lead.assignedUser)}</td>}
              <td style={td}>{empresaName(lead.empresa)}</td>
              <td style={{ ...td, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                {new Date(lead.createdAt).toLocaleDateString("es-ES")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  fontWeight: 600,
};
const td: React.CSSProperties = { padding: "14px 16px" };
