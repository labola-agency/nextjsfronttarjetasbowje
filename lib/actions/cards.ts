"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/server-api";
import { getSessionUser } from "@/lib/auth";

export interface CardFormState {
  error?: string;
  ok?: boolean;
}

/** Campos comunes de una tarjeta a partir del formulario. El slug lo pone el backend. */
function cardPayloadFromForm(formData: FormData): Record<string, unknown> {
  const get = (k: string) => {
    const v = formData.get(k);
    return v === null ? null : String(v).trim() || null;
  };

  // Solo se tocan `empresa`/`template` si sus selectores estaban en el formulario.
  const rawEmpresa = formData.get("empresaId");
  const empresa =
    rawEmpresa === null ? undefined : String(rawEmpresa).trim() ? `/api/empresas/${String(rawEmpresa).trim()}` : null;
  const rawTemplate = formData.get("templateId");
  const template =
    rawTemplate === null ? undefined : String(rawTemplate).trim() ? `/api/templates/${String(rawTemplate).trim()}` : null;

  return {
    empresa,
    template,
    displayName: get("displayName") || "",
    jobTitle: get("jobTitle"),
    company: get("company"),
    phone: get("phone"),
    mobile: get("mobile"),
    email: get("email"),
    website: get("website"),
    addressLine: get("addressLine"),
    city: get("city"),
    postalCode: get("postalCode"),
    country: get("country"),
    linkedin: get("linkedin"),
    isPublished: formData.get("isPublished") === "on",
    // El color/diseño lo pone el backend desde la plantilla; aquí solo el tagline.
    // Se reenvía la foto actual para que el merge-patch no la borre (la nueva, si
    // la hay, se sube aparte en uploadPhotoIfPresent y sobrescribe este valor).
    config: {
      tagline: get("tagline") || undefined,
      // Cadena = conserva la foto; null = la borra explícitamente en el merge-patch.
      photoUrl: get("currentPhotoUrl"),
      // Punto focal para reencuadrar la foto (object-position), en % 0–100.
      photoPosition: {
        x: Number(formData.get("photoPosX")) || 50,
        y: Number(formData.get("photoPosY")) || 50,
      },
      // Encaje: "cover" recorta (defecto); "contain" muestra la foto entera.
      photoFit: get("photoFit") === "contain" ? "contain" : "cover",
    },
  };
}

/** Si el formulario trae un archivo de foto, lo sube al endpoint multipart. */
async function uploadPhotoIfPresent(cardId: number, formData: FormData): Promise<void> {
  const file = formData.get("photo");
  if (file && typeof file !== "string" && file.size > 0) {
    const body = new FormData();
    body.append("file", file);
    await apiFetch(`/api/cards/${cardId}/photo`, { method: "POST", body });
  }
}

/** Borra la foto de la tarjeta (archivo + config.photoUrl). Se queda en la página. */
export async function deleteCardPhotoAction(cardId: number): Promise<void> {
  await apiFetch(`/api/cards/${cardId}/photo`, { method: "DELETE" });
  revalidatePath("/mi-tarjeta");
  revalidatePath("/admin/cards");
}

function cardError(e: unknown): string {
  if (e instanceof ApiError) {
    const body = e.body as { detail?: string } | null;
    return body?.detail || "No se pudo guardar la tarjeta.";
  }
  return "No se pudo guardar la tarjeta.";
}

/** Crea la tarjeta del usuario autenticado si aún no tiene ninguna. */
export async function createMyCardAction(): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;

  await apiFetch("/api/cards", {
    method: "POST",
    body: JSON.stringify({
      displayName: user.name,
      email: user.email,
      isPublished: false,
      config: { colors: { primary: "#54D222", bg: "#1C1C1E", text: "#FFFFFF" }, layout: "minimal" },
    }),
  });

  revalidatePath("/mi-tarjeta");
}

/** Actualiza la tarjeta propia (PATCH merge-patch). Se queda en la página. */
export async function updateCardAction(cardId: number, _prev: CardFormState, formData: FormData): Promise<CardFormState> {
  const payload = cardPayloadFromForm(formData);
  if (!payload.displayName) {
    return { error: "El nombre visible es obligatorio." };
  }

  try {
    await apiFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(payload),
    });
    await uploadPhotoIfPresent(cardId, formData);
  } catch (e) {
    return { error: cardError(e) };
  }

  revalidatePath("/mi-tarjeta");
  return { ok: true };
}

/** [Admin] Crea una tarjeta y la asigna a un usuario. Vuelve al listado. */
export async function createCardAction(_prev: CardFormState, formData: FormData): Promise<CardFormState> {
  const payload = cardPayloadFromForm(formData);
  const userId = String(formData.get("userId") || "").trim();

  if (!payload.displayName) {
    return { error: "El nombre visible es obligatorio." };
  }
  if (!userId) {
    return { error: "Elige a qué usuario pertenece la tarjeta." };
  }
  payload.user = `/api/users/${userId}`;

  try {
    const created = await apiFetch<{ id: number }>("/api/cards", { method: "POST", body: JSON.stringify(payload) });
    await uploadPhotoIfPresent(created.id, formData);
  } catch (e) {
    return { error: cardError(e) };
  }

  revalidatePath("/admin/cards");
  redirect("/admin/cards");
}

/** [Admin] Edita cualquier tarjeta, permitiendo reasignar el dueño. Vuelve al listado. */
export async function adminUpdateCardAction(cardId: number, _prev: CardFormState, formData: FormData): Promise<CardFormState> {
  const payload = cardPayloadFromForm(formData);
  const userId = String(formData.get("userId") || "").trim();

  if (!payload.displayName) {
    return { error: "El nombre visible es obligatorio." };
  }
  if (userId) {
    payload.user = `/api/users/${userId}`;
  }

  try {
    await apiFetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(payload),
    });
    await uploadPhotoIfPresent(cardId, formData);
  } catch (e) {
    return { error: cardError(e) };
  }

  revalidatePath("/admin/cards");
  redirect("/admin/cards");
}

/** [Admin] Elimina una tarjeta y vuelve al listado. */
export async function deleteCardAction(cardId: number): Promise<void> {
  await apiFetch(`/api/cards/${cardId}`, { method: "DELETE" });
  revalidatePath("/admin/cards");
  redirect("/admin/cards");
}
