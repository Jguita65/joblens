import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import EntrevistaClient from "@/components/EntrevistaClient";

export default function EntrevistaPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="entrevista" />
        <EntrevistaClient />
      </main>
    </div>
  );
}
