import Navbar from "@/components/Navbar";
import CompareClient from "@/components/CompareClient";

export default function ComparePage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comparador de versiones
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Compara dos versiones de una oferta y comprueba cuál es más inclusiva.
          </p>
        </div>
        <CompareClient />
      </main>
    </div>
  );
}
