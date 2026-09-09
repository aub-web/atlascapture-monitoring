"use client";

import { useState } from "react";
import {
  groupUtilization,
  totalUtilization,
  utilizationPercent,
  type DeviceSnapshot,
  type UtilizationEntryLike,
  type UtilizationPeriod,
} from "@/lib/utilization";
import { DEVICE_TYPES } from "@/lib/constants";

const PERIODS: { value: UtilizationPeriod; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function DeviceTypePanel({
  label,
  entries,
  period,
  snapshots,
}: {
  label: string;
  entries: UtilizationEntryLike[];
  period: UtilizationPeriod;
  snapshots: DeviceSnapshot[];
}) {
  const buckets = groupUtilization(entries, period, snapshots);
  const totals = totalUtilization(entries, snapshots);
  const allTimePercent = utilizationPercent(totals.recordedHours, totals.totalHours);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          {label}
        </h3>
        <p className="text-xs text-zinc-500">
          All-time:{" "}
          <span className="font-medium text-zinc-700">
            {totals.recordedHours}h
          </span>{" "}
          recorded
          {allTimePercent !== null && (
            <>
              {" "}
              · <span className="font-medium text-zinc-700">{allTimePercent}%</span>{" "}
              utilized
            </>
          )}
        </p>
      </div>

      {buckets.length === 0 ? (
        <p className="mt-2 rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
          No {label.toLowerCase()} utilization data yet.
        </p>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Period</th>
                <th className="px-4 py-2 font-medium">Recorded</th>
                <th className="px-4 py-2 font-medium">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket) => {
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

export default function UtilizationSummary({
  entries,
  snapshots,
}: {
  entries: UtilizationEntryLike[];
  snapshots: DeviceSnapshot[];
}) {
  const [period, setPeriod] = useState<UtilizationPeriod>("weekly");

  return (
    <div className="space-y-6">
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

      {DEVICE_TYPES.map((deviceType) => (
        <DeviceTypePanel
          key={deviceType.value}
          label={deviceType.label}
          entries={entries.filter((e) => e.deviceType === deviceType.value)}
          period={period}
          snapshots={snapshots}
        />
      ))}
    </div>
  );
}
