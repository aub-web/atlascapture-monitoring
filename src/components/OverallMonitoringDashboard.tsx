"use client";

import { useEffect, useMemo, useState } from "react";
import type { getBusinessesWithLatestCheckIn } from "@/lib/data";
import type { getSalesBusinessesWithUtilization } from "@/lib/sales-data";
import {
  weekOverWeek,
  groupWeeklyByBusiness,
  type WeeklyEntry,
} from "@/lib/weekly-hours";
import CheckInSummaryTable from "@/components/CheckInSummaryTable";
import SalesBusinessSummaryTable from "@/components/SalesBusinessSummaryTable";
import WeekOverWeekPanel from "@/components/WeekOverWeekPanel";
import WeeklyHoursByTeamChart from "@/components/WeeklyHoursByTeamChart";
import DailyUtilizationLineChart from "@/components/DailyUtilizationLineChart";

type OutboundBusiness = Awaited<
  ReturnType<typeof getBusinessesWithLatestCheckIn>
>[number];
type SalesBusiness = Awaited<
  ReturnType<typeof getSalesBusinessesWithUtilization>
>[number];

type OutboundEntry = {
  id: string;
  businessId: string;
  date: Date;
  deviceType: string;
  deviceCount: number;
  recordedHours: number;
  business: { name: string };
};

type SalesEntry = OutboundEntry & { remarks: string | null };

function inRange(date: Date, from: string, to: string): boolean {
  const d = date.getTime();
  if (from && d < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && d > new Date(`${to}T23:59:59`).getTime()) return false;
  return true;
}

export default function OverallMonitoringDashboard({
  businesses,
  salesBusinesses,
  outboundEntries,
  salesEntries,
  allTeams,
  notesAction,
  salesNotesAction,
}: {
  businesses: OutboundBusiness[];
  salesBusinesses: SalesBusiness[];
  outboundEntries: OutboundEntry[];
  salesEntries: SalesEntry[];
  allTeams: { id: string; name: string }[];
  notesAction: (formData: FormData) => Promise<void>;
  salesNotesAction: (formData: FormData) => Promise<void>;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Navigating here from another page (e.g. a sidebar sub-link) lands with
  // the target section already in the URL hash, but Next.js doesn't always
  // scroll to it once this dynamic page's content has streamed in — do it
  // ourselves once mounted.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    el?.scrollIntoView();
  }, []);

  // Monitoring views only track active businesses — inactive ones stay
  // visible on the dedicated Business Status pages instead.
  const activeBusinesses = useMemo(
    () => businesses.filter((b) => b.status === "ACTIVE"),
    [businesses],
  );
  const activeSalesBusinesses = useMemo(
    () => salesBusinesses.filter((b) => b.status === "ACTIVE"),
    [salesBusinesses],
  );
  const activeIds = useMemo(
    () =>
      new Set([
        ...activeBusinesses.map((b) => b.id),
        ...activeSalesBusinesses.map((b) => b.id),
      ]),
    [activeBusinesses, activeSalesBusinesses],
  );
  const activeTeams = useMemo(
    () => allTeams.filter((t) => activeIds.has(t.id)),
    [allTeams, activeIds],
  );

  const filteredBusinesses = useMemo(
    () =>
      activeBusinesses.map((b) => ({
        ...b,
        checkIns: b.checkIns.filter((c) => inRange(c.checkInDate, from, to)),
      })),
    [activeBusinesses, from, to],
  );

  const filteredSalesBusinesses = useMemo(
    () =>
      activeSalesBusinesses.map((b) => ({
        ...b,
        utilizationEntries: b.utilizationEntries.filter((e) =>
          inRange(e.date, from, to),
        ),
      })),
    [activeSalesBusinesses, from, to],
  );

  const filteredOutboundEntries = useMemo(
    () =>
      outboundEntries.filter(
        (e) => activeIds.has(e.businessId) && inRange(e.date, from, to),
      ),
    [outboundEntries, activeIds, from, to],
  );

  const filteredSalesEntries = useMemo(
    () =>
      salesEntries.filter(
        (e) => activeIds.has(e.businessId) && inRange(e.date, from, to),
      ),
    [salesEntries, activeIds, from, to],
  );

  const weeklyEntries: WeeklyEntry[] = useMemo(
    () => [
      ...filteredOutboundEntries.map((e) => ({
        businessId: e.businessId,
        businessName: e.business.name,
        date: e.date,
        deviceType: e.deviceType,
        deviceCount: e.deviceCount,
        recordedHours: e.recordedHours,
      })),
      ...filteredSalesEntries.map((e) => ({
        businessId: e.businessId,
        businessName: e.business.name,
        date: e.date,
        deviceType: e.deviceType,
        deviceCount: e.deviceCount,
        recordedHours: e.recordedHours,
      })),
    ],
    [filteredOutboundEntries, filteredSalesEntries],
  );

  const weekOverWeekData = useMemo(
    () => weekOverWeek(weeklyEntries),
    [weeklyEntries],
  );
  const weeklyByBusiness = useMemo(
    () => groupWeeklyByBusiness(weeklyEntries),
    [weeklyEntries],
  );

  const hasFilter = from !== "" || to !== "";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div>
          <label htmlFor="overall-from" className="block text-xs text-zinc-500">
            From
          </label>
          <input
            id="overall-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900"
          />
        </div>
        <div>
          <label htmlFor="overall-to" className="block text-xs text-zinc-500">
            To
          </label>
          <input
            id="overall-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900"
          />
        </div>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Clear
          </button>
        )}
        <p className="text-xs text-zinc-400">
          Filters every section below by date.
        </p>
      </div>

      <section id="outbound-summary" className="mt-10 scroll-mt-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Outbound check-in summary
        </h2>
        <div className="mt-3">
          <CheckInSummaryTable
            businesses={filteredBusinesses}
            notesAction={notesAction}
          />
        </div>
      </section>

      <section id="sales-summary" className="mt-10 scroll-mt-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Sales business summary
        </h2>
        <div className="mt-3">
          <SalesBusinessSummaryTable
            businesses={filteredSalesBusinesses}
            notesAction={salesNotesAction}
          />
        </div>
      </section>

      <section id="daily-total-hours" className="mt-10 scroll-mt-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Daily total hours
        </h2>
        <div className="mt-3">
          <WeekOverWeekPanel data={weekOverWeekData} />
        </div>
      </section>

      <section id="weekly-hours-by-team" className="mt-10 scroll-mt-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Weekly hours by team (Sunday–Saturday)
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Lines = total hours per business per week. Dashed line =
          utilization (total hours ÷ number of devices) across selected
          businesses.
        </p>
        <div className="mt-3">
          <WeeklyHoursByTeamChart weeks={weeklyByBusiness} businesses={activeTeams} />
        </div>
      </section>

      <section id="utilization-trend" className="mt-10 scroll-mt-4">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Daily / weekly / monthly utilization
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Recorded hours over time, Outbound vs Sales.
        </p>
        <div className="mt-3">
          <DailyUtilizationLineChart
            outboundEntries={filteredOutboundEntries}
            salesEntries={filteredSalesEntries}
          />
        </div>
      </section>
    </div>
  );
}
