import Link from "next/link";
import { apiFetch } from "@/lib/server-api";
import { cardPath, qrPath } from "@/lib/api";
import { PageTitle, EmptyState } from "@/components/panel/ui";
import { DeleteCardButton } from "@/components/panel/DeleteCardButton";
import { CardUserFilter } from "@/components/panel/CardUserFilter";
import { CardEmpresaFilter } from "@/components/panel/CardEmpresaFilter";
import { Button } from "@/components/ds";
import type { Card, Empresa, User } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ user?: string; empresa?: string }>;
}

function ownerName(u: Card["user"]): string {
  if (u && typeof u === "object") return u.name;
  return "—";
}

function empresaName(e: Card["empresa"]): string {
  if (e && typeof e === "object") return e.name;
  return "—";
}

export default async function AdminCardsPage({ searchParams }: PageProps) {
  const { user, empresa } = await searchParams;

  const qs = new URLSearchParams({ "order[createdAt]": "desc" });
  if (user) qs.set("user", `/api/users/${user}`);
  if (empresa) qs.set("empresa", `/api/empresas/${empresa}`);

  let cards: Card[] = [];
  let users: User[] = [];
  let empresas: Empresa[] = [];
  try {
    [cards, users, empresas] = await Promise.all([
      apiFetch<Card[]>(`/api/cards?${qs.toString()}`),
      apiFetch<User[]>("/api/users"),
      apiFetch<Empresa[]>("/api/empresas"),
    ]);
  } catch {
    cards = [];
  }

  return (
    <div>
      <PageTitle
        title="Tarjetas"
        subtitle="Todas las tarjetas digitales."
        action={
          <Button as="a" href="/admin/cards/nueva" variant="primary" size="sm">
            Nueva tarjeta
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <CardEmpresaFilter empresas={empresas} current={empresa} user={user} />
        <CardUserFilter users={users} current={user} empresa={empresa} />
      </div>

      {cards.length === 0 ? (
        <EmptyState>No hay tarjetas.</EmptyState>
      ) : (
        <div className="bw-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)" }}>
                <th style={cell}>Nombre</th>
                <th style={cell}>Usuario</th>
                <th style={cell}>Empresa</th>
                <th style={cell}>Slug</th>
                <th style={cell}>Estado</th>
                <th style={cell}>Lecturas</th>
                <th style={cell}>Guardados</th>
                <th style={cell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} style={{ borderTop: "0.5px solid var(--bw-hairline)" }}>
                  <td style={cell}>{c.displayName}</td>
                  <td style={{ ...cell, color: "var(--text-muted)" }}>{ownerName(c.user)}</td>
                  <td style={{ ...cell, color: "var(--text-muted)" }}>{empresaName(c.empresa)}</td>
                  <td style={{ ...cell, color: "var(--text-muted)" }}>{c.slug}</td>
                  <td style={cell}>{c.isPublished ? "Publicada" : "Borrador"}</td>
                  <td style={cell}>{c.viewCount ?? 0}</td>
                  <td style={cell}>{c.saveCount ?? 0}</td>
                  <td style={cell}>
                    <div className="flex items-center gap-3" style={{ whiteSpace: "nowrap" }}>
                      <Link href={`/admin/cards/${c.id}`} style={{ color: "var(--accent)" }}>
                        Editar
                      </Link>
                      {c.isPublished && (
                        <>
                          <Link href={cardPath(c.empresa, c.slug)} target="_blank" style={{ color: "var(--text-muted)" }}>
                            Abrir ↗
                          </Link>
                          <Link href={qrPath(c.empresa, c.slug)} target="_blank" style={{ color: "var(--text-muted)" }}>
                            QR ↗
                          </Link>
                        </>
                      )}
                      <DeleteCardButton cardId={c.id} size="sm" />
                    </div>
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
