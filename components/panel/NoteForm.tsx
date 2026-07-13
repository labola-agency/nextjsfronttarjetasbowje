"use client";

import { useRef, useState, useTransition } from "react";
import { addLeadNote } from "@/lib/actions/leads";
import { Button } from "@/components/ds";

export function NoteForm({ leadId }: { leadId: number }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const body = ref.current?.value.trim() || "";
    if (!body) return;
    setError(null);
    startTransition(async () => {
      try {
        await addLeadNote(leadId, body);
        if (ref.current) ref.current.value = "";
      } catch {
        setError("No se pudo guardar la nota.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea ref={ref} className="bw-textarea" rows={3} placeholder="Añadir una nota de seguimiento…" />
      {error && <p style={{ color: "#ff6b6b", fontSize: 14 }}>{error}</p>}
      <div>
        <Button type="button" onClick={submit} variant="primary" size="sm" disabled={pending}>
          {pending ? "Guardando…" : "Añadir nota"}
        </Button>
      </div>
    </div>
  );
}
