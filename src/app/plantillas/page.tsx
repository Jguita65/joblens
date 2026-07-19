import Navbar from "@/components/Navbar";
import PlantillasClient from "@/components/PlantillasClient";

export default function PlantillasPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Plantillas de email
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Redacta emails a tus candidatos en segundos: invitación, información,
            oferta o rechazo.
          </p>
        </div>
        <PlantillasClient />
      </main>
    </div>
  );
}
