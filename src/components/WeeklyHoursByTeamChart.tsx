"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeekBucket } from "@/lib/weekly-hours";

type BusinessRef = { id: string; name: string };

function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export default function WeeklyHoursByTeamChart({
  weeks,
  businesses,
}: {
  weeks: WeekBucket[];
  businesses: BusinessRef[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(businesses.map((b) => b.id)),
  );
  const [showCombined, setShowCombined] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const chartData = useMemo(() => {
    return weeks.map((week) => {
      const row: Record<string, number | string> = { label: week.label };
      let combinedHours = 0;
      let combinedDevices = 0;
      for (const b of businesses) {
        if (!selected.has(b.id)) continue;
        const hours = week.hoursByBusiness[b.id] ?? 0;
        row[b.id] = hours;
        combinedHours += hours;
        combinedDevices += week.devicesByBusiness[b.id] ?? 0;
      }
      row.combinedHours = round1(combinedHours);
      row.utilization = combinedDevices > 0 ? round1(combinedHours / combinedDevices) : 0;
      return row;
    });
  }, [weeks, businesses, selected]);

  const selectedBusinesses = businesses.filter((b) => selected.has(b.id));

  return (
    <div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelected(new Set(businesses.map((b) => b.id)))}
            className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
          >
            Clear
          </button>
          <label className="flex items-center gap-1.5 text-xs text-zinc-600">
            <input
              type="checkbox"
              checked={showCombined}
              onChange={(e) => setShowCombined(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Add a combined total hours line (sum of selected teams)
          </label>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 md:grid-cols-4">
          {businesses.map((b) => (
            <label
              key={b.id}
              className="flex items-center gap-1.5 text-xs text-zinc-700"
            >
              <input
                type="checkbox"
                checked={selected.has(b.id)}
                onChange={() => toggle(b.id)}
                className="h-3.5 w-3.5 shrink-0"
                style={{ accentColor: colorForId(b.id) }}
              />
              <span className="truncate" title={b.name}>
                {b.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[420px] rounded-lg border border-zinc-200 bg-white p-4">
        {chartData.length === 0 || selectedBusinesses.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            {chartData.length === 0
              ? "No weekly data yet."
              : "Select at least one business to see the chart."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Total Hours",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "#71717a" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Utilization (hrs/device)",
                  angle: 90,
                  position: "insideRight",
                  style: { fontSize: 11, fill: "#71717a" },
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const label =
                    name === "utilization"
                      ? "Utilization (hrs/device)"
                      : name === "combinedHours"
                        ? "Combined total"
                        : (businesses.find((b) => b.id === name)?.name ??
                          String(name));
                  return [value ?? 0, label];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value: string) =>
                  value === "utilization"
                    ? "Utilization (hrs/device)"
                    : value === "combinedHours"
                      ? "Combined total"
                      : businesses.find((b) => b.id === value)?.name ?? value
                }
              />
              {selectedBusinesses.map((b) => (
                <Bar
                  key={b.id}
                  yAxisId="left"
                  dataKey={b.id}
                  stackId="hours"
                  fill={colorForId(b.id)}
                  name={b.id}
                />
              ))}
              {showCombined && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="combinedHours"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={false}
                  name="combinedHours"
                />
              )}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="utilization"
                stroke="#e11d48"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3 }}
                name="utilization"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
