"use client";

import { useTransition } from "react";
import { deleteEmpresaAction } from "@/lib/actions/empresas";
import { Button } from "@/components/ds";

/** Botón de borrado de empresa con confirmación. */
export function DeleteEmpresaButton({ empresaId }: { empresaId: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      style={{ color: "#ff6b6b" }}
      onClick={() => {
        if (confirm("¿Eliminar esta empresa? Las tarjetas y leads que la usan quedarán sin empresa.")) {
          startTransition(() => deleteEmpresaAction(empresaId));
        }
      }}
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </Button>
  );
}
