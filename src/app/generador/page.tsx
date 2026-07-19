import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import GeneradorClient from "@/components/GeneradorClient";

export default function GeneradorPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="generador" />
        <GeneradorClient />
      </main>
    </div>
  );
}
