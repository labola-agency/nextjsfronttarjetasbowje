"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/server-api";
import type { Empresa } from "@/lib/types";

export interface EmpresaFormState {
  error?: string;
  ok?: boolean;
}

/** Campos de una empresa/marca desde el formulario. El logo se sube aparte. */
function empresaPayloadFromForm(formData: FormData): Record<string, unknown> {
  const name = String(formData.get("name") || "").trim();

  return {
    name,
    isActive: formData.get("isActive") === "on",
  };
}

/** Si el formulario trae un archivo de logo, lo sube al endpoint multipart. */
async function uploadLogoIfPresent(empresaId: number, formData: FormData): Promise<void> {
  const file = formData.get("logo");
  if (file && typeof file !== "string" && file.size > 0) {
    const body = new FormData();
    body.append("file", file);
    await apiFetch(`/api/empresas/${empresaId}/logo`, { method: "POST", body });
  }
}

function empresaError(e: unknown): string {
  if (e instanceof ApiError) {
    const body = e.body as { detail?: string } | null;
    return body?.detail || "No se pudo guardar la empresa.";
  }
  return "No se pudo guardar la empresa.";
}

export async function createEmpresaAction(_prev: EmpresaFormState, formData: FormData): Promise<EmpresaFormState> {
  const payload = empresaPayloadFromForm(formData);
  if (!payload.name) return { error: "El nombre es obligatorio." };

  try {
    const created = await apiFetch<Empresa>("/api/empresas", { method: "POST", body: JSON.stringify(payload) });
    await uploadLogoIfPresent(created.id, formData);
  } catch (e) {
    return { error: empresaError(e) };
  }

  revalidatePath("/admin/empresas");
  redirect("/admin/empresas");
}

export async function updateEmpresaAction(id: number, _prev: EmpresaFormState, formData: FormData): Promise<EmpresaFormState> {
  const payload = empresaPayloadFromForm(formData);
  if (!payload.name) return { error: "El nombre es obligatorio." };

  try {
    await apiFetch(`/api/empresas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(payload),
    });
    await uploadLogoIfPresent(id, formData);
  } catch (e) {
    return { error: empresaError(e) };
  }

  revalidatePath("/admin/empresas");
  redirect("/admin/empresas");
}

export async function deleteEmpresaAction(id: number): Promise<void> {
  await apiFetch(`/api/empresas/${id}`, { method: "DELETE" });
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas");
}
