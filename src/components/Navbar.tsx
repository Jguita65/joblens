"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Logo } from "./Logo";
import { TOOLS } from "@/lib/tools";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-brand text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  const onToolsPage = TOOLS.some((t) => pathname === t.href);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/inicio">
          <Logo size={30} />
        </Link>

        <div className="flex items-center gap-1.5">
          <Link href="/inicio" className={linkClass(pathname === "/inicio")}>
            Inicio
          </Link>

          {/* Tools dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className={linkClass(onToolsPage)}
            >
              Herramientas ▾
            </button>
            {open && (
              <>
                <button
                  aria-hidden
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {TOOLS.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        pathname === t.href ? "bg-slate-50 dark:bg-slate-800" : ""
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {t.title}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {t.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <ThemeToggle />
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Salir
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
