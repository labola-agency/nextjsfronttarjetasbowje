"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateUserPasswordAction, type UpdatePasswordState } from "@/lib/actions/users";
import { Button } from "@/components/ds";

const initial: UpdatePasswordState = {};

/** Cambia la contraseña de un usuario desde la tabla de admin (revela un campo al pulsar). */
export function UserPasswordForm({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateUserPasswordAction.bind(null, userId), initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline", fontSize: 13, color: "var(--accent)" }}
      >
        Cambiar contraseña
      </button>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2" style={{ minWidth: 220 }}>
      <div className="flex items-center gap-2">
        <input
          name="password"
          type="password"
          className="bw-input"
          placeholder="Nueva contraseña"
          minLength={8}
          required
          autoFocus
          style={{ fontSize: 13 }}
        />
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "…" : "Guardar"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, color: "var(--text-muted)" }}
        >
          Cancelar
        </button>
      </div>
      {state.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{state.error}</span>}
      {state.ok && <span style={{ color: "var(--accent)", fontSize: 12 }}>Contraseña actualizada.</span>}
    </form>
  );
}
