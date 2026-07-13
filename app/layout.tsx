import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Archivo } from "next/font/google";
import "./globals.css";

// Fuentes de los diseños de tarjeta: familia oscura (Bowje) usa Space Grotesk +
// IBM Plex Mono; familia clara (everyoneplus) usa Archivo. Se exponen como
// variables CSS para que las plantillas las referencien vía font-family.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk", display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-ibm-plex-mono", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: "Bowje — Tarjetas digitales",
  description:
    "Tarjetas digitales de presentación para el equipo de Bowje. Creative solutions for today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`min-h-full ${spaceGrotesk.variable} ${ibmPlexMono.variable} ${archivo.variable}`}>{children}</body>
    </html>
  );
}
