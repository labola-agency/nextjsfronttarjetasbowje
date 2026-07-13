"use client";

import { useState } from "react";
import { Button } from "@/components/ds";

export function WalletButtons({ cardId }: { cardId: number }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<"apple" | "google" | null>(null);

  async function apple() {
    setMsg(null);
    setBusy("apple");
    try {
      const res = await fetch(`/wallet/apple/${cardId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tarjeta-${cardId}.pkpass`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg(data.detail || data.error || "Apple Wallet aún no está disponible.");
      }
    } catch {
      setMsg("No se pudo generar el pase.");
    } finally {
      setBusy(null);
    }
  }

  async function google() {
    setMsg(null);
    setBusy("google");
    try {
      const res = await fetch(`/wallet/google/${cardId}`);
      if (res.ok) {
        const data = (await res.json()) as { saveUrl?: string };
        if (data.saveUrl) {
          window.location.href = data.saveUrl;
          return;
        }
        setMsg("No se obtuvo el enlace de Google Wallet.");
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg(data.detail || data.error || "Google Wallet aún no está disponible.");
      }
    } catch {
      setMsg("No se pudo generar el enlace.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost" onClick={apple} disabled={busy !== null}>
          {busy === "apple" ? "Generando…" : " Añadir a Apple Wallet"}
        </Button>
        <Button type="button" variant="ghost" onClick={google} disabled={busy !== null}>
          {busy === "google" ? "Generando…" : "Añadir a Google Wallet"}
        </Button>
      </div>
      {msg && (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
