"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Logo } from "./Logo";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-brand text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard">
          <Logo size={30} />
        </Link>

        <div className="flex items-center gap-1.5">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Analizar
          </Link>
          <Link href="/compare" className={linkClass("/compare")}>
            Comparar
          </Link>
          <Link href="/history" className={linkClass("/history")}>
            Historial
          </Link>
          <ThemeToggle />
          {session?.user && (
            <>
              <span className="hidden px-2 text-sm text-slate-400 lg:inline">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
