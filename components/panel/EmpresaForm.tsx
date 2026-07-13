"use client";

import { useActionState } from "react";
import { type EmpresaFormState } from "@/lib/actions/empresas";
import { logoSrc } from "@/lib/api";
import { Button } from "@/components/ds";
import type { Empresa } from "@/lib/types";

const initial: EmpresaFormState = {};

type EmpresaAction = (prev: EmpresaFormState, formData: FormData) => Promise<EmpresaFormState>;

export function EmpresaForm({
  action,
  empresa,
  submitLabel = "Guardar",
}: {
  action: EmpresaAction;
  empresa?: Empresa;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="bw-surface flex flex-col gap-5" style={{ padding: 24 }}>
      <div>
        <label className="bw-label" htmlFor="e-name">
          Nombre*
        </label>
        <input id="e-name" name="name" className="bw-input" defaultValue={empresa?.name ?? ""} required />
      </div>

      <div>
        <label className="bw-label" htmlFor="e-logo">
          Logo
        </label>
        {empresa?.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc(empresa.logoUrl)} alt="" style={{ height: 40, marginBottom: 8, display: "block" }} />
        )}
        <input
          id="e-logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="bw-input"
        />
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
          PNG, JPG, WEBP o SVG (máx. 2 MB). {empresa?.logoUrl ? "Sube uno nuevo para reemplazarlo." : ""}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
        <input type="checkbox" name="isActive" defaultChecked={empresa?.isActive ?? true} style={{ accentColor: "var(--accent)" }} />
        Activa (seleccionable en las tarjetas)
      </label>

      {state.error && <p style={{ color: "#ff6b6b", fontSize: 14 }}>{state.error}</p>}

      <div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
