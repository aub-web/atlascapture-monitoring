import {
  getBusinessesWithLatestCheckIn,
  getAllUtilizationEntries,
} from "@/lib/data";
import {
  getAllSalesUtilizationEntries,
  getSalesBusinessesWithUtilization,
} from "@/lib/sales-data";
import { categoryLabel } from "@/lib/constants";
import CheckInSummaryTable from "@/components/CheckInSummaryTable";
import SiteUtilizationOverview from "@/components/SiteUtilizationOverview";
import BusinessStatusSection from "@/components/BusinessStatusSection";

// Always show live data — never freeze this dashboard as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function OverallMonitoringPage() {
  const [businesses, outboundEntries, salesEntries, salesBusinesses] =
    await Promise.all([
      getBusinessesWithLatestCheckIn(),
      getAllUtilizationEntries(),
      getAllSalesUtilizationEntries(),
      getSalesBusinessesWithUtilization(),
    ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Overall Monitoring
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Combined view across Outbound and Sales Monitoring
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Outbound business status
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
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Sales business status
        </h2>
        <div className="mt-3">
          <BusinessStatusSection
            businesses={salesBusinesses.map((b) => ({
              id: b.id,
              name: b.name,
              status: b.status,
              subtitle: b.salesAgent,
            }))}
            detailBasePath="/sales/businesses"
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Outbound check-in summary
        </h2>
        <div className="mt-3">
          <CheckInSummaryTable businesses={businesses} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Outbound utilization
        </h2>
        <div className="mt-3">
          <SiteUtilizationOverview entries={outboundEntries} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Sales utilization
        </h2>
        <div className="mt-3">
          <SiteUtilizationOverview entries={salesEntries} />
        </div>
      </section>
    </main>
  );
}
