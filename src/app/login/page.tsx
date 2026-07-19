"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mb-2 text-3xl">🔍</div>
          <h1 className="text-2xl font-bold text-slate-900">JobLens</h1>
          <p className="mt-1 text-sm text-slate-500">
            Analizador de sesgos en ofertas de empleo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
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

        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
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
    </main>
  );
}
