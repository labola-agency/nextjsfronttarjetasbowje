"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/server-api";

/** Reasigna un lead a otro usuario (solo admin lo logrará en el backend). */
export async function reassignLead(leadId: number, userIri: string): Promise<void> {
  await apiFetch(`/api/leads/${leadId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/merge-patch+json" },
    body: JSON.stringify({ assignedUser: userIri }),
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

/** Añade una nota al hilo de un lead. */
export async function addLeadNote(leadId: number, body: string): Promise<void> {
  const text = body.trim();
  if (!text) return;
  await apiFetch(`/api/lead_notes`, {
    method: "POST",
    body: JSON.stringify({ lead: `/api/leads/${leadId}`, body: text }),
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/mi-tarjeta/leads/${leadId}`);
}
