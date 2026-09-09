import Link from "next/link";
import { getBusinessesWithLatestCheckIn } from "@/lib/data";
import { MONITORING_CADENCE_DAYS, categoryLabel } from "@/lib/constants";
import { updateBusinessNotes } from "@/lib/actions/business-actions";
import CheckInSummaryTable from "@/components/CheckInSummaryTable";
import DailyUtilizationTracker from "@/components/DailyUtilizationTracker";
import BusinessStatusSection from "@/components/BusinessStatusSection";

// Always show live data — never freeze this dashboard as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function Home() {
  const businesses = await getBusinessesWithLatestCheckIn();
  const activeBusinesses = businesses.filter((b) => b.status === "ACTIVE");

  return (
    <main className="w-full flex-1 px-6 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Outbound Monitoring
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Direct business and enterprise accounts · monitoring cadence
            every {MONITORING_CADENCE_DAYS} days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/associates"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Associates
          </Link>
          <a
            href="/api/export/outbound"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Export CSV
          </a>
          <Link
            href="/businesses/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            + New Business
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <CheckInSummaryTable
          businesses={activeBusinesses}
          notesAction={updateBusinessNotes}
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
              subtitle: `${categoryLabel(b.category)} · ${b.partnerAssociate}`,
            }))}
            detailBasePath="/businesses"
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
              snapshots: b.deviceCountHistory,
            }))}
            detailBasePath="/businesses"
          />
        </div>
      </div>
    </main>
  );
}
