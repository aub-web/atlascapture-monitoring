"use client";

import { useState } from "react";
import {
  groupUtilization,
  totalUtilization,
  utilizationPercent,
  type UtilizationEntryLike,
  type UtilizationPeriod,
} from "@/lib/utilization";
import UtilizationBarChart, {
  type ChartBucket,
} from "@/components/UtilizationBarChart";

const PERIODS: { value: UtilizationPeriod; label: string; window: number }[] = [
  { value: "daily", label: "Daily", window: 14 },
  { value: "weekly", label: "Weekly", window: 8 },
  { value: "monthly", label: "Monthly", window: 6 },
];

function shortLabelFor(start: Date, period: UtilizationPeriod): string {
  if (period === "monthly") {
    return new Intl.DateTimeFormat("en-US", { month: "short" }).format(start);
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(start);
}

export default function SiteUtilizationOverview({
  entries,
}: {
  entries: UtilizationEntryLike[];
}) {
  const [period, setPeriod] = useState<UtilizationPeriod>("daily");
  const config = PERIODS.find((p) => p.value === period)!;

  const buckets = groupUtilization(entries, period);
  // groupUtilization returns newest-first; chart wants chronological order.
  const windowed = buckets.slice(0, config.window).reverse();
  const totals = totalUtilization(entries);
  const overallPercent = utilizationPercent(totals.recordedHours, totals.totalHours);

  const chartBuckets: ChartBucket[] = windowed.map((bucket) => ({
    key: bucket.start.getTime().toString(),
    shortLabel: shortLabelFor(bucket.start, period),
    fullLabel: bucket.label,
    recordedHours: bucket.recordedHours,
    capacityHours: bucket.totalHours,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={
                period === p.value
                  ? "rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white"
                  : "rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
              }
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          All-time:{" "}
          <span className="font-medium text-zinc-700">
            {totals.recordedHours}h
          </span>{" "}
          recorded
          {overallPercent !== null && (
            <>
              {" "}
              · <span className="font-medium text-zinc-700">
                {overallPercent}%
              </span>{" "}
              utilized
            </>
          )}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
        <UtilizationBarChart buckets={chartBuckets} />
      </div>

      {windowed.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Period</th>
                <th className="px-4 py-2 font-medium">Recorded</th>
                <th className="px-4 py-2 font-medium">Capacity</th>
                <th className="px-4 py-2 font-medium">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {[...windowed].reverse().map((bucket) => {
                const percent = utilizationPercent(
                  bucket.recordedHours,
                  bucket.totalHours,
                );
                return (
                  <tr
                    key={bucket.start.getTime()}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-4 py-2 text-zinc-900">{bucket.label}</td>
                    <td className="px-4 py-2 text-zinc-600">
                      {bucket.recordedHours}h
                    </td>
                    <td className="px-4 py-2 text-zinc-600">
                      {bucket.totalHours}h
                    </td>
                    <td className="px-4 py-2 font-medium text-zinc-900">
                      {percent === null ? "—" : `${percent}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
