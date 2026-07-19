import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import HistoryClient from "@/components/HistoryClient";

export default function HistoryPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="history" />
        <HistoryClient />
      </main>
    </div>
  );
}
