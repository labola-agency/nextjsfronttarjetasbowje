import Link from "next/link";
import { Button, Wordmark, GlowBackdrop, Tag } from "@/components/ds";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlowBackdrop size={620} top="-6%" opacity={0.4} />

      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 h-20">
        <Wordmark size={24} />
        <Link href="/login">
          <Button variant="outline" size="sm">
            Acceder
          </Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-16 sm:pt-28 pb-24 text-center flex flex-col items-center gap-8">
        <Tag variant="accent">Tarjetas digitales</Tag>
        <h1
          style={{
            fontSize: "clamp(40px, 9vw, 84px)",
            fontWeight: 900,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
          }}
        >
          Tu presentación,
          <br />
          en un <span style={{ color: "var(--accent)" }}>solo enlace</span>.
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 560 }}>
          Cada empleado de Bowje lleva su tarjeta digital. El cliente guarda tu contacto o te
          deja sus datos al instante. Tú lo gestionas todo desde el CRM.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/bowje/tarjeta/laura-garcia">
            <Button variant="primary" size="lg">
              Ver tarjeta de ejemplo
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="lg">
              Entrar al panel
            </Button>
          </Link>
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Creative solutions for today
        </p>
      </main>
    </div>
  );
}
