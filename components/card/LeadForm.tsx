"use client";

import { useEffect, useRef, useState } from "react";
import { PUBLIC_API } from "@/lib/api";
import type { Palette } from "@/components/card/templates/shared";

interface Props {
  slug: string;
  palette: Palette;
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type State = "idle" | "sending" | "ok" | "error";

export function LeadForm({ slug, palette }: Props) {
  const accent = palette.primary;
  const dark = palette.family === "dark";
  // Estilo de los campos según la familia de la tarjeta.
  const fieldVars = {
    "--lf-field-bg": dark ? "rgba(255,255,255,0.05)" : palette.pageBg,
    "--lf-text": palette.text,
    "--lf-border": palette.border,
    "--lf-muted": palette.muted,
    "--lf-accent": accent,
  } as React.CSSProperties;
  const btnTextColor = dark ? "#0e0e0e" : "#ffffff";
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const turnstileToken = useRef<string>("");
  const widgetRef = useRef<HTMLDivElement>(null);

  // Carga el widget de Turnstile solo si hay site key configurada.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      document.body.appendChild(s);
    }
    const interval = setInterval(() => {
      const w = (window as unknown as { turnstile?: { render: (el: HTMLElement, o: object) => void } }).turnstile;
      if (w && widgetRef.current && !widgetRef.current.dataset.rendered) {
        widgetRef.current.dataset.rendered = "1";
        w.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: dark ? "dark" : "light",
          callback: (token: string) => {
            turnstileToken.current = token;
          },
        });
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [dark]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Debes aceptar la política de privacidad.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      slug,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""), // honeypot
      consent: true,
      consentText:
        "Acepto la política de privacidad y el tratamiento de mis datos para ser contactado.",
      turnstileToken: turnstileToken.current,
      source: "form_public",
    };

    setState("sending");
    try {
      const res = await fetch(`${PUBLIC_API}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 201) {
        setState("ok");
        form.reset();
        setConsent(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "No se pudo enviar. Inténtalo de nuevo.");
        setState("error");
      }
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.");
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div style={{ padding: "8px 0", textAlign: "center", color: palette.text }}>
        <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>¡Gracias!</p>
        <p style={{ color: palette.muted, fontSize: 14 }}>
          Hemos recibido tus datos. Te contactaremos pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" style={fieldVars}>
      <div>
        <label className="lead-label" htmlFor="lead-name">
          Nombre*
        </label>
        <input id="lead-name" name="name" className="lead-field" required maxLength={120} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="lead-label" htmlFor="lead-email">
            Email
          </label>
          <input id="lead-email" name="email" type="email" className="lead-field" />
        </div>
        <div>
          <label className="lead-label" htmlFor="lead-phone">
            Teléfono
          </label>
          <input id="lead-phone" name="phone" className="lead-field" />
        </div>
      </div>
      <div>
        <label className="lead-label" htmlFor="lead-company">
          Empresa
        </label>
        <input id="lead-company" name="company" className="lead-field" />
      </div>
      <div>
        <label className="lead-label" htmlFor="lead-message">
          Mensaje
        </label>
        <textarea id="lead-message" name="message" className="lead-field" rows={3} maxLength={2000} />
      </div>

      {/* Honeypot: oculto a humanos, los bots lo rellenan. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="lead-website">No rellenar</label>
        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {TURNSTILE_SITE_KEY && <div ref={widgetRef} className="cf-turnstile" />}

      <label className="flex items-start gap-3 text-sm" style={{ color: palette.muted }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          style={{ marginTop: 3, accentColor: accent }}
        />
        <span>
          Acepto la{" "}
          <a href="/legal/privacidad" style={{ color: accent, textDecoration: "underline" }}>
            política de privacidad
          </a>{" "}
          y el tratamiento de mis datos para ser contactado.
        </span>
      </label>

      {error && (
        <p role="alert" style={{ color: "#ff6b6b", fontSize: 14 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        style={{
          padding: 15,
          borderRadius: 999,
          background: accent,
          color: btnTextColor,
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          cursor: state === "sending" ? "default" : "pointer",
          opacity: state === "sending" ? 0.7 : 1,
        }}
      >
        {state === "sending" ? "Enviando…" : "Enviar mis datos"}
      </button>
    </form>
  );
}
