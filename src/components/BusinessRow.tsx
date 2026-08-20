import Link from "next/link";
import { formatDate } from "@/lib/date";
import BusinessStatusBadge from "@/components/BusinessStatusBadge";

type CheckIn = {
  checkInDate: Date;
  recordingsCount: number;
  expectedHours: number;
  whatWentWrong: string | null;
};

export default function BusinessRow({
  id,
  name,
  partnerAssociate,
  status,
  latestCheckIn,
  checkInCount,
}: {
  id: string;
  name: string;
  partnerAssociate: string;
  status: string;
  latestCheckIn: CheckIn | null;
  checkInCount: number;
}) {
  const behindQuota =
    latestCheckIn !== null &&
    latestCheckIn.recordingsCount < latestCheckIn.expectedHours;

  return (
    <Link
      href={`/businesses/${id}`}
      className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-zinc-900">{name}</p>
          <BusinessStatusBadge status={status} />
        </div>
        <p className="text-sm text-zinc-500">{partnerAssociate}</p>
      </div>

      <div className="text-sm sm:text-right">
        {latestCheckIn ? (
          <>
            <p className="text-zinc-700">
              Last check-in {formatDate(latestCheckIn.checkInDate)}
            </p>
            <p
              className={
                behindQuota
                  ? "font-medium text-amber-600"
                  : "text-zinc-500"
              }
            >
              {latestCheckIn.recordingsCount} recorded / expected{" "}
              {latestCheckIn.expectedHours}h
              {latestCheckIn.whatWentWrong ? " · issue flagged" : ""}
            </p>
          </>
        ) : (
          <p className="text-zinc-400">No check-ins yet</p>
        )}
        {checkInCount > 0 && (
          <p className="text-xs text-zinc-400">{checkInCount} total check-ins</p>
        )}
      </div>
    </Link>
  );
}
