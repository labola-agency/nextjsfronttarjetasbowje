"use client";

import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

/** Filtra los leads por usuario asignado (solo admin). Preserva el filtro de empresa. */
export function LeadUserFilter({ users, current, empresa }: { users: User[]; current?: string; empresa?: string }) {
  const router = useRouter();

  return (
    <select
      className="bw-select"
      defaultValue={current ?? ""}
      style={{ maxWidth: 240 }}
      onChange={(e) => {
        const p = new URLSearchParams();
        if (e.target.value) p.set("user", e.target.value);
        if (empresa) p.set("empresa", empresa);
        const qs = p.toString();
        router.push(qs ? `/admin/leads?${qs}` : "/admin/leads");
      }}
    >
      <option value="">Todos los usuarios</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name}
        </option>
      ))}
    </select>
  );
}
