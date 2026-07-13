import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/server-api";
import { LeadDetail } from "@/components/panel/LeadDetail";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let lead: Lead;
  try {
    lead = await apiFetch<Lead>(`/api/leads/${id}`);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
  return <LeadDetail lead={lead} basePath="/admin/leads" />;
}
