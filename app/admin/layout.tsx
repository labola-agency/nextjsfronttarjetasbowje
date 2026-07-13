import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Shell, type NavItem } from "@/components/panel/Shell";

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/cards", label: "Tarjetas" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/reps", label: "Usuarios" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || !user.roles.includes("ROLE_ADMIN")) {
    redirect("/login");
  }
  return (
    <Shell user={user} nav={NAV}>
      {children}
    </Shell>
  );
}
