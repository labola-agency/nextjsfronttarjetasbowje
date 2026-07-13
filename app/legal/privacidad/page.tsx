import { Wordmark } from "@/components/ds";
import Link from "next/link";

export const metadata = {
  title: "Política de privacidad — Bowje",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 sm:px-12 h-20">
        <Link href="/">
          <Wordmark size={22} />
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-24 flex flex-col gap-5" style={{ lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Política de privacidad</h1>
        <p style={{ color: "var(--text-muted)" }}>
          En cumplimiento del RGPD, te informamos sobre el tratamiento de los datos que nos
          facilitas a través del formulario de contacto de las tarjetas digitales.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>Responsable</h2>
        <p style={{ color: "var(--text-muted)" }}>Bowje · hola@bowje.es</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>Finalidad</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Gestionar tu solicitud de contacto y, en su caso, mantener una relación comercial.
          No cedemos tus datos a terceros salvo obligación legal.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>Legitimación</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Tu consentimiento explícito, otorgado al marcar la casilla del formulario.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>Derechos</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
          limitación y portabilidad escribiendo a hola@bowje.es.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>Conservación</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Conservamos tus datos mientras dure la relación y, después, durante los plazos
          legalmente exigidos. Los leads inactivos se eliminan periódicamente.
        </p>
      </main>
    </div>
  );
}
