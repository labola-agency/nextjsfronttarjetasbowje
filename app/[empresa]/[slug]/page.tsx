import { notFound, redirect } from "next/navigation";
import { getPublicCard, cardPath } from "@/lib/api";

interface PageProps {
  params: Promise<{ empresa: string; slug: string }>;
}

/**
 * Compatibilidad: la tarjeta vivía en /{empresa}/{slug} (y antes en /c/{slug}).
 * Ahora está en /{empresa}/tarjeta/{slug}; este stub redirige los enlaces
 * antiguos (incluidos QR/pases de wallet ya emitidos) a la ruta canónica.
 */
export default async function LegacyCardRedirect({ params }: PageProps) {
  const { slug } = await params;
  const card = await getPublicCard(slug);
  if (!card) notFound();
  redirect(cardPath(card.empresa, card.slug));
}
