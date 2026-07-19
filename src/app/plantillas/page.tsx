import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PlantillasClient from "@/components/PlantillasClient";

export default function PlantillasPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="plantillas" />
        <PlantillasClient />
      </main>
    </div>
  );
}
