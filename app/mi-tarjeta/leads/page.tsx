import { apiFetch } from "@/lib/server-api";
import { PageTitle } from "@/components/panel/ui";
import { LeadsTable } from "@/components/panel/LeadsTable";
import { Button } from "@/components/ds";
import { type Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MisLeadsPage() {
  let leads: Lead[] = [];
  try {
    leads = await apiFetch<Lead[]>("/api/leads?order[createdAt]=desc");
  } catch {
    leads = [];
  }

  return (
    <div>
      <PageTitle
        title="Mis leads"
        subtitle="Contactos captados desde tu tarjeta."
        action={
          <Button as="a" href="/export/leads" variant="outline" size="sm">
            Exportar CSV
          </Button>
        }
      />

      <LeadsTable leads={leads} basePath="/mi-tarjeta/leads" showOwner={false} />
    </div>
  );
}
