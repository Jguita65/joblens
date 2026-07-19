import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import BooleanClient from "@/components/BooleanClient";

export default function BooleanPage() {
  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <PageHeader tkey="boolean" />
        <BooleanClient />
      </main>
    </div>
  );
}
