import Link from "next/link";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { TOOLS } from "@/lib/tools";

export default async function InicioPage() {
  const session = await auth();
  const name = session?.user?.name || "de nuevo";

  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hola, {name} 👋
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Tu kit de herramientas para una selección más justa y eficaz. Elige una
            herramienta para empezar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="card group flex flex-col gap-2 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                {t.icon}
              </div>
              <h2 className="mt-1 font-semibold text-slate-900 dark:text-white">
                {t.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.description}
              </p>
              <span className="mt-1 text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Abrir →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
