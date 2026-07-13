import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Shell, type NavItem } from "@/components/panel/Shell";

const NAV: NavItem[] = [
  { href: "/mi-tarjeta", label: "Mi tarjeta" },
  { href: "/mi-tarjeta/leads", label: "Mis leads" },
];

export default async function MiTarjetaLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // Si es admin, ofrecemos también el acceso al panel completo.
  const nav = user.roles.includes("ROLE_ADMIN")
    ? [...NAV, { href: "/admin", label: "Panel admin" }]
    : NAV;

  return (
    <Shell user={user} nav={nav}>
      {children}
    </Shell>
  );
}
