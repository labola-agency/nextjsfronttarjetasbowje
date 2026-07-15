import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPublicCard, cardPath } from "@/lib/api";
import { resolveTemplate } from "@/components/card/templates/registry";
import { resolvePalette } from "@/components/card/templates/shared";
import { LeadForm } from "@/components/card/LeadForm";

interface PageProps {
  params: Promise<{ empresa: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await getPublicCard(slug);
  if (!card) return { title: "Tarjeta no encontrada — Bowje" };

  const title = `${card.displayName}${card.company ? " · " + card.company : ""} — Bowje`;
  const description = card.jobTitle
    ? `${card.jobTitle}. Guarda mi contacto o déjame tus datos.`
    : "Guarda mi contacto o déjame tus datos.";

  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { empresa, slug } = await params;
  const card = await getPublicCard(slug);
  if (!card) notFound();

  // Ruta canónica /{slugEmpresa}/tarjeta/{slug}: si el segmento de empresa no coincide, redirige.
  const canonical = cardPath(card.empresa, card.slug);
  if (canonical !== `/${empresa}/tarjeta/${slug}`) redirect(canonical);

  const Template = resolveTemplate(card);
  const p = resolvePalette(card);

  return (
    <div className="min-h-screen" style={{ background: p.pageBg, fontFamily: p.sans }}>
      <main className="mx-auto w-full max-w-[420px] px-4 py-8 flex flex-col gap-8">
        {/* Tarjeta (diseño autocontenido: marca + datos + "Guardar contacto") */}
        {/* eslint-disable-next-line react-hooks/static-components -- resolveTemplate elige una plantilla del registro fijo (TEMPLATES), no crea un componente en cada render */}
        <Template card={card} />

        {/* Captación de lead (estilo según la tarjeta) */}
        <section
          style={{
            background: p.cardBg,
            border: `1px solid ${p.border}`,
            borderRadius: 16,
            padding: 24,
            color: p.text,
            boxShadow: p.family === "light" ? "0 4px 22px rgba(20,18,16,.07)" : undefined,
          }}
        >
          <div className="flex flex-col gap-1" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>¿Hablamos?</h2>
            <p style={{ color: p.muted, fontSize: 14 }}>
              Déjame tus datos y te contacto. Sin compromiso.
            </p>
          </div>
          <LeadForm slug={card.slug} palette={p} />
        </section>
      </main>
    </div>
  );
}
