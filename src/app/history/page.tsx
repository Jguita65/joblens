import Navbar from "@/components/Navbar";
import HistoryClient from "@/components/HistoryClient";

export default function HistoryPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Historial
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tus análisis guardados y estadísticas. Se almacenan en la base de datos
            si está configurada, o en este navegador (localStorage) en caso
            contrario.
          </p>
        </div>
        <HistoryClient />
      </main>
    </div>
  );
}
