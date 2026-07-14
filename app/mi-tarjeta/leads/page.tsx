import { apiFetch } from "@/lib/server-api";
import { getSessionUser } from "@/lib/auth";
import { PageTitle } from "@/components/panel/ui";
import { LeadsTable } from "@/components/panel/LeadsTable";
import { Button } from "@/components/ds";
import { type Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MisLeadsPage() {
  const user = await getSessionUser();
  if (!user) return null; // el layout ya redirige; guard por tipos

  let leads: Lead[] = [];
  try {
    // Solo los leads asignados al propio usuario. Para un admin es necesario
    // (el endpoint le devuelve todos); para un usuario normal es redundante.
    leads = await apiFetch<Lead[]>(`/api/leads?assignedUser=${user.id}&order[createdAt]=desc`);
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
