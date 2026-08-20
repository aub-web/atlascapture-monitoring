import Link from "next/link";
import { getSalesAgents } from "@/lib/sales-data";
import NewSalesBusinessForm from "@/components/NewSalesBusinessForm";

// Fetches the live agents roster — never freeze it as a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function NewSalesBusinessPage() {
  const agents = await getSalesAgents();

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link href="/sales" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        New Business
      </h1>
      <NewSalesBusinessForm agents={agents.map((a) => a.name)} />
    </main>
  );
}
