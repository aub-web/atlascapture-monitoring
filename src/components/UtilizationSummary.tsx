"use client";

import { useState } from "react";
import {
  groupUtilization,
  totalUtilization,
  type UtilizationEntryLike,
  type UtilizationPeriod,
} from "@/lib/utilization";

const PERIODS: { value: UtilizationPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function UtilizationSummary({
  entries,
}: {
  entries: UtilizationEntryLike[];
}) {
  const [period, setPeriod] = useState<UtilizationPeriod>("daily");
  const buckets = groupUtilization(entries, period);
  const totals = totalUtilization(entries);

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
          All-time: <span className="font-medium text-zinc-700">{totals.monoHours}h</span>{" "}
          Mono ·{" "}
          <span className="font-medium text-zinc-700">
            {totals.multicamHours}h
          </span>{" "}
          Multicam ·{" "}
          <span className="font-medium text-zinc-700">{totals.totalHours}h</span>{" "}
          total
        </p>
      </div>

      {buckets.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
          No utilization data yet.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Period</th>
                <th className="px-4 py-2 font-medium">Mono</th>
                <th className="px-4 py-2 font-medium">Multicam</th>
                <th className="px-4 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket) => (
                <tr
                  key={bucket.start.getTime()}
                  className="border-b border-zinc-100 last:border-0"
                >
                  <td className="px-4 py-2 text-zinc-900">{bucket.label}</td>
                  <td className="px-4 py-2 text-zinc-600">
                    {bucket.monoHours}h
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {bucket.multicamHours}h
                  </td>
                  <td className="px-4 py-2 font-medium text-zinc-900">
                    {bucket.totalHours}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
