import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import AtsClient from "@/components/AtsClient";

export default function AtsPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="ats" />
        <AtsClient />
      </main>
    </div>
  );
}
