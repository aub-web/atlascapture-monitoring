import Link from "next/link";
import {
  getBusinessesWithLatestCheckIn,
  getAllUtilizationEntries,
} from "@/lib/data";
import CheckInSummaryTable from "@/components/CheckInSummaryTable";
import SiteUtilizationOverview from "@/components/SiteUtilizationOverview";

export default async function OutboundSummaryPage() {
  const [businesses, utilizationEntries] = await Promise.all([
    getBusinessesWithLatestCheckIn(),
    getAllUtilizationEntries(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Outbound Summary
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Check-in overview and utilization across all businesses
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Check-in summary
        </h2>
        <div className="mt-3">
          <CheckInSummaryTable businesses={businesses} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Utilization overview
        </h2>
        <div className="mt-3">
          <SiteUtilizationOverview entries={utilizationEntries} />
        </div>
      </section>
    </main>
  );
}
