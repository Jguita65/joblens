import Navbar from "@/components/Navbar";
import RankingClient from "@/components/RankingClient";

export default function RankingPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ranking de candidatos
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pega una oferta y varios currículums para ordenarlos según su encaje
            con el puesto.
          </p>
        </div>
        <RankingClient />
      </main>
    </div>
  );
}
