"use server";

import { redirect } from "next/navigation";
import { clearSession, login } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Introduce email y contraseña." };
  }

  const res = await login(email, password);
  if (!res.ok) {
    return { error: res.error };
  }

  // Redirección según rol.
  redirect(res.user.roles.includes("ROLE_ADMIN") ? "/admin" : "/mi-tarjeta");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
