import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/server-api";
import { PageTitle } from "@/components/panel/ui";
import { EmpresaForm } from "@/components/panel/EmpresaForm";
import { DeleteEmpresaButton } from "@/components/panel/DeleteEmpresaButton";
import { updateEmpresaAction } from "@/lib/actions/empresas";
import type { Empresa, Template } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditEmpresaPage({ params }: PageProps) {
  const { id } = await params;

  let empresa: Empresa;
  try {
    empresa = await apiFetch<Empresa>(`/api/empresas/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  let templates: Template[] = [];
  try {
    templates = await apiFetch<Template[]>(`/api/templates?empresa=/api/empresas/${id}`);
  } catch {
    templates = [];
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/empresas" style={{ fontSize: 13, color: "var(--text-muted)" }}>
        ← Volver a empresas
      </Link>
      <div style={{ marginTop: 10 }}>
        <PageTitle title={`Editar ${empresa.name}`} subtitle="Marca y sus plantillas." />
      </div>

      <EmpresaForm action={updateEmpresaAction.bind(null, empresa.id)} empresa={empresa} submitLabel="Guardar cambios" />

      {/* Plantillas de la empresa (solo lectura; se gestionan manualmente) */}
      <div className="bw-surface" style={{ padding: 24, marginTop: 24 }}>
        <div className="mb-4">
          <p style={{ fontWeight: 700 }}>Plantillas</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Las plantillas se gestionan manualmente.
          </p>
        </div>

        {templates.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Aún no hay plantillas para esta empresa.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3"
                style={{ padding: "10px 0", borderTop: "0.5px solid var(--bw-hairline)" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: t.defaultConfig?.colors?.primary ?? "#54D222",
                  }}
                />
                <span>{t.name}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {t.defaultConfig?.layout} {t.isActive ? "" : "· inactiva"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bw-surface flex items-center justify-between gap-4" style={{ padding: 24, marginTop: 24 }}>
        <div>
          <p style={{ fontWeight: 600 }}>Eliminar empresa</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Se borrarán también sus plantillas. Las tarjetas/leads quedarán sin empresa.</p>
        </div>
        <DeleteEmpresaButton empresaId={empresa.id} />
      </div>
    </div>
  );
}
