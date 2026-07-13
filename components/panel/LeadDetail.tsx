import Link from "next/link";
import type { Lead } from "@/lib/types";
import { cardPath } from "@/lib/api";
import { NoteForm } from "./NoteForm";

function Field({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
        {label}
      </p>
      <p style={{ fontSize: 15, marginTop: 4 }}>
        {href ? (
          <a href={href} style={{ color: "var(--accent)" }}>
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

export function LeadDetail({ lead, basePath }: { lead: Lead; basePath: string }) {
  const cardSlug = lead.card && typeof lead.card === "object" ? lead.card.slug : undefined;
  const cardHref = cardSlug ? cardPath(lead.empresa, cardSlug) : undefined;
  const owner = lead.assignedUser && typeof lead.assignedUser === "object" ? lead.assignedUser.name : undefined;
  const empresa = lead.empresa && typeof lead.empresa === "object" ? lead.empresa.name : undefined;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <Link href={basePath} style={{ fontSize: 13, color: "var(--text-muted)" }}>
          ← Volver a leads
        </Link>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginTop: 10 }}>{lead.name}</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
          Recibido el {new Date(lead.createdAt).toLocaleString("es-ES")}
        </p>
      </div>

      <div className="bw-surface grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ padding: 24 }}>
        <Field label="Email" value={lead.email} href={lead.email ? `mailto:${lead.email}` : undefined} />
        <Field label="Teléfono" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
        <Field label="Empresa contacto" value={lead.company} />
        <Field label="Empresa (origen)" value={empresa} />
        <Field label="Usuario" value={owner} />
        <Field label="Tarjeta origen" value={cardHref} href={cardHref} />
        <Field label="Origen" value={lead.source} />
        {lead.message && (
          <div className="sm:col-span-2">
            <p style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Mensaje
            </p>
            <p style={{ fontSize: 15, marginTop: 4, whiteSpace: "pre-wrap" }}>{lead.message}</p>
          </div>
        )}
        {lead.consentAt && (
          <div className="sm:col-span-2">
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Consentimiento RGPD otorgado el {new Date(lead.consentAt).toLocaleString("es-ES")}.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Notas</h2>
        <NoteForm leadId={lead.id} />
        <div className="flex flex-col gap-3 mt-2">
          {(lead.notes || []).length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sin notas todavía.</p>
          ) : (
            (lead.notes || []).map((n) => (
              <div key={n.id} className="bw-surface" style={{ padding: 16 }}>
                <p style={{ fontSize: 15, whiteSpace: "pre-wrap" }}>{n.body}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                  {n.author?.name || "—"} · {new Date(n.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
