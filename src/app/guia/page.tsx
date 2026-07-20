import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import GuiaClient from "@/components/GuiaClient";

export default function GuiaPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="guia" />
        <GuiaClient />
      </main>
    </div>
  );
}
