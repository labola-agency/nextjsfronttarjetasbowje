"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ds";
import { logoutAction } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
}

interface Props {
  user: SessionUser;
  nav: NavItem[];
  children: React.ReactNode;
}

export function Shell({ user, nav, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className="md:w-64 shrink-0 flex flex-col"
        style={{ borderRight: "0.5px solid var(--bw-hairline)" }}
      >
        <div className="flex items-center justify-between h-20 px-6" style={{ borderBottom: "0.5px solid var(--bw-hairline)" }}>
          <Link href="/">
            <Wordmark size={22} />
          </Link>
          <button
            className="md:hidden bw-iconbtn bw-iconbtn--hairline"
            style={{ width: 36, height: 36 }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            <span style={{ fontSize: 18 }}>≡</span>
          </button>
        </div>

        <nav className={`${open ? "flex" : "hidden"} md:flex flex-col gap-1 p-4 flex-1`}>
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/mi-tarjeta" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "10px 14px",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--text-on-accent)" : "var(--text-primary)",
                  background: active ? "var(--accent)" : "transparent",
                  borderRadius: 2,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: "0.5px solid var(--bw-hairline)" }}>
          <p style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{user.email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="bw-btn bw-btn--ghost bw-btn--sm"
              style={{ width: "100%" }}
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 md:p-10 max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
