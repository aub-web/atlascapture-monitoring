import Link from "next/link";
import { getPartnerAssociates } from "@/lib/data";
import AddPartnerAssociateForm from "@/components/AddPartnerAssociateForm";

export const dynamic = "force-dynamic";

export default async function PartnerAssociatesPage() {
  const associates = await getPartnerAssociates();

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Partner Associates
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Manage the roster assignable to Outbound Monitoring businesses.
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
        <AddPartnerAssociateForm />
      </div>

      <div className="mt-6">
        {associates.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            No partner associates yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {associates.map((associate) => (
              <li
                key={associate.id}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900"
              >
                {associate.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
