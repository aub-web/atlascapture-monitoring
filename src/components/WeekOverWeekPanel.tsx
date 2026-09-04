import type { WeekOverWeek, WeekOverWeekStat } from "@/lib/weekly-hours";
import { deviceTypeLabel } from "@/lib/constants";

function ChangeBadge({
  changePercent,
  isNew,
}: Pick<WeekOverWeekStat, "changePercent" | "isNew">) {
  if (isNew) {
    return <span className="text-xs font-medium text-emerald-600">▲ new</span>;
  }
  if (changePercent === null) {
    return null;
  }
  if (changePercent > 0) {
    return (
      <span className="text-xs font-medium text-emerald-600">
        ▲ +{changePercent}%
      </span>
    );
  }
  if (changePercent < 0) {
    return (
      <span className="text-xs font-medium text-red-600">
        ▼ {changePercent}%
      </span>
    );
  }
  return <span className="text-xs font-medium text-zinc-400">0%</span>;
}

function StatRow({ stat }: { stat: WeekOverWeekStat }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <p className="truncate pr-2 text-sm text-zinc-700" title={stat.label}>
        {stat.label}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <p className="text-sm font-medium text-zinc-900">{stat.current}</p>
        <ChangeBadge {...stat} />
      </div>
    </div>
  );
}

export default function WeekOverWeekPanel({
  data,
}: {
  data: WeekOverWeek | null;
}) {
  if (!data) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-400">No utilization data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-zinc-900">
        Week vs Week (based on Date range end)
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        Comparing {data.currentRangeLabel} to {data.previousRangeLabel}.
      </p>

      <p className="mt-4 text-3xl font-semibold text-zinc-900">
        {data.currentTotal} hrs
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        vs {data.previousTotal} hrs previous week{" "}
        <ChangeBadge changePercent={data.changePercent} isNew={data.isNew} />
      </p>

      {data.byDeviceType.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            By Device Type
          </h4>
          <div className="mt-1 divide-y divide-zinc-100">
            {data.byDeviceType.map((stat) => (
              <StatRow
                key={stat.label}
                stat={{ ...stat, label: deviceTypeLabel(stat.label) }}
              />
            ))}
          </div>
        </div>
      )}

      {data.byBusiness.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            By Business
          </h4>
          <div className="mt-1 divide-y divide-zinc-100">
            {data.byBusiness.map((stat) => (
              <StatRow key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
