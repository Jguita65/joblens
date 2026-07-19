import Navbar from "@/components/Navbar";
import GeneradorClient from "@/components/GeneradorClient";

export default function GeneradorPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Generador de ofertas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Rellena los datos del puesto y obtén una oferta inclusiva y bien
            estructurada, analizada al momento.
          </p>
        </div>
        <GeneradorClient />
      </main>
    </div>
  );
}
