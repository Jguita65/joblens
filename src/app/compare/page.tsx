import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import CompareClient from "@/components/CompareClient";

export default function ComparePage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="compare" />
        <CompareClient />
      </main>
    </div>
  );
}
