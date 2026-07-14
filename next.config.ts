import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Red de seguridad: las imágenes se comprimen en el navegador antes de
      // subir (lib/image.ts), pero subimos el límite del Server Action por si
      // acaso. Por debajo del tope de 4,5 MB de Vercel.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
