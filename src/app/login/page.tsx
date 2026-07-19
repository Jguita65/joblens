"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

const FEATURES = [
  ["🎯", "Detección por categorías", "Género, edad, capacitismo, jerga, requisitos discriminatorios y exigencia irreal."],
  ["✨", "Reescritura inclusiva", "Genera una versión corregida de la oferta en un clic."],
  ["📊", "Índice e historial", "Puntúa la inclusividad de 0 a 100 y guarda tu evolución."],
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="app-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-2 lg:items-center">
        {/* Brand / features */}
        <div className="hidden lg:block">
          <div className="mb-4 flex items-center gap-2">
            <LogoMark size={44} style={{ borderRadius: 12 }} />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              JobLens
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">
            Escribe ofertas de empleo{" "}
            <span className="bg-gradient-to-r from-brand-600 to-pink-500 bg-clip-text text-transparent">
              más justas e inclusivas
            </span>
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Detecta lenguaje sesgado o excluyente en tus ofertas y reescríbelo con
            sugerencias listas para aplicar.
          </p>
          <ul className="mt-6 space-y-3">
            {FEATURES.map(([icon, title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="card animate-scale-in w-full p-8">
          <div className="mb-6 text-center lg:hidden">
            <div className="mb-2 flex justify-center">
              <LogoMark size={44} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">JobLens</h1>
            <p className="mt-1 text-sm text-slate-500">
              Analizador de sesgos en ofertas de empleo
            </p>
          </div>

          <h2 className="mb-4 hidden text-xl font-bold text-slate-900 dark:text-white lg:block">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            Cuenta de prueba precargada:{" "}
            <span className="font-mono font-semibold">test@test.com</span> /{" "}
            <span className="font-mono font-semibold">test1234</span>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-medium text-brand hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
