import Navbar from "@/components/Navbar";
import AtsClient from "@/components/AtsClient";

export default function AtsPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compatibilidad ATS
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Compara una oferta con un currículum y comprueba qué palabras clave
            faltan y si el CV pasaría un filtro ATS.
          </p>
        </div>
        <AtsClient />
      </main>
    </div>
  );
}
