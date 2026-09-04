import {
  getBusinessesWithLatestCheckIn,
  getAllUtilizationEntriesWithBusinessName,
} from "@/lib/data";
import {
  getAllSalesUtilizationEntriesWithBusinessName,
  getSalesBusinessesWithUtilization,
} from "@/lib/sales-data";
import { updateBusinessNotes } from "@/lib/actions/business-actions";
import { updateSalesBusinessNotes } from "@/lib/actions/sales-business-actions";
import {
  weekOverWeek,
  groupWeeklyByBusiness,
  type WeeklyEntry,
} from "@/lib/weekly-hours";
import CheckInSummaryTable from "@/components/CheckInSummaryTable";
import SalesBusinessSummaryTable from "@/components/SalesBusinessSummaryTable";
import WeekOverWeekPanel from "@/components/WeekOverWeekPanel";
import WeeklyHoursByTeamChart from "@/components/WeeklyHoursByTeamChart";

// Always show live data — never freeze this dashboard as a static build-time
// snapshot.
export const dynamic = "force-dynamic";

export default async function OverallMonitoringPage() {
  const [businesses, outboundEntries, salesEntries, salesBusinesses] =
    await Promise.all([
      getBusinessesWithLatestCheckIn(),
      getAllUtilizationEntriesWithBusinessName(),
      getAllSalesUtilizationEntriesWithBusinessName(),
      getSalesBusinessesWithUtilization(),
    ]);

  const weeklyEntries: WeeklyEntry[] = [
    ...outboundEntries.map((e) => ({
      businessId: e.businessId,
      businessName: e.business.name,
      date: e.date,
      deviceType: e.deviceType,
      deviceCount: e.deviceCount,
      recordedHours: e.recordedHours,
    })),
    ...salesEntries.map((e) => ({
      businessId: e.businessId,
      businessName: e.business.name,
      date: e.date,
      deviceType: e.deviceType,
      deviceCount: e.deviceCount,
      recordedHours: e.recordedHours,
    })),
  ];

  const allTeams = [
    ...businesses.map((b) => ({ id: b.id, name: b.name })),
    ...salesBusinesses.map((b) => ({ id: b.id, name: b.name })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const weekOverWeekData = weekOverWeek(weeklyEntries);
  const weeklyByBusiness = groupWeeklyByBusiness(weeklyEntries);

  return (
    <main className="w-full flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Overall Monitoring
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Combined view across Outbound and Sales Monitoring
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Outbound check-in summary
        </h2>
        <div className="mt-3">
          <CheckInSummaryTable
            businesses={businesses}
            notesAction={updateBusinessNotes}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Sales business summary
        </h2>
        <div className="mt-3">
          <SalesBusinessSummaryTable
            businesses={salesBusinesses}
            notesAction={updateSalesBusinessNotes}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Daily total hours
        </h2>
        <div className="mt-3">
          <WeekOverWeekPanel data={weekOverWeekData} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Weekly hours by team (Sunday–Saturday)
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Lines = total hours per business per week. Dashed line = utilization
          (total hours ÷ number of devices) across selected businesses.
        </p>
        <div className="mt-3">
          <WeeklyHoursByTeamChart weeks={weeklyByBusiness} businesses={allTeams} />
        </div>
      </section>
    </main>
  );
}
