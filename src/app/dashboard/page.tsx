import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import AnalyzerClient from "@/components/AnalyzerClient";

export default function DashboardPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="dashboard" />
        <AnalyzerClient />
      </main>
    </div>
  );
}
