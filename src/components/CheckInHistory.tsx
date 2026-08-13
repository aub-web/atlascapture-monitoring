import { deleteCheckIn } from "@/lib/actions/checkin-actions";
import { formatDate } from "@/lib/date";
import { deviceTypeLabel } from "@/lib/constants";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

type CheckIn = {
  id: string;
  checkInDate: Date;
  recordingsCount: number;
  expectedHours: number;
  startTime: string;
  stopTime: string;
  deviceType: string;
  whatWentWrong: string | null;
  whatNeedsImprovement: string | null;
};

export default function CheckInHistory({
  businessId,
  checkIns,
}: {
  businessId: string;
  checkIns: CheckIn[];
}) {
  if (checkIns.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
        No check-ins logged yet.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {checkIns.map((checkIn) => {
        const behindQuota = checkIn.recordingsCount < checkIn.expectedHours;
        return (
          <li
            key={checkIn.id}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-zinc-900">
                  {formatDate(checkIn.checkInDate)}
                </p>
                <p
                  className={
                    behindQuota
                      ? "text-sm font-medium text-amber-600"
                      : "text-sm text-zinc-500"
                  }
                >
                  {checkIn.recordingsCount} recorded / expected{" "}
                  {checkIn.expectedHours}h · {checkIn.startTime}–
                  {checkIn.stopTime} · {deviceTypeLabel(checkIn.deviceType)}
                </p>
              </div>
              <form action={deleteCheckIn}>
                <input type="hidden" name="id" value={checkIn.id} />
                <input type="hidden" name="businessId" value={businessId} />
                <ConfirmSubmitButton
                  label="Delete"
                  confirmMessage="Delete this check-in?"
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                />
              </form>
            </div>

            {checkIn.whatWentWrong && (
              <p className="mt-2 text-sm text-zinc-700">
                <span className="font-medium">What went wrong: </span>
                {checkIn.whatWentWrong}
              </p>
            )}
            {checkIn.whatNeedsImprovement && (
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-medium">Needs improvement: </span>
                {checkIn.whatNeedsImprovement}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
