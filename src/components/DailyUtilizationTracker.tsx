import Link from "next/link";
import {
  HOURS_PER_DEVICE,
  utilizationHoursForEntry,
  actionForGap,
} from "@/lib/utilization";
import { deviceTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/date";

type Entry = {
  date: Date;
  deviceType: string;
  deviceCount: number;
  recordedHours: number;
};

type Business = {
  id: string;
  name: string;
  latestEntry: Entry | null;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export default function DailyUtilizationTracker({
  businesses,
  detailBasePath,
}: {
  businesses: Business[];
  detailBasePath: string;
}) {
  if (businesses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
        No businesses yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-xs text-zinc-500">
            <th className="px-4 py-2 font-medium">Business</th>
            <th className="px-4 py-2 font-medium">Devices</th>
            <th className="px-4 py-2 font-medium">Target Hrs/Device</th>
            <th className="px-4 py-2 font-medium">Actual Hrs</th>
            <th className="px-4 py-2 font-medium">Gap</th>
            <th className="px-4 py-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => {
            const entry = business.latestEntry;
            const nameCell = (
              <td className="px-4 py-2">
                <Link
                  href={`${detailBasePath}/${business.id}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {business.name}
                </Link>
                {entry && (
                  <p className="text-xs text-zinc-400">{formatDate(entry.date)}</p>
                )}
              </td>
            );

            if (!entry) {
              return (
                <tr
                  key={business.id}
                  className="border-b border-zinc-100 last:border-0"
                >
                  {nameCell}
                  <td className="px-4 py-2 text-zinc-400" colSpan={5}>
                    No utilization logged yet
                  </td>
                </tr>
              );
            }

            const targetPerDevice = HOURS_PER_DEVICE[entry.deviceType] ?? 0;
            const capacityHours = utilizationHoursForEntry(
              entry.deviceType,
              entry.deviceCount,
            );
            const gap = round2(entry.recordedHours - capacityHours);
            const action = actionForGap(gap);

            return (
              <tr
                key={business.id}
                className="border-b border-zinc-100 last:border-0"
              >
                {nameCell}
                <td className="px-4 py-2 text-zinc-600">
                  {entry.deviceCount} ({deviceTypeLabel(entry.deviceType)})
                </td>
                <td className="px-4 py-2 text-zinc-600">{targetPerDevice}h</td>
                <td className="px-4 py-2 text-zinc-600">{entry.recordedHours}h</td>
                <td
                  className={
                    gap < 0
                      ? "px-4 py-2 font-medium text-red-600"
                      : "px-4 py-2 font-medium text-emerald-600"
                  }
                >
                  {gap >= 0 ? "+" : ""}
                  {gap}h
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${action.className}`}
                  >
                    {action.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
