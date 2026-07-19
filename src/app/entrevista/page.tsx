import Navbar from "@/components/Navbar";
import EntrevistaClient from "@/components/EntrevistaClient";

export default function EntrevistaPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Preguntas de entrevista
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Preguntas por competencia para entrevistas estructuradas, y una lista
            de preguntas que conviene evitar.
          </p>
        </div>
        <EntrevistaClient />
      </main>
    </div>
  );
}
