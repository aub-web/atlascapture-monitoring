import Link from "next/link";
import { formatDate } from "@/lib/date";
import { deviceTypeLabel } from "@/lib/constants";
import {
  utilizationHoursForEntry,
  utilizationPercent,
  actionForGap,
} from "@/lib/utilization";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import RecordingStatusBadge from "@/components/RecordingStatusBadge";

function formatDeviceCount(count: number): string {
  return count === 1 ? "1 device" : `${count} devices`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

type Entry = {
  id: string;
  date: Date;
  deviceType: string;
  deviceCount: number;
  recordedHours: number;
  remarks?: string | null;
  recordingStatus: string;
};

export default function UtilizationHistory({
  businessId,
  entries,
  deleteAction,
  editBasePath,
  isAdmin = false,
}: {
  businessId: string;
  entries: Entry[];
  deleteAction: (formData: FormData) => Promise<void>;
  editBasePath: string;
  isAdmin?: boolean;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
        No utilization entries logged yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const capacityHours = utilizationHoursForEntry(
          entry.deviceType,
          entry.deviceCount,
        );
        const percent = utilizationPercent(entry.recordedHours, capacityHours);
        const gap = round2(entry.recordedHours - capacityHours);
        const action = actionForGap(gap);
        return (
        <li
          key={entry.id}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-zinc-900">
                {formatDate(entry.date)}
              </p>
              <p className="text-sm text-zinc-500">
                {deviceTypeLabel(entry.deviceType)} ·{" "}
                {formatDeviceCount(entry.deviceCount)} ·{" "}
                {entry.recordedHours}h recorded
                {percent !== null && ` · ${percent}% utilized`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <RecordingStatusBadge status={entry.recordingStatus} />
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${action.className}`}
              >
                {action.label}
              </span>
              {isAdmin && (
                <Link
                  href={`${editBasePath}/${businessId}/utilization/${entry.id}/edit`}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                >
                  Edit
                </Link>
              )}
              <form action={deleteAction}>
                <input type="hidden" name="id" value={entry.id} />
                <input type="hidden" name="businessId" value={businessId} />
                <ConfirmSubmitButton
                  label="Delete"
                  confirmMessage="Delete this utilization entry?"
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                />
              </form>
            </div>
          </div>
          {entry.remarks && (
            <p className="mt-2 text-sm text-zinc-700">
              <span className="font-medium">Remarks: </span>
              {entry.remarks}
            </p>
          )}
        </li>
        );
      })}
    </ul>
  );
}
