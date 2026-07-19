import Navbar from "@/components/Navbar";
import HistoryClient from "@/components/HistoryClient";

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Historial</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tus análisis guardados. Se almacenan en la base de datos si está
            configurada, o en este navegador (localStorage) en caso contrario.
          </p>
        </div>
        <HistoryClient />
      </main>
    </div>
  );
}
