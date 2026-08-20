import Link from "next/link";
import { getSalesAgents } from "@/lib/sales-data";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AddSalesAgentForm from "@/components/AddSalesAgentForm";

export const dynamic = "force-dynamic";

export default async function SalesAgentsPage() {
  const [agents, isAdmin] = await Promise.all([
    getSalesAgents(),
    isAdminAuthenticated(),
  ]);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <Link href="/sales" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Sales Agents
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Manage the roster assignable to Sales Monitoring businesses.
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
        {isAdmin ? (
          <AddSalesAgentForm />
        ) : (
          <p className="text-sm text-zinc-500">
            <Link
              href="/admin/login"
              className="font-medium text-zinc-900 hover:underline"
            >
              Log in as admin
            </Link>{" "}
            to add a new sales agent.
          </p>
        )}
      </div>

      <div className="mt-6">
        {agents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            No sales agents yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900"
              >
                {agent.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
