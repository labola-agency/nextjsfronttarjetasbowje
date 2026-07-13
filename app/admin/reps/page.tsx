import { apiFetch } from "@/lib/server-api";
import { PageTitle, EmptyState } from "@/components/panel/ui";
import { Button } from "@/components/ds";
import { UserPasswordForm } from "@/components/panel/UserPasswordForm";
import type { User } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminRepsPage() {
  let users: User[] = [];
  try {
    users = await apiFetch<User[]>("/api/users");
  } catch {
    users = [];
  }

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Usuarios"
        subtitle="Equipo con acceso al panel."
        action={
          <Button as="a" href="/admin/reps/nuevo" variant="primary" size="sm">
            Nuevo usuario
          </Button>
        }
      />

      {users.length === 0 ? (
        <EmptyState>No hay usuarios.</EmptyState>
      ) : (
        <div className="bw-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)" }}>
                <th style={cell}>Nombre</th>
                <th style={cell}>Email</th>
                <th style={cell}>Cargo</th>
                <th style={cell}>Rol</th>
                <th style={cell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "0.5px solid var(--bw-hairline)" }}>
                  <td style={cell}>{u.name}</td>
                  <td style={{ ...cell, color: "var(--text-muted)" }}>{u.email}</td>
                  <td style={cell}>{u.jobTitle || "—"}</td>
                  <td style={cell}>{u.roles.includes("ROLE_ADMIN") ? "Admin" : "Usuario"}</td>
                  <td style={cell}>
                    <UserPasswordForm userId={u.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cell: React.CSSProperties = { padding: "14px 16px" };
