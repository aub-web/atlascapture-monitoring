import Link from "next/link";
import { getSalesBusinessesWithUtilization } from "@/lib/sales-data";
import { effectiveDevicesForBusiness } from "@/lib/utilization";
import { updateSalesBusinessNotes } from "@/lib/actions/sales-business-actions";
import SalesBusinessSummaryTable from "@/components/SalesBusinessSummaryTable";
import DailyUtilizationTracker from "@/components/DailyUtilizationTracker";
import BusinessStatusSection from "@/components/BusinessStatusSection";

// Always show live data — never freeze this dashboard as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function SalesMonitoringHome() {
  const businesses = await getSalesBusinessesWithUtilization();
  const activeBusinesses = businesses.filter((b) => b.status === "ACTIVE");

  return (
    <main className="w-full flex-1 px-6 py-10">
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
          <Link
            href="/sales/agents"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Agents
          </Link>
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

      <div className="mt-8">
        <SalesBusinessSummaryTable
          businesses={activeBusinesses}
          notesAction={updateSalesBusinessNotes}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Business Status
        </h2>
        <div className="mt-3">
          <BusinessStatusSection
            businesses={businesses.map((b) => ({
              id: b.id,
              name: b.name,
              status: b.status,
              subtitle: b.salesAgent,
            }))}
            detailBasePath="/sales/businesses"
          />
        </div>
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
            businesses={activeBusinesses.map((b) => ({
              id: b.id,
              name: b.name,
              latestEntry: b.utilizationEntries[0] ?? null,
              effectiveDevices: effectiveDevicesForBusiness(b),
            }))}
            detailBasePath="/sales/businesses"
          />
        </div>
      </div>
    </main>
  );
}
