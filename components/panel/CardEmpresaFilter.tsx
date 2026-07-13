"use client";

import { useRouter } from "next/navigation";
import type { Empresa } from "@/lib/types";

/** Filtra las tarjetas por empresa/marca. Preserva el filtro de usuario. */
export function CardEmpresaFilter({ empresas, current, user }: { empresas: Empresa[]; current?: string; user?: string }) {
  const router = useRouter();

  return (
    <select
      className="bw-select"
      defaultValue={current ?? ""}
      style={{ maxWidth: 240 }}
      onChange={(e) => {
        const p = new URLSearchParams();
        if (user) p.set("user", user);
        if (e.target.value) p.set("empresa", e.target.value);
        const qs = p.toString();
        router.push(qs ? `/admin/cards?${qs}` : "/admin/cards");
      }}
    >
      <option value="">Todas las empresas</option>
      {empresas.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name}
        </option>
      ))}
    </select>
  );
}
