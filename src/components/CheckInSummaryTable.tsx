import Link from "next/link";
import { formatDate } from "@/lib/date";
import { categoryLabel, deviceTypeLabel } from "@/lib/constants";

type CheckIn = {
  checkInDate: Date;
  recordingsCount: number;
  expectedHours: number;
  deviceType: string;
  whatWentWrong: string | null;
};

type Business = {
  id: string;
  name: string;
  category: string;
  partnerAssociate: string;
  checkIns: CheckIn[];
};

export default function CheckInSummaryTable({
  businesses,
}: {
  businesses: Business[];
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
            <th className="px-4 py-2 font-medium">Category</th>
            <th className="px-4 py-2 font-medium">Partner Associate</th>
            <th className="px-4 py-2 font-medium">Last Check-in</th>
            <th className="px-4 py-2 font-medium">Recorded / Expected</th>
            <th className="px-4 py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => {
            const latest = business.checkIns[0] ?? null;
            const behindQuota =
              latest !== null && latest.recordingsCount < latest.expectedHours;
            return (
              <tr
                key={business.id}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-4 py-2">
                  <Link
                    href={`/businesses/${business.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {business.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-zinc-600">
                  {categoryLabel(business.category)}
                </td>
                <td className="px-4 py-2 text-zinc-600">
                  {business.partnerAssociate}
                </td>
                {latest ? (
                  <>
                    <td className="px-4 py-2 text-zinc-600">
                      {formatDate(latest.checkInDate)}
                    </td>
                    <td
                      className={
                        behindQuota
                          ? "px-4 py-2 font-medium text-amber-600"
                          : "px-4 py-2 text-zinc-600"
                      }
                    >
                      {latest.recordingsCount} recorded /{" "}
                      {latest.expectedHours}h expected ·{" "}
                      {deviceTypeLabel(latest.deviceType)}
                    </td>
                    <td className="px-4 py-2 text-zinc-500">
                      {latest.whatWentWrong ?? "—"}
                    </td>
                  </>
                ) : (
                  <td className="px-4 py-2 text-zinc-400" colSpan={3}>
                    No check-ins yet
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
