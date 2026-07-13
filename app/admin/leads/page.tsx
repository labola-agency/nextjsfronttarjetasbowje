import { apiFetch } from "@/lib/server-api";
import { PageTitle } from "@/components/panel/ui";
import { LeadsTable } from "@/components/panel/LeadsTable";
import { LeadUserFilter } from "@/components/panel/LeadUserFilter";
import { LeadEmpresaFilter } from "@/components/panel/LeadEmpresaFilter";
import { Button } from "@/components/ds";
import { type Empresa, type Lead, type User } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ user?: string; empresa?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const { user, empresa } = await searchParams;

  const qs = new URLSearchParams({ "order[createdAt]": "desc" });
  if (user) qs.set("assignedUser", `/api/users/${user}`);
  if (empresa) qs.set("empresa", `/api/empresas/${empresa}`);

  let leads: Lead[] = [];
  let users: User[] = [];
  let empresas: Empresa[] = [];
  try {
    [leads, users, empresas] = await Promise.all([
      apiFetch<Lead[]>(`/api/leads?${qs.toString()}`),
      apiFetch<User[]>("/api/users"),
      apiFetch<Empresa[]>("/api/empresas"),
    ]);
  } catch {
    leads = [];
  }

  return (
    <div>
      <PageTitle
        title="Leads"
        subtitle="Captación desde las tarjetas digitales."
        action={
          <Button as="a" href="/export/leads" variant="outline" size="sm">
            Exportar CSV
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <LeadEmpresaFilter empresas={empresas} current={empresa} user={user} />
        <LeadUserFilter users={users} current={user} empresa={empresa} />
      </div>

      <LeadsTable leads={leads} basePath="/admin/leads" showOwner />
    </div>
  );
}
