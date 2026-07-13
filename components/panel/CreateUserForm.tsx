"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUserAction, type CreateUserState } from "@/lib/actions/users";
import { Button } from "@/components/ds";

const initial: CreateUserState = {};

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUserAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="bw-surface flex flex-col gap-4" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>Nuevo usuario</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="bw-label" htmlFor="u-name">Nombre</label>
          <input id="u-name" name="name" className="bw-input" required />
        </div>
        <div>
          <label className="bw-label" htmlFor="u-email">Email</label>
          <input id="u-email" name="email" type="email" className="bw-input" required />
        </div>
        <div>
          <label className="bw-label" htmlFor="u-pass">Contraseña</label>
          <input id="u-pass" name="password" type="password" className="bw-input" required minLength={8} />
        </div>
        <div>
          <label className="bw-label" htmlFor="u-job">Cargo</label>
          <input id="u-job" name="jobTitle" className="bw-input" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
        <input type="checkbox" name="isAdmin" style={{ accentColor: "var(--accent)" }} /> Es administrador
      </label>

      {state.error && <p style={{ color: "#ff6b6b", fontSize: 14 }}>{state.error}</p>}
      {state.ok && <p style={{ color: "var(--accent)", fontSize: 14 }}>Usuario creado.</p>}

      <div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Creando…" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}
