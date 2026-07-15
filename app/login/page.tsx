"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { Button, Wordmark, GlowBackdrop } from "@/components/ds";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 overflow-hidden">
      <GlowBackdrop size={520} top="-10%" opacity={0.35} />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        <Link href="/" className="self-center">
          <Wordmark size={30} />
        </Link>

        <div className="bw-surface" style={{ padding: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Acceder</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
            Panel de usuarios y administración.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label className="bw-label" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" className="bw-input" required autoComplete="email" />
            </div>
            <div>
              <label className="bw-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="bw-input"
                required
                autoComplete="current-password"
              />
            </div>

            {state.error && (
              <p role="alert" style={{ color: "#ff6b6b", fontSize: 14 }}>
                {state.error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={pending}>
              {pending ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
