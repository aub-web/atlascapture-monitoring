import Link from "next/link";
import { getSalesBusinessesWithUtilization } from "@/lib/sales-data";
import SalesBusinessRow from "@/components/SalesBusinessRow";
import DailyUtilizationTracker from "@/components/DailyUtilizationTracker";

export default async function SalesMonitoringHome() {
  const businesses = await getSalesBusinessesWithUtilization();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Sales Monitoring
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Device utilization by sales agent
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/export/sales"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Export CSV
          </a>
          <Link
            href="/sales/businesses/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            + New Business
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        {businesses.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            No businesses yet.
          </p>
        ) : (
          businesses.map((business) => (
            <SalesBusinessRow
              key={business.id}
              id={business.id}
              name={business.name}
              salesAgent={business.salesAgent}
              utilizationEntries={business.utilizationEntries}
            />
          ))
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Daily Utilization Tracker
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Most recent day logged per business
        </p>
        <div className="mt-3">
          <DailyUtilizationTracker
            businesses={businesses.map((b) => ({
              id: b.id,
              name: b.name,
              latestEntry: b.utilizationEntries[0] ?? null,
            }))}
            detailBasePath="/sales/businesses"
          />
        </div>
      </div>
    </main>
  );
}
