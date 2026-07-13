import Link from "next/link";
import { apiFetch } from "@/lib/server-api";
import { PageTitle } from "@/components/panel/ui";
import { CardEditor } from "@/components/panel/CardEditor";
import { createCardAction } from "@/lib/actions/cards";
import type { Empresa, Template, User } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminNewCardPage() {
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
        <PageTitle title="Nueva tarjeta" subtitle="Crea una tarjeta y asígnala a un usuario. El enlace (slug) se genera solo." />
      </div>

      <CardEditor action={createCardAction} users={users} templates={templates} empresas={empresas} submitLabel="Crear tarjeta" />
    </div>
  );
}
