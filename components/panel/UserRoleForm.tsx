"use client";

import { useActionState } from "react";
import { updateUserRoleAction, type UpdateRoleState } from "@/lib/actions/users";
import { Button } from "@/components/ds";

const initial: UpdateRoleState = {};

/**
 * Cambia el rol de un usuario desde la tabla de admin. Para la propia cuenta se
 * muestra solo el rol (no editable) para evitar que un admin se quite el acceso.
 */
export function UserRoleForm({ userId, isAdmin, self = false }: { userId: number; isAdmin: boolean; self?: boolean }) {
  const [state, action, pending] = useActionState(updateUserRoleAction.bind(null, userId), initial);

  if (self) {
    return <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{isAdmin ? "Admin" : "Usuario"} (tú)</span>;
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <select name="role" defaultValue={isAdmin ? "admin" : "user"} className="bw-select" style={{ fontSize: 13, width: "auto", minWidth: 110 }}>
        <option value="user">Usuario</option>
        <option value="admin">Admin</option>
      </select>
      <Button type="submit" variant="ghost" size="sm" disabled={pending}>
        {pending ? "…" : "Guardar"}
      </Button>
      {state.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{state.error}</span>}
      {state.ok && <span style={{ color: "var(--accent)", fontSize: 12 }}>✓</span>}
    </form>
  );
}
