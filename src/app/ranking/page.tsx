import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import RankingClient from "@/components/RankingClient";

export default function RankingPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="ranking" />
        <RankingClient />
      </main>
    </div>
  );
}
