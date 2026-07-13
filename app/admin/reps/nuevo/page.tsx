import Link from "next/link";
import { PageTitle } from "@/components/panel/ui";
import { CreateUserForm } from "@/components/panel/CreateUserForm";

export const dynamic = "force-dynamic";

export default function AdminNewUserPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/reps" style={{ fontSize: 13, color: "var(--text-muted)" }}>
        ← Volver a usuarios
      </Link>
      <div style={{ marginTop: 10 }}>
        <PageTitle title="Nuevo usuario" subtitle="Da de alta a un empleado con acceso al panel." />
      </div>

      <CreateUserForm />
    </div>
  );
}
