import Link from "next/link";
import { getBusinessesWithLatestCheckIn } from "@/lib/data";
import { BUSINESS_CATEGORIES, MONITORING_CADENCE_DAYS } from "@/lib/constants";
import BusinessRow from "@/components/BusinessRow";
import DailyUtilizationTracker from "@/components/DailyUtilizationTracker";

export default async function Home() {
  const businesses = await getBusinessesWithLatestCheckIn();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
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

      <div className="mt-8 space-y-10">
        {BUSINESS_CATEGORIES.map((category) => {
          const items = businesses.filter((b) => b.category === category.value);
          return (
            <section key={category.value}>
              <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
                {category.label}{" "}
                <span className="font-normal normal-case text-zinc-400">
                  ({items.length})
                </span>
              </h2>
              <div className="mt-3 space-y-2">
                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
                    No {category.label.toLowerCase()} accounts yet.
                  </p>
                ) : (
                  items.map((business) => (
                    <BusinessRow
                      key={business.id}
                      id={business.id}
                      name={business.name}
                      partnerAssociate={business.partnerAssociate}
                      latestCheckIn={business.checkIns[0] ?? null}
                      checkInCount={business._count.checkIns}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
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
            detailBasePath="/businesses"
          />
        </div>
      </div>
    </main>
  );
}
