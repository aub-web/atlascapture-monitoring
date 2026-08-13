import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAuditLog } from "@/lib/audit-data";
import { formatDateTime } from "@/lib/date";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminHistoryPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const entries = await getAuditLog();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Change History
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Every create/delete across Outbound and Sales Monitoring
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8">
        {entries.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            No changes recorded yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3"
              >
                <span
                  className={
                    entry.action === "CREATE"
                      ? "mt-0.5 shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                      : "mt-0.5 shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                  }
                >
                  {entry.action === "CREATE" ? "Created" : "Deleted"}
                </span>
                <div>
                  <p className="text-sm text-zinc-900">{entry.summary}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {formatDateTime(entry.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
