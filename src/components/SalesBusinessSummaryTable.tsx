"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import {
  totalUtilization,
  utilizationPercent,
  effectiveDevicesForBusiness,
  type UtilizationEntryLike,
} from "@/lib/utilization";
import BusinessStatusBadge from "@/components/BusinessStatusBadge";
import InlineEditField from "@/components/InlineEditField";

type Business = {
  id: string;
  name: string;
  salesAgent: string;
  status: string;
  qcFeedback: string | null;
  remarks: string | null;
  issuedMonoCount: number;
  issuedMulticamCount: number;
  issuedMonoInsta360Count: number;
  defectiveMonoCount: number;
  defectiveMulticamCount: number;
  defectiveMonoInsta360Count: number;
  utilizationEntries: UtilizationEntryLike[];
};

export default function SalesBusinessSummaryTable({
  businesses,
  notesAction,
}: {
  businesses: Business[];
  notesAction: (formData: FormData) => Promise<void>;
}) {
  const [agent, setAgent] = useState("");

  const agents = useMemo(
    () => Array.from(new Set(businesses.map((b) => b.salesAgent))).sort(),
    [businesses],
  );
  const filtered = agent
    ? businesses.filter((b) => b.salesAgent === agent)
    : businesses;

  if (businesses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
        No businesses yet.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <label htmlFor="agent-filter" className="text-sm text-zinc-500">
          Sales Agent
        </label>
        <select
          id="agent-filter"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900"
        >
          <option value="">All</option>
          {agents.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
          No businesses match this filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Business</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Sales Agent</th>
                <th className="px-4 py-2 font-medium">Last Logged</th>
                <th className="px-4 py-2 font-medium">Recorded / Utilized</th>
                <th className="px-4 py-2 font-medium">QC Feedback</th>
                <th className="px-4 py-2 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((business) => {
                const latest = business.utilizationEntries[0] ?? null;
                const totals = totalUtilization(
                  business.utilizationEntries,
                  effectiveDevicesForBusiness(business),
                );
                const percent = utilizationPercent(
                  totals.recordedHours,
                  totals.totalHours,
                );
                return (
                  <tr
                    key={business.id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-4 py-2">
                      <Link
                        href={`/sales/businesses/${business.id}`}
                        className="font-medium text-zinc-900 hover:underline"
                      >
                        {business.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <BusinessStatusBadge status={business.status} />
                    </td>
                    <td className="px-4 py-2 text-zinc-600">
                      {business.salesAgent}
                    </td>
                    {latest ? (
                      <>
                        <td className="px-4 py-2 text-zinc-600">
                          {formatDate(latest.date)}
                        </td>
                        <td className="px-4 py-2 text-zinc-600">
                          {totals.recordedHours}h recorded
                          {percent !== null && ` · ${percent}% utilized`}
                        </td>
                      </>
                    ) : (
                      <td className="px-4 py-2 text-zinc-400" colSpan={2}>
                        No utilization logged yet
                      </td>
                    )}
                    <td className="px-2 py-1">
                      <InlineEditField
                        action={notesAction}
                        id={business.id}
                        field="qcFeedback"
                        value={business.qcFeedback}
                        placeholder="Add QC feedback…"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <InlineEditField
                        action={notesAction}
                        id={business.id}
                        field="remarks"
                        value={business.remarks}
                        placeholder="Add remarks…"
                      />
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
