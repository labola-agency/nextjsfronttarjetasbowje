"use client";

import { useTransition } from "react";
import { deleteCardAction } from "@/lib/actions/cards";
import { Button } from "@/components/ds";

/** Botón de borrado de tarjeta con confirmación. */
export function DeleteCardButton({ cardId, size = "md" }: { cardId: number; size?: "sm" | "md" | "lg" }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      disabled={pending}
      style={{ color: "#ff6b6b" }}
      onClick={() => {
        if (confirm("¿Eliminar esta tarjeta? No se puede deshacer.")) {
          startTransition(() => deleteCardAction(cardId));
        }
      }}
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </Button>
  );
}
