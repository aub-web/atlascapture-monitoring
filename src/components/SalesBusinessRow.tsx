import Link from "next/link";
import {
  totalUtilization,
  utilizationPercent,
  type UtilizationEntryLike,
} from "@/lib/utilization";

export default function SalesBusinessRow({
  id,
  name,
  salesAgent,
  utilizationEntries,
}: {
  id: string;
  name: string;
  salesAgent: string;
  utilizationEntries: UtilizationEntryLike[];
}) {
  const totals = totalUtilization(utilizationEntries);
  const percent = utilizationPercent(totals.recordedHours, totals.totalHours);

  return (
    <Link
      href={`/sales/businesses/${id}`}
      className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-medium text-zinc-900">{name}</p>
        <p className="text-sm text-zinc-500">{salesAgent}</p>
      </div>

      <div className="text-sm sm:text-right">
        {utilizationEntries.length === 0 ? (
          <p className="text-zinc-400">No utilization logged yet</p>
        ) : (
          <p className="text-zinc-700">
            {totals.recordedHours}h recorded
            {percent !== null && (
              <>
                {" "}
                · <span className="font-medium">{percent}% utilized</span>
              </>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
