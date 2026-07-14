import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// La home es el acceso: sin sesión va al login; con sesión, a su panel.
export default async function Home() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  redirect(user.roles.includes("ROLE_ADMIN") ? "/admin" : "/mi-tarjeta");
}
