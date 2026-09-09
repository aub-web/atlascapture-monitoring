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
  effectiveDevicesForBusiness,
  capacityHoursForDeviceType,
  WORK_DAYS_PER_WEEK,
  type BusinessDeviceCounts,
} from "@/lib/utilization";
import { DEVICE_TYPES } from "@/lib/constants";
import OverallMonitoringDashboard from "@/components/OverallMonitoringDashboard";

// # of devices × hours/device × 6 work days = this business's fixed weekly
// target, summed across all its device types.
function weeklyTargetHours(business: BusinessDeviceCounts): number {
  const effective = effectiveDevicesForBusiness(business);
  return DEVICE_TYPES.reduce(
    (sum, type) =>
      sum + capacityHoursForDeviceType(effective, type.value) * WORK_DAYS_PER_WEEK,
    0,
  );
}

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

  const allTeams = [
    ...businesses.map((b) => ({
      id: b.id,
      name: b.name,
      weeklyTargetHours: weeklyTargetHours(b),
    })),
    ...salesBusinesses.map((b) => ({
      id: b.id,
      name: b.name,
      weeklyTargetHours: weeklyTargetHours(b),
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="w-full flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Overall Monitoring
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Combined view across Outbound and Sales Monitoring
      </p>

      <div className="mt-6">
        <OverallMonitoringDashboard
          businesses={businesses}
          salesBusinesses={salesBusinesses}
          outboundEntries={outboundEntries}
          salesEntries={salesEntries}
          allTeams={allTeams}
          notesAction={updateBusinessNotes}
          salesNotesAction={updateSalesBusinessNotes}
        />
      </div>
    </main>
  );
}
