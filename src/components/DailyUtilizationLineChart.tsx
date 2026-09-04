"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  groupUtilization,
  type UtilizationEntryLike,
  type UtilizationPeriod,
} from "@/lib/utilization";

const PERIODS: { value: UtilizationPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function DailyUtilizationLineChart({
  outboundEntries,
  salesEntries,
}: {
  outboundEntries: UtilizationEntryLike[];
  salesEntries: UtilizationEntryLike[];
}) {
  const [period, setPeriod] = useState<UtilizationPeriod>("daily");

  const chartData = useMemo(() => {
    const outboundBuckets = groupUtilization(outboundEntries, period);
    const salesBuckets = groupUtilization(salesEntries, period);

    const rows = new Map<
      number,
      { key: number; label: string; outboundHours: number; salesHours: number }
    >();
    for (const bucket of outboundBuckets) {
      rows.set(bucket.start.getTime(), {
        key: bucket.start.getTime(),
        label: bucket.label,
        outboundHours: bucket.recordedHours,
        salesHours: 0,
      });
    }
    for (const bucket of salesBuckets) {
      const key = bucket.start.getTime();
      const existing = rows.get(key);
      if (existing) {
        existing.salesHours = bucket.recordedHours;
      } else {
        rows.set(key, {
          key,
          label: bucket.label,
          outboundHours: 0,
          salesHours: bucket.recordedHours,
        });
      }
    }
    return Array.from(rows.values()).sort((a, b) => a.key - b.key);
  }, [outboundEntries, salesEntries, period]);

  return (
    <div>
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

      <div className="mt-3 h-[320px] rounded-lg border border-zinc-200 bg-white p-4">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No utilization data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{
                  value: "Recorded Hours",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "#71717a" },
                }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="outboundHours"
                name="Outbound"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="salesHours"
                name="Sales"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
