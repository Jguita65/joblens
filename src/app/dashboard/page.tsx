import Navbar from "@/components/Navbar";
import AnalyzerClient from "@/components/AnalyzerClient";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Analizador de sesgos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Pega una oferta de empleo y detecta lenguaje sesgado o excluyente.
            El análisis es 100% local y determinista.
          </p>
        </div>
        <AnalyzerClient />
      </main>
    </div>
  );
}
