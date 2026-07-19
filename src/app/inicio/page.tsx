import Navbar from "@/components/Navbar";
import HubClient from "@/components/HubClient";
import { auth } from "@/lib/auth";

export default async function InicioPage() {
  const session = await auth();
  const name = session?.user?.name || session?.user?.email || "";

  return (
    <div className="app-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <HubClient name={name} />
      </main>
    </div>
  );
}
