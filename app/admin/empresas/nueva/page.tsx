import Link from "next/link";
import { PageTitle } from "@/components/panel/ui";
import { EmpresaForm } from "@/components/panel/EmpresaForm";
import { createEmpresaAction } from "@/lib/actions/empresas";

export const dynamic = "force-dynamic";

export default function AdminNewEmpresaPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/empresas" style={{ fontSize: 13, color: "var(--text-muted)" }}>
        ← Volver a empresas
      </Link>
      <div style={{ marginTop: 10 }}>
        <PageTitle title="Nueva empresa" subtitle="Crea la marca; sus plantillas se añaden después." />
      </div>

      <EmpresaForm action={createEmpresaAction} submitLabel="Crear empresa" />
    </div>
  );
}
