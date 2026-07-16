import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/server-api";
import { cardPath } from "@/lib/api";
import { PageTitle } from "@/components/panel/ui";
import { CardEditor } from "@/components/panel/CardEditor";
import { WalletButtons } from "@/components/panel/WalletButtons";
import { DeleteCardButton } from "@/components/panel/DeleteCardButton";
import { adminUpdateCardAction } from "@/lib/actions/cards";
import type { Card, Empresa, Template, User } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCardPage({ params }: PageProps) {
  const { id } = await params;

  let card: Card;
  try {
    card = await apiFetch<Card>(`/api/cards/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  let users: User[] = [];
  let templates: Template[] = [];
  let empresas: Empresa[] = [];
  try {
    [users, templates, empresas] = await Promise.all([
      apiFetch<User[]>("/api/users"),
      apiFetch<Template[]>("/api/templates"),
      apiFetch<Empresa[]>("/api/empresas"),
    ]);
  } catch {
    users = [];
    templates = [];
    empresas = [];
  }

  return (
    <div className="max-w-6xl">
      <Link href="/admin/cards" style={{ fontSize: 13, color: "var(--text-muted)" }}>
        ← Volver a tarjetas
      </Link>
      <div style={{ marginTop: 10 }}>
        <PageTitle title="Editar tarjeta" subtitle={`Pública en ${cardPath(card.empresa, card.slug)}`} />
      </div>

      <CardEditor
        action={adminUpdateCardAction.bind(null, card.id)}
        card={card}
        users={users}
        templates={templates}
        empresas={empresas}
      />

      <div className="bw-surface" style={{ padding: 24, marginTop: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>Wallet</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Descarga el pase de esta tarjeta para Apple Wallet o Google Wallet.
        </p>
        <WalletButtons cardId={card.id} />
      </div>

      <div className="bw-surface flex items-center justify-between gap-4" style={{ padding: 24, marginTop: 24 }}>
        <div>
          <p style={{ fontWeight: 600 }}>Eliminar tarjeta</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Esta acción no se puede deshacer.</p>
        </div>
        <DeleteCardButton cardId={card.id} />
      </div>
    </div>
  );
}
