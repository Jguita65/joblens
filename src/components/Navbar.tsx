"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-brand text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <span className="text-lg font-bold text-slate-900">JobLens</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Analizar
          </Link>
          <Link href="/history" className={linkClass("/history")}>
            Historial
          </Link>
          {session?.user && (
            <>
              <span className="hidden px-2 text-sm text-slate-400 sm:inline">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
