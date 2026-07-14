"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/server-api";

export interface CreateUserState {
  error?: string;
  ok?: boolean;
}

export async function createUserAction(_prev: CreateUserState, formData: FormData): Promise<CreateUserState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const jobTitle = String(formData.get("jobTitle") || "").trim();
  const isAdmin = formData.get("isAdmin") === "on";

  if (!name || !email || password.length < 8) {
    return { error: "Nombre, email y contraseña (mín. 8) son obligatorios." };
  }

  try {
    await apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        plainPassword: password,
        jobTitle: jobTitle || null,
        roles: [isAdmin ? "ROLE_ADMIN" : "ROLE_USER"],
      }),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      const body = e.body as { detail?: string; "hydra:description"?: string } | null;
      return { error: body?.detail || body?.["hydra:description"] || "No se pudo crear el usuario." };
    }
    return { error: "No se pudo crear el usuario." };
  }

  revalidatePath("/admin/reps");
  redirect("/admin/reps");
}

export interface UpdatePasswordState {
  error?: string;
  ok?: boolean;
}

export interface UpdateRoleState {
  error?: string;
  ok?: boolean;
}

/** [Admin] Cambia el rol de un usuario (administrador o usuario normal). */
export async function updateUserRoleAction(userId: number, _prev: UpdateRoleState, formData: FormData): Promise<UpdateRoleState> {
  const isAdmin = String(formData.get("role")) === "admin";

  try {
    await apiFetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify({ roles: [isAdmin ? "ROLE_ADMIN" : "ROLE_USER"] }),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      const body = e.body as { detail?: string; "hydra:description"?: string } | null;
      return { error: body?.detail || body?.["hydra:description"] || "No se pudo cambiar el rol." };
    }
    return { error: "No se pudo cambiar el rol." };
  }

  revalidatePath("/admin/reps");
  return { ok: true };
}

/** [Admin] Actualiza la contraseña de un usuario. El backend la hashea (UserProcessor). */
export async function updateUserPasswordAction(userId: number, _prev: UpdatePasswordState, formData: FormData): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  try {
    await apiFetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify({ plainPassword: password }),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      const body = e.body as { detail?: string; "hydra:description"?: string } | null;
      return { error: body?.detail || body?.["hydra:description"] || "No se pudo actualizar la contraseña." };
    }
    return { error: "No se pudo actualizar la contraseña." };
  }

  return { ok: true };
}
