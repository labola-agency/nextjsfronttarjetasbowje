import { apiFetch } from "@/lib/server-api";
import { cardPath, qrPath } from "@/lib/api";
import { PageTitle, EmptyState, StatCard } from "@/components/panel/ui";
import { CardEditor } from "@/components/panel/CardEditor";
import { WalletButtons } from "@/components/panel/WalletButtons";
import { Button } from "@/components/ds";
import { createMyCardAction, updateCardAction } from "@/lib/actions/cards";
import type { Card, Empresa, Template } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MiTarjetaPage() {
  let cards: Card[] = [];
  let templates: Template[] = [];
  let empresas: Empresa[] = [];
  try {
    [cards, templates, empresas] = await Promise.all([
      apiFetch<Card[]>("/api/cards"),
      apiFetch<Template[]>("/api/templates"),
      apiFetch<Empresa[]>("/api/empresas"),
    ]);
  } catch {
    cards = [];
  }

  if (cards.length === 0) {
    return (
      <div>
        <PageTitle title="Mi tarjeta" subtitle="Aún no tienes una tarjeta digital." />
        <EmptyState>
          <p style={{ marginBottom: 16 }}>Crea tu tarjeta para empezar a compartirla.</p>
          <form action={createMyCardAction}>
            <Button type="submit" variant="primary">
              Crear mi tarjeta
            </Button>
          </form>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {cards.map((card) => (
        <div key={card.id} className="flex flex-col gap-6">
          <PageTitle
            title="Mi tarjeta"
            subtitle={`Pública en ${cardPath(card.empresa, card.slug)}`}
            action={
              card.isPublished ? (
                <div className="flex items-center gap-2">
                  <Button as="a" href={cardPath(card.empresa, card.slug)} target="_blank" variant="outline" size="sm">
                    Ver pública ↗
                  </Button>
                  <Button as="a" href={qrPath(card.empresa, card.slug)} target="_blank" variant="ghost" size="sm">
                    Ver QR ↗
                  </Button>
                </div>
              ) : undefined
            }
          />

          <CardEditor
            action={updateCardAction.bind(null, card.id)}
            card={card}
            templates={templates}
            empresas={empresas}
            previewAside={
              <>
                {/* Métricas de la tarjeta */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Lecturas" value={card.viewCount ?? 0} accent />
                  <StatCard label="Guardados" value={card.saveCount ?? 0} />
                </div>

                {/* Wallets */}
                <div className="bw-surface" style={{ padding: 24 }}>
                  <p style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
                    Llévala en tu móvil
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
                    El pase muestra un QR que abre tu tarjeta pública. El cliente lo escanea para
                    guardarte o dejarte sus datos.
                  </p>
                  <WalletButtons cardId={card.id} />
                </div>
              </>
            }
          />
        </div>
      ))}
    </div>
  );
}
