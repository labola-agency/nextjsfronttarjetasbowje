"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  value: string;
  size?: number;
}

/**
 * QR generado en cliente con la librería `qrcode`, codificando la URL de la
 * tarjeta. Estilo Bowje: módulos oscuros sobre fondo claro para máximo escaneo.
 */
export function QrCode({ value, size = 180 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#1C1C1E", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#fff",
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="Código QR de la tarjeta" width={size - 16} height={size - 16} />
      ) : (
        <span style={{ color: "#1C1C1E", fontSize: 12 }}>Generando QR…</span>
      )}
    </div>
  );
}
