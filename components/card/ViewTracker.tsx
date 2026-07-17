"use client";

import { useEffect, useRef } from "react";
import { PUBLIC_API } from "@/lib/api";

/**
 * Cuenta una lectura de la tarjeta. Al vivir en el navegador, solo se dispara
 * en una apertura real: los bots de previsualización de enlaces y el prefetch
 * de Next no ejecutan JS, así que no inflan el contador. No pinta nada.
 */
export function ViewTracker({ slug }: { slug: string }) {
  const done = useRef(false);

  useEffect(() => {
    // Guard: evita el doble conteo del StrictMode en desarrollo.
    if (done.current) return;
    done.current = true;

    fetch(`${PUBLIC_API}/api/public/cards/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Si falla el conteo no pasa nada, no molestamos al visitante.
    });
  }, [slug]);

  return null;
}
